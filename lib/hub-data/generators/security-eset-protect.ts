/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityEsetProtect: GeneratorMeta = {
  slug: 'security-eset-protect',
  displayName: 'ESET PROTECT On-Prem CEF',
  category: 'security',
  description:
    'ESET PROTECT On-Prem 11.1.20.0 firewall, HIPS and threat CEF in synthetic ECS JSON, with one switchable HIPS-to-threat episode.',
  dataSource: 'ESET PROTECT On-Prem 11.1 CEF export',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Bare CEF payload in event.original',
    'Firewall, HIPS and threat categories',
    '48 endpoint identities and file-path correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 80 routine records, three HIPS blocks for one endpoint and executable are followed by a Threat cleanup over 15 minutes; the episode occurs once.',
  generatorId: 'eset-protect',
  eventTypes: [
    {
      id: 'ESET Firewall Event',
      description: 'Port-scan detection blocked',
      frequency: 'About 45% of routine records',
      category: 'network',
    },
    {
      id: 'ESET Threat Event',
      description: 'File threat cleaned',
      frequency: 'About 30% of routine records',
      category: 'malware',
    },
    {
      id: 'ESET HIPS Event',
      description: 'Suspicious launch blocked',
      frequency: 'About 25% of routine records',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'One event every five minutes with a synthetic 45/30/25 category mix across 48 endpoints.',
    'Both modes use the same endpoint, file, user and hash pools; the linked sequence is one-shot.',
    'Vendor CEF field sets are modeled; exact On-Prem firewall class ID and KUMA parsing remain unverified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include one HIPS-to-threat episode',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records before the episode',
    },
    {
      name: 'protect_version',
      defaultValue: '11.1.20.0',
      description: 'On-Prem build in the CEF header',
    },
    {
      name: 'protect_host',
      defaultValue: 'protect-01.example.test',
      description: 'Management server',
    },
  ],
  sampleOutputs: [
    {
      title: 'ESET PROTECT On-Prem CEF anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T23:50:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "alert",
    "module": "eset",
    "dataset": "eset.protect",
    "code": "183",
    "action": "Cleaned by deleting",
    "category": [
      "malware"
    ],
    "type": [
      "info"
    ],
    "severity": 5,
    "original": "CEF:0|ESET|Protect|11.1.20.0|183|File scanner cleaned a virus|5|dvc=10.20.1.41 dvchost=ws-sales-01 deviceExternalId=e88ea65e-c3ba-4df7-83ad-d96c51022096 ESETProtectDeviceGroupName=All/Workstations ESETProtectDeviceOsName=Microsoft Windows 11 Pro ESETProtectDeviceGroupDescription=Workstations rt=Sep 25 2026 23:50:00 cat=ESET Threat Event cs1=Win32/Injector.ABC cs1Label=Threat Name cs2=29000 (20260925) cs2Label=Engine Version cs3=Virus cs3Label=Threat Type cs4=Real-time file system protection cs4Label=Scanner ID cs5=virlog.dat cs5Label=Scan ID act=Cleaned by deleting fileType=File filePath=file:///C:/Users/Public/Downloads/update-helper.exe cn1=1 cn1Label=Handled suser=EXAMPLE\\\\sales01 sprod=C:\\\\Windows\\\\explorer.exe cs7=Event occurred on a newly created file cs7Label=Circumstances deviceCustomDate1=Sep 25 2026 23:50:00 deviceCustomDate1Label=FirstSeen cs8=6a7854893797b375f63a0c7c41d1f8a9945eec36 cs8Label=Hash"
  },
  "host": {
    "name": "ws-sales-01",
    "id": "e88ea65e-c3ba-4df7-83ad-d96c51022096",
    "ip": [
      "10.20.1.41"
    ],
    "os": {
      "name": "Microsoft Windows 11 Pro"
    }
  },
  "observer": {
    "name": "protect-01.example.test",
    "product": "Protect",
    "vendor": "ESET",
    "version": "11.1.20.0"
  },
  "eset": {
    "protect": {
      "category": "threat",
      "class_id": "183",
      "action": "Cleaned by deleting"
    }
  },
  "related": {
    "ip": [
      "10.20.1.41"
    ],
    "user": [
      "EXAMPLE\\sales01"
    ],
    "hash": [
      "6a7854893797b375f63a0c7c41d1f8a9945eec36"
    ]
  },
  "file": {
    "path": "C:\\Users\\Public\\Downloads\\update-helper.exe",
    "hash": {
      "sha1": "6a7854893797b375f63a0c7c41d1f8a9945eec36"
    }
  },
  "user": {
    "name": "EXAMPLE\\sales01"
  }
}`,
    },
  ],
};
