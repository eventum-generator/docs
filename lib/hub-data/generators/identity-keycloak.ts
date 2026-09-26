/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityKeycloak: GeneratorMeta = {
  slug: 'identity-keycloak',
  displayName: 'Keycloak 26.7.4 Event Log',
  category: 'identity',
  dataSource: 'Keycloak 26.7.4 jboss-logging user and admin listener events',
  description:
    'Configured Keycloak 26.7.4 user and admin listener lines with linked sessions and recurring nine-event episodes.',
  generatorId: 'keycloak',
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Configured jboss-logging listener line in event.original',
    'LOGIN and CODE_TO_TOKEN share sessionId and code_id',
    'Recurring nine-event episodes with distinct sessions and targets',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 720 routine events and then roughly every 720 routine events, five distinct accounts fail from one IP; the last logs in, exchanges its code, adds a realm-role mapping and updates events/config while logging remains enabled.',
  eventTypes: [
    {
      id: 'LOGIN',
      description: 'Successful OIDC login',
      frequency: '916 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'authentication',
    },
    {
      id: 'LOGIN_ERROR',
      description: 'Invalid credentials',
      frequency: '204 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'authentication',
    },
    {
      id: 'CODE_TO_TOKEN',
      description: 'Authorization-code exchange for an existing session',
      frequency: '513 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'authentication',
    },
    {
      id: 'LOGOUT',
      description: 'End of a tokenized session',
      frequency: '119 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'authentication',
    },
    {
      id: 'DELETE-REALM_ROLE_MAPPING',
      description: 'Remove a realm-role mapping',
      frequency: '17 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'iam',
    },
    {
      id: 'CREATE-REALM_ROLE_MAPPING',
      description: 'Add a realm-role mapping',
      frequency: '16 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'iam',
    },
    {
      id: 'UPDATE-REALM',
      description: 'Update realm event configuration',
      frequency: '16 of 1,801 in one modeled 2.5-hour enabled run',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Configured success INFO, error WARN, double-quoted values and admin representation follow the 26.7.4 listener profile.',
    'Nested keycloak.login.* and keycloak.admin.* fields and admin action codes follow the Elastic events pipeline.',
    'Routine login, token exchange and logout use an existing session; code_id and sessionId link login to token exchange within the 60-second code lifetime.',
    'The same IP, actor, role and admin operations occur in background; each episode target also appears in a prior routine role removal, and role state prevents no-op grants.',
    'The events/config update retains user and admin logging plus jboss-logging; the synthetic role name alone grants no Keycloak administrator rights.',
    '42/42 generic Elastic startup-sample fields cover collector shape only, not event semantics.',
    'Full 26.7.4 raw LOGOUT and representation-bearing admin captures remain unavailable; exact wire fidelity is unverified.',
  ],
  format: ['JSON', 'ECS'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring nine-event episodes; false emits background only',
    },
    {
      name: 'realm',
      defaultValue: 'corp',
      description: 'Realm name in listener lines',
    },
    {
      name: 'realm_id',
      defaultValue: '523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4',
      description: 'Stable realm ID',
    },
    {
      name: 'redirect_uri',
      defaultValue: 'https://sso.corp.example/callback',
      description: 'OIDC client redirect URI in login details',
    },
    {
      name: 'hostname',
      defaultValue: 'keycloak-01.corp.example',
      description: 'Keycloak server and collector hostname',
    },
    {
      name: 'host_ip',
      defaultValue: '10.20.1.15',
      description: 'Server address',
    },
    {
      name: 'collector_id',
      defaultValue: 'a0634c5c-35db-4f7a-8273-73052fa14208',
      description: 'Stable synthetic Filebeat ID',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: 'e026770f-355a-4130-97ba-658b5a1f98f2',
      description: 'Synthetic collector process ID',
    },
    {
      name: 'collector_version',
      defaultValue: '8.13.0',
      description: 'Synthetic collector version',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.91',
      description: 'Source address present in both modes',
    },
    {
      name: 'compromised_user',
      defaultValue: 'svc-admin',
      description: 'Acting account present in both modes',
    },
    {
      name: 'compromised_user_id',
      defaultValue: '7c8c3984-477c-4ab0-8644-f19c6d159a4b',
      description: 'Stable acting account ID',
    },
    {
      name: 'target_user_id',
      defaultValue: '977821e2-168b-4969-b157-2c1347957bdd',
      description:
        'Initial mapping target; later tracked targets get fresh IDs',
    },
    {
      name: 'privileged_role_id',
      defaultValue: 'b18f4680-7b51-450e-89f2-65d98024e7b7',
      description: 'Synthetic application role ID',
    },
    {
      name: 'privileged_role_name',
      defaultValue: 'secops-admin',
      description:
        'Synthetic application role name; no implied Keycloak admin grant',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '720',
      description: 'First due routine count; role state can delay the episode',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '720',
      description:
        'Routine rows between later due points; role state can delay them',
    },
  ],
  sampleOutputs: [
    {
      title: 'Modeled role-mapping admin event',
      json: String.raw`{"@timestamp": "2026-09-25T01:00:35.351000+00:00", "agent": {"ephemeral_id": "e026770f-355a-4130-97ba-658b5a1f98f2", "id": "a0634c5c-35db-4f7a-8273-73052fa14208", "name": "keycloak-01.corp.example", "type": "filebeat", "version": "8.13.0"}, "data_stream": {"dataset": "keycloak.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.17.0"}, "elastic_agent": {"id": "a0634c5c-35db-4f7a-8273-73052fa14208", "snapshot": false, "version": "8.13.0"}, "event": {"action": "CREATE-REALM_ROLE_MAPPING", "agent_id_status": "verified", "category": ["iam"], "code": "CREATE-REALM_ROLE_MAPPING", "dataset": "keycloak.log", "ingested": "2026-09-25T01:00:37.351000+00:00", "kind": "event", "original": "2026-09-25 01:00:35,351 INFO  [org.keycloak.events] (executor-thread-1) operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"security-admin-console\", userId=\"7c8c3984-477c-4ab0-8644-f19c6d159a4b\", ipAddress=\"198.51.100.91\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/c2f61e2d-a749-4612-9970-e5e037db77bb/role-mappings/realm\", representation=\"[{\\\"id\\\": \\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\", \\\"name\\\": \\\"secops-admin\\\"}]\"", "outcome": "unknown", "timezone": "+00:00", "type": ["info", "admin", "creation"]}, "host": {"architecture": "x86_64", "containerized": true, "hostname": "keycloak-01.corp.example", "id": "5082ec46978249e68488c21de3f64030", "ip": ["10.20.1.15"], "mac": ["02-42-0A-14-01-0F"], "name": "keycloak-01.corp.example", "os": {"codename": "bookworm", "family": "debian", "kernel": "6.1.0", "name": "Debian", "platform": "debian", "type": "linux", "version": "12"}}, "input": {"type": "filestream"}, "keycloak": {"admin": {"operation": "CREATE", "resource": {"path": "users/c2f61e2d-a749-4612-9970-e5e037db77bb/role-mappings/realm", "type": "REALM_ROLE_MAPPING"}}, "client": {"id": "security-admin-console"}, "event_type": "admin", "realm": {"id": "523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4"}}, "log": {"file": {"device_id": "2049", "inode": "537921", "path": "/opt/keycloak/data/log/keycloak.log"}, "level": "INFO", "logger": "org.keycloak.events", "offset": 389982}, "message": "operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"security-admin-console\", userId=\"7c8c3984-477c-4ab0-8644-f19c6d159a4b\", ipAddress=\"198.51.100.91\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/c2f61e2d-a749-4612-9970-e5e037db77bb/role-mappings/realm\", representation=\"[{\\\"id\\\": \\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\", \\\"name\\\": \\\"secops-admin\\\"}]\"", "process": {"thread": {"name": "executor-thread-1"}}, "related": {"ip": ["198.51.100.91"], "user": ["7c8c3984-477c-4ab0-8644-f19c6d159a4b", "c2f61e2d-a749-4612-9970-e5e037db77bb"]}, "source": {"address": "198.51.100.91", "ip": "198.51.100.91"}, "tags": ["keycloak-log"], "user": {"id": "7c8c3984-477c-4ab0-8644-f19c6d159a4b", "target": {"id": "c2f61e2d-a749-4612-9970-e5e037db77bb"}}}`,
    },
  ],
};
