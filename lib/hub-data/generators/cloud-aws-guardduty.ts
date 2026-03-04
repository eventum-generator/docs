import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudAwsGuardduty: GeneratorMeta = {
    slug: 'cloud-aws-guardduty',
    displayName: 'AWS GuardDuty Findings',
    category: 'cloud',
    description:
      'AWS GuardDuty threat detection findings across EC2, IAM, and S3 resources. Covers 8 categories — Recon, UnauthorizedAccess, Policy, Trojan, Impact, CryptoCurrency, Stealth, and Backdoor — with 27 finding types, 10 threat actor IPs, and geo/ASN enrichment.',
    format: ['JSON', 'ECS'],
    dataSource: 'AWS GuardDuty',
    eventCount: 27,
    templateCount: 16,
    highlights: [
      '8 finding categories',
      '3 resource types (EC2, IAM, S3)',
      '10 threat actor IPs with geo data',
      'Multi-account environment',
    ],
    generatorId: 'guardduty',
    eventTypes: [
      {
        id: 'Recon:EC2/PortProbeUnprotectedPort',
        description: 'Unprotected port being probed by malicious host',
        frequency: '~15%',
        category: 'recon',
      },
      {
        id: 'Recon:IAMUser/TorIPCaller',
        description: 'API invoked from Tor exit node or malicious IP',
        frequency: '~10%',
        category: 'recon',
      },
      {
        id: 'UnauthorizedAccess:EC2/MaliciousIPCaller.Custom',
        description: 'EC2 instance communicating with disallowed IP',
        frequency: '~12%',
        category: 'unauthorized-access',
      },
      {
        id: 'UnauthorizedAccess:IAMUser/ConsoleLoginSuccess.B',
        description: 'Unusual console login from new principal',
        frequency: '~8%',
        category: 'unauthorized-access',
      },
      {
        id: 'Policy:S3/BucketBlockPublicAccessDisabled',
        description: 'S3 bucket public access block disabled',
        frequency: '~10%',
        category: 'policy',
      },
      {
        id: 'Trojan:EC2/DGADomainRequest.B',
        description: 'EC2 querying algorithmically generated domains',
        frequency: '~5%',
        category: 'trojan',
      },
      {
        id: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
        description: 'EC2 querying Bitcoin mining pool domains',
        frequency: '~4%',
        category: 'cryptocurrency',
      },
      {
        id: 'Backdoor:EC2/DenialOfService.Tcp',
        description: 'EC2 may be participating in TCP DDoS attack',
        frequency: '~2.5%',
        category: 'backdoor',
      },
    ],
    realismFeatures: [
      'Jinja2 macros eliminate boilerplate across 16 templates',
      '8 finding categories — Recon (25%), UnauthorizedAccess (20%), Policy (15%), Trojan (10%), Impact (10%), CryptoCurrency (8%), Stealth (7%), Backdoor (5%)',
      '3 resource types — Instance (EC2), AccessKey (IAM), S3Bucket with complete metadata',
      '4 action types — NETWORK_CONNECTION, PORT_PROBE, AWS_API_CALL, DNS_REQUEST',
      'Multi-account environment — 3 AWS accounts (production, staging, development)',
      '15 EC2 instances with private/public IPs, VPC/subnet/security group details',
      '10 threat actor IPs from 8 countries with ASN/ISP/geo data, including Tor exit nodes',
      '14 malicious DNS domains — DGA-generated, crypto mining pools, C&C servers',
      'Temporal realism — first_seen/last_seen windows spanning 1-72 hours',
      'ECS rule fields — rule.category, rule.name, rule.ruleset for SIEM correlation',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'b2c3d4e5-...',
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
        title: 'Recon:EC2/PortProbeUnprotectedPort',
        json: `{
    "@timestamp": "2026-03-04T18:45:12.000Z",
    "aws": {
        "guardduty": {
            "account_id": "123456789012",
            "description": "EC2 instance i-0a1b2c3d4e5f67890 has an unprotected port which is being probed by a known malicious host.",
            "resource": {
                "instance_details": {
                    "instance_id": "i-0a1b2c3d4e5f67890",
                    "instance_type": "t3.medium",
                    "iam_instance_profile": {
                        "arn": "arn:aws:iam::123456789012:instance-profile/web-server-prod",
                        "id": "AIPA1A2B3C4D5E6F7G8H9"
                    },
                    "platform": null
                },
                "type": "Instance"
            },
            "service": {
                "action": {
                    "port_probe_action": {
                        "blocked": false,
                        "port_probe_details": [{
                            "local_port_details": {"port": 22, "port_name": "SSH"},
                            "remote_ip_details": {
                                "ip_address_v4": "198.51.100.200",
                                "organization": {"asn": "12389", "asnorg": "Rostelecom", "isp": "Rostelecom", "org": "Rostelecom"}
                            }
                        }]
                    },
                    "type": "PORT_PROBE"
                }
            },
            "confidence": 4.2,
            "severity": {"code": 2, "value": "Low"},
            "type": "Recon:EC2/PortProbeUnprotectedPort"
        }
    },
    "cloud": {
        "account": {"id": "123456789012"},
        "provider": "aws",
        "region": "us-east-1",
        "service": {"name": "guardduty"}
    },
    "event": {
        "action": "PORT_PROBE",
        "dataset": "aws.guardduty",
        "kind": "event",
        "module": "aws",
        "severity": 2,
        "type": ["info"]
    },
    "rule": {
        "category": "Recon",
        "name": "Recon:EC2/PortProbeUnprotectedPort",
        "ruleset": "Recon:EC2"
    }
}`,
      },
    ],
  };
