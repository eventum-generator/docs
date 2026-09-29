import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSophosFirewall: GeneratorMeta = {
  slug: 'network-sophos-firewall',
  displayName: 'Sophos Firewall Firewall Rule Log',
  category: 'network',
  description:
    'Firewall Rule log of one Sophos Firewall (SFOS 20) in the Central Reporting Format as ECS JSON, with the native key=value message in event.original, for a firewall between a user LAN, a server DMZ and the internet. About 18,500 records a day from 80 LAN clients follow an office-hours curve in UTC: allowed connections produce Start and Stop records and denied packets produce Denied records. Recurring episodes show one client denied on three or more ports of a DMZ server, then reaching it through an open port.',
  dataSource:
    'Sophos Firewall SFOS 20 Firewall Rule log, Central Reporting Format key=value message without a syslog envelope',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 16,
  templateCount: 1,
  highlights: [
    'Central Reporting Format key=value in event.original',
    'About 18,500 records a day from 80 LAN clients',
    'Recurring multi-port probing then allowed connection chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One ordinary client is denied by Drop LAN to DMZ on three distinct TCP ports of one DMZ server (a fourth in about one episode in three, 1-3 attempts per port), then opens an allowed connection to that server on the port it opens to all clients (445 file, 443 intranet and Linux, 3389 terminal), followed later by its Stop with the same con_id; 5-14 records spanning about 45 s to 30 minutes from the first denial to the allowed connection. The first episode starts within the first anomaly_interval_hours (at most 24 h) at a time drawn from the office-hours curve; each next one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts in a window of a quarter of the interval (at most 6 h) centred on the due time, weighted towards office hours, with no catch-up, so episodes start 21-27 h apart at the default interval. The client and server differ from the previous episode; the client is one of the more active clients present at that hour, and the pair also occurs in ordinary traffic. No field labels an episode. Every fragment occurs in background; only the complete sequence within one hour is kept out of it.',
  generatorId: 'sophos-fw',
  eventTypes: [
    {
      id: 'Allowed Start (HTTPS)',
      description: 'HTTPS (TCP/443) connection created',
      frequency: '21.72% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (HTTPS)',
      description: 'HTTPS (TCP/443) connection ended, with counters',
      frequency: '21.72% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (DNS)',
      description: 'DNS (UDP/53) connection created',
      frequency: '11.56% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (DNS)',
      description: 'DNS (UDP/53) connection ended, with counters',
      frequency: '11.56% of records',
      category: 'network',
    },
    {
      id: 'Denied (DMZ closed port)',
      description: 'TCP to a closed port of a DMZ server',
      frequency: '7.85% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (SMB)',
      description: 'SMB (TCP/445) connection created',
      frequency: '7.54% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (SMB)',
      description: 'SMB (TCP/445) connection ended, with counters',
      frequency: '7.54% of records',
      category: 'network',
    },
    {
      id: 'Denied (QUIC)',
      description: 'QUIC (UDP/443) to the internet',
      frequency: '2.42% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (RDP)',
      description: 'RDP (TCP/3389) connection created',
      frequency: '1.96% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (RDP)',
      description: 'RDP (TCP/3389) connection ended, with counters',
      frequency: '1.96% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (HTTP)',
      description: 'HTTP (TCP/80) connection created',
      frequency: '1.79% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (HTTP)',
      description: 'HTTP (TCP/80) connection ended, with counters',
      frequency: '1.79% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (WinRM)',
      description: 'WinRM (TCP/5985) connection created',
      frequency: '0.16% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (WinRM)',
      description: 'WinRM (TCP/5985) connection ended, with counters',
      frequency: '0.16% of records',
      category: 'network',
    },
    {
      id: 'Allowed Start (SSH)',
      description: 'SSH (TCP/22) connection created',
      frequency: '0.13% of records',
      category: 'network',
    },
    {
      id: 'Allowed Stop (SSH)',
      description: 'SSH (TCP/22) connection ended, with counters',
      frequency: '0.13% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One firewall sits between a user LAN (Port1), a server DMZ (Port3) and the internet (Port2, source NAT). About 18,500 records a day: about 1,310 an hour from 06:00 to 16:00 UTC, about 700 from 16:00 to 20:00 and about 265 from 20:00 to 06:00, with daily volume varying by a few percent. All 80 clients are active in office hours, about 50 in the evening and about 18 at night, and the busiest clients produce about ten times the traffic of the quietest.',
    'Activity covers HTTPS to 40 internet addresses with skewed popularity (half preceded by a DNS query to a DMZ resolver, 15% starting with a QUIC attempt that the Block QUIC rule denies), HTTP, DNS only, intranet HTTPS, bursts of 1-5 SMB connections to one file server, RDP sessions with a 25-minute log-normal median, and SSH, RDP, WinRM, SMB or HTTPS by the admin group.',
    'Allowed records carry con_event Start and Stop with a shared con_id from a pool of 64-aligned slots reused after a stop; Stop adds duration and directional packet and byte counters. Denied records have no connection, zones or counters, as in the vendor samples. Durations follow the transferred volume and log-normal throughputs; DNS connections stop after an assumed 30 s idle timeout plus a random delay.',
    'Ordinary clients also hit 1-4 ports of one DMZ server that their rules do not open, 1-3 attempts per port, and in half of the cases connect to its open port about two minutes later. Ordinary traffic holds about 120 sets a day of denials on three or more distinct ports of one server within an hour and about 375 allowed connections a day within an hour of denials on one or two ports of the same server. A client denied on three distinct ports of a server connects within that hour to another server of the same role instead; if every server of that role denied it, such a connection is absent (a few a day).',
    'Key order and field presence follow SFOS 20 guide sample 00001 and the 50 Central Reporting Format lines of the Elastic integration fixtures, including the double space before packets_received, uppercase MACs on allowed and lowercase on denied records. The guide has no Central Reporting Format sample for a denied Firewall Rule record, so that shape comes from the 2021 Elastic fixtures. The ECS document follows the Elastic Sophos XG mapping without GeoIP, community ID or syslog-header fields; rule.name, event.type and the sophos.xg keys fw_rule_section, log_occurrence and app_* are additions.',
    'Only the Firewall Rule component over IPv4 TCP/UDP is modeled: no Interim records, ICMP, IPv6, SD-WAN gateway fields, user identity, Heartbeat, invalid traffic or other SFOS log types, and application fields only for the four application names in the samples; log_occurrence is always 1 and hb_status always No Heartbeat. Rule names and IDs, policy IDs, zones, the DNS idle timeout, rates, sizes and durations are training assumptions; the device time zone is UTC and countries of the internet addresses are synthetic.',
    'Volume changes in steps at 06:00, 16:00 and 20:00 UTC instead of ramping. Records a real firewall writes within a second or two of each other (a DNS lookup and the connection it resolves, repeated denied attempts, the Stop of a short DNS flow) are at least about 2 s apart in office hours and 9-10 s at night. Episodes use one of the more active clients; the quietest clients never take part in one.',
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
      json: String.raw`{"@timestamp": "2026-09-01T05:25:27+00:00", "destination": {"ip": "10.20.10.12", "mac": "00-05-69-AF-8F-D0", "port": 445}, "ecs": {"version": "8.17.0"}, "event": {"action": "allowed", "category": ["network"], "code": "00001", "kind": "event", "original": "device_name=\"SFW\" timestamp=\"2026-09-01T05:25:27+0000\" device_model=\"XGS2300\" device_serial_id=\"X23001EXAMPLE01\" log_id=\"010101600001\" log_type=\"Firewall\" log_component=\"Firewall Rule\" log_subtype=\"Allowed\" log_version=1 severity=\"Information\" fw_rule_id=\"3\" fw_rule_name=\"LAN to file servers\" fw_rule_section=\"Local rule\" nat_rule_id=\"0\" fw_rule_type=\"USER\" ether_type=\"Unknown (0x0000)\" in_interface=\"Port1\" out_interface=\"Port3\" src_mac=\"A0:51:0B:0F:A6:6A\" dst_mac=\"00:05:69:AF:8F:D0\" src_ip=\"10.20.1.87\" src_country=\"R1\" dst_ip=\"10.20.10.12\" dst_country=\"R1\" protocol=\"TCP\" src_port=58160 dst_port=445 src_zone_type=\"LAN\" src_zone=\"LAN\" dst_zone_type=\"DMZ\" dst_zone=\"DMZ\" con_event=\"Start\" con_id=\"3103517888\" hb_status=\"No Heartbeat\" app_resolved_by=\"Signature\" app_is_cloud=\"FALSE\" qualifier=\"New\" in_display_interface=\"Port1\" out_display_interface=\"Port3\" log_occurrence=\"1\"", "outcome": "success", "severity": 6, "timezone": "+00:00", "type": ["connection", "start"]}, "log": {"level": "Information"}, "network": {"transport": "tcp"}, "observer": {"egress": {"interface": {"name": "Port3"}, "zone": "DMZ"}, "ingress": {"interface": {"name": "Port1"}, "zone": "LAN"}, "product": "XG", "serial_number": "X23001EXAMPLE01", "type": "firewall", "vendor": "Sophos"}, "related": {"ip": ["10.20.1.87", "10.20.10.12"]}, "rule": {"id": "3", "name": "LAN to file servers"}, "sophos": {"xg": {"app_is_cloud": "FALSE", "app_resolved_by": "Signature", "con_event": "Start", "con_id": "3103517888", "device_model": "XGS2300", "device_name": "SFW", "dst_zone_type": "DMZ", "ether_type": "Unknown (0x0000)", "fw_rule_section": "Local rule", "fw_rule_type": "USER", "hb_status": "No Heartbeat", "log_component": "Firewall Rule", "log_id": "010101600001", "log_occurrence": "1", "log_subtype": "Allowed", "log_type": "Firewall", "log_version": "1", "qualifier": "New", "src_zone_type": "LAN"}}, "source": {"ip": "10.20.1.87", "mac": "A0-51-0B-0F-A6-6A", "port": 58160}}`,
    },
  ],
};
