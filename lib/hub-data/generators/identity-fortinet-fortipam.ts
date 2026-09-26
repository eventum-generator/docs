/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFortinetFortipam: GeneratorMeta = {
  slug: 'identity-fortinet-fortipam',
  displayName: 'Fortinet FortiPAM Secret Events',
  category: 'identity',
  description:
    'FortiPAM secret requests and clear-text views in vendor-documented key-value logs.',
  dataSource: 'Fortinet FortiPAM secret logs',
  format: ['Syslog KV', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Fortinet-published secret-request and clear-text-view fields',
    'Stable user, secret, and account throughout the chain',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'A user requests one privileged secret, then views its clear text three times.',
  generatorId: 'fortipam',
  eventTypes: [
    {
      id: '2304064604',
      description: 'Secret request created',
      frequency: '~30% routine',
      category: 'iam',
    },
    {
      id: '2303064603',
      description: 'Clear-text view allowed',
      frequency: '~70% routine',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Vendor-defined log IDs and key-value fields',
    'Unique UUID per event rather than reused as a correlation ID',
    'Consistent secret, account, and target mapping',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the repeated-view chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'device_name',
      defaultValue: 'FPAVULTM1234567',
      description: 'FortiPAM source name.',
    },
    {
      name: 'target_user',
      defaultValue: 'operator',
      description: 'Chain user.',
    },
    {
      name: 'target_secret_id',
      defaultValue: '2820',
      description: 'Chain secret ID.',
    },
    {
      name: 'target_secret',
      defaultValue: 'prod-vault',
      description: 'Chain secret name.',
    },
    {
      name: 'target_account',
      defaultValue: 'svc-admin',
      description: 'Privileged account.',
    },
    {
      name: 'target_ip',
      defaultValue: '10.20.30.15',
      description: 'View target.',
    },
  ],
  sampleOutputs: [
    {
      title: 'FortiPAM anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:30:24+00:00","ecs":{"version":"8.17.0"},"event":{"action":"secret_request","category":["iam"],"code":"2304064604","dataset":"fortinet.fortipam","kind":"event","original":"date=2026-09-25 time=13:30:24 devname=\"FPAVULTM1234567\" devid=\"FPAVULTM1234567\" eventtime=1790343024000000000 tz=\"+0000\" logid=\"2304064604\" type=\"secret\" subtype=\"secret-request\" eventtype=\"secret-request\" action=\"pass\" operation=\"request\" secretid=2820 secret=\"prod-vault\" account=\"svc-admin\" uuid=\"c6f7b2d9-823d-4249-968d-b6f36b401de3\" user=\"operator\" starttime=\"2026-09-25 13:30:24\" expirytime=\"2026-09-25 14:00:24\" msg=\"Created secret request.\"","type":["info"]},"fortinet":{"fortipam":{"account":"svc-admin","secret_id":2820,"secret_name":"prod-vault","target":null,"uuid":"c6f7b2d9-823d-4249-968d-b6f36b401de3"}},"host":{"name":"FPAVULTM1234567"},"related":{"user":["operator"]},"user":{"name":"operator"}}`,
    },
  ],
};
