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
    'About every 24 hours by default (minimum 6; the first due at a random moment within the first 24 hours, each next one due one interval after the actual start of the previous one, shifted uniformly within a window of a quarter of the interval, at most 6 hours, centred on that point; a start waits until an account and an absent record are free, and missed episodes are not replayed), one account logs in from one of its usual addresses, adds a server record absent from processnode, updates it seconds later, then deletes it, restoring the table (0.3-4.3 minutes from add to delete, measured). Accounts and records rotate; every step and each pair of steps also occurs in background, and only the complete add, update, delete of one record by one account within two hours is episode-only.',
  generatorId: 'cucm',
  eventTypes: [
    {
      id: 'processnode_updated',
      description: 'GeneralConfigurationUpdate: processnode record updated',
      frequency: '31.6% measured share',
      category: 'configuration',
    },
    {
      id: 'user_login',
      description: 'UserLogging: logged into Cisco Unified CM Admin Webpages',
      frequency: '26.9% measured share',
      category: 'authentication, session',
    },
    {
      id: 'user_logout',
      description: 'UserLogging: logged out of Cisco Unified Administration',
      frequency: '21.5% measured share',
      category: 'authentication, session',
    },
    {
      id: 'processnode_deleted',
      description: 'GeneralConfigurationUpdate: processnode record deleted',
      frequency: '10.1% measured share',
      category: 'configuration',
    },
    {
      id: 'processnode_added',
      description: 'GeneralConfigurationUpdate: processnode record added',
      frequency: '9.9% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Twelve administrator accounts each follow their own schedule: sessions every few hours to a few days (per-account median 3 to 30 hours), from the usual workstation or, in about 15% of sessions, a second address. About 40% of sessions only look around, and about a quarter end without a logout row because the session expires.',
    'The other sessions carry one to about fifteen changes seconds to minutes apart on 24 processnode server records, each present or absent: repeated updates and quick re-saves, adds often followed by an update of the same record as in the Cisco sample or deleted again in the same session, and deletes of present records.',
    'Field names, spacing and constant values follow the four-row Cisco DevNet Audit00000001.log sample for build 14.0.1.10000-20. The deleted row reuses the added/updated form with the verb seen in Cisco Community posts for other tables; it is not a captured line.',
    'Only successful Administration logins and processnode changes are modeled: no failed logins, other tables, Serviceability or CLI events, for lack of primary row examples, so configuration volume is concentrated on server records. Rates, durations and the operation mix are synthetic workload choices.',
    'The file HDR line and remote syslog framing are not emitted; native rows carry only a UTC time of day and @timestamp supplies the date. cucm.audit.record is parsed from AuditDetails. Compatibility with the KUMA CUCM 11.5(1) normalizer is not claimed, and no live capture was available.',
    'Per 14-day background capture: 105-160 updates of a record by the account that added it within two hours, 36-50 adds followed by a delete and 17-30 updates followed by a delete. An ordinary delete is skipped only when it would complete the chain (same account added the record at most two hours earlier and updated it since); the same delete after two hours, by another account or of another record is written as usual. The detection idea is a server entry staged and then removed, for example to register a rogue node temporarily.',
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
      json: String.raw`{"@timestamp": "2026-09-01T01:35:09.934+00:00", "cucm": {"audit": {"app_id": "Cisco Tomcat", "audit_category": "AdministrativeEvent", "audit_details": "record in table processnode with key field name = cucm-lab-02.example.test deleted", "client_address": "10.20.31.5", "cluster_id": "", "component_id": "Cisco CUCM Administration", "compulsory_event": "No", "correlation_id": "", "event_status": "Success", "event_type": "GeneralConfigurationUpdate", "node_id": "cucm-pub-01", "record": {"key_field": "name", "key_value": "cucm-lab-02.example.test", "operation": "deleted", "table": "processnode"}, "resource_accessed": "CUCMAdmin", "severity": 5, "timestamp_local": "01:35:09.934", "user_id": "akumar"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "processnode_deleted", "category": ["configuration"], "code": "GeneralConfigurationUpdate", "dataset": "cucm.audit", "kind": "event", "module": "cucm", "original": "01:35:09.934 |LogMessage   UserID : akumar  ClientAddress : 10.20.31.5  Severity : 5  EventType : GeneralConfigurationUpdate  ResourceAccessed: CUCMAdmin  EventStatus : Success  CompulsoryEvent : No  AuditCategory : AdministrativeEvent  ComponentID : Cisco CUCM Administration  CorrelationID :   AuditDetails :  record in table processnode with key field name = cucm-lab-02.example.test deleted  App ID: Cisco Tomcat Cluster ID:  Node ID: cucm-pub-01", "outcome": "success", "type": ["deletion"]}, "host": {"name": "cucm-pub-01"}, "message": "record in table processnode with key field name = cucm-lab-02.example.test deleted", "related": {"hosts": ["cucm-pub-01"], "ip": ["10.20.31.5"], "user": ["akumar"]}, "service": {"name": "Cisco Unified Communications Manager", "version": "14.0.1.10000-20"}, "source": {"ip": "10.20.31.5"}, "user": {"name": "akumar"}}`,
    },
  ],
};
