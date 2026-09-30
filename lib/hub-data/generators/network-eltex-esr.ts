/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexEsr: GeneratorMeta = {
  slug: 'network-eltex-esr',
  displayName: 'Eltex ESR Router Syslog',
  category: 'network',
  description:
    'Eltex ESR-series (software 1.40) remote syslog records of one router as ECS JSON: SSH administration, local account and configuration changes, firewall, NAT and IPS logs. event.original holds the RFC 5424 frame and message the documented %GROUP-SEVERITY-MNEMONIC body. Weekly episodes by default join three failed passwords to a new privileged account and its first login.',
  dataSource:
    'Eltex ESR-series 1.40 remote syslog, RFC 5424 frame with sequence numbers',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 15,
  templateCount: 1,
  highlights: [
    'RFC 5424 frame in event.original, native body in message',
    'Two administrators, an automated backup account and five temporary accounts',
    'Recurring failed-password to privileged-account chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "An administrator fails three passwords on one SSH connection, logs in on it, changes the enable password, creates an absent temporary account and raises it from privilege 1 to 14, applies the configuration and sets the clock; the new account then logs in from the administrator's address. An episode typically spans 3-14 minutes (median about 6). anomaly_interval_hours defaults to 168, one episode a week (minimum 6): the first starts within the first interval or 24 hours, whichever is shorter, at a time following the hourly curve; each later one is due one interval after the previous start and starts in a window centred on that due time, a quarter of the interval wide but at most 6 hours (165 to 171 hours after the previous start by default), weighted by the squared hourly curve plus a small floor, so later episodes keep roughly the hour of day of the first, pulled toward working hours. An episode starts later when no temporary account is absent or both administrators are between failed password attempts; a late episode is not made up. The administrator is random, the account differs from the previous episode's, and an ordinary maintenance session later removes it. Every fragment occurs in background, including the onboarding routine right after three failures (about one a week); only the complete sequence within 30 minutes never does. At the default interval a week holds about one more of each chain part than without episodes.",
  generatorId: 'esr',
  eventTypes: [
    {
      id: 'firewall_permitted',
      description: '%FIREWALL-I-LOG permit, rules 10/20/30',
      frequency: '59.09% measured share',
      category: 'network',
    },
    {
      id: 'firewall_denied',
      description: '%FIREWALL-I-LOG deny, rule 40',
      frequency: '19.21% measured share',
      category: 'network',
    },
    {
      id: 'snat_translation',
      description: '%NAT-I-LOG source translation',
      frequency: '14.29% measured share',
      category: 'network',
    },
    {
      id: 'ips_drop',
      description: '%IPS-I-INFO drop',
      frequency: '1.45% measured share',
      category: 'intrusion_detection',
    },
    {
      id: 'ssh_password_accepted',
      description: '%AAA-I-SSH password accepted',
      frequency: '1.31% measured share',
      category: 'authentication',
    },
    {
      id: 'session_opened',
      description: '%AAA-LOCAL-I-SESSION session opened',
      frequency: '1.31% measured share',
      category: 'authentication',
    },
    {
      id: 'session_closed',
      description: '%AAA-LOCAL-I-SESSION session closed',
      frequency: '1.31% measured share',
      category: 'authentication',
    },
    {
      id: 'configuration_applied',
      description: '%SYS-W-EVENT configuration applied',
      frequency: '0.54% measured share',
      category: 'configuration',
    },
    {
      id: 'system_time_changed',
      description: '%TIME-I-INFO system clock set',
      frequency: '0.32% measured share',
      category: 'configuration',
    },
    {
      id: 'user_privilege_changed',
      description: '%USER-I-INFO account privilege changed',
      frequency: '0.29% measured share',
      category: 'iam',
    },
    {
      id: 'enable_password_changed',
      description: '%USER-I-INFO privilege 15 enable password changed',
      frequency: '0.29% measured share',
      category: 'iam, configuration',
    },
    {
      id: 'user_created',
      description: '%USER-I-ADD temporary account created',
      frequency: '0.23% measured share',
      category: 'iam',
    },
    {
      id: 'user_removed',
      description: '%USER-I-ADD temporary account removed',
      frequency: '0.23% measured share',
      category: 'iam',
    },
    {
      id: 'ssh_password_failed',
      description: '%AAA-I-SSH password failed',
      frequency: '0.07% measured share',
      category: 'authentication',
    },
    {
      id: 'user_password_changed',
      description: '%USER-I-INFO account password changed',
      frequency: '0.06% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'About 8,900 records a day by hour, UTC by default: 609 an hour in 06:00-16:00, 336 in 16:00-20:00 and 147 at night, varying by up to 10% a day. SSH and maintenance records are part of this volume and firewall, NAT and IPS records make up the rest. Sequence numbers grow by one, or by 2-7 in 15% of records for device messages outside this subset.',
    'Each administrator starts about 16 sessions a day on the hourly curve with a shared daily workload factor. A connection has 0-3 failed passwords on one TCP source port before success (92 / 5.5 / 1.5 / 1%); 1.5% give up after 1-3 failures and 70% of those retry from a new port. Failures stay below the five-attempt lockout threshold, assuming the counter resets after 300 seconds without failures.',
    "A session holds 0-6 maintenance operations: create or remove a temporary account, change a privilege, a password or the enable password, set the clock. Half of the administrator sessions, when an account is absent, run an onboarding routine instead: rotate the enable password, create an account, raise it from 1 to 14, apply, set the clock, then test the new account's login. Changes are applied before logout, and changes pending in another session are not visible.",
    'The backup and monitoring account logs in about 48 times a day around the clock with a stored password that does not fail, for about 15 seconds without changes. Temporary accounts get a planned lifetime (median 40 minutes) and are removed by the next session after it passes; they log in only after their creation is applied and never after removal, about eight times a day from either administrator address. Failed passwords are about 5.5% of SSH password records.',
    'Permit, deny, SNAT and IPS drop records over a fixed IPv4 flow inventory with fresh ephemeral source and NAT ports; rules 10/20/30 permit and rule 40 denies throughout. All gaps are log-normal, with no fixed periods, rotations or per-actor cooldowns.',
    'Administration is far busier than on a production router: temporary accounts are created and removed many times a day and the enable password changes several times a day. Steps of one session are seconds apart (password accepted to session opened a median 6 s in office hours, about 20 s at night), where a router logs them within a second.',
    'USER messages carry only the target account, so linking configuration changes to the administrator relies on the surrounding session. The time-change body has no clock values, and CLI commit/confirm records are omitted on the assumption that every commit is confirmed.',
    'The ssh session slot substitutes the documented console value, as no SSH capture from a real device was available. Non-AAA app names and facility local0 are assumptions. IPv6, Telnet/console, public-key and remote AAA logins, lockout records, rollback and full traffic session lifecycles are outside the subset. Rates are training assumptions, and no Elastic integration exists for ESR, so the ECS mapping is inferred.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'esr-edge-01',
      description: 'Router hostname in the syslog frame and observer.*',
    },
    {
      name: 'router_ip',
      defaultValue: '10.50.0.1',
      description: 'Management address (destination.ip of SSH records)',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'First privilege 15 administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.50.1.25',
      description: "First administrator's client address",
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin',
      description: 'Second privilege 15 administrator',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.99.4.33',
      description: "Second administrator's client address",
    },
    {
      name: 'automation_user',
      defaultValue: 'netbackup',
      description: 'Backup and monitoring account',
    },
    {
      name: 'automation_source_ip',
      defaultValue: '10.50.1.60',
      description: 'Backup and monitoring server address',
    },
    {
      name: 'service_user_prefix',
      defaultValue: 'svc_remote_',
      description: 'Temporary accounts are this prefix plus 001-005',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add periodic episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '168',
      description: 'Episode interval in source hours, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Privilege change of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T21:52:43+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "user_privilege_changed", "category": ["iam"], "dataset": "eltex.esr.syslog", "kind": "event", "module": "eltex", "original": "\u003c134\u003e1 2026-09-01T21:52:43+00:00 esr-edge-01 user - - - 15506: %USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14", "outcome": "success", "type": ["change"]}, "message": "%USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14", "log": {"level": "info", "syslog": {"priority": 134, "facility": {"code": 16}, "severity": {"code": 6}, "appname": "user", "version": "1"}}, "observer": {"hostname": "esr-edge-01", "ip": ["10.50.0.1"], "name": "esr-edge-01", "product": "ESR", "type": "router", "vendor": "Eltex"}, "eltex": {"esr": {"group": "USER", "mnemonic": "INFO", "severity_code": "I", "sequence_number": 15506, "details": {"privilege": {"new": 14, "old": 1}}}}, "user": {"target": {"name": "svc_remote_001"}}, "related": {"user": ["svc_remote_001"]}}`,
    },
  ],
};
