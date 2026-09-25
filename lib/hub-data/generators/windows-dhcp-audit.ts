/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDhcpAudit: GeneratorMeta = {
  slug: 'windows-dhcp-audit',
  displayName: 'Microsoft DHCP Server Audit',
  category: 'network',
  description:
    'Windows DHCP CSV lease and DNS-update records, with a switchable rapid lease-churn and update-failure sequence.',
  dataSource: 'Windows DHCP Server DhcpSrvLog CSV',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'windows-dhcp-audit',
  highlights: [
    '40/40 Elastic sample fields',
    'Native CSV in event.original',
    'Correlated lease churn by client ID',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client ID rapidly receives and releases three addresses, then its DNS update fails.',
  eventTypes: [
    {
      id: '10',
      description: 'Lease assigned',
      frequency: '45% routine',
      category: 'network',
    },
    {
      id: '11',
      description: 'Lease renewed',
      frequency: '30% routine',
      category: 'network',
    },
    {
      id: '12',
      description: 'Lease released',
      frequency: '8% routine',
      category: 'network',
    },
    {
      id: '30',
      description: 'DNS update requested',
      frequency: '8% routine',
      category: 'network',
    },
    {
      id: '32',
      description: 'DNS update succeeded',
      frequency: '5% routine',
      category: 'network',
    },
    {
      id: '31',
      description: 'DNS update failed',
      frequency: '2% routine',
      category: 'network',
    },
    {
      id: '36',
      description: 'Failover/client-ID hash drop',
      frequency: '2% routine',
      category: 'network',
    },
  ],
  realismFeatures: [
    'CSV column order follows the Elastic DHCP fixture.',
    'Fifty clients provide stable hostname, MAC and address combinations.',
    'Lease anomaly uses one client ID across changing addresses.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dhcp-01.corp.example',
      description: 'DHCP server name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'DHCP server address',
    },
    {
      name: 'anomaly_hostname',
      defaultValue: 'ws-finance-01.corp.example',
      description: 'Correlated client hostname',
    },
    {
      name: 'anomaly_client_id',
      defaultValue: '0023DF0000A1',
      description: 'Correlated client ID',
    },
    {
      name: 'anomaly_ips',
      defaultValue: '10.20.7.41–10.20.7.43',
      description: 'Successive addresses',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
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
      title: 'Failed DNS update after lease churn',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:00:09+00:00",
  "agent": {
    "ephemeral_id": "a1b2c3d4-1111-4444-8888-123456789abc",
    "id": "a1b2c3d4-1111-4444-8888-123456789abc",
    "name": "dhcp-01.corp.example",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "data_stream": {
    "dataset": "microsoft_dhcp.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "a1b2c3d4-1111-4444-8888-123456789abc",
    "snapshot": false,
    "version": "8.17.0"
  },
  "event": {
    "action": "dhcp-dns-update",
    "agent_id_status": "verified",
    "category": [
      "network"
    ],
    "code": "31",
    "dataset": "microsoft_dhcp.log",
    "ingested": "2026-09-25T12:00:09+00:00",
    "kind": "event",
    "original": "31,09/25/26,12:00:09,DNS Update Failed,10.20.7.43,ws-finance-01.corp.example,0023DF0000A1,,0,6,,,,,,,,,10054",
    "outcome": "failure",
    "reason": "DNS update failed.",
    "sequence": 257,
    "timezone": "UTC",
    "type": [
      "connection"
    ]
  },
  "host": {
    "ip": [
      "10.20.0.10"
    ],
    "mac": [
      "02-42-AC-11-00-10"
    ],
    "name": "dhcp-01.corp.example"
  },
  "input": {
    "type": "log"
  },
  "log": {
    "file": {
      "path": "C:\\Windows\\System32\\Dhcp\\DhcpSrvLog-Fri.log"
    },
    "offset": 23604
  },
  "message": "DNS Update Failed",
  "observer": {
    "hostname": "dhcp-01.corp.example",
    "ip": [
      "10.20.0.10"
    ],
    "mac": [
      "02-42-AC-11-00-10"
    ]
  },
  "related": {
    "hosts": [
      "ws-finance-01.corp.example"
    ],
    "ip": [
      "10.20.7.43"
    ]
  },
  "source": {
    "address": "ws-finance-01.corp.example",
    "domain": "ws-finance-01.corp.example",
    "ip": "10.20.7.43",
    "mac": "00-23-DF-00-00-A1"
  },
  "tags": [
    "preserve_original_event",
    "microsoft_dhcp"
  ]
}`,
    },
  ],
};
