import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSophosFirewall: GeneratorMeta = {
  slug: 'network-sophos-firewall',
  displayName: 'Sophos Firewall Firewall Rule Log',
  category: 'network',
  description:
    'Firewall Rule log of one Sophos Firewall (SFOS 20) in the Central Reporting Format as ECS JSON, with the native key=value message in event.original, for a firewall between a user LAN, a server DMZ and the internet. Allowed connections produce Start and Stop records and denied packets produce Denied records. Recurring episodes show one client denied on three or more ports of a DMZ server, then reaching it through an open port.',
  dataSource:
    'Sophos Firewall SFOS 20 Firewall Rule log, Central Reporting Format key=value message without a syslog envelope',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 16,
  templateCount: 1,
  highlights: [
    'Central Reporting Format key=value in event.original',
    'Allowed Start/Stop pairs and Denied records of 80 LAN clients',
    'Recurring multi-port probing then allowed connection chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (minimum 2; the first within the first 24 hours at a time drawn from the office-hours load curve; each next one due one interval after the actual start of the previous one and started in a window of a quarter of the interval, at most 6 h, centred on the due time and weighted toward office hours, with no catch-up), one ordinary client is denied by Drop LAN to DMZ on three distinct ports of one DMZ server (a fourth in about one episode in three, 1-3 attempts per port), then opens an allowed connection to that server on the port it opens to all clients, followed later by its Stop. Episodes spanned 1.7-13 minutes from the first denial to the allowed connection at the default interval; the client and server differ from the previous episode. Every fragment occurs in background; only the complete sequence within one hour is kept out of it.',
  generatorId: 'sophos-fw',
  eventTypes: [
    {
      id: 'Allowed Start (HTTPS)',
      description: 'HTTPS (TCP/443) connection created',
      frequency: '21.67% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (HTTPS)',
      description: 'HTTPS (TCP/443) connection ended, with counters',
      frequency: '21.67% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (DNS)',
      description: 'DNS (UDP/53) connection created',
      frequency: '11.87% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (DNS)',
      description: 'DNS (UDP/53) connection ended, with counters',
      frequency: '11.87% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (SMB)',
      description: 'SMB (TCP/445) connection created',
      frequency: '7.69% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (SMB)',
      description: 'SMB (TCP/445) connection ended, with counters',
      frequency: '7.69% measured share',
      category: 'network',
    },
    {
      id: 'Denied (DMZ closed port)',
      description: 'TCP to a closed port of a DMZ server',
      frequency: '7.73% measured share',
      category: 'network',
    },
    {
      id: 'Denied (QUIC)',
      description: 'QUIC (UDP/443) to the internet',
      frequency: '2.35% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (HTTP)',
      description: 'HTTP (TCP/80) connection created',
      frequency: '1.81% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (HTTP)',
      description: 'HTTP (TCP/80) connection ended, with counters',
      frequency: '1.81% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (RDP)',
      description: 'RDP (TCP/3389) connection created',
      frequency: '1.74% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (RDP)',
      description: 'RDP (TCP/3389) connection ended, with counters',
      frequency: '1.73% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (WinRM)',
      description: 'WinRM (TCP/5985) connection created',
      frequency: '0.11% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (WinRM)',
      description: 'WinRM (TCP/5985) connection ended, with counters',
      frequency: '0.11% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Start (SSH)',
      description: 'SSH (TCP/22) connection created',
      frequency: '0.08% measured share',
      category: 'network',
    },
    {
      id: 'Allowed Stop (SSH)',
      description: 'SSH (TCP/22) connection ended, with counters',
      frequency: '0.08% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One firewall sits between a user LAN (Port1), a server DMZ (Port3) and the internet (Port2, source NAT). Client activity arrives as one merged Poisson stream scaled by an office-hours factor (06:00-16:00 UTC 1.70, 16:00-20:00 0.91, night 0.34), and each arrival picks a client by a fixed random per-client weight, so clients act independently. Each one-second tick emits at most one record.',
    'Activity covers HTTPS to 40 internet addresses with skewed popularity (half preceded by a DNS query to a DMZ resolver, 15% starting with a QUIC attempt that the Block QUIC rule denies), HTTP, DNS only, intranet HTTPS, bursts of 1-5 SMB connections, RDP sessions with a 25-minute log-normal median, and SSH, RDP, WinRM, SMB or HTTPS by the admin group.',
    'Allowed records carry con_event Start and Stop with a shared con_id from a pool of 64-aligned slots reused after a stop; Stop adds duration and directional packet and byte counters. Denied records have no connection, zones or counters, as in the vendor samples. Durations follow the transferred volume and log-normal throughputs; DNS connections stop after an assumed 30 s idle timeout plus a random delay.',
    'Background clients also hit 1-4 closed ports of one DMZ server with 1-3 attempts per port, and in half of the cases connect to its open port about two minutes later: a 156-hour background capture holds 439-490 sets of denials on three or more distinct ports of one server within an hour and 1195-1339 allowed connections within an hour of denials on one or two ports. An ordinary allowed connection that would complete the chain (three distinct denied ports, the first at most one hour earlier) is not made; a later one is left as is. Episodes pick their client uniformly, so a rarely active client is relatively more visible in an episode.',
    'Key order and field presence follow SFOS 20 guide sample 00001 and the 50 Central Reporting Format lines of the Elastic integration fixtures, including the double space before packets_received and the MAC case per subtype. The guide has no Central Reporting Format sample for a denied Firewall Rule record, so that shape comes from the 2021 Elastic fixtures. The ECS document follows the Elastic Sophos XG mapping without GeoIP, community ID or syslog-header fields.',
    'Only the Firewall Rule component over IPv4 TCP/UDP is modeled: no Interim records, ICMP, IPv6, SD-WAN gateway fields, user identity, Heartbeat, invalid traffic or other SFOS log types, and application fields only for the four application names in the samples. Rule names and IDs, policy IDs, zones, rates, sizes and durations are training assumptions; the device time zone is UTC.',
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
      name: 'device_model',
      defaultValue: 'XGS2300',
      description: 'Value of device_model',
    },
    {
      name: 'device_serial_id',
      defaultValue: 'X23001EXAMPLE01',
      description: 'device_serial_id and observer.serial_number (synthetic)',
    },
    {
      name: 'wan_ip',
      defaultValue: '203.0.113.2',
      description: 'Source NAT address (src_trans_ip)',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.1.',
      description: 'Client addresses are this prefix plus a host number',
    },
    {
      name: 'client_first',
      defaultValue: '20',
      description: 'First client host number',
    },
    {
      name: 'client_count',
      defaultValue: '80',
      description: 'Number of clients (at least 8)',
    },
    {
      name: 'admin_count',
      defaultValue: '4',
      description: 'The first clients form the admin group',
    },
    {
      name: 'web_policy_id',
      defaultValue: '2',
      description: 'Web policy ID on records of the LAN to Internet rule',
    },
    {
      name: 'ips_policy_id',
      defaultValue: '5',
      description: 'IPS policy ID on records of the LAN to Internet rule',
    },
    {
      name: 'app_filter_policy_id',
      defaultValue: '3',
      description:
        'Application filter policy ID on records of the LAN to Internet rule',
    },
    {
      name: 'servers',
      defaultValue:
        '11 DMZ servers: 10.20.10.11-12 file, 10.20.10.21-23 intranet, 10.20.10.31-32 terminal, 10.20.10.41-42 linux, 10.20.10.53-54 dns',
      description:
        'Map of address to role: file, intranet, terminal, linux, dns (at least two non-DNS servers and one DNS server)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Allowed connection that completes the first episode',
      json: String.raw`{"@timestamp": "2026-09-26T17:58:20+00:00", "destination": {"ip": "10.20.10.32", "mac": "00-0C-29-CE-3A-48", "port": 3389}, "ecs": {"version": "8.17.0"}, "event": {"action": "allowed", "category": ["network"], "code": "00001", "kind": "event", "original": "device_name=\"SFW\" timestamp=\"2026-09-26T17:58:20+0000\" device_model=\"XGS2300\" device_serial_id=\"X23001EXAMPLE01\" log_id=\"010101600001\" log_type=\"Firewall\" log_component=\"Firewall Rule\" log_subtype=\"Allowed\" log_version=1 severity=\"Information\" fw_rule_id=\"5\" fw_rule_name=\"LAN to terminal servers\" fw_rule_section=\"Local rule\" nat_rule_id=\"0\" fw_rule_type=\"USER\" ether_type=\"Unknown (0x0000)\" in_interface=\"Port1\" out_interface=\"Port3\" src_mac=\"3C:D9:2B:8A:4F:26\" dst_mac=\"00:0C:29:CE:3A:48\" src_ip=\"10.20.1.38\" src_country=\"R1\" dst_ip=\"10.20.10.32\" dst_country=\"R1\" protocol=\"TCP\" src_port=55151 dst_port=3389 src_zone_type=\"LAN\" src_zone=\"LAN\" dst_zone_type=\"DMZ\" dst_zone=\"DMZ\" con_event=\"Start\" con_id=\"2929646720\" hb_status=\"No Heartbeat\" app_resolved_by=\"Signature\" app_is_cloud=\"FALSE\" qualifier=\"New\" in_display_interface=\"Port1\" out_display_interface=\"Port3\" log_occurrence=\"1\"", "outcome": "success", "severity": 6, "timezone": "+00:00", "type": ["connection", "start"]}, "log": {"level": "Information"}, "network": {"transport": "tcp"}, "observer": {"egress": {"interface": {"name": "Port3"}, "zone": "DMZ"}, "ingress": {"interface": {"name": "Port1"}, "zone": "LAN"}, "product": "XG", "serial_number": "X23001EXAMPLE01", "type": "firewall", "vendor": "Sophos"}, "related": {"ip": ["10.20.1.38", "10.20.10.32"]}, "rule": {"id": "5", "name": "LAN to terminal servers"}, "sophos": {"xg": {"app_is_cloud": "FALSE", "app_resolved_by": "Signature", "con_event": "Start", "con_id": "2929646720", "device_model": "XGS2300", "device_name": "SFW", "dst_zone_type": "DMZ", "ether_type": "Unknown (0x0000)", "fw_rule_section": "Local rule", "fw_rule_type": "USER", "hb_status": "No Heartbeat", "log_component": "Firewall Rule", "log_id": "010101600001", "log_occurrence": "1", "log_subtype": "Allowed", "log_type": "Firewall", "log_version": "1", "qualifier": "New", "src_zone_type": "LAN"}}, "source": {"ip": "10.20.1.38", "mac": "3C-D9-2B-8A-4F-26", "port": 55151}}`,
    },
  ],
};
