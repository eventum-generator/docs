import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKerioControl: GeneratorMeta = {
  slug: 'network-kerio-control',
  displayName: 'Kerio Control Filter Log',
  category: 'network',
  description:
    'Kerio Control URL-rule allow and deny records from its Filter log.',
  dataSource: 'GFI Kerio Control Filter log',
  format: ['Filter log', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'GFI-documented URL-rule line format',
    'Allow and deny decisions with user and client IP',
    'Blocked-path enumeration sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client quickly requests four distinct paths on a blocked host; every request is denied.',
  generatorId: 'kerio-control',
  eventTypes: [
    {
      id: 'ALLOW URL',
      description: 'HTTP request allowed by URL rule',
      frequency: '~85% routine',
      category: 'web',
    },
    {
      id: 'DENY URL',
      description: 'HTTP request denied by URL rule',
      frequency: '~15% routine',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Native Filter log line in event.original',
    'Authenticated user and client IP correlation',
    'Four distinct denied URL paths in a short window',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable blocked-path enumeration.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'firewall_host',
      defaultValue: 'kerio-fw-01.example.test',
      description: 'Firewall name in ECS.',
    },
    {
      name: 'target_user',
      defaultValue: 'analyst',
      description: 'Chain user.',
    },
    {
      name: 'target_client_ip',
      defaultValue: '192.0.2.45',
      description: 'Chain client IP.',
    },
    {
      name: 'target_domain',
      defaultValue: 'blocked.example.test',
      description: 'Blocked host.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Kerio Control anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:29:44+00:00","ecs":{"version":"8.17.0"},"event":{"action":"DENY","category":["web"],"dataset":"kerio.control_filter","kind":"event","original":"[25/Sep/2026 13:29:44] DENY URL 'Restricted Sites' 192.0.2.45 analyst HTTP GET http://blocked.example.test/","type":["access"]},"host":{"name":"kerio-fw-01.example.test"},"http":{"request":{"method":"GET"}},"kerio":{"control":{"filter_action":"DENY","filter_rule":"Restricted Sites"}},"related":{"ip":["192.0.2.45"],"user":["analyst"]},"source":{"ip":"192.0.2.45"},"url":{"full":"http://blocked.example.test/"},"user":{"name":"analyst"}}`,
    },
  ],
};
