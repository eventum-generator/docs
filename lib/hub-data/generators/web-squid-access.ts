/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webSquidAccess: GeneratorMeta = {
  slug: 'web-squid-access',
  displayName: 'Squid Native Access Log',
  category: 'web-access',
  description:
    'Squid 6.x native access.log with stateful public-object caching, completion-time response bytes and recurring denied-to-allowed sequences.',
  dataSource: 'Squid 6.x built-in squid access.log format',
  format: ['JSON', 'ECS', 'Access log'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'squid',
  highlights: [
    'Native ten-value Squid 6.x line',
    '43/54 full Elastic reference paths; 43/43 selected',
    'Five-record access sequences recur about every six hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same user, IP and HTTP URL receive three TCP_DENIED/403 results followed by two 1.8-2.8 MB TCP_MISS/200 responses over about 20 seconds, in causal order. Episodes recur every 6 hours by default: the first starts at a uniform time within the first min(interval, 24 h), each next one at a uniform time in a window of min(interval / 4, 6 h) centred one interval after the previous actual start (6 h plus or minus 45 minutes by default), with no drift and no catch-up. The actor, URL, large responses and individual denials also occur in background, including reload bursts of repeated denials; an ordinary GET that would return 200 and complete three denials and one success within 300 seconds of the first denial is sent to another URL at the same time. access.log proves no ACL change or exfiltration.',
  eventTypes: [
    {
      id: 'TCP_MISS/200 GET',
      description: 'Cold, expired or uncacheable origin response',
      frequency:
        '70% GET weight or 5% conditional weight when no fresh object exists',
      category: 'web',
    },
    {
      id: 'TCP_HIT/200 GET',
      description: 'Fresh public object served with its stored response size',
      frequency: 'Part of 70% ordinary GET choices',
      category: 'web',
    },
    {
      id: 'TCP_TUNNEL/200 CONNECT',
      description: 'HTTPS tunnel to host:port, without path visibility',
      frequency: '18% ordinary selection weight',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 GET',
      description:
        'Restricted request from a named user; 10% start a reload burst of one to four more denials',
      frequency: '7.0% of background records; three per episode',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/407 GET',
      description: 'Anonymous client requires authentication',
      frequency: '1.0% of background records',
      category: 'web',
    },
    {
      id: 'TCP_IMS_HIT/304 GET',
      description: 'Fresh cached conditional response, headers only',
      frequency: 'Part of 5% conditional choices',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Native epoch time is transaction completion, elapsed milliseconds map to ECS nanoseconds, and bytes include response headers delivered to the client. destination.bytes follows Elastic mapping, not origin traffic or upload volume.',
    'Only cacheable public resources can hit. Cache-Control public/max-age3600, fixed headers, no Vary and no auth-dependent representation are explicit synthetic assumptions; hits reuse stored bytes until expiry.',
    'Cache state is bounded to 24 URLs, twelve shipped cacheable entries. Users reload blocked pages: runs of two to six denials of one user and URL within 31 seconds occur in background, and per user and URL the generator keeps only the denial times of the last 300 seconds.',
    'Target client has an explicit 10% bias plus its share of the 24-client pool in both modes. The seven restricted URLs include the exact target; ordinary denials and successes overlap all sequence values.',
    'Full reference coverage remains 43/54 below the 90% target; selected43/43 excludes eight GeoIP and three actual filesystem-identity fields. Collector IDs, offset and zero-delay ingestion are synthetic context.',
    'Exact Squid 6.9 TCP_IMS_HIT/304 raw record remains unavailable; historical native examples and tagged result definitions do not establish full same-version raw/parser compatibility. Usernames are ASCII tokens and URLs are HTTP without userinfo/query/fragment; arbitrary native quoting is outside the tested profile.',
  ],
  parameters: [
    {
      name: 'proxy_name',
      defaultValue: 'squid-01',
      description: 'Synthetic collector/proxy identity',
    },
    {
      name: 'proxy_ip',
      defaultValue: '10.70.0.5',
      description: 'Synthetic collector/proxy identity',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'analyst',
      description: 'Client identity in both background and sequence',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.70.4.17',
      description: 'Client identity in both background and sequence',
    },
    {
      name: 'anomaly_url',
      defaultValue: 'http://files.corp.example/export.csv',
      description: 'Absolute HTTP URL and origin used in both modes',
    },
    {
      name: 'anomaly_origin_ip',
      defaultValue: '10.70.8.14',
      description: 'Absolute HTTP URL and origin used in both modes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '6',
      description:
        'Mean time between episode starts, each within plus or minus min(interval / 8, 3 h) of its due time; values below one hour are clamped to one',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include repeated sequences; `false` emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Large response following repeated denials',
      json: String.raw`{
  "@timestamp": "2026-09-01T01:13:35.589000+00:00",
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
    "bytes": 1891810,
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
    "duration": 2188000000,
    "ingested": "2026-09-01T01:13:35.589000+00:00",
    "kind": "event",
    "module": "squid",
    "original": "1788225215.589   2188 10.70.4.17 TCP_MISS/200 1891810 GET http://files.corp.example/export.csv analyst HIER_DIRECT/10.70.8.14 text/csv",
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
    "offset": 116818
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
