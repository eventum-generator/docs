/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webSquidAccess: GeneratorMeta = {
  slug: 'web-squid-access',
  displayName: 'Squid Native Access Log',
  category: 'web-access',
  description:
    'Squid 6.x built-in 10-field access.log with routine proxy traffic and one switchable denied-to-allowed sequence.',
  dataSource: 'Squid 6.x built-in squid access.log format',
  format: ['JSON', 'ECS', 'Access log'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'squid',
  highlights: [
    'Squid 6.x native 10-field line in event.original',
    '43/54 full Elastic reference paths (79.6%), below 90% target',
    'One switchable five-record sequence with ordinary value overlap',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 300 ordinary events, one user, IP and URL have three TCP_DENIED/403 records followed by two 1.8-2.8 MB TCP_MISS/200 responses within about 20 seconds. The sequence runs once.',
  eventTypes: [
    {
      id: 'TCP_MISS/200 GET',
      description: 'Fetch object from origin',
      frequency: '48% routine selection weight',
      category: 'web',
    },
    {
      id: 'TCP_HIT/200 GET',
      description: 'Serve cached object',
      frequency: '22% routine selection weight after prior miss',
      category: 'web',
    },
    {
      id: 'TCP_TUNNEL/200 CONNECT',
      description: 'HTTPS tunnel to host and port',
      frequency: '18% routine selection weight',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 GET',
      description: 'Authenticated request denied by ACL',
      frequency: 'Part of 7% routine denied weight',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/407 GET',
      description: 'Anonymous request denied by ACL',
      frequency: 'Part of 7% routine denied weight',
      category: 'web',
    },
    {
      id: 'TCP_IMS_HIT/304 GET',
      description: 'Conditional hit on cached object',
      frequency: '5% routine selection weight after prior miss',
      category: 'web',
    },
  ],
  realismFeatures: [
    'A bounded cache prevents HIT and IMS_HIT before the URL has an earlier MISS.',
    'Native byte count and ECS destination.bytes mean response delivered to the client, including headers; they do not measure upload or origin traffic.',
    'The user, IP, URL, origin, large response and individual result codes occur in background too.',
    'No policy-change event or exfiltration proof is present in access.log.',
    '43/43 selected portable Elastic paths are covered, but 11 GeoIP and collector filesystem paths are absent, leaving full coverage at 43/54.',
    'A complete Squid 6.9 native TCP_IMS_HIT/304 record is unavailable; the tag is documented but this exact v6.9 combination remains unverified.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'squid-01',
      description: 'Synthetic proxy and collector hostname',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.70.0.5',
      description: 'Synthetic proxy address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'analyst',
      description: 'User present in both modes',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.70.4.17',
      description: 'Client address present in both modes',
    },
    {
      name: 'anomaly_url',
      defaultValue: 'http://files.corp.example/export.csv',
      description: 'HTTP URL present in both modes',
    },
    {
      name: 'anomaly_origin_ip',
      defaultValue: '10.70.8.14',
      description: 'Origin address present in both modes',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '300',
      description: 'Ordinary events before the one-time sequence',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include one five-record sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Allowed large fetch following denials',
      json: String.raw`{
  "@timestamp": "2026-09-25T00:25:15.753000+00:00",
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
    "bytes": 1827076,
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
    "duration": 2417000000,
    "ingested": "2026-09-25T00:25:15.753000+00:00",
    "kind": "event",
    "module": "squid",
    "original": "1790295915.753   2417 10.70.4.17 TCP_MISS/200 1827076 GET http://files.corp.example/export.csv analyst HIER_DIRECT/10.70.8.14 text/csv",
    "outcome": "success",
    "type": [
      "access"
    ]
  },
  "http": {
    "request": {
      "method": "GET"
    }
  },
  "input": {
    "type": "filestream"
  },
  "log": {
    "file": {
      "path": "/var/log/squid/access.log"
    },
    "offset": 41107
  },
  "observer": {
    "hostname": "squid-01",
    "ip": "10.70.0.5",
    "product": "Squid",
    "type": "proxy",
    "vendor": "Squid"
  },
  "related": {
    "hosts": [
      "files.corp.example"
    ],
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
    "content_type": "text/csv",
    "peer_status": "HIER_DIRECT",
    "result_code": "TCP_MISS",
    "status_code": 200
  },
  "tags": [
    "preserve_original_event",
    "squid-log"
  ],
  "url": {
    "domain": "files.corp.example",
    "original": "http://files.corp.example/export.csv",
    "path": "/export.csv",
    "scheme": "http"
  }
}`,
    },
  ],
};
