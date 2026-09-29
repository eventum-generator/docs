/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailPostfix: GeneratorMeta = {
  slug: 'email-postfix',
  displayName: 'Postfix SMTP Submission Syslog',
  category: 'email',
  description:
    'Postfix 3.8.3+ submission-relay messages from smtpd, cleanup, qmgr and smtp as parsed ECS JSON with the native syslog line in event.original, for testing mail-server authentication and outbound-mail detections. About 54,700 records and 10,100 messages a day from 150 staff users on a UTC working-day curve and eight application accounts around the clock; every accepted submission is followed from queue creation to removal. Recurring episodes show one staff user failing SASL LOGIN three times, then submitting a message for five external recipients.',
  dataSource:
    'Postfix 3.8.3+ submission-relay mail log (smtpd, cleanup, qmgr, smtp)',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'email-postfix',
  highlights: [
    'Native Postfix 3.8.3+ syslog line in event.original',
    '150 staff users and 8 application accounts, about 54,700 records a day',
    'Recurring three-failure SASL LOGIN to five-recipient mail chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One staff user fails SASL LOGIN three times from the user's own workstation or laptop address, a few seconds to about a minute apart, within one smtpd process. The next attempt succeeds and submits a message for five external recipients, which is delivered and removed like any other. The failures and the queue creation span about half a minute to 100 seconds and link by user.name, source.ip, host.name and process.pid, the rest of the lifecycle by postfix.queue_id. The first episode starts within the first anomaly_interval_hours (at most 24 hours) of the run, at a time drawn towards busy staff hours; each next episode is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours. Missed episodes are never caught up. At the default 24 hours episodes start about 21 to 27 hours apart, mostly between 08:00 and 16:00 UTC; at intervals of 8 hours or less some start at night. Each episode uses a different user from the previous one, drawn from the busier half of the staff, who keeps sending ordinary mail before and after it. Every record type of the chain also occurs in ordinary traffic, including three failures in a row about 12-14 times a day; ordinary traffic never has three SASL failures followed by an accepted submission for one user and address within 2 minutes of the first failure.",
  eventTypes: [
    {
      id: 'postfix/smtpd client= sasl_username=',
      description:
        'Queue ID assigned to an authenticated submission (client, sasl_method=LOGIN, sasl_username)',
      frequency: '18.5% of records',
      category: 'email',
    },
    {
      id: 'postfix/cleanup message-id=',
      description: 'Message-ID of the queued message',
      frequency: '18.5% of records',
      category: 'email',
    },
    {
      id: 'postfix/qmgr queue active',
      description: 'Sender, size and recipient count on queue activation',
      frequency: '18.5% of records',
      category: 'email',
    },
    {
      id: 'postfix/smtp status=sent',
      description:
        'Delivery of one recipient to an external relay with delay, delays and dsn=2.0.0',
      frequency: '25.3% of records, one per recipient',
      category: 'email',
    },
    {
      id: 'postfix/qmgr removed',
      description: 'Queue entry removed after all deliveries',
      frequency: '18.5% of records',
      category: 'email',
    },
    {
      id: 'postfix/smtpd SASL LOGIN failed',
      description: 'SASL LOGIN authentication failed, no queue ID',
      frequency: '0.4% of records',
      category: 'authentication',
    },
    {
      id: 'postfix/smtpd NOQUEUE reject',
      description: 'RCPT rejected with User unknown before queueing',
      frequency: '0.4% of records',
      category: 'email',
    },
  ],
  realismFeatures: [
    'Selected profile: SASL LOGIN on the submission service, short queue IDs (enable_long_queue_ids=no), one recipient per SMTP delivery (smtp_destination_recipient_limit=1), header rewriting for authenticated clients, show_user_unknown_table_name=no and mail-log timestamps in UTC.',
    'About 54,700 records a day (±3% from day to day) on a UTC hour-of-day curve: 0.39-0.42 records per second at night rising to 1.02-1.07 between 11:00 and 14:00, when staff send 67% of the messages. The curve repeats every day with no weekly cycle, so weekends look like weekdays.',
    'The 150 staff users submit about 4,500 messages a day from their own workstation (ws-NNNN.corp.example) or a VPN laptop without reverse DNS (unknown). Each user has a steady share of about 10 to 60 messages a day and sends mail every day; a message goes to one to five external recipients (one 68%, two 16%, three 8%, four and five 4% each).',
    'About 3% of staff submissions start with a mistyped or outdated password: one failure is more common than two, two more common than three, retries follow a median 14 seconds later within the same smtpd process, and after three failures the user gives up. About 4% address an unknown local mailbox and are rejected before queueing; most users resend about a minute later. About 2% of all SASL attempts fail.',
    'Eight application service accounts send notifications, reports and job output around the clock, about 5,600 messages a day; they rarely fail authentication (once, then succeed a few seconds later) and rarely address an unknown mailbox.',
    'Message sizes are right-skewed, up to the 10 MB default message_size_limit for staff mail with attachments. Each recipient is delivered by its own smtp process to one of three relays. qmgr keeps one process ID; smtpd, cleanup and smtp processes serve several jobs, exit after 100 seconds idle or 100 jobs and are replaced with increasing process IDs, so process IDs repeat across unrelated clients.',
    'Records of one message are seconds apart instead of milliseconds, so printed delay and delays show a median total of about 5 seconds at busy hours and 9 at night, where a real relay usually delivers in under a second. Timestamps have one-second resolution, and queue IDs have a random inode part.',
    'A selected successful-delivery path, not a complete Postfix mail log: no connection, disconnect or TLS records, postscreen, local or LMTP delivery, bounces, deferred retries or conn_use=, and all deliveries go to external relays. The failure reason is the Cyrus SASL wording. No complete raw Postfix 3.8.3+ log of the chain was found, so it joins documented line formats. Each episode adds one run of three failures and one five-recipient message to the ordinary counts.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring anomaly episodes to the background; false keeps only background activity',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 1 to 8,760',
    },
    {
      name: 'mail_host',
      defaultValue: 'mail-01.corp.example',
      description:
        'Postfix hostname in the syslog line and generated Message-IDs',
    },
    {
      name: 'mail_ip',
      defaultValue: '10.80.0.5',
      description: 'Postfix host IP',
    },
  ],
  sampleOutputs: [
    {
      title: 'Accepted submission ending an episode',
      json: String.raw`{"@timestamp": "2026-09-01T11:07:59+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "queue-created", "category": ["email"], "dataset": "postfix.syslog", "kind": "event", "original": "Sep  1 11:07:59 mail-01.corp.example postfix/smtpd[59392]: 8E5BDF3BD5: client=ws-0324.corp.example[10.80.21.78], sasl_method=LOGIN, sasl_username=alex.hansen@corp.example", "outcome": "success", "type": ["info"]}, "host": {"ip": ["10.80.0.5"], "name": "mail-01.corp.example"}, "log": {"level": "info", "syslog": {"appname": "postfix/smtpd"}}, "message": "8E5BDF3BD5: client=ws-0324.corp.example[10.80.21.78], sasl_method=LOGIN, sasl_username=alex.hansen@corp.example", "observer": {"hostname": "mail-01.corp.example", "ip": "10.80.0.5", "product": "Postfix", "type": "mail", "vendor": "Postfix"}, "postfix": {"queue_id": "8E5BDF3BD5", "sasl": {"username": "alex.hansen@corp.example"}, "service": "smtpd"}, "process": {"name": "postfix/smtpd", "pid": 59392}, "related": {"hosts": ["mail-01.corp.example"], "ip": ["10.80.21.78"], "user": ["alex.hansen@corp.example"]}, "source": {"ip": "10.80.21.78"}, "tags": ["postfix", "preserve_original_event"], "user": {"name": "alex.hansen@corp.example"}}`,
    },
  ],
};
