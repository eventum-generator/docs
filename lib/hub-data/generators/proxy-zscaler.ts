import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyZscaler: GeneratorMeta = {
    slug: 'proxy-zscaler',
    displayName: 'Zscaler Internet Access (ZIA)',
    category: 'web-access',
    description:
      'Zscaler ZIA cloud proxy — NSS web log feed with URL categorization, threat/malware blocking, DLP content inspection, browser isolation, bandwidth throttling, and file type control across 20 users and 16 endpoints.',
    format: ['JSON', 'ECS'],
    dataSource: 'Zscaler ZIA NSS Web Log',
    eventCount: 7,
    templateCount: 7,
    highlights: [
      'DLP engine simulation',
      'Browser isolation',
      'Cloud app attribution',
      '14 threat signatures',
    ],
    generatorId: 'zscaler-zia',
    eventTypes: [
      {
        id: 'allowed',
        description: 'Normal allowed web traffic',
        frequency: '~80%',
        category: 'web',
      },
      {
        id: 'blocked-policy',
        description: 'Blocked by URL filtering policy',
        frequency: '~8%',
        category: 'web',
      },
      {
        id: 'throttled',
        description: 'Bandwidth throttled (streaming)',
        frequency: '~5%',
        category: 'web',
      },
      {
        id: 'blocked-security',
        description: 'Blocked by security threat',
        frequency: '~3%',
        category: 'web',
      },
      {
        id: 'blocked-filetype',
        description: 'Blocked executable/archive downloads',
        frequency: '~2%',
        category: 'web',
      },
      {
        id: 'cautioned-dlp',
        description: 'DLP policy violation detected',
        frequency: '~1.5%',
        category: 'web',
      },
      {
        id: 'isolated',
        description: 'Browser Isolation for risky sites',
        frequency: '~0.5%',
        category: 'web',
      },
    ],
    realismFeatures: [
      'Log-normal distributions for request/response byte sizes',
      "Weighted URL categories across Zscaler's 3-level hierarchy (class/super/sub)",
      'Realistic TLS details — cipher suites, TLS versions, certificate validation, OCSP results',
      'Multi-device fleet — 16 endpoints (Windows, macOS, iOS, Android) with varied OS versions',
      'DLP engine simulation — HIPAA, PCI, GDPR, Code Protection with dictionary hit counts',
      '21 cloud applications with class and risk score',
    ],
    parameters: [
      {
        name: 'company',
        defaultValue: 'SafeMarch Inc',
        description: 'Organization name',
      },
      {
        name: 'cloudname',
        defaultValue: 'zscaler.net',
        description: 'Zscaler cloud name',
      },
      {
        name: 'datacenter',
        defaultValue: 'US-CA1 Client Node DC',
        description: 'Zscaler datacenter',
      },
      {
        name: 'nss_server',
        defaultValue: 'nss-feed-01',
        description: 'NSS feed server name',
      },
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Allowed Web Traffic',
        json: `{
    "@timestamp": "2026-02-22T19:11:26+00:00",
    "event": {
        "action": "allowed",
        "category": ["web"],
        "module": "zscaler_zia",
        "outcome": "success"
    },
    "url": {
        "domain": "www.zendesk.com",
        "full": "https://www.zendesk.com/agent/dashboard"
    },
    "user": { "email": "jmorales@safemarch.com", "name": "jmorales" },
    "zscaler_zia": {
        "web": {
            "action": "Allowed",
            "app": { "class": "Collaboration", "name": "Slack" },
            "department": "Engineering",
            "url": {
                "category": { "super": "Business and Economy" },
                "class": "Business Use"
            }
        }
    }
}`,
      },
    ],
  };
