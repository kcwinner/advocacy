import { App } from "aws-cdk-lib";
import { TestStack } from "./stacks/test-stack";

const app = new App();

new TestStack(app, "StackOne", {
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

app.synth();
