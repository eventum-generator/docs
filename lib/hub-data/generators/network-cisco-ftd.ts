import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoFtd: GeneratorMeta = {
  slug: 'network-cisco-ftd',
  displayName: 'Cisco Secure Firewall Threat Defense Security Events',
  category: 'network',
  description:
    'Cisco Secure Firewall Threat Defense (FTD) 6.6+ connection start, connection end and intrusion syslog messages from one FTD device in front of three DMZ web servers, for inbound traffic from 600 internet clients, as native syslog lines in event.original with ECS fields. About 29,800 records a day, from about 740 an hour around midnight UTC to about 1,680 at midday. For SIEM content on perimeter IPS and connection telemetry. Recurring episodes show the IPS dropping three or more distinct exploit signatures from one client against one server over HTTP, after which the client opens an HTTPS connection to that server.',
  dataSource:
    'Cisco Secure Firewall Threat Defense 6.6+ security event syslog messages 430001, 430002 and 430003, logged directly from the device',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native %FTD-<severity>-<id> syslog line in event.original',
    'Start, end and intrusion records share the Cisco correlation key',
    'Recurring multi-signature IPS drop chain followed by HTTPS',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One client sends HTTP to one DMZ web server that triggers three distinct dropping signatures (four or five in about four episodes in ten), each on 1-3 connections that end as Block with High priority, then opens an HTTPS connection to the same server 20 s to 10 minutes after its last drop, usually 1-14 minutes after its first drop and always within the hour. Episodes recur in event time every anomaly_interval_hours (default 24, minimum 2). The first starts within the first min(interval, 24 h) of the data, at a time drawn with the record rate by hour (midday about 2.2 times the night rate); each next one is due one interval after the previous episode's actual start and starts within a window of min(interval / 4, 6 h) centred on the due time, weighted by the square of that rate plus a small floor, so any hour stays possible. Missed intervals are not caught up; consecutive episodes start 21-27 h apart at the default and 5.25-6.75 h apart at 6 hours. Client and server differ from the previous episode's, and every episode client and client-server pair also occurs in ordinary traffic, which continues around the episode. Every fragment also occurs in background, where about 50-75 client-server pairs a day reach three or more distinct dropped signatures within an hour; only the complete sequence is kept out: while a server has dropped three or more distinct signatures of a client within the last hour (counted from the first of those drops), that client's ordinary HTTPS connections go to one of the other servers (about 44 a day, 0.5% of HTTPS starts), and its HTTP connections to that server continue.",
  generatorId: 'cisco-ftd',
  eventTypes: [
    {
      id: '430003 Allow',
      description: 'Connection end with no IPS drop',
      frequency: '37.35% of records',
      category: 'network',
    },
    {
      id: '430002 Allow HTTPS',
      description: 'Connection start allowed by the access policy, HTTPS (443)',
      frequency: '28.37% of records',
      category: 'network',
    },
    {
      id: '430002 Allow HTTP',
      description: 'Connection start allowed by the access policy, HTTP (80)',
      frequency: '13.07% of records',
      category: 'network',
    },
    {
      id: '430002 Block',
      description:
        'Connection start blocked by the access policy at a closed port, zero counters',
      frequency: '10.08% of records',
      category: 'network',
    },
    {
      id: '430001 Dropped',
      description: 'Intrusion event with InlineResult: Dropped',
      frequency: '4.08% of records',
      category: 'intrusion_detection',
    },
    {
      id: '430003 Block',
      description: 'Connection end after the IPS dropped the connection',
      frequency: '4.08% of records',
      category: 'network',
    },
    {
      id: '430001 generate-only',
      description: 'Intrusion event from a generate-only rule, no InlineResult',
      frequency: '2.97% of records',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Every allowed connection has a 430002 and a 430003 sharing DeviceUUID, InstanceID, FirstPacketSecond and ConnectionID, the correlation key the Cisco guide defines; intrusion events carry the same key and fall between the start and end of their connection. A connection hit by a Drop and Generate rule ends as Block, any connection with an intrusion event ends with EventPriority High, and ConnectionDuration is the syslog time minus FirstPacketSecond. Connections blocked by the access policy are logged at the beginning only, with zero counters.',
    'Visitor traffic follows a daily curve peaking around 12:00 UTC, while scanners and probing clients are flat over the day. Visits (about 6,000 a day) open 1-4 connections to one server, 82% HTTPS; an HTTP connection triggers a generate-only signature with probability 5% and a dropping one with 1.2%. Probing bursts (about 600 a day) trigger 1-5 distinct of the ten signatures on 1-3 connections each, then half the time an ordinary HTTPS or HTTP connection to the same server 20 s to 10 minutes after the last intrusion event. About 2,000 attempts a day at closed ports are blocked by the access policy.',
    'Clients are 600 documentation-range addresses in 198.51.100.0/24, 203.0.113.0/24 and 192.0.2.0/24, each with a fixed activity weight between 0.3 and 5 and a fixed HTTP client (Chrome, Firefox or cURL), shared by visits, probing and blocked attempts; about 595 of them appear on any given day. Source ports, Snort instances and counter increments are random.',
    'Signatures are 1:17279 and nine Snort 3 http_inspect built-in events (GID 119), five in the Drop and Generate state and five generate-only. IPS events occur only on HTTP, since HTTPS is not decrypted. Which rules drop is a policy assumption, and the fixture classification of 119:6 is reused for the other GID 119 events, whose revision is set to 1.',
    'Records of one moment are spread over several seconds: consecutive records are a median 2 s apart (90th percentile 7 s), an intrusion event follows its connection start by a median 8 s (90th percentile 25 s) instead of about a second, and a connection the IPS dropped lasts a median 14 s instead of a few seconds. Timestamps have one-second resolution in UTC. With anomaly_mode on, counts of the chain parts are about one per episode higher than with it off.',
    'Only inbound IPv4 TCP to three web servers is modeled: no outbound users or identity (User is always No Authentication Required), DNS, ICMP, UDP, NAT, SSL, Security Intelligence, file or malware events, and no Trust, Fastpath or Monitor actions; IPSCount, UserAgent, ClientVersion and WebApplication are omitted. Counters, durations, rates, weights and the HTTP response mix are training assumptions, not measured values.',
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
      description: 'Episode interval in event hours, 2 to 8,760',
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
      json: String.raw`{"@timestamp": "2026-09-01T10:16:40+00:00", "cisco": {"ftd": {"security_event": {"ac_policy": "DMZ-Access-Policy", "access_control_rule_action": "Allow", "access_control_rule_name": "Allow-Inbound-Web", "connection_id": 30343, "device_uuid": "6c1d2f3a-7b8e-11ee-9f4a-5a1b2c3d4e5f", "dst_ip": "172.16.10.12", "dst_port": 443, "egress_interface": "dmz", "egress_vrf": "Global", "egress_zone": "DMZ", "event_priority": "Low", "first_packet_second": "2026-09-01T10:16:40Z", "ingress_interface": "outside", "ingress_vrf": "Global", "ingress_zone": "Outside", "initiator_bytes": 140, "initiator_packets": 2, "instance_id": 8, "nap_policy": "Balanced Security and Connectivity", "prefilter_policy": "Default Prefilter Policy", "protocol": "tcp", "responder_bytes": 74, "responder_packets": 1, "src_ip": "192.0.2.155", "src_port": 2512, "user": "No Authentication Required"}}}, "destination": {"bytes": 74, "ip": "172.16.10.12", "packets": 1, "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "connection-started", "category": ["network"], "code": "430002", "kind": "event", "original": "2026-09-01T10:16:40Z ftd-dmz-01  %FTD-1-430002: EventPriority: Low, DeviceUUID: 6c1d2f3a-7b8e-11ee-9f4a-5a1b2c3d4e5f, InstanceID: 8, FirstPacketSecond: 2026-09-01T10:16:40Z, ConnectionID: 30343, AccessControlRuleAction: Allow, SrcIP: 192.0.2.155, DstIP: 172.16.10.12, SrcPort: 2512, DstPort: 443, Protocol: tcp, IngressInterface: outside, EgressInterface: dmz, IngressZone: Outside, EgressZone: DMZ, IngressVRF: Global, EgressVRF: Global, ACPolicy: DMZ-Access-Policy, AccessControlRuleName: Allow-Inbound-Web, Prefilter Policy: Default Prefilter Policy, User: No Authentication Required, InitiatorPackets: 2, ResponderPackets: 1, InitiatorBytes: 140, ResponderBytes: 74, NAPPolicy: Balanced Security and Connectivity", "severity": 1, "timezone": "UTC", "type": ["connection", "start", "allowed"]}, "network": {"direction": "inbound", "iana_number": "6", "transport": "tcp"}, "observer": {"egress": {"interface": {"name": "dmz"}, "zone": "DMZ"}, "hostname": "ftd-dmz-01", "ingress": {"interface": {"name": "outside"}, "zone": "Outside"}, "product": "ftd", "type": "idps", "vendor": "Cisco"}, "related": {"hosts": ["ftd-dmz-01"], "ip": ["192.0.2.155", "172.16.10.12"]}, "rule": {"name": "Allow-Inbound-Web", "ruleset": "DMZ-Access-Policy"}, "source": {"bytes": 140, "ip": "192.0.2.155", "packets": 2, "port": 2512}}`,
    },
  ],
};
