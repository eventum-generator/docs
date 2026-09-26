import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPowerdnsAuthoritative: GeneratorMeta = {
  slug: 'network-powerdns-authoritative',
  displayName: 'PowerDNS Authoritative Server',
  category: 'network',
  description:
    'PowerDNS Authoritative 5.0.1 classic UDP query lines with causal packet-cache state and recurring concentrated query episodes.',
  dataSource: 'PowerDNS Authoritative 5.0.1 classic stderr query log',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    '7/7 selected native query-line components',
    'Bounded 20-second packet-cache model',
    'All six query types occur in background',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every two hours, one client sends SOA, NS and TXT zone queries followed by twelve distinct health-style A names. Later episodes use fresh names; the client, types and name style also occur in background.',
  generatorId: 'powerdns-authoritative',
  eventTypes: [
    {
      id: 'A',
      description: 'Address lookup',
      frequency: '68% routine selection weight',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 address lookup',
      frequency: '14% routine selection weight',
      category: 'network',
    },
    {
      id: 'SOA',
      description: 'Zone metadata lookup',
      frequency: '7% routine selection weight',
      category: 'network',
    },
    {
      id: 'NS',
      description: 'Name-server lookup',
      frequency: '4% routine selection weight',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail exchanger lookup',
      frequency: '4% routine selection weight',
      category: 'network',
    },
    {
      id: 'TXT',
      description: 'Text-record lookup',
      frequency: '3% routine selection weight',
      category: 'network',
    },
  ],
  realismFeatures: [
    'The selected vendor 5.0.1 example uses timestamped classic stderr output without a syslog host/process wrapper.',
    'A bounded 128-key cache emits HIT only for a live identical question; fresh or expired questions emit MISS.',
    'Host name is configured ECS context; cache MISS implies neither a response code nor successful resolution.',
    'The selected seven-field profile is source-supported; live 5.0.1 output, collection and parser behavior remain untested.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable periodic correlated query episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description: 'Hours between episode starts; use a positive value',
    },
    {
      name: 'host_name',
      defaultValue: 'ns01.corp.example',
      description:
        'Configured server identity in the ECS wrapper, not in the selected native line',
    },
    {
      name: 'zone_name',
      defaultValue: 'corp.example',
      description: 'Synthetic authoritative zone',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description:
        'Client participating in periodic bursts and ordinary background',
    },
  ],
  sampleOutputs: [
    {
      title: 'PowerDNS Authoritative Server event from finite generator output',
      json: String.raw`{
    "@timestamp": "2026-09-25T02:00:04+00:00",
    "dns": {
        "question": {
            "name": "health-07202-88c07cd8.corp.example",
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
        "original": "Sep 25 02:00:04 Remote 192.0.2.91 wants 'health-07202-88c07cd8.corp.example|A', do = 0, bufsize = 512: packetcache MISS",
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
