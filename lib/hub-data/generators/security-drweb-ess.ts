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
    "On one station Application Control blocks a new executable copy, the same user allows a separate PowerShell HOSTS modification, a manual Scanner detects and quarantines that exact copy, the scan completes with one infected/moved object, a connection claiming the station's UUID fails authorization and another attempt collides with its registered identity; measured spans are 27-50 minutes by default. The first episode starts at a uniformly random moment within the first anomaly_interval_hours or 24 hours, whichever is shorter (default 24, 6-8760); each later one is due one interval after the previous actual start and starts at a uniformly random moment in a window centred on that due time, a quarter of the interval wide but at most 6 hours, then takes the first free 10-second render, with no daily cycle and no catch-up. The station is one not running a Scanner job, with a free quarantine slot, not in the middle of an ordinary chain part and not among the last three episodes' stations; the executable differs from the previous one. Every step type and gap also occurs in background; only an ordinary duplicate-ID collision that would complete the ordered sequence on its station within 95 minutes of the block, with the blocked path equal to the detected path, is not emitted, and this stays active after an episode completes.",
  generatorId: 'drweb',
  eventTypes: [
    {
      id: 'scan-completed',
      description:
        'Scan statistics of a clean or infected targeted Scanner run',
      frequency: '36.0% / 37.5% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Application Control blocks an untrusted executable launch',
      frequency: '17.9% / 18.1% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'station-authorization-failed',
      description: 'Station authorization failed, often retried',
      frequency: '14.8% / 13.2% measured share (off / on)',
      category: 'authentication',
    },
    {
      id: 'preventive-protection-allowed',
      description: 'User allows a PowerShell HOSTS modification in Ask mode',
      frequency: '10.1% / 10.2% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'Scanner detects a copy and moves it to quarantine',
      frequency: '7.4% / 7.8% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'station-update-error',
      description: 'Critical error of station update, retried by the agent',
      frequency: '5.7% / 5.9% measured share (off / on)',
      category: 'package',
    },
    {
      id: 'station-id-duplicate',
      description:
        "Station already logged in: a reconnect collides with the station's registered session",
      frequency: '8.0% / 7.2% measured share (off / on)',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'One Server and 48 existing Windows stations in one primary group. Stations are picked at random with unequal activity weights drawn per run, with no rotation or schedule, and independent workflows interleave: clean scans, launch blocks with retries, infected scans, user-allowed HOSTS edits, update failures and connection failures with retries and session collisions.',
    'A block prevents launch; the separate PowerShell HOSTS edit uses Preventive protection Ask mode and neither reverses a block nor establishes execution. Move to quarantine removes the original copy, each station holds at most four quarantined copies, and deletion 72 hours after receipt is an assumed external administrator task, not a Dr.Web default or an emitted notification.',
    '@timestamp is UTC Server receipt; block and Preventive MSG.StationTime is 1-24 seconds earlier under a synchronized station-clock assumption. At most one notification per 10-second tick, 435-478 a day with no daily cycle; workflow mix, retries, gaps, scan counters and delays are synthetic training assumptions, as primary sources give no rates.',
    'About 20 times a day an ordinary workflow reproduces a contiguous part of the chain with its own timing. A guard acts only on the last step: an ordinary duplicate-ID collision that would complete the chain on its station within 95 minutes of the block is not emitted, and nothing else on the station changes. Detection (about 35 a day) and collision (about 38 a day) rates are set by this separability design and far exceed a typical 48-station fleet.',
    'Episode stations are chosen among stations the scheduler can use at that moment, which favours quieter ones: across 45 episodes the ordinary activity in the 2 h and 6 h before an episode ran at about 0.6-0.7 of matched background times, with wide run-to-run spread (one fresh pair measured 1.5), and no single capture separates episode stations by activity alone.',
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
  "@timestamp": "2026-09-26T10:52:26+00:00",
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
  "message": "Application Control prevented launch of C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_104640.exe on WS-IT-03.",
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
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c043",
    "name": "WS-IT-03",
    "hostname": "WS-IT-03",
    "ip": [
      "10.20.15.103"
    ]
  },
  "user": {
    "name": "user43"
  },
  "file": {
    "path": "C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_104640.exe",
    "name": "invoice.pdf_20260926_104640.exe"
  },
  "related": {
    "hosts": [
      "WS-IT-03"
    ],
    "ip": [
      "10.20.15.103"
    ],
    "user": [
      "user43"
    ],
    "hash": [
      "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Application Control blocked the process",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c043",
        "name": "WS-IT-03",
        "ip": "10.20.15.103",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.AppCtlAction": 5,
        "MSG.AppCtlType": 1,
        "MSG.Path": "C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_104640.exe",
        "MSG.Profile": "Default deny executables",
        "MSG.Rule": "Block untrusted application",
        "MSG.SHA256": "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221",
        "MSG.StationTime": "2026-09-26T10:52:19+00:00",
        "MSG.TestMode": 0,
        "MSG.User": "user43"
      }
    }
  }
}`,
    },
  ],
};
