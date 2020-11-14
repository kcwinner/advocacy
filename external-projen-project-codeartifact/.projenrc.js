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
        name: "demo-external-projen-project-codeartifact",
        repository: "https://github.com/kcwinner/advocacy.git",
        minNodeVersion: '12.17.0',
        devDeps: [
          '@types/fs-extra@^8', // This will break if it's on 9
          'fs-extra'
        ], 
        deps: ['projen'],
        peerDeps: [ 'projen' ],

        ...disableGithub
      }),
    },
    {
      path: 'pipeline',
      project: new AwsCdkTypeScriptApp({
        appEntrypoint: 'main.ts',

        ...disableGithub
      }),
    },
  ]
});

project.synth();
