/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDrwebEss: GeneratorMeta = {
  slug: 'security-drweb-ess',
  displayName: 'Dr.Web ESS Administrator Notifications',
  category: 'security',
  description:
    'Dr.Web Enterprise Security Suite 13.0.1 administrator notifications from one Server and 960 connected Windows stations, as collector-normalized ECS JSON of the published notification variables, not native CEF, syslog or a captured delivery payload. All seven notification classes occur in both modes. Recurring episodes join an Application Control block, an allowed HOSTS edit, quarantine of the blocked copy and a station-identity collision on one station.',
  dataSource:
    'Dr.Web ESS 13.0.1 selected administrator-notification variables, collector-normalized',
  eventFormat: 'ECS JSON',
  eventCount: 7,
  templateCount: 9,
  highlights: [
    'Seven notification classes, 49/54 variable names',
    '380 notifications an hour around the clock',
    'Recurring six-step station chain, 24 hours by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "On one station Application Control blocks a new executable copy, the same user allows a separate PowerShell HOSTS modification, a manual Scanner detects and quarantines that exact copy, the scan completes with one infected/moved object, a connection claiming the station's UUID fails authorization and another attempt collides with its registered identity; episodes span 32-56 minutes by default. The first episode starts at a uniformly random moment within the first anomaly_interval_hours or 24 hours, whichever is shorter (default 24, 6-8760); each later one is due one interval after the previous actual start and starts at a uniformly random moment in a window centred on that due time, a quarter of the interval wide but at most 6 hours (default 21 to 27 hours after the previous start), its first notification following 0.5-32 seconds after that moment, with no daily cycle and no catch-up. The station is drawn by activity weight among stations not running a Scanner job, with a free quarantine slot, not in the middle of an ordinary chain part whose detection of the blocked copy is reported or still to come, and not among the three previous episode stations; the executable differs from the previous one. Every step type and gap also occurs in background; only an ordinary duplicate-ID collision that would complete the ordered sequence on its station within 95 minutes of the block, with the blocked path equal to the detected path, is not reported, and this stays active after an episode completes.",
  generatorId: 'drweb',
  eventTypes: [
    {
      id: 'scan-completed',
      description:
        'Scan statistics of a clean or infected targeted Scanner run',
      frequency: '38.3% / 38.2% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Application Control blocks an untrusted executable launch',
      frequency: '19.0% / 19.4% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'station-authorization-failed',
      description: 'Station authorization failed, often retried',
      frequency: '13.2% / 12.8% measured share (off / on)',
      category: 'authentication',
    },
    {
      id: 'preventive-protection-allowed',
      description: 'User allows a PowerShell HOSTS modification in Ask mode',
      frequency: '9.5% / 9.8% measured share (off / on)',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'Scanner detects a copy and moves it to quarantine',
      frequency: '7.5% / 7.5% measured share (off / on)',
      category: 'malware',
    },
    {
      id: 'station-id-duplicate',
      description:
        "Station already logged in: a reconnect collides with the station's registered session",
      frequency: '7.1% / 6.9% measured share (off / on)',
      category: 'authentication',
    },
    {
      id: 'station-update-error',
      description: 'Critical error of station update, retried by the agent',
      frequency: '5.4% / 5.5% measured share (off / on)',
      category: 'package',
    },
  ],
  realismFeatures: [
    'One Server and 960 existing Windows stations in one primary group. Stations are picked at random with unequal activity weights drawn per run, about ten notifications per station a day on average, with no rotation or schedule, and independent workflows interleave: clean scans, launch blocks with retries, infected scans, user-allowed HOSTS edits, update failures and connection failures with retries and session collisions.',
    'About 380 notifications an hour around the clock (about 9,100 a day), each hour varying by up to 10%, with no daily cycle. Follow-up notifications (later workflow steps and retries) lag their modeled gap by 10 s in median (32 s at the 90th percentile, at most about 2 minutes), so the shortest launch retries arrive later than modeled.',
    'A block prevents launch; the separate PowerShell HOSTS edit uses Preventive protection Ask mode and neither reverses a block nor establishes execution. Move to quarantine removes the original copy, each station holds at most four quarantined copies, and deletion 72 hours after receipt is an assumed external administrator task, not a Dr.Web default or an emitted notification.',
    '@timestamp is UTC Server receipt in whole seconds; block and Preventive MSG.StationTime is 1-24 seconds earlier under a synchronized station-clock assumption. Workflow mix, retry probabilities, gaps, scan counters and delivery delays are synthetic training assumptions, as primary sources give no rates.',
    'About 400 times a day an ordinary workflow reproduces a contiguous part of the chain with its own timing. Background never completes the chain, and only its last step is withheld: an ordinary duplicate-ID collision that would complete the chain on its station is not reported (about 4 a day, 0.04% of notifications), and nothing else on the station changes. Detection (about 690 a day) and collision (about 640 a day) rates are set by this separability design and far exceed a typical fleet.',
    "An episode station never has a scan running, a full quarantine or an unfinished ordinary chain part at the episode start, which slightly favours quieter stations: within two hours of an episode its ordinary notifications run at 0.86 of the station's own rate, while ordinary block-to-detection prefixes show 0.86-1.09; activity alone does not single out episode stations.",
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
  "@timestamp": "2026-09-26T18:41:25+00:00",
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
  "message": "Application Control prevented launch of C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_183718.exe on WS-IT-112.",
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
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c912",
    "name": "WS-IT-112",
    "hostname": "WS-IT-112",
    "ip": [
      "10.20.15.132"
    ]
  },
  "user": {
    "name": "m.makarov"
  },
  "file": {
    "path": "C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_183718.exe",
    "name": "invoice.pdf_20260926_183718.exe"
  },
  "related": {
    "hosts": [
      "WS-IT-112"
    ],
    "ip": [
      "10.20.15.132"
    ],
    "user": [
      "m.makarov"
    ],
    "hash": [
      "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Application Control blocked the process",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c912",
        "name": "WS-IT-112",
        "ip": "10.20.15.132",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.AppCtlAction": 5,
        "MSG.AppCtlType": 1,
        "MSG.Path": "C:\\Users\\Public\\Downloads\\invoice.pdf_20260926_183718.exe",
        "MSG.Profile": "Default deny executables",
        "MSG.Rule": "Block untrusted application",
        "MSG.SHA256": "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221",
        "MSG.StationTime": "2026-09-26T18:41:12+00:00",
        "MSG.TestMode": 0,
        "MSG.User": "m.makarov"
      }
    }
  }
}`,
    },
  ],
};
