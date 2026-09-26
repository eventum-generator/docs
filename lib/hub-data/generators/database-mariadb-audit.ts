/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseMariadbAudit: GeneratorMeta = {
  slug: 'database-mariadb-audit',
  displayName: 'MariaDB Audit Plugin Syslog',
  category: 'database',
  description:
    'MariaDB Audit Plugin syslog with session and query IDs, table access, and a switchable privilege-grant chain.',
  dataSource: 'MariaDB Audit Plugin v1 SYSLOG CSV',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'database-mariadb-audit',
  highlights: [
    '10 native audit CSV fields',
    'Session and query correlation',
    'Delegated read after GRANT',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed DBA logins, a successful login and GRANT SELECT, then a delegated user connects and reads payroll.salaries from the same source IP.',
  eventTypes: [
    {
      id: 'CONNECT',
      description: 'Connection succeeded',
      frequency: '1 per routine session; 2 per chain',
      category: 'authentication',
    },
    {
      id: 'FAILED_CONNECT',
      description: 'Connection rejected',
      frequency: '3 per chain',
      category: 'authentication',
    },
    {
      id: 'QUERY',
      description: 'SQL statement audited',
      frequency: '1 per routine session; 2 per chain',
      category: 'database',
    },
    {
      id: 'READ',
      description: 'Table read audited',
      frequency: '1 per routine session; 1 per chain',
      category: 'database',
    },
    {
      id: 'DISCONNECT',
      description: 'Session ended',
      frequency: '1 per routine session; 1 per chain',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Native SYSLOG prefix plus 10-field Audit Plugin CSV is retained in event.original.',
    'Connection ID links each successful session; QUERY and READ share query ID.',
    'Fifty table samples vary routine SQL and targets.',
  ],
  parameters: [
    {
      name: 'db_host',
      defaultValue: 'db-01.corp.example',
      description: 'Server name',
    },
    {
      name: 'db_ip',
      defaultValue: '10.100.0.5',
      description: 'Server address',
    },
    {
      name: 'normal_user',
      defaultValue: 'app_user',
      description: 'Background account',
    },
    {
      name: 'normal_ip',
      defaultValue: '10.100.1.20',
      description: 'Background client address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'dba',
      description: 'Administrator in chain',
    },
    {
      name: 'delegated_user',
      defaultValue: 'audit_user',
      description: 'Account granted read access',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.4.51',
      description: 'Chain client address',
    },
    {
      name: 'anomaly_interval_sessions',
      defaultValue: '50',
      description: 'Routine sessions between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:45:22+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "grant-query",
    "category": [
      "iam",
      "database"
    ],
    "dataset": "mariadb.audit",
    "kind": "event",
    "original": "Sep 25 12:45:22 db-01.corp.example mysql-server_auditing: 20260925 12:45:22,db-01.corp.example,dba,10.99.4.51,1054,2050,QUERY,payroll,'GRANT SELECT ON payroll.* TO 'audit_user'@'%'',0",
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
    "syslog": {
      "appname": "mysql-server_auditing"
    }
  },
  "mariadb": {
    "audit": {
      "connectionid": 1054,
      "database": "payroll",
      "host": "10.99.4.51",
      "object": "'GRANT SELECT ON payroll.* TO 'audit_user'@'%''",
      "operation": "QUERY",
      "queryid": 2050,
      "retcode": 0,
      "serverhost": "db-01.corp.example",
      "username": "dba"
    }
  },
  "message": "20260925 12:45:22,db-01.corp.example,dba,10.99.4.51,1054,2050,QUERY,payroll,'GRANT SELECT ON payroll.* TO 'audit_user'@'%'',0",
  "observer": {
    "hostname": "db-01.corp.example",
    "ip": "10.100.0.5",
    "product": "MariaDB",
    "type": "database",
    "vendor": "MariaDB"
  },
  "related": {
    "ip": [
      "10.99.4.51"
    ],
    "user": [
      "dba"
    ]
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
