# AWS CDK to Amplify & Appsync Helpers

I love AWS Amplify, however, I love using the CDK for managing my resources more! 

[Here](https://www.trek10.com/blog/appsync-with-the-aws-cloud-development-kit) is a blog post on some of how I set everything up

## Generate DataStore Models

When using DataStore without Amplify the `amplify codegen models` utility doesn't work due to being unable to find the api without some slight modifications to the Amplify config. 

This utility uses the [amplify-codegen-appsync-model-plugin](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-codegen-appsync-model-plugin) to generate proper Amplify DataStore models from a schema. 

## Generate Exports

This assumes you have outputs from the CDK for the values you need. Grabs those from your cloudformation stack and creates and `aws-exports.js` file in your `src/` directory

## Generate Statements

Uses [amplify-graphql-docs-generator](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-graphql-docs-generator) to generate GraphQL queries, mutations, & subscriptions into typescript

## Generate Types

Uses [graphql-codegen-core](https://github.com/dotansimha/graphql-code-generator/tree/master/packages/graphql-codegen-core) and the typescript plugin to generate typescript types for the application if you are not using the DataStore