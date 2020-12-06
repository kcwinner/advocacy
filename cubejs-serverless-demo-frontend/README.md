# Cubejs Serverless Demo Frontend

## Template / Guide

https://react-dashboard.cube.dev/overview-and-analytics-api

## Setup

## Bin

The bin contains some scripts I've written to be super helpful when working with AWS AppSync. This includes generating the `aws-exports.js` and the graphql queries, mutations, subscriptions and types.

You will need to have deployed the [cubejs-serverless-demo](https://github.com/kcwinner/advocacy/tree/master/cubejs-serverless-demo) and have the schema available/built.

### Generate Types / Statements From Schema

```bash
yarn generate-gql
```

### Generate Amplify Exports

```bash
yarn generate-exports
```

### Generate Token

You will need to create an API key from the [cubejs-serverless-demo](https://github.com/kcwinner/advocacy/tree/master/cubejs-serverless-demo) project. Then put it in the [App.tsx](src/App.tsx)

### Projen

```bash
yarn projen
```

## Run

```bash
yarn start
```

## Bugs / Limitations

* I'm experimenting with [useQuery with Amplify](https://github.com/aws-amplify/amplify-js/issues/4235#issuecomment-725303439) and my current setup seems to be causing a few too many re-renders. Might be better using apollo or something instead.

# References

* [Cubejs Dashboard](https://react-dashboard.cube.dev/overview-and-analytics-api)
* [cubejs-serverless-demo](https://github.com/kcwinner/advocacy/tree/master/cubejs-serverless-demo)
* [useQuery with Amplify](https://github.com/aws-amplify/amplify-js/issues/4235#issuecomment-725303439)
* [projen](https://github.com/projen/projen)