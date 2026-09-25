/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailPostfix: GeneratorMeta = {
  slug: 'email-postfix',
  displayName: 'Postfix SMTP Syslog',
  category: 'email',
  description:
    'Postfix submission and delivery syslog with stable queue IDs and a switchable SASL-failure to recipient-fan-out sequence.',
  dataSource: 'Postfix 3.6.12+ syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'email-postfix',
  highlights: [
    '14/14 native log slots',
    'Postfix 3.6.12+ syslog',
    'Three SASL failures, an accepted submission, five deliveries with one queue ID, then queue removal.',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three SASL failures, an accepted submission, five deliveries with one queue ID, then queue removal.',
  eventTypes: [
    {
      id: 'postfix/smtpd accepted',
      description: 'Authenticated submission',
      frequency: '70% routine entries',
      category: 'email',
    },
    {
      id: 'postfix/qmgr active',
      description: 'Message queued',
      frequency: 'After acceptance',
      category: 'email',
    },
    {
      id: 'postfix/smtp sent',
      description: 'Recipient delivered',
      frequency: 'After queue activation',
      category: 'email',
    },
    {
      id: 'postfix/qmgr removed',
      description: 'Queue completion',
      frequency: 'After delivery',
      category: 'email',
    },
    {
      id: 'postfix/smtpd NOQUEUE reject',
      description: 'Recipient rejection',
      frequency: '30% routine entries',
      category: 'email',
    },
    {
      id: 'postfix/smtpd SASL failure',
      description: 'Failed authentication',
      frequency: 'Anomaly only',
      category: 'authentication',
    },
    {
      id: 'postfix/smtp five recipients',
      description: 'Recipient fan-out',
      frequency: 'Anomaly only',
      category: 'email',
    },
  ],
  realismFeatures: [
    'One queue ID links acceptance, queue management and deliveries.',
    'Fifty synthetic recipient samples for ordinary mail.',
    'SASL failure username requires Postfix 3.6.12 or newer.',
  ],
  parameters: [
    {
      name: 'mail_host',
      defaultValue: 'mail-01.corp.example',
      description: 'Mail host',
    },
    {
      name: 'mail_ip',
      defaultValue: '10.80.0.5',
      description: 'Mail host address',
    },
    {
      name: 'normal_user',
      defaultValue: 'service@corp.example',
      description: 'Routine sender',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.80.1.20',
      description: 'Routine client',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'payroll@corp.example',
      description: 'Chain sender',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'Chain client',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include anomaly chain; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Delivery in the five-recipient chain',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:36:50+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "email": {
    "to": {
      "address": [
        "invoice1@partner.example"
      ]
    }
  },
  "event": {
    "action": "delivery-sent",
    "category": [
      "email"
    ],
    "dataset": "postfix.syslog",
    "kind": "event",
    "original": "Sep 25 12:36:50 mail-01.corp.example postfix/smtp[2401]: 00000338: to=<invoice1@partner.example>, relay=mx.partner.example[198.51.100.25]:25, delay=0.8, delays=0.1/0.1/0.2/0.4, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as REMOTE1)",
    "outcome": "success",
    "type": [
      "info"
    ]
  },
  "host": {
    "ip": [
      "10.80.0.5"
    ],
    "name": "mail-01.corp.example"
  },
  "log": {
    "level": "info",
    "syslog": {
      "appname": "postfix/smtp"
    }
  },
  "message": "00000338: to=<invoice1@partner.example>, relay=mx.partner.example[198.51.100.25]:25, delay=0.8, delays=0.1/0.1/0.2/0.4, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as REMOTE1)",
  "observer": {
    "hostname": "mail-01.corp.example",
    "ip": "10.80.0.5",
    "product": "Postfix",
    "type": "mail",
    "vendor": "Postfix"
  },
  "postfix": {
    "queue_id": "00000338",
    "service": "smtp"
  },
  "process": {
    "name": "postfix/smtp",
    "pid": 2401
  },
  "related": {
    "hosts": [
      "mail-01.corp.example"
    ]
  },
  "tags": [
    "postfix",
    "preserve_original_event"
  ]
}`,
    },
  ],
};
