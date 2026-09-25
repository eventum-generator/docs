import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandex360Audit: GeneratorMeta = {
  slug: 'cloud-yandex-360-audit',
  displayName: 'Yandex 360 Audit Log',
  category: 'cloud',
  dataSource: 'Yandex 360 organization audit-log API enriched events',
  description:
    'Yandex 360 organization sign-in and Disk audit items with a switchable linked file-sharing sequence.',
  generatorId: 'yandex-360-audit',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Current organization audit API item shape',
    'Six event types in both modes at one per minute',
    'Switchable four-event file-sharing sequence',
  ],
  anomalyChain:
    'After 120 routine events, one admin signs in, views a sensitive file, creates an all/read public link and downloads the file over three minute gaps.',
  eventTypes: [
    {
      id: 'id_cookie.set',
      description: 'Browser or mobile sign-in',
      frequency: '25 routine weight',
      category: 'authentication',
    },
    {
      id: 'disk_fs-view',
      description: 'View a Disk file',
      frequency: '37 routine weight',
      category: 'file',
    },
    {
      id: 'disk_fs-get-download-url',
      description: 'File download event',
      frequency: '18 routine weight',
      category: 'file',
    },
    {
      id: 'disk_fs-store',
      description: 'Upload or edit a file',
      frequency: '12 routine weight',
      category: 'file',
    },
    {
      id: 'disk_fs-set-public',
      description: 'Create a public file link',
      frequency: '5 routine weight',
      category: 'file',
    },
    {
      id: 'disk_fs-set-private',
      description: 'Remove a public file link',
      frequency: '3 routine weight',
      category: 'file',
    },
  ],
  realismFeatures: [
    'One enrichedEvent item per line; sign-in shape follows the complete current API example.',
    'Disk link removal follows link creation for the same file.',
    'Both modes contain the same admin, address and file actions at different intervals.',
    'The current API lists Disk fields but supplies no complete Disk raw item; exact request ID and path spelling remain unverified.',
  ],
  format: ['JSON'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include one short admin sequence; false emits background only',
    },
    {
      name: 'org_id',
      defaultValue: '1234567',
      description: 'Synthetic organization ID',
    },
    {
      name: 'organization_domain',
      defaultValue: 'corp.example',
      description: 'Synthetic employee login domain',
    },
    {
      name: 'alternate_ip',
      defaultValue: '203.0.113.42',
      description: 'Alternate admin address used in both modes',
    },
    {
      name: 'compromised_login',
      defaultValue: 'admin@corp.example',
      description: 'Administrator account used in both modes',
    },
    {
      name: 'compromised_uid',
      defaultValue: '1130000000123456',
      description: 'Stable administrator user ID',
    },
    {
      name: 'sensitive_path',
      defaultValue: 'disk:/finance/payroll-2026.xlsx',
      description: 'File path used in both modes',
    },
  ],
  sampleOutputs: [
    {
      title: 'Yandex 360 Audit Log event',
      json: String.raw`{
  "event": {
    "idempotency_id": "5c744503-57f2-49ab-b732-b5ed6c9c1c09",
    "ip": "198.51.100.90",
    "is_system": false,
    "meta": {
      "device_id": "",
      "revision": "1"
    },
    "occurred_at": "2026-09-25T17:37:00+00:00",
    "org_id": 1234567,
    "request_id": "@309862,1790357820.0795600,9400041844236835,42f382873483621f9b081932b946ee40,1130000000123456,admin@corp.example",
    "service": "ID",
    "status": "Success",
    "type": "id_cookie.set",
    "uid": 1130000000123456
  },
  "user_login": "admin@corp.example",
  "user_name": "Администратор системы"
}`,
    },
  ],
};
