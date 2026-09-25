/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPfsense: GeneratorMeta = {
  slug: 'network-pfsense',
  displayName: 'pfSense Firewall and IPsec',
  category: 'network',
  dataSource: 'pfSense CE 2.9.0 RFC 5424 filterlog and charon syslog',
  description:
    'pfSense CE 2.9.0 firewall and IKEv1 IPsec records: LAN, WAN and enc0 traffic with a switchable peer-ID mismatch and tunnel-access sequence.',
  generatorId: 'pfsense',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native RFC 5424 and filterlog CSV in event.original',
    'TCP and UDP traffic with rule tracker IDs',
    'Linked IPsec negotiation and VPN traffic chain',
  ],
  anomalyChain:
    'After 720 ordinary events, three mismatched peer-ID attempts precede a corrected ID, IKE/CHILD establishment and SMB, RDP, WinRM over enc0 within about 12 seconds.',
  eventTypes: [
    {
      id: 'filterlog pass',
      description: 'Logged LAN and IPsec rule passes',
      frequency:
        'About 80% of selected firewall traffic plus three isolated administrative connections',
      category: 'network',
    },
    {
      id: 'filterlog block',
      description: 'Logged default WAN blocks',
      frequency: 'About 20% of selected firewall traffic',
      category: 'network',
    },
    {
      id: 'charon peer lookup',
      description: 'IPsec peer configuration lookup',
      frequency:
        'Three scheduled background lookups plus four linked lookups when enabled',
      category: 'network',
    },
    {
      id: 'charon no peer config',
      description: 'IPsec peer-ID mismatch',
      frequency:
        'One scheduled background failure plus three linked failures when enabled',
      category: 'network',
    },
    {
      id: 'charon IKE_SA established',
      description: 'IKE security association established',
      frequency:
        'Two scheduled background successes plus one linked success when enabled',
      category: 'network',
    },
    {
      id: 'charon CHILD_SA established',
      description: 'Child security association established',
      frequency:
        'Two scheduled background successes plus one linked success when enabled',
      category: 'network',
    },
  ],
  realismFeatures: [
    'RFC 5424 timestamps include microseconds; IPv4 TCP/UDP filterlog records use the documented 29/23 CSV positions.',
    'LAN pass, WAN default block and enc0 pass use distinct stable rule trackers and interfaces.',
    'Both modes include individual IPsec and administrative-port events; no configuration change or compromise is claimed.',
  ],
  format: ['JSON', 'ECS', 'Syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include one 12-record VPN chain; false retains ordinary IPsec and firewall events',
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
      name: 'ipsec_pass_rule_tracker',
      defaultValue: '1534283903',
      description: 'Existing logged IPsec pass-rule tracker',
    },
  ],
  sampleOutputs: [
    {
      title: 'pfSense Firewall and IPsec event',
      json: String.raw`{
  "@timestamp": "2026-09-25T16:54:42.909019+00:00",
  "data_stream": {
    "dataset": "pfsense.log",
    "namespace": "default",
    "type": "logs"
  },
  "destination": {
    "ip": "203.0.113.1",
    "port": 22
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
    "original": "<134>1 2026-09-25T16:54:42.909019+00:00 fw01.corp.example filterlog 72237 - - 5,16777216,,1000000103,igb0,match,block,in,4,0x0,,51,55152,0,DF,6,tcp,60,198.51.100.91,203.0.113.1,57361,22,0,S,1636984417,,64240,,mss;sackOK;TS;nop;wscale",
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
  "message": "5,16777216,,1000000103,igb0,match,block,in,4,0x0,,51,55152,0,DF,6,tcp,60,198.51.100.91,203.0.113.1,57361,22,0,S,1636984417,,64240,,mss;sackOK;TS;nop;wscale",
  "network": {
    "direction": "inbound",
    "transport": "tcp"
  },
  "observer": {
    "name": "fw01.corp.example",
    "product": "pfSense",
    "type": "firewall",
    "vendor": "Netgate",
    "version": "2.9.0"
  },
  "pfsense": {
    "direction": "in",
    "interface": "igb0",
    "ip": {
      "flags": "DF",
      "id": 55152,
      "length": 60,
      "offset": 0,
      "tos": "0x0",
      "ttl": 51
    },
    "tcp": {
      "flags": "S",
      "length": 0,
      "window": 64240
    }
  },
  "process": {
    "name": "filterlog",
    "pid": 72237
  },
  "related": {
    "ip": [
      "198.51.100.91",
      "203.0.113.1"
    ]
  },
  "rule": {
    "id": "1000000103"
  },
  "source": {
    "ip": "198.51.100.91",
    "port": 57361
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
