import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKlms: GeneratorMeta = {
  slug: 'email-kaspersky-klms',
  displayName: 'Kaspersky Security for Linux Mail Server CEF',
  category: 'email',
  description:
    'Kaspersky Security for Linux Mail Server ScanLogic records as CEF in event.original of an ECS JSON event: a mail-authentication (SPF, DKIM, DMARC) record and an antivirus record for every processed message from 43 senders of five kinds, about 13,400 messages a day. Recurring episodes send one high-value mailbox three rejected spoofed messages within 180 seconds: two clean lures, then an infected payload.',
  dataSource:
    'Kaspersky Security for Linux Mail Server ScanLogic MA/AV status, CEF over syslog (legacy version 8 documentation)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'ScanLogic CEF record in event.original',
    'Paired MA and AV records per message from 43 senders',
    'Recurring spoofed lure-then-infected chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every anomaly_interval_hours (6 hours by default), one spoofing sender sends one high-value mailbox three messages through its relay within 180 seconds (usually within about 90), all failing SPF, DKIM and DMARC with MA Reject: AV Clean, Clean about half a minute later, then Infected (action Reject, severity High). Each message has an MA/AV pair joined by message ID; sender and mailbox follow the weights of spoofing traffic and differ from the previous episode. Spoofing traffic has no daily curve, so starts are uniform over the day: the first at a random moment within the first anomaly_interval_hours (at most 24 hours) of the data, each next one due one interval after the actual start of the previous one and starting at a random moment in a window a quarter of the interval wide (at most 6 hours) centred on that due time, so at the default interval consecutive starts are 5 h 15 min to 6 h 45 min apart. There is no catch-up: after a pause one episode runs and the next is due one interval after its start. Every element also occurs in ordinary traffic; only the exact two-clean-then-infected sequence on one flow is episode-only. Everything is rejected and no delivery or compromise is asserted.',
  generatorId: 'klms',
  eventTypes: [
    {
      id: 'MA ViolationNotFound',
      description:
        'LMS_EV_SCAN_LOGIC_MA_STATUS with SPF, DKIM and DMARC verdicts, none failing; action Skip',
      frequency: '38.9% share (38.9% background only)',
      category: 'email',
    },
    {
      id: 'MA ViolationFound',
      description:
        'LMS_EV_SCAN_LOGIC_MA_STATUS with at least one failing verdict; action Reject',
      frequency: '11.1% share (11.1% background only)',
      category: 'email',
    },
    {
      id: 'AV Clean',
      description:
        'LMS_EV_SCAN_LOGIC_AV_STATUS antivirus result for the same message; action Skip',
      frequency: '49.5% share (49.6% background only)',
      category: 'malware',
    },
    {
      id: 'AV Infected',
      description:
        'LMS_EV_SCAN_LOGIC_AV_STATUS infected result; action Reject, severity High',
      frequency: '0.5% share (0.4% background only)',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'Every processed message produces two records, MA then AV, with the same message ID, size, relay, sender, recipient and one-second UTC processing timestamp. The pairing, MA-first order and identical timestamp are explicit scenario assumptions, not confirmed native ordering.',
    'MA and antivirus scanning run for one recipient under the Default rule. The selected policy rejects each SPF, DKIM or DMARC violation and clean results use Skip; act is the engine action, not a delivery outcome, so an AV result can accompany an authentication rejection and a clean AV result does not imply delivery.',
    'About 13,400 messages (26,800 records) a day, varying by about 3% from day to day. Ordinary senders follow a daily curve from 0.6 of their mean hourly rate at night to 1.4 of it around 13:00 UTC, while spoofing senders are active at a flat rate round the clock; the busiest hour carries about 780 messages and the quietest about 345.',
    '43 senders of five kinds open SMTP sessions at random moments, each with a share set by its weight, with no fixed period or cooldown: 24 partners (53.0% of messages), 5 notification senders (17.7%), 5 bulk mailers (about 13%), 3 forwarders that break SPF (9.6%) and 6 spoofing senders (about 7%). A bulk mailing reaches its recipients a median of 6 seconds apart (90% within 20 seconds) and the messages of a spoofing sender are about half a minute apart, rather than the sub-second spacing a fast sender can reach. Message sizes are log-normal per kind, and infected messages are larger.',
    'Ordinary traffic in both modes repeats all-fail messages from one spoofing sender to one high-value mailbox within minutes (154 same-flow pairs and 45 triples within 180 seconds per 28 hours of background-only output) and infected all-fail messages that follow such a failure. An ordinary all-fail message that would follow two all-fail clean messages of the same flow within 180 seconds is always scanned clean. The total message count is the same in both modes, but each episode adds its own messages, so counts of all-fail spoofed messages to a high-value mailbox and of infected results after such failures are about three and one per episode higher than in background.',
    'CEF extension values escape equals signs, backslashes and line breaks, and header values escape pipes; relays may be IPv4 or IPv6. The ECS object joins native identities and adds no authenticated user, transport envelope, threat name or delivery verdict.',
    'Keys and statuses follow the KLMS ScanLogic key table and verdict catalogs, but no complete MA or AV ScanLogic record was found: event names, severities, act/outcome wire vocabulary, cs1 form, product build (illustrative 8.0MP2), pair order and timestamps and syslog framing are inferred, and no PRI is invented. The stream is separate from Kaspersky Secure Mail Gateway; rates, session shapes, verdict weights and sizes are synthetic, and with no Elastic integration sample the ECS mapping is inferred.',
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
        'Hours from one actual episode start until the next episode is due; values below 1 are raised to 1',
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
      title: 'Infected third message of an episode (AV record)',
      json: String.raw`{"@timestamp": "2026-09-25T07:00:23+00:00", "ecs": {"version": "8.17.0"}, "email": {"from": {"address": ["ceo.office@examp1e.test"]}, "local_id": "adf1b964db344ebc", "to": {"address": ["accounting@example.test"]}}, "event": {"action": "reject", "category": ["malware"], "code": "LMS_EV_SCAN_LOGIC_AV_STATUS", "dataset": "kaspersky.klms", "kind": "event", "original": "September 25, 2026 07:00:23 mail-01.example.test CEF:0|AO Kaspersky Lab|Kaspersky Linux Mail Security|8.0MP2|LMS_EV_SCAN_LOGIC_AV_STATUS|antivirus scan status|High|cs1=adf1b964db344ebc cs1Label=MessageId src=192.0.2.199 act=Reject fsize=72259 suser=ceo.office@examp1e.test duser=accounting@example.test cs2=Default cs2Label=Rules outcome=Infected", "type": ["info"]}, "kaspersky": {"klms": {"class_id": "LMS_EV_SCAN_LOGIC_AV_STATUS"}}, "observer": {"hostname": "mail-01.example.test", "product": "Kaspersky Linux Mail Security", "vendor": "Kaspersky", "version": "8.0MP2"}, "source": {"ip": "192.0.2.199"}}`,
    },
  ],
};
