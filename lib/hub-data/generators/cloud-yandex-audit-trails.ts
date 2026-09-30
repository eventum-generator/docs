import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudYandexAuditTrails: GeneratorMeta = {
  slug: 'cloud-yandex-audit-trails',
  displayName: 'Yandex Cloud Audit Trails',
  category: 'cloud',
  description:
    'Yandex Cloud Audit Trails management events for one organization, cloud and folder, as ECS records with the native audit record in event.original and parsed under yandex_cloud.audit, for SIEM content that watches cloud IAM and Compute changes. Successful control-plane operations of six federated operators and a CI runner autoscaler. Recurring episodes show an operator provisioning a service account with persistent write access.',
  dataSource: 'Yandex Cloud Audit Trails management-log format (control plane)',
  eventFormat: 'ECS JSON',
  originalFormat: 'JSON',
  eventCount: 8,
  templateCount: 1,
  generatorId: 'yandex-audit',
  highlights: [
    'Native audit record in vendor key order in event.original',
    'Six federated operators and a CI runner autoscaler',
    'Recurring account, editor binding and static key chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One operator creates a service account (iam.CreateServiceAccount), adds the editor role on the folder for it (resourcemanager.UpdateFolderAccessBindings) and issues it a static access key (iam.CreateAccessKey), all within 30 minutes of the account creation and usually within 15. Episodes recur every 24 hours by default (anomaly_interval_hours, at least 2): the first starts within the first min(interval, 24 h), each later one within a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards working hours; after the drawn time each episode starts with a further random delay of a few minutes. The phase can move by at most half a window per episode; at intervals not close to a multiple of 24 hours some starts fall outside working hours. An episode due while 70 created accounts are live is skipped, and missed episodes are not replayed. The operator changes with every episode, and the account is cleaned up about a day later like any other. Every step and partial sequence, and the complete sequence spread over more than 30 minutes, also occur in background; only the complete sequence within 30 minutes is episode-only.',
  eventTypes: [
    {
      id: 'compute.UpdateInstance',
      description: 'Label update on a permanent, CI or runner VM',
      frequency: '52.5% measured share',
      category: 'configuration',
    },
    {
      id: 'compute.CreateInstance',
      description: 'Temporary CI VM or CI runner VM',
      frequency: '15.4% measured share',
      category: 'configuration',
    },
    {
      id: 'compute.DeleteInstance',
      description: 'Cleanup of a CI or runner VM',
      frequency: '15.4% measured share',
      category: 'configuration',
    },
    {
      id: 'resourcemanager.UpdateFolderAccessBindings',
      description: 'ADD or REMOVE of one folder role for a service account',
      frequency: '6.3% measured share',
      category: 'iam',
    },
    {
      id: 'iam.CreateAccessKey',
      description: 'Static access key for a service account',
      frequency: '3.5% measured share',
      category: 'iam',
    },
    {
      id: 'iam.DeleteAccessKey',
      description: 'Key rotation or cleanup',
      frequency: '3.1% measured share',
      category: 'iam',
    },
    {
      id: 'iam.CreateServiceAccount',
      description: 'New service account',
      frequency: '2.2% measured share',
      category: 'iam',
    },
    {
      id: 'iam.DeleteServiceAccount',
      description: 'Cleanup of a created account after its keys and roles',
      frequency: '1.6% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Six federated operators (about a third of records) with different activity levels work in sessions on an office-hours curve (UTC+3), from an office or a VPN address; operations in a session are one to a few minutes apart, never seconds.',
    'Operators update labels on 64 permanent VMs and live CI VMs, create temporary CI VMs deleted after hours by the creator or another operator (at most eight at a time), provision service accounts with usually a folder role (editor, viewer, storage.editor or compute.editor) and often a static key within minutes, and maintain roles and keys on 24 permanent and created accounts.',
    'A CI runner autoscaler service account (about two thirds of records) creates runner VMs for queued jobs, labels a runner busy with the job ID for every job and idle after its last job and after some others, and deletes it once idle: about 54 calls per hour in 06:00-18:00 UTC and 20 at night, never IAM. About 1,300 records per day on working days and weekends alike, with ±10% day-to-day variation.',
    'Created accounts are cleaned up after about a day: keys deleted, roles removed, then the account deleted, a few minutes apart. ADD never repeats a held binding, REMOVE only follows an ADD, a key is deleted only once, an account holds at most two background keys, and at most 70 created accounts are live at a time.',
    'event.original keeps the field order of the vendor example on one line, and details follow the event references in snake_case. user.target is an ECS mapping of the service account an event acts on. No live tenant log was compared, so field-complete parity is not claimed.',
    'Optional token_info, request_parameters, response, error and remote_port are omitted, as are status and expires_at in DeleteServiceAccount; failed and cancelled operations and transport containers are not modeled. User agents (one yc CLI version per operator, a gRPC Go client for the autoscaler) and product, subnet and federation IDs are synthetic, and the VM pools assume Compute quotas above the default of 12 VMs.',
    'Rates, lifetimes and weights are synthetic, not measured production values. With anomaly_mode true, counts of the chain parts are about one per episode higher than without episodes.',
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
      title: 'CreateAccessKey completing an anomaly episode',
      json: String.raw`{"@timestamp": "2026-09-28T12:46:42.251134Z", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "yandex_cloud", "dataset": "yandex_cloud.audit", "id": "e22f1c47-2596-4cba-8d4d-514812201ddf", "action": "CreateAccessKey", "category": ["iam"], "type": ["creation"], "outcome": "success", "original": "{\"event_id\": \"e22f1c47-2596-4cba-8d4d-514812201ddf\", \"event_source\": \"iam\", \"event_type\": \"yandex.cloud.audit.iam.CreateAccessKey\", \"event_time\": \"2026-09-28T12:46:42.251134Z\", \"authentication\": {\"authenticated\": true, \"subject_type\": \"FEDERATED_USER_ACCOUNT\", \"subject_id\": \"aje4a90f6b1d3c28e57d\", \"subject_name\": \"sre.oncall\", \"federation_id\": \"bpffd0b1506f5e3af1f1\", \"federation_name\": \"contoso\", \"federation_type\": \"PRIVATE_FEDERATION\"}, \"authorization\": {\"authorized\": true}, \"resource_metadata\": {\"path\": [{\"resource_type\": \"organization-manager.organization\", \"resource_id\": \"bpf8fce59da310dc940c\", \"resource_name\": \"contoso-org\"}, {\"resource_type\": \"resource-manager.cloud\", \"resource_id\": \"b1g0a10235b15143e07a\", \"resource_name\": \"contoso-cloud\"}, {\"resource_type\": \"resource-manager.folder\", \"resource_id\": \"b1g2a15c9bea04fe16e5\", \"resource_name\": \"production\"}]}, \"request_metadata\": {\"remote_address\": \"10.60.1.85\", \"user_agent\": \"yc/0.155\", \"request_id\": \"5ed5ca15-21fa-4baf-b540-59e4ad785929\"}, \"event_status\": \"DONE\", \"details\": {\"access_key_id\": \"ajecf34ee1c532cf2805\", \"service_account_id\": \"aje7dae6f30b3b2df237\", \"service_account_name\": \"svc-maint-7dae6f30b3b2df237\", \"key_id\": \"YCMnoToREoyxIiOvrAxpojejX\", \"description\": \"Maintenance automation\", \"created_at\": \"2026-09-28T12:46:42.251134Z\"}}"}, "source": {"ip": "10.60.1.85"}, "user": {"id": "aje4a90f6b1d3c28e57d", "name": "sre.oncall", "target": {"id": "aje7dae6f30b3b2df237", "name": "svc-maint-7dae6f30b3b2df237"}}, "related": {"ip": ["10.60.1.85"], "user": ["sre.oncall", "svc-maint-7dae6f30b3b2df237"]}, "cloud": {"provider": "yandex", "account": {"id": "b1g0a10235b15143e07a"}}, "yandex_cloud": {"audit": {"event_id": "e22f1c47-2596-4cba-8d4d-514812201ddf", "event_source": "iam", "event_type": "yandex.cloud.audit.iam.CreateAccessKey", "event_time": "2026-09-28T12:46:42.251134Z", "authentication": {"authenticated": true, "subject_type": "FEDERATED_USER_ACCOUNT", "subject_id": "aje4a90f6b1d3c28e57d", "subject_name": "sre.oncall", "federation_id": "bpffd0b1506f5e3af1f1", "federation_name": "contoso", "federation_type": "PRIVATE_FEDERATION"}, "authorization": {"authorized": true}, "resource_metadata": {"path": [{"resource_type": "organization-manager.organization", "resource_id": "bpf8fce59da310dc940c", "resource_name": "contoso-org"}, {"resource_type": "resource-manager.cloud", "resource_id": "b1g0a10235b15143e07a", "resource_name": "contoso-cloud"}, {"resource_type": "resource-manager.folder", "resource_id": "b1g2a15c9bea04fe16e5", "resource_name": "production"}]}, "request_metadata": {"remote_address": "10.60.1.85", "user_agent": "yc/0.155", "request_id": "5ed5ca15-21fa-4baf-b540-59e4ad785929"}, "event_status": "DONE", "details": {"access_key_id": "ajecf34ee1c532cf2805", "service_account_id": "aje7dae6f30b3b2df237", "service_account_name": "svc-maint-7dae6f30b3b2df237", "key_id": "YCMnoToREoyxIiOvrAxpojejX", "description": "Maintenance automation", "created_at": "2026-09-28T12:46:42.251134Z"}}}}`,
    },
  ],
};
