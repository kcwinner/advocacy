import { App } from '@aws-cdk/core';
import { CubeJsStack } from './lib/cubejs-stack';

const REGION = process.env.REGION || 'us-east-2'; // default region we are using

const app = new App();

new CubeJsStack(app, 'cubejs-serverless-demo', {
  terminationProtection: true,
  description: 'Cube.js Serverless Demo',
  env: {
    region: REGION,
  },
});

app.synth();