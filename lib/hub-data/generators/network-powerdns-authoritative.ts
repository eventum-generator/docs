import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPowerdnsAuthoritative: GeneratorMeta = {
  slug: 'network-powerdns-authoritative',
  displayName: 'PowerDNS Authoritative Query Log',
  category: 'network',
  description:
    'PowerDNS Authoritative Server 5.0.1 per-query lines (log-dns-queries, classic unstructured stderr output, packet cache on) as native text in event.original with parsed ECS fields. One server answers for a few zones; four recursive resolvers and a group of directly connected hosts query it over UDP. Recurring episodes show one direct client checking a zone with SOA and NS and then enumerating ten distinct names in it.',
  dataSource:
    'PowerDNS Authoritative Server 5.0.1 classic stderr query log (log-dns-queries)',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native PowerDNS 5.0.1 query line in event.original',
    'About 21,000 queries a day on a UTC daily curve',
    'Recurring SOA, NS and name-enumeration chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One directly connected client queries the SOA of a zone apex, then its NS (often with MX and TXT apex queries in between), then A queries a few seconds apart for distinct names in the same zone, existing hosts and names the zone does not publish, until the tenth distinct name 40-230 s after the SOA. An episode becomes due every 24 hours of source time by default (anomaly_interval_hours, minimum 2). The first start falls within the first min(interval, 24 h) at a time of day drawn from the direct clients' daily curve; each later start is drawn from a window of min(interval / 4, 6 h) centred on the due time, weighted towards busy hours. The next due time counts from the actual start and missed intervals are never caught up, so at the default interval consecutive episodes start about 22-26 h apart, never outside 21-27 h. The client changes between episodes; zone and names are drawn fresh.",
  generatorId: 'powerdns-auth',
  eventTypes: [
    {
      id: 'A',
      description:
        'Host lookups, including stale or mistyped names and short inventory sweeps by direct clients',
      frequency: '62.6% measured share',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 host lookups',
      frequency: '18.8% measured share',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail-exchanger lookups of a zone apex',
      frequency: '6.7% measured share',
      category: 'network',
    },
    {
      id: 'TXT',
      description: 'Zone-apex TXT (SPF) lookups',
      frequency: '5.8% measured share',
      category: 'network',
    },
    {
      id: 'NS',
      description: 'Name-server set of a zone apex',
      frequency: '4.0% measured share',
      category: 'network',
    },
    {
      id: 'SOA',
      description:
        'Serial and zone checks by direct clients; resolvers never ask for SOA in this model',
      frequency: '2.2% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'About 21,000 queries a day, about 340 per hour at 19:00-07:00 UTC, 1,050-1,250 at 07:00-09:00 and 17:00-19:00 and about 1,560 at 09:00-17:00; daily volume varies by about 3%. The traffic mix, rates and client behaviour are synthetic assumptions.',
    'Four recursive resolvers send about 69% of the queries, each an independent question, so a resolver repeats a name within five minutes more often than a caching resolver would. Directly connected clients send short sessions (repeated single lookups, zone checks, inventory sweeps, mail-routing checks), each with its own weight and daily activity window.',
    'A question repeated with the same name, type, DO bit and EDNS size within 20 seconds (the default cache-ttl) is a packetcache HIT (5-8% of lines), anything else a MISS. The real cache hashes the whole query packet and also honours shorter answer TTLs.',
    'EDNS follows the server parser: no EDNS logs do = 0, bufsize = 512; with EDNS the advertised size is clamped to 512-1232 and shown in parentheses when it differs. Resolvers send EDNS with DO set; direct clients use EDNS 1232, EDNS 4096 or none, and dig-like clients occasionally set DO.',
    'Every episode client also queries SOA, NS, MX, TXT and A for the same zones in ordinary traffic, and zone checks followed by sweeps of several distinct names occur every day. Ordinary traffic reaches SOA, NS and nine distinct names within five minutes but never the tenth; the same sequence over more than five minutes also occurs.',
    'The line format follows the 5.0.1 source and one complete captured line in a vendor issue, not a recording of a live daemon. The timestamp is the daemon local time, here UTC, with one-second resolution and no syslog or journald wrapper; session queries are seconds apart, often 10 s or more at night, slower than a real dig or script.',
    'Only UDP queries are modelled: no TCP, PROXY protocol, EDNS Client Subnet, overload drops, structured logging (5.1+) or Recursor. The log records questions only, with no response code or answer.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring reconnaissance episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time hours between episode due times; 2 to 8,760',
    },
    {
      name: 'host_name',
      defaultValue: 'ns01.corp.example',
      description:
        'Server name in host.name (configured context, not part of the native line)',
    },
    {
      name: 'zones',
      defaultValue: 'corp.example, contoso.example',
      description:
        'Zones served; the first one gets most traffic. Use registrable names, since dns.question.registered_domain carries the zone',
    },
    {
      name: 'resolver_ips',
      defaultValue: '10.20.30.11, 10.20.30.12, 10.20.30.13, 10.20.30.14',
      description: 'Recursive resolvers querying the server',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.40.',
      description: 'Prefix of the directly connected clients',
    },
    {
      name: 'client_first',
      defaultValue: '21',
      description: 'Last octet of the first direct client',
    },
    {
      name: 'client_count',
      defaultValue: '16',
      description:
        'Number of direct clients, at least 4; resolver and client addresses must not overlap',
    },
  ],
  sampleOutputs: [
    {
      title: 'Enumeration query from an episode',
      json: String.raw`{"@timestamp": "2026-09-01T08:56:21+00:00", "dns": {"question": {"name": "vpn2.corp.example", "registered_domain": "corp.example", "type": "A"}, "type": "query"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-query", "category": ["network"], "kind": "event", "original": "Sep 01 08:56:21 Remote 10.20.40.21 wants \u0027vpn2.corp.example|A\u0027, do = 0, bufsize = 1232: packetcache MISS", "type": ["info"]}, "host": {"name": "ns01.corp.example"}, "powerdns": {"dnssec_ok": false, "edns_buffer_size": 1232, "packet_cache": "MISS", "server_type": "authoritative"}, "related": {"ip": ["10.20.40.21"]}, "source": {"ip": "10.20.40.21"}}`,
    },
  ],
};
