import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKlms: GeneratorMeta = {
  slug: 'email-kaspersky-klms',
  displayName: 'Kaspersky Linux Mail Security CEF',
  category: 'email',
  description:
    'KLMS ScanLogic mail authentication and antivirus CEF records, distinct from Kaspersky Secure Mail Gateway.',
  dataSource: 'Kaspersky Security for Linux Mail Server',
  format: ['Syslog', 'CEF', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Vendor-documented CEF fields in event.original',
    'Correlated multi-event anomaly chain',
    'Background-only mode for baseline traffic',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three messages from one relay to one finance mailbox fail SPF, DKIM and DMARC; the third message also receives an antivirus detection with the same KLMS message ID.',
  generatorId: 'kaspersky-klms',
  eventTypes: [
    {
      id: 'LMS_EV_SCAN_LOGIC_MA_STATUS',
      description: 'SPF/DKIM/DMARC scan',
      frequency: '~99% in anomaly mode',
      category: 'email',
    },
    {
      id: 'LMS_EV_SCAN_LOGIC_AV_STATUS',
      description: 'Antivirus scan',
      frequency: '~1% in anomaly mode',
      category: 'malware',
    },
  ],
  realismFeatures: [
    'Native source identifiers and event classes',
    'Stable actors and targets throughout the chain',
    'Time-sorted sequence suitable for SIEM correlation',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable spoofed-mail chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records between chains.',
    },
    {
      name: 'mail_host',
      defaultValue: 'mail-01.example.test',
      description: 'KLMS syslog hostname.',
    },
    {
      name: 'product_version',
      defaultValue: '8.0MP2',
      description: 'CEF version shown in Kaspersky example.',
    },
    {
      name: 'unusual_sender',
      defaultValue: 'billing@invoice-example.test',
      description: 'Chain sender.',
    },
    {
      name: 'target_recipient',
      defaultValue: 'finance@example.test',
      description: 'Chain mailbox.',
    },
    {
      name: 'unusual_relay_ip',
      defaultValue: '198.51.100.74',
      description: 'Chain relay.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Kaspersky Linux Mail Security CEF anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:04:17+00:00","ecs":{"version":"8.17.0"},"email":{"from":{"address":["billing@invoice-example.test"]},"local_id":"synthetic-klms-1-1","to":{"address":["finance@example.test"]}},"event":{"action":"scanned","category":["email"],"code":"LMS_EV_SCAN_LOGIC_MA_STATUS","dataset":"kaspersky.klms","kind":"event","original":"Sep 25 13:04:17 mail-01.example.test KLMS: CEF:0|AO Kaspersky Lab|Kaspersky Linux Mail Security|8.0MP2|LMS_EV_SCAN_LOGIC_MA_STATUS|mail authentication status|Low|cs1=synthetic-klms-1-1 cs1Label=MessageId src=198.51.100.74 act=scanned fsize=40192 suser=billing@invoice-example.test duser=finance@example.test cs2=mail-authentication cs2Label=Rules reason=authentication-failed cs4=fail cs4Label=SpfVerdict cs5=fail cs5Label=DkimVerdict cs6=fail cs6Label=DmarcVerdict outcome=Failed","type":["info"]},"kaspersky":{"klms":{"class_id":"LMS_EV_SCAN_LOGIC_MA_STATUS","dkim":"fail","dmarc":"fail","spf":"fail"}},"observer":{"hostname":"mail-01.example.test","product":"Kaspersky Linux Mail Security","vendor":"Kaspersky","version":"8.0MP2"},"source":{"ip":"198.51.100.74"}}`,
    },
  ],
};
