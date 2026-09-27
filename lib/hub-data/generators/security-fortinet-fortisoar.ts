import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortisoar: GeneratorMeta = {
  slug: 'security-fortinet-fortisoar',
  displayName: 'Fortinet FortiSOAR Alert Deletion Audit',
  category: 'security',
  description:
    'Fortinet FortiSOAR 7.x audit records for deleted alerts, as FortiSOAR forwards them to a syslog server in CEF, from eight analysts working in daytime-weighted sessions, as ECS JSON with the forwarded line in event.original. For SOC teams and SIEM engineers who monitor who removes alerts from their SOAR platform. Recurring episodes show one analyst deleting nine or more alerts from one address within two minutes.',
  dataSource:
    'Fortinet FortiSOAR 7.x audit log, Basic detail, forwarded over syslog in CEF',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 1,
  templateCount: 1,
  highlights: [
    'Fortinet-published CEF header and all twelve extension keys',
    'Eight analysts with daytime sessions and multi-alert deletes',
    'Recurring mass deletion of nine or more alerts in two minutes',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One chain is due every 24 hours of source time by default (minimum 6): the first at a random point within the first interval, each next one interval after the actual start of the previous chain. After it is due, a random delay of up to min(interval / 4, 6 h) passes, weighted by the daytime session shape with a small night floor, so at a fixed interval the start drifts around the clock; missed chains are not caught up. Measured gaps 24.1-31.4 h at 24 h and 12.5-15.6 h at 12 h. The chain starts on the next session of an analyst other than the analyst of the previous chain: in addition to the ordinary deletions of that session, the analyst deletes 10-15 more alerts from the session address in quick successive deletes 2-40 s apart, all within about 100 seconds. Background has up to eight deletions by one analyst from one address within two minutes, never nine.',
  generatorId: 'fortisoar',
  eventTypes: [
    {
      id: 'Alert Deleted',
      description: 'Delete an alert record',
      frequency: '100% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Eight analysts delete alerts independently, starting work sessions at random times, more often during the day (peak around 12:30 UTC), with a busier or quieter activity level per day. A session is a few deletions of one to a few alerts at a time, seconds to many minutes apart, from the office address or, for some sessions, a remote-access address.',
    'One delete of several selected alerts writes one record per alert, milliseconds apart, and every record deletes a different alert. The record keeps the CEF header and all twelve extension keys in the order of the Fortinet sample.',
    'Background contains every analyst and address pair, multi-alert and quick successive deletes, and up to eight deletions by one analyst from one address within two minutes; an analyst reaching eight pauses by an ordinary gap instead of changing actor. In seven 10-day background captures, nine deletions within 132 seconds occur 0-4 times per capture and within 180 seconds 1-8 times.',
    'Only the Alert Deleted class is generated, since Fortinet publishes a complete forwarded line only for it; create, update, link, login and recycle-bin restores are not. The number in msg is treated as the alert ID although the guide calls this part the record title, and playbookName and playbookId stay empty because playbook deletions are not modeled.',
    'The syslog header time is the forwarding time, a fraction of a second after the audit time; the larger difference in the Fortinet sample is unexplained. Times are UTC, only the Basic audit detail level is modeled, and the 2-second input tick writes a multi-alert delete a few seconds after its timestamps in live mode.',
    'Chain hours follow the daytime curve only loosely, so night chains are more common than night deletions in the background. Rates, weights, delays and analyst names are synthetic lab settings, and compatibility with the KUMA Syslog-CEF normalizer for FortiSOAR is untested.',
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
      description: 'Source-time interval between chain due times, 6 to 8,760',
    },
    {
      name: 'sessions_per_day',
      defaultValue: '60',
      description:
        'Average number of analyst work sessions per day, all analysts together, 2 to 2,000',
    },
    {
      name: 'alerts_per_day',
      defaultValue: '900',
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
      title: 'First record of an anomaly chain, office address',
      json: String.raw`{"@timestamp": "2026-03-06T09:23:32.085+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "alert_deleted", "category": ["configuration"], "code": "Alert Deleted", "created": "2026-03-06T09:23:32.106044+00:00", "dataset": "fortinet.fortisoar.audit", "kind": "event", "original": "2026-03-06T09:23:32.106044+00:00 fsrprimary fortisoar-audit-log: CEF:0|Fortinet Inc|FortiSOAR|7.0.0|Alert Deleted|Alert Deleted|1|devid=\"FSRVMPTM20000061\" vd=\"enterprise\" level=\"warning\" type=\"Audit Log\" msg=\"Alert [150926] Deleted \" src=\"10.30.4.37\" suid=\"9446b38d-318b-4647-a109-e15432fa9365\" suser=\"Marco Bellini\" end=1772789012085 playbookName=\"\" playbookId=\"\" eventTimeStr=\"06 Mar 2026 09:23:32.085\"", "severity": 1, "type": ["deletion"]}, "fortinet": {"fortisoar": {"alert_id": 150926, "device_id": "FSRVMPTM20000061", "log_type": "Audit Log", "operation": "Delete", "record_type": "Alert", "virtual_domain": "enterprise"}}, "log": {"level": "warning", "logger": "fortisoar-audit-log"}, "observer": {"hostname": "fsrprimary", "product": "FortiSOAR", "serial_number": "FSRVMPTM20000061", "vendor": "Fortinet", "version": "7.0.0"}, "related": {"ip": ["10.30.4.37"], "user": ["Marco Bellini"]}, "source": {"ip": "10.30.4.37"}, "user": {"id": "9446b38d-318b-4647-a109-e15432fa9365", "name": "Marco Bellini"}}`,
    },
  ],
};
