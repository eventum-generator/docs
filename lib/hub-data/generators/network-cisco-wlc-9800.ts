import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoWlc9800: GeneratorMeta = {
  slug: 'network-cisco-wlc-9800',
  displayName: 'Cisco Catalyst 9800 WLC',
  category: 'network',
  description:
    'Catalyst 9800 client-state syslog with a switchable rapid movement sequence across three access points.',
  dataSource: 'Cisco IOS XE 17.11 CLIENT_ORCH_LOG syslog',
  format: ['JSON', 'ECS', 'syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native CLIENT_ORCH_LOG state codes',
    'MAC, user, IP, AP and SSID correlation',
    'RUN/delete/IP-update progression',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same MAC repeatedly joins and disconnects across three APs, then updates its IP record.',
  generatorId: 'cisco-wlc-9800',
  eventTypes: [
    {
      id: 'CLIENT_MOVED_TO_RUN_STATE',
      description: 'Wireless client enters RUN',
      frequency: '65% baseline',
      category: 'network',
    },
    {
      id: 'CLIENT_MOVED_TO_DELETE_STATE',
      description: 'Wireless client disconnects',
      frequency: '20% baseline',
      category: 'network',
    },
    {
      id: 'CLIENT_IP_UPDATED',
      description: 'Client IP record changes',
      frequency: '15% baseline',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Requires wireless client syslog-detailed on the controller.',
    'Client-state records do not prove authentication failure.',
    'KUMA 4.2 WLC normalizer names AireOS models, not Catalyst 9800.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include rapid three-AP movement',
    },
    {
      name: 'controller_name',
      defaultValue: 'wlc9800-01.corp.example',
      description: 'Controller host name',
    },
    {
      name: 'ssid',
      defaultValue: 'corp-wifi',
      description: 'WLAN SSID',
    },
    {
      name: 'suspicious_user',
      defaultValue: 'visitor01',
      description: 'Username in the chain',
    },
    {
      name: 'suspicious_mac',
      defaultValue: '02aa.bbcc.ddee',
      description: 'Client MAC in the chain',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '192.0.2.91',
      description: 'Client IP in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:42:02+00:00",
  "cisco_wlc": {
    "ap_name": "AP-Floor1",
    "chassis": "1 R0/0",
    "client_state": "run",
    "ssid": "corp-wifi"
  },
  "client": {
    "ip": "192.0.2.91",
    "mac": "02aa.bbcc.ddee"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "run",
    "category": [
      "network"
    ],
    "code": "CLIENT_MOVED_TO_RUN_STATE",
    "kind": "event",
    "original": "Sep 25 12:42:02.000 UTC: %CLIENT_ORCH_LOG-7-CLIENT_MOVED_TO_RUN_STATE: Chassis 1 R0/0: wncd: Username (visitor01), MAC: 02aa.bbcc.ddee, IP 192.0.2.91 associated to AP (AP-Floor1) with SSID (corp-wifi)",
    "type": [
      "start"
    ]
  },
  "host": {
    "name": "wlc9800-01.corp.example"
  },
  "log": {
    "level": "debug"
  },
  "process": {
    "name": "wncd"
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "visitor01"
    ]
  },
  "user": {
    "name": "visitor01"
  }
}`,
    },
  ],
};
