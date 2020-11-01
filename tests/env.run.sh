#!/bin/bash
# This script can be used to warmup the environment and execute the tests
# It is used by the docker image at startup

if [[ ! -f .env ]]; then
 cp .env.example .env
fi

#!/usr/bin/env bash
START_TIME=$SECONDS

if [ -z "${JAHIA_CONTEXT}" ];
then
  JAHIA_URL=http://${JAHIA_HOST}:${JAHIA_PORT}
else
  JAHIA_URL=http://${JAHIA_HOST}:${JAHIA_PORT}/${JAHIA_CONTEXT}
fi

echo " == Using MANIFEST: ${MANIFEST}"
echo " == Using JAHIA_URL= ${JAHIA_URL}"

echo " == Waiting for Jahia to startup"
jahia-cli alive --jahiaAdminUrl=${JAHIA_URL}
ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo " == Jahia became alive in ${ELAPSED_TIME} seconds"

# Add the credentials to a temporary manifest for downloading files
mkdir /tmp/run-artifacts
cp ${MANIFEST} /tmp/run-artifacts
sed -i -e "s/NEXUS_USERNAME/${NEXUS_USERNAME}/g" /tmp/run-artifacts/${MANIFEST}
sed -i -e "s/NEXUS_PASSWORD/${NEXUS_PASSWORD}/g" /tmp/run-artifacts/${MANIFEST}

echo " == Warming up the environement =="

jahia-cli manifest:run --manifest=/tmp/run-artifacts/${MANIFEST} --jahiaAdminUrl=${JAHIA_URL}

echo " == Environment warmup complete =="

echo "== Run tests =="
yarn e2e:ci