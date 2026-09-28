import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPowerdnsAuthoritative: GeneratorMeta = {
  slug: 'network-powerdns-authoritative',
  displayName: 'PowerDNS Authoritative Query Log',
  category: 'network',
  description:
    'PowerDNS Authoritative Server 5.0.1 per-query lines (log-dns-queries, classic unstructured stderr output, packet cache on) as native text in event.original with parsed ECS fields. One server answers for a few zones; four recursive resolvers and a group of directly connected hosts query it over UDP. Recurring episodes show one direct client checking a zone with SOA and NS and then enumerating names in it.',
  dataSource:
    'PowerDNS Authoritative Server 5.0.1 classic stderr query log (log-dns-queries)',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native PowerDNS 5.0.1 query line in event.original',
    'Independent traffic from 4 resolvers and 16 direct clients',
    'Recurring SOA, NS and name-enumeration chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One directly connected client queries the SOA of a zone apex, then its NS (often with MX and TXT apex queries in between), then 12 to 18 A queries for distinct names in the same zone, existing hosts and names the zone does not publish, a few seconds apart. Episodes become due every 24 hours by default (anomaly_interval_hours, minimum 2) of source time: the first start falls within the first min(interval, 24 h), each later start in a window of min(interval / 4, 6 h) centred on the due time, weighted towards busy hours; the next due time counts from the actual start and missed intervals are never caught up. The client changes between episodes; zone and names are drawn fresh. Every step occurs in background, where a guard keeps a tenth distinct name within five minutes of a SOA/NS pair from completing the chain.',
  generatorId: 'powerdns-auth',
  eventTypes: [
    {
      id: 'A',
      description:
        'Host lookups, including stale or mistyped names and short inventory sweeps by direct clients',
      frequency: '61.9% measured share',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 host lookups',
      frequency: '20.4% measured share',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail-exchanger lookups of a zone apex',
      frequency: '6.5% measured share',
      category: 'network',
    },
    {
      id: 'TXT',
      description: 'Zone-apex TXT (SPF) lookups',
      frequency: '5.7% measured share',
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
      frequency: '1.5% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Every client follows its own daily activity window; a 54-hour default capture holds about 650 events per hour. Direct clients run zone checks, inventory sweeps of several distinct names and lookups of names that do not exist; the traffic mix is a synthetic assumption.',
    'A question repeated with the same name, type, DO bit and EDNS size within 20 seconds (the default cache-ttl) is a packetcache HIT (3.8% of lines), anything else a MISS. The real cache hashes the whole packet and honours shorter answer TTLs.',
    'EDNS follows the server parser: no EDNS logs do = 0, bufsize = 512; with EDNS the advertised size is clamped to 512-1232 and shown in parentheses when it differs. Resolvers send EDNS with DO set; direct clients use EDNS 1232, EDNS 4096 or none.',
    'The line format follows the 5.0.1 source and one complete captured line in a vendor issue, not a live daemon for every case. The timestamp is local time assumed to be UTC, with no syslog or journald wrapper.',
    'Only UDP questions are modelled: no TCP, PROXY protocol, EDNS Client Subnet, overload drops, structured logging (5.1+) or Recursor. The log records questions only, with no response code or answer.',
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
        'Zones served; the first gets most traffic. Use registrable names, since dns.question.registered_domain carries the zone',
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
      title: 'Enumeration query from the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T11:37:34+00:00", "dns": {"question": {"name": "smtp.corp.example", "registered_domain": "corp.example", "type": "A"}, "type": "query"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-query", "category": ["network"], "kind": "event", "original": "Sep 21 11:37:34 Remote 10.20.40.26 wants \u0027smtp.corp.example|A\u0027, do = 0, bufsize = 1232: packetcache MISS", "type": ["info"]}, "host": {"name": "ns01.corp.example"}, "powerdns": {"dnssec_ok": false, "edns_buffer_size": 1232, "packet_cache": "MISS", "server_type": "authoritative"}, "related": {"ip": ["10.20.40.26"]}, "source": {"ip": "10.20.40.26"}}`,
    },
  ],
};
