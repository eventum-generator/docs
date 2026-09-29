import type { GeneratorMeta } from '@/lib/hub-types';

export const networkVmwareNsxManager: GeneratorMeta = {
  slug: 'network-vmware-nsx-manager',
  displayName: 'VMware NSX Manager audit syslog',
  category: 'network',
  description:
    'VMware NSX-T Data Center 3.2 Manager audit records from /var/log/syslog as native lines in event.original with ECS fields, for testing detections of NSX login abuse and log-forwarding tampering. Seven administrator workstations with local and LDAP accounts log in, read and occasionally delete and re-create node syslog exporters on a working-day curve, while a monitoring script polls the node API and a Skyline collector logs in around the clock, at about 4,700 records a day. Recurring episodes show failed logins, a success and a syslog exporter deletion by one account.',
  dataSource:
    'VMware NSX-T Data Center 3.2 Manager audit records in /var/log/syslog (nsx@6876)',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native nsx@6876 audit lines in event.original',
    'Local and LDAP administrators, a monitoring script and Skyline failure-success pairs',
    'Recurring failed-logins-then-exporter-deletion chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Every anomaly_interval_hours (default 24, 6 to 8,760): the first episode starts within the first min(interval, 24 h) of the data, each later one within a window of min(interval / 4, 6 h) centred one interval after the previous start, its hour weighted by the square of the administrators' activity curve plus a small floor, so episodes fall mostly into working hours. An episode waits, usually minutes, for an eligible account and at least two configured exporters; missed episodes are not replayed. One account (guestuser1, guestuser2, jdoe@contoso.local or asmith@contoso.local, not the previous episode's) sends three to five failed LOGIN records from its own address and a successful LOGIN from it, then within none to three request intervals deletes one node syslog exporter other than the previous episode's, usually one to five minutes and never more than about 29 minutes after the first failure. The session continues as usual and the exporter is re-created later. Linked by user.name, source.ip on the LOGIN records and the exporter name in url.path; ordinary traffic never completes the sequence within 30 minutes.",
  generatorId: 'nsx',
  eventTypes: [
    {
      id: 'user-info-read',
      description:
        'Policy audit ModuleName="AAA", Operation="GetCurrentUserInfo"',
      frequency: '53.10% measured share',
      category: 'iam',
    },
    {
      id: 'node-api-read',
      description:
        'Node API GET /api/v1/node/status, /node/version or /node/services',
      frequency: '30.38% measured share',
      category: 'configuration',
    },
    {
      id: 'syslog-exporter-list',
      description: 'Node API GET /api/v1/node/services/syslog/exporters',
      frequency: '11.64% measured share',
      category: 'configuration',
    },
    {
      id: 'login-success',
      description: 'ACCESS_CONTROL LOGIN, status success',
      frequency: '2.53% measured share',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'ACCESS_CONTROL LOGOUT, status success',
      frequency: '1.54% measured share',
      category: 'authentication',
    },
    {
      id: 'login-failure',
      description: 'ACCESS_CONTROL LOGIN, status failure',
      frequency: '0.68% measured share',
      category: 'authentication',
    },
    {
      id: 'syslog-exporter-create',
      description: 'Node API POST /api/v1/node/services/syslog/exporters',
      frequency: '0.06% measured share',
      category: 'configuration',
    },
    {
      id: 'syslog-exporter-delete',
      description:
        'Node API DELETE /api/v1/node/services/syslog/exporters/<name>',
      frequency: '0.06% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Seven administrator workstations work in sessions: local accounts (admin from two workstations, guestuser1, guestuser2, read-only audit) and LDAP accounts (jdoe@contoso.local, asmith@contoso.local) log in through ACCESS_CONTROL, read user info through the policy API, run node API reads, rarely delete and re-create node syslog exporters, and end with or without a LOGOUT. Around the clock a monitoring script logs in as admin from 10.20.5.40 and polls the node API, and a VMware Skyline collector logs in as admin from 10.20.5.20, its first attempt failing and the retry succeeding, as Broadcom documents.',
    'About 4,700 records a day, varying by about 3% from day to day: the monitoring script accounts for about 60 records an hour at every hour, and administrator activity adds about 2 an hour at night, rising to about 375 an hour between 10:00 and 12:00 on a smooth working-day curve (UTC by default). Every day has the same shape; weekends and holidays are not distinguished.',
    "About 50 administrator sessions a day, from under a minute to several hours (median about 25 minutes), with half a minute to two days between an account's sessions (median about 90 minutes). About 7% of administrator logins start with one to five failed attempts from the same address, and one in five failure runs gives up and returns later. The monitoring script logs in about 50 times a day and fails rarely; the Skyline collector logs in about 22 times a day, failing once each time.",
    'Three of five exporters are configured at the start and a fourth is usually added within a day or two, never more than four at a time. Power accounts delete about two exporters a day (none to six on a given day), more often than on a typical production manager; a deleted exporter is usually re-created within an hour by a power account that is logged in.',
    'Lines follow the NSX-T 3.2 Log Messages and Error Codes examples as written to /var/log/syslog: RFC 5424 header without the <PRI>1 prefix, nsx@6876 structured data and the documented message bodies. LOGIN records carry UserName="<user>@<address>" and LOGOUT records the bare user name; LDAP accounts log <user>@<domain>@<address> on failure and the LdapUserDetailsImpl string on success, in the quoted form of the 3.2 documentation rather than the unquoted 2022 Skyline example.',
    "Broadcom publishes a raw node API audit line only for the GET of the exporter list; the POST and DELETE lines reuse that layout, and HTTP 201 for POST, response sizes, durations and exporter names are assumptions. Rates and session lengths are synthetic, as Broadcom publishes no frequency data. Records a real manager writes milliseconds apart, such as the Skyline failure and its retry, are seconds apart here (median about 25 seconds, up to about three minutes at night). ECS fields repeat values from the native line, and event.action names are this pack's labels.",
    'Ordinary traffic in both modes holds runs of up to five failed logins by one account followed by a success, give-ups, Skyline failure-success pairs and exporter deletions by every episode account (jdoe@contoso.local and asmith@contoso.local about three times a week, guestuser1 and guestuser2 once or twice a week). With anomaly_mode true the chain parts are about one per episode more frequent while the hourly record count stays the same. A burst of failures can also be a user with a stale password, and exporter removal can be planned maintenance.',
    "Pinned to 3.x: NSX 4.2.0 and later do not log successful LOGIN records, so the chain's success step is not visible there. Not modeled: policy and manager API writes, NSX CLI, Workspace ONE logins, reverse-proxy and envoy logs, and multi-node clusters; the policy audit stream is reduced to GetCurrentUserInfo.",
  ],
  parameters: [
    {
      name: 'manager_host',
      defaultValue: 'nsx-mgr-01',
      description: 'NSX Manager hostname in the syslog header and host.name',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring anomaly chain episodes to the background; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Syslog exporter deletion of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T11:56:04.039Z", "ecs": {"version": "8.17.0"}, "event": {"action": "syslog-exporter-delete", "category": ["configuration"], "duration": 484051000, "kind": "event", "original": "2026-09-01T11:56:04.039Z nsx-mgr-01 NSX 16489 - [nsx@6876 comp=\"nsx-manager\" subcomp=\"node-mgmt\" username=\"jdoe@contoso.local\" level=\"INFO\" audit=\"true\"] jdoe@contoso.local \u0027DELETE /api/v1/node/services/syslog/exporters/siem-primary\u0027 200 0 \"\" \"python-requests/2.25.1\" 0.484051", "outcome": "success", "type": ["deletion"]}, "host": {"name": "nsx-mgr-01"}, "http": {"request": {"method": "DELETE"}, "response": {"body": {"bytes": 0}, "status_code": 200}}, "log": {"file": {"path": "/var/log/syslog"}, "level": "info", "syslog": {"appname": "NSX", "msgid": "-", "procid": "16489"}}, "related": {"user": ["jdoe@contoso.local"]}, "url": {"path": "/api/v1/node/services/syslog/exporters/siem-primary"}, "user": {"name": "jdoe@contoso.local"}, "user_agent": {"original": "python-requests/2.25.1"}, "vmware": {"nsx": {"audit": true, "component": "nsx-manager", "subcomponent": "node-mgmt"}}}`,
    },
  ],
};
