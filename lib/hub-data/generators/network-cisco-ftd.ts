import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoFtd: GeneratorMeta = {
  slug: 'network-cisco-ftd',
  displayName: 'Cisco Secure Firewall Threat Defense Security Events',
  category: 'network',
  description:
    'Cisco Secure Firewall Threat Defense (FTD) 6.6+ connection start, connection end and intrusion syslog messages from one FTD device in front of three DMZ web servers, for inbound internet traffic, as native syslog lines in event.original with ECS fields. For SIEM content on perimeter IPS and connection telemetry. Recurring episodes show the IPS dropping three or more distinct exploit signatures from one client against one server over HTTP, after which the client opens an HTTPS connection to that server.',
  dataSource:
    'Cisco Secure Firewall Threat Defense 6.6+ security event syslog messages 430001, 430002 and 430003, logged directly from the device',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native %FTD-<severity>-<id> syslog line in event.original',
    'Start, end and intrusion records share the Cisco correlation key',
    'Recurring multi-signature IPS drop chain followed by HTTPS',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Episodes recur on source time every 24 hours by default (minimum 2). The first starts within the first min(interval, 24 h) of generation, at a time drawn with the background record rate by hour (daytime about 1.8 times the night rate); each next one is due one interval after the previous episode's actual start and starts within a window of min(interval / 4, 6 h) centred on the due time, weighted by the square of that rate plus a small floor, so any hour stays possible. Missed intervals are not caught up. One client sends HTTP to one DMZ web server that triggers three distinct dropping signatures (four or five in about four episodes in ten), each on 1-3 connections that end as Block with High priority, then opens an HTTPS connection to the same server; 2.5-10 minutes from the first drop to the HTTPS connection measured. Client and server differ from the previous episode's. Every fragment also occurs in background; only an ordinary HTTPS connection start that would follow drops of three or more distinct signatures from the same client to the same server within the last hour is not opened: its record and connection end are dropped, and no other client or server takes its place.",
  generatorId: 'cisco-ftd',
  eventTypes: [
    {
      id: '430002 Allow',
      description: 'Connection start allowed by the access policy',
      frequency: '39.55% measured share',
      category: 'network',
    },
    {
      id: '430003 Allow',
      description: 'Connection end with no IPS drop',
      frequency: '32.97% measured share',
      category: 'network',
    },
    {
      id: '430002 Block',
      description:
        'Connection start blocked by the access policy at a closed port, zero counters',
      frequency: '9.72% measured share',
      category: 'network',
    },
    {
      id: '430001 Dropped',
      description: 'Intrusion event with InlineResult: Dropped',
      frequency: '6.57% measured share',
      category: 'intrusion_detection',
    },
    {
      id: '430003 Block',
      description: 'Connection end after the IPS dropped the connection',
      frequency: '6.57% measured share',
      category: 'network',
    },
    {
      id: '430001 generate-only',
      description: 'Intrusion event from a generate-only rule, no InlineResult',
      frequency: '4.62% measured share',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Every allowed connection has a 430002 and a 430003 sharing DeviceUUID, InstanceID, FirstPacketSecond and ConnectionID, the correlation key the Cisco guide defines; intrusion events carry the same key and fall between the start and end of their connection. A connection hit by a Drop and Generate rule ends as Block, any connection with an intrusion event ends with EventPriority High, and ConnectionDuration is the syslog time minus FirstPacketSecond.',
    'Three independent streams: visits scaled by an hour-of-day factor (1-4 connections, 82% HTTPS), flat probing bursts that trigger 1-5 distinct of ten signatures, and flat closed-port attempts blocked by the access policy. The 200 documentation-range clients each have a fixed log-normal activity weight and a fixed HTTP client.',
    'Signatures are 1:17279 and nine Snort 3 http_inspect built-in events (GID 119), five in the Drop and Generate state and five generate-only. IPS events occur only on HTTP, since HTTPS is not decrypted. Which rules drop is a policy assumption, and the fixture classification of 119:6 is reused for the other GID 119 events, whose revision is set to 1.',
    'Chain fragments occur in background: a 144-hour background capture holds 129-165 client-server pairs with three or more distinct dropped signatures within an hour. After a pair reaches three, the client keeps opening HTTP connections to that server and HTTPS connections to the other servers at its usual rate, and HTTPS to that server resumes once the drops are an hour old. Every episode client also talks to its server outside the episode.',
    'Only inbound IPv4 TCP to three web servers is modeled: no outbound users, identity, DNS, ICMP, UDP, NAT, SSL, Security Intelligence, file or malware events, and no Trust, Fastpath or Monitor actions. Counters, durations, rates, weights and the HTTP response mix are training assumptions; timestamps have one-second resolution and at most one record is emitted per second, so busy periods queue records by a few seconds.',
    'Field names and the correlation key follow the Cisco security event syslog guide, key order and header layout the Elastic cisco_ftd fixtures, with no syslog PRI or relay header. ECS follows the Elastic expected output, except that @timestamp is the syslog time for 430003 too and the event.type of a dropped intrusion event is inferred. Episode starts lean toward the busy daytime hours but may fall at any hour, and spread over the day at short intervals; KUMA handling of these fields is untested.',
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
      name: 'ftd_hostname',
      defaultValue: 'ftd-dmz-01',
      description: 'Syslog hostname and observer.hostname',
    },
    {
      name: 'device_uuid',
      defaultValue: '6c1d2f3a-7b8e-11ee-9f4a-5a1b2c3d4e5f',
      description: 'DeviceUUID',
    },
    {
      name: 'syslog_severity',
      defaultValue: '1',
      description: 'Severity in %FTD-<severity>-<id> and event.severity',
    },
    {
      name: 'snort_instances',
      defaultValue: '8',
      description: 'Number of Snort instances (InstanceID range)',
    },
    {
      name: 'ac_policy',
      defaultValue: 'DMZ-Access-Policy',
      description: 'ACPolicy',
    },
    {
      name: 'prefilter_policy',
      defaultValue: 'Default Prefilter Policy',
      description: 'Prefilter Policy',
    },
    {
      name: 'intrusion_policy',
      defaultValue: 'DMZ-IPS-Policy',
      description: 'IntrusionPolicy',
    },
    {
      name: 'nap_policy',
      defaultValue: 'Balanced Security and Connectivity',
      description: 'NAPPolicy',
    },
    {
      name: 'allow_rule',
      defaultValue: 'Allow-Inbound-Web',
      description: 'Access rule for web traffic',
    },
    {
      name: 'block_rule',
      defaultValue: 'Block-Inbound-Other',
      description: 'Access rule for closed ports',
    },
    {
      name: 'client_count',
      defaultValue: '200',
      description: 'Number of internet clients, 20 to 1,000',
    },
    {
      name: 'web_servers',
      defaultValue:
        '[172.16.10.11 www.example.com 55, 172.16.10.12 portal.example.com 30, 172.16.10.13 api.example.com 15]',
      description:
        'List of ip, host (ReferencedHost, URL) and weight; at least two',
    },
    {
      name: 'closed_ports',
      defaultValue: '[21, 22, 23, 25, 445, 1433, 3306, 3389, 5900, 8080]',
      description: 'Destination ports of blocked attempts',
    },
  ],
  sampleOutputs: [
    {
      title: 'HTTPS connection start completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-26T01:02:30+00:00", "cisco": {"ftd": {"security_event": {"ac_policy": "DMZ-Access-Policy", "access_control_rule_action": "Allow", "access_control_rule_name": "Allow-Inbound-Web", "connection_id": 52021, "device_uuid": "6c1d2f3a-7b8e-11ee-9f4a-5a1b2c3d4e5f", "dst_ip": "172.16.10.11", "dst_port": 443, "egress_interface": "dmz", "egress_vrf": "Global", "egress_zone": "DMZ", "event_priority": "Low", "first_packet_second": "2026-09-26T01:02:30Z", "ingress_interface": "outside", "ingress_vrf": "Global", "ingress_zone": "Outside", "initiator_bytes": 74, "initiator_packets": 1, "instance_id": 1, "nap_policy": "Balanced Security and Connectivity", "prefilter_policy": "Default Prefilter Policy", "protocol": "tcp", "responder_bytes": 0, "responder_packets": 0, "src_ip": "192.0.2.228", "src_port": 53998, "user": "No Authentication Required"}}}, "destination": {"bytes": 0, "ip": "172.16.10.11", "packets": 0, "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "connection-started", "category": ["network"], "code": "430002", "kind": "event", "original": "2026-09-26T01:02:30Z ftd-dmz-01  %FTD-1-430002: EventPriority: Low, DeviceUUID: 6c1d2f3a-7b8e-11ee-9f4a-5a1b2c3d4e5f, InstanceID: 1, FirstPacketSecond: 2026-09-26T01:02:30Z, ConnectionID: 52021, AccessControlRuleAction: Allow, SrcIP: 192.0.2.228, DstIP: 172.16.10.11, SrcPort: 53998, DstPort: 443, Protocol: tcp, IngressInterface: outside, EgressInterface: dmz, IngressZone: Outside, EgressZone: DMZ, IngressVRF: Global, EgressVRF: Global, ACPolicy: DMZ-Access-Policy, AccessControlRuleName: Allow-Inbound-Web, Prefilter Policy: Default Prefilter Policy, User: No Authentication Required, InitiatorPackets: 1, ResponderPackets: 0, InitiatorBytes: 74, ResponderBytes: 0, NAPPolicy: Balanced Security and Connectivity", "severity": 1, "timezone": "UTC", "type": ["connection", "start", "allowed"]}, "network": {"direction": "inbound", "iana_number": "6", "transport": "tcp"}, "observer": {"egress": {"interface": {"name": "dmz"}, "zone": "DMZ"}, "hostname": "ftd-dmz-01", "ingress": {"interface": {"name": "outside"}, "zone": "Outside"}, "product": "ftd", "type": "idps", "vendor": "Cisco"}, "related": {"hosts": ["ftd-dmz-01"], "ip": ["192.0.2.228", "172.16.10.11"]}, "rule": {"name": "Allow-Inbound-Web", "ruleset": "DMZ-Access-Policy"}, "source": {"bytes": 74, "ip": "192.0.2.228", "packets": 1, "port": 53998}}`,
    },
  ],
};
