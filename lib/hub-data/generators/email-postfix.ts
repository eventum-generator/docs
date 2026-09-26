/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailPostfix: GeneratorMeta = {
  slug: 'email-postfix',
  displayName: 'Postfix SMTP Syslog',
  category: 'email',
  description:
    'Postfix 3.8.3+ submission-relay syslog with causal queue creation, cleanup, delays, deliveries and recurring authentication-to-mail episodes.',
  dataSource: 'Postfix 3.8.3+ submission-relay syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'email-postfix',
  highlights: [
    'Native Postfix 3.8.3+ line in event.original',
    'Source-derived Message-ID and delay formatting',
    'Twelve-record mail episodes recur every six hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every six hours, after ordinary queued mail completes, one user and IP make three failed SASL LOGIN attempts on one smtpd PID, then a queue-ID assignment, cleanup, qmgr nrcpt=5, five distinct sent deliveries and removal. Twelve records span eleven seconds. Episodes use new queue IDs and rotating recipients; failures join queue creation by user, IP, host, PID and time, not queue ID.',
  eventTypes: [
    {
      id: 'postfix/smtpd queue assigned',
      description:
        'Queue ID assigned to authenticated submission; before final DATA acceptance',
      frequency: '90% of routine decisions and recurring episodes',
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
      description: 'Failed LOGIN without queue ID',
      frequency:
        '3% of routine decisions, at least 20 records apart; three per episode',
      category: 'authentication',
    },
    {
      id: 'postfix/cleanup message-id',
      description:
        'Generate a missing Message-ID from queue-file creation time',
      frequency: 'After each queue creation',
      category: 'email',
    },
    {
      id: 'postfix/qmgr active',
      description: 'Activate sender, size and recipient count',
      frequency: 'After cleanup; ordinary nrcpt 1/2/5 with weights 85/13/2',
      category: 'email',
    },
    {
      id: 'postfix/smtp sent',
      description: 'Complete one recipient delivery with delay phases',
      frequency: 'One per queued recipient',
      category: 'email',
    },
    {
      id: 'postfix/qmgr removed',
      description: 'Remove the queue after all deliveries',
      frequency: 'After modeled recipient deliveries complete',
      category: 'email',
    },
  ],
  realismFeatures: [
    'One active message and at most five recipients retain queue ID and process causality through removal. Short queue IDs model five-hex creation microseconds plus a synthetic inode component.',
    'Missing Message-ID date uses queue-file creation time, not the later cleanup log. Authenticated header rewriting is selected; envelope sender equals the account by scenario choice.',
    'Native delay phases use active-queue entry and bounded size-dependent transmission. Postfix 3.8.3 integer-microsecond HALF-UP formatting preserves source precision; printed rounded phases need not sum exactly.',
    'The target user/IP, isolated failures and five-recipient deliveries occur in background. A bounded recipient cursor rotates between episodes; smtpd PID is reused and does not identify a session.',
    'SASL LOGIN, short queue IDs, single-recipient SMTP transport and local UTC mail-log timestamps are selected assumptions. Native queue assignment alone does not prove final DATA acceptance.',
    'BLOCKED_RAW_EVIDENCE: exact full 3.8.3+ three-failure-to-submission trace is unavailable. Connection/TLS, retries/deferred/bounces, remote syslog wire and full parser parity are outside the profile; no source-specific Elastic coverage percentage is claimed.',
  ],
  parameters: [
    {
      name: 'mail_host',
      defaultValue: 'mail-01.corp.example',
      description: 'Postfix host identity',
    },
    {
      name: 'mail_ip',
      defaultValue: '10.80.0.5',
      description: 'Postfix host identity',
    },
    {
      name: 'normal_user',
      defaultValue: 'service@corp.example',
      description:
        'First routine sender; seven more are in `samples/senders.json`; use an ASCII username of at most 100 bytes',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.80.1.20',
      description:
        'First routine sender; seven more are in `samples/senders.json`; use an ASCII username of at most 100 bytes',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'payroll@corp.example',
      description:
        'Episode identity, also used by routine mail and isolated failures; use an ASCII username of at most 100 bytes',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description:
        'Episode identity, also used by routine mail and isolated failures; use an ASCII username of at most 100 bytes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '6',
      description:
        'Recurrence in generated hours; minimum supported interval is 1 hour, smaller values are clamped to 1',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring episodes; `false` emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Cleanup Message-ID from queue creation time',
      json: String.raw`{
  "@timestamp": "2026-09-25T06:00:09+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "message-cleanup",
    "category": [
      "email"
    ],
    "dataset": "postfix.syslog",
    "kind": "event",
    "original": "Sep 25 06:00:09 mail-01.corp.example postfix/cleanup[2421]: 11375C0580: message-id=<20260925060008.11375C0580@mail-01.corp.example>",
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
      "appname": "postfix/cleanup"
    }
  },
  "message": "11375C0580: message-id=<20260925060008.11375C0580@mail-01.corp.example>",
  "observer": {
    "hostname": "mail-01.corp.example",
    "ip": "10.80.0.5",
    "product": "Postfix",
    "type": "mail",
    "vendor": "Postfix"
  },
  "postfix": {
    "message_id": "<20260925060008.11375C0580@mail-01.corp.example>",
    "queue_id": "11375C0580",
    "service": "cleanup"
  },
  "process": {
    "name": "postfix/cleanup",
    "pid": 2421
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
