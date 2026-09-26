/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityHashicorpVault: GeneratorMeta = {
  slug: 'security-hashicorp-vault',
  displayName: 'HashiCorp Vault Audit',
  category: 'security',
  description:
    'Selected Vault 1.18 file-audit records with KV v2 inventory, keyed HMACs, reader policies and visible token renewal. Daily payroll read bursts end with denied audit-device deletion.',
  format: ['JSON', 'ECS'],
  dataSource: 'Vault v1.18.0 file audit, KV plugin v0.20.0',
  eventCount: 5,
  templateCount: 3,
  highlights: [
    'Linked request and response pairs',
    'Explicit ACL and token lifetime',
    'Daily read burst and denied deletion',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours one eligible existing token reads ten distinct payroll secrets at 30-second spacing and attempts an audit-device DELETE. The reader ACL permits the reads and denies DELETE;22 entries span 300.05 seconds, and auditing remains enabled.',
  generatorId: 'vault',
  eventTypes: [
    {
      id: 'kv-read',
      description: 'Read a pre-existing KV v2 secret',
      frequency: '80% ordinary selection',
      category: 'authentication',
    },
    {
      id: 'kv-list',
      description: 'List existing KV v2 metadata children',
      frequency: '10% ordinary selection',
      category: 'authentication',
    },
    {
      id: 'token-lookup-self',
      description: 'Read own token remaining lifetime',
      frequency: '9% ordinary selection',
      category: 'authentication',
    },
    {
      id: 'audit-delete-denied',
      description: 'Reader policy denies deleting sys/audit/file',
      frequency: '1% ordinary selection',
      category: 'authentication',
    },
    {
      id: 'token-renew-self',
      description: 'Renew existing periodic token before expiry',
      frequency: 'Scheduled maintenance',
      category: 'authentication',
    },
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Periodic episodes mixed with ordinary activity; false retains background only',
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
        "Fourth identity's peer address in ordinary activity and eligible episodes",
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'svc-reports',
      description:
        'Fourth existing userpass account in ordinary activity and eligible episodes',
    },
    {
      name: 'secret_mount',
      defaultValue: 'secret',
      description: 'Selected KV v2 mount, without leading or trailing slash',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Positive finite recurrence interval, supported range 6 to 8,760 hours',
    },
  ],
  sampleOutputs: [
    {
      title: 'Denied audit-device deletion response',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:09:30.050000+00:00",
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
    "id": "7ea3a2f1-afc1-45aa-a5f7-589c43b91526",
    "ingested": "2026-09-27T00:09:30.250000+00:00",
    "kind": "event",
    "original": "{\"auth\":{\"accessor\":\"hmac-sha256:69580ad3726a6da4479f5008d8f4f12f2d6de2d17bcffa8555a94a61c68e2089\",\"client_token\":\"hmac-sha256:ba46a928fde74f55fd6f2d6059b180eb5b234332e0f745e7de3a228192dadb35\",\"display_name\":\"userpass-svc-billing\",\"entity_id\":\"09ae6e74-f30a-4713-83a5-c8be3496bdbe\",\"metadata\":{\"username\":\"svc-billing\"},\"policies\":[\"default\",\"training-reader\"],\"policy_results\":{\"allowed\":false},\"token_policies\":[\"default\",\"training-reader\"],\"token_issue_time\":\"2026-09-25T22:00:00Z\",\"token_ttl\":86400,\"token_type\":\"service\"},\"error\":\"1 error occurred:\\n\\t* permission denied\\n\\n\",\"request\":{\"client_id\":\"09ae6e74-f30a-4713-83a5-c8be3496bdbe\",\"client_token\":\"hmac-sha256:ba46a928fde74f55fd6f2d6059b180eb5b234332e0f745e7de3a228192dadb35\",\"client_token_accessor\":\"hmac-sha256:69580ad3726a6da4479f5008d8f4f12f2d6de2d17bcffa8555a94a61c68e2089\",\"id\":\"7ea3a2f1-afc1-45aa-a5f7-589c43b91526\",\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"namespace\":{\"id\":\"root\"},\"operation\":\"delete\",\"path\":\"sys/audit/file\",\"remote_address\":\"10.20.8.31\",\"remote_port\":51002,\"request_uri\":\"/v1/sys/audit/file\"},\"response\":{\"mount_class\":\"secret\",\"mount_point\":\"sys/\",\"mount_type\":\"system\",\"data\":{\"error\":\"hmac-sha256:ec125ce39ac232369c1e227ed31f30b8b1a43010aa94029c6b423af8d061ce97\"}},\"time\":\"2026-09-27T00:09:30.050000Z\",\"type\":\"response\"}",
    "outcome": "failure",
    "type": [
      "info",
      "end"
    ]
  },
  "hashicorp_vault": {
    "audit": {
      "auth": {
        "accessor": "hmac-sha256:69580ad3726a6da4479f5008d8f4f12f2d6de2d17bcffa8555a94a61c68e2089",
        "client_token": "hmac-sha256:ba46a928fde74f55fd6f2d6059b180eb5b234332e0f745e7de3a228192dadb35",
        "display_name": "userpass-svc-billing",
        "entity_id": "09ae6e74-f30a-4713-83a5-c8be3496bdbe",
        "metadata": {
          "username": "svc-billing"
        },
        "policies": [
          "default",
          "training-reader"
        ],
        "policy_results": {
          "allowed": false
        },
        "token_issue_time": "2026-09-25T22:00:00Z",
        "token_policies": [
          "default",
          "training-reader"
        ],
        "token_ttl": 86400,
        "token_type": "service"
      },
      "error": "1 error occurred:\n\t* permission denied\n\n",
      "request": {
        "client_id": "09ae6e74-f30a-4713-83a5-c8be3496bdbe",
        "client_token": "hmac-sha256:ba46a928fde74f55fd6f2d6059b180eb5b234332e0f745e7de3a228192dadb35",
        "client_token_accessor": "hmac-sha256:69580ad3726a6da4479f5008d8f4f12f2d6de2d17bcffa8555a94a61c68e2089",
        "id": "7ea3a2f1-afc1-45aa-a5f7-589c43b91526",
        "mount_class": "secret",
        "mount_point": "sys/",
        "mount_type": "system",
        "namespace": {
          "id": "root"
        },
        "operation": "delete",
        "path": "sys/audit/file",
        "remote_address": "10.20.8.31",
        "remote_port": 51002,
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
    "offset": 8997472
  },
  "message": "1 error occurred:\n\t* permission denied\n\n",
  "related": {
    "ip": [
      "10.20.8.31"
    ],
    "user": [
      "svc-billing"
    ]
  },
  "source": {
    "ip": "10.20.8.31",
    "port": 51002
  },
  "tags": [
    "hashicorp-vault-audit"
  ],
  "user": {
    "name": "svc-billing"
  }
}`,
    },
  ],
  realismFeatures: [
    'One operation per 30 seconds emits a request then response with the same fresh UUID. Native source time and ECS wrapper are retained separately.',
    'Four pre-existing userpass service tokens with default+training-reader ACLs access 52 existing version1 secrets. Explicit reader capability permits read/list but denies audit DELETE.',
    'Visible half-period renewals update expiration after success; remaining lookup TTL differs from creation TTL. Keyed HMAC uses one persistent synthetic device salt and preserves native scalar types.',
    'Every 24h ten distinct payroll reads precede denied audit deletion over 300.05 seconds. Actor/token/path windows rotate; all identities and operation families also occur ordinarily.',
    'The device remains enabled after denial. Selected tagged behavior and47/47 maintained reference leaves are checked. Complete endpoint/native/live parser parity remains unverified. The sample verified agent status is synthetic collector context, not live verification.',
  ],
};
