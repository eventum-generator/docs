/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkZeek: GeneratorMeta = {
  slug: 'network-zeek',
  displayName: 'Zeek Network Telemetry',
  category: 'network',
  dataSource: 'Zeek conn, dns, http and ssl JSON logs',
  description:
    'Linked Zeek connection, DNS, HTTP and TLS records with the same UID and network tuple. Switch between ordinary traffic and a correlated DNS-to-TLS-to-upload anomaly.',
  generatorId: 'zeek',
  eventCount: 4,
  templateCount: 2,
  highlights: [
    'Linked connection and protocol records',
    'Native Zeek JSON in event.original',
    'Switchable eight-flow anomaly chain',
  ],
  anomalyChain:
    'One client resolves a domain, repeatedly connects over TLS, then sends a large HTTP POST to the same destination.',
  eventTypes: [
    {
      id: 'conn.log',
      description: 'Connection lifecycle record',
      frequency: '50.0%',
      category: 'network',
    },
    {
      id: 'dns.log',
      description: 'DNS query and response',
      frequency: '27.0%',
      category: 'network',
    },
    {
      id: 'ssl.log',
      description: 'TLS handshake and certificate metadata',
      frequency: '18.3%',
      category: 'network',
    },
    {
      id: 'http.log',
      description: 'HTTP transaction',
      frequency: '4.7%',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Each connection and protocol record share a Zeek UID, timestamp and 4-tuple.',
    'Background protocol selection is weighted 55% DNS, 35% TLS and 10% HTTP.',
    'The anomaly links DNS resolution, repeated TLS contacts and a large upload without a special anomaly label.',
  ],
  format: ['JSON', 'ECS'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the correlated anomaly chain alongside routine events; false emits only background',
    },
    {
      name: 'sensor_name',
      defaultValue: 'zeek-sensor-01',
      description: 'Zeek sensor and collector name',
    },
    {
      name: 'sensor_id',
      defaultValue: '8aaedfb4-c8a3-4dd8-853f-5c270abfd47a',
      description: 'Stable collector ID',
    },
    {
      name: 'sensor_ephemeral_id',
      defaultValue: 'd2c2e56b-4915-4dc4-8ad9-6112f1d26e43',
      description: 'Collector process ID',
    },
    {
      name: 'sensor_version',
      defaultValue: '8.7.1',
      description: 'Collector version in ECS metadata',
    },
    {
      name: 'dns_server_ip',
      defaultValue: '10.20.0.53',
      description: 'Internal DNS server',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.77',
      description: 'Fixed destination for the anomaly',
    },
    {
      name: 'suspicious_name',
      defaultValue: 'sync-gw.example.net',
      description: 'DNS query and TLS SNI in the anomaly',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '10.20.8.44',
      description: 'Client shared by anomaly events',
    },
    {
      name: 'internal_domain',
      defaultValue: 'corp.example',
      description: 'Domain for background internal DNS queries',
    },
  ],
  sampleOutputs: [
    {
      title: 'Zeek connection event',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:23:57+00:00",
  "agent": {
    "ephemeral_id": "d2c2e56b-4915-4dc4-8ad9-6112f1d26e43",
    "id": "8aaedfb4-c8a3-4dd8-853f-5c270abfd47a",
    "name": "zeek-sensor-01",
    "type": "filebeat",
    "version": "8.7.1"
  },
  "data_stream": {
    "dataset": "zeek.connection",
    "namespace": "default",
    "type": "logs"
  },
  "destination": {
    "address": "10.20.0.53",
    "bytes": 4987,
    "ip": "10.20.0.53",
    "packets": 7,
    "port": 53
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "8aaedfb4-c8a3-4dd8-853f-5c270abfd47a",
    "snapshot": false,
    "version": "8.7.1"
  },
  "event": {
    "agent_id_status": "verified",
    "category": [
      "network"
    ],
    "created": "2026-09-25T10:23:57+00:00",
    "dataset": "zeek.connection",
    "duration": 763983000,
    "id": "CteAviHzx48613103",
    "ingested": "2026-09-25T10:23:57+00:00",
    "kind": "event",
    "original": "{\"conn_state\": \"SF\", \"duration\": 0.763983, \"history\": \"Dd\", \"id.orig_h\": \"10.20.8.44\", \"id.orig_p\": 57037, \"id.resp_h\": \"10.20.0.53\", \"id.resp_p\": 53, \"local_orig\": true, \"local_resp\": true, \"missed_bytes\": 0, \"orig_bytes\": 349, \"orig_ip_bytes\": 573, \"orig_pkts\": 8, \"proto\": \"udp\", \"resp_bytes\": 4791, \"resp_ip_bytes\": 4987, \"resp_pkts\": 7, \"service\": \"dns\", \"ts\": 1790331837.0, \"tunnel_parents\": [], \"uid\": \"CteAviHzx48613103\"}",
    "type": [
      "connection",
      "start",
      "end"
    ]
  },
  "host": {
    "name": "zeek-sensor-01"
  },
  "input": {
    "type": "filestream"
  },
  "log": {
    "file": {
      "path": "/opt/zeek/logs/current/conn.log"
    }
  },
  "network": {
    "bytes": 5560,
    "direction": "internal",
    "packets": 15,
    "protocol": "dns",
    "transport": "udp"
  },
  "related": {
    "ip": [
      "10.20.8.44",
      "10.20.0.53"
    ]
  },
  "source": {
    "address": "10.20.8.44",
    "bytes": 573,
    "ip": "10.20.8.44",
    "packets": 8,
    "port": 57037
  },
  "tags": [
    "zeek-connection"
  ],
  "zeek": {
    "connection": {
      "history": "Dd",
      "local_orig": true,
      "local_resp": true,
      "missed_bytes": 0,
      "state": "SF",
      "state_message": "Normal establishment and termination."
    },
    "session_id": "CteAviHzx48613103"
  }
}`,
    },
  ],
};
