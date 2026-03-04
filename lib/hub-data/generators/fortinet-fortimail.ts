import type { GeneratorMeta } from '@/lib/hub-types';

export const fortinetFortimail: GeneratorMeta = {
    slug: 'fortinet-fortimail',
    displayName: 'Fortinet FortiMail',
    category: 'email',
    description:
      'FortiMail email security gateway — mail statistics, SMTP protocol events, antispam verdict (clean/spam/phishing), antivirus scanning with quarantine actions, and system administration logs.',
    format: ['JSON', 'ECS'],
    dataSource: 'FortiMail Syslog',
    eventCount: 12,
    templateCount: 12,
    highlights: [
      'Correlated spam sessions',
      '8+ spam classifiers',
      'TLS certificate diversity',
      'FortiGuard updates',
    ],
    generatorId: 'fml',
    eventTypes: [
      {
        id: 'stats-clean-inbound',
        description: 'Clean inbound email accepted',
        frequency: '~27.9%',
        category: 'email',
      },
      {
        id: 'stats-spam-rejected',
        description: 'Spam blocked at gateway',
        frequency: '~13.9%',
        category: 'email',
      },
      {
        id: 'stats-clean-outbound',
        description: 'Clean outbound email delivered',
        frequency: '~12.5%',
        category: 'email',
      },
      {
        id: 'event-smtp-receive',
        description: 'SMTP incoming message received',
        frequency: '~10.5%',
        category: 'email',
      },
      {
        id: 'event-smtp-deliver',
        description: 'SMTP outbound delivery',
        frequency: '~10.5%',
        category: 'email',
      },
      {
        id: 'spam-detection',
        description: 'Spam detection reason details',
        frequency: '~7%',
        category: 'email',
      },
      {
        id: 'stats-auth-failure',
        description: 'SPF/DKIM/DMARC failure',
        frequency: '~5.6%',
        category: 'email',
      },
      {
        id: 'stats-spam-quarantined',
        description: 'Spam tagged or quarantined',
        frequency: '~4.2%',
        category: 'email',
      },
      {
        id: 'event-smtp-tls',
        description: 'STARTTLS negotiation',
        frequency: '~3.5%',
        category: 'email',
      },
      {
        id: 'kevent-admin-login',
        description: 'Admin login/logout events',
        frequency: '~1.7%',
        category: 'authentication',
      },
      {
        id: 'kevent-system-update',
        description: 'FortiGuard DB updates',
        frequency: '~1%',
        category: 'configuration',
      },
      {
        id: 'virus-infected',
        description: 'Virus/malware detection',
        frequency: '~0.3%',
        category: 'malware',
      },
    ],
    realismFeatures: [
      'Weighted event distribution matching production FortiMail (~65% statistics, ~25% SMTP, ~7% spam, ~3% system)',
      'Correlated spam sessions — detection logs share session IDs with corresponding statistics events',
      '8+ spam classifiers (FortiGuard AntiSpam, DNSBL, SURBL, Heuristic, Banned Word)',
      "TLS certificate diversity — Google Trust Services, DigiCert, Let's Encrypt, SwissSign",
      'Monotonic type-prefixed log IDs matching authentic FortiMail patterns',
      '50+ email subjects across 5 categories (business, automated, newsletter, spam, phishing)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'fml-01',
        description: 'FortiMail appliance hostname',
      },
      {
        name: 'domain',
        defaultValue: 'company.com',
        description: 'Protected email domain',
      },
      {
        name: 'device_id',
        defaultValue: 'FEVM02TM24000001',
        description: 'FortiMail serial number',
      },
      {
        name: 'device_ip',
        defaultValue: '198.51.100.10',
        description: 'FortiMail receiving IP',
      },
      {
        name: 'agent_id',
        defaultValue: 'b3a1c4d5-...',
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
        title: 'Clean Inbound Email (Statistics)',
        json: `{
    "@timestamp": "2026-02-21T14:30:15.123456+00:00",
    "event": {
        "code": "0200004500",
        "dataset": "fortinet_fortimail.log",
        "outcome": "success"
    },
    "email": {
        "direction": "in",
        "from": { "address": ["jdoe@gmail.com"] },
        "subject": "Q4 Financial Report - Final Review",
        "to": { "address": ["j.smith@company.com"] }
    },
    "fortinet_fortimail": {
        "log": {
            "classifier": "Not Spam",
            "disposition": "Accept",
            "type": "statistics"
        }
    },
    "observer": { "product": "FortiMail", "vendor": "Fortinet" }
}`,
      },
    ],
  };
