/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkWatchguardFirebox: GeneratorMeta = {
  slug: 'network-watchguard-firebox',
  displayName: 'WatchGuard Firebox Traffic Logs',
  category: 'network',
  description:
    'WatchGuard Firebox traffic log messages (3000-0148, 3000-0176) of one Firebox between a trusted LAN and the internet, with the Mobile VPN with SSL portal on its external address, as ECS JSON with the native Traffic Monitor message in event.original. About 7,100 records a day, from 140 an hour at night to 660-680 an hour around 12:00-13:00 UTC. For SIEM content on perimeter firewall telemetry. Recurring episodes show one external address denied on three or more Firebox ports and then reaching the SSL VPN portal.',
  dataSource:
    'WatchGuard Firebox traffic log messages in Traffic Monitor form, the same body a Syslog server receives',
  format: ['JSON', 'ECS', 'Syslog body'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Five record shapes copied from WatchGuard examples',
    'LAN, VPN portal and internet traffic with their own daily curves',
    'Recurring port scan then SSL VPN portal chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default (minimum 2), one carrier-grade or cloud NAT egress address (a shared address), other than the previous episode's, is denied as Unhandled External Packet-00 on three distinct TCP ports of the Firebox external address (a fourth or fifth port in 40% of episodes, 1-3 attempts per port, as in background probes), then a few minutes after the last denied packet (median 3 min; 2.7-8.1 min in 4 days of default output) makes a single TCP/443 connection to the SSL VPN portal, allowed by WatchGuard SSLVPN-00. All steps fall within one hour and share source.ip and destination.ip. The first episode starts within the first anomaly_interval_hours (at most 24 h) of the data, each later one within a window of a quarter interval (at most 6 h) centred one interval after the previous start; starts favour the hours of frequent portal connections, so default episodes mostly start between about 09:00 and 16:00 UTC, occasionally earlier in the morning. A late start never causes catch-up. Every fragment also occurs in background; only the complete sequence never does.",
  generatorId: 'firebox',
  eventTypes: [
    {
      id: '3000-0148 Outgoing-00',
      description:
        'Allow, first packet, TCP/443 to the internet with source NAT',
      frequency: '52.01% of records',
      category: 'network',
    },
    {
      id: '3000-0148 Unhandled External Packet-00',
      description: 'Deny, TCP from the internet to the Firebox',
      frequency: '28.44% of records',
      category: 'network',
    },
    {
      id: '3000-0176 HTTP-proxy-00',
      description: 'Allow, HTTP proxy connection terminated',
      frequency: '9.24% of records',
      category: 'network',
    },
    {
      id: '3000-0148 WatchGuard SSLVPN-00',
      description:
        'Allow, first packet, TCP/443 from the internet to the Firebox',
      frequency: '6.45% of records',
      category: 'network',
    },
    {
      id: '3000-0148 Ping-00',
      description: 'Deny, ICMP echo request from the LAN to the Firebox',
      frequency: '3.86% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One Firebox between a trusted LAN (Trusted, 10.0.1.0/24) and the internet (External), with the SSL VPN portal on its external address. LAN clients during the working day produce 3,500 records a day (5% day-to-day variation) on a curve that rises from 07:00, peaks at 12:00-13:00 UTC and falls off by 19:00; always-on LAN hosts, about a quarter of the clients, add 1,100 a day flat and carry all LAN traffic at night; the portal takes 460 connections a day, 50-60 an hour at midday and 2-3 at night; unsolicited packets from the internet arrive at 85 an hour (10% hour-to-hour variation). Hourly volumes are the same in both modes.',
    'A LAN record is HTTPS to one of up to 40 internet servers with skewed popularity, allowed by Outgoing-00 with source NAT (82.5%), HTTP through HTTP-proxy-00 logged when the connection ends, with flags, duration (median 4 s), packet and byte counters (14.6%), or 1, 2 or 4 echo requests to the Firebox denied by Ping-00 (2.9%). Clients differ in activity by a fixed weight, so a few clients carry most of the traffic.',
    "150 external addresses, each with a role and operating system: 97 remote users behind home routers carry the bulk of portal connections and send stray packets on one or two ports (65:35); 15 carrier-grade and cloud NAT egress addresses carry a few portal connections a day each and probe one to five ports (52:28:12:5:3); 38 hosting and scanning ranges send most multi-port probes (39:21:20:12:8) and reach the portal at a tenth of a user's rate. A probe sends 1-3 SYNs to each port, 60% of probes come from a stateless-scanner stack (TTL 255, no TCP options), and all are denied as Unhandled External Packet-00; a portal connection is followed by 0-2 further connections of the same address. TTLs, window sizes and TCP header offsets follow the address's operating system.",
    'Allow records of 3000-0148 mark the first packet of a connection and carry packet length, TTL and tcp_info, with no duration or counters. Each record copies the positional fields and key order of one vendor example, since WatchGuard publishes no complete field specification; optional Log Catalog fields (route_type, src_user, application control, proxy request details) are not generated. The TCP Deny shape comes from a 2022 example without flags, duration or counters, which Fireware 12.10.3 and later may add. Ports without a vendor example use IANA service names; port 9007 appears as a number. WatchGuard SSLVPN-00 and Outgoing-00 apply the documented -00 suffix; no published Elastic mapping exists to follow.',
    'Only traffic messages: no FireCluster member field, no event, alarm, authentication or VPN tunnel messages, no IPv6, no Syslog header or serial number, no IBM LEEF. The Firebox time zone is UTC with one-second timestamps. Records that belong to one moment are seconds apart rather than milliseconds: repeated SYNs to one port are 7 s apart at the median during the day and about 18 s at night, where a real TCP stack retries after 1-3 s. Rates, sizes, durations and address pools are training assumptions, not measured production values.',
    'Every external address, port and record type of the chain occurs in ordinary traffic in both modes, and no field labels an episode: shared and scanning addresses probe three or more ports, and the same addresses reach the portal at other times. Outside episodes an address denied on three or more ports never reaches the portal within the next hour and often sends a lone denied SYN to the former portal port 9007 in that hour instead (about 7 a day in both modes). With anomaly_mode true, counts of chain parts are about one per episode higher while total volumes stay the same. A shared address probes three or more ports about once in two days, so in a 4-day window an episode address may show no other such probe.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to the background; false emits the background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2-8760',
    },
    {
      name: 'device_name',
      defaultValue: 'firebox-edge',
      description: 'observer.name (not part of the native message)',
    },
    {
      name: 'firebox_external_ip',
      defaultValue: '203.0.113.250',
      description:
        'Firebox external address: source NAT, portal and denied destination',
    },
    {
      name: 'firebox_trusted_ip',
      defaultValue: '10.0.1.1',
      description: 'Firebox trusted address, destination of denied pings',
    },
    {
      name: 'external_interface',
      defaultValue: 'External',
      description: 'External interface name in the message',
    },
    {
      name: 'trusted_interface',
      defaultValue: 'Trusted',
      description: 'Trusted interface name in the message',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.0.1.',
      description: 'Client addresses are this prefix plus a host number',
    },
    {
      name: 'client_first',
      defaultValue: '20',
      description: 'First client host number',
    },
    {
      name: 'client_count',
      defaultValue: '120',
      description:
        'Number of LAN clients (at least 8; client_first + client_count at most 255)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Portal connection completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T13:22:48+00:00", "destination": {"ip": "203.0.113.250", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "traffic_allow", "category": ["network"], "code": "3000-0148", "dataset": "watchguard.firebox.traffic", "kind": "event", "original": "2026-09-01 13:22:48 Allow 192.0.2.216 203.0.113.250 https/tcp 61293 443 External Firebox Allowed 64 42 (WatchGuard SSLVPN-00) proc_id=\"firewall\" rc=\"100\" tcp_info=\"offset 11 S 944686688 win 65535\" msg_id=\"3000-0148\"", "type": ["connection", "allowed"]}, "network": {"transport": "tcp"}, "observer": {"egress": {"interface": {"name": "Firebox"}}, "ingress": {"interface": {"name": "External"}}, "name": "firebox-edge", "product": "Firebox", "type": "firewall", "vendor": "WatchGuard"}, "related": {"ip": ["192.0.2.216", "203.0.113.250"]}, "rule": {"name": "WatchGuard SSLVPN-00"}, "source": {"ip": "192.0.2.216", "port": 61293}, "watchguard": {"firebox": {"disposition": "Allow", "dst_interface": "Firebox", "process": "firewall", "return_code": "100", "src_interface": "External"}}}`,
    },
  ],
};
