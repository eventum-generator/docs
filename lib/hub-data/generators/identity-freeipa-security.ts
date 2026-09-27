/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeipaSecurity: GeneratorMeta = {
  slug: 'identity-freeipa-security',
  displayName: 'FreeIPA Directory Server Security',
  category: 'identity',
  description:
    'Security log of the 389 Directory Server of one FreeIPA server as ECS JSON, for SIEM content on LDAP password guessing, account misuse and authorization errors. event.original holds the native record byte for byte as 389-ds-base serialises it: simple and anonymous binds and their failures, authorization errors and TCP errors from users through LDAP-authenticating applications, lookup accounts, Directory Manager and stray clients; SASL/GSSAPI binds are not written to this log. Recurring episodes show five wrong passwords for one user through one application, then a success.',
  dataSource:
    '389 Directory Server security log (/var/log/dirsrv/slapd-<REALM>/security) of one FreeIPA server, layout from the 389-ds-base main-branch source',
  format: ['JSON', 'ECS'],
  eventCount: 13,
  templateCount: 1,
  highlights: [
    'Native json-c security record byte for byte in event.original',
    'Users, lookup accounts, Directory Manager and stray clients',
    'Recurring five wrong passwords then success, one short of lockout',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every 24 hours of source time by default (minimum 6), first one interval after generation starts. Its start is drawn within the following min(interval / 4, 6 h) from the background load curve, so the gap between starts is one interval plus 0 to min(interval / 4, 6 h): 29.8 and 26.4 h measured at the default, 8.0-10.0 h at 8 h. The next due time counts from the actual start, so a late episode never causes catch-up. One user, through one of their own applications, fails five simple binds with INVALID_PASSWORD, each on a new connection, then binds successfully, all within 10 minutes (39-158 s measured): one attempt short of the FreeIPA default lockout of six failures. The user differs from the previous episode; every fragment occurs in background, and only the complete run is kept out of it.',
  generatorId: 'freeipa',
  eventTypes: [
    {
      id: 'BIND_SUCCESS (user)',
      description: 'Empty msg; user via an application',
      frequency: '43.11% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_SUCCESS (service account)',
      description: 'Empty msg; application lookup account',
      frequency: '39.75% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (user)',
      description: 'Wrong password for a user',
      frequency: '6.29% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (service account)',
      description: 'Wrong password for a lookup account',
      frequency: '3.57% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_SUCCESS ANONYMOUS_BIND',
      description: 'Anonymous bind with an empty DN',
      frequency: '2.35% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED ACCOUNT_LOCKED',
      description: 'Bind by a disabled user',
      frequency: '2.09% measured share',
      category: 'authentication',
    },
    {
      id: 'TCP_ERROR B1',
      description:
        'Bad Ber Tag or uncleanly closed connection - B1; client address only',
      frequency: '0.78% measured share',
      category: 'network',
    },
    {
      id: 'BIND_FAILED NO_SUCH_ENTRY',
      description: 'Mistyped user name',
      frequency: '0.59% measured share',
      category: 'authentication',
    },
    {
      id: 'AUTHZ_ERROR (service account)',
      description: 'Denied operation, msg target_dn=(...)',
      frequency: '0.51% measured share',
      category: 'iam',
    },
    {
      id: 'AUTHZ_ERROR (user)',
      description: 'Denied operation, msg target_dn=(...)',
      frequency: '0.45% measured share',
      category: 'iam',
    },
    {
      id: 'BIND_SUCCESS (Directory Manager)',
      description: 'Empty msg; cn=directory manager',
      frequency: '0.40% measured share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (Directory Manager)',
      description: 'Wrong password for cn=directory manager',
      frequency: '0.05% measured share',
      category: 'authentication',
    },
    {
      id: 'TCP_ERROR B3 / B2',
      description:
        'Ber peak tag - B3 or Ber Too Big (nsslapd-maxbersize) - B2; client address only',
      frequency: '0.06% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    '44 users, each with 1-4 of six LDAP-authenticating applications and fixed per-user and per-application weights, log in through one merged Poisson stream (0.011 per second, office-hours factor 1.80 at 07:00-17:00 UTC, 0.79 until 21:00, 0.28 at night). Each attempt is a new connection, op 1 behind StartTLS or op 0; 7% start with 1-6 wrong passwords and 1.2% with a mistyped user name, and 7% of self-service portal logins are followed by a denied modification on the same connection.',
    'Application lookup accounts under cn=sysaccounts,cn=etc re-bind on 2-4 pooled connections with growing op numbers (mean 10 min, any hour), and about one stale-service-password incident every two days retries every ~40 s for a median 25 min. About seven Directory Manager sessions a day come from three admin hosts, with root_dn true on every attempt as in bind.c; two disabled users keep hitting ACCOUNT_LOCKED.',
    'conn_id is one server-wide counter that also grows by the unlogged GSSAPI connections between logged ones, so its step varies. Each one-second tick emits at most one record.',
    'Over 108 h a background capture holds 22-27 windows of five failures for one DN and address within 10 minutes without a success, 19-39 successes after exactly four wrong passwords, and 326-449 wrong-password pairs by the same DN and address within 60 s. An ordinary success after five wrong passwords in the preceding 10 minutes is not written.',
    'The layout follows the 389-ds-base main-branch source and two raw lines in the 389 DS design pages; no complete production FreeIPA capture was available, and older 2.x releases may differ (for example an integer utc_time). ipa-lockout rejections are not modelled, and ACCOUNT_LOCKED stands for accounts disabled through nsAccountLock.',
    'Only SIMPLE binds: no SIMPLE/MFA, TLSCLIENTAUTH, LDAPI, CERT_MAP_FAILED or HAPROXY_SUCCESS. UTC clocks, one server, IPv4 only; users, applications and rates are training assumptions. No Elastic integration covers this log, and compatibility with the KUMA FreeIPA normalizer is not established.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add periodic episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 6-8760',
    },
    {
      name: 'server_host',
      defaultValue: 'ipa-01.example.test',
      description: 'host.name of the FreeIPA server',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'Server address (server_ip, host.ip)',
    },
    {
      name: 'realm',
      defaultValue: 'EXAMPLE.TEST',
      description: 'Kerberos realm; names the 389 DS instance in log.file.path',
    },
    {
      name: 'directory_suffix',
      defaultValue: 'dc=example,dc=test',
      description: 'Directory suffix of all DNs',
    },
  ],
  sampleOutputs: [
    {
      title: 'Success that completes the first episode',
      json: String.raw`{"@timestamp": "2026-09-27T05:53:53.769Z", "ecs": {"version": "8.17.0"}, "event": {"action": "bind_success", "category": ["authentication"], "dataset": "freeipa.security", "kind": "event", "module": "freeipa", "original": "{ \"date\": \"[27\\/Sep\\/2026:05:53:53.769065469 +0000] \", \"utc_time\": \"1790488433.769065469\", \"event\": \"BIND_SUCCESS\", \"dn\": \"uid=liam.taylor,cn=users,cn=accounts,dc=example,dc=test\", \"bind_method\": \"SIMPLE\", \"root_dn\": false, \"client_ip\": \"10.20.3.15\", \"server_ip\": \"10.20.0.10\", \"ldap_version\": 3, \"conn_id\": 364118, \"op_id\": 0, \"msg\": \"\" }", "outcome": "success", "type": ["start"]}, "freeipa": {"security": {"bind_method": "SIMPLE", "client_ip": "10.20.3.15", "conn_id": 364118, "dn": "uid=liam.taylor,cn=users,cn=accounts,dc=example,dc=test", "event": "BIND_SUCCESS", "ldap_version": 3, "msg": "", "op_id": 0, "root_dn": false, "server_ip": "10.20.0.10"}}, "host": {"ip": ["10.20.0.10"], "name": "ipa-01.example.test"}, "log": {"file": {"path": "/var/log/dirsrv/slapd-EXAMPLE-TEST/security"}}, "related": {"ip": ["10.20.3.15", "10.20.0.10"], "user": ["liam.taylor"]}, "source": {"ip": "10.20.3.15"}, "user": {"name": "liam.taylor"}}`,
    },
  ],
};
