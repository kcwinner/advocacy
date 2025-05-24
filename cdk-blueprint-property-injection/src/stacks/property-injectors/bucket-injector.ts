import { InjectionContext, IPropertyInjector } from 'aws-cdk-lib';
import {
  BucketProps,
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';

export class BucketPropsInjector implements IPropertyInjector {
  readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: BucketProps, context: InjectionContext): BucketProps {
    return {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      encryption: BucketEncryption.S3_MANAGED,
      eventBridgeEnabled: true,
      ...originalProps,
    };
  }
}
