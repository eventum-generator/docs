/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKempLoadmaster: GeneratorMeta = {
  slug: 'network-kemp-loadmaster',
  displayName: 'Kemp LoadMaster ESP',
  category: 'network',
  description:
    'LoadMaster ESP CEF access denials, logons and requests with a correlated /admin sequence.',
  dataSource: 'Progress Kemp LoadMaster ESP CEF logs',
  format: ['CEF', 'Syslog', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'network-kemp-loadmaster',
  highlights: [
    'Vendor-published CEF classes 9, 8 and 14',
    'Three denials followed by logon and /admin request',
    'Stable user, client and virtual service',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One user has three ESP access denials, then logs on and requests /admin from the same client and virtual service.',
  eventTypes: [
    {
      id: '9',
      description: 'ESP Access Denied',
      frequency: 'About 10% of routine events; three per chain',
      category: 'web',
    },
    {
      id: '8',
      description: 'ESP Logged on',
      frequency: 'About 5% of routine events; one per chain',
      category: 'authentication',
    },
    {
      id: '14',
      description: 'ESP Request',
      frequency: 'About 85% of routine events; one per chain',
      category: 'web',
    },
  ],
  realismFeatures: [
    'CEF header and extension fields follow the published ESP examples.',
    'event.original preserves CEF; structured fields are also available under kemp.loadmaster.',
    'Background excludes the chain client and user.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'loadmaster-01.example.test',
      description: 'ECS device host',
    },
    {
      name: 'virtual_ip',
      defaultValue: '10.42.20.15',
      description: 'ESP virtual service address',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'chain_source_ip',
      defaultValue: '10.42.9.77',
      description: 'Stable chain client',
    },
    {
      name: 'chain_user',
      defaultValue: 'operator@example.test',
      description: 'Stable chain user',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated ESP access denial',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:59:06+00:00",
  "destination": {
    "ip": "10.42.20.15",
    "port": 443
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "access-denied",
    "category": [
      "web"
    ],
    "code": "9",
    "dataset": "kemp_loadmaster.esp",
    "kind": "event",
    "original": "CEF:0|Kemp|LM|1.0|9|Access Denied|6|vs=10.42.20.15:443 event=Access Denied srcip=10.42.9.77 user=operator@example.test msg=denied access",
    "type": [
      "denied"
    ]
  },
  "host": {
    "name": "loadmaster-01.example.test"
  },
  "kemp": {
    "loadmaster": {
      "class_id": 9,
      "device_version": "1.0",
      "extension": {
        "event": "Access Denied",
        "msg": "denied access",
        "srcip": "10.42.9.77",
        "user": "operator@example.test",
        "vs": "10.42.20.15:443"
      },
      "name": "Access Denied",
      "product": "LM",
      "severity": 6,
      "vendor": "Kemp",
      "version": 0
    }
  },
  "related": {
    "ip": [
      "10.42.9.77",
      "10.42.20.15"
    ],
    "user": [
      "operator@example.test"
    ]
  },
  "source": {
    "ip": "10.42.9.77"
  },
  "user": {
    "name": "operator@example.test"
  }
}`,
    },
  ],
};
