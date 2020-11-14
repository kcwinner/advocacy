# External Project Project to AWS CodeArtifact

## Projen Composite Project

This example is created from a [projen](https://github.com/projen/projen) composite project including a `jsii` project for the custom project type and an `awscdk-app-ts` project for the pipeline/codeartifact creation.

## Buildspec Example
```yaml
version: 0.2
phases:
  pre_build:
    commands:
      # Namespace should look something like @mycompany e.g. @voxiinc
      - aws codeartifact login --tool npm --namespace @company --repository my-artifact-repository --domain my-artifact-domain --domain-owner ${ACCOUNT_ID}
  build:
    commands:
      # We don't have access to git here without doing extra stuff so skip the antitamper for the example
      - yarn install --frozen-lockfile
      - yarn projen
      - cd demo-project
      - yarn run build
  post_build:
    commands:
      - cd demo-project
      - export NPM_TOKEN=`aws codeartifact get-authorization-token --domain my-artifact-domain --domain-owner ${ACCOUNT_ID} --query authorizationToken --output text`
      - export NPM_DIST_TAG="latest"
      - export NPM_REGISTRY="my-artifact-domain-${ACCOUNT_ID}.d.codeartifact.us-east-2.amazonaws.com/npm/my-artifact-repository"
      - npx -p jsii-release jsii-release-npm
```
