import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationCiscoCucmAudit: GeneratorMeta = {
  slug: 'application-cisco-cucm-audit',
  displayName: 'Cisco Unified Communications Manager audit',
  category: 'application',
  dataSource: 'CUCM 14.0.1.10000-20 application audit file',
  description:
    'Administrator login and configuration records with a switchable linked processnode sequence.',
  generatorId: 'cucm',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Cisco DevNet Audit00000001.log row format',
    'Fourteen native audit fields in event.original',
    'Unusual administrator client adds and updates one processnode',
  ],
  anomalyChain:
    'An administrator from an off-pool client logs in, adds and updates the same processnode record, then logs out within three simulated minutes.',
  eventTypes: [
    {
      id: 'UserLogging / login',
      description: 'Successful CUCM Administration login',
      frequency: '43.1% with anomaly mode',
      category: 'authentication',
    },
    {
      id: 'UserLogging / logout',
      description: 'Successful Administration logout',
      frequency: '43.1% with anomaly mode',
      category: 'authentication',
    },
    {
      id: 'GeneralConfigurationUpdate / updated',
      description: 'Existing processnode record updated',
      frequency: '12.1% with anomaly mode',
      category: 'configuration',
    },
    {
      id: 'GeneralConfigurationUpdate / added',
      description: 'New processnode record added',
      frequency: '1.7% with anomaly mode',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'The original line follows Cisco DevNet’s CUCM 14 audit-file example, including blank CorrelationID for short rows.',
    'Anomaly events share user, client IP, and processnode record key.',
    'KUMA lists CUCM 11.5.1; this CUCM 14 file format was not tested against that normalizer.',
  ],
  format: ['JSON', 'ECS', 'CUCM audit file'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked processnode add and update sequence',
    },
    {
      name: 'cucm_node',
      defaultValue: 'cucm-pub-01',
      description: 'Native Node ID and ECS host',
    },
    {
      name: 'routine_sessions_before_chain',
      defaultValue: '24',
      description: 'Normal admin sessions between anomaly sessions',
    },
    {
      name: 'suspect_user',
      defaultValue: 'breakglass-admin',
      description: 'Administrator in the anomaly chain',
    },
    {
      name: 'suspect_client_ip',
      defaultValue: '198.51.100.45',
      description: 'Off-pool client address',
    },
    {
      name: 'suspect_node_prefix',
      defaultValue: 'cimp-shadow',
      description: 'Prefix of the new processnode record key',
    },
  ],
  sampleOutputs: [
    {
      title: 'Processnode addition from the anomaly session',
      json: String.raw`{
  "@timestamp": "2026-09-25T15:28:00+00:00",
  "cucm": {
    "audit": {
      "app_id": "Cisco Tomcat",
      "audit_category": "AdministrativeEvent",
      "audit_details": "record in table processnode with key field name = cimp-shadow-1.example.test added",
      "client_address": "198.51.100.45",
      "cluster_id": "",
      "component_id": "Cisco CUCM Administration",
      "compulsory_event": "No",
      "correlation_id": "",
      "event_status": "Success",
      "event_type": "GeneralConfigurationUpdate",
      "node_id": "cucm-pub-01",
      "processnode_name": "cimp-shadow-1.example.test",
      "resource_accessed": "CUCMAdmin",
      "severity": 5,
      "timestamp_local": "15:28:00.000",
      "user_id": "breakglass-admin"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "processnode_added",
    "category": [
      "configuration"
    ],
    "code": "GeneralConfigurationUpdate",
    "dataset": "cucm.audit",
    "kind": "event",
    "module": "cucm",
    "original": "15:28:00.000 |LogMessage   UserID : breakglass-admin  ClientAddress : 198.51.100.45  Severity : 5  EventType : GeneralConfigurationUpdate  ResourceAccessed: CUCMAdmin  EventStatus : Success  CompulsoryEvent : No  AuditCategory : AdministrativeEvent  ComponentID : Cisco CUCM Administration  CorrelationID :   AuditDetails : record in table processnode with key field name = cimp-shadow-1.example.test added App ID: Cisco Tomcat Cluster ID:  Node ID: cucm-pub-01",
    "outcome": "success",
    "type": [
      "creation"
    ]
  },
  "host": {
    "name": "cucm-pub-01"
  },
  "message": "record in table processnode with key field name = cimp-shadow-1.example.test added",
  "related": {
    "hosts": [
      "cucm-pub-01"
    ],
    "ip": [
      "198.51.100.45"
    ],
    "user": [
      "breakglass-admin"
    ]
  },
  "service": {
    "name": "Cisco Unified Communications Manager",
    "version": "14.0.1.10000-20"
  },
  "source": {
    "ip": "198.51.100.45"
  },
  "user": {
    "name": "breakglass-admin"
  }
}`,
    },
  ],
};
