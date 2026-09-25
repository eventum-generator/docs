import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySophosCentral: GeneratorMeta = {
  slug: 'security-sophos-central',
  displayName: 'Sophos Central SIEM CEF',
  category: 'security',
  description:
    'CEF threat events as emitted by Sophos Central SIEM Integration, including cleanup failure and recovery.',
  dataSource: 'Sophos Central SIEM Integration 2.1.0',
  format: ['CEF', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Vendor-documented CEF fields in event.original',
    'Correlated multi-event anomaly chain',
    'Background-only mode for baseline traffic',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One endpoint and file emit threat detected, cleanup failed, threat detected again, then cleaned up.',
  generatorId: 'sophos-central',
  eventTypes: [
    {
      id: 'Event::Endpoint::Threat::Detected',
      description: 'Threat found',
      frequency: '~10% routine',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanedUp',
      description: 'Threat removed',
      frequency: '~80% routine',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::HIPSDetected',
      description: 'HIPS detection',
      frequency: '~10% routine',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanupFailed',
      description: 'Cleanup failed',
      frequency: 'Anomaly chain only',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'Native source identifiers and event classes',
    'Stable actors and targets throughout the chain',
    'Time-sorted sequence suitable for SIEM correlation',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable cleanup-retry chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records between chains.',
    },
    {
      name: 'target_host',
      defaultValue: 'linux-fin-07.example.test',
      description: 'Chain endpoint.',
    },
    {
      name: 'target_file',
      defaultValue: '/home/analyst/Downloads/invoice.js',
      description: 'Chain file.',
    },
    {
      name: 'threat_name',
      defaultValue: 'Mal/Generic-S',
      description: 'Chain threat name.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sophos Central SIEM CEF anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:04:30+00:00","ecs":{"version":"8.17.0"},"event":{"action":"Detected","category":["malware"],"code":"Event::Endpoint::Threat::Detected","dataset":"sophos.central","kind":"alert","module":"sophos","original":"CEF:0|sophos|sophos central|1.0|Event::Endpoint::Threat::Detected|Mal/Generic-S|8|rt=2026-09-25T13:04:30+00:00 end=2026-09-25T13:04:30+00:00 dhost=linux-fin-07.example.test filePath=/home/analyst/Downloads/invoice.js suser=analyst@example.test","type":["info"]},"file":{"path":"/home/analyst/Downloads/invoice.js"},"host":{"name":"linux-fin-07.example.test"},"sophos":{"central":{"event_type":"Event::Endpoint::Threat::Detected","severity":8,"threat_name":"Mal/Generic-S"}},"user":{"email":"analyst@example.test"}}`,
    },
  ],
};
