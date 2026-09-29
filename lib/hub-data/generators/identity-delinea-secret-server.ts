import type { GeneratorMeta } from '@/lib/hub-types';

export const identityDelineaSecretServer: GeneratorMeta = {
  slug: 'identity-delinea-secret-server',
  displayName: 'Delinea Secret Server CEF',
  category: 'identity',
  description:
    'SECRET - VIEW audit records that one Delinea Secret Server 11.3 instance (formerly Thycotic) sends to a syslog/CEF collector, as ECS JSON with the syslog line in event.original, for training SIEM content on privileged credential access. About 12,700 views a day by 240 people on UTC office hours and 4 automation accounts on fixed schedules. Recurring episodes show one administrator viewing five distinct Tier 0 credentials within half an hour.',
  dataSource:
    'Delinea (Thycotic) Secret Server 11.3.000001 syslog/CEF, SECRET - VIEW (class 10004)',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'delinea-ss',
  highlights: [
    'Syslog/CEF line in the layout of the complete 11.3 fixture',
    '240 people on UTC office hours plus 4 scheduled automation accounts',
    'Recurring chain of five distinct Tier 0 credential views within half an hour',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One administrator, from the usual workstation address, views five distinct secrets in folder Tier 0 - Infrastructure within 30 minutes. The first four come within seconds to about 29 minutes (median about 5 minutes, within 10 minutes in about 70% of episodes, as in ordinary runs of four distinct Tier 0 secrets), with occasional re-opens of the second to fourth; the fifth follows alone 25-28 minutes after the first, or up to 30 minutes after it when the first four took longer, and the first secret is not viewed again in the episode. Episodes recur every anomaly_interval_hours of event time (default 24, minimum 2). The first starts within the first min(interval, 24 h) of the data; each later one is due one interval after the previous episode's actual start and starts within a window of w = min(interval / 4, 6 h) centred on the due time, so starts are interval plus or minus w/2 apart (24 h plus or minus 3 h by default), and a late episode is never made up. Both starts are weighted by the square of the hourly people volume plus a small floor: at the default interval most episodes start between 07:00 and 17:00 UTC and the rest in the early morning, in the evening or, rarely, at night; at 8 h or less they cover the whole clock, night included. The administrator differs from the previous episode's and is picked by the same activity weights as ordinary sessions; the first secret and the set of five differ from the previous episode's. The time before, the spacing and the time after follow ordinary runs of four distinct Tier 0 secrets in the same hours: a little over half of episodes begin without a Tier 0 view by the administrator in the previous 30 minutes, about 30% after an earlier view of the first secret, and about a quarter by day (a fifth at night) after views of other Tier 0 secrets that return among the second to fourth. Once the first view is more than 30 minutes old, the administrator re-opens none to six of the other four (none in 29%), and about 23% of episodes show no Tier 0 view by the administrator in the 30 minutes after the fifth distinct one. When the administrator's ordinary sessions add other Tier 0 views, the pattern can complete earlier, up to 30 minutes before the episode's first view. Every user, address, secret and folder an episode uses, and every fragment of the pattern, occurs in ordinary activity; the complete pattern does not, and no field labels an episode.",
  eventTypes: [
    {
      id: 'Service Desk',
      description: 'SECRET - VIEW by service desk and administrators',
      frequency: '~32%',
      category: 'iam',
    },
    {
      id: 'Personal folders',
      description:
        'SECRET - VIEW in a personal folder, named after the person, by its owner',
      frequency: '~25%',
      category: 'iam',
    },
    {
      id: 'Applications',
      description:
        'SECRET - VIEW by DevOps, automation accounts, DBAs and administrators',
      frequency: '~22%',
      category: 'iam',
    },
    {
      id: 'Databases',
      description:
        'SECRET - VIEW by DBAs, DevOps, administrators and backup automation',
      frequency: '~8%',
      category: 'iam',
    },
    {
      id: 'Network Devices',
      description:
        'SECRET - VIEW by network engineers, administrators and configuration backup automation',
      frequency: '~8%',
      category: 'iam',
    },
    {
      id: 'Tier 0 - Infrastructure',
      description:
        'SECRET - VIEW by administrators, occasionally network engineers',
      frequency: '~5%',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Every record is SECRET - VIEW (CEF class 10004). The CEF header keeps the historical Thycotic Software vendor name of this version, and the JSON mirrors the document the Elastic Thycotic Secret Server integration produces from the line; agent, data stream and ingest fields and cef.* are omitted.',
    'People account for about 12,000 views a day on UTC office hours: about 0.25 views/s 07:00-17:00, 0.11/s 17:00-21:00 and 0.04/s at night, with 3% day-to-day variation. Each of the 240 people has a fixed ID, one workstation address and a fixed activity weight of 0.4-2.5 times the average, so some open secrets far more often than others. By account: service desk 42%, DevOps 24%, network engineers 11%, administrators 9%, DBAs 9%, automation 5%.',
    'Ordinary sessions hold 1-6 views about 40 s apart; each view re-opens the previous secret (30%) or picks a folder by role and a secret by its fixed popularity. A quarter of administrator sessions are infrastructure work of 2-9 views about 35 s apart, 85% of them Tier 0: an administrator views about 20-25 Tier 0 secrets a day on average, and four distinct Tier 0 secrets by one administrator within 30 minutes occur about 30-40 times a day.',
    'Automation accounts fetch about 660 secrets a day at any hour, each run in the same order within one second: svc.jenkins 2 application secrets every 10 minutes, svc.zabbix its monitoring API credential every 5 minutes, svc.ansible 3 application secrets at minute 05 of every hour and 6 network device credentials at 01:30, svc.backup 3 database credentials at 22:00.',
    'The syslog header carries the send time, a log-normal delay (median 3 s) after the event time rt, as in the Elastic fixture. Outside episodes no user views five distinct Tier 0 secrets within 30 minutes of rt: a user who viewed four distinct ones in the last 30 minutes re-opens the latest of them instead (about 30-50 such views a day).',
    "Each episode adds 5-15 Tier 0 views by its administrator, who opens no Tier 0 secret from the fifth distinct view until the first of the five is 30 minutes old (usually 2-5 minutes); ordinary views in that time go to the administrator's other folders. An episode run holds fewer of the administrator's personal-folder views than an ordinary run of four or more distinct Tier 0 secrets (about 0.3 against 0.7 per run).",
    'Only SECRET - VIEW is generated: other 11.3 event layouts are not published. Day padding in the header and rt is unconfirmed by the fixture, only the legacy rt DateTime format is modelled, and clocks are UTC with second resolution. Users, secrets, folders, IDs, rates, schedules and the office-hours curve are an assumed large organisation, not measured production data; consecutive views in one session are a median of about 50 s apart, wider at night, and weekends are not modelled.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to ordinary activity; false produces ordinary activity only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours of event time, 2-8760',
    },
    {
      name: 'server_host',
      defaultValue: 'SECRET-SRV-01',
      description: 'Syslog hostname, host.name and observer.hostname',
    },
    {
      name: 'device_version',
      defaultValue: '11.3.000001',
      description:
        'Version in the CEF header; the record layout is confirmed for this version only',
    },
    {
      name: 'domain',
      defaultValue: 'contoso',
      description:
        'Domain prefix in personal admin account and breakglass secret names',
    },
  ],
  sampleOutputs: [
    {
      title: 'View that completes the second episode',
      json: String.raw`{"@timestamp": "2026-09-27T14:57:14.000Z", "ecs": {"version": "8.11.0"}, "event": {"action": "view", "category": ["iam"], "code": "10004", "dataset": "thycotic_ss.logs", "kind": "event", "original": "Sep 27 14:57:14 SECRET-SRV-01 CEF:0|Thycotic Software|Secret Server|11.3.000001|10004|SECRET - VIEW|2|msg=[[SecretServer]] Event: [Secret] Action: [View] By User: M.Mccarthy Item Name: ESXi root - esx-cl01 (Item Id: 5781) Container Name: Tier 0 - Infrastructure (Container Id: 162)  suid=2926 suser=M.Mccarthy cs4=Michael Mccarthy cs4Label=suser Display Name src=10.20.5.145 rt=Sep 27 2026 14:57:06 fname=ESXi root - esx-cl01 fileType=Secret fileId=5781 cs3Label=Folder cs3=Tier 0 - Infrastructure", "provider": "secret", "type": ["info"]}, "host": {"name": "SECRET-SRV-01"}, "message": "[[SecretServer]] Event: [Secret] Action: [View] By User: M.Mccarthy Item Name: ESXi root - esx-cl01 (Item Id: 5781) Container Name: Tier 0 - Infrastructure (Container Id: 162)", "observer": {"hostname": "SECRET-SRV-01", "product": "Secret Server", "vendor": "Thycotic Software", "version": "11.3.000001"}, "related": {"hosts": ["SECRET-SRV-01"], "ip": ["10.20.5.145"], "user": ["M.Mccarthy"]}, "source": {"ip": "10.20.5.145"}, "thycotic_ss": {"event": {"secret": {"folder": "Tier 0 - Infrastructure", "id": "5781", "name": "ESXi root - esx-cl01"}, "time": "2026-09-27T14:57:06.000Z"}}, "user": {"full_name": "Michael Mccarthy", "id": "2926", "name": "M.Mccarthy"}}`,
    },
  ],
};
