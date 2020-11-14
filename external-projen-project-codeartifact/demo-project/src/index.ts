import * as fs from 'fs-extra'; // eslint-disable-line
import * as path from 'path'; // eslint-disable-line
import { AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions, Component, SampleDir, Semver } from 'projen'; // eslint-disable-line

import { pascalCase } from './pascalCase';

export interface AwsCdkAppSyncAppOptions extends AwsCdkTypeScriptAppOptions {
  /**
   * cdk-appsync-transformer version to use.
   *
   * @default "1.65.1"
   */
  readonly transformerVersion: string;
}

/**
 * AWS CDK AppSync Transformer App in TypeScript
 *
 * @pjid awscdk-appsync-app-ts
 */
export class AwsCdkAppSyncApp extends AwsCdkTypeScriptApp {
  constructor(options: AwsCdkAppSyncAppOptions) {
    super({
      ...options,
      sampleCode: false,

      // Don't do this at home - it blocks the cdk version from being set via .projenrc
      // but there is a bug in projen atm - issue #305
      cdkVersion: '1.65.0',
      cdkVersionPinning: true,
    });

    const transformerVersion = options.cdkVersionPinning
      ? Semver.pinned(options.transformerVersion)
      : Semver.caret(options.transformerVersion);

    this.addDeps(...[
      `cdk-appsync-transformer@${transformerVersion.spec}`,
    ]);

    this.addCdkDependency(...[
      '@aws-cdk/core',
      '@aws-cdk/aws-appsync',
      '@aws-cdk/aws-cognito',
      '@aws-cdk/aws-dynamodb',
    ]);

    this.gitignore.exclude('appsync/');
    this.npmignore?.exclude('appsync/');

    if (options.sampleCode ?? true) {
      new SampleCode(this);
    }
  }
}

class SampleCode extends Component {
  private readonly appProject: AwsCdkAppSyncApp;

  constructor(project: AwsCdkAppSyncApp) {
    super(project);
    this.appProject = project;
  }

  public synthesize(outdir: string) {
    const srcdir = path.join(outdir, this.appProject.srcdir);
    if (fs.pathExistsSync(srcdir) && fs.readdirSync(srcdir).filter(x => x.endsWith('.ts'))) {
      return;
    }

    const projectTypeStack = pascalCase(this.appProject.manifest.name) + 'Stack';

    const srcCode = `import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { UserPool, UserPoolClient, VerificationEmailStyle } from '@aws-cdk/aws-cognito';
import { AuthorizationType, UserPoolDefaultAction } from '@aws-cdk/aws-appsync';

import { AppSyncTransformer } from 'cdk-appsync-transformer';

export class ${projectTypeStack} extends Stack {
  public userPool: UserPool;
  public api: AppSyncTransformer

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    this.userPool = new UserPool(this, 'cognito', {
      autoVerify: {
        email: true,
        phone: false
      },
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true
        },
      },
      userVerification: {
        emailSubject: 'Verify your email',
        emailBody: 'Hello {username}! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      }
    });

    const userpoolWebClient = new UserPoolClient(this, 'cognito-user-pool-client', {
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true
      }
    })

    this.api = new AppSyncTransformer(this, 'appsync-api', {
      schemaPath: './schema.graphql',
      apiName: 'my-cool-api',
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
            appIdClientRegex: userpoolWebClient.userPoolClientId,
            defaultAction: UserPoolDefaultAction.ALLOW
          }
        }
      }
    })
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ${projectTypeStack}(app, 'my-stack-dev', { env: devEnv });
// new ${projectTypeStack}(app, 'my-stack-prod', { env: prodEnv });

app.synth();`;

    new SampleDir(this.appProject, srcdir, {
      files: {
        [this.appProject.appEntrypoint]: srcCode,
      },
    });

    const testdir = path.join(outdir, this.appProject.testdir);
    if (fs.pathExistsSync(testdir) && fs.readdirSync(testdir).filter(x => x.endsWith('.ts'))) {
      return;
    }

    const testCode = `import '@aws-cdk/assert/jest';
import { ${projectTypeStack} } from '../src/main'
import { App } from '@aws-cdk/core';

test('Snapshot', () => {
  const app = new App();
  const stack = new ${projectTypeStack}(app, 'test');

  expect(stack).toHaveResource('AWS::Cognito::UserPool');
  expect(stack.api.nestedAppsyncStack).toHaveResource('AWS::AppSync::GraphQLApi');
});`;

    fs.mkdirpSync(testdir);
    fs.writeFileSync(path.join(testdir, 'main.test.ts'), testCode);

    const sampleSchema = `# This is a sample generated schema
type Customer @model
    @auth(rules: [
        { allow: groups, groups: ["Admins"] },
        { allow: private, provider: iam, operations: [read, update] }
    ]) {
        id: ID!
        firstName: String!
        lastName: String!
        active: Boolean!
        address: String!
}

type Product @model
    @auth(rules: [
        { allow: groups, groups: ["Admins"] },
        { allow: public, provider: iam, operations: [read] }
    ]) {
        id: ID!
        name: String!
        description: String!
        price: String!
        active: Boolean!
        added: AWSDateTime!
        orders: [Order] @connection
}

type Order @model
    @key(fields: ["id", "productID"]) {
        id: ID!
        productID: ID!
        total: String!
        ordered: AWSDateTime!
}

# Demonstrate the FUNCTION resolvers
type User @model(queries: null, mutations: null, subscriptions: null)
    @auth(rules: [
        { allow: groups, groups: ["Admins"] },
        { allow: owner, ownerField: "sub" },
        { allow: private, provider: iam, operations: [create, update] }
    ]) {
    id: ID!
    enabled: Boolean!
    status: String!
    email: String!
    name: String!
    email_verified: String
    phone_number: String
    phone_number_verified: String
}

type UserConnection {
    items: [User]
}

input CreateUserInput {
    email: String!
    name: String!
}

input UpdateUserInput {
    id: ID!
    email: String
    name: String
    number: String
}

# Demonstrate the FUNCTION resolvers
type Query {
  listUsers: UserConnection @function(name: "currently-unused")
  getUser(id: ID!): User @function(name: "currently-unused")
}

type Mutation {
  createUser(input: CreateUserInput!): User @function(name: "currently-unused")
  updateUser(input: UpdateUserInput!): User @function(name: "currently-unused")
}`;

    fs.writeFileSync(path.join(outdir, 'schema.graphql'), sampleSchema);
  }
}