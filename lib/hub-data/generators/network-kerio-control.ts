import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKerioControl: GeneratorMeta = {
  slug: 'network-kerio-control',
  displayName: 'Kerio Control Filter Log',
  category: 'network',
  description:
    'URL content-rule records that one Kerio Control firewall writes to its Filter log, as ECS JSON with the Filter log line in the GFI-documented layout in event.original, for one office user segment. Thirty-two users hit allow and deny rules for updates, executable downloads, social networks, file sharing and anonymizers. Recurring episodes show one user blocked on two anonymizers, then downloading a tunneling or remote-access client.',
  dataSource:
    'GFI Kerio Control Filter log, URL content-rule lines of rules with Log the traffic enabled, without syslog framing',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'GFI-documented Filter log URL-rule line in event.original',
    'Five logged content rules for 32 independent users',
    'Recurring anonymizer denials then tunnel-client download chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (minimum 2; the first one interval after generation starts, each next one interval after the previous actual start, so a late episode never causes catch-up; each start waits a random exponential delay, mean 20 min), one user is denied by Deny anonymizers on two different anonymizer hosts (one more anonymizer denial in 40% of episodes), then downloads an installer from a tunnel-client host, allowed by Log executable downloads, from the same client address after a log-normal delay (median 7 min). Episodes spanned 7-17 minutes at the default interval and 4-55 minutes at 6 h; the user, first anonymizer and tunnel-client host differ from the previous episode. Every fragment occurs in background; only the complete sequence is kept out of it.',
  generatorId: 'kerio-control',
  eventTypes: [
    {
      id: 'DENY URL (Deny social networks)',
      description: 'GET to a social network denied',
      frequency: '38.06% measured share',
      category: 'web',
    },
    {
      id: 'ALLOW URL (Allow automatic updates and MS Windows activation)',
      description: 'GET to an update or activation host allowed',
      frequency: '28.05% measured share',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny anonymizers)',
      description: 'GET to a web proxy denied',
      frequency: '13.98% measured share',
      category: 'web',
    },
    {
      id: 'ALLOW URL (Log executable downloads)',
      description: 'Installer GET allowed and logged',
      frequency: '9.04% measured share',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny file sharing, GET)',
      description: 'GET to a file-sharing site denied',
      frequency: '8.23% measured share',
      category: 'web',
    },
    {
      id: 'DENY URL (Deny file sharing, POST)',
      description: 'Upload POST to a file-sharing site denied',
      frequency: '2.64% measured share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Thirty-two users, one client address each, act independently: activity arrives as one merged Poisson stream scaled by an office-hours factor (07:00-17:00 UTC 1.58, 17:00-21:00 0.84, night 0.32), and each arrival picks a user by a fixed log-normal per-user weight, so some users hit blocked sites far more often than others. Each one-second tick emits at most one record.',
    'Activity comes in bursts: social networks (1-6 denials, median gap 25 s), updates (1-4 allowed requests seconds apart), anonymizers (1-4 denials, median gap 45 s, often on different proxies), file sharing (1-3 denials, 25% upload POSTs) and executable downloads (1-2 installers, 14% from a tunnel-client host). After 22% of anonymizer bursts the user downloads an installer about five minutes later, 35% of those from a tunnel-client host.',
    'Background holds every chain fragment: per 78-hour background capture, 1,030-1,220 pairs of denials on two different anonymizers by one user within an hour, 117-153 tunnel-client downloads and 54-86 tunnel-client downloads within an hour of an anonymizer denial. Episode starts ignore the day/night curve and pick the user uniformly, so night episodes stand out more and rarely active users are over-represented as chain actors. At the default 24 h interval consecutive episodes fall near the same hour of day.',
    'event.original follows the URL-rule line that GFI documents with one raw ALLOW example; DENY lines use the same layout. The raw line has second resolution, the firewall clock is UTC, and no syslog framing is produced. No Elastic integration exists, so the ECS mapping is an assumption; kerio_control.filter keeps the rule type and action token.',
    'Only HTTP URL lines are generated: HTTPS, FTP rules, the Drop action and hosts with no logged-in user are not documented in enough detail. Packet-rule records of the Filter log and the other Kerio Control logs (Http, Web, Security, Connection) are out of scope.',
    'Rule names and the set of logged rules are an assumed office configuration (the automatic-updates rule is the one GFI names); rates, host lists and user behavior are training assumptions, not measured production volume.',
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
        'Number of users, one address each (4-40; client_first + user_count at most 255)',
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
      json: String.raw`{"@timestamp": "2026-09-27T00:19:27+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "ALLOW", "category": ["web", "network"], "dataset": "kerio_control.filter", "kind": "event", "original": "[27/Sep/2026 00:19:27] ALLOW URL \u0027Log executable downloads\u0027 10.10.20.11 jsmith HTTP GET http://dl.remotedesk.example/remotedesk/15.7/remotedesk-x64.msi", "type": ["access", "allowed"]}, "http": {"request": {"method": "GET"}}, "kerio_control": {"filter": {"action": "ALLOW", "rule_type": "URL"}}, "observer": {"hostname": "kerio-fw-01.example.test", "product": "Kerio Control", "type": "firewall", "vendor": "GFI"}, "related": {"hosts": ["dl.remotedesk.example"], "ip": ["10.10.20.11"], "user": ["jsmith"]}, "rule": {"name": "Log executable downloads"}, "source": {"ip": "10.10.20.11"}, "url": {"domain": "dl.remotedesk.example", "full": "http://dl.remotedesk.example/remotedesk/15.7/remotedesk-x64.msi", "path": "/remotedesk/15.7/remotedesk-x64.msi", "scheme": "http"}, "user": {"name": "jsmith"}}`,
    },
  ],
};
