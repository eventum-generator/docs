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
    "About every 24 hours by default: the first episode starts at a uniformly random moment within the first anomaly_interval_hours after generation start (at most 24 h); each next one starts one interval after the actual start of the previous one, shifted by a uniformly random offset within a window of a quarter of the interval (at most 6 h) centred on that point, with no catch-up. A DBA logs in from a usual address, creates a login role, grants it SELECT on finance.payroll, logs in as that role from the same address, reads payroll one to four times, may log in again and revoke, then drops the role. The DBA and role name differ from the previous episode's; every step also occurs in ordinary traffic, and only the complete ordered sequence from one source IP within two hours is episode-only.",
  generatorId: 'cassandra',
  eventTypes: [
    {
      id: 'SELECT',
      description:
        'Reads by applications, analysts, temporary roles and DBA checks',
      frequency: '60.63% measured share',
      category: 'QUERY',
    },
    {
      id: 'UPDATE',
      description:
        'Applications and analysts; CQL INSERT is also logged as UPDATE',
      frequency: '21.43% measured share',
      category: 'DML',
    },
    {
      id: 'LOGIN_SUCCESS',
      description: 'Successful login on every connection',
      frequency: '5.68% measured share',
      category: 'AUTH',
    },
    {
      id: 'PREPARE_STATEMENT',
      description: 'Applications preparing statements after reconnecting',
      frequency: '4.18% measured share',
      category: 'PREPARE',
    },
    {
      id: 'USE_KEYSPACE',
      description: 'Drivers and some cqlsh sessions selecting a keyspace',
      frequency: '3.80% measured share',
      category: 'OTHER',
    },
    {
      id: 'DELETE',
      description: 'Deletes by billing_svc',
      frequency: '1.08% measured share',
      category: 'DML',
    },
    {
      id: 'LIST_ROLES',
      description: 'DBAs listing roles',
      frequency: '0.57% measured share',
      category: 'DCL',
    },
    {
      id: 'GRANT',
      description: 'DBAs granting permissions',
      frequency: '0.47% measured share',
      category: 'DCL',
    },
    {
      id: 'LIST_PERMISSIONS',
      description: 'DBAs listing permissions',
      frequency: '0.46% measured share',
      category: 'DCL',
    },
    {
      id: 'CREATE_ROLE',
      description: 'DBAs creating roles',
      frequency: '0.39% measured share',
      category: 'DCL',
    },
    {
      id: 'DROP_ROLE',
      description: 'DBAs dropping roles',
      frequency: '0.35% measured share',
      category: 'DCL',
    },
    {
      id: 'LOGIN_ERROR',
      description: 'Failed login after a mistyped password',
      frequency: '0.28% measured share',
      category: 'AUTH',
    },
    {
      id: 'ALTER_ROLE',
      description: 'DBA password rotation for service roles',
      frequency: '0.21% measured share',
      category: 'DCL',
    },
    {
      id: 'REVOKE',
      description: 'DBAs revoking permissions',
      frequency: '0.20% measured share',
      category: 'DCL',
    },
    {
      id: 'UNAUTHORIZED_ATTEMPT',
      description: 'Analysts reading finance.payroll; roles after a revoke',
      frequency: '0.15% measured share',
      category: 'AUTH',
    },
    {
      id: 'REQUEST_FAILURE',
      description: 'Queries against a misspelled table',
      frequency: '0.07% measured share',
      category: 'ERROR',
    },
    {
      id: 'ALTER_TABLE',
      description: 'DBAs altering tables',
      frequency: '0.05% measured share',
      category: 'DDL',
    },
  ],
  realismFeatures: [
    'Four application roles use prepared statements, four analysts and three DBAs use cqlsh, and DBAs create, grant, test, revoke and drop short-lived roles. Every actor runs its own random session process with log-normal gaps, occasional failed logins with retries or give-ups, and bursts of statements over one connection. The default capture holds 14,594 records in 144 hours; the mix is a synthetic training profile, not a measured production ratio.',
    'CQL INSERT is logged as UPDATE, role passwords appear as *******, and prepared-statement bound values are never logged, as in Cassandra. Every record runs on the Native-Transport-Requests pool, as on a node with the default native_transport_max_auth_threads: 0, and the host field uses the IP-only /10.20.30.10:7000 form; a node configured with a host name prints name/ip:port.',
    'In both modes DBAs create the same role names, grant finance.payroll or other tables, test most new roles from their own workstation, read payroll themselves, and revoke and drop roles, often within minutes of creating them: per day about 3-7 roles are dropped within 37 minutes of creation and about 3-4 connections of a new role read payroll from a DBA address. hr_portal, reporting_etl and hr_lead_mora read payroll all day. Ordinary administration leaves out a DROP ROLE only when it would complete the chain from the same source IP within two hours; the same drop later or from another address is written as usual. DBAs create fewer roles as the ten-name pool fills and always leave two names free.',
    'The line layout is derived from Cassandra source and the shipped logback audit appender pattern; no raw audit.log from a production 4.1 node was available for byte comparison. The clock is UTC and only one node is modelled. BATCH entries, TRUNCATE, keyspace and table DDL other than ALTER TABLE, and connection close are not generated. The default BinAuditLogger stores the same message in binary Chronicle Queue files. The ECS mapping is inferred; no Elastic integration exists for Cassandra audit logs.',
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
      json: String.raw`{"@timestamp": "2026-09-01T09:17:42.900Z", "cassandra": {"audit": {"category": "DCL", "host": "/10.20.30.10:7000", "operation": "GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "port": 42642, "source": "/10.20.10.5", "timestamp": 1788254262900, "type": "GRANT", "user": "ops_admin"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "grant", "category": ["iam"], "created": "2026-09-01T09:17:42.902Z", "kind": "event", "original": "INFO  [Native-Transport-Requests-5] 2026-09-01 09:17:42,902 FileAuditLogger.java:51 - user:ops_admin|host:/10.20.30.10:7000|source:/10.20.10.5|port:42642|timestamp:1788254262900|type:GRANT|category:DCL|operation:GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "outcome": "success", "type": ["user", "change"]}, "host": {"ip": ["10.20.30.10"], "name": "cassandra-01.example.test"}, "log": {"level": "INFO", "logger": "org.apache.cassandra.audit.FileAuditLogger", "origin": {"file": {"line": 51, "name": "FileAuditLogger.java"}}}, "message": "user:ops_admin|host:/10.20.30.10:7000|source:/10.20.10.5|port:42642|timestamp:1788254262900|type:GRANT|category:DCL|operation:GRANT SELECT ON TABLE finance.payroll TO migration_ro;", "process": {"thread": {"name": "Native-Transport-Requests-5"}}, "related": {"ip": ["10.20.10.5", "10.20.30.10"], "user": ["ops_admin", "migration_ro"]}, "source": {"ip": "10.20.10.5", "port": 42642}, "user": {"name": "ops_admin", "target": {"name": "migration_ro"}}}`,
    },
  ],
};
