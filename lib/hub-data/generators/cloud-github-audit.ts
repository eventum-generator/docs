import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudGithubAudit: GeneratorMeta = {
  slug: 'cloud-github-audit',
  displayName: 'GitHub Organization Audit',
  category: 'cloud',
  dataSource: 'Selected GitHub organization REST audit objects',
  description:
    'GitHub organization REST audit objects with causal collaborator permissions, bounded repository recovery and recurring daily protection-removal sequences.',
  generatorId: 'github',
  eventCount: 12,
  templateCount: 1,
  highlights: [
    'Twelve documented audit actions in both modes',
    'Native IDs and permissions preserved',
    'Five-record daily sequences span twenty minutes',
  ],
  anomalyChain:
    'Every 24 hours, an owner grants write access to an outside collaborator, raises it to admin and removes main protection on an existing disposable drill repository. The collaborator downloads its ZIP, then the owner deletes it. Five records span 20 minutes. Visible recreation with a new repository ID and protection occurs at least an hour later; ordinary maintenance shares every action, actor and target.',
  eventTypes: [
    {
      id: 'repo.download_zip',
      description: 'Selected archive access on an existing repository',
      frequency:
        'Weighted ordinary archive access and one external download per episode',
      category: 'access',
    },
    {
      id: 'repo.add_topic',
      description: 'Add an absent tracked repository topic',
      frequency: 'Ordinary topic toggles on three permanent repositories',
      category: 'configuration',
    },
    {
      id: 'repo.remove_topic',
      description: 'Remove an existing tracked repository topic',
      frequency: 'Ordinary topic toggles on three permanent repositories',
      category: 'configuration',
    },
    {
      id: 'repo.add_member',
      description:
        'Grant accepted write access to the existing outside identity',
      frequency: 'Ordinary drill and one per episode',
      category: 'iam',
    },
    {
      id: 'repo.update_member',
      description: 'Raise existing write access to admin',
      frequency: 'Ordinary drill and one per episode',
      category: 'iam',
    },
    {
      id: 'repo.remove_member',
      description: 'Remove an existing collaborator grant',
      frequency: 'Ordinary drill cleanup',
      category: 'iam',
    },
    {
      id: 'protected_branch.create',
      description: 'Enable main protection on the current incarnation',
      frequency: 'Visible ordinary recovery and maintenance',
      category: 'configuration',
    },
    {
      id: 'protected_branch.destroy',
      description: 'Remove existing main protection',
      frequency: 'Ordinary drill and one per episode',
      category: 'configuration',
    },
    {
      id: 'repo.create',
      description: 'Recreate the disposable initialized drill with a fresh ID',
      frequency: 'At least one hour after its deletion',
      category: 'configuration',
    },
    {
      id: 'repo.destroy',
      description: 'Delete the current disposable drill incarnation',
      frequency: 'Ordinary drill and one per episode',
      category: 'configuration',
    },
    {
      id: 'org.add_member',
      description: 'Add the existing test identity while absent',
      frequency: 'Alternating ordinary membership maintenance',
      category: 'iam',
    },
    {
      id: 'org.remove_member',
      description: 'Remove the existing test identity while present',
      frequency: 'Alternating ordinary membership maintenance',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Native UNIX-millisecond clocks, opaque document IDs, actor/organization/repository IDs and action-specific permission/protection/topic values are retained and normalized following the pinned maintained integration.',
    'Three permanent repositories have bounded topic sets; one disposable initialized recovery drill and one test organization member have explicit current state. No action references a deleted incarnation or absent grant.',
    'The outside collaborator performs the ZIP download after accepted repository access. The download alone proves neither authentication, sensitive content nor exfiltration.',
    'Ordinary six-hour maintenance shares all twelve actions and actors, with steps separated by 30 minutes. Daily injected sequences use twenty-minute correlation and wait for visible recovery.',
    'Five-minute input slots carry 0–999 ms source jitter and immediate synthetic collection. Rates, initial repository protection, accepted grants and initialization during recreation are scenario assumptions.',
    'The pinned normalized sample has 32/32 field-path presence coverage. Full live REST wire captures, optional-field combinations and pipeline execution are not established; synthetic IDs and selected catalog objects do not claim raw parity.',
  ],
  format: ['JSON', 'ECS'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring dense sequences',
    },
    {
      name: 'org',
      defaultValue: 'contoso-security',
      description: 'Organization name/numeric ID',
    },
    {
      name: 'org_id',
      defaultValue: '71234567',
      description: 'Organization name/numeric ID',
    },
    {
      name: 'sensitive_repo',
      defaultValue: 'contoso-security/payroll-service-drill',
      description: 'Existing disposable initialized recovery-drill repository',
    },
    {
      name: 'sensitive_repo_id',
      defaultValue: '981234567',
      description: 'Initial repository ID, incremented at recreation',
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'ops-admin',
      description: 'Owner also active in ordinary maintenance',
    },
    {
      name: 'suspicious_actor_id',
      defaultValue: '139876543',
      description: 'Owner also active in ordinary maintenance',
    },
    {
      name: 'external_user',
      defaultValue: 'external-collab',
      description:
        'Existing outside identity with accepted repository access when granted',
    },
    {
      name: 'external_user_id',
      defaultValue: '98234567',
      description:
        'Existing outside identity with accepted repository access when granted',
    },
    {
      name: 'collector_id',
      defaultValue: '5630df5f-562b-4c5a-bcc1-b151fbca02c4',
      description: 'Synthetic collector identity',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: 'df3107a1-9f4a-4336-ae3a-ecad098902d4',
      description: 'Synthetic collector process identity',
    },
    {
      name: 'collector_version',
      defaultValue: '9.4.4',
      description: 'Synthetic collector version',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time recurrence, at least six hours',
    },
  ],
  sampleOutputs: [
    {
      title: 'Current drill branch protection removed',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:20:00.153+00:00",
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
    "version": "8.11.0"
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
    "created": "2026-09-26T00:20:00.153+00:00",
    "dataset": "github.audit",
    "id": "U0r7vYLjRAu0Nyr9QZP9jw",
    "ingested": "2026-09-26T00:20:00.153+00:00",
    "kind": "event",
    "module": "github",
    "original": "{\"@timestamp\": 1790382000153, \"_document_id\": \"U0r7vYLjRAu0Nyr9QZP9jw\", \"action\": \"protected_branch.destroy\", \"actor\": \"ops-admin\", \"actor_id\": 139876543, \"admin_enforced\": true, \"created_at\": 1790382000153, \"name\": \"main\", \"org\": \"contoso-security\", \"org_id\": 71234567, \"public_repo\": false, \"repo\": \"contoso-security/payroll-service-drill\", \"repo_id\": 981234571}",
    "type": [
      "change"
    ]
  },
  "github": {
    "actor_id": "139876543",
    "admin_enforced": true,
    "category": "protected_branch",
    "name": "main",
    "org": "contoso-security",
    "org_id": "71234567",
    "public_repo": false,
    "repo": "contoso-security/payroll-service-drill",
    "repo_id": "981234571"
  },
  "input": {
    "type": "httpjson"
  },
  "related": {
    "user": [
      "ops-admin",
      "139876543"
    ]
  },
  "tags": [
    "forwarded",
    "github-audit",
    "preserve_original_event"
  ],
  "user": {
    "id": "139876543",
    "name": "ops-admin"
  }
}`,
    },
  ],
};
