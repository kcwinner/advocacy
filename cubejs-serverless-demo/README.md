# Cube.js Serverless Demo

* All commands assume you have proper AWS IAM credentials
* This uses an *EXPERIMENTAL* [DynamoDB cache/queue driver](https://github.com/cube-js/cube.js/pull/1496) for cubejs. It is a work in progress
  * You can turn this off by swapping the environment variables for the Lambda functions
  * There will be bugs :)
* Uses the [aws-cdk](https://github.com/aws/aws-cdk) for deployments
* Uses my [cdk-appsync-transformer](https://github.com/kcwinner/cdk-appsync-transformer) construct to generate the AppSync schema and tables
* Uses [projen](https://github.com/projen/projen) for project management

## Setup

```bash
yarn projen
```

## Build

```bash
yarn run build:cube
```

### Build The DynamoDB Driver

* TODO

### Setup Lambda Store (optional)

If you do not want to build and test the experimental DynamoDB cache/queue driver you will have to setup
https://docs.lambda.store/docs/overall/getstarted

## Deploy

```bash
yarn run deploy
```

## Setup Database

Uses [knex](https://github.com/knex/knex)

### Data Source

I used the data from the [Open Source Dashboard Guide](https://cube.dev/blog/cubejs-open-source-dashboard-framework-ultimate-guide/) and modified it in order to use [knex](https://github.com/knex/knex).

### Migrate And Seed

You can grab your database secret and cluster ARNs from the outputs of deploy.

```bash
export DB_SECRET_ARN="<YOUR_SECRET_ARN_HERE>"
export DB_CLUSTER_ARN="<YOUR_CLUSTER_ARN_HERE>"
yarn run migrate:up
yarn run seed
```

## Run Locally

Setup and move your .env_example file to `cubejs-lambda/.env`

```bash
yarn run dev
```

## Generate Client Tokens

For more information visit the [security](https://cube.dev/docs/security) section of the Cube.js docs. For demo purposes I use a simple string instead of a secret value.

```bash
yarn generate-token
```

## Create User

Go to [createUser.js](bin/createUser.js) and modify your email. Then run:
```bash
yarn create-user
```

## References

* [Cube.js serverless](https://cube.dev/docs/deployment#serverless)
* [cube react-dashboard example](https://github.com/cube-js/cube.js/tree/master/examples/react-dashboard)
* [cube schema](https://github.com/cube-js/cube.js/tree/master/examples/react-dashboard/schema)
* [cdk-appsync-transformer](https://github.com/kcwinner/cdk-appsync-transformer)
* [Lambda Store](https://docs.lambda.store/docs/overall/getstarted)