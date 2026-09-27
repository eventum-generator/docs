import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationCiscoCucmAudit: GeneratorMeta = {
  slug: 'application-cisco-cucm-audit',
  displayName: 'Cisco Unified Communications Manager Audit Log',
  category: 'application',
  description:
    'Cisco Unified Communications Manager 14 application audit log rows: Cisco Unified CM Administration logins and logouts and processnode configuration changes of 12 administrator accounts, with the native |LogMessage row in event.original of ECS JSON. Recurring episodes show one account adding, updating and deleting the same cluster server record within one session.',
  dataSource:
    'Cisco Unified Communications Manager 14.0.1.10000-20 application audit file (Audit00000001.log, |LogMessage rows)',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native |LogMessage row from the Cisco DevNet sample',
    'Independent sessions of 12 administrator accounts',
    'Recurring add, update, delete of one server record',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode due one interval after the first tick, each next one due one interval after the previous actual start; a start comes up to 30 minutes after it is due and waits until an account and a record are free; missed episodes are not replayed), one account logs in from one of its usual addresses, adds a server record absent from processnode, updates it seconds later, then deletes it, restoring the table (0.4-5.3 minutes from add to delete, measured). Accounts and records rotate; every step and each pair of steps also occurs in background, and only the complete add, update, delete of one record by one account is episode-only.',
  generatorId: 'cucm',
  eventTypes: [
    {
      id: 'processnode_updated',
      description: 'GeneralConfigurationUpdate: processnode record updated',
      frequency: '34.8% measured share',
      category: 'configuration',
    },
    {
      id: 'user_login',
      description: 'UserLogging: logged into Cisco Unified CM Admin Webpages',
      frequency: '26.7% measured share',
      category: 'authentication, session',
    },
    {
      id: 'user_logout',
      description: 'UserLogging: logged out of Cisco Unified Administration',
      frequency: '19.4% measured share',
      category: 'authentication, session',
    },
    {
      id: 'processnode_deleted',
      description: 'GeneralConfigurationUpdate: processnode record deleted',
      frequency: '9.9% measured share',
      category: 'configuration',
    },
    {
      id: 'processnode_added',
      description: 'GeneralConfigurationUpdate: processnode record added',
      frequency: '9.3% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Twelve administrator accounts each follow their own schedule: sessions every few hours to a few days (per-account median 3 to 30 hours), from the usual workstation or, in about 15% of sessions, a second address. About 40% of sessions only look around, and about a quarter end without a logout row because the session expires.',
    'The other sessions carry one to about fifteen changes seconds to minutes apart on 24 processnode server records, each present or absent: repeated updates and quick re-saves, adds often followed by an update of the same record as in the Cisco sample or deleted again in the same session, and deletes of present records.',
    'Field names, spacing and constant values follow the four-row Cisco DevNet Audit00000001.log sample for build 14.0.1.10000-20. The deleted row reuses the added/updated form with the verb seen in Cisco Community posts for other tables; it is not a captured line.',
    'Only successful Administration logins and processnode changes are modeled: no failed logins, other tables, Serviceability or CLI events, for lack of primary row examples, so configuration volume is concentrated on server records. Rates, durations and the operation mix are synthetic workload choices.',
    'The file HDR line and remote syslog framing are not emitted; native rows carry only a UTC time of day and @timestamp supplies the date. cucm.audit.record is parsed from AuditDetails. Compatibility with the KUMA CUCM 11.5(1) normalizer is not claimed, and no live capture was available.',
    'An ordinary delete that would complete the chain is skipped. The detection idea is a server entry staged and then removed, for example to register a rogue node temporarily.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include periodic anomaly episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episode starts; 6 to 8760, other values fail validation',
    },
    {
      name: 'cucm_node',
      defaultValue: 'cucm-pub-01',
      description: 'Native Node ID and host.name',
    },
  ],
  sampleOutputs: [
    {
      title: 'Delete row ending an anomaly episode',
      json: String.raw`{"@timestamp": "2026-09-03T00:44:13.506+00:00", "cucm": {"audit": {"app_id": "Cisco Tomcat", "audit_category": "AdministrativeEvent", "audit_details": "record in table processnode with key field name = cucm-sub-02.example.test deleted", "client_address": "10.99.10.40", "cluster_id": "", "component_id": "Cisco CUCM Administration", "compulsory_event": "No", "correlation_id": "", "event_status": "Success", "event_type": "GeneralConfigurationUpdate", "node_id": "cucm-pub-01", "record": {"key_field": "name", "key_value": "cucm-sub-02.example.test", "operation": "deleted", "table": "processnode"}, "resource_accessed": "CUCMAdmin", "severity": 5, "timestamp_local": "00:44:13.506", "user_id": "rkowalski"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "processnode_deleted", "category": ["configuration"], "code": "GeneralConfigurationUpdate", "dataset": "cucm.audit", "kind": "event", "module": "cucm", "original": "00:44:13.506 |LogMessage   UserID : rkowalski  ClientAddress : 10.99.10.40  Severity : 5  EventType : GeneralConfigurationUpdate  ResourceAccessed: CUCMAdmin  EventStatus : Success  CompulsoryEvent : No  AuditCategory : AdministrativeEvent  ComponentID : Cisco CUCM Administration  CorrelationID :   AuditDetails :  record in table processnode with key field name = cucm-sub-02.example.test deleted  App ID: Cisco Tomcat Cluster ID:  Node ID: cucm-pub-01", "outcome": "success", "type": ["deletion"]}, "host": {"name": "cucm-pub-01"}, "message": "record in table processnode with key field name = cucm-sub-02.example.test deleted", "related": {"hosts": ["cucm-pub-01"], "ip": ["10.99.10.40"], "user": ["rkowalski"]}, "service": {"name": "Cisco Unified Communications Manager", "version": "14.0.1.10000-20"}, "source": {"ip": "10.99.10.40"}, "user": {"name": "rkowalski"}}`,
    },
  ],
};
