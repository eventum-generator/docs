import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKlms: GeneratorMeta = {
  slug: 'email-kaspersky-klms',
  displayName: 'Kaspersky Linux Mail Security CEF',
  category: 'email',
  description:
    'Kaspersky Linux Mail Security paired MA/AV CEF projections with recurring six-hour sender sequences and bounded message state.',
  dataSource:
    'Selected KLMS ScanLogic CEF projection; native transport unverified',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Mail authentication and antivirus for each message',
    'Matched IDs, recipients, relay and size',
    'Six-hour, three-message sequences',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every six hours, three distinct messages from one sender/relay to one recipient occur on consecutive minutes. All fail SPF/DKIM/DMARC; antivirus is Clean, Clean, then Infected. Each message has matching MA and AV projections: six records span two minutes. The same identities and independent failure/infection pairs also occur in background, outside the dense correlation.',
  generatorId: 'klms',
  eventTypes: [
    {
      id: 'LMS_EV_SCAN_LOGIC_MA_STATUS',
      description: 'Mail-authentication result with SPF/DKIM/DMARC verdicts',
      frequency: 'One per selected message, 50% of records',
      category: 'email',
    },
    {
      id: 'LMS_EV_SCAN_LOGIC_AV_STATUS',
      description: 'Antivirus result for that same message',
      frequency: 'One per selected message, 50% of records',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'One bounded pending message produces matched MA/AV projections with fresh IDs, identical native size, sender, recipient, relay and processing time. MA-then-AV order and two-record cadence are explicit model choices.',
    'Default recurrence is six hours, custom three and supported minimum one. Three messages at one-minute spacing repeat without catch-up; four bounded failure clocks prevent ordinary dense target sequences.',
    'Both modes retain all selected clean/infected and partial/full authentication-failure branches, actors and signatures. Ordinary targeted failures are separated by at least twenty minutes.',
    'CEF values escape backslash, equals and newline as required; custom mailbox values containing plus and equals were exercised. No invented syslog PRI/header is appended.',
    'Both MA and AV scans precede the message action in the selected enabled-engine policy. A clean AV verdict does not prove delivery or override mail-authentication rejection.',
    'Vendor catalogs establish selected keys/statuses; illustrative 8.0MP2 header and names/severity/prefix remain qualified inference. Complete ScanLogic native wire capture and live parser parity are unavailable, so output is a CEF projection.',
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
        'Hours between episode starts; minimum 1, lower values clamp to 1',
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
    {
      name: 'unusual_sender',
      defaultValue: 'billing@invoice-example.test',
      description: 'Valid sender mailbox used in both modes',
    },
    {
      name: 'target_recipient',
      defaultValue: 'finance@example.test',
      description: 'Valid recipient mailbox used in both modes',
    },
    {
      name: 'unusual_relay_ip',
      defaultValue: '198.51.100.74',
      description: 'Valid received-from server IP used in both modes',
    },
  ],
  sampleOutputs: [
    {
      title: 'Paired-message mail-authentication rejection',
      json: String.raw`{
  "@timestamp": "2026-09-25T06:02:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "email": {
    "from": {
      "address": [
        "billing@invoice-example.test"
      ]
    },
    "local_id": "ff6c31cabc7ab0e8",
    "to": {
      "address": [
        "finance@example.test"
      ]
    }
  },
  "event": {
    "action": "reject",
    "category": [
      "email"
    ],
    "code": "LMS_EV_SCAN_LOGIC_MA_STATUS",
    "dataset": "kaspersky.klms",
    "kind": "event",
    "original": "September 25, 2026 06:02:00 mail-01.example.test CEF:0|AO Kaspersky Lab|Kaspersky Linux Mail Security|8.0MP2|LMS_EV_SCAN_LOGIC_MA_STATUS|mail authentication status|Low|cs1=ff6c31cabc7ab0e8 cs1Label=MessageId src=198.51.100.74 act=Reject fsize=1958 suser=billing@invoice-example.test duser=finance@example.test cs2=Default cs2Label=Rules cs4=Fail cs4Label=SpfVerdict cs5=Fail cs5Label=DkimVerdict cs6=Fail cs6Label=DmarcVerdict outcome=ViolationFound",
    "type": [
      "info"
    ]
  },
  "kaspersky": {
    "klms": {
      "class_id": "LMS_EV_SCAN_LOGIC_MA_STATUS",
      "dkim": "Fail",
      "dmarc": "Fail",
      "spf": "Fail"
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
