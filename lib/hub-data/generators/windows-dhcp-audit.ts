/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDhcpAudit: GeneratorMeta = {
  slug: 'windows-dhcp-audit',
  displayName: 'Microsoft DHCP Server Audit',
  category: 'network',
  description:
    'Microsoft DHCP Server CSV lease and DNS-update records from a stateful 97-client model, with a switchable eight-row address-churn sequence.',
  dataSource: 'Windows DHCP Server DhcpSrvLog 19-column CSV profile',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'windows-dhcp-audit',
  highlights: [
    'Six documented DHCP event IDs in a 19-column CSV profile',
    'Stateful leases and linked DNS request/result pairs',
    'One switchable eight-row sequence amid overlapping background',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After at least 250 background rows, one client releases its lease, rapidly receives and releases two addresses, then receives a third address followed by a DNS request and failure. The sequence runs once.',
  eventTypes: [
    {
      id: '10',
      description: 'Lease assigned',
      frequency: 'Reassignment after release, plus linked sequence',
      category: 'network',
    },
    {
      id: '11',
      description: 'Lease renewed',
      frequency: 'No sooner than four hours after the prior lease event',
      category: 'network',
    },
    {
      id: '12',
      description: 'Lease released',
      frequency: 'Per-client timer; mobile and stationary ranges differ',
      category: 'network',
    },
    {
      id: '30',
      description: 'DNS update requested',
      frequency: '30% of assignments or 5% of renewals in the model',
      category: 'network',
    },
    {
      id: '32',
      description: 'DNS update succeeded',
      frequency: 'About 95% of modeled DNS requests',
      category: 'network',
    },
    {
      id: '31',
      description: 'DNS update failed',
      frequency: 'About 5% of modeled DNS requests; also in linked sequence',
      category: 'network',
    },
  ],
  realismFeatures: [
    'The 97-client pool retains per-client lease state across assignments, renewals and releases.',
    'DNS results follow a request for the same host and IP; native DNS rows leave the MAC column empty.',
    'The target client, addresses, event IDs and DNS error also occur in background; only the short order distinguishes the sequence.',
    'All 40 selected Elastic sample field paths occur across generated output; the sample is ID 35, which this pack does not emit.',
    'The ID 12 event meaning is documented, but its extended 19-column suffix is inferred pending a native capture.',
    'CSV timestamps are modeled in UTC; Filebeat identity, ingestion time and file offset are synthetic collector context.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dhcp-01.corp.example',
      description: 'DHCP server hostname',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'DHCP server address',
    },
    {
      name: 'anomaly_hostname',
      defaultValue: 'ws-finance-01.corp.example',
      description: 'Client also used in background',
    },
    {
      name: 'anomaly_client_id',
      defaultValue: '0023DF0000A1',
      description: 'Client ID also used in background',
    },
    {
      name: 'anomaly_base_ip',
      defaultValue: '10.20.7.40',
      description: "Target client's ordinary starting address",
    },
    {
      name: 'anomaly_ips',
      defaultValue: '10.20.7.41, 10.20.7.42, 10.20.7.43',
      description: 'Successive addresses also used after ordinary releases',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '250',
      description: 'Minimum background rows before the one-time sequence',
    },
    {
      name: 'lease_renew_minutes',
      defaultValue: '240',
      description: 'Renewal interval for the modeled eight-hour lease',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include one eight-row sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'DNS update failure after rapid lease changes',
      json: String.raw`{
  "@timestamp": "2026-09-25T08:57:13+00:00",
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
    "ingested": "2026-09-25T08:57:13+00:00",
    "kind": "event",
    "original": "31,09/25/26,08:57:13,DNS Update Failed,10.20.7.43,ws-finance-01.corp.example,,,0,6,,,,,,,,,10054",
    "outcome": "failure",
    "reason": "DNS update failed.",
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
    "offset": 31774
  },
  "message": "DNS Update Failed",
  "microsoft": {
    "dhcp": {
      "dns_error_code": "10054",
      "result": "6",
      "result_description": "No Quarantine Information",
      "transaction_id": "0"
    }
  },
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
    "ip": "10.20.7.43"
  },
  "tags": [
    "preserve_original_event",
    "microsoft_dhcp"
  ]
}`,
    },
  ],
};
