/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityKeycloak: GeneratorMeta = {
  slug: 'identity-keycloak',
  displayName: 'Keycloak Event Log',
  category: 'identity',
  dataSource: 'Keycloak user and admin event-listener logs',
  description:
    'Keycloak authentication and administrator events with the original listener line preserved in event.original. Sessions stay linked; an optional sequence models credential spraying, a successful login and administrator changes.',
  generatorId: 'keycloak',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native event-listener line in event.original',
    'Session-aware token and logout events',
    'Switchable credential-abuse chain',
  ],
  anomalyChain:
    'Five failed logins from one IP lead to a successful login, a realm-role grant and an event-logging configuration change.',
  eventTypes: [
    {
      id: 'LOGIN',
      description: 'Successful user login',
      frequency: '54.4%',
      category: 'authentication',
    },
    {
      id: 'CODE_TO_TOKEN',
      description: 'Authorization code exchanged for a token',
      frequency: '16.2%',
      category: 'authentication',
    },
    {
      id: 'LOGIN_ERROR',
      description: 'Failed user login',
      frequency: '15.1%',
      category: 'authentication',
    },
    {
      id: 'LOGOUT',
      description: 'User logout',
      frequency: '12.2%',
      category: 'authentication',
    },
    {
      id: 'ADMIN CREATE',
      description: 'Realm role mapped to another user',
      frequency: '~1.1%',
      category: 'iam',
    },
    {
      id: 'ADMIN UPDATE',
      description: 'Realm event configuration changed',
      frequency: '~1.1%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Token exchanges and logouts reuse active user sessions.',
    'Original listener log lines retain event detail and byte offsets.',
    'The anomaly shares a source IP and identity across failed login, success, role assignment and config change.',
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
      name: 'realm',
      defaultValue: 'corp',
      description: 'Realm name for user and administrator events',
    },
    {
      name: 'realm_id',
      defaultValue: '523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4',
      description: 'Stable realm ID in the listener line',
    },
    {
      name: 'hostname',
      defaultValue: 'keycloak-01.corp.example',
      description: 'Keycloak server and collector host',
    },
    {
      name: 'host_ip',
      defaultValue: '10.20.1.15',
      description: 'Server address',
    },
    {
      name: 'collector_id',
      defaultValue: 'a0634c5c-35db-4f7a-8273-73052fa14208',
      description: 'Stable collector ID',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: 'e026770f-355a-4130-97ba-658b5a1f98f2',
      description: 'Collector process ID',
    },
    {
      name: 'collector_version',
      defaultValue: '8.13.0',
      description: 'Collector version',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.91',
      description: 'Address used throughout the anomaly',
    },
    {
      name: 'compromised_user',
      defaultValue: 'svc-admin',
      description: 'Account that authenticates after the spray',
    },
    {
      name: 'compromised_user_id',
      defaultValue: '7c8c3984-477c-4ab0-8644-f19c6d159a4b',
      description: 'Stable account ID across the chain',
    },
    {
      name: 'target_user_id',
      defaultValue: '977821e2-168b-4969-b157-2c1347957bdd',
      description: 'Account receiving a role mapping',
    },
    {
      name: 'privileged_role_id',
      defaultValue: 'b18f4680-7b51-450e-89f2-65d98024e7b7',
      description: 'Synthetic realm-role ID in the representation',
    },
    {
      name: 'privileged_role_name',
      defaultValue: 'secops-admin',
      description: 'Synthetic privileged realm role granted to the target',
    },
  ],
  sampleOutputs: [
    {
      title: 'Keycloak role-mapping event',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:46:11+00:00",
  "agent": {
    "ephemeral_id": "e026770f-355a-4130-97ba-658b5a1f98f2",
    "id": "a0634c5c-35db-4f7a-8273-73052fa14208",
    "name": "keycloak-01.corp.example",
    "type": "filebeat",
    "version": "8.13.0"
  },
  "data_stream": {
    "dataset": "keycloak.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "a0634c5c-35db-4f7a-8273-73052fa14208",
    "snapshot": false,
    "version": "8.13.0"
  },
  "event": {
    "action": "CREATE",
    "agent_id_status": "verified",
    "category": [
      "iam",
      "configuration"
    ],
    "dataset": "keycloak.log",
    "ingested": "2026-09-25T10:46:11+00:00",
    "kind": "event",
    "original": "2026-09-25 10:46:11,000 INFO  [org.keycloak.events] (executor-thread-1) operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"security-admin-console\", userId=\"7c8c3984-477c-4ab0-8644-f19c6d159a4b\", ipAddress=\"198.51.100.91\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/977821e2-168b-4969-b157-2c1347957bdd/role-mappings/realm\", representation=\"[{\\\"id\\\": \\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\", \\\"name\\\": \\\"secops-admin\\\"}]\"",
    "outcome": "success",
    "timezone": "+00:00",
    "type": [
      "change"
    ]
  },
  "host": {
    "architecture": "x86_64",
    "containerized": true,
    "hostname": "keycloak-01.corp.example",
    "id": "5082ec46978249e68488c21de3f64030",
    "ip": [
      "10.20.1.15"
    ],
    "mac": [
      "02-42-0A-14-01-0F"
    ],
    "name": "keycloak-01.corp.example",
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
  "keycloak": {
    "client_id": "security-admin-console",
    "event_type": "ADMIN_EVENT",
    "ip_address": "198.51.100.91",
    "operation_type": "CREATE",
    "realm": "corp",
    "realm_id": "523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4",
    "representation": "[{\"id\": \"b18f4680-7b51-450e-89f2-65d98024e7b7\", \"name\": \"secops-admin\"}]",
    "resource_path": "users/977821e2-168b-4969-b157-2c1347957bdd/role-mappings/realm",
    "resource_type": "REALM_ROLE_MAPPING",
    "role_name": "secops-admin",
    "user_id": "7c8c3984-477c-4ab0-8644-f19c6d159a4b"
  },
  "log": {
    "file": {
      "device_id": "2049",
      "inode": "537921",
      "path": "/opt/keycloak/data/log/keycloak.log"
    },
    "level": "INFO",
    "logger": "org.keycloak.events",
    "offset": 35941
  },
  "message": "operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"security-admin-console\", userId=\"7c8c3984-477c-4ab0-8644-f19c6d159a4b\", ipAddress=\"198.51.100.91\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/977821e2-168b-4969-b157-2c1347957bdd/role-mappings/realm\", representation=\"[{\\\"id\\\": \\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\", \\\"name\\\": \\\"secops-admin\\\"}]\"",
  "process": {
    "thread": {
      "name": "executor-thread-1"
    }
  },
  "related": {
    "ip": [
      "198.51.100.91"
    ],
    "user": [
      "svc-admin"
    ]
  },
  "source": {
    "ip": "198.51.100.91"
  },
  "tags": [
    "keycloak-log"
  ],
  "user": {
    "id": "7c8c3984-477c-4ab0-8644-f19c6d159a4b",
    "name": "svc-admin"
  }
}`,
    },
  ],
};
