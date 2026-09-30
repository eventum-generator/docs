import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCiscoFmcAudit: GeneratorMeta = {
  slug: 'security-cisco-fmc-audit',
  displayName: 'Cisco Secure Firewall Management Center Audit',
  category: 'security',
  description:
    'Cisco Secure Firewall Management Center (FMC) 7.4 audit Syslog records as ECS JSON for 24 administrator accounts: web-interface page views, network object creation, NAT policy saves and the system pre-deploy task records that follow a save. The FMC-originating line is kept verbatim in event.original, in the forms of Cisco TechNote 221019. About 1,250 records a day follow a working day in UTC. Recurring episodes show one account creating a network object, saving a NAT policy and saving the same policy again soon after.',
  dataSource:
    'Cisco Secure Firewall Management Center 7.4 audit Syslog, FMC-originating line',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Verbatim FMC-AUDIT Syslog line in event.original',
    'About 1,250 records a day from 24 administrators on a working day',
    'Recurring object creation, NAT save and repeated save',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'In one session of one of the six busiest accounts, from one of its usual addresses, the account creates a network object, saves a NAT policy and saves the same policy again, with zero to a few page views around the steps; each save is followed by the editor view and, as for any save, usually by the system login and the pre-deploy task, and the session ends without a logout record. user.name and source.ip link the three steps, cisco.fmc.audit.policy links the two saves, and the system records link to a save only by time. From the first matching create to the second save takes about 5 to 50 minutes. anomaly_interval_hours (default 24, whole days) sets the spacing: the first episode starts within the first 24 hours, each next one within a six-hour window centred one interval after the previous start, between 06:00 and 17:00 UTC and favouring the busiest hours; missed episodes are not replayed. Each episode uses a different account and policy than the previous one and a new object name. Each step and each pair of steps is ordinary administration, but background never completes the sequence within the hour: a save that would complete it goes to another policy instead, about one save in five.',
  generatorId: 'fmc',
  eventTypes: [
    {
      id: 'page-view: NGFW NAT Policy Editor',
      description: 'sfdccsm, Devices > NAT > NGFW NAT Policy Editor, Page View',
      frequency: '31.0% of records',
      category: 'web',
    },
    {
      id: 'page-view: NAT',
      description: 'sfdccsm, Devices > NAT, Page View',
      frequency: '18.9% of records',
      category: 'web',
    },
    {
      id: 'page-view: /ui/ddd/',
      description: 'mojo_server.pl, /ui/ddd/, Page View (/ui/ddd/ page)',
      frequency: '13.3% of records',
      category: 'web',
    },
    {
      id: 'nat-policy-save',
      description:
        'sfdccsm, Devices > NAT > NAT Policy Editor, Save Policy <policy>',
      frequency: '11.8% of records',
      category: 'configuration',
    },
    {
      id: 'login-success',
      description:
        'ActionQueueScrape.pl, Login, Login Success (csm_processes@Default User IP)',
      frequency: '10.0% of records',
      category: 'authentication',
    },
    {
      id: 'task-completion',
      description:
        'ActionQueueScrape.pl, Task Queue, Successful task completion : Pre-deploy Global Configuration Generation (admin@localhost)',
      frequency: '10.0% of records',
      category: 'configuration',
    },
    {
      id: 'network-object-create',
      description:
        'sfdccsm, Objects > Object Management > NetworkObject, create <object>',
      frequency: '5.0% of records',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Twenty-four administrator accounts work in web-interface sessions that open on the /ui/ddd/ page or the NAT list and hold one to about twenty actions seconds to minutes apart (most often a few), followed by a pause of about 17 minutes in median, up to several hours. The six busiest accounts write about 850 to 1,100 records in two weeks, the quietest about 250; about 15% of sessions come from a second address instead of the usual workstation.',
    'About 1,250 records a day, with 3% variation from day to day, follow a working day in UTC: activity rises from 04:00, peaks at about 130 records an hour around 11:00 and fades out by 20:00, with about 1-6 records an hour between 21:00 and 03:00. Configuration changes happen between 05:00 and 19:00 UTC; off-hours records are page views only. Sessions of several administrators overlap and their records interleave.',
    'More than half of object creations are followed later in the session by a NAT policy save. Saves of the ten NAT policies always come from the editor, which is shown again right after, and about a fifth of saves are saved again later in the session; after 85% of saves the system logs csm_processes Login Success and the pre-deploy task completion, as in the Cisco sample.',
    'Records that follow at once on a real FMC are further apart here: the editor view after a save and the task completion after the system login come a few seconds to about a minute and a half later (median about 25 seconds) instead of within a second, and the system login comes a median 1.7 minutes after the save instead of about 20 seconds. After an object is created, a later save in the hour goes to a different policy than the one already saved more often than on a real system. Rates, durations and the action mix are synthetic workload choices, not measured FMC production frequencies.',
    'Every line uses one of the seven forms of the eight Cisco TechNote 221019 (FMCv 7.4.0) lines; only user, address, object name, policy name and time vary. Other menus, object types, deletions, deployments and human logins and logouts are not generated, and failed logins are not modeled because their records carry neither user nor source address.',
    'The [FMC-AUDIT] tag is the one configured in the TechNote and is user-defined on a real FMC; the collector-side prefix is not emitted. The BSD header has no year or zone, one-second precision and a zero-padded day; @timestamp supplies the date and the time of day is UTC.',
    'cisco.fmc.audit.* is parsed from the line, while event.*, user.*, source.*, process.*, observer.* and related.* are ECS normalization, as no Elastic integration for FMC audit Syslog was found. The record never names the changed rule or object, so a revert is inferred from the repeated save. Compatibility with the KUMA CEF normalizer is not claimed, and no live capture was available for comparison.',
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
        'Hours between episode starts; a multiple of 24 from 24 to 8,760, other values fail validation',
    },
    {
      name: 'management_center',
      defaultValue: 'firepower',
      description: 'FMC hostname in the Syslog header and observer.hostname',
    },
  ],
  sampleOutputs: [
    {
      title: 'Second save of the same NAT policy in an episode',
      json: String.raw`{"@timestamp": "2026-09-02T10:47:26+00:00", "cisco": {"fmc": {"audit": {"message": "Save Policy NATPolicy", "policy": "NATPolicy", "sender": "sfdccsm", "subsystem": "Devices > NAT > NAT Policy Editor", "tag": "FMC-AUDIT", "user": "akumar", "user_ip": "10.1.21.5"}}}, "ecs": {"version": "8.17.0"}, "event": {"action": "nat-policy-save", "category": ["configuration"], "dataset": "cisco_fmc.audit", "kind": "event", "module": "cisco_fmc", "original": "Sep 02 10:47:26 firepower: [FMC-AUDIT] sfdccsm: akumar@10.1.21.5, Devices > NAT > NAT Policy Editor, Save Policy NATPolicy", "type": ["change"]}, "message": "Devices > NAT > NAT Policy Editor, Save Policy NATPolicy", "observer": {"hostname": "firepower", "product": "Secure Firewall Management Center", "vendor": "Cisco", "version": "7.4.0"}, "process": {"name": "sfdccsm"}, "related": {"hosts": ["firepower"], "ip": ["10.1.21.5"], "user": ["akumar"]}, "source": {"ip": "10.1.21.5"}, "user": {"name": "akumar"}}`,
    },
  ],
};
