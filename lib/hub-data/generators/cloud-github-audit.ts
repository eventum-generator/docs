import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudGithubAudit: GeneratorMeta = {
  slug: 'cloud-github-audit',
  displayName: 'GitHub Organization REST Audit',
  category: 'cloud',
  description:
    'GitHub Enterprise Cloud organization audit log records as returned by the REST audit endpoint, projected to ECS the way the Elastic GitHub integration maps them, with the complete native object in event.original. Covers GitHub Actions workflow runs, archive downloads and a selected set of successful repository-administration actions by owners, members, build accounts and outside collaborators. Recurring episodes grant one collaborator write access to a repository, raise it to admin, remove main protection, download a ZIP and delete the repository within 30 minutes.',
  dataSource:
    'GitHub Enterprise Cloud organization audit log, REST audit endpoint (GitHub Actions workflow runs and selected successful repository-administration actions)',
  format: ['JSON', 'ECS'],
  eventCount: 16,
  templateCount: 1,
  highlights: [
    'Native REST audit object in event.original',
    'GitHub Actions runs from pull requests, merges and dispatches',
    'Recurring five-step grant-to-deletion chain on one repository',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Roughly once per anomaly_interval_hours (default 24, values below 6 raised to 6): the first episode starts at a random time within the first min(interval, 24 h) of the data, each later one within a window of a quarter of the interval (at most 6 hours) centred one interval after the previous episode's first grant, both leaning towards busy hours; an episode on a sandbox waits until a sandbox is protected and free of the chosen collaborator, and there is no catch-up. At the default, consecutive episodes are about 21-27 hours apart. One owner and one outside collaborator act on one repository - nine in ten a new review repository the owner first creates and protects, one in ten a sandbox: the owner grants write access, changes it to admin and removes main protection, the collaborator downloads a ZIP archive, and the owner deletes the repository, in this order within 30 minutes of the grant (typically 8-25 minutes), interleaved with ordinary records. Consecutive episodes differ in owner, collaborator and repository when possible and never repeat all three. Every step, every pair of consecutive steps and every four-step part also occurs in ordinary traffic; only the complete ordered sequence within 30 minutes of the grant is absent from anomaly_mode: false.",
  generatorId: 'github',
  eventTypes: [
    {
      id: 'workflows.prepared_workflow_job',
      description:
        'A job of a workflow run starts on a GitHub-hosted runner; only the release publish job lists RELEASE_TOKEN in secrets_passed',
      frequency: '35.4% measured share',
      category: 'configuration, web',
    },
    {
      id: 'workflows.completed_workflow_run',
      description:
        'A run attempt completes: success 88%, failure 10%, cancelled 2%',
      frequency: '21.1% measured share',
      category: 'configuration, web',
    },
    {
      id: 'workflows.created_workflow_run',
      description:
        'A run of CI (61%), CodeQL (35%) or Release (5%) of a persistent repository starts on a pull request (53%), a push (43%) or a dispatch (5%)',
      frequency: '20.4% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.download_zip',
      description:
        'Archive downloads by owners, members and collaborators with access (73%, sometimes 2-3 in a row) and release archives fetched by release-sync-svc (27%)',
      frequency: '15.1% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.add_member',
      description:
        'An owner grants an outside collaborator read, write or admin (accepted access)',
      frequency: '1.45% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.update_member',
      description:
        'Quick corrections after a grant, later permission changes and reverts',
      frequency: '1.19% measured share',
      category: 'configuration, web',
    },
    {
      id: 'protected_branch.create',
      description:
        'Protection set on a new or recreated repository, or restored after a hotfix or onboarding',
      frequency: '0.98% measured share',
      category: 'configuration, web',
    },
    {
      id: 'protected_branch.destroy',
      description:
        'Temporary removal for a hotfix, onboarding, teardown or review',
      frequency: '0.79% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.create',
      description:
        'A deleted sandbox recreated under the same name with a new ID, or a review repository created',
      frequency: '0.77% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.destroy',
      description:
        'Sandbox teardown, the end of a short sandbox collaboration, or the end of a review',
      frequency: '0.77% measured share',
      category: 'configuration, web',
    },
    {
      id: 'workflows.rerun_workflow_run',
      description:
        'The developer who triggered a failed run re-runs it (about a third of failures); attempt 2 has its jobs and completion again',
      frequency: '0.74% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.remove_member',
      description: 'Access revoked hours later, or during teardown',
      frequency: '0.69% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.add_topic',
      description: 'Topic added on a persistent repository',
      frequency: '0.27% measured share',
      category: 'configuration, web',
    },
    {
      id: 'repo.remove_topic',
      description: 'Topic removed from a persistent repository',
      frequency: '0.21% measured share',
      category: 'configuration, web',
    },
    {
      id: 'org.add_member',
      description: 'One test identity joins the organization',
      frequency: '0.07% measured share',
      category: 'configuration, web, iam',
    },
    {
      id: 'org.remove_member',
      description: 'The test identity leaves the organization',
      frequency: '0.06% measured share',
      category: 'configuration, web, iam',
    },
  ],
  realismFeatures: [
    'One synthetic organization with three owners, two members (read access through the base permission, write access to the persistent repositories through a developer team whose grants produce no records), two build-automation machine accounts and three outside collaborators. It holds three persistent private repositories and three disposable sandboxes, and owners create and delete review repositories for one collaborator. No action targets a deleted incarnation: a sandbox is recreated with a new repository ID and protection set again, and a review repository name is never reused.',
    "About 1,600 records per day in two streams with their own UTC hour-of-day curves: people's administration and archive downloads (about 290 per day, relative activity 0.35 at 00-06 and 1.5 at 08-18) and GitHub Actions activity with release archive downloads (about 1,300 per day, about 45 records per hour and 75 per hour from 07:00 to 19:00). Workflow records are about 78% of all records; filter on event.action to study administration alone.",
    "Each persistent repository keeps three to six open pull requests with a number, head branch and author. A developer's push to an open pull request starts CI on refs/heads/<branch> and CI and CodeQL on refs/pull/<number>/merge; a merge starts CI, CodeQL and, one time in four, Release on main. The build accounts only dispatch runs on main and fetch release archives. A run has one to three jobs and completes after a run time around a per-workflow median of 4, 9 or 7 minutes.",
    "People's administration is a set of independent tasks - downloads, topic edits, collaborator grants, permission changes, revocations, hotfixes, sandbox onboarding, teardown, short sandbox collaborations and reviews - with random delays from about a minute to hours and no fixed schedule or rotation. Reviews create about six repositories per day (median lifetime about half an hour, up to about three days), and quick handoffs go through four of the five chain steps.",
    'event.created is the next poll of a synthetic Elastic Agent httpjson input polling every two minutes, 0.3-122 s after source time, and event.ingested follows by a few seconds, truncated to whole seconds. All 32/32 leaf paths of the pinned Elastic github.audit repo.destroy sample occur, with ECS 8.11.0; names and IDs are kept in github.* as strings, and repo.destroy and repo.download_zip map to event.type change as the maintained pipeline does. A ZIP audit record reports no bytes, destination or contents, so it is not evidence of exfiltration by itself.',
    'Complete grant-elevation-protection removal-download-deletion sequences spanning 30-60 minutes occur in ordinary traffic. With anomaly_mode: true, counts of the chain parts are about one per episode higher than in ordinary traffic alone, about four more of each per day at intervals near 6 hours.',
    "Membership, protection and topic objects are reduced, and their field combinations and lowercase read/write/admin values are inferred from the catalog and role documentation; workflow records carry no runner IDs, calling workflows, re-run type or programmatic-access fields, and event.original is serialized with sorted keys and spaces after separators. Rates, delays, the daily profile, the workflow set, developers' push volume (about 16 pushes a day each), the pull request model, the review practice and the poll are synthetic choices. Consecutive records are about 36 s apart in median and up to about 12 minutes apart at night, so records of one moment, such as the runs started by one push or merge, are tens of seconds apart instead of within a second. No raw byte parity, live Elastic ingestion or GitHub document-ID allocation is claimed; API authentication, git events, invitations and pagination are not generated.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring anomaly episodes; false keeps the same identities, repositories, action classes and task mix without episodes',
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
      title: 'Permission change of an anomaly episode (repo.update_member)',
      json: String.raw`{
  "@timestamp": "2026-09-25T15:00:42.849+00:00",
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
    "created": "2026-09-25T15:02:39.294+00:00",
    "dataset": "github.audit",
    "id": "ldBHYi-VQYO__uBPL5S84A",
    "ingested": "2026-09-25T15:02:42+00:00",
    "kind": "event",
    "module": "github",
    "original": "{\"@timestamp\": 1790348442849, \"_document_id\": \"ldBHYi-VQYO__uBPL5S84A\", \"action\": \"repo.update_member\", \"actor\": \"alice\", \"actor_id\": 32100011, \"created_at\": 1790348442849, \"new_repo_permission\": \"admin\", \"old_repo_permission\": \"write\", \"org\": \"contoso-security\", \"org_id\": 71234567, \"public_repo\": false, \"repo\": \"contoso-security/support-repro-101\", \"repo_id\": 981400473, \"user\": \"contract-sre\", \"user_id\": 98234612, \"visibility\": \"private\"}",
    "type": [
      "change"
    ]
  },
  "github": {
    "actor_id": "32100011",
    "category": "repo",
    "new_repo_permission": "admin",
    "old_repo_permission": "write",
    "org": "contoso-security",
    "org_id": "71234567",
    "public_repo": false,
    "repo": "contoso-security/support-repro-101",
    "repo_id": "981400473",
    "user_id": "98234612",
    "visibility": "private"
  },
  "input": {
    "type": "httpjson"
  },
  "related": {
    "user": [
      "alice",
      "32100011",
      "contract-sre",
      "98234612"
    ]
  },
  "tags": [
    "forwarded",
    "github-audit",
    "preserve_original_event"
  ],
  "user": {
    "id": "32100011",
    "name": "alice",
    "target": {
      "id": "98234612",
      "name": "contract-sre"
    }
  }
}`,
    },
  ],
};
