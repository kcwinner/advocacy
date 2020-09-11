import { Stack, Construct, StackProps, Duration } from '@aws-cdk/core';
import { Role, CompositePrincipal, ServicePrincipal, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { StringParameter, ParameterType } from '@aws-cdk/aws-ssm';
import { CfnFunction, Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

import path = require('path');

export interface EdgeLambdaFunctionStackProps extends StackProps {
}

export class EdgeLambdaFunctionStack extends Stack {
    constructor(scope: Construct, id: string, props?: EdgeLambdaFunctionStackProps) {
        super(scope, id, props);

        if (props?.env?.region !== 'us-east-1') {
            throw new Error("The stack contains Lambda@Edge functions and must be deployed in 'us-east-1'");
        }

        const ssrFunctionRole = new Role(this, 'ssr-function-role', {
            assumedBy: new CompositePrincipal(
                new ServicePrincipal('lambda.amazonaws.com'),
                new ServicePrincipal('edgelambda.amazonaws.com')
            ),
            managedPolicies: [
                { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
            ],
            inlinePolicies: {
                "inline-lambda-policy": new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            effect: Effect.ALLOW,
                            actions: ['appsync:GraphQL'],
                            resources: [
                                `arn:aws:appsync:us-east-2:${this.account}:apis/*/types/Query/fields/getMetaTags`
                            ]
                        }),
                    ]
                })
            }
        });

        const appRoot = process.env.PWD || './';

        const ssrFunction = new NodejsFunction(this, id, {
            functionName: 'ssr-function-demo',
            description: 'SSR Function for PWA',
            runtime: Runtime.NODEJS_12_X,
            entry: path.join(appRoot, 'lambda/ssr/index.ts'),
            handler: 'handler',
            role: ssrFunctionRole,
            timeout: Duration.seconds(5), // Lambda@Edge Functions requires timeout of 5s or less. 
            logRetention: 7,
            projectRoot: appRoot
        });

        // Lambda@Edge Functions can not have environment variables
        const cfnFunction = ssrFunction.node.defaultChild as CfnFunction;
        cfnFunction.addPropertyDeletionOverride('Environment.Variables');

        new StringParameter(this, 'ssr-function-version-demo', {
            parameterName: `ssr-function-version-demo`,
            description: 'CDK parameter stored for cross region Edge Lambda',
            stringValue: ssrFunction.currentVersion.functionArn,
            type: ParameterType.STRING,
        })
    }
}