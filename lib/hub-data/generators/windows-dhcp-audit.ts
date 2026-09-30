/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDhcpAudit: GeneratorMeta = {
  slug: 'windows-dhcp-audit',
  displayName: 'Microsoft DHCP Server CSV Audit Log',
  category: 'network',
  description:
    'Microsoft DHCP Server IPv4 audit log (DhcpSrvLog-<Day>.log, 19-column CSV) as parsed ECS JSON with the native row in event.original: lease and DNS-update traffic of 970 Windows clients in two scopes, about 12,900 rows a day with a working-day peak. Not Windows Event Log or IPv6. Recurring episodes show one laptop churning through three more addresses of its own within minutes before its last DNS registration fails.',
  dataSource:
    'Microsoft DHCP Server IPv4 audit log (DhcpSrvLog 19-column CSV), server in UTC',
  eventFormat: 'ECS JSON',
  originalFormat: 'CSV',
  eventCount: 6,
  templateCount: 1,
  generatorId: 'windows-dhcp-audit',
  highlights: [
    'Native 19-column DHCP audit row in event.original',
    '970 clients with their own sessions, link flaps and address sets',
    'Recurring three-address churn ending in a failed DNS update',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Eight rows for one laptop: Release of its current address, Assign and Release of a second, Assign and Release of a third, Assign of a fourth, then a DNS update request and failure (ID 31) for the last address. The three new addresses are the laptop's other three, in random order, and an episode spans about 5-30 minutes. Episodes recur every anomaly_interval_hours (default 24, minimum 4) of event time: the first is due within the first min(interval, 24 h), each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards busy hours. An episode starts at its due time and waits only when no laptop is online; a missed episode is not replayed. The laptop is an online one other than the previous episode's client, more often one that flaps more; if its session ends inside the flap (about one episode in 25), the episode stays incomplete. Each episode adds a link flap of its own, so chain parts are about one per episode more frequent than with anomaly_mode false. Every element also occurs alone in background; when ordinary flaps form the same churn within one hour, the last DNS update succeeds (ID 32).",
  eventTypes: [
    {
      id: '11',
      description: 'Renew: an active lease reaches T1',
      frequency: '30.8% of rows',
      category: 'network',
    },
    {
      id: '10',
      description: 'Assign: session start, or reconnect inside a link flap',
      frequency: '14.4% of rows',
      category: 'network',
    },
    {
      id: '12',
      description: 'Release: session end, or the disconnect of a link flap',
      frequency: '14.4% of rows',
      category: 'network',
    },
    {
      id: '30',
      description:
        'DNS Update Request after 55% of assignments and 40% of renewals',
      frequency: '20.2% of rows',
      category: 'network',
    },
    {
      id: '32',
      description:
        'DNS Update Successful: result of a request, same host and IP',
      frequency: '18.9% of rows',
      category: 'network',
    },
    {
      id: '31',
      description: 'DNS Update Failed: result of a request, native error 10054',
      frequency: '1.3% of rows',
      category: 'network',
    },
  ],
  realismFeatures: [
    '840 desktops and VDI machines in 10.20.16.0/20 and 130 laptops in 10.20.32.0/22, each with its own set of four addresses in its scope. The sets do not overlap, so an address is never held by two clients.',
    'Each client has its own sessions: Assign, renewal 0-30 minutes after T1, Release. Session length is lognormal (median 4 h for laptops, 30 h for desktops), the offline gap has a median of 2 h / 50 min, and connects follow an hour-of-day curve high from 08:00 to 17:00 UTC.',
    'While a client is active, link flaps (Release, then Assign about a minute later, with probability 0.4 another flap a few minutes later) come once per 1.5-4 h for laptops and once per 15-60 h for desktops, less often at night. A reassignment changes the address with probability 0.7 for laptops and 0.2 for desktops, so fast Release-Assign pairs, multi-cycle bursts and address changes occur in background.',
    'About 12,900 rows a day: 9,000 around the clock and 3,900 on a working-day curve peaking around 12:30 UTC, from about 360 rows an hour at night to about 800 at midday. Renewals and DNS updates dominate the night, connects and flaps the working day.',
    'DNS request and result follow their Assign or Renew a few seconds apart (median about 5 s), where a real server usually writes them in the same second; about 8% of request and result pairs share one second. A result fails with probability 0.06, or 0.5 within three hours of a failure of the same client. Assign/Renew carry vendor class MSFT 5.0; DNS rows have no MAC, transaction ID 0 and QResult 6.',
    'Only IDs 10/11/12/30/31/32 are emitted: no lease expiry, NACKs, conflicts, relay, failover, service start/stop, file headers or IPv6. Each client keeps a fixed address set, while a real server reuses addresses between clients, and no lease expires. No correlated native capture of this scenario or of an identified Windows Server build exists.',
    'Filebeat identity, host and observer MACs and the event.ingested delay are synthetic; log.offset counts emitted rows per UTC date without file headers, and related.ip / related.hosts are added although the Elastic integration pipeline does not set them. Session, flap, DNS and failure rates, the hour curve and the daily volume are synthetic choices.',
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
  "@timestamp": "2026-09-25T14:28:40+00:00",
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
    "ingested": "2026-09-25T14:28:41.538596+00:00",
    "kind": "event",
    "original": "12,09/25/26,14:28:40,Release,10.20.32.189,nb-finance-010.corp.example,0023DFA8FECF,,418295063,0,,,,,,,,,0",
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
    "offset": 973827
  },
  "message": "Release",
  "microsoft": {
    "dhcp": {
      "dns_error_code": "0",
      "result": "0",
      "result_description": "NoQuarantine",
      "transaction_id": "418295063"
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
      "nb-finance-010.corp.example"
    ],
    "ip": [
      "10.20.32.189"
    ]
  },
  "source": {
    "address": "nb-finance-010.corp.example",
    "domain": "nb-finance-010.corp.example",
    "ip": "10.20.32.189",
    "mac": "00-23-DF-A8-FE-CF"
  },
  "tags": [
    "preserve_original_event",
    "microsoft_dhcp"
  ]
}`,
    },
  ],
};
