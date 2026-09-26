/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityTrendmicroDeepSecurity: GeneratorMeta = {
  slug: 'security-trendmicro-deep-security',
  displayName: 'Trend Micro Deep Security',
  category: 'security',
  description:
    'Deep Security Agent CEF for firewall and IPS events across protected hosts.',
  dataSource: 'Deep Security Agent CEF syslog',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'security-trendmicro-deep-security',
  highlights: [
    'Firewall and IPS CEF',
    'Fifty protected hosts',
    'Cross-feature probe chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One source is denied on SMB and RDP against the same host, then triggers two IPS reset events on HTTP.',
  eventTypes: [
    {
      id: '20',
      description: 'Log-only firewall rule',
      frequency: '85% routine',
      category: 'network',
    },
    {
      id: '21',
      description: 'Deny firewall rule',
      frequency: '12% routine; 2 per chain',
      category: 'network',
    },
    {
      id: '1001111',
      description: 'IPS rule with IDS:Reset',
      frequency: '3% routine; 2 per chain',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'The CEF header and extension fields follow Trend Micro firewall and IPS examples.',
    'The manager syslog sender and dvchost agent identity remain distinct.',
    'The chain keeps source, destination and agent host ID stable while destination ports change.',
  ],
  parameters: [
    {
      name: 'manager_name',
      defaultValue: 'dsm-01.corp.example',
      description: 'Syslog sender',
    },
    {
      name: 'agent_version',
      defaultValue: '20.0.0',
      description: 'CEF Device Version',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine records between chains',
    },
    {
      name: 'attack_source_ip',
      defaultValue: '10.50.9.77',
      description: 'Stable chain source',
    },
    {
      name: 'attack_target_name',
      defaultValue: 'app-01.corp.example',
      description: 'Protected host',
    },
    {
      name: 'attack_target_ip',
      defaultValue: '10.50.20.15',
      description: 'Protected host IP',
    },
    {
      name: 'attack_host_id',
      defaultValue: '101',
      description: 'Agent host identifier',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:34:51+00:00",
  "destination": {
    "ip": "10.50.20.15",
    "port": 445
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "firewall-deny",
    "category": [
      "network"
    ],
    "code": "21",
    "dataset": "trendmicro.deep_security",
    "kind": "event",
    "original": "Sep 25 13:34:51 dsm-01.corp.example CEF:0|Trend Micro|Deep Security Agent|20.0.0|21|Deny Inbound Management|5|cn1=101 cn1Label=Host ID dvchost=app-01.corp.example act=Deny dmac=00:50:56:F5:7F:65 smac=00:0C:29:EB:35:DE TrendMicroDsFrameType=IP src=10.50.9.77 dst=10.50.20.15 in=60 cs3=DF cs3Label=Fragmentation Bits proto=TCP spt=45856 dpt=445 cs2=0x02 SYN cs2Label=TCP Flags cnt=1",
    "type": [
      "denied"
    ]
  },
  "host": {
    "ip": [
      "10.50.20.15"
    ],
    "name": "app-01.corp.example"
  },
  "network": {
    "transport": "tcp"
  },
  "related": {
    "hosts": [
      "app-01.corp.example"
    ],
    "ip": [
      "10.50.9.77",
      "10.50.20.15"
    ]
  },
  "source": {
    "ip": "10.50.9.77",
    "port": 45856
  },
  "trendmicro": {
    "deep_security": {
      "action": "Deny",
      "host_id": 101,
      "manager_name": "dsm-01.corp.example",
      "rule_id": "21",
      "rule_name": "Deny Inbound Management"
    }
  }
}`,
    },
  ],
};
