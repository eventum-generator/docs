import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnSTerraGate: GeneratorMeta = {
  slug: 'vpn-s-terra-gate',
  displayName: 'S-Terra Gate VPN Gateway',
  category: 'network',
  description:
    'The vpnsvc log of one S-Terra Gate 4.1 remote-access VPN gateway as ECS JSON, for training SIEM content on Russian certified IPsec VPN telemetry, with the native syslog line in event.original. About 60 S-Terra Client users connect from eight office and four mobile-carrier NAT addresses. Recurring episodes show failed IKE authentication for two identities from one address, followed by a management-network tunnel from it.',
  dataSource: 'S-Terra Gate 4.1 vpnsvc log, /var/log/cspvpngate.log or syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native vpnsvc syslog line with MSG ID in event.original',
    'Full ISAKMP, IKECFG and IPsec session lifecycle',
    'Recurring two-identity failures, then a management tunnel',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every 24 hours of source time by default (minimum 2), the first one interval after generation starts. Once due it starts with a per-second probability proportional to the office-hours factor (mean delay 56 minutes during office hours, longer in the evening and at night); the next due time counts from the actual start, so a late episode never causes catch-up. From one office address, IKE authentication fails for identity A and then for another identity B (1-3 times each), then an administrator from that address creates an ISAKMP connection, is assigned an IKECFG address and establishes an IPsec connection to the management network. Every fragment occurs in background; only the complete sequence is kept out of it.',
  generatorId: 's-terra-gate',
  eventTypes: [
    {
      id: '1000001A',
      description:
        'Received deletion for IPSec / ISAKMP connection (MSG_ID_IKE_DELETION_RECV, INFO)',
      frequency: '27.76% measured share',
      category: 'network',
    },
    {
      id: '00100119',
      description:
        'IPSec connection established (MSG_ID_LP_HOST_CONNECTED, NOTICE)',
      frequency: '14.09% measured share',
      category: 'network',
    },
    {
      id: '0010011D',
      description:
        'IPSec connection closed (MSG_ID_LP_CONNECTION_CLOSED, NOTICE)',
      frequency: '13.95% measured share',
      category: 'network',
    },
    {
      id: '10000005',
      description: 'ISAKMP connection created (MSG_ID_IKE_SA_CREATED, INFO)',
      frequency: '13.94% measured share',
      category: 'network',
    },
    {
      id: '10002001',
      description: 'IKECFG address assigned (MSG_ID_IKE_IKECFG_ASSIGNED, INFO)',
      frequency: '13.94% measured share',
      category: 'network',
    },
    {
      id: '10000006',
      description: 'ISAKMP connection closed (MSG_ID_IKE_SA_CLOSED, INFO)',
      frequency: '13.80% measured share',
      category: 'network',
    },
    {
      id: '0010011C',
      description:
        'Incoming connection failed (MSG_ID_LP_INCOMING_CONNECTION_FAILURE, ERR)',
      frequency: '2.53% measured share',
      category: 'network, authentication',
    },
  ],
  realismFeatures: [
    'event.original holds the line as S-Terra Gate writes it: BSD timestamp, host, vpnsvc:, the eight-digit MSG ID, the optional <n:m> IKE session and the body built from the vendor template for that MSG ID. The surrounding JSON maps the template parameters to ECS and s_terra.vpn_gate.*.',
    'A session creates the ISAKMP connection, assigns an IKECFG address and establishes one IPsec connection to the office network or, for the five administrators, often one to the management network and sometimes both; the client then deletes each connection and the gateway logs each closure. ISAKMP and IPsec connection numbers come from one gateway counter, and exchange numbers in <n:m> grow per ISAKMP connection.',
    'Connection attempts arrive as one merged Poisson stream scaled by a Moscow-time office-hours factor, and each picks a user by a fixed log-normal weight, so users act independently. Users connect from their office NAT address 80% of the time, sessions last a log-normal median of 90 minutes (at most 10 hours), and each one-second tick emits at most one record.',
    'Each user has a fixed failure propensity (median 5%, at most 40%); a failing attempt is repeated 1-4 times and 75% of such series end in a session. About twice a day a site-wide problem makes two or more users behind one office address fail within minutes. Over 78 hours a background-only capture holds 110-171 failures, 17-28 failures for a second identity at one address within 45 minutes and 2-5 management tunnels after a single-identity failure; episode identities A and B almost always give up after failing.',
    'Message bodies follow the S-Terra Gate 4.1 event catalog, and one raw 00100119 line confirms the frame; the pack writes one space before vpnsvc: where that line has two. The 0010011D deletion reason is a placeholder, the optional stage and reason of 0010011C are omitted, and selector subnet notation, RA-MAP names and proxy ARP for every IKECFG address are assumptions.',
    'Only INFO-and-above remote-access concentrator lines are generated: no DEBUG exchange details, site-to-site peers, re-keying, DPD or lifetime expiry, RADIUS/XAUTH, certificate or KERNEL filter messages. The clock is UTC with no year or time zone and no weekday effect; rates and behavior are training assumptions, the ECS mapping is assumed because no Elastic integration exists, and SIEM normalizer compatibility is not tested.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to the background; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2 to 8,760',
    },
    {
      name: 'gateway_host',
      defaultValue: 'vpn-gw-01',
      description: 'Syslog host name and observer.hostname',
    },
    {
      name: 'user_domain',
      defaultValue: 'contoso.example',
      description: 'Domain of the USER_FQDN IKE identities',
    },
  ],
  sampleOutputs: [
    {
      title: 'Management tunnel completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-22T00:49:58+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "ipsec-connection-established", "category": ["network"], "code": "00100119", "dataset": "s_terra.vpn_gate", "kind": "event", "module": "s_terra", "original": "Sep 22 00:49:58 vpn-gw-01 vpnsvc: 00100119 \u003c8801:2\u003e IPSec connection 8802 established, traffic selector 10.99.1.76-\u003e10.0.10.0/24, peer 198.51.100.14:12933, id \"n.komarova@contoso.example\", Filter IPsec:Protect:RA-MAP:20:MGMT-NET, IPsecAction IPsecAction:RA-MAP:20, IKERule IKERule:RA-MAP:10", "outcome": "success", "type": ["start", "connection"]}, "log": {"level": "notice"}, "observer": {"hostname": "vpn-gw-01", "product": "S-Terra Gate", "type": "vpn", "vendor": "S-Terra", "version": "4.1"}, "process": {"name": "vpnsvc"}, "related": {"ip": ["198.51.100.14", "10.99.1.76"], "user": ["n.komarova@contoso.example"]}, "s_terra": {"vpn_gate": {"filter": "IPsec:Protect:RA-MAP:20:MGMT-NET", "ike_id": "n.komarova@contoso.example", "ike_rule": "IKERule:RA-MAP:10", "ipsec_action": "IPsecAction:RA-MAP:20", "ipsec_connection_id": 8802, "isakmp_connection_id": 8801, "msg_id": "00100119", "msg_name": "MSG_ID_LP_HOST_CONNECTED", "section": "LP", "session_id": "\u003c8801:2\u003e", "severity": "NOTICE", "traffic_selector": "10.99.1.76-\u003e10.0.10.0/24"}}, "source": {"ip": "198.51.100.14", "port": 12933}, "user": {"name": "n.komarova@contoso.example"}}`,
    },
  ],
};
