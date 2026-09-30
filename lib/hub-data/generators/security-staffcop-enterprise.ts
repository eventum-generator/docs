import type { GeneratorMeta } from '@/lib/hub-types';

export const securityStaffcopEnterprise: GeneratorMeta = {
  slug: 'security-staffcop-enterprise',
  displayName: 'Staffcop Enterprise Syslog',
  category: 'security',
  description:
    'Staffcop Enterprise 5.8 Syslog connector records in the native key-value format: Screenshot and Stat events from 40 employee workstations with the names of every policy each event matched, as native text in event.original with an inferred ECS mapping. For SIEM and UEBA rule authors; the optional CEF format is not emitted. About 8,600 records per weekday and 1,300 per weekend day follow an office working week. Recurring episodes show one finance employee capturing finance data with PrintScreen and then using cloud storage.',
  dataSource: 'Staffcop Enterprise 5.8 Syslog connector, native key-value',
  eventFormat: 'ECS JSON',
  originalFormat: 'KV',
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Native Syslog connector key-value line in event.original',
    '40 employees in five departments on an office working week',
    'Recurring finance-data, PrintScreen, cloud-storage chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One finance employee within 30 minutes takes a Screenshot in an office application (excel, 1cv8, winword, outlook or explorer) matching the finance-data policy, a Screenshot in the same application matching the PrintScreen policy, a browser Screenshot (chrome or msedge) matching the cloud-storage policy, and a Stat for that browser matching both cloud storage and finance data; the steps are linked by user.name, host.name, host.ip, process.name and rule.name, and the episode takes at most 20 minutes (10 minutes at night and on weekends). The first episode starts within the first min(anomaly_interval_hours, 24) hours, at a time drawn from the office volume curve; each later one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts within a window of min(interval / 4, 6 h) centred on that due time, favouring the busiest hours of the window, and a late episode never causes catch-up. At the default episodes fall on consecutive days, usually between 08:00 and 18:00 UTC, including light weekend daytime. The employee is weighted by their usual activity at that hour and is never the previous episode's employee; the four episode records take the place of four ordinary records, so the hourly volume is the same in both modes. Every step and partial chains by the same employee occur in the ordinary activity of every finance employee; only the complete ordered sequence is kept out of it, as an ordinary Stat that would complete it within 30 minutes matches the cloud storage policy only.",
  generatorId: 'staffcop',
  eventTypes: [
    {
      id: 'Screenshot',
      description: 'Workstation screenshot, with zero or more matched policies',
      frequency: '88.7% of records',
      category: 'host',
    },
    {
      id: 'Stat',
      description:
        'Activity statistics record closing a work bout in one application',
      frequency: '11.3% of records',
      category: 'host',
    },
  ],
  realismFeatures: [
    '40 employees (10 finance, 9 sales, 9 development, 5 HR, 7 IT), each with a fixed workstation and address, work independently in bouts of one or more screenshots in one application, sometimes closed by a Stat record. The application mix depends on the department, and policy matches on the application and on whether the employee works with finance data. Finance workstations produce about a third of all records, about 1.6 times the per-employee volume of other departments.',
    'Finance staff regularly exchange documents through cloud storage in the browser: short bouts whose screenshots show a cloud storage page, often with finance documents, usually closed by a Stat that matches both policies (about 70 such Stat records per weekday across the department). Over a week the cloud storage policy matches 6.9% of records, finance data 6.5%, messengers 3.7%, PrintScreen 2.7% and social networks 2.3%; 81% of records match no policy, 16% one and 3% two or more.',
    "About 31 records an hour at night, about 140 in the 07:00 hour, about 500 in the 08:00, 13:00 and 18:00 hours and about 790 from 09:00 to 13:00 and 14:00 to 18:00 and 80-190 from 19:00 to 21:00 UTC on weekdays; weekend daytime holds about 78 an hour. Each employee's working day is shifted by up to 1.5 hours, so who is active follows the curve, not only how much is logged. Screenshots of one bout are a median of about one minute apart in office hours; at night they are about three minutes apart rather than about a minute.",
    'The volume follows one fixed weekly curve: no holidays, vacations, month-end peaks or differences between weekdays. Rates and probabilities are synthetic training assumptions, not measured Staffcop volume.',
    'The syslog header carries the connector dump time, advancing in steps of about 300 s as the vendor documents a dump once in 5 minutes; each record lands in the first dump after its agent upload delay (median 15 s, occasionally minutes). time and @timestamp hold the event time with second precision, event.created the dump time. The server id increases with random steps, since events of other types not selected by the connector filter consume ids too. Records are ordered by event time, while a real syslog file is ordered by dump time.',
    'With anomaly_mode true each episode has its own four records, so counts of the chain parts (finance, PrintScreen and cloud storage screenshots, Stat records with both policies) are about one per episode higher than with false. Policies are Staffcop matches, not proof of intent, and a policy count is not a severity scale.',
    'The vendor publishes three raw lines and no field specification, so only Screenshot and Stat are modelled; intercepted files, keyboard, web and other event classes are not, and application names follow the lowercase style of the vendor example. The policy_N order is random, day padding is assumed to be syslog space padding, and both clocks, which carry no year or time zone, are treated as UTC. The optional CEF export and SIEM-side normalizers are out of scope, and with no Elastic integration for Staffcop the ECS mapping is inferred (rule.name holds the matched policies).',
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
      title: 'Final Stat of an episode',
      json: String.raw`{"@timestamp": "2026-09-07T09:16:05+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "Stat", "category": ["host"], "created": "2026-09-07T09:19:07+00:00", "dataset": "staffcop.syslog", "id": "526503", "kind": "event", "original": "Sep  7 09:19:07 staffcop-srv staffcop: id=\"526503\" time=\"Sep  7 09:16:05\" event=\"Stat\" computer=\"WS-151\" ip=\"10.20.4.66\" user=\"e.kuznetsova\" app=\"chrome\" policy_1=\"\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435\" policy_2=\"\u041e\u0431\u043b\u0430\u0447\u043d\u044b\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430\"", "type": ["info"]}, "host": {"ip": ["10.20.4.66"], "name": "WS-151"}, "log": {"syslog": {"appname": "staffcop", "hostname": "staffcop-srv"}}, "observer": {"hostname": "staffcop-srv", "product": "Staffcop Enterprise", "vendor": "Atom Security"}, "process": {"name": "chrome"}, "related": {"hosts": ["WS-151"], "ip": ["10.20.4.66"], "user": ["e.kuznetsova"]}, "rule": {"name": ["\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435", "\u041e\u0431\u043b\u0430\u0447\u043d\u044b\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430"]}, "user": {"name": "e.kuznetsova"}}`,
    },
  ],
};
