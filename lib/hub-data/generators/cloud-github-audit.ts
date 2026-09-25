import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudGithubAudit: GeneratorMeta = {
  slug: 'cloud-github-audit',
  displayName: 'GitHub Organization Audit',
  category: 'cloud',
  dataSource: 'GitHub organization audit log API objects',
  description:
    'GitHub organization and repository audit events with native API objects preserved in event.original. An optional sequence models an administrator granting an external collaborator admin access, then removing branch protection, downloading and deleting the repository.',
  generatorId: 'github',
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Official GitHub audit action names',
    'Native API object in event.original',
    'Switchable administrator-abuse chain',
  ],
  anomalyChain:
    'One administrator grants an external collaborator admin access, then removes branch protection, downloads the repository and deletes it.',
  eventTypes: [
    {
      id: 'repo.add_topic',
      description: 'Repository topic changed',
      frequency: '60.3%',
      category: 'configuration',
    },
    {
      id: 'repo.download_zip',
      description: 'Repository archive downloaded',
      frequency: '19.0%',
      category: 'access',
    },
    {
      id: 'repo.create',
      description: 'Repository created',
      frequency: '15.1%',
      category: 'configuration',
    },
    {
      id: 'org.add_member',
      description: 'Organization member added',
      frequency: '4.6%',
      category: 'iam',
    },
    {
      id: 'repo.add_member',
      description: 'External collaborator added',
      frequency: '~0.2%',
      category: 'iam',
    },
    {
      id: 'repo.update_member',
      description: 'Collaborator permission elevated',
      frequency: '~0.2%',
      category: 'iam',
    },
    {
      id: 'protected_branch.destroy',
      description: 'Branch protection removed',
      frequency: '~0.2%',
      category: 'configuration',
    },
    {
      id: 'repo.destroy',
      description: 'Repository deleted',
      frequency: '~0.2%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Action fields follow the documented GitHub organization audit catalog.',
    'Every takeover cycle uses a distinct repository so no later event references a deleted repository.',
    'The five-step chain is linked by actor, external collaborator and repository.',
  ],
  format: ['JSON', 'ECS'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the correlated anomaly chain alongside routine events; false emits only background',
    },
    {
      name: 'org',
      defaultValue: 'contoso-security',
      description: 'Organization name',
    },
    {
      name: 'org_id',
      defaultValue: '71234567',
      description: 'Stable organization ID',
    },
    {
      name: 'sensitive_repo',
      defaultValue: 'contoso-security/payroll-service',
      description: 'Prefix for anomaly repositories',
    },
    {
      name: 'sensitive_repo_id',
      defaultValue: '981234567',
      description: 'Base ID for anomaly repositories',
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'ops-admin',
      description: 'Actor across the anomaly',
    },
    {
      name: 'suspicious_actor_id',
      defaultValue: '139876543',
      description: 'Stable actor ID',
    },
    {
      name: 'external_user',
      defaultValue: 'external-collab',
      description: 'New collaborator',
    },
    {
      name: 'external_user_id',
      defaultValue: '98234567',
      description: 'Collaborator ID',
    },
    {
      name: 'collector_id',
      defaultValue: '5630df5f-562b-4c5a-bcc1-b151fbca02c4',
      description: 'Stable collector ID',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: 'df3107a1-9f4a-4336-ae3a-ecad098902d4',
      description: 'Collector process ID',
    },
    {
      name: 'collector_version',
      defaultValue: '9.4.4',
      description: 'Collector version',
    },
  ],
  sampleOutputs: [
    {
      title: 'GitHub branch-protection event',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:31:27+00:00",
  "agent": {
    "ephemeral_id": "df3107a1-9f4a-4336-ae3a-ecad098902d4",
    "id": "5630df5f-562b-4c5a-bcc1-b151fbca02c4",
    "name": "github-audit-collector",
    "type": "filebeat",
    "version": "9.4.4"
  },
  "data_stream": {
    "dataset": "github.audit",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "5630df5f-562b-4c5a-bcc1-b151fbca02c4",
    "snapshot": false,
    "version": "9.4.4"
  },
  "event": {
    "action": "protected_branch.destroy",
    "agent_id_status": "verified",
    "category": [
      "configuration",
      "web"
    ],
    "created": "2026-09-25T10:31:27+00:00",
    "dataset": "github.audit",
    "id": "WrFJXUIxpQnXXAFAOQdK",
    "ingested": "2026-09-25T10:31:27+00:00",
    "kind": "event",
    "module": "github",
    "original": "{\"@timestamp\": 1790332287000, \"_document_id\": \"WrFJXUIxpQnXXAFAOQdK\", \"action\": \"protected_branch.destroy\", \"actor\": \"ops-admin\", \"actor_id\": 139876543, \"admin_enforced\": true, \"created_at\": 1790332287000, \"name\": \"main\", \"org\": \"contoso-security\", \"org_id\": 71234567, \"repo\": \"contoso-security/payroll-service-1\", \"repo_id\": 981234568, \"visibility\": \"private\"}",
    "type": [
      "change"
    ]
  },
  "github": {
    "category": "protected_branch",
    "org": "contoso-security",
    "repo": "contoso-security/payroll-service-1",
    "visibility": "private"
  },
  "input": {
    "type": "httpjson"
  },
  "related": {
    "user": [
      "ops-admin"
    ]
  },
  "tags": [
    "forwarded",
    "github-audit",
    "preserve_original_event"
  ],
  "user": {
    "name": "ops-admin"
  }
}`,
    },
  ],
};
