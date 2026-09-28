import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandex360Audit: GeneratorMeta = {
  slug: 'cloud-yandex-360-audit',
  displayName: 'Yandex 360 Organization Audit',
  category: 'cloud',
  description:
    'Native Yandex 360 organization audit items for browser sign-ins and personal Disk file activity, for detection testing. Recurring episodes chain a sign-in, file view, public link and download of the same file.',
  format: ['JSON'],
  dataSource:
    'Current Yandex 360 organization audit API (v1), enrichedEvent items',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native enrichedEvent items, no ECS wrapper',
    'Owner sessions with link publish and removal',
    'Recurring sign-in, share and download chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One account signs in from the alternate address, views one of its files, publishes an all/read link to that file and downloads the same file, usually one to three minutes apart. Episodes recur every 24 hours by default (anomaly_interval_hours, 6 to 8,760): the first is due at a uniform point within the first interval (at most 24 hours), each later one at a uniform point in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, with no catch-up; the episode then runs as an ordinary session of that client while others keep working. Accounts and files rotate. Every three-step part of the chain occurs in background; an ordinary download that would complete the full sequence within 15 minutes of the sign-in is not recorded and its minute stays empty.',
  generatorId: 'yandex-360',
  eventTypes: [
    {
      id: 'id_cookie.set',
      description: 'Successful browser sign-in, service ID',
      frequency: '8.6% background share',
      category: 'authentication',
    },
    {
      id: 'disk_fs-view',
      description: 'View an existing personal file, service Web',
      frequency: '44.0% background share',
      category: 'file',
    },
    {
      id: 'disk_fs-get-download-url',
      description: 'Authenticated owner downloads a file, service Web',
      frequency: '27.5% background share',
      category: 'file',
    },
    {
      id: 'disk_fs-store',
      description: 'Edit an existing file, service Web',
      frequency: '9.1% background share',
      category: 'file',
    },
    {
      id: 'disk_fs-set-public',
      description: 'Publish a currently private file link',
      frequency: '5.5% background share',
      category: 'file',
    },
    {
      id: 'disk_fs-set-private',
      description: 'Remove an existing owner/file link',
      frequency: '5.5% background share',
      category: 'file',
    },
  ],
  realismFeatures: [
    'One event per minute at a random second, about 1,440 per day; about 0.4% of minutes stay empty where the chain guard drops a download. Six accounts own three or four existing files each and work in short single-address browser sessions, from a usual or the shared alternate address; up to three sessions interleave.',
    'Every link removal follows a successful publication of the same owner/file link. The owner removes each link through a logged website operation 30-57 minutes after publication; this is owner maintenance, not automatic expiry.',
    'The alternate address, the admin account and every three-step part of the chain also occur in background; only the full ordered sequence on one file within 15 minutes of the sign-in is episode-only, and past 15 minutes ordinary sessions complete it at a natural rate. An account named admin does not establish administrator rights, and the chain does not prove anonymous retrieval or exfiltration.',
    'The sign-in item covers 16/16 structural paths of the published example, including the request_id shape. Disk items cover the documented metadata fields, but no complete current-API Disk record was found, so Disk request IDs and the disk:/ path form are inferred and raw fidelity is unverified.',
    'Addresses are 2001:db8::/32 documentation IPv6 in /128 form; identities and IDs are synthetic. Rates, weights and timing describe a synthetic busy-browser organization, not measured production frequencies. Only successful operations are modeled.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring episodes; false produces only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Average spacing between episode starts, 6 to 8,760; the first falls within the first interval (at most 24 h), each later one in a window of a quarter of the interval (at most 6 h) centred one interval after the previous actual start',
    },
    {
      name: 'org_id',
      defaultValue: '1234567',
      description: 'Positive integer organization ID',
    },
    {
      name: 'organization_domain',
      defaultValue: 'corp.example',
      description: 'Domain for the five sampled employee logins',
    },
    {
      name: 'alternate_ip',
      defaultValue: '2001:db8:8005:f00:61ce:682c:bca4:42e5/128',
      description:
        'Alternate client address shared by all owners in both modes',
    },
    {
      name: 'compromised_login',
      defaultValue: 'admin@corp.example',
      description:
        'Extra modeled account, also ordinary; the name is kept for compatibility',
    },
    {
      name: 'compromised_uid',
      defaultValue: '1130000000123456',
      description: 'Positive integer UID distinct from the five sampled owners',
    },
    {
      name: 'compromised_name',
      defaultValue: 'Соколов Алексей',
      description: "Extra account's display name",
    },
    {
      name: 'compromised_usual_ip',
      defaultValue: '2001:db8:b081:b42d::1:90/128',
      description: "Extra account's usual client address",
    },
    {
      name: 'sensitive_path',
      defaultValue: 'disk:/finance/payroll-2026.xlsx',
      description:
        'File held by the extra account and by sampled owners that list it',
    },
    {
      name: 'sensitive_media_type',
      defaultValue: 'spreadsheet',
      description:
        'Native media category of that file: document or spreadsheet',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sign-in opening the first episode',
      json: String.raw`{"event": {"idempotency_id": "89dca6bd-1afa-41b6-8015-a9e07870fab1", "ip": "2001:db8:8005:f00:61ce:682c:bca4:42e5/128", "is_system": false, "meta": {"device_id": "", "revision": "1"}, "occurred_at": "2026-10-01T13:52:21+00:00", "org_id": 1234567, "request_id": "@970887,1790862740.9596545,6795679673396694,33935ab262612f9cf66d8deab9a29836a8,1130000000123456,admin@corp.example", "service": "ID", "status": "Success", "type": "id_cookie.set", "uid": 1130000000123456}, "user_login": "admin@corp.example", "user_name": "\u0421\u043e\u043a\u043e\u043b\u043e\u0432 \u0410\u043b\u0435\u043a\u0441\u0435\u0439"}`,
    },
  ],
};
