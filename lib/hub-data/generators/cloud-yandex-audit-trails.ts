/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandexAuditTrails: GeneratorMeta = {
  displayName: 'Yandex Cloud Audit Trails',
  category: 'cloud',
  description:
    'Yandex Cloud management-audit JSON for live Compute and IAM resources, with daily account-role-key episodes and fair bounded cleanup.',
  dataSource: 'Yandex Cloud Audit Trails control-plane JSON',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  highlights: [
    'Eight selected management-audit classes',
    'Native JSON retained in event.original',
    'Daily IAM episodes with stateful fair cleanup',
  ],
  anomalyChain:
    'Every 24 hours, one ordinary federated administrator creates a fresh service account, adds a folder editor binding and issues its static key over 20 minutes. Account/key/binding and temporary-VM inventory are tracked and cleaned through observable operations. A full account pool can delay an episode; both operators and all classes also occur in background.',
  eventTypes: [
    {
      id: 'compute.UpdateInstance',
      description: 'Change labels on a live VM',
      frequency: '88% ordinary selection weight',
      category: 'configuration',
    },
    {
      id: 'compute.CreateInstance',
      description: 'Create a temporary CI VM',
      frequency: '2% ordinary selection weight',
      category: 'configuration',
    },
    {
      id: 'iam.CreateServiceAccount',
      description: 'Create a uniquely named maintenance account',
      frequency: '3% ordinary selection weight; periodic episode',
      category: 'iam',
    },
    {
      id: 'resourcemanager.UpdateFolderAccessBindings',
      description: 'ADD absent viewer/editor or REMOVE an existing binding',
      frequency: '4% ordinary selection weight; cleanup and periodic episode',
      category: 'iam',
    },
    {
      id: 'iam.CreateAccessKey',
      description: 'Issue one modeled static key for a live account',
      frequency: '3% ordinary selection weight; periodic episode',
      category: 'iam',
    },
    {
      id: 'iam.DeleteAccessKey',
      description: 'Remove a previously issued key',
      frequency: 'Existing-key replacement or age at least 24 hours',
      category: 'iam',
    },
    {
      id: 'iam.DeleteServiceAccount',
      description: 'Delete a temporary account after key and binding cleanup',
      frequency: 'Age at least 48 hours or account capacity',
      category: 'iam',
    },
    {
      id: 'compute.DeleteInstance',
      description:
        'Delete a live temporary CI VM and its auto-delete boot disk',
      frequency: 'Age at least six hours or temporary-VM capacity',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'UTC native/ECS timestamps and one native JSON object preserve successful management-envelope and selected details fields.',
    'At most 48 managed plus 24 permanent accounts, one modeled key and two roles per account, and eight temporary plus 64 permanent VMs. ADD/REMOVE, key deletion and account deletion preserve lifecycle order.',
    'A bounded round-robin cursor serves account, aged-key and temporary-VM cleanup, oldest first within each class. Cleanup ages are eligibility thresholds, not guaranteed deletion deadlines.',
    'The two operators are assumed to hold folder admin permissions without a prohibiting access policy. Editor on the created account does not itself authorize role assignment, and static-key creation does not prove later use.',
    'BLOCKED_RAW_EVIDENCE: selected schemas and the complete management example do not establish full event-specific raw parity or live-tenant/parser compatibility; transport containers and optional request/response/token/error sections are omitted.',
    'Public CreateInstance covers 42/42 selected example paths; private instances omit two NAT paths. DeleteServiceAccount status/expiry are omitted, and the 64-VM baseline assumes approved Compute capacity.',
  ],
  parameters: [
    {
      name: 'cloud_id',
      defaultValue: 'b1g0a10235b15143e07a',
      description: 'Resource path',
    },
    {
      name: 'folder_id',
      defaultValue: 'b1g2a15c9bea04fe16e5',
      description: 'Resource path',
    },
    {
      name: 'organization_id',
      defaultValue: 'bpf8fce59da310dc940c',
      description: 'Resource path',
    },
    {
      name: 'normal_subject_id',
      defaultValue: 'aje29545c72dd3fe508a',
      description: 'Primary federated operator',
    },
    {
      name: 'normal_subject_name',
      defaultValue: 'cloud.operator',
      description: 'Primary federated operator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.60.1.27',
      description: 'Primary federated operator',
    },
    {
      name: 'anomaly_subject_id',
      defaultValue: 'ajeead78627c1eb1858a',
      description: 'Secondary federated operator, also present in background',
    },
    {
      name: 'anomaly_subject_name',
      defaultValue: 'external.admin',
      description: 'Secondary federated operator, also present in background',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.105',
      description: 'Secondary federated operator, also present in background',
    },
    {
      name: 'service_account_prefix',
      defaultValue: 'svc-maint',
      description:
        'Lowercase account-name prefix, at most 45 characters; an opaque suffix keeps names unique',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Minimum hours between episode starts and delay before the first; use at least 1',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring linked episodes',
    },
  ],
  slug: 'cloud-yandex-audit-trails',
  generatorId: 'cloud-yandex-audit-trails',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Static access key created',
      json: String.raw`{"@timestamp": "2026-09-28T00:30:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "yandex_cloud", "dataset": "yandex_cloud.audit", "id": "1bccef44-1246-4d1b-8e3f-bbe04f846ad8", "action": "CreateAccessKey", "category": ["iam"], "type": ["creation"], "outcome": "success", "original": "{\"authentication\": {\"authenticated\": true, \"federation_id\": \"bpffd0b1506f5e3af1f1\", \"federation_name\": \"contoso\", \"federation_type\": \"PRIVATE_FEDERATION\", \"subject_id\": \"ajeead78627c1eb1858a\", \"subject_name\": \"external.admin\", \"subject_type\": \"FEDERATED_USER_ACCOUNT\"}, \"authorization\": {\"authorized\": true}, \"details\": {\"access_key_id\": \"aje58081410ca174127a\", \"created_at\": \"2026-09-28T00:30:00+00:00\", \"description\": \"Maintenance automation\", \"key_id\": \"YC731e92fede184ad4acbc477\", \"service_account_id\": \"aje79f6a3b1d7ee45a19\", \"service_account_name\": \"svc-maint-79f6a3b1d7ee45a19\"}, \"event_id\": \"1bccef44-1246-4d1b-8e3f-bbe04f846ad8\", \"event_source\": \"iam\", \"event_status\": \"DONE\", \"event_time\": \"2026-09-28T00:30:00+00:00\", \"event_type\": \"yandex.cloud.audit.iam.CreateAccessKey\", \"request_metadata\": {\"remote_address\": \"198.51.100.105\", \"request_id\": \"f267fdc0-df4f-49d4-95b4-6546eb1398d3\", \"user_agent\": \"yc/0.157\"}, \"resource_metadata\": {\"path\": [{\"resource_id\": \"bpf8fce59da310dc940c\", \"resource_name\": \"contoso-org\", \"resource_type\": \"organization-manager.organization\"}, {\"resource_id\": \"b1g0a10235b15143e07a\", \"resource_name\": \"contoso-cloud\", \"resource_type\": \"resource-manager.cloud\"}, {\"resource_id\": \"b1g2a15c9bea04fe16e5\", \"resource_name\": \"production\", \"resource_type\": \"resource-manager.folder\"}]}}"}, "source": {"ip": "198.51.100.105"}, "user": {"id": "ajeead78627c1eb1858a", "name": "external.admin"}, "related": {"ip": ["198.51.100.105"], "user": ["external.admin"]}, "cloud": {"provider": "yandex", "account": {"id": "b1g0a10235b15143e07a"}}, "yandex_cloud": {"audit": {"authentication": {"authenticated": true, "federation_id": "bpffd0b1506f5e3af1f1", "federation_name": "contoso", "federation_type": "PRIVATE_FEDERATION", "subject_id": "ajeead78627c1eb1858a", "subject_name": "external.admin", "subject_type": "FEDERATED_USER_ACCOUNT"}, "authorization": {"authorized": true}, "details": {"access_key_id": "aje58081410ca174127a", "created_at": "2026-09-28T00:30:00+00:00", "description": "Maintenance automation", "key_id": "YC731e92fede184ad4acbc477", "service_account_id": "aje79f6a3b1d7ee45a19", "service_account_name": "svc-maint-79f6a3b1d7ee45a19"}, "event_id": "1bccef44-1246-4d1b-8e3f-bbe04f846ad8", "event_source": "iam", "event_status": "DONE", "event_time": "2026-09-28T00:30:00+00:00", "event_type": "yandex.cloud.audit.iam.CreateAccessKey", "request_metadata": {"remote_address": "198.51.100.105", "request_id": "f267fdc0-df4f-49d4-95b4-6546eb1398d3", "user_agent": "yc/0.157"}, "resource_metadata": {"path": [{"resource_id": "bpf8fce59da310dc940c", "resource_name": "contoso-org", "resource_type": "organization-manager.organization"}, {"resource_id": "b1g0a10235b15143e07a", "resource_name": "contoso-cloud", "resource_type": "resource-manager.cloud"}, {"resource_id": "b1g2a15c9bea04fe16e5", "resource_name": "production", "resource_type": "resource-manager.folder"}]}}}}`,
    },
  ],
};
