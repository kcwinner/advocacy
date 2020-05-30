import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, ViewerCertificate } from '@aws-cdk/aws-cloudfront';
import { HostedZone, RecordSet, RecordType } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';

export interface S3WebsiteStackProps extends StackProps {
  stage: string
  domainName: string
}

export class S3WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: S3WebsiteStackProps) {
    super(scope, id, props);

    const domainName = props.domainName;
    const recordName = `cdk-demo.${domainName}`

    const cdkDemoSiteWebsiteBucket = new Bucket(this, 'cdk-demo-site-website-bucket', {
      bucketName: `cdk-demo-site-${props.stage}-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });

    const hostedZone = HostedZone.fromLookup(this, `${props.stage}-hosted-zone`, {
      domainName: domainName,
      privateZone: false
    })

    let dnsCert = new DnsValidatedCertificate(this, 'cdk-demo-site-certificate', {
      domainName: recordName,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });

    // Create our cloudfront distribution with alternate domain name configurations
    const distribution = new CloudFrontWebDistribution(this, 'cdk-demo-site-cloudfront', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: cdkDemoSiteWebsiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
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
      ]
    });

    new RecordSet(this, 'cdk-demo-site-cname-record', {
      zone: hostedZone,
      recordType: RecordType.A,
      recordName: recordName,
      target: {
        aliasTarget: new CloudFrontTarget(distribution)
      }
    })

    // This copies our build directory to the bucket
    new BucketDeployment(this, 'deploy-cdk-demo-site', {
      sources: [
        Source.asset('./build')
      ],
      destinationBucket: cdkDemoSiteWebsiteBucket
    });
  }
}
