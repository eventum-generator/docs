import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCiscoFmcAudit: GeneratorMeta = {
  slug: 'security-cisco-fmc-audit',
  displayName: 'Cisco Secure Firewall Management Center Audit',
  category: 'security',
  description:
    'Cisco Secure Firewall Management Center (FMC) 7.4 audit Syslog records as ECS JSON for ten administrator accounts: web-interface page views, network object creation, NAT policy saves and the system pre-deploy task records that follow a save. The FMC-originating line is kept verbatim in event.original, in the forms of Cisco TechNote 221019. Recurring episodes show one account creating a network object, saving a NAT policy and saving the same policy again soon after.',
  dataSource:
    'Cisco Secure Firewall Management Center 7.4 audit Syslog, FMC-originating line',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Verbatim FMC-AUDIT Syslog line in event.original',
    'Ten administrators on independent session schedules',
    'Recurring object creation, NAT save and repeated save',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due 24 hours after the first tick by default (minimum 6). It starts at a random delay of up to 30 minutes after it is due (up to an eighth of the interval for short intervals), on the first moment an account is out of session with no own session due within 3 hours; the next episode is due one interval after the actual start, and missed episodes are not replayed. In one extra session from one of its usual addresses, that account creates a network object, saves a NAT policy and saves the same policy again, each save followed by the editor view and the pre-deploy task (0.8 to 8.0 minutes from creation to second save, measured). Account and policy rotate; each step and each pair of steps is ordinary administration, and background never completes the sequence.',
  generatorId: 'fmc',
  eventTypes: [
    {
      id: 'page-view: NGFW NAT Policy Editor',
      description: 'sfdccsm, Devices > NAT > NGFW NAT Policy Editor, Page View',
      frequency: '35.0% measured share',
      category: 'web',
    },
    {
      id: 'page-view: NAT',
      description: 'sfdccsm, Devices > NAT, Page View',
      frequency: '17.7% measured share',
      category: 'web',
    },
    {
      id: 'page-view: /ui/ddd/',
      description: 'mojo_server.pl, /ui/ddd/, Page View (/ui/ddd/ page)',
      frequency: '13.4% measured share',
      category: 'web',
    },
    {
      id: 'nat-policy-save',
      description:
        'sfdccsm, Devices > NAT > NAT Policy Editor, Save Policy <policy>',
      frequency: '10.4% measured share',
      category: 'configuration',
    },
    {
      id: 'login-success',
      description:
        'ActionQueueScrape.pl, Login, Login Success (csm_processes@Default User IP)',
      frequency: '8.8% measured share',
      category: 'authentication',
    },
    {
      id: 'task-completion',
      description:
        'ActionQueueScrape.pl, Task Queue, Successful task completion : Pre-deploy Global Configuration Generation (admin@localhost)',
      frequency: '8.8% measured share',
      category: 'configuration',
    },
    {
      id: 'network-object-create',
      description:
        'sfdccsm, Objects > Object Management > NetworkObject, create <object>',
      frequency: '5.8% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Ten administrator accounts each follow their own random schedule, with lognormal gaps between sessions (per-account median 4 to 20 hours), from the usual workstation address or, in about 15% of sessions, a second one. A session opens on the /ui/ddd/ page or the NAT list and holds one to about twenty actions seconds to minutes apart.',
    'More than half of object creations are followed later in the session by a NAT policy save, and about a fifth of saves are saved again. Every save comes from the editor, which is shown again within a second; after 85% of saves the system logs csm_processes Login Success (median about 20 seconds later) and the pre-deploy task completion about a second after that, as in the Cisco sample.',
    'Chain fragments are ordinary administration: per 14-day background capture, 83 to 125 saves come within an hour after the same account and address created an object, and 61 to 84 save a policy that account and address already saved within the hour. Every episode account and address also occurs in background, and most account, address and policy combinations do.',
    'Every line uses one of the seven forms of the eight Cisco TechNote 221019 (FMCv 7.4.0) lines; only user, address, object name, policy name and time vary. Other menus, object types, deletions, deployments and human logins and logouts are not generated, and failed logins are not modeled because their records carry neither user nor source address.',
    'The [FMC-AUDIT] tag is the one configured in the TechNote and is user-defined on a real FMC; the collector-side prefix is not emitted. The BSD header has no year or zone, one-second precision and a zero-padded day; the time of day is UTC, web sessions have no diurnal pattern, and rates, durations and the action mix are synthetic workload choices.',
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
        'Hours between episode starts, 6 to 8,760; other values fail validation',
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
      json: String.raw`{"@timestamp": "2026-09-02T00:27:23+00:00", "cisco": {"fmc": {"audit": {"message": "Save Policy NAT-DMZ-Web", "policy": "NAT-DMZ-Web", "sender": "sfdccsm", "subsystem": "Devices > NAT > NAT Policy Editor", "tag": "FMC-AUDIT", "user": "jsmith", "user_ip": "10.1.20.14"}}}, "ecs": {"version": "8.17.0"}, "event": {"action": "nat-policy-save", "category": ["configuration"], "dataset": "cisco_fmc.audit", "kind": "event", "module": "cisco_fmc", "original": "Sep 02 00:27:23 firepower: [FMC-AUDIT] sfdccsm: jsmith@10.1.20.14, Devices > NAT > NAT Policy Editor, Save Policy NAT-DMZ-Web", "type": ["change"]}, "message": "Devices > NAT > NAT Policy Editor, Save Policy NAT-DMZ-Web", "observer": {"hostname": "firepower", "product": "Secure Firewall Management Center", "vendor": "Cisco", "version": "7.4.0"}, "process": {"name": "sfdccsm"}, "related": {"hosts": ["firepower"], "ip": ["10.1.20.14"], "user": ["jsmith"]}, "source": {"ip": "10.1.20.14"}, "user": {"name": "jsmith"}}`,
    },
  ],
};
