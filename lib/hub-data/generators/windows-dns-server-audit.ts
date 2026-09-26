/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDnsServerAudit: GeneratorMeta = {
  slug: 'windows-dns-server-audit',
  displayName: 'Microsoft DNS Server Audit',
  category: 'network',
  description:
    'Windows Server 2022 policy Audit and ETW Analytical DNS records, with authoritative packet bytes and recurring short Ignore-policy episodes.',
  dataSource: 'Windows Server 2022 DNS Server Audit and Analytical channels',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Five selected Audit/Analytical event IDs',
    'Linked authoritative A queries and response packet bytes',
    'Short policy episodes recur every six hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every six hours, an administrator creates an Ignore policy, three received/dropped query pairs follow ten seconds apart, then the policy is deleted after 30 seconds. Each lifecycle has a fresh UUID under the same name stem. Maintenance uses the same actors, clients, QNAME and classes with three sparse drops during a 30-minute policy; active maintenance can delay an episode.',
  generatorId: 'windows-dns-server-audit',
  eventTypes: [
    {
      id: '256',
      description: 'Incoming IPv4/UDP A query',
      frequency: 'One per ordinary transaction and before each policy drop',
      category: 'network',
    },
    {
      id: '257',
      description: 'Authoritative successful A answer, RA clear',
      frequency: 'Ordinary queries not matching the active Ignore policy',
      category: 'network',
    },
    {
      id: '259',
      description: 'Policy-matched query dropped without a reply',
      frequency: 'Three sparse maintenance hits and three per short episode',
      category: 'network',
    },
    {
      id: '577',
      description: 'Create an enabled server-level Ignore policy',
      frequency: 'About two-hour maintenance and six-hour short episodes',
      category: 'configuration',
    },
    {
      id: '580',
      description: 'Delete the existing policy by its live name',
      frequency: 'After each maintenance or short policy lifecycle',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Two records per ten-second tick model a query/completion pair. Responses are dated reception plus 3 ms, with matching XID, client, port, GUID, QNAME and decoded packet bytes.',
    'A pre-existing authoritative zone and eight immutable A records have QR/AA/RD, RA clear, RCODE 0, TTL 300 and one A answer. No zone or record mutation is emitted.',
    'One active policy and one pending query bound state. Recurrence waits for maintenance ownership and pair completion; overdue episodes do not catch up in a burst.',
    'The same policy-name pattern, renamed local administrator, client, QNAME and individual classes occur in both modes. Ordinary replies also use the configured client.',
    'Selected event_data coverage is 13/13 for 256, 20/20 for 257, 10/10 for 259 and 8/8 for 577. Ignored records have no native port, GUID or packet field.',
    'BLOCKED_POLICY_RAW_EVIDENCE: policy-hit Reason/PolicyName/Zone are inferred, full 580 collector and same-version policy traces are unavailable, and ElapsedTime units remain unproven. Output is parsed JSON, not XML/EVTX/ETL; synthetic timing and ETW collector context do not establish full native parity.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dns-01.corp.example',
      description: 'DNS server identity',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.53',
      description: 'DNS server identity',
    },
    {
      name: 'admin_name',
      defaultValue: 'DNSAdmin',
      description: 'Renamed local administrator, synthetic SID ending in 500',
    },
    {
      name: 'client_ip',
      defaultValue: '10.20.4.17',
      description: 'Client for drops and ordinary `www` queries',
    },
    {
      name: 'normal_zone',
      defaultValue: 'corp.example',
      description: 'Pre-existing authoritative zone',
    },
    {
      name: 'anomaly_zone',
      defaultValue: 'updates.corp.example',
      description: 'FQDN policy criterion and ignored-query suffix',
    },
    {
      name: 'policy_name',
      defaultValue: 'QueryFilter',
      description:
        'Name stem for maintenance and short policies, followed by a UUID',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '21600',
      description:
        'Positive recurrence interval, supported values at least 3,600 seconds',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enables repeated short policy episodes',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ignored DNS query during a short policy episode',
      json: String.raw`{
  "@timestamp": "2026-09-26T06:00:10.003000+00:00",
  "data_stream": {
    "dataset": "microsoft_dnsserver.analytical",
    "namespace": "default",
    "type": "logs"
  },
  "dns": {
    "id": "60082",
    "question": {
      "name": "beacon.updates.corp.example",
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
  "message": "IGNORED_QUERY: TCP=0; InterfaceIP=10.20.0.53; Source=10.20.4.17; Reason=Policy; QNAME=beacon.updates.corp.example.; QTYPE=1; XID=60082; Zone=corp.example; PolicyName=QueryFilter-5477cdbf-acff-49fa-9a3d-9b6362defce2; AdditionalInfo = VirtualizationInstance: .",
  "microsoft_dnsserver": {
    "analytical": {
      "additional_info": ".",
      "description": "Ignored query",
      "interface_ip": "10.20.0.53",
      "policy_name": "QueryFilter-5477cdbf-acff-49fa-9a3d-9b6362defce2",
      "question_name": "beacon.updates.corp.example.",
      "question_type": "A",
      "reason": "Policy",
      "source": {
        "ip": "10.20.4.17"
      },
      "xid": "60082",
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
      "PolicyName": "QueryFilter-5477cdbf-acff-49fa-9a3d-9b6362defce2",
      "QNAME": "beacon.updates.corp.example.",
      "QTYPE": "1",
      "Reason": "Policy",
      "Source": "10.20.4.17",
      "TCP": "0",
      "XID": "60082",
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
