/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const proxySolarWebproxy: GeneratorMeta = {
  slug: 'proxy-solar-webproxy',
  displayName: 'Solar webProxy',
  category: 'web-access',
  dataSource: 'Solar webProxy 4.3.1 siem-log syslog',
  description:
    'Web filtering request logs with a switchable sequence of blocked requests followed by a large POST.',
  generatorId: 'solar',
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Vendor-documented 4.3.1 bracketed siem-log format',
    '26 native request and filter key-value fields',
    'Two denied GETs followed by a 12 MiB allowed POST',
  ],
  anomalyChain:
    'The same user and IP make two blocked GET requests, then send a 12 MiB POST to another host within 90 seconds.',
  eventTypes: [
    {
      id: 'http-allowed',
      description: 'Filtered web request allowed',
      frequency: '83.7% with anomaly mode',
      category: 'web',
    },
    {
      id: 'http-denied',
      description: 'Web request blocked',
      frequency: '16.3% with anomaly mode',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Raw line uses the vendor 4.3.1 siem-log field schema; values are synthetic.',
    'One proxy and stable account/IP link the chain across request decisions.',
    'KUMA 4.2 lists a normalizer for webProxy 4.2; compatibility with this 4.3.1 stream is untested.',
  ],
  format: ['JSON', 'ECS', 'siem-log syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked blocked-request-to-upload sequence',
    },
    {
      name: 'proxy_host',
      defaultValue: 'webproxy-01',
      description: 'Syslog host name',
    },
    {
      name: 'account_domain',
      defaultValue: 'CORP',
      description: 'Account domain',
    },
    {
      name: 'ordinary_user',
      defaultValue: 'anna',
      description: 'Background account',
    },
    {
      name: 'ordinary_ip',
      defaultValue: '10.20.4.41',
      description: 'Background client address',
    },
    {
      name: 'suspect_user',
      defaultValue: 'ivan',
      description: 'Account in the anomaly chain',
    },
    {
      name: 'suspect_ip',
      defaultValue: '10.20.4.23',
      description: 'Client address in the anomaly chain',
    },
    {
      name: 'ordinary_destination_ip',
      defaultValue: '192.0.2.10',
      description: 'Allowed background destination',
    },
    {
      name: 'blocked_destination_ip',
      defaultValue: '192.0.2.20',
      description: 'Blocked destination',
    },
    {
      name: 'upload_destination_ip',
      defaultValue: '192.0.2.30',
      description: 'Chain POST destination',
    },
  ],
  sampleOutputs: [
    {
      title: 'Solar webProxy large POST',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:28:00+00:00",
  "destination": {
    "bytes": 2048,
    "ip": "192.0.2.30",
    "port": 443
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "http-allowed",
    "category": [
      "web"
    ],
    "kind": "event",
    "original": "Sep 25 14:28:00 webproxy-01 java: [acc-domain:CORP] [acc-groups:Employees] [acc-ip:10.20.4.23] [acc-name:ivan] [acc-port:54721] [bytes-in:2048] [bytes-out:12582912] [flt-categories:0] [flt-codes:11,0,0,0] [flt-policy:Standard web access] [flt-rules:https,web-filter] [flt-status:200] [flt-time:8] [req-hostname:uploads.example.test] [req-method:POST] [req-pathname:/ingest] [req-protocol:https] [req-query:] [req-referer:] [req-time:2026-09-25T14:28:00.000Z] [req-user-agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36] [res-datatype:application/json] [res-ip:192.0.2.30] [traf-mode:forward] [req-port:443] [flt-reason:]",
    "outcome": "success",
    "type": [
      "access"
    ]
  },
  "host": {
    "name": "webproxy-01"
  },
  "http": {
    "request": {
      "method": "POST"
    },
    "response": {
      "status_code": 200
    }
  },
  "related": {
    "ip": [
      "10.20.4.23",
      "192.0.2.30"
    ],
    "user": [
      "ivan"
    ]
  },
  "solar_webproxy": {
    "account_groups": "Employees",
    "filter_codes": "11,0,0,0",
    "filter_policy": "Standard web access",
    "filter_reason": "",
    "filter_rules": "https,web-filter",
    "filter_time_ms": 8,
    "request_time": "2026-09-25T14:28:00.000Z",
    "response_mime_type": "application/json",
    "traffic_mode": "forward"
  },
  "source": {
    "bytes": 12582912,
    "ip": "10.20.4.23",
    "port": 54721
  },
  "url": {
    "domain": "uploads.example.test",
    "full": "https://uploads.example.test/ingest",
    "path": "/ingest",
    "scheme": "https"
  },
  "user": {
    "domain": "CORP",
    "name": "ivan"
  },
  "user_agent": {
    "original": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36"
  }
}`,
    },
  ],
};
