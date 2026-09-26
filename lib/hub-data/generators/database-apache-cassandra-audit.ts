/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const databaseApacheCassandraAudit: GeneratorMeta = {
  slug: 'database-apache-cassandra-audit',
  displayName: 'Apache Cassandra auditlogviewer',
  category: 'database',
  description:
    'Cassandra 4.0 auditlogviewer records with ordinary CQL activity and a temporary-role access chain.',
  dataSource: 'Apache Cassandra 4.0 BinAuditLogger via auditlogviewer',
  format: ['JSON', 'ECS', 'auditlogviewer'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Vendor-documented pipe-delimited viewer records',
    'CQL QUERY, DML, OTHER, and DCL categories',
    'Temporary role creation, grant, read, and deletion',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An administrator creates a temporary role, grants sensitive-table SELECT, the role reads it, then the administrator drops the role.',
  generatorId: 'cassandra',
  eventTypes: [
    {
      id: 'select',
      description: 'CQL SELECT query',
      frequency: '76% baseline; chain',
      category: 'QUERY',
    },
    {
      id: 'update',
      description: 'CQL UPDATE statement',
      frequency: '18% baseline',
      category: 'DML',
    },
    {
      id: 'use-keyspace',
      description: 'Use a keyspace',
      frequency: '6% baseline',
      category: 'OTHER',
    },
    {
      id: 'create-role',
      description: 'Create temporary role',
      frequency: 'Chain only',
      category: 'DCL',
    },
    {
      id: 'grant',
      description: 'Grant table SELECT to the role',
      frequency: 'Chain only',
      category: 'DCL',
    },
    {
      id: 'drop-role',
      description: 'Drop temporary role',
      frequency: 'Chain only',
      category: 'DCL',
    },
  ],
  realismFeatures: [
    'Audit fields included only where applicable to CQL operations',
    'Role password masked as Cassandra documents',
    'Per-node event stream with consistent source and role identifiers',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the temporary-role access sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'cassandra-01.example.test',
      description: 'Cassandra node name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.20.30.10',
      description: 'Cassandra node IP',
    },
    {
      name: 'keyspace',
      defaultValue: 'finance',
      description: 'Generated keyspace',
    },
    {
      name: 'sensitive_table',
      defaultValue: 'payroll',
      description: 'Table accessed in the sequence',
    },
    {
      name: 'temporary_role',
      defaultValue: 'temp_reader',
      description: 'Role created and dropped in the sequence',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.83',
      description: 'Source IP for the sequence',
    },
  ],
  sampleOutputs: [
    {
      title: 'Grant on sensitive table',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:21:36+00:00",
  "cassandra": {
    "audit": {
      "category": "DCL",
      "operation": "GRANT SELECT ON TABLE finance.payroll TO temp_reader;",
      "temporary_role": "temp_reader",
      "timestamp_ms": 1790342496000,
      "type": "GRANT",
      "viewer_record_type": "AuditLog"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "grant",
    "category": [
      "iam"
    ],
    "kind": "event",
    "original": "Type: AuditLog\nLogMessage:\nuser:cassandra|host:10.20.30.10:7000|source:/192.0.2.83|port:46265|timestamp:1790342496000|type:GRANT|category:DCL|operation:GRANT SELECT ON TABLE finance.payroll TO temp_reader;",
    "type": [
      "change"
    ]
  },
  "host": {
    "ip": [
      "10.20.30.10"
    ],
    "name": "cassandra-01.example.test"
  },
  "related": {
    "ip": [
      "192.0.2.83",
      "10.20.30.10"
    ],
    "user": [
      "cassandra"
    ]
  },
  "source": {
    "ip": "192.0.2.83",
    "port": 46265
  },
  "user": {
    "name": "cassandra"
  }
}`,
    },
  ],
};
