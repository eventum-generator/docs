import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMongodbLog: GeneratorMeta = {
  slug: 'database-mongodb-log',
  displayName: 'MongoDB Server Log (mongod JSON)',
  category: 'database',
  description:
    'Structured logv2 JSON server log of one MongoDB Community 7.0 mongod (default verbosity, slowms 100, SCRAM-SHA-256) as shipped by the Elastic mongodb.log integration: the native line byte for byte in event.original and its parsed fields under mongodb.log. Services, batch jobs and four people connect, authenticate and run slow reads and exports; recurring episodes show repeated wrong passwords followed by a customer export.',
  dataSource:
    'MongoDB Community 7.0 mongod logv2 JSON log file, Elastic mongodb 1.24 mapping',
  format: ['JSON', 'ECS'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'database-mongodb-log',
  highlights: [
    'Native 7.0 line format and attribute order from the r7.0.43 source',
    'Service pools, batch jobs and people as independent processes',
    'Recurring failed logins, success and crm.customers export chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One of four people, from their own workstation and account, fails authentication three to five times, then succeeds, runs zero to two reads and exports crm.customers (consecutive Slow query getMore lines with COLLSCAN and 16 MiB batches) at the latest 20 minutes after the first failure. Episodes recur every 24 hours by default (anomaly_interval_hours, 6 to 8,760): the first within min(interval, 24 h) at a time drawn from the people hour curve plus a short random delay, each next one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards business hours, with no replay of missed intervals. The person rotates. Every element occurs in background; an ordinary crm.customers getMore that would complete the order within 30 minutes of the first failure is not written.',
  eventTypes: [
    {
      id: '51803',
      description:
        'Slow query (COMMAND): read above 100 ms, or a getMore batch of an export',
      frequency: '34.2% background share',
      category: 'database',
    },
    {
      id: '22943',
      description:
        'Connection accepted (NETWORK): new client connection with the open-connection count',
      frequency: '15.1% background share',
      category: 'database',
    },
    {
      id: '51800',
      description:
        'client metadata (NETWORK): driver handshake document of the connection',
      frequency: '15.1% background share',
      category: 'database',
    },
    {
      id: '22944',
      description:
        'Connection ended (NETWORK): connection closed with the open-connection count',
      frequency: '15.1% background share',
      category: 'database',
    },
    {
      id: '5286306',
      description:
        'Successfully authenticated (ACCESS): SCRAM-SHA-256 login succeeded',
      frequency: '10.0% background share',
      category: 'database',
    },
    {
      id: '6788700',
      description:
        'Received first command on ingress connection (NETWORK): first command after the login',
      frequency: '10.0% background share',
      category: 'database',
    },
    {
      id: '5286307',
      description:
        'Failed to authenticate (ACCESS): wrong password, AuthenticationFailed (18)',
      frequency: '0.56% background share',
      category: 'database',
    },
  ],
  realismFeatures: [
    'Top-level order t, s, c, id, ctx, msg, attr with the formatter padding, no svc field, t.$date in the server time zone with milliseconds, and each message attribute order taken from the r7.0.43 log sites; the ECS fields mirror the Elastic mongodb 1.24 pipeline.',
    'Service pools (orders-api, catalog-service, mongodb_exporter) keep pooled connections with lognormal lifetimes; billing and nightly report jobs run periodically with driver monitoring connections; two DBAs and two analysts open sessions on a business-hours curve.',
    'Wrong passwords, stale remembered passwords, retries, give-ups and service stale-secret bursts make failure runs of three or more followed by a success ordinary in both modes.',
    'Connection ids continue from a high counter, connectionCount follows every accept and end, each connection has its own uuid, and pools are already open when the capture starts.',
    'Byte form comes from the tagged formatter and log-site source; no raw 7.0 line of these ids was found, and the padding style is confirmed by a 4.4.4 fixture. Query shapes, durations, lock counts and driver versions are synthetic.',
    'TLS, replica-set, sharding, startup, writes, other errors and the Enterprise audit log are not modelled. At most one line per second, so event.created trails @timestamp by up to about 30 seconds during export bursts.',
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
        'Server time zone offset used in t.$date and for the hour-of-day curves, [+-]HH:MM',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'true adds episodes to background, false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours of source time, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'First wrong password of the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T03:30:11.577Z", "data_stream": {"dataset": "mongodb.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "event": {"category": ["database"], "created": "2026-09-21T03:30:17.584Z", "dataset": "mongodb.log", "ingested": "2026-09-21T03:30:18.784Z", "kind": "event", "module": "mongodb", "original": "{\"t\":{\"$date\":\"2026-09-21T03:30:11.577+00:00\"},\"s\":\"I\",  \"c\":\"ACCESS\",   \"id\":5286307, \"ctx\":\"conn52779\",\"msg\":\"Failed to authenticate\",\"attr\":{\"client\":\"10.30.1.22:61889\",\"isSpeculative\":true,\"isClusterMember\":false,\"mechanism\":\"SCRAM-SHA-256\",\"user\":\"dba_oleg\",\"db\":\"admin\",\"error\":\"AuthenticationFailed: SCRAM authentication failed, storedKey mismatch\",\"result\":18,\"metrics\":{\"conversation_duration\":{\"micros\":7400,\"summary\":[{\"step\":1,\"step_total\":2,\"duration_micros\":90},{\"step\":2,\"step_total\":2,\"duration_micros\":231}]}},\"doc\":{\"application\":{\"name\":\"mongosh 2.3.0\"},\"driver\":{\"name\":\"nodejs|mongosh\",\"version\":\"6.8.0|2.3.0\"},\"platform\":\"Node.js v20.16.0, LE\",\"os\":{\"name\":\"darwin\",\"architecture\":\"arm64\",\"version\":\"23.6.0\",\"type\":\"Darwin\"}},\"extraInfo\":{}}}", "type": ["access"]}, "host": {"name": "mongo-01.corp.example"}, "input": {"type": "logfile"}, "log": {"file": {"path": "/var/log/mongodb/mongod.log"}, "level": "I"}, "message": "Failed to authenticate", "mongodb": {"log": {"attr": {"client": "10.30.1.22:61889", "isSpeculative": true, "isClusterMember": false, "mechanism": "SCRAM-SHA-256", "user": "dba_oleg", "db": "admin", "error": "AuthenticationFailed: SCRAM authentication failed, storedKey mismatch", "result": 18, "metrics": {"conversation_duration": {"micros": 7400, "summary": [{"step": 1, "step_total": 2, "duration_micros": 90}, {"step": 2, "step_total": 2, "duration_micros": 231}]}}, "doc": {"application": {"name": "mongosh 2.3.0"}, "driver": {"name": "nodejs|mongosh", "version": "6.8.0|2.3.0"}, "platform": "Node.js v20.16.0, LE", "os": {"name": "darwin", "architecture": "arm64", "version": "23.6.0", "type": "Darwin"}}, "extraInfo": {}}, "component": "ACCESS", "context": "conn52779", "id": 5286307}}, "tags": ["preserve_original_event"]}`,
    },
  ],
};
