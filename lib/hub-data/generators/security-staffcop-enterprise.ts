import type { GeneratorMeta } from '@/lib/hub-types';

export const securityStaffcopEnterprise: GeneratorMeta = {
  slug: 'security-staffcop-enterprise',
  displayName: 'Staffcop Enterprise Syslog',
  category: 'security',
  description:
    'Staffcop Enterprise 5.8 Syslog connector records in the native key-value format: Screenshot and Stat events from 40 employee workstations with the names of every policy each event matched, as native text in event.original with an inferred ECS mapping. For SIEM and UEBA rule authors; the optional CEF format is not emitted. Recurring episodes show one finance employee capturing finance data with PrintScreen and then using cloud storage.',
  dataSource: 'Staffcop Enterprise 5.8 Syslog connector, native key-value',
  format: ['JSON', 'ECS', 'Syslog', 'KV'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Native Syslog connector key-value line in event.original',
    'Independent work bouts of 40 employees in five departments',
    'Recurring finance-data, PrintScreen, cloud-storage chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Every 24 hours of source time by default (the first episode is due one interval after generation starts; once due, it starts after a random delay that follows the finance staff's working-hours load, mean 45 minutes at full load, so an episode due at night or on a weekend waits for working hours; the next is due one interval after that actual start, with no catch-up), one finance employee within 30 minutes takes a Screenshot in an office application matching the finance-data policy, a Screenshot in the same application matching the PrintScreen policy, a browser Screenshot matching the cloud-storage policy, and a Stat for that browser matching both cloud storage and finance data. The employee differs from the previous episode; every step and partial chains by the same employee occur in ordinary traffic, and only the complete ordered sequence is kept out of it.",
  generatorId: 'staffcop',
  eventTypes: [
    {
      id: 'Screenshot',
      description: 'Workstation screenshot, with zero or more matched policies',
      frequency: '89.9% measured share',
      category: 'host',
    },
    {
      id: 'Stat',
      description:
        'Activity statistics record closing a work bout in one application',
      frequency: '10.1% measured share',
      category: 'host',
    },
  ],
  realismFeatures: [
    '40 employees (10 finance, 9 sales, 9 development, 5 HR, 7 IT), each with a fixed workstation and address, work independently: bouts start as a Poisson process with a per-employee rate and a personal working-hours curve with quiet nights, a lunch dip and quiet weekends. The final 100-hour default capture holds 31,290 records; rates and probabilities are synthetic training assumptions, not measured Staffcop volume.',
    'The application mix depends on the department and policy matches on the application and on whether the employee works with finance data: 86% of records match no policy, 13% one and 0.7% two or three.',
    'The syslog header carries the connector dump time, advancing in steps of about 300 s as the vendor documents a dump once in 5 minutes, while time and @timestamp hold the event time. The server id increases with random steps, since events of other types not selected by the connector filter consume ids too.',
    'Every chain step occurs in the background of both modes, including the final Stat with both policies (about 26 per 100 hours) and partial chains by the same employee; an ordinary Stat that would complete the sequence loses its finance policy. Policies are Staffcop matches, not proof of intent, and a policy count is not a severity scale.',
    'The vendor publishes three raw lines and no field specification, so only Screenshot and Stat are modelled; intercepted files, keyboard, web and other event classes are not. The policy_N order is random, day padding is assumed to be syslog space padding, and both clocks are treated as UTC.',
    'Records are ordered by event time, while a real syslog file is ordered by dump time; agent upload delays appear only in the header time. The optional CEF export and SIEM-side normalizers are out of scope, and with no Elastic integration for Staffcop the ECS mapping is inferred.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add periodic episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2 to 8,760',
    },
    {
      name: 'syslog_host',
      defaultValue: 'staffcop-srv',
      description:
        'Staffcop server hostname in the syslog header and observer.hostname',
    },
    {
      name: 'policy_finance',
      defaultValue: 'Финансовые данные',
      description: 'Finance-data policy (chain steps 1 and 4)',
    },
    {
      name: 'policy_printscreen',
      defaultValue: 'Перехват PrintScreen',
      description: 'PrintScreen policy (chain step 2)',
    },
    {
      name: 'policy_cloud',
      defaultValue: 'Облачные хранилища',
      description: 'Cloud storage policy (chain steps 3 and 4)',
    },
    {
      name: 'policy_social',
      defaultValue: 'Социальные сети',
      description: 'Social networks policy (background)',
    },
    {
      name: 'policy_messengers',
      defaultValue: 'Мессенджеры',
      description: 'Messengers policy (background)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final Stat of the first episode',
      json: String.raw`{"@timestamp": "2026-09-29T06:30:50+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "Stat", "category": ["host"], "created": "2026-09-29T06:33:49+00:00", "dataset": "staffcop.syslog", "id": "484668", "kind": "event", "original": "Sep 29 06:33:49 staffcop-srv staffcop: id=\"484668\" time=\"Sep 29 06:30:50\" event=\"Stat\" computer=\"WS-120\" ip=\"10.20.4.194\" user=\"d.smirnov\" app=\"chrome\" policy_1=\"\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435\" policy_2=\"\u041e\u0431\u043b\u0430\u0447\u043d\u044b\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430\"", "type": ["info"]}, "host": {"ip": ["10.20.4.194"], "name": "WS-120"}, "log": {"syslog": {"appname": "staffcop", "hostname": "staffcop-srv"}}, "observer": {"hostname": "staffcop-srv", "product": "Staffcop Enterprise", "vendor": "Atom Security"}, "process": {"name": "chrome"}, "related": {"hosts": ["WS-120"], "ip": ["10.20.4.194"], "user": ["d.smirnov"]}, "rule": {"name": ["\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435", "\u041e\u0431\u043b\u0430\u0447\u043d\u044b\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430"]}, "user": {"name": "d.smirnov"}}`,
    },
  ],
};
