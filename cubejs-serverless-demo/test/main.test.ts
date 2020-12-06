import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { CubeJsStack } from '../src/lib/cubejs-stack';

test('Resources', () => {
  const app = new App();
  const stack = new CubeJsStack(app, 'test');

  // VPC Resources
  expect(stack).toHaveResource('AWS::EC2::VPC');

  // Database Resources
  expect(stack).toHaveResource('AWS::RDS::DBCluster');
  expect(stack).toHaveResource('AWS::RDS::DBSubnetGroup');

  // AppSync Resources
  expect(stack.appsyncTransformer.nestedAppsyncStack).toHaveResource('AWS::AppSync::GraphQLApi');
  expect(stack.appsyncTransformer.nestedAppsyncStack).toHaveResource('AWS::AppSync::GraphQLSchema');
});