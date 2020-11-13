const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorEmail: 'kcswinner@gmail.com',
  authorName: 'Ken Winner',
  name: "cubejs-test",

  typescriptVersion: '^4.0.3',
  cdkVersion: "1.73.0",
  cdkVersionPinning: true,
  cdkDependencies: [
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-rds'
  ],
  deps: [
    '@cubejs-backend/api-gateway',
    '@cubejs-backend/server',
    '@cubejs-backend/serverless',
    '@cubejs-backend/serverless-aws',
    'knex'
  ],
  scripts: {
    dev: './node_modules/.bin/cubejs-dev-server'
  },

  gitignore: [
    '.env',
    '.env-dev',
    '.env-prod'
  ],

  // Disable GitHub Stuff
  buildWorkflow: false,
  releaseWorkflow: false,
  dependabot: false,
  pullRequestTemplate: false,
  mergify: false,
});

project.synth();
