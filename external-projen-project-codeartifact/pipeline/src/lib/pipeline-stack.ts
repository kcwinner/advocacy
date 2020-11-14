import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { IRepository, Repository } from '@aws-cdk/aws-codecommit';
import { CfnDomain, CfnRepository } from '@aws-cdk/aws-codeartifact';
import { PipelineProject, BuildSpec, LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import { CodeCommitSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';
import { IRole, Role, ServicePrincipal, ManagedPolicy, CompositePrincipal } from '@aws-cdk/aws-iam';


const TRIGGER_BRANCH_NAME = 'main';

export class PipelineStack extends Stack {
  public artifactDomain: CfnDomain
  public artifactRepository: CfnRepository
  public repository: IRepository
  public pipeline: Pipeline
  public pipelineRole: IRole

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.artifactDomain = new CfnDomain(this, 'demo-artifact-domain', {
      domainName: 'demo-artifact-domain'
    })

    this.artifactRepository = new CfnRepository(this, 'demo-artifact-repository', {
      repositoryName: 'demo-artifact-repository',
    })

    this.artifactRepository.addDependsOn(this.artifactDomain);

    // Need to add in because the L1 construct does not allow us to specify the domain
    this.artifactRepository.addPropertyOverride('DomainName', `${this.artifactDomain.domainName}`);

    this.repository = new Repository(this, 'demo-external-repo', {
      repositoryName: 'demo-external-repo',
      description: 'Demo repository for custom projen project going to AWS CodeArtifact'
    });

    // This is an admin role for simplicity of the example. Don't do this for real
    this.pipelineRole = new Role(this, 'demo-project-pipeline-role', {
      roleName: 'demo-project-project-pipeline-role',
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('codepipeline.amazonaws.com'),
        new ServicePrincipal('codebuild.amazonaws.com'),
        new ServicePrincipal('cloudformation.amazonaws.com')
      ),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    this.pipeline = new Pipeline(this, 'demo-project-pipeline', {
      pipelineName: 'demo-project-pipeline',
      restartExecutionOnUpdate: true,
      role: this.pipelineRole,
    });

    const sourceOutput = new Artifact();
    const source = new CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: this.repository,
      output: sourceOutput,
      branch: TRIGGER_BRANCH_NAME,
      role: this.pipelineRole,
    });

    this.pipeline.addStage({
      stageName: 'Source',
      actions: [source],
    });

    // my-artifact-domain-${ACCOUNT_ID}.d.codeartifact.us-east-2.amazonaws.com/npm/my-artifact-repository
    const npmRegistryUrl = `${this.artifactDomain.attrName}-${this.artifactDomain.attrOwner}.d.codeartifact.${this.region}.amazonaws.com/npm/${this.artifactRepository}`;

    const publishStep = new PipelineProject(this, 'demo-project-publish-package', {
      projectName: 'demo-project-publish-package',
      // buildSpec: BuildSpec.fromSourceFilename('./buildspec.yml'),
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              `aws codeartifact login --tool npm --namespace @demo --repository ${this.artifactRepository.attrName} --domain ${this.artifactDomain.attrName} --domain-owner ${this.artifactDomain.attrOwner}`
            ]
          },
          build: {
            commands: [
              'yarn projen',
              'cd demo-project',
              'yarn build'
            ]
          },
          post_build: {
            commands: [
              'cd demo-project',
              `export NPM_TOKEN=\`aws codeartifact get-authorization-token --domain ${this.artifactDomain.attrName} --domain-owner ${this.artifactDomain.attrOwner} --query authorizationToken --output text\``,
              'export NPM_DIST_TAG="latest"',
              `export NPM_REGISTRY=${npmRegistryUrl}`,
              'npx -p jsii-release jsii-release-npm'
            ]
          }
        }
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_3_0,
        privileged: true,
      },
      role: this.pipelineRole,
    });

    const publishPackageAction = new CodeBuildAction({
      actionName: 'PublicPackage',
      project: publishStep,
      input: sourceOutput,
      role: this.pipelineRole,
    });

    this.pipeline.addStage({
      stageName: 'PublishPackage',
      actions: [publishPackageAction],
    });
  }
}