/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityTrendmicroDeepSecurity: GeneratorMeta = {
  slug: 'security-trendmicro-deep-security',
  displayName: 'Trend Micro Deep Security Agent CEF',
  category: 'security',
  description:
    'Trend Micro Deep Security 20 Agent firewall and intrusion prevention events from 40 protected servers and 180 internal source addresses, relayed by Deep Security Manager over syslog in CEF, as native syslog lines in event.original with ECS fields named after the Elastic Trend Micro integration. Recurring episodes show one source denied on three or more ports of a web server and then triggering intrusion prevention rules on it.',
  dataSource:
    'Trend Micro Deep Security 20 Agent firewall and intrusion prevention events, relayed by Deep Security Manager over syslog in CEF',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Manager-relayed CEF syslog line in event.original',
    '40 protected servers and 180 weighted sources',
    'Recurring multi-port deny scan followed by intrusion prevention',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every 24 hours of source time by default (minimum 2), the first one interval after generation starts, and starts after an exponential delay with a mean of 20 minutes, flat over the day; the next due time counts from the actual start, so a late episode never causes catch-up. One source is denied on three blocked ports of one protected web server (four or five in about four episodes in ten), one to three attempts per port, then triggers one to four intrusion prevention events on HTTP or HTTPS on that server; 68 s to 14 minutes from the first deny to the first intrusion prevention event measured. Source and server differ from the previous episode. Every fragment also occurs in background; only an intrusion prevention event from a source denied on three or more distinct ports of the same host within the last hour is kept out of it.',
  generatorId: 'deep-security',
  eventTypes: [
    {
      id: '20',
      description:
        'Log-only firewall rule (Log Inbound HTTP, HTTPS, SSH, RDP), act Log',
      frequency: '84.2% measured share',
      category: 'network',
    },
    {
      id: '21',
      description:
        'Deny firewall rule (Deny Inbound SMB, Telnet, MSSQL and 7 more), act Deny',
      frequency: '12.6% measured share',
      category: 'network',
    },
    {
      id: '1000000-1999999',
      description:
        'Intrusion prevention rule (11 Trend Micro rules, rule ID = signature ID), act IDS:Reset',
      frequency: '3.2% measured share',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'The estate is 40 servers with web, application and database roles on Linux or Windows and 180 internal source addresses, each with its own activity weight. Traffic superposes independent random processes: ordinary connections matched by log-only rules, busier during the working day; denied attempts on one to five blocked ports of one host, flat over the day; and intrusion prevention detections against web services.',
    'Shares are synthetic workload weights, not vendor-measured rates. Log-only and deny rule names are customer-defined in Deep Security and the shipped ones are examples; the intrusion prevention rule IDs and names are real Trend Micro rules from a Deep Security Manager rule update record, while their CEF severities are assigned per rule and not taken from the vendor rule catalog.',
    'Every chain fragment occurs in background: five 78-hour background captures hold about 130 scans of a web server on three or more ports each, and after a scan of one or two ports the same source triggers an intrusion prevention rule within ten minutes in 28% of cases. Only the complete sequence is excluded: a background scan on three or more ports gets no intrusion prevention follow-up, and a coincidental one becomes a logged connection of that source to the same web port.',
    'Extension order follows the Deep Security 20 samples, with TrendMicroDsTenant and TrendMicroDsTenantId after dvchost as in the manager-relayed samples. Vendor documentation gives extension tables and truncated samples, not complete captured records, and states that the order and presence of extensions may vary.',
    'Packet data is present only for HTTP detections and holds the request line and Host header; HTTPS detections, log-only and deny events carry none. At most one event per second is emitted, with whole-second RFC 3164 timestamps without year or time zone (UTC is used), and all traffic is inbound TCP, so only in is set.',
    'Only Agent firewall (signatures 20 and 21) and intrusion prevention events are modeled: no anti-malware, integrity monitoring, log inspection, web reputation, application control, device control, policy firewall or manager system events, and no LEEF or basic syslog.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to the background; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2 to 8,760',
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
      name: 'domain',
      defaultValue: 'corp.example',
      description: 'Domain of the protected host names',
    },
    {
      name: 'host_count',
      defaultValue: '40',
      description:
        'Protected servers, 10 to 200; at least two must get the web role',
    },
    {
      name: 'source_count',
      defaultValue: '180',
      description: 'Source addresses, 20 to 1,000',
    },
    {
      name: 'source_networks',
      defaultValue: '[10.20.0.0/16, 10.30.0.0/20, 10.40.8.0/22]',
      description: 'Networks the sources are drawn from',
    },
    {
      name: 'server_network',
      defaultValue: '10.50.20.0/24',
      description: 'Network of the protected servers',
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
    {
      name: 'ips_rules',
      defaultValue:
        '11 rules: 1011161, 1011163, 1011103, 1010942, 1011143, 1011167, 1011096, 1011153, 1011120, 1011162, 1011159',
      description:
        'Intrusion prevention rules by id, each with name, CEF severity, weight and the request line used for the packet data',
    },
  ],
  sampleOutputs: [
    {
      title:
        'First intrusion prevention event of an episode, HTTP with packet data',
      json: String.raw`{"@timestamp": "2026-09-27T00:13:42+00:00", "destination": {"ip": "10.50.20.41", "mac": "00-50-56-1E-E4-CB", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"action": "ids:reset", "category": ["intrusion_detection"], "code": "1011143", "dataset": "trendmicro.deep_security", "kind": "event", "original": "Sep 27 00:13:42 dsm-01.corp.example CEF:0|Trend Micro|Deep Security Agent|20.0.877|1011143|WordPress \u0027ProfilePress\u0027 Plugin Privilege Escalation Vulnerability (CVE-2021-34621)|8|cn1=1035 cn1Label=Host ID dvchost=web-07.corp.example TrendMicroDsTenant=Primary TrendMicroDsTenantId=0 dmac=00:50:56:1E:E4:CB smac=00:1C:73:4A:0E:01 TrendMicroDsFrameType=IP src=10.40.8.228 dst=10.50.20.41 in=283 cs3=DF cs3Label=Fragmentation Bits proto=TCP spt=53439 dpt=80 cs2=0x18 ACK PSH cs2Label=TCP Flags cnt=1 act=IDS:Reset cn3=34 cn3Label=Intrusion Prevention Packet Position cs5=1046 cs5Label=Intrusion Prevention Stream Position cs6=8 cs6Label=Intrusion Prevention Flags TrendMicroDsPacketData=UE9TVCAvd3AtYWRtaW4vYWRtaW4tYWpheC5waHA/YWN0aW9uPXBwX2FqYXhfc2lnbnVwIEhUVFAvMS4xDQpIb3N0OiB3ZWItMDcuY29ycC5leGFtcGxlDQo\\=", "severity": 8, "type": ["info"]}, "host": {"id": "1035", "ip": ["10.50.20.41"], "name": "web-07.corp.example"}, "network": {"transport": "tcp", "type": "ipv4"}, "observer": {"hostname": "web-07.corp.example", "product": "Deep Security Agent", "vendor": "Trend Micro", "version": "20.0.877"}, "related": {"hosts": ["1035", "web-07.corp.example"], "ip": ["10.40.8.228", "10.50.20.41"]}, "rule": {"id": "1011143", "name": "WordPress \u0027ProfilePress\u0027 Plugin Privilege Escalation Vulnerability (CVE-2021-34621)"}, "source": {"ip": "10.40.8.228", "mac": "00-1C-73-4A-0E-01", "port": 53439}, "trendmicro": {"deep_security": {"action": "IDS:Reset", "bytes_in": 283, "event_category": "intrusion-prevention-event", "name": "WordPress \u0027ProfilePress\u0027 Plugin Privilege Escalation Vulnerability (CVE-2021-34621)", "severity": "8", "signature_id": 1011143, "tenant_id": "0", "tenant_name": "Primary"}}}`,
    },
  ],
};
