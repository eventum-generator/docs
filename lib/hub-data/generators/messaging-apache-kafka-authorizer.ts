import type { GeneratorMeta } from '@/lib/hub-types';

export const messagingApacheKafkaAuthorizer: GeneratorMeta = {
  slug: 'messaging-apache-kafka-authorizer',
  displayName: 'Apache Kafka StandardAuthorizer Denial Log',
  category: 'messaging',
  description:
    'Kafka 3.9.0 KRaft StandardAuthorizer denials of topic operations by misconfigured clients retrying requests they are not allowed to make, as native kafka-authorizer.log lines with parsed ECS and kafka.* fields. About 5,100-5,200 denials a day from twelve SASL principals, around the clock with a daytime rise. Recurring episodes deny one principal four different operations on one topic within minutes.',
  dataSource:
    'Apache Kafka 3.9.0 KRaft StandardAuthorizer, kafka-authorizer.log (Log4j)',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native Log4j denial line in event.original',
    'About 5,100-5,200 denials a day from 12 SASL principals',
    'Recurring four-operation denial chain on one topic',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One principal from its own address is denied READ/Fetch, WRITE/Produce, ALTER_CONFIGS/AlterConfigs and DELETE/DeleteTopics on the same topic, once each, as four consecutive denials of that principal. Steps follow the spacing of retries of one request, capped so that all four stay within 4 minutes; the span from first to last step is about 60-215 s. Every step is DefaultDeny, so nothing is read, written, reconfigured or deleted. The record count is the same in both modes: an episode's four records take the place of four records that would otherwise have come at those moments. anomaly_interval_hours (default 24) is measured in event time. The first episode starts within the first min(interval, 24 h), its hour weighted by the hourly volume of the principal's group; each later start is drawn in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards busy hours. When the drawn principal is in the middle of a retry run, the start slips by a few minutes, and missed episodes are not replayed. Start-to-start intervals are about 21-26 h at the default 24 and 5.4-6.6 h at 6. Six principal/topic pairs rotate in a shuffled order, never the same pair twice in a row, and each of these principals is also denied each of the four operations on its topic in ordinary traffic. Ordinary traffic never has READ, WRITE, ALTER_CONFIGS and DELETE in that order by one principal on one topic within 300 s; an ordinary DELETE that would complete that order appears instead as a repeated ALTER_CONFIGS attempt, about once in two weeks.",
  generatorId: 'kafka-authorizer',
  eventTypes: [
    {
      id: 'READ',
      description: 'Denied consumer Fetch, authorized by the broker',
      frequency: '55.4-56.5% of records per day',
      category: 'api',
    },
    {
      id: 'WRITE',
      description: 'Denied Produce, authorized by the broker',
      frequency: '38.9-40.2% of records per day',
      category: 'api',
    },
    {
      id: 'ALTER_CONFIGS',
      description: 'Denied AlterConfigs, forwarded to the controller',
      frequency: '2.4-3.0% of records per day',
      category: 'api',
    },
    {
      id: 'DELETE',
      description: 'Denied DeleteTopics, forwarded to the controller',
      frequency: '2.0-2.2% of records per day',
      category: 'api',
    },
  ],
  realismFeatures: [
    'One combined KRaft broker/controller, twelve SASL User principals each bound to one client address, and four existing topics. Clients hold only DESCRIBE ACLs, so every attempt ends in DefaultDeny; application accounts are denied reads and writes, and only the two operations accounts, the analyst and the audit exporter are denied administrative requests.',
    'The nine application service accounts produce about 4,500 denials a day (89%), an even floor around the clock plus a broad daytime rise peaking at 11:00-13:00; the analyst and operations accounts produce about 660 a day (11%), 600 of them between 08:00 and 18:00. That is about 130 denials an hour at night and 310-340 at the midday peak (UTC by default), with each day varying by up to 3%.',
    'Each client retries one denied request at a time: 1-8 Fetch or Produce attempts, or 1-3 administrative attempts, 24 s apart at the 10th percentile, 58 s in median and 165 s at the 90th. After a run the client tries another operation on the same topic with probability 0.3, in median about 150 s later. 93% of denials follow a denial of the same principal within 10 minutes; consecutive records are 10.6 s apart in median and 99% within 90 s.',
    'All 13 native fields (layout time, level and logger plus the ten audit message fields) are generated and parsed; forwarded AlterConfigs and DeleteTopics keep the original client principal and address. Only INFO denials of explicitly requested operations are in this stream; allowed decisions, filter checks, authentication and successful traffic are not. event.created and event.ingested are synthetic collector times.',
    "The format is implemented from the tagged Kafka 3.9.0 source and its unit-test expectation, not verified byte for byte against a running broker. Elastic publishes no authorizer sample and its Kafka authentication test log is a different stream, so the ECS mapping is this pack's own. The JVM is assumed to run in UTC; volumes, hour curves and client weights are synthetic, and tight-loop retry floods, other rules (MatchingAcl, SuperUser), other resource types and cluster-level denials are not generated.",
    'Episode steps come faster than ordinary operation changes: an episode moves to the next operation after about 15-85 s, while an ordinary client switching operations on one topic does so after about 150 s in median (15-17% within a minute).',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring episodes to the background; false produces only the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 1 to 8,760',
    },
    {
      name: 'broker_host',
      defaultValue: 'kafka-01.corp.example',
      description:
        'Broker/controller node written to host.name; ASCII hostname up to 253 characters',
    },
  ],
  sampleOutputs: [
    {
      title: 'Third step of an episode (ALTER_CONFIGS)',
      json: String.raw`{"@timestamp": "2026-10-01T14:03:17.180Z", "ecs": {"version": "8.17.0"}, "event": {"action": "authorization-denied", "category": ["api"], "created": "2026-10-01T14:03:17.795Z", "ingested": "2026-10-01T14:03:19.008Z", "kind": "event", "original": "[2026-10-01 14:03:17,180] INFO Principal = User:ops-config is Denied operation = ALTER_CONFIGS from host = 10.40.3.20 on resource = Topic:LITERAL:metrics-internal for request = AlterConfigs with resourceRefCount = 1 based on rule DefaultDeny (kafka.authorizer.logger)", "outcome": "failure", "timezone": "+00:00", "type": ["denied"]}, "host": {"name": "kafka-01.corp.example"}, "kafka": {"authorization_result": "Denied", "log": {"class": "kafka.authorizer.logger", "component": "unknown"}, "operation": "ALTER_CONFIGS", "principal": "User:ops-config", "request": "AlterConfigs", "resource": {"name": "metrics-internal", "pattern_type": "LITERAL", "type": "Topic"}, "resource_ref_count": 1, "rule": "DefaultDeny"}, "log": {"level": "INFO", "logger": "kafka.authorizer.logger"}, "message": "Principal = User:ops-config is Denied operation = ALTER_CONFIGS from host = 10.40.3.20 on resource = Topic:LITERAL:metrics-internal for request = AlterConfigs with resourceRefCount = 1 based on rule DefaultDeny", "related": {"ip": ["10.40.3.20"], "user": ["ops-config"]}, "source": {"ip": "10.40.3.20"}, "tags": ["preserve_original_event"], "user": {"name": "ops-config"}}`,
    },
  ],
};
