import type { GeneratorMeta } from '@/lib/hub-types';

export const linuxSyslog: GeneratorMeta = {
  slug: 'linux-syslog',
  displayName: 'Linux Syslog',
  category: 'endpoint',
  description:
    'Linux syslog (RFC 3164) — SSH authentication, sudo/su privilege escalation, cron jobs, systemd service lifecycle, kernel messages, UFW firewall, PAM, DHCP, Postfix mail, and package management from rsyslog/syslog-ng.',
  format: ['JSON', 'ECS'],
  dataSource: 'Linux Syslog (system integration)',
  eventCount: 13,
  templateCount: 13,
  highlights: [
    '15-host fleet',
    'RFC 3164 event.original',
    'SSH session correlation',
    '13 syslog daemons',
  ],
  generatorId: 'syslog',
  eventTypes: [
    {
      id: 'sshd-auth',
      description: 'SSH authentication (publickey, password, failed, invalid user)',
      frequency: '~17%',
      category: 'authentication',
    },
    {
      id: 'systemd-lifecycle',
      description: 'Service started, stopped, and failed',
      frequency: '~17%',
      category: 'process',
    },
    {
      id: 'cron',
      description: 'Cron job execution',
      frequency: '~14%',
      category: 'process',
    },
    {
      id: 'sudo',
      description: 'Sudo command execution and auth failure',
      frequency: '~11%',
      category: 'process',
    },
    {
      id: 'sshd-session',
      description: 'SSH session opened, closed, disconnect',
      frequency: '~8%',
      category: 'session',
    },
    {
      id: 'kernel-generic',
      description: 'Filesystem, device, OOM, and misc kernel messages',
      frequency: '~7%',
      category: 'host',
    },
    {
      id: 'pam',
      description: 'PAM session and authentication across services',
      frequency: '~6%',
      category: 'authentication',
    },
    {
      id: 'kernel-firewall',
      description: 'UFW BLOCK/ALLOW firewall messages',
      frequency: '~5%',
      category: 'network',
    },
    {
      id: 'postfix',
      description: 'SMTP delivery, connect, and disconnect',
      frequency: '~5%',
      category: 'email',
    },
    {
      id: 'dhcp',
      description: 'DHCPACK, DHCPREQUEST, DHCPDISCOVER',
      frequency: '~3%',
      category: 'network',
    },
    {
      id: 'package-mgmt',
      description: 'dpkg/apt install, configure, remove',
      frequency: '~3%',
      category: 'package',
    },
    {
      id: 'su',
      description: 'su privilege escalation',
      frequency: '~2%',
      category: 'authentication',
    },
    {
      id: 'rsyslog',
      description: 'rsyslog internal and logrotate messages',
      frequency: '~1%',
      category: 'host',
    },
  ],
  realismFeatures: [
    'RFC 3164 syslog lines in event.original with correct PRI values (facility * 8 + severity)',
    'Correlated SSH sessions — sshd-auth pushes sessions consumed by sshd-session for close/disconnect',
    'Correlated systemd lifecycle — service start creates entries consumed by service stop',
    '15-host fleet with OS-specific log paths (/var/log/syslog for Debian, /var/log/messages for Rocky)',
    'Per-host monotonic log.offset counters simulating file byte positions',
    'Realistic failure rates — SSH auth (20%), sudo (15%), systemd (15%), su (20%)',
  ],
  parameters: [
    {
      name: 'fqdn_suffix',
      defaultValue: 'example.com',
      description: 'Domain suffix appended to hostname',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Filebeat version string',
    },
    {
      name: 'network_prefix',
      defaultValue: '10.1',
      description: 'Internal network prefix for IPs and firewall rules',
    },
  ],
  sampleOutputs: [
    {
      title: 'SSH Authentication (Accepted publickey)',
      json: `{
    "@timestamp": "2026-03-06T14:33:01.000000+00:00",
    "event": {
        "original": "<86>Mar  6 14:33:01 web-01 sshd[12345]: Accepted publickey for jsmith from 10.1.3.5 port 52341 ssh2",
        "dataset": "system.syslog",
        "module": "system",
        "kind": "event",
        "category": ["authentication"],
        "type": ["info"]
    },
    "message": "Accepted publickey for jsmith from 10.1.3.5 port 52341 ssh2",
    "host": { "hostname": "web-01" },
    "process": { "name": "sshd", "pid": 12345 },
    "source": { "ip": "10.1.3.5", "port": 52341 },
    "user": { "name": "jsmith" },
    "system": { "syslog": {} }
}`,
    },
    {
      title: 'Systemd Service Started',
      json: `{
    "@timestamp": "2026-03-06T14:35:12.000000+00:00",
    "event": {
        "original": "<30>Mar  6 14:35:12 app-02 systemd[1]: Started OpenBSD Secure Shell server.",
        "dataset": "system.syslog",
        "module": "system",
        "kind": "event",
        "category": ["process"],
        "type": ["start"]
    },
    "message": "Started OpenBSD Secure Shell server.",
    "host": { "hostname": "app-02" },
    "process": { "name": "systemd", "pid": 1 },
    "system": { "syslog": {} }
}`,
    },
  ],
};
