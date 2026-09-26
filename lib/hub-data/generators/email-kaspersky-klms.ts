import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKlms: GeneratorMeta = {
  slug: 'email-kaspersky-klms',
  displayName: 'Kaspersky Security for Linux Mail Server CEF',
  category: 'email',
  description:
    'Kaspersky Security for Linux Mail Server ScanLogic records as CEF in event.original of an ECS JSON event: a mail-authentication (SPF, DKIM, DMARC) record and an antivirus record for every processed message from 28 independent senders. Recurring episodes send one high-value mailbox three rejected spoofed messages within 180 seconds: two clean lures, then an infected payload.',
  dataSource:
    'Kaspersky Security for Linux Mail Server ScanLogic MA/AV status, CEF over syslog (legacy version 8 documentation)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'ScanLogic CEF record in event.original',
    'Paired MA and AV records per message from 28 senders',
    'Recurring spoofed lure-then-infected chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 6 hours by default (the first falls due one interval after the first input timestamp, each next one interval after the previous actual start, and each starts 1-30 minutes after falling due, so starts are 6 h 01 min to 6 h 30 min apart and drift later; no catch-up), one spoofing sender sends one high-value mailbox three messages within 180 seconds, all failing SPF, DKIM and DMARC with MA Reject: AV Clean, Clean, then Infected. Sender and mailbox differ from the previous episode, and each message has an MA/AV pair joined by message ID. Every element also occurs in ordinary traffic; only the exact two-clean-then-infected sequence on one flow is episode-only. Everything is rejected and no delivery or compromise is asserted.',
  generatorId: 'klms',
  eventTypes: [
    {
      id: 'MA ViolationNotFound',
      description:
        'LMS_EV_SCAN_LOGIC_MA_STATUS with SPF, DKIM and DMARC verdicts, none failing; action Skip',
      frequency: '32.7% measured share (32.9% background only)',
      category: 'email',
    },
    {
      id: 'MA ViolationFound',
      description:
        'LMS_EV_SCAN_LOGIC_MA_STATUS with at least one failing verdict; action Reject',
      frequency: '17.3% measured share (17.1% background only)',
      category: 'email',
    },
    {
      id: 'AV Clean',
      description:
        'LMS_EV_SCAN_LOGIC_AV_STATUS antivirus result for the same message; action Skip',
      frequency: '48.6% measured share (48.8% background only)',
      category: 'malware',
    },
    {
      id: 'AV Infected',
      description:
        'LMS_EV_SCAN_LOGIC_AV_STATUS infected result; action Reject, severity High',
      frequency: '1.4% measured share (1.2% background only)',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'Every processed message produces two records, MA then AV, with the same message ID, size, relay, sender, recipient and one-second UTC processing timestamp. The pairing, MA-first order and identical timestamp are explicit scenario assumptions, not confirmed native ordering.',
    'MA and antivirus scanning run for one recipient under the Default rule. The selected policy rejects each SPF, DKIM or DMARC violation and clean results use Skip; act is the engine action, not a delivery outcome, so an AV result can accompany an authentication rejection and a clean AV result does not imply delivery.',
    '28 senders of five kinds (partner, spoof, notify, bulk, forwarder) start SMTP sessions as independent Poisson processes at their own rates, human-driven kinds on a daily curve peaking at 13:00 UTC, with no fixed period, rotation or cooldown. The default samples produce about 2,000-2,300 messages (4,100-4,500 records) per day, at most one message per second.',
    'Ordinary traffic in both modes repeats all-fail messages from one spoofing sender to one recipient within minutes (124-152 same-flow pairs and 35-50 triples within 180 s per 28 h) and infected all-fail messages after such a failure (14-25 per 28 h). An ordinary infected message that would complete the exact episode sequence is exported as clean.',
    'CEF extension values escape equals signs, backslashes and line breaks, and header values escape pipes; mailboxes with = and + and an IPv6 relay were exercised. The ECS object joins native identities and adds no authenticated user, transport envelope, threat name or delivery verdict.',
    'Keys and statuses follow the KLMS ScanLogic key table and verdict catalogs, but no complete MA/AV ScanLogic record was found: event names, severities, act/outcome wire vocabulary, cs1 form, product build (illustrative 8.0MP2), pair ordering and syslog framing remain unverified, and no PRI is invented. The stream is separate from Kaspersky Secure Mail Gateway; rates, session shapes, verdict weights and sizes are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Periodic campaign enabled; `false` emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '6',
      description:
        'Hours from one actual episode start until the next is due, followed by a random 60-1800 s start delay; values below 1 are raised to 1',
    },
    {
      name: 'mail_host',
      defaultValue: 'mail-01.example.test',
      description: 'Synthetic hostname with no whitespace or line breaks',
    },
    {
      name: 'product_version',
      defaultValue: '8.0MP2',
      description:
        'Illustrative vendor header value, not a verified live build',
    },
  ],
  sampleOutputs: [
    {
      title: 'Infected third message of the first episode (AV record)',
      json: String.raw`{
  "@timestamp": "2026-09-25T06:16:41+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "email": {
    "from": {
      "address": [
        "billing@invoice-example.test"
      ]
    },
    "local_id": "6cf13957a6ca015e",
    "to": {
      "address": [
        "finance@example.test"
      ]
    }
  },
  "event": {
    "action": "reject",
    "category": [
      "malware"
    ],
    "code": "LMS_EV_SCAN_LOGIC_AV_STATUS",
    "dataset": "kaspersky.klms",
    "kind": "event",
    "original": "September 25, 2026 06:16:41 mail-01.example.test CEF:0|AO Kaspersky Lab|Kaspersky Linux Mail Security|8.0MP2|LMS_EV_SCAN_LOGIC_AV_STATUS|antivirus scan status|High|cs1=6cf13957a6ca015e cs1Label=MessageId src=198.51.100.74 act=Reject fsize=166247 suser=billing@invoice-example.test duser=finance@example.test cs2=Default cs2Label=Rules outcome=Infected",
    "type": [
      "info"
    ]
  },
  "kaspersky": {
    "klms": {
      "class_id": "LMS_EV_SCAN_LOGIC_AV_STATUS"
    }
  },
  "observer": {
    "hostname": "mail-01.example.test",
    "product": "Kaspersky Linux Mail Security",
    "vendor": "Kaspersky",
    "version": "8.0MP2"
  },
  "source": {
    "ip": "198.51.100.74"
  }
}`,
    },
  ],
};
