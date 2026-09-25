/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkUnbound: GeneratorMeta = {
  slug: 'network-unbound',
  displayName: 'Unbound DNS logs',
  category: 'network',
  dataSource: 'Unbound tagged query and reply syslog',
  description:
    'Resolver query/reply pairs with a switchable long-label TXT burst from one client.',
  generatorId: 'unbound',
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Tagged query: and reply: source lines',
    'Reply code, latency, cache flag and response size',
    'Paired client/question fields',
  ],
  anomalyChain:
    'One client resolves a beacon domain, then issues eight unique long-label TXT questions under the same suffix.',
  eventTypes: [
    {
      id: 'query',
      description: 'DNS question',
      frequency: 'One per lookup',
      category: 'network',
    },
    {
      id: 'reply',
      description: 'DNS response metadata',
      frequency: 'One per lookup',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Question and reply reuse client IP, name and type.',
    'Reply logs contain metadata but no answer RDATA.',
    'Query/reply tags require log-tag-queryreply enabled.',
  ],
  format: ['JSON', 'ECS', 'syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include long-label TXT sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'dns01.corp.example',
      description: 'Resolver hostname',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '10.20.30.91',
      description: 'Client IP in the chain',
    },
    {
      name: 'tunnel_domain',
      defaultValue: 'sync-updates.example',
      description: 'Queried suffix in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Unbound DNS logs event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:21:13+00:00",
  "dns": {
    "question": {
      "class": "IN",
      "name": "01fe1171b135e76812f858197c.sync-updates.example.",
      "type": "TXT"
    },
    "response_code": "NXDOMAIN",
    "type": "answer"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "dns-reply",
    "category": [
      "network"
    ],
    "kind": "event",
    "original": "Sep 25 12:21:13 dns01.corp.example unbound[2137:0]: reply: 10.20.30.91 01fe1171b135e76812f858197c.sync-updates.example. TXT IN NXDOMAIN 0.041357 0 97",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "dns01.corp.example"
  },
  "process": {
    "name": "unbound",
    "pid": 2137
  },
  "related": {
    "ip": [
      "10.20.30.91"
    ]
  },
  "source": {
    "ip": "10.20.30.91"
  },
  "unbound": {
    "reply": {
      "from_cache": 0,
      "response_size": 97,
      "time_to_resolve": 0.041357
    },
    "worker_id": 0
  }
}`,
    },
  ],
};
