import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneC: GeneratorMeta = {
  slug: 'application-1c',
  displayName: '1C:Enterprise Event Log',
  category: 'application',
  description:
    "1C:Enterprise 8.3.27 event-log collector projection for a client/server, single-data-area infobase: ECS-style JSON with snake_case source fields under one_c.event_log, not a native XML or .lgf export and without event.original. Six staff accounts, four reusable temporary account names and five configured objects with explicit permissions. Recurring episodes, weekly by default, join an administrator's failed logins, a temporary FullAccess account, its payroll reads, its deletion and an event-log reduction.",
  dataSource:
    '1C:Enterprise 8.3.27 event log (client/server, sequential .lgf storage), selected collector JSON projection',
  eventFormat: 'ECS JSON',
  eventCount: 8,
  templateCount: 1,
  generatorId: 'one-c',
  highlights: [
    'Eight system event classes in both modes',
    'Random sessions, failed-login runs and temporary accounts',
    'Recurring temporary-account chain, weekly by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About once a week of source time by default (anomaly_interval_hours 168, clamped to at least one hour): the first episode starts at a random time within the first interval, or the first 24 hours when the interval is longer; each later one starts at a random time within a window of a quarter of the interval (at most 6 hours) centred on one interval after the previous episode's first failed attempt, or once one of the administrator's own temporary names is free if both are in use at that moment. An administrator fails to log in four or more times from its own workstation and logs in. Seconds later it creates a temporary Roles.FullAccess account under one of its own temporary names, the new incarnation logs in and reads the payroll register several times, and the same administrator deletes that incarnation and reduces old event-log records, all within 30 minutes of the first failure. Administrators alternate, the temporary name differs from the previous episode's and every incarnation gets a fresh UUID. Every shorter part also occurs in background; only the whole ordered sequence joined by one administrator and one incarnation is episode-only.",
  eventTypes: [
    {
      id: '_$Access$_.Access',
      description: 'Successful controlled read with one nested logged row',
      frequency: '91.93% background share',
      category: 'database',
    },
    {
      id: '_$Access$_.AccessDenied',
      description: 'Object-level Read permission denial',
      frequency: '4.01% background share',
      category: 'database',
    },
    {
      id: '_$Session$_.Authentication',
      description: 'Successful authentication opens a session',
      frequency: '2.84% background share',
      category: 'authentication',
    },
    {
      id: '_$User$_.Update',
      description:
        'Administrator updates another staff account; unproven native Data omitted',
      frequency: '0.54% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.New',
      description: 'Administrator creates one temporary account',
      frequency: '0.19% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.Delete',
      description: 'Administrator deletes that temporary incarnation',
      frequency: '0.19% background share',
      category: 'iam',
    },
    {
      id: '_$InfoBase$_.EventLogReduce',
      description:
        'Administrator reduces records older than the assumed cutoff',
      frequency: '0.15% background share',
      category: 'configuration',
    },
    {
      id: '_$Session$_.AuthenticationError',
      description: 'Failed attempt; no native authenticated UUID is asserted',
      frequency: '0.15% background share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Six staff accounts (two accountants, one sales and one warehouse user, two administrators), four temporary account names reused after deletion and five fictional configuration objects. Accountants read all five objects; Sales and Warehouse are denied the payroll register. These are configured scenario permissions, not privileges inferred from role names.',
    'About 8,500 records a day: staff activity at about 350 records per hour, the hourly count varying by up to 10%, and administrator logins about 120 times a day, the day count varying by up to 30%, plus a fresh session for half of their management tasks. Rates do not vary by time of day or day of week. Source time has whole seconds, and about 5% of records share their second with the previous one.',
    'The data opens mid-stream: most staff already hold a session that began earlier. Sessions last a random lognormal lifetime (median about 70 minutes), and the operation after a login follows seconds later (median 29 s). Session and connection numbers grow in random steps. Session end is not recorded, because its native record body was not established.',
    'About 5% of login attempts fail (4-5% for staff, about 6% for administrators); a failed attempt is retried after a median 22 s, and 68% of runs end in a successful login. Run counts fall with the number of failures: administrator runs of four or more failures occur about 0.9 times a day, some of them from a maintenance client retrying a stale saved password.',
    "About 16 temporary-account lifecycles a day, each administrator keeping two of the four names and using the others only while both of its own are taken. The account logs in from its creator's workstation, reads the payroll register 1-113 times (median 6), and the creator deletes it in 90% of lifecycles, lifespans median about 13 minutes. About 13 event-log reductions a day; 72% of deletions are followed within 30 minutes by the deleter's reduction, but only 10% of same-administrator deletions that end four failures, a login and the creation within 30 minutes of the first failure (always after those 30 minutes), against 77% of other deletions.",
    'With anomaly_mode true each episode adds its own records, so counts of the chain parts are about one per episode higher than in background; the weekly default keeps the episode rare against about six administrator runs of four or more failed logins a week. In about one episode in seven an ordinary login by the same administrator falls between its failed attempts.',
    'The 23-field union of the documented XML elements is field presence, not native value fidelity. Failed authentications omit native user attribution; update, deletion and reduction omit unproven Data, and management targets are synthetic enrichment. Reductions cut assumed history before the current day, so no recent-log erasure or exfiltration is claimed; full native exports and live parser parity are unverified.',
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
      description:
        'Add recurring anomaly episodes; false produces only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '168',
      description:
        'Source-time interval between episodes, clamped to at least one hour',
    },
  ],
  sampleOutputs: [
    {
      title: 'Temporary account creation, first episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T21:04:45+00:00",
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
      "name": "svc_audit_01",
      "id": "03c84f98-238d-48b6-89c8-ce448c4370b8"
    }
  },
  "client": {
    "address": "ADM-WS-01"
  },
  "related": {
    "user": [
      "admin01",
      "svc_audit_01"
    ],
    "hosts": [
      "ADM-WS-01"
    ]
  },
  "message": "Пользователи.Новый пользователь",
  "one_c": {
    "event_log": {
      "level": "Information",
      "date": "2026-09-01T21:04:45+00:00",
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
      "connection": 634,
      "session": 1620,
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
