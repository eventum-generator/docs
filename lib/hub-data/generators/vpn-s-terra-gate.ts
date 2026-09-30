import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnSTerraGate: GeneratorMeta = {
  slug: 'vpn-s-terra-gate',
  displayName: 'S-Terra Gate VPN Gateway',
  category: 'network',
  description:
    "The vpnsvc log of one S-Terra Gate 4.1 remote-access VPN gateway as ECS JSON, for training SIEM content on Russian certified IPsec VPN telemetry, with the native syslog line in event.original. About 2,000 S-Terra Client users in 40 branch offices connect from their office NAT address or from mobile-carrier NAT pools, about 39,800 lines a day following Moscow office hours. Recurring episodes show failed IKE authentication for two identities from one branch address, followed by an administrator's management-network tunnel from it.",
  dataSource: 'S-Terra Gate 4.1 vpnsvc log, /var/log/cspvpngate.log or syslog',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native vpnsvc syslog line with MSG ID in event.original',
    '2,000 users in 40 branch offices on Moscow office hours',
    'Recurring two-identity failures, then a management tunnel',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "From one branch office address P within 45 minutes: IKE authentication fails for identity A (1-4 times), then for another identity B (1-4 times), then administrator C creates an ISAKMP connection, is assigned an IKECFG address and establishes an IPsec connection to the management network (MGMT-NET filter); in half of the episodes an office tunnel follows. A and B are users of the branch behind P, C is an administrator of that branch; A's first failure to C's tunnel usually spans 1-29 minutes (median 6, at most 40). A and B may connect successfully later as ordinary users do, and C's session ends with the usual deletions and closures. The first episode starts within min(anomaly_interval_hours, 24 h) of the start of the output, at an hour drawn from the volume curve; each later one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts within a window of min(interval / 4, 6 h) centred on the due time, weighted towards office hours. A late episode never causes catch-up; rarely, when no suitable users are free, an episode is not written and the next one follows an interval later. C and P differ from the previous episode. Each fragment occurs in ordinary traffic; only the complete sequence is kept out of it.",
  generatorId: 's-terra-gate',
  eventTypes: [
    {
      id: '1000001A',
      description:
        'Received deletion for IPSec / ISAKMP connection (MSG_ID_IKE_DELETION_RECV, INFO)',
      frequency: '28.11% of records',
      category: 'network',
    },
    {
      id: '00100119',
      description:
        'IPSec connection established (MSG_ID_LP_HOST_CONNECTED, NOTICE)',
      frequency: '14.20% of records',
      category: 'network',
    },
    {
      id: '0010011D',
      description:
        'IPSec connection closed (MSG_ID_LP_CONNECTION_CLOSED, NOTICE)',
      frequency: '14.12% of records',
      category: 'network',
    },
    {
      id: '10000005',
      description: 'ISAKMP connection created (MSG_ID_IKE_SA_CREATED, INFO)',
      frequency: '14.06% of records',
      category: 'network',
    },
    {
      id: '10002001',
      description: 'IKECFG address assigned (MSG_ID_IKE_IKECFG_ASSIGNED, INFO)',
      frequency: '14.06% of records',
      category: 'network',
    },
    {
      id: '10000006',
      description: 'ISAKMP connection closed (MSG_ID_IKE_SA_CLOSED, INFO)',
      frequency: '13.99% of records',
      category: 'network',
    },
    {
      id: '0010011C',
      description:
        'Incoming connection failed (MSG_ID_LP_INCOMING_CONNECTION_FAILURE, ERR)',
      frequency: '1.45% of records',
      category: 'network, authentication',
    },
  ],
  realismFeatures: [
    'event.original holds the line as S-Terra Gate writes it: BSD timestamp, host, vpnsvc:, the eight-digit MSG ID, the optional <n:m> IKE session and the body built from the vendor template for that MSG ID. The surrounding JSON maps the template parameters to ECS and s_terra.vpn_gate.*; a collector that parses S-Terra syslog needs event.original.',
    'A session creates the ISAKMP connection, assigns an IKECFG address and establishes one IPsec connection to the office network or, for the 20 administrators, usually one to the management network and sometimes both; the client then deletes each IPsec connection and the ISAKMP connection, and the gateway logs each closure. The opening lines are 0-3 s apart. ISAKMP and IPsec connection numbers come from one gateway counter, exchange numbers in <n:m> grow per ISAKMP connection, and IKECFG addresses are never held by two open sessions at once.',
    'Volume follows Moscow office hours (UTC+3) on a UTC syslog clock: 0.12 lines/s from 00:00 to 07:00 Moscow time, 0.80 from 09:00 to 18:00, with graded morning and evening hours. About 39,800 lines a day, varying by about 3%; about 5,600 sessions start per day and up to about 900 are open at once in office hours. There is no weekday/weekend difference.',
    'Each user has a fixed activity level: busier users connect more often and hold shorter sessions (median about 40-150 minutes, at most 8 hours), with at most one attempt or session at a time. Users connect from their office NAT address 80% of the time, otherwise from one address of their mobile carrier pool, with a random NAT source port per attempt. Administrators open the management tunnel in 80% of their sessions, half of those together with the office tunnel.',
    'Each user has a fixed failure propensity (median 4%) and 5.4% of connection attempts fail: once in 45% of failing attempts, twice in 30%, three times in 15%, four times in 10% (gaps median 35 s); 75% of them end in a session. One or two times a day a site-wide problem makes two or more users behind one office address fail 1-3 times each within minutes; 60% of them connect later.',
    "Per day ordinary traffic holds about 60-75 failures of a second identity at an address within 45 minutes of another identity's failure, about 250-280 tunnels opened from an address where two identities failed in the preceding 45 minutes, and about 25 management tunnels after one identity's failure at the same address. With anomaly_mode on, these counts are about one per episode higher.",
    'Message bodies follow the S-Terra Gate 4.1 event catalog, and one raw 00100119 line confirms the frame; the pack writes one space before vpnsvc: where that line has two. The 0010011D deletion reason is a placeholder, the optional stage and reason of 0010011C are omitted, and selector subnet notation, RA-MAP names and proxy ARP for every IKECFG address are assumptions.',
    'Only INFO-and-above remote-access concentrator lines are generated: no DEBUG exchange details, site-to-site peers, re-keying, DPD or lifetime expiry, RADIUS/XAUTH, certificate or KERNEL filter messages, and every session ends with client deletions. Lines carry no year or time zone. Rates, user counts, addresses and behavior are training assumptions, the ECS mapping is assumed because no Elastic integration exists, and SIEM normalizer compatibility is not tested.',
    'In live mode a record arrives after its own timestamp: under a minute in office hours, up to about 4 minutes at night and up to about 9 minutes around midnight Moscow time. Timestamps stay in order; live detection rules should look back at least 10 minutes.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to ordinary traffic; false produces ordinary traffic only',
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
      json: String.raw`{"@timestamp": "2026-09-21T04:50:33+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "ipsec-connection-established", "category": ["network"], "code": "00100119", "dataset": "s_terra.vpn_gate", "kind": "event", "module": "s_terra", "original": "Sep 21 04:50:33 vpn-gw-01 vpnsvc: 00100119 \u003c5504:2\u003e IPSec connection 5505 established, traffic selector 10.99.2.39-\u003e10.0.10.0/24, peer 203.0.113.177:52883, id \"n.efimov@contoso.example\", Filter IPsec:Protect:RA-MAP:20:MGMT-NET, IPsecAction IPsecAction:RA-MAP:20, IKERule IKERule:RA-MAP:10", "outcome": "success", "type": ["start", "connection"]}, "log": {"level": "notice"}, "observer": {"hostname": "vpn-gw-01", "product": "S-Terra Gate", "type": "vpn", "vendor": "S-Terra", "version": "4.1"}, "process": {"name": "vpnsvc"}, "related": {"ip": ["203.0.113.177", "10.99.2.39"], "user": ["n.efimov@contoso.example"]}, "s_terra": {"vpn_gate": {"filter": "IPsec:Protect:RA-MAP:20:MGMT-NET", "ike_id": "n.efimov@contoso.example", "ike_rule": "IKERule:RA-MAP:10", "ipsec_action": "IPsecAction:RA-MAP:20", "ipsec_connection_id": 5505, "isakmp_connection_id": 5504, "msg_id": "00100119", "msg_name": "MSG_ID_LP_HOST_CONNECTED", "section": "LP", "session_id": "\u003c5504:2\u003e", "severity": "NOTICE", "traffic_selector": "10.99.2.39-\u003e10.0.10.0/24"}}, "source": {"ip": "203.0.113.177", "port": 52883}, "user": {"name": "n.efimov@contoso.example"}}`,
    },
  ],
};
