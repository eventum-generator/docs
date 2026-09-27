/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMariadbAudit: GeneratorMeta = {
  slug: 'database-mariadb-audit',
  displayName: 'MariaDB Audit Plugin File Log',
  category: 'database',
  description:
    'MariaDB Community Server 11.4.4 server_audit FILE records (connections, queries and table locks) of an application connection pool, DBAs and delegated accounts, as the native 10-field CSV in event.original with parsed mariadb.audit.* and ECS fields. Recurring episodes put a run of failed DBA logins in front of a temporary GRANT, the delegated read, the REVOKE and a denial.',
  dataSource:
    'MariaDB Community Server 11.4.4, server_audit plugin 1.4.14, FILE output',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native 10-field server_audit CSV in event.original',
    'Pooled application connections and concurrent DBA and delegate sessions',
    'Recurring failed-login, GRANT, read, REVOKE and denial chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due one anomaly_interval_hours (default 24) after the first record, then one interval after the actual start of the previous episode; the first grant maintenance that starts after the due time carries it, typically within a few hours (0.1 to 2.5 hours measured), and missed intervals are not replayed. The DBA fails three (70%) or four logins, connects and grants a delegate SELECT on a sensitive table; the delegate connects and reads it; the DBA revokes the grant; the delegate is later denied with 1142. Consecutive episodes differ in DBA or table. Runs of three or more failures followed by a login, and grant cycles, also occur in background; only such a run immediately followed by the GRANT cycle of that DBA is episode-only.',
  generatorId: 'database-mariadb-audit',
  eventTypes: [
    {
      id: 'QUERY',
      description: 'Completed COM_QUERY statement with its result code',
      frequency: '9,381 per day (48.4%) measured without episodes',
      category: 'database (plus iam for GRANT/REVOKE)',
    },
    {
      id: 'READ',
      description: 'Successful read table lock taken by the statement',
      frequency: '6,133 per day (31.7%) measured without episodes',
      category: 'database',
    },
    {
      id: 'WRITE',
      description: 'Successful write table lock taken by the statement',
      frequency: '3,258 per day (16.8%) measured without episodes',
      category: 'database',
    },
    {
      id: 'DISCONNECT',
      description: 'End of a successful or failed connection',
      frequency: '301 per day (1.6%) measured without episodes',
      category: 'authentication',
    },
    {
      id: 'CONNECT',
      description: 'Successful login, current database set',
      frequency: '273 per day (1.4%) measured without episodes',
      category: 'authentication',
    },
    {
      id: 'FAILED_CONNECT',
      description: 'Wrong password, retcode 1045, empty database',
      frequency: '29 per day (0.15%) measured without episodes',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Three long-lived application connections issue point SELECT (65%), UPDATE (25%) and INSERT (10%) statements against 50 orders tables after exponential think times and produce 94% of records. DBAs and delegates open their own sessions after lognormal idle times, up to six sessions at once. About 19,400 records per day; rates and proportions are chosen assumptions, not vendor-measured frequencies, with no daily cycle and one application server.',
    'Record semantics follow the tagged 11.4.4 source: table lock records precede their QUERY with the same query ID and second and an empty retcode (a lock was taken, not rows returned), 1142 denials and 1064 syntax errors take no lock, a failed login closes in the same second with an empty database, and the COM_QUIT that ends a session consumes a query ID.',
    'Failed-login runs with retries and give-ups (about 29 failed logins per day) and temporary grant maintenance (about 15 per day) occur in both modes, and every user, address, statement shape and retcode of an episode also appears outside episodes. At short intervals, runs of three or more failures per DBA become more frequent than without episodes (about twice as frequent at 12 hours with one DBA and at the 6-hour minimum).',
    'No unmodified production audit file was available: the field grammar comes from the tagged source and its regression result, the GRANT/REVOKE system-table lock records are derived from source rather than a captured trace, and ID values, timing and workload are synthetic. FILE output only; neither the SYSLOG output of this version nor the client ports and TLS details added in 12.x are modelled.',
    'ECS fields beyond the parsed native slots are collector-side enrichment. No maintained Elastic integration covers server_audit and no SIEM parser was run. The records do not show why logins failed, which rows were returned, or data exfiltration.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add episodes to background; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours of source time, 6 to 8,760',
    },
    {
      name: 'db_host',
      defaultValue: 'db-01.corp.example',
      description:
        'Server host name in the serverhost slot; ASCII letters, digits, dot and hyphen, up to 253 characters',
    },
    {
      name: 'db_ip',
      defaultValue: '10.100.0.5',
      description: 'Server IPv4 address, enrichment only',
    },
    {
      name: 'normal_user',
      defaultValue: 'app_user',
      description: 'Application account used by the connection pool',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.100.1.20',
      description: 'Application server IPv4 address',
    },
    {
      name: 'dba_accounts',
      defaultValue:
        '[{user: dba, ip: 10.99.4.51}, {user: dba_ops, ip: 10.99.4.52}]',
      description:
        'DBA pool, 1 to 4 entries of user and ip; the DBA or table pool needs two or more entries',
    },
    {
      name: 'delegated_accounts',
      defaultValue:
        '[{user: audit_user, ip: 10.99.5.21}, {user: report_user, ip: 10.99.5.22}]',
      description:
        'Accounts that receive temporary grants, 1 to 4 entries of user and ip',
    },
    {
      name: 'normal_database',
      defaultValue: 'appdb',
      description: 'Database of the 50 application tables',
    },
    {
      name: 'sensitive_database',
      defaultValue: 'payroll',
      description: 'Database of the sensitive tables',
    },
    {
      name: 'sensitive_tables',
      defaultValue: '[salaries, bonuses]',
      description:
        'Sensitive tables, 1 to 8 distinct entries; the DBA or table pool needs two or more entries',
    },
  ],
  sampleOutputs: [
    {
      title: 'GRANT of the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-02T00:57:33+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "query",
    "category": [
      "database",
      "iam"
    ],
    "created": "2026-09-02T00:57:35+00:00",
    "dataset": "mariadb.audit",
    "ingested": "2026-09-02T00:57:35+00:00",
    "kind": "event",
    "original": "20260902 00:57:33,db-01.corp.example,dba,10.99.4.51,1321,12077,QUERY,payroll,'GRANT SELECT ON payroll.salaries TO \\'audit_user\\'@\\'10.99.5.21\\'',0",
    "outcome": "success",
    "type": [
      "change"
    ]
  },
  "host": {
    "ip": [
      "10.100.0.5"
    ],
    "name": "db-01.corp.example"
  },
  "log": {
    "file": {
      "path": "/var/log/mariadb/server_audit.log"
    }
  },
  "mariadb": {
    "audit": {
      "connectionid": 1321,
      "database": "payroll",
      "host": "10.99.4.51",
      "object": "GRANT SELECT ON payroll.salaries TO 'audit_user'@'10.99.5.21'",
      "operation": "QUERY",
      "queryid": 12077,
      "retcode": 0,
      "serverhost": "db-01.corp.example",
      "timestamp": "20260902 00:57:33",
      "username": "dba"
    }
  },
  "message": "20260902 00:57:33,db-01.corp.example,dba,10.99.4.51,1321,12077,QUERY,payroll,'GRANT SELECT ON payroll.salaries TO \\'audit_user\\'@\\'10.99.5.21\\'',0",
  "observer": {
    "hostname": "db-01.corp.example",
    "ip": [
      "10.100.0.5"
    ],
    "product": "MariaDB Community Server",
    "type": "database",
    "vendor": "MariaDB",
    "version": "11.4.4"
  },
  "related": {
    "ip": [
      "10.99.4.51"
    ],
    "user": [
      "dba"
    ]
  },
  "service": {
    "type": "mariadb",
    "version": "11.4.4"
  },
  "source": {
    "ip": "10.99.4.51"
  },
  "tags": [
    "mariadb-audit",
    "preserve_original_event"
  ],
  "user": {
    "name": "dba"
  }
}`,
    },
  ],
};
