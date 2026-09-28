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
    'Independent payroll batches, renewals and denied deletions',
    'Recurring payroll read run and denied audit deletion',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default: the first episode starts at a uniformly random time within the first interval, or the first 24 hours when the interval is longer; each later one starts at a random time within a window of a quarter of the interval (at most 6 hours) centred on one interval after the actual first read of the previous episode, with no backlog. An episode yields each slot to renewals, retries, pending deletions and running batches, so it starts up to a few minutes after its drawn time. One existing identity, different from the previous one, reads ten distinct payroll secrets paced like a payroll batch, then attempts to delete sys/audit/file (272-618 s from the first read in the final captures). The reader ACL permits the reads and denies the DELETE; the audit device remains enabled. Every element also occurs on its own in both modes; only three or more distinct payroll reads by one token followed by its denied audit DELETE within 400 seconds of the first read is withheld from background.',
  generatorId: 'vault',
  eventTypes: [
    {
      id: 'kv-read-app-billing',
      description: 'KV v2 read of an application/billing secret',
      frequency: '48.1-49.7% measured share',
      category: 'authentication',
    },
    {
      id: 'kv-read-payroll',
      description: 'KV v2 read of a payroll secret',
      frequency: '28.8-30.1% measured share',
      category: 'authentication',
    },
    {
      id: 'token-lookup-self',
      description: 'Token reads its own remaining lifetime',
      frequency: '10.4-10.5% measured share',
      category: 'authentication',
    },
    {
      id: 'kv-metadata-list',
      description: 'KV v2 metadata list of existing child names',
      frequency: '10.4-10.8% measured share',
      category: 'authentication',
    },
    {
      id: 'audit-delete-denied',
      description: 'Reader ACL denies deleting sys/audit/file',
      frequency: '0.36-0.54% measured share',
      category: 'authentication',
    },
    {
      id: 'token-renew-self',
      description: 'Periodic 24-hour token renews itself',
      frequency: '0.19-0.20% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Each operation emits a request and a response entry with the same fresh UUID, one operation per 30-second input slot at a random instant inside it: 2,880 operations and 5,760 entries a day. Shares, measured over 17,321 operations per mode in the final default captures, and timings are training assumptions, not production measurements; rates are stationary, with no daily or weekly cycle.',
    'Four existing userpass identities with the default and training-reader policies use a fixed inventory of 52 version-1 KV v2 secrets (12 application/billing, 40 payroll). The reader ACL grants read and list, the default policy self-lookup and renewal, and neither grants audit management, so both entries of the denied audit DELETE keep valid authentication, policy_results.allowed=false and a hashed response error. No secret write, token creation or revocation is generated.',
    'Background runs as independent processes that behave the same in both modes: weighted single operations, about 12 payroll batches a day (log-normal length, median about 6 reads), about 8 denied audit deletions a day with 35% retried, and source ports reused until a client is idle for more than 90 seconds. Runs of ten or more payroll reads and denied DELETEs by all four identities, including retries and ones after one or two payroll reads, occur in both modes. One rule acts only on the last step: an ordinary DELETE that would complete three distinct payroll reads by the same actor within 400 seconds is dropped, with its actor not replaced.',
    'Tokens renew on the LifetimeWatcher schedule, 16.8-17.6 hours after login or the previous renewal; unlike a real watcher, the grace is redrawn every cycle and no start-up renewal is emitted. Lookups report remaining TTL and last_renewal, while auth.token_ttl stays the 86,400-second creation period.',
    'Tokens, accessors and string values are keyed HMAC-SHA256 with one synthetic device salt; typed lookup times stay readable. @timestamp carries the source time at millisecond precision, event.ingested, in whole seconds, lags it log-normally (median about 2.5 s), and log.offset follows the UTF-8 byte length of each native line in the unrotated audit file.',
    'All 47/47 leaf paths of the pinned Elastic sample occur, which shows field presence only. No complete live v1.18.0 capture or live SIEM parser run was obtained; optional headers, enterprise fields and other endpoints are omitted, mount accessors are synthetic, and agent_id_status verified is synthetic collector context. The records do not prove exfiltration or a successful audit shutdown.',
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
      title: 'Denied audit-device deletion response ending the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-26T22:43:25.293Z",
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
    "id": "0728bc8f-1033-462e-bc19-39a17b7e0c3d",
    "ingested": "2026-09-26T22:43:32Z",
    "kind": "event",
    "original": "{\"auth\":{\"accessor\":\"hmac-sha256:8bfe54d69390a4adc95d16a826f3792753ddd31cfe36ded64625ae4b0a765b3d\",\"client_token\":\"hmac-sha256:758dc31f91fd147aca412e25f6f312ca5e72641f15ddd6c21ee7ba78bd8f168a\",\"display_name\":\"userpass-svc-api\",\"entity_id\":\"49263c43-35ab-4df6-a747-1715203590ba\",\"metadata\":{\"username\":\"svc-api\"},\"policies\":[\"default\",\"training-reader\"],\"policy_results\":{\"allowed\":false},\"token_policies\":[\"default\",\"training-reader\"],\"token_issue_time\":\"2026-09-25T15:49:12Z\",\"token_ttl\":86400,\"token_type\":\"service\"},\"error\":\"1 error occurred:\\n\\t* permission denied\\n\\n\",\"request\":{\"client_id\":\"49263c43-35ab-4df6-a747-1715203590ba\",\"client_token\":\"hmac-sha256:758dc31f91fd147aca412e25f6f312ca5e72641f15ddd6c21ee7ba78bd8f168a\",\"client_token_accessor\":\"hmac-sha256:8bfe54d69390a4adc95d16a826f3792753ddd31cfe36ded64625ae4b0a765b3d\",\"id\":\"0728bc8f-1033-462e-bc19-39a17b7e0c3d\",\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"namespace\":{\"id\":\"root\"},\"operation\":\"delete\",\"path\":\"sys/audit/file\",\"remote_address\":\"10.20.8.12\",\"remote_port\":38729,\"request_uri\":\"/v1/sys/audit/file\"},\"response\":{\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"data\":{\"error\":\"hmac-sha256:ec125ce39ac232369c1e227ed31f30b8b1a43010aa94029c6b423af8d061ce97\"}},\"time\":\"2026-09-26T22:43:25.293801903Z\",\"type\":\"response\"}",
    "outcome": "failure",
    "type": [
      "info",
      "end"
    ]
  },
  "hashicorp_vault": {
    "audit": {
      "auth": {
        "accessor": "hmac-sha256:8bfe54d69390a4adc95d16a826f3792753ddd31cfe36ded64625ae4b0a765b3d",
        "client_token": "hmac-sha256:758dc31f91fd147aca412e25f6f312ca5e72641f15ddd6c21ee7ba78bd8f168a",
        "display_name": "userpass-svc-api",
        "entity_id": "49263c43-35ab-4df6-a747-1715203590ba",
        "metadata": {
          "username": "svc-api"
        },
        "policies": [
          "default",
          "training-reader"
        ],
        "policy_results": {
          "allowed": false
        },
        "token_issue_time": "2026-09-25T15:49:12Z",
        "token_policies": [
          "default",
          "training-reader"
        ],
        "token_ttl": 86400,
        "token_type": "service"
      },
      "error": "1 error occurred:\n\t* permission denied\n\n",
      "request": {
        "client_id": "49263c43-35ab-4df6-a747-1715203590ba",
        "client_token": "hmac-sha256:758dc31f91fd147aca412e25f6f312ca5e72641f15ddd6c21ee7ba78bd8f168a",
        "client_token_accessor": "hmac-sha256:8bfe54d69390a4adc95d16a826f3792753ddd31cfe36ded64625ae4b0a765b3d",
        "id": "0728bc8f-1033-462e-bc19-39a17b7e0c3d",
        "mount_class": "secret",
        "mount_point": "sys/",
        "mount_type": "system",
        "namespace": {
          "id": "root"
        },
        "operation": "delete",
        "path": "sys/audit/file",
        "remote_address": "10.20.8.12",
        "remote_port": 38729,
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
    "offset": 8467024
  },
  "message": "1 error occurred:\n\t* permission denied\n\n",
  "related": {
    "ip": [
      "10.20.8.12"
    ],
    "user": [
      "svc-api"
    ]
  },
  "source": {
    "ip": "10.20.8.12",
    "port": 38729
  },
  "tags": [
    "hashicorp-vault-audit"
  ],
  "user": {
    "name": "svc-api"
  }
}`,
    },
  ],
};
