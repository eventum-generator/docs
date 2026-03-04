import type { GeneratorMeta } from '@/lib/hub-types';

export const emailExchange: GeneratorMeta = {
    slug: 'email-exchange',
    displayName: 'Microsoft Exchange Message Tracking',
    category: 'email',
    description:
      'Exchange Server 2019 message tracking — SMTP receive/send, mailbox delivery, transport routing, shadow redundancy, anti-spam filtering, distribution group expansion, and delivery failure DSNs.',
    format: ['JSON', 'ECS'],
    dataSource: 'Exchange Server Message Tracking',
    eventCount: 16,
    templateCount: 17,
    highlights: [
      'Message correlation',
      'Anti-spam verdicts',
      'Distribution group expansion',
      'DSN bounce tracking',
    ],
    generatorId: 'exch',
    eventTypes: [
      {
        id: 'RECEIVE',
        description: 'Message received (SMTP/mailbox)',
        frequency: '~26%',
        category: 'email',
      },
      {
        id: 'DELIVER',
        description: 'Message delivered to mailbox',
        frequency: '~24%',
        category: 'email',
      },
      {
        id: 'SEND',
        description: 'Message sent between transport services',
        frequency: '~12%',
        category: 'email',
      },
      {
        id: 'SUBMIT',
        description: 'Submitted from Mailbox to Transport',
        frequency: '~10%',
        category: 'email',
      },
      {
        id: 'HAREDIRECT',
        description: 'Shadow redundancy copy created',
        frequency: '~7%',
        category: 'email',
      },
      {
        id: 'AGENTINFO',
        description: 'Anti-spam verdicts, transport rules',
        frequency: '~6%',
        category: 'email',
      },
      {
        id: 'NOTIFYMAPI',
        description: 'Message detected in Outbox via MAPI',
        frequency: '~5%',
        category: 'email',
      },
      {
        id: 'RESOLVE',
        description: 'Recipient resolved via Active Directory',
        frequency: '~2%',
        category: 'email',
      },
      {
        id: 'HADISCARD',
        description: 'Shadow message discarded',
        frequency: '~2%',
        category: 'email',
      },
      {
        id: 'EXPAND',
        description: 'Distribution group expanded',
        frequency: '~2%',
        category: 'email',
      },
      {
        id: 'DEFER',
        description: 'Delivery temporarily delayed',
        frequency: '~1%',
        category: 'email',
      },
      {
        id: 'TRANSFER',
        description: 'Message forked (content conversion)',
        frequency: '~1%',
        category: 'email',
      },
      {
        id: 'FAIL',
        description: 'Permanent delivery failure',
        frequency: '~0.5%',
        category: 'email',
      },
      {
        id: 'DSN',
        description: 'Delivery Status Notification (bounce)',
        frequency: '~0.5%',
        category: 'email',
      },
      {
        id: 'REDIRECT',
        description: 'Message redirected to alternate recipient',
        frequency: '~0.3%',
        category: 'email',
      },
      {
        id: 'DROP',
        description: 'Message silently dropped (spam/policy)',
        frequency: '~0.3%',
        category: 'email',
      },
    ],
    realismFeatures: [
      'Cross-template message correlation — RECEIVE pushes message context; downstream events consume from pool',
      'Lognormal message sizes — realistic right-skewed distribution (most 2–75 KB, some up to 25 MB)',
      'Anti-spam verdicts — SCL, SFV, IPV, BCL, and country code fields with weighted distributions',
      'Distribution group expansion — EXPAND events reference real group names with member counts',
      'Categorized email subjects — business, automated, newsletter, spam, phishing with weighted selection',
      'DSN correlation — bounce events reference original message-id with empty return-path',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'EXCH01',
        description: 'Exchange server short name',
      },
      {
        name: 'domain',
        defaultValue: 'contoso.com',
        description: 'Organization domain',
      },
      {
        name: 'server_ip',
        defaultValue: '10.0.1.10',
        description: 'Exchange server IP',
      },
      {
        name: 'dag_name',
        defaultValue: 'DAG01',
        description: 'Database Availability Group name',
      },
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
        description: 'Elastic Agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'RECEIVE — Inbound Email',
        json: `{
    "@timestamp": "2026-02-22T17:06:16+00:00",
    "event": {
        "action": "receive",
        "category": ["email"],
        "dataset": "microsoft_exchange.messagetracking",
        "outcome": "success"
    },
    "email": {
        "direction": "inbound",
        "from": { "address": ["jdoe@partner-corp.com"] },
        "subject": "MFA enrollment reminder",
        "to": { "address": ["d.brown@contoso.com"] }
    },
    "microsoft_exchange": {
        "messagetracking": {
            "event_id": "RECEIVE",
            "source": "SMTP",
            "directionality": "Incoming"
        }
    },
    "observer": { "product": "Exchange Server", "vendor": "Microsoft" }
}`,
      },
    ],
  };
