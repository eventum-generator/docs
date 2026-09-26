import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationProxmoxVe: GeneratorMeta = {
  slug: 'virtualization-proxmox-ve',
  displayName: 'Proxmox VE access and pveam logs',
  category: 'virtualization',
  description:
    'Proxmox VE pveproxy access and pveam update logs with a correlated API sequence.',
  dataSource: 'Proxmox VE access.log and pveam.log',
  format: ['JSON', 'ECS', 'Native file log'],
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'Native pveproxy access.log and pveam.log records',
    'Proxmox 7.x update/download/signature cycle',
    '401→200 tickets and accepted VM stop API call',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three denied API tickets, a successful ticket, then an accepted VM stop request from one IP.',
  generatorId: 'proxmox',
  eventTypes: [
    {
      id: 'api-read',
      description: 'VM status or configuration GET',
      frequency: '88% of routine access picks',
      category: 'web',
    },
    {
      id: 'ticket-issued',
      description: 'Ticket endpoint HTTP 200',
      frequency: '12% of routine access picks; chain',
      category: 'authentication',
    },
    {
      id: 'ticket-denied',
      description: 'Ticket endpoint HTTP 401',
      frequency: 'Chain only',
      category: 'authentication',
    },
    {
      id: 'vm-stop-request',
      description: 'VM stop API HTTP 200',
      frequency: 'Chain only',
      category: 'host',
    },
    {
      id: 'pveam-start',
      description: 'Update started',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-download',
      description: 'Signature file download requested',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-finished',
      description: 'Signature file download HTTP 200',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-download-data',
      description: 'Data file download requested',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-finished-data',
      description: 'Data file download HTTP 200',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-signature',
      description: 'Good signature recorded',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
    {
      id: 'pveam-success',
      description: 'Update successful',
      frequency: 'Scheduled baseline cycle',
      category: 'package',
    },
  ],
  realismFeatures: [
    'Native pveproxy access.log and pveam.log records',
    'Proxmox 7.x update/download/signature cycle',
    '401→200 tickets and accepted VM stop API call',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the API ticket and VM stop sequence',
    },
    {
      name: 'node_name',
      defaultValue: 'pve-01',
      description: 'Proxmox node in API paths',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.91',
      description: 'Source IP in the sequence',
    },
    {
      name: 'suspect_user',
      defaultValue: 'ops@pam',
      description: 'Authenticated API user on the stop request',
    },
    {
      name: 'target_vmid',
      defaultValue: '103',
      description: 'VM ID in the stop request',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example vm-stop-request',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:59:19+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "vm-stop-request",
    "category": [
      "host"
    ],
    "kind": "event",
    "original": "::ffff:192.0.2.91 - ops@pam [25/Sep/2026:12:59:19 +0000] \"POST /api2/json/nodes/pve-01/qemu/103/status/stop HTTP/1.1\" 200 121",
    "outcome": "success",
    "type": [
      "change"
    ]
  },
  "host": {
    "name": "pve-01"
  },
  "http": {
    "request": {
      "method": "POST"
    },
    "response": {
      "body": {
        "bytes": 121
      },
      "status_code": 200
    }
  },
  "log": {
    "file": {
      "path": "/var/log/pveproxy/access.log"
    }
  },
  "proxmox": {
    "access": {
      "username": "ops@pam"
    }
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "ops@pam"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "url": {
    "path": "/api2/json/nodes/pve-01/qemu/103/status/stop"
  },
  "user": {
    "name": "ops@pam"
  }
}`,
    },
  ],
};
