/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPfsense: GeneratorMeta = {
  slug: 'network-pfsense',
  displayName: 'pfSense Firewall and IPsec',
  category: 'network',
  dataSource: 'RFC 5424 pfSense filterlog and charon syslog',
  description:
    'Firewall pass/block traffic and IPsec negotiation records with a switchable failed-peer-to-tunnel-to-admin-access sequence.',
  generatorId: 'pfsense',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native RFC 5424 and filterlog CSV in event.original',
    'TCP and UDP traffic with rule tracker IDs',
    'Linked IPsec negotiation and VPN traffic chain',
  ],
  anomalyChain:
    'Repeated peer-config failures precede IKE and CHILD establishment, then VPN traffic reaches SMB, RDP and WinRM on an internal host.',
  eventTypes: [
    {
      id: 'filterlog pass',
      description: 'Permitted firewall traffic',
      frequency: '72% baseline',
      category: 'network',
    },
    {
      id: 'filterlog block',
      description: 'Blocked firewall traffic',
      frequency: '28% baseline',
      category: 'network',
    },
    {
      id: 'charon peer lookup',
      description: 'IPsec peer configuration lookup',
      frequency: 'Chain only',
      category: 'network',
    },
    {
      id: 'charon no peer config',
      description: 'IPsec peer lookup failure',
      frequency: 'Chain only',
      category: 'network',
    },
    {
      id: 'charon IKE_SA established',
      description: 'IKE security association established',
      frequency: 'Chain only',
      category: 'network',
    },
    {
      id: 'charon CHILD_SA established',
      description: 'Child security association established',
      frequency: 'Chain only',
      category: 'network',
    },
  ],
  realismFeatures: [
    'IPv4 TCP and UDP filterlog CSV positions match Netgate documentation.',
    'The peer lookup, negotiation and permitted tunnel traffic use one firewall and matching peer/subnet.',
    'No administrator login or firewall rule change is implied by the selected raw logs.',
  ],
  format: ['JSON', 'ECS', 'Syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the VPN chain; false emits only background',
    },
    {
      name: 'hostname',
      defaultValue: 'fw01.corp.example',
      description: 'Firewall hostname',
    },
    {
      name: 'wan_ip',
      defaultValue: '203.0.113.1',
      description: 'Local VPN endpoint',
    },
    {
      name: 'remote_peer_ip',
      defaultValue: '198.51.100.77',
      description: 'Remote VPN peer',
    },
    {
      name: 'remote_tunnel_ip',
      defaultValue: '10.42.42.17',
      description: 'Host inside the remote tunnel',
    },
    {
      name: 'internal_target_ip',
      defaultValue: '10.20.0.10',
      description: 'Internal access target',
    },
    {
      name: 'tunnel_name',
      defaultValue: 'corp-remote',
      description: 'IPsec tunnel name',
    },
    {
      name: 'suspicious_rule_tracker',
      defaultValue: '1534283903',
      description: 'Existing permitted rule tracker',
    },
  ],
  sampleOutputs: [
    {
      title: 'pfSense Firewall and IPsec event',
      json: String.raw`{
  "@timestamp": "2026-09-25T11:59:46+00:00",
  "data_stream": {
    "dataset": "pfsense.log",
    "namespace": "default",
    "type": "logs"
  },
  "destination": {
    "ip": "10.20.0.53",
    "port": 53
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "block",
    "category": [
      "network"
    ],
    "dataset": "pfsense.log",
    "kind": "event",
    "original": "<134>1 2026-09-25T11:59:46+00:00 fw01.corp.example filterlog 72237 - - 115,,,1000000103,igb1.12,match,block,in,4,0x0,,63,48379,0,DF,17,udp,69,10.20.7.32,10.20.0.53,63575,53,49",
    "type": [
      "connection"
    ]
  },
  "host": {
    "name": "fw01.corp.example"
  },
  "log": {
    "syslog": {
      "priority": 134
    }
  },
  "message": "115,,,1000000103,igb1.12,match,block,in,4,0x0,,63,48379,0,DF,17,udp,69,10.20.7.32,10.20.0.53,63575,53,49",
  "network": {
    "bytes": 69,
    "direction": "inbound",
    "transport": "udp"
  },
  "observer": {
    "name": "fw01.corp.example",
    "product": "pfSense",
    "type": "firewall",
    "vendor": "Netgate"
  },
  "pfsense": {
    "ip": {
      "flags": "DF",
      "offset": 0,
      "tos": "0x0",
      "ttl": 63
    },
    "udp": {
      "length": 49
    }
  },
  "process": {
    "name": "filterlog",
    "pid": 72237
  },
  "related": {
    "ip": [
      "10.20.7.32",
      "10.20.0.53"
    ]
  },
  "rule": {
    "id": "1000000103"
  },
  "source": {
    "ip": "10.20.7.32",
    "port": 63575
  },
  "syslog": {
    "facility": {
      "code": 16
    },
    "priority": 134,
    "severity": {
      "code": 6
    }
  }
}`,
    },
  ],
};
