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
    "About every 12 hours of source time by default (anomaly_interval_hours, clamped to at least one hour): the first episode starts at a uniformly random time within the first interval, or the first 24 hours when the interval is longer; each later one starts at a random time within a window of a quarter of the interval (at most 6 hours) centred on one interval after the previous episode's actual first failed attempt. The first attempt takes the next second that background leaves free and waits while no temporary name is free. An administrator fails to log in four or more times from its own workstation and then logs in. Seconds later it creates a temporary Roles.FullAccess account, the new incarnation logs in and reads the payroll register several times, and the same administrator deletes that incarnation and reduces old event-log records. Administrators alternate, temporary names differ and every incarnation gets a fresh UUID. Every shorter part also occurs in background; only the whole ordered sequence joined by one administrator and one incarnation within 30 minutes of the first matched failure is episode-only.",
  eventTypes: [
    {
      id: '_$Access$_.Access',
      description: 'Successful controlled read with one nested logged row',
      frequency: '89.19% background share',
      category: 'database',
    },
    {
      id: '_$Access$_.AccessDenied',
      description: 'Object-level Read permission denial',
      frequency: '3.96% background share',
      category: 'database',
    },
    {
      id: '_$Session$_.AuthenticationError',
      description: 'Failed attempt; no native authenticated UUID is asserted',
      frequency: '3.03% background share',
      category: 'authentication',
    },
    {
      id: '_$Session$_.Authentication',
      description: 'Successful authentication opens a session',
      frequency: '2.85% background share',
      category: 'authentication',
    },
    {
      id: '_$User$_.Update',
      description:
        'Administrator updates another staff account; unproven native Data omitted',
      frequency: '0.53% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.New',
      description: 'Administrator creates one temporary account',
      frequency: '0.16% background share',
      category: 'iam',
    },
    {
      id: '_$User$_.Delete',
      description: 'Administrator deletes that temporary incarnation',
      frequency: '0.16% background share',
      category: 'iam',
    },
    {
      id: '_$InfoBase$_.EventLogReduce',
      description:
        'Administrator reduces records older than the assumed cutoff',
      frequency: '0.12% background share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Six staff accounts (two accountants, one sales and one warehouse user, two administrators), four temporary names reused after deletion and five fictional configuration objects. Accountants read all five objects, Sales and Warehouse are denied the payroll register; these are configured scenario permissions, not privileges inferred from role names.',
    'One template renders every source second in UTC and most seconds are idle: 72-hour captures hold 24,942-25,541 records, about 350 per hour. Background decisions are random draws with no fixed period, rotation or script; rates are synthetic workload settings, stationary, with no working hours or weekends.',
    'Staff sessions last a random lognormal lifetime (median about 70 minutes) and the window opens mid-stream with pre-window sessions; session and connection numbers grow in random steps. Session end is not emitted, because its native record body was not established.',
    "Failed logins come in retried runs: about 55 runs of two or more a day, 10 of four or more and 6.9 administrator runs of four or more. About 16 temporary-account lifecycles a day log in from the creator's workstation and read the payroll register 1-57 times (median 6); the creator deletes the account in 86% of lifecycles, and 67% of deletions are followed within 30 minutes by a reduction by the deleting administrator.",
    "One background guard acts only on the chain's last step: a background event-log reduction that would complete the chain is not recorded, and no other record is moved, delayed or given to another account. At the default interval, administrator runs of four or more failures occur 7.3 times a day with anomalies against 6.8 without (z 0.3), and creations after four or more creator failures 6.7 against 5.4 (z 0.8); at 6 hours the second count rises to about 9 a day, and at 1 hour the partial-step counts reveal the mode.",
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
  "@timestamp": "2026-09-25T09:58:28+00:00",
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
    "name": "admin02",
    "id": "00000000-0000-0000-0000-000000000106",
    "target": {
      "name": "svc_audit_01",
      "id": "7b14a0fa-6a8e-4e19-93f5-8f7d1f85d958"
    }
  },
  "client": {
    "address": "ADM-WS-02"
  },
  "related": {
    "user": [
      "admin02",
      "svc_audit_01"
    ],
    "hosts": [
      "ADM-WS-02"
    ]
  },
  "message": "Пользователи.Новый пользователь",
  "one_c": {
    "event_log": {
      "level": "Information",
      "date": "2026-09-25T09:58:28+00:00",
      "application": "Enterprise",
      "application_presentation": "1C:Enterprise",
      "event_name": "_$User$_.New",
      "event_presentation": "Пользователи.Новый пользователь",
      "user_id": "00000000-0000-0000-0000-000000000106",
      "user_name": "admin02",
      "computer": "ADM-WS-02",
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
      "connection": 390,
      "session": 1724,
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
