const { JsiiProject } = require('projen');

const project = new JsiiProject({
  authorAddress: "kcswinner@gmail.com",
  authorName: "Ken Winner",
  name: "external-projen-project-codeartifact",
  repository: "https://github.com/kcwinner/advocacy.git",
  devDeps: [
    '@types/fs-extra@^8', // This will break if it's on 9
    'fs-extra'
  ], 
  deps: ['projen'],
  peerDeps: [ 'projen' ],

  // Disable Github Stuff
  buildWorkflow: false,
  releaseWorkflow: false,
  pullRequestTemplate: false,
  dependabot: false,
  mergify: false
});

project.synth();
