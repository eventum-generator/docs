import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortisoar: GeneratorMeta = {
  slug: 'security-fortinet-fortisoar',
  displayName: 'Fortinet FortiSOAR Alert Deletion Audit',
  category: 'security',
  description:
    'Fortinet FortiSOAR 7.x audit records for deleted alerts, as FortiSOAR forwards them to a syslog server in CEF, as ECS JSON with the forwarded line in event.original. For SOC teams and SIEM engineers who monitor who removes alerts from their SOAR platform. About 2,940 deletions a day from 64 analysts of a round-the-clock SOC, more during the working day. Recurring episodes show one analyst deleting nine alerts from one address within two minutes.',
  dataSource:
    'Fortinet FortiSOAR 7.x audit log, Basic detail, forwarded over syslog in CEF',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 1,
  templateCount: 1,
  highlights: [
    'Fortinet-published CEF header and all twelve extension keys',
    'About 2,940 deletions a day from 64 analysts',
    'Recurring mass deletion of nine alerts in two minutes',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One analyst, from one address, deletes nine alerts within two minutes. The chain starts on an ordinary work session of the analyst: on top of that session's own deletions, the analyst deletes more alerts in quick successive deletes of one to a few alerts each, 2-40 s apart, until nine alerts have been deleted from that address within 120 seconds (the session's own deletions in those two minutes count toward the nine), and then continues the session at the ordinary pace. The records share user.name, user.id and source.ip, every record deletes a different alert, and deleted alerts are not restored. One chain is due per anomaly_interval_hours (default 24, minimum 6) of event time. The first starts within the first min(interval, 24 h), at an hour drawn from the daily curve of deletions; each next one is due one interval after the actual start of the previous one and starts within min(interval / 8, 3 h) before or after that due time, at an hour weighted by the square of the daily curve with a small floor, so every hour stays possible. Missed chains are not caught up. Gaps between chains are about 21-27 hours at the default interval and about 10.5-13.5 hours at 12 hours. The analyst is drawn with the same weights as ordinary sessions but never gets two chains in a row; the address is the office address or, for the ten most active analysts, the remote-access address, with the same odds as their ordinary sessions. Background has up to eight deletions by one analyst from one address within two minutes, never nine.",
  generatorId: 'fortisoar',
  eventTypes: [
    {
      id: 'Alert Deleted',
      description: 'Delete an alert record',
      frequency: '100% of records',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Sixty-four analysts of a large, round-the-clock SOC delete alerts independently of each other, in work sessions that are more frequent during the day. A session is a few deletions of one to a few alerts at a time, and deletes of one session follow each other after 4 seconds to 25 minutes (about two minutes typically). Each analyst makes between 0.6% and 3.7% of the deletions and is busier on some days and quieter on others.',
    'About 2,940 deletions a day (2,720-3,130 on individual days), UTC: about 60 an hour from 19:00 to 06:00, rising through 88, 126 and 167 an hour to about 215-220 an hour from 09:00 to 16:00, then falling through 165, 124 and 85. Weekends look like weekdays: the volume follows the same daily curve every day.',
    'Deletes select one alert in 71% of cases, two in 22%, three in 5% and four or more in the rest. One delete writes one record per alert, about 0.2 seconds apart (0.46 s at the 90th percentile); the selected alerts sit close together in the grid, recent ones below the current alert ID, and no alert is deleted twice.',
    "85% of sessions come from the analyst's office address and 15% from the analyst's remote-access address; a session keeps its address. Both modes contain every analyst and address pair a chain can use, multi-alert and quick successive deletes, and bursts of up to eight deletions by one analyst from one address within two minutes: about five sessions a day reach eight, eight reach seven and eighteen reach six, and none reaches nine. After eight such deletions, the analyst's next deletion comes after an ordinary gap between deletes.",
    'Only the Alert Deleted class is generated, since Fortinet publishes a complete forwarded line only for it (identical in the 7.2.0 and 7.6.5 administration guides); create, update, link, login and recycle-bin restores are not. The record keeps the CEF header and all twelve extension keys in the order of the Fortinet sample. The number in msg is treated as the alert ID although the guide calls this part the record title, and playbookName and playbookId stay empty because deletions by playbooks are not modeled.',
    'The syslog header time is the forwarding time, a fraction of a second after the audit time in end and eventTimeStr; the larger difference in the Fortinet sample is unexplained. Times are UTC, and only the Basic audit detail level is modeled.',
    "Chains start nearly all between 06:00 and 18:00 UTC, against about 74% of ordinary deletions, and a chain is exactly nine deletions within two minutes, while a real mass deletion may go on longer. The daily volume is the same in both modes, so a chain's few extra deletions replace ordinary ones in the hour after it; later hours are unchanged. Rates, weights, delays and analyst names are synthetic lab settings, and compatibility with the KUMA Syslog-CEF normalizer for FortiSOAR is untested.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit the anomaly chain on top of the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Event-time interval between chain due times, 6 to 8,760',
    },
    {
      name: 'alerts_per_day',
      defaultValue: '10800',
      description:
        'Rate at which alert IDs grow; deletions pick recent alerts below the current ID, 50 to 1,000,000',
    },
    {
      name: 'device_name',
      defaultValue: 'fsrprimary',
      description: 'Syslog hostname of the FortiSOAR node',
    },
    {
      name: 'device_id',
      defaultValue: 'FSRVMPTM20000061',
      description: 'devid, the FortiSOAR serial number from the license',
    },
    {
      name: 'device_version',
      defaultValue: '7.0.0',
      description: 'CEF device version, as in the Fortinet sample',
    },
    {
      name: 'virtual_domain',
      defaultValue: 'enterprise',
      description: 'vd: enterprise, master or tenant',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ninth deletion of an anomaly chain, office address',
      json: String.raw`{"@timestamp": "2026-03-02T06:17:57.292+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "alert_deleted", "category": ["configuration"], "code": "Alert Deleted", "created": "2026-03-02T06:17:57.488412+00:00", "dataset": "fortinet.fortisoar.audit", "kind": "event", "original": "2026-03-02T06:17:57.488412+00:00 fsrprimary fortisoar-audit-log: CEF:0|Fortinet Inc|FortiSOAR|7.0.0|Alert Deleted|Alert Deleted|1|devid=\"FSRVMPTM20000061\" vd=\"enterprise\" level=\"warning\" type=\"Audit Log\" msg=\"Alert [223758] Deleted \" src=\"10.30.2.190\" suid=\"5494f6a2-d621-4d4d-8e2d-786696290a61\" suser=\"Nadia Benali\" end=1772432277292 playbookName=\"\" playbookId=\"\" eventTimeStr=\"02 Mar 2026 06:17:57.292\"", "severity": 1, "type": ["deletion"]}, "fortinet": {"fortisoar": {"alert_id": 223758, "device_id": "FSRVMPTM20000061", "log_type": "Audit Log", "operation": "Delete", "record_type": "Alert", "virtual_domain": "enterprise"}}, "log": {"level": "warning", "logger": "fortisoar-audit-log"}, "observer": {"hostname": "fsrprimary", "product": "FortiSOAR", "serial_number": "FSRVMPTM20000061", "vendor": "Fortinet", "version": "7.0.0"}, "related": {"ip": ["10.30.2.190"], "user": ["Nadia Benali"]}, "source": {"ip": "10.30.2.190"}, "user": {"id": "5494f6a2-d621-4d4d-8e2d-786696290a61", "name": "Nadia Benali"}}`,
    },
  ],
};
