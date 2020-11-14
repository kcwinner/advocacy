import { AwsCdkAppSyncApp } from '../src';

test('Project Basics', () => {
  const project = new AwsCdkAppSyncApp({
    name: 'test',
    cdkVersion: '1.65.0',
    transformerVersion: '1.65.1',
    cdkVersionPinning: true,
  });

  expect(project.cdkVersion).toEqual('1.65.0');
  expect(project.srcdir).toEqual('src');
  expect(project.libdir).toEqual('lib');

  // Dependencies are pinned internally for now
  const dependencies = project.manifest.dependencies();
  expect(dependencies['cdk-appsync-transformer']).toEqual('1.65.1');
});