import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortianalyzerAudit: GeneratorMeta = {
  slug: 'security-fortinet-fortianalyzer-audit',
  displayName: 'Fortinet FortiAnalyzer Incident Audit',
  category: 'security',
  description:
    "FortiAnalyzer 7.2.4 local application event records (type=appevent subtype=incident) as ECS JSON with the FortiAnalyzer key-value line in event.original, for SOC teams and SIEM engineers who need incident-management audit trails. This is FortiAnalyzer's own incident audit log, not FortiGate traffic forwarded through it. A SOC of twelve analysts raises about 340 incidents a day, about 225 of them by playbooks, in about 2,050 records a day, with analysts on a 07:00-19:00 UTC day shift and playbooks round the clock. Recurring episodes show an analyst's incident whose evidence a second analyst removes before deleting the incident.",
  dataSource:
    'FortiAnalyzer 7.2.4 local APPEVENT / INCIDENT messages 100001-100003, 100005 and 100006 of the Fortinet 7.2.4 log reference',
  eventFormat: 'ECS JSON',
  originalFormat: 'KV',
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Header and trailer of the 7.2.4 application log example',
    'About 2,050 records a day from playbooks and twelve analysts',
    'Recurring evidence removal and deletion by a second analyst',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Analyst C (not system) raises an incident and attaches evidence with the same delay as ordinary first attachments; minutes later analyst D (not C) opens it, optionally updates it, removes that attachment and deletes the incident seconds to minutes later. The records share fortinet.fortianalyzer.incident_id, the attachment add and removal share fortinet.fortianalyzer.attachment, and the removal and deletion share user.name; source.ip is D's current address, so the last two steps usually, but not always, share it. The chain completes within two hours of creation, usually within 90 minutes, and nothing is restored. One chain per anomaly_interval_hours (default 24, minimum 6): the first starts within min(interval, 24 h) of the start of the data, each next one an interval after the actual start of the previous one, give or take half of a window that is a quarter of the interval and at most 6 hours: 21-27 hours apart at the default 24 hours, 7-9 hours at 8 hours, 5.25-6.75 hours at 6 hours. Working hours are strongly preferred; night starts occur mainly at short intervals, and chains are never skipped. C is one of the four busiest analysts, drawn by activity; D is another of them, never the previous chain's D; incident, attachment, severity and delays vary per chain. Playbook-raised incidents are outside the chain, because removing evidence from and deleting one is the ordinary way to close a false positive. Every action, analyst and analyst/address pair of the chain also occurs in ordinary traffic, but there an analyst other than the creator who removed evidence from an analyst-raised incident never also deletes it within two hours of creation. With anomaly_mode false no complete chain is generated.",
  generatorId: 'faz-audit',
  eventTypes: [
    {
      id: 'Incident_Update',
      description: 'Incident updated (message ID 100002)',
      frequency: 'About 47.7% of records',
      category: 'configuration',
    },
    {
      id: 'Incident_Attachment_Add',
      description: 'Evidence attached to an incident (message ID 100005)',
      frequency: 'About 25.5% of records',
      category: 'configuration',
    },
    {
      id: 'New_Incident_Create',
      description:
        'Incident raised by a playbook or an analyst (message ID 100001)',
      frequency: 'About 17.6% of records',
      category: 'configuration',
    },
    {
      id: 'Incident_Attachment_Delete',
      description: 'Attachment removed from an incident (message ID 100006)',
      frequency: 'About 6.1% of records',
      category: 'configuration',
    },
    {
      id: 'Incident_Delete',
      description: 'Incident deleted (message ID 100003)',
      frequency: 'About 3.1% of records',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Twelve analysts, each with an office and a remote-access address, and playbooks (user=system) raise about 340 incidents a day: about 225 by playbooks and 115 by analysts. Each incident has its own lifecycle: evidence attachments, analyst work sessions of one to several operations, occasional attachment removal, and deletion of about one incident in five, from minutes to days after creation.',
    'Playbooks raise incidents and attach evidence round the clock with a peak around 13:00 UTC; analysts work a day shift from 07:00 to 19:00 UTC with core hours 09:00-17:00 and a small night shift, and work left at the end of the day continues the next morning. That gives about 26 records an hour from 19:00 to 07:00, about 100 at 07:00-09:00 and 17:00-19:00, and 150-190 at 09:00-17:00. Weekends and holidays look like weekdays.',
    "An analyst's consecutive operations on one incident are typically 30 seconds to 12 minutes apart (median about 1.5 minutes), and playbook evidence follows its incident within seconds to minutes. About two in five deletions come within an hour of creation, the rest hours to days later. Each analyst keeps the office or the remote-access address for minutes to hours.",
    'Ordinary traffic holds incidents deleted within minutes, attachments removed by an analyst other than the creator, removal followed by deletion by the same analyst, and handovers where one analyst removes the evidence and a colleague deletes the incident minutes later. The assignee (the creator on an analyst-raised incident) deletes in 60% of cases, otherwise a colleague; when a colleague deletes an analyst-raised incident, the evidence was mostly removed by the creator (50%) or a third analyst (35%).',
    'Fortinet publishes the INCIDENT field catalog and message IDs but no complete raw incident record. The line copies the header and trailer of the one complete 7.2.4 application log example (id carries itime_t in its upper 32 bits, dtime equals itime, euid, epid, dsteuid and dstepid keep the value 1); the per-message field set, msg text, desc value, IN plus eight digits incident IDs, lowercase severities and event-ID-style attachment values are assumptions, and user_from=GUI(<address>) follows Elastic test fixtures.',
    "Dates and times are UTC without the tz field, and no Syslog header, CEF form or collector envelope is generated, so compatibility with a FortiAnalyzer collector or a CEF normalizer (for example KUMA's FortiAnalyzer CEF profile) is unverified. The error variants 110001-110006 and Incident_Attachment_Update (100004) are not generated.",
    'Incident status, category, assignment and notes are not modelled; updates change only the severity, sometimes. With anomaly_mode true each chain adds one analyst-raised incident whose evidence a colleague removes and which that colleague deletes within two hours. Rates, weights, delays and analyst names are synthetic lab settings.',
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
      description: 'Interval between chain starts; range 6-8760',
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
      json: String.raw`{"@timestamp": "2026-09-14T09:40:17+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "Incident_Attachment_Delete", "category": ["configuration"], "code": "100006", "dataset": "fortinet.fortianalyzer.appevent", "kind": "event", "original": "id=7685323499194656677 itime=2026-09-14 09:40:17 euid=1 epid=1 dsteuid=1 dstepid=1 vd=root logid=100006 type=appevent subtype=incident level=information date=2026-09-14 time=09:40:17 user=amartin user_from=GUI(10.20.4.21) desc=Incident_Attachment_Delete msg=Attachment deleted from incident IN00000943 incident_id=IN00000943 incident_severity=high attachment=202609141000026412 adom=root devid=FAZ-VMTM26001234 devname=faz-soc-01 dtime=2026-09-14 09:40:17 itime_t=1789378817", "outcome": "success", "type": ["change"]}, "fortinet": {"fortianalyzer": {"adom": "root", "attachment": "202609141000026412", "desc": "Incident_Attachment_Delete", "incident_id": "IN00000943", "incident_severity": "high", "level": "information", "logid": "100006", "subtype": "incident", "type": "appevent", "user_from": "GUI(10.20.4.21)"}}, "observer": {"name": "faz-soc-01", "product": "FortiAnalyzer", "serial_number": "FAZ-VMTM26001234", "type": "siem", "vendor": "Fortinet"}, "related": {"ip": ["10.20.4.21"], "user": ["amartin"]}, "source": {"ip": "10.20.4.21"}, "user": {"name": "amartin"}}`,
    },
  ],
};
