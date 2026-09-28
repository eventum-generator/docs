/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkBind9Query: GeneratorMeta = {
  slug: 'network-bind9-query',
  displayName: 'BIND 9 Query Log',
  category: 'network',
  description:
    'ISC BIND 9.18 queries category records from one recursive resolver serving 24 internal clients, as native named query-log lines in event.original with ECS fields parsed from them, for DNS monitoring and DNS-exfiltration detection testing. Recurring episodes show one client sending a run of TXT queries with distinct high-entropy labels to one tunnel zone.',
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
    'The first episode starts within the first anomaly_interval_hours (at most 24 h) of generation. Each later one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours. One client sends 8 TXT queries to one tunnel zone, each with a new high-entropy first label, at log-normal spacing (median about 12 s, about 1.5-2 minutes per episode); if the client already queried that zone in the preceding hour, the chain completes earlier and the remaining queries are not sent. Client and zone change each episode, and only an episode completes the chain.',
  generatorId: 'bind9',
  eventTypes: [
    {
      id: 'A',
      description:
        'Host lookups under example.com, example.net, example.org, plus the mail host after an MX',
      frequency: '41.1% measured share',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 lookups, usually right after the matching A',
      frequency: '20.5% measured share',
      category: 'network',
    },
    {
      id: 'TXT on analytics zones',
      description:
        'Runs of high-entropy labels under metrics.example.net / insights.example.org',
      frequency: '12.3% measured share',
      category: 'network',
    },
    {
      id: 'PTR',
      description: 'Reverse lookups in 10.in-addr.arpa',
      frequency: '11.6% measured share',
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
      frequency: '3.4% measured share',
      category: 'network',
    },
    {
      id: 'TXT DKIM / DMARC',
      description: '<selector>._domainkey.<domain> and _dmarc.<domain>',
      frequency: '3.9% measured share',
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
    'One recursive resolver serves 24 internal clients, each following its own daily activity window. The measured 156-hour default capture holds 55,810 events, about 360 per hour on average; the traffic mix is a synthetic assumption, not measured resolver traffic.',
    'All 24 clients send short high-entropy TXT runs to the tunnel zones and look up the zone apex in both modes. A background TXT query that would follow seven or more from its client to the same tunnel zone within the preceding hour keeps its time and goes to an analytics zone instead; six 156-hour background captures hold 49 runs of seven such queries.',
    'Runs of 8 or more high-entropy TXT queries from one client to one analytics zone within an hour are ordinary background traffic (227-284 per 156-hour background capture), so a long high-entropy TXT run alone does not mark an episode.',
    'Flags follow the BIND order: recursion (+/-), E(0), T, D, then cookie V or K. About 90% of queries carry EDNS and about 3% arrive over TCP; DO and the cookie flags appear only together with E(0).',
    'The native line follows the BIND 9.18 source code and assumes a file channel with print-time iso8601-utc, print-category and print-severity. The ARM publishes only the message part, so the prefix is taken from the source code, not from a published capture; other channel settings change the prefix, and syslog adds its own header.',
    'Only the default view is modelled. Signed queries, CD, EDNS Client Subnet and IPv6 clients are not generated, the client object is a random pointer-like value per query without reuse, and dns.question.registered_domain holds the delegated service zone, not the public-suffix registered domain.',
    'Query logs contain no responses or answer data, so a rule of 8 or more TXT queries with distinct long labels from one client to one watched zone within an hour shows the pattern, not that data was actually transferred. Traffic mix, client activity windows, rates and episode shape are synthetic.',
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
      json: String.raw`{"@timestamp": "2026-09-01T07:38:33.538000+00:00", "bind9": {"query": {"client_object": "@0x7f1a4b8ee4a8", "flags": "+E(0)"}}, "destination": {"ip": "10.20.30.53", "port": 53}, "dns": {"question": {"class": "IN", "name": "5d91b8581444e3e8edd8dba61ff18aceb65aa7e62c87a7a4b3ff70a9c.sync.example.test", "registered_domain": "sync.example.test", "type": "TXT"}, "type": "query"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-query", "category": ["network"], "dataset": "bind9.query", "kind": "event", "original": "2026-09-01T07:38:33.538Z queries: info: client @0x7f1a4b8ee4a8 10.20.40.11#17988 (5d91b8581444e3e8edd8dba61ff18aceb65aa7e62c87a7a4b3ff70a9c.sync.example.test): query: 5d91b8581444e3e8edd8dba61ff18aceb65aa7e62c87a7a4b3ff70a9c.sync.example.test IN TXT +E(0) (10.20.30.53)", "type": ["protocol", "info"]}, "host": {"name": "ns1.example.test"}, "network": {"protocol": "dns", "transport": "udp"}, "observer": {"hostname": "ns1.example.test", "product": "BIND", "type": "dns", "vendor": "ISC"}, "related": {"ip": ["10.20.40.11", "10.20.30.53"]}, "source": {"ip": "10.20.40.11", "port": 17988}}`,
    },
  ],
};
