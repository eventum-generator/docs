import type { GeneratorMeta } from '@/lib/hub-types';

export const networkWatchguardFirebox: GeneratorMeta = {
  slug: 'network-watchguard-firebox',
  displayName: 'WatchGuard Firebox Traffic Logs',
  category: 'network',
  description: 'Firebox HTTP, ICMP, and SSL VPN-port traffic log bodies.',
  dataSource: 'WatchGuard Firebox traffic Syslog',
  format: ['Syslog body', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'WatchGuard-published Allow and Deny log shapes',
    'Five correlated denies to a Firebox SSL VPN port',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One external IP makes five denied TCP attempts to the Firebox SSL VPN port in five seconds.',
  generatorId: 'firebox',
  eventTypes: [
    {
      id: '3000-0176',
      description: 'HTTP proxy Allow',
      frequency: '~85% routine',
      category: 'network',
    },
    {
      id: '3000-0148',
      description: 'ICMP Deny to Firebox',
      frequency: '~15% routine',
      category: 'network',
    },
    {
      id: '3000-0148',
      description: 'SSL VPN-port TCP Deny',
      frequency: 'Anomaly only',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Vendor-documented positional and key-value fields',
    'Distinct source ports across the denied TCP burst',
    'No invented login outcome for firewall-level denials',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable SSL VPN-port deny burst.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between bursts.',
    },
    {
      name: 'device_name',
      defaultValue: 'firebox-edge',
      description: 'Synthetic Firebox name in ECS.',
    },
    {
      name: 'vpn_source_ip',
      defaultValue: '192.0.2.99',
      description: 'External source in chain.',
    },
    {
      name: 'vpn_firebox_ip',
      defaultValue: '203.0.113.250',
      description: 'Firebox destination in chain.',
    },
    {
      name: 'vpn_port',
      defaultValue: '9007',
      description: 'SSL VPN port from vendor example.',
    },
  ],
  sampleOutputs: [
    {
      title: 'WatchGuard anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:52:38+00:00",
  "destination": {
    "ip": "203.0.113.250",
    "port": 9007
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "traffic_deny",
    "category": [
      "network"
    ],
    "code": "3000-0148",
    "dataset": "watchguard.firebox.traffic",
    "kind": "event",
    "original": "2026-09-25 13:52:38 Deny 192.0.2.99 203.0.113.250 9007/tcp 31069 9007 External1 Firebox Denied 52 51 (Unhandled External Packet-00) proc_id=\"firewall\" rc=\"101\" msg_id=\"3000-0148\" tcp_info=\"offset 8 S 2192251295 win 65535\"",
    "type": [
      "denied"
    ]
  },
  "network": {
    "transport": "tcp"
  },
  "observer": {
    "name": "firebox-edge",
    "product": "Firebox",
    "vendor": "WatchGuard"
  },
  "related": {
    "ip": [
      "192.0.2.99",
      "203.0.113.250"
    ]
  },
  "rule": {
    "name": "Unhandled External Packet-00"
  },
  "source": {
    "ip": "192.0.2.99",
    "port": 31069
  },
  "watchguard": {
    "firebox": {
      "reason": "Unhandled External Packet-00",
      "return_code": "101"
    }
  }
}`,
    },
  ],
};
