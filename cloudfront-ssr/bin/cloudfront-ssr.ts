#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EdgeLambdaFunctionStack } from '../lib/edge-lambda-function-stack';
import { CloudfrontSsrStack } from '../lib/cloudfront-ssr-stack';

const REGION = process.env.REGION || 'us-east-2'; // default to us-east-2
const STAGE = process.env.STAGE || 'dev'; // default to dev as the stage
const ACCOUNT = process.env.ACCOUNT;
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'insert-name-or-fail';

const app = new cdk.App(
    {
        context: {
            STAGE: STAGE
        }
    }
);

new EdgeLambdaFunctionStack(app, `edge-lambda-function-stack-demo`, {
    description: 'Sets up the edge lambda for use with cloudfront',
    env: {
        account: ACCOUNT,
        region: 'us-east-1'
    }
})

new CloudfrontSsrStack(app, 'cloudfront-ssr-stack-demo', {
    description: 'Sets up the s3 bucket and cloudfront distribution',
    stage: STAGE,
    domainName: DOMAIN_NAME,
    env: {
        account: ACCOUNT,
        region: REGION
    }
});