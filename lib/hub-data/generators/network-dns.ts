import type { GeneratorMeta } from '@/lib/hub-types';

export const networkDns: GeneratorMeta = {
    slug: 'network-dns',
    displayName: 'Network DNS Traffic',
    category: 'network',
    description:
      'Passive DNS transaction logs — query/response pairs for A, AAAA, CNAME, MX, TXT, PTR, SRV, SOA, NS, and DNSKEY records. Mixed internal/external resolvers with NXDOMAIN, SERVFAIL, and REFUSED errors.',
    format: ['JSON', 'ECS'],
    dataSource: 'Passive DNS (Packetbeat-style)',
    eventCount: 10,
    templateCount: 10,
    highlights: [
      '10 DNS record types',
      '40 real-world domains',
      'Response code realism',
      'Community ID',
    ],
    generatorId: 'dns',
    eventTypes: [
      {
        id: 'A',
        description: 'IPv4 address lookup',
        frequency: '~60%',
        category: 'network',
      },
      {
        id: 'AAAA',
        description: 'IPv6 address lookup',
        frequency: '~16%',
        category: 'network',
      },
      {
        id: 'PTR',
        description: 'Reverse DNS lookup',
        frequency: '~8%',
        category: 'network',
      },
      {
        id: 'CNAME',
        description: 'Alias resolution with CDN chains',
        frequency: '~4%',
        category: 'network',
      },
      {
        id: 'HTTPS',
        description: 'SVCB/HTTPS service binding',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'TXT',
        description: 'SPF/DKIM/DMARC records',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'MX',
        description: 'Mail exchange lookup',
        frequency: '~2%',
        category: 'network',
      },
      {
        id: 'SRV',
        description: 'Service location (AD, SIP)',
        frequency: '~2%',
        category: 'network',
      },
      {
        id: 'NS',
        description: 'Nameserver delegation',
        frequency: '~1%',
        category: 'network',
      },
      {
        id: 'SOA',
        description: 'Zone authority info',
        frequency: '~0.6%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Weighted query type distribution matching typical enterprise DNS traffic',
      'Mixed internal/external domains per template (e.g. 35% internal for A records, 90% for SRV)',
      'Response code distribution — ~86% NOERROR, ~10% NXDOMAIN, ~3% SERVFAIL, ~1% REFUSED',
      'Realistic answer data — CNAME chains, MX priorities, SRV records for Active Directory services',
      '40 real-world external domains and 30 internal service hostnames',
      'Transport variation — UDP (~97%) vs TCP (~3%), higher TCP for TXT and SOA queries',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'SENSOR01',
        description: 'Packetbeat sensor hostname',
      },
      {
        name: 'dns_server_ip',
        defaultValue: '10.0.0.10',
        description: 'Monitored DNS server IP',
      },
      {
        name: 'internal_domain',
        defaultValue: 'contoso.local',
        description: 'Internal domain suffix',
      },
      {
        name: 'agent_id',
        defaultValue: 'b59c76de-...',
        description: 'Packetbeat agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Packetbeat version',
      },
    ],
    sampleOutputs: [
      {
        title: 'A Record Query — NOERROR',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "dns": {
        "answers": [{ "data": "142.250.80.4", "name": "www.google.com", "type": "A" }],
        "question": { "name": "www.google.com", "type": "A" },
        "response_code": "NOERROR",
        "type": "answer"
    },
    "event": {
        "category": ["network"],
        "dataset": "network_traffic.dns",
        "kind": "event"
    },
    "network": { "protocol": "dns", "transport": "udp" }
}`,
      },
    ],
  };
