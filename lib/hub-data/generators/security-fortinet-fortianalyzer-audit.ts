import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortianalyzerAudit: GeneratorMeta = {
  slug: 'security-fortinet-fortianalyzer-audit',
  displayName: 'Fortinet FortiAnalyzer Incident Audit',
  category: 'security',
  description:
    "FortiAnalyzer 7.2.4 local application event records (type=appevent subtype=incident) as ECS JSON with the FortiAnalyzer key-value line in event.original, for SOC teams and SIEM engineers who need incident-management audit trails. This is FortiAnalyzer's own incident audit log, not FortiGate traffic forwarded through it: playbooks and eight analysts create, update, attach evidence to and delete incidents. Recurring episodes show evidence on one analyst's incident removed, and the incident deleted, by another analyst.",
  dataSource:
    'FortiAnalyzer 7.2.4 local APPEVENT / INCIDENT messages 100001-100003, 100005 and 100006 of the Fortinet 7.2.4 log reference',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Header and trailer of the 7.2.4 application log example',
    'Per-incident lifecycles from playbooks and eight analysts',
    'Recurring evidence removal and deletion by a second analyst',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One chain per 24 hours of source time by default (minimum 6): the first becomes due between 0.3 and 1.0 intervals after the start, each next one interval after the actual start of the previous chain. After it is due, a random delay of up to min(1 h, interval / 8) passes and the chain starts on the next incident an analyst raises through the ordinary arrival process; missed chains are not caught up. Analyst C creates the incident and attaches evidence; minutes later analyst D (never C, never the previous chain's D) optionally updates it, removes that attachment and deletes the incident seconds to minutes later, all within 100 minutes of creation. Playbook-raised incidents are outside the chain. Every action, actor and address pair also occurs in background; only a non-creator who removed evidence deleting an analyst-raised incident within two hours is kept out of it. Measured gaps: 24.5-27.7 h at the default 24 h.",
  generatorId: 'faz-audit',
  eventTypes: [
    {
      id: 'Incident_Update',
      description: 'Incident updated (message ID 100002)',
      frequency: '32.6% measured share',
      category: 'configuration',
    },
    {
      id: 'Incident_Attachment_Add',
      description: 'Evidence attached to an incident (message ID 100005)',
      frequency: '31.9% measured share',
      category: 'configuration',
    },
    {
      id: 'New_Incident_Create',
      description:
        'Incident raised by a playbook or an analyst (message ID 100001)',
      frequency: '21.4% measured share',
      category: 'configuration',
    },
    {
      id: 'Incident_Attachment_Delete',
      description: 'Attachment removed from an incident (message ID 100006)',
      frequency: '8.7% measured share',
      category: 'configuration',
    },
    {
      id: 'Incident_Delete',
      description: 'Incident deleted (message ID 100003)',
      frequency: '5.4% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Incidents arrive at a rate that peaks in the afternoon (UTC), incidents_per_day (36 by default) on average. About 62% are raised by playbooks (user=system), the rest by one of eight analysts whose workstation and remote-access addresses and activity weights are in samples/analysts.json.',
    'Each incident gets its own random lifecycle: evidence attachments, analyst work sessions of one to several operations seconds to minutes apart, occasional attachment removal, and deletion of about one incident in five, from minutes to days after creation. Each analyst keeps one address (office or remote access) for minutes to hours before possibly switching.',
    'Background holds incidents deleted within minutes, attachments removed by an analyst other than the creator, removal followed by deletion by the same analyst, and handovers where a colleague deletes the incident minutes after a removal. A deletion is done by the assignee in 60% of cases; on analyst-raised incidents only the final step is guarded, by redrawing the deleter while keeping the time.',
    'Fortinet publishes the INCIDENT field catalog and message IDs but no complete raw incident record. The line copies the header and trailer of the one complete 7.2.4 application log example (id carries itime_t in its upper 32 bits, dtime equals itime); the per-message field set, msg text, desc value, IN plus eight digits incident IDs, lowercase severities and attachment values are assumptions, and user_from=GUI(<address>) follows Elastic test fixtures.',
    "Dates and times are UTC without the tz field, and no Syslog header, CEF form or collector envelope is generated, so compatibility with a FortiAnalyzer collector or a CEF normalizer (for example KUMA's FortiAnalyzer CEF profile) is unverified. The error variants 110001-110006 and Incident_Attachment_Update (100004) are not generated.",
    'Incident status, category, assignment and notes are not modelled; updates change only the severity, sometimes. Rates, weights, delays and analyst names are synthetic lab settings.',
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
      description: 'Source-time interval between chain starts; range 6-8760',
    },
    {
      name: 'incidents_per_day',
      defaultValue: '36',
      description: 'Average number of incidents raised per day (4-2000)',
    },
    {
      name: 'analyzer_serial',
      defaultValue: 'FAZ-VMTM26001234',
      description: 'devid of the FortiAnalyzer unit',
    },
    {
      name: 'analyzer_name',
      defaultValue: 'faz-soc-01',
      description: 'devname of the FortiAnalyzer unit',
    },
    {
      name: 'adom',
      defaultValue: 'root',
      description: 'vd and adom values',
    },
  ],
  sampleOutputs: [
    {
      title: 'Incident_Attachment_Delete of anomaly chain step 3',
      json: String.raw`{"@timestamp": "2026-09-01T11:17:55+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "Incident_Attachment_Delete", "category": ["configuration"], "code": "100006", "dataset": "fortinet.fortianalyzer.appevent", "kind": "event", "original": "id=7680524551845518376 itime=2026-09-01 11:17:55 euid=1 epid=1 dsteuid=1 dstepid=1 vd=root logid=100006 type=appevent subtype=incident level=information date=2026-09-01 time=11:17:55 user=gpetrov user_from=GUI(10.20.6.8) desc=Incident_Attachment_Delete msg=Attachment deleted from incident IN00000621 incident_id=IN00000621 incident_severity=critical attachment=202609011000050736 adom=root devid=FAZ-VMTM26001234 devname=faz-soc-01 dtime=2026-09-01 11:17:55 itime_t=1788261475", "outcome": "success", "type": ["change"]}, "fortinet": {"fortianalyzer": {"adom": "root", "attachment": "202609011000050736", "desc": "Incident_Attachment_Delete", "incident_id": "IN00000621", "incident_severity": "critical", "level": "information", "logid": "100006", "subtype": "incident", "type": "appevent", "user_from": "GUI(10.20.6.8)"}}, "observer": {"name": "faz-soc-01", "product": "FortiAnalyzer", "serial_number": "FAZ-VMTM26001234", "type": "siem", "vendor": "Fortinet"}, "related": {"ip": ["10.20.6.8"], "user": ["gpetrov"]}, "source": {"ip": "10.20.6.8"}, "user": {"name": "gpetrov"}}`,
    },
  ],
};
