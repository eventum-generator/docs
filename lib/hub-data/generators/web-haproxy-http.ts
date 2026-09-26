/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webHaproxyHttp: GeneratorMeta = {
  slug: 'web-haproxy-http',
  displayName: 'HAProxy HTTP Access',
  category: 'web-access',
  description:
    'HAProxy 3.2 option httplog transactions with consistent request/completion timing and recurring six-request bursts amid overlapping background traffic.',
  dataSource: 'HAProxy 3.2 option httplog HTTP access syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'web-haproxy-http',
  highlights: [
    '59/61 selected Elastic reference field paths',
    'Native request time plus active duration equals completion',
    'Six-request episodes recur every two hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every two hours, one IP sends four POST /login requests receiving 401 responses, then a POST /login 302 redirect and a large GET /admin/export 200 response. Six distinct TCP client ports and causal request/completion times describe separate connections over five seconds. The actor, redirect and export also occur independently in background; no user or session identity is available.',
  eventTypes: [
    {
      id: 'GET 200',
      description: 'Catalog response',
      frequency: '66% routine',
      category: 'web',
    },
    {
      id: 'POST 201',
      description: 'Order API write',
      frequency: '10% routine',
      category: 'web',
    },
    {
      id: 'GET 304',
      description: 'Static cache validation',
      frequency: '10% routine',
      category: 'web',
    },
    {
      id: 'POST /login 401',
      description: 'Denied login request',
      frequency: '8% routine',
      category: 'authentication',
    },
    {
      id: 'GET 503',
      description: 'No backend server available',
      frequency: '2% routine',
      category: 'web',
    },
    {
      id: 'POST /login 302',
      description: 'Application redirect',
      frequency: '2% routine',
      category: 'authentication',
    },
    {
      id: 'GET /admin/export 200',
      description: 'Large admin response',
      frequency: '2% routine',
      category: 'web',
    },
  ],
  realismFeatures: [
    "HAProxy 3.2 native TR/Tw/Tc/Tr/Ta, bytes including response headers, termination and counters agree with their selected ECS values; the NOSRV 503 tuple matches Elastic's raw fixture.",
    'Cron ticks model completion. Native request time and ECS @timestamp equal completion minus Ta; the BSD header and synthetic zero-delay event.ingested use UTC completion, including non-UTC input.',
    'Six bounded episode ports are cleared after export, and each episode has a different first port from its predecessor. Native byte offsets increase without wrapping in one simulated file.',
    'The same actor, login responses, redirect and large export appear in background. A 302 does not prove login success, NAT weakens IP correlation and emitted bytes do not prove client receipt or exfiltration.',
    '59/61 selected Elastic paths excludes 18 host/GeoIP/ASN enrichment paths; the missing two are optional captured headers. Collector metadata, workload shares and latency ranges are synthetic assumptions.',
    'The retained-file prefix omits PRI; full wire transport and a live parser are unverified. TLS, logasap, HTTP/2, keep-alive/session state, captures/cookies, retries, queueing and rotation are outside the profile.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'lb-web-01',
      description: 'Simulated HAProxy source',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.60.0.5',
      description: 'Simulated HAProxy source',
    },
    {
      name: 'frontend_name',
      defaultValue: 'https-in',
      description: 'HAProxy frontend and backend',
    },
    {
      name: 'backend_name',
      defaultValue: 'app_pool',
      description: 'HAProxy frontend and backend',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description:
        'Correlated IPv4 source and unescaped absolute path; both also occur in background',
    },
    {
      name: 'anomaly_path',
      defaultValue: '/admin/export',
      description:
        'Correlated IPv4 source and unescaped absolute path; both also occur in background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Time between episodes; values below `0.5` are clamped to `0.5` hours',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include periodic chains; `false` emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Admin export after repeated login failures',
      json: String.raw`{
  "@timestamp": "2026-09-25T02:00:05.441000+00:00",
  "agent": {
    "ephemeral_id": "bb220000-2222-4444-8888-123456789abc",
    "id": "aa110000-1111-4444-8888-123456789abc",
    "name": "lb-web-01",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "data_stream": {
    "dataset": "haproxy.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "aa110000-1111-4444-8888-123456789abc",
    "snapshot": false,
    "version": "8.17.0"
  },
  "event": {
    "agent_id_status": "verified",
    "category": [
      "web"
    ],
    "dataset": "haproxy.log",
    "duration": 559000000,
    "ingested": "2026-09-25T02:00:06+00:00",
    "kind": "event",
    "original": "Sep 25 02:00:06 lb-web-01 haproxy[2431]: 10.99.3.51:42190 [25/Sep/2026:02:00:05.441] https-in app_pool/app1 2/0/2/95/559 200 843220 - - ---- 5/4/4/2/0 0/0 \"GET /admin/export HTTP/1.1\"",
    "outcome": "success",
    "timezone": "+00:00"
  },
  "haproxy": {
    "backend_name": "app_pool",
    "backend_queue": 0,
    "bytes_read": 843220,
    "connection_wait_time_ms": 2,
    "connections": {
      "active": 5,
      "backend": 4,
      "frontend": 4,
      "retries": 0,
      "server": 2
    },
    "frontend_name": "https-in",
    "http": {
      "request": {
        "captured_cookie": "-",
        "raw_request_line": "GET /admin/export HTTP/1.1",
        "time_wait_ms": 2,
        "time_wait_without_data_ms": 95
      },
      "response": {
        "captured_cookie": "-"
      }
    },
    "server_name": "app1",
    "server_queue": 0,
    "termination_state": "----",
    "total_waiting_time_ms": 0
  },
  "host": {
    "ip": [
      "10.60.0.5"
    ],
    "name": "lb-web-01"
  },
  "http": {
    "request": {
      "method": "GET"
    },
    "response": {
      "bytes": 843220,
      "status_code": 200
    },
    "version": "1.1"
  },
  "input": {
    "type": "log"
  },
  "log": {
    "file": {
      "path": "/var/log/haproxy.log"
    },
    "offset": 1314925
  },
  "message": "10.99.3.51:42190 [25/Sep/2026:02:00:05.441] https-in app_pool/app1 2/0/2/95/559 200 843220 - - ---- 5/4/4/2/0 0/0 \"GET /admin/export HTTP/1.1\"",
  "process": {
    "name": "haproxy",
    "pid": 2431
  },
  "related": {
    "ip": [
      "10.99.3.51"
    ]
  },
  "source": {
    "address": "10.99.3.51",
    "ip": "10.99.3.51",
    "port": 42190
  },
  "tags": [
    "preserve_original_event",
    "haproxy-log"
  ],
  "url": {
    "original": "/admin/export",
    "path": "/admin/export"
  }
}`,
    },
  ],
};
