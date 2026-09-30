import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftAdcs: GeneratorMeta = {
  displayName: 'Microsoft AD CS audit',
  category: 'identity',
  description:
    'About 2,040 selected Security records per day from one synthetic certification authority, with reconstructed version 0 XML.',
  dataSource: 'Windows Server 2012 Certification Services audit',
  format: ['JSON', 'ECS'],
  highlights: [
    'Request and disposition share request ID, requester, process and thread',
    'Ordinary and episode audit reductions end after 15–32 minutes',
  ],
  anomalyChain:
    'One administrator reduces audit filter 127 to 119, submits a supplied-UPN request and receives issuance for its request ID within three minutes. Default interval is 24 hours; the two administrators alternate. First start is within min(interval,24h), weighted by daily activity. Later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'adcs',
  eventTypes: [
    {
      id: '4886',
      description: 'Request received',
      frequency: '50%',
      category: 'iam',
    },
    {
      id: '4887',
      description: 'Certificate issued',
      frequency: '49%',
      category: 'iam',
    },
    {
      id: '4888',
      description: 'Short-key denial',
      frequency: '1%',
      category: 'iam',
    },
    {
      id: '4885',
      description: 'Audit filter changed or restored',
      frequency: 'Less than 1%',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Request and disposition share request ID, requester, process and thread',
    'Ordinary and episode audit reductions end after 15–32 minutes',
    'The selected records do not prove certificate contents or authentication capability',
  ],
  slug: 'identity-microsoft-adcs',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 4,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring correlations',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Recurrence hours, minimum 6',
    },
    {
      name: 'ca_host',
      defaultValue: 'ca01.corp.example',
      description: 'CA server hostname',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Account domain',
    },
    {
      name: 'ca_name',
      defaultValue: 'CORP-CA',
      description: 'Configured CA name, collector context',
    },
    {
      name: 'suspicious_requester',
      defaultValue: 'svc-enroll',
      description: 'First administrator, shared by ordinary work and episodes',
    },
    {
      name: 'privileged_upn',
      defaultValue: 'administrator@corp.example',
      description: 'Requested UPN shared by both modes',
    },
    {
      name: 'routine_template',
      defaultValue: 'CorpUserCN',
      description: 'Fictional CN-from-AD enrollment template',
    },
    {
      name: 'enrollment_template',
      defaultValue: 'CorpUserSuppliedSAN',
      description: 'Fictional supplied-subject enrollment template',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-20T00:01:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "certificate-issued", "category": ["iam"], "code": "4887", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/\u003e\u003cEventID\u003e4887\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e0\u003c/Level\u003e\u003cTask\u003e12805\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8020000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-20T00:01:00.000000Z\"/\u003e\u003cEventRecordID\u003e310040\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"652\" ThreadID=\"724\"/\u003e\u003cChannel\u003eSecurity\u003c/Channel\u003e\u003cComputer\u003eca01.corp.example\u003c/Computer\u003e\u003cSecurity/\u003e\u003c/System\u003e\u003cEventData\u003e\u003cData Name=\"RequestId\"\u003e3001\u003c/Data\u003e\u003cData Name=\"Requester\"\u003eCORP\\device28$\u003c/Data\u003e\u003cData Name=\"Attributes\"\u003eCertificateTemplate:CorpUserCN\u003c/Data\u003e\u003cData Name=\"Disposition\"\u003e3\u003c/Data\u003e\u003cData Name=\"SubjectKeyIdentifier\"\u003ed2 e2 10 0e 83 83 55 37 58 e3 26 db 96 e0 24 df e6 03 58 26\u003c/Data\u003e\u003cData Name=\"Subject\"\u003eCN=device28$\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "outcome": "success", "provider": "Microsoft-Windows-Security-Auditing", "type": ["creation"]}, "host": {"name": "ca01.corp.example"}, "observer": {"name": "CORP-CA", "type": "certificate-authority"}, "related": {"user": ["device28$"]}, "user": {"domain": "CORP", "name": "device28$"}, "winlog": {"channel": "Security", "computer_name": "ca01.corp.example", "event_data": {"Attributes": "CertificateTemplate:CorpUserCN", "Disposition": "3", "RequestId": "3001", "Requester": "CORP\\device28$", "Subject": "CN=device28$", "SubjectKeyIdentifier": "d2 e2 10 0e 83 83 55 37 58 e3 26 db 96 e0 24 df e6 03 58 26"}, "event_id": "4887", "keywords": ["Audit Success"], "level": "information", "opcode": "Info", "process": {"pid": 652, "thread": {"id": 724}}, "provider_guid": "{54849625-5478-4994-A5BA-3E3B0328C30D}", "provider_name": "Microsoft-Windows-Security-Auditing", "record_id": "310040", "task": "Certification Services", "time_created": "2026-09-20T00:01:00.000000Z"}}`,
    },
  ],
};
