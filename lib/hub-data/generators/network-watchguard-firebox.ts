/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkWatchguardFirebox: GeneratorMeta = {
  slug: 'network-watchguard-firebox',
  displayName: 'WatchGuard Firebox Traffic Logs',
  category: 'network',
  description:
    'WatchGuard Firebox traffic log messages (3000-0148, 3000-0176) of one Firebox between a trusted LAN and the internet, with the Mobile VPN with SSL portal on its external address, as ECS JSON with the native Traffic Monitor message in event.original. For SIEM content on perimeter firewall telemetry. Recurring episodes show one external address denied on three or more Firebox ports and then reaching the SSL VPN portal.',
  dataSource:
    'WatchGuard Firebox traffic log messages in Traffic Monitor form, the same body a Syslog server receives',
  format: ['JSON', 'ECS', 'Syslog body'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Five record shapes copied from WatchGuard examples',
    'Independent per-host traffic with an office-hours cycle',
    'Recurring port scan then SSL VPN portal chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (minimum 2; the first one interval after generation starts, each next one interval after the previous actual start, never catching up; each start waits a random delay, exponential with a 20-minute mean), one scanning-range external address, not the actor of the previous episode, is denied on three distinct Firebox ports (a fourth or fifth in about 40% of episodes, 1-3 attempts each), then a few minutes later (median 3 min, 1.4-3.3 min measured) connects to the SSL VPN portal on TCP/443, allowed by WatchGuard SSLVPN-00, with 0-2 follow-up connections. Every fragment also occurs in background; only the complete sequence is kept out of it.',
  generatorId: 'firebox',
  eventTypes: [
    {
      id: '3000-0148 Outgoing-00',
      description:
        'Allow, first packet, TCP/443 to the internet with source NAT',
      frequency: '51.53% measured share',
      category: 'network',
    },
    {
      id: '3000-0148 Unhandled External Packet-00',
      description: 'Deny, TCP from the internet to the Firebox',
      frequency: '29.44% measured share',
      category: 'network',
    },
    {
      id: '3000-0176 HTTP-proxy-00',
      description: 'Allow, HTTP proxy connection terminated',
      frequency: '9.05% measured share',
      category: 'network',
    },
    {
      id: '3000-0148 WatchGuard SSLVPN-00',
      description:
        'Allow, first packet, TCP/443 from the internet to the Firebox',
      frequency: '5.88% measured share',
      category: 'network',
    },
    {
      id: '3000-0148 Ping-00',
      description: 'Deny, ICMP echo request from the LAN to the Firebox',
      frequency: '4.11% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One Firebox between a trusted LAN (Trusted, 10.0.1.0/24) and the internet (External). Each one-second tick emits at most one record; activity arrives as independent Poisson streams, and each arrival picks its host by a fixed log-normal weight, so hosts act independently and a few carry most of the traffic.',
    'Outbound web follows an office-hours factor (07:00-17:00 UTC 1.70, 17:00-21:00 0.91, night 0.34): 85% HTTPS allowed by Outgoing-00 with source NAT, 15% HTTP through HTTP-proxy-00, logged at close with duration and counters (median 4 s). LAN pings to the Firebox are denied, and unsolicited SYNs from the internet to ten Firebox ports are denied, 60% of bursts from a stateless-scanner stack.',
    'About 70% of external addresses are remote users behind home routers and carrier NAT, who carry the portal logins and half the unsolicited bursts on one or two ports; 30% are hosting and scanning ranges that send the other half on one to five ports and log in at a tenth of a user rate. TTLs, window sizes and TCP header offsets follow a per-host operating system.',
    'Each record copies the positional fields and key order of one vendor example, since WatchGuard publishes no complete field specification; optional Log Catalog fields are not generated. The TCP Deny shape comes from a 2022 example without flags, duration or counters, which Fireware 12.10.3 and later may add. WatchGuard SSLVPN-00 and Outgoing-00 apply the documented -00 suffix; no published Elastic mapping exists to follow.',
    'Only traffic messages: no FireCluster member field, no event, alarm, authentication or VPN tunnel messages, no IPv6, no Syslog header or serial number, no IBM LEEF. The Firebox time zone is UTC with one-second timestamps. Rates, sizes, durations and address pools are training assumptions, not measured production values.',
    'Every chain fragment occurs in background: a 78 h background capture holds about 420-650 bursts over three or more ports, and about 60 one-port and 30 two-port bursts followed by a portal login within an hour. After a 3+ port burst a login of the same address never follows within 60 minutes in background (0.1-0.3% per 10-minute bin at 60-120 minutes): a login that would complete the chain is written as a lone denied SYN to port 9007, so such SYNs are about twice as common in the first hour after the burst as in the second (roughly 4-5 per 78 h, in both modes). Episodes start at any hour while background portal logins follow office hours.',
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
    {
      name: 'remote_count',
      defaultValue: '150',
      description: 'Number of external addresses (at least 20)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Portal connection completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-27T00:39:53+00:00", "destination": {"ip": "203.0.113.250", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "traffic_allow", "category": ["network"], "code": "3000-0148", "dataset": "watchguard.firebox.traffic", "kind": "event", "original": "2026-09-27 00:39:53 Allow 198.51.100.36 203.0.113.250 https/tcp 63786 443 External Firebox Allowed 52 109 (WatchGuard SSLVPN-00) proc_id=\"firewall\" rc=\"100\" tcp_info=\"offset 8 S 3210695985 win 65535\" msg_id=\"3000-0148\"", "type": ["connection", "allowed"]}, "network": {"transport": "tcp"}, "observer": {"egress": {"interface": {"name": "Firebox"}}, "ingress": {"interface": {"name": "External"}}, "name": "firebox-edge", "product": "Firebox", "type": "firewall", "vendor": "WatchGuard"}, "related": {"ip": ["198.51.100.36", "203.0.113.250"]}, "rule": {"name": "WatchGuard SSLVPN-00"}, "source": {"ip": "198.51.100.36", "port": 63786}, "watchguard": {"firebox": {"disposition": "Allow", "dst_interface": "Firebox", "process": "firewall", "return_code": "100", "src_interface": "External"}}}`,
    },
  ],
};
