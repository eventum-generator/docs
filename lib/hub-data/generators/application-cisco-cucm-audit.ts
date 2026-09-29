import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationCiscoCucmAudit: GeneratorMeta = {
  slug: 'application-cisco-cucm-audit',
  displayName: 'Cisco Unified Communications Manager Audit Log',
  category: 'application',
  description:
    'Cisco Unified Communications Manager 14 application audit log rows: Cisco Unified CM Administration logins and logouts and processnode configuration changes by 30 administrator accounts, with the native |LogMessage row in event.original of ECS JSON. About 730 rows a day follow a working day in UTC, peaking at about 70 rows an hour around 10:00-12:00. Recurring episodes show one account adding, updating and deleting the same cluster server record within one session.',
  dataSource:
    'Cisco Unified Communications Manager 14.0.1.10000-20 application audit file (Audit00000001.log, |LogMessage rows)',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native |LogMessage row from the Cisco DevNet sample',
    'About 730 rows a day from 30 administrator accounts',
    'Recurring add, update, delete of one server record',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'In one Administration session from its usual workstation address, one of the eight busiest accounts logs in, adds a server record that is absent from processnode, updates it shortly after (sometimes saving it again), makes zero to several ordinary updates of this or other records, then deletes the record, restoring the table, and logs out or leaves no logout row as other sessions do. user.name and cucm.audit.record.key_value link the add, update and delete, source.ip links the session, and CorrelationID stays empty. Add to delete takes a minute to about a quarter of an hour. anomaly_interval_hours (default 24, a multiple of 24 up to 8760) sets the spacing: the first episode starts within the first interval, capped at 24 hours; each next one starts one interval after the actual start of the previous one, shifted within a window of a quarter of the interval (at most 6 hours) centred on that point, so episodes are 21-27 hours apart at 24 and 45-51 hours apart at 48. Start times favour busy working hours. An episode starts at the first new session at or after that time for which one of the eight busiest accounts is out of session with its pause over and a record is absent that the account has not added in the last two hours; missed episodes are not replayed. Each episode uses a different account (weighted by activity) and a different record than the previous one, and other accounts do not touch its record while it runs. Episode rows come on top of the ordinary activity, so adds, updates and deletes are each about one a day higher at the default interval.',
  generatorId: 'cucm',
  eventTypes: [
    {
      id: 'processnode_updated',
      description: 'GeneralConfigurationUpdate: processnode record updated',
      frequency: '30.9% of rows',
      category: 'configuration',
    },
    {
      id: 'user_login',
      description: 'UserLogging: logged into Cisco Unified CM Admin Webpages',
      frequency: '29.3% of rows',
      category: 'authentication, session',
    },
    {
      id: 'user_logout',
      description:
        'UserLogging: logged out of Cisco Unified Administration Web Pages',
      frequency: '21.6% of rows',
      category: 'authentication, session',
    },
    {
      id: 'processnode_added',
      description: 'GeneralConfigurationUpdate: processnode record added',
      frequency: '9.1% of rows',
      category: 'configuration',
    },
    {
      id: 'processnode_deleted',
      description: 'GeneralConfigurationUpdate: processnode record deleted',
      frequency: '9.1% of rows',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    "Thirty administrator accounts work in Cisco Unified CM Administration, each with its own activity weight: the busiest open a dozen or more sessions a day, the rarest (such as Administrator and breakglass-admin) about three or four. A session comes from the account's usual workstation address or, in about 15% of sessions, a second address, and an account pauses a few minutes to hours (median about 17 minutes) between sessions.",
    'About 730 rows a day (+/- 3% from day to day) follow a working day in UTC: rising from 04:00, peaking at about 70 rows an hour around 10:00-12:00 and fading out by 20:00, with one or two logins an hour at night. Configuration changes fall between 05:00 and 19:00 UTC.',
    'About 40% of daytime sessions and every night session only look around (login, logout). The rest carry one to about a dozen changes one to a few minutes apart (median about two minutes) on 24 processnode server records, about half present at any time: updates, often of the same record several times in a row, a quarter saved again shortly after; adds of absent records, half followed by an update of the same record as in the Cisco sample and more than half of the rest deleted again later in the same session; deletes of present records, some after an update in the same session. About a quarter of sessions end without a logout row because the session expires.',
    'Field names, spacing and the constant values of each form follow the four-row Cisco DevNet Audit00000001.log sample for build 14.0.1.10000-20. The deleted row reuses the added/updated form with the verb seen in Cisco Community posts for other tables; it is not a captured line.',
    'Only successful Administration logins and processnode changes are modeled: no failed logins, other tables (device, numplan, users), Serviceability or CLI events, for lack of primary row examples, so about 360 configuration changes a day land on server records, which real clusters change rarely. Rows of one session are one to a few minutes apart, where a real administrator saving twice produces rows seconds apart. Rates, durations and the operation mix are synthetic workload choices, not measured CUCM production frequencies.',
    'The file HDR line and remote syslog framing (AuditEventGenerated alarms) are not emitted; native rows carry only a UTC time of day and @timestamp supplies the date. cucm.audit.record is parsed from AuditDetails, and the event, user, source and related fields are ECS normalization. Compatibility with the KUMA CUCM 11.5(1) normalizer is not claimed, and no live system output, exact-build trace or maintained Elastic integration was available as a reference.',
    'Every step and each pair of steps of the episode is ordinary administration: without episodes, 14 days hold about 790 updates of a record by the account that added it within the previous two hours, about 250 adds followed by a delete of the same record by the same account and about 140 updates followed by a delete. The complete add, update, delete of one record by one account within two hours never occurs there: such a delete removes another present record instead, about 3 to 4 deletes a day. The detection idea is a server entry staged and then removed, for example to register a rogue node temporarily.',
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
        'Hours between episode starts; a multiple of 24 from 24 to 8760, other values fail validation',
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
      json: String.raw`{"@timestamp": "2026-09-02T06:58:35.314+00:00", "cucm": {"audit": {"app_id": "Cisco Tomcat", "audit_category": "AdministrativeEvent", "audit_details": "record in table processnode with key field name = cucm-dr-01.example.test deleted", "client_address": "10.20.31.5", "cluster_id": "", "component_id": "Cisco CUCM Administration", "compulsory_event": "No", "correlation_id": "", "event_status": "Success", "event_type": "GeneralConfigurationUpdate", "node_id": "cucm-pub-01", "record": {"key_field": "name", "key_value": "cucm-dr-01.example.test", "operation": "deleted", "table": "processnode"}, "resource_accessed": "CUCMAdmin", "severity": 5, "timestamp_local": "06:58:35.314", "user_id": "akumar"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "processnode_deleted", "category": ["configuration"], "code": "GeneralConfigurationUpdate", "dataset": "cucm.audit", "kind": "event", "module": "cucm", "original": "06:58:35.314 |LogMessage   UserID : akumar  ClientAddress : 10.20.31.5  Severity : 5  EventType : GeneralConfigurationUpdate  ResourceAccessed: CUCMAdmin  EventStatus : Success  CompulsoryEvent : No  AuditCategory : AdministrativeEvent  ComponentID : Cisco CUCM Administration  CorrelationID :   AuditDetails :  record in table processnode with key field name = cucm-dr-01.example.test deleted  App ID: Cisco Tomcat Cluster ID:  Node ID: cucm-pub-01", "outcome": "success", "type": ["deletion"]}, "host": {"name": "cucm-pub-01"}, "message": "record in table processnode with key field name = cucm-dr-01.example.test deleted", "related": {"hosts": ["cucm-pub-01"], "ip": ["10.20.31.5"], "user": ["akumar"]}, "service": {"name": "Cisco Unified Communications Manager", "version": "14.0.1.10000-20"}, "source": {"ip": "10.20.31.5"}, "user": {"name": "akumar"}}`,
    },
  ],
};
