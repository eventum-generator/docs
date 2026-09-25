import type { GeneratorMeta } from '@/lib/hub-types';

export const messagingApacheKafkaAuthorizer: GeneratorMeta = {
  slug: 'messaging-apache-kafka-authorizer',
  displayName: 'Apache Kafka StandardAuthorizer',
  category: 'messaging',
  description:
    'Kafka authorization-denial logs with a switchable sequence of denied topic operations.',
  dataSource: 'Kafka KRaft StandardAuthorizer Log4j audit logger',
  format: ['JSON', 'ECS', 'Log4j'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native Principal = ... Denied audit message',
    'DefaultDeny topic ACL decisions',
    'Same principal, IP and topic across four denied operations',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One principal is denied READ, WRITE, ALTER_CONFIGS and DELETE on the same topic from one client IP.',
  generatorId: 'kafka-authorizer',
  eventTypes: [
    {
      id: 'READ',
      description: 'Denied Fetch request',
      frequency: '85% baseline',
      category: 'iam',
    },
    {
      id: 'WRITE',
      description: 'Denied Produce request',
      frequency: '15% baseline',
      category: 'iam',
    },
    {
      id: 'ALTER_CONFIGS',
      description: 'Denied AlterConfigs request',
      frequency: 'Chain only',
      category: 'iam',
    },
    {
      id: 'DELETE',
      description: 'Denied DeleteTopics request',
      frequency: 'Chain only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Explicit denied requests are logged at INFO.',
    'Allowed decisions require DEBUG and are outside this pack.',
    'Log4j prefix depends on broker appender configuration.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include four-step denied-operation chain',
    },
    {
      name: 'broker_host',
      defaultValue: 'kafka-01.corp.example',
      description: 'Kafka broker name',
    },
    {
      name: 'suspicious_principal',
      defaultValue: 'User:svc-audit',
      description: 'Principal in the chain',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description: 'Client IP in the chain',
    },
    {
      name: 'sensitive_topic',
      defaultValue: 'payroll-events',
      description: 'Topic in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:39:21+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "authorization-denied",
    "category": [
      "iam"
    ],
    "kind": "event",
    "original": "[2026-09-25 12:39:21,000] INFO Principal = User:svc-audit is Denied operation = READ from host = 192.0.2.91 on resource = Topic:LITERAL:payroll-events for request = Fetch with resourceRefCount = 1 based on rule DefaultDeny (kafka.authorizer.logger)",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "host": {
    "name": "kafka-01.corp.example"
  },
  "kafka": {
    "authorization_result": "Denied",
    "operation": "READ",
    "principal": "User:svc-audit",
    "request": "Fetch",
    "resource": {
      "name": "payroll-events",
      "pattern_type": "LITERAL",
      "type": "Topic"
    },
    "resource_ref_count": 1,
    "rule": "DefaultDeny"
  },
  "log": {
    "level": "INFO",
    "logger": "kafka.authorizer.logger"
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "svc-audit"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "user": {
    "name": "svc-audit"
  }
}`,
    },
  ],
};
