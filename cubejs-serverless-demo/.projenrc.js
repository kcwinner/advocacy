const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorEmail: 'kcswinner@gmail.com',
  authorName: 'Ken Winner',
  name: "cubejs-demo",

  typescriptVersion: '^4.1.2',
  cdkVersion: "1.70.0",
  cdkVersionPinning: true,
  cdkDependencies: [
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-event-sources',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-rds',
    '@aws-cdk/aws-sns'
  ],
  deps: [
    'cdk-appsync-transformer@1.70.1'
  ],
  devDeps: [
    'aws-sdk',
    'data-api-client',
    'jsonwebtoken',
    'knex',
    'parcel@2.0.0-beta.1',
  ],

  gitignore: [
    '.env',
    'appsync/*',
    'cdk.context.json'
  ],

  // Disable GitHub Stuff
  buildWorkflow: false,
  releaseWorkflow: false,
  dependabot: false,
  pullRequestTemplate: false,
  mergify: false,
});

project.addScripts({
  'build:cube': 'cd cubejs-lambda && npm install && cd ..',
  dev: './cubejs-lambda/node_modules/.bin/cubejs-dev-server',
  'migrate:up': 'knex migrate:up --env demo',
  'seed': 'knex seed:run --env demo'
})

project.synth();
