import type { GeneratorMeta } from '@/lib/hub-types';

export const messagingApacheKafkaAuthorizer: GeneratorMeta = {
  slug: 'messaging-apache-kafka-authorizer',
  displayName: 'Apache Kafka StandardAuthorizer Denial Log',
  category: 'messaging',
  description:
    'Kafka 3.9.0 KRaft StandardAuthorizer denials of topic operations by misconfigured clients retrying requests they are not allowed to make, as native kafka-authorizer.log lines with parsed ECS and kafka.* fields. Recurring episodes deny one principal four different operations on one topic within minutes.',
  dataSource:
    'Apache Kafka 3.9.0 KRaft StandardAuthorizer, kafka-authorizer.log (Log4j)',
  format: ['JSON', 'ECS', 'Log4j'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native Log4j denial line in event.original',
    'Independent retry bursts from 12 SASL principals',
    'Recurring four-operation denial chain on one topic',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (each start-to-start interval is the configured hours plus up to about 10 minutes, occasionally more), one principal from its own address is denied READ/Fetch, WRITE/Produce, ALTER_CONFIGS/AlterConfigs and DELETE/DeleteTopics on the same topic as four consecutive denials of that principal within about 4 minutes. Six principal/topic pairs rotate; every step and three-step near misses also occur in background, and nothing is read, written, reconfigured or deleted.',
  generatorId: 'kafka-authorizer',
  eventTypes: [
    {
      id: 'READ',
      description: 'Denied consumer Fetch, authorized by the broker',
      frequency: '53.3-54.3% measured share',
      category: 'api',
    },
    {
      id: 'WRITE',
      description: 'Denied Produce, authorized by the broker',
      frequency: '36.7-38.0% measured share',
      category: 'api',
    },
    {
      id: 'ALTER_CONFIGS',
      description: 'Denied AlterConfigs, forwarded to the controller',
      frequency: '4.8-4.9% measured share',
      category: 'api',
    },
    {
      id: 'DELETE',
      description: 'Denied DeleteTopics, forwarded to the controller',
      frequency: '3.6-4.2% measured share',
      category: 'api',
    },
  ],
  realismFeatures: [
    'Twelve SASL User principals, each bound to one client address, and four existing topics on one combined broker/controller. Clients hold only DESCRIBE ACLs, so every attempt ends in DefaultDeny; application accounts are denied reads and writes, and only four accounts (two operations accounts, an analyst and an audit exporter) are denied administrative requests.',
    'Each client retries independently: after a log-normal quiet period it repeats one denied request 1-8 times about 25 s apart (administrative requests 1-3 times about 45 s apart) and may then try another operation on the same topic. Measured volume is 923-1082 events per day, at most one per 10-second input tick.',
    'All 13 native fields (layout time, level and logger plus the ten audit message fields) are generated and parsed; forwarded AlterConfigs and DeleteTopics keep the original principal and client address. Only INFO denials of explicitly requested operations are in this stream; allowed decisions, filter checks and successful traffic are not.',
    'Each episode principal is also denied all four operations on its topic in ordinary traffic, and three-step near misses of the chain occur about every 6 hours in both modes; only the full ordered sequence within 5 minutes is episode-only.',
    "The format is implemented from the tagged Kafka 3.9.0 source and its unit-test expectation, not verified byte for byte against a running broker. Elastic publishes no authorizer sample and its Kafka authentication test log is a different stream, so the ECS mapping is this pack's own. The JVM is assumed to run in UTC; rates and weights are synthetic, with no daily rhythm and no tight-loop retry floods.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring episodes; false emits only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episodes before a random 0-10 minute delay, 1 to 8,760',
    },
    {
      name: 'broker_host',
      defaultValue: 'kafka-01.corp.example',
      description: 'Broker/controller node written to host.name',
    },
  ],
  sampleOutputs: [
    {
      title: 'Third step of the first episode (ALTER_CONFIGS)',
      json: String.raw`{"@timestamp": "2026-09-27T00:07:48.336Z", "ecs": {"version": "8.17.0"}, "event": {"action": "authorization-denied", "category": ["api"], "created": "2026-09-27T00:07:48.535Z", "ingested": "2026-09-27T00:07:49.302Z", "kind": "event", "original": "[2026-09-27 00:07:48,336] INFO Principal = User:ops-config is Denied operation = ALTER_CONFIGS from host = 10.40.3.20 on resource = Topic:LITERAL:metrics-internal for request = AlterConfigs with resourceRefCount = 1 based on rule DefaultDeny (kafka.authorizer.logger)", "outcome": "failure", "timezone": "+00:00", "type": ["denied"]}, "host": {"name": "kafka-01.corp.example"}, "kafka": {"authorization_result": "Denied", "log": {"class": "kafka.authorizer.logger", "component": "unknown"}, "operation": "ALTER_CONFIGS", "principal": "User:ops-config", "request": "AlterConfigs", "resource": {"name": "metrics-internal", "pattern_type": "LITERAL", "type": "Topic"}, "resource_ref_count": 1, "rule": "DefaultDeny"}, "log": {"level": "INFO", "logger": "kafka.authorizer.logger"}, "message": "Principal = User:ops-config is Denied operation = ALTER_CONFIGS from host = 10.40.3.20 on resource = Topic:LITERAL:metrics-internal for request = AlterConfigs with resourceRefCount = 1 based on rule DefaultDeny", "related": {"ip": ["10.40.3.20"], "user": ["ops-config"]}, "source": {"ip": "10.40.3.20"}, "tags": ["preserve_original_event"], "user": {"name": "ops-config"}}`,
    },
  ],
};
