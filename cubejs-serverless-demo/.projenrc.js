const { AwsCdkTypeScriptApp, NodePackageManager } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorEmail: 'kcswinner@gmail.com',
  authorName: 'Ken Winner',
  name: "cubejs-demo",
  packageManager: NodePackageManager.NPM,

  typescriptVersion: '^4.1.2',
  cdkVersion: "1.80.0",
  cdkVersionPinning: true,
  cdkDependencies: [
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
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
    'cdk-appsync-transformer@^1.77.0'
  ],
  devDeps: [
    'aws-sdk',
    'data-api-client',
    'jsonwebtoken',
    'knex',
    'esbuild',
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
  'create-user': 'node bin/createUser.js',
  dev: './cubejs-lambda/node_modules/.bin/cubejs-dev-server',
  'generate-token': 'node bin/generateToken.js',
  'migrate:up': 'knex migrate:up --env demo',
  seed: 'knex seed:run --env demo'
})

project.synth();
