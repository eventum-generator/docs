/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDrwebEss: GeneratorMeta = {
  slug: 'security-drweb-ess',
  displayName: 'Dr.Web Enterprise Security Suite',
  category: 'security',
  description:
    'ECS JSON modeled on Dr.Web ESS 13.0.1 administrator notifications: scans, application controls, threat detections, station update failures and authentication events.',
  format: ['JSON', 'ECS'],
  dataSource: 'Dr.Web ESS administrator notifications',
  eventCount: 7,
  templateCount: 10,
  highlights: [
    'Documented Dr.Web notification variables',
    '48 fictional endpoint identities',
    'Linked protection and infection episode',
    'Station identity collision episode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Application block, user-allowed protected-file access, malware detection and infected scan result on one station; a separate pair links failed authorization to a duplicate station ID.',
  generatorId: 'security-drweb-ess',
  eventTypes: [
    {
      id: 'scan-statistics',
      description: 'Scan statistics',
      frequency: '57.5%',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Application Control blocked the process',
      frequency: '20%',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'Security threat detected',
      frequency: '10%',
      category: 'malware',
    },
    {
      id: 'station-update-error',
      description: 'Critical error of station update',
      frequency: '5%',
      category: 'package',
    },
    {
      id: 'preventive-protection',
      description: 'Report of Preventive protection',
      frequency: '2.5%',
      category: 'process',
    },
    {
      id: 'station-authorization-failed',
      description: 'Station authorization failed',
      frequency: '2.5%',
      category: 'authentication',
    },
    {
      id: 'station-already-logged-in',
      description: 'Station already logged in',
      frequency: '2.5%',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Notification types and MSG variables follow the Dr.Web ESS 13.0.1 administrator notification catalog',
    'Normalized ECS fields identify the Dr.Web Server and the reporting station',
    'Forty-event demo cycle includes independent scans, blocks, threats and update failures',
    'Linked protection and threat notifications share station ID and object path',
    'Failed authorization and duplicate-station notifications share station ID',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Enable linked detection scenarios; false emits independent background notifications',
    },
    {
      name: 'server_name',
      defaultValue: 'drweb-srv-01.example.test',
      description: 'Dr.Web Server name',
    },
    {
      name: 'server_id',
      defaultValue: '9f0ca284-b95a-4cc8-8338-f253a30ab001',
      description: 'Dr.Web Server ID in duplicate-station notifications',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'Dr.Web Server IP address',
    },
    {
      name: 'server_version',
      defaultValue: '13.0.1',
      description: 'Product version',
    },
    {
      name: 'station_group',
      defaultValue: 'Workstations',
      description: 'Primary group in station context',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.17.0',
      description: 'ECS schema version carried by output',
    },
  ],
  sampleOutputs: [
    {
      title: 'Security threat detected',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:24:58+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "event",
    "module": "drweb",
    "dataset": "drweb.ess",
    "action": "security-threat-detected",
    "category": [
      "malware"
    ],
    "type": [
      "info"
    ],
    "outcome": "success",
    "severity": 7
  },
  "message": "Exploit.CVE detected in C:\\Users\\Public\\Documents\\macro_template.docm on WS-HR-02.",
  "observer": {
    "vendor": "Doctor Web",
    "product": "Enterprise Security Suite",
    "version": "13.0.1",
    "hostname": "drweb-srv-01.example.test",
    "ip": [
      "10.20.0.10"
    ]
  },
  "host": {
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c004",
    "name": "WS-HR-02",
    "hostname": "WS-HR-02",
    "ip": [
      "10.20.11.32"
    ]
  },
  "user": {
    "name": "d.kuznetsov"
  },
  "related": {
    "hosts": [
      "WS-HR-02"
    ],
    "ip": [
      "10.20.11.32"
    ],
    "user": [
      "d.kuznetsov"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Security threat detected",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c004",
        "name": "WS-HR-02",
        "ip": "10.20.11.32",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.Action": "moved to quarantine",
        "MSG.Component": "Dr.Web Scanner",
        "MSG.InfectionType": "Exploit",
        "MSG.ObjectName": "C:\\Users\\Public\\Documents\\macro_template.docm",
        "MSG.ObjectOwner": "d.kuznetsov",
        "MSG.RunBy": "d.kuznetsov",
        "MSG.ServerTime": "2026-09-25T10:24:58+00:00",
        "MSG.Virus": "Exploit.CVE"
      }
    }
  }
}`,
    },
  ],
};
