/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkZeek: GeneratorMeta = {
  slug: 'network-zeek',
  displayName: 'Zeek Network Telemetry',
  category: 'network',
  description:
    'Selected Zeek 8.0 IPv4 telemetry with linked protocol and connection records. Daily DNS, repeated TLS connections and upload sequences share ordinary clients and destinations.',
  format: ['JSON', 'ECS'],
  dataSource: 'Selected Zeek 8.0.0 JSON conn/dns/http/ssl logs',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Four linked native streams',
    'DNS, HTTP and passive TLS state',
    'Daily timed callbacks and POST',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, one ordinary client resolves a fresh hostname, makes five TLS connections at two-minute intervals, refreshes DNS at minute 12 and completes a large POST at minute 14. All single-event features also occur in background.',
  generatorId: 'zeek',
  eventTypes: [
    {
      id: 'conn.log',
      description: 'Completed TCP/UDP flows, SF state and byte/packet totals',
      frequency: 'Approximately 50%',
      category: 'network',
    },
    {
      id: 'dns.log',
      description: 'Recursive A answer or NXDOMAIN',
      frequency: 'Approximately 22.5%',
      category: 'network',
    },
    {
      id: 'ssl.log',
      description: 'Passive TLS 1.3 visible SNI and establishment inference',
      frequency: 'Approximately 20%',
      category: 'network',
    },
    {
      id: 'http.log',
      description: 'Cleartext GET/POST and200/304/404 responses',
      frequency: 'Approximately 7.5%',
      category: 'network, web',
    },
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Background plus recurring episode; false is background only',
    },
    {
      name: 'sensor_name',
      defaultValue: 'zeek-sensor-01',
      description: 'Sensor and synthetic collector name',
    },
    {
      name: 'sensor_id',
      defaultValue: '8aaedfb4-c8a3-4dd8-853f-5c270abfd47a',
      description: 'Synthetic collector inventory ID',
    },
    {
      name: 'sensor_ephemeral_id',
      defaultValue: 'd2c2e56b-4915-4dc4-8ad9-6112f1d26e43',
      description: 'Synthetic collector process ID',
    },
    {
      name: 'sensor_version',
      defaultValue: '8.7.1',
      description: 'Synthetic Filebeat inventory version, not the Zeek version',
    },
    {
      name: 'dns_server_ip',
      defaultValue: '10.20.0.53',
      description: 'Observed recursive DNS resolver IPv4 address',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.77',
      description: 'Shared ordinary/episode destination IPv4 address',
    },
    {
      name: 'suspicious_name',
      defaultValue: 'sync-gw.example.net',
      description: 'Parent of generated ordinary/episode names',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '10.20.8.44',
      description: 'Shared ordinary/episode client',
    },
    {
      name: 'internal_domain',
      defaultValue: 'corp.example',
      description: 'Internal positive and negative DNS zone',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval, six-hour minimum',
    },
    {
      name: 'client_ips',
      defaultValue: '[10.20.8.12, 10.20.8.25, 10.20.9.31, 10.20.9.52]',
      description:
        'Other ordinary clients, deduplicated with the episode client',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ordinary POST from a shared client',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:33:10.027235+00:00",
  "agent": {
    "ephemeral_id": "d2c2e56b-4915-4dc4-8ad9-6112f1d26e43",
    "id": "8aaedfb4-c8a3-4dd8-853f-5c270abfd47a",
    "name": "zeek-sensor-01",
    "type": "filebeat",
    "version": "8.7.1"
  },
  "data_stream": {
    "dataset": "zeek.http",
    "namespace": "default",
    "type": "logs"
  },
  "destination": {
    "address": "203.0.113.25",
    "ip": "203.0.113.25",
    "port": 80
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "POST",
    "category": [
      "network",
      "web"
    ],
    "created": "2026-09-26T00:33:20.000000+00:00",
    "dataset": "zeek.http",
    "id": "CvlehC0000000000c8",
    "ingested": "2026-09-26T00:33:20.000000+00:00",
    "kind": "event",
    "module": "zeek",
    "original": "{\"ts\":1790382790.027235,\"uid\":\"CvlehC0000000000c8\",\"id.orig_h\":\"10.20.8.44\",\"id.orig_p\":32968,\"id.resp_h\":\"203.0.113.25\",\"id.resp_p\":80,\"trans_depth\":1,\"method\":\"POST\",\"host\":\"portal.example.net\",\"uri\":\"/upload\",\"version\":\"1.1\",\"user_agent\":\"curl/8.5.0\",\"request_body_len\":441599,\"response_body_len\":127,\"status_code\":200,\"status_msg\":\"OK\",\"tags\":[],\"orig_fuids\":[\"FOCAYr0000000000c8\"],\"orig_mime_types\":[\"application/octet-stream\"],\"resp_fuids\":[\"FRFpsT0000000000c8\"],\"resp_mime_types\":[\"application/json\"]}",
    "outcome": "success",
    "type": [
      "connection",
      "protocol",
      "info"
    ]
  },
  "host": {
    "name": "zeek-sensor-01"
  },
  "http": {
    "request": {
      "body": {
        "bytes": 441599
      },
      "method": "POST"
    },
    "response": {
      "body": {
        "bytes": 127
      },
      "status_code": 200
    },
    "version": "1.1"
  },
  "input": {
    "type": "filestream"
  },
  "log": {
    "file": {
      "path": "/opt/zeek/logs/current/http.log"
    }
  },
  "message": "{\"ts\":1790382790.027235,\"uid\":\"CvlehC0000000000c8\",\"id.orig_h\":\"10.20.8.44\",\"id.orig_p\":32968,\"id.resp_h\":\"203.0.113.25\",\"id.resp_p\":80,\"trans_depth\":1,\"method\":\"POST\",\"host\":\"portal.example.net\",\"uri\":\"/upload\",\"version\":\"1.1\",\"user_agent\":\"curl/8.5.0\",\"request_body_len\":441599,\"response_body_len\":127,\"status_code\":200,\"status_msg\":\"OK\",\"tags\":[],\"orig_fuids\":[\"FOCAYr0000000000c8\"],\"orig_mime_types\":[\"application/octet-stream\"],\"resp_fuids\":[\"FRFpsT0000000000c8\"],\"resp_mime_types\":[\"application/json\"]}",
  "network": {
    "protocol": "http",
    "transport": "tcp"
  },
  "observer": {
    "name": "zeek-sensor-01",
    "product": "Zeek",
    "type": "ids",
    "version": "8.0.0"
  },
  "related": {
    "ip": [
      "10.20.8.44",
      "203.0.113.25"
    ]
  },
  "source": {
    "address": "10.20.8.44",
    "ip": "10.20.8.44",
    "port": 32968
  },
  "tags": [
    "zeek-http"
  ],
  "url": {
    "domain": "portal.example.net",
    "original": "/upload",
    "path": "/upload"
  },
  "user_agent": {
    "name": "curl",
    "original": "curl/8.5.0",
    "version": "8.5.0"
  },
  "zeek": {
    "http": {
      "host": "portal.example.net",
      "method": "POST",
      "orig_fuids": [
        "FOCAYr0000000000c8"
      ],
      "orig_mime_types": [
        "application/octet-stream"
      ],
      "request_body_len": 441599,
      "resp_fuids": [
        "FRFpsT0000000000c8"
      ],
      "resp_mime_types": [
        "application/json"
      ],
      "response_body_len": 127,
      "status_code": 200,
      "status_msg": "OK",
      "tags": [],
      "trans_depth": 1,
      "uri": "/upload",
      "user_agent": "curl/8.5.0",
      "version": "1.1"
    },
    "session_id": "CvlehC0000000000c8"
  }
}`,
    },
  ],
  realismFeatures: [
    'One fresh flow every ten seconds, up to two ready records per collector poll. Protocol completion precedes its own connection summary; collector order differs from native start-time order.',
    'DNS cache/TTL and source timeout state joins flows. TCP/UDP payload, headers and packet totals follow explicit synthetic segmentation and ACK assumptions.',
    'HTTP conditional304 has no body; connection payload counters include headers and bodies, while HTTP body lengths exclude headers. TLS 1.3 exposes Hello/SNI and opaque traffic, not certificates, ALPN or decoded Finished.',
    'All clients and ordinary hostname/destination/POST signatures appear in both modes. Episodes repeat after the configured 24-hour interval, with five callbacks, a DNS refresh and final upload.',
    'Selected schemas are documented/tagged. Some maintained sample fields are unavailable or intentionally omitted; complete version-matched native capture, exact serializer and live parser parity remain unverified.',
  ],
};
