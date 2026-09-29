/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkBind9Query: GeneratorMeta = {
  slug: 'network-bind9-query',
  displayName: 'BIND 9 Query Log',
  category: 'network',
  description:
    'ISC BIND 9.18 queries category records from one recursive resolver serving 24 internal clients (4 servers and 20 workstations), as native named query-log lines in event.original with ECS fields parsed from them, for DNS monitoring and DNS-exfiltration detection testing. About 12,900 queries a day: servers query around the clock, workstations follow nine-hour working shifts in UTC. Recurring episodes show one workstation sending eight TXT queries with distinct high-entropy labels to one tunnel zone within a few minutes.',
  dataSource:
    'ISC BIND 9.18 named queries category, file channel with print-time iso8601-utc, print-category and print-severity',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native named query-log line in event.original',
    '20 workstations on nine-hour shifts, 4 servers around the clock',
    'Recurring eight-query high-entropy TXT burst to one tunnel zone',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One workstation sends eight TXT queries to one tunnel zone, each with a distinct high-entropy first label, a few seconds apart and spanning about 1-5 minutes; source.ip and dns.question.registered_domain link them, and nothing from the episode follows the eighth query. The client is a workstation active at that hour (on shift, or left on overnight) that has sent no TXT query to that zone in the preceding hour; when ordinary tunnel-zone queries of the same client fall inside the episode, the chain completes that many queries earlier and the rest of the episode is not sent. The first episode starts within the first anomaly_interval_hours (at most 24 h) of generation, at a time of day drawn from the workstation hour curve. Each later one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours: at the default interval mostly in working hours, about 21-27 hours apart; at 8 hours 7-9 hours apart, some at night on a workstation left on. Client and tunnel zone change from one episode to the next. Episodes do not change the total query volume or its hourly curve.',
  generatorId: 'bind9',
  eventTypes: [
    {
      id: 'A',
      description:
        'Host lookups under example.com, example.net, example.org, plus the mail host after an MX',
      frequency: '43.8% of queries',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 lookups, usually right after the matching A',
      frequency: '22.0% of queries',
      category: 'network',
    },
    {
      id: 'TXT on analytics zones',
      description:
        'Workstation runs of high-entropy labels under metrics.example.net / insights.example.org',
      frequency: '13.8% of queries',
      category: 'network',
    },
    {
      id: 'PTR',
      description: 'Reverse lookups in 10.in-addr.arpa, mostly from servers',
      frequency: '7.9% of queries',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail-exchanger lookups by servers',
      frequency: '4.8% of queries',
      category: 'network',
    },
    {
      id: 'TXT on tunnel zones',
      description:
        'Short workstation runs of high-entropy labels under the tunnel zones, plus the anomaly episodes',
      frequency: '3.5% of queries',
      category: 'network',
    },
    {
      id: 'TXT DKIM / DMARC',
      description:
        '<selector>._domainkey.<domain> and _dmarc.<domain> lookups by servers',
      frequency: '3.1% of queries',
      category: 'network',
    },
    {
      id: 'A / AAAA / NS on tunnel-zone apex',
      description: 'Workstation lookups of the tunnel zones themselves',
      frequency: '1.2% of queries',
      category: 'network',
    },
  ],
  realismFeatures: [
    "One recursive resolver serves 4 servers and 20 workstations, about 12,900 queries a day, each day's volume varying by up to 3%. Workstations work nine-hour shifts in UTC (a quarter 07:00-16:00, half 08:00-17:00, a quarter 09:00-18:00) and send 900 queries an hour with every shift in, about 45 per workstation; about 30% of them stay switched on overnight and send 50 queries an hour between them. Servers send 150 queries an hour around the clock. Each hour holds about 1.5% of the day's queries at night, 3.3% at 07:00 and 17:00, 6.8% at 08:00 and 16:00 and about 8.5% from 09:00 to 16:00.",
    'Servers make the MX, DKIM / DMARC and most PTR lookups; workstations make the high-entropy TXT runs to the analytics and tunnel zones and the tunnel-zone apex lookups. The traffic mix is a synthetic assumption, not measured resolver traffic.',
    'In both modes every workstation sends high-entropy TXT queries to both tunnel zones in short runs (1-2 queries typical), from a few to about 30 times a day per zone, and looks up the zone apex. A client reaches seven TXT queries to one tunnel zone within an hour about 7-13 times a day, but outside episodes never eight. Runs of 8 or more high-entropy TXT queries from one client to one analytics zone within an hour occur about 80-100 times a day.',
    'Flags follow the BIND order: recursion (+/-), E(0), T, D, then cookie V or K. About 90% of queries carry EDNS and about 3% arrive over TCP; DO and the cookie flags appear only together with E(0).',
    'Queries that belong together (an A and its AAAA, an MX and the mail host lookup, the queries of a run) are seconds apart rather than milliseconds: an AAAA follows its A after a median of 3.5 seconds. Every day follows the same working-day curve in UTC; weekends, holidays and local time zones are not modelled, and shifts start exactly on the hour.',
    'The native line follows the BIND 9.18 source code and assumes a file channel with print-time iso8601-utc, print-category and print-severity. The ARM publishes only the message part, so the prefix is taken from the source code, not from a published capture; other channel settings change the prefix, and syslog adds its own header.',
    'Only the default view is modelled. Signed queries, CD, EDNS Client Subnet and IPv6 clients are not generated, the client object is a random pointer-like value per query without reuse, and dns.question.registered_domain holds the delegated service zone, not the public-suffix registered domain.',
    'Query logs contain no responses or answer data, so a rule of 8 or more TXT queries with distinct long labels from one client to one watched zone within an hour shows the pattern, not that data was actually transferred. Traffic mix, shifts, rates and episode shape are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring exfiltration episodes; false produces background traffic only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours of source time between episodes, counted from the actual start of the previous one, 2 to 8,760',
    },
    {
      name: 'server_name',
      defaultValue: 'ns1.example.test',
      description:
        'Resolver host name written to host.name and observer.hostname',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.30.53',
      description:
        'Address the queries arrive on, as it appears in the log line',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.40.',
      description: 'First three octets of the client addresses',
    },
    {
      name: 'client_first',
      defaultValue: '11',
      description: 'Last octet of the first client',
    },
    {
      name: 'client_count',
      defaultValue: '24',
      description: 'Number of clients, servers included',
    },
    {
      name: 'server_count',
      defaultValue: '4',
      description:
        'How many of the first client addresses are servers; the rest are workstations, at least 4',
    },
    {
      name: 'tunnel_zones',
      defaultValue: '[telemetry.example.test, sync.example.test]',
      description:
        'Zones the episodes target, also queried in background, at least 2',
    },
    {
      name: 'analytics_zones',
      defaultValue: '[metrics.example.net, insights.example.org]',
      description:
        'Zones that receive long high-entropy TXT runs in background, at least 2',
    },
  ],
  sampleOutputs: [
    {
      title: 'TXT query that completes an episode',
      json: String.raw`{"@timestamp": "2026-09-01T17:21:39.576000+00:00", "bind9": {"query": {"client_object": "@0x7fff9ced1927", "flags": "+E(0)K"}}, "destination": {"ip": "10.20.30.53", "port": 53}, "dns": {"question": {"class": "IN", "name": "bcc9a59a2f23b1879b033c138a3cac4f5746.sync.example.test", "registered_domain": "sync.example.test", "type": "TXT"}, "type": "query"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-query", "category": ["network"], "dataset": "bind9.query", "kind": "event", "original": "2026-09-01T17:21:39.576Z queries: info: client @0x7fff9ced1927 10.20.40.33#1195 (bcc9a59a2f23b1879b033c138a3cac4f5746.sync.example.test): query: bcc9a59a2f23b1879b033c138a3cac4f5746.sync.example.test IN TXT +E(0)K (10.20.30.53)", "type": ["protocol", "info"]}, "host": {"name": "ns1.example.test"}, "network": {"protocol": "dns", "transport": "udp"}, "observer": {"hostname": "ns1.example.test", "product": "BIND", "type": "dns", "vendor": "ISC"}, "related": {"ip": ["10.20.40.33", "10.20.30.53"]}, "source": {"ip": "10.20.40.33", "port": 1195}}`,
    },
  ],
};
