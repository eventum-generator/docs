/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandexAuditTrails: GeneratorMeta = {
  displayName: 'Yandex Cloud Audit Trails',
  category: 'cloud',
  description:
    'Yandex Cloud control-plane audit JSON for Compute, IAM and Resource Manager, including a correlated service-account persistence chain.',
  dataSource: 'Yandex Cloud Audit Trails control-plane JSON',
  format: ['JSON', 'ECS'],
  eventCount: 6,
  highlights: [
    '22/22 selected common fields',
    'Native JSON in event.original',
    'Switchable IAM persistence chain',
  ],
  anomalyChain:
    'One actor creates a service account, grants it a folder editor role, then creates its static access key.',
  eventTypes: [
    {
      id: 'compute.CreateInstance',
      description: 'Create VM',
      frequency: '56% routine weight',
      category: 'configuration',
    },
    {
      id: 'compute.UpdateInstance',
      description: 'Update VM',
      frequency: '29% routine weight',
      category: 'configuration',
    },
    {
      id: 'resourcemanager.UpdateFolder',
      description: 'Update folder',
      frequency: '15% routine weight',
      category: 'configuration',
    },
    {
      id: 'iam.CreateServiceAccount',
      description: 'Create service account',
      frequency: 'Anomaly only',
      category: 'iam',
    },
    {
      id: 'resourcemanager.SetFolderAccessBindings',
      description: 'Grant folder role',
      frequency: 'Anomaly only',
      category: 'iam',
    },
    {
      id: 'iam.CreateAccessKey',
      description: 'Create static key',
      frequency: 'Anomaly only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Native snake_case audit payload preserved in event.original.',
    'Actor ID, folder ID and service-account ID connect anomaly steps.',
    'Distinct service accounts and keys across repeated chains.',
  ],
  parameters: [
    {
      name: 'cloud_id',
      defaultValue: 'b1gcontosocloud01',
      description: 'Cloud ID',
    },
    {
      name: 'folder_id',
      defaultValue: 'b1gcontosofolder1',
      description: 'Folder ID',
    },
    {
      name: 'organization_id',
      defaultValue: 'bpfcontosoorg001',
      description: 'Organization ID',
    },
    {
      name: 'normal_subject_id',
      defaultValue: 'ajeoperator000001',
      description: 'Routine actor ID',
    },
    {
      name: 'normal_subject_name',
      defaultValue: 'cloud.operator',
      description: 'Routine actor',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.60.1.27',
      description: 'Routine source',
    },
    {
      name: 'anomaly_subject_id',
      defaultValue: 'ajeoutsider000001',
      description: 'Anomaly actor ID',
    },
    {
      name: 'anomaly_subject_name',
      defaultValue: 'external.admin',
      description: 'Anomaly actor',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.105',
      description: 'Unusual source',
    },
    {
      name: 'created_service_account_id',
      defaultValue: 'ajebackdoor000001',
      description: 'Service-account ID prefix',
    },
    {
      name: 'created_service_account_name',
      defaultValue: 'svc-maint',
      description: 'Service-account name prefix',
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
  slug: 'cloud-yandex-audit-trails',
  generatorId: 'cloud-yandex-audit-trails',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Static access key created',
      json: String.raw`{"@timestamp": "2026-09-25T11:54:22+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "yandex_cloud", "dataset": "yandex_cloud.audit", "id": "d7df01f7-21c4-443c-8569-2a4a32fb3550", "action": "CreateAccessKey", "category": ["iam"], "type": ["change"], "outcome": "success", "original": "{\"authentication\": {\"authenticated\": true, \"federation_id\": \"bpfcontosofed001\", \"federation_name\": \"contoso\", \"federation_type\": \"PRIVATE_FEDERATION\", \"subject_id\": \"ajeoutsider000001\", \"subject_name\": \"external.admin\", \"subject_type\": \"FEDERATED_USER_ACCOUNT\"}, \"authorization\": {\"authorized\": true}, \"details\": {\"access_key_id\": \"ajeaccesskey0001\", \"created_at\": \"2026-09-25T11:54:22+00:00\", \"description\": \"Maintenance automation\", \"key_id\": \"ajekey0001\", \"service_account_id\": \"ajebackdoor0000010001\", \"service_account_name\": \"svc-maint-0001\"}, \"event_id\": \"d7df01f7-21c4-443c-8569-2a4a32fb3550\", \"event_source\": \"iam\", \"event_status\": \"DONE\", \"event_time\": \"2026-09-25T11:54:22+00:00\", \"event_type\": \"yandex.cloud.audit.iam.CreateAccessKey\", \"request_metadata\": {\"remote_address\": \"198.51.100.105\", \"request_id\": \"be138890-703d-4ed4-bd86-a9d1367d2188\", \"user_agent\": \"yc/0.157\"}, \"request_parameters\": {}, \"resource_metadata\": {\"path\": [{\"resource_id\": \"bpfcontosoorg001\", \"resource_name\": \"contoso-org\", \"resource_type\": \"organization-manager.organization\"}, {\"resource_id\": \"b1gcontosocloud01\", \"resource_name\": \"contoso-cloud\", \"resource_type\": \"resource-manager.cloud\"}, {\"resource_id\": \"b1gcontosofolder1\", \"resource_name\": \"production\", \"resource_type\": \"resource-manager.folder\"}]}, \"response\": {}}"}, "source": {"ip": "198.51.100.105"}, "user": {"id": "ajeoutsider000001", "name": "external.admin"}, "cloud": {"provider": "yandex", "account": {"id": "b1gcontosocloud01"}}, "yandex_cloud": {"audit": {"authentication": {"authenticated": true, "federation_id": "bpfcontosofed001", "federation_name": "contoso", "federation_type": "PRIVATE_FEDERATION", "subject_id": "ajeoutsider000001", "subject_name": "external.admin", "subject_type": "FEDERATED_USER_ACCOUNT"}, "authorization": {"authorized": true}, "details": {"access_key_id": "ajeaccesskey0001", "created_at": "2026-09-25T11:54:22+00:00", "description": "Maintenance automation", "key_id": "ajekey0001", "service_account_id": "ajebackdoor0000010001", "service_account_name": "svc-maint-0001"}, "event_id": "d7df01f7-21c4-443c-8569-2a4a32fb3550", "event_source": "iam", "event_status": "DONE", "event_time": "2026-09-25T11:54:22+00:00", "event_type": "yandex.cloud.audit.iam.CreateAccessKey", "request_metadata": {"remote_address": "198.51.100.105", "request_id": "be138890-703d-4ed4-bd86-a9d1367d2188", "user_agent": "yc/0.157"}, "request_parameters": {}, "resource_metadata": {"path": [{"resource_id": "bpfcontosoorg001", "resource_name": "contoso-org", "resource_type": "organization-manager.organization"}, {"resource_id": "b1gcontosocloud01", "resource_name": "contoso-cloud", "resource_type": "resource-manager.cloud"}, {"resource_id": "b1gcontosofolder1", "resource_name": "production", "resource_type": "resource-manager.folder"}]}, "response": {}}}}`,
    },
  ],
};
