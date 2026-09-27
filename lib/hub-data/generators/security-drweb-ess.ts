/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDrwebEss: GeneratorMeta = {
  slug: 'security-drweb-ess',
  displayName: 'Dr.Web ESS Administrator Notifications',
  category: 'security',
  description:
    'Dr.Web Enterprise Security Suite 13.0.1 administrator notifications from one Server and 48 connected Windows stations, as collector-normalized ECS JSON of the published notification variables, not native CEF, syslog or a captured delivery payload. All seven notification classes occur in both modes. Recurring episodes join an Application Control block, an allowed HOSTS edit, quarantine of the blocked copy and a station-identity collision on one station.',
  dataSource:
    'Dr.Web ESS 13.0.1 selected administrator-notification variables, collector-normalized',
  format: ['JSON', 'ECS'],
  eventCount: 7,
  templateCount: 9,
  highlights: [
    'Seven notification classes, 49/54 variable names',
    'Interleaved random workflows with retries',
    'Recurring six-step station chain, 24 hours by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default (the first eligible one interval after the start of generation, each next one interval after the previous actual start; a start comes at a random moment after it becomes eligible, on average about 7 minutes later, so start times drift later with no catch-up), on one station Application Control blocks a new executable copy, the same user allows a separate PowerShell HOSTS modification, a manual Scanner detects and quarantines that exact copy, the scan completes with one infected/moved object, a connection claiming the station's UUID fails authorization and another attempt collides with its registered identity. Measured spans are 21-42 minutes by default. The station differs from the last three episodes' and the executable from the previous one; every step type and gap also occurs in background, and only the complete ordered sequence on one station within 95 minutes, with the blocked path equal to the detected path, is episode-only.",
  generatorId: 'drweb',
  eventTypes: [
    {
      id: 'scan-completed',
      description:
        'Scan statistics of a clean or infected targeted Scanner run',
      frequency: '39.0% / 38.2% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Application Control blocks an untrusted executable launch',
      frequency: '18.2% / 18.6% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'station-authorization-failed',
      description: 'Station authorization failed, often retried',
      frequency: '11.7% / 12.2% measured share (off / on)',
      category: 'authentication',
    },
    {
      id: 'preventive-protection-allowed',
      description: 'User allows a PowerShell HOSTS modification in Ask mode',
      frequency: '10.3% / 9.6% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'Scanner detects a copy and moves it to quarantine',
      frequency: '7.8% / 7.4% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'station-update-error',
      description: 'Critical error of station update, retried by the agent',
      frequency: '7.0% / 6.3% measured share (off / on)',
      category: 'package',
    },
    {
      id: 'station-id-duplicate',
      description:
        "Station already logged in: a reconnect collides with the station's registered session",
      frequency: '6.1% / 7.7% measured share (off / on)',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'One Server and 48 existing Windows stations in one primary group. Stations are picked at random with unequal activity weights drawn per run, with no rotation or schedule, and independent workflows interleave: clean scans, launch blocks with retries, infected scans, user-allowed HOSTS edits, update failures and connection failures with retries and session collisions.',
    'A block prevents launch; the separate PowerShell HOSTS edit uses Preventive protection Ask mode and neither reverses a block nor establishes execution. Move to quarantine removes the original copy, each station holds at most four quarantined copies, and deletion 72 hours after receipt is an assumed external administrator task, not a Dr.Web default or an emitted notification.',
    '@timestamp is UTC Server receipt; block and Preventive MSG.StationTime is 1-24 seconds earlier under a synchronized station-clock assumption. At most one notification per 10-second tick, 427-479 a day with no daily cycle; workflow mix, retries, gaps, scan counters and delays are synthetic training assumptions, as primary sources give no rates.',
    'About 20 times a day an ordinary workflow reproduces a contiguous part of the chain with its own timing. A guard keeps background from completing it: after an ordinary part that reaches detection of a blocked copy, no connection-failure or collision workflow starts on that station for 96 minutes after its last block of that copy, so in both modes a collision never follows such a four-step prefix there. Detection (about 35 a day) and collision (about 27 a day) rates are set by this design and far exceed a typical 48-station fleet.',
    '49/54 (90.7%) coverage of published class-specific variable names, not native-byte certification. Notification names, labels, message text, severity, outcomes and file.* enrichment are collector choices; threat labels are published Dr.Web names, while filenames and hashes are synthetic. No native delivery capture, Elastic sample or live parser round trip was established.',
    'The chain is a training correlation: it does not prove that malware executed, changed HOSTS, cloned an Agent or corrected a password. Inventory IP and hostname on connection reports denote the registered asset, not an observed request source.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Mix recurring episodes with ordinary activity; false emits ordinary activity only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Finite interval from 6 to 8760 hours, measured from the previous actual episode start',
    },
    {
      name: 'server_name',
      defaultValue: 'drweb-srv-01.example.test',
      description: 'Registered Server hostname',
    },
    {
      name: 'server_id',
      defaultValue: '9f0ca284-b95a-4cc8-8338-f253a30ab001',
      description: 'Server registration UUID in duplicate-station reports',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'Collector inventory context for the Server',
    },
    {
      name: 'server_version',
      defaultValue: '13.0.1',
      description:
        'Metadata for the documented profile; changing it does not establish other-version fidelity',
    },
    {
      name: 'station_group',
      defaultValue: 'Workstations',
      description: 'Configured primary-group inventory label',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.17.0',
      description: 'ECS normalization version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Application Control block, first step of a default episode',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:01:14+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "event",
    "module": "drweb",
    "dataset": "drweb.ess",
    "action": "application-control-blocked",
    "category": [
      "process"
    ],
    "type": [
      "denied"
    ],
    "outcome": "success",
    "severity": 5
  },
  "message": "Application Control prevented launch of C:\\Users\\Public\\Downloads\\updater_20260926_234019.exe on WS-HR-07.",
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
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c023",
    "name": "WS-HR-07",
    "hostname": "WS-HR-07",
    "ip": [
      "10.20.11.107"
    ]
  },
  "user": {
    "name": "user23"
  },
  "file": {
    "path": "C:\\Users\\Public\\Downloads\\updater_20260926_234019.exe",
    "name": "updater_20260926_234019.exe"
  },
  "related": {
    "hosts": [
      "WS-HR-07"
    ],
    "ip": [
      "10.20.11.107"
    ],
    "user": [
      "user23"
    ],
    "hash": [
      "775d486ec80d5cd7b615d573ac891579e3a2b518373804134121855cdd5d4ee8"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Application Control blocked the process",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c023",
        "name": "WS-HR-07",
        "ip": "10.20.11.107",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.AppCtlAction": 5,
        "MSG.AppCtlType": 1,
        "MSG.Path": "C:\\Users\\Public\\Downloads\\updater_20260926_234019.exe",
        "MSG.Profile": "Default deny executables",
        "MSG.Rule": "Block untrusted application",
        "MSG.SHA256": "775d486ec80d5cd7b615d573ac891579e3a2b518373804134121855cdd5d4ee8",
        "MSG.StationTime": "2026-09-27T00:01:00+00:00",
        "MSG.TestMode": 0,
        "MSG.User": "user23"
      }
    }
  }
}`,
    },
  ],
};
