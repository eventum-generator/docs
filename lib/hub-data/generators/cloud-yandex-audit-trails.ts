/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandexAuditTrails: GeneratorMeta = {
  displayName: 'Yandex Cloud Audit Trails',
  category: 'cloud',
  description:
    'Yandex Cloud management-audit JSON for Compute, IAM and Resource Manager, with independent background operations and one linked IAM sequence.',
  dataSource: 'Yandex Cloud Audit Trails control-plane JSON',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  highlights: [
    'Five documented control-plane event types',
    'Native JSON retained in event.original',
    'Switchable one-shot IAM chain',
  ],
  anomalyChain:
    'After 144 routine events, one operator creates a service account, adds a folder editor binding and creates its static key over 20 minutes.',
  eventTypes: [
    {
      id: 'compute.UpdateInstance',
      description: 'Change a label on a stable VM',
      frequency: '88% routine weight',
      category: 'configuration',
    },
    {
      id: 'compute.CreateInstance',
      description: 'Create a VM with disk and network details',
      frequency: '2% routine weight',
      category: 'configuration',
    },
    {
      id: 'iam.CreateServiceAccount',
      description: 'Create a maintenance service account',
      frequency: '3% routine weight plus one linked event',
      category: 'iam',
    },
    {
      id: 'resourcemanager.UpdateFolderAccessBindings',
      description: 'Add a folder viewer or editor binding',
      frequency: '4% routine weight plus one linked event',
      category: 'iam',
    },
    {
      id: 'iam.CreateAccessKey',
      description: 'Create a static access key',
      frequency: '3% routine weight plus one linked event',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Snake_case native audit record in event.original and parsed yandex_cloud.audit fields.',
    '64 stable VM identities, 24 existing service accounts and public/private VM network variants.',
    'Both operators and all five event types occur in both modes; only the account-linked sequence differs.',
    'Ten-minute event spacing and vendor-shaped resource and static-key IDs.',
  ],
  parameters: [
    {
      name: 'cloud_id',
      defaultValue: 'b1g0a10235b15143e07a',
      description: 'Cloud resource ID',
    },
    {
      name: 'folder_id',
      defaultValue: 'b1g2a15c9bea04fe16e5',
      description: 'Folder resource ID',
    },
    {
      name: 'organization_id',
      defaultValue: 'bpf8fce59da310dc940c',
      description: 'Organization resource ID',
    },
    {
      name: 'normal_subject_id',
      defaultValue: 'aje29545c72dd3fe508a',
      description: 'Primary federated operator ID',
    },
    {
      name: 'normal_subject_name',
      defaultValue: 'cloud.operator',
      description: 'Primary federated operator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.60.1.27',
      description: 'Primary operator source IP',
    },
    {
      name: 'anomaly_subject_id',
      defaultValue: 'ajeead78627c1eb1858a',
      description: 'Secondary federated operator ID; also used in background',
    },
    {
      name: 'anomaly_subject_name',
      defaultValue: 'external.admin',
      description: 'Secondary federated operator; also used in background',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.105',
      description: 'Secondary operator source IP; also used in background',
    },
    {
      name: 'service_account_prefix',
      defaultValue: 'svc-maint',
      description: 'New service-account name prefix',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '144',
      description: 'Routine events before the one-shot chain',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked sequence; false emits background only',
    },
  ],
  slug: 'cloud-yandex-audit-trails',
  generatorId: 'cloud-yandex-audit-trails',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Static access key created',
      json: String.raw`{"@timestamp": "2026-09-26T17:40:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "yandex_cloud", "dataset": "yandex_cloud.audit", "id": "16a449ed-a6b7-4a82-9852-dad0a9a4a9d8", "action": "CreateAccessKey", "category": ["iam"], "type": ["change"], "outcome": "success", "original": "{\"authentication\": {\"authenticated\": true, \"federation_id\": \"bpffd0b1506f5e3af1f1\", \"federation_name\": \"contoso\", \"federation_type\": \"PRIVATE_FEDERATION\", \"subject_id\": \"ajeead78627c1eb1858a\", \"subject_name\": \"external.admin\", \"subject_type\": \"FEDERATED_USER_ACCOUNT\"}, \"authorization\": {\"authorized\": true}, \"details\": {\"access_key_id\": \"ajeb23af260f79248318\", \"created_at\": \"2026-09-26T17:40:00+00:00\", \"description\": \"Maintenance automation\", \"key_id\": \"YCc2f24601f17841008fc2ccd\", \"service_account_id\": \"aje267f953d84dd4d7ba\", \"service_account_name\": \"svc-maint-000005\"}, \"event_id\": \"16a449ed-a6b7-4a82-9852-dad0a9a4a9d8\", \"event_source\": \"iam\", \"event_status\": \"DONE\", \"event_time\": \"2026-09-26T17:40:00+00:00\", \"event_type\": \"yandex.cloud.audit.iam.CreateAccessKey\", \"request_metadata\": {\"remote_address\": \"198.51.100.105\", \"request_id\": \"53a139f3-35bc-4a99-b4ab-2e97bcd68c4c\", \"user_agent\": \"yc/0.157\"}, \"resource_metadata\": {\"path\": [{\"resource_id\": \"bpf8fce59da310dc940c\", \"resource_name\": \"contoso-org\", \"resource_type\": \"organization-manager.organization\"}, {\"resource_id\": \"b1g0a10235b15143e07a\", \"resource_name\": \"contoso-cloud\", \"resource_type\": \"resource-manager.cloud\"}, {\"resource_id\": \"b1g2a15c9bea04fe16e5\", \"resource_name\": \"production\", \"resource_type\": \"resource-manager.folder\"}]}}"}, "source": {"ip": "198.51.100.105"}, "user": {"id": "ajeead78627c1eb1858a", "name": "external.admin"}, "related": {"ip": ["198.51.100.105"], "user": ["external.admin"]}, "cloud": {"provider": "yandex", "account": {"id": "b1g0a10235b15143e07a"}}, "yandex_cloud": {"audit": {"authentication": {"authenticated": true, "federation_id": "bpffd0b1506f5e3af1f1", "federation_name": "contoso", "federation_type": "PRIVATE_FEDERATION", "subject_id": "ajeead78627c1eb1858a", "subject_name": "external.admin", "subject_type": "FEDERATED_USER_ACCOUNT"}, "authorization": {"authorized": true}, "details": {"access_key_id": "ajeb23af260f79248318", "created_at": "2026-09-26T17:40:00+00:00", "description": "Maintenance automation", "key_id": "YCc2f24601f17841008fc2ccd", "service_account_id": "aje267f953d84dd4d7ba", "service_account_name": "svc-maint-000005"}, "event_id": "16a449ed-a6b7-4a82-9852-dad0a9a4a9d8", "event_source": "iam", "event_status": "DONE", "event_time": "2026-09-26T17:40:00+00:00", "event_type": "yandex.cloud.audit.iam.CreateAccessKey", "request_metadata": {"remote_address": "198.51.100.105", "request_id": "53a139f3-35bc-4a99-b4ab-2e97bcd68c4c", "user_agent": "yc/0.157"}, "resource_metadata": {"path": [{"resource_id": "bpf8fce59da310dc940c", "resource_name": "contoso-org", "resource_type": "organization-manager.organization"}, {"resource_id": "b1g0a10235b15143e07a", "resource_name": "contoso-cloud", "resource_type": "resource-manager.cloud"}, {"resource_id": "b1g2a15c9bea04fe16e5", "resource_name": "production", "resource_type": "resource-manager.folder"}]}}}}`,
    },
  ],
};
