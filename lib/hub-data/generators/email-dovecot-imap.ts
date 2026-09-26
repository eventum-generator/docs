/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailDovecotImap: GeneratorMeta = {
  slug: 'email-dovecot-imap',
  displayName: 'Dovecot IMAP / POP3',
  category: 'email',
  description:
    'Dovecot 2.3.20 login-process records with ordinary IMAP/POP3 activity and recurring failure-to-success protocol-switch episodes.',
  dataSource: 'Dovecot 2.3.20 login-process text in selected syslog envelope',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Fresh connection session ID for every record',
    'IMAP failures and POP3 successes also in background',
    'Alternating six-record episodes about hourly',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed IMAP connections precede an IMAP success and POP3 success for one mailbox and IP. After 360 routine records, the six-record episode repeats with alternating actor pairs; each connection has a fresh session ID.',
  generatorId: 'dovecot-imap',
  eventTypes: [
    {
      id: 'imap-login-success',
      description: 'Successful IMAP login',
      frequency: '~82% background',
      category: 'authentication',
    },
    {
      id: 'imap-login-failure',
      description: 'Failed IMAP authentication and closed connection',
      frequency: '~6% background; also episodes',
      category: 'authentication',
    },
    {
      id: 'pop3-login-success',
      description: 'Successful POP3 login',
      frequency: '~12% background; also episodes',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'The selected 2.3 profile uses native login field order and comma joining of nonempty fields.',
    'TLS proves a secure connection but does not establish a listener port; failures have no mpid.',
    'Twenty ordinary mailboxes and both episode pairs share the background; login records do not prove mailbox reads.',
    'BLOCKED_RAW_EVIDENCE: exact 2.3.20 TLS failure with a two-second duration and POP3 success captures are missing; the UTC syslog envelope is deployment-specific.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit recurring six-record episodes',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '360',
      description: 'Routine records between episode starts',
    },
    {
      name: 'host_name',
      defaultValue: 'mail01.corp.example',
      description: 'Hostname in the chosen syslog envelope',
    },
    {
      name: 'local_ip',
      defaultValue: '10.20.0.20',
      description: 'Dovecot listener IP (`lip`)',
    },
    {
      name: 'mail_domain',
      defaultValue: 'corp.example',
      description: 'Domain for routine mailbox names',
    },
    {
      name: 'target_user',
      defaultValue: 'accounts@corp.example',
      description: 'First episode mailbox, also present in background',
    },
    {
      name: 'alternate_target_user',
      defaultValue: 'finance@corp.example',
      description: 'Second episode mailbox, also present in background',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description: 'First episode client IP, also present in background',
    },
    {
      name: 'alternate_client_ip',
      defaultValue: '192.0.2.92',
      description: 'Second episode client IP, also present in background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Dovecot IMAP / POP3 event from finite generator output',
      json: String.raw`{"@timestamp": "2026-09-24T22:00:00+00:00", "destination": {"ip": "10.20.0.20"}, "dovecot": {"auth_attempts": 1, "auth_duration_seconds": 2, "disconnect_reason": "Connection closed", "login_result": "failure", "method": "PLAIN", "protocol": "imap", "session": "6X0R1BBdjnlN4yRN", "tls": true}, "ecs": {"version": "8.17.0"}, "event": {"action": "login-failure", "category": ["authentication"], "kind": "event", "original": "Sep 24 22:00:00 mail01.corp.example dovecot: imap-login: Disconnected: Connection closed (auth failed, 1 attempts in 2 secs): user=\u003caccounts@corp.example\u003e, method=PLAIN, rip=192.0.2.91, lip=10.20.0.20, TLS, session=\u003c6X0R1BBdjnlN4yRN\u003e", "outcome": "failure", "type": ["denied"]}, "host": {"ip": ["10.20.0.20"], "name": "mail01.corp.example"}, "related": {"ip": ["192.0.2.91", "10.20.0.20"], "user": ["accounts@corp.example"]}, "service": {"name": "dovecot", "type": "imap"}, "source": {"ip": "192.0.2.91"}, "user": {"name": "accounts@corp.example"}}`,
    },
  ],
};
