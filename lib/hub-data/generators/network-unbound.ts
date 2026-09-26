/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkUnbound: GeneratorMeta = {
  slug: 'network-unbound',
  displayName: 'Unbound DNS logs',
  category: 'network',
  description:
    'Unbound 1.26.1 logfile query/reply pairs with causal cache and timing state and recurring unique-label TXT episodes.',
  dataSource: 'Unbound 1.26.1 tagged query/reply logfile',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    '9/9 query and 13/13 reply fields in selected profile',
    'One question/reply pair per second',
    'Same client and TXT suffix occur in background',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 900 seconds, one client sends an A question followed by eight unique 32-hex TXT names under one suffix. Each episode has a fresh nonce; long TXT names and the same client also occur in ordinary traffic.',
  generatorId: 'unbound',
  eventTypes: [
    {
      id: 'query',
      description: 'DNS question received by one worker',
      frequency: 'One per lookup',
      category: 'network',
    },
    {
      id: 'reply',
      description:
        'Resolver result, resolution time, cache flag and response size',
      frequency: 'One per lookup',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Own logfile framing uses ISO millisecond timestamps and no host syslog wrapper; query/reply logging is explicitly enabled.',
    'Query and reply share worker, client and question; replies follow by a modeled 0.2–92.8 ms.',
    'A bounded TTL cache drives the native cache flag and zero cached resolution duration.',
    'Exact production 1.26.1 logfile bytes remain unverified; response sizes are synthetic zone fixtures, not measured packet sizes.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit recurring anomaly episodes',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '900',
      description: 'Seconds between episode starts; use at least 60',
    },
    {
      name: 'host_name',
      defaultValue: 'dns01.corp.example',
      description: 'Resolver hostname in ECS enrichment',
    },
    {
      name: 'process_id',
      defaultValue: '2137',
      description: 'Unbound process ID in native logfile lines',
    },
    {
      name: 'worker_count',
      defaultValue: '4',
      description: 'Number of resolver workers; use at least 1',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '10.20.30.91',
      description: 'Client in ordinary traffic and episodes',
    },
    {
      name: 'tunnel_domain',
      defaultValue: 'sync-updates.corp.example',
      description: 'Synthetic DNS suffix, without final dot',
    },
  ],
  sampleOutputs: [
    {
      title: 'Unbound DNS logs event from finite generator output',
      json: String.raw`{"@timestamp": "2026-09-27T00:15:01.026914+00:00", "dns": {"question": {"class": "IN", "name": "37b3ec48645c835d0c1fb0258b4c13c5.sync-updates.corp.example.", "type": "TXT"}, "response_code": "NXDOMAIN", "type": "answer"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-reply", "category": ["network"], "kind": "event", "original": "2026-09-27T00:15:01.026+00:00 unbound[2137:3] reply: 10.20.30.91 37b3ec48645c835d0c1fb0258b4c13c5.sync-updates.corp.example. TXT IN NXDOMAIN 0.026661 0 177", "type": ["end"]}, "host": {"name": "dns01.corp.example"}, "process": {"name": "unbound", "pid": 2137}, "related": {"ip": ["10.20.30.91"]}, "source": {"ip": "10.20.30.91"}, "unbound": {"reply": {"from_cache": 0, "response_size": 177, "time_to_resolve": 0.026661}, "worker_id": 3}}`,
    },
  ],
};
