/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const backupVeeamVbr: GeneratorMeta = {
  displayName: 'Veeam Backup & Replication Syslog',
  category: 'backup',
  description:
    'Veeam 13.1 backup jobs, authorization and repository administration with a linked denial-grant-removal chain.',
  dataSource: 'Veeam Backup & Replication 13.1 event syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  highlights: [
    '35/35 documented native parameters',
    'Vendor event IDs and structured data',
    'Routine backup-job sessions and repository administration',
  ],
  anomalyChain:
    'Two denied authorizations, a grant, restore-point deletion and repository deregistration within 40 minutes.',
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
      frequency: 'One ordinary cleanup plus one chain event',
      category: 'file',
    },
    {
      id: '28200',
      description: 'Repository removed from infrastructure',
      frequency: 'One planned retirement or one chain event',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Published Veeam 13.1 syslog bodies and all 35 documented native parameter names.',
    'Four backup jobs use stable JobID and a fresh JobSessionID for each run.',
    'Restore-point DateTime is creation time; repository removal leaves backup files in place.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'VBRSRV01',
      description: 'VBR hostname',
    },
    {
      name: 'server_fqdn',
      defaultValue: 'vbrsrv01.contoso.test',
      description: 'VBR FQDN',
    },
    {
      name: 'version',
      defaultValue: '13.1.1.18',
      description: 'VBR build',
    },
    {
      name: 'normal_user',
      defaultValue: 'operator',
      description: 'First routine login identity',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.40.1.24',
      description: 'First routine login address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'veeamadmin',
      description: 'Second routine identity and anomaly actor',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.91',
      description: 'Second routine login address and anomaly source',
    },
    {
      name: 'active_repository_id',
      defaultValue: '88788f9e-d8f5-4eb4-bc4f-9b3f5403bcec',
      description: 'Repository used by backup jobs',
    },
    {
      name: 'repository_id',
      defaultValue: 'ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11',
      description: 'Secondary repository retired once',
    },
    {
      name: 'repository_name',
      defaultValue: 'Backup Repository 01',
      description: 'Secondary repository name',
    },
    {
      name: 'retired_point_id',
      defaultValue: '882ace9a-6308-4f2b-bd12-88f004de0162',
      description: 'Pre-existing point on secondary repository',
    },
    {
      name: 'vm_name',
      defaultValue: 'VM02',
      description: 'Protected VM',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '240',
      description: 'Routine events before the one-time chain',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the linked chain; false emits background only',
    },
  ],
  slug: 'backup-veeam-vbr',
  generatorId: 'backup-veeam-vbr',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Backup repository deleted',
      json: String.raw`{
  "@timestamp": "2026-09-27T09:10:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "event",
    "module": "veeam",
    "dataset": "veeam.vbr.syslog",
    "code": "28200",
    "category": [
      "configuration"
    ],
    "action": "backup_repository_deleted",
    "type": [
      "deletion"
    ],
    "outcome": "success",
    "original": "1 2026-09-27T09:10:00+00:00 VBRSRV01 Veeam_MP - - [origin enterpriseId=\"31023\"] [categoryId=0 instanceId=28200 RepositoryID=\"ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11\" Type=\"0\" RepositoryName=\"Backup Repository 01\" ChangesXML=\"<changes><object id=\"ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11\" name=\"Backup Repository 01\" /></changes>\" UserName=\"TECH\\veeamadmin\" UserFullInfo=\"<ModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" />\" VbrHostName=\"vbrsrv01.contoso.test\" VbrVersion=\"13.1.1.18\" Version=\"1\" Description=\"Backup repository Backup Repository 01 has been deleted.\"]"
  },
  "message": "Backup repository Backup Repository 01 has been deleted.",
  "host": {
    "name": "VBRSRV01"
  },
  "user": {
    "name": "veeamadmin"
  },
  "veeam": {
    "event_id": 28200,
    "app": "Veeam_MP",
    "severity": "warning",
    "enterprise_id": 31023,
    "category_id": 0,
    "parameters": {
      "ChangesXML": "<changes><object id=\"ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11\" name=\"Backup Repository 01\" /></changes>",
      "Description": "Backup repository Backup Repository 01 has been deleted.",
      "RepositoryID": "ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11",
      "RepositoryName": "Backup Repository 01",
      "Type": "0",
      "UserFullInfo": "<ModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" />",
      "UserName": "TECH\\veeamadmin",
      "VbrHostName": "vbrsrv01.contoso.test",
      "VbrVersion": "13.1.1.18",
      "Version": "1"
    }
  }
}`,
    },
  ],
};
