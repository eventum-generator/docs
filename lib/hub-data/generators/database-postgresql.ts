import type { GeneratorMeta } from '@/lib/hub-types';

export const databasePostgresql: GeneratorMeta = {
  slug: 'database-postgresql',
  displayName: 'PostgreSQL Audit Logs',
  category: 'database',
  description:
    'PostgreSQL with pgAudit — SELECT/INSERT/UPDATE/DELETE queries with parameterized statements, connection lifecycle, authentication failures, DDL operations, role management (GRANT/REVOKE), and database errors (deadlocks, constraint violations).',
  format: ['JSON', 'ECS'],
  dataSource: 'PostgreSQL CSV logs + pgAudit',
  eventCount: 10,
  templateCount: 10,
  highlights: [
    '6-host cluster',
    'Correlated connections',
    'pgAudit format',
    '24 tables with weights',
  ],
  generatorId: 'postgresql',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Read queries (pgaudit READ)',
      frequency: '~45%',
      category: 'database',
    },
    {
      id: 'INSERT',
      description: 'Insert queries (pgaudit WRITE)',
      frequency: '~15%',
      category: 'database',
    },
    {
      id: 'UPDATE',
      description: 'Update queries (pgaudit WRITE)',
      frequency: '~10%',
      category: 'database',
    },
    {
      id: 'DELETE',
      description: 'Delete queries (pgaudit WRITE)',
      frequency: '~3%',
      category: 'database',
    },
    {
      id: 'Connection',
      description: 'Connection authorized',
      frequency: '~10%',
      category: 'network',
    },
    {
      id: 'Disconnection',
      description: 'Session disconnection (correlated)',
      frequency: '~8%',
      category: 'network',
    },
    {
      id: 'AuthFailure',
      description: 'Authentication failures',
      frequency: '~2%',
      category: 'authentication',
    },
    {
      id: 'DDL',
      description: 'CREATE/ALTER/DROP, VACUUM, ANALYZE',
      frequency: '~3%',
      category: 'database',
    },
    {
      id: 'Role',
      description: 'GRANT/REVOKE, CREATE/ALTER/DROP ROLE',
      frequency: '~2%',
      category: 'iam',
    },
    {
      id: 'Error',
      description: 'Deadlocks, constraint violations, timeouts',
      frequency: '~2%',
      category: 'database',
    },
  ],
  realismFeatures: [
    'Correlated connections — connection events create entries consumed by disconnection events with matching user/db/pid',
    '6-host cluster — primary, replicas, analytics, staging, dev servers with unique agent IDs and OS metadata',
    '15 database users — superuser, application, readonly, admin, developer roles with matching application names',
    '24 tables across 8 database/schema combinations with weighted access patterns',
    'Parameterized queries — prepared statement parameters ($1, $2, ...) matching pgAudit format',
    'Authentication failures — password denials, pg_hba.conf mismatches, nonexistent roles from public IPs',
    'Database errors — deadlocks, duplicate keys, FK violations, lock timeouts, query cancellations',
  ],
  parameters: [
    {
      name: 'cluster_name',
      defaultValue: 'pg-prod-cluster',
      description: 'PostgreSQL cluster name',
    },
    {
      name: 'pg_version',
      defaultValue: '16.4',
      description: 'PostgreSQL version string',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Filebeat version string',
    },
  ],
  sampleOutputs: [
    {
      title: 'SELECT — Read Query',
      json: `{
    "@timestamp": "2026-03-04T10:15:42.123456+00:00",
    "event": {
        "action": "SELECT",
        "category": ["database"],
        "dataset": "postgresql.log",
        "duration": 3245000,
        "module": "postgresql",
        "outcome": "success",
        "type": ["access"]
    },
    "message": "AUDIT: SESSION,42,1,READ,SELECT,,,SELECT id, email, name FROM public.users WHERE id = $1,{1042}",
    "postgresql": {
        "log": {
            "database": "app_production",
            "query": "SELECT id, email, name FROM public.users WHERE id = $1",
            "query_name": "SELECT"
        }
    },
    "user": { "name": "app_backend" },
    "source": { "ip": "10.1.3.22", "port": 45321 },
    "service": { "type": "postgresql" }
}`,
    },
  ],
};
