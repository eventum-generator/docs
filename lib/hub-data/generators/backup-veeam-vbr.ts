/* eslint-disable sonarjs/no-hardcoded-ip -- The VbrVersion default 13.1.1.18 reads as an IP address. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const backupVeeamVbr: GeneratorMeta = {
  slug: 'backup-veeam-vbr',
  displayName: 'Veeam Backup & Replication Syslog',
  category: 'backup',
  description:
    'Veeam Backup & Replication 13.1 syslog records for one backup server: nightly and ad-hoc backup job sessions over 400 VMs, restore point creation and retention, web UI logons of a sixteen-person backup team, manual point removals and one planned repository retirement, as ECS JSON with the native syslog record in event.original. Recurring episodes show a Backup Administrator granted access after repeated denials and then removing a restore point.',
  dataSource: 'Veeam Backup & Replication 13.1 (build 13.1.1.18) event syslog',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Documented parameters in documented order: 35 names across seven IDs',
    'Sixteen operators and twelve jobs over 400 VMs on UTC hour curves',
    'Recurring denials, grant and restore point removal chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Within 30 minutes of the first denial, one Backup Administrator fails authorization two to five times (44002) from their primary address, is granted access (44003) from the same address and removes one finished restore point (10050). Episodes recur every 24 hours of source time by default (anomaly_interval_hours, minimum 2): the first starts within the first min(interval, 24 h), each later one within a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted by the square of the logon curve plus a small floor; a missed episode is not replayed. At 24 h the first start falls between 20:00 and 06:00 UTC in about 8% of runs and later starts move toward office hours by at most 3 h a day; intervals that divide 24 hours settle into fixed daily phases (at 8 h one start in three near midnight), others drift through the day and can fall at night. Episode records take the moments of background records, which come one record later; the record count does not depend on the mode. Operator and VM differ from the previous episode. Every step occurs in background; an ordinary removal that would complete the chain is skipped and the point stays.',
  generatorId: 'vbr',
  eventTypes: [
    {
      id: '10010',
      description: 'Restore point created',
      frequency: '49.0% measured share',
      category: 'file',
    },
    {
      id: '10050',
      description: 'Restore point deleted (SYSTEM retention and user removals)',
      frequency: '43.8% measured share',
      category: 'file',
    },
    {
      id: '44003',
      description: 'User authorization granted',
      frequency: '4.8% measured share',
      category: 'authentication',
    },
    {
      id: '190',
      description: 'Backup job finished',
      frequency: '1.5% measured share',
      category: 'process',
    },
    {
      id: '44002',
      description: 'User authorization denied',
      frequency: '0.8% measured share',
      category: 'authentication',
    },
    {
      id: '110',
      description: 'Backup job started by a user',
      frequency: '0.2% measured share',
      category: 'process',
    },
    {
      id: '28200',
      description: 'Backup repository deleted',
      frequency: '0.01% measured share (once per run)',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Two UTC hour-of-day curves add up: the working-hours curve peaks at 9.7 records/h in 08-17 UTC, the backup window runs at 144/h in 20-06 UTC and 54/h by day. About 2,300 records per day with a ±10% day-to-day variation. Steps of one logon are seconds to minutes apart rather than milliseconds (repeated denials: median 91 s).',
    'Twelve jobs protect 400 VMs. Scheduled sessions follow one another and begin with their first 10010, since Veeam sends 110 only for user-started sessions; VMs finish in random order, and each 10010 carries the snapshot time as DateTime (median 47 s before the record). SYSTEM retention removes the oldest point (10050) right after a new one when a VM exceeds its job retention count.',
    'Sixteen operators log on to the web UI from their workstation or over VPN, one session at a time (median 20 minutes): six Backup Administrators about 10 times a day, ten Backup Operators about 5. Mistyped passwords and passwords saved before a PAM rotation or expiry produce 44002 denials (Reason 1) before the grant; 8% of logon attempts include a denial and 5% two or more.',
    'After 4% of logons an operator starts an idle job: 110 with Flags=1, its points ahead of scheduled work and 190 with the same JobSessionID. Only Backup Administrators remove points manually, one to three after 8% of their sessions. Once per run, at a working-hours time 6-72 hours after the start of the run, an administrator retires the unused secondary repository (10050, then 28200) in both modes, outside the anomaly.',
    "Every session succeeds and every point is full. Rates, retention counts, team and inventory size and the hour curves are design choices; timestamps, including DateTime, are UTC with microseconds rather than the server's local offset. Episodes use an administrator's primary address only and always remove exactly one point; with anomaly_mode true the chain's parts count higher by the episodes' own records (one per episode for each part, seven a week at the default interval).",
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
      json: String.raw`{"@timestamp": "2026-09-01T18:42:20.609177+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "veeam", "dataset": "veeam.vbr.syslog", "code": "10050", "category": ["file"], "action": "restore_point_deleted", "type": ["deletion"], "outcome": "success", "original": "1 2026-09-01T18:42:20.609177+00:00 VBRSRV01 Veeam_MP - - [origin enterpriseId=\"31023\"] [categoryId=0 instanceId=10050 OibID=\"b7c7dc10-4901-46d1-a938-5c3ab7492ee2\" OriginalOibID=\"b7c7dc10-4901-46d1-a938-5c3ab7492ee2\" VmRef=\"vm-218\" VmName=\"SRV-INF18\" ServerName=\"pdcsrv01.contoso.test\" DateTime=\"08/27/2026 07:11:45\" IsCorrupted=\"False\" Platform=\"0\" StorageSize=\"19150786560\" RepositoryID=\"88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec\" IsFull=\"True\" UserFullInfo=\"\u003cModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" /\u003e\" VbrHostName=\"vbrsrv01.contoso.test\" VbrVersion=\"13.1.1.18\" Version=\"1\" Description=\"Restore point for VM \u0027SRV-INF18\u0027 has been removed by user TECH\\veeamadmin.\"]"}, "message": "Restore point for VM \u0027SRV-INF18\u0027 has been removed by user TECH\\veeamadmin.", "host": {"name": "VBRSRV01"}, "user": {"name": "veeamadmin"}, "veeam": {"event_id": 10050, "app": "Veeam_MP", "severity": "warning", "enterprise_id": 31023, "category_id": 0, "parameters": {"DateTime": "08/27/2026 07:11:45", "Description": "Restore point for VM \u0027SRV-INF18\u0027 has been removed by user TECH\\veeamadmin.", "IsCorrupted": "False", "IsFull": "True", "OibID": "b7c7dc10-4901-46d1-a938-5c3ab7492ee2", "OriginalOibID": "b7c7dc10-4901-46d1-a938-5c3ab7492ee2", "Platform": "0", "RepositoryID": "88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec", "ServerName": "pdcsrv01.contoso.test", "StorageSize": "19150786560", "UserFullInfo": "\u003cModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" /\u003e", "VbrHostName": "vbrsrv01.contoso.test", "VbrVersion": "13.1.1.18", "Version": "1", "VmName": "SRV-INF18", "VmRef": "vm-218"}}}`,
    },
  ],
};
