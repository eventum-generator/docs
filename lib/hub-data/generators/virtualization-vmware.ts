/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationVmware: GeneratorMeta = {
  slug: 'virtualization-vmware',
  displayName: 'VMware vCenter vpxd Events',
  category: 'virtualization',
  description:
    "VMware vCenter Server 8.0 vpxd events forwarded over RFC 5424 syslog and indexed by the Elastic VMware vSphere integration (vsphere.log): API logins and logouts, failed SSO logins, VM power and reconfiguration, and permission changes, with the native syslog line in event.original. About 8,100 records a day from one vCenter: four service accounts around the clock and eight staff accounts on a UTC working day. Recurring episodes show three to five failed SSO logins for one administrator, then that administrator's login and an Admin permission grant.",
  dataSource:
    'VMware vCenter Server 8.0 vpxd events over remote syslog (RFC 5424, UDP), Elastic VMware vSphere integration (vsphere.log)',
  format: ['JSON', 'ECS', 'RFC 5424'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native vpxd syslog line in event.original',
    'About 8,100 records a day from 4 service and 8 staff accounts',
    'Recurring failed-login, login and Admin-grant chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One administrator has three to five failed SSO logins from their own address, seconds apart, then logs in from the same address and, as the first operation of that session, creates a permission with role Admin for a principal on an inventory object; the session continues like any administrator session and ends with a logout. The first failure and the grant are typically 1-8 minutes apart, always within 30 minutes. An episode's five to ten records take the place of as many ordinary records, so the volume and hour curve do not change, and its Admin grant is removed after the usual lease (median 36 hours). anomaly_interval_hours (default 24, 6 to 8,760) is counted in event time. The first episode starts within the first min(interval, 24 h); each later one is due one interval after the actual start of the previous one and starts within a window of min(interval / 4, 6 h) centred on that time, mostly in office hours. Missed time is never caught up. Consecutive starts are 21-27 h apart at the default; at 8 h or less they cover the whole clock, night included. The administrator and the principal differ from the previous episode's. Failed logins of every administrator, runs of three or more failures followed by a login, and Admin grants by all four administrators also occur in ordinary traffic; only the full sequence is episode-only.",
  generatorId: 'vmware',
  eventTypes: [
    {
      id: 'vim.event.UserLoginSessionEvent',
      description: 'API session opened',
      frequency: '49.26% of records',
      category: 'authentication',
    },
    {
      id: 'vim.event.UserLogoutSessionEvent',
      description: 'Session closed, with login time and number of API calls',
      frequency: '49.24% of records',
      category: 'authentication',
    },
    {
      id: 'vim.event.VmPoweredOffEvent',
      description: 'VM powered off',
      frequency: '0.55% of records',
      category: 'host',
    },
    {
      id: 'vim.event.VmPoweredOnEvent',
      description: 'The same VM powered on again',
      frequency: '0.55% of records',
      category: 'host',
    },
    {
      id: 'vim.event.VmReconfiguredEvent',
      description: 'numCPU or memoryMB changed while the VM is off',
      frequency: '0.17% of records',
      category: 'configuration',
    },
    {
      id: 'vim.event.EventEx',
      description: 'Failed SSO login: wrong password for a staff account',
      frequency: '0.11% of records',
      category: 'authentication',
    },
    {
      id: 'vim.event.PermissionAddedEvent',
      description: 'Temporary permission created',
      frequency: '0.08% of records',
      category: 'iam',
    },
    {
      id: 'vim.event.PermissionRemovedEvent',
      description: 'Expired permission removed',
      frequency: '0.04% of records',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'One vCenter manages one datacenter with twelve VMs on three ESXi hosts. Four service accounts log in and out every few seconds to minutes: a monitoring poller about 2,300 times a day, a metrics collector about 970, an orchestration account about 390 and a backup account about 200. Eight staff accounts (four administrators, two helpdesk operators, two developers) log in about 3-17 times a day each, administrators most.',
    'About 8,100 records a day, ±3% from day to day: about 7,900 from service accounts at a flat rate and about 220 from staff, 90% of them at 07-17 UTC, 6% at 06-07 and 17-19 and 4% at night. The hour curve repeats every day, with no weekly cycle.',
    'Staff sessions last a median 10-12 minutes (90th percentile about 30); monitoring poller sessions a median 14 s, metrics collector sessions about 2 minutes, backup sessions about 10 minutes. Records of one session are seconds to minutes apart rather than milliseconds, and logout records carry the login time, duration and number of API calls.',
    '7% of staff sessions start with one to five wrong passwords, each extra failure rarer than the previous one, and 12% of those end without a login; service accounts never fail. Runs of three or more failures before a login occur a few times a week in ordinary traffic.',
    'Administrators and operators power-cycle VMs or change numCPU or memoryMB one step while the VM is off, developers power-cycle test and batch VMs, and every VM powered off is powered on again in the same session. About six temporary grants a day (one or two of them Admin) give five internal role names to eight principals on the datacenter, two clusters, three folders or two VMs; each is removed after a median 36 hours (2 hours to 14 days), with at most one permission per principal and entity.',
    'Logins and logouts carry the user, source address and user agent fields the Elastic vSphere pipeline derives, failed SSO logins user.name and source.ip. For VM and permission events the pipeline only splits the syslog envelope, so the acting account, VM and principal stay in message and event.original; their wording follows the vCenter event catalog rather than a recorded vCenter log, and reconfiguration is written on one line with CPU and memory changes only.',
    'Only eight vpxd event classes are present; tasks, alarms, host and cluster events are not. Every account uses one fixed address and user agent Go-http-client/1.1, and the collector fields describe a synthetic Elastic Agent. With anomalies on, runs of three or more failures before a login are about one a day more frequent and Admin grants rise to two or three a day.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit recurring anomaly episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Interval between episodes in event time, 6 to 8,760 hours',
    },
    {
      name: 'vcenter_host',
      defaultValue: 'vcsa01.lab.example',
      description: 'vCenter hostname in the syslog header (host.name)',
    },
    {
      name: 'vcenter_ip',
      defaultValue: '10.40.0.10',
      description:
        'Address the syslog datagrams come from (log.source.address)',
    },
    {
      name: 'datacenter',
      defaultValue: 'DC-East',
      description: 'Datacenter name in VM and permission messages',
    },
    {
      name: 'sso_domain',
      defaultValue: 'VSPHERE.LOCAL',
      description: 'SSO domain of all accounts and principals',
    },
    {
      name: 'collector_name',
      defaultValue: 'log-collector-01.lab.example',
      description: 'Elastic Agent host (agent.name, host.hostname)',
    },
    {
      name: 'collector_ip',
      defaultValue: '10.40.0.50',
      description: 'Elastic Agent host address',
    },
    {
      name: 'collector_mac',
      defaultValue: '00-50-56-A1-7B-10',
      description: 'Elastic Agent host MAC address',
    },
    {
      name: 'collector_host_id',
      defaultValue: '3f0b6c1e2d9a4c7f8e5b1a2d3c4e5f60',
      description: 'Elastic Agent host id',
    },
    {
      name: 'agent_id',
      defaultValue: '5096d7cc-1e4b-4959-abea-7355be2913a7',
      description: 'Elastic Agent id',
    },
    {
      name: 'agent_ephemeral_id',
      defaultValue: 'c4a1df82-7a9c-4a3e-8546-6d7cc04538e6',
      description: 'Elastic Agent ephemeral id',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Elastic Agent version',
    },
  ],
  sampleOutputs: [
    {
      title: 'First failed SSO login of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T11:00:13.646Z", "agent": {"ephemeral_id": "c4a1df82-7a9c-4a3e-8546-6d7cc04538e6", "id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "name": "log-collector-01.lab.example", "type": "filebeat", "version": "8.17.0"}, "client": {"ip": "10.40.3.22"}, "data_stream": {"dataset": "vsphere.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "elastic_agent": {"id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "snapshot": false, "version": "8.17.0"}, "event": {"agent_id_status": "verified", "category": ["authentication"], "dataset": "vsphere.log", "id": "674988", "ingested": "2026-09-01T11:00:14Z", "kind": "event", "original": "\u003c14\u003e1 2026-09-01T11:00:13.646579+00:00 vcsa01.lab.example vpxd 36683 - -  Event [674988] [1-1] [2026-09-01T11:00:13.646479Z] [vim.event.EventEx] [info] [ops.petrova] [] [674988] [Failed login ops.petrova from 10.40.3.22 at 09/01/2026 11:00:13 GMT in SSO]", "outcome": "failure", "timezone": "+00:00", "type": ["info"]}, "host": {"architecture": "x86_64", "containerized": false, "hostname": "log-collector-01.lab.example", "id": "3f0b6c1e2d9a4c7f8e5b1a2d3c4e5f60", "ip": ["10.40.0.50"], "mac": ["00-50-56-A1-7B-10"], "name": "vcsa01.lab.example", "os": {"codename": "jammy", "family": "debian", "kernel": "5.15.0-122-generic", "name": "Ubuntu", "platform": "ubuntu", "type": "linux", "version": "22.04.5 LTS (Jammy Jellyfish)"}}, "input": {"type": "udp"}, "log": {"level": "info", "logger": "vim.event.EventEx", "source": {"address": "10.40.0.10:59236"}, "syslog": {"facility": {"code": 1, "name": "User"}, "priority": 14, "severity": {"code": 6, "name": "Informational"}}}, "message": "[ops.petrova] [] [674988] [Failed login ops.petrova from 10.40.3.22 at 09/01/2026 11:00:13 GMT in SSO]", "process": {"name": "vpxd", "pid": 36683}, "related": {"ip": ["10.40.3.22"]}, "source": {"ip": "10.40.3.22"}, "tags": ["preserve_original_event", "vmware-sphere"], "user": {"name": "ops.petrova"}}`,
    },
    {
      title: 'Admin grant of the same episode',
      json: String.raw`{"@timestamp": "2026-09-01T11:06:41.733Z", "agent": {"ephemeral_id": "c4a1df82-7a9c-4a3e-8546-6d7cc04538e6", "id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "name": "log-collector-01.lab.example", "type": "filebeat", "version": "8.17.0"}, "data_stream": {"dataset": "vsphere.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "elastic_agent": {"id": "5096d7cc-1e4b-4959-abea-7355be2913a7", "snapshot": false, "version": "8.17.0"}, "event": {"agent_id_status": "verified", "dataset": "vsphere.log", "id": "675058", "ingested": "2026-09-01T11:06:43Z", "kind": "event", "original": "\u003c14\u003e1 2026-09-01T11:06:41.733321+00:00 vcsa01.lab.example vpxd 36683 - -  Event [675058] [1-1] [2026-09-01T11:06:41.73214Z] [vim.event.PermissionAddedEvent] [info] [VSPHERE.LOCAL\\ops.petrova] [DC-East] [675058] [Permission created for VSPHERE.LOCAL\\contractor.lee on Cluster-Dev, role is Admin, propagation is Enabled]", "timezone": "+00:00"}, "host": {"architecture": "x86_64", "containerized": false, "hostname": "log-collector-01.lab.example", "id": "3f0b6c1e2d9a4c7f8e5b1a2d3c4e5f60", "ip": ["10.40.0.50"], "mac": ["00-50-56-A1-7B-10"], "name": "vcsa01.lab.example", "os": {"codename": "jammy", "family": "debian", "kernel": "5.15.0-122-generic", "name": "Ubuntu", "platform": "ubuntu", "type": "linux", "version": "22.04.5 LTS (Jammy Jellyfish)"}}, "input": {"type": "udp"}, "log": {"level": "info", "logger": "vim.event.PermissionAddedEvent", "source": {"address": "10.40.0.10:59236"}, "syslog": {"facility": {"code": 1, "name": "User"}, "priority": 14, "severity": {"code": 6, "name": "Informational"}}}, "message": "[VSPHERE.LOCAL\\ops.petrova] [DC-East] [675058] [Permission created for VSPHERE.LOCAL\\contractor.lee on Cluster-Dev, role is Admin, propagation is Enabled]", "process": {"name": "vpxd", "pid": 36683}, "tags": ["preserve_original_event", "vmware-sphere"]}`,
    },
  ],
};
