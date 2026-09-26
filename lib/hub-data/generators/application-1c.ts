import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneC: GeneratorMeta = {
  slug: 'application-1c',
  displayName: '1C:Enterprise Event Log',
  category: 'application',
  description:
    '1C:Enterprise 8.3.27 event-log JSON projection with permission-aware sessions, bounded temporary users and recurring payroll-access sequences.',
  dataSource: 'Selected 1C:Enterprise event-log collector JSON projection',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  generatorId: 'one-c',
  highlights: [
    'Eight selected classes in both modes',
    'Temporary UUID and session lifecycle',
    'Twelve-hour, 200-second access sequences',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every twelve hours, after ordinary maintenance finishes, four failed administrator attempts precede success, creation of a temporary FullAccess account, its authentication and twelve payroll reads in one session. That incarnation is deleted, then old event-log history is reduced. Twenty-one records span 200 seconds. Names, actors and individual actions also occur in ordinary maintenance; each incarnation has a fresh UUID.',
  eventTypes: [
    {
      id: '_$Access$_.Access',
      description: 'Successful controlled reads with nested logged rows',
      frequency: '7801 records in the 25h05 default enabled capture',
      category: 'database',
    },
    {
      id: '_$Access$_.AccessDenied',
      description: 'Object-level Read permission denial',
      frequency: '500 records in that capture',
      category: 'database',
    },
    {
      id: '_$Session$_.Authentication',
      description: 'Successful authentication opens a selected session',
      frequency: '332 records in that capture',
      category: 'authentication',
    },
    {
      id: '_$Session$_.AuthenticationError',
      description:
        'Failed attempted identity; native authenticated UUID omitted',
      frequency: '285 records in that capture',
      category: 'authentication',
    },
    {
      id: '_$User$_.New',
      description: 'Create the temporary account incarnation',
      frequency: '14 records in that capture',
      category: 'iam',
    },
    {
      id: '_$User$_.Update',
      description: 'Update an existing staff account; unproved Data omitted',
      frequency: '71 records in that capture',
      category: 'iam',
    },
    {
      id: '_$User$_.Delete',
      description: 'Delete the previously created temporary incarnation',
      frequency: '14 records in that capture',
      category: 'iam',
    },
    {
      id: '_$InfoBase$_.EventLogReduce',
      description: 'Reduce assumed pre-existing old records',
      frequency: '14 records in that capture',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'One source record every ten seconds, UTC clock and five staff session slots plus at most one temporary account/session. Operations require prior authentication, current sessions and configured object rights.',
    'Both modes retain the same actors, workstation and four temporary names. Ordinary creation, authentication, read and deletion are separated by ten minutes; failure is followed by same-account success.',
    'Controlled reads project nested ValueTable rows and metadata arrays. Authentication uses the documented OSUser key; add-user Roles arrays contain configured role values. Unproved update/deletion/reduction Data is omitted.',
    'Every temporary incarnation has a fresh UUID and numeric session/connection. Closure before deletion is an internal profile assumption because exact native session-end bytes are unavailable.',
    'Reduction targets assumed history older than the current-day cutoff. It does not prove recent sequence erasure or exfiltration. EventLogSettingsUpdate is excluded from this modern, already sequential log profile.',
    'The 23-field source union is presence coverage, not full native fidelity. Output is a selected collector projection, without event.original; exact 8.3.27 XML/.lgf serialization, failed-session bytes and live parsing remain unverified.',
  ],
  parameters: [
    {
      name: 'infobase',
      defaultValue: 'AccountingDemo',
      description: 'Synthetic configuration/infobase name',
    },
    {
      name: 'server_name',
      defaultValue: 'srvr-1c-01.example.test',
      description: 'Working server context',
    },
    {
      name: 'host_name',
      defaultValue: 'srvr-1c-01.example.test',
      description: 'Synthetic collector host',
    },
    {
      name: 'server_port',
      defaultValue: '1541',
      description: 'Main server port',
    },
    {
      name: 'sync_port',
      defaultValue: '1542',
      description: 'Auxiliary server port',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'Normalized ECS context',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring dense sequences',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '12',
      description:
        'Positive finite source-time interval, clamped to at least one hour',
    },
  ],
  sampleOutputs: [
    {
      title: 'Temporary user creation with fresh target UUID',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:00:50+00:00",
  "ecs": {
    "version": "8.11.0"
  },
  "event": {
    "kind": "event",
    "module": "one_c",
    "dataset": "one_c.event_log",
    "action": "_$User$_.New",
    "category": [
      "iam"
    ],
    "type": [
      "creation"
    ],
    "outcome": "success"
  },
  "host": {
    "name": "srvr-1c-01.example.test"
  },
  "service": {
    "name": "AccountingDemo"
  },
  "user": {
    "name": "admin01",
    "id": "00000000-0000-0000-0000-000000000105",
    "target": {
      "name": "svc_audit_02",
      "id": "74f166bc-7e70-42cb-9bec-2396bca05664"
    }
  },
  "client": {
    "address": "ADM-WS-01"
  },
  "related": {
    "user": [
      "admin01",
      "svc_audit_02"
    ],
    "hosts": [
      "ADM-WS-01"
    ]
  },
  "message": "Пользователи.Новый пользователь",
  "one_c": {
    "event_log": {
      "level": "Information",
      "date": "2026-09-25T12:00:50+00:00",
      "application": "Enterprise",
      "application_presentation": "1C:Enterprise",
      "event_name": "_$User$_.New",
      "event_presentation": "Пользователи.Новый пользователь",
      "user_id": "00000000-0000-0000-0000-000000000105",
      "user_name": "admin01",
      "computer": "ADM-WS-01",
      "metadata_name": "",
      "metadata_presentation": "",
      "comment": "",
      "data": {
        "Roles": [
          "Roles.FullAccess"
        ]
      },
      "data_presentation": "",
      "transaction_status": "NotApplicable",
      "transaction_id": "",
      "connection": 457,
      "session": 1357,
      "server_name": "srvr-1c-01.example.test",
      "port": 1541,
      "sync_port": 1542,
      "session_data_separation": {},
      "session_data_separation_presentation": []
    }
  }
}`,
    },
  ],
};
