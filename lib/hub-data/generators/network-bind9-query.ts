/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkBind9Query: GeneratorMeta = {
  slug: 'network-bind9-query',
  displayName: 'BIND 9 Query Log',
  category: 'network',
  description:
    'ISC BIND 9.18 queries category records from one recursive resolver serving 24 internal clients, as native named query-log lines in event.original with ECS fields parsed from them, for DNS monitoring and DNS-exfiltration detection testing. Recurring episodes show one client sending a run of TXT queries with new high-entropy labels to one tunnel zone.',
  dataSource:
    'ISC BIND 9.18 named queries category, file channel with print-time iso8601-utc, print-category and print-severity',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native named query-log line in event.original',
    '24 clients, each with its own daily activity window',
    'Recurring high-entropy TXT burst to one tunnel zone',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every 24 hours of source time by default (minimum 2) and starts after an exponential delay with a mean of 15 minutes; the next due time counts from that actual start, and missed intervals are never caught up. One client then sends 10 to 16 TXT queries to one tunnel zone, each with a new high-entropy first label, at log-normal spacing (median about 12 s, 122-181 s per episode measured). Client and zone change each episode. All clients also send short high-entropy TXT runs to the tunnel zones and look up their apex in both modes, kept below 8 TXT queries per client and zone within an hour, so only an episode completes the chain.',
  generatorId: 'bind9',
  eventTypes: [
    {
      id: 'A',
      description:
        'Host lookups under example.com, example.net, example.org, plus the mail host after an MX',
      frequency: '41.8% measured share',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 lookups, usually right after the matching A',
      frequency: '20.9% measured share',
      category: 'network',
    },
    {
      id: 'TXT on analytics zones',
      description:
        'Runs of high-entropy labels under metrics.example.net / insights.example.org',
      frequency: '11.8% measured share',
      category: 'network',
    },
    {
      id: 'PTR',
      description: 'Reverse lookups in 10.in-addr.arpa',
      frequency: '11.4% measured share',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail-exchanger lookups',
      frequency: '5.8% measured share',
      category: 'network',
    },
    {
      id: 'TXT on tunnel zones',
      description:
        'Short high-entropy runs under the tunnel zones, plus the anomaly episodes',
      frequency: '3.3% measured share',
      category: 'network',
    },
    {
      id: 'TXT DKIM / DMARC',
      description: '<selector>._domainkey.<domain> and _dmarc.<domain>',
      frequency: '3.8% measured share',
      category: 'network',
    },
    {
      id: 'A / AAAA / NS on tunnel-zone apex',
      description: 'Plain lookups of the tunnel zones themselves',
      frequency: '1.3% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One recursive resolver serves 24 internal clients, each following its own daily activity window. The measured 78-hour default capture holds 23,525 events, about 300 per hour on average; the traffic mix is a synthetic assumption, not measured resolver traffic.',
    'Analytics zones receive high-entropy TXT runs of 8 or more queries per hour (about 870-1,360 per 78-hour capture) in both modes, so a long high-entropy TXT run alone does not mark an episode.',
    'Flags follow the BIND order: recursion (+/-), E(0), T, D, then cookie V or K. About 90% of queries carry EDNS and about 3% arrive over TCP; DO and the cookie flags appear only together with E(0).',
    'The native line follows the BIND 9.18 source code and assumes a file channel with print-time iso8601-utc, print-category and print-severity. The ARM publishes only the message part, so the prefix is taken from the source code, not from a published capture; other channel settings change the prefix, and syslog adds its own header.',
    'Only the default view is modelled. Signed queries, CD, EDNS Client Subnet and IPv6 clients are not generated, the client object is a random pointer-like value per query without reuse, and dns.question.registered_domain holds the delegated service zone, not the public-suffix registered domain.',
    'Query logs contain no responses or answer data, so a rule of 8 or more TXT queries with distinct long labels from one client to one watched zone within an hour shows the pattern, not that data was actually transferred. Activity windows, rates and episode shape are synthetic.',
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
      description: 'Hours of source time between episodes, 2 to 8,760',
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
      description: 'Number of clients, at least 4',
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
      title: 'Episode TXT query to a tunnel zone',
      json: String.raw`{"@timestamp": "2026-09-01T21:15:10.279000+00:00", "bind9": {"query": {"client_object": "@0x7fed853a1c48", "flags": "+E(0)K"}}, "destination": {"ip": "10.20.30.53", "port": 53}, "dns": {"question": {"class": "IN", "name": "3e1ce784fc1248e6fad96dfda3b.telemetry.example.test", "registered_domain": "telemetry.example.test", "type": "TXT"}, "type": "query"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-query", "category": ["network"], "dataset": "bind9.query", "kind": "event", "original": "2026-09-01T21:15:10.279Z queries: info: client @0x7fed853a1c48 10.20.40.26#8731 (3e1ce784fc1248e6fad96dfda3b.telemetry.example.test): query: 3e1ce784fc1248e6fad96dfda3b.telemetry.example.test IN TXT +E(0)K (10.20.30.53)", "type": ["protocol", "info"]}, "host": {"name": "ns1.example.test"}, "network": {"protocol": "dns", "transport": "udp"}, "observer": {"hostname": "ns1.example.test", "product": "BIND", "type": "dns", "vendor": "ISC"}, "related": {"ip": ["10.20.40.26", "10.20.30.53"]}, "source": {"ip": "10.20.40.26", "port": 8731}}`,
    },
  ],
};
