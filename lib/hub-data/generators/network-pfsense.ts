import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPfsense: GeneratorMeta = {
  slug: 'network-pfsense',
  displayName: 'pfSense Firewall and IPsec',
  category: 'network',
  dataSource: 'pfSense CE 2.9.0 RFC 5424 filterlog and charon syslog',
  description:
    'Remote syslog stream of one pfSense CE 2.9.0 firewall with eight site-to-site IPsec tunnels: filterlog records for LAN passes, WAN default-deny blocks and enc0 traffic through the tunnels, and charon records for Phase 1 lookups, failed and successful negotiations, CHILD_SA closures and IKE_SA deletions, as ECS JSON with the RFC 5424 line in event.original. Recurring episodes show a peer offering wrong identities until its tunnel comes up, followed by administrative access through it.',
  generatorId: 'network-pfsense',
  eventCount: 9,
  templateCount: 1,
  highlights: [
    'Native filterlog CSV and charon SA bodies in RFC 5424 lines',
    'Independent lifecycles of eight site-to-site tunnels',
    'Recurring identity-mismatch tunnel followed by admin access',
  ],
  anomalyChain:
    "A branch peer offers a wrong Phase 1 identity three to five times (lookup, then no peer config found) with background retry gaps, then the configured one; the IKE_SA and CHILD_SA come up and one host of the site subnet opens enc0 passes on 445, 3389 and 5985 to one internal server offering all three (98-123 s from the first lookup to the first administrative pass in the default-on capture). The tunnel then lives and closes like any background tunnel. The first episode starts within the first min(interval, 24 h) with its hour drawn from the office-hours curve squared; each later start is drawn in a window of min(interval / 4, 6 h) centred one interval after the previous actual start (default 24 h, minimum 4), with the same weighting, and missed episodes are not replayed. The episode then takes over the next scheduled reconnection of a down site, other than the previous episode's, due within 30 minutes of the start; after 20 minutes without one, the down site that reconnects first is taken (start delay median 23 min, longest measured 34 min, with no hard upper bound). Background never completes the chain: an administrative pass that would finish three wrong-identity lookups and an IKE_SA of the same site within 15 minutes is logged at the same time from the same host with its port and server redrawn from the background non-administrative weights.",
  eventTypes: [
    {
      id: 'filterlog pass LAN',
      description: 'LAN pass, rule 115',
      frequency: '53.46% measured share',
      category: 'network',
    },
    {
      id: 'filterlog block WAN',
      description: 'WAN default deny, rule 5',
      frequency: '26.49% measured share',
      category: 'network',
    },
    {
      id: 'filterlog pass enc0',
      description: 'IPsec (enc0) pass, rule 146',
      frequency: '18.02% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-peer-lookup',
      description:
        'charon looking for pre-shared key peer configs matching ...',
      frequency: '0.56% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-ike-established',
      description: 'charon IKE_SA ... established between ...',
      frequency: '0.31% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-child-established',
      description: 'charon CHILD_SA ... established with SPIs ...',
      frequency: '0.31% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-child-closed',
      description: 'charon closing CHILD_SA ... with SPIs ...',
      frequency: '0.30% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-ike-deleting',
      description: 'charon deleting IKE_SA ... between ...',
      frequency: '0.30% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-peer-not-found',
      description: 'charon no peer config found',
      frequency: '0.24% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    "About 13,000 records per day from independent sources: LAN DNS and HTTPS passes thinned by an office-hours curve, unsolicited WAN attempts hitting the default deny rule with short scanner bursts, and enc0 traffic from site subnets to internal DNS, Kerberos, LDAP, RPC, HTTPS, SMB, RDP and WinRM while each site's CHILD_SA is up. Rates are synthetic workload choices.",
    'Each of eight site-to-site tunnels has its own lifecycle: negotiation, IKE_SA and CHILD_SA establishment, a lognormal lifetime (median 2.5 h), closure and deletion, and a lognormal pause (median 1 h). Some attempts offer a wrong Phase 1 identity and are retried until corrected or given up, so repeated failures and failures followed by a successful negotiation are ordinary. No tunnel is assumed up at the start of a run.',
    'Every enc0 pass requires an active CHILD_SA of its site, and closing and deleting records carry the native IDs, SPIs and selectors of the established SA. Administrative ports carry about a quarter of enc0 traffic, often followed by further management sessions from the same host to the same server. A pass record means a packet matched a pass rule, not that a connection or authentication succeeded.',
    'Selected profile: IPv4 TCP SYN and UDP DNS records, IKEv1 PSK site-to-site tunnels and default enc0 filtering; IPv6, ICMP, NAT, OpenVPN, administrator logins and the full IKE exchange are not modeled. Real tunnels usually rekey without going down; the down periods stand for idle, DPD and reauthentication teardowns. CHILD_SA byte counters are synthetic.',
    'No complete CE 2.9.0 capture was found: filterlog grammar comes from Netgate documentation, charon bodies from Netgate troubleshooting examples and older real pfSense records, and close/delete bodies from upstream strongSwan 5.9.14. ECS source and destination on charon lines are derived from the message text, and live SIEM/parser compatibility is not verified.',
  ],
  format: ['JSON', 'ECS', 'Syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring identity-mismatch tunnel episodes; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, minimum 4',
    },
    {
      name: 'hostname',
      defaultValue: 'fw01.corp.example',
      description:
        'Firewall host name in the syslog header, host.name and observer.name',
    },
    {
      name: 'wan_ip',
      defaultValue: '203.0.113.1',
      description:
        'WAN address: local IKE endpoint and target of blocked probes',
    },
    {
      name: 'ipsec_pass_rule_tracker',
      defaultValue: '1534283903',
      description: 'Tracker of the logged IPsec-tab pass rule',
    },
  ],
  sampleOutputs: [
    {
      title: 'IKE_SA established during an episode',
      json: String.raw`{"@timestamp": "2026-09-01T05:35:26.565138+00:00", "data_stream": {"dataset": "pfsense.log", "namespace": "default", "type": "logs"}, "destination": {"ip": "203.0.113.1"}, "ecs": {"version": "8.17.0"}, "event": {"action": "ipsec-ike-established", "category": ["network"], "dataset": "pfsense.log", "kind": "event", "original": "\u003c30\u003e1 2026-09-01T05:35:26.565138+00:00 fw01.corp.example charon 18610 - - 06[IKE] \u003ccon2|139\u003e IKE_SA con2[139] established between 203.0.113.1[203.0.113.1]...198.51.100.2[198.51.100.2]", "type": ["info"]}, "host": {"name": "fw01.corp.example"}, "log": {"syslog": {"priority": 30}}, "message": "06[IKE] \u003ccon2|139\u003e IKE_SA con2[139] established between 203.0.113.1[203.0.113.1]...198.51.100.2[198.51.100.2]", "observer": {"name": "fw01.corp.example", "product": "pfSense", "type": "firewall", "vendor": "Netgate", "version": "2.9.0"}, "process": {"name": "charon", "pid": 18610}, "related": {"ip": ["198.51.100.2", "203.0.113.1"]}, "source": {"ip": "198.51.100.2"}, "syslog": {"facility": {"code": 3}, "priority": 30, "severity": {"code": 6}}}`,
    },
  ],
};
