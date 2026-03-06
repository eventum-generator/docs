import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMssqlAudit: GeneratorMeta = {
  slug: 'database-mssql-audit',
  displayName: 'Microsoft SQL Server Audit',
  category: 'database',
  description:
    'SQL Server Audit via Windows Event ID 33205 — login/logout lifecycle, DML queries (SELECT/INSERT/UPDATE/DELETE), stored procedure execution, schema changes (CREATE/ALTER/DROP), permission management (GRANT/DENY/REVOKE), role membership, backups, DBCC commands, and password changes.',
  format: ['JSON', 'ECS'],
  dataSource: 'SQL Server Audit (Windows Event Log)',
  eventCount: 14,
  templateCount: 14,
  highlights: [
    '5-host SQL Server fleet',
    'Session-correlated events',
    '14 audit action types',
    'Windows/SQL login mix',
  ],
  generatorId: 'mssql',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Read queries on tables and views',
      frequency: '~35%',
      category: 'database',
    },
    {
      id: 'LOGIN',
      description: 'Successful login (creates session)',
      frequency: '~15%',
      category: 'authentication',
    },
    {
      id: 'LOGOUT',
      description: 'Session logout (correlated)',
      frequency: '~14%',
      category: 'authentication',
    },
    {
      id: 'UPDATE',
      description: 'Update queries on tables',
      frequency: '~10%',
      category: 'database',
    },
    {
      id: 'INSERT',
      description: 'Insert queries on tables',
      frequency: '~8%',
      category: 'database',
    },
    {
      id: 'EXECUTE',
      description: 'Stored procedure and function execution',
      frequency: '~7%',
      category: 'database',
    },
    {
      id: 'DELETE',
      description: 'Delete queries on tables',
      frequency: '~3%',
      category: 'database',
    },
    {
      id: 'LOGIN_FAILED',
      description: 'Failed login attempts',
      frequency: '~2.5%',
      category: 'authentication',
    },
    {
      id: 'SCHEMA_CHANGE',
      description: 'CREATE/ALTER/DROP tables, indexes, procs',
      frequency: '~2.3%',
      category: 'configuration',
    },
    {
      id: 'BACKUP',
      description: 'Database backup operations',
      frequency: '~1.5%',
      category: 'database',
    },
    {
      id: 'PERMISSION',
      description: 'GRANT/DENY/REVOKE permissions',
      frequency: '~1%',
      category: 'iam',
    },
    {
      id: 'ROLE_MEMBER',
      description: 'Add/remove role membership',
      frequency: '~0.3%',
      category: 'iam',
    },
    {
      id: 'PASSWORD',
      description: 'Password change events',
      frequency: '~0.2%',
      category: 'iam',
    },
    {
      id: 'DBCC',
      description: 'DBCC maintenance commands',
      frequency: '~0.2%',
      category: 'database',
    },
  ],
  realismFeatures: [
    'Session-correlated events — login creates a session reused by DML/DDL events, logout removes it, ensuring consistent user/IP/app context',
    '5-host SQL Server fleet — production, reporting, staging, and dev instances with unique agent IDs and Windows Server OS metadata',
    '13 SQL and Windows logins — sa, application service accounts, Windows domain users (CONTOSO\\), and NT SERVICE accounts with weighted selection',
    '6 databases with hierarchical schema/table/view/proc objects matching enterprise patterns (SalesDB, WebPortalDB, HR, CRM, DWH)',
    'Parameterized T-SQL statements — SELECT/INSERT/UPDATE/DELETE with @P1 parameters, schema-qualified object names',
    'Mixed authentication — SQL logins and Windows domain logins with proper user.domain extraction',
    'Failed logins with error XML — error codes 18456, states 2/5/7/8 in additional_information XML',
  ],
  parameters: [
    {
      name: 'domain',
      defaultValue: 'CONTOSO',
      description: 'Windows domain name for domain logins',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Winlogbeat agent version string',
    },
  ],
  sampleOutputs: [
    {
      title: 'Login Succeeded',
      json: `{
    "@timestamp": "2026-03-06T14:22:31.456789+00:00",
    "event": {
        "action": "login-succeeded",
        "category": ["database", "authentication"],
        "code": "33205",
        "dataset": "microsoft_sqlserver.audit",
        "kind": "event",
        "module": "microsoft_sqlserver",
        "outcome": "success",
        "type": ["connection", "start"]
    },
    "sqlserver": {
        "audit": {
            "action_id": "LGIS",
            "class_type": "LX",
            "database_name": "master",
            "server_instance_name": "SQLPROD01\\\\MSSQLSERVER",
            "server_principal_name": "api_service",
            "session_id": 52,
            "succeeded": 1
        }
    },
    "user": { "name": "api_service" },
    "source": { "ip": "192.168.12.45", "port": 52134 },
    "winlog": { "channel": "Security", "event_id": "33205" }
}`,
    },
    {
      title: 'SELECT Query',
      json: `{
    "@timestamp": "2026-03-06T14:22:33.789012+00:00",
    "event": {
        "action": "database-select",
        "category": ["database"],
        "code": "33205",
        "dataset": "microsoft_sqlserver.audit",
        "kind": "event",
        "module": "microsoft_sqlserver",
        "outcome": "success",
        "type": ["access"]
    },
    "sqlserver": {
        "audit": {
            "action_id": "SL",
            "class_type": "U",
            "database_name": "SalesDB",
            "object_name": "Orders",
            "schema_name": "dbo",
            "server_principal_name": "api_service",
            "statement": "SELECT [Id], [CustomerName], [Total] FROM [dbo].[Orders] WHERE [Status] = @P1",
            "succeeded": 1
        }
    },
    "user": { "name": "api_service" },
    "source": { "ip": "192.168.12.45", "port": 52134 },
    "winlog": { "channel": "Security", "event_id": "33205" }
}`,
    },
  ],
};
