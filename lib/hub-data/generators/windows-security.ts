import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsSecurity: GeneratorMeta = {
    slug: 'windows-security',
    displayName: 'Windows Security Event Log',
    category: 'endpoint',
    description:
      'The Security channel of Windows Event Log — logon/logoff sessions, process creation, privilege escalation, account management, and audit policy changes from a 120-host Active Directory fleet.',
    format: ['JSON', 'ECS'],
    dataSource: 'Windows Event Log — Security channel',
    eventCount: 12,
    templateCount: 12,
    highlights: [
      '120-host fleet',
      'Correlated sessions',
      '30 process trees',
      'Per-host record IDs',
    ],
    generatorId: 'winlog',
    eventTypes: [
      {
        id: '4688',
        description: 'Process Creation',
        frequency: '~25%',
        category: 'process',
      },
      {
        id: '4689',
        description: 'Process Termination',
        frequency: '~25%',
        category: 'process',
      },
      {
        id: '4624',
        description: 'Successful Logon',
        frequency: '~15%',
        category: 'authentication',
      },
      {
        id: '4634',
        description: 'Logoff',
        frequency: '~14%',
        category: 'authentication',
      },
      {
        id: '4672',
        description: 'Special Privileges Assigned',
        frequency: '~10%',
        category: 'iam',
      },
      {
        id: '4625',
        description: 'Failed Logon',
        frequency: '~5%',
        category: 'authentication',
      },
      {
        id: '4648',
        description: 'Explicit Credential Logon',
        frequency: '~3%',
        category: 'authentication',
      },
      {
        id: '4697',
        description: 'Service Installed',
        frequency: 'rare',
        category: 'iam, configuration',
      },
      {
        id: '4720',
        description: 'User Account Created',
        frequency: 'rare',
        category: 'iam',
      },
      {
        id: '4726',
        description: 'User Account Deleted',
        frequency: 'rare',
        category: 'iam',
      },
      {
        id: '4732',
        description: 'Member Added to Local Group',
        frequency: 'rare',
        category: 'iam',
      },
      {
        id: '1102',
        description: 'Audit Log Cleared',
        frequency: 'rare',
        category: 'iam',
      },
    ],
    realismFeatures: [
      'Weighted event distribution matching production Windows Server / Domain Controller traffic',
      'Correlated sessions — logon (4624) creates sessions consumed by logoff (4634)',
      'Correlated processes — creation (4688) tracked through termination (4689)',
      'Realistic logon types — Network (55%), Service (20%), RDP (8%), Interactive (5%)',
      '120-host fleet — each event is attributed to a random host from a pool of domain controllers, servers, and workstations',
      'Per-host record IDs — sequential winlog.record_id scoped per hostname',
    ],
    parameters: [
      {
        name: 'domain',
        defaultValue: 'CONTOSO',
        description: 'Active Directory domain (NetBIOS name)',
      },
      {
        name: 'fqdn_suffix',
        defaultValue: 'contoso.local',
        description: 'FQDN suffix appended to hostname',
      },
      {
        name: 'domain_sid',
        defaultValue: 'S-1-5-21-3457937927-...',
        description: 'Domain SID prefix for user SIDs',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Winlogbeat version string',
      },
    ],
    sampleOutputs: [
      {
        title: 'Event 4624 — Successful Logon',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "event": {
        "action": "logged-in",
        "category": ["authentication"],
        "code": "4624",
        "kind": "event",
        "outcome": "success"
    },
    "user": {
        "domain": "CONTOSO",
        "id": "S-1-5-21-3457937927-2839227994-823803824-1234",
        "name": "jsmith"
    },
    "source": {
        "ip": "192.168.0.42",
        "port": 52431
    },
    "winlog": {
        "channel": "Security",
        "event_data": {
            "AuthenticationPackageName": "NTLM",
            "LogonType": "3",
            "TargetUserName": "jsmith"
        },
        "event_id": "4624",
        "keywords": ["Audit Success"],
        "logon": { "type": "Network" },
        "record_id": "1"
    }
}`,
      },
    ],
  };
