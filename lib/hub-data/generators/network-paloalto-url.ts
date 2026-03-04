import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPaloaltoUrl: GeneratorMeta = {
    slug: 'network-paloalto-url',
    displayName: 'Palo Alto URL Filtering',
    category: 'security',
    description:
      'Palo Alto PAN-OS URL Filtering logs — web browsing activity with 65+ URL categories, allow/block/continue/override actions, App-ID application attribution, and content type inspection.',
    format: ['JSON', 'ECS'],
    dataSource: 'PAN-OS URL Filtering Log',
    eventCount: 10,
    templateCount: 3,
    highlights: [
      '27 PAN-DB categories',
      'Correlated continue/override',
      'App-ID attribution',
      'Geo-aware destinations',
    ],
    generatorId: 'panw-url',
    eventTypes: [
      {
        id: 'alert',
        description: 'URL alert — allowed access',
        frequency: '~87%',
        category: 'network',
      },
      {
        id: 'block-url',
        description: 'Hard block by URL category',
        frequency: '~6.5%',
        category: 'network',
      },
      {
        id: 'block-continue',
        description: 'Block with continue page',
        frequency: '~2.4%',
        category: 'network',
      },
      {
        id: 'continue',
        description: 'Allowed after user clicked Continue',
        frequency: '~1.2%',
        category: 'network',
      },
      {
        id: 'block-override',
        description: 'Block with override page',
        frequency: '~0.8%',
        category: 'network',
      },
      {
        id: 'override',
        description: 'Allowed after override password',
        frequency: '~0.7%',
        category: 'network',
      },
      {
        id: 'drop',
        description: 'Silent drop',
        frequency: '~0.7%',
        category: 'network',
      },
      {
        id: 'reset-client',
        description: 'Reset sent to client',
        frequency: '~0.4%',
        category: 'network',
      },
      {
        id: 'reset-server',
        description: 'Reset sent to server',
        frequency: '~0.2%',
        category: 'network',
      },
      {
        id: 'reset-both',
        description: 'Reset sent to both',
        frequency: '~0.1%',
        category: 'network',
      },
    ],
    realismFeatures: [
      '27 PAN-DB URL categories with realistic enterprise traffic weights',
      'Correlated continue/override flows — block events store sessions; continue/override events consume them',
      '12 PAN-OS App-IDs with weighted selection (ssl, web-browsing, google-base, ms-office365)',
      'Source NAT translation on all outbound traffic',
      'HTTP header logging with realistic User-Agent strings and method distribution',
      'Geo-aware destinations — allowed traffic skews US/EU/JP; blocked skews higher-risk regions',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'PA-5260',
        description: 'PAN-OS firewall hostname',
      },
      {
        name: 'domain',
        defaultValue: 'CORP',
        description: 'Active Directory domain',
      },
      {
        name: 'serial_number',
        defaultValue: '007200001056',
        description: 'Firewall serial number',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'Source NAT IP',
      },
      {
        name: 'agent_id',
        defaultValue: 'e4f8c1a2-...',
        description: 'Elastic Agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'URL Alert (Allowed)',
        json: `{
    "@timestamp": "2026-02-21T14:30:15.123456+00:00",
    "event": {
        "action": "url_filtering",
        "category": ["intrusion_detection", "threat", "network"],
        "dataset": "panw.panos",
        "kind": "alert",
        "outcome": "success"
    },
    "source": { "ip": "10.1.1.14", "user": { "name": "jsmith" } },
    "destination": { "ip": "142.250.80.46", "port": 443 },
    "url": { "domain": "www.google.com", "path": "/search" },
    "panw": {
        "panos": {
            "action": "alert",
            "url": { "category": "search-engines" }
        }
    },
    "observer": { "product": "PAN-OS", "vendor": "Palo Alto Networks" }
}`,
      },
    ],
  };
