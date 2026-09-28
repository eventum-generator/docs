import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandexAuditTrails: GeneratorMeta = {
  slug: 'cloud-yandex-audit-trails',
  displayName: 'Yandex Cloud Audit Trails',
  category: 'cloud',
  description:
    'Yandex Cloud Audit Trails management events for one organization, cloud and folder, as ECS records with the native audit record in event.original and parsed under yandex_cloud.audit, for SIEM content that watches cloud IAM and Compute changes. Successful control-plane operations only. Recurring episodes show an operator provisioning a service account with persistent write access.',
  dataSource: 'Yandex Cloud Audit Trails management-log format (control plane)',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  generatorId: 'yandex-audit',
  highlights: [
    'Native audit record in vendor key order in event.original',
    'Six federated operators in independent sessions',
    'Recurring account, editor binding and static key chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One operator creates a service account (iam.CreateServiceAccount), adds the editor role on the folder for it (resourcemanager.UpdateFolderAccessBindings) and issues it a static access key (iam.CreateAccessKey), all within 30 minutes of the creation. Episodes recur every 24 hours by default (anomaly_interval_hours, at least 2): the first within the first min(interval, 24 h), each later one within a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards office hours, plus a random delay of a few minutes; missed episodes are not replayed, and at intervals far from a multiple of 24 hours some starts fall outside working hours. The operator changes with every episode, and the account is cleaned up about a day later like any other. Every step and partial sequence occurs in background; a background key that would complete the chain within 30 minutes is not issued.',
  eventTypes: [
    {
      id: 'compute.UpdateInstance',
      description: 'Label update on a permanent or CI VM',
      frequency: '40.2% measured share',
      category: 'configuration',
    },
    {
      id: 'resourcemanager.UpdateFolderAccessBindings',
      description: 'ADD or REMOVE of one folder role for a service account',
      frequency: '14.8% measured share',
      category: 'iam',
    },
    {
      id: 'iam.CreateAccessKey',
      description: 'Static access key for a service account',
      frequency: '10.3% measured share',
      category: 'iam',
    },
    {
      id: 'iam.DeleteAccessKey',
      description: 'Key rotation or cleanup',
      frequency: '9.5% measured share',
      category: 'iam',
    },
    {
      id: 'iam.CreateServiceAccount',
      description: 'New service account',
      frequency: '7.3% measured share',
      category: 'iam',
    },
    {
      id: 'compute.CreateInstance',
      description: 'Temporary CI VM',
      frequency: '6.5% measured share',
      category: 'configuration',
    },
    {
      id: 'compute.DeleteInstance',
      description: 'Cleanup of a CI VM',
      frequency: '6.2% measured share',
      category: 'configuration',
    },
    {
      id: 'iam.DeleteServiceAccount',
      description: 'Cleanup of a created account after its keys and roles',
      frequency: '5.2% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Six federated operators with different activity levels work in independent sessions, thinned by an office-hours curve (UTC+3), from an office or VPN address; each session holds a random number of operations seconds to minutes apart.',
    'Label updates on 64 permanent VMs and live CI VMs; temporary CI VMs deleted after hours by the creator or another operator; service-account provisioning with a folder role and a static key; role and key maintenance on 24 permanent and created accounts.',
    'Created accounts are cleaned up after about a day: keys deleted, roles removed, then the account deleted. ADD never repeats a held binding, REMOVE only follows an ADD, and a key is deleted only once.',
    'event.original keeps the field order of the vendor example on one line, and details follow the event references in snake_case. No live tenant capture was compared, so field-complete parity is not claimed.',
    'Optional token_info, request_parameters, response, error and remote_port are omitted; failed and cancelled operations and transport containers are not modeled. user_agent is a fixed yc CLI string and some IDs are synthetic.',
    'Rates, lifetimes and weights are synthetic, not measured production values. user.target is an ECS mapping of the service account an event acts on.',
  ],
  parameters: [
    {
      name: 'cloud_id',
      defaultValue: 'b1g0a10235b15143e07a',
      description: 'Cloud in the resource path and cloud.account.id',
    },
    {
      name: 'folder_id',
      defaultValue: 'b1g2a15c9bea04fe16e5',
      description: 'Folder in the resource path and in binding changes',
    },
    {
      name: 'organization_id',
      defaultValue: 'bpf8fce59da310dc940c',
      description: 'Organization in the resource path',
    },
    {
      name: 'service_account_prefix',
      defaultValue: 'svc-maint',
      description:
        'Name prefix of created service accounts; a random suffix keeps names unique',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, at least 2',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'true adds recurring anomaly episodes; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'CreateAccessKey completing the second episode',
      json: String.raw`{"@timestamp": "2026-10-02T15:08:22.184694Z", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "yandex_cloud", "dataset": "yandex_cloud.audit", "id": "458b6b34-9a4e-47cd-952b-4b86f163847f", "action": "CreateAccessKey", "category": ["iam"], "type": ["creation"], "outcome": "success", "original": "{\"event_id\": \"458b6b34-9a4e-47cd-952b-4b86f163847f\", \"event_source\": \"iam\", \"event_type\": \"yandex.cloud.audit.iam.CreateAccessKey\", \"event_time\": \"2026-10-02T15:08:22.184694Z\", \"authentication\": {\"authenticated\": true, \"subject_type\": \"FEDERATED_USER_ACCOUNT\", \"subject_id\": \"ajeb3f10c9e82a4d7c61\", \"subject_name\": \"platform.admin\", \"federation_id\": \"bpffd0b1506f5e3af1f1\", \"federation_name\": \"contoso\", \"federation_type\": \"PRIVATE_FEDERATION\"}, \"authorization\": {\"authorized\": true}, \"resource_metadata\": {\"path\": [{\"resource_type\": \"organization-manager.organization\", \"resource_id\": \"bpf8fce59da310dc940c\", \"resource_name\": \"contoso-org\"}, {\"resource_type\": \"resource-manager.cloud\", \"resource_id\": \"b1g0a10235b15143e07a\", \"resource_name\": \"contoso-cloud\"}, {\"resource_type\": \"resource-manager.folder\", \"resource_id\": \"b1g2a15c9bea04fe16e5\", \"resource_name\": \"production\"}]}, \"request_metadata\": {\"remote_address\": \"10.60.1.44\", \"user_agent\": \"yc/0.157\", \"request_id\": \"31558381-44b0-4d99-8454-978c38afef66\"}, \"event_status\": \"DONE\", \"details\": {\"access_key_id\": \"aje2ec020017dd5a2cbb\", \"service_account_id\": \"aje297789a6ce32a2b57\", \"service_account_name\": \"svc-maint-297789a6ce32a2b57\", \"key_id\": \"YCkGnuBifwTIKhuZSlVNoaauY\", \"description\": \"Maintenance automation\", \"created_at\": \"2026-10-02T15:08:22.184694Z\"}}"}, "source": {"ip": "10.60.1.44"}, "user": {"id": "ajeb3f10c9e82a4d7c61", "name": "platform.admin", "target": {"id": "aje297789a6ce32a2b57", "name": "svc-maint-297789a6ce32a2b57"}}, "related": {"ip": ["10.60.1.44"], "user": ["platform.admin", "svc-maint-297789a6ce32a2b57"]}, "cloud": {"provider": "yandex", "account": {"id": "b1g0a10235b15143e07a"}}, "yandex_cloud": {"audit": {"event_id": "458b6b34-9a4e-47cd-952b-4b86f163847f", "event_source": "iam", "event_type": "yandex.cloud.audit.iam.CreateAccessKey", "event_time": "2026-10-02T15:08:22.184694Z", "authentication": {"authenticated": true, "subject_type": "FEDERATED_USER_ACCOUNT", "subject_id": "ajeb3f10c9e82a4d7c61", "subject_name": "platform.admin", "federation_id": "bpffd0b1506f5e3af1f1", "federation_name": "contoso", "federation_type": "PRIVATE_FEDERATION"}, "authorization": {"authorized": true}, "resource_metadata": {"path": [{"resource_type": "organization-manager.organization", "resource_id": "bpf8fce59da310dc940c", "resource_name": "contoso-org"}, {"resource_type": "resource-manager.cloud", "resource_id": "b1g0a10235b15143e07a", "resource_name": "contoso-cloud"}, {"resource_type": "resource-manager.folder", "resource_id": "b1g2a15c9bea04fe16e5", "resource_name": "production"}]}, "request_metadata": {"remote_address": "10.60.1.44", "user_agent": "yc/0.157", "request_id": "31558381-44b0-4d99-8454-978c38afef66"}, "event_status": "DONE", "details": {"access_key_id": "aje2ec020017dd5a2cbb", "service_account_id": "aje297789a6ce32a2b57", "service_account_name": "svc-maint-297789a6ce32a2b57", "key_id": "YCkGnuBifwTIKhuZSlVNoaauY", "description": "Maintenance automation", "created_at": "2026-10-02T15:08:22.184694Z"}}}}`,
    },
  ],
};
