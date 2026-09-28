/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailDovecotImap: GeneratorMeta = {
  slug: 'email-dovecot-imap',
  displayName: 'Dovecot IMAP / POP3 Login',
  category: 'email',
  description:
    'Dovecot 2.3.20 IMAP and POP3 login-process messages from the clients of 56 mailboxes and from internet noise, as native-style syslog lines in event.original inside ECS JSON. Models login outcomes, not IMAP commands or mail reads. Recurring episodes show four IMAP failures of one mailbox from one public address, then an IMAP login and a POP3 login for the same mailbox and address.',
  dataSource:
    'Dovecot 2.3.20 imap-login and pop3-login messages, UTC RFC 3164-style syslog envelope',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native-style login line in event.original',
    'Independent clients of 56 mailboxes plus internet noise',
    'Recurring four-failure, IMAP, POP3 login chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One mailbox fails IMAP authentication four times from one public address, a few seconds to about a minute apart, then the next IMAP login from that address succeeds and a POP3 login for the same mailbox and address follows within seconds to minutes (41-227 s per episode measured). The first episode starts within the first anomaly_interval_hours (at most 24 hours) of the run, at a time of day drawn from the UTC daytime load curve of the background; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours. Missed episodes are never caught up; at the default, a 7-day run had episodes 21.3-25.8 hours apart, starting between 08:55 and 15:42 UTC, while at intervals of 8 hours or less episodes also fall into quiet hours. Each episode uses a different mailbox and public address from the previous one. Every step also occurs in ordinary traffic; only an ordinary POP3 login that would complete four failures, an IMAP success and a POP3 success for one mailbox and address within 15 minutes of the first failure is left out, and the client keeps its schedule.',
  generatorId: 'dovecot-imap',
  eventTypes: [
    {
      id: 'imap-login: Login',
      description: 'Successful IMAP login',
      frequency: '75.1% measured share',
      category: 'authentication',
    },
    {
      id: 'imap-login: Disconnected',
      description: 'Connection closed after failed IMAP authentication',
      frequency: '14.0% measured share',
      category: 'authentication',
    },
    {
      id: 'pop3-login: Login',
      description: 'Successful POP3 login',
      frequency: '10.9% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Fifty personal and six shared mailboxes use office workstations, laptops and phones. Each client reconnects at its own random interval, more often during UTC daytime; laptops move between the office, the VPN and a home public address, phones use roaming public addresses, and some clients poll an IMAP and a POP3 account together. No activity runs on a fixed period, rotation or script.',
    'Rejected logins come from typos (more often at the first start after a night), transient rejections, stale clients after a password change, new clients and webmail users, plus internet noise: single guesses, password sprays over real and non-existent mailboxes, and brute-force runs. Measured background volume is about 220 records per hour, with about 31% of POP3 logins from public addresses; rates are synthetic workload settings, not measured Dovecot rates.',
    'Every chain step also occurs in ordinary traffic: per 7 days of background, 55-65 cases of four failures followed by an IMAP success within 15 minutes, 21-27 cases of failure, IMAP success and POP3 success from one mailbox and address, and 1,473-1,539 IMAP-then-POP3 pairs within 10 minutes. Only the full order within 15 minutes of the first failure separates the modes, and the login records do not prove mailbox access or data extraction.',
    'Field order and comma joining follow the Dovecot 2.3 settings and first-hand 2.3.20 IMAP captures. Failures carry no mpid, and TLS does not reveal the listener port, so no destination.port is emitted. The 16-character session ID is a selected profile, and failure durations are modeled on the default auth_failure_delay.',
    'BLOCKED_RAW_EVIDENCE: no complete 2.3.20 raw capture was found for a TLS failure with the modeled durations or for POP3 success. Failures are IMAP only, timestamps have one-second resolution with at most one record per second, and the UTC syslog envelope is deployment-specific.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring episodes; false emits only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 3 to 8,760',
    },
    {
      name: 'host_name',
      defaultValue: 'mail01.corp.example',
      description: 'Hostname in the syslog envelope',
    },
    {
      name: 'local_ip',
      defaultValue: '10.20.0.20',
      description: 'Dovecot listener IP (`lip`)',
    },
    {
      name: 'webmail_ip',
      defaultValue: '10.20.0.30',
      description: 'Client IP of the webmail server',
    },
    {
      name: 'mail_domain',
      defaultValue: 'corp.example',
      description: 'Domain of all mailbox names',
    },
  ],
  sampleOutputs: [
    {
      title: 'First IMAP failure of an episode',
      json: String.raw`{"@timestamp": "2026-09-25T15:42:14+00:00", "destination": {"ip": "10.20.0.20"}, "dovecot": {"auth_attempts": 1, "auth_duration_seconds": 2, "disconnect_reason": "Connection closed", "login_result": "failure", "method": "PLAIN", "protocol": "imap", "session": "jAN6fEUhVw6LlkAX", "tls": true}, "ecs": {"version": "8.17.0"}, "event": {"action": "login-failure", "category": ["authentication"], "kind": "event", "original": "Sep 25 15:42:14 mail01.corp.example dovecot: imap-login: Disconnected: Connection closed (auth failed, 1 attempts in 2 secs): user=\u003caaron.walsh@corp.example\u003e, method=PLAIN, rip=203.0.113.218, lip=10.20.0.20, TLS, session=\u003cjAN6fEUhVw6LlkAX\u003e", "outcome": "failure", "type": ["denied"]}, "host": {"ip": ["10.20.0.20"], "name": "mail01.corp.example"}, "related": {"ip": ["203.0.113.218", "10.20.0.20"], "user": ["aaron.walsh@corp.example"]}, "service": {"name": "dovecot", "type": "imap"}, "source": {"ip": "203.0.113.218"}, "user": {"name": "aaron.walsh@corp.example"}}`,
    },
  ],
};
