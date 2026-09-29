import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMongodbLog: GeneratorMeta = {
  slug: 'database-mongodb-log',
  displayName: 'MongoDB Server Log (mongod JSON)',
  category: 'database',
  description:
    'Structured logv2 JSON server log of one MongoDB Community 7.0 mongod (default verbosity, slowms 100, SCRAM-SHA-256) as shipped by the Elastic mongodb.log integration: the native line byte for byte in event.original and its parsed fields under mongodb.log. About 39,000 lines a day on a UTC hour curve, from service pools, batch jobs and four people that connect, authenticate and run slow reads and exports. Recurring episodes show repeated wrong passwords followed by a single-batch customer export.',
  dataSource:
    'MongoDB Community 7.0 mongod logv2 JSON log file, Elastic mongodb 1.24 mapping',
  format: ['JSON', 'ECS'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native 7.0 line format and attribute order from the r7.0.43 source',
    'About 39,000 lines a day from service pools, batch jobs and four people',
    'Recurring failed logins, success and crm.customers export chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One extra session of one of the four people, from that person's own workstation and account: three (55%), four (30%) or five (15%) connect attempts, each a monitoring pair plus one connection with Failed to authenticate, closed right away and retried after a median 9 s; then Successfully authenticated of the same user from the same address, zero to two ordinary reads and, at the latest 20 minutes after the first failure, an export of the customers of one region or of the churned customers from crm.customers whose whole result after the first 101 documents arrives in one getMore batch (one Slow query line with cursorExhausted: true); more reads, then Connection ended. The person's ordinary sessions go on as usual, and the episode's lines take the place of an equal number of service slow-query lines, so the daily volume and the hour curve are the same as in background. Episodes recur every 24 hours by default (anomaly_interval_hours, 6 to 8,760): the first within min(interval, 24 h) of the start of the log at a time drawn from the people hour curve, each next one in a window of min(interval / 4, 6 h) centred one interval after the actual start of the previous one, weighted towards business hours. Missed intervals are not replayed, and at intervals of 8 hours or less some episodes fall outside business hours. The person rotates, never the same as in the previous episode. Every event type, address, user, user-address pair, namespace and export shape of an episode also occurs in background, including runs of three or more failures followed by a success and single-batch customer exports by all four people; only the complete order within 30 minutes of the first failure is episode-only.",
  generatorId: 'database-mongodb-log',
  eventTypes: [
    {
      id: '51803',
      description:
        'Slow query (COMMAND): find (65.2%) or aggregate (5.9%) above 100 ms, or a getMore batch of an export (0.13%)',
      frequency: '71.3% of lines',
      category: 'database',
    },
    {
      id: '22943',
      description:
        'Connection accepted (NETWORK): new client connection with the open-connection count',
      frequency: '5.9% of lines',
      category: 'database',
    },
    {
      id: '51800',
      description:
        'client metadata (NETWORK): driver handshake document of the connection',
      frequency: '5.9% of lines',
      category: 'database',
    },
    {
      id: '22944',
      description:
        'Connection ended (NETWORK): connection closed with the open-connection count',
      frequency: '5.9% of lines',
      category: 'database',
    },
    {
      id: '5286306',
      description:
        'Successfully authenticated (ACCESS): SCRAM-SHA-256 login succeeded',
      frequency: '5.4% of lines',
      category: 'database',
    },
    {
      id: '6788700',
      description:
        'Received first command on ingress connection (NETWORK): first command after the login, with the delay',
      frequency: '5.4% of lines',
      category: 'database',
    },
    {
      id: '5286307',
      description:
        'Failed to authenticate (ACCESS): wrong password, AuthenticationFailed (18)',
      frequency: '0.03% of lines',
      category: 'database',
    },
  ],
  realismFeatures: [
    'Top-level order t, s, c, id, ctx, msg, attr with the formatter padding (s to 5, c to 11, id to 8 characters), no svc field, t.$date in the server time zone with milliseconds, and each message attribute order taken from the r7.0.43 log sites. The ECS fields mirror the Elastic mongodb 1.24 pipeline; event.created and event.ingested follow the line by a few hundred milliseconds to seconds.',
    'About 39,000 lines a day (±3% day to day) on a UTC hour curve: 0.70 lines/s at 08-19, 0.40 at 07-08 and 19-21 and 0.20 at 21-07, with no weekly cycle. Service traffic makes up about 91% of the lines. People open about one session per person per hour at 08-18, 0.4 of that at 07-08 and 18-19 and 0.05 at night; the billing worker connects about every 25 minutes in the day and less often at night, and the reporting job runs about five times a day at any hour.',
    "orders-api (four instances, six pooled connections each), catalog-service (two instances, four each) and mongodb_exporter keep pooled connections; an idle pooled connection closes after a median 13 minutes (the exporter's after about two hours) and reopens on demand a median 15 s later. Two DBAs (mongosh) and two analysts (MongoDB Compass) run about 11 sessions each a day with a median of 4 reads and 40 s think time; together they export about 12 times a day (crm.customers about 8), the reporting job about 4 times.",
    "About 16% of people's logins fail (about 8 a day across the four): mistyped attempts, outdated remembered passwords, retries after a median 9 s and give-ups. A single failure before a success is the most common, and three or more happen about six times a week. A service instance that still holds a rotated secret fails 1 to 12 times in a row before it connects, about 1.5 times a day; over all logins 0.55% fail.",
    "A connection's client metadata follows its Connection accepted a median 1.0 s later in the day (90th percentile 3.3 s) and 2.6 s at night (9.6 s); logins, first commands and export batches are spaced the same way, so the gaps between their timestamps are longer than durationMillis and elapsedMillis imply. Connection ids continue from a high counter, connectionCount follows every accept and end, and the pools are already open when the log starts, so some Connection ended lines close connections accepted earlier.",
    'Byte form comes from the tagged formatter and log-site source; no raw 7.0 line of these ids was found, and the padding style is confirmed by the 4.4.4 fixture of the Elastic integration. Query shapes, queryHash and planCacheKey, durations, lock counts, storage reads, cpuNanos and driver versions are synthetic, and speculative authentication is assumed for every client.',
    'TLS, load balancer, replica-set, sharding, startup and shutdown messages, writes, errors other than a wrong password and the Enterprise audit log are not modelled, and service pools do not restart. With anomaly_mode true, counts of failure runs followed by a success and of single-batch customer exports are about one per episode higher than in background.',
  ],
  parameters: [
    {
      name: 'db_host',
      defaultValue: 'mongo-01.corp.example',
      description:
        'Server host name in host.name; ASCII letters, digits, dot and hyphen',
    },
    {
      name: 'log_timezone',
      defaultValue: '+00:00',
      description:
        'Server time zone offset written in t.$date, [+-]HH:MM; the hour curves stay in UTC',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Episode interval in hours of source time, number from 6 to 8,760',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'true adds episodes to background, false produces background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Single-batch customer export completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T14:12:10.799Z", "data_stream": {"dataset": "mongodb.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "event": {"category": ["database"], "created": "2026-09-21T14:12:11.330Z", "dataset": "mongodb.log", "ingested": "2026-09-21T14:12:11.867Z", "kind": "event", "module": "mongodb", "original": "{\"t\":{\"$date\":\"2026-09-21T14:12:10.799+00:00\"},\"s\":\"I\",  \"c\":\"COMMAND\",  \"id\":51803,   \"ctx\":\"conn89847\",\"msg\":\"Slow query\",\"attr\":{\"type\":\"command\",\"ns\":\"crm.customers\",\"appName\":\"MongoDB Compass\",\"command\":{\"getMore\":6208691475638660086,\"collection\":\"customers\",\"lsid\":{\"id\":{\"$uuid\":\"c25abd1e-cf0c-432c-bbd3-4a051fc380cb\"}},\"$db\":\"crm\"},\"originatingCommand\":{\"find\":\"customers\",\"filter\":{\"address.region\":\"far-east\"},\"lsid\":{\"id\":{\"$uuid\":\"c25abd1e-cf0c-432c-bbd3-4a051fc380cb\"}},\"$db\":\"crm\"},\"planSummary\":\"COLLSCAN\",\"cursorid\":6208691475638660086,\"keysExamined\":0,\"docsExamined\":116411,\"nBatches\":1,\"cursorExhausted\":true,\"numYields\":103,\"nreturned\":5997,\"queryFramework\":\"classic\",\"reslen\":12257781,\"locks\":{\"FeatureCompatibilityVersion\":{\"acquireCount\":{\"r\":104}},\"Global\":{\"acquireCount\":{\"r\":104}}},\"storage\":{\"data\":{\"bytesRead\":206906,\"timeReadingMicros\":7900}},\"cpuNanos\":106188935,\"remote\":\"10.30.2.50:50368\",\"protocol\":\"op_msg\",\"durationMillis\":150}}", "type": ["info"]}, "host": {"name": "mongo-01.corp.example"}, "input": {"type": "logfile"}, "log": {"file": {"path": "/var/log/mongodb/mongod.log"}, "level": "I"}, "message": "Slow query", "mongodb": {"log": {"attr": {"type": "command", "ns": "crm.customers", "appName": "MongoDB Compass", "command": {"getMore": 6208691475638660086, "collection": "customers", "lsid": {"id": {"$uuid": "c25abd1e-cf0c-432c-bbd3-4a051fc380cb"}}, "$db": "crm"}, "originatingCommand": {"find": "customers", "filter": {"address.region": "far-east"}, "lsid": {"id": {"$uuid": "c25abd1e-cf0c-432c-bbd3-4a051fc380cb"}}, "$db": "crm"}, "planSummary": "COLLSCAN", "cursorid": 6208691475638660086, "keysExamined": 0, "docsExamined": 116411, "nBatches": 1, "cursorExhausted": true, "numYields": 103, "nreturned": 5997, "queryFramework": "classic", "reslen": 12257781, "locks": {"FeatureCompatibilityVersion": {"acquireCount": {"r": 104}}, "Global": {"acquireCount": {"r": 104}}}, "storage": {"data": {"bytesRead": 206906, "timeReadingMicros": 7900}}, "cpuNanos": 106188935, "remote": "10.30.2.50:50368", "protocol": "op_msg", "durationMillis": 150}, "component": "COMMAND", "context": "conn89847", "id": 51803}}, "tags": ["preserve_original_event"]}`,
    },
  ],
};
