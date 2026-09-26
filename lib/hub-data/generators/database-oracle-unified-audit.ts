import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseOracleUnifiedAudit: GeneratorMeta = {
  slug: 'database-oracle-unified-audit',
  displayName: 'Oracle Database 19c Unified Audit Trail',
  category: 'database',
  dataSource: 'Oracle 19c UNIFIED_AUDIT_TRAIL view',
  description:
    '22-column JSON connector projection of Oracle 19c audit rows with routine SQL activity and recurring administrative episodes.',
  generatorId: 'oracle-unified-audit',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    '22 selected Standard audit row columns',
    'Session lifecycle and per-session entry counters',
    'Configurable recurring failed-login to role-grant episodes',
  ],
  anomalyChain:
    'Four failed logons precede a successful session, payroll read, role grant and logoff; episodes recur about every 12 hours by default.',
  eventTypes: [
    {
      id: 'LOGON',
      description: 'Successful application or administrator session start',
      frequency: 'Routine',
      category: 'authentication',
    },
    {
      id: 'LOGON 1017',
      description: 'Invalid username or password',
      frequency: 'Isolated in background; clustered in episodes',
      category: 'authentication',
    },
    {
      id: 'SELECT',
      description: 'Audited reporting, HR or payroll table read',
      frequency: 'Common routine activity',
      category: 'database',
    },
    {
      id: 'UPDATE',
      description: 'Audited HR employee update',
      frequency: 'Occasional routine activity',
      category: 'database',
    },
    {
      id: 'GRANT',
      description: 'Administrator grants an application role',
      frequency: 'Routine and episode activity',
      category: 'iam',
    },
    {
      id: 'LOGOFF',
      description: 'End of a successful session',
      frequency: 'Routine and episode activity',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Successful logons start sessions; SQL and logoff rows reuse their SESSIONID with advancing ENTRY_ID and STATEMENT_ID.',
    'Failed logons have separate session IDs, while the same administrator, client, table and role also occur in background.',
    'The JSON serialization is a declared connector projection; native Oracle 19c row fidelity awaits a matching capture.',
  ],
  format: ['JSON', 'Oracle SQL view projection'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring administrative episodes',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '250',
      description: 'Routine rows before the first episode',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '4320',
      description: 'Rows between episode starts, about 12 hours by default',
    },
    {
      name: 'database_id',
      defaultValue: '3459081234',
      description: 'Synthetic DBID',
    },
    {
      name: 'target_user',
      defaultValue: 'FINANCE_DBA',
      description: 'Administrator account in routine and episode activity',
    },
    {
      name: 'attacker_host',
      defaultValue: 'wkst-091.corp.example',
      description: 'Administrator client host in routine and episode activity',
    },
    {
      name: 'grantee',
      defaultValue: 'REPORT_USER',
      description: 'Recipient of the modeled application role grant',
    },
  ],
  sampleOutputs: [
    {
      title: 'Oracle Database 19c Unified Audit Trail row',
      json: String.raw`{"ACTION_NAME": "GRANT", "AUDIT_TYPE": "Standard", "CLIENT_PROGRAM_NAME": "sqlplus@wkst-091.corp.example (TNS V1-V3)", "CURRENT_USER": "FINANCE_DBA", "DBID": 3459081234, "DBUSERNAME": "FINANCE_DBA", "ENTRY_ID": 3, "EVENT_TIMESTAMP": "2026-09-26 00:42:40.000000", "EVENT_TIMESTAMP_UTC": "2026-09-26 00:42:40.000000", "INSTANCE_ID": 1, "OBJECT_NAME": null, "OBJECT_SCHEMA": null, "OS_USERNAME": "ops", "RETURN_CODE": 0, "ROLE": "PAYROLL_READ", "SESSIONID": 100049, "SQL_BINDS": null, "SQL_TEXT": "GRANT PAYROLL_READ TO REPORT_USER", "STATEMENT_ID": 3, "TARGET_USER": "REPORT_USER", "UNIFIED_AUDIT_POLICIES": "ORA_ACCOUNT_MGMT", "USERHOST": "wkst-091.corp.example"}`,
    },
  ],
};
