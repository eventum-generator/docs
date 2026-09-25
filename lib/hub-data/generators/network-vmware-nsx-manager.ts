/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic sample addresses and generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkVmwareNsxManager: GeneratorMeta = {
  slug: 'network-vmware-nsx-manager',
  displayName: 'VMware NSX Manager audit syslog',
  category: 'network',
  description:
    'NSX Manager ACCESS_CONTROL records with a switchable administrator retry burst.',
  dataSource: 'NSX Manager nsx@6876 syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Broadcom-documented NSX-T audit syslog structure',
    'Benign Skyline failure-success pairs in the baseline',
    'Four administrator failures followed by a success',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed admin logins followed by a successful login from the same IP on one NSX Manager.',
  generatorId: 'nsx',
  eventTypes: [
    {
      id: 'login-success',
      description: 'Successful ACCESS_CONTROL login',
      frequency: '80% routine picks; Skyline pair; chain',
      category: 'authentication',
    },
    {
      id: 'login-failure',
      description: 'Failed ACCESS_CONTROL login',
      frequency: '20% routine picks; chain',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Raw unquoted UserName form follows Broadcom 2022 NSX-T examples.',
    'NSX 4.2.x and 9.0.x can suppress successful LOGIN records; this chain targets pre-4.2 behavior.',
    'Client IP and username are present in every selected record.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include administrator retry burst',
    },
    {
      name: 'manager_host',
      defaultValue: 'nsx-mgr-01',
      description: 'NSX Manager hostname',
    },
    {
      name: 'admin_user',
      defaultValue: 'admin',
      description: 'Account in anomaly chain',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.91',
      description: 'Client in anomaly chain',
    },
    {
      name: 'skyline_user',
      defaultValue: 'skyline-svc',
      description: 'Routine integration account',
    },
    {
      name: 'skyline_ip',
      defaultValue: '10.20.5.20',
      description: 'Routine integration client',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example administrator login after failures',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:08:37+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "login-success",
    "category": [
      "authentication"
    ],
    "kind": "event",
    "original": "2026-09-25T13:08:37.000Z nsx-mgr-01 NSX 21593 SYSTEM [nsx@6876 audit=\"true\" comp=\"nsx-manager\" level=\"INFO\" subcomp=\"http\"] UserName=admin@192.0.2.91, ModuleName=\"ACCESS_CONTROL\", Operation=\"LOGIN\", Operation status=\"success\"",
    "outcome": "success",
    "type": [
      "start"
    ]
  },
  "host": {
    "name": "nsx-mgr-01"
  },
  "log": {
    "file": {
      "path": "/var/log/syslog"
    },
    "level": "info"
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "admin"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "user": {
    "name": "admin"
  },
  "vmware": {
    "nsx": {
      "component": "nsx-manager",
      "module_name": "ACCESS_CONTROL",
      "operation": "LOGIN",
      "operation_status": "success",
      "subcomponent": "http"
    }
  }
}`,
    },
  ],
};
