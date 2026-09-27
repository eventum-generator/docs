/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseApacheCassandraAudit: GeneratorMeta = {
  slug: 'database-apache-cassandra-audit',
  displayName: 'Apache Cassandra Audit Log',
  category: 'database',
  description:
    'Apache Cassandra 4.1 FileAuditLogger records from one node for SIEM engineers who build database access and role-management detections, as ECS JSON with the raw log line in event.original and the pipe-delimited audit entry in message. Recurring episodes show a DBA account creating a throwaway role that reads finance.payroll and is then dropped.',
  dataSource:
    'Apache Cassandra 4.1 FileAuditLogger, audit/audit.log in the shipped logback audit appender pattern',
  format: ['JSON', 'ECS'],
  eventCount: 17,
  templateCount: 1,
  highlights: [
    'Native FileAuditLogger line in event.original',
    'Independent sessions of 11 actors and short-lived roles',
    'Recurring temporary-role payroll read chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode is due one interval after generation start, each next one interval after the previous actual start, with no catch-up; each start is delayed by an exponential random delay with a 20-minute mean), a DBA logs in from a usual address, creates a login role, grants it SELECT on finance.payroll, logs in as that role from the same address, reads payroll one to four times, may re-login and may revoke, then drops the role; measured episodes span 575-1047 s. The DBA and role name rotate; every step also occurs in ordinary traffic, and only the complete ordered sequence within two hours is episode-only.',
  generatorId: 'cassandra',
  eventTypes: [
    {
      id: 'SELECT',
      description:
        'Reads by applications, analysts, temporary roles and DBA checks',
      frequency: '58.25% measured share',
      category: 'QUERY',
    },
    {
      id: 'UPDATE',
      description:
        'Applications and analysts; CQL INSERT is also logged as UPDATE',
      frequency: '23.93% measured share',
      category: 'DML',
    },
    {
      id: 'LOGIN_SUCCESS',
      description: 'Successful login on every connection',
      frequency: '5.17% measured share',
      category: 'AUTH',
    },
    {
      id: 'PREPARE_STATEMENT',
      description: 'Applications preparing statements after reconnecting',
      frequency: '4.25% measured share',
      category: 'PREPARE',
    },
    {
      id: 'USE_KEYSPACE',
      description: 'Drivers and some cqlsh sessions selecting a keyspace',
      frequency: '3.89% measured share',
      category: 'OTHER',
    },
    {
      id: 'DELETE',
      description: 'Deletes by billing_svc',
      frequency: '1.48% measured share',
      category: 'DML',
    },
    {
      id: 'LIST_PERMISSIONS',
      description: 'DBAs listing permissions',
      frequency: '0.64% measured share',
      category: 'DCL',
    },
    {
      id: 'LIST_ROLES',
      description: 'DBAs listing roles',
      frequency: '0.62% measured share',
      category: 'DCL',
    },
    {
      id: 'CREATE_ROLE',
      description: 'DBAs creating roles',
      frequency: '0.28% measured share',
      category: 'DCL',
    },
    {
      id: 'GRANT',
      description: 'DBAs granting permissions',
      frequency: '0.28% measured share',
      category: 'DCL',
    },
    {
      id: 'ALTER_ROLE',
      description: 'DBA password rotation for service roles',
      frequency: '0.26% measured share',
      category: 'DCL',
    },
    {
      id: 'DROP_ROLE',
      description: 'DBAs dropping roles',
      frequency: '0.26% measured share',
      category: 'DCL',
    },
    {
      id: 'ALTER_TABLE',
      description: 'DBAs altering tables',
      frequency: '0.24% measured share',
      category: 'DDL',
    },
    {
      id: 'LOGIN_ERROR',
      description: 'Failed login after a mistyped password',
      frequency: '0.20% measured share',
      category: 'AUTH',
    },
    {
      id: 'REVOKE',
      description: 'DBAs revoking permissions',
      frequency: '0.10% measured share',
      category: 'DCL',
    },
    {
      id: 'REQUEST_FAILURE',
      description: 'Query against a misspelled table',
      frequency: '0.08% measured share',
      category: 'ERROR',
    },
    {
      id: 'UNAUTHORIZED_ATTEMPT',
      description: 'Analysts reading finance.payroll; roles after a revoke',
      frequency: '0.06% measured share',
      category: 'AUTH',
    },
  ],
  realismFeatures: [
    'Four application roles use prepared statements, four analysts and three DBAs use cqlsh, and DBAs create, grant, test, revoke and drop short-lived roles. Every actor runs its own random session process with log-normal gaps, occasional failed logins with retries or give-ups, and bursts of statements over one connection. The default capture holds 4,989 records in 52 hours; the mix is a synthetic training profile, not a measured production ratio.',
    'CQL INSERT is logged as UPDATE, role passwords appear as *******, and prepared-statement bound values are never logged, as in Cassandra. Every record runs on the Native-Transport-Requests pool, as on a node with the default native_transport_max_auth_threads: 0, and the host field uses the IP-only /10.20.30.10:7000 form; a node configured with a host name prints name/ip:port.',
    'DBAs create the same role names, grant finance.payroll or other tables, test new roles from their own workstation, read payroll themselves, and revoke and drop roles, sometimes within minutes of creating them; hr_portal, reporting_etl and hr_lead_mora read payroll all day. Only the complete ordered sequence within two hours is episode-only: a role that has read payroll is never dropped by ordinary administration in its first 3 hours.',
    'The line layout is derived from Cassandra source and the shipped logback audit appender pattern; no raw audit.log from a production 4.1 node was available for byte comparison. The clock is UTC and only one node is modelled. BATCH entries, TRUNCATE, keyspace and table DDL other than ALTER TABLE, and connection close are not generated. The ECS mapping is inferred; no Elastic integration exists for Cassandra audit logs.',
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
      title: 'GRANT step of the first episode',
      json: String.raw`{"@timestamp": "2026-09-02T00:14:30.049Z", "cassandra": {"audit": {"category": "DCL", "host": "/10.20.30.10:7000", "operation": "GRANT SELECT ON TABLE finance.payroll TO svc_backfill;", "port": 42919, "source": "/10.20.10.5", "timestamp": 1788308070049, "type": "GRANT", "user": "dba_okafor"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "grant", "category": ["iam"], "created": "2026-09-02T00:14:30.050Z", "kind": "event", "original": "INFO  [Native-Transport-Requests-4] 2026-09-02 00:14:30,050 FileAuditLogger.java:51 - user:dba_okafor|host:/10.20.30.10:7000|source:/10.20.10.5|port:42919|timestamp:1788308070049|type:GRANT|category:DCL|operation:GRANT SELECT ON TABLE finance.payroll TO svc_backfill;", "outcome": "success", "type": ["user", "change"]}, "host": {"ip": ["10.20.30.10"], "name": "cassandra-01.example.test"}, "log": {"level": "INFO", "logger": "org.apache.cassandra.audit.FileAuditLogger", "origin": {"file": {"line": 51, "name": "FileAuditLogger.java"}}}, "message": "user:dba_okafor|host:/10.20.30.10:7000|source:/10.20.10.5|port:42919|timestamp:1788308070049|type:GRANT|category:DCL|operation:GRANT SELECT ON TABLE finance.payroll TO svc_backfill;", "process": {"thread": {"name": "Native-Transport-Requests-4"}}, "related": {"ip": ["10.20.10.5", "10.20.30.10"], "user": ["dba_okafor", "svc_backfill"]}, "source": {"ip": "10.20.10.5", "port": 42919}, "user": {"name": "dba_okafor", "target": {"name": "svc_backfill"}}}`,
    },
  ],
};
