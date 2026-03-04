import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsPowershell: GeneratorMeta = {
    slug: 'windows-powershell',
    displayName: 'Windows PowerShell',
    category: 'endpoint',
    description:
      'PowerShell classic and operational channels — engine lifecycle, script block logging, module invocations, pipeline execution, and provider starts. Includes obfuscated command detection and suspicious script patterns.',
    format: ['JSON', 'ECS'],
    dataSource: 'Windows Event Log — PowerShell channels',
    eventCount: 8,
    templateCount: 8,
    highlights: [
      'Script block logging',
      'Session correlation',
      'Suspicious content flagging',
      '120-host fleet',
    ],
    generatorId: 'pslog',
    eventTypes: [
      {
        id: '4104',
        description: 'Script Block Logging',
        frequency: '~30%',
        category: 'process',
      },
      {
        id: '4103',
        description: 'Module Logging — cmdlet invocation',
        frequency: '~30%',
        category: 'process',
      },
      {
        id: '400',
        description: 'Engine State → Available',
        frequency: '~8%',
        category: 'process',
      },
      {
        id: '403',
        description: 'Engine State → Stopped',
        frequency: '~8%',
        category: 'process',
      },
      {
        id: '600',
        description: 'Provider Started',
        frequency: '~8%',
        category: 'process',
      },
      {
        id: '800',
        description: 'Pipeline Execution Details',
        frequency: '~8%',
        category: 'process',
      },
      {
        id: '4105',
        description: 'Script Block Invocation Start',
        frequency: '~4%',
        category: 'process',
      },
      {
        id: '4106',
        description: 'Script Block Invocation Stop',
        frequency: '~4%',
        category: 'process',
      },
    ],
    realismFeatures: [
      'Session correlation — Engine start (400) produces sessions consumed by engine stop (403)',
      'Script block correlation — 4104 produces block IDs referenced by 4105/4106 invocation events',
      '~15% of script blocks flagged as warning level (encoded commands, reflection APIs, crypto)',
      '30 cmdlets with realistic frequency weights (Get-Process, Get-Service dominate)',
      'Host application variety — powershell.exe (55%), pwsh.exe (20%), PSRemoting (15%), ISE (10%)',
      '120-host fleet with per-host record IDs and correlation pools',
    ],
    parameters: [
      {
        name: 'domain',
        defaultValue: 'CONTOSO',
        description: 'Active Directory domain name',
      },
      {
        name: 'fqdn_suffix',
        defaultValue: 'contoso.local',
        description: 'FQDN suffix',
      },
      {
        name: 'domain_sid',
        defaultValue: 'S-1-5-21-3457937927-...',
        description: 'Domain SID prefix',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Winlogbeat version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Event 4104 — Script Block Logging',
        json: `{
    "@timestamp": "2026-02-22T17:04:03+00:00",
    "event": {
        "category": ["process"],
        "code": "4104",
        "kind": "event",
        "module": "powershell",
        "provider": "Microsoft-Windows-PowerShell"
    },
    "powershell": {
        "file": {
            "script_block_id": "948808fd-...",
            "script_block_text": "Restart-Service -Name Spooler -Force"
        }
    },
    "user": { "domain": "CONTOSO", "name": "mjohnson" },
    "winlog": {
        "channel": "Microsoft-Windows-PowerShell/Operational",
        "event_id": "4104"
    }
}`,
      },
    ],
  };
