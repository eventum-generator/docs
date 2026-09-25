import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftAdcs: GeneratorMeta = {
  slug: 'identity-microsoft-adcs',
  displayName: 'Microsoft AD CS Audit',
  category: 'identity',
  description:
    'Windows Server 2012 CA Security events for audit changes, certificate requests, issue and denial.',
  dataSource: 'Windows Server 2012 Security events 4885-4888, version 0',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'All selected version 0 EventData fields',
    'Request and disposition share the native RequestId',
    'One switchable CA-audit-change and sensitive-SAN sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 50 ordinary request pairs, a 4885 filter change from 127 to 119 precedes a privileged-UPN 4886 request and matching 4887 issue within three minutes.',
  generatorId: 'microsoft-adcs',
  eventTypes: [
    {
      id: '4886',
      description: 'Certificate request received',
      frequency:
        'One per ordinary request and one extra linked request when enabled',
      category: 'iam',
    },
    {
      id: '4887',
      description: 'Certificate issued',
      frequency:
        '94% of ordinary dispositions and one extra linked issue when enabled',
      category: 'iam',
    },
    {
      id: '4888',
      description: 'Certificate denied',
      frequency: '6% of ordinary dispositions',
      category: 'iam',
    },
    {
      id: '4885',
      description: 'CA audit filter changed',
      frequency:
        'Once per 240 ordinary pairs and one extra linked change when enabled',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'A request and its disposition share CA host, RequestId, Requester and Attributes.',
    'Both modes contain CA audit changes and individual privileged-UPN request/issue pairs.',
    'The SAN scenario assumes a fictional template that accepts requester-supplied SANs.',
    'Version 0 EventData is documented; full same-version raw XML envelopes remain unverified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include one linked sequence; false emits background only',
    },
    {
      name: 'ca_host',
      defaultValue: 'ca01.corp.example',
      description: 'Certificate authority host',
    },
    { name: 'domain', defaultValue: 'CORP', description: 'Requester domain' },
    {
      name: 'ca_name',
      defaultValue: 'CORP-CA',
      description: 'Certificate authority display name',
    },
    {
      name: 'suspicious_requester',
      defaultValue: 'svc-enroll',
      description: 'Account in linked and background records',
    },
    {
      name: 'privileged_upn',
      defaultValue: 'administrator@corp.example',
      description: 'UPN in linked and background requests',
    },
    {
      name: 'routine_template',
      defaultValue: 'User',
      description: 'Ordinary certificate template',
    },
    {
      name: 'enrollment_template',
      defaultValue: 'CorpUserSuppliedSAN',
      description: 'Fictional template accepting a supplied SAN',
    },
  ],
  sampleOutputs: [
    {
      title: 'Certificate request received',
      json: String.raw`{
  "@timestamp": "2026-09-25T17:13:00.839382+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "certificate-requested",
    "category": [
      "iam"
    ],
    "code": "4886",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>4886</EventID><Version>0</Version><Level>0</Level><Task>12805</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T17:13:00.839382Z\"/><EventRecordID>310040</EventRecordID><Correlation/><Execution ProcessID=\"652\" ThreadID=\"368\"/><Channel>Security</Channel><Computer>ca01.corp.example</Computer><Security/></System><EventData><Data Name=\"RequestId\">3001</Data><Data Name=\"Requester\">CORP\\pavel</Data><Data Name=\"Attributes\">CertificateTemplate:User</Data></EventData></Event>",
    "provider": "Microsoft-Windows-Security-Auditing",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "ca01.corp.example"
  },
  "observer": {
    "name": "CORP-CA",
    "type": "certificate-authority"
  },
  "related": {
    "user": [
      "pavel"
    ]
  },
  "user": {
    "domain": "CORP",
    "name": "pavel"
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "ca01.corp.example",
    "event_data": {
      "Attributes": "CertificateTemplate:User",
      "RequestId": "3001",
      "Requester": "CORP\\pavel"
    },
    "event_id": "4886",
    "keywords": [
      "Audit Success"
    ],
    "level": "information",
    "opcode": "Info",
    "process": {
      "pid": 652,
      "thread": {
        "id": 368
      }
    },
    "provider_guid": "{54849625-5478-4994-A5BA-3E3B0328C30D}",
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": "310040",
    "task": "Certification Services",
    "time_created": "2026-09-25T17:13:00.839382Z"
  }
}`,
    },
  ],
};
