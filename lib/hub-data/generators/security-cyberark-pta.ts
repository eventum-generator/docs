/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCyberarkPta: GeneratorMeta = {
  slug: 'security-cyberark-pta',
  displayName: 'CyberArk Privileged Threat Analytics',
  category: 'security',
  description:
    'PTA 12.6 credential-theft CEF alerts with a correlated four-incident series.',
  dataSource: 'CyberArk PTA 12.6 CEF syslog',
  format: ['CEF', 'Syslog', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'security-cyberark-pta',
  highlights: [
    'Full 12.6 CEF alert profile with 16 extension fields',
    'Distinct PTA incident IDs and links',
    'One source actor linked to four destination accounts',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four PTA alerts implicate one source user and IP against four distinct destination accounts.',
  eventTypes: [
    {
      id: '1',
      description: 'Suspected credentials theft',
      frequency: 'All events; four alerts per correlated series',
      category: 'threat',
    },
  ],
  realismFeatures: [
    'The exact CEF header and extension keys follow the Elastic PTA 12.6 raw fixture.',
    'Background consists of independent PTA alert pairs, not benign user activity.',
    'Current CyberArk example and detection catalog disagree on this alert ID; newer versions are unverified.',
  ],
  parameters: [
    {
      name: 'pta_host',
      defaultValue: 'pta-01.example.test',
      description: 'PTA instance in ECS observer fields',
    },
    {
      name: 'pta_version',
      defaultValue: '12.6',
      description: 'Version in the validated CEF header',
    },
    {
      name: 'pta_link_host',
      defaultValue: '10.20.1.5',
      description: 'Synthetic host for incident links',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable correlated series; false emits unrelated alerts',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between series',
    },
    {
      name: 'chain_source_user',
      defaultValue: 'svc-backup@corp.example.test',
      description: 'Linked source user',
    },
    {
      name: 'chain_source_host',
      defaultValue: 'backup-01.corp.example.test',
      description: 'Linked source host',
    },
    {
      name: 'chain_source_ip',
      defaultValue: '10.20.30.77',
      description: 'Linked source address',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated PTA alert',
      json: String.raw`
{
  "@timestamp": "2026-09-25T14:50:40+00:00",
  "cef": {
    "device": {
      "event_class_id": "1",
      "product": "PTA",
      "vendor": "CyberArk",
      "version": "12.6"
    },
    "extensions": {
      "cs1": "None",
      "cs1Label": "ExtraData",
      "cs2": "d016e2a8cf1b3935fc9d8711",
      "cs2Label": "EventID",
      "cs3": "https://10.20.1.5/incidents/d016e2a8cf1b3935fc9d8711",
      "cs3Label": "PTAlink",
      "cs4": "None",
      "cs4Label": "ExternalLink",
      "deviceCustomDate1": "1790347840000",
      "deviceCustomDate1Label": "detectionDate",
      "dhost": "dc-01.example.test",
      "dst": "10.20.2.11",
      "duser": "domain-admin@dc-01.example.test",
      "shost": "backup-01.corp.example.test",
      "src": "10.20.30.77",
      "suser": "svc-backup@corp.example.test"
    },
    "name": "Suspected credentials theft",
    "severity": "8",
    "version": 0
  },
  "cyberark_pta": {
    "log": {
      "event_type": "1"
    }
  },
  "destination": {
    "domain": "dc-01.example.test",
    "ip": "10.20.2.11",
    "user": {
      "email": "domain-admin@dc-01.example.test",
      "name": "domain-admin"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "category": [
      "threat"
    ],
    "code": "1",
    "dataset": "cyberark_pta.events",
    "id": "d016e2a8cf1b3935fc9d8711",
    "kind": "alert",
    "original": "CEF:0|CyberArk|PTA|12.6|1|Suspected credentials theft|8|suser=svc-backup@corp.example.test shost=backup-01.corp.example.test src=10.20.30.77 duser=domain-admin@dc-01.example.test dhost=dc-01.example.test dst=10.20.2.11 cs1Label=ExtraData cs1=None cs2Label=EventID cs2=d016e2a8cf1b3935fc9d8711 deviceCustomDate1Label=detectionDate deviceCustomDate1=1790347840000 cs3Label=PTAlink cs3=https://10.20.1.5/incidents/d016e2a8cf1b3935fc9d8711 cs4Label=ExternalLink cs4=None",
    "reason": "Suspected credentials theft",
    "reference": "https://10.20.1.5/incidents/d016e2a8cf1b3935fc9d8711",
    "severity": 8,
    "type": [
      "info"
    ]
  },
  "observer": {
    "hostname": "pta-01.example.test",
    "product": "PTA",
    "vendor": "CyberArk",
    "version": "12.6"
  },
  "related": {
    "hosts": [
      "backup-01.corp.example.test",
      "dc-01.example.test"
    ],
    "ip": [
      "10.20.30.77",
      "10.20.2.11"
    ],
    "user": [
      "svc-backup@corp.example.test",
      "domain-admin@dc-01.example.test"
    ]
  },
  "source": {
    "domain": "backup-01.corp.example.test",
    "ip": "10.20.30.77",
    "user": {
      "email": "svc-backup@corp.example.test",
      "name": "svc-backup"
    }
  }
}
`,
    },
  ],
};
