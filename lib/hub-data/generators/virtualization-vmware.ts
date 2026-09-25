/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationVmware: GeneratorMeta = {
  slug: 'virtualization-vmware',
  displayName: 'VMware vSphere vCenter',
  category: 'virtualization',
  description:
    'vCenter vpxd events forwarded through syslog, including SSO sessions, virtual machine power and configuration changes, and permission grants.',
  format: ['JSON', 'ECS'],
  dataSource: 'VMware vCenter vpxd syslog',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Elastic vsphere.log envelope',
    'Native Event [key] records',
    'SSO session and VM activity',
    'Administrator permission grant',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Failed SSO logins, Administrator access, a new Administrator permission, then production-VM reconfiguration and power-off.',
  generatorId: 'vsphere',
  eventTypes: [
    {
      id: 'UserLoginSessionEvent',
      description: 'Successful login',
      frequency: '38% baseline',
      category: 'authentication',
    },
    {
      id: 'UserLogoutSessionEvent',
      description: 'Logout',
      frequency: '32% baseline',
      category: 'authentication',
    },
    {
      id: 'VmPoweredOnEvent',
      description: 'VM powered on',
      frequency: '15% baseline',
      category: 'host',
    },
    {
      id: 'VmPoweredOffEvent',
      description: 'VM powered off',
      frequency: '10% baseline',
      category: 'host',
    },
    {
      id: 'VmReconfiguredEvent',
      description: 'VM reconfigured',
      frequency: '5% baseline',
      category: 'configuration',
    },
    {
      id: 'EventEx',
      description: 'Failed SSO login',
      frequency: 'chain only',
      category: 'authentication',
    },
    {
      id: 'PermissionAddedEvent',
      description: 'Administrator permission added',
      frequency: 'chain only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'vCenter vpxd syslog Event [key] format is preserved in event.original',
    'One vCenter source with increasing event IDs and a ten-VM inventory',
    'Routine SSO login/logout and VM power/configuration events use weighted frequencies',
    'Four failed SSO logins from one IP precede the Administrator session',
    'Permission grant, reconfiguration, and power-off are tied to the same actor and production VM',
  ],
  parameters: [
    {
      name: 'vcenter_host',
      defaultValue: 'vcsa01.lab.example',
      description: 'vCenter hostname',
    },
    {
      name: 'vcenter_ip',
      defaultValue: '10.40.0.10',
      description: 'vCenter address and syslog sender',
    },
    {
      name: 'vcenter_mac',
      defaultValue: '00-50-56-A1-3F-2C',
      description: 'Synthetic host MAC',
    },
    {
      name: 'vcenter_id',
      defaultValue: '7c49a8e2c6244517b5572cfd43e91a0a',
      description: 'Stable host ID',
    },
    {
      name: 'datacenter',
      defaultValue: 'DC-East',
      description: 'Datacenter in vCenter events',
    },
    {
      name: 'domain',
      defaultValue: String.raw`VSPHERE.LOCAL`,
      description: 'SSO domain',
    },
    {
      name: 'agent_id',
      defaultValue: '5096d7cc-1e4b-4959-abea-7355be2913a7',
      description: 'Stable collector ID',
    },
    {
      name: 'agent_ephemeral_id',
      defaultValue: 'c4a1df82-7a9c-4a3e-8546-6d7cc04538e6',
      description: 'Collector session ID',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Filebeat version in ECS envelope',
    },
    {
      name: 'attack_ip',
      defaultValue: '10.99.6.44',
      description: 'Source of the correlated login attempts',
    },
    {
      name: 'attack_user',
      defaultValue: 'Administrator',
      description: 'SSO account that logs in',
    },
    {
      name: 'granted_principal',
      defaultValue: String.raw`VSPHERE.LOCAL\svc_backup`,
      description: 'Recipient of Administrator permission',
    },
    {
      name: 'critical_vm',
      defaultValue: 'prod-db-01',
      description: 'VM reconfigured and powered off',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit the chain; `false` emits only routine events',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS version in output',
    },
  ],
  sampleOutputs: [
    {
      title: 'PermissionAddedEvent: Administrator role granted',
      json: String.raw`{"@timestamp": "2026-09-25T10:42:40+00:00", "agent": {"ephemeral_id": "c4a1df82-7a9c-4a3e-8546-6d7cc04538e6", "id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "name": "vcsa01.lab.example", "type": "filebeat", "version": "8.17.0"}, "data_stream": {"dataset": "vsphere.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "elastic_agent": {"id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "snapshot": false, "version": "8.17.0"}, "event": {"action": "permission-added", "agent_id_status": "verified", "category": ["iam"], "dataset": "vsphere.log", "id": "576047", "ingested": "2026-09-25T10:42:40+00:00", "kind": "event", "original": "\u003c14\u003e1 2026-09-25T10:42:40+00:00 vcsa01.lab.example vpxd 58650 - -  Event [576047] [1-1] [2026-09-25T10:42:40.000000Z] [vim.event.PermissionAddedEvent] [info] [VSPHERE.LOCAL\\Administrator] [DC-East] [576047] [Permission added for VSPHERE.LOCAL\\svc_backup on DC-East with role Administrator by VSPHERE.LOCAL\\Administrator]", "outcome": "success", "timezone": "+00:00", "type": ["change"]}, "host": {"architecture": "x86_64", "containerized": false, "hostname": "vcsa01.lab.example", "id": "7c49a8e2c6244517b5572cfd43e91a0a", "ip": ["10.40.0.10"], "mac": ["00-50-56-A1-3F-2C"], "name": "vcsa01.lab.example", "os": {"family": "linux", "kernel": "5.10.0", "name": "VMware Photon OS", "platform": "photon", "type": "linux", "version": "5.0"}}, "input": {"type": "udp"}, "log": {"level": "info", "logger": "vim.event.PermissionAddedEvent", "source": {"address": "10.40.0.10:59146"}, "syslog": {"priority": 14}}, "message": "Permission added for VSPHERE.LOCAL\\svc_backup on DC-East with role Administrator by VSPHERE.LOCAL\\Administrator", "process": {"name": "vpxd", "pid": 58650}, "related": {"user": ["Administrator", "svc_backup"]}, "tags": ["preserve_original_event", "vmware-sphere"], "user": {"domain": "VSPHERE.LOCAL", "name": "Administrator"}, "vsphere": {"event": {"class": "vim.event.PermissionAddedEvent", "created_time": "2026-09-25T10:42:40.000000Z", "key": 576047, "permission": {"entity": "DC-East", "principal": "VSPHERE.LOCAL\\svc_backup", "role": "Administrator"}, "user_name": "VSPHERE.LOCAL\\Administrator"}}}`,
    },
  ],
};
