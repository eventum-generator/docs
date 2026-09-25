import type { GeneratorMeta } from '@/lib/hub-types';

export const identityArubaClearpass: GeneratorMeta = {
  slug: 'identity-aruba-clearpass',
  displayName: 'Aruba ClearPass Policy Manager',
  category: 'identity',
  description:
    'RFC5424 administrative audit records with a switchable failed-login, log-setting and SSH-key sequence.',
  dataSource: 'ClearPass 6.11 RFC5424 audit syslog',
  format: ['JSON', 'ECS', 'RFC5424'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Vendor clearPass@14823 structured data',
    'WebUI login and administrative changes',
    'Account and node correlation across a seven-event chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed WebUI logins, a success, a log-setting change and an SSH public-key addition by the same administrator on one node.',
  generatorId: 'clearpass',
  eventTypes: [
    {
      id: 'login-success',
      description: 'WebUI administrator login',
      frequency: '84% baseline',
      category: 'authentication',
    },
    {
      id: 'login-failure',
      description: 'Failed WebUI administrator login',
      frequency: '12% baseline',
      category: 'authentication',
    },
    {
      id: 'settings-change',
      description: 'Account settings modification',
      frequency: '4% baseline',
      category: 'configuration',
    },
    {
      id: 'log-change',
      description: 'Log service configuration modified',
      frequency: 'Chain only',
      category: 'configuration',
    },
    {
      id: 'key-add',
      description: 'SSH public key added',
      frequency: 'Chain only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'RFC5424 audit export must be selected; ClearPass defaults to raw.',
    'KUMA 4.2 ClearPass CEF normalizer is not a direct match.',
    'Configuration changes have administrator but no login session ID or client IP.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include suspicious administrative chain',
    },
    {
      name: 'node_ip',
      // eslint-disable-next-line sonarjs/no-hardcoded-ip -- Documented sample address.
      defaultValue: '10.20.0.10',
      description: 'ClearPass node address',
    },
    {
      name: 'admin_user',
      defaultValue: 'admin',
      description: 'Administrator in the chain',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description: 'WebUI client in the chain',
    },
    {
      name: 'software_version',
      defaultValue: '6.11.11.261850',
      description: 'Example software version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:42:05+00:00",
  "clearpass": {
    "action": "None",
    "category": "Login Failed",
    "component": "Policy Manager UI",
    "entity_name": null,
    "event_id": 3003,
    "software_version": "6.11.11.261850"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "login-failure",
    "category": [
      "authentication"
    ],
    "kind": "event",
    "original": "2026-09-25T12:42:05Z 10.20.0.10 ClearPass 18202 34-1-0 [timeQuality tzKnown=\"1\"][origin swVersion=\"6.11.11.261850\" software=\"PolicyManager\" ip=\"10.20.0.10\" enterpriseId=\"1.3.6.1.4.1.14823\"][clearPass@14823 eventId=\"3003\" Action=\"None\" Category=\"Login Failed\" Description=\"User: admin\\nClient IP Address: 192.0.2.91\" Level=\"WARN\" Component=\"Policy Manager UI\" CppmNode.CPPM-Node=\"10.20.0.10\" Timestamp=\"2026-09-25T12:42:05Z\"]",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "host": {
    "ip": [
      "10.20.0.10"
    ],
    "name": "10.20.0.10"
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "admin"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
