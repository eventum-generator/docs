/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webHaproxyHttp: GeneratorMeta = {
  slug: 'web-haproxy-http',
  displayName: 'HAProxy HTTP Access',
  category: 'web-access',
  description:
    'HAProxy HTTP syslog and ECS fields with a switchable failed-login, redirect and large admin-response sequence.',
  dataSource: 'HAProxy HTTP access syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'web-haproxy-http',
  highlights: [
    '57/60 source log fields',
    'HAProxy HTTP access syslog',
    'Four login 401 responses from one IP, a 302 redirect, then a large /admin/export response.',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four login 401 responses from one IP, a 302 redirect, then a large /admin/export response.',
  eventTypes: [
    {
      id: 'GET 200',
      description: 'Catalog and page response',
      frequency: '70% routine',
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
      description: 'Static cache response',
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
      description: 'Unavailable backend',
      frequency: '2% routine',
      category: 'web',
    },
    {
      id: 'POST /login 302',
      description: 'Redirect after failures',
      frequency: 'Anomaly only',
      category: 'authentication',
    },
    {
      id: 'GET /admin/export 200',
      description: 'Large admin response',
      frequency: 'Anomaly only',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Native HAProxy HTTP line preserved in event.original.',
    'Fifty request samples cover ordinary status and backend variants.',
    'A redirect is observable, but authentication is not proven.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'lb-web-01',
      description: 'Proxy hostname',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.60.0.5',
      description: 'Proxy address',
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
      description: 'Chain source IP',
    },
    {
      name: 'anomaly_path',
      defaultValue: '/admin/export',
      description: 'Chain target path',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include anomaly chain; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Admin export after repeated login failures',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:18:45+00:00",
  "agent": {
    "ephemeral_id": "aa110000-1111-4444-8888-123456789abc",
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
    "duration": 19000000,
    "ingested": "2026-09-25T12:18:45+00:00",
    "kind": "event",
    "original": "Sep 25 12:18:45 lb-web-01 haproxy[2431]: 10.99.3.51:45399 [25/Sep/2026:12:18:45.000] https-in app_pool/app1 2/0/1/15/19 200 843220 - - ---- 1/1/1/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
    "outcome": "success",
    "timezone": "+00:00"
  },
  "haproxy": {
    "backend_name": "app_pool",
    "backend_queue": 0,
    "bytes_read": 843220,
    "connection_wait_time_ms": 1,
    "connections": {
      "active": 1,
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
        "time_wait_ms": 0,
        "time_wait_without_data_ms": 2
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
    "offset": 46653
  },
  "message": "10.99.3.51:45399 [25/Sep/2026:12:18:45.000] https-in app_pool/app1 2/0/1/15/19 200 843220 - - ---- 1/1/1/1/0 0/0 \"GET /admin/export HTTP/1.1\"",
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
    "port": 45399
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
