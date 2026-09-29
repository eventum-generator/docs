import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseOracleUnifiedAudit: GeneratorMeta = {
  slug: 'database-oracle-unified-audit',
  displayName: 'Oracle Database 19c Unified Audit Trail',
  category: 'database',
  description:
    'JSON rows from a defined 22-column projection of the Oracle Database 19c UNIFIED_AUDIT_TRAIL view, as a connector polling that view would deliver them, for SIEM content that correlates database logons, sensitive reads and privilege changes. Not Oracle syslog output or a native Oracle JSON export. About 8,600 rows a day: application connection pools write around the clock, five analysts and four administrators follow a UTC working day. Recurring episodes show a guessed administrator password followed by a payroll read and a payroll role grant to an analyst.',
  dataSource:
    'Oracle Database 19c UNIFIED_AUDIT_TRAIL view, 22-column projection read by a polling connector',
  format: ['JSON'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    '22/22 columns of a declared UNIFIED_AUDIT_TRAIL projection',
    'About 8,600 rows a day from 41 pools, 5 analysts and 4 administrators',
    'Recurring guessed-password, payroll-read and role-grant chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One of three administrators (SEC_ADMIN, FINANCE_DBA, DBA_CHEN), at their usual workstation and never the previous episode's administrator, fails three to eight logons with ORA-01017, spaced like ordinary password retries (median about 20 s). The same account and host then log on in a new session, optionally run one ordinary statement, read FINANCE.PAYROLL one to three times, grant PAYROLL_READ to an analyst who does not hold it (not the previous grantee), optionally run another ordinary statement and log off; the first failure to the grant takes about 2-7 minutes. In 60% of episodes the same account and host revoke the role in a follow-up session a median 30 minutes later; otherwise the grant is held and revoked in ordinary role cleanup. The first episode starts within the first min(anomaly_interval_hours, 24 h); each next one is due anomaly_interval_hours after the actual start of the previous one and starts in a window of min(interval / 4, 6 h) centred on that due time, weighted towards working hours. Missed intervals are not replayed, and when no eligible administrator or grantee is available the start moves on in 5-minute steps. At the default 24 h episodes are 21-27 h apart, mostly 08:00-18:00 UTC; at an 8-hour interval about a third fall between midnight and 03:00 UTC, when the administrators are rarely active. Every element also occurs in ordinary traffic; only the complete ordered sequence is episode-only.",
  generatorId: 'oracle-audit',
  eventTypes: [
    {
      id: 'SELECT',
      description: 'Reporting, HR and payroll table reads (APP_DATA_AUDIT)',
      frequency: '74.96% of rows',
      category: 'database access',
    },
    {
      id: 'UPDATE',
      description: 'HR employee phone updates (APP_DATA_AUDIT)',
      frequency: '11.13% of rows',
      category: 'database change',
    },
    {
      id: 'LOGON',
      description: 'Successful session start (APP_SESSION_AUDIT)',
      frequency: '6.65% of rows',
      category: 'authentication',
    },
    {
      id: 'LOGOFF',
      description: 'Session end (APP_SESSION_AUDIT)',
      frequency: '6.53% of rows',
      category: 'authentication',
    },
    {
      id: 'LOGON 1017',
      description: 'Invalid username/password, ORA-01017 (ORA_LOGON_FAILURES)',
      frequency: '0.27% of rows',
      category: 'authentication',
    },
    {
      id: 'REVOKE',
      description:
        'Administrator revokes an application role (ORA_ACCOUNT_MGMT)',
      frequency: '0.23% of rows',
      category: 'iam',
    },
    {
      id: 'GRANT',
      description:
        'Administrator grants an application role (ORA_ACCOUNT_MGMT)',
      frequency: '0.23% of rows',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'About 8,600 rows a day with ±3% day-to-day variation: about 465 rows an hour 07:00-19:00 UTC and about 250 at night. Application connection pools write about 90% of the rows around the clock, with more work between 07:00 and 19:00 UTC. Analysts and administrators open about 170 sessions a day, about 16 times as often 08:00-18:00 UTC as at night and about five times as often at 07-08 and 18-19. The hour curves repeat every day, so weekends look like weekdays.',
    'Every session is a LOGON that opens a new SESSIONID, statements and a LOGOFF. 41 pools (APP_READ, BI_APP, HR_APP, ETL_APP, PAYROLL_APP) each log on about ten times a day and run a median 12 statements minutes apart. Five analysts and four administrators each use one to three usual hosts, including the shared jump01.corp.example, and have at most two sessions open at once. Analysts read REPORTING.DAILY_SALES, HR.EMPLOYEES and FINANCE.PAYROLL and update HR.EMPLOYEES by job (median 4-6 statements, 45 s apart); administrators run short sessions (median 2 statements, 30 s apart) that read the three tables, update HR.EMPLOYEES and manage roles. Rates are workload assumptions, not measured Oracle frequencies.',
    "About 1% of pool logons fail with ORA-01017 (a stale saved password) and are retried within seconds. A person's first logon attempt fails in 5% (analysts) or 7% (administrators) of sessions; the retry follows a median 20 s later, fails again with probability 0.35, and after a failure the person gives up in 15% of cases. About 9% of people's logon attempts and 3.5% of all logon attempts fail, about 20 a day; no account reaches ten consecutive failures, where the DEFAULT profile would lock it.",
    'Administrators grant PAYROLL_READ, APP_REPORTER, HR_VIEW and SALES_READ to the five analysts, about 20-25 grants a day, about half of them PAYROLL_READ, only to an analyst who does not hold the role. 60% of grants are revoked by the same administrator and host in a follow-up session a median 30 minutes later; the rest are held for a median 90 minutes and revoked in the next role cleanup, so a late grant is revoked the next morning. About 70% of revokes come from the granting administrator and host; the median time from grant to revoke is about 45 minutes.',
    'In both modes the episode administrators at their usual hosts log on about 25-35 times a day, fail a logon two to four times a day, sometimes three or more times in a row before succeeding, read payroll about 15-40 times a day and grant PAYROLL_READ two to five times a day, revoking it in follow-up sessions of the same shape as the episode restoration. A session opened after three or more failures of its account and host within 30 minutes that reads payroll grants a role other than PAYROLL_READ. With episodes, failed logons are about 15-20% more frequent and runs of three or more failures followed by a successful logon occur about two to three times a day instead of one to two.',
    'Assumed audit configuration: ORA_LOGON_FAILURES, ORA_ACCOUNT_MGMT and example custom policies APP_SESSION_AUDIT and APP_DATA_AUDIT over HR.EMPLOYEES (Oracle sample schema) and the synthetic REPORTING.DAILY_SALES and FINANCE.PAYROLL. All grants are authorized, so the episode is suspicious only by the order and timing of its events.',
    'The modeled connector writes NUMBER as JSON numbers, NULL as null and both TIMESTAMP(6) columns as YYYY-MM-DD HH24:MI:SS.FF6 in a UTC database, so local and UTC timestamps are equal. SQL_BINDS is null (literals only), failed logons have null CURRENT_USER (unconfirmed), SESSIONID steps do not emulate Oracle allocation and STATEMENT_ID gaps stand for unaudited statements. One instance; rows of one session, including password retries, are at least a few seconds apart, where real clients can retry within a second. Byte-level row fidelity and live nullability are unverified against a version-matched 19c export of this projection.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Generate the recurring failed-logon, payroll-read and grant chain; false emits ordinary background only',
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
      title: 'Role grant of the first episode in a four-day default log',
      json: String.raw`{"ACTION_NAME": "GRANT", "AUDIT_TYPE": "Standard", "CLIENT_PROGRAM_NAME": "sqlplus@wkst-091.corp.example (TNS V1-V3)", "CURRENT_USER": "FINANCE_DBA", "DBID": 3459081234, "DBUSERNAME": "FINANCE_DBA", "ENTRY_ID": 4, "EVENT_TIMESTAMP": "2026-09-20 17:37:02.534192", "EVENT_TIMESTAMP_UTC": "2026-09-20 17:37:02.534192", "INSTANCE_ID": 1, "OBJECT_NAME": null, "OBJECT_SCHEMA": null, "OS_USERNAME": "mnovak", "RETURN_CODE": 0, "ROLE": "PAYROLL_READ", "SESSIONID": 3006292300, "SQL_BINDS": null, "SQL_TEXT": "GRANT PAYROLL_READ TO HR_ANALYST", "STATEMENT_ID": 6, "TARGET_USER": "HR_ANALYST", "UNIFIED_AUDIT_POLICIES": "ORA_ACCOUNT_MGMT", "USERHOST": "wkst-091.corp.example"}`,
    },
  ],
};
