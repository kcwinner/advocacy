const { web } = require('projen');

const project = new web.ReactTypeScriptProject({
  name: 'cubejs-serverless-demo-frontend',
  deps: [
    '@ant-design/compatible',
    '@ant-design/icons',
    '@aws-amplify/auth',
    '@aws-amplify/ui-components',
    '@aws-amplify/ui-react',
    '@cubejs-client/core',
    '@cubejs-client/react',
    'antd',
    'aws-amplify',
    'react-beautiful-dnd',
    'react-grid-layout',
    'react-query',
    'react-resizable',
    'react-router',
    'react-router-dom',
    'recharts',
  ],
  devDeps: [
    '@graphql-codegen/core@1.8.3', // Pin it so the generation doesn't break
    '@graphql-codegen/typescript@1.8.3', // Pin it so the generation doesn't break
    '@types/react-beautiful-dnd',
    '@types/react-dom',
    '@types/react-grid-layout',
    '@types/react-router-dom',
    '@types/recharts',
    'amplify-graphql-docs-generator',
    'amplify-graphql-types-generator',
    'aws-sdk',
    'graphql@14.5.8' // Pin it so the generation doesn't break
  ],

  tsconfig: {
    compilerOptions: {
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: false,
      module: 'esnext',
      moduleResolution: 'node',
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx'
    }
  },

  scripts: {
    'generate-exports': 'node bin/generateExports.js',
    'generate-gql': 'sh bin/generateGQL.sh',
    'start': 'react-scripts start'
  },

  gitignore: [
    'aws-exports.js'
  ],

  // Disable Github stuff
  buildWorkflow: false,
  rebuildBot: false,
  releaseWorkflow: false,
  pullRequestTemplate: false,
  mergify: false,
  dependabot: false
});

// Override the ReactTypescriptProject react version
project.addDeps('react@^16');

project.synth();
