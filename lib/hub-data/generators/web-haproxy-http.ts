/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webHaproxyHttp: GeneratorMeta = {
  slug: 'web-haproxy-http',
  displayName: 'HAProxy HTTP Access Syslog',
  category: 'web-access',
  description:
    'HAProxy 3.2 option httplog transactions from one proxy, with the native syslog line in event.original and its values mapped to ECS. One completed request per second from 50 office workstations and a remote-access address: catalog pages, orders, cache revalidation, login sessions with occasional denied retries, no-server 503s and a large admin export. Recurring episodes show one client with four denied logins, a login redirect and the admin export within 300 seconds.',
  dataSource:
    'HAProxy 3.2 option httplog HTTP access log with a BSD-style syslog prefix',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 7,
  templateCount: 1,
  generatorId: 'web-haproxy-http',
  highlights: [
    'Native HAProxy 3.2 httplog line in event.original',
    '59 of 61 selected Elastic reference field paths',
    'Four denied logins, a redirect and an admin export about every 2 hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 2 hours by default, the anomaly_ip client runs one login session: four POST /login requests answered with 401, with ordinary retry pauses, then a POST /login 302 and, one second later, a GET of anomaly_path with a 200 and 843,220 bytes, followed by zero to three ordinary requests. The first denial and the export are typically about 30 s apart (20-70 s) and always within 300 s. The first episode starts at a uniform time within the first min(anomaly_interval_hours, 24 h) of the log, with no preferred hour; each next one is due one interval after the actual start of the previous one and starts at a uniform time within a window of min(interval / 4, 6 h) centred on that due time, so starts are 2 h ± 15 min apart by default (about 12 a day), do not drift, and missed intervals are never caught up. An episode can start a few seconds after its drawn time while logins of other clients are in progress. Every step and partial sequence also occurs in ordinary traffic; only the complete sequence from one client within 300 seconds of the first denial is episode-only.',
  eventTypes: [
    {
      id: 'GET /catalog/item/* 200',
      description: 'Catalog response',
      frequency: '66.4% background share',
      category: 'web',
    },
    {
      id: 'POST /login 302',
      description: 'Login redirect',
      frequency: '9.2% background share',
      category: 'web',
    },
    {
      id: 'POST /api/orders/* 201',
      description: 'Order creation',
      frequency: '9.0% background share',
      category: 'web',
    },
    {
      id: 'GET /static/bundle-*.js 304',
      description: 'Cache validation response',
      frequency: '9.0% background share',
      category: 'web',
    },
    {
      id: 'GET /admin/export 200',
      description: 'Large admin export (843,220 bytes)',
      frequency: '4.1% background share',
      category: 'web',
    },
    {
      id: 'GET /api/report 503',
      description: 'No backend server available',
      frequency: '1.8% background share',
      category: 'web',
    },
    {
      id: 'POST /login 401',
      description: 'Denied login',
      frequency: '0.4% background share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'One HAProxy instance logs one completed request per second around the clock (86,400 a day) with no hour-of-day or weekday curve. Clients are 50 office workstations and a remote-access address that carries as much traffic as one workstation. Most records are independent requests of a random client.',
    'About 8,000 logins a day, most a single POST /login 302. In about 2% of sessions the user is first denied one to seven times and retries after 2-45 s (about 7 s in the median); 75% of these sessions end with a 302, the rest give up. The remote-access address is denied five times as often, about a fifth of its login requests. After a 302 the redirect target follows one second later (the admin export in about a quarter of logins, otherwise a catalog page), then zero to three further requests of the same client at pauses of 3-180 s.',
    'The share of sessions with denied logins and the share of logins that land on the export each vary independently from day to day between about half and twice their usual level. About 5% of login requests are denied overall (2-8% on individual days); a workstation typically has 3-11 denied logins a day.',
    "Native %TR/%Tw/%Tc/%Tr/%Ta timers, status, bytes including response headers (also for 302 and 304), termination flags and connection counters agree with their ECS fields, and event.duration derives from %Ta. The <NOSRV> 503 uses the timer and SC-- combination of Elastic's raw HAProxy fixture. Each request uses its own TCP client port.",
    'Each record completes on a whole second. Native %tr and @timestamp are the first request byte (completion minus %Ta); the BSD-style header is the completion time and event.ingested assumes zero collector delay, all in UTC. Requests a browser sends milliseconds apart, such as the redirect target after a 302, are one second apart.',
    'With anomaly_mode true, counts of partial sequences of the chain are about one per episode higher than in ordinary traffic, and most such sequences of the anomaly_ip client are episodes. Ordinary complete sequences occur between 300 and 600 seconds, so a longer detection window also finds them. HAProxy logs no user identity or session cookie in this format, so a 302 does not prove the password was accepted, and IP correlation is weaker behind shared NAT, as for the remote-access address.',
    '59 of 61 selected Elastic reference field paths are produced, excluding 18 environment and GeoIP/ASN enrichment paths; the missing two are optional captured request and response headers. The retained-file prefix omits syslog PRI and is not a complete wire message; Filebeat, host and data-stream metadata are simulated collector context. Header and cookie captures, queueing, retries, reused connections, TLS suffixes, HTTP/2, logasap, geo enrichment and log rotation are outside the profile. Clients, paths, status mix, latency ranges, login failure rates and session behaviour are synthetic assumptions.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'lb-web-01',
      description: 'Name of the simulated HAProxy source; ASCII token',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.60.0.5',
      description: 'IP address of the simulated HAProxy source',
    },
    {
      name: 'frontend_name',
      defaultValue: 'https-in',
      description: 'HAProxy frontend name; ASCII token',
    },
    {
      name: 'backend_name',
      defaultValue: 'app_pool',
      description: 'HAProxy backend name; ASCII token',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description:
        'Valid IPv4 of the episode client, the remote-access address; also occurs in ordinary traffic',
    },
    {
      name: 'anomaly_path',
      defaultValue: '/admin/export',
      description:
        'Unescaped absolute export path of the episode, also requested in ordinary traffic; Unicode, spaces and quotes are percent-encoded',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Mean time between episode starts (each start within ± min(interval / 8, 3 h) of its due time); values below 0.5 are treated as 0.5 hours',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the recurring episodes; false emits only ordinary traffic',
    },
  ],
  sampleOutputs: [
    {
      title: 'Admin export of the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T00:00:46.245000+00:00",
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
    "duration": 755000000,
    "ingested": "2026-09-01T00:00:47+00:00",
    "kind": "event",
    "original": "Sep  1 00:00:47 lb-web-01 haproxy[2431]: 10.99.3.51:52650 [01/Sep/2026:00:00:46.245] https-in app_pool/app1 0/0/0/168/755 200 843220 - - ---- 5/5/0/0/0 0/0 \"GET /admin/export HTTP/1.1\"",
    "outcome": "success",
    "timezone": "+00:00"
  },
  "haproxy": {
    "backend_name": "app_pool",
    "backend_queue": 0,
    "bytes_read": 843220,
    "connection_wait_time_ms": 0,
    "connections": {
      "active": 5,
      "backend": 0,
      "frontend": 5,
      "retries": 0,
      "server": 0
    },
    "frontend_name": "https-in",
    "http": {
      "request": {
        "captured_cookie": "-",
        "raw_request_line": "GET /admin/export HTTP/1.1",
        "time_wait_ms": 0,
        "time_wait_without_data_ms": 168
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
    "offset": 8558
  },
  "message": "10.99.3.51:52650 [01/Sep/2026:00:00:46.245] https-in app_pool/app1 0/0/0/168/755 200 843220 - - ---- 5/5/0/0/0 0/0 \"GET /admin/export HTTP/1.1\"",
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
    "port": 52650
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
