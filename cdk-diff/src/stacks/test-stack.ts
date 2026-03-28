import { App, Stack, StackProps } from "aws-cdk-lib";
import { Code } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class TestStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "TestDiffFunction", {
      code: Code.fromInline("console.log(123)"),
      handler: "handler",
    });
  }
}
