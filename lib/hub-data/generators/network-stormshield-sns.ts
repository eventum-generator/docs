import type { GeneratorMeta } from '@/lib/hub-types';

export const networkStormshieldSns: GeneratorMeta = {
  slug: 'network-stormshield-sns',
  displayName: 'Stormshield SNS SSH Alarms',
  category: 'network',
  description: 'SNS 4.8 WELF interactive SSH alarm message bodies.',
  dataSource: 'Stormshield SNS audit Syslog',
  format: ['WELF', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  highlights: [
    'Stormshield-documented WELF alarm fields',
    'Four SSH destinations from one external source',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One external source triggers four interactive-SSH alarms for different internal hosts in four seconds.',
  generatorId: 'stormshield',
  eventTypes: [
    {
      id: '85',
      description: 'Interactive SSH connection detected',
      frequency: '100% routine; four-event anomaly sequence',
      category: 'network, intrusion_detection',
    },
  ],
  realismFeatures: [
    'Complete SNS 4.8.18 sample WELF field layout in event.original',
    'Stable source address across multiple destinations',
    'No inferred SSH authentication outcome',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the four-host SSH sequence.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '55',
      description: 'Routine records before a sequence.',
    },
    {
      name: 'firewall_name',
      defaultValue: 'sns-fw-01',
      description: 'Synthetic SNS firewall identifier.',
    },
    {
      name: 'scanner_ip',
      defaultValue: '198.51.100.44',
      description: 'Synthetic correlated source.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Stormshield SSH anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:06:27+00:00",
  "destination": {
    "domain": "app-01",
    "ip": "10.20.0.11",
    "port": 22
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "interactive_connection_detected",
    "category": [
      "network",
      "intrusion_detection"
    ],
    "code": "85",
    "dataset": "stormshield.sns",
    "kind": "alert",
    "original": "id=firewall time=\"2026-09-25 14:06:27\" fw=\"sns-fw-01\" tz=+0000 startime=\"2026-09-25 14:06:27\" pri=4 srcif=\"Ethernet0\" srcifname=\"out\" ipproto=tcp proto=ssh src=198.51.100.44 srcport=54000 srcportname=ephemeral_fw dst=10.20.0.11 dstport=22 dstportname=ssh dstname=app-01 action=pass msg=\"Interactive connection detected\" class=protocol classification=0 alarmid=85",
    "type": [
      "info"
    ]
  },
  "network": {
    "protocol": "ssh",
    "transport": "tcp"
  },
  "observer": {
    "name": "sns-fw-01",
    "product": "SNS",
    "vendor": "Stormshield"
  },
  "related": {
    "ip": [
      "198.51.100.44",
      "10.20.0.11"
    ]
  },
  "source": {
    "ip": "198.51.100.44",
    "port": 54000
  },
  "stormshield": {
    "sns": {
      "action": "pass",
      "alarm_id": 85,
      "classification": 0,
      "priority": 4,
      "source_interface": "Ethernet0",
      "source_interface_name": "out"
    }
  }
}`,
    },
  ],
};
