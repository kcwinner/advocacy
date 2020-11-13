import * as path from 'path';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import { PolicyStatement, Effect, Role, ServicePrincipal, PolicyDocument } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { ServerlessCluster, DatabaseSecret, DatabaseClusterEngine, AuroraMysqlEngineVersion } from '@aws-cdk/aws-rds';
import { Construct, Stack, StackProps, Duration } from '@aws-cdk/core';

const lambdaFunctionsDir = 'src/lambda';

export interface CubeJsStackProps extends StackProps { }

export class CubeJsStack extends Stack {
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
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_08_1 }),
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: SubnetType.ISOLATED, onePerAz: true }),
      credentials: {
        username: databaseSecret.secretValueFromJson('username').toString(),
        password: databaseSecret.secretValueFromJson('password'),
        secret: databaseSecret,
      },
      enableDataApi: true,
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
          ],
        }),
      },
    });

    const lambdaEnvironment = {
      DATABASE_SECRET_ARN: databaseSecret.secretArn,
      DATABASE_CLUSTER_ARN: cluster.clusterArn,
      DATABASE: 'demo',
      NODE_ENV: 'production',
      STAGE,
    };

    const appRoot = process.env.PWD || './';

    const apiFunction = new NodejsFunction(this, 'demo-serverless-function', {
      functionName: 'demo-cubejs-api-proxy-function',
      description: 'Cube JS API Proxy Function',
      runtime: Runtime.NODEJS_12_X,
      handler: 'api',
      entry: path.join(appRoot, lambdaFunctionsDir, 'cubejs', 'index.ts'),
      role: demoFunctionRole,
      environment: lambdaEnvironment,
      timeout: Duration.minutes(1),
      projectRoot: appRoot,
    });

    const lambdaDefaultIntegration = new LambdaProxyIntegration({
      handler: apiFunction,
    });

    new HttpApi(this, 'demo-http-api', {
      defaultIntegration: lambdaDefaultIntegration,
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [HttpMethod.GET, HttpMethod.HEAD, HttpMethod.OPTIONS],
        allowOrigins: ['*'],
      },
    });

  }
}