/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityKeycloak: GeneratorMeta = {
  slug: 'identity-keycloak',
  displayName: 'Keycloak 26.7.4 Event Log',
  category: 'identity',
  description:
    'Keycloak 26.7.4 jboss-logging user and admin event lines for one realm with 1,500 users and 5 administrators, as native text in event.original with keycloak.*, user.*, source.* and url.* fields following the Elastic keycloak.log pipeline. Recurring episodes show one administrator failing five to eight logins from a VPN egress address, then logging in to the admin console and granting a privileged realm role.',
  dataSource:
    'Keycloak 26.7.4 jboss-logging event listener (user and admin events, success level INFO, representations included), as collected by Elastic Agent',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native jboss-logging listener line in event.original',
    '1,500 users and 5 administrators on a UTC hour-of-day curve',
    'Recurring failed-login to privileged-role-grant chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Within 15 minutes (typically 1-6 minutes from the first failure to the grant), one administrator fails five to eight logins from one VPN egress address in one browser authentication session, logs in to security-admin-console from it, exchanges the code and grants secops-admin to a user who does not hold it. Episodes recur every 24 hours of source time by default (anomaly_interval_hours, 6-720): the first starts within the first min(interval, 24 h) at an hour drawn from the traffic curve, each later one is due one interval after the actual previous start and starts in a window of min(interval / 4, 6 h) centred on that time, pulled by up to half the window toward office hours; missed time is never caught up, and a start waits until the chosen administrator has no login in progress. At 12 h or less every other start falls in evening or night hours. A rare night episode whose code exchange would exceed 55 s ends after LOGIN, incomplete. Administrator and target differ from the previous episode; every chain element also occurs in background, and the complete chain never occurs with anomaly_mode false.',
  generatorId: 'keycloak',
  eventTypes: [
    {
      id: 'LOGIN',
      description: 'Browser login to an OIDC client',
      frequency: '39.26% share (39.11-39.25% without anomalies)',
      category: 'authentication',
    },
    {
      id: 'CODE_TO_TOKEN',
      description: 'Authorization-code exchange after LOGIN',
      frequency: '39.21% share (39.07-39.22% without anomalies)',
      category: 'authentication',
    },
    {
      id: 'LOGOUT',
      description:
        'Logout of a session (30% of user sessions, 50% of admin console sessions)',
      frequency: '11.67% share (11.70-11.85% without anomalies)',
      category: 'authentication',
    },
    {
      id: 'LOGIN_ERROR',
      description:
        'invalid_user_credentials: wrong passwords before a login and administrators retrying a rotated password over VPN',
      frequency: '9.47% share (9.29-9.59% without anomalies)',
      category: 'authentication',
    },
    {
      id: 'CREATE-REALM_ROLE_MAPPING',
      description: 'Realm role granted to a user in the admin console',
      frequency: '0.22% share (0.18-0.25% without anomalies)',
      category: 'iam',
    },
    {
      id: 'DELETE-REALM_ROLE_MAPPING',
      description:
        'Realm role removed, including expiry of time-bound secops-admin grants',
      frequency: '0.17% share (0.16-0.20% without anomalies)',
      category: 'iam',
    },
  ],
  realismFeatures: [
    "One realm with 1,500 users and 5 administrators. Users log in to one to three OIDC clients, 7.7 times a day on average; administrators log in 12 times a day, to security-admin-console (85%) or account-console, grant and remove realm roles, and connect over VPN for 40-50% of their attempts. Addresses are the account's workstation or one of three VPN egress addresses shared by all remote staff. Rates are synthetic, not a vendor-published distribution.",
    'About 29,000 events a day with ±10% day-to-day variation on a UTC hour-of-day curve: 0.60 events/s in 08-18, 0.30 in 07-08 and 18-20, 0.15 in 20-23 and 0.09 in 23-07. The curve repeats every day, so weekends look like weekdays.',
    "Records of one login are seconds apart rather than milliseconds: wrong passwords a median 12 s apart, CODE_TO_TOKEN a median 2.8 s after LOGIN (9 s at night) and never more than 55 s, within Keycloak's one-minute Client Login Timeout. About 0.1% of LOGINs, nearly all at night, have no code exchange because the code expired.",
    '12% of login attempts start with 1-8 wrong passwords and 15% of those give up. Administrator passwords are rotated by a vault: over VPN an administrator sometimes types the previous one 3-8 times before fetching the new one (7% of VPN admin console attempts, 45% of those right after such an attempt), and about 90% then log in and continue their console work. These retries cluster by administrator and day.',
    'Every chain element occurs in ordinary traffic in both modes: each administrator + VPN address pair logs in at least three times a week, administrator bursts of five or more wrong passwords from a VPN address happen about 11 times a week (roughly 3 to 19), most followed by a login and often by a role grant within 15 minutes, and secops-admin is granted 8-12 times a day. Every secops-admin grant is time-bound and removed after a lease (median 8 h), typically 5-30 hours later. Each episode adds one such burst, about six more a week at the default interval, so a single week with anomalies usually looks like a busy background week; a 12-hour interval doubles the excess.',
    'Listener profile: success-level=info (the default is debug), include-representation=true and realm admin event details enabled. With the defaults, successful events are not written at INFO and admin lines carry no representation. LOGIN and CODE_TO_TOKEN detail keys copy a raw Keycloak 26 log; no 26.x raw LOGIN_ERROR with the full detail set or raw LOGOUT was available, so those keys follow the Elastic fixture, a 26.0.7 raw line and the listener source. Keycloak stores details in a HashMap, so key order in a real deployment can differ; role representation keys follow RoleRepresentation and the exact body depends on the admin client.',
    'Only one realm and these event types are modeled: no refresh-token, client-credentials, required-action, brute-force lockout, code-exchange error or user/group admin events. event.ingested lags 0.3-20 s and log file rotation is not modeled.',
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
      json: String.raw`{"@timestamp": "2026-09-01T03:40:38.276Z", "agent": {"ephemeral_id": "e026770f-355a-4130-97ba-658b5a1f98f2", "id": "a0634c5c-35db-4f7a-8273-73052fa14208", "name": "keycloak-01.corp.example", "type": "filebeat", "version": "8.17.0"}, "data_stream": {"dataset": "keycloak.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.11.0"}, "elastic_agent": {"id": "a0634c5c-35db-4f7a-8273-73052fa14208", "snapshot": false, "version": "8.17.0"}, "event": {"action": "CREATE-REALM_ROLE_MAPPING", "agent_id_status": "verified", "category": ["iam"], "code": "CREATE-REALM_ROLE_MAPPING", "dataset": "keycloak.log", "ingested": "2026-09-01T03:40:41Z", "kind": "event", "original": "2026-09-01 03:40:38,276 INFO  [org.keycloak.events] (executor-thread-46) operationType=\"CREATE\", realmId=\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\", realmName=\"corp\", clientId=\"3f1c9b52-8d47-4e0a-b6d2-71a95c0e4f83\", userId=\"4dc163fa-d66b-46b2-b00c-ac3390f7f3a4\", ipAddress=\"10.20.200.11\", resourceType=\"REALM_ROLE_MAPPING\", resourcePath=\"users/e7ec4496-f5dd-48a4-8fbd-ddb322908061/role-mappings/realm\", representation=\"[{\\\"id\\\":\\\"b18f4680-7b51-450e-89f2-65d98024e7b7\\\",\\\"name\\\":\\\"secops-admin\\\",\\\"composite\\\":false,\\\"clientRole\\\":false,\\\"containerId\\\":\\\"523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4\\\"}]\"", "outcome": "unknown", "timezone": "+00:00", "type": ["info", "admin", "creation"]}, "host": {"architecture": "x86_64", "containerized": true, "hostname": "keycloak-01.corp.example", "ip": ["10.20.1.15"], "name": "keycloak-01.corp.example", "os": {"codename": "bookworm", "family": "debian", "kernel": "6.1.0-28-amd64", "name": "Debian GNU/Linux", "platform": "debian", "type": "linux", "version": "12"}}, "input": {"type": "filestream"}, "keycloak": {"admin": {"operation": "CREATE", "resource": {"path": "users/e7ec4496-f5dd-48a4-8fbd-ddb322908061/role-mappings/realm", "type": "REALM_ROLE_MAPPING"}}, "client": {"id": "3f1c9b52-8d47-4e0a-b6d2-71a95c0e4f83"}, "event_type": "admin", "realm": {"id": "523dd4a1-c4d0-4cf1-acb4-ea0f1de7e9c4"}}, "log": {"file": {"path": "/opt/keycloak/data/log/keycloak.log"}, "level": "INFO", "logger": "org.keycloak.events", "offset": 9512095}, "process": {"thread": {"name": "executor-thread-46"}}, "related": {"ip": ["10.20.200.11"], "user": ["4dc163fa-d66b-46b2-b00c-ac3390f7f3a4", "e7ec4496-f5dd-48a4-8fbd-ddb322908061"]}, "source": {"address": "10.20.200.11", "ip": "10.20.200.11"}, "tags": ["preserve_original_event", "forwarded", "keycloak-log"], "user": {"id": "4dc163fa-d66b-46b2-b00c-ac3390f7f3a4", "target": {"id": "e7ec4496-f5dd-48a4-8fbd-ddb322908061"}}}`,
    },
  ],
};
