/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webHaproxyHttp: GeneratorMeta = {
  slug: 'web-haproxy-http',
  displayName: 'HAProxy HTTP Access',
  category: 'web-access',
  description:
    'HAProxy 3.2 option httplog syslog and ECS fields with a switchable six-request sequence.',
  dataSource: 'HAProxy 3.2 option httplog HTTP access syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'web-haproxy-http',
  highlights: [
    '59/61 selected Elastic reference fields',
    'Native HAProxy 3.2 HTTP log line in event.original',
    'One switchable six-request sequence amid overlapping background',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 250 routine transactions, one IP makes four POST /login requests with 401 responses, receives a 302 redirect, then requests a large /admin/export response. The six-event sequence runs once.',
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
    'Native timer order, response byte counts, termination flags and connection counters match the chosen HAProxy 3.2 format.',
    'A 503 without a server uses the documented <NOSRV> and SC-- combination.',
    'Redirect, export path and anomaly IP also occur independently in background traffic.',
    'A 302 does not prove login success; no user or session identity is present and NAT weakens IP correlation.',
    'Optional captured header arrays are absent; Filebeat and data-stream metadata are simulated collector context.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'lb-web-01',
      description: 'HAProxy hostname',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.60.0.5',
      description: 'HAProxy address',
    },
    {
      name: 'frontend_name',
      defaultValue: 'https-in',
      description: 'Frontend name',
    },
    {
      name: 'backend_name',
      defaultValue: 'app_pool',
      description: 'Backend name',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'Correlated source also present in background',
    },
    {
      name: 'anomaly_path',
      defaultValue: '/admin/export',
      description: 'Export target also present in background',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '250',
      description: 'Routine transactions before the one-time chain',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the six-event sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Admin export after repeated login failures',
      json: String.raw`{
  "@timestamp": "2026-09-25T18:10:10+00:00",
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
    "duration": 757000000,
    "ingested": "2026-09-25T18:10:10+00:00",
    "kind": "event",
    "original": "Sep 25 18:10:10 lb-web-01 haproxy[2431]: 10.99.3.51:53758 [25/Sep/2026:18:10:10.000] https-in app_pool/app1 2/0/4/132/757 200 843220 - - ---- 5/5/3/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
    "outcome": "success",
    "timezone": "+00:00"
  },
  "haproxy": {
    "backend_name": "app_pool",
    "backend_queue": 0,
    "bytes_read": 843220,
    "connection_wait_time_ms": 4,
    "connections": {
      "active": 5,
      "backend": 3,
      "frontend": 5,
      "retries": 0,
      "server": 1
    },
    "frontend_name": "https-in",
    "http": {
      "request": {
        "captured_cookie": "-",
        "raw_request_line": "GET /admin/export HTTP/1.1",
        "time_wait_ms": 2,
        "time_wait_without_data_ms": 132
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
    "offset": 46534
  },
  "message": "10.99.3.51:53758 [25/Sep/2026:18:10:10.000] https-in app_pool/app1 2/0/4/132/757 200 843220 - - ---- 5/5/3/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
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
    "port": 53758
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
