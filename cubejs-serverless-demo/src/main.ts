import { App } from '@aws-cdk/core';
import { CubeJsStack } from './lib/cubejs-stack';

const STAGE = process.env.STAGE || 'demo'; // default to dev as the stage
const REGION = process.env.REGION || 'us-east-2'; // default region we are using

const app = new App(
  {
    context: {
      STAGE,
      REGION,
    },
  },
);

new CubeJsStack(app, `demo-cube-js-${STAGE}`, {
  terminationProtection: true,
  description: 'Demo Cube JS Setup',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: REGION,
  },
});

app.synth();