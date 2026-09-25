/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailPostfix: GeneratorMeta = {
  slug: 'email-postfix',
  displayName: 'Postfix SMTP Syslog',
  category: 'email',
  description:
    'Postfix 3.8.3+ submission-relay syslog for smtpd, cleanup, qmgr and smtp, with a switchable linked mail episode.',
  dataSource: 'Postfix 3.8.3+ submission-relay syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'email-postfix',
  highlights: [
    'Postfix 3.8.3+ native syslog in event.original',
    'Modeled smtpd-to-cleanup-to-qmgr-to-smtp queue lifecycle',
    'One switchable failure-to-acceptance and five-recipient episode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 250 routine decisions, one user and IP produce three failed SASL LOGIN attempts on one smtpd PID, then acceptance, cleanup, qmgr nrcpt=5, five distinct sent deliveries and queue removal.',
  eventTypes: [
    {
      id: 'postfix/smtpd accepted',
      description: 'Authenticated submission',
      frequency: '90% of routine decisions',
      category: 'email',
    },
    {
      id: 'postfix/smtpd NOQUEUE reject',
      description: 'Unknown recipient rejected before queueing',
      frequency: '7% of routine decisions',
      category: 'email',
    },
    {
      id: 'postfix/smtpd SASL failure',
      description: 'Isolated failed authentication',
      frequency: '3% of routine decisions, at least 20 records apart',
      category: 'authentication',
    },
    {
      id: 'postfix/cleanup message-id',
      description: 'Message enters the queue',
      frequency: 'After each acceptance',
      category: 'email',
    },
    {
      id: 'postfix/qmgr active',
      description: 'Queue activation with sender, size and recipient count',
      frequency: 'After cleanup; ordinary nrcpt is 1, 2 or 5',
      category: 'email',
    },
    {
      id: 'postfix/smtp sent',
      description: 'Successful recipient delivery',
      frequency: 'One per queued recipient',
      category: 'email',
    },
    {
      id: 'postfix/qmgr removed',
      description: 'Message leaves the queue',
      frequency: 'After modeled deliveries complete',
      category: 'email',
    },
  ],
  realismFeatures: [
    'One queue ID links accepted smtpd, cleanup, qmgr and smtp records through removal; failures and NOQUEUE rejects have no queue ID.',
    'Routine accepted messages have 1, 2 or 5 recipients with modeled weights 85%, 13% and 2%.',
    'The target user and IP, isolated failures, and five-recipient deliveries also occur in background.',
    'Eight routine sender samples plus the target and 60 varied recipients reduce repetitive synthetic traffic.',
    'Exact Postfix 3.8.3+ full three-failure-to-acceptance native trace remains unavailable; the chain joins documented line formats.',
    'No source-specific Elastic sample was used; a native-reference field-coverage percentage is not claimed.',
  ],
  parameters: [
    {
      name: 'mail_host',
      defaultValue: 'mail-01.corp.example',
      description: 'Postfix server hostname',
    },
    {
      name: 'mail_ip',
      defaultValue: '10.80.0.5',
      description: 'Postfix server address',
    },
    {
      name: 'normal_user',
      defaultValue: 'service@corp.example',
      description: 'First routine sender among eight samples',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.80.1.20',
      description: 'First routine sender address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'payroll@corp.example',
      description: 'Episode user also present in background',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'Episode source also present in background',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine decisions before one episode',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include one linked episode; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Accepted authenticated submission',
      json: String.raw`{
  "@timestamp": "2026-09-25T00:19:30+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "smtp-accept",
    "category": [
      "email"
    ],
    "dataset": "postfix.syslog",
    "kind": "event",
    "original": "Sep 25 00:19:30 mail-01.corp.example postfix/smtpd[2400]: 4F657A0489: client=unknown[10.99.3.51], sasl_method=LOGIN, sasl_username=payroll@corp.example",
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
      "appname": "postfix/smtpd"
    }
  },
  "message": "4F657A0489: client=unknown[10.99.3.51], sasl_method=LOGIN, sasl_username=payroll@corp.example",
  "observer": {
    "hostname": "mail-01.corp.example",
    "ip": "10.80.0.5",
    "product": "Postfix",
    "type": "mail",
    "vendor": "Postfix"
  },
  "postfix": {
    "queue_id": "4F657A0489",
    "sasl": {
      "username": "payroll@corp.example"
    },
    "service": "smtpd"
  },
  "process": {
    "name": "postfix/smtpd",
    "pid": 2400
  },
  "related": {
    "hosts": [
      "mail-01.corp.example"
    ],
    "ip": [
      "10.99.3.51"
    ],
    "user": [
      "payroll@corp.example"
    ]
  },
  "source": {
    "ip": "10.99.3.51"
  },
  "tags": [
    "postfix",
    "preserve_original_event"
  ],
  "user": {
    "name": "payroll@corp.example"
  }
}`,
    },
  ],
};
