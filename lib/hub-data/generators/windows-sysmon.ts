import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsSysmon: GeneratorMeta = {
    slug: 'windows-sysmon',
    displayName: 'Windows Sysmon',
    category: 'endpoint',
    description:
      'Sysmon (System Monitor) operational channel — process creation with full command lines, network connections, file creates, registry modifications, DNS queries, and WMI events. SwiftOnSecurity-style tuning.',
    format: ['JSON', 'ECS'],
    dataSource: 'Windows Event Log — Sysmon/Operational',
    eventCount: 15,
    templateCount: 15,
    highlights: [
      'Process lifecycle correlation',
      '15 event types',
      '120-host fleet',
      'PE metadata and hashes',
    ],
    generatorId: 'sysmon',
    eventTypes: [
      {
        id: '11',
        description: 'File Created',
        frequency: '~25%',
        category: 'file',
      },
      {
        id: '13',
        description: 'Registry Value Set',
        frequency: '~20%',
        category: 'registry',
      },
      {
        id: '22',
        description: 'DNS Query',
        frequency: '~15%',
        category: 'network',
      },
      {
        id: '1',
        description: 'Process Create',
        frequency: '~12%',
        category: 'process',
      },
      {
        id: '5',
        description: 'Process Terminated',
        frequency: '~10%',
        category: 'process',
      },
      {
        id: '3',
        description: 'Network Connection',
        frequency: '~8%',
        category: 'network',
      },
      {
        id: '12',
        description: 'Registry Create/Delete',
        frequency: '~3%',
        category: 'registry',
      },
      {
        id: '15',
        description: 'FileCreateStreamHash',
        frequency: '~2%',
        category: 'file',
      },
      {
        id: '23',
        description: 'File Delete (Archived)',
        frequency: '~1.5%',
        category: 'file',
      },
      {
        id: '26',
        description: 'File Delete (Logged)',
        frequency: '~1%',
        category: 'file',
      },
      {
        id: '17',
        description: 'Named Pipe Created',
        frequency: '~0.5%',
        category: 'file',
      },
      {
        id: '18',
        description: 'Named Pipe Connected',
        frequency: '~0.5%',
        category: 'file',
      },
      {
        id: '25',
        description: 'Process Tampering',
        frequency: '~0.5%',
        category: 'process',
      },
      {
        id: '6',
        description: 'Driver Loaded',
        frequency: 'rare',
        category: 'driver',
      },
      {
        id: '8',
        description: 'CreateRemoteThread',
        frequency: 'rare',
        category: 'process',
      },
    ],
    realismFeatures: [
      'Process lifecycle correlation — Event 1 stores processes; Event 5 consumes with consistent ProcessGuid, PID, Image',
      'Process-to-activity linkage — DNS, file, network events reference active processes from the pool',
      '25 Windows processes with correct parent-child relationships, PE metadata, and file hashes',
      '30 real-world DNS domains with CNAME chains, resolved IPs, and NXDOMAIN distribution',
      'Registry path diversity — HKLM/HKU paths covering services, security, Explorer, Defender',
      '120-host fleet with per-host record IDs and per-host process pool correlation',
    ],
    parameters: [
      {
        name: 'domain',
        defaultValue: 'CONTOSO',
        description: 'NetBIOS domain name',
      },
      {
        name: 'fqdn_suffix',
        defaultValue: 'contoso.local',
        description: 'DNS domain suffix',
      },
      {
        name: 'domain_sid',
        defaultValue: 'S-1-5-21-3457937927-...',
        description: 'Domain SID prefix',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Agent version string',
      },
    ],
    sampleOutputs: [
      {
        title: 'Event 1 — Process Create',
        json: `{
    "@timestamp": "2026-02-21T14:30:22.150000+00:00",
    "event": {
        "action": "Process creation",
        "category": ["process"],
        "code": "1",
        "module": "sysmon",
        "type": ["start"]
    },
    "process": {
        "executable": "C:\\\\Windows\\\\System32\\\\svchost.exe",
        "name": "svchost.exe",
        "pid": 6228,
        "parent": {
            "executable": "C:\\\\Windows\\\\System32\\\\services.exe",
            "name": "services.exe"
        }
    },
    "user": { "domain": "NT AUTHORITY", "name": "SYSTEM" },
    "winlog": {
        "channel": "Microsoft-Windows-Sysmon/Operational",
        "event_id": "1"
    }
}`,
      },
    ],
  };
