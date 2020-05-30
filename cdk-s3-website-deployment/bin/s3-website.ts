#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { S3WebsiteStack } from '../lib/s3-website-stack';

const ACCOUNT = process.env.ACCOUNT;
const REGION = 'us-east-2';

const app = new cdk.App();
new S3WebsiteStack(app, 's3-website-demo', {
    description: 'Demo S3 Website using AWS CDK and bucket deployment',
    stage: 'demo',
    domainName: 'kennethwinner.com',
    env: {
        account: ACCOUNT,
        region: REGION
    }
});