import type { GeneratorMeta } from '@/lib/hub-types';

export const securityDefenderEndpoint: GeneratorMeta = {
    slug: 'security-defender-endpoint',
    displayName: 'Microsoft Defender for Endpoint',
    category: 'security',
    description:
      'Microsoft Defender for Endpoint Advanced Hunting telemetry — process, network, file, registry, logon, image load, and device events plus EDR alerts, as streamed to Microsoft Sentinel.',
    format: ['JSON'],
    dataSource: 'Microsoft Defender for Endpoint Advanced Hunting',
    eventCount: 8,
    templateCount: 8,
    highlights: [
      'Full Advanced Hunting schema (8 tables)',
      'Integrity-level-based account selection',
      'Monotonic per-device ReportId counter',
      'MITRE ATT&CK-mapped alert profiles',
    ],
    generatorId: 'security-defender-endpoint',
    eventTypes: [
      {
        id: 'process-events',
        description: 'Process Creation (DeviceProcessEvents)',
        frequency: '33%',
        category: 'endpoint',
      },
      {
        id: 'network-events',
        description: 'Network Connections (DeviceNetworkEvents)',
        frequency: '28%',
        category: 'network',
      },
      {
        id: 'file-events',
        description: 'File Operations (DeviceFileEvents)',
        frequency: '22%',
        category: 'endpoint',
      },
      {
        id: 'registry-events',
        description: 'Registry Modifications (DeviceRegistryEvents)',
        frequency: '9%',
        category: 'endpoint',
      },
      {
        id: 'image-load-events',
        description: 'DLL/Image Loads (DeviceImageLoadEvents)',
        frequency: '4%',
        category: 'endpoint',
      },
      {
        id: 'logon-events',
        description: 'Logon Events (DeviceLogonEvents)',
        frequency: '2%',
        category: 'authentication',
      },
      {
        id: 'device-events',
        description: 'Device Events (AV, USB, Firewall)',
        frequency: '1.5%',
        category: 'endpoint',
      },
      {
        id: 'alert-info',
        description: 'Security Alerts (AlertInfo)',
        frequency: '0.5%',
        category: 'intrusion_detection',
      },
    ],
    realismFeatures: [
      'Integrity-level-based account selection — System, High, and Medium integrity processes map to SYSTEM, admin, and standard user accounts with matching SIDs and token elevation types',
      'Monotonic per-device ReportId counter using shared state ensures sequential, non-duplicated report IDs per endpoint',
      'Realistic parent-child process trees drawn from a pool of 25+ Windows process chains (e.g., services.exe → svchost.exe, explorer.exe → chrome.exe)',
      'Full PE metadata on every process — SHA1/SHA256/MD5 hashes, version info, signer type, and signature status',
      'MITRE ATT&CK-mapped alert profiles covering credential access, lateral movement, execution, and persistence techniques',
    ],
    parameters: [
      {
        name: 'tenant',
        defaultValue: 'Contoso',
        description: 'Tenant display name in event envelope',
      },
      {
        name: 'domain',
        defaultValue: 'CONTOSO',
        description: 'NetBIOS domain name',
      },
      {
        name: 'fqdn_suffix',
        defaultValue: 'contoso.com',
        description: 'DNS suffix for device FQDNs',
      },
      {
        name: 'domain_sid',
        defaultValue: 'S-1-5-21-...',
        description: 'Domain SID prefix for user SIDs',
      },
      {
        name: 'tenant_id',
        defaultValue: '3adb963c-...',
        description: 'Azure AD tenant ID (GUID)',
      },
    ],
    sampleOutputs: [
      {
        title: 'DeviceProcessEvents',
        json: `{
    "Tenant": "Contoso",
    "category": "AdvancedHunting-DeviceProcessEvents",
    "operationName": "Publish",
    "properties": {
        "Timestamp": "2026-03-06T16:26:47.000000Z",
        "DeviceName": "wkstn-nyc001.contoso.com",
        "ActionType": "ProcessCreated",
        "FileName": "chrome.exe",
        "FolderPath": "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
        "ProcessId": 10470,
        "ProcessCommandLine": "\\"C:\\\\Program Files\\\\...\\\\chrome.exe\\" --type=utility",
        "ProcessIntegrityLevel": "Medium",
        "AccountDomain": "CONTOSO",
        "AccountName": "svc-web",
        "InitiatingProcessFileName": "sc.exe",
        "InitiatingProcessParentFileName": "cmd.exe",
        "ReportId": 1000,
        "MachineGroup": "ProductionWorkstations"
    },
    "tenantId": "3adb963c-8e61-48e8-a06d-6dbb0dacea39",
    "time": "2026-03-06T16:31:19.000Z"
}`,
      },
      {
        title: 'DeviceNetworkEvents',
        json: `{
    "Tenant": "Contoso",
    "category": "AdvancedHunting-DeviceNetworkEvents",
    "operationName": "Publish",
    "properties": {
        "Timestamp": "2026-03-06T16:26:48.000000Z",
        "DeviceName": "dev-wkstn002.contoso.com",
        "ActionType": "InboundConnectionAccepted",
        "RemoteIP": "40.126.32.134",
        "RemotePort": 443,
        "RemoteUrl": "outlook.office365.com",
        "LocalIP": "192.168.25.84",
        "LocalPort": 50917,
        "Protocol": "Tcp",
        "InitiatingProcessFileName": "chrome.exe",
        "ReportId": 1001,
        "MachineGroup": "DevelopmentWorkstations"
    },
    "tenantId": "3adb963c-8e61-48e8-a06d-6dbb0dacea39",
    "time": "2026-03-06T16:28:14.000Z"
}`,
      },
      {
        title: 'AlertInfo',
        json: `{
    "Tenant": "Contoso",
    "category": "AdvancedHunting-AlertInfo",
    "operationName": "Publish",
    "properties": {
        "Timestamp": "2026-03-05T21:48:29.890Z",
        "AlertId": "da638034938542563831_394601025",
        "Title": "Suspicious credential access via LSASS",
        "Category": "CredentialAccess",
        "Severity": "High",
        "ServiceSource": "Microsoft Defender for Endpoint",
        "DetectionSource": "EDR",
        "AttackTechniques": "[\\"OS Credential Dumping (T1003)\\"]"
    },
    "tenantId": "3adb963c-8e61-48e8-a06d-6dbb0dacea39",
    "time": "2026-03-05T21:52:16.047Z"
}`,
      },
    ],
  };
