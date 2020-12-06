import * as path from 'path';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Construct, Duration } from '@aws-cdk/core';

export interface AppSyncLambdaFunctionProps {
  cognitoUserPoolID: string;
  dynamoTableNameMap: any;
  description?: string;
}

export class AppSyncLambdaFunction extends Construct {
  public readonly function: NodejsFunction

  constructor(scope: Construct, id: string, props: AppSyncLambdaFunctionProps) {
    super(scope, id);

    const STAGE = this.node.tryGetContext('STAGE');

    const role = new Role(this, `${id}-role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
      ],
      inlinePolicies: {
        'inline-lambda-policy': new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['dynamodb:*'],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'ssm:GetParameter',
                'ssm:GetParameters',
              ],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'secretsmanager:GetSecretValue',
              ],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                's3:*',
              ],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'cognito-idp:ListUsers',
                'cognito-idp:ListUsersInGroup',
                'cognito-idp:AdminCreateUser',
                'cognito-idp:AdminDisableUser',
                'cognito-idp:AdminEnableUser',
                'cognito-idp:AdminGetUser',
              ],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'ses:SendEmail',
                'ses:DeleteIdentity',
                'ses:DeleteVerifiedEmailAddress',
                'ses:ListIdentities',
                'ses:ListVerifiedEmailAddresses',
                'ses:VerifyEmailAddress',
                'ses:VerifyEmailIdentity',
              ],
              resources: ['*'],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'lambda:InvokeFunction',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    this.function = new NodejsFunction(this, id, {
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(process.cwd(), 'src/lambda/api/index.ts'),
      handler: 'handler',
      description: props.description || 'TS Function',
      environment: {
        STAGE: STAGE,
        USER_POOL_ID: props.cognitoUserPoolID,
        USER_TABLE_NAME: props.dynamoTableNameMap.UserTable,
        NOTIFICATION_TABLE_NAME: props.dynamoTableNameMap.NotificationTable,
      },
      role: role,
      timeout: Duration.seconds(30),
      logRetention: 7,
      retryAttempts: 0,
    });
  }
}