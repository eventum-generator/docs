/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkBind9Query: GeneratorMeta = {
  slug: 'network-bind9-query',
  displayName: 'BIND 9 native query log',
  category: 'network',
  description:
    'Native BIND query records with ordinary lookups and a correlated long-label TXT sequence.',
  dataSource: 'BIND 9 named queries log channel',
  format: ['JSON', 'ECS', 'BIND query log'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native client object, query flags, and destination address',
    'A, AAAA, MX, and TXT question types',
    'Timestamp-correlated long-label TXT sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client sends a start query, four long hexadecimal TXT labels, and a completion query under one suffix.',
  generatorId: 'bind',
  eventTypes: [
    {
      id: 'A',
      description: 'IPv4 address query',
      frequency: '70% baseline; chain markers',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'IPv6 address query',
      frequency: '20% baseline',
      category: 'network',
    },
    {
      id: 'MX',
      description: 'Mail exchanger query',
      frequency: '10% baseline',
      category: 'network',
    },
    {
      id: 'TXT',
      description: 'Long-label text query',
      frequency: 'Chain only',
      category: 'network',
    },
  ],
  realismFeatures: [
    'BIND client object and client port in each raw line',
    'Documented query name, class, type, flags, and destination',
    'No inferred response or DNS answer data',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the TXT-query sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'ns1.example.test',
      description: 'BIND server name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.30.53',
      description: 'Destination address in the log',
    },
    {
      name: 'tunnel_domain',
      defaultValue: 'telemetry.example.test',
      description: 'Sequence query suffix',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.66',
      description: 'Sequence client IP',
    },
  ],
  sampleOutputs: [
    {
      title: 'Long-label TXT query',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:27:38+00:00",
  "bind9": {
    "query": {
      "client_object": "@0xf4dd11c1",
      "flags": "-"
    }
  },
  "destination": {
    "ip": "10.20.30.53",
    "port": 53
  },
  "dns": {
    "question": {
      "class": "IN",
      "name": "b74b9e2822e893f248295b2a582232d35dcdec8980c07488.036a4d7d.telemetry.example.test",
      "type": "TXT"
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
    "original": "2026-09-25T13:27:38.000 client @0xf4dd11c1 192.0.2.66#17882 (b74b9e2822e893f248295b2a582232d35dcdec8980c07488.036a4d7d.telemetry.example.test): query: b74b9e2822e893f248295b2a582232d35dcdec8980c07488.036a4d7d.telemetry.example.test IN TXT - (10.20.30.53)",
    "type": [
      "protocol"
    ]
  },
  "host": {
    "name": "ns1.example.test"
  },
  "network": {
    "protocol": "dns",
    "transport": "udp"
  },
  "related": {
    "ip": [
      "192.0.2.66",
      "10.20.30.53"
    ]
  },
  "source": {
    "ip": "192.0.2.66",
    "port": 17882
  }
}`,
    },
  ],
};
