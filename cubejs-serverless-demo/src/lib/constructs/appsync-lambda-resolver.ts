import { GraphqlApi, MappingTemplate, LambdaDataSource, CfnResolver } from '@aws-cdk/aws-appsync';
import { Construct } from '@aws-cdk/core';

export interface AppSyncLambdaResolverProps {
  api: GraphqlApi;
  typeName: 'Query' | 'Mutation' | 'Subscription';
  fieldName: string;
  dataSource: LambdaDataSource;
}

export class AppSyncLambdaResolver extends Construct {
  public readonly resolver: CfnResolver

  constructor(scope: Construct, id: string, props: AppSyncLambdaResolverProps) {
    super(scope, id);

    this.resolver = new CfnResolver(this, `${id}-resolver`, {
      dataSourceName: props.dataSource.name,
      apiId: props.api.apiId,
      typeName: props.typeName,
      fieldName: props.fieldName,
      kind: 'UNIT',
      requestMappingTemplate: MappingTemplate.lambdaRequest().renderTemplate(),
      responseMappingTemplate: MappingTemplate.lambdaResult().renderTemplate(),
    });

    this.resolver.addDependsOn(props.dataSource.ds);
    props.api.addSchemaDependency(this.resolver);
  }
}