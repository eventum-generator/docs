import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseOracleUnifiedAudit: GeneratorMeta = {
  slug: 'database-oracle-unified-audit',
  displayName: 'Oracle Database 19c Unified Audit Trail',
  category: 'database',
  description:
    'JSON rows from a defined 22-column projection of the Oracle Database 19c UNIFIED_AUDIT_TRAIL view, as a connector polling that view would deliver them, for SIEM content that correlates database logons, sensitive reads and privilege changes. Not Oracle syslog output or a native Oracle JSON export. Application pools, analysts and administrators run independent sessions; recurring episodes show a guessed administrator password followed by a payroll read and a payroll role grant to an analyst.',
  dataSource:
    'Oracle Database 19c UNIFIED_AUDIT_TRAIL view, 22-column projection read by a polling connector',
  format: ['JSON'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    '22/22 columns of a declared UNIFIED_AUDIT_TRAIL projection',
    'Independent sessions of 41 pools, 5 analysts and 4 administrators',
    'Recurring guessed-password, payroll-read and role-grant chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first one within the first min(interval, 24 h) of generation, at a time drawn from the administrator activity curve; each next one due one interval after the previous actual start, with no catch-up, and started in a window of min(interval / 4, 6 h) centred on the due time (measured gaps 23.57-26.66 h at the default); a wait for an eligible grantee delays that start and, through it, the next due time), one administrator fails 3 to 8 logons with ORA-01017 from one usual host, logs on, reads FINANCE.PAYROLL one to three times, grants PAYROLL_READ to an analyst and logs off (measured 88-526 s from the first failure to the grant at the default). In half of the episodes the same account and host revoke the role in a later follow-up session; otherwise it becomes an ordinary held grant. The administrator/host pair and the grantee differ from the previous episode; every element also occurs in background, and only the complete ordered sequence is episode-only.',
  generatorId: 'oracle-audit',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Reporting, HR and payroll table reads (APP_DATA_AUDIT)',
      frequency: '76.69% measured share, default capture',
      category: 'database access',
    },
    {
      id: 'UPDATE',
      description: 'HR employee phone updates (APP_DATA_AUDIT)',
      frequency: '11.20% measured share, default capture',
      category: 'database change',
    },
    {
      id: 'LOGON',
      description: 'Successful session start (APP_SESSION_AUDIT)',
      frequency: '5.72% measured share, default capture',
      category: 'authentication',
    },
    {
      id: 'LOGOFF',
      description: 'Session end (APP_SESSION_AUDIT)',
      frequency: '5.72% measured share, default capture',
      category: 'authentication',
    },
    {
      id: 'LOGON 1017',
      description: 'Invalid username/password, ORA-01017 (ORA_LOGON_FAILURES)',
      frequency: '0.26% measured share, default capture',
      category: 'authentication',
    },
    {
      id: 'REVOKE',
      description:
        'Administrator revokes an application role (ORA_ACCOUNT_MGMT)',
      frequency: '0.21% measured share, default capture',
      category: 'iam',
    },
    {
      id: 'GRANT',
      description:
        'Administrator grants an application role (ORA_ACCOUNT_MGMT)',
      frequency: '0.21% measured share, default capture',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Every client is an independent session process: sessions start at Poisson times, a successful LOGON opens a new SESSIONID, a log-normal number of statements follows at log-normal gaps and a LOGOFF closes it. 41 application connection pools run around the clock; five analysts and four administrators, each with one to three usual hosts including a shared jump host, are about three times as active 07:00-18:00 UTC as at night and run two independent session processes each. About 9,300 rows per day.',
    'Any logon can fail with ORA-01017: people retry after a few seconds and fail again about half the time, so bursts of two to six failures ending in success or giving up are ordinary, and pools occasionally retry a stale password quickly. Administrators grant and revoke four roles to the analysts; half of the grants are revoked by the same administrator and host in a later follow-up session (median 45 minutes), the rest are held for a log-normal lifetime (median 6 h). The weights are workload assumptions, not measured Oracle frequencies.',
    'In both modes the same administrators and hosts sometimes fail three or more times in a row before succeeding, read payroll, grant PAYROLL_READ to the same analysts and revoke it in follow-up sessions of the restoration shape. An ordinary PAYROLL_READ grant that would complete the chain within 30 minutes in the session opened after the failures gets a different role at the same time.',
    'Episode starts move towards working hours by at most half the window per episode and then stay there: in the measured default capture the first started at 01:26 UTC and later ones moved into 08:14-09:51 UTC. A 2 h window cannot keep 8-hourly episodes in working hours; intervals below 6 h are rejected.',
    'Assumed audit configuration: ORA_LOGON_FAILURES, ORA_ACCOUNT_MGMT and example custom policies APP_SESSION_AUDIT and APP_DATA_AUDIT over HR.EMPLOYEES (Oracle sample schema) and the synthetic REPORTING.DAILY_SALES and FINANCE.PAYROLL. All grants are authorized, so the episode is suspicious only by the order and timing of its events.',
    'The modeled connector writes NUMBER as JSON numbers, NULL as null and both TIMESTAMP(6) columns as YYYY-MM-DD HH24:MI:SS.FF6 in a UTC database; SQL_BINDS is null (literals only), failed logons have null CURRENT_USER (unconfirmed) and SESSIONID steps do not emulate Oracle allocation. One instance, at most one row per second. No version-matched 19c export of this projection was available, so byte-level row fidelity and live nullability remain unverified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Generate the recurring failed-logon, payroll-read and grant chain; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episode due times, counted from the previous actual start; 6 to 8,760',
    },
    {
      name: 'database_id',
      defaultValue: '3459081234',
      description: 'Synthetic numeric DBID',
    },
  ],
  sampleOutputs: [
    {
      title: 'Role grant of the first episode in the default 144-hour capture',
      json: String.raw`{"ACTION_NAME": "GRANT", "AUDIT_TYPE": "Standard", "CLIENT_PROGRAM_NAME": "SQL Developer", "CURRENT_USER": "DBA_MARTIN", "DBID": 3459081234, "DBUSERNAME": "DBA_MARTIN", "ENTRY_ID": 5, "EVENT_TIMESTAMP": "2026-09-26 01:27:31.953645", "EVENT_TIMESTAMP_UTC": "2026-09-26 01:27:31.953645", "INSTANCE_ID": 1, "OBJECT_NAME": null, "OBJECT_SCHEMA": null, "OS_USERNAME": "pmartin", "RETURN_CODE": 0, "ROLE": "PAYROLL_READ", "SESSIONID": 3028048354, "SQL_BINDS": null, "SQL_TEXT": "GRANT PAYROLL_READ TO AUDIT_RO", "STATEMENT_ID": 7, "TARGET_USER": "AUDIT_RO", "UNIFIED_AUDIT_POLICIES": "ORA_ACCOUNT_MGMT", "USERHOST": "wkst-077.corp.example"}`,
    },
  ],
};
