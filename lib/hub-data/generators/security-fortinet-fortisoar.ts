import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortisoar: GeneratorMeta = {
  slug: 'security-fortinet-fortisoar',
  displayName: 'Fortinet FortiSOAR Alert Deletion Audit',
  category: 'security',
  description:
    'FortiSOAR alert-deletion audit events in the documented CEF syslog layout.',
  dataSource: 'Fortinet FortiSOAR audit log',
  format: ['CEF', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  highlights: [
    'Complete vendor-published Alert Deleted CEF field set',
    'Unique alert IDs and stable actor across deletion burst',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One actor deletes five distinct alerts from the same IP within five seconds.',
  generatorId: 'fortisoar',
  eventTypes: [
    {
      id: 'Alert Deleted',
      description: 'Alert record deleted',
      frequency: '100% of scoped stream',
      category: 'api',
    },
  ],
  realismFeatures: [
    'Fortinet-published CEF header and 12 extension fields',
    'Per-event alert ID in native message and ECS field',
    'CEF device version 7.0.0 matches the published sample',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the five-deletion burst.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between bursts.',
    },
    {
      name: 'device_name',
      defaultValue: 'fsrprimary',
      description: 'FortiSOAR source hostname.',
    },
    {
      name: 'device_id',
      defaultValue: 'FSRVMPTM20000061',
      description: 'FortiSOAR serial value.',
    },
    {
      name: 'device_version',
      defaultValue: '7.0.0',
      description: 'CEF header version from the sample.',
    },
    {
      name: 'target_user',
      defaultValue: 'CS Admin',
      description: 'Burst actor name.',
    },
    {
      name: 'target_user_id',
      defaultValue: 'f18a07d3-cc76-464b-8664-abd922b68281',
      description: 'Burst actor UUID.',
    },
    {
      name: 'target_source_ip',
      defaultValue: '192.0.2.40',
      description: 'Burst source IP.',
    },
  ],
  sampleOutputs: [
    {
      title: 'FortiSOAR anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:43:58+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "alert_deleted",
    "category": [
      "api"
    ],
    "code": "Alert Deleted",
    "dataset": "fortinet.fortisoar.audit",
    "kind": "event",
    "original": "2026-09-25T13:43:58.000000+00:00 fsrprimary fortisoar-audit-log: CEF:0|Fortinet Inc|FortiSOAR|7.0.0|Alert Deleted|Alert Deleted|1|devid=\"FSRVMPTM20000061\" vd=\"enterprise\" level=\"warning\" type=\"Audit Log\" msg=\"Alert [100001] Deleted \" src=\"192.0.2.40\" suid=\"f18a07d3-cc76-464b-8664-abd922b68281\" suser=\"CS Admin\" end=1790343838000 playbookName=\"\" playbookId=\"\" eventTimeStr=\"25 Sep 2026 13:43:58.000\"",
    "type": [
      "deletion"
    ]
  },
  "fortinet": {
    "fortisoar": {
      "alert_id": 100001,
      "device_id": "FSRVMPTM20000061",
      "level": "warning",
      "log_type": "Audit Log",
      "virtual_domain": "enterprise"
    }
  },
  "host": {
    "name": "fsrprimary"
  },
  "related": {
    "ip": [
      "192.0.2.40"
    ],
    "user": [
      "CS Admin"
    ]
  },
  "source": {
    "ip": "192.0.2.40"
  },
  "user": {
    "id": "f18a07d3-cc76-464b-8664-abd922b68281",
    "name": "CS Admin"
  }
}`,
    },
  ],
};
