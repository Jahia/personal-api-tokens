<!--
    Template for Readmes, see alternatives/examples here: https://github.com/matiassingers/awesome-readme
-->

<!--
    Badges provides a quick glance at the state of the repository and pointers to external resources.
    More can be generated from here: https://shields.io/
-->

|  |  | 
| --- | --- |
| Module | ![ID](https://img.shields.io/badge/ID-personal--api--tokens-blue) [![Store](https://img.shields.io/badge/Jahia%20Store-Pending_release-brightgreen)](https://store.jahia.com/contents/modules-repository/org/jahia/modules/augmented-search-ui.html) |
| Tests | [![Case Management](https://img.shields.io/badge/Case%20Management-Testrail-blue)](https://jahia.testrail.net/index.php?/projects/overview/20) |
| CI / CD | [![CircleCI](https://circleci.com/gh/Jahia/augmented-search-ui/tree/master.svg?style=shield)](https://app.circleci.com/pipelines/github/Jahia/augmented-search) ![Unit Tests](https://img.shields.io/badge/Unit%20Tests-Yes-green) ![Integration Tests](https://img.shields.io/badge/Integration%20Tests-Yes-green) ![Build Snapshot](https://img.shields.io/badge/Build%20Snapshot-Yes-brightgreen) ![Build Release](https://img.shields.io/badge/Build%20Release-No-red) |
| Artifacts | [![Snapshot](https://img.shields.io/badge/Snapshot-Nexus-blue)](https://devtools.jahia.com/nexus/service/local/repositories/jahia-snapshots/content/org/jahia/modules/personal-api-tokens/) [![Release](https://img.shields.io/badge/Release-Nexus-blue)](https://devtools.jahia.com/nexus/service/local/repositories/jahia-releases/content/org/jahia/modules/personal-api-tokens/) |
| Slack | [![Discussion](https://img.shields.io/badge/Discussion-%23personal--api--tokens-blue)](https://jahia.slack.com/archives/G01DQ0Z6UCE) [![Notifications](https://img.shields.io/badge/Notifications-%23team--product--qa--notifications-blue)](https://jahia.slack.com/archives/C01E9RUP4TT)|

<a href="https://www.jahia.com/">
    <img src="https://www.jahia.com/modules/jahiacom-templates/images/jahia-3x.png" alt="Jahia logo" title="Jahia" align="right" height="60" />
</a>

<!--
    Project name can either be the full length project name (if there is one) or just the repo name. For example: Digital Experience Manager.
-->

Personal API Tokens
======================

<!--
    A one-liner about the project, like a subtitle. For example: Jahia Digital Experience Manager Core
-->
<p align="center">A module to create, manage and use personal tokens when interacting with Jahia API</p>


<!--
    Open Source badges, see https://shields.io/
-->

## Table of content

- [Presentation](#presentation)
- [Dev Environment](#dev-environment)
- [Build](#build)
- [Installation](#installation)
- [Usage](#usage)
- [Links](#links)

<!--
    Not all sections are relevant for all projects. It's up to the team to decide what sections makes most sense. Objective of the readme is to serve as a technical introduction to facilitate onboarding for technical ppl (developers).
    License and contributions are detailed in their own files, no need to add too many details in the Readme.
    If the project has technical documentation stored in another location (such as a website), effort should be made not to duplicate content (since it will become outdated at some point). In that case, keep the readme instructions very brief (such as a set of CLI commands).
-->

## Presentation
<!-- 
    (Optional) Technical presentation of the project
-->

## Dev environment

<!-- 
    Instructions to help a new developer get its environment setup and understands contraints and dependencies and run tests
-->

## Build
<!-- 
    Instructions to build
-->
Use `mvn install` to build the module.

## Installation

### Module

Deploy the module in your Jahia instance.

## Usage

### Token generation

After building the project, you can generate a new random token by calling : 

```
java -jar target/personal-api-tokens-1.0.0-SNAPSHOT-cli.jar
```

You can also get the token key of an existing token by typing : 

```
java -jar target/personal-api-tokens-1.0.0-SNAPSHOT-cli.jar --get-key hHSppWmiQgmZ6KrUDR/w8VbEbsi/m08OlMiviLhIUfM=
```

### GraphQL API

The module provides a Graphql API extension, that will allow to manipulate tokens. You will find all fields
related to personal API token and their documentation in query/admin/personalApiTokens

For example it's possible to create a token by calling :
```
mutation {
  admin {
    personalApiTokens {
      createToken(userId:"root", name:"my token", expireAt:"2020-12-12")
    }
  }
}
```

And to get its data with :
```
query {
  admin {
    personalApiTokens {
     token(token:"aJC9l44cSKGv4Xvb0Qc8o/V1Say1s77k0Q046/VIwo8=") {
       key
       name
       user {
         name
       }
     }
    }
  }
}

## E2E tests

End-to-End tests are located in the test folder, you can take the following approaches to execute the test suite:

### Towards an existing Jahia

You can run the test suite towards an existing and pre-configured Jahia instance by running the following:

```bash 
cd tests/
yarn
CYPRESS_baseUrl=http://localhost:8080 JAHIA_USERNAME=root JAHIA_PASSWORD=root yarn e2e:debug
```

This will open-up Cypress in dev mode, allowing you to select which tests to run. As you modify test files, the tests are automatically re-executed for the selected suite. 

### Using Docker

You can use Docker and docker-compose to simply run the entire test suite.

#### Environment Variables

The following environment variables are available for executing the tests using docker.

| Variable | Description |
| --- | --- |
| MANIFEST | Manifest file detailing how the environment should be provisioned from a fresh Jahia image. The TESTS_IMAGE ship by default with a set of manifest covering various use cases (built module, snapshot module from nexus, built module from the store, ...) |
| TESTS_IMAGE | Test image to run (for example: jahia/personal-api-tokens:1.0.0), Test images are releases alongside module releases and contain the release artifacts. It is useful if you want to test a particular module version with a specific Jahia version|
| JAHIA_IMAGE | Docker image of Jahia to be started (for example: jahia/jahia-dev:8.0.1.0)|
| JAHIA_HOST | Host running the Jahia server (usually localhost)|
| JAHIA_PORT | Port for the Jahia server (usually 8080)|
| JAHIA_CONTEXT | If the context is to be used|
| JAHIA_USERNAME | Username to log into Jahia|
| JAHIA_PASSWORD | Password to log into Jahia|
| NEXUS_USERNAME | Username to connect to Nexus (if you were to fetch a snapshot module)|
| NEXUS_PASSWORD | Password to connect to Nexus (if you were to fetch a snapshot module)|

#### Re-run an existing suite (not building images)

You might be interested in running the latest snapshot of Jahia, with the latest snapshot of the module (or any combination).

```bash
cd tests
mv .env.example .env
# Edit the environment variables based on desired test configuration
docker-compose up
```

From that point Jahia and the test container will start, the test container will wait for Jahia to become live, install the desired module, and run the tests

#### Build a new tests image 

If you modified the codebase (tests or module) you might want to build a new test image (it could be just a local test image).

```bash
# If you first want to build the module, the docker build step will add the corresponding artifacts to the docker image
mvn clean install 
# To run the module in build mode, you need to install graphql-dxm-provider
mvn dependency:copy-dependencies 
# To copy the dependency for installation by jahia-cli
cp target/dependency/graphql-dxm-provider-2.2.2-SNAPSHOT.jar tests/artifacts/graphql-dxm-provider.jar 
cd tests
bash env.build.sh
```

Note that by default the new image name is `jahia/personal-api-tokens:latest` so it will take over any `latest` that you might already have locally.
If necessary, you could either change that in `env.build.sh` to your desired name or simply give your image a new tag `docker tag jahia/personal-api-tokens:latest jahia/personal-api-tokens:MY_NEW_TAG`

Once built, the image can be used with docker-compose (see previous section).

## Links
<!-- 
    Relevant links
-->
 
