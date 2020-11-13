import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { CubeJsStack } from '../src/lib/cubejs-stack';

test('Snapshot', () => {
  const app = new App();
  const stack = new CubeJsStack(app, 'test');

  expect(stack).toHaveResource('AWS::EC2::VPC');
  expect(stack).toHaveResource('AWS::RDS::DBCluster');
  expect(stack).toHaveResource('AWS::SecretsManager::Secret');
  expect(stack).toHaveResource('AWS::SecretsManager::SecretTargetAttachment');
});