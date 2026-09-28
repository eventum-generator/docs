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
    'Six-request episodes recur about every two hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One IP sends four POST /login requests receiving 401 responses one second apart, then a POST /login 302 redirect and a large GET /admin/export 200 response; six distinct TCP client ports and causal request/completion times describe separate connections over five seconds. The first episode starts at a uniformly drawn time within the first min(anomaly_interval_hours, 24 h) of the run, with no preferred hour; each next one is due one interval after the previous actual start and starts at a uniform time within a window of min(interval / 4, 6 h) centred on that due time, so starts are 2 h ± 15 min apart by default, do not drift, and missed intervals are never caught up (measured 1.78-2.07 h over 24 hours). The actor, login responses, retry bursts, redirect and export also occur independently in background; only an ordinary export that would complete four 401 logins and a 302 from the same client within 300 seconds of the first 401 is replaced by another pool request from that client at the same completion time, with the timers, bytes and status of its own class. No user or session identity is available.',
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
      frequency: '8% routine weight, 8.3% measured with retries',
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
      frequency: '2% routine weight, 2.1% measured with retries',
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
    'Clients retry failed logins: 2% of ordinary 401 responses start a burst of one to six more 401 responses from the same client on the next ticks, and 70% of bursts end with a 302 redirect. The same actor, login responses, redirect and large export appear in background; seven background-only 24-hour captures held 312 sequences of four 401 logins and a 302 from one client within 300 seconds, with 0 same-client exports inside the window, 30 in the next 300 seconds, and level export shares and catalog timers for other records.',
    'A 302 does not prove login success, NAT weakens IP correlation, and emitted bytes do not prove client receipt or exfiltration.',
    '59/61 selected Elastic paths excludes 18 host/GeoIP/ASN enrichment paths; the missing two are optional captured headers. Collector metadata, workload shares and latency ranges are synthetic assumptions.',
    'The retained-file prefix omits PRI; full wire transport and a live parser are unverified. TLS, logasap, HTTP/2, keep-alive/session state, captures/cookies, HAProxy connection retries, queueing and rotation are outside the profile.',
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
        'Mean time between episode starts (each start within ± min(interval / 8, 3 h) of its due time); values below 0.5 are clamped to 0.5 hours',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include periodic chains; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Admin export ending the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T01:04:30.165000+00:00",
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
    "duration": 835000000,
    "ingested": "2026-09-01T01:04:31+00:00",
    "kind": "event",
    "original": "Sep  1 01:04:31 lb-web-01 haproxy[2431]: 10.99.3.51:52473 [01/Sep/2026:01:04:30.165] https-in app_pool/app1 2/0/2/146/835 200 843220 - - ---- 2/1/1/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
    "outcome": "success",
    "timezone": "+00:00"
  },
  "haproxy": {
    "backend_name": "app_pool",
    "backend_queue": 0,
    "bytes_read": 843220,
    "connection_wait_time_ms": 2,
    "connections": {
      "active": 2,
      "backend": 1,
      "frontend": 1,
      "retries": 0,
      "server": 1
    },
    "frontend_name": "https-in",
    "http": {
      "request": {
        "captured_cookie": "-",
        "raw_request_line": "GET /admin/export HTTP/1.1",
        "time_wait_ms": 2,
        "time_wait_without_data_ms": 146
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
    "offset": 706375
  },
  "message": "10.99.3.51:52473 [01/Sep/2026:01:04:30.165] https-in app_pool/app1 2/0/2/146/835 200 843220 - - ---- 2/1/1/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
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
    "port": 52473
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
