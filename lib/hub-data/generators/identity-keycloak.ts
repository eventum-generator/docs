/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityKeycloak: GeneratorMeta = {
  slug: 'identity-keycloak',
  displayName: 'Keycloak 26.7.4 Event Log',
  category: 'identity',
  description:
    'Keycloak 26.7.4 jboss-logging user and admin event lines for one realm with 36 users and 5 administrators, as native text in event.original with keycloak.*, user.*, source.* and url.* fields following the Elastic keycloak.log pipeline. Recurring episodes show one administrator failing several logins from a VPN egress address, then logging in to the admin console and granting a privileged realm role.',
  dataSource:
    'Keycloak 26.7.4 jboss-logging event listener (user and admin events, success level INFO, representations included), as collected by Elastic Agent',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native jboss-logging listener line in event.original',
    'Independent activity of 36 users and 5 administrators',
    'Recurring failed-login to privileged-role-grant chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first within the first 24 hours; each next one due one interval after the actual previous start, started at a random time in a window of up to 6 hours centred on that due time and delayed until an administrator is idle), one administrator fails five to eight logins from one VPN egress address, logs in to security-admin-console from it, exchanges the code and grants secops-admin to a user who lacks it, all within 15 minutes (measured 1-3 minutes). Every grant is revoked after a lease (median 8 h); each chain element also occurs in background, and only the complete ordered chain is episode-only.',
  generatorId: 'keycloak',
  eventTypes: [
    {
      id: 'LOGIN',
      description: 'Browser login to an OIDC client',
      frequency: '36.3% measured share (off runs 35.9-37.3%)',
      category: 'authentication',
    },
    {
      id: 'CODE_TO_TOKEN',
      description: 'Authorization-code exchange, 1-2 s after LOGIN',
      frequency: '36.3% measured share (off runs 35.9-37.3%)',
      category: 'authentication',
    },
    {
      id: 'LOGOUT',
      description:
        'Logout of a session (30% of user sessions, 50% of admin console sessions)',
      frequency: '11.7% measured share (off runs 10.9-12.2%)',
      category: 'authentication',
    },
    {
      id: 'LOGIN_ERROR',
      description:
        'invalid_user_credentials; 12% of attempts start with 1-8 wrong passwords',
      frequency: '10.8% measured share (off runs 9.0-12.1%)',
      category: 'authentication',
    },
    {
      id: 'CREATE-REALM_ROLE_MAPPING',
      description: 'Realm role granted to a user in the admin console',
      frequency: '2.6% measured share (off runs 2.6-3.2%)',
      category: 'iam',
    },
    {
      id: 'DELETE-REALM_ROLE_MAPPING',
      description:
        'Realm role removed, including expiry of time-bound secops-admin grants',
      frequency: '2.2% measured share (off runs 2.0-2.5%)',
      category: 'iam',
    },
  ],
  realismFeatures: [
    "One realm with 36 users and 5 administrators, each an independent process: lognormal idle gaps thinned by a UTC office-hours curve, a login that sometimes starts with wrong passwords, the code exchange, an optional logout and, for administrators in the admin console, realm role grants and removals. Addresses are the account's workstation or one of three VPN egress addresses shared by remote staff. The final 72-hour default capture holds 2,372 records; rates are synthetic, not a vendor-published distribution.",
    'Listener profile: success-level=info (the default is debug), include-representation=true and realm admin event details enabled. With the defaults, successful events are not written at INFO and admin lines carry no representation.',
    'LOGIN and CODE_TO_TOKEN detail keys copy a Keycloak 26 raw capture, and sessionId equals the attempt code_id. No 26.x raw LOGIN_ERROR with the full detail set or raw LOGOUT was available: those keys follow the Elastic fixture, a 26.0.7 raw line and the listener source. Keycloak stores details in a HashMap, so key order in a real deployment can differ; role representation keys follow RoleRepresentation and the exact body depends on the admin client.',
    'Every chain element occurs in ordinary traffic in both modes: administrators log in from VPN egress addresses, wrong-password bursts are followed by a login, admin console sessions carry several quick grants, and 6-13 secops-admin grants occur per background capture. A background grant that would complete the chain within 15 minutes grants another role instead, at the same time and by the same administrator.',
    'Episode starts keep near the hour of the first draw; intervals of 12 hours or less put some starts into evening hours, and the idle-administrator condition slightly favours less active administrators.',
    'Only one realm and these event types are modeled: no refresh-token, client-credentials, required-action, brute-force lockout or user/group admin events. One line per one-second tick serializes concurrent events by up to a few seconds; event.ingested lags 0.3-20 s and log file rotation is not modeled.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit recurring anomaly episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time interval between episodes, 6 to 720',
    },
    {
      name: 'realm',
      defaultValue: 'corp',
      description: 'Realm name',
    },
    {
      name: 'realm_id',
      defaultValue: '523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4',
      description: 'Realm id, also the role containerId',
    },
    {
      name: 'sso_base_url',
      defaultValue: 'https://sso.corp.example',
      description:
        'Keycloak base URL used in account-console and admin console redirect URIs',
    },
    {
      name: 'admin_console_client_uuid',
      defaultValue: '3f1c9b52-8d47-4e0a-b6d2-71a95c0e4f83',
      description:
        'Internal id of security-admin-console, logged as clientId of admin events',
    },
    {
      name: 'privileged_role_name',
      defaultValue: 'secops-admin',
      description: 'Privileged realm role granted by the chain',
    },
    {
      name: 'privileged_role_id',
      defaultValue: 'b18f4680-7b51-450e-89f2-65d98024e7b7',
      description: 'Id of that role',
    },
    {
      name: 'vpn_nat_ips',
      defaultValue: '[10.20.200.10, 10.20.200.11, 10.20.200.12]',
      description: 'VPN egress addresses shared by remote staff',
    },
    {
      name: 'hostname',
      defaultValue: 'keycloak-01.corp.example',
      description: 'Keycloak host and agent name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.20.1.15',
      description: 'Keycloak host address',
    },
    {
      name: 'collector_id',
      defaultValue: 'a0634c5c-35db-4f7a-8273-73052fa14208',
      description: 'Elastic Agent id',
    },
    {
      name: 'collector_ephemeral_id',
      defaultValue: 'e026770f-355a-4130-97ba-658b5a1f98f2',
      description: 'Elastic Agent ephemeral id',
    },
    {
      name: 'collector_version',
      defaultValue: '8.17.0',
      description: 'Elastic Agent version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Privileged grant of the first default episode',
      json: String.raw`{"@timestamp": "2026-09-01T13:36:14.114Z", "agent": {"ephemeral_id": "e026770f-355a-4130-97ba-658b5a1f98f2", "id": "a0634c5c-35db-4f7a-8273-73052fa14208", "name": "keycloak-01.corp.example", "type": "filebeat", "version": "8.17.0"}, "data_stream": {"dataset": "keycloak.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "elastic_agent": {"id": "a0634c5c-35db-4f7a-8273-73052fa14208", "snapshot": false, "version": "8.17.0"}, "event": {"action": "CREATE-REALM_ROLE_MAPPING", "agent_id_status": "verified", "category": ["iam"], "code": "CREATE-REALM_ROLE_MAPPING", "dataset": "keycloak.log", "ingested": "2026-09-01T13:36:15Z", "kind": "event", "original": "2026-09-01 13:36:14,114 INFO  [org.keycloak.events] (executor-thread-9) operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"3f1c9b52-8d47-4e0a-b6d2-71a95c0e4f83\", userId=\"ed8a63bd-a7a4-4b64-ac7e-7af1e2b5cf7c\", ipAddress=\"10.20.200.11\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/1cb9ad5b-dcbe-4b2f-8fc8-61122d880945/role-mappings/realm\", representation=\"[{\\\"id\\\":\\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\",\\\"name\\\":\\\"secops-admin\\\",\\\"composite\\\":false,\\\"clientRole\\\":false,\\\"containerId\\\":\\\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\\\"}]\"", "outcome": "unknown", "timezone": "+00:00", "type": ["info", "admin", "creation"]}, "host": {"architecture": "x86_64", "containerized": true, "hostname": "keycloak-01.corp.example", "ip": ["10.20.1.15"], "name": "keycloak-01.corp.example", "os": {"codename": "bookworm", "family": "debian", "kernel": "6.1.0-28-amd64", "name": "Debian GNU/Linux", "platform": "debian", "type": "linux", "version": "12"}}, "input": {"type": "filestream"}, "keycloak": {"admin": {"operation": "CREATE", "resource": {"path": "users/1cb9ad5b-dcbe-4b2f-8fc8-61122d880945/role-mappings/realm", "type": "REALM_ROLE_MAPPING"}}, "client": {"id": "3f1c9b52-8d47-4e0a-b6d2-71a95c0e4f83"}, "event_type": "admin", "realm": {"id": "523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4"}}, "log": {"file": {"path": "/opt/keycloak/data/log/keycloak.log"}, "level": "INFO", "logger": "org.keycloak.events", "offset": 3101021}, "process": {"thread": {"name": "executor-thread-9"}}, "related": {"ip": ["10.20.200.11"], "user": ["ed8a63bd-a7a4-4b64-ac7e-7af1e2b5cf7c", "1cb9ad5b-dcbe-4b2f-8fc8-61122d880945"]}, "source": {"address": "10.20.200.11", "ip": "10.20.200.11"}, "tags": ["preserve_original_event", "forwarded", "keycloak-log"], "user": {"id": "ed8a63bd-a7a4-4b64-ac7e-7af1e2b5cf7c", "target": {"id": "1cb9ad5b-dcbe-4b2f-8fc8-61122d880945"}}}`,
    },
  ],
};
