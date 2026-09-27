/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexEsr: GeneratorMeta = {
  slug: 'network-eltex-esr',
  displayName: 'Eltex ESR Router Syslog',
  category: 'network',
  description:
    'Eltex ESR-series (software 1.40) remote syslog records of one router as ECS JSON: SSH administration, local account and configuration changes, firewall, NAT and IPS logs. event.original holds the RFC 5424 frame and message the documented %GROUP-SEVERITY-MNEMONIC body. Recurring episodes join repeated failed passwords to a new privileged account and its first login.',
  dataSource:
    'Eltex ESR-series 1.40 remote syslog, RFC 5424 frame with sequence numbers',
  format: ['JSON', 'ECS', 'RFC 5424'],
  eventCount: 15,
  templateCount: 1,
  highlights: [
    'RFC 5424 frame in event.original, native body in message',
    'Independent SSH sessions of two administrators and five temporary accounts',
    'Recurring failed-password to privileged-account chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode becomes due every anomaly_interval_hours of source time (default 24, minimum 6), first one interval after generation starts, and starts after a random delay (exponential, mean 20 minutes) once an administrator has no pending failures and an account is absent; the next due time counts from the actual start, with no catch-up. The administrator fails three passwords on one connection, logs in, changes the enable password, creates an absent temporary account and raises it from privilege 1 to 14, applies the configuration and sets the clock; the new account then logs in from the administrator address. Episodes span 4-5.5 minutes; every fragment also occurs in background.',
  generatorId: 'esr',
  eventTypes: [
    {
      id: 'firewall_permitted',
      description: '%FIREWALL-I-LOG permit, rules 10/20/30',
      frequency: '60.62% measured share',
      category: 'network',
    },
    {
      id: 'firewall_denied',
      description: '%FIREWALL-I-LOG deny, rule 40',
      frequency: '20.50% measured share',
      category: 'network',
    },
    {
      id: 'snat_translation',
      description: '%NAT-I-LOG source translation',
      frequency: '14.72% measured share',
      category: 'network',
    },
    {
      id: 'ips_drop',
      description: '%IPS-I-INFO drop',
      frequency: '1.49% measured share',
      category: 'intrusion_detection',
    },
    {
      id: 'ssh_password_accepted',
      description: '%AAA-I-SSH password accepted',
      frequency: '0.43% measured share',
      category: 'authentication',
    },
    {
      id: 'session_opened',
      description: '%AAA-LOCAL-I-SESSION session opened',
      frequency: '0.43% measured share',
      category: 'authentication',
    },
    {
      id: 'session_closed',
      description: '%AAA-LOCAL-I-SESSION session closed',
      frequency: '0.43% measured share',
      category: 'authentication',
    },
    {
      id: 'ssh_password_failed',
      description: '%AAA-I-SSH password failed',
      frequency: '0.36% measured share',
      category: 'authentication',
    },
    {
      id: 'configuration_applied',
      description: '%SYS-W-EVENT configuration applied',
      frequency: '0.34% measured share',
      category: 'configuration',
    },
    {
      id: 'user_privilege_changed',
      description: '%USER-I-INFO account privilege changed',
      frequency: '0.14% measured share',
      category: 'iam',
    },
    {
      id: 'system_time_changed',
      description: '%TIME-I-INFO system clock set',
      frequency: '0.14% measured share',
      category: 'configuration',
    },
    {
      id: 'enable_password_changed',
      description: '%USER-I-INFO privilege 15 enable password changed',
      frequency: '0.13% measured share',
      category: 'iam, configuration',
    },
    {
      id: 'user_created',
      description: '%USER-I-ADD temporary account created',
      frequency: '0.10% measured share',
      category: 'iam',
    },
    {
      id: 'user_removed',
      description: '%USER-I-ADD temporary account removed',
      frequency: '0.09% measured share',
      category: 'iam',
    },
    {
      id: 'user_password_changed',
      description: '%USER-I-INFO account password changed',
      frequency: '0.09% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Each one-second tick emits at most one record: the earliest due step of an open SSH connection or session, otherwise a traffic record scaled by an office-hours factor, averaging about one record per ten seconds with random gaps. Sequence numbers grow by one, or by 2-7 for device messages outside this subset.',
    'Each administrator starts about 16 sessions per day. A connection has 0-3 failed passwords on one TCP source port before success; 12% give up after 1-3 failures and 70% of those retry from a new port. Failures stay below the five-attempt lockout threshold, assuming the counter resets after 300 seconds without failures.',
    'A session holds 0-6 maintenance operations: create or remove a temporary account, change a privilege, a password or the enable password, set the clock. Configuration changes are applied before logout, an account logs in only after its creation is applied, and an episode account is later removed by ordinary maintenance.',
    'Permit, deny, SNAT and IPS drop records over a fixed IPv4 flow inventory with fresh ephemeral source and NAT ports; rules 10/20/30 permit and rule 40 denies throughout. All gaps are log-normal, with no fixed periods, rotations or per-actor cooldowns.',
    'USER messages carry only the target account, so linking configuration changes to the administrator relies on the surrounding session. The time-change body has no old or new clock value, and CLI commit/confirm records are omitted on the assumption that every commit is confirmed.',
    'The ssh: session prefix substitutes the documented console: slot, as no SSH capture was available. Non-AAA app names and facility local0 are assumptions; IPv6, Telnet/console, public-key and remote AAA logins, lockout records and rollback are outside the subset. Rates are training assumptions, and no Elastic integration exists for ESR.',
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
      defaultValue: '24',
      description: 'Episode interval in source hours, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Privilege change of the first episode',
      json: String.raw`{"@timestamp": "2026-09-27T00:47:43+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "user_privilege_changed", "category": ["iam"], "dataset": "eltex.esr.syslog", "kind": "event", "module": "eltex", "original": "\u003c134\u003e1 2026-09-27T00:47:43+00:00 esr-edge-01 user - - - 16185: %USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14", "outcome": "success", "type": ["change"]}, "message": "%USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14", "log": {"level": "info", "syslog": {"priority": 134, "facility": {"code": 16}, "severity": {"code": 6}, "appname": "user", "version": "1"}}, "observer": {"hostname": "esr-edge-01", "ip": ["10.50.0.1"], "name": "esr-edge-01", "product": "ESR", "type": "router", "vendor": "Eltex"}, "eltex": {"esr": {"group": "USER", "mnemonic": "INFO", "severity_code": "I", "sequence_number": 16185, "details": {"privilege": {"new": 14, "old": 1}}}}, "user": {"target": {"name": "svc_remote_001"}}, "related": {"user": ["svc_remote_001"]}}`,
    },
  ],
};
