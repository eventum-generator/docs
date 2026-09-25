/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMongodbLog: GeneratorMeta = {
  slug: 'database-mongodb-log',
  displayName: 'MongoDB 7 Structured Log',
  category: 'database',
  description:
    'MongoDB 7 JSON component logs with connection context, slow queries and a switchable scan-escalation chain.',
  dataSource: 'MongoDB 7 structured JSON log',
  format: ['JSON', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'database-mongodb-log',
  highlights: [
    'Native t/s/c/id/ctx/svc/msg/attr',
    'Connection-context correlation',
    'Escalating COLLSCAN metrics',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client connection produces three increasingly broad COLLSCAN slow queries against finance.payroll, then disconnects.',
  eventTypes: [
    {
      id: 'client metadata',
      description: 'Client context and metadata',
      frequency: '1 per session',
      category: 'network',
    },
    {
      id: 'Slow query',
      description: 'Slow command with query metrics',
      frequency: '1 per routine session; 3 per chain',
      category: 'database',
    },
    {
      id: 'end connection',
      description: 'Connection closed',
      frequency: '1 per session',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Structured native JSON is retained in event.original and mongodb.log.',
    'One ctx and remote endpoint link client metadata, slow queries and disconnect.',
    'Fifty collection samples vary routine namespaces and scan metrics.',
  ],
  parameters: [
    {
      name: 'db_host',
      defaultValue: 'mongo-01.corp.example',
      description: 'Server name',
    },
    {
      name: 'db_ip',
      defaultValue: '10.110.0.5',
      description: 'Server address',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.110.1.20',
      description: 'Background client address',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.4.51',
      description: 'Chain client address',
    },
    {
      name: 'anomaly_namespace',
      defaultValue: 'finance.payroll',
      description: 'Collection scanned in chain',
    },
    {
      name: 'anomaly_interval_sessions',
      defaultValue: '50',
      description: 'Routine sessions between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:41:53+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "slow-query",
    "category": [
      "database"
    ],
    "dataset": "mongodb.log",
    "kind": "event",
    "original": "{\"attr\": {\"appName\": \"MongoDB Shell\", \"command\": {\"$db\": \"finance\", \"batchSize\": 10000, \"filter\": {}, \"find\": \"payroll\"}, \"docsExamined\": 150000, \"durationMillis\": 850, \"keysExamined\": 0, \"nreturned\": 15000, \"ns\": \"finance.payroll\", \"numYields\": 12, \"planSummary\": \"COLLSCAN\", \"protocol\": \"op_msg\", \"remote\": \"10.99.4.51:61632\", \"reslen\": 2250000, \"type\": \"command\"}, \"c\": \"COMMAND\", \"ctx\": \"conn151\", \"id\": 51803, \"msg\": \"Slow query\", \"s\": \"I\", \"svc\": \"R\", \"t\": {\"$date\": \"2026-09-25T12:41:53.000+00:00\"}}",
    "type": [
      "info"
    ]
  },
  "host": {
    "ip": [
      "10.110.0.5"
    ],
    "name": "mongo-01.corp.example"
  },
  "log": {
    "level": "info"
  },
  "message": "Slow query",
  "mongodb": {
    "log": {
      "attr": {
        "appName": "MongoDB Shell",
        "command": {
          "$db": "finance",
          "batchSize": 10000,
          "filter": {},
          "find": "payroll"
        },
        "docsExamined": 150000,
        "durationMillis": 850,
        "keysExamined": 0,
        "nreturned": 15000,
        "ns": "finance.payroll",
        "numYields": 12,
        "planSummary": "COLLSCAN",
        "protocol": "op_msg",
        "remote": "10.99.4.51:61632",
        "reslen": 2250000,
        "type": "command"
      },
      "c": "COMMAND",
      "ctx": "conn151",
      "id": 51803,
      "msg": "Slow query",
      "s": "I",
      "svc": "R",
      "t": {
        "$date": "2026-09-25T12:41:53.000+00:00"
      }
    }
  },
  "observer": {
    "hostname": "mongo-01.corp.example",
    "ip": "10.110.0.5",
    "product": "MongoDB",
    "type": "database",
    "vendor": "MongoDB"
  },
  "related": {
    "ip": [
      "10.99.4.51"
    ]
  },
  "source": {
    "ip": "10.99.4.51",
    "port": 61632
  },
  "tags": [
    "mongodb-structured-log",
    "preserve_original_event"
  ]
}`,
    },
  ],
};
