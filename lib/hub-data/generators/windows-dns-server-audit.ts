/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDnsServerAudit: GeneratorMeta = {
  slug: 'windows-dns-server-audit',
  displayName: 'Microsoft DNS Server Audit',
  category: 'network',
  description:
    'Windows DNS Audit policy events and ETW Analytical queries in parsed ECS JSON, including a switchable short Ignore-policy burst.',
  dataSource: 'Microsoft DNS Server Audit and Analytical channels',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    '256/257/259 ETW field sets based on collector fixtures',
    'Linked DNS queries and valid response packet bytes',
    'One switchable short Ignore-policy lifecycle',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 3,600 routine transactions, a policy creation is followed by three 256/259 pairs and policy deletion in three seconds; background has the same policy with sparse ignored queries.',
  generatorId: 'windows-dns-server-audit',
  eventTypes: [
    {
      id: '256',
      description: 'Incoming DNS query',
      frequency: 'One per routine transaction; also precedes ignored queries',
      category: 'network',
    },
    {
      id: '257',
      description: 'Successful A reply',
      frequency: 'Most routine transactions',
      category: 'network',
    },
    {
      id: '259',
      description: 'Policy-matched query with no reply',
      frequency:
        'Three sparse baseline occurrences; three extra in anomaly mode',
      category: 'network',
    },
    {
      id: '577',
      description: 'Create server-level Ignore policy',
      frequency: 'One baseline; one extra in anomaly mode',
      category: 'configuration',
    },
    {
      id: '580',
      description: 'Delete server-level Ignore policy',
      frequency: 'One baseline; one extra in anomaly mode',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Audit and Analytical channels retain distinct event IDs and provider fields.',
    '256/257 and 256/259 pairs share QNAME, XID and client; successful replies have valid DNS packet bytes.',
    'The same policy, client and QNAME occur in both modes at different intervals.',
    'Policy-hit 259 values and a full 580 collector record await native capture; output is parsed JSON, not XML or ETL.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dns-01.corp.example',
      description: 'DNS server name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.53',
      description: 'DNS server address',
    },
    {
      name: 'admin_name',
      defaultValue: 'DNSAdmin',
      description: 'Policy-change actor',
    },
    {
      name: 'client_ip',
      defaultValue: '10.20.4.17',
      description: 'Client for ignored queries',
    },
    {
      name: 'normal_zone',
      defaultValue: 'corp.example',
      description: 'Authoritative DNS zone',
    },
    {
      name: 'anomaly_zone',
      defaultValue: 'updates.corp.example',
      description: 'Ignore-policy QNAME suffix',
    },
    {
      name: 'policy_name',
      defaultValue: 'ShadowIgnore',
      description: 'Policy name in both modes',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '3600',
      description: 'Routine transactions before the short sequence',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the short burst; false emits baseline only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ignored DNS query',
      json: String.raw`{
  "@timestamp": "2026-09-25T18:53:12.003000+00:00",
  "data_stream": {
    "dataset": "microsoft_dnsserver.analytical",
    "namespace": "default",
    "type": "logs"
  },
  "dns": {
    "id": "51115",
    "question": {
      "name": "beacon.updates.corp.example",
      "registered_domain": "corp.example",
      "top_level_domain": "example",
      "type": "A"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "category": [
      "network"
    ],
    "code": "259",
    "dataset": "microsoft_dnsserver.analytical",
    "kind": "event",
    "provider": "Microsoft-Windows-DNSServer",
    "severity": 2,
    "type": [
      "protocol"
    ]
  },
  "host": {
    "hostname": "dns-01.corp.example",
    "ip": [
      "10.20.0.53"
    ],
    "name": "dns-01.corp.example",
    "os": {
      "family": "windows",
      "name": "Windows Server 2022 Datacenter",
      "platform": "windows",
      "type": "windows"
    }
  },
  "input": {
    "type": "etw"
  },
  "log": {
    "file": {
      "path": "Microsoft-Windows-DNSServer-Analytical.etl"
    },
    "level": "error"
  },
  "message": "IGNORED_QUERY: TCP=0; InterfaceIP=10.20.0.53; Source=10.20.4.17; Reason=Policy; QNAME=beacon.updates.corp.example.; QTYPE=1; XID=51115; Zone=corp.example; PolicyName=ShadowIgnore; AdditionalInfo = VirtualizationInstance: .",
  "microsoft_dnsserver": {
    "analytical": {
      "additional_info": ".",
      "description": "Ignored query",
      "interface_ip": "10.20.0.53",
      "policy_name": "ShadowIgnore",
      "question_name": "beacon.updates.corp.example.",
      "question_type": "A",
      "reason": "Policy",
      "source": {
        "ip": "10.20.4.17"
      },
      "xid": "51115",
      "zone": "corp.example"
    }
  },
  "related": {
    "ip": [
      "10.20.4.17"
    ]
  },
  "source": {
    "ip": "10.20.4.17"
  },
  "winlog": {
    "channel": "Microsoft-Windows-DNS-Server/Analytical",
    "event_data": {
      "AdditionalInfo": ".",
      "InterfaceIP": "10.20.0.53",
      "PolicyName": "ShadowIgnore",
      "QNAME": "beacon.updates.corp.example.",
      "QTYPE": "1",
      "Reason": "Policy",
      "Source": "10.20.4.17",
      "TCP": "0",
      "XID": "51115",
      "Zone": "corp.example"
    },
    "flags": [
      "64_BIT_HEADER",
      "EXTENDED_INFO",
      "PROCESSOR_INDEX"
    ],
    "flags_raw": "0x241",
    "keywords": [
      "IGNORED_QUERY"
    ],
    "keywords_raw": "0x8000000000000008",
    "level": "Error",
    "level_raw": 2,
    "opcode_raw": 0,
    "provider_guid": "{eb79061a-a566-4698-9119-3ed2807060e7}",
    "provider_message": "Microsoft-Windows-DNS-Server",
    "provider_name": "Microsoft-Windows-DNSServer",
    "session": "Microsoft-Windows-DNSServer-Analytical.etl",
    "task": "LOOK_UP",
    "task_raw": 1,
    "version": 0
  }
}`,
    },
  ],
};
