#!/bin/bash
set -e

export STAGE=${STAGE:-"demo"}
export REGION=${REGION:-"us-east-2"}
export ACCOUNT=`aws sts get-caller-identity --query 'Account' --output text`

echo "STAGE: ${STAGE}"
echo "REGION: ${REGION}"
echo "ACCOUNT: ${ACCOUNT}"

STACK_ID="s3-website-demo"

# Deploy Demo Site
cdk deploy ${STACK_ID} --require-approval=never \
    -c STAGE=${STAGE} \
    -c REGION=${REGION} \
    -c ACCOUNT=${ACCOUNT}