/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const backupVeeamVbr: GeneratorMeta = {
  displayName: 'Veeam Backup & Replication Syslog',
  category: 'backup',
  description:
    'Veeam VBR 13.1.1.18 job, point and authorization syslog with periodic denial-grant-deletion episodes after completed backup jobs.',
  dataSource: 'Veeam Backup & Replication 13.1 event syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  highlights: [
    '35/35 documented native parameter names across seven IDs',
    'Stateful job and restore-point lifecycles',
    'Recurring four-event episodes at least 48 hours apart',
  ],
  anomalyChain:
    'At least every 48 hours, after an aligned completed job cycle, two denials and a grant for one ordinary actor precede deletion of that cycle\u2019s emitted restore point. Episodes span 30 minutes and use different point IDs. Repository retirement is a separate one-time background operation in both modes.',
  eventTypes: [
    {
      id: '110',
      description: 'Backup job started',
      frequency: 'About 16.7% routine share',
      category: 'process',
    },
    {
      id: '10010',
      description: 'Restore point created',
      frequency: 'About 16.7% routine share',
      category: 'file',
    },
    {
      id: '190',
      description: 'Backup job finished',
      frequency: 'About 16.7% routine share',
      category: 'process',
    },
    {
      id: '44002',
      description: 'Authorization denied',
      frequency: 'About 16.7% routine share',
      category: 'authentication',
    },
    {
      id: '44003',
      description: 'Authorization granted',
      frequency: 'About 33.3% routine share',
      category: 'authentication',
    },
    {
      id: '10050',
      description: 'Restore point deleted',
      frequency: 'Periodic routine cleanup, one retirement and episodes',
      category: 'file',
    },
    {
      id: '28200',
      description: 'Repository removed from infrastructure',
      frequency: 'One planned secondary retirement in either mode',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'VBR 13.1.1.18 selected syslog bodies use exact per-ID parameter sets; 35/35 is distinct native-name coverage, not a production realism score.',
    'Job start and finish share JobSessionID; restore points have no native JobSessionID and connect to jobs only by VM/repository/time.',
    'Point deletion preserves creation DateTime and identity, follows job completion and cannot delete the same point twice.',
    'Both modes share actors, authentication IPs and point cleanup; point/repository events contain no invented login IP or session join.',
    'Reason=1 means unauthenticated; its vendor raw example omits Reason. Published bodies omit PRI and keep literal inner XML quotes; strict RFC5424 parsing, deployment-byte parity and KUMA compatibility remain unverified.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'VBRSRV01',
      description: 'Syslog hostname',
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
      name: 'normal_user',
      defaultValue: 'operator',
      description: 'First routine login identity',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.40.1.24',
      description: 'First routine login identity',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'veeamadmin',
      description: 'Second routine login identity and anomaly actor',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.91',
      description: 'Second routine login identity and anomaly actor',
    },
    {
      name: 'active_repository_id',
      defaultValue: '88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec',
      description: 'Repository used by recurring backup jobs',
    },
    {
      name: 'repository_id',
      defaultValue: 'ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11',
      description: 'Secondary repository retired once',
    },
    {
      name: 'repository_name',
      defaultValue: 'Backup Repository 01',
      description: 'Secondary repository retired once',
    },
    {
      name: 'retired_point_id',
      defaultValue: '882ace9a-6308-4f2b-bd12-88f004de0162',
      description: 'Pre-existing point on the secondary repository',
    },
    {
      name: 'vm_name',
      defaultValue: 'VM02',
      description: 'Protected VM',
    },
    {
      name: 'hypervisor_server',
      defaultValue: 'pdcsrv01.contoso.test',
      description: 'Native ServerName for the protected VM',
    },
    {
      name: 'user_domain',
      defaultValue: 'TECH',
      description: 'Domain prefix in native operation-user details',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '48',
      description:
        'Minimum source-time interval before and between episodes; clamped to at least one hour and aligned to a completed job cycle',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'true mixes in periodic episodes; false emits only background',
    },
  ],
  slug: 'backup-veeam-vbr',
  generatorId: 'backup-veeam-vbr',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Completed restore point deleted',
      json: String.raw`{
  "@timestamp": "2026-09-27T01:30:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "event",
    "module": "veeam",
    "dataset": "veeam.vbr.syslog",
    "code": "10050",
    "category": [
      "file"
    ],
    "action": "restore_point_deleted",
    "type": [
      "deletion"
    ],
    "outcome": "success",
    "original": "1 2026-09-27T01:30:00+00:00 VBRSRV01 Veeam_MP - - [origin enterpriseId=\"31023\"] [categoryId=0 instanceId=10050 OibID=\"fa95965f-64f8-4cc1-8355-77dc18837edb\" OriginalOibID=\"fa95965f-64f8-4cc1-8355-77dc18837edb\" VmRef=\"vm-02\" VmName=\"VM02\" ServerName=\"pdcsrv01.contoso.test\" DateTime=\"09/27/2026 00:10:00\" IsCorrupted=\"False\" Platform=\"0\" StorageSize=\"13873971200\" RepositoryID=\"88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec\" IsFull=\"True\" UserFullInfo=\"<ModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" />\" VbrHostName=\"vbrsrv01.contoso.test\" VbrVersion=\"13.1.1.18\" Version=\"1\" Description=\"Restore point for VM 'VM02' has been removed by user TECH\\veeamadmin.\"]"
  },
  "message": "Restore point for VM 'VM02' has been removed by user TECH\\veeamadmin.",
  "host": {
    "name": "VBRSRV01"
  },
  "user": {
    "name": "veeamadmin"
  },
  "veeam": {
    "event_id": 10050,
    "app": "Veeam_MP",
    "severity": "warning",
    "enterprise_id": 31023,
    "category_id": 0,
    "parameters": {
      "DateTime": "09/27/2026 00:10:00",
      "Description": "Restore point for VM 'VM02' has been removed by user TECH\\veeamadmin.",
      "IsCorrupted": "False",
      "IsFull": "True",
      "OibID": "fa95965f-64f8-4cc1-8355-77dc18837edb",
      "OriginalOibID": "fa95965f-64f8-4cc1-8355-77dc18837edb",
      "Platform": "0",
      "RepositoryID": "88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec",
      "ServerName": "pdcsrv01.contoso.test",
      "StorageSize": "13873971200",
      "UserFullInfo": "<ModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" />",
      "VbrHostName": "vbrsrv01.contoso.test",
      "VbrVersion": "13.1.1.18",
      "Version": "1",
      "VmName": "VM02",
      "VmRef": "vm-02"
    }
  }
}`,
    },
  ],
};
