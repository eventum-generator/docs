/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSonicwallTz: GeneratorMeta = {
  slug: 'network-sonicwall-tz',
  displayName: 'SonicWall TZ SonicOS Traffic and CFS',
  category: 'network',
  description: 'SonicOS 6.5.4 default Syslog traffic and CFS access records.',
  dataSource: 'SonicWall SonicOS default Syslog',
  format: ['Syslog KV', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Vendor-published m=14, m=97, and m=537 message layouts',
    'Correlated CFS denials and later unrated-host traffic',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three CFS denials from one client precede an unrated-host access and connection close.',
  generatorId: 'sonicwall',
  eventTypes: [
    {
      id: '97',
      description: 'Website accessed, CFS Not Rated',
      frequency: '~75% routine',
      category: 'network',
    },
    {
      id: '537',
      description: 'Connection closed',
      frequency: '~20% routine',
      category: 'network',
    },
    {
      id: '14',
      description: 'Website access denied by CFS',
      frequency: '~5% routine',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Default SonicOS 6.5.4 key-value Syslog layout',
    'Unique native n values and consistent MAC address per synthetic client',
    'Connection-close bytes do not fall below the preceding access record in the chain',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the CFS denial and alternate-host chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'firewall_ip',
      defaultValue: '10.20.30.1',
      description: 'SonicWall firewall address.',
    },
    {
      name: 'firewall_serial',
      defaultValue: '02DEADBEEF01',
      description: 'Synthetic appliance serial.',
    },
    {
      name: 'target_source_ip',
      defaultValue: '10.20.30.77',
      description: 'Chain client address.',
    },
    {
      name: 'blocked_ip',
      defaultValue: '203.0.113.40',
      description: 'CFS-denied destination.',
    },
    {
      name: 'blocked_domain',
      defaultValue: 'betting.example',
      description: 'CFS-denied hostname.',
    },
    {
      name: 'alternate_ip',
      defaultValue: '203.0.113.41',
      description: 'Later unrated destination.',
    },
    {
      name: 'alternate_domain',
      defaultValue: 'alternate.example',
      description: 'Later unrated hostname.',
    },
  ],
  sampleOutputs: [
    {
      title: 'SonicWall anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:59:03+00:00",
  "destination": {
    "ip": "203.0.113.40",
    "port": 80
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "website_denied",
    "category": [
      "network",
      "web"
    ],
    "code": "14",
    "dataset": "sonicwall.sonicos",
    "kind": "event",
    "original": "Sep 25 13:59:03 10.20.30.1 id=firewall sn=02DEADBEEF01 time=\"2026-09-25 13:59:03\" fw=10.20.30.1 pri=3 c=4 m=14 msg=\"Web site access denied\" app=9 n=61 src=10.20.30.77:51000:X0 dst=203.0.113.40:80:X1 srcMac=02:00:00:00:00:77 dstMac=02:00:00:00:01:01 proto=tcp/http dstname=betting.example arg=/offers code=11 Category=\"Gambling\" rule=\"9 (LAN->WAN)\" fw_action=\"drop\"",
    "type": [
      "denied"
    ]
  },
  "network": {
    "transport": "tcp"
  },
  "observer": {
    "ip": "10.20.30.1",
    "product": "SonicOS",
    "vendor": "SonicWall"
  },
  "related": {
    "ip": [
      "10.20.30.77",
      "203.0.113.40"
    ]
  },
  "rule": {
    "name": "9 (LAN->WAN)"
  },
  "sonicwall": {
    "sonicos": {
      "category": "Gambling",
      "firewall_action": "drop",
      "log_number": 61,
      "serial": "02DEADBEEF01"
    }
  },
  "source": {
    "ip": "10.20.30.77",
    "port": 51000
  },
  "url": {
    "domain": "betting.example",
    "path": "/offers"
  }
}`,
    },
  ],
};
