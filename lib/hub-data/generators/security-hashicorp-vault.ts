/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityHashicorpVault: GeneratorMeta = {
  slug: 'security-hashicorp-vault',
  displayName: 'HashiCorp Vault Audit',
  category: 'security',
  dataSource: 'HashiCorp Vault audit request and response JSON',
  description:
    'Vault audit requests and responses linked by request.id, with native audit JSON in event.original. An optional chain reads payroll secrets in a burst and attempts to disable an audit device.',
  generatorId: 'vault',
  eventCount: 4,
  templateCount: 2,
  highlights: [
    'Paired request and response records',
    'Native Vault audit entry in event.original',
    'Switchable secret-read and audit-tamper chain',
  ],
  anomalyChain:
    'A single actor reads ten payroll secrets from one external IP, then attempts to delete the audit device and is denied.',
  eventTypes: [
    {
      id: 'read',
      description: 'Secret or token read',
      frequency: '79.8%',
      category: 'iam',
    },
    {
      id: 'list',
      description: 'Secret metadata listing',
      frequency: '12.3%',
      category: 'iam',
    },
    {
      id: 'update',
      description: 'Token renewal',
      frequency: '7.0%',
      category: 'authentication',
    },
    {
      id: 'delete',
      description: 'Denied audit-device deletion attempt',
      frequency: '0.8%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Each request and response pair shares request ID, path, actor and source IP.',
    'Audit entries use synthetic HMAC-shaped token values without plaintext secrets.',
    'The anomaly joins a sensitive-path read burst to a denied audit-device operation.',
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
      description: 'External address in the anomaly',
    },
    {
      name: 'suspicious_actor',
      defaultValue: 'svc-reports',
      description: 'Account performing the read burst',
    },
    {
      name: 'secret_mount',
      defaultValue: 'secret',
      description: 'KV secret-engine mount',
    },
  ],
  sampleOutputs: [
    {
      title: 'Denied Vault audit response',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:27:38+00:00",
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
      "configuration"
    ],
    "dataset": "hashicorp_vault.audit",
    "id": "cfaebf26-dac7-448b-8f69-b3ce09171b25",
    "ingested": "2026-09-25T10:27:38+00:00",
    "kind": "event",
    "original": "{\"auth\": {\"accessor\": \"hmac-sha256:3194b146ed26568a373087b7f8305e160432c46f9655360703e8285edc23284e\", \"client_token\": \"hmac-sha256:9c8dff4841b6a430d26accdf48bb5cf5276c4b8f312920e0de8ca4691933bcff\", \"display_name\": \"userpass-svc-reports\", \"entity_id\": \"96fa6c68-63af-43dc-a9ea-f59556f4b5ea\", \"metadata\": {\"username\": \"svc-reports\"}, \"policies\": [\"default\", \"payroll-reader\"], \"token_policies\": [\"default\", \"payroll-reader\"], \"token_type\": \"service\"}, \"error\": \"permission denied\", \"request\": {\"client_token\": \"hmac-sha256:9c8dff4841b6a430d26accdf48bb5cf5276c4b8f312920e0de8ca4691933bcff\", \"client_token_accessor\": \"hmac-sha256:3194b146ed26568a373087b7f8305e160432c46f9655360703e8285edc23284e\", \"id\": \"cfaebf26-dac7-448b-8f69-b3ce09171b25\", \"mount_point\": \"sys/\", \"mount_type\": \"system\", \"namespace\": {\"id\": \"root\"}, \"operation\": \"delete\", \"path\": \"sys/audit/file\", \"remote_address\": \"198.51.100.44\", \"remote_port\": 52234}, \"response\": {\"mount_point\": \"sys/\", \"mount_type\": \"system\"}, \"time\": \"2026-09-25T10:27:38+00:00\", \"type\": \"response\"}",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "hashicorp_vault": {
    "audit": {
      "auth": {
        "accessor": "hmac-sha256:3194b146ed26568a373087b7f8305e160432c46f9655360703e8285edc23284e",
        "client_token": "hmac-sha256:9c8dff4841b6a430d26accdf48bb5cf5276c4b8f312920e0de8ca4691933bcff",
        "display_name": "userpass-svc-reports",
        "entity_id": "96fa6c68-63af-43dc-a9ea-f59556f4b5ea",
        "metadata": {
          "username": "svc-reports"
        },
        "policies": [
          "default",
          "payroll-reader"
        ],
        "token_policies": [
          "default",
          "payroll-reader"
        ],
        "token_type": "service"
      },
      "error": "permission denied",
      "request": {
        "client_token": "hmac-sha256:9c8dff4841b6a430d26accdf48bb5cf5276c4b8f312920e0de8ca4691933bcff",
        "client_token_accessor": "hmac-sha256:3194b146ed26568a373087b7f8305e160432c46f9655360703e8285edc23284e",
        "id": "cfaebf26-dac7-448b-8f69-b3ce09171b25",
        "mount_point": "sys/",
        "mount_type": "system",
        "namespace": {
          "id": "root"
        },
        "operation": "delete",
        "path": "sys/audit/file",
        "remote_address": "198.51.100.44",
        "remote_port": 52234
      },
      "response": {
        "mount_point": "sys/",
        "mount_type": "system"
      },
      "time": "2026-09-25T10:27:38+00:00",
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
    "offset": 21870
  },
  "related": {
    "ip": [
      "198.51.100.44"
    ],
    "user": [
      "svc-reports"
    ]
  },
  "source": {
    "ip": "198.51.100.44"
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
