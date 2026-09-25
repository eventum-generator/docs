import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftAdcs: GeneratorMeta = {
  slug: 'identity-microsoft-adcs',
  displayName: 'Microsoft AD CS Audit',
  category: 'identity',
  dataSource: 'Windows Security events 4885-4888 from Certificate Services',
  description:
    'Certificate request, issue, denial and CA audit-setting events with a switchable sensitive enrollment sequence.',
  generatorId: 'microsoft-adcs',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Request and disposition share a native RequestId',
    'Windows Security XML retained in event.original',
    'CA audit-filter change before privileged-UPN certificate issue',
  ],
  anomalyChain:
    'A CA audit-filter change is followed by a certificate request and issue for a privileged UPN from the same account.',
  eventTypes: [
    {
      id: '4886',
      description: 'Certificate request received',
      frequency: '50% baseline',
      category: 'configuration',
    },
    {
      id: '4887',
      description: 'Certificate request issued',
      frequency: '47% baseline',
      category: 'configuration',
    },
    {
      id: '4888',
      description: 'Certificate request denied',
      frequency: '3% baseline',
      category: 'configuration',
    },
    {
      id: '4885',
      description: 'CA audit filter changed',
      frequency: 'Chain only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Routine request and disposition events share CA host, requester and RequestId.',
    'Native 4885 actor fields identify who changed the audit filter.',
    'The anomaly assumes a template that accepts a supplied subject UPN; the event does not prove exploitability.',
  ],
  format: ['JSON', 'ECS', 'XML'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include CA-change/enrollment chain; false emits only background',
    },
    {
      name: 'ca_host',
      defaultValue: 'ca01.corp.example',
      description: 'Certificate authority server',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Requester domain',
    },
    {
      name: 'ca_name',
      defaultValue: 'CORP-CA',
      description: 'CA display name',
    },
    {
      name: 'suspicious_requester',
      defaultValue: 'svc-enroll',
      description: 'Account in the anomaly',
    },
    {
      name: 'privileged_upn',
      defaultValue: 'administrator@corp.example',
      description: 'Requested subject UPN',
    },
    {
      name: 'enrollment_template',
      defaultValue: 'User',
      description: 'Certificate template name',
    },
  ],
  sampleOutputs: [
    {
      title: 'Microsoft AD CS Audit event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:04:47+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "certificate-requested",
    "category": [
      "configuration"
    ],
    "code": "4886",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>4886</EventID><Version>0</Version><Level>0</Level><Task>12805</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T12:04:47+00:00\"/><EventRecordID>310001</EventRecordID><Correlation/><Execution ProcessID=\"652\" ThreadID=\"368\"/><Channel>Security</Channel><Computer>ca01.corp.example</Computer><Security/></System><EventData><Data Name=\"RequestId\">3001</Data><Data Name=\"Requester\">CORP\\boris</Data><Data Name=\"Attributes\">CertificateTemplate:User</Data></EventData></Event>",
    "outcome": "success",
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
  "winlog": {
    "channel": "Security",
    "computer_name": "ca01.corp.example",
    "event_data": {
      "Attributes": "CertificateTemplate:User",
      "RequestId": "3001",
      "Requester": "CORP\\boris"
    },
    "event_id": 4886,
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": 310001,
    "task": "Certification Services"
  }
}`,
    },
  ],
};
