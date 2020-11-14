import { App } from '@aws-cdk/core';
import { PipelineStack } from './lib/pipeline-stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new PipelineStack(app, 'demo-custom-project-stack', { env: devEnv });

app.synth();
