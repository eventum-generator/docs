import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPowerdnsAuthoritative: GeneratorMeta = {
  slug: 'network-powerdns-authoritative',
  displayName: 'PowerDNS Authoritative Server',
  category: 'network',
  dataSource: 'PowerDNS Authoritative classic DNS query syslog',
  description:
    'Authoritative DNS query logs with a switchable zone-enumeration-like sequence.',
  generatorId: 'powerdns-authoritative',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Vendor Remote ... wants query-line format',
    'Packet-cache HIT/MISS retained',
    'SOA/NS/TXT probing followed by unique labels',
  ],
  anomalyChain:
    'One remote probes SOA, NS and TXT before twelve unique long-label A queries to the same zone, all cache misses.',
  eventTypes: [
    {
      id: 'A',
      description: 'Address query',
      frequency: '75% baseline',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 address query',
      frequency: '12% baseline',
      category: 'network',
    },
    {
      id: 'SOA',
      description: 'Zone metadata query',
      frequency: '8% baseline',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail exchange query',
      frequency: '5% baseline',
      category: 'network',
    },
    {
      id: 'NS',
      description: 'Nameserver probe',
      frequency: 'Chain only',
      category: 'network',
    },
    {
      id: 'TXT',
      description: 'Text-record probe',
      frequency: 'Chain only',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Classic UDP query messages match a PowerDNS Authoritative vendor sample.',
    'Packet-cache misses do not imply DNS response codes.',
    'Query logging requires log-dns-queries and loglevel at least 5.',
  ],
  format: ['JSON', 'ECS', 'syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include zone-enumeration-like chain',
    },
    {
      name: 'host_name',
      defaultValue: 'ns01.corp.example',
      description: 'Authoritative server name',
    },
    {
      name: 'zone_name',
      defaultValue: 'corp.example',
      description: 'Authoritative zone',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description: 'Remote IP in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'PowerDNS Authoritative Server event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:20:45+00:00",
  "dns": {
    "question": {
      "name": "0195728f0fd622fa4f0d49.corp.example",
      "type": "A"
    },
    "type": "query"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "dns-query",
    "category": [
      "network"
    ],
    "kind": "event",
    "original": "Sep 25 12:20:45 ns01.corp.example pdns_server[2367]: Remote 192.0.2.91 wants '0195728f0fd622fa4f0d49.corp.example|A', do = 0, bufsize = 512: packetcache MISS",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "ns01.corp.example"
  },
  "powerdns": {
    "dnssec_ok": false,
    "edns_buffer_size": 512,
    "packet_cache": "MISS",
    "server_type": "authoritative"
  },
  "process": {
    "name": "pdns_server",
    "pid": 2367
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  }
}`,
    },
  ],
};
