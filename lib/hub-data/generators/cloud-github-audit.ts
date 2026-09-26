import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudGithubAudit: GeneratorMeta = {
  slug: 'cloud-github-audit',
  displayName: 'GitHub Organization REST Audit',
  category: 'cloud',
  description:
    'GitHub Enterprise Cloud organization audit log records as returned by the REST audit endpoint, projected to ECS the way the Elastic GitHub integration maps them, with the complete native object in event.original. Covers a selected set of successful repository-administration actions by owners, members and outside collaborators on persistent and disposable sandbox repositories. Recurring episodes grant a collaborator write access to a sandbox, raise it to admin, remove main protection, download a ZIP and delete the repository within 30 minutes.',
  dataSource:
    'GitHub Enterprise Cloud organization audit log, REST audit endpoint (selected successful repository-administration actions)',
  format: ['JSON', 'ECS'],
  eventCount: 12,
  templateCount: 1,
  highlights: [
    'Native REST audit object in event.original',
    'Stateful repositories, collaborators and branch protection',
    'Recurring five-step grant-to-deletion chain on a sandbox',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (at least 6): the first episode follows one interval after start, and the next is due one interval after the actual grant, so starts are usually one to two intervals apart. One owner grants an outside collaborator write access to a protected sandbox, changes it to admin and removes main protection; the collaborator downloads a ZIP archive; the owner deletes the repository. The five records keep this order within 30 minutes, interleaved with ordinary records; owner, collaborator and sandbox differ between consecutive episodes where possible. Every step and every pair of steps also occurs in ordinary traffic; only the complete ordered sequence by one owner and one collaborator within 30 minutes is absent from anomaly_mode: false.',
  generatorId: 'github',
  eventTypes: [
    {
      id: 'repo.download_zip',
      description:
        'Archive download by an owner, member or collaborator with access, sometimes 2-3 in a row',
      frequency: '69.9% measured share',
      category: 'configuration, web',
    },
    {
      id: 'protected_branch.create',
      description:
        'Protection restored after a hotfix or onboarding, or set on a recreated sandbox',
      frequency: '5.0% measured share',
      category: 'configuration, web',
    },
    {
      id: 'protected_branch.destroy',
      description: 'Temporary removal for a hotfix, onboarding or teardown',
      frequency: '4.5% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.add_member',
      description:
        'An owner grants an outside collaborator read, write or admin (accepted access)',
      frequency: '4.1% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.update_member',
      description:
        'Quick correction after a grant, later permission change or revert',
      frequency: '3.7% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.remove_member',
      description: 'Access revoked hours later, or during teardown',
      frequency: '3.0% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.destroy',
      description:
        'Sandbox teardown, or the end of a short sandbox collaboration',
      frequency: '2.5% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.create',
      description:
        'A deleted sandbox recreated under the same name with a new ID',
      frequency: '2.5% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.add_topic',
      description: 'Topic added on a persistent repository',
      frequency: '2.2% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.remove_topic',
      description: 'Topic removed from a persistent repository',
      frequency: '1.7% measured share',
      category: 'configuration, web',
    },
    {
      id: 'org.add_member',
      description: 'One test identity joins the organization',
      frequency: '0.5% measured share',
      category: 'configuration, web, iam',
    },
    {
      id: 'org.remove_member',
      description: 'The test identity leaves the organization',
      frequency: '0.4% measured share',
      category: 'configuration, web, iam',
    },
  ],
  realismFeatures: [
    'One synthetic organization with three owners, two members with read access through the base permission and three outside collaborators, three persistent private repositories and three disposable sandboxes. Repository, collaborator, protection, topic and test-member state is bounded and followed by every action: no action targets a deleted incarnation, and a deleted sandbox is recreated later by ordinary recovery with a new repository ID and protection set again.',
    'Ordinary activity is a set of independent tasks that start at random: downloads, topic edits, collaborator grants with optional corrections and later removals, permission changes, revocations, hotfixes, sandbox onboarding, teardown and short sandbox collaborations. Delays between steps are random, from about a minute to hours, with no fixed schedule or rotation; volume is about 240-275 records per day, busier from 08:00 to 18:00 UTC.',
    'Each record falls at a random second and millisecond within its source minute. event.created is the next poll of a synthetic Elastic Agent httpjson input polling every two minutes (0.7-122 s after source time), and event.ingested follows by a few seconds, truncated to whole seconds.',
    'All 32/32 leaf paths of the pinned Elastic github.audit repo.destroy sample occur, with ECS 8.11.0; names and IDs are kept in github.* as strings, and repo.destroy and repo.download_zip map to event.type change as the maintained pipeline does. A ZIP audit record reports no bytes, destination or contents, so it is not evidence of exfiltration by itself.',
    'Four-step subsequences ending in deletion are rare in ordinary traffic (0-3 each per 100 hours), and detectors with windows longer than 30 minutes also find complete sequences there. At intervals near 6 hours daily counts of the chain actions rise (write to admin changes +69% at 6 hours); at the 24-hour default no daily-count difference was measured.',
    'Membership, protection and topic objects are reduced; their field combinations and lowercase read/write/admin values are inferences from the catalog and role documentation, not live captures. No raw byte parity, live Elastic ingestion or GitHub document-ID allocation is claimed; rates, delays, the daily profile and the poll are synthetic choices. API authentication, git events, invitations and pagination are not generated.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring anomaly episodes; false keeps the same identities, repositories and task mix without episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Source-time recurrence in hours; values below 6 are raised to 6',
    },
    {
      name: 'org',
      defaultValue: 'contoso-security',
      description: 'Organization name',
    },
    {
      name: 'org_id',
      defaultValue: '71234567',
      description: 'Organization numeric ID',
    },
    {
      name: 'sensitive_repo',
      defaultValue: 'contoso-security/payroll-service-drill',
      description:
        'One of the three sandbox repositories, under the configured organization',
    },
    {
      name: 'sensitive_repo_id',
      defaultValue: '981234567',
      description:
        'Its initial ID; the other sandboxes start below it and recreated sandboxes get larger IDs',
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'ops-admin',
      description: 'Name of the third organization owner',
    },
    {
      name: 'suspicious_actor_id',
      defaultValue: '139876543',
      description: 'Numeric ID of the third organization owner',
    },
    {
      name: 'external_user',
      defaultValue: 'external-collab',
      description: 'Name of the first outside collaborator',
    },
    {
      name: 'external_user_id',
      defaultValue: '98234567',
      description: 'Numeric ID of the first outside collaborator',
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
  ],
  sampleOutputs: [
    {
      title: 'Permission change of the first episode (repo.update_member)',
      json: String.raw`{
  "@timestamp": "2026-09-26T19:47:09.886+00:00",
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
    "action": "repo.update_member",
    "agent_id_status": "verified",
    "category": [
      "configuration",
      "web"
    ],
    "created": "2026-09-26T19:47:24.084+00:00",
    "dataset": "github.audit",
    "id": "Upnt3E9XQjazZSRd-M-n0A",
    "ingested": "2026-09-26T19:47:25+00:00",
    "kind": "event",
    "module": "github",
    "original": "{\"@timestamp\": 1790452029886, \"_document_id\": \"Upnt3E9XQjazZSRd-M-n0A\", \"action\": \"repo.update_member\", \"actor\": \"ops-admin\", \"actor_id\": 139876543, \"created_at\": 1790452029886, \"new_repo_permission\": \"admin\", \"old_repo_permission\": \"write\", \"org\": \"contoso-security\", \"org_id\": 71234567, \"public_repo\": false, \"repo\": \"contoso-security/payroll-service-drill\", \"repo_id\": 981726064, \"user\": \"vendor-qa\", \"user_id\": 98234611, \"visibility\": \"private\"}",
    "type": [
      "change"
    ]
  },
  "github": {
    "actor_id": "139876543",
    "category": "repo",
    "new_repo_permission": "admin",
    "old_repo_permission": "write",
    "org": "contoso-security",
    "org_id": "71234567",
    "public_repo": false,
    "repo": "contoso-security/payroll-service-drill",
    "repo_id": "981726064",
    "user_id": "98234611",
    "visibility": "private"
  },
  "input": {
    "type": "httpjson"
  },
  "related": {
    "user": [
      "ops-admin",
      "139876543",
      "vendor-qa",
      "98234611"
    ]
  },
  "tags": [
    "forwarded",
    "github-audit",
    "preserve_original_event"
  ],
  "user": {
    "id": "139876543",
    "name": "ops-admin",
    "target": {
      "id": "98234611",
      "name": "vendor-qa"
    }
  }
}`,
    },
  ],
};
