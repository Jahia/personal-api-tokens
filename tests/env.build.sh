#!/bin/bash
# This script can be used to manually build the docker images necessary to run the tests
# It should be executed from the tests folder

# It assumes that you previously built the module you're going to be testing
#   and that the modules artifacts are located one level up

if [ ! -d ./artifacts ]; then
  mkdir -p ./artifacts
fi

if [[ -e ../target ]]; then
    cp -R ../target/* ./artifacts/
    cp ./artifacts/*SNAPSHOT.jar ./artifacts/personal-api-tokens.jar
fi

if [ ! -d ./build-dependencies ]; then
  mkdir -p ./build-dependencies
fi

if [[ -e ../build-dependencies ]]; then
    cp -R ../build-dependencies/* ./build-dependencies/
    cp ./artifacts/dependency/graphql-dxm-provider-*-SNAPSHOT.jar ./artifacts/graphql-dxm-provider.jar
fi

docker build -t jahia/personal-api-tokens:latest .