import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationVmwareEsxiHostd: GeneratorMeta = {
  displayName: 'VMware ESXi hostd logs',
  category: 'virtualization',
  description:
    'ESXi 8 hostd authentication and VM tasks from one host, four administrators and two automated API clients. Native messages sit inside a custom ECS wrapper.',
  dataSource: 'VMware ESXi hostd.log',
  format: ['JSON', 'ECS'],
  highlights: [
    'Native hostd messages with numeric VM task identifiers',
    'About 3,300 records/day with administrator working hours',
    'VM power cycles return to the running state after about 5-15 minutes',
  ],
  anomalyChain:
    'For one user/address, three rejected passwords, a login and a VM power-off request within 30 minutes. First start within min(interval,24h), favouring work hours; later starts within +/-min(interval/4,6h)/2 around the previous actual start plus interval, with a short record-time delay. Administrator and VM rotate.',
  generatorId: 'esxi-hostd',
  eventTypes: [
    {
      id: 'login',
      description: 'API login',
      frequency: '48.44%',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'API logout',
      frequency: '48.44%',
      category: 'authentication',
    },
    {
      id: 'auth-failed',
      description: 'Rejected password',
      frequency: '1.18%',
      category: 'authentication',
    },
    {
      id: 'vm-snapshot-request',
      description: 'VM snapshot task',
      frequency: '0.71%',
      category: 'configuration',
    },
    {
      id: 'task-completed',
      description: 'Task completed successfully',
      frequency: '0.97%',
      category: 'configuration',
    },
    {
      id: 'vm-poweroff-request',
      description: 'VM power-off task',
      frequency: '0.13%',
      category: 'configuration',
    },
    {
      id: 'vm-poweron-request',
      description: 'VM power-on task',
      frequency: '0.13%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Independent API sessions with shared account attempt limits',
    'Ordinary and episode VMs use the same restoration timing',
    'Selected native lines only; PAM diagnostics, snapshot cleanup and most subsystems are omitted',
    'ECS and vmware.esxi are a custom mapping; live parser compatibility is unverified',
  ],
  slug: 'virtualization-vmware-esxi-hostd',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 7,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring complete chains.',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Recurrence interval, 2-8760 hours.',
    },
    {
      name: 'host_name',
      defaultValue: 'esx-04.example.test',
      description: 'ESXi host name.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-21T00:02:39.760Z", "ecs": {"version": "8.17.0"}, "event": {"action": "login", "category": ["authentication"], "kind": "event", "original": "2026-09-21T00:02:39.760Z In(166) Hostd[2103838]: [Originator@6876 sub=Vimsvc.ha-eventmgr opID=esxui-e3e6-d1bf sid=7926f1f1] Event 6549 : User svc-backup@10.20.2.32 logged in as pyvmomi Python/3.8.18 (VMkernel; 8.0.2; x86_64)", "outcome": "success", "type": ["start"]}, "host": {"name": "esx-04.example.test"}, "log": {"file": {"path": "/var/run/log/hostd.log"}, "level": "info"}, "process": {"name": "Hostd", "pid": 2103838}, "related": {"ip": ["10.20.2.32"], "user": ["svc-backup"]}, "source": {"ip": "10.20.2.32"}, "user": {"name": "svc-backup"}, "vmware": {"esxi": {"client_agent": "pyvmomi Python/3.8.18 (VMkernel; 8.0.2; x86_64)", "message": "Event 6549 : User svc-backup@10.20.2.32 logged in as pyvmomi Python/3.8.18 (VMkernel; 8.0.2; x86_64)", "subsystem": "Vimsvc.ha-eventmgr"}}}`,
    },
  ],
};
