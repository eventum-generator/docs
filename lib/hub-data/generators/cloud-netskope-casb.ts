import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudNetskopeCasb: GeneratorMeta = {
  slug: 'cloud-netskope-casb',
  displayName: 'Netskope CASB',
  category: 'cloud',
  dataSource: 'Netskope Cloud Exchange Log Shipper Syslog CEF',
  description:
    'CEF audit and application events with a switchable policy-deletion-to-Box-download sequence.',
  generatorId: 'netskope',
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Netskope Cloud Exchange Syslog CEF examples',
    'Audit and application events share a user',
    'Policy deletion followed by three Box downloads',
  ],
  anomalyChain:
    'The same user deletes an inline policy and then downloads from Box three times; the default audit mapping does not identify the policy.',
  eventTypes: [
    {
      id: 'application / Download',
      description: 'Box cloud-storage download',
      frequency: '86.4% with anomaly mode',
      category: 'file',
    },
    {
      id: 'audit / Deleted Inline Policy',
      description: 'Administrator deletes an inline policy',
      frequency: '13.6% with anomaly mode',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Uses the vendor default CEF audit example and Syslog plugin v4.1.2 application example.',
    'Correlates on suser within one tenant and syslog shipper.',
    'Default audit CEF lacks policy ID, so causality cannot be established.',
  ],
  format: ['JSON', 'ECS', 'CEF'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked policy deletion and downloads',
    },
    {
      name: 'tenant_name',
      defaultValue: 'Example Tenant',
      description: 'CEF product value for the tenant',
    },
    {
      name: 'shipper_host',
      defaultValue: 'netskopece',
      description: 'Cloud Exchange syslog hostname',
    },
    {
      name: 'suspect_user',
      defaultValue: 'rpatel@example.test',
      description: 'Actor in the anomaly chain',
    },
    {
      name: 'routine_user',
      defaultValue: 'employee@example.test',
      description: 'Background download actor',
    },
    {
      name: 'policy_admin',
      defaultValue: 'policy.admin@example.test',
      description: 'Background audit actor',
    },
    {
      name: 'source_ip',
      defaultValue: '2001:db8::10',
      description: 'Example client IPv6 address',
    },
    {
      name: 'destination_ip',
      defaultValue: '2001:db8::20',
      description: 'Example destination IPv6 address',
    },
  ],
  sampleOutputs: [
    {
      title: 'Netskope inline-policy deletion',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:48:50+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "Deleted Inline Policy",
    "category": [
      "configuration"
    ],
    "kind": "event",
    "original": "<14>Sep 25 13:48:50 netskopece CEF:0|Netskope|Example Tenant|NULL|audit|NULL|High|auditLogEvent=Deleted Inline Policy auditType=admin_audit_logs suser=rpatel@example.test timestamp=1790344130",
    "outcome": "success",
    "type": [
      "deletion"
    ]
  },
  "host": {
    "name": "netskopece"
  },
  "netskope": {
    "audit_log_event": "Deleted Inline Policy",
    "audit_type": "admin_audit_logs",
    "type": "audit"
  },
  "related": {
    "user": [
      "rpatel@example.test"
    ]
  },
  "user": {
    "email": "rpatel@example.test"
  }
}`,
    },
  ],
};
