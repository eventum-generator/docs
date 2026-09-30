import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKerioControl: GeneratorMeta = {
  slug: 'network-kerio-control',
  displayName: 'Kerio Control Filter Log',
  category: 'network',
  description:
    'URL content-rule records that one Kerio Control firewall writes to its Filter log, as ECS JSON with the Filter log line in the GFI-documented layout in event.original, for one office user segment. About 5,000 records a day: 32 users browse on a working-day curve and hit deny rules for social networks, anonymizers and file sharing and an allow rule on executable downloads, while their computers fetch updates round the clock. Recurring episodes show one user blocked on two different anonymizers, then downloading a tunneling or remote-access client within an hour.',
  dataSource:
    'GFI Kerio Control Filter log, URL content-rule lines of rules with Log the traffic enabled, without syslog framing',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'GFI-documented Filter log URL-rule line in event.original',
    'About 5,000 records a day from 32 users on a working-day curve',
    'Recurring anonymizer denials then tunnel-client download chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user at one client address is denied by Deny anonymizers on anonymizer host A, then on a different anonymizer host B (one more anonymizer denial follows in 40% of episodes), then downloads an installer from a tunnel-client host, allowed by Log executable downloads, after a log-normal delay (median 7 min). The steps span a few minutes to about half an hour, always within one hour. The first episode starts within the first anomaly_interval_hours of the output (at most 24 h), at an hour drawn from the users' browsing curve; each later one starts within a window around one interval after the previous start (window width a quarter of the interval, at most 6 h), favouring busy browsing hours, so at the default 24 h most episodes fall in office hours and their hour drifts from day to day. The next interval counts from the actual start, so a late episode never causes catch-up. The user, the first anonymizer and the tunnel-client host differ from the previous episode; episode users come from the busiest quarter of the users, weighted by their ordinary proxy use. Episode records are part of the daily volume, and the user's own browsing continues around them. Every fragment occurs in background: repeated anonymizer denials, denials on several proxies, tunnel-client downloads and tunnel-client downloads after a single proxy denial. Only the complete sequence is absent from it: in background, a user blocked on two different anonymizers within the last hour downloads only from ordinary software hosts. With anomaly_mode false the complete chain never occurs.",
  generatorId: 'kerio-control',
  eventTypes: [
    {
      id: 'DENY URL (Deny social networks)',
      description: 'GET to a social network denied',
      frequency: '38.19% of records',
      category: 'web',
    },
    {
      id: 'ALLOW URL (Allow automatic updates and MS Windows activation)',
      description: 'GET to an update or activation host allowed',
      frequency: '27.59% of records',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny anonymizers)',
      description: 'GET to a web proxy denied',
      frequency: '14.29% of records',
      category: 'web',
    },
    {
      id: 'ALLOW URL (Log executable downloads)',
      description: 'Installer GET allowed and logged',
      frequency: '9.32% of records',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny file sharing, GET)',
      description: 'GET to a file-sharing site denied',
      frequency: '8.01% of records',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny file sharing, POST)',
      description: 'Upload POST to a file-sharing site denied',
      frequency: '2.60% of records',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Thirty-two users, one client address each, browse on a working-day curve in UTC: 0.093 records/s from 08:00 to 17:00, 0.033 in 07:00-08:00 and 17:00-20:00, 0.003 at night. The computers fetch updates and activation checks round the clock at 0.016 records/s, attributed to the user of the computer. About 5,000 records a day, varying by about 3% from day to day; consecutive records are a median 6 s apart in office hours, 14 s in the shoulder hours and about 40 s at night. Every day has the same curve, with no weekend dip.',
    'Each user has a fixed log-normal propensity, bounded to a factor of about 5 between the quietest and the busiest user, so some users hit blocked sites far more often than others, yet every user appears every day. The busiest quarter of the users (jsmith, mbrown, akowalski, dlee, epetrova, fgarcia, hmuller and ikhan by default) take remote-access and tunnel clients regularly, the others rarely.',
    "Browsing comes in bursts: social networks (43% of browsing actions, 1-6 denials, median gap 25 s, host kept or switched), anonymizers (22%, 1-4 denials, median gap 45 s, often on different proxies), file sharing (18%, 1-3 denials, 25% of them upload POSTs) and executable downloads (17%, 1-2 installers, from a tunnel-client host in 45% of the busiest users' downloads and 5% of the others'). After 22% of anonymizer bursts the user downloads an installer about five minutes later, from a tunnel-client host in 65% of cases for the busiest users and 25% for the others. Updates come as 1-4 allowed requests to one host.",
    'Over four days the background holds about 1,800-2,100 pairs of denials on two different anonymizers by one user within an hour, 160-225 tunnel-client downloads and 95-130 tunnel-client downloads within an hour of an anonymizer denial; each of the busiest users downloads about 9-35 tunnel clients in four days, each other user 0-8. Every user, anonymizer host, tunnel-client host and rule used by the chain occurs in background, and no field labels an episode.',
    'event.original follows the URL-rule line that GFI documents with one raw ALLOW example; DENY lines use the same layout. The raw line has second resolution, the firewall clock is UTC and no syslog framing is produced. No Elastic integration exists, so the ECS mapping is an assumption; kerio_control.filter keeps the rule type and action token.',
    'Only HTTP URL lines are generated: HTTPS, FTP rules, the Drop action and hosts with no logged-in user are not documented in enough detail. Packet-rule records of the Filter log and the other Kerio Control logs (Http, Web, Security, Connection) are out of scope.',
    'Rule names and the set of logged rules are an assumed office configuration (the automatic-updates rule is the one GFI names); rates, host lists and user behavior are training assumptions, not measured production volume. Requests of one burst are at least a few seconds apart, and at night about a minute apart, rather than the sub-second spacing of a page load.',
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
      description: 'Episode interval in source hours, 2-8760',
    },
    {
      name: 'firewall_host',
      defaultValue: 'kerio-fw-01.example.test',
      description: 'Firewall name in observer.hostname',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.10.20.',
      description: 'Client addresses are this prefix plus a host number',
    },
    {
      name: 'client_first',
      defaultValue: '11',
      description: 'First client host number',
    },
    {
      name: 'user_count',
      defaultValue: '32',
      description:
        'Number of users, one address each, taken in order from samples/users.csv; the first quarter (at least two) are the busiest (4-40; client_first + user_count at most 255)',
    },
    {
      name: 'anonymizer_hosts',
      defaultValue:
        '[webproxy.hideme.example, free.unblocker.example, surf.anonymous.example, go.bypassgate.example]',
      description: 'Hosts denied by Deny anonymizers (at least 3)',
    },
    {
      name: 'tunnel_hosts',
      defaultValue:
        '[dl.remotedesk.example, get.tunnelvpn.example, download.socksclient.example]',
      description:
        'Tunnel and remote-access client download hosts (at least 2)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Tunnel-client download that completes the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T18:55:36+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "ALLOW", "category": ["web", "network"], "dataset": "kerio_control.filter", "kind": "event", "original": "[01/Sep/2026 18:55:36] ALLOW URL \u0027Log executable downloads\u0027 10.10.20.12 mbrown HTTP GET http://download.socksclient.example/socksclient/10.3/socksclient-setup.exe", "type": ["access", "allowed"]}, "http": {"request": {"method": "GET"}}, "kerio_control": {"filter": {"action": "ALLOW", "rule_type": "URL"}}, "observer": {"hostname": "kerio-fw-01.example.test", "product": "Kerio Control", "type": "firewall", "vendor": "GFI"}, "related": {"hosts": ["download.socksclient.example"], "ip": ["10.10.20.12"], "user": ["mbrown"]}, "rule": {"name": "Log executable downloads"}, "source": {"ip": "10.10.20.12"}, "url": {"domain": "download.socksclient.example", "full": "http://download.socksclient.example/socksclient/10.3/socksclient-setup.exe", "path": "/socksclient/10.3/socksclient-setup.exe", "scheme": "http"}, "user": {"name": "mbrown"}}`,
    },
  ],
};
