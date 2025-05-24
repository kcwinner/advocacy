import { App } from 'aws-cdk-lib';
import { MyStack } from './stacks/bucket-stack';
import { BucketPropsInjector } from './stacks/property-injectors/bucket-injector';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App({
  propertyInjectors: [new BucketPropsInjector()],
});

new MyStack(app, 'PropertyInjectionDev', {
  env: devEnv,
});

app.synth();
