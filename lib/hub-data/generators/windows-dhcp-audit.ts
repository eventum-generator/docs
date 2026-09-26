/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDhcpAudit: GeneratorMeta = {
  slug: 'windows-dhcp-audit',
  displayName: 'Microsoft DHCP Server Audit',
  category: 'network',
  description:
    'Windows DHCP IPv4 audit CSV with causal leases, DNS update pairs and recurring daily address churn in a bounded 97-client model.',
  dataSource: 'Windows DHCP Server DhcpSrvLog 19-column CSV profile',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'windows-dhcp-audit',
  highlights: [
    'Six selected IDs in the 19-column IPv4 CSV variant',
    'Stateful lease expiry, renewal and DNS request/result linkage',
    'Eight-row address-churn episodes recur every 24 hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, after pending DNS completes and the target has a live lease, a release precedes three distinct assignments with two intervening releases, then a linked DNS request and failure. Eight records take less than seven minutes. Four addresses and all classes also occur in background; a reconnect can defer the episode and recurrence resets at its actual first release. DNS rows join by host/IP/time because their native MAC is empty.',
  eventTypes: [
    {
      id: '10',
      description: 'Assign a new lease',
      frequency: 'After release or internal lease expiry; three per episode',
      category: 'network',
    },
    {
      id: '11',
      description: 'Renew the active lease at T1',
      frequency: 'Four-hour default T1 refreshes an eight-hour modeled lease',
      category: 'network',
    },
    {
      id: '12',
      description: 'Release the active matching client/IP lease',
      frequency: 'Mobile 2–24 hours; stationary 1–7 days; three per episode',
      category: 'network',
    },
    {
      id: '30',
      description: 'DNS update request for a lease hostname/IP',
      frequency: '30% of assignments and 5% of renewals',
      category: 'network',
    },
    {
      id: '32',
      description: 'Successful result for the preceding DNS request',
      frequency: '95% of modeled DNS results',
      category: 'network',
    },
    {
      id: '31',
      description: 'Failed result for the preceding DNS request',
      frequency: '5% of modeled DNS results and one per episode',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Ninety-seven lease slots, one pending DNS pair and bounded address/cursor state retain active client/IP ownership. Expired leases retire internally before reassignment; expiry IDs 17/18 are outside the emitted subset.',
    'One-minute input ticks use 0–59 second lease jitter. DNS requests follow their lease by 1–8 seconds, then results follow by another 1–8 seconds; pending pairs finish before other lease operations.',
    'The same client, four pool addresses, releases, assignments, renewals and DNS failures occur in both modes. Episode address order rotates without an extra native marker.',
    'Complete individual row examples now support Release with empty vendor columns; Assign/Renew use MSFT 5.0. DNS rows have no MAC, transaction ID 0/QResult 6; lease rows use nonzero synthetic transaction IDs / QResult 0.',
    'UTC source/ECS clocks and weekday filenames agree. Offsets count only emitted ASCII CRLF body rows and reset daily; Filebeat identities, MACs and immediate ingestion are synthetic collector metadata.',
    'BLOCKED_RAW_EVIDENCE: exact Windows Server build and complete correlated episode capture are missing. Field-path presence against an Elastic ID 35 sample does not validate the six selected IDs. IPv6, headers, failover and service lifecycle are omitted.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dhcp-01.corp.example',
      description: 'DHCP server identity',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'DHCP server identity',
    },
    {
      name: 'anomaly_hostname',
      defaultValue: 'ws-finance-01.corp.example',
      description: 'Client used in episodes and ordinary traffic',
    },
    {
      name: 'anomaly_client_id',
      defaultValue: '0023DF0000A1',
      description: 'Client used in episodes and ordinary traffic',
    },
    {
      name: 'anomaly_base_ip',
      defaultValue: '10.20.7.40',
      description: "Target's initial address, also in the rotating pool",
    },
    {
      name: 'anomaly_ips',
      defaultValue: '[10.20.7.41, 10.20.7.42, 10.20.7.43]',
      description: 'Three more pool addresses; their episode order varies',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Positive recurrence interval, clamped to at least one hour',
    },
    {
      name: 'lease_renew_minutes',
      defaultValue: '240',
      description:
        'T1, clamped to at least 240 minutes; full modeled lease is twice T1',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Periodic episodes mixed with background; `false` for background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Release of the current live lease',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:02:08+00:00",
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
    "action": "dhcp-release",
    "agent_id_status": "verified",
    "category": [
      "network"
    ],
    "code": "12",
    "dataset": "microsoft_dhcp.log",
    "ingested": "2026-09-26T00:02:08+00:00",
    "kind": "event",
    "original": "12,09/26/26,00:02:08,Release,10.20.7.42,ws-finance-01.corp.example,0023DF0000A1,,3812757102,0,,,,,,,,,0",
    "outcome": "success",
    "reason": "A lease was released by a client.",
    "timezone": "UTC",
    "type": [
      "allowed",
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
      "path": "C:\\Windows\\System32\\Dhcp\\DhcpSrvLog-Sat.log"
    },
    "offset": 0
  },
  "message": "Release",
  "microsoft": {
    "dhcp": {
      "dns_error_code": "0",
      "result": "0",
      "result_description": "NoQuarantine",
      "transaction_id": "3812757102"
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
      "10.20.7.42"
    ]
  },
  "source": {
    "address": "ws-finance-01.corp.example",
    "domain": "ws-finance-01.corp.example",
    "ip": "10.20.7.42",
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
