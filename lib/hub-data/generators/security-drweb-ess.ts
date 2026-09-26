/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDrwebEss: GeneratorMeta = {
  slug: 'security-drweb-ess',
  displayName: 'Dr.Web ESS Administrator Notifications',
  category: 'security',
  description:
    'Selected ESS 13.0.1 administrator-notification variables normalized into ECS. Daily blocked-launch, separate allowed access, quarantine/scan and station-identity sequences.',
  format: ['JSON', 'ECS'],
  dataSource: 'Dr.Web ESS 13.0.1 selected normalized notification variables',
  eventCount: 7,
  templateCount: 9,
  highlights: [
    'Seven notification-variable schemas',
    'Bounded quarantine and scan state',
    'Daily sequences with shared stations',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours six notifications span 50 minutes: executable launch block, separate allowed protected-object access, matched quarantine/scan completion, then failed station authorization and duplicate stationID. These correlations do not prove blocked malware execution or Agent cloning.',
  generatorId: 'drweb',
  eventTypes: [
    {
      id: 'scan-completed',
      description: 'Clean or infected targeted scan completion',
      frequency: 'Clean workflow weight 48; after infected scan',
      category: 'malware',
    },
    {
      id: 'application-control-blocked',
      description: 'Deny an untrusted executable launch',
      frequency: 'Weight 18',
      category: 'process',
    },
    {
      id: 'security-threat-detected',
      description: 'One infected copy moved to quarantine',
      frequency: 'Workflow weight 15, followed by completion',
      category: 'malware',
    },
    {
      id: 'preventive-protection-allowed',
      description: 'User allows protected-object access in Ask mode',
      frequency: 'Weight 8',
      category: 'process',
    },
    {
      id: 'station-update-error',
      description: 'Critical station update error',
      frequency: 'Weight 6',
      category: 'package',
    },
    {
      id: 'station-authorization-failed',
      description: 'Failed station authorization notification',
      frequency: 'Connection-noise workflow weight 5',
      category: 'authentication',
    },
    {
      id: 'station-id-duplicate',
      description: 'Duplicate existing registered station identity',
      frequency: 'Connection-noise workflow weight 5',
      category: 'authentication',
    },
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Mix recurring episodes with ordinary activity; false emits ordinary activity',
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
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Finite interval from 6 to 8760 hours, measured between actual starts',
    },
  ],
  sampleOutputs: [
    {
      title: 'Actual final normalized notification',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:00:00+00:00",
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
  "message": "Application Control prevented launch of C:\\Users\\Public\\Downloads\\invoice.pdf_20260927_000000.exe on WS-FIN-01.",
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
    "id": "10a56af1-2be3-4381-927f-4d7b1e02c001",
    "name": "WS-FIN-01",
    "hostname": "WS-FIN-01",
    "ip": [
      "10.20.10.21"
    ]
  },
  "user": {
    "name": "a.petrov"
  },
  "related": {
    "hosts": [
      "WS-FIN-01"
    ],
    "ip": [
      "10.20.10.21"
    ],
    "user": [
      "a.petrov"
    ],
    "hash": [
      "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221"
    ]
  },
  "drweb": {
    "ess": {
      "notification": "Application Control blocked the process",
      "station": {
        "id": "10a56af1-2be3-4381-927f-4d7b1e02c001",
        "name": "WS-FIN-01",
        "ip": "10.20.10.21",
        "primary_group": "Workstations"
      },
      "variables": {
        "MSG.AppCtlAction": 5,
        "MSG.AppCtlType": 1,
        "MSG.Path": "C:\\Users\\Public\\Downloads\\invoice.pdf_20260927_000000.exe",
        "MSG.Profile": "Default deny executables",
        "MSG.Rule": "Block untrusted application",
        "MSG.SHA256": "57a04e9de7e32d301ddbf6b93359a45f1c17f24e8a45b5e4d79ed28533e3b221",
        "MSG.StationTime": "2026-09-26T23:59:58+00:00",
        "MSG.TestMode": 0,
        "MSG.User": "a.petrov"
      }
    }
  }
}`,
    },
  ],
  realismFeatures: [
    'One notification every ten minutes from one Server and 48 connected Windows stations. Nine physical templates cover dispatcher, shared envelope and seven schema bodies.',
    'A block prevents executable launch. A separate permitted PowerShell protected-object action does not prove execution of the blocked object.',
    'Move to quarantine removes the original copy; completion matches the targeted scan. State retains at most four copies per station. An external 72-hour deletion task is explicit environment context, not an emitted notification.',
    'Every selected class occurs ordinarily in both modes. The first four episode records correlate station/user/time within 30 minutes; only block and threat share the exact path. The last two correlate existing stationID within 10 minutes.',
    '49/54 published class-variable names are covered. The vendor specifies editable notification variables, not fixed native serialization. Exact wire/enum/live-parser parity remains unverified.',
  ],
};
