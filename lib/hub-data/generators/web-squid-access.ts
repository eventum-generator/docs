/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webSquidAccess: GeneratorMeta = {
  slug: 'web-squid-access',
  displayName: 'Squid Native Access Log',
  category: 'web-access',
  description:
    'Squid access.log in native 10-field form with denied-to-allowed resource access and background proxy traffic.',
  dataSource: 'Squid access.log',
  format: ['JSON', 'ECS', 'Access log'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'web-squid-access',
  highlights: [
    '43/43 source log fields',
    'Squid access.log',
    'Three denied requests for one user, IP and URL, then two large allowed fetches for that URL.',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three denied requests for one user, IP and URL, then two large allowed fetches for that URL.',
  eventTypes: [
    {
      id: 'TCP_MISS/200 GET',
      description: 'Origin fetch',
      frequency: '55% routine',
      category: 'web',
    },
    {
      id: 'TCP_HIT/200 GET',
      description: 'Cache hit',
      frequency: '25% routine',
      category: 'web',
    },
    {
      id: 'TCP_MISS/200 CONNECT',
      description: 'HTTPS tunnel request',
      frequency: '15% routine',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 GET',
      description: 'ACL denial',
      frequency: '5% routine',
      category: 'web',
    },
    {
      id: 'TCP_MISS/200 large GET',
      description: 'Allowed large response after denials',
      frequency: 'Anomaly only',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Native 10-field access.log line preserved in event.original.',
    'Fifty routine URL, user and client samples.',
    'Returned bytes do not imply upload or identify an ACL change.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'squid-01',
      description: 'Proxy hostname',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.70.0.5',
      description: 'Proxy address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'analyst',
      description: 'Chain username',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.70.4.17',
      description: 'Chain client IP',
    },
    {
      name: 'anomaly_url',
      defaultValue: 'http://files.corp.example/export.csv',
      description: 'Chain URL',
    },
    {
      name: 'anomaly_origin_ip',
      defaultValue: '10.70.8.14',
      description: 'Origin server',
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
      title: 'Allowed large fetch following denials',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:18:46+00:00",
  "agent": {
    "ephemeral_id": "5a110000-1111-4444-8888-123456789abc",
    "id": "5a110000-1111-4444-8888-123456789abc",
    "name": "squid-01",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "data_stream": {
    "dataset": "squid.log",
    "namespace": "default",
    "type": "logs"
  },
  "destination": {
    "address": "10.70.8.14",
    "bytes": 2320812,
    "ip": "10.70.8.14"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "5a110000-1111-4444-8888-123456789abc",
    "snapshot": false,
    "version": "8.17.0"
  },
  "event": {
    "agent_id_status": "verified",
    "category": [
      "web"
    ],
    "dataset": "squid.log",
    "duration": 3862000000,
    "ingested": "2026-09-25T12:18:46+00:00",
    "kind": "event",
    "module": "squid",
    "original": "1790338726.000 3862 10.70.4.17 TCP_MISS/200 2320812 GET http://files.corp.example/export.csv analyst DIRECT/10.70.8.14 text/csv",
    "outcome": "success",
    "type": [
      "access"
    ]
  },
  "http": {
    "request": {
      "method": "GET"
    },
    "response": {
      "bytes": 2320812,
      "status_code": 200
    }
  },
  "input": {
    "type": "filestream"
  },
  "log": {
    "file": {
      "path": "/var/log/squid/access.log"
    },
    "offset": 29855
  },
  "observer": {
    "hostname": "squid-01",
    "ip": "10.70.0.5",
    "product": "Squid",
    "type": "proxy",
    "vendor": "Squid"
  },
  "related": {
    "ip": [
      "10.70.4.17",
      "10.70.8.14"
    ],
    "user": [
      "analyst"
    ]
  },
  "source": {
    "address": "10.70.4.17",
    "ip": "10.70.4.17",
    "user": {
      "name": "analyst"
    }
  },
  "squid": {
    "peer_status": "DIRECT",
    "result_code": "TCP_MISS",
    "status_code": 200
  },
  "tags": [
    "preserve_original_event",
    "squid-log"
  ],
  "url": {
    "original": "http://files.corp.example/export.csv"
  }
}`,
    },
  ],
};
