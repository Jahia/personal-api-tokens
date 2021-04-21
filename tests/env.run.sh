#!/bin/bash
# This script can be used to warmup the environment and execute the tests
# It is used by the docker image at startup

if [[ ! -f .env ]]; then
 cp .env.example .env
fi

#!/usr/bin/env bash
START_TIME=$SECONDS

echo "$(date +'%d %B %Y - %k:%M') == Using MANIFEST: ${MANIFEST}"
echo "$(date +'%d %B %Y - %k:%M') == Using JAHIA_URL= ${JAHIA_URL}"

echo "$(date +'%d %B %Y - %k:%M') == Waiting for Jahia to startup"
./node_modules/jahia-reporter/bin/run utils:alive --jahiaUrl=${JAHIA_URL}
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "$(date +'%d %B %Y - %k:%M') == Jahia became alive in ${ELAPSED_TIME} seconds"

# Add the credentials to a temporary manifest for downloading files
mkdir /tmp/run-artifacts
# Execute jobs listed in the manifest
# If the file doesn't exist, we assume it is a URL and we download it locally
if [[ -e ${MANIFEST} ]]; then
  cp ${MANIFEST} /tmp/run-artifacts
else
  echo "Downloading: ${MANIFEST}"
  curl ${MANIFEST} --output /tmp/run-artifacts/curl-manifest
  MANIFEST="curl-manifest"
fi
sed -i -e "s/NEXUS_USERNAME/${NEXUS_USERNAME}/g" /tmp/run-artifacts/${MANIFEST}
sed -i -e "s/NEXUS_PASSWORD/${NEXUS_PASSWORD}/g" /tmp/run-artifacts/${MANIFEST}

# If we're building the module (and manifest name contains build), then start with submitting that module
if [[ ${MANIFEST} == *"build"* ]]; then
  echo "$(date +'%d %B %Y - %k:%M') == Submitting Sandbox module from: /tmp/artifacts/personal-api-tokens-SNAPSHOT.jar =="
  ./node_modules/jahia-reporter/bin/run utils:module --jahiaUrl=${JAHIA_URL} --jahiaPassword=${SUPER_USER_PASSWORD} --moduleId=personal-api-tokens --moduleFile=/tmp/artifacts/personal-api-tokens-SNAPSHOT.jar
  echo "$(date +'%d %B %Y - %k:%M') == Module submitted =="
fi

# TO be removed
sleep 45

echo "$(date +'%d %B %Y - %k:%M') == Warming up the environement =="
curl -v --fail -u root:${SUPER_USER_PASSWORD} -X POST ${JAHIA_URL}/modules/api/provisioning --form script="@warmup-manifest-build.yaml;type=text/yaml" --form file="@assets/createToken.groovy"
if [[ $? -ne 0 ]]; then
  echo "PROVISIONING FAILURE - EXITING SCRIPT, NOT RUNNING THE TESTS"
  echo "failure" > /tmp/results/test_failure
  exit 1
fi
echo "$(date +'%d %B %Y - %k:%M') == Environment warmup complete =="

mkdir /tmp/results/reports

# TO be removed
sleep 45

echo "$(date +'%d %B %Y - %k:%M') == Run tests =="
CYPRESS_baseUrl=${JAHIA_URL} yarn e2e:ci
if [[ $? -eq 0 ]]; then
  echo "success" > /tmp/results/test_success
  exit 0
else
  echo "failure" > /tmp/results/test_failure
  exit 1
fi
# After the test ran, we're dropping a marker file to indicate if the test failed or succeeded based on the script test command exit code