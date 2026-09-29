import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSonicwallTz: GeneratorMeta = {
  slug: 'network-sonicwall-tz',
  displayName: 'SonicWall TZ Web Traffic and Content Filtering',
  category: 'network',
  description:
    'SonicWall TZ (SonicOS 6.5.4) LAN-to-WAN web traffic records (m=97, m=537) and Content Filtering Service denials (m=14) of one firewall between a 40-client LAN and the internet, as ECS JSON following the Elastic sonicwall_firewall integration with the native default key-value Syslog line in event.original. For SIEM content on perimeter firewall and web filtering telemetry. About 12,500 records a day follow an office working day. Recurring episodes show one client denied three or more times for a gambling site and then fetching the same path from an uncategorized host.',
  dataSource:
    'SonicWall SonicOS 6.5.4 default key-value Syslog, traffic report and Content Filtering messages',
  format: ['JSON', 'ECS', 'Syslog', 'KV'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native lines copied from the SonicOS 6.5.4 guide examples',
    '40 LAN clients following an office working day',
    'Recurring CFS denial then Not Rated same-path chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default, one LAN client is denied by CFS 3-6 times for one gambling host, the first denial for / or /login, then a few minutes later (log-normal, median 90 s) fetches that same path from a Not Rated host it visits often (m=97). The chain spans less than 30 minutes: typically 1 to 9 minutes (median about 2.5), rarely up to about 20. The first episode starts within min(anomaly_interval_hours, 24 h) of the start of the data, following the hour-of-day volume; each later one within a window of min(interval / 4, 6 h) centred on the previous start plus the interval, busy hours strongly preferred, so at the default episodes start at a similar, usually busy, hour every day. The next interval counts from the actual start, with no catch-up, and consecutive episodes use different clients. The client and site are a frequent pair of a user who often tries gambling sites, present at that hour. Every client, host and path of the chain also occurs in ordinary traffic; only the complete sequence is absent from it.',
  generatorId: 'sonicwall',
  eventTypes: [
    {
      id: '537 HTTPS',
      description: 'Connection Closed, HTTPS',
      frequency: '68.2% of records',
      category: 'network',
    },
    {
      id: '97 Information Technology/Computers',
      description:
        'Website accessed (HTTP, URL data), Information Technology/Computers',
      frequency: '8.0% of records',
      category: 'none',
    },
    {
      id: '97 Not Rated',
      description: 'Website accessed (HTTP, URL data), Not Rated',
      frequency: '6.9% of records',
      category: 'none',
    },
    {
      id: '97 Search Engines and Portals',
      description:
        'Website accessed (HTTP, URL data), Search Engines and Portals',
      frequency: '6.5% of records',
      category: 'none',
    },
    {
      id: '97 Business and Economy',
      description: 'Website accessed (HTTP, URL data), Business and Economy',
      frequency: '5.2% of records',
      category: 'none',
    },
    {
      id: '537 HTTP',
      description: 'Connection Closed, HTTP without request',
      frequency: '2.9% of records',
      category: 'network',
    },
    {
      id: '14 Gambling',
      description: 'CFS Web site access denied, Gambling',
      frequency: '2.3% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One firewall between a LAN (X0, 10.20.30.0/24) and the internet (X1), with CFS blocking the Gambling category. SonicOS logs every closed connection once: m=97 when CFS saw URL data (plain HTTP), m=537 otherwise (HTTPS, or HTTP closed before a request); m=14 is the CFS denial. No field labels an episode.',
    'About 12,500 records a day on a working-day curve (UTC): 113 an hour at night (23:00-07:00), 507 at 07:00-08:00 and 18:00-21:00, 901 in office hours (08:00-18:00) and 282 at 21:00-23:00, with the daily volume varying by about 3%. All 40 clients are present in office hours, about 24 in the early morning and evening, 13 late in the evening and 8 at night. The same parameters always describe the same office: client MAC addresses, how busy each client is, who works late, favourite sites and the popularity of internet servers.',
    'Browsing sessions (93% of client activities) open a log-normal number of connections (median 6, at most 40) a few seconds apart: 70% HTTPS to 60 internet servers of skewed popularity, 27% plain HTTP with URL data to sites in four CFS categories, 3% HTTP closed without a request. Clients differ in how much they browse.',
    'Blocked-site attempts (7% of client activities) hit one of six gambling sites with 1-6 denials, fewer being more common, 60% repeating the previous path. A fifth of the users try gambling sites often, mostly one favourite site; the rest rarely. In 30% of attempts the user then tries a Not Rated host (median 90 s later, at most 20 minutes), half the time with a path copied from the denied pages.',
    'Source ports advance per client by 1-3 through the ephemeral range; byte and packet counters and cdur are log-normal. n (event.sequence) is the per-message-ID count and advances by 1-4, since the same message IDs also count traffic that is not generated (other zones, UDP, inbound).',
    'Native lines copy the field sets and order of the SonicOS 6.5.4 guide default Syslog examples (m=97, m=14 and both m=537 shapes); app=11 for HTTPS m=537 comes from a real capture in the Elastic integration test data. CFS records are HTTP only, as without DPI-SSL. Not generated: m=98, NAT fields, zones, users, gcat, referer, IPv6, CEF and other message IDs. The guide is not a TZ-specific capture, and SonicOS 7 lines differ.',
    'The Syslog header carries the firewall WAN address and the UTC time= clock plus 0-1 s receipt delay; a relay in another time zone is not modeled. The ECS document follows the Elastic pipeline output; like that pipeline, m=97 records have no event.action or event.category. Rates, sizes, durations and address pools are training assumptions, and there is no weekday cycle.',
    "Connections of one browsing session are a few seconds apart in office hours and up to about half a minute apart at night, and repeated denials of one attempt a median 20 s apart (90th percentile 90 s), not sub-second browser bursts. Repeated denials of one site, Not Rated visits shortly after denials and Not Rated visits reusing a denied path all occur in ordinary traffic every day; with episodes on, their counts are about one episode's worth higher. With intervals that are not a multiple of 24 h, some episodes start at night, when about 6-7% of blocked-site attempts occur.",
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
      title: 'Not Rated m=97 step of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T10:00:57+00:00", "destination": {"bytes": 789, "ip": "203.0.113.61", "mac": "02-00-5E-00-53-01", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"code": "97", "dataset": "sonicwall_firewall.log", "kind": "event", "original": "Sep  1 10:00:57 192.0.2.10 id=firewall sn=02DEADBEEF01 time=\"2026-09-01 10:00:57\" fw=192.0.2.10 pri=6 c=1024 m=97 app=48 n=2309112 src=10.20.30.48:54396:X0 dst=203.0.113.61:80:X1 srcMac=02:23:8d:54:1c:50 dstMac=02:00:5e:00:53:01 proto=tcp/http op=1 sent=456 rcvd=789 dpi=0 dstname=static-host.example arg=/ code=64 Category=\"Not Rated\" note=\"Policy: CFS Default Policy, Info: 6148 \" rule=\"9 (LAN-\u003eWAN)\" fw_action=\"NA\"", "sequence": 2309112, "severity": 6}, "http": {"request": {"method": "GET"}}, "log": {"level": "info"}, "message": "Policy: CFS Default Policy, Info: 6148 ", "network": {"bytes": 1245, "protocol": "http", "transport": "tcp"}, "observer": {"egress": {"interface": {"name": "X1"}}, "ingress": {"interface": {"name": "X0"}}, "ip": ["192.0.2.10"], "name": "firewall", "product": "SonicOS", "serial_number": "02DEADBEEF01", "type": "firewall", "vendor": "SonicWall"}, "related": {"ip": ["10.20.30.48", "203.0.113.61", "192.0.2.10"]}, "rule": {"id": "9 (LAN-\u003eWAN)"}, "sonicwall": {"firewall": {"Category": "Not Rated", "app": "48", "code": "64", "dpi": "false"}}, "source": {"bytes": 456, "ip": "10.20.30.48", "mac": "02-23-8D-54-1C-50", "port": 54396}, "url": {"domain": "static-host.example", "full": "http://static-host.example/", "path": "/", "scheme": "http"}}`,
    },
  ],
};
