/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityEsetProtect: GeneratorMeta = {
  slug: 'security-eset-protect',
  displayName: 'ESET PROTECT On-Prem CEF',
  category: 'security',
  description:
    'ESET PROTECT CEF firewall, HIPS and threat records with repeated blocked execution followed by file cleanup.',
  dataSource: 'ESET PROTECT On-Prem 11.1',
  format: ['CEF', 'ECS'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native CEF record in event.original',
    'Firewall, HIPS and threat categories',
    'Endpoint UUID and file-path correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three HIPS blocks for one endpoint and file precede an antivirus cleanup event for that file.',
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
    'Vendor-documented CEF class IDs and extension keys',
    'Per-endpoint UUID, hostname and address agree',
    'HIPS target and threat file URI resolve to the same path',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include HIPS-to-threat chain',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records between chains',
    },
    {
      name: 'protect_version',
      defaultValue: '11.1.0.0',
      description: 'CEF device version',
    },
    {
      name: 'protect_host',
      defaultValue: 'protect-01.example.test',
      description: 'Management server',
    },
    {
      name: 'target_host',
      defaultValue: 'ws-fin-07',
      description: 'Chain endpoint hostname',
    },
    {
      name: 'target_ip',
      defaultValue: '10.20.1.47',
      description: 'Chain endpoint address',
    },
    {
      name: 'target_device_id',
      defaultValue: '82e114a8-9070-4868-8ee2-1e87b7b85ee3',
      description: 'Chain endpoint UUID',
    },
    {
      name: 'target_path',
      defaultValue: String.raw`C:\Users\Public\invoice-viewer.exe`,
      description: 'Chain file path',
    },
    {
      name: 'target_user',
      defaultValue: String.raw`EXAMPLE\maria`,
      description: 'Chain account',
    },
  ],
  sampleOutputs: [
    {
      title: 'ESET PROTECT On-Prem CEF anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:44:24+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "alert", "module": "eset", "dataset": "eset.protect", "code": "183", "action": "Cleaned by deleting", "category": ["malware"], "type": ["info"], "original": "CEF:0|ESET|Protect|11.1.0.0|183|File scanner cleaned a virus|5|dvc=10.20.1.47 dvchost=ws-fin-07 deviceExternalId=82e114a8-9070-4868-8ee2-1e87b7b85ee3 ESETProtectDeviceGroupName=All/Workstations ESETProtectDeviceOsName=Microsoft Windows 11 Pro ESETProtectDeviceGroupDescription=Workstations rt=Sep 25 2026 12:44:24 cat=ESET Threat Event cs1=Win32/Agent.ABC cs1Label=Threat Name cs2=29000 (20260925) cs2Label=Engine Version cs3=Virus cs3Label=Threat Type cs4=Real-time file system protection cs4Label=Scanner ID cs5=scan001 cs5Label=Scan ID act=Cleaned by deleting fileType=File filePath=file:///C:/Users/Public/invoice-viewer.exe cn1=1 cn1Label=Handled suser=EXAMPLE\\\\maria sprod=C:\\\\Windows\\\\explorer.exe cs7=Event occurred on a newly created file cs7Label=Circumstances deviceCustomDate1=Sep 25 2026 12:44:24 deviceCustomDate1Label=FirstSeen cs8=ab151235dcf905cb5fc2e3b8a6fe731d31878cc1 cs8Label=Hash"}, "host": {"name": "ws-fin-07", "id": "82e114a8-9070-4868-8ee2-1e87b7b85ee3", "ip": ["10.20.1.47"]}, "observer": {"name": "protect-01.example.test", "product": "Protect", "vendor": "ESET", "version": "11.1.0.0"}, "eset": {"protect": {"category": "threat", "class_id": "183", "action": "Cleaned by deleting"}}, "file": {"path": "C:\\Users\\Public\\invoice-viewer.exe", "hash": {"sha1": "ab151235dcf905cb5fc2e3b8a6fe731d31878cc1"}}, "user": {"name": "EXAMPLE\\maria"}}`,
    },
  ],
};
