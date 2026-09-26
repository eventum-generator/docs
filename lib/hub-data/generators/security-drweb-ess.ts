/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDrwebEss: GeneratorMeta = {
  slug: 'security-drweb-ess',
  displayName: 'Dr.Web Enterprise Security Suite',
  category: 'security',
  description:
    'Synthetic ECS JSON modeled on Dr.Web ESS 13.0.1 administrator notifications. Native Syslog and CEF compatibility is unverified.',
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
    'One 30-minute station episode links an executable block to a threat detection in the same file and an allowed HOSTS access; a separate ten-minute identity-collision pair follows.',
  generatorId: 'security-drweb-ess',
  eventTypes: [
    {
      id: 'scan-statistics',
      description: 'Scan statistics',
      frequency: '57.5% demo cycle',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Application Control blocked the process',
      frequency: '20% demo cycle',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'Security threat detected',
      frequency: '10% demo cycle',
      category: 'malware',
    },
    {
      id: 'station-update-error',
      description: 'Critical error of station update',
      frequency: '5% demo cycle',
      category: 'package',
    },
    {
      id: 'preventive-protection',
      description: 'Report of Preventive protection',
      frequency: '2.5% demo cycle',
      category: 'process',
    },
    {
      id: 'station-authorization-failed',
      description: 'Station authorization failed',
      frequency: '2.5% demo cycle',
      category: 'authentication',
    },
    {
      id: 'station-already-logged-in',
      description: 'Station already logged in',
      frequency: '2.5% demo cycle',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Notification types and MSG variable names follow the Dr.Web ESS 13.0.1 template catalog; raw Syslog/CEF mapping remains unverified.',
    'Normalized ECS fields identify the Dr.Web Server and the reporting station',
    'One notification every ten minutes; the forty-event demo cycle is synthetic, with all seven types present in both modes.',
    'The first linked episode shares station ID; only the application block and threat detection share the executable path.',
    'The first failed authorization and duplicate-station notifications share a station ID; later pairs do not.',
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
  "@timestamp": "2026-09-25T20:30:00+00:00",
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
    "severity": 6
  },
  "message": "Trojan.DownLoader detected in C:\\Users\\Public\\Downloads\\invoice.pdf.exe on WS-SALES-06.",
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
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c040",
    "name": "WS-SALES-06",
    "hostname": "WS-SALES-06",
    "ip": [
      "10.20.14.106"
    ]
  },
  "user": {
    "name": "user40"
  },
  "related": {
    "hosts": [
      "WS-SALES-06"
    ],
    "ip": [
      "10.20.14.106"
    ],
    "user": [
      "user40"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Security threat detected",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c040",
        "name": "WS-SALES-06",
        "ip": "10.20.14.106",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.Action": "moved to quarantine",
        "MSG.Component": "Dr.Web Scanner",
        "MSG.InfectionType": "Trojan",
        "MSG.ObjectName": "C:\\Users\\Public\\Downloads\\invoice.pdf.exe",
        "MSG.ObjectOwner": "user40",
        "MSG.RunBy": "user40",
        "MSG.ServerTime": "2026-09-25T20:30:00+00:00",
        "MSG.Virus": "Trojan.DownLoader"
      }
    }
  }
}`,
    },
  ],
};
