import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationProxmoxVe: GeneratorMeta = {
  slug: 'virtualization-proxmox-ve',
  displayName: 'Proxmox VE access and pveam logs',
  category: 'virtualization',
  description:
    'Proxmox VE 7.x lines from the pveproxy API access log and the pveam appliance index update log, as native text in event.original with ECS fields, for testing detections of API login abuse and VM power changes on one node. Nine API clients run independent sessions against twelve VMs with tracked power state. Recurring episodes show three denied ticket logins, a successful one and a VM stop from one address.',
  dataSource:
    'Proxmox VE 7.x pveproxy /var/log/pveproxy/access.log and /var/log/pveam.log',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 12,
  templateCount: 1,
  highlights: [
    'Native access.log and pveam.log lines in event.original',
    'Nine API clients with independent sessions on 12 tracked VMs',
    'Recurring denied-logins-then-VM-stop chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due one anomaly_interval_hours (default 24) after the generator starts, each next one interval after the previous actual start; at each due time the start waits a random delay of up to min(30 min, interval / 8) and then for an idle power-capable client whose own next login is more than an hour away, and missed episodes are not replayed. One client address gets three HTTP 401 ticket responses and one HTTP 200, then as that user makes zero to four reads and a stop request on a running VM (37-279 s from the first denial measured); the session continues like any other and the VM is started again later by a logged-in power user. Client and VM differ from the previous episode; every step occurs in background, where an ordinary stop that would complete the sequence within 30 minutes is replaced by a read.',
  generatorId: 'proxmox',
  eventTypes: [
    {
      id: 'api-read',
      description: 'Authenticated GET of cluster, node or VM data',
      frequency: '94.59% measured share',
      category: 'web',
    },
    {
      id: 'ticket-issued',
      description: 'Ticket request answered with HTTP 200 (login or renewal)',
      frequency: '3.19% measured share',
      category: 'authentication',
    },
    {
      id: 'ticket-denied',
      description: 'Ticket request answered with HTTP 401',
      frequency: '0.75% measured share',
      category: 'authentication',
    },
    {
      id: 'vm-start-request',
      description: 'VM start request',
      frequency: '0.52% measured share',
      category: 'host',
    },
    {
      id: 'vm-shutdown-request',
      description: 'VM shutdown request',
      frequency: '0.29% measured share',
      category: 'host',
    },
    {
      id: 'vm-stop-request',
      description: 'VM stop request',
      frequency: '0.24% measured share',
      category: 'host',
    },
    {
      id: 'vm-reboot-request',
      description: 'VM reboot request',
      frequency: '0.11% measured share',
      category: 'host',
    },
    {
      id: 'pveam-signature-verification',
      description: 'gpgv output lines',
      frequency: '0.11% measured share',
      category: 'package',
    },
    {
      id: 'pveam-download-start',
      description: 'Signature or index file download started',
      frequency: '0.07% measured share',
      category: 'package',
    },
    {
      id: 'pveam-download-finished',
      description: 'Download finished with 200 OK',
      frequency: '0.07% measured share',
      category: 'package',
    },
    {
      id: 'pveam-update-successful',
      description: 'Update successful, once per index source',
      frequency: '0.04% measured share',
      category: 'package',
    },
    {
      id: 'pveam-update-start',
      description: 'Index update started',
      frequency: '0.02% measured share',
      category: 'package',
    },
  ],
  realismFeatures: [
    'Nine API clients run independent random sessions: ticket logins with occasional mistyped passwords and give-ups, ticket renewals, GUI/API reads, and VM start, stop, shutdown and reboot requests against twelve VMs whose power state is tracked; a monitoring API token polls without tickets. Measured volume is 27,231 events in 120 hours; rates and session lengths are synthetic, as Proxmox publishes no frequency data.',
    'Access lines follow log_request in pve-http-server, with IPv4 clients shown as ::ffff:a.b.c.d, and ticket requests log - as the user because pveproxy fills it only after authentication. Power request sizes are the exact length of the returned task UPID, ticket and read sizes are synthetic, and the 13-byte 401 body matches a 2023 forum capture; releases since January 2025 log a larger size.',
    'The daily pveam index update runs between 01:00 and 06:00 host time as the 17-line 7.x sequence from APLInfo.pm and a 2022 user log: both index sources, gpgv output and one update successful per source. Failures are not modeled, current releases use sqv and newer index files, and pveam timestamps are assumed to be UTC.',
    'Ordinary traffic in both modes holds one to five denied logins by one address (about seven runs of three or more per day), give-ups, renewal failures, successful logins followed by power requests and stops by every chain user. A 401 on the ticket endpoint can also be an expired-ticket renewal, and HTTP 200 on a stop means the task was queued, not that the VM halted.',
    'Not modeled: web GUI logins through /api2/extjs/access/ticket, API token creation, console and websocket traffic, the pvedaemon syslog lines naming the user of a failed login, and task-status polling. One node, no cluster; timestamps keep one-second resolution, with at most one event per one-second input tick.',
  ],
  parameters: [
    {
      name: 'node_name',
      defaultValue: 'pve-01',
      description: 'Node name in API paths, task UPIDs and host.name',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring anomaly chain episodes to the background; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episode due times, each due one interval after the previous actual start; 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'VM stop request of an episode',
      json: String.raw`{"@timestamp": "2026-09-21T00:06:36+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "vm-stop-request", "category": ["host"], "kind": "event", "original": "::ffff:10.20.1.22 - backup-ops@pve [21/09/2026:00:06:36 +0000] \"POST /api2/json/nodes/pve-01/qemu/110/status/stop HTTP/1.1\" 200 76", "outcome": "success", "type": ["change"]}, "host": {"name": "pve-01"}, "http": {"request": {"method": "POST"}, "response": {"body": {"bytes": 76}, "status_code": 200}, "version": "1.1"}, "log": {"file": {"path": "/var/log/pveproxy/access.log"}}, "proxmox": {"access": {"username": "backup-ops@pve"}}, "related": {"ip": ["10.20.1.22"], "user": ["backup-ops@pve"]}, "source": {"ip": "10.20.1.22"}, "url": {"path": "/api2/json/nodes/pve-01/qemu/110/status/stop"}, "user": {"name": "backup-ops@pve"}}`,
    },
  ],
};
