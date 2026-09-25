import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandex360Audit: GeneratorMeta = {
  slug: 'cloud-yandex-360-audit',
  displayName: 'Yandex 360 Audit Log',
  category: 'cloud',
  dataSource: 'Yandex 360 organization audit-log API enriched events',
  description:
    'Native Yandex 360 identity and Disk audit events with a switchable unusual-login, public-link and download sequence.',
  generatorId: 'yandex-360-audit',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native organization audit API item shape',
    'Identity and Disk activity',
    'Switchable four-event file exposure chain',
  ],
  anomalyChain:
    'An unusual admin login is followed by a view, public link and download URL for the same sensitive Disk file.',
  eventTypes: [
    {
      id: 'disk_fs-view',
      description: 'View a Disk file',
      frequency: '36% baseline',
      category: 'file',
    },
    {
      id: 'id_cookie.set',
      description: 'Browser or mobile login',
      frequency: '32% baseline',
      category: 'authentication',
    },
    {
      id: 'disk_fs-get-download-url',
      description: 'Get a file download URL',
      frequency: '18% baseline',
      category: 'file',
    },
    {
      id: 'disk_fs-store',
      description: 'Upload or edit a file',
      frequency: '10% baseline',
      category: 'file',
    },
    {
      id: 'disk_fs-set-private',
      description: 'Remove public sharing',
      frequency: '4% baseline',
      category: 'file',
    },
    {
      id: 'disk_fs-set-public',
      description: 'Create a public file link',
      frequency: 'Chain only',
      category: 'file',
    },
  ],
  realismFeatures: [
    'One native enriched audit item per line, with stable user IDs and realistic type-specific metadata.',
    'The chain reuses the organization, UID, IP and file path while event and request IDs remain distinct.',
    'Background weights are illustrative; Yandex does not publish production frequencies.',
  ],
  format: ['JSON'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the correlated chain; false emits only background',
    },
    {
      name: 'org_id',
      defaultValue: '1234567',
      description: 'Synthetic organization ID',
    },
    {
      name: 'organization_domain',
      defaultValue: 'corp.example',
      description: 'Synthetic login domain',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.42',
      description: 'Unusual chain source address',
    },
    {
      name: 'compromised_login',
      defaultValue: 'admin@corp.example',
      description: 'Account used in the chain',
    },
    {
      name: 'compromised_uid',
      defaultValue: '1130000000123456',
      description: 'Stable actor ID in the chain',
    },
    {
      name: 'sensitive_path',
      defaultValue: 'disk:/finance/payroll-2026.xlsx',
      description: 'Disk path shared and downloaded',
    },
  ],
  sampleOutputs: [
    {
      title: 'Yandex 360 Audit Log event',
      json: String.raw`{
  "event": {
    "idempotency_id": "d5ca0c5b-8567-4ca3-9494-f58b15d67bf5",
    "ip": "10.20.7.32",
    "is_system": false,
    "meta": {
      "device_id": null,
      "revision": "1"
    },
    "occurred_at": "2026-09-25T11:59:58+00:00",
    "org_id": 1234567,
    "request_id": "693e6f3a-a302-441f-95c3-3d55e563e3a0",
    "service": "ID",
    "status": "Success",
    "type": "id_cookie.set",
    "uid": 1130000000100005
  },
  "user_login": "marina@corp.example",
  "user_name": "marina"
}`,
    },
  ],
};
