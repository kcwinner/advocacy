import * as path from 'path';
import { HttpApi, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { AuthorizationType, UserPoolDefaultAction } from '@aws-cdk/aws-appsync';
import { UserPool, UserPoolClient, CfnUserPoolGroup } from '@aws-cdk/aws-cognito';
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb';
import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { SnsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { ServerlessCluster, DatabaseSecret, DatabaseClusterEngine, AuroraMysqlEngineVersion } from '@aws-cdk/aws-rds';
import { Topic } from '@aws-cdk/aws-sns';
import { CfnOutput, Construct, Stack, StackProps, Duration } from '@aws-cdk/core';

import { AppSyncTransformer } from 'cdk-appsync-transformer';
import { AppSyncLambdaFunction } from './constructs/appsync-lambda-function';

export interface CubeJsStackProps extends StackProps { }

export class CubeJsStack extends Stack {
  public readonly userPool: UserPool
  public readonly appsyncTransformer: AppSyncTransformer;

  private readonly groups = [
    { name: 'Admins', precedence: 0, description: 'Group for Admins' },
  ]

  constructor(scope: Construct, id: string, props?: CubeJsStackProps) {
    super(scope, id, props);

    const STAGE = this.node.tryGetContext('STAGE');

    const vpc = new Vpc(this, 'demo-vpc', {
      subnetConfiguration: [
        {
          name: `demo-isolated-${STAGE}`,
          subnetType: SubnetType.ISOLATED,
          cidrMask: 24,
        },
        {
          name: `demo-public-${STAGE}`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
      maxAzs: 3,
      natGateways: 0, // No nat gateways. Using data api client to connect to DB
    });

    const databaseSecret = new DatabaseSecret(this, 'demo-secret', {
      username: 'demo_user',
    });

    const cluster = new ServerlessCluster(this, 'rds-serverless-cluster', {
      clusterIdentifier: 'demo-serverless-cluster',
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_09_0 }),
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: SubnetType.ISOLATED, onePerAz: true }),
      defaultDatabaseName: 'demo',
      credentials: {
        username: databaseSecret.secretValueFromJson('username').toString(),
        password: databaseSecret.secretValueFromJson('password'),
        secret: databaseSecret,
      },
      enableDataApi: true,
      backupRetention: Duration.days(1),
      scaling: {
        maxCapacity: 1,
        minCapacity: 1,
        autoPause: Duration.minutes(15),
      },
    });

    // Cognito Setup
    this.userPool = new UserPool(this, `demo-userpool-${STAGE}`, {
      autoVerify: {
        email: true,
        phone: false,
      },
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
        phoneNumber: {
          mutable: true,
          required: true,
        },
        fullname: {
          mutable: true,
          required: true,
        },
      },
    });

    const userpoolWebClient = new UserPoolClient(this, `demo-userpool-client-${STAGE}`, {
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    this.createGroups(STAGE);

    const processTopic = new Topic(this, 'demo-sns-process-topic', {
      displayName: 'demo-cubejs-process',
      topicName: 'demo-cubejs-process',
    });

    const cubejsCacheTable = new Table(this, 'demo-cache-table', {
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },

      timeToLiveAttribute: 'exp',
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    cubejsCacheTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1sk',
        type: AttributeType.NUMBER,
      },
    });

    const demoFunctionRole = new Role(this, 'demo-function-role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
      ],
      inlinePolicies: {
        'inline-lambda-policy': new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'secretsmanager:GetSecretValue',
              ],
              resources: [databaseSecret.secretArn],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'rds-data:ExecuteSql',
                'rds-data:ExecuteStatement',
                'rds-data:BatchExecuteStatement',
                'rds-data:BeginTransaction',
                'rds-data:RollbackTransaction',
                'rds-data:CommitTransaction',
              ],
              resources: [cluster.clusterArn],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'sns:*',
              ],
              resources: [processTopic.topicArn],
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'dynamodb:DeleteItem',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:UpdateItem',
              ],
              resources: [
                cubejsCacheTable.tableArn,
                `${cubejsCacheTable.tableArn}/index/*`,
              ],
            }),
          ],
        }),
      },
    });

    // Cubejs Environment Variables - https://cube.dev/docs/reference/environment-variables
    const lambdaEnvironment = {
      CUBEJS_DATABASE_SECRET_ARN: databaseSecret.secretArn,
      CUBEJS_DATABASE_CLUSTER_ARN: cluster.clusterArn,
      CUBEJS_DATABASE: 'demo',
      CUBEJS_DB_TYPE: 'mysqlauroraserverless',
      CUBEJS_API_SECRET: 'demo-api-secret', // Do not leave this in plaintext. Use paramater store, secrets manager, or something
      CUBEJS_APP: 'demo-cubejs',
      CUBEJS_LOG_LEVEL: 'info',

      // Experimental for the new cache/queue driver
      CUBEJS_CACHE_AND_QUEUE_DRIVER: 'dynamodb',
      CUBEJS_CACHE_TABLE: cubejsCacheTable.tableName,

      SERVERLESS_EXPRESS_PLATFORM: 'aws',
      NODE_ENV: 'production',
      PROCESS_TOPIC_ARN: processTopic.topicArn, // Used by the handler to send the process message

      STAGE,
    };

    const appRoot = process.env.PWD || './';

    // Bundling does not work well due to the static schema folder
    // Just use this instead
    const demoCubeFunction = new Function(this, 'demo-serverless-cubejs-function', {
      functionName: 'demo-cubejs-api-proxy-function',
      description: 'Cube JS API Proxy Function',
      code: Code.fromAsset(path.join(appRoot, 'cubejs-lambda')),
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.api',
      role: demoFunctionRole,
      environment: lambdaEnvironment,
      timeout: Duration.minutes(1),
    });

    // Set payload format version to VERSION_1_0 so it works with aws-serverless-express
    // HTTP API is faster and cheaper so it's worth it
    const proxyIntegration = new LambdaProxyIntegration({
      handler: demoCubeFunction,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
    });

    const cubejsApi = new HttpApi(this, 'demo-cubejs-http-api', {
      description: 'cubejs http proxy api',
      defaultIntegration: proxyIntegration,
    });

    const demoProcessFunction = new Function(this, 'demo-serverless-cubejs-process-function', {
      functionName: 'demo-cubejs-process-function',
      description: 'Cube JS Process Function',
      code: Code.fromAsset(path.join(appRoot, 'cubejs-lambda')),
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.process',
      role: demoFunctionRole,
      environment: lambdaEnvironment,
      timeout: Duration.minutes(1),
    });

    demoProcessFunction.addEventSource(new SnsEventSource(processTopic));

    // AppSync Setup
    this.appsyncTransformer = new AppSyncTransformer(this, `demo-api-${STAGE}`, {
      schemaPath: './schema.graphql',
      apiName: `demo-api-${STAGE}`,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
            appIdClientRegex: userpoolWebClient.userPoolClientId,
            defaultAction: UserPoolDefaultAction.ALLOW,
          },
        },
      },
    });

    // Lambda Function
    const demoResolverFunction = new AppSyncLambdaFunction(this.appsyncTransformer.nestedAppsyncStack, `demo-resolver-function-${STAGE}`, {
      cognitoUserPoolID: this.userPool.userPoolId,
      dynamoTableNameMap: this.appsyncTransformer.tableNameMap,
      description: 'Demo Resolver Function',
    });

    this.appsyncTransformer.addLambdaDataSourceAndResolvers(
      'demo-lambda-resolver',
      'demo-lambda-resolver-data-source',
      demoResolverFunction.function,
      {
        name: 'lamdaresolversrc'
      }
    );

    // Outputs so we can generate exports
    new CfnOutput(this, 'cubejsApiUrlOutput', {
      value: `https://${cubejsApi.httpApiId}.execute-api.${this.region}.amazonaws.com`,
      description: 'userPoolId value for amplify',
    });

    new CfnOutput(this, 'userPoolIdOutput', {
      value: this.userPool.userPoolId,
      description: 'userPoolId value for amplify',
    });

    new CfnOutput(this, 'userPoolWebClientIdOutput', {
      value: userpoolWebClient.userPoolClientId,
      description: 'userPoolWebClientId value for amplify',
    });

    // Outputting for use with knex
    new CfnOutput(this, 'dbSecretArn', {
      value: databaseSecret.secretArn,
      description: 'secretArn for use with knex',
    });

    // Outputting for use with knex
    new CfnOutput(this, 'clusterArn', {
      value: cluster.clusterArn,
      description: 'clusterArn for use with knex',
    });
  }

  private createGroups(stage: string) {
    this.groups.forEach(group => {
      new CfnUserPoolGroup(this, `demo-${group.name.toLowerCase()}-${stage}`, {
        userPoolId: this.userPool.userPoolId,
        groupName: group.name,
        precedence: group.precedence,
        description: group.description,
      });
    });
  }
}