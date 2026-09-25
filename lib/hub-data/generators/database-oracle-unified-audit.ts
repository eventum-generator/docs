import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseOracleUnifiedAudit: GeneratorMeta = {
  slug: 'database-oracle-unified-audit',
  displayName: 'Oracle Database Unified Audit Trail',
  category: 'database',
  dataSource: 'Oracle UNIFIED_AUDIT_TRAIL SQL rows',
  description:
    'Standard audit rows with a switchable failed-login, sensitive-read and DBA-grant sequence.',
  generatorId: 'oracle-unified-audit',
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native Oracle view column names',
    'Failed logons to privileged grant in one client context',
    '22 selected Standard-row columns',
  ],
  anomalyChain:
    'Four ORA-01017 logon failures are followed by a successful session, a FINANCE.PAYROLL read and a DBA role grant.',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Audited table read',
      frequency: '78% baseline',
      category: 'database',
    },
    {
      id: 'LOGON',
      description: 'Successful logon',
      frequency: '18% baseline',
      category: 'authentication',
    },
    {
      id: 'UPDATE',
      description: 'Audited data update',
      frequency: '4% baseline',
      category: 'database',
    },
    {
      id: 'LOGON 1017',
      description: 'Failed logon',
      frequency: 'Chain only',
      category: 'authentication',
    },
    {
      id: 'GRANT',
      description: 'DBA role grant',
      frequency: 'Chain only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Failed attempts use separate session IDs; post-login actions reuse the successful one.',
    'Action, return code, client identity, SQL text and grant fields use Oracle view column names.',
    'Feature-specific Database Vault, XS, RMAN and Data Pump columns are outside this Standard-row scope.',
  ],
  format: ['JSON', 'Oracle SQL row'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include correlated failed-login to grant chain',
    },
    {
      name: 'database_id',
      defaultValue: '3459081234',
      description: 'Synthetic DBID',
    },
    {
      name: 'target_user',
      defaultValue: 'FINANCE_DBA',
      description: 'Account in the chain',
    },
    {
      name: 'attacker_host',
      defaultValue: 'wkst-091.corp.example',
      description: 'Client host in the chain',
    },
    {
      name: 'grantee',
      defaultValue: 'REPORT_RO',
      description: 'DBA role recipient',
    },
  ],
  sampleOutputs: [
    {
      title: 'Oracle Database Unified Audit Trail event',
      json: String.raw`{
  "ACTION_NAME": "GRANT",
  "AUDIT_TYPE": "Standard",
  "CLIENT_PROGRAM_NAME": "sqlplus",
  "CURRENT_USER": "FINANCE_DBA",
  "DBID": 3459081234,
  "DBUSERNAME": "FINANCE_DBA",
  "ENTRY_ID": 3,
  "EVENT_TIMESTAMP": "2026-09-25T12:20:07+00:00",
  "EVENT_TIMESTAMP_UTC": "2026-09-25T12:20:07+00:00",
  "INSTANCE_ID": 1,
  "OBJECT_NAME": null,
  "OBJECT_SCHEMA": null,
  "OS_USERNAME": "oracle-client",
  "RETURN_CODE": 0,
  "ROLE": "DBA",
  "SESSIONID": 262335,
  "SQL_BINDS": null,
  "SQL_TEXT": "GRANT DBA TO REPORT_RO",
  "STATEMENT_ID": 9067,
  "TARGET_USER": "REPORT_RO",
  "UNIFIED_AUDIT_POLICIES": "APP_ACCESS_AUDIT",
  "USERHOST": "wkst-091.corp.example"
}`,
    },
  ],
};
