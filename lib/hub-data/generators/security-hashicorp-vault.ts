/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityHashicorpVault: GeneratorMeta = {
  slug: 'security-hashicorp-vault',
  displayName: 'HashiCorp Vault Audit',
  category: 'security',
  description:
    'Selected HashiCorp Vault v1.18.0 file-audit profile: linked request and response entries for KV v2 reads and lists, token self-lookup and renewal, and denied audit-device deletion, with the native audit JSON in event.original inside ECS-compatible JSON. Recurring episodes have one existing identity read ten distinct payroll secrets, then attempt to delete the audit device.',
  dataSource:
    'HashiCorp Vault v1.18.0 file audit device (JSON), KV secrets plugin v0.20.0',
  format: ['JSON', 'ECS'],
  eventCount: 6,
  templateCount: 3,
  highlights: [
    'Linked request and response pairs with native audit JSON',
    'Payroll batches, token renewals and denied deletions by four accounts',
    'Recurring payroll read run and denied audit deletion',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One existing account, different from the previous episode's, reads ten distinct payroll secrets paced like a payroll batch (an ascending employee range or a random subset), pauses for up to four minutes, then attempts to delete sys/audit/file; when other traffic spreads the reads far apart, it reads one more payroll secret first. The reader ACL permits the reads and denies the DELETE; the audit device remains enabled. An episode spans about 5 to 12 minutes. The first episode starts at a random time within the first anomaly_interval_hours (default 24, minimum 6), or the first 24 hours when the interval is longer; each later one at a random time within a window of a quarter of the interval (at most 6 hours) centred on one interval after the first read of the previous episode, so at the default interval episodes start 21 to 27 hours apart, uniformly over the day. Missed episodes are not made up. Every element occurs on its own in both modes; only three or more distinct payroll reads by one token followed by its denied audit DELETE within 400 seconds of the first read is absent from background, and each episode completes it exactly once. Counts of the chain parts are about one per episode higher than with anomaly_mode false.",
  generatorId: 'vault',
  eventTypes: [
    {
      id: 'kv-read-app-billing',
      description: 'KV v2 read of an application/billing secret',
      frequency: '48.1% measured share (48.6% background only)',
      category: 'authentication',
    },
    {
      id: 'kv-read-payroll',
      description: 'KV v2 read of a payroll secret',
      frequency: '30.3% measured share (29.4% background only)',
      category: 'authentication',
    },
    {
      id: 'token-lookup-self',
      description: 'Token reads its own remaining lifetime',
      frequency: '10.9% measured share (10.7% background only)',
      category: 'authentication',
    },
    {
      id: 'kv-metadata-list',
      description: 'KV v2 metadata list of existing child names',
      frequency: '10.4% measured share (10.8% background only)',
      category: 'authentication',
    },
    {
      id: 'audit-delete-denied',
      description: 'Reader ACL denies deleting sys/audit/file',
      frequency: '0.25% measured share (0.24% background only)',
      category: 'authentication',
    },
    {
      id: 'token-renew-self',
      description: 'Periodic 24-hour token renews itself',
      frequency: '0.19% measured share (0.19% background only)',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Each operation emits a request and a response entry with the same fresh UUID, the request first: one operation per 30-second period at a random moment inside it, 2,880 operations and 5,760 entries a day. Operations never overlap, and rates are stationary, with no daily or weekly cycle. Shares and timings are training assumptions, not production frequencies.',
    'Four existing userpass identities with the default and training-reader policies use a fixed inventory of 52 version-1 KV v2 secrets (12 application/billing, 40 payroll). The reader ACL grants read and list, the default policy self-lookup and renewal, and neither grants audit management, so both entries of a denied audit DELETE keep valid authentication, policy_results.allowed=false and a hashed response error. No secret write, token creation or revocation is included.',
    "Background is the same in both modes: single reads, lists and lookups by accounts weighted 45/25/20/10; about 12 payroll batches a day (an ascending employee range or a random subset, median about 6 reads, runs of 10 or more several times a day); about 4 denied audit deletions a day, as from a misconfigured maintenance script, spread over the four accounts, 35% retried after a median 45 seconds. A client reuses its source port until it has been idle for more than 90 seconds. An account's audit DELETE never follows its reads of three or more distinct payroll secrets within 400 seconds.",
    'Tokens renew on the LifetimeWatcher schedule, 16.8-17.6 hours after login or the previous renewal; unlike a real watcher, the grace is redrawn every cycle and no start-up renewal is emitted. Lookups report remaining TTL and last_renewal, while auth.token_ttl stays the 86,400-second creation period.',
    'Tokens, accessors and string values are keyed HMAC-SHA256 with one synthetic device salt; typed lookup times stay readable. @timestamp carries the source time at millisecond precision, event.ingested, in whole seconds, lags it log-normally (median about 2.5 s), and log.offset follows the UTF-8 byte length of each native line in the unrotated audit file.',
    'All 47 leaf paths of the pinned Elastic sample occur, which shows field presence only. The structures follow tagged vendor code and older maintained raw examples rather than a complete live v1.18.0 audit log; optional headers, enterprise fields and other endpoints are omitted, mount accessors are synthetic, and agent_id_status verified is synthetic collector context. The records do not prove exfiltration or a successful audit shutdown.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Periodic episodes mixed with background; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        "Hours from one episode's first read to the centre of the next episode's start window, 6 to 8,760",
    },
    {
      name: 'vault_host',
      defaultValue: 'vault-01.corp.example',
      description: 'Vault node and collector hostname',
    },
    {
      name: 'vault_ip',
      defaultValue: '10.20.2.18',
      description: 'Vault node address',
    },
    {
      name: 'collector_id',
      defaultValue: '65fa5f58-a1d2-49d1-b4cc-05228dd270f3',
      description: 'Stable collector ID',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: '8dcba887-bc9d-44cb-bfcd-ed7aa7216748',
      description: 'Collector process ID',
    },
    {
      name: 'collector_version',
      defaultValue: '8.10.1',
      description: 'Collector version',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.44',
      description:
        "Fourth identity's peer address, used in background and eligible episodes",
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'svc-reports',
      description:
        'Fourth existing userpass account, used in background and eligible episodes; must differ from svc-api, svc-billing and alice',
    },
    {
      name: 'secret_mount',
      defaultValue: 'secret',
      description:
        'Selected KV v2 mount, without leading or trailing slash; change the ACL mount paths too',
    },
  ],
  sampleOutputs: [
    {
      title: 'Denied audit-device deletion response ending an episode',
      json: String.raw`{
  "@timestamp": "2026-10-01T05:16:22.035Z",
  "agent": {
    "ephemeral_id": "8dcba887-bc9d-44cb-bfcd-ed7aa7216748",
    "id": "65fa5f58-a1d2-49d1-b4cc-05228dd270f3",
    "name": "vault-01.corp.example",
    "type": "filebeat",
    "version": "8.10.1"
  },
  "data_stream": {
    "dataset": "hashicorp_vault.audit",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "65fa5f58-a1d2-49d1-b4cc-05228dd270f3",
    "snapshot": false,
    "version": "8.10.1"
  },
  "event": {
    "action": "delete",
    "agent_id_status": "verified",
    "category": [
      "authentication"
    ],
    "dataset": "hashicorp_vault.audit",
    "id": "a917f31c-f870-4214-8273-e7a6f7ad7d81",
    "ingested": "2026-10-01T05:16:24Z",
    "kind": "event",
    "original": "{\"auth\":{\"accessor\":\"hmac-sha256:89da18efff447c7106a0b567cc5ac92c9e615a04b982d217297980ba127f7647\",\"client_token\":\"hmac-sha256:03b219fc9970dfb36c081da9310016fd91bac6e4576222632e55786ba422829a\",\"display_name\":\"userpass-svc-reports\",\"entity_id\":\"96fa6c68-63af-43dc-a9ea-f59556f4b5ea\",\"metadata\":{\"username\":\"svc-reports\"},\"policies\":[\"default\",\"training-reader\"],\"policy_results\":{\"allowed\":false},\"token_policies\":[\"default\",\"training-reader\"],\"token_issue_time\":\"2026-09-30T19:03:00Z\",\"token_ttl\":86400,\"token_type\":\"service\"},\"error\":\"1 error occurred:\\n\\t* permission denied\\n\\n\",\"request\":{\"client_id\":\"96fa6c68-63af-43dc-a9ea-f59556f4b5ea\",\"client_token\":\"hmac-sha256:03b219fc9970dfb36c081da9310016fd91bac6e4576222632e55786ba422829a\",\"client_token_accessor\":\"hmac-sha256:89da18efff447c7106a0b567cc5ac92c9e615a04b982d217297980ba127f7647\",\"id\":\"a917f31c-f870-4214-8273-e7a6f7ad7d81\",\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"namespace\":{\"id\":\"root\"},\"operation\":\"delete\",\"path\":\"sys/audit/file\",\"remote_address\":\"198.51.100.44\",\"remote_port\":35802,\"request_uri\":\"/v1/sys/audit/file\"},\"response\":{\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"data\":{\"error\":\"hmac-sha256:ec125ce39ac232369c1e227ed31f30b8b1a43010aa94029c6b423af8d061ce97\"}},\"time\":\"2026-10-01T05:16:22.035826968Z\",\"type\":\"response\"}",
    "outcome": "failure",
    "type": [
      "info",
      "end"
    ]
  },
  "hashicorp_vault": {
    "audit": {
      "auth": {
        "accessor": "hmac-sha256:89da18efff447c7106a0b567cc5ac92c9e615a04b982d217297980ba127f7647",
        "client_token": "hmac-sha256:03b219fc9970dfb36c081da9310016fd91bac6e4576222632e55786ba422829a",
        "display_name": "userpass-svc-reports",
        "entity_id": "96fa6c68-63af-43dc-a9ea-f59556f4b5ea",
        "metadata": {
          "username": "svc-reports"
        },
        "policies": [
          "default",
          "training-reader"
        ],
        "policy_results": {
          "allowed": false
        },
        "token_issue_time": "2026-09-30T19:03:00Z",
        "token_policies": [
          "default",
          "training-reader"
        ],
        "token_ttl": 86400,
        "token_type": "service"
      },
      "error": "1 error occurred:\n\t* permission denied\n\n",
      "request": {
        "client_id": "96fa6c68-63af-43dc-a9ea-f59556f4b5ea",
        "client_token": "hmac-sha256:03b219fc9970dfb36c081da9310016fd91bac6e4576222632e55786ba422829a",
        "client_token_accessor": "hmac-sha256:89da18efff447c7106a0b567cc5ac92c9e615a04b982d217297980ba127f7647",
        "id": "a917f31c-f870-4214-8273-e7a6f7ad7d81",
        "mount_class": "secret",
        "mount_point": "sys/",
        "mount_type": "system",
        "namespace": {
          "id": "root"
        },
        "operation": "delete",
        "path": "sys/audit/file",
        "remote_address": "198.51.100.44",
        "remote_port": 35802,
        "request_uri": "/v1/sys/audit/file"
      },
      "response": {
        "data": {
          "error": "hmac-sha256:ec125ce39ac232369c1e227ed31f30b8b1a43010aa94029c6b423af8d061ce97"
        },
        "mount_class": "secret",
        "mount_point": "sys/",
        "mount_type": "system"
      },
      "type": "response"
    }
  },
  "host": {
    "architecture": "x86_64",
    "containerized": false,
    "hostname": "vault-01.corp.example",
    "id": "f25e61f1c11d44bd9aee4a28a664ec18",
    "ip": [
      "10.20.2.18"
    ],
    "mac": [
      "02-42-0A-14-02-12"
    ],
    "name": "vault-01.corp.example",
    "os": {
      "codename": "bookworm",
      "family": "debian",
      "kernel": "6.1.0",
      "name": "Debian",
      "platform": "debian",
      "type": "linux",
      "version": "12"
    }
  },
  "input": {
    "type": "filestream"
  },
  "log": {
    "file": {
      "path": "/var/log/vault/audit.json"
    },
    "offset": 1967148
  },
  "message": "1 error occurred:\n\t* permission denied\n\n",
  "related": {
    "ip": [
      "198.51.100.44"
    ],
    "user": [
      "svc-reports"
    ]
  },
  "source": {
    "ip": "198.51.100.44",
    "port": 35802
  },
  "tags": [
    "hashicorp-vault-audit"
  ],
  "user": {
    "name": "svc-reports"
  }
}`,
    },
  ],
};
