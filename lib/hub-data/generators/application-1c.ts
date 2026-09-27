import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneC: GeneratorMeta = {
  slug: 'application-1c',
  displayName: '1C:Enterprise Event Log',
  category: 'application',
  description:
    "1C:Enterprise 8.3.27 event-log collector projection for a client/server infobase: ECS-style JSON with snake_case source fields under one_c.event_log, not a native XML or .lgf export and without event.original. Six staff accounts, four reusable temporary account names and five configured objects with explicit permissions. Recurring episodes join an administrator's failed logins, a temporary FullAccess account, its payroll reads, its deletion and an event-log reduction.",
  dataSource:
    '1C:Enterprise 8.3.27 event log (client/server, sequential .lgf storage), selected collector JSON projection',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  generatorId: 'one-c',
  highlights: [
    'Eight system event classes in both modes',
    'Random sessions, failed-login runs and temporary accounts',
    'Recurring temporary-account chain, 12 hours by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 12 hours of source time by default (the first due one interval after the window start, its first failed attempt 1-600 s later, or later still while background occupies the seconds, a temporary name is busy or the administrator is under the guard hold; each next due one interval after the previous episode's actual first failed attempt, so starts drift later and never catch up), an administrator fails to log in four or more times from its own workstation and then logs in. Seconds later it creates a temporary Roles.FullAccess account, the new incarnation logs in and reads the payroll register several times, the same administrator deletes that incarnation and reduces old event-log records. Administrators alternate, temporary names differ and every incarnation gets a fresh UUID. Every shorter part also occurs in background; only the whole ordered sequence joined by one administrator and one incarnation within 30 minutes is episode-only.",
  eventTypes: [
    {
      id: '_$Access$_.Access',
      description: 'Successful controlled read with one nested logged row',
      frequency: '89.02% background share',
      category: 'database',
    },
    {
      id: '_$Access$_.AccessDenied',
      description: 'Object-level Read permission denial',
      frequency: '3.95% background share',
      category: 'database',
    },
    {
      id: '_$Session$_.AuthenticationError',
      description: 'Failed attempt; no native authenticated UUID is asserted',
      frequency: '3.00% background share',
      category: 'authentication',
    },
    {
      id: '_$Session$_.Authentication',
      description: 'Successful authentication opens a session',
      frequency: '2.88% background share',
      category: 'authentication',
    },
    {
      id: '_$User$_.Update',
      description:
        'Administrator updates another staff account; unproven native Data omitted',
      frequency: '0.55% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.New',
      description: 'Administrator creates one temporary account',
      frequency: '0.23% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.Delete',
      description: 'Administrator deletes that temporary incarnation',
      frequency: '0.23% background share',
      category: 'iam',
    },
    {
      id: '_$InfoBase$_.EventLogReduce',
      description:
        'Administrator reduces records older than the assumed cutoff',
      frequency: '0.14% background share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Six staff accounts (two accountants, one sales and one warehouse user, two administrators), four temporary names reused after deletion and five fictional configuration objects. Accountants read all five objects, Sales and Warehouse are denied the payroll register; these are configured scenario permissions, not privileges inferred from role names.',
    'One template renders every source second in UTC and most seconds are idle: captures of 25 h 05 min hold 8,582-9,223 records, about 350 per hour. Background decisions are random draws with no fixed period, rotation or script; rates are synthetic workload settings, stationary, with no working hours or weekends.',
    'Staff sessions last a random lifetime (median about 70 minutes) and the window opens mid-stream with pre-window sessions; session and connection numbers grow in random steps. Session end is not emitted, because its native record body was not established.',
    "Failed logins come in retried runs: about 54 runs of two or more a day and 6.7 administrator runs of four or more. About 16 temporary-account lifecycles a day log in from the creator's workstation, read the payroll register 1-49 times and are deleted by the creator in 92% of cases, 59% of deletions followed by a reduction.",
    'One background guard keeps ordinary traffic from completing the chain: a creator that deletes an account created within 30 minutes of four or more of its failed logins runs no reduction for the next 30 minutes. At the default interval, creations after four or more creator failures occur 7.4 times a day with anomalies against 4.7 without (z 3.3 over 800 hours); at 1 hour the partial-step counts reveal the mode.',
    'The 23-field union of the documented XML elements is field presence, not native value fidelity. Failed authentications omit native user attribution, update, deletion and reduction omit unproven Data, and management targets are synthetic enrichment. Reductions cut assumed history before the current day, so no recent-log erasure or exfiltration is claimed; full native exports and live parser parity remain unverified.',
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
      defaultValue: '12',
      description:
        'Source-time interval between episodes, clamped to at least one hour',
    },
  ],
  sampleOutputs: [
    {
      title: 'Temporary account creation, first episode',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:08:13+00:00",
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
      "name": "svc_audit_04",
      "id": "1c308303-6015-45cd-83cf-960eaf475628"
    }
  },
  "client": {
    "address": "ADM-WS-01"
  },
  "related": {
    "user": [
      "admin01",
      "svc_audit_04"
    ],
    "hosts": [
      "ADM-WS-01"
    ]
  },
  "message": "Пользователи.Новый пользователь",
  "one_c": {
    "event_log": {
      "level": "Information",
      "date": "2026-09-25T12:08:13+00:00",
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
      "connection": 596,
      "session": 1511,
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
