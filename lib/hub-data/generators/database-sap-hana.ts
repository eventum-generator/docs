import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseSapHana: GeneratorMeta = {
  slug: 'database-sap-hana',
  displayName: 'SAP HANA Audit Trail',
  category: 'database',
  description:
    'SAP HANA audit trail of a production S/4HANA tenant — logon and credential checks, data access on the application schema, authorization and user administration, configuration and license changes, certificate, authentication-provider and encryption-key management, backups, and the audit policy changes HANA always records itself. Every event keeps the trail line HANA writes verbatim in `message` beside the same values parsed into ECS.',
  format: ['JSON', 'ECS'],
  dataSource: 'SAP HANA audit trail (SYSLOGPROTOCOL target)',
  eventCount: 12,
  templateCount: 13,
  highlights: [
    'Raw 38-field trail line in message',
    '52 audit actions, SAP-recommended policies',
    'State machine instead of weighted draws',
    'Six-phase intrusion arc',
  ],
  generatorId: 'hana',
  eventTypes: [
    {
      id: 'SELECT',
      description:
        'Reads on the application schema, the calculation views and the SYS system views',
      frequency: '~55%',
      category: 'database',
    },
    {
      id: 'VALIDATE USER',
      description: 'Credential check, audited before the session exists',
      frequency: '~10%',
      category: 'authentication',
    },
    {
      id: 'CONNECT',
      description: 'Accepted connection, opening a session later events run in',
      frequency: '~8%',
      category: 'authentication',
    },
    {
      id: 'INSERT / UPDATE / DELETE',
      description:
        'Writes on the application tables, refused for read-only reporting accounts',
      frequency: '~8%',
      category: 'database',
    },
    {
      id: 'EXECUTE',
      description:
        'Stored procedure calls, including the repository procedures that grant activated roles',
      frequency: '~5%',
      category: 'database',
    },
    {
      id: 'GRANT / REVOKE',
      description:
        'System and object privileges and repository or catalog roles, with the grant option',
      frequency: '~4%',
      category: 'iam',
    },
    {
      id: 'USER / ROLE / USERGROUP',
      description:
        'Users, roles and user groups created, changed and dropped, with passwords masked',
      frequency: '~3%',
      category: 'iam',
    },
    {
      id: 'CONNECT (refused)',
      description:
        'Rejected logon, naming the reason: wrong credentials, locked, deactivated, expired',
      frequency: '~2%',
      category: 'authentication',
    },
    {
      id: 'SYSTEM CONFIGURATION CHANGE',
      description:
        'Parameter changes carrying the previous value, service stops and license installation',
      frequency: '~1.6%',
      category: 'configuration',
    },
    {
      id: 'BACKUP / RECOVER',
      description:
        'Manual complete, incremental and differential backups, catalog deletion, recovery',
      frequency: '~1.2%',
      category: 'database',
    },
    {
      id: 'AUDIT POLICY',
      description:
        'Audit policies created, changed and dropped and audit entries deleted, always at critical level',
      frequency: '~1.1%',
      category: 'configuration',
    },
    {
      id: 'SECURITY OBJECTS',
      description:
        'Certificate collections and certificates, LDAP / SAML / JWT providers, client-side encryption keys',
      frequency: '~0.8%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Raw trail line preserved — `message` carries the 38-position audit entry the syslog trail target writes, so a parser can be developed against it while dashboards read the parsed `sap.hana.audit.*` fields',
    'Audit actions verified against SAP — 48 of the 52 actions come from the auditable set of CREATE AUDIT POLICY, and the four audit-policy actions are the ones HANA always records under MandatoryAuditPolicy',
    'Policies from the Security Guide — events are reported under the `_SAP_*` policy set SAP recommends, at the levels it assigns, plus the site policies a production system adds for data access',
    'Logon pairs — a credential check is followed by the connection it authorises or the refusal it causes, sharing session ID, account and client',
    'Sessions — an accepted connection opens a session that later statements run inside, reusing its ID, account, client host and process; the pools are bounded and sessions retire',
    'Account lockout — invalid attempts accumulate per account and the sixth reports "user is locked", matching HANA\'s default maximum_invalid_connect_attempts',
    'Who does what — application servers send prepared statements with placeholders, loaders read column ranges by delta key, a person at HDB Studio reads whole rows, monitoring accounts read the system views',
    'Application users — the ABAP stack connects as one technical account and passes the business user through, so the database user and the application user differ',
    'Sensitivity drives the policy — reads of the HR and password tables are reported by their own policy at warning level, the rest of the schema at info',
    'Intrusion arc — about 7% of events form a six-phase story: password spraying from an unmanaged host, the connection the guessed credentials open, a backdoor account and privilege grants, bulk reads of the HR and password tables, then audit policy changes and an audit log deletion that MandatoryAuditPolicy records anyway',
  ],
  parameters: [
    {
      name: 'hana_sid',
      defaultValue: 'HDB',
      description: 'System ID of the audited instance',
    },
    {
      name: 'hana_instance',
      defaultValue: '00',
      description: 'Instance number',
    },
    {
      name: 'hana_host',
      defaultValue: 'hana-prod-01.corp.local',
      description: 'Fully qualified host name of the audited instance',
    },
    {
      name: 'hana_ip',
      defaultValue: '10.20.4.11',
      description: 'Host address',
    },
    {
      name: 'hana_port',
      defaultValue: '30040',
      description: 'Port of the service that reports the action',
    },
    {
      name: 'hana_service',
      defaultValue: 'indexserver',
      description: 'Service that reports the action',
    },
    {
      name: 'tenant_db',
      defaultValue: 'HDB_PROD',
      description: 'Tenant database name',
    },
    {
      name: 'hana_version',
      defaultValue: '2.00.077.00.1707118848',
      description: 'Database version, reported in service.version',
    },
    {
      name: 'hana_host_id',
      defaultValue: '4f2c9a17be3d4e8f9c05a1d76b3e8420',
      description: 'Machine ID of the host',
    },
    {
      name: 'hana_mac',
      defaultValue: '00-50-56-A1-3F-2C',
      description: 'Host MAC address',
    },
    {
      name: 'hana_os_version',
      defaultValue: '15 SP5',
      description: 'Operating system version',
    },
    {
      name: 'hana_os_kernel',
      defaultValue: '5.14.21-150500.55.83-default',
      description: 'Kernel release',
    },
    {
      name: 'backup_path',
      defaultValue: '/hana/backup/HDB',
      description: 'Directory manual backups are written to',
    },
    {
      name: 'rogue_subnet',
      defaultValue: '10.99.0.0/16',
      description:
        'Range the intruder connects from, outside the managed client ranges',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS version reported in ecs.version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Privilege granted',
      json: `{
    "@timestamp": "2026-07-31T09:18:35.225797+00:00",
    "message": "2026-07-31T09:18:35.225797Z;indexserver;hana-prod-01.corp.local;HDB;00;30040;HDB_PROD;10.20.9.6;jump02.corp.local;13653;57962;_SAP_authorizations;INFO;GRANT ROLE;SUPPORT_L3;;;;GRANTABLE;Z_S4_HR_DISPLAY;Z_ETL_LOAD;SUCCESSFUL;;;;;;;GRANT \\"Z_S4_HR_DISPLAY\\" TO Z_ETL_LOAD WITH ADMIN OPTION;400018;SUPPORT_L3;_SYS_REPO;_SYS_REPO;;;;hdbsql;SUPPORT_L3",
    "event": {
        "action": "grant_role",
        "category": ["iam"],
        "dataset": "sap_hana.audit",
        "kind": "event",
        "module": "sap_hana",
        "outcome": "success",
        "severity": 6,
        "type": ["group", "change"]
    },
    "rule": { "name": "_SAP_authorizations", "ruleset": "SAP HANA audit policies" },
    "sap": {
        "hana": {
            "audit": {
                "action": "GRANT ROLE",
                "action_status": "SUCCESSFUL",
                "audit_level": "INFO",
                "database_name": "HDB_PROD",
                "grantable": "GRANTABLE",
                "policy_name": "_SAP_authorizations",
                "role_name": "Z_S4_HR_DISPLAY",
                "role_schema_name": "_SYS_REPO",
                "session_id": 400018,
                "session_user": "SUPPORT_L3",
                "target_principal": "Z_ETL_LOAD"
            }
        }
    },
    "source": { "domain": "jump02.corp.local", "ip": "10.20.9.6", "port": 57962 },
    "user": {
        "name": "SUPPORT_L3",
        "roles": ["Z_S4_HR_DISPLAY"],
        "target": { "name": "Z_ETL_LOAD" }
    }
}`,
    },
    {
      title: 'Payroll table read from an unmanaged host',
      json: `{
    "@timestamp": "2026-07-31T09:25:32.352917+00:00",
    "message": "2026-07-31T09:25:32.352917Z;indexserver;hana-prod-01.corp.local;HDB;00;30040;HDB_PROD;10.99.119.155;WKSTN-981;38878;54420;Z_pii access;WARNING;SELECT;HDB_BATCH;SAPHANADB;PA0008;;;;;SUCCESSFUL;;;;;;;SELECT * FROM \\"SAPHANADB\\".\\"PA0008\\";400177;;;;;;;python-hdbcli;HDB_BATCH",
    "event": {
        "action": "select",
        "category": ["database"],
        "dataset": "sap_hana.audit",
        "kind": "event",
        "module": "sap_hana",
        "outcome": "success",
        "severity": 4,
        "type": ["access"]
    },
    "log": {
        "level": "warning",
        "syslog": { "severity": { "code": 4, "name": "warning" } }
    },
    "rule": { "name": "Z_pii access", "ruleset": "SAP HANA audit policies" },
    "sap": {
        "hana": {
            "audit": {
                "action": "SELECT",
                "action_status": "SUCCESSFUL",
                "application_name": "python-hdbcli",
                "audit_level": "WARNING",
                "policy_name": "Z_pii access",
                "session_id": 400177,
                "session_user": "HDB_BATCH",
                "statement_string": "SELECT * FROM \\"SAPHANADB\\".\\"PA0008\\"",
                "target_object": "PA0008",
                "target_schema": "SAPHANADB"
            }
        }
    },
    "process": { "name": "python-hdbcli", "pid": 38878 },
    "source": { "domain": "WKSTN-981", "ip": "10.99.119.155", "port": 54420 },
    "user": { "name": "HDB_BATCH" }
}`,
    },
  ],
};
