/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseApacheCassandraAudit: GeneratorMeta = {
  slug: 'database-apache-cassandra-audit',
  displayName: 'Apache Cassandra Audit Log',
  category: 'database',
  description:
    'Apache Cassandra 4.1 FileAuditLogger records from one node for SIEM engineers who build database access and role-management detections, as ECS JSON with the raw log line in event.original and the pipe-delimited audit entry in message. About 38,000 records a day from applications, analysts, DBAs and DBA-created roles on UTC working hours. Recurring episodes show a DBA account creating a short-lived role that reads finance.payroll and is then dropped.',
  dataSource:
    'Apache Cassandra 4.1 FileAuditLogger, audit/audit.log in the shipped logback audit appender pattern',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 17,
  templateCount: 1,
  highlights: [
    'Native FileAuditLogger line in event.original',
    'Applications, analysts, DBAs and short-lived roles on UTC working hours',
    'Recurring temporary-role payroll read chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "A DBA logs in from the admin bastion 10.20.10.5, creates a login role, grants it SELECT on finance.payroll, and about 1.5 minutes later that role logs in from the same address and reads payroll one to three times; a new DBA connection from the bastion, usually 4-25 minutes later, optionally revokes the grant (40% of episodes) and drops the role. From CREATE_ROLE to DROP_ROLE an episode usually takes 4-50 minutes, always within two hours. anomaly_interval_hours (default 24, minimum 6) sets the spacing: the first episode starts within the first interval (at most 24 h); each next one starts one interval after the actual start of the previous one, shifted within a window of a quarter of the interval (at most 6 h) centred on that point, with no catch-up. Start hours follow the DBAs' working hours, so at the default interval episodes start between 08:00 and 17:00 UTC; short intervals also reach the evening and night. When all role names are in use at the chosen time, the episode starts as soon as one is free, which can rarely put it past its window at short intervals. The DBA differs from the previous episode's, and the role is one of the four scratch names DBAs create and test from the bastion several times a day; every step also occurs in ordinary traffic, and only the complete ordered sequence from one address within two hours is episode-only. With anomaly_mode: true each episode adds its own records, so counts of the chain parts are about one per episode higher.",
  generatorId: 'cassandra',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Applications, analysts, DBA-created roles, DBA checks',
      frequency: '68.42% of records',
      category: 'QUERY',
    },
    {
      id: 'UPDATE',
      description:
        'Applications and analysts (CQL INSERT is also logged as UPDATE)',
      frequency: '26.33% of records',
      category: 'DML',
    },
    {
      id: 'DELETE',
      description: 'billing_svc',
      frequency: '1.39% of records',
      category: 'DML',
    },
    {
      id: 'LOGIN_SUCCESS',
      description: 'Every connection',
      frequency: '1.22% of records',
      category: 'AUTH',
    },
    {
      id: 'PREPARE_STATEMENT',
      description: 'Applications after reconnecting',
      frequency: '1.09% of records',
      category: 'PREPARE',
    },
    {
      id: 'USE_KEYSPACE',
      description: 'Drivers (USE "finance") and some cqlsh sessions',
      frequency: '0.93% of records',
      category: 'OTHER',
    },
    {
      id: 'LIST_PERMISSIONS',
      description:
        'DBAs, often before logging in as a role to check its access',
      frequency: '0.15% of records',
      category: 'DCL',
    },
    {
      id: 'LIST_ROLES',
      description: 'DBAs',
      frequency: '0.15% of records',
      category: 'DCL',
    },
    {
      id: 'GRANT',
      description: 'DBAs',
      frequency: '0.08% of records',
      category: 'DCL',
    },
    {
      id: 'CREATE_ROLE',
      description: 'DBAs',
      frequency: '0.05% of records',
      category: 'DCL',
    },
    {
      id: 'DROP_ROLE',
      description: 'DBAs',
      frequency: '0.05% of records',
      category: 'DCL',
    },
    {
      id: 'ALTER_ROLE',
      description: 'DBA password rotation for service roles',
      frequency: '0.03% of records',
      category: 'DCL',
    },
    {
      id: 'REVOKE',
      description: 'DBAs',
      frequency: '0.03% of records',
      category: 'DCL',
    },
    {
      id: 'ALTER_TABLE',
      description: 'DBAs',
      frequency: '0.02% of records',
      category: 'DDL',
    },
    {
      id: 'UNAUTHORIZED_ATTEMPT',
      description: 'Analysts reading finance.payroll, roles after a revoke',
      frequency: '0.02% of records',
      category: 'AUTH',
    },
    {
      id: 'LOGIN_ERROR',
      description: 'Mistyped passwords',
      frequency: '0.02% of records',
      category: 'AUTH',
    },
    {
      id: 'REQUEST_FAILURE',
      description: 'Queries against a misspelled table',
      frequency: '0.01% of records',
      category: 'ERROR',
    },
  ],
  realismFeatures: [
    'Four application roles on pooled driver connections log round the clock (0.25 records/s at night, up to 0.65/s from 08:00 to 18:00 UTC) and reconnect about every 40 minutes with a login, USE "finance" and re-prepared statements. Analysts open about 21 cqlsh sessions a day and DBAs about 47, nearly all between 08:00 and 17:00 UTC, and DBA-created roles are used from reporting hosts about 23 times a day. The mix is a synthetic training profile, not a measured production ratio.',
    'About 6% of logins by people and 2-4% by reporting roles fail with a wrong password, followed by a retry or a give-up; one failure in a row is more common than two. Applications fail about 0.3% of reconnects.',
    'CQL INSERT is logged as UPDATE, role passwords appear as *******, and prepared-statement bound values are never logged, as in Cassandra. All records run on the Native-Transport-Requests pool, as on a node with the default native_transport_max_auth_threads: 0, and the host field uses the IP-only /10.20.30.10:7000 form.',
    'At most eight of the ten role names exist at a time; usually one to three of the four scratch roles exist, and a role that takes the last free scratch name or brings the roles in use to eight is dropped again within an hour or so, often by another DBA. With anomaly_mode: true the number of scratch roles that exist at once is one higher for the length of an episode.',
    'In both modes DBAs create the same role names, grant finance.payroll or other tables, test new roles from their own host, read payroll themselves, and revoke and drop roles: per day about 5-7 roles are dropped within two hours of creation and about 8-10 new roles read payroll from a DBA host. hr_portal, reporting_etl and hr_lead_mora read payroll all day.',
    "Records a real node writes within milliseconds of each other (a driver's login, USE and re-prepared statements) are seconds apart: a median of 2 s by day and 5-6 s at night, 99% within about 30 s. The line layout is derived from Cassandra source and the shipped logback audit appender pattern; no raw audit.log from a production 4.1 node was available for byte comparison. The clock is UTC with no weekends, and one node is modelled. BATCH entries, TRUNCATE, keyspace and table DDL other than ALTER TABLE, and connection close are not generated. The ECS mapping is inferred; no Elastic integration exists for Cassandra audit logs.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Generate the recurring temporary-role payroll chain; false emits only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episode due times, from the previous actual start; 6 to 8,760',
    },
    {
      name: 'host_name',
      defaultValue: 'cassandra-01.example.test',
      description: 'Node name in host.name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.20.30.10',
      description: 'Node broadcast address in the host audit field',
    },
  ],
  sampleOutputs: [
    {
      title: 'GRANT step of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T14:45:54.889Z", "cassandra": {"audit": {"category": "DCL", "host": "/10.20.30.10:7000", "keyspace": "finance", "operation": "GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "port": 54667, "source": "/10.20.10.5", "timestamp": 1788273954889, "type": "GRANT", "user": "ops_admin"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "grant", "category": ["iam"], "created": "2026-09-01T14:45:54.889Z", "kind": "event", "original": "INFO  [Native-Transport-Requests-7] 2026-09-01 14:45:54,889 FileAuditLogger.java:51 - user:ops_admin|host:/10.20.30.10:7000|source:/10.20.10.5|port:54667|timestamp:1788273954889|type:GRANT|category:DCL|ks:finance|operation:GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "outcome": "success", "type": ["user", "change"]}, "host": {"ip": ["10.20.30.10"], "name": "cassandra-01.example.test"}, "log": {"level": "INFO", "logger": "org.apache.cassandra.audit.FileAuditLogger", "origin": {"file": {"line": 51, "name": "FileAuditLogger.java"}}}, "message": "user:ops_admin|host:/10.20.30.10:7000|source:/10.20.10.5|port:54667|timestamp:1788273954889|type:GRANT|category:DCL|ks:finance|operation:GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "process": {"thread": {"name": "Native-Transport-Requests-7"}}, "related": {"ip": ["10.20.10.5", "10.20.30.10"], "user": ["ops_admin", "migration_ro"]}, "source": {"ip": "10.20.10.5", "port": 54667}, "user": {"name": "ops_admin", "target": {"name": "migration_ro"}}}`,
    },
  ],
};
