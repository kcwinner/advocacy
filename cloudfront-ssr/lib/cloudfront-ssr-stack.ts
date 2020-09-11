import { Stack, Construct, StackProps, Duration } from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity, ViewerCertificate, LambdaEdgeEventType } from '@aws-cdk/aws-cloudfront';
import { HostedZone, RecordSet, RecordType } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Version } from '@aws-cdk/aws-lambda';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';

export interface CloudfrontSsrStackProps extends StackProps {
  stage: string
  domainName: string
}

export class CloudfrontSsrStack extends Stack {
  constructor(scope: Construct, id: string, props: CloudfrontSsrStackProps) {
    super(scope, id, props);

    const domainName = props.domainName;
    const recordName = `*.${domainName}`

    const pwaBucket = new Bucket(this, 'cloudfront-ssr-demo-pwa-bucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });

    const bucketOai = new OriginAccessIdentity(this, 'bucket-oai');
    pwaBucket.grantRead(bucketOai);

    const hostedZone = HostedZone.fromLookup(this, `${props.stage}-hosted-zone`, {
      domainName: domainName,
      privateZone: false
    })

    const dnsCert = new DnsValidatedCertificate(this, 'cloudfront-ssr-demo-certificate', {
      domainName: recordName,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });

    const edgeFunctionVersion = new AwsCustomResource(this, 'get-edge-function-version', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['ssm:GetParameter*'],
          resources: [
            this.formatArn({
              service: 'ssm',
              region: 'us-east-1',
              resource: '*'
            })
          ]
        })
      ]),
      onUpdate: {
        // will also be called for a CREATE event
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: 'ssr-function-version-demo'
        },
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()) // Update physical id to always fetch the latest version
      }
    })

    const edgeLambdaVersion = Version.fromVersionArn(this, 'edge-lambda-version', edgeFunctionVersion.getResponseField('Parameter.Value'));

    // Create our cloudfront distribution with alternate domain name configurations
    const distribution = new CloudFrontWebDistribution(this, 'ssr-demo-cloudfront-distribution', {
      originConfigs: [
        {
          customOriginSource: {
            domainName: pwaBucket.bucketDomainName,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              minTtl: Duration.seconds(0),
              maxTtl: Duration.minutes(5),
              defaultTtl: Duration.minutes(0),
              lambdaFunctionAssociations: [
                {
                  eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: edgeLambdaVersion
                },
                {
                  eventType: LambdaEdgeEventType.ORIGIN_RESPONSE,
                  lambdaFunction: edgeLambdaVersion
                },
              ],
              forwardedValues: {
                queryString: false,
                headers: [
                  'Host'
                ]
              }
            }
          ]
        }
      ],
      viewerCertificate: ViewerCertificate.fromAcmCertificate(
        dnsCert,
        {
          aliases: [recordName]
        }
      ),
      errorConfigurations: [
        { errorCode: 403, responsePagePath: '/index.html', responseCode: 200, errorCachingMinTtl: 5 },
        { errorCode: 404, responsePagePath: '/index.html', responseCode: 200, errorCachingMinTtl: 5 },
      ],
      enableIpV6: true,
    });

    new RecordSet(this, 'cloudfront-distribution-cname-record', {
      zone: hostedZone,
      recordType: RecordType.A,
      recordName: recordName,
      target: {
        aliasTarget: new CloudFrontTarget(distribution)
      }
    })

    // This copies our build directory to the bucket
    new BucketDeployment(this, 'deploy-website', {
      sources: [
        Source.asset('../build')
      ],
      destinationBucket: pwaBucket
    });

  }
}
