import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMysqlAudit: GeneratorMeta = {
  slug: 'database-mysql-audit',
  displayName: 'MySQL Audit',
  category: 'database',
  description:
    'MySQL Enterprise Audit Plugin events (ECS-compatible JSON) covering all four audit classes — connection, general, table_access, and audit. Generates connect/disconnect lifecycle, DML queries (SELECT/INSERT/UPDATE/DELETE), table access tracking, DDL schema changes, GRANT/REVOKE privileges, admin commands, query errors, and failed authentication attempts with realistic query statistics.',
  format: ['JSON', 'ECS'],
  dataSource: 'MySQL Enterprise Audit Plugin (JSON format)',
  eventCount: 13,
  templateCount: 13,
  highlights: [
    '5-host MySQL fleet (prod, staging, reporting, dev)',
    'Session-correlated events with monotonic counters',
    '13 event types across 4 audit classes',
    'Realistic query statistics (bytes, rows, timing)',
  ],
  generatorId: 'mysql',
  eventTypes: [
    {
      id: 'query-select',
      description: 'SELECT queries on tables and views',
      frequency: '~30.0%',
      category: 'database',
    },
    {
      id: 'connect',
      description: 'Successful client connections',
      frequency: '~13.5%',
      category: 'authentication',
    },
    {
      id: 'disconnect',
      description: 'Client disconnections',
      frequency: '~12.7%',
      category: 'authentication',
    },
    {
      id: 'query-update',
      description: 'UPDATE statements',
      frequency: '~11.3%',
      category: 'database',
    },
    {
      id: 'query-insert',
      description: 'INSERT statements',
      frequency: '~7.6%',
      category: 'database',
    },
    {
      id: 'table-access-read',
      description: 'Table read access events',
      frequency: '~7.5%',
      category: 'database',
    },
    {
      id: 'table-access-write',
      description: 'Table write access (insert/update/delete)',
      frequency: '~4.4%',
      category: 'database',
    },
    {
      id: 'query-admin',
      description: 'Admin commands (SHOW, FLUSH, OPTIMIZE)',
      frequency: '~4.2%',
      category: 'database',
    },
    {
      id: 'connect-failure',
      description: 'Failed authentication attempts',
      frequency: '~2.8%',
      category: 'authentication',
    },
    {
      id: 'query-error',
      description: 'Failed queries (syntax, permission, deadlock)',
      frequency: '~1.7%',
      category: 'database',
    },
    {
      id: 'query-delete',
      description: 'DELETE statements',
      frequency: '~2.3%',
      category: 'database',
    },
    {
      id: 'query-ddl',
      description: 'DDL: CREATE, ALTER, DROP (tables, indexes, views)',
      frequency: '~1.2%',
      category: 'configuration',
    },
    {
      id: 'query-grant',
      description: 'GRANT/REVOKE privilege changes',
      frequency: '~0.8%',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Session-correlated events — connect creates a session reused by query/table_access templates, disconnect pops it, ensuring consistent user/IP/connection context',
    '5-host MySQL fleet — production pair, staging, reporting, and dev instances with unique agent IDs, IPs, and MySQL server IDs',
    '12 MySQL users — root, application service accounts (app_service, web_api, etl_loader), reporting, admin (jsmith, mchen), dev, backup, monitoring, and replication users with weighted selection',
    'Parameterized SQL statements — schema-qualified queries with realistic WHERE clauses and parameterized values across multiple databases',
    'Query statistics — bytes_received, bytes_sent, query_time, rows_examined, rows_sent for every general-class event',
    'Monotonic counters — per-host event IDs and connection IDs increment across all templates',
    'Failed authentication with error codes — incorrect passwords, unknown users, and host-blocked connection failures',
  ],
  parameters: [
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Filebeat/Elastic Agent version string',
    },
  ],
  sampleOutputs: [
    {
      title: 'SELECT Query',
      json: `{
    "@timestamp": "2026-03-06T14:22:31.456789+00:00",
    "agent": {
        "id": "b3c4d5e6-f7a8-9012-bcde-f01234567891",
        "name": "mysql-prod-01",
        "type": "filebeat",
        "version": "8.17.0"
    },
    "client": {
        "domain": "app-server-01",
        "ip": "192.168.1.50",
        "port": 45678
    },
    "data_stream": {
        "dataset": "mysql_enterprise.audit",
        "namespace": "default",
        "type": "logs"
    },
    "event": {
        "action": "mysql-query",
        "category": ["database"],
        "dataset": "mysql_enterprise.audit",
        "kind": "event",
        "module": "mysql_enterprise",
        "outcome": "success",
        "type": ["access"]
    },
    "mysqlenterprise": {
        "audit": {
            "account": { "host": "app-server-01", "user": "app_service" },
            "class": "general",
            "connection_id": "142",
            "general_data": {
                "command": "Query",
                "query": "SELECT * FROM \`ecommerce\`.\`orders\` WHERE \`id\` = ?",
                "sql_command": "select",
                "status": 0
            },
            "id": "1042",
            "login": { "ip": "192.168.1.50", "user": "app_service" },
            "query_statistics": {
                "bytes_received": 78,
                "bytes_sent": 4521,
                "query_time": 0.001234,
                "rows_examined": 1,
                "rows_sent": 1
            }
        }
    },
    "user": { "name": "app_service" }
}`,
    },
    {
      title: 'Connection Success',
      json: `{
    "@timestamp": "2026-03-06T14:22:29.123456+00:00",
    "agent": {
        "id": "b3c4d5e6-f7a8-9012-bcde-f01234567891",
        "name": "mysql-prod-01",
        "type": "filebeat",
        "version": "8.17.0"
    },
    "client": {
        "domain": "app-server-01",
        "ip": "192.168.1.50",
        "port": 45678
    },
    "data_stream": {
        "dataset": "mysql_enterprise.audit",
        "namespace": "default",
        "type": "logs"
    },
    "event": {
        "action": "mysql-connect",
        "category": ["database", "authentication"],
        "dataset": "mysql_enterprise.audit",
        "kind": "event",
        "module": "mysql_enterprise",
        "outcome": "success",
        "type": ["connection", "start"]
    },
    "mysqlenterprise": {
        "audit": {
            "account": { "host": "app-server-01", "user": "app_service" },
            "class": "connection",
            "connection_id": "142",
            "connection_data": {
                "connection_type": "SSL/TLS",
                "db": "ecommerce",
                "status": 0
            },
            "id": "1040",
            "login": { "ip": "192.168.1.50", "user": "app_service" }
        }
    },
    "user": { "name": "app_service" }
}`,
    },
  ],
};
