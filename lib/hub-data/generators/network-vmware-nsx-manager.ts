import type { GeneratorMeta } from '@/lib/hub-types';

export const networkVmwareNsxManager: GeneratorMeta = {
  slug: 'network-vmware-nsx-manager',
  displayName: 'VMware NSX Manager audit syslog',
  category: 'network',
  description:
    'VMware NSX-T Data Center 3.2 Manager audit records from /var/log/syslog as native lines in event.original with ECS fields, for testing detections of NSX login abuse and log-forwarding tampering. Eight local and LDAP client accounts and a Skyline collector run independent sessions of logins, reads and node syslog exporter changes. Recurring episodes show failed logins, a success and a syslog exporter deletion by one account.',
  dataSource:
    'VMware NSX-T Data Center 3.2 Manager audit records in /var/log/syslog (nsx@6876)',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native nsx@6876 audit lines in event.original',
    'Local and LDAP login forms with Skyline failure-success pairs',
    'Recurring failed-logins-then-exporter-deletion chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due one anomaly_interval_hours (default 24) after the generator starts, each next one interval after the previous actual start; at each due time the start waits a random delay of up to min(30 min, interval / 8) and then until an eligible account is idle, has its own next login more than an hour away and at least two exporters exist, and missed episodes are not replayed. One account sends three to five failed LOGIN records from one address and a successful LOGIN from it, then after zero to three ordinary requests deletes one node syslog exporter (54-215 s from the first failure measured); the session continues and a logged-in power account re-creates the exporter later. Account and exporter differ from the previous episode; every step occurs in background, where an ordinary delete that would complete the sequence within 30 minutes is replaced by an exporter list read.',
  generatorId: 'nsx',
  eventTypes: [
    {
      id: 'user-info-read',
      description: 'Policy audit GetCurrentUserInfo in module AAA',
      frequency: '64.47% measured share',
      category: 'iam',
    },
    {
      id: 'node-api-read',
      description: 'Node API GET of node status, version or services',
      frequency: '20.92% measured share',
      category: 'configuration',
    },
    {
      id: 'syslog-exporter-list',
      description: 'Node API GET of the syslog exporter list',
      frequency: '8.43% measured share',
      category: 'configuration',
    },
    {
      id: 'login-success',
      description: 'ACCESS_CONTROL LOGIN with status success',
      frequency: '2.52% measured share',
      category: 'authentication',
    },
    {
      id: 'login-failure',
      description: 'ACCESS_CONTROL LOGIN with status failure',
      frequency: '1.89% measured share',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'ACCESS_CONTROL LOGOUT with status success',
      frequency: '1.27% measured share',
      category: 'authentication',
    },
    {
      id: 'syslog-exporter-create',
      description: 'Node API POST of a syslog exporter',
      frequency: '0.26% measured share',
      category: 'configuration',
    },
    {
      id: 'syslog-exporter-delete',
      description: 'Node API DELETE of a named syslog exporter',
      frequency: '0.25% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Eight client accounts run independent random sessions: ACCESS_CONTROL logins with occasional mistyped passwords and give-ups, UI user-info reads, node API reads, occasional deletion and re-creation of node syslog exporters, and explicit logouts. A VMware Skyline collector logs in as admin, its first attempt failing and the retry succeeding tens of milliseconds later, as Broadcom documents. Measured volume is 16,756 events in 120 hours.',
    'Lines follow the NSX-T 3.2 Log Messages and Error Codes examples as written to /var/log/syslog: RFC 5424 header without the <PRI>1 prefix, nsx@6876 structured data and the documented message bodies. Local LOGIN records carry UserName="<user>@<address>", LDAP accounts log <user>@<domain>@<address> on failure and the LdapUserDetailsImpl string on success, and the quoted form follows the 3.2 documentation rather than the unquoted 2022 Skyline example.',
    "Broadcom publishes a raw node API audit line only for the GET of the exporter list; the POST and DELETE lines reuse that layout, and HTTP 201 for POST, response sizes, durations and exporter names are assumptions. Exporter changes (about eight deletions a day) are more frequent than on a typical production manager so that the chain's last step also occurs in ordinary traffic; rates and session lengths are synthetic.",
    'Ordinary traffic in both modes holds one to five failed logins by one account (three to six runs a day of three or more followed by a success within ten minutes), give-ups, Skyline pairs, successful logins followed by exporter deletions and deletions by every chain account. A burst of failures can also be a user with a stale password, and exporter removal can be planned maintenance.',
    "Pinned to 3.x: NSX 4.2.0 and later do not log successful LOGIN records, so the chain's success step is not visible there. Not modeled: policy and manager API writes, NSX CLI, Workspace ONE logins, reverse-proxy and envoy logs, and multi-node clusters; the policy audit stream is reduced to GetCurrentUserInfo. The generator emits at most one event per one-second input tick.",
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
      description:
        'Hours between episode due times, each due one interval after the previous actual start; 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Syslog exporter deletion of an episode',
      json: String.raw`{"@timestamp": "2026-09-21T00:14:29.497Z", "ecs": {"version": "8.17.0"}, "event": {"action": "syslog-exporter-delete", "category": ["configuration"], "duration": 1117882000, "kind": "event", "original": "2026-09-21T00:14:29.497Z nsx-mgr-01 NSX 4036 - [nsx@6876 comp=\"nsx-manager\" subcomp=\"node-mgmt\" username=\"guestuser2\" level=\"INFO\" audit=\"true\"] guestuser2 \u0027DELETE /api/v1/node/services/syslog/exporters/siem-secondary\u0027 200 0 \"\" \"PostmanRuntime/7.26.1\" 1.117882", "outcome": "success", "type": ["deletion"]}, "host": {"name": "nsx-mgr-01"}, "http": {"request": {"method": "DELETE"}, "response": {"body": {"bytes": 0}, "status_code": 200}}, "log": {"file": {"path": "/var/log/syslog"}, "level": "info", "syslog": {"appname": "NSX", "msgid": "-", "procid": "4036"}}, "related": {"user": ["guestuser2"]}, "url": {"path": "/api/v1/node/services/syslog/exporters/siem-secondary"}, "user": {"name": "guestuser2"}, "user_agent": {"original": "PostmanRuntime/7.26.1"}, "vmware": {"nsx": {"audit": true, "component": "nsx-manager", "subcomponent": "node-mgmt"}}}`,
    },
  ],
};
