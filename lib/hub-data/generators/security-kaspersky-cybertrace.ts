import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyCybertrace: GeneratorMeta = {
  slug: 'security-kaspersky-cybertrace',
  displayName: 'Kaspersky CyberTrace CEF',
  category: 'security',
  description:
    'CyberTrace indicator matches in the documented ArcSight CEF format.',
  dataSource: 'Kaspersky CyberTrace 2020',
  format: ['CEF', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Vendor-defined ArcSight CEF fields in event.original',
    'URL and MD5 indicator categories',
    'Correlated endpoint and user sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One endpoint matches a malicious URL, a malicious MD5, then the same URL again.',
  generatorId: 'cybertrace',
  eventTypes: [
    {
      id: 'KL_Malicious_URL',
      description: 'Malicious URL match',
      frequency: '~65% routine',
      category: 'threat',
    },
    {
      id: 'KL_Phishing_URL',
      description: 'Phishing URL match',
      frequency: '~25% routine',
      category: 'threat',
    },
    {
      id: 'KL_Malicious_Hash_MD5',
      description: 'Malicious MD5 match',
      frequency: '~10% routine',
      category: 'threat',
    },
  ],
  realismFeatures: [
    'Documented CyberTrace CEF signature and extension keys',
    'Distinct native detection IDs',
    'Time-sorted correlation by endpoint and user',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the multi-indicator chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'target_endpoint_ip',
      defaultValue: '192.0.2.44',
      description: 'Chain endpoint.',
    },
    {
      name: 'target_user',
      defaultValue: 'operator',
      description: 'Chain user.',
    },
    {
      name: 'target_url',
      defaultValue: 'https://malware.example.test/dropper',
      description: 'Repeated URL indicator.',
    },
    {
      name: 'target_md5',
      defaultValue: 'C912705B4BBB14EC7E78FA8B370532C9',
      description: 'MD5 indicator.',
    },
  ],
  sampleOutputs: [
    {
      title: 'CyberTrace anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:21:05+00:00","destination":{"ip":"198.51.100.10"},"ecs":{"version":"8.17.0"},"event":{"action":"indicator_match","category":["threat"],"code":"KL_Malicious_URL","dataset":"kaspersky.cybertrace","kind":"alert","original":"CEF:0|Kaspersky Lab|Kaspersky CyberTrace for ArcSight|2.0|2|CyberTrace Detection Event|8| reason=KL_Malicious_URL dst=198.51.100.10 src=192.0.2.44 fileHash=- request=https://malware.example.test/dropper sourceServiceName=ExampleVendor sproc=EndpointSecurity suser=operator msg=CyberTrace detected KL_Malicious_URL externalId=10060 cs5Label=MatchedIndicator cs5=https://malware.example.test/dropper cs6Label=Context cs6=feed=Example_Feed.json","type":["indicator"]},"kaspersky":{"cybertrace":{"external_id":10060,"feed":"Example_Feed.json","matched_indicator":"https://malware.example.test/dropper"}},"related":{"ip":["192.0.2.44","198.51.100.10"],"user":["operator"]},"source":{"ip":"192.0.2.44"},"user":{"name":"operator"}}`,
    },
  ],
};
