import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnSTerraGate: GeneratorMeta = {
  slug: 'vpn-s-terra-gate',
  displayName: 'S-Terra VPN Gate IKE',
  category: 'network',
  description:
    'VPN Gate 4.1 IKE security association creation and closure messages.',
  dataSource: 'S-Terra VPN Gate Syslog message bodies',
  format: ['Syslog body', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Vendor-documented IKE SA event IDs and message bodies',
    'Three linked short-lived SAs for one peer',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One peer creates and closes three IKE security associations within six records.',
  generatorId: 's-terra',
  eventTypes: [
    {
      id: '10000005',
      description: 'IKE SA created',
      frequency: '50% routine',
      category: 'network',
    },
    {
      id: '10000006',
      description: 'IKE SA closed',
      frequency: '50% routine',
      category: 'network',
    },
  ],
  realismFeatures: [
    'VPN Gate 4.1 message catalog IDs and INFO severity',
    'Stable peer identity and connection number across each create/close pair',
    'Message body only; no invented wire-level Syslog header',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable rapid IKE SA churn.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '56',
      description: 'Routine records before a six-record sequence.',
    },
    {
      name: 'gateway_name',
      defaultValue: 'vpn-gate-01',
      description: 'Synthetic VPN Gate identifier.',
    },
    {
      name: 'unstable_peer_ip',
      defaultValue: '198.51.100.44',
      description: 'Synthetic correlated peer.',
    },
  ],
  sampleOutputs: [
    {
      title: 'S-Terra IKE anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:10:07+00:00",
  "destination": {
    "domain": "unstable-branch.example",
    "ip": "198.51.100.44",
    "port": 500
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ike_sa_created",
    "category": [
      "network"
    ],
    "code": "10000005",
    "dataset": "s_terra.vpn_gate",
    "kind": "event",
    "original": "ISAKMP connection 810000 created, peer 198.51.100.44:500, id \"unstable-branch.example\"",
    "type": [
      "start"
    ]
  },
  "network": {
    "protocol": "isakmp",
    "transport": "udp"
  },
  "observer": {
    "name": "vpn-gate-01",
    "product": "VPN Gate",
    "vendor": "S-Terra"
  },
  "related": {
    "ip": [
      "198.51.100.44"
    ]
  },
  "s_terra": {
    "vpn_gate": {
      "connection_id": 810000,
      "peer_id": "unstable-branch.example",
      "severity": "INFO"
    }
  }
}`,
    },
  ],
};
