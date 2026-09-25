import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyCiscoSecureWebAppliance: GeneratorMeta = {
  slug: 'proxy-cisco-secure-web-appliance',
  displayName: 'Cisco Secure Web Appliance',
  category: 'web-access',
  description:
    'Cisco SWA standard access logs with allowed, cached, and denied traffic plus an alternate-domain retry.',
  dataSource: 'Cisco Secure Web Appliance standard access log',
  format: ['JSON', 'ECS', 'WSA access log'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'AsyncOS standard access-log field order',
    'TCP_MISS, TCP_HIT, and TCP_DENIED decisions',
    'BLOCK_WEBCAT retries followed by alternate-domain fetch',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client receives three policy denials for a path, then fetches the same path from another domain.',
  generatorId: 'swa',
  eventTypes: [
    {
      id: 'proxy-miss',
      description: 'Fetched from origin, HTTP 200',
      frequency: '80% baseline; chain',
      category: 'web',
    },
    {
      id: 'proxy-hit',
      description: 'Served from cache, HTTP 200',
      frequency: '15% baseline',
      category: 'web',
    },
    {
      id: 'proxy-denied',
      description: 'Access policy denial, HTTP 403',
      frequency: '5% baseline; chain',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Result code, HTTP status, hierarchy, MIME type, and ACL tag',
    'Scanning verdict field in the documented access-log envelope',
    'Different domains for denied and allowed URL paths',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the denied-then-alternate-fetch sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'swa-01.example.test',
      description: 'Appliance name',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.72',
      description: 'Sequence client IP',
    },
    {
      name: 'blocked_domain',
      defaultValue: 'blocked-download.example.test',
      description: 'Denied URL host',
    },
    {
      name: 'alternate_domain',
      defaultValue: 'cdn.example.test',
      description: 'Allowed alternate URL host',
    },
    {
      name: 'target_path',
      defaultValue: '/tools/agent.bin',
      description: 'Path shared by the denied and allowed requests',
    },
  ],
  sampleOutputs: [
    {
      title: 'Alternate-domain fetch after denials',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:29:24+00:00",
  "cisco": {
    "swa": {
      "acl_decision_tag": "DEFAULT_CASE_11-DefaultGroup-DefaultGroup-NONE-NONE-DefaultRouting-NONE",
      "elapsed_ms": 131,
      "hierarchy": "DIRECT/cdn.example.test",
      "mime_type": "application/octet-stream",
      "result_code": "TCP_MISS",
      "scan_verdict": "<IW_comp,6.9,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,IW_comp,-,\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",198.34,0,-,[Local],\"-\",37,\"-\",33,0,\"-\",\"-\">"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "proxy-miss",
    "category": [
      "web"
    ],
    "kind": "event",
    "original": "1790342964.000 131 192.0.2.72 TCP_MISS/200 7402 GET http://cdn.example.test/tools/agent.bin - DIRECT/cdn.example.test application/octet-stream DEFAULT_CASE_11-DefaultGroup-DefaultGroup-NONE-NONE-DefaultRouting-NONE <IW_comp,6.9,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,IW_comp,-,\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",198.34,0,-,[Local],\"-\",37,\"-\",33,0,\"-\",\"-\"> -",
    "outcome": "success",
    "type": [
      "access"
    ]
  },
  "host": {
    "name": "swa-01.example.test"
  },
  "http": {
    "request": {
      "method": "GET"
    },
    "response": {
      "body": {
        "bytes": 7402
      },
      "status_code": 200
    }
  },
  "network": {
    "protocol": "http"
  },
  "related": {
    "ip": [
      "192.0.2.72"
    ]
  },
  "source": {
    "ip": "192.0.2.72"
  },
  "url": {
    "domain": "cdn.example.test",
    "full": "http://cdn.example.test/tools/agent.bin",
    "path": "/tools/agent.bin",
    "scheme": "http"
  }
}`,
    },
  ],
};
