import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySymantecSepm: GeneratorMeta = {
  slug: 'security-symantec-sepm',
  displayName: 'Symantec Endpoint Protection Manager',
  category: 'security',
  description:
    'SEPM external administrative, policy-audit, and agent-activity log payloads.',
  dataSource: 'Symantec Endpoint Protection Manager 14.x',
  format: ['CSV', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Broadcom-documented field order and default comma delimiter',
    'Administrative and policy audit events',
    'Policy edit to client download sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An administrator logs in, edits one policy twice, then a client downloads a policy from that site.',
  generatorId: 'sepm',
  eventTypes: [
    {
      id: 'Administrative',
      description: 'Administrator login succeeded',
      frequency: '~15% routine',
      category: 'authentication',
    },
    {
      id: 'Policy 0',
      description: 'Policy added',
      frequency: '~10% routine',
      category: 'configuration',
    },
    {
      id: 'Agent Activity',
      description: 'Client downloaded policy',
      frequency: '~75% routine',
      category: 'configuration',
    },
    {
      id: 'Policy 2',
      description: 'Policy edited',
      frequency: 'Anomaly chain only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Vendor-defined record layouts per log type',
    'Native policy audit event IDs',
    'Temporal correlation by SEPM site and server',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the policy-change chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'site_name',
      defaultValue: 'PrimarySite',
      description: 'SEPM site.',
    },
    {
      name: 'server_name',
      defaultValue: 'sepm-01.example.test',
      description: 'SEPM server.',
    },
    {
      name: 'sepm_domain',
      defaultValue: 'Default',
      description: 'SEPM domain.',
    },
    {
      name: 'target_admin',
      defaultValue: 'svc-policy',
      description: 'Chain administrator.',
    },
    {
      name: 'target_policy',
      defaultValue: 'Endpoint Protection Policy',
      description: 'Edited policy.',
    },
    {
      name: 'target_client',
      defaultValue: 'ws-fin-07.example.test',
      description: 'Client after edits.',
    },
  ],
  sampleOutputs: [
    {
      title: 'SEPM anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:17:07+00:00","ecs":{"version":"8.17.0"},"event":{"action":"admin_login","category":["authentication"],"dataset":"symantec.sepm_administrative","kind":"event","original":"PrimarySite,sepm-01.example.test,Default,svc-policy,Administrator log on succeeded","type":["start"]},"host":{"name":"sepm-01.example.test"},"symantec":{"sepm":{"client_host":null,"description":"Administrator log on succeeded","domain":"Default","policy_name":null,"site":"PrimarySite"}},"user":{"name":"svc-policy"}}`,
    },
  ],
};
