import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationProxmoxVe: GeneratorMeta = {
  displayName: 'Proxmox VE logs',
  category: 'virtualization',
  description:
    'About 12,240 records/day from one node, twelve VMs, administrators, automation accounts and an API-token monitor.',
  dataSource: 'Proxmox VE 7.x pveproxy and pveam logs',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  highlights: [
    'Human office hours and independent continuous monitoring',
    'VMs return to the running state on the ordinary restoration schedule',
  ],
  anomalyChain:
    'One automation address receives three denied tickets, an issued ticket and a VM stop response within 30 minutes. The clients and VMs rotate. Both clients operate around the clock, so episode times are uniform. Default interval is 24 hours. First start is within min(interval,24h); subsequent starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'proxmox',
  eventTypes: [
    {
      id: 'api-read',
      description: 'API request',
      frequency: '94.83%',
      category: 'configuration',
    },
    {
      id: 'ticket-issued',
      description: 'Authentication',
      frequency: '4.64%',
      category: 'authentication',
    },
    {
      id: 'ticket-denied',
      description: 'Authentication',
      frequency: '0.14%',
      category: 'authentication',
    },
    {
      id: 'vm-start-request',
      description: 'VM operation',
      frequency: '0.11%',
      category: 'configuration',
    },
    {
      id: 'vm-stop-request',
      description: 'VM operation',
      frequency: '0.06%',
      category: 'configuration',
    },
    {
      id: 'pveam-signature-verification',
      description: 'Appliance index update',
      frequency: '0.05%',
      category: 'configuration',
    },
    {
      id: 'vm-shutdown-request',
      description: 'VM operation',
      frequency: '0.05%',
      category: 'configuration',
    },
    {
      id: 'pveam-download-start',
      description: 'Appliance index update',
      frequency: '0.03%',
      category: 'configuration',
    },
    {
      id: 'pveam-download-finished',
      description: 'Appliance index update',
      frequency: '0.03%',
      category: 'configuration',
    },
    {
      id: 'vm-reboot-request',
      description: 'VM operation',
      frequency: '0.03%',
      category: 'configuration',
    },
    {
      id: 'pveam-update-successful',
      description: 'Appliance index update',
      frequency: '0.02%',
      category: 'configuration',
    },
    {
      id: 'pveam-update-start',
      description: 'Appliance index update',
      frequency: '0.01%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Human office hours and independent continuous monitoring',
    'VMs return to the running state on the ordinary restoration schedule',
    'Native lines with custom ECS enrichment; HTTP 200 confirms task submission',
  ],
  slug: 'virtualization-proxmox-ve',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 12,
  parameters: [
    {
      name: 'node_name',
      defaultValue: 'pve-01',
      description: 'Node name in native API paths and ECS host fields',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include correlated authentication and stop requests',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Recurrence interval, from 6 to 8760 hours',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-01T03:13:28+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "vm-stop-request", "category": ["host"], "kind": "event", "original": "::ffff:10.20.1.22 - backup-ops@pve [01/09/2026:03:13:28 +0000] \"POST /api2/json/nodes/pve-01/qemu/101/status/stop HTTP/1.1\" 200 76", "outcome": "success", "type": ["change"]}, "host": {"name": "pve-01"}, "http": {"request": {"method": "POST"}, "response": {"body": {"bytes": 76}, "status_code": 200}, "version": "1.1"}, "log": {"file": {"path": "/var/log/pveproxy/access.log"}}, "proxmox": {"access": {"username": "backup-ops@pve"}}, "related": {"ip": ["10.20.1.22"], "user": ["backup-ops@pve"]}, "source": {"ip": "10.20.1.22"}, "url": {"path": "/api2/json/nodes/pve-01/qemu/101/status/stop"}, "user": {"name": "backup-ops@pve"}}`,
    },
  ],
};
