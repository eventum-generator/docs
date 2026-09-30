/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailDovecotImap: GeneratorMeta = {
  slug: 'email-dovecot-imap',
  displayName: 'Dovecot IMAP / POP3 Login',
  category: 'email',
  description:
    'Dovecot 2.3.20 IMAP and POP3 login-process messages from the mail clients of 275 mailboxes, webmail users and internet noise, as native-style syslog lines in event.original inside ECS JSON. About 23,600 logins a day on a UTC hour-of-day curve. Models login outcomes, not IMAP commands or mail reads. Recurring episodes show four IMAP failures of one mailbox from one public address, then an IMAP login and a POP3 login for the same mailbox and address.',
  dataSource:
    'Dovecot 2.3.20 imap-login and pop3-login messages, UTC RFC 3164-style syslog envelope',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native-style login line in event.original',
    'About 23,600 logins a day from 275 mailboxes plus internet noise',
    'Recurring four-failure, IMAP, POP3 login chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One mailbox fails IMAP authentication four times from one public address, a few seconds to about a minute apart; then the next IMAP login from that address succeeds, and a POP3 login for the same mailbox and address follows within seconds to minutes. An episode lasts about one to three minutes, and each connection has its own session ID. The first episode starts within the first anomaly_interval_hours (at most 24 hours) of the run, at a time of day drawn from the UTC load curve, but not in about the first hour and a half; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours. Missed episodes are never caught up. At the default, successive episodes start about 21 to 27 hours apart, near the time of day of the first one; at intervals of 8 hours or less the window covers most of the clock. Each episode uses a different mailbox and address from the previous one: a mailbox whose own clients have already logged in over IMAP and POP3 from public addresses, and a carrier address that its phone used earlier in the run, shared with other subscribers. Every part of the chain also occurs in ordinary traffic, but ordinary traffic never completes four failures, an IMAP success and a POP3 success for one mailbox and address within 15 minutes of the first failure.',
  generatorId: 'dovecot-imap',
  eventTypes: [
    {
      id: 'imap-login: Login',
      description: 'Successful IMAP login',
      frequency: '83.4% share over four days',
      category: 'authentication, start',
    },
    {
      id: 'pop3-login: Login',
      description: 'Successful POP3 login',
      frequency: '10.7% share over four days',
      category: 'authentication, start',
    },
    {
      id: 'imap-login: Disconnected (auth failed)',
      description: 'Connection closed after failed IMAP authentication',
      frequency: '5.9% share over four days',
      category: 'authentication, denied',
    },
  ],
  realismFeatures: [
    '250 personal and 25 shared mailboxes use office workstations, laptops and phones, each client reconnecting on its own schedule every few minutes to about an hour. Laptops connect from the office, the VPN or one of two home public addresses; phones use a few carrier NAT addresses shared with other subscribers and usually return to each within a day. Some phones use POP3, and some workstations and laptops poll an IMAP and a POP3 account together, so an IMAP login is followed by a POP3 login from the same address within seconds to minutes. Which mailbox uses which clients and addresses is fixed per mail_domain; all activity on top of that differs in every run.',
    'About 23,600 logins a day (±3% from day to day) at random times, following a UTC hour-of-day curve: a round-the-clock floor plus a working-day curve peaking at 12:00-13:00, from 0.13-0.15 logins/s at night to 0.51-0.52 logins/s at 11:00-14:00 UTC. Internet scanning is flat around the clock. About 30% of POP3 logins and about 40% of all logins come from public addresses. Rates are synthetic workload settings, not measured Dovecot rates.',
    'Rejected logins come from mistyped passwords (one to five failures before a success, more often at the first start after a night), transient rejections, IMAP clients failing with backoff after a password change until updated, new clients and webmail users, plus internet noise: single guesses, password sprays over real and non-existent mailboxes, and brute-force runs from recurring hostile hosts, one-off hosts or phone carrier ranges. About a third of failures come from hostile hosts. Retries follow a failure after a median 15 seconds in working hours and 21 seconds at night.',
    'Every chain part also occurs in ordinary traffic of both modes: four failures followed by an IMAP success within 15 minutes about 35 times a day, failure, IMAP success and POP3 success from one mailbox and address about 12 a day, three failures then IMAP and POP3 success about 3 a day, and IMAP-then-POP3 pairs within 10 minutes about 900 a day. Each episode adds about one to each of these counts. Only the full order within 15 minutes of the first failure separates the modes, and the login records do not prove mailbox access or data extraction.',
    'Field order and comma joining follow the Dovecot 2.3 settings and first-hand 2.3.20 IMAP captures. Failures carry no mpid, and TLS does not distinguish implicit TLS from STARTTLS, so no destination.port is emitted. The 16-character session ID is a selected profile, and failure durations are modeled on the default auth_failure_delay.',
    'No complete 2.3.20 raw capture was found for a TLS failure with the modeled durations or for a POP3 success, so their byte-for-byte fidelity is unconfirmed. Failures are IMAP only; timestamps have one-second resolution and several records can share one second; the hour curve repeats daily with no weekly cycle; the UTC syslog envelope is deployment-specific. IMAP commands, POP3 retrievals, mailbox changes, logouts, LMTP delivery and auth-worker diagnostics are not generated.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add the recurring anomaly episodes to the background',
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
      json: String.raw`{"@timestamp": "2026-09-01T12:48:04+00:00", "destination": {"ip": "10.20.0.20"}, "dovecot": {"auth_attempts": 1, "auth_duration_seconds": 2, "disconnect_reason": "Connection closed", "login_result": "failure", "method": "PLAIN", "protocol": "imap", "session": "Clr8Vo8JzJzoZUBv", "tls": true}, "ecs": {"version": "8.17.0"}, "event": {"action": "login-failure", "category": ["authentication"], "kind": "event", "original": "Sep  1 12:48:04 mail01.corp.example dovecot: imap-login: Disconnected: Connection closed (auth failed, 1 attempts in 2 secs): user=\u003cmateo.wojcik@corp.example\u003e, method=PLAIN, rip=198.51.100.44, lip=10.20.0.20, TLS, session=\u003cClr8Vo8JzJzoZUBv\u003e", "outcome": "failure", "type": ["denied"]}, "host": {"ip": ["10.20.0.20"], "name": "mail01.corp.example"}, "related": {"ip": ["198.51.100.44", "10.20.0.20"], "user": ["mateo.wojcik@corp.example"]}, "service": {"name": "dovecot", "type": "imap"}, "source": {"ip": "198.51.100.44"}, "user": {"name": "mateo.wojcik@corp.example"}}`,
    },
  ],
};
