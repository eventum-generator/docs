import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKlms: GeneratorMeta = {
  slug: 'email-kaspersky-klms',
  displayName: 'Kaspersky Linux Mail Security CEF',
  category: 'email',
  description:
    'KLMS ScanLogic mail-authentication and antivirus CEF projections with a switchable linked message sequence.',
  dataSource:
    'Kaspersky Security for Linux Mail Server ScanLogic CEF over syslog',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'ScanLogic MA and AV classes in both modes',
    'Message ID links mail and antivirus records',
    'One switchable four-record sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 120 routine records, three mail-authentication failures from one sender and relay to one recipient occur on consecutive minutes; the third message has an infected AV record with the same ID.',
  generatorId: 'klms',
  eventTypes: [
    {
      id: 'LMS_EV_SCAN_LOGIC_MA_STATUS',
      description: 'Mail-authentication scan',
      frequency: 'Most routine records',
      category: 'email',
    },
    {
      id: 'LMS_EV_SCAN_LOGIC_AV_STATUS',
      description: 'Antivirus scan for a preceding message',
      frequency: 'About one tenth of routine records',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'MA and AV records share message ID, relay, sender, recipient and file size.',
    'Individual failed-authentication and infected-AV signatures occur in both modes.',
    "Configured status values follow Kaspersky's KLMS action and verdict catalogs.",
    'No complete native ScanLogic CEF record is published in the cited 8.2 docs; exact header, severity and value serialization remain unverified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include one short chain; false emits background only',
    },
    {
      name: 'mail_host',
      defaultValue: 'mail-01.example.test',
      description: 'Synthetic syslog hostname',
    },
    {
      name: 'product_version',
      defaultValue: '8.0MP2',
      description: "CEF header value from the vendor's illustrative example",
    },
    {
      name: 'unusual_sender',
      defaultValue: 'billing@invoice-example.test',
      description: 'Sender used in both modes',
    },
    {
      name: 'target_recipient',
      defaultValue: 'finance@example.test',
      description: 'Recipient used in both modes',
    },
    {
      name: 'unusual_relay_ip',
      defaultValue: '198.51.100.74',
      description: 'SMTP relay used in both modes',
    },
  ],
  sampleOutputs: [
    {
      title: 'KLMS mail-authentication event',
      json: String.raw`{
  "@timestamp": "2026-09-25T19:36:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "email": {
    "from": {
      "address": [
        "billing@invoice-example.test"
      ]
    },
    "local_id": "1b35d85e77327677",
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
    "original": "September 25, 2026 19:36:00 mail-01.example.test CEF:0|AO Kaspersky Lab|Kaspersky Linux Mail Security|8.0MP2|LMS_EV_SCAN_LOGIC_MA_STATUS|mail authentication status|Low|cs1=1b35d85e77327677 cs1Label=MessageId src=198.51.100.74 act=Reject fsize=15913 suser=billing@invoice-example.test duser=finance@example.test cs2=Default cs2Label=Rules cs4=Fail cs4Label=SpfVerdict cs5=Fail cs5Label=DkimVerdict cs6=Fail cs6Label=DmarcVerdict outcome=ViolationFound",
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
