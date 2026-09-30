import type { GeneratorMeta } from '@/lib/hub-types';

export const securityTrendmicroDeepSecurity: GeneratorMeta = {
  slug: 'security-trendmicro-deep-security',
  displayName: 'Trend Micro Deep Security Agent CEF',
  category: 'security',
  description:
    'Trend Micro Deep Security 20 Agent firewall and intrusion prevention events from 40 protected servers and 180 internal source addresses, relayed by Deep Security Manager over syslog in CEF, as native syslog lines in event.original with ECS fields named after the Elastic Trend Micro integration. About 8,500 records a day follow a working-day curve, from about 140 an hour at night to about 640 an hour at 10:00-12:00 UTC. Recurring episodes show one source denied on three or more ports of a web server and then triggering an intrusion prevention rule on it.',
  dataSource:
    'Trend Micro Deep Security 20 Agent firewall and intrusion prevention events, relayed by Deep Security Manager over syslog in CEF',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Manager-relayed CEF syslog line in event.original',
    'About 8,500 records a day from 40 servers and 180 weighted sources',
    'Recurring multi-port deny scan followed by intrusion prevention',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One source is denied on three blocked ports of one protected web server (four or five ports in about half of episodes), one to three attempts per port, then triggers one intrusion prevention event on HTTP or HTTPS on that server; an episode spans about one to ten minutes, occasionally up to half an hour, from the first deny to the intrusion prevention event. Episodes recur every anomaly_interval_hours (default 24, minimum 2): the first starts within the first min(interval, 24 h), each later one within a window of min(interval / 4, 6 h) centred one interval after the previous start, with the start hour following the denied-attempt curve, so episodes lean toward the working day without avoiding the night. A late start moves the following ones; missed episodes are not replayed. Source and server differ from the previous episode and are drawn, weighted by their traffic, from source and web server pairs that exchange ordinary logged connections several times a day. Every fragment occurs in the background of both modes; only the complete sequence, three or more denied ports of a host followed by an intrusion prevention rule from the same source on it within the hour, is kept out of it.',
  generatorId: 'deep-security',
  eventTypes: [
    {
      id: '20',
      description:
        'Log-only firewall rule (Log Inbound HTTP, HTTPS, SSH, RDP), act Log',
      frequency: '86.7% of records',
      category: 'network',
    },
    {
      id: '21',
      description:
        'Deny firewall rule (Deny Inbound SMB, Telnet, MSSQL and 7 more), act Deny',
      frequency: '12.5% of records',
      category: 'network',
    },
    {
      id: '1000000-1999999',
      description:
        'Intrusion prevention rule (11 Trend Micro rules, rule ID = signature ID), act IDS:Reset',
      frequency: '0.8% of records',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'The protected estate is 40 servers (16 web, 16 application and 8 database servers, Linux or Windows) and 180 internal source addresses, the same in every run. Every server and source has its own activity weight, so a few sources and servers carry most of the traffic.',
    'Ordinary connections matched by log-only rules follow the working day, about 110 an hour at night and 550-590 an hour in the late morning, with the number of active sources rising and falling with them. A source opens one to four connections to one service of a server, tens of seconds apart. Every day has the same working-day curve; there is no weekly cycle.',
    'Denied connection attempts come half from tools that run around the clock and half from misconfigured clients during the working day, about 30 an hour at night and 60-75 in the late morning. One source tries one to five blocked ports of one server (one port in half of the cases, three or more in about a quarter), one to three attempts per port, 3-65 s apart (median about 15 s), where a real scanner often sends them within a second. After a scan of a web server the same source makes an ordinary logged connection to it within ten minutes in about 30% of cases, or, after a scan of one or two ports, triggers an intrusion prevention rule on it in about 15%.',
    'Intrusion prevention detections are flat over the day, about 70 a day across the web servers: false positives on ordinary web traffic and exploit checks of vulnerability scans, in bursts of one to four detections of one source against one web service. The rule IDs and names are real Trend Micro rules from a Deep Security Manager rule update record; their CEF severities (6, 8 and 10) are assigned per rule, not taken from the vendor rule catalog. Packet data holds the request line and Host header and is present only for HTTP detections.',
    'Every chain fragment occurs in the background of both modes: about 40 scans a day of a web server on three or more ports, and same-source intrusion prevention detections within ten minutes of a scan of one or two ports. Within ten minutes of a scan on 1-2 or 3+ ports the same source makes a logged connection in about 30% of cases either way, and another source triggers an intrusion prevention rule on the host in 1-4%. With anomaly_mode true each episode adds three to fifteen denied attempts and one intrusion prevention event on top of the background.',
    'Extension order follows the Deep Security 20 samples, with TrendMicroDsTenant and TrendMicroDsTenantId after dvchost as in the manager-relayed samples; vendor documentation gives extension tables and truncated samples, not complete captured records, and states that the order and presence of extensions may vary. Log-only events have severity 0 and deny events 5; log-only and deny rule names are customer-defined in Deep Security and the shipped ones are examples. Timestamps are whole seconds in an RFC 3164 header without year or time zone (UTC is used), and all traffic is inbound TCP, so only in is set.',
    'Only Agent firewall (signatures 20 and 21) and intrusion prevention events are modeled: no anti-malware, integrity monitoring, log inspection, web reputation, application control, device control, policy firewall or manager system events, and no LEEF or basic syslog. Event shares are synthetic workload weights, not vendor-measured rates.',
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
      description: 'Episode interval in hours, 2 to 8,760',
    },
    {
      name: 'manager_host',
      defaultValue: 'dsm-01.corp.example',
      description: 'Syslog header host (the relaying manager)',
    },
    {
      name: 'product_version',
      defaultValue: '20.0.877',
      description:
        'CEF Device Version (the manager version for relayed events)',
    },
    {
      name: 'tenant',
      defaultValue: 'Primary',
      description: 'TrendMicroDsTenant',
    },
    {
      name: 'tenant_id',
      defaultValue: '0',
      description: 'TrendMicroDsTenantId',
    },
    {
      name: 'gateway_mac',
      defaultValue: '00:1C:73:4A:0E:01',
      description: 'smac of routed traffic',
    },
    {
      name: 'log_rules',
      defaultValue:
        '[Log Inbound HTTP 80, Log Inbound HTTPS 443, Log Inbound SSH 22, Log Inbound RDP 3389]',
      description:
        'Log-only rules (name, port); ports 80, 443, 22 and 3389 are required',
    },
    {
      name: 'deny_rules',
      defaultValue:
        '[Deny Inbound FTP 21, Deny Inbound Telnet 23, Deny Inbound NetBIOS Session 139, Deny Inbound SMB 445, Deny Inbound MSSQL 1433, Deny Inbound MySQL 3306, Deny Inbound PostgreSQL 5432, Deny Inbound VNC 5900, Deny Inbound WinRM 5985, Deny Inbound Redis 6379]',
      description: 'Deny rules (name, port), at least five',
    },
    {
      name: 'ips_action',
      defaultValue: 'IDS:Reset',
      description: 'act of intrusion prevention events (detect-only policy)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Intrusion prevention event of an episode, HTTP with packet data',
      json: String.raw`{"@timestamp": "2026-09-04T12:00:36+00:00", "destination": {"ip": "10.50.20.161", "mac": "00-50-56-1E-3F-F5", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"action": "ids:reset", "category": ["intrusion_detection"], "code": "1011163", "dataset": "trendmicro.deep_security", "kind": "event", "original": "Sep  4 12:00:36 dsm-01.corp.example CEF:0|Trend Micro|Deep Security Agent|20.0.877|1011163|Spring Boot Actuator Directory Traversal Vulnerability (CVE-2021-21234)|8|cn1=122 cn1Label=Host ID dvchost=web-05.corp.example TrendMicroDsTenant=Primary TrendMicroDsTenantId=0 dmac=00:50:56:1E:3F:F5 smac=00:1C:73:4A:0E:01 TrendMicroDsFrameType=IP src=10.20.236.146 dst=10.50.20.161 in=575 cs3=DF cs3Label=Fragmentation Bits proto=TCP spt=59425 dpt=80 cs2=0x18 ACK PSH cs2Label=TCP Flags cnt=1 act=IDS:Reset cn3=178 cn3Label=Intrusion Prevention Packet Position cs5=2274 cs5Label=Intrusion Prevention Stream Position cs6=8 cs6Label=Intrusion Prevention Flags TrendMicroDsPacketData=R0VUIC9tYW5hZ2UvbG9nL3ZpZXc/ZmlsZW5hbWU9L2V0Yy9wYXNzd2QmYmFzZT0uLi8uLi8uLi8uLi8gSFRUUC8xLjENCkhvc3Q6IHdlYi0wNS5jb3JwLmV4YW1wbGUNCg\\=\\=", "severity": 8, "type": ["info"]}, "host": {"id": "122", "ip": ["10.50.20.161"], "name": "web-05.corp.example"}, "network": {"transport": "tcp", "type": "ipv4"}, "observer": {"hostname": "web-05.corp.example", "product": "Deep Security Agent", "vendor": "Trend Micro", "version": "20.0.877"}, "related": {"hosts": ["122", "web-05.corp.example"], "ip": ["10.20.236.146", "10.50.20.161"]}, "rule": {"id": "1011163", "name": "Spring Boot Actuator Directory Traversal Vulnerability (CVE-2021-21234)"}, "source": {"ip": "10.20.236.146", "mac": "00-1C-73-4A-0E-01", "port": 59425}, "trendmicro": {"deep_security": {"action": "IDS:Reset", "bytes_in": 575, "event_category": "intrusion-prevention-event", "name": "Spring Boot Actuator Directory Traversal Vulnerability (CVE-2021-21234)", "severity": "8", "signature_id": 1011163, "tenant_id": "0", "tenant_name": "Primary"}}}`,
    },
  ],
};
