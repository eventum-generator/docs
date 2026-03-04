import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudAwsCloudtrail: GeneratorMeta = {
    slug: 'cloud-aws-cloudtrail',
    displayName: 'AWS CloudTrail Management Events',
    category: 'cloud',
    description:
      'AWS CloudTrail audit trail — API calls across EC2, IAM, STS, and S3 from a multi-account organization. Includes console logins, role assumptions, error injection, and 4 identity types.',
    format: ['JSON', 'ECS'],
    dataSource: 'AWS CloudTrail',
    eventCount: 22,
    templateCount: 22,
    highlights: [
      '4 identity types',
      'Shared state correlations',
      'Error injection (~4%)',
      'Multi-account environment',
    ],
    generatorId: 'cloudtrail',
    eventTypes: [
      {
        id: 'AssumeRole',
        description: 'Assume an IAM role (STS)',
        frequency: '~33%',
        category: 'authentication',
      },
      {
        id: 'DescribeInstances',
        description: 'List/describe EC2 instances',
        frequency: '~15%',
        category: 'host',
      },
      {
        id: 'GetCallerIdentity',
        description: 'Retrieve caller identity (STS)',
        frequency: '~9%',
        category: 'authentication',
      },
      {
        id: 'ConsoleLogin',
        description: 'AWS Management Console sign-in',
        frequency: '~6%',
        category: 'authentication',
      },
      {
        id: 'DescribeSecurityGroups',
        description: 'List/describe security groups',
        frequency: '~7%',
        category: 'network',
      },
      {
        id: 'RunInstances',
        description: 'Launch new EC2 instances',
        frequency: '~2%',
        category: 'host',
      },
      {
        id: 'CreateUser',
        description: 'Create a new IAM user',
        frequency: '<1%',
        category: 'iam',
      },
      {
        id: 'AttachRolePolicy',
        description: 'Attach managed policy to role',
        frequency: '<1%',
        category: 'iam',
      },
    ],
    realismFeatures: [
      'Jinja2 macros eliminate boilerplate across 22 templates',
      '4 identity types — AssumedRole (65%), IAMUser (20%), AWSService (12%), Root (0.5%)',
      'Shared state correlations — AssumeRole generates temp credentials reused by subsequent API calls',
      'Error injection (~4%) — 20 realistic error scenarios mapped to specific API operations',
      'Console login flow with MFA tracking and ~5% login failure rate',
      'Multi-account environment — 3 AWS accounts (production, staging, development)',
      '10 IAM users across 7 departments, 12 IAM roles with distinct trust services',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
      {
        name: 'event_version',
        defaultValue: '1.09',
        description: 'CloudTrail event version',
      },
      {
        name: 'error_rate',
        defaultValue: '4',
        description: 'Error injection rate (percentage, 0-100)',
      },
    ],
    sampleOutputs: [
      {
        title: 'AssumeRole — STS',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "cloud": {
        "account": { "id": "123456789012", "name": "acme-production" },
        "provider": "aws",
        "region": "us-east-1"
    },
    "event": {
        "action": "AssumeRole",
        "category": ["authentication"],
        "dataset": "aws.cloudtrail",
        "kind": "event",
        "module": "aws",
        "outcome": "success"
    },
    "user": {
        "name": "michael.chen",
        "id": "AIDAEXAMPLE3MCHEN001"
    },
    "aws": {
        "cloudtrail": {
            "event_source": "sts.amazonaws.com",
            "event_name": "AssumeRole",
            "event_type": "AwsApiCall",
            "user_identity": {
                "type": "IAMUser",
                "arn": "arn:aws:iam::123456789012:user/michael.chen"
            }
        }
    }
}`,
      },
    ],
  };
