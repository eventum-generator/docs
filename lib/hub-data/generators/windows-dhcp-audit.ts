/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDhcpAudit: GeneratorMeta = {
  slug: 'windows-dhcp-audit',
  displayName: 'Microsoft DHCP Server CSV Audit Log',
  category: 'network',
  description:
    'Microsoft DHCP Server IPv4 audit log (DhcpSrvLog-<Day>.log, 19-column CSV) as parsed ECS JSON with the native row in event.original, for lease and DNS-update traffic of 97 Windows clients in two scopes. Not Windows Event Log or IPv6. Recurring episodes show one laptop churning through three more addresses within minutes before its last DNS registration fails.',
  dataSource:
    'Microsoft DHCP Server IPv4 audit log (DhcpSrvLog 19-column CSV), server in UTC',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'windows-dhcp-audit',
  highlights: [
    'Native 19-column DHCP audit row in event.original',
    '97 clients with their own sessions, link flaps and address sets',
    'Recurring three-address churn ending in a failed DNS update',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Eight rows for one laptop: Release of the current address, Assign and Release of a second, Assign and Release of a third, Assign of a fourth, then a DNS update request and failure for the last address. Episodes recur every 24 hours by default (anomaly_interval_hours, minimum 4) of source time: the first due time falls within the first min(interval, 24 h), each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted to busy hours. The episode takes over the next background link flap of a laptop other than the previous episode client, so it starts after a random wait; missed episodes are not replayed, and a session ending inside the burst leaves the episode incomplete. Measured episodes span 5-17 minutes. Every element also occurs in background; a background DNS result that would complete the sequence within one hour is written as success.',
  eventTypes: [
    {
      id: '11',
      description: 'Renew: an active lease reaches T1',
      frequency: '35.2% measured share',
      category: 'network',
    },
    {
      id: '10',
      description: 'Assign: session start, or reconnect inside a link flap',
      frequency: '17.7% measured share',
      category: 'network',
    },
    {
      id: '12',
      description: 'Release: session end, or the disconnect of a link flap',
      frequency: '17.7% measured share',
      category: 'network',
    },
    {
      id: '30',
      description:
        'DNS Update Request after 55% of assignments and 12% of renewals',
      frequency: '14.7% measured share',
      category: 'network',
    },
    {
      id: '32',
      description: 'DNS Update Successful for the request, same host and IP',
      frequency: '13.7% measured share',
      category: 'network',
    },
    {
      id: '31',
      description: 'DNS Update Failed for the request, native error 10054',
      frequency: '0.9% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    '84 desktops and VDI machines in 10.20.4.0/23 and 13 laptops in 10.20.7.0/24, each with its own non-overlapping set of four addresses, so an address is never held by two clients.',
    'Each client runs its own sessions: Assign, renewal at T1 plus a short delay, Release; lognormal session length (median 4 h for laptops, 30 h for desktops) and offline gaps, thinned by an hour-of-day curve high from 08:00 to 17:00 UTC.',
    'Link flaps (Release, then Assign after a median 45 s, sometimes repeated) arrive at a per-client rate and may move the client to another address of its set, so fast Release-Assign pairs, multi-cycle bursts and address changes occur in background.',
    'DNS requests follow their lease event and results follow the request after a few seconds; a result fails with probability 0.06, or 0.5 after a recent failure of the same client. Assign/Renew carry vendor class MSFT 5.0; DNS rows have no MAC, transaction ID 0 and QResult 6.',
    'Only IDs 10/11/12/30/31/32 are emitted: no lease expiry, NACKs, conflicts, relay, failover, service lifecycle, file headers or IPv6. No correlated native capture of this scenario or of an identified Windows Server build exists.',
    'Collector fields (Filebeat identity, host and observer MACs, log.offset per UTC date, event.ingested delay) and all session, flap, DNS and failure rates are synthetic choices.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dhcp-01.corp.example',
      description:
        'DHCP server name (host.name, observer.hostname, agent.name)',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'DHCP server IPv4 address',
    },
    {
      name: 'lease_renew_minutes',
      defaultValue: '240',
      description: 'T1 in minutes, 60-5,760; the modeled lease lasts twice T1',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Recurring episodes mixed with background; false for background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, 4-8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'First Release of an episode',
      json: String.raw`{
  "@timestamp": "2026-09-25T11:45:59+00:00",
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
    "ingested": "2026-09-25T11:46:01.840189+00:00",
    "kind": "event",
    "original": "12,09/25/26,11:45:59,Release,10.20.7.209,nb-finance-02.corp.example,0023DFA72F49,,555229266,0,,,,,,,,,0",
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
      "path": "C:\\Windows\\System32\\Dhcp\\DhcpSrvLog-Fri.log"
    },
    "offset": 61406
  },
  "message": "Release",
  "microsoft": {
    "dhcp": {
      "dns_error_code": "0",
      "result": "0",
      "result_description": "NoQuarantine",
      "transaction_id": "555229266"
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
      "nb-finance-02.corp.example"
    ],
    "ip": [
      "10.20.7.209"
    ]
  },
  "source": {
    "address": "nb-finance-02.corp.example",
    "domain": "nb-finance-02.corp.example",
    "ip": "10.20.7.209",
    "mac": "00-23-DF-A7-2F-49"
  },
  "tags": [
    "preserve_original_event",
    "microsoft_dhcp"
  ]
}`,
    },
  ],
};
