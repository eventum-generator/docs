import type { GeneratorMeta } from '@/lib/hub-types';

export const storageNetappOntapEms: GeneratorMeta = {
  slug: 'storage-netapp-ontap-ems',
  displayName: 'NetApp ONTAP EMS',
  category: 'storage',
  dataSource: 'ONTAP 9.12.1 EMS legacy-netapp syslog',
  description:
    'Storage-system EMS notifications for Snapshot creation and authentication, with a switchable failed-login-to-lockout chain.',
  generatorId: 'ontap',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'ONTAP 9.12.1 documented legacy-netapp syslog format',
    'ZAPI Snapshot success and failed-login background',
    'Three failed admin logins followed by account lockout',
  ],
  anomalyChain:
    'Three failed SSH logins for admin on one ONTAP node are followed by an account lockout within 20 minutes.',
  eventTypes: [
    {
      id: 'zapi.snapshot.success',
      description: 'Asynchronous ZAPI Snapshot created',
      frequency: '82.5% with anomaly mode',
      category: 'file',
    },
    {
      id: 'security.invalid.login',
      description: 'Failed SSH authentication',
      frequency: '15% with anomaly mode',
      category: 'authentication',
    },
    {
      id: 'useradmin.lockedout.user',
      description: 'Account lockout after failed attempts',
      frequency: '2.5% with anomaly mode',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Native line is assembled from NetApp 9.12.1 format and EMS message specifications, not a captured line.',
    'A stable ONTAP node and account link the login failures to lockout.',
    'The EMS messages omit client IP; no source.ip is invented.',
  ],
  format: ['JSON', 'ECS', 'legacy-netapp syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked login-failure and lockout chain',
    },
    {
      name: 'node_name',
      defaultValue: 'cluster1-01',
      description: 'ONTAP node in the syslog header',
    },
    {
      name: 'vserver',
      defaultValue: 'cluster1',
      description: 'Vserver in failed-login messages',
    },
    {
      name: 'snapshot_volume',
      defaultValue: 'vol_data',
      description: 'Volume in ZAPI Snapshot messages',
    },
    {
      name: 'target_user',
      defaultValue: 'admin',
      description: 'Account in the anomaly chain',
    },
    {
      name: 'incidental_user',
      defaultValue: 'alice',
      description: 'Account with isolated background failures',
    },
    {
      name: 'lockout_attempts',
      defaultValue: '3',
      description: 'Lockout threshold in the EMS message',
    },
  ],
  sampleOutputs: [
    {
      title: 'ONTAP account lockout',
      json: String.raw`{
  "@timestamp": "2026-09-25T15:00:39+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "useradmin.lockedout.user",
    "category": [
      "authentication"
    ],
    "kind": "event",
    "original": "<11>Sep 25 15:00:39 [cluster1-01:useradmin.lockedout.user:error]: User 'admin' is locked out of the appliance for failing authentication '3' times.",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "host": {
    "name": "cluster1-01"
  },
  "log": {
    "syslog": {
      "facility": {
        "code": 1,
        "name": "user"
      },
      "priority": 11,
      "severity": {
        "code": 3,
        "name": "error"
      }
    }
  },
  "netapp": {
    "ems": {
      "message": "User 'admin' is locked out of the appliance for failing authentication '3' times.",
      "name": "useradmin.lockedout.user",
      "severity": "error"
    }
  },
  "related": {
    "user": [
      "admin"
    ]
  },
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
