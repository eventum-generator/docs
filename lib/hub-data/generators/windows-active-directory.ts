import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsActiveDirectory: GeneratorMeta = {
  displayName: 'Active Directory audit',
  category: 'identity',
  description:
    'About 21,800 normalized Security records per day from a small domain, with Kerberos, NTLM and temporary group membership.',
  dataSource: 'Windows Security domain-controller audit',
  format: ['JSON', 'ECS'],
  highlights: [
    'Human office hours and twelve continuous monitoring accounts',
    'Every modeled grant ends after 20–40 minutes in both modes',
  ],
  anomalyChain:
    '4771 failure, successful 4768, RC4 4769 and a 4728 Domain Admins grant by one administrator within ten minutes. Authentication shares SID/address and TGT. Default interval is 24 hours; administrators rotate. First start is within min(interval,24h), weighted by daily activity. Later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'ad',
  eventTypes: [
    {
      id: '4768',
      description: 'Kerberos TGT issued',
      frequency: '47% of authentication',
      category: 'authentication',
    },
    {
      id: '4769',
      description: 'Service ticket issued',
      frequency: '45% of authentication',
      category: 'authentication',
    },
    {
      id: '4776',
      description: 'NTLM validation',
      frequency: '6% of authentication',
      category: 'authentication',
    },
    {
      id: '4771',
      description: 'Kerberos pre-authentication failed',
      frequency: '2% of authentication',
      category: 'authentication',
    },
    {
      id: '4728',
      description: 'Temporary global-group grant',
      frequency: 'About 12/day',
      category: 'iam',
    },
    {
      id: '4729',
      description: 'Temporary grant removed',
      frequency: 'Per grant after 20–40 minutes',
      category: 'iam',
    },
    {
      id: '5136',
      description: 'Directory attribute replaced',
      frequency: 'About six pairs/day',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Human office hours and twelve continuous monitoring accounts',
    'Every modeled grant ends after 20–40 minutes in both modes',
    'Selected ECS projection; version 2 Kerberos profile assumes patched servers and RC4-enabled service accounts',
  ],
  slug: 'windows-active-directory',
  templateCount: 2,
  generationModes: ['background', 'anomaly'],
  eventCount: 7,
  parameters: [
    {
      name: 'domain',
      defaultValue: 'CONTOSO',
      description: 'NetBIOS domain',
    },
    {
      name: 'dns_domain',
      defaultValue: 'contoso.local',
      description: 'DNS domain and Kerberos realm',
    },
    {
      name: 'domain_dn',
      defaultValue: 'DC=contoso,DC=local',
      description: 'Distinguished-name suffix',
    },
    {
      name: 'domain_sid',
      defaultValue: 'S-1-5-21-3457937927-2839227994-823803824',
      description: 'Domain SID prefix',
    },
    {
      name: 'dc_host',
      defaultValue: 'dc01.contoso.local',
      description: 'Controller hostname',
    },
    {
      name: 'dc_agent_id',
      defaultValue: 'a51465f9-72f4-4761-89bb-55de00ec6701',
      description: 'Stable collector ID',
    },
    {
      name: 'dc_ephemeral_id',
      defaultValue: '943942bd-09ec-48aa-957d-2f12ecb83866',
      description: 'Collector session ID',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Filebeat version',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable correlated episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, from 6 to 8760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-01T07:02:05.777167+00:00", "agent": {"ephemeral_id": "943942bd-09ec-48aa-957d-2f12ecb83866", "id": "a51465f9-72f4-4761-89bb-55de00ec6701", "name": "dc01.contoso.local", "type": "filebeat", "version": "8.17.0"}, "ecs": {"version": "8.11.0"}, "event": {"action": "added-member-to-group", "category": ["iam"], "code": "4728", "kind": "event", "outcome": "success", "provider": "Microsoft-Windows-Security-Auditing", "sequence": 902240, "type": ["group", "change"]}, "group": {"domain": "CONTOSO", "id": "S-1-5-21-3457937927-2839227994-823803824-2601", "name": "Maintenance Operators"}, "host": {"name": "dc01.contoso.local", "os": {"family": "windows", "type": "windows"}}, "log": {"level": "information"}, "related": {"user": ["olga.sokolova", "svc_maintenance_2"]}, "user": {"domain": "CONTOSO", "id": "S-1-5-21-3457937927-2839227994-823803824-1109", "name": "olga.sokolova", "target": {"domain": "CONTOSO", "group": {"domain": "CONTOSO", "id": "S-1-5-21-3457937927-2839227994-823803824-2601", "name": "Maintenance Operators"}, "id": "S-1-5-21-3457937927-2839227994-823803824-2202", "name": "svc_maintenance_2"}}, "winlog": {"channel": "Security", "computer_name": "dc01.contoso.local", "event_data": {"MemberName": "CN=svc_maintenance_2,CN=Users,DC=contoso,DC=local", "MemberSid": "S-1-5-21-3457937927-2839227994-823803824-2202", "SubjectDomainName": "CONTOSO", "SubjectLogonId": "0x91e545", "SubjectUserName": "olga.sokolova", "SubjectUserSid": "S-1-5-21-3457937927-2839227994-823803824-1109", "TargetDomainName": "CONTOSO", "TargetSid": "S-1-5-21-3457937927-2839227994-823803824-2601", "TargetUserName": "Maintenance Operators"}, "event_id": "4728", "keywords": ["Audit Success"], "level": "information", "logon": {"id": "0x91e545"}, "opcode": "Info", "outcome": "success", "process": {"pid": 516, "thread": {"id": 1467}}, "provider_guid": "{54849625-5478-4994-a5ba-3e3b0328c30d}", "provider_name": "Microsoft-Windows-Security-Auditing", "record_id": "902240", "task": "Security Group Management", "time_created": "2026-09-01T07:02:05.777167+00:00", "version": 0}}`,
    },
  ],
};
