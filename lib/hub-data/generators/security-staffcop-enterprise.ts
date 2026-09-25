/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityStaffcopEnterprise: GeneratorMeta = {
  slug: 'security-staffcop-enterprise',
  displayName: 'Staffcop Enterprise',
  category: 'security',
  dataSource: 'Staffcop Enterprise 5.8 native Syslog connector',
  description:
    'Endpoint screenshot and statistics events with a switchable sequence of multiple policy matches.',
  generatorId: 'staffcop',
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Vendor-documented 5.8 native key-value syslog',
    'Twelve routine endpoints and benign activity on the chain endpoint',
    'Linked screenshot series and two-policy statistics event',
  ],
  anomalyChain:
    'Two unflagged screenshots by one user are followed by a policy-matched screenshot and a Stat event matching two policies on the same endpoint.',
  eventTypes: [
    {
      id: 'Screenshot',
      description: 'Endpoint screenshot event',
      frequency: '91.7% with anomaly mode',
      category: 'host',
    },
    {
      id: 'Stat',
      description:
        'Statistics event with two policy matches in background or anomaly mode',
      frequency: '8.3% with anomaly mode',
      category: 'host',
    },
  ],
  realismFeatures: [
    'Native syslog header and all nine fields in the vendor two-policy example.',
    'Event time and forwarding time are separate, with a three-minute synthetic delay.',
    'KUMA lists a 5.4/5.5 CEF normalizer; this pack emits 5.8 native key-value syslog.',
  ],
  format: ['JSON', 'ECS', 'syslog key-value'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked multi-policy sequence',
    },
    {
      name: 'syslog_host',
      defaultValue: 'staffcop-srv',
      description: 'Syslog server hostname',
    },
    {
      name: 'routine_endpoint_count',
      defaultValue: '12',
      description: 'Distinct background user/endpoint pairs',
    },
    {
      name: 'suspect_user',
      defaultValue: 'ivan',
      description: 'Actor with benign screenshots and an anomaly chain',
    },
    {
      name: 'suspect_computer',
      defaultValue: 'WS-023',
      description: 'Endpoint with benign screenshots and an anomaly chain',
    },
    {
      name: 'suspect_ip',
      defaultValue: '10.20.4.23',
      description: 'Endpoint address in benign activity and the anomaly chain',
    },
    {
      name: 'application',
      defaultValue: 'chrome',
      description: 'Native app field',
    },
    {
      name: 'policy_screenshot',
      defaultValue: 'Скриншоты',
      description: 'First policy match',
    },
    {
      name: 'policy_sensitive',
      defaultValue: 'Финансовые данные',
      description: 'Second policy match in Stat',
    },
  ],
  sampleOutputs: [
    {
      title: 'Staffcop two-policy statistics event',
      json: String.raw`{
  "@timestamp": "2026-09-25T17:47:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "Stat",
    "category": [
      "host"
    ],
    "id": "468036",
    "kind": "event",
    "original": "Sep 25 17:50:00 staffcop-srv staffcop: id=\"468036\" time=\"Sep 25 17:47:00\" event=\"Stat\" computer=\"WS-023\" ip=\"10.20.4.23\" user=\"ivan\" app=\"chrome\" policy_1=\"\u0421\u043a\u0440\u0438\u043d\u0448\u043e\u0442\u044b\" policy_2=\"\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435\"",
    "type": [
      "info"
    ]
  },
  "host": {
    "ip": [
      "10.20.4.23"
    ],
    "name": "WS-023"
  },
  "observer": {
    "name": "staffcop-srv"
  },
  "process": {
    "name": "chrome"
  },
  "related": {
    "hosts": [
      "WS-023"
    ],
    "ip": [
      "10.20.4.23"
    ],
    "user": [
      "ivan"
    ]
  },
  "staffcop": {
    "event_time": "2026-09-25T17:47:00+00:00",
    "forwarded_at": "2026-09-25T17:50:00+00:00",
    "policy_matches": [
      "\u0421\u043a\u0440\u0438\u043d\u0448\u043e\u0442\u044b",
      "\u0424\u0438\u043d\u0430\u043d\u0441\u043e\u0432\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435"
    ]
  },
  "user": {
    "name": "ivan"
  }
}`,
    },
  ],
};
