import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftAdcs: GeneratorMeta = {
  slug: 'identity-microsoft-adcs',
  displayName: 'Microsoft AD CS Audit',
  category: 'identity',
  description:
    'Windows Server 2012 CA audit, request, issuance and denial records with recurring sensitive-UPN correlations and native RequestId linkage.',
  dataSource: 'Windows Server 2012 Security events 4885-4888, version 0',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    '20/20 selected version 0 EventData fields',
    'Receipt and disposition preserve native RequestId',
    'Recurring daily audit-reduction and enrollment correlations',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, a 4885 change from assumed filter 127 to 119 reduces revocation/CRL auditing, then a sensitive-UPN 4886 request and matching 4887 issuance follow on minute ticks. Request/issuance auditing remains enabled. An ordinary 119-to-127 restoration occurs before another episode. Scheduling waits for ordinary pairs and restoration; the assumed service restart is not proven by this selected stream.',
  generatorId: 'microsoft-adcs',
  eventTypes: [
    {
      id: '4886',
      description: 'Certificate request received',
      frequency: 'One per ordinary request and per recurring episode',
      category: 'iam',
    },
    {
      id: '4887',
      description: 'Certificate approved and issued',
      frequency:
        '94% of ordinary non-privileged dispositions; privileged pairs and episodes',
      category: 'iam',
    },
    {
      id: '4888',
      description: 'Certificate request denied for insufficient key length',
      frequency: '6% of ordinary non-privileged dispositions',
      category: 'iam',
    },
    {
      id: '4885',
      description: 'CA audit filter changed',
      frequency:
        'About eight-hour background maintenance, one-hour restoration and periodic reduction',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'UTC source/ECS times, increasing native request IDs and one in-flight receipt/disposition preserve CA host, requester, attributes and process/thread; completed payloads are cleared.',
    'Both modes contain the same administrator, audit values, event classes and individual privileged-UPN requests. Mode changes the short sequence.',
    'Fictional CorpUserCN selects 0x40000000 CN from AD, with cn equal to the account name. CorpUserSuppliedSAN selects supplied subject 0x1 with the same synthetic CSR CN; published permissions and automatic issuance are assumptions.',
    'The CA SAN-attribute policy, administrator authority and successful 45-second service restart are explicit assumptions. Selected records do not prove restart, issued SAN or privileged authentication.',
    'Filter 119 removes revocation/CRL bit 8 while retaining request/issue bit 4 and security-change bit 16. Key-length denial is not a permission denial.',
    'BLOCKED_RAW_EVIDENCE: 20/20 selected EventData fields does not establish complete same-version XML envelope or live parser compatibility. SKI shape is synthetic; no CSR-derived key identifier, certificate serial/hash/validity or v1 fields are invented.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include repeated short correlations; false emits background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'First wait and recurrence; finite numeric values below six hours are clamped to six',
    },
    {
      name: 'ca_host',
      defaultValue: 'ca01.corp.example',
      description: 'CA server name',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Requester domain',
    },
    {
      name: 'ca_name',
      defaultValue: 'CORP-CA',
      description: 'Configured CA display name, collector enrichment',
    },
    {
      name: 'suspicious_requester',
      defaultValue: 'svc-enroll',
      description: 'Administrator used in episodes and ordinary activity',
    },
    {
      name: 'privileged_upn',
      defaultValue: 'administrator@corp.example',
      description: 'Requested UPN in both modes',
    },
    {
      name: 'routine_template',
      defaultValue: 'CorpUserCN',
      description: 'Fictional published CN-from-AD template',
    },
    {
      name: 'enrollment_template',
      defaultValue: 'CorpUserSuppliedSAN',
      description: 'Fictional published enrollment template',
    },
  ],
  sampleOutputs: [
    {
      title: 'Certificate issued for a sensitive-UPN request',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:04:00.904088+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "certificate-issued",
    "category": [
      "iam"
    ],
    "code": "4887",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>4887</EventID><Version>0</Version><Level>0</Level><Task>12805</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-26T00:04:00.904088Z\"/><EventRecordID>342078</EventRecordID><Correlation/><Execution ProcessID=\"892\" ThreadID=\"412\"/><Channel>Security</Channel><Computer>ca01.corp.example</Computer><Security/></System><EventData><Data Name=\"RequestId\">3720</Data><Data Name=\"Requester\">CORP\\svc-enroll</Data><Data Name=\"Attributes\">CertificateTemplate:CorpUserSuppliedSAN\nSAN:upn=administrator@corp.example</Data><Data Name=\"Disposition\">3</Data><Data Name=\"SubjectKeyIdentifier\">b8 39 ac a8 96 d6 5a bc c6 9d 99 fe 0e f1 bf 45 d2 78 d6 23</Data><Data Name=\"Subject\">CN=svc-enroll</Data></EventData></Event>",
    "outcome": "success",
    "provider": "Microsoft-Windows-Security-Auditing",
    "type": [
      "creation"
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
      "svc-enroll"
    ]
  },
  "user": {
    "domain": "CORP",
    "name": "svc-enroll"
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "ca01.corp.example",
    "event_data": {
      "Attributes": "CertificateTemplate:CorpUserSuppliedSAN\nSAN:upn=administrator@corp.example",
      "Disposition": "3",
      "RequestId": "3720",
      "Requester": "CORP\\svc-enroll",
      "Subject": "CN=svc-enroll",
      "SubjectKeyIdentifier": "b8 39 ac a8 96 d6 5a bc c6 9d 99 fe 0e f1 bf 45 d2 78 d6 23"
    },
    "event_id": "4887",
    "keywords": [
      "Audit Success"
    ],
    "level": "information",
    "opcode": "Info",
    "process": {
      "pid": 892,
      "thread": {
        "id": 412
      }
    },
    "provider_guid": "{54849625-5478-4994-A5BA-3E3B0328C30D}",
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": "342078",
    "task": "Certification Services",
    "time_created": "2026-09-26T00:04:00.904088Z"
  }
}`,
    },
  ],
};
