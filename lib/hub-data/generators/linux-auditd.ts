import type { GeneratorMeta } from '@/lib/hub-types';

export const linuxAuditd: GeneratorMeta = {
    slug: 'linux-auditd',
    displayName: 'Linux Auditd',
    category: 'endpoint',
    description:
      'Linux audit framework (auditd) — syscall tracing (execve, openat, connect), PAM authentication, credential changes, user login/logout, sudo privilege escalation, and systemd service management.',
    format: ['JSON', 'ECS'],
    dataSource: 'Linux Audit Framework (auditd)',
    eventCount: 10,
    templateCount: 10,
    highlights: [
      '50-host fleet',
      'Correlated auth flow',
      'Process trees',
      'SELinux context',
    ],
    generatorId: 'auditd',
    eventTypes: [
      {
        id: 'SYSCALL-execve',
        description: 'Process execution (execve)',
        frequency: '~29%',
        category: 'process',
      },
      {
        id: 'SYSCALL-openat',
        description: 'File access (openat)',
        frequency: '~23%',
        category: 'file',
      },
      {
        id: 'SYSCALL-connect',
        description: 'Network connection (connect)',
        frequency: '~12%',
        category: 'network',
      },
      {
        id: 'USER_AUTH',
        description: 'PAM authentication',
        frequency: '~9%',
        category: 'authentication',
      },
      {
        id: 'CRED_ACQ',
        description: 'Credential acquisition',
        frequency: '~8%',
        category: 'authentication',
      },
      {
        id: 'CRED_DISP',
        description: 'Credential disposal',
        frequency: '~8%',
        category: 'authentication',
      },
      {
        id: 'USER_LOGIN',
        description: 'User login',
        frequency: '~5%',
        category: 'authentication',
      },
      {
        id: 'USER_CMD',
        description: 'Sudo command execution',
        frequency: '~3%',
        category: 'process',
      },
      {
        id: 'SERVICE_START',
        description: 'Systemd service start',
        frequency: '~2%',
        category: 'process',
      },
      {
        id: 'SERVICE_STOP',
        description: 'Systemd service stop',
        frequency: '~2%',
        category: 'process',
      },
    ],
    realismFeatures: [
      'Correlated authentication flow — USER_AUTH → CRED_ACQ → USER_LOGIN → CRED_DISP using shared session pools',
      'Correlated services — SERVICE_START creates entries consumed by SERVICE_STOP',
      '50-host fleet — web servers, app servers, databases with per-host OS metadata (Debian, Ubuntu, Rocky Linux)',
      '30 common Linux processes with correct parent-child relationships and arguments',
      'Multiple auth methods — sshd (40%), sudo (30%), cron (15%), su (10%), login (5%)',
      'Failure simulation — auth failures (15%), login failures (20%), execve non-zero exits (10%)',
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
        description: 'Auditbeat version string',
      },
    ],
    sampleOutputs: [
      {
        title: 'SYSCALL (execve) — Process Execution',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "event": {
        "action": "executed",
        "category": ["process"],
        "module": "auditd",
        "outcome": "success"
    },
    "process": {
        "args": ["cat", "/etc/hostname"],
        "executable": "/usr/bin/cat",
        "name": "cat",
        "parent": { "executable": "/usr/bin/bash", "name": "bash" }
    },
    "user": {
        "audit": { "name": "jsmith" },
        "name": "root"
    },
    "auditd": { "message_type": "syscall", "result": "success" }
}`,
      },
    ],
  };
