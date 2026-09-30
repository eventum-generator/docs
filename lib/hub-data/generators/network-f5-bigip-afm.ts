/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkF5BigipAfm: GeneratorMeta = {
  slug: 'network-f5-bigip-afm',
  displayName: 'F5 BIG-IP Advanced Firewall Manager',
  category: 'network',
  description:
    'F5 BIG-IP AFM layer 3/4 firewall and Network DoS messages in the ArcSight CEF format as ECS JSON, for training SIEM content on perimeter firewall telemetry. One BIG-IP publishes five virtual servers on four internet-facing addresses; event.original holds the CEF body without a syslog envelope. About 28,400 records a day from 360 internet users and 40 scanners follow a UTC daily curve. This is the AFM stream, not ASM / Advanced WAF request logging. Recurring episodes show one scanner dropped on three or more closed ports of one address and then reaching a service on it.',
  dataSource:
    'F5 BIG-IP AFM 11.3.0 Network Event and Network DoS Event messages, ArcSight CEF formatter of a remote logging profile (External Monitoring Implementations 13.0.0 guide)',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'CEF key order from the F5 guide examples in event.original',
    'About 28,400 records a day from 360 users and 40 scanners',
    'Recurring closed-port scan that reaches an open service',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One scanner C is dropped by the global policy (drop_reason Policy) on three distinct closed ports of one public address A (four or five in about four episodes in ten), 1-3 attempts per port, then reaches a virtual server on A: Accept, or Open followed by Closed on flow-logging virtual servers. source.ip and destination.ip link all steps; an episode spans a median of about 3 minutes from the first drop to the allowed connection (43 s to 18 minutes). The first episode starts within the first anomaly_interval_hours (at most 24 h) of output, at a time of day drawn from the volume curve. Each later one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours: 21-27 h apart at the default. Busy hours are favoured only within each window, so consecutive starts can stay in the evening or night for several days. C hits closed ports of A at least five times a day on average and has not tried A in the preceding hour; client and address differ from the previous episode. Every fragment occurs in ordinary traffic; with anomaly_mode false the complete sequence never occurs.',
  generatorId: 'f5-afm',
  eventTypes: [
    {
      id: '23003137 Accept',
      description: 'Allowed connection on a rule-logging virtual server',
      frequency: '52.49% of records',
      category: 'network',
    },
    {
      id: '23003137 Open',
      description: 'Flow start on a flow-logging virtual server',
      frequency: '16.69% of records',
      category: 'network',
    },
    {
      id: '23003137 Closed',
      description: 'Flow end on a flow-logging virtual server',
      frequency: '16.67% of records',
      category: 'network',
    },
    {
      id: '23003137 Drop',
      description: 'Global-policy drop on a closed port',
      frequency: '13.99% of records',
      category: 'network',
    },
    {
      id: 'Attack Sampled',
      description: 'Network DoS dropped packet sample (action Drop)',
      frequency: '0.10% of records',
      category: 'network, intrusion_detection',
    },
    {
      id: 'Attack Started',
      description: 'Network DoS attack start (action None)',
      frequency: '0.02% of records',
      category: 'network, intrusion_detection',
    },
    {
      id: 'Attack Stopped',
      description: 'Network DoS attack stop (action None)',
      frequency: '0.02% of records',
      category: 'network, intrusion_detection',
    },
  ],
  realismFeatures: [
    'Rule-logging virtual servers (HTTPS, SMTP, DNS) log Accept with the matched ACL rule name; flow-logging ones (HTTP, VPN) log Open and Closed with an empty rule name, and an Open and its Closed share addresses and ports. Traffic to a port no virtual server listens on matches the global policy (cs1Label=Global, empty cs1) and is logged as Drop with drop_reason Policy. Network DoS Attack Started and Attack Stopped carry action None and empty addresses, Attack Sampled action Drop and the sampled packet addresses, all sharing one attack_id.',
    'About 28,400 records a day, from about 360 an hour at 03:00-04:00 UTC to about 1,900 an hour at 13:00-14:00 UTC; service use carries the daily curve while closed-port hits from scanners stay flat over the day. Day totals vary by about 3%.',
    '400 documentation-range clients (198.51.100.0/24, 192.0.2.0/24) with fixed activity weights. 360 users open sessions to one virtual server picked by weight (HTTPS 50, DNS 18, HTTP 12, VPN 12, SMTP 8), 1-4 connections each with log-normal gaps (median 15 s); HTTP flows last seconds, VPN flows about 25 minutes. About one user session start in sixty is instead a hit on one or two closed ports, followed by use of a virtual server on that address in about two cases in three.',
    '40 scanners hit 1-5 closed ports (21, 22, 23, 445, 1433, 3306, 3389, 5900, 8080, 8443) of one public address, 1-3 attempts per port. After one or two ports a scanner reaches a virtual server on that address about 100 s later (median) in four cases in five; after three or more it does not reach a service there within the next hour. A client returns to closed ports of the same address no sooner than an hour later. Scanners make about 1,150 such hits a day, users about 200; repeated attempts on one port are a median 5 s apart, consecutive ports 23 s.',
    'About six Network DoS attacks a day at random times: a start, 1-12 dropped samples about 40 s apart from one scanner address to one virtual server, then a stop. Attack names come from the guide DoS attack tables; attack IDs are random 32-bit values.',
    'Every chain fragment occurs in ordinary traffic: four days hold about 1,200 sets of drops on three or more distinct ports of one address and about 4,500 allowed connections within an hour of drops on one or two ports of the same address. Each episode adds about seven records of its own, and no field labels an episode.',
    'The guide gives full 11.3.0 CEF lines for Accept, Open, Closed and Attack Sampled, and key order follows them. Drop, Attack Started / Stopped and the global context have no CEF example and reuse layouts of other guide examples; start and stop carry cn4=0 where the Reporting Server start example leaves the route domain empty. Later BIG-IP versions add fields not modeled.',
    'Only IPv4 TCP/UDP on one VLAN and route domain: no IPv6, ICMP, Reject, Accept decisively, Established, IP intelligence, DNS or SIP DoS, or application DoS records. Virtual server and rule names, weights, rates, flow durations and the DoS attack mix are training assumptions; the device time zone is UTC, rt has one-second resolution, and records a real device logs milliseconds apart are seconds apart.',
    'Ordinary scanning is more regular than real scanners: a source that hits three or more closed ports of an address never reaches a service there within the next hour, and no source returns to closed ports of the same address within an hour. Episode starts follow the volume curve while scanner hits are flat, so episodes fall into daytime more often than ordinary three-port sets. There is no Elastic integration counterpart for AFM CEF; KUMA 4.2 lists F5 BIG-IP AFM CEF over Syslog as a supported source, but its normalizer has not been tested.',
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
      description: 'Episode interval in hours, 2-8760',
    },
    {
      name: 'bigip_host',
      defaultValue: 'bigip-afm.lab.example',
      description: 'dvchost and observer.name',
    },
    {
      name: 'bigip_management_ip',
      defaultValue: '10.0.0.5',
      description: 'dvc and observer.ip',
    },
    {
      name: 'product_version',
      defaultValue: '11.3.0.2790.300',
      description: 'CEF device version (build of the guide DoS example)',
    },
    {
      name: 'vlan',
      defaultValue: '/Common/external',
      description: 'cs2 (vlan)',
    },
    {
      name: 'route_domain',
      defaultValue: '0',
      description: 'cn4 (route_domain)',
    },
    {
      name: 'virtual_servers',
      defaultValue: '5 virtual servers',
      description:
        'List of name, address, port, protocol (TCP/UDP), logging (rule logs Accept, flow logs Open/Closed), rule (ACL rule name for rule logging) and weight; at least two distinct addresses',
    },
    {
      name: 'deny_rule',
      defaultValue: 'deny_inbound',
      description: 'cs5 (acl_rule_name) of global-policy drops',
    },
    {
      name: 'closed_ports',
      defaultValue: '[21, 22, 23, 445, 1433, 3306, 3389, 5900, 8080, 8443]',
      description:
        'Ports hit by closed-port attempts and episodes; no virtual server may use them, at least five are needed',
    },
  ],
  sampleOutputs: [
    {
      title: 'Accept that completes an episode (step 4)',
      json: String.raw`{"@timestamp": "2026-09-04T10:49:54+00:00", "destination": {"ip": "203.0.113.10", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "accept", "category": ["network"], "code": "23003137", "kind": "event", "original": "CEF:0|F5|Advanced Firewall Module|11.3.0.2790.300|23003137|Network Event|8|rt=Sep 04 2026 10:49:54 dvchost=bigip-afm.lab.example dvc=10.0.0.5 src=192.0.2.175 spt=38537 dst=203.0.113.10 dpt=443 proto=TCP cs1=/Common/www_https_vs cs1Label=virtual_name cs2=/Common/external cs2Label=vlan act=Accept c6a2= c6a2Label=source_address c6a3= c6a3Label=destination_address cs3= cs3Label=drop_reason cn4=0 cn4Label=route_domain cs5=allow_https cs5Label=acl_rule_name", "severity": 8, "type": ["connection", "allowed"]}, "f5": {"afm": {"acl_rule_name": "allow_https", "action": "Accept", "drop_reason": "", "route_domain": 0, "virtual_name": "/Common/www_https_vs", "vlan": "/Common/external"}}, "network": {"transport": "tcp", "type": "ipv4"}, "observer": {"ip": ["10.0.0.5"], "name": "bigip-afm.lab.example", "product": "Advanced Firewall Module", "type": "firewall", "vendor": "F5", "version": "11.3.0.2790.300"}, "related": {"ip": ["192.0.2.175", "203.0.113.10", "10.0.0.5"]}, "rule": {"name": "allow_https"}, "source": {"ip": "192.0.2.175", "port": 38537}}`,
    },
  ],
};
