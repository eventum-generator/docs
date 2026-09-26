/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationVmware: GeneratorMeta = {
  slug: 'virtualization-vmware',
  displayName: 'VMware vCenter vpxd Events',
  category: 'virtualization',
  description:
    'Selected vCenter vpxd remote-syslog subset with stateful sessions, temporary permissions and VM transitions. Daily failed-login, grant and VM-change chains include visible restoration.',
  format: ['JSON', 'ECS', 'RFC 5424'],
  dataSource: 'Selected vCenter vpxd remote-syslog event profile',
  eventCount: 8,
  templateCount: 5,
  highlights: [
    'Eight native event classes',
    'Current sessions, grants and VM state',
    'Daily sequences with visible recovery',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours four distinct failed usernames from one peer precede accepted admin, temporary Administrator grant and recipient configured-CBT change plus VM power-off. A different administrator visibly restores configuration/power and revokes the grant at minutes 15–19. Ordinary actors and VM actions are shared.',
  generatorId: 'vsphere',
  eventTypes: [
    {
      id: 'UserLoginSessionEvent',
      description: 'Accepted current-session login',
      frequency: 'Ordinary workflows and episodes',
      category: 'authentication',
    },
    {
      id: 'UserLogoutSessionEvent',
      description: 'Stored-login-time logout and API call count',
      frequency: 'Every completed selected session',
      category: 'authentication',
    },
    {
      id: 'EventEx',
      description: 'Failed SSO login',
      frequency: 'Isolated ordinary retry; four per episode',
      category: 'authentication',
    },
    {
      id: 'PermissionAddedEvent',
      description: 'Authorized temporary propagated Administrator grant',
      frequency: 'Ordinary maintenance and episodes',
      category: 'iam',
    },
    {
      id: 'PermissionRemovedEvent',
      description: 'Remove the existing temporary grant',
      frequency: 'Ordinary maintenance and recovery',
      category: 'iam',
    },
    {
      id: 'VmReconfiguredEvent',
      description: 'Configured CBT flag transition',
      frequency: 'Ordinary maintenance and episodes',
      category: 'configuration',
    },
    {
      id: 'VmPoweredOffEvent',
      description: 'Powered-on VM becomes powered-off',
      frequency: 'Ordinary maintenance and episodes',
      category: 'host',
    },
    {
      id: 'VmPoweredOnEvent',
      description: 'Powered-off VM becomes powered-on',
      frequency: 'Ordinary maintenance and recovery',
      category: 'host',
    },
  ],
  parameters: [
    {
      name: 'vcenter_host',
      defaultValue: 'vcsa01.lab.example',
      description: 'Synthetic vCenter hostname',
    },
    {
      name: 'vcenter_ip',
      defaultValue: '10.40.0.10',
      description: 'Synthetic vCenter/collector source address',
    },
    {
      name: 'vcenter_mac',
      defaultValue: '00-50-56-A1-3F-2C',
      description: 'Synthetic host MAC',
    },
    {
      name: 'vcenter_id',
      defaultValue: '7c49a8e2c6244517b5572cfd43e91a0a',
      description: 'Synthetic host identifier',
    },
    {
      name: 'datacenter',
      defaultValue: 'DC-East',
      description: 'Existing datacenter receiving the temporary grant',
    },
    {
      name: 'domain',
      defaultValue: 'VSPHERE.LOCAL',
      description:
        'SSO domain for ordinary inventory and configured administrator',
    },
    {
      name: 'agent_id',
      defaultValue: '5096d7cc-1e4b-4959-abea-7355be2913a7',
      description: 'Synthetic collector identifier',
    },
    {
      name: 'agent_ephemeral_id',
      defaultValue: 'c4a1df82-7a9c-4a3e-8546-6d7cc04538e6',
      description: 'Synthetic collector lifetime identifier',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Synthetic Filebeat/Elastic Agent version',
    },
    {
      name: 'attack_ip',
      defaultValue: '10.99.6.44',
      description:
        'Shared existing administrator peer, also used in background',
    },
    {
      name: 'attack_user',
      defaultValue: 'Administrator',
      description:
        'Existing administrator short name replacing the default inventory administrator',
    },
    {
      name: 'granted_principal',
      defaultValue: 'VSPHERE.LOCAL\\svc_backup',
      description:
        'Full existing individual principal, including domain; replaces the ordinary backup identity',
    },
    {
      name: 'critical_vm',
      defaultValue: 'prod-db-01',
      description:
        'VM name replacing the first ordinary inventory entry; also used in background',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable recurring anomaly chains over background',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS metadata version',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Desired start-to-start interval, clamped to 1–8760 hours',
    },
  ],
  sampleOutputs: [
    {
      title: 'Configured CBT transition from final capture',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:19:00.000Z",
  "agent": {
    "ephemeral_id": "c4a1df82-7a9c-4a3e-8546-6d7cc04538e6",
    "id": "5096d7cc-1e4b-4959-abea-7355be2913a7",
    "name": "vcsa01.lab.example",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "data_stream": {
    "dataset": "vsphere.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.11.0"
  },
  "elastic_agent": {
    "id": "5096d7cc-1e4b-4959-abea-7355be2913a7",
    "snapshot": false,
    "version": "8.17.0"
  },
  "event": {
    "action": "vm-reconfigured",
    "category": [
      "configuration"
    ],
    "dataset": "vsphere.log",
    "id": "577251",
    "ingested": "2026-09-27T00:19:00.200Z",
    "kind": "event",
    "original": "<14>1 2026-09-27T00:19:00.000300+00:00 vcsa01.lab.example vpxd 58650 - -  Event [577251] [1-1] [2026-09-27T00:19:00.000000Z] [vim.event.VmReconfiguredEvent] [info] [VSPHERE.LOCAL\\svc_backup] [DC-East] [577251] [Reconfigured prod-db-01 on esxi01.lab.example in DC-East.\n  Modified:\n  config.changeTrackingEnabled: true -> false;]",
    "outcome": "success",
    "timezone": "+00:00",
    "type": [
      "change"
    ]
  },
  "host": {
    "architecture": "x86_64",
    "containerized": false,
    "hostname": "vcsa01.lab.example",
    "id": "7c49a8e2c6244517b5572cfd43e91a0a",
    "ip": [
      "10.40.0.10"
    ],
    "mac": [
      "00-50-56-A1-3F-2C"
    ],
    "name": "vcsa01.lab.example",
    "os": {
      "family": "linux",
      "name": "VMware Photon OS",
      "platform": "photon",
      "type": "linux"
    }
  },
  "input": {
    "type": "udp"
  },
  "log": {
    "level": "info",
    "logger": "vim.event.VmReconfiguredEvent",
    "source": {
      "address": "10.40.0.10:59146"
    },
    "syslog": {
      "facility": {
        "code": 1,
        "name": "User"
      },
      "priority": 14,
      "severity": {
        "code": 6,
        "name": "Informational"
      }
    }
  },
  "message": "[VSPHERE.LOCAL\\svc_backup] [DC-East] [577251] [Reconfigured prod-db-01 on esxi01.lab.example in DC-East.\n  Modified:\n  config.changeTrackingEnabled: true -> false;]",
  "process": {
    "name": "vpxd",
    "pid": 58650
  },
  "related": {
    "user": [
      "svc_backup"
    ]
  },
  "tags": [
    "preserve_original_event",
    "vmware-sphere"
  ],
  "user": {
    "domain": "VSPHERE.LOCAL",
    "name": "svc_backup"
  },
  "vsphere": {
    "event": {
      "chain_id": 577251,
      "class": "vim.event.VmReconfiguredEvent",
      "configuration": {
        "change_tracking_enabled": {
          "new": false,
          "old": true
        }
      },
      "created_time": "2026-09-27T00:19:00.000000Z",
      "host": {
        "name": "esxi01.lab.example"
      },
      "key": 577251,
      "user_name": "VSPHERE.LOCAL\\svc_backup",
      "vm": {
        "name": "prod-db-01"
      }
    }
  }
}`,
    },
  ],
  realismFeatures: [
    'One record per minute, nine existing identities and eleven VM targets. Current sessions, one temporary grant and at most 16 pending records keep state bounded.',
    'Permission recipients also perform CBT and power maintenance in ordinary activity. Completed workflows restore changes and revoke temporary grants.',
    'Every 24h four failed identities from one peer precede accepted admin, grant and recipient CBT-disable/power-off. A different authorized administrator restores configuration/power and revokes the grant at minutes 15–19.',
    'Only the configured CBT flag is modeled. It is restored before power-on, so these records do not prove effective CBT reset, backup failure or runtime outage.',
    'Login/logout/SSO use maintained raw fixtures. Permission English is synthetic/API-based; broader messages use vendor examples and simulator templates. SessionIDs, non-auth clientIPs, full live wire/parser parity are not claimed.',
  ],
};
