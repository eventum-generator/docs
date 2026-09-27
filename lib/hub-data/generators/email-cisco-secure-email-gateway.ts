/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailCiscoSecureEmailGateway: GeneratorMeta = {
  slug: 'email-cisco-secure-email-gateway',
  displayName: 'Cisco Secure Email Gateway Mail Logs',
  category: 'email',
  description:
    'Cisco Secure Email Gateway (formerly ESA, AsyncOS 16.x) text mail_logs pushed over syslog from a virtual gateway with one public listener: internet mail for contoso.example users and outbound mail relayed from two internal Exchange hosts, with the raw syslog line in event.original and the fields the Elastic cisco_secure_email_gateway integration extracts from it. Recurring episodes show one internal user sending three to five large messages to their own freemail mailbox, a likely exfiltration.',
  dataSource:
    'Cisco Secure Email Gateway AsyncOS 16.x text mail_logs subscription over syslog, virtual appliance with one Management interface',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 33,
  templateCount: 1,
  highlights: [
    'Raw mail_logs syslog line in event.original',
    'Linked ICID, MID, RID and DCID message lifecycles',
    "Recurring large-mail chain to the sender's own freemail mailbox",
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "The first episode falls due anomaly_interval_hours (default 24, minimum 1) after the capture start; when due it waits an exponential delay (mean 10 minutes) and then begins on an opportunity drawn like background personal mail, so episodes lean towards working hours but can occur at night. The next episode is due one interval after the actual start, and missed intervals are not caught up; measured at the default, the first episode came 24.3 h after start, then gaps of 27.6 h and 26.7 h. One internal user sends three to five delivered outbound messages of at least 8 MB each, the first three within 40 minutes, to their own freemail mailbox (the user's local part plus two digits), linked by MID from the ready line to the To: and Message done lines. User and mailbox change between episodes. Every element occurs in background; only three large messages to their own mailbox within 40 minutes are kept out of it.",
  generatorId: 'seg',
  eventTypes: [
    {
      id: 'New SMTP ICID',
      description:
        'New SMTP ICID ... address ... reverse dns host ... verified',
      frequency: '4.72% measured share',
      category: 'connection',
    },
    {
      id: 'ICID SG',
      description: 'ICID ... ACCEPT SG / RELAY SG / REJECT SG ... SBRS',
      frequency: '4.72% measured share',
      category: 'connection policy',
    },
    {
      id: 'ICID close',
      description: 'ICID ... close',
      frequency: '4.72% measured share',
      category: 'connection',
    },
    {
      id: 'Start MID',
      description: 'Start MID ... ICID',
      frequency: '4.31% measured share',
      category: 'message',
    },
    {
      id: 'MID From',
      description: 'MID ... ICID ... From:',
      frequency: '4.31% measured share',
      category: 'message',
    },
    {
      id: 'MID RID To',
      description: 'MID ... ICID ... RID n To:',
      frequency: '4.99% measured share',
      category: 'message',
    },
    {
      id: 'MID Message-ID',
      description: 'MID ... Message-ID',
      frequency: '4.31% measured share',
      category: 'message',
    },
    {
      id: 'MID Subject',
      description: 'MID ... Subject',
      frequency: '4.31% measured share',
      category: 'message',
    },
    {
      id: 'MID ready',
      description: 'MID ... ready <bytes> bytes from',
      frequency: '4.31% measured share',
      category: 'message',
    },
    {
      id: 'MID per-recipient policy',
      description:
        'MID ... matched all recipients for per-recipient policy DEFAULT',
      frequency: '4.31% measured share',
      category: 'policy',
    },
    {
      id: 'MID SPF',
      description: 'MID ... SPF: mailfrom identity ... Pass',
      frequency: '1.94% measured share',
      category: 'authentication',
    },
    {
      id: 'MID DKIM',
      description: 'MID ... DKIM: pass signature verified',
      frequency: '1.94% measured share',
      category: 'authentication',
    },
    {
      id: 'MID DMARC',
      description: 'MID ... DMARC: ... DMARC pass',
      frequency: '1.94% measured share',
      category: 'authentication',
    },
    {
      id: 'MID CASE interim',
      description: 'MID ... interim verdict using engine: CASE spam ...',
      frequency: '2.18% measured share',
      category: 'anti-spam',
    },
    {
      id: 'MID CASE final',
      description: 'MID ... using engine: CASE spam ... / GRAYMAIL positive',
      frequency: '2.62% measured share',
      category: 'anti-spam',
    },
    {
      id: 'MID AV interim',
      description: 'MID ... interim AV verdict using Sophos CLEAN',
      frequency: '4.28% measured share',
      category: 'anti-virus',
    },
    {
      id: 'MID antivirus negative',
      description: 'MID ... antivirus negative',
      frequency: '4.28% measured share',
      category: 'anti-virus',
    },
    {
      id: 'MID antivirus positive',
      description: 'MID ... antivirus positive',
      frequency: '0.03% measured share',
      category: 'anti-virus',
    },
    {
      id: 'Message aborted',
      description: 'Message aborted MID ... Dropped by antivirus',
      frequency: '0.03% measured share',
      category: 'anti-virus',
    },
    {
      id: 'MID attachment',
      description: 'MID ... attachment',
      frequency: '2.00% measured share',
      category: 'content',
    },
    {
      id: 'MID Outbreak Filters',
      description: 'MID ... Outbreak Filters: verdict negative',
      frequency: '2.15% measured share',
      category: 'outbreak filters',
    },
    {
      id: 'MID queued',
      description: 'MID ... queued for delivery',
      frequency: '4.28% measured share',
      category: 'message',
    },
    {
      id: 'EUQ Tagging',
      description: 'EUQ: Tagging MID ... for quarantine',
      frequency: '0.21% measured share',
      category: 'quarantine',
    },
    {
      id: 'RPC Delivery start',
      description: 'RPC Delivery start RCID ... MID ...',
      frequency: '0.21% measured share',
      category: 'quarantine',
    },
    {
      id: 'EUQ Quarantined',
      description: 'EUQ: Quarantined MID',
      frequency: '0.21% measured share',
      category: 'quarantine',
    },
    {
      id: 'RPC Message done',
      description: 'RPC Message done RCID ... MID',
      frequency: '0.21% measured share',
      category: 'quarantine',
    },
    {
      id: 'New SMTP DCID',
      description: 'New SMTP DCID ... interface ... address',
      frequency: '4.44% measured share',
      category: 'delivery',
    },
    {
      id: 'Delivery start',
      description: 'Delivery start DCID ... MID ... to RID [...]',
      frequency: '4.44% measured share',
      category: 'delivery',
    },
    {
      id: 'Message done',
      description: 'Message done DCID ... MID ... to RID [...]',
      frequency: '4.39% measured share',
      category: 'delivery',
    },
    {
      id: 'MID RID Response',
      description: "MID ... RID [...] Response '...'",
      frequency: '4.39% measured share',
      category: 'delivery',
    },
    {
      id: 'Bounced',
      description: 'Bounced: DCID ... MID ... to RID n - 5.1.0 - ...',
      frequency: '0.05% measured share',
      category: 'delivery',
    },
    {
      id: 'DCID close',
      description: 'DCID ... close',
      frequency: '4.44% measured share',
      category: 'delivery',
    },
    {
      id: 'Message finished',
      description: 'Message finished MID ... done',
      frequency: '4.31% measured share',
      category: 'message',
    },
  ],
  realismFeatures: [
    "Background is independent random processes, not a script: outbound mail per internal user with lognormal activity weights and each user's own working hours in UTC, mail from every user to their own personal mailbox, inbound internet mail with a day/night rate, series of 2-5 messages to the same recipients, occasional mistyped recipients that hard-bounce, spam quarantined by CASE, rejected low-reputation connections and rare virus drops. Rates and shares are synthetic, not vendor-measured.",
    "Each record keeps the raw syslog line and the fields the integration's grok patterns extract: MID, ICID, DCID, RID, sender and recipient addresses, read bytes, connection and message status, and scanning engine verdicts. The final 80-hour default capture holds 86,162 lines, 3,715 messages (1,838 outbound, 1,877 inbound) and 356 rejected connections.",
    'Chain elements occur in background: per 80-hour background capture, 333-399 messages to their own personal mailbox (46-64 of them 8 MB or more), 3-7 pairs of large messages to their own mailbox within 40 minutes, and 12-21 cases of three or more large messages from one sender to other recipients within 40 minutes; each episode user and mailbox pair also had 4-22 background messages. The gateway logs no content beyond attachment names, so the chain shows volume and destination, not intent.',
    'Line grammar follows the AsyncOS 16.5 Logging chapter examples and the Elastic integration fixtures, with no complete raw 16.x capture available; the REJECT SG BLOCKED_LIST line applies the documented ACCEPT SG grammar. Structured fields are what Elastic integration 1.29.3 extracts, and its connection pattern matches only the Management interface, hence the single interface; Elastic agent fields are omitted.',
    'Syslog timestamps have one-second resolution and no year, @timestamp is UTC with .000 milliseconds, and the priority is always <166> (local4.info), as in the integration fixtures. Each second emits at most four lines; lines queued in a busy second move to the next one.',
    'Not covered: TLS, SMTP authentication, per-connection message reuse, soft bounces, DLP, AMP, URL filtering, message filters, Subject with double quotes and log levels other than Info; SPF, DKIM and DMARC pass for legitimate inbound senders and are not logged for spam senders. At intervals of 8 h and below, episodes measurably raise the rate of closely spaced large messages per sender; at the default 24 h they do not.',
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
        'Internal Exchange hosts that relay outbound mail and receive inbound mail',
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
      name: 'users',
      defaultValue: '40 names (a.ivanova ... ap.maksimova)',
      description: 'Local parts of internal users',
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
        'Public mailbox providers; each user has a personal address at one of them',
    },
    {
      name: 'newsletter_senders',
      defaultValue:
        '[news@digest.example.com, noreply@events.example.net, offers@shop.example.org, updates@saas.example.com]',
      description: 'Bulk senders marked as graymail',
    },
    {
      name: 'contact_names',
      defaultValue: '20 names (anna ... victor)',
      description: 'Local parts for partner and freemail contacts',
    },
    {
      name: 'subjects',
      defaultValue: '16 subjects',
      description: 'Message subjects',
    },
    {
      name: 'attachment_names',
      defaultValue: '16 names (report.pdf ... design.psd)',
      description: 'Attachment names',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ready line of the first episode message',
      json: String.raw`{"@timestamp": "2026-09-02T00:18:01.000Z", "cisco_secure_email_gateway": {"log": {"category": {"name": "mail_logs"}, "host": "esa-01.contoso.example", "message": "MID 57270617 ready 8194749 bytes from \u003cg.mikhailova@contoso.example\u003e", "read_bytes": 8194749}}, "ecs": {"version": "8.17.0"}, "email": {"from": {"address": ["g.mikhailova@contoso.example"]}, "message_id": "57270617"}, "event": {"dataset": "cisco_secure_email_gateway.log", "kind": "event", "original": "\u003c166\u003eSep  2 00:18:01 esa-01.contoso.example mail_logs: Info: MID 57270617 ready 8194749 bytes from \u003cg.mikhailova@contoso.example\u003e", "timezone": "UTC"}, "log": {"level": "info", "syslog": {"priority": 166}}, "tags": ["preserve_original_event"]}`,
    },
  ],
};
