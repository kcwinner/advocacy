import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { MyStack } from '../src/stacks/bucket-stack';
import { BucketPropsInjector } from '../src/stacks/property-injectors/bucket-injector';

test('Plain bucket', () => {
  const app = new App();
  const stack = new MyStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();

  // Should NOT have our injected properties
  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: Match.absent(),
  });
});

test('Bucket with property injector', () => {
  const app = new App({
    propertyInjectors: [new BucketPropsInjector()],
  });
  const stack = new MyStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();

  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });
});

test('Custom props with property injector', () => {
  const app = new App({
    propertyInjectors: [new BucketPropsInjector()],
  });
  const stack = new Stack(app, 'test-stack');
  new Bucket(stack, 'TestBucket', {
    blockPublicAccess: {
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    },
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();

  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      BlockPublicPolicy: false,
      IgnorePublicAcls: false,
      RestrictPublicBuckets: false,
    },
  });
});
