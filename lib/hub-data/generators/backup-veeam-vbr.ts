/* eslint-disable sonarjs/no-hardcoded-ip -- The VbrVersion default 13.1.1.18 reads as an IP address. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const backupVeeamVbr: GeneratorMeta = {
  slug: 'backup-veeam-vbr',
  displayName: 'Veeam Backup & Replication Syslog',
  category: 'backup',
  description:
    'Veeam Backup & Replication 13.1 syslog records of a backup server operated by a small team: web UI logons, user-started backup job sessions, restore point creation and removal, and one planned repository retirement, as ECS JSON with the native syslog record in event.original. Recurring episodes show an operator guessing a password and then removing restore points.',
  dataSource: 'Veeam Backup & Replication 13.1 (build 13.1.1.18) event syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Documented parameters in documented order: 35 names across seven IDs',
    'Six operators and four jobs as independent random processes',
    'Recurring denials, grant and restore point removal chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Within 30 minutes of the first denial, one operator fails authorization two to five times (44002) from one address, is granted access (44003) from the same address and removes a finished restore point (10050), sometimes followed by one or two more removals. Episodes recur every 24 hours by default (anomaly_interval_hours, minimum 2) of source time: the first starts within the first min(interval, 24 h), each later one within a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards working hours and delayed by about two minutes (median); a missed episode is not replayed, and intervals that are not a multiple of 24 hours drift through the day and can fall at night. Operator and VM differ from the previous episode. Every step occurs in background; an ordinary removal that would complete the chain is dropped.',
  generatorId: 'vbr',
  eventTypes: [
    {
      id: '44003',
      description: 'User authorization granted',
      frequency: '30.3% measured share',
      category: 'authentication',
    },
    {
      id: '10010',
      description: 'Restore point created',
      frequency: '21.1% measured share',
      category: 'file',
    },
    {
      id: '10050',
      description: 'Restore point deleted (SYSTEM retention or an operator)',
      frequency: '16.6% measured share',
      category: 'file',
    },
    {
      id: '110',
      description: 'Backup job started by a user',
      frequency: '8.8% measured share',
      category: 'process',
    },
    {
      id: '190',
      description: 'Backup job finished',
      frequency: '8.8% measured share',
      category: 'process',
    },
    {
      id: '44002',
      description: 'User authorization denied',
      frequency: '14.2% measured share',
      category: 'authentication',
    },
    {
      id: '28200',
      description: 'Backup repository deleted',
      frequency: '0.2% measured share (one event)',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Six operators open web UI sessions at lognormal intervals, thinned by a UTC working-hours curve, from their own workstation or VPN addresses. A mistyped password produces one or more 44002 denials seconds apart before the grant; some attempts are abandoned.',
    'After logon an operator may start an idle job (four jobs, eleven VMs): 110 with Flags=1, one 10010 per VM with the snapshot time as DateTime, and 190 with the same JobSessionID. A running job is not started again.',
    'SYSTEM retention removes the oldest point when a VM exceeds its job retention count; operators also remove one to three finished points after logon. A removed point matches its earlier 10010 by OibID, VmRef, RepositoryID, DateTime and StorageSize.',
    'Once per run, within the first three days, an operator removes the pre-existing point on the unused secondary repository and then the repository itself (28200), in both modes and outside the anomaly.',
    'Only user-started sessions are modeled; every session succeeds and every point is full. Timestamps are UTC with microseconds, 44002 always carries Reason 1, and rates, retention and the working-hours curve are design choices.',
    "The envelope mirrors Veeam's published examples, which omit the PRI prefix, and XML-valued parameters keep literal inner quotes, so a strict RFC 5424 parser may reject them. Byte parity with a real capture and SIEM parser compatibility are not verified; the ECS mapping is the generator's own.",
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'VBRSRV01',
      description: 'Syslog hostname and host.name',
    },
    {
      name: 'server_fqdn',
      defaultValue: 'vbrsrv01.contoso.test',
      description: 'VbrHostName',
    },
    {
      name: 'version',
      defaultValue: '13.1.1.18',
      description: 'VbrVersion',
    },
    {
      name: 'user_domain',
      defaultValue: 'TECH',
      description: 'Domain prefix in Description, UserName and UserFullInfo',
    },
    {
      name: 'hypervisor_server',
      defaultValue: 'pdcsrv01.contoso.test',
      description: 'ServerName of the protected VMs',
    },
    {
      name: 'active_repository_id',
      defaultValue: '88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec',
      description: 'Repository used by all jobs',
    },
    {
      name: 'repository_id',
      defaultValue: 'ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11',
      description: 'Secondary repository retired once',
    },
    {
      name: 'repository_name',
      defaultValue: 'Backup Repository 01',
      description: 'Name of the secondary repository',
    },
    {
      name: 'retired_point_id',
      defaultValue: '882ace9a-6308-4f2b-bd12-88f004de0162',
      description: 'Pre-existing point on the secondary repository',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2 to 8,760',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'true adds recurring episodes; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: "First episode's restore point removal",
      json: String.raw`{"@timestamp": "2026-09-25T09:14:40.652952+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "veeam", "dataset": "veeam.vbr.syslog", "code": "10050", "category": ["file"], "action": "restore_point_deleted", "type": ["deletion"], "outcome": "success", "original": "1 2026-09-25T09:14:40.652952+00:00 VBRSRV01 Veeam_MP - - [origin enterpriseId=\"31023\"] [categoryId=0 instanceId=10050 OibID=\"2e0fef24-7842-41d7-93c6-a49c4d2e0058\" OriginalOibID=\"2e0fef24-7842-41d7-93c6-a49c4d2e0058\" VmRef=\"vm-402\" VmName=\"SRV-WEB02\" ServerName=\"pdcsrv01.contoso.test\" DateTime=\"09/23/2026 13:18:54\" IsCorrupted=\"False\" Platform=\"0\" StorageSize=\"24993189888\" RepositoryID=\"88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec\" IsFull=\"True\" UserFullInfo=\"\u003cModifiedUserInfo fullName=\"TECH\\backup.ops\" loginType=\"0\" /\u003e\" VbrHostName=\"vbrsrv01.contoso.test\" VbrVersion=\"13.1.1.18\" Version=\"1\" Description=\"Restore point for VM \u0027SRV-WEB02\u0027 has been removed by user TECH\\backup.ops.\"]"}, "message": "Restore point for VM \u0027SRV-WEB02\u0027 has been removed by user TECH\\backup.ops.", "host": {"name": "VBRSRV01"}, "user": {"name": "backup.ops"}, "veeam": {"event_id": 10050, "app": "Veeam_MP", "severity": "warning", "enterprise_id": 31023, "category_id": 0, "parameters": {"DateTime": "09/23/2026 13:18:54", "Description": "Restore point for VM \u0027SRV-WEB02\u0027 has been removed by user TECH\\backup.ops.", "IsCorrupted": "False", "IsFull": "True", "OibID": "2e0fef24-7842-41d7-93c6-a49c4d2e0058", "OriginalOibID": "2e0fef24-7842-41d7-93c6-a49c4d2e0058", "Platform": "0", "RepositoryID": "88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec", "ServerName": "pdcsrv01.contoso.test", "StorageSize": "24993189888", "UserFullInfo": "\u003cModifiedUserInfo fullName=\"TECH\\backup.ops\" loginType=\"0\" /\u003e", "VbrHostName": "vbrsrv01.contoso.test", "VbrVersion": "13.1.1.18", "Version": "1", "VmName": "SRV-WEB02", "VmRef": "vm-402"}}}`,
    },
  ],
};
