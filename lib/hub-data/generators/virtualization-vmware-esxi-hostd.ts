import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationVmwareEsxiHostd: GeneratorMeta = {
  slug: 'virtualization-vmware-esxi-hostd',
  displayName: 'VMware ESXi hostd logs',
  category: 'virtualization',
  description:
    'ESXi hostd local logs with API logins and a completed maintenance task.',
  dataSource: 'VMware ESXi hostd.log',
  format: ['JSON', 'ECS', 'hostd log'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native hostd Originator@6876 envelope',
    'Unique task and operation IDs per maintenance cycle',
    'Sequential host-mode messages and successful task completion',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Backup service account creates a host maintenance task that reaches successful completion.',
  generatorId: 'esxi',
  eventTypes: [
    {
      id: 'login',
      description: 'Host API login',
      frequency: '55% baseline',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'Host API logout',
      frequency: '45% baseline',
      category: 'authentication',
    },
    {
      id: 'task-created',
      description: 'Enter-maintenance task created',
      frequency: 'Chain only',
      category: 'configuration',
    },
    {
      id: 'maintenance-begin',
      description: 'Host begins entering maintenance',
      frequency: 'Chain only',
      category: 'configuration',
    },
    {
      id: 'maintenance-started',
      description: 'User-attributed maintenance starts',
      frequency: 'Chain only',
      category: 'configuration',
    },
    {
      id: 'maintenance-entered',
      description: 'Host enters maintenance',
      frequency: 'Chain only',
      category: 'configuration',
    },
    {
      id: 'task-completed',
      description: 'Enter-maintenance task succeeds',
      frequency: 'Chain only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Native hostd Originator@6876 envelope',
    'Unique task and operation IDs per maintenance cycle',
    'Sequential host-mode messages and successful task completion',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the maintenance-task sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'esx-04.example.test',
      description: 'ESXi host',
    },
    {
      name: 'datacenter_name',
      defaultValue: 'dc-east',
      description: 'Datacenter in maintenance event',
    },
    {
      name: 'maintenance_actor',
      defaultValue: String.raw`vpxuser:CORP\svc-backup`,
      description: 'Actor in the maintenance task',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example task-created',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:58:44+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "task-created",
    "category": [
      "configuration"
    ],
    "kind": "event",
    "original": "2026-09-25T12:58:44.000Z In(166) Hostd[2101270]: [Originator@6876 sub=Vimsvc.TaskManager opID=a51bb486-3b41-42eb-a394-22ac9e452c6f-6a-a-615a sid=8c327895 user=vpxuser:CORP\\svc-backup] Task Created : haTask-ha-host-vim.HostSystem.enterMaintenanceMode-17044002",
    "type": [
      "change"
    ]
  },
  "host": {
    "name": "esx-04.example.test"
  },
  "log": {
    "file": {
      "path": "/var/run/log/hostd.log"
    },
    "level": "info"
  },
  "process": {
    "name": "Hostd",
    "pid": 2101270
  },
  "related": {
    "user": [
      "vpxuser:CORP\\svc-backup"
    ]
  },
  "vmware": {
    "esxi": {
      "actor": "vpxuser:CORP\\svc-backup",
      "message": "Task Created : haTask-ha-host-vim.HostSystem.enterMaintenanceMode-17044002",
      "operation_id": "a51bb486-3b41-42eb-a394-22ac9e452c6f-6a-a-615a",
      "session_id": "8c327895",
      "subsystem": "Vimsvc.TaskManager",
      "task_id": "haTask-ha-host-vim.HostSystem.enterMaintenanceMode-17044002"
    }
  }
}`,
    },
  ],
};
