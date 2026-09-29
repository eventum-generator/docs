/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMariadbAudit: GeneratorMeta = {
  slug: 'database-mariadb-audit',
  displayName: 'MariaDB Audit Plugin File Log',
  category: 'database',
  description:
    "MariaDB Community Server 11.4.4 server_audit FILE records (connections, queries and table locks) of an application connection pool, DBAs and delegated accounts, as the native 10-field CSV in event.original with parsed mariadb.audit.* and ECS fields. About 16,700 records a day follow a UTC working day. Recurring episodes put three or four failed DBA logins in front of a temporary GRANT, the delegate's read, the REVOKE and a denial.",
  dataSource:
    'MariaDB Community Server 11.4.4, server_audit plugin 1.4.14, FILE output',
  format: ['JSON', 'ECS', 'CSV'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native 10-field server_audit CSV in event.original',
    'About 16,700 records a day on a UTC working-day curve',
    'Recurring failed-login, GRANT, read, REVOKE and denial chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One DBA fails three (70%) or four logins from its address, spaced like password retries (median 8 s), each closed by its DISCONNECT in the same second. The DBA's login to the sensitive database and its GRANT SELECT on a sensitive table to a delegate follow a median 25 s later; the delegate connects, reads that table and disconnects; the DBA revokes the grant and disconnects; the delegate's next connection to the application database is denied with 1142 on the same table. Episode records take the place of application records, so the daily volume and hour curve match background. The first episode starts within the first min(anomaly_interval_hours, 24 h), at a time weighted like grant maintenance by hour of day. Each next episode is due one interval (default 24, minimum 6) after the actual start of the previous one and starts in a window of min(interval / 4, 6 h) centred on the due time, weighted towards business hours: 21 to 27 hours after the previous start at the default. While no DBA and delegate are available the start waits about a minute at a time; missed intervals are not replayed, and at intervals shorter than a day some episodes fall outside business hours. Consecutive episodes differ in DBA or table. Every account, pair and table of an episode also appears in ordinary grant maintenance, and failure runs followed by a login occur in background too; only episodes contain a run of at least three failures and a login followed by that DBA's GRANT within 30 minutes of the first failure.",
  generatorId: 'database-mariadb-audit',
  eventTypes: [
    {
      id: 'QUERY',
      description: 'Completed COM_QUERY statement with its result code',
      frequency: '48.6% of records, about 8,118 a day',
      category: 'database (plus iam for GRANT/REVOKE)',
    },
    {
      id: 'READ',
      description: 'Successful read table lock taken by the statement',
      frequency: '31.5% of records, about 5,265 a day',
      category: 'database',
    },
    {
      id: 'WRITE',
      description: 'Successful write table lock taken by the statement',
      frequency: '17.2% of records, about 2,865 a day',
      category: 'database',
    },
    {
      id: 'DISCONNECT',
      description: 'End of a successful or failed connection',
      frequency: '1.34% of records, about 224 a day',
      category: 'authentication',
    },
    {
      id: 'CONNECT',
      description: 'Successful login, current database set',
      frequency: '1.29% of records, about 215 a day',
      category: 'authentication',
    },
    {
      id: 'FAILED_CONNECT',
      description: 'Wrong password, retcode 1045, empty database',
      frequency:
        '0.05% of records, about 9 a day without episodes; about 0.07% and 12 a day with them',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Volume follows a UTC hour-of-day curve: 0.28 records/s at 08-19, 0.18 at 07-08 and 19-21 and 0.10 at 21-07, about 16,700 records a day with ±3% day-to-day variation. The curve repeats every day, so weekends look like weekdays. Rates are chosen assumptions, not vendor-measured frequencies.',
    'Three long-lived connections of the application account write about 96% of the records: point SELECT (65%), UPDATE (25%) and INSERT (10%) against 50 orders tables, a median of 51 statements per connection, each connection replaced after a median 30 minutes. DBAs and delegates work mostly in business hours, about 4.7 sessions an hour at 08-18 UTC and 0.1 at night, a median of 2 statements 25 s apart; up to seven sessions are open at once.',
    "About 11 temporary grants a day, mostly in business hours: a DBA grants a delegate SELECT on one sensitive table, the delegate reads it one to five times, the DBA revokes the grant, and a median 200 s later the delegate's next attempt is denied with 1142. GRANTs of one DBA are at least 30 minutes apart, and up to two temporary grants exist at once.",
    "Failed logins are about 4% of login attempts, about 9 a day: mistyped passwords retried after a median 8 s, give-ups, and stale-password bursts of 2 to 5 failures within seconds. Runs of three or more failures followed by a login occur two to three times a week for the two DBAs together; about twice a week such a run reaches a DBA's grant maintenance, and that DBA then works on the sensitive tables without a GRANT.",
    'Record semantics follow the tagged 11.4.4 source: table lock records precede their QUERY with the same query ID and second and an empty retcode (a lock was taken, not rows returned), 1142 denials and 1064 syntax errors take no lock, a failed login closes in the same second with an empty database, and the COM_QUIT that ends a session consumes a query ID. event.created is the collection time: the same second in half of the records, within 8 s for 90%, up to about two minutes at night.',
    "With anomaly_mode true, each episode adds three or four failed logins of one DBA and one GRANT, REVOKE and 1142 denial: at the default interval the DBAs' failed logins are about 1.7 times the background level (about 8.5 instead of 5 a day), and runs of three or more failures followed by a login occur about 9-10 times a week instead of two or three.",
    'No unmodified production audit file was available: the field grammar comes from the tagged source and its regression result, the GRANT/REVOKE system-table records are derived from source rather than a captured trace, and ID values, timing and workload are synthetic. FILE output only; neither the SYSLOG output of this version nor the client ports and TLS details added in 12.x are modelled. Clients send no connect-time statements, connection ids increase by one per connection, and there is one application server.',
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
      title: 'GRANT of an episode',
      json: String.raw`{
  "@timestamp": "2026-10-12T10:26:30+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "query",
    "category": [
      "database",
      "iam"
    ],
    "created": "2026-10-12T10:26:35.421863+00:00",
    "dataset": "mariadb.audit",
    "ingested": "2026-10-12T10:26:35.421863+00:00",
    "kind": "event",
    "original": "20261012 10:26:30,db-01.corp.example,dba_ops,10.99.4.52,1081,4771,QUERY,payroll,'GRANT SELECT ON payroll.bonuses TO \\'report_user\\'@\\'10.99.5.22\\'',0",
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
      "connectionid": 1081,
      "database": "payroll",
      "host": "10.99.4.52",
      "object": "GRANT SELECT ON payroll.bonuses TO 'report_user'@'10.99.5.22'",
      "operation": "QUERY",
      "queryid": 4771,
      "retcode": 0,
      "serverhost": "db-01.corp.example",
      "timestamp": "20261012 10:26:30",
      "username": "dba_ops"
    }
  },
  "message": "20261012 10:26:30,db-01.corp.example,dba_ops,10.99.4.52,1081,4771,QUERY,payroll,'GRANT SELECT ON payroll.bonuses TO \\'report_user\\'@\\'10.99.5.22\\'',0",
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
      "10.99.4.52"
    ],
    "user": [
      "dba_ops"
    ]
  },
  "service": {
    "type": "mariadb",
    "version": "11.4.4"
  },
  "source": {
    "ip": "10.99.4.52"
  },
  "tags": [
    "mariadb-audit",
    "preserve_original_event"
  ],
  "user": {
    "name": "dba_ops"
  }
}`,
    },
  ],
};
