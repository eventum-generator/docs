import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneC: GeneratorMeta = {
  slug: 'application-1c',
  displayName: '1C:Enterprise Event Log',
  category: 'application',
  description:
    'Synthetic 1C:Enterprise event-log records for one infobase, including authentication, data access and user administration. Switch between routine traffic and a linked privileged-account, payroll-access and log-management sequence.',
  dataSource: '1C:Enterprise registration/event log XML fields',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  generatorId: 'one-c',
  highlights: [
    '23/23 official event-log fields',
    'One infobase and stable user sessions',
    'Switchable privileged-account anomaly',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed admin logins, successful login from an unmanaged workstation, privileged user creation, payroll reads, then event-log settings change and reduction.',
  eventTypes: [
    {
      id: '_$Access$_.Access',
      description: 'Audited application-object access',
      frequency: '85.7%',
      category: 'database',
    },
    {
      id: '_$Session$_.Authentication',
      description: 'Successful session authentication',
      frequency: '11.9%',
      category: 'authentication',
    },
    {
      id: '_$Session$_.AuthenticationError',
      description: 'Failed administrator authentication',
      frequency: '1.0%',
      category: 'authentication',
    },
    {
      id: '_$Access$_.AccessDenied',
      description: 'Denied application-object access',
      frequency: '0.7%',
      category: 'database',
    },
    {
      id: '_$InfoBase$_.EventLogSettingsUpdate',
      description: 'Event-log settings changed',
      frequency: '0.2%',
      category: 'configuration',
    },
    {
      id: '_$InfoBase$_.EventLogReduce',
      description: 'Event log reduced',
      frequency: '0.2%',
      category: 'configuration',
    },
    {
      id: '_$User$_.New',
      description: 'Privileged user created',
      frequency: '0.2%',
      category: 'iam',
    },
    {
      id: '_$User$_.Update',
      description: 'User settings changed',
      frequency: '0.1%',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'One server and infobase identity across all records.',
    'Five staff accounts and four application objects drive routine traffic.',
    'Authentication advances the user session number; routine access reuses it.',
    'Every anomaly sequence uses a distinct service account and session, with twelve payroll reads.',
  ],
  parameters: [
    {
      name: 'infobase',
      defaultValue: 'AccountingDemo',
      description: 'Infobase name',
    },
    {
      name: 'server_name',
      defaultValue: 'srvr-1c-01.example.test',
      description: '1C event-log server',
    },
    {
      name: 'host_name',
      defaultValue: 'srvr-1c-01.example.test',
      description: 'Collector host',
    },
    {
      name: 'server_port',
      defaultValue: '1541',
      description: 'Main 1C server port',
    },
    {
      name: 'sync_port',
      defaultValue: '1542',
      description: 'Auxiliary 1C port',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS version',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the correlated anomaly chain alongside routine events; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Privileged user creation',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:26:31+00:00",
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
    "id": "00000000-0000-0000-0000-000000000105",
    "name": "admin01",
    "target": {
      "name": "svc_audit_001"
    }
  },
  "client": {
    "address": "UNMANAGED-WS-01"
  },
  "related": {
    "user": [
      "admin01",
      "svc_audit_001"
    ],
    "hosts": [
      "UNMANAGED-WS-01"
    ]
  },
  "message": "Пользователи.Новый пользователь",
  "one_c": {
    "event_log": {
      "level": "Information",
      "date": "2026-09-25T10:26:31+00:00",
      "application": "Enterprise",
      "application_presentation": "1C:Enterprise",
      "event_name": "_$User$_.New",
      "event_presentation": "Пользователи.Новый пользователь",
      "user_id": "00000000-0000-0000-0000-000000000105",
      "user_name": "admin01",
      "computer": "UNMANAGED-WS-01",
      "metadata_name": "",
      "metadata_presentation": "",
      "comment": "",
      "data": {
        "LoginAllowed": true,
        "Name": "svc_audit_001",
        "Roles": [
          "FullAccess"
        ]
      },
      "data_presentation": "Создан пользователь с ролью FullAccess",
      "transaction_status": "NotApplicable",
      "transaction_id": "",
      "connection": 9002,
      "session": 90002,
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
