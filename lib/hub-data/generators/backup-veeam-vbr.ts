/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const backupVeeamVbr: GeneratorMeta = {
  displayName: 'Veeam Backup & Replication Syslog',
  category: 'backup',
  description:
    'Veeam 13.1 authorization and backup-deletion syslog with a linked failed-login, successful-login and destructive-action sequence.',
  dataSource: 'Veeam Backup & Replication 13.1 event syslog',
  format: ['JSON', 'ECS', 'RFC 5424'],
  eventCount: 4,
  highlights: [
    '27/27 documented event parameters',
    'Vendor event IDs and structured data',
    'Switchable backup-deletion chain',
  ],
  anomalyChain:
    'Two denied authorizations, one successful login, then restore-point and repository deletion on the same VBR server.',
  eventTypes: [
    {
      id: '44003',
      description: 'Authorization granted',
      frequency: '86% routine weight',
      category: 'authentication',
    },
    {
      id: '44002',
      description: 'Authorization denied',
      frequency: '14% routine weight',
      category: 'authentication',
    },
    {
      id: '10050',
      description: 'Restore point deleted',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
    {
      id: '28200',
      description: 'Repository deleted',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Published Veeam syslog record body and structured-data keys.',
    'Deletion events share a qualified account name and a repository ID.',
    'Each repeated anomaly targets a distinct repository and VM.',
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
      description: 'Routine user',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.40.1.24',
      description: 'Routine source',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'veeamadmin',
      description: 'Anomaly user',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.91',
      description: 'Unusual source',
    },
    {
      name: 'repository_id',
      defaultValue: 'ed8c61cc-77f0-4f40-b73e-8c92d4a6fb11',
      description: 'Repository ID prefix',
    },
    {
      name: 'repository_name',
      defaultValue: 'Backup Repository 01',
      description: 'Repository name prefix',
    },
    {
      name: 'vm_name',
      defaultValue: 'VM02',
      description: 'VM name prefix',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '240',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable correlated chain; false emits background only',
    },
  ],
  slug: 'backup-veeam-vbr',
  generatorId: 'backup-veeam-vbr',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Backup repository deleted',
      json: String.raw`{"@timestamp": "2026-09-25T11:49:45+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "veeam", "dataset": "veeam.vbr.syslog", "code": "28200", "category": ["configuration"], "action": "backup_repository_deleted", "type": ["deletion"], "outcome": "success", "original": "1 2026-09-25T11:49:45+00:00 VBRSRV01 Veeam_MP - - [origin enterpriseId=\"31023\"] [categoryId=0 instanceId=28200 VbrHostName=\"vbrsrv01.contoso.test\" VbrVersion=\"13.1.1.18\" Version=\"1\" Description=\"Backup repository Backup Repository 01 0001 has been deleted.\" RepositoryID=\"ed8c61cc-77f0-4f40-b73e-8c92d4a60001\" Type=\"0\" RepositoryName=\"Backup Repository 01 0001\" ChangesXML=\"\u003cchanges\u003e\u003cobject id=\"ed8c61cc-77f0-4f40-b73e-8c92d4a60001\" name=\"Backup Repository 01 0001\" /\u003e\u003c/changes\u003e\" UserName=\"TECH\\veeamadmin\" UserFullInfo=\"\u003cModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" /\u003e\"]"}, "message": "Backup repository Backup Repository 01 0001 has been deleted.", "host": {"name": "VBRSRV01"}, "source": {"ip": null}, "user": {"name": "veeamadmin"}, "veeam": {"event_id": 28200, "app": "Veeam_MP", "severity": "warning", "enterprise_id": 31023, "category_id": 0, "parameters": {"ChangesXML": "\u003cchanges\u003e\u003cobject id=\"ed8c61cc-77f0-4f40-b73e-8c92d4a60001\" name=\"Backup Repository 01 0001\" /\u003e\u003c/changes\u003e", "Description": "Backup repository Backup Repository 01 0001 has been deleted.", "RepositoryID": "ed8c61cc-77f0-4f40-b73e-8c92d4a60001", "RepositoryName": "Backup Repository 01 0001", "Type": "0", "UserFullInfo": "\u003cModifiedUserInfo fullName=\"TECH\\veeamadmin\" loginType=\"0\" /\u003e", "UserName": "TECH\\veeamadmin", "VbrHostName": "vbrsrv01.contoso.test", "VbrVersion": "13.1.1.18", "Version": "1"}}}`,
    },
  ],
};
