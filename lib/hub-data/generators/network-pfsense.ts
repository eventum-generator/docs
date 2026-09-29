import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPfsense: GeneratorMeta = {
  slug: 'network-pfsense',
  displayName: 'pfSense Firewall and IPsec',
  category: 'network',
  description:
    'Remote syslog stream of one pfSense CE 2.9.0 firewall with eight site-to-site IPsec tunnels: filterlog records for LAN passes, WAN default-deny blocks and enc0 traffic through the tunnels, and charon records for Phase 1 lookups, failed and successful negotiations, CHILD_SA closures and IKE_SA deletions, as ECS JSON with the RFC 5424 line in event.original. Recurring episodes show a peer offering wrong identities until its tunnel comes up, followed by administrative access through it.',
  dataSource: 'pfSense CE 2.9.0 RFC 5424 filterlog and charon syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 9,
  templateCount: 1,
  highlights: [
    'Native filterlog CSV and charon SA bodies in RFC 5424 lines',
    'Independent lifecycles of eight site-to-site tunnels',
    'Recurring identity-mismatch tunnel followed by admin access',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'A branch peer offers a wrong Phase 1 identity three to five times (lookup, then no peer config found) with background retry gaps, then the configured one; the IKE_SA and CHILD_SA come up and a host of the site subnet makes one enc0 pass to an internal server on 445, 3389 or 5985 (about 71-211 s from the first lookup at the default interval). The tunnel then lives and closes like any background tunnel. Intervals are in event time (default 24 h, minimum 4): the first episode starts within the first min(interval, 24 h), later ones in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, each weighted towards busy office hours; missed episodes are not replayed. The episode is the next reconnection of a down site other than the previous one, so it starts after a delay (median 22 min at a 4 h interval, up to about 45 min, no hard upper bound). Background never completes the chain: an administrative pass that would finish it appears instead, at the same time and from the same host, as a pass to a non-administrative port and server drawn by the background non-administrative weights.',
  generatorId: 'network-pfsense',
  eventTypes: [
    {
      id: 'filterlog pass LAN',
      description: 'LAN pass, rule 115',
      frequency: '52.34% measured share',
      category: 'network',
    },
    {
      id: 'filterlog block WAN',
      description: 'WAN default deny, rule 5',
      frequency: '25.44% measured share',
      category: 'network',
    },
    {
      id: 'filterlog pass enc0',
      description: 'IPsec (enc0) pass, rule 146',
      frequency: '20.27% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-peer-lookup',
      description:
        'charon looking for pre-shared key peer configs matching ...',
      frequency: '0.53% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-ike-established',
      description: 'charon IKE_SA ... established between ...',
      frequency: '0.30% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-child-established',
      description: 'charon CHILD_SA ... established with SPIs ...',
      frequency: '0.30% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-child-closed',
      description: 'charon closing CHILD_SA ... with SPIs ...',
      frequency: '0.29% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-ike-deleting',
      description: 'charon deleting IKE_SA ... between ...',
      frequency: '0.29% measured share',
      category: 'network',
    },
    {
      id: 'ipsec-peer-not-found',
      description: 'charon no peer config found',
      frequency: '0.23% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'About 12,900 records per day. LAN and enc0 traffic follow a daily curve of about 133 records an hour at night to 750 at the 10:00-12:00 peak; WAN default-deny probes arrive at 143 an hour around the clock, with scanners sending one to four probes. Rates are synthetic workload choices.',
    'Each of eight site-to-site tunnels has its own lifecycle: negotiation, IKE_SA and CHILD_SA establishment, a lognormal lifetime (median 2.5 h), closure and deletion, and a lognormal pause (median 1 h). Some attempts offer a wrong Phase 1 identity and are retried until corrected or given up, so repeated failures and failures followed by a successful negotiation are ordinary. No tunnel is assumed up at the start of a run.',
    'Every enc0 pass requires an active CHILD_SA of its site, and closing and deleting records carry the native IDs, SPIs and selectors of the established SA. Administrative ports carry about a quarter of enc0 traffic, often followed by further management sessions from the same host to the same server. A pass record means a packet matched a pass rule, not that a connection or authentication succeeded.',
    'Records of the same moment (a lookup and its failure, IKE_SA and CHILD_SA, closure and deletion) are median 4-5 s apart and at most about 70 s at night, where real charon writes them within milliseconds.',
    'Selected profile: IPv4 TCP SYN and UDP DNS records, IKEv1 PSK site-to-site tunnels and default enc0 filtering; IPv6, ICMP, DHCP, NAT translation, OpenVPN, administrator logins and the full IKE exchange are not modeled. Real tunnels usually rekey without going down; the down periods stand for idle, DPD and reauthentication teardowns. CHILD_SA byte counters are synthetic.',
    'No complete CE 2.9.0 capture was found: filterlog grammar comes from Netgate documentation, charon bodies from Netgate troubleshooting examples and older real pfSense records, and close/delete bodies from upstream strongSwan 5.9.14. ECS source and destination on charon lines are derived from the message text, and live SIEM/parser compatibility is not verified.',
  ],
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
      title: 'IKE_SA of the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T10:19:59.653536+00:00", "data_stream": {"dataset": "pfsense.log", "namespace": "default", "type": "logs"}, "destination": {"ip": "203.0.113.1"}, "ecs": {"version": "8.17.0"}, "event": {"action": "ipsec-ike-established", "category": ["network"], "dataset": "pfsense.log", "kind": "event", "original": "\u003c30\u003e1 2026-09-01T10:19:59.653536+00:00 fw01.corp.example charon 18610 - - 10[IKE] \u003ccon2|803\u003e IKE_SA con2[803] established between 203.0.113.1[203.0.113.1]...198.51.100.2[198.51.100.2]", "type": ["info"]}, "host": {"name": "fw01.corp.example"}, "log": {"syslog": {"priority": 30}}, "message": "10[IKE] \u003ccon2|803\u003e IKE_SA con2[803] established between 203.0.113.1[203.0.113.1]...198.51.100.2[198.51.100.2]", "observer": {"name": "fw01.corp.example", "product": "pfSense", "type": "firewall", "vendor": "Netgate", "version": "2.9.0"}, "process": {"name": "charon", "pid": 18610}, "related": {"ip": ["198.51.100.2", "203.0.113.1"]}, "source": {"ip": "198.51.100.2"}, "syslog": {"facility": {"code": 3}, "priority": 30, "severity": {"code": 6}}}`,
    },
  ],
};
