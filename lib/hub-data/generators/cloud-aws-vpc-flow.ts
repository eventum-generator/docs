import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudAwsVpcFlow: GeneratorMeta = {
    slug: 'cloud-aws-vpc-flow',
    displayName: 'AWS VPC Flow Logs',
    category: 'cloud',
    description:
      'AWS VPC Flow Logs (v5) — network traffic records across multiple accounts, VPCs, and subnets. TCP/UDP/ICMP flows with ACCEPT/REJECT actions, NAT gateway traffic, and realistic byte/packet distributions.',
    format: ['JSON', 'ECS'],
    dataSource: 'AWS VPC Flow Logs',
    eventCount: 9,
    templateCount: 9,
    highlights: [
      'Multi-account environment',
      'Lognormal traffic volumes',
      '15 network interfaces',
      'Raw log preservation',
    ],
    generatorId: 'vpcflow',
    eventTypes: [
      {
        id: 'accepted-tcp',
        description: 'TCP ACCEPT — web, SSH, database traffic',
        frequency: '~53%',
        category: 'network',
      },
      {
        id: 'accepted-udp',
        description: 'UDP ACCEPT — DNS, NTP, syslog',
        frequency: '~16%',
        category: 'network',
      },
      {
        id: 'accepted-tcp-bulk',
        description: 'High-volume TCP transfers (S3, API)',
        frequency: '~11%',
        category: 'network',
      },
      {
        id: 'rejected-tcp',
        description: 'Security group denies, port scans',
        frequency: '~8%',
        category: 'network',
      },
      {
        id: 'nodata',
        description: 'No traffic on interface during interval',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'rejected-udp',
        description: 'Blocked DNS probes, SNMP scans',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'accepted-icmp',
        description: 'Ping, traceroute, path MTU discovery',
        frequency: '~2%',
        category: 'network',
      },
      {
        id: 'rejected-icmp',
        description: 'Blocked external pings, ICMP probes',
        frequency: '~1%',
        category: 'network',
      },
      {
        id: 'skipdata',
        description: 'Internal capacity skip during aggregation',
        frequency: '~1%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Weighted port distributions — HTTPS dominates at ~35%, followed by DNS, HTTP, SSH, and 17 other services',
      'Lognormal traffic volumes — packets and bytes follow lognormal distributions; bulk transfers produce 10KB–500MB flows',
      'Network direction detection — classifies flows as inbound, outbound, internal, or external based on RFC 1918 analysis',
      'Multi-account environment — 3 AWS accounts (production, staging, development) across 5 regions',
      '15 network interfaces spanning 3 VPCs with EC2, NAT gateway, ALB, Lambda, and ECS task ENI types',
      'Raw log preservation — event.original contains the v2 space-delimited format matching CloudWatch/S3 delivery',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'c4d5e6f7-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Accepted TCP Connection (HTTPS)',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "cloud": {
        "account": { "id": "123456789012", "name": "acme-production" },
        "availability_zone": "use1-az2",
        "provider": "aws",
        "region": "us-east-1"
    },
    "event": {
        "action": "accept",
        "category": ["network"],
        "dataset": "aws.vpcflow",
        "outcome": "success",
        "type": ["connection", "allowed"]
    },
    "network": {
        "bytes": 18560,
        "direction": "outbound",
        "iana_number": "6",
        "transport": "tcp"
    },
    "source": { "ip": "10.0.1.47", "port": 49832 },
    "destination": { "ip": "52.94.233.17", "port": 443 }
}`,
      },
    ],
  };
