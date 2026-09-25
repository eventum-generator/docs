/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDnsServerAudit: GeneratorMeta = {
  slug: 'windows-dns-server-audit',
  displayName: 'Microsoft DNS Server Audit',
  category: 'network',
  description:
    'Windows DNS Audit and Analytical events: configuration changes, queries and responses, with a switchable Ignore-policy disruption chain.',
  dataSource: 'Windows DNS Server Audit and Analytical channels',
  format: ['JSON', 'ECS', 'Windows Event Log'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'windows-dns-server-audit',
  highlights: [
    '63/63 selected Elastic reference fields',
    'Paired query/response XIDs',
    'Short-lived Ignore policy anomaly',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Ignore policy created for a domain, three queries without responses, then policy deleted on the same DNS server.',
  eventTypes: [
    {
      id: '256 → 257',
      description: 'Paired DNS query and response',
      frequency: '85% routine starts',
      category: 'network',
    },
    {
      id: '536',
      description: 'Cache record purged',
      frequency: '8% routine',
      category: 'configuration',
    },
    {
      id: '514',
      description: 'Zone updated',
      frequency: '5% routine',
      category: 'configuration',
    },
    {
      id: '540',
      description: 'Root hints modified',
      frequency: '2% routine',
      category: 'configuration',
    },
    {
      id: '577 → 580',
      description: 'Policy created then deleted',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Audit and Analytical channels retain native event IDs and field names.',
    'Normal DNS query and response share QNAME and XID.',
    'Anomaly ties the Ignore policy criteria to unanswered query names.',
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
      description: 'Audit actor',
    },
    {
      name: 'client_ip',
      defaultValue: '10.20.4.17',
      description: 'Anomaly query source',
    },
    {
      name: 'normal_zone',
      defaultValue: 'corp.example',
      description: 'Routine DNS zone',
    },
    {
      name: 'anomaly_zone',
      defaultValue: 'updates.corp.example',
      description: 'Targeted DNS zone',
    },
    {
      name: 'policy_name',
      defaultValue: 'ShadowIgnore',
      description: 'Short-lived policy name',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine starts between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit anomaly chain alongside background; false keeps background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'DNS Ignore policy created',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:34:02+00:00",
  "data_stream": {
    "dataset": "microsoft_dnsserver.audit",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "POLICY_OP",
    "agent_id_status": "verified",
    "category": [
      "configuration"
    ],
    "code": "577",
    "created": "2026-09-25T14:34:02+00:00",
    "dataset": "microsoft_dnsserver.audit",
    "ingested": "2026-09-25T14:34:02+00:00",
    "kind": "event",
    "provider": "Microsoft-Windows-DNSServer",
    "sequence": 9812,
    "type": [
      "creation"
    ]
  },
  "host": {
    "architecture": "x86_64",
    "hostname": "dns-01.corp.example",
    "id": "d0500000-1111-4444-8888-123456789abc",
    "ip": [
      "10.20.0.53"
    ],
    "mac": [
      "02-42-AC-11-00-53"
    ],
    "name": "dns-01.corp.example",
    "os": {
      "build": "20348.2322",
      "family": "windows",
      "kernel": "10.0.20348.2322 (WinBuild.160101.0800)",
      "name": "Windows Server 2022 Datacenter",
      "platform": "windows",
      "type": "windows",
      "version": "10.0"
    }
  },
  "input": {
    "type": "winlog"
  },
  "log": {
    "level": "information"
  },
  "message": "A server level policy ShadowIgnore for Query processing has been created on server dns-01.corp.example with following properties: Processing order:1; Criteria:FQDN=EQ,*.updates.corp.example; Action:Ignore; Condition:And; IsEnabled:True.",
  "microsoft_dnsserver": {
    "audit": {
      "action": "Ignore",
      "condition": "And",
      "criteria": "FQDN=EQ,*.updates.corp.example",
      "is_enabled": "True",
      "name_server": "dns-01.corp.example",
      "policy": "ShadowIgnore",
      "processing_order": "1",
      "type": "Query processing"
    }
  },
  "process": {
    "pid": 852,
    "thread": {
      "id": 7708
    }
  },
  "related": {
    "user": [
      "DNSAdmin"
    ]
  },
  "tags": [
    "preserve_duplicate_custom_fields"
  ],
  "user": {
    "name": "DNSAdmin"
  },
  "winlog": {
    "api": "wineventlog",
    "channel": "Microsoft-Windows-DNSServer/Audit",
    "computer_name": "dns-01.corp.example",
    "event_data": {
      "Action": "Ignore",
      "Condition": "And",
      "Criteria": "FQDN=EQ,*.updates.corp.example",
      "IsEnabled": "True",
      "Policy": "ShadowIgnore",
      "ProcessingOrder": "1",
      "ServerName": "dns-01.corp.example",
      "Type": "Query processing"
    },
    "event_id": "577",
    "keywords": [
      "AUDIT_POLICY"
    ],
    "opcode": "Info",
    "provider_guid": "{eb79061a-a566-4698-9119-3ed2807060e7}",
    "provider_name": "Microsoft-Windows-DNSServer",
    "record_id": "9812",
    "task": "POLICY_OP",
    "user": {
      "domain": "dns-01.corp.example",
      "identifier": "S-1-5-21-1000000000-1000000000-1000000000-500",
      "name": "DNSAdmin",
      "type": "User"
    }
  }
}`,
    },
  ],
};
