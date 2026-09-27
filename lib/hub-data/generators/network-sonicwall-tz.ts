import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSonicwallTz: GeneratorMeta = {
  slug: 'network-sonicwall-tz',
  displayName: 'SonicWall TZ Web Traffic and Content Filtering',
  category: 'network',
  description:
    'SonicWall TZ (SonicOS 6.5.4) LAN-to-WAN web traffic records (m=97, m=537) and Content Filtering Service denials (m=14) of one firewall between a LAN and the internet, as ECS JSON following the Elastic sonicwall_firewall integration with the native default key-value Syslog line in event.original. For SIEM content on perimeter firewall and web filtering telemetry. Recurring episodes show one client denied three or more times for a gambling site and then fetching the same path from an uncategorized host.',
  dataSource:
    'SonicWall SonicOS 6.5.4 default key-value Syslog, traffic report and Content Filtering messages',
  format: ['JSON', 'ECS', 'Syslog', 'KV'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native lines copied from the SonicOS 6.5.4 guide examples',
    'Independent per-client browsing with an office-hours cycle',
    'Recurring CFS denial then Not Rated same-path chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (minimum 2; the first one interval after generation starts, each next one interval after the previous actual start, never catching up; the start is drawn within min(interval / 4, 6 h) after the due time, weighted by the background hour-of-day factor), one LAN client from a recent background blocked-site attempt, other than the previous episode client, is denied by CFS 3-6 times for one Gambling host, then a few minutes later (median 90 s) fetches the first denied path from a Not Rated host it visited in background (m=97). The chain spans under 30 minutes (87-198 s measured). Every fragment also occurs in background; only the complete sequence is kept out of it.',
  generatorId: 'sonicwall',
  eventTypes: [
    {
      id: '537 HTTPS',
      description: 'Connection Closed, HTTPS',
      frequency: '68.18% measured share',
      category: 'network',
    },
    {
      id: '97 Information Technology/Computers',
      description:
        'Website accessed (HTTP, URL data), Information Technology/Computers',
      frequency: '7.95% measured share',
      category: 'none',
    },
    {
      id: '97 Not Rated',
      description: 'Website accessed (HTTP, URL data), Not Rated',
      frequency: '6.78% measured share',
      category: 'none',
    },
    {
      id: '97 Search Engines and Portals',
      description:
        'Website accessed (HTTP, URL data), Search Engines and Portals',
      frequency: '6.41% measured share',
      category: 'none',
    },
    {
      id: '97 Business and Economy',
      description: 'Website accessed (HTTP, URL data), Business and Economy',
      frequency: '5.20% measured share',
      category: 'none',
    },
    {
      id: '537 HTTP',
      description: 'Connection Closed, HTTP without request',
      frequency: '3.05% measured share',
      category: 'network',
    },
    {
      id: '14 Gambling',
      description: 'CFS Web site access denied, Gambling',
      frequency: '2.43% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One firewall between a LAN (X0, 10.20.30.0/24) and the internet (X1), with CFS blocking the Gambling category. SonicOS logs every closed connection once: m=97 when CFS saw URL data (plain HTTP), m=537 otherwise; m=14 is the CFS denial. Each one-second tick emits at most one record.',
    'Browsing sessions and blocked-site attempts arrive as independent Poisson streams with an office-hours factor (08:00-18:00 UTC 1.64, 07:00-08:00 and 18:00-21:00 0.92, 21:00-23:00 0.51, night 0.21), each picking its client by a fixed per-client weight. Sessions open a median of 6 connections: 70% HTTPS, 27% plain HTTP to four CFS categories, 3% HTTP closed before a request.',
    'Blocked-site attempts are driven by a per-client gambling interest and site preference: 1-6 denials, 60% repeating the previous path; in 30% of attempts the user then tries a Not Rated host (median 90 s later), half the time with a denied path. Source ports advance per client by 1-3, and n (event.sequence) is the per-message-ID count, advancing by 1-4 for unmodeled traffic.',
    'Native lines copy the field sets and order of the SonicOS 6.5.4 guide default Syslog examples; app=11 for HTTPS m=537 comes from Elastic integration test data. CFS records are HTTP only, as without DPI-SSL. Not generated: m=98, NAT fields, zones, users, gcat, referer, IPv6, CEF and other message IDs. The guide is not a TZ-specific capture, and SonicOS 7 lines differ.',
    'The Syslog header carries the firewall WAN address and the UTC time= clock plus 0-1 s receipt delay. The ECS document follows the Elastic pipeline output; like that pipeline, m=97 records have no event.action or event.category. Rates, sizes, durations and address pools are training assumptions, and there is no weekday cycle.',
    'Every fragment occurs in background: per day of the final captures (on / off), 54.9 / 52.3 third denials of one site within 10 minutes, 95.1 / 107.7 Not Rated visits within 30 minutes of a denial of the same client, 21.8 / 15.0 of them with a denied path. Episodes cannot follow the hour-of-day mix exactly: 2 of 5 default and 4 of 13 custom 8 h episodes started 23:00-07:00 UTC, against about 9% of background blocked-site attempts.',
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
      name: 'firewall_wan_ip',
      defaultValue: '192.0.2.10',
      description: 'Firewall WAN address: fw= and the Syslog header host',
    },
    {
      name: 'firewall_serial',
      defaultValue: '02DEADBEEF01',
      description:
        'Synthetic serial (sn=, 12 characters; use hex digits); also the firewall MAC in m=14 dstMac',
    },
    {
      name: 'upstream_mac',
      defaultValue: '02:00:5e:00:53:01',
      description: 'MAC of the upstream router, dstMac of forwarded traffic',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.30.',
      description: 'Client addresses are this prefix plus a host number',
    },
    {
      name: 'client_first',
      defaultValue: '20',
      description: 'First client host number',
    },
    {
      name: 'client_count',
      defaultValue: '40',
      description:
        'Number of LAN clients (at least 8; client_first + client_count at most 255)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Not Rated m=97 step of the first episode',
      json: String.raw`{"@timestamp": "2026-09-27T01:16:12+00:00", "destination": {"bytes": 4402, "ip": "203.0.113.81", "mac": "02-00-5E-00-53-01", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"code": "97", "dataset": "sonicwall_firewall.log", "kind": "event", "original": "Sep 27 01:16:12 192.0.2.10 id=firewall sn=02DEADBEEF01 time=\"2026-09-27 01:16:12\" fw=192.0.2.10 pri=6 c=1024 m=97 app=48 n=1885362 src=10.20.30.21:64639:X0 dst=203.0.113.81:80:X1 srcMac=02:da:6e:73:9e:2a dstMac=02:00:5e:00:53:01 proto=tcp/http op=1 sent=1341 rcvd=4402 dpi=0 dstname=203.0.113.81 arg=/casino/lobby code=64 Category=\"Not Rated\" note=\"Policy: CFS Default Policy, Info: 6148 \" rule=\"9 (LAN-\u003eWAN)\" fw_action=\"NA\"", "sequence": 1885362, "severity": 6}, "http": {"request": {"method": "GET"}}, "log": {"level": "info"}, "message": "Policy: CFS Default Policy, Info: 6148 ", "network": {"bytes": 5743, "protocol": "http", "transport": "tcp"}, "observer": {"egress": {"interface": {"name": "X1"}}, "ingress": {"interface": {"name": "X0"}}, "ip": ["192.0.2.10"], "name": "firewall", "product": "SonicOS", "serial_number": "02DEADBEEF01", "type": "firewall", "vendor": "SonicWall"}, "related": {"ip": ["10.20.30.21", "203.0.113.81", "192.0.2.10"]}, "rule": {"id": "9 (LAN-\u003eWAN)"}, "sonicwall": {"firewall": {"Category": "Not Rated", "app": "48", "code": "64", "dpi": "false"}}, "source": {"bytes": 1341, "ip": "10.20.30.21", "mac": "02-DA-6E-73-9E-2A", "port": 64639}, "url": {"domain": "203.0.113.81", "full": "http://203.0.113.81/casino/lobby", "path": "/casino/lobby", "scheme": "http"}}`,
    },
  ],
};
