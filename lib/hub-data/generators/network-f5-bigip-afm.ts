/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkF5BigipAfm: GeneratorMeta = {
  slug: 'network-f5-bigip-afm',
  displayName: 'F5 BIG-IP Advanced Firewall Manager',
  category: 'network',
  description:
    'F5 BIG-IP AFM layer 3/4 firewall and Network DoS messages in the ArcSight CEF format as ECS JSON, for training SIEM content on perimeter firewall telemetry. One BIG-IP publishes five virtual servers on four internet-facing addresses; event.original holds the CEF body without a syslog envelope. This is the AFM stream, not ASM / Advanced WAF request logging. Recurring episodes show one client dropped on several closed ports of one address and then reaching a service on it.',
  dataSource:
    'F5 BIG-IP AFM 11.3.0 Network Event and Network DoS Event messages, ArcSight CEF formatter of a remote logging profile (External Monitoring Implementations 13.0.0 guide)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'CEF key order from the F5 guide examples in event.original',
    'Accept, Open/Closed, global-policy Drop and Network DoS records',
    'Recurring closed-port scan that reaches an open service',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every 24 hours of source time by default, first one interval after generation starts, and starts after a random delay (exponential, mean 20 min); the next due time counts from the actual start, so a late episode never causes catch-up. One client is dropped by the global policy on three distinct closed ports of one public address (four or five in about four episodes in ten), 1-3 attempts per port, then reaches a virtual server on that address (Accept, or Open followed by Closed); 114 s to 11 minutes measured at the default interval. Client and address differ from the previous episode; every fragment occurs in background, and only the complete sequence is kept out of it.',
  generatorId: 'f5-afm',
  eventTypes: [
    {
      id: '23003137 Accept',
      description: 'Allowed connection on a rule-logging virtual server',
      frequency: '51.07% measured share',
      category: 'network',
    },
    {
      id: '23003137 Open',
      description: 'Flow start on a flow-logging virtual server',
      frequency: '17.07% measured share',
      category: 'network',
    },
    {
      id: '23003137 Closed',
      description: 'Flow end on a flow-logging virtual server',
      frequency: '17.04% measured share',
      category: 'network',
    },
    {
      id: '23003137 Drop',
      description: 'Global-policy drop on a closed port',
      frequency: '14.06% measured share',
      category: 'network',
    },
    {
      id: 'Attack Sampled',
      description: 'Network DoS dropped packet sample (action Drop)',
      frequency: '0.51% measured share',
      category: 'network, intrusion_detection',
    },
    {
      id: 'Attack Started',
      description: 'Network DoS attack start (action None)',
      frequency: '0.13% measured share',
      category: 'network, intrusion_detection',
    },
    {
      id: 'Attack Stopped',
      description: 'Network DoS attack stop (action None)',
      frequency: '0.13% measured share',
      category: 'network, intrusion_detection',
    },
  ],
  realismFeatures: [
    'Rule-logging virtual servers (HTTPS, SMTP, DNS) log Accept with the matched ACL rule name; flow-logging ones (HTTP, VPN) log Open and Closed with an empty rule name, and an Open and its Closed share addresses and ports. Traffic to a port no virtual server listens on matches the global policy and is logged as Drop with drop_reason Policy. Network DoS start, sampled drops and stop share one attack_id.',
    'Three independent Poisson streams feed at most one record per second: service use (0.055/s, hour-of-day factor 1.38 07:00-19:00 UTC, 0.92 until 23:00, 0.46 at night), flat closed-port hits (0.0055/s, 1-5 ports, 1-3 attempts each, half followed by service use about 90 s later) and one DoS attack per two hours on average with 1-12 sampled drops.',
    '160 documentation-range clients with fixed log-normal activity weights are shared by all three streams, so a busy client is busy everywhere. A 78 h background capture holds about 420 sets of drops on three or more distinct ports of one address and about 2,200 allowed connections within an hour of drops on one or two ports; only the complete sequence is kept out of the background.',
    'The guide gives full 11.3.0 CEF lines for Accept, Open, Closed and Attack Sampled, and key order follows them. Drop, Attack Started / Stopped and the global context have no CEF example and reuse layouts of other guide examples; start and stop carry cn4=0 where the Reporting Server start example leaves the route domain empty. Later BIG-IP versions add fields not modeled.',
    'Only IPv4 TCP/UDP on one VLAN and route domain: no IPv6, ICMP, Reject, Accept decisively, Established, IP intelligence, DNS or SIP DoS, or application DoS records. Virtual server and rule names, weights, rates, flow durations and the DoS attack mix are training assumptions; the device time zone is UTC and rt has one-second resolution.',
    'Episodes start at any hour, while ordinary service use follows the hour-of-day factor. There is no Elastic integration counterpart for AFM CEF; KUMA 4.2 lists F5 BIG-IP AFM CEF as a supported source, but its normalizer has not been tested.',
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
      name: 'client_count',
      defaultValue: '160',
      description: 'Number of internet clients, 20-500',
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
        'Ports hit by closed-port attempts and episodes; no virtual server may use them, and at least five are needed for episodes to vary',
    },
  ],
  sampleOutputs: [
    {
      title: 'Open that completes the first episode (step 4)',
      json: String.raw`{"@timestamp": "2026-09-27T00:14:12+00:00", "destination": {"ip": "203.0.113.10", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"action": "open", "category": ["network"], "code": "23003137", "kind": "event", "original": "CEF:0|F5|Advanced Firewall Module|11.3.0.2790.300|23003137|Network Event|8|rt=Sep 27 2026 00:14:12 dvchost=bigip-afm.lab.example dvc=10.0.0.5 src=192.0.2.54 spt=10199 dst=203.0.113.10 dpt=80 proto=TCP cs1=/Common/www_http_vs cs1Label=virtual_name cs2=/Common/external cs2Label=vlan act=Open c6a2= c6a2Label=source_address c6a3= c6a3Label=destination_address cs3= cs3Label=drop_reason cn4=0 cn4Label=route_domain cs5= cs5Label=acl_rule_name", "severity": 8, "type": ["connection", "start"]}, "f5": {"afm": {"acl_rule_name": "", "action": "Open", "drop_reason": "", "route_domain": 0, "virtual_name": "/Common/www_http_vs", "vlan": "/Common/external"}}, "network": {"transport": "tcp", "type": "ipv4"}, "observer": {"ip": ["10.0.0.5"], "name": "bigip-afm.lab.example", "product": "Advanced Firewall Module", "type": "firewall", "vendor": "F5", "version": "11.3.0.2790.300"}, "related": {"ip": ["192.0.2.54", "203.0.113.10", "10.0.0.5"]}, "source": {"ip": "192.0.2.54", "port": 10199}}`,
    },
  ],
};
