const { CompositeProject, JsiiProject, AwsCdkTypeScriptApp } = require('projen');

const disableGithub = {
  buildWorkflow: false,
  releaseWorkflow: false,
  pullRequestTemplate: false,
  dependabot: false,
  mergify: false
}

const project = new CompositeProject({
  projects: [
    {
      path: 'demo-project',
      project: new JsiiProject({
        authorName: 'Ken Winner',
        authorAddress: 'kcswinner@gmail.com',
        name: "demo-project",
        repository: "https://github.com/kcwinner/advocacy.git",
        minNodeVersion: '10.12.0',
        devDeps: [
          '@types/fs-extra@^8', // This will break if it's on 9
          'fs-extra'
        ],
        deps: ['projen'],
        peerDeps: ['projen'],

        ...disableGithub
      }),
    },
    {
      path: 'pipeline',
      project: new AwsCdkTypeScriptApp({
        appEntrypoint: 'main.ts',
        defaultReleaseBranch: 'main',
        cdkVersion: '1.73.0',
        cdkDependencies: [
          '@aws-cdk/core',
          '@aws-cdk/aws-codeartifact',
          '@aws-cdk/aws-codebuild',
          '@aws-cdk/aws-codecommit',
          '@aws-cdk/aws-codepipeline',
          '@aws-cdk/aws-codepipeline-actions',
          '@aws-cdk/aws-iam',
        ],
        devDeps: [
          'parcel@2.0.0-beta.1' // So we can bundle locally instead of using a container
        ],

        ...disableGithub
      }),
    },
  ]
});

project.synth();
