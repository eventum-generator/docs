import type { GeneratorMeta } from '@/lib/hub-types';

export const identityNetwrixAuditorCef: GeneratorMeta = {
  slug: 'identity-netwrix-auditor-cef',
  displayName: 'Netwrix Auditor CEF Export',
  category: 'identity',
  description:
    'Netwrix Auditor Active Directory user-creation CEF with a five-account provisioning burst.',
  dataSource:
    'Netwrix Auditor 10.8 CEF Export Add-on: Active Directory Added user',
  format: ['CEF', 'Syslog', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'identity-netwrix-auditor-cef',
  highlights: [
    'Vendor-published Added user CEF record',
    'All five published extension fields preserved',
    'Five accounts created by one operator within seconds',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One operator creates five distinct accounts in the same path on one domain controller within seconds.',
  eventTypes: [
    {
      id: 'Added',
      description: 'Active Directory user created',
      frequency: 'All events; five per chain',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'CEF header and five extension fields follow the Auditor 10.8 Add-on example.',
    'The same operator, controller and path link the five anomaly steps.',
    'Other Auditor CEF actions are excluded because full raw samples were not published.',
  ],
  parameters: [
    {
      name: 'domain_controller',
      defaultValue: 'dc-01.example.test',
      description: 'Native shost and ECS host',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'chain_operator',
      defaultValue: String.raw`EXAMPLE\\svc-provision`,
      description: 'Stable chain actor',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated user creation',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:09:57+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "added-user",
    "category": [
      "iam"
    ],
    "code": "Added",
    "dataset": "netwrix_auditor.cef",
    "kind": "event",
    "original": "CEF:0|Netwrix|Active Directory|1.0|Added|Added user|0|shost=dc-01.example.test cat=user suser=EXAMPLE\\svc-provision filePath=\\local\\example\\users\\contractor01 start=Sep 25 2026 14:09:57",
    "type": [
      "creation"
    ]
  },
  "host": {
    "name": "dc-01.example.test"
  },
  "netwrix": {
    "auditor": {
      "class_id": "Added",
      "device_version": "1.0",
      "extension": {
        "cat": "user",
        "filePath": "\\local\\example\\users\\contractor01",
        "shost": "dc-01.example.test",
        "start": "Sep 25 2026 14:09:57",
        "suser": "EXAMPLE\\svc-provision"
      },
      "name": "Added user",
      "product": "Active Directory",
      "severity": 0,
      "vendor": "Netwrix",
      "version": 0
    }
  },
  "related": {
    "user": [
      "EXAMPLE\\svc-provision",
      "contractor01"
    ]
  },
  "user": {
    "name": "EXAMPLE\\svc-provision",
    "target": {
      "name": "contractor01"
    }
  }
}`,
    },
  ],
};
