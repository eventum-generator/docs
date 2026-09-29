/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailCiscoSecureEmailGateway: GeneratorMeta = {
  slug: 'email-cisco-secure-email-gateway',
  displayName: 'Cisco Secure Email Gateway Mail Logs',
  category: 'email',
  description:
    'Cisco Secure Email Gateway (formerly ESA, AsyncOS 16.x) text mail_logs pushed over syslog from a virtual gateway with one Management interface and one public listener: internet mail for contoso.example users and outbound mail relayed from two internal Exchange hosts, with the raw syslog line in event.original and the fields the Elastic cisco_secure_email_gateway integration extracts from it. About 95,000 lines a day follow the working day of 100 internal users in UTC. Recurring episodes show one internal user sending three large messages to their own freemail mailbox within 40 minutes, a likely exfiltration.',
  dataSource:
    'Cisco Secure Email Gateway AsyncOS 16.x text mail_logs subscription over syslog, virtual appliance with one Management interface',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 33,
  templateCount: 1,
  highlights: [
    'Raw mail_logs syslog line in event.original',
    'About 95,000 lines a day from 100 users on their own working hours',
    "Recurring chain of three large messages to the sender's own freemail mailbox",
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One internal user sends three outbound messages of at least large_message_bytes (default 8 MB) each within 40 minutes, each to the user's own freemail mailbox (the user's local part followed by two digits) and each delivered (New SMTP DCID, Delivery start, Message done, a 2.x.0 response, Message finished). The ready line carries the sender and size and joins by MID to the To: line and the Message done line. The first episode starts within min(anomaly_interval_hours, 24 h) of the first record, at an hour drawn from the office mail curve. Each later episode is due one interval after the actual start of the previous one and starts within a window of min(interval / 4, 6 h) centred on that due time, leaning towards busy office hours; missed intervals are not caught up. At the default 24 h the first episode falls about 6-16 h after the start of the output and later ones 21-27 h apart; at a 6 h interval they are about 5.3-6.7 h apart. The episode user is one of the 22 users who mail their personal mailbox several times a day and changes between consecutive episodes, as does the mailbox; message sizes, one to three attachments, attachment names and subjects vary per episode, and gaps between the messages follow those of ordinary series (median about 165 s). Every element occurs in ordinary traffic of both modes; three large messages to the own mailbox within 46 minutes occur only in episodes.",
  generatorId: 'seg',
  eventTypes: [
    {
      id: 'New SMTP ICID',
      description:
        'New SMTP ICID ... address ... reverse dns host ... verified',
      frequency: '4.69% of lines',
      category: 'connection',
    },
    {
      id: 'ICID SG',
      description: 'ICID ... ACCEPT SG / RELAY SG / REJECT SG ... SBRS',
      frequency: '4.69% of lines',
      category: 'connection policy',
    },
    {
      id: 'ICID close',
      description: 'ICID ... close',
      frequency: '4.69% of lines',
      category: 'connection',
    },
    {
      id: 'Start MID',
      description: 'Start MID ... ICID',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'MID From',
      description: 'MID ... ICID ... From:',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'MID RID To',
      description: 'MID ... ICID ... RID n To:',
      frequency: '4.91% of lines',
      category: 'message',
    },
    {
      id: 'MID Message-ID',
      description: 'MID ... Message-ID',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'MID Subject',
      description: 'MID ... Subject',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'MID ready',
      description: 'MID ... ready <bytes> bytes from',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'MID per-recipient policy',
      description:
        'MID ... matched all recipients for per-recipient policy DEFAULT',
      frequency: '4.23% of lines',
      category: 'policy',
    },
    {
      id: 'MID SPF',
      description: 'MID ... SPF: mailfrom identity ... Pass',
      frequency: '2.18% of lines',
      category: 'authentication',
    },
    {
      id: 'MID DKIM',
      description: 'MID ... DKIM: pass signature verified',
      frequency: '2.18% of lines',
      category: 'authentication',
    },
    {
      id: 'MID DMARC',
      description: 'MID ... DMARC: ... DMARC pass',
      frequency: '2.18% of lines',
      category: 'authentication',
    },
    {
      id: 'MID CASE interim',
      description: 'MID ... interim verdict using engine: CASE spam ...',
      frequency: '2.41% of lines',
      category: 'anti-spam',
    },
    {
      id: 'MID CASE final',
      description: 'MID ... using engine: CASE spam ... / GRAYMAIL positive',
      frequency: '2.90% of lines',
      category: 'anti-spam',
    },
    {
      id: 'MID AV interim',
      description: 'MID ... interim AV verdict using Sophos CLEAN',
      frequency: '4.23% of lines',
      category: 'anti-virus',
    },
    {
      id: 'MID antivirus negative',
      description: 'MID ... antivirus negative',
      frequency: '4.23% of lines',
      category: 'anti-virus',
    },
    {
      id: 'MID antivirus positive',
      description: 'MID ... antivirus positive',
      frequency: '<0.01% of lines',
      category: 'anti-virus',
    },
    {
      id: 'Message aborted',
      description: 'Message aborted MID ... Dropped by antivirus',
      frequency: '<0.01% of lines',
      category: 'anti-virus',
    },
    {
      id: 'MID attachment',
      description: 'MID ... attachment',
      frequency: '1.87% of lines',
      category: 'content',
    },
    {
      id: 'MID Outbreak Filters',
      description: 'MID ... Outbreak Filters: verdict negative',
      frequency: '2.40% of lines',
      category: 'outbreak filters',
    },
    {
      id: 'MID queued',
      description: 'MID ... queued for delivery',
      frequency: '4.23% of lines',
      category: 'message',
    },
    {
      id: 'EUQ Tagging',
      description: 'EUQ: Tagging MID ... for quarantine',
      frequency: '0.23% of lines',
      category: 'quarantine',
    },
    {
      id: 'RPC Delivery start',
      description: 'RPC Delivery start RCID ... MID ...',
      frequency: '0.23% of lines',
      category: 'quarantine',
    },
    {
      id: 'EUQ Quarantined',
      description: 'EUQ: Quarantined MID',
      frequency: '0.23% of lines',
      category: 'quarantine',
    },
    {
      id: 'RPC Message done',
      description: 'RPC Message done RCID ... MID',
      frequency: '0.23% of lines',
      category: 'quarantine',
    },
    {
      id: 'New SMTP DCID',
      description: 'New SMTP DCID ... interface ... address',
      frequency: '4.35% of lines',
      category: 'delivery',
    },
    {
      id: 'Delivery start',
      description: 'Delivery start DCID ... MID ... to RID [...]',
      frequency: '4.35% of lines',
      category: 'delivery',
    },
    {
      id: 'Message done',
      description: 'Message done DCID ... MID ... to RID [...]',
      frequency: '4.31% of lines',
      category: 'delivery',
    },
    {
      id: 'MID RID Response',
      description: "MID ... RID [...] Response '...'",
      frequency: '4.31% of lines',
      category: 'delivery',
    },
    {
      id: 'Bounced',
      description: 'Bounced: DCID ... MID ... to RID n - 5.1.0 - ...',
      frequency: '0.04% of lines',
      category: 'delivery',
    },
    {
      id: 'DCID close',
      description: 'DCID ... close',
      frequency: '4.35% of lines',
      category: 'delivery',
    },
    {
      id: 'Message finished',
      description: 'Message finished MID ... done',
      frequency: '4.23% of lines',
      category: 'message',
    },
  ],
  realismFeatures: [
    'About 95,000 lines a day in UTC, with about 1,740 outbound and 2,300 inbound messages and 435 rejected connections. Total volume follows the working day of internal users: about 2,050 lines an hour at night, rising from 06:00 to about 6,500 an hour between 09:00 and 15:00, then falling after 16:00 to a tail until 19:00; internet mail is higher between 06:00 and 17:00 and continues at night. Users, their weights and working hours are fixed, mail volume per user changes from day to day only by random variation, and weekends look like weekdays.',
    '100 internal users each have an activity weight, their own working hours in UTC and a personal mailbox at one of the freemail providers. Outbound mail comes from users in proportion to their weight, mostly within their own working hours, as single messages and series of 2-5 messages to the same recipients; about 2% of recipients are mistyped and hard-bounce. Inbound mail brings partner and freemail correspondents, newsletters marked as graymail, spam quarantined by CASE (about 210 messages a day), low-reputation connections rejected by the blocked-list sender group and a few virus drops a day. Rates and shares are synthetic, not vendor-measured.',
    'Every user now and then mails their own personal mailbox, singly or in quick series: about 165 such messages a day, about 23 of them 8 MB or more. A group of 22 users does this one to six times a day, the others a few times a week. Per 4 days, two large messages to the own mailbox within 40 minutes occur 5-12 times, and three or more large messages from one sender to other recipients within 40 minutes 64-100 times. Three large messages to the own mailbox within 46 minutes never occur outside episodes, a slightly wider empty margin than a real gateway would show.',
    'With anomaly_mode true each episode adds its own three large messages to a personal mailbox, so counts of large personal mail are about three per episode higher than in background only, while the total line count is the same in both modes; at intervals of a few hours closely spaced large messages per sender become noticeably more frequent. The gateway logs no content beyond attachment names, so the chain shows volume and destination, not intent.',
    "Each record keeps the raw syslog line and the fields the integration's grok patterns extract: MID, ICID, DCID, RID, sender and recipient addresses, read bytes, connection and message status, and scanning engine verdicts. Structured fields are what Elastic integration 1.29.3 extracts; its connection pattern matches only the Management interface, hence the single interface. Sender-group, antivirus, attachment, quarantine and bounce lines keep only email.message_id or the message text, as the integration leaves them, and Elastic agent fields are omitted.",
    'No complete raw capture of an AsyncOS 16.x appliance was available: line grammar follows the AsyncOS 16.5 Logging chapter examples and the Elastic integration fixtures, the RELAY SG ... SBRS rfc1918 line follows Cisco TechNote 214631, and the REJECT SG BLOCKED_LIST line applies the documented ACCEPT SG grammar to the default blocked sender group.',
    'Syslog timestamps have one-second resolution and no year, @timestamp is UTC with .000 milliseconds, and the priority is always <166> (local4.info), as in the integration fixtures. Lines the appliance writes at the same instant are spread over consecutive seconds: connection and sender-group lines share a second in 42% of connections and are at most 6 s apart in 99%. A message takes a median 28 s from Start MID to Message finished (10% under 13 s, 10% over 57 s), longer than on a real gateway, and longer at night (about 45 s) than by day (about 23 s).',
    'Not covered: TLS, SMTP authentication, per-connection message reuse, delayed (soft-bounce) delivery, DLP, AMP, URL filtering, message filters, Subject with double quotes and log levels other than Info. SPF, DKIM and DMARC pass for legitimate inbound senders and are not logged for spam senders.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring large-mail episode; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 1 to 8,760',
    },
    {
      name: 'host_name',
      defaultValue: 'esa-01.contoso.example',
      description: 'Gateway host name in the syslog header',
    },
    {
      name: 'interface_ip',
      defaultValue: '10.20.30.25',
      description: 'Address of the Management interface',
    },
    {
      name: 'internal_domain',
      defaultValue: 'contoso.example',
      description: 'Domain of internal users',
    },
    {
      name: 'relay_hosts',
      defaultValue:
        '[exch-01.contoso.example 10.20.10.11, exch-02.contoso.example 10.20.10.12]',
      description:
        'Internal Exchange hosts that relay outbound mail and receive inbound mail; users are assigned to them in turn',
    },
    {
      name: 'large_message_bytes',
      defaultValue: '8000000',
      description:
        "Size threshold of the episode messages; background never has three such messages to the sender's own mailbox within 40 minutes",
    },
    {
      name: 'max_message_bytes',
      defaultValue: '20000000',
      description: 'Largest message the listener accepts',
    },
    {
      name: 'partner_domains',
      defaultValue: '8 domains (fabrikam.test ... wingtiptoys.test)',
      description:
        'Partner mail domains with their MX address and base reputation (SBRS)',
    },
    {
      name: 'freemail_domains',
      defaultValue:
        '[mail.example.com, webmail.example.net, inbox.example.org]',
      description:
        "Public mailbox providers; users' personal mailboxes are spread over them in turn",
    },
    {
      name: 'newsletter_senders',
      defaultValue:
        '[news@digest.example.com, noreply@events.example.net, offers@shop.example.org, updates@saas.example.com]',
      description: 'Bulk senders marked as graymail',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ready line of the first episode message',
      json: String.raw`{"@timestamp": "2026-09-01T11:55:22.000Z", "cisco_secure_email_gateway": {"log": {"category": {"name": "mail_logs"}, "host": "esa-01.contoso.example", "message": "MID 74652742 ready 9721387 bytes from \u003cf.sergeeva@contoso.example\u003e", "read_bytes": 9721387}}, "ecs": {"version": "8.17.0"}, "email": {"from": {"address": ["f.sergeeva@contoso.example"]}, "message_id": "74652742"}, "event": {"dataset": "cisco_secure_email_gateway.log", "kind": "event", "original": "\u003c166\u003eSep  1 11:55:22 esa-01.contoso.example mail_logs: Info: MID 74652742 ready 9721387 bytes from \u003cf.sergeeva@contoso.example\u003e", "timezone": "UTC"}, "log": {"level": "info", "syslog": {"priority": 166}}, "tags": ["preserve_original_event"]}`,
    },
  ],
};
