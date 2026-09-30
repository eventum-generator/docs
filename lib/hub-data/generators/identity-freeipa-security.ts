/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeipaSecurity: GeneratorMeta = {
  slug: 'identity-freeipa-security',
  displayName: 'FreeIPA Directory Server Security',
  category: 'identity',
  description:
    "Security log of the 389 Directory Server of one FreeIPA server as ECS JSON, for SIEM content on LDAP password guessing, account misuse and authorization errors. event.original holds the native record byte for byte as 389-ds-base serialises it: simple and anonymous binds and their failures, authorization errors and TCP errors from 200 users through six LDAP-authenticating applications, their lookup accounts, Directory Manager, disabled accounts and stray clients, with FreeIPA's default lockout on user accounts; SASL/GSSAPI binds are not written to this log. Recurring episodes show five wrong passwords for one user through one application, then a success.",
  dataSource:
    '389 Directory Server security log (/var/log/dirsrv/slapd-<REALM>/security) of one FreeIPA server, layout from the 389-ds-base main-branch source',
  eventFormat: 'ECS JSON',
  originalFormat: 'JSON',
  eventCount: 13,
  templateCount: 1,
  highlights: [
    'Native json-c security record byte for byte in event.original',
    'FreeIPA default lockout: six quick failures lock a user for 10 minutes',
    'Recurring five wrong passwords then success, one short of lockout',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user, through one application that user normally uses, fails five simple binds with INVALID_PASSWORD, each on a new connection, then binds successfully with the same DN and client address, all within 10 minutes (about 1-4 minutes in total): one attempt short of FreeIPA's default lockout of six failures. The first episode starts within min(anomaly_interval_hours, 24 h) of the start of the data, at an hour drawn from the people activity curve; every later one is due one interval after the previous start and starts within a window of min(interval / 4, 6 h) centred on that due time, favouring busy hours, so start hours do not drift and a late episode never causes catch-up. At the default 24 h about four in five episodes start at 07-17 UTC and consecutive episodes are about 21-27 h apart; at 8 h, about 7.4-9 h apart. The user differs from the previous episode's and is picked by the ordinary login weights, and their own logins go on as usual. Every fragment occurs in ordinary traffic and no field labels an episode; only the complete run is episode-only.",
  generatorId: 'freeipa',
  eventTypes: [
    {
      id: 'BIND_SUCCESS (user)',
      description: 'Empty msg; user via an application',
      frequency: '53.42% share',
      category: 'authentication',
    },
    {
      id: 'BIND_SUCCESS (service account)',
      description: 'Empty msg; application lookup account',
      frequency: '34.43% share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (user)',
      description: 'Wrong password for a user',
      frequency: '7.50% share',
      category: 'authentication',
    },
    {
      id: 'BIND_SUCCESS ANONYMOUS_BIND',
      description: 'Anonymous bind with an empty DN',
      frequency: '2.12% share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED NO_SUCH_ENTRY',
      description: 'Mistyped user name',
      frequency: '0.74% share',
      category: 'authentication',
    },
    {
      id: 'AUTHZ_ERROR (user)',
      description: 'Denied operation, msg target_dn=(...)',
      frequency: '0.64% share',
      category: 'iam',
    },
    {
      id: 'BIND_FAILED ACCOUNT_LOCKED',
      description: 'Bind by a disabled user',
      frequency: '0.46% share',
      category: 'authentication',
    },
    {
      id: 'TCP_ERROR B1',
      description:
        'Bad Ber Tag or uncleanly closed connection - B1; client address only',
      frequency: '0.24% share',
      category: 'network',
    },
    {
      id: 'BIND_SUCCESS (Directory Manager)',
      description: 'Empty msg; cn=directory manager',
      frequency: '0.18% share',
      category: 'authentication',
    },
    {
      id: 'AUTHZ_ERROR (service account)',
      description: 'Denied operation, msg target_dn=(...)',
      frequency: '0.13% share',
      category: 'iam',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (service account)',
      description: 'Wrong password for a lookup account',
      frequency: '0.08% share',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED INVALID_PASSWORD (Directory Manager)',
      description: 'Wrong password for cn=directory manager',
      frequency: '0.03% share',
      category: 'authentication',
    },
    {
      id: 'TCP_ERROR B3 / B2',
      description:
        'Ber peak tag - B3 or Ber Too Big (nsslapd-maxbersize) - B2; client address only',
      frequency: '0.01% share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'About 8,300 records a day from two populations, by UTC hour: people (user logins, administrators, anonymous binds) at 0.017 records/s at 00-07 and 21-24, 0.108 at 07-17 and 0.047 at 17-21; automated clients (lookup accounts, disabled devices, stray connections) at a flat 0.036 records/s. Daily volume varies by about 3%, and the hour curve repeats every day with no weekday cycle.',
    "200 users, each with 1-4 of six LDAP-authenticating applications and fixed per-user and per-application weights, make about 4,400 logins a day; the application's address is client_ip. Each attempt is a new connection, op 1 behind StartTLS or op 0. 7% of logins start with 1-6 wrong passwords, retyped after a median of about 20 s in office hours and 28 s at night; 1.2% start with a mistyped user name, and 7% of self-service portal logins are followed on the same connection by a denied modification.",
    "FreeIPA's default lockout applies to every user account: six failures, each within a minute of the previous one and across all applications, lock it for 10 minutes, and a locked account produces no records until the lock expires (about 7 lockouts a day, 1-15). Only the default global password policy is modelled, with no per-group policies, administrator unlocks or Kerberos failures. ACCOUNT_LOCKED stands for two accounts disabled through nsAccountLock whose devices still try, about 20 bursts of 1-4 a day, not for the lockout.",
    'Lookup accounts under cn=sysaccounts,cn=etc re-bind about every three minutes, any hour, on 2-4 pooled connections with growing op numbers. About once every two days one application keeps reconnecting with a stale password every ~40 s for a median 25 minutes and its pooled re-binds fail too; service accounts are not locked. About ten Directory Manager sessions a day come from three admin hosts, 20% starting with 1-4 typos, with root_dn true on every attempt. conn_id is one server-wide counter whose step varies with the unlogged GSSAPI connections in between.',
    'Ordinary traffic holds per day about 20-40 windows of five failures for one DN and address within 10 minutes without a success, 16-31 successes after exactly four wrong passwords and 260-450 wrong-password pairs by the same DN and address within 60 s. It never holds a success after five wrong passwords for the same DN and address within 10 minutes, which a real directory sees from forgetful users, so a detector for the chain has no false positives here; with anomaly mode on, counts of the chain parts are about one per episode higher.',
    'The layout follows the 389-ds-base main-branch source and two raw lines in the 389 DS design pages; no complete production FreeIPA capture was available, and older 2.x releases may differ (for example an integer utc_time). Only SIMPLE binds: no SIMPLE/MFA, TLSCLIENTAUTH, LDAPI, CERT_MAP_FAILED or HAPROXY_SUCCESS. UTC clocks, one server, IPv4 only; users, applications and rates are training assumptions. No Elastic integration covers this log, and compatibility with the KUMA FreeIPA normalizer is not established.',
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
      title: 'Success that completes an episode',
      json: String.raw`{"@timestamp": "2026-10-02T15:46:14.148Z", "ecs": {"version": "8.17.0"}, "event": {"action": "bind_success", "category": ["authentication"], "dataset": "freeipa.security", "kind": "event", "module": "freeipa", "original": "{ \"date\": \"[02\\/Oct\\/2026:15:46:14.148015846 +0000] \", \"utc_time\": \"1790955974.148015846\", \"event\": \"BIND_SUCCESS\", \"dn\": \"uid=thomas.scott,cn=users,cn=accounts,dc=example,dc=test\", \"bind_method\": \"SIMPLE\", \"root_dn\": false, \"client_ip\": \"10.20.3.13\", \"server_ip\": \"10.20.0.10\", \"ldap_version\": 3, \"conn_id\": 369251, \"op_id\": 1, \"msg\": \"\" }", "outcome": "success", "type": ["start"]}, "freeipa": {"security": {"bind_method": "SIMPLE", "client_ip": "10.20.3.13", "conn_id": 369251, "dn": "uid=thomas.scott,cn=users,cn=accounts,dc=example,dc=test", "event": "BIND_SUCCESS", "ldap_version": 3, "msg": "", "op_id": 1, "root_dn": false, "server_ip": "10.20.0.10"}}, "host": {"ip": ["10.20.0.10"], "name": "ipa-01.example.test"}, "log": {"file": {"path": "/var/log/dirsrv/slapd-EXAMPLE-TEST/security"}}, "related": {"ip": ["10.20.3.13", "10.20.0.10"], "user": ["thomas.scott"]}, "source": {"ip": "10.20.3.13"}, "user": {"name": "thomas.scott"}}`,
    },
  ],
};
