/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsActiveDirectory: GeneratorMeta = {
  slug: 'windows-active-directory',
  displayName: 'Active Directory Domain Controller',
  category: 'identity',
  description:
    'Windows Security audit events from one Active Directory domain controller: Kerberos and NTLM authentication, privileged group membership, and directory changes.',
  format: ['JSON', 'ECS'],
  dataSource:
    'Windows Security channel on an Active Directory domain controller',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Kerberos and NTLM audit',
    'Administrative SubjectLogonId',
    'Correlated 5136 pair',
    'One-shot 130-second chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four-account password spray, successful TGT, RC4 service-ticket burst, Domain Admins addition, and delegation change within 130 seconds.',
  generatorId: 'ad',
  eventTypes: [
    {
      id: '4768',
      description: 'Kerberos TGT issued',
      frequency: '48% ordinary authentication weight',
      category: 'authentication',
    },
    {
      id: '4769',
      description: 'Kerberos service ticket issued',
      frequency: '44% ordinary authentication weight',
      category: 'authentication',
    },
    {
      id: '4776',
      description: 'NTLM credential validated',
      frequency: '6% ordinary authentication weight',
      category: 'authentication',
    },
    {
      id: '4771',
      description: 'Kerberos pre-authentication failed',
      frequency: '2% ordinary authentication weight',
      category: 'authentication',
    },
    {
      id: '4728',
      description: 'Member added to Domain Admins',
      frequency: 'One routine maintenance event plus one chain event',
      category: 'iam',
    },
    {
      id: '5136',
      description: 'Directory attribute value deleted or added',
      frequency: 'One routine pair plus one chain pair',
      category: 'iam, configuration',
    },
  ],
  realismFeatures: [
    'One domain controller with a strictly increasing Security record ID',
    'Routine Kerberos and NTLM events follow the weighted mix documented in the README',
    'RC4 service tickets target three distinct service accounts after the compromised TGT',
    'Privileged group and directory changes share SubjectLogonId; the 5136 pair shares OpCorrelationID',
    'Updated 4768 and 4769 encryption capability and ticket hash fields',
  ],
  parameters: [
    {
      name: 'domain',
      defaultValue: 'CONTOSO',
      description: 'NetBIOS domain name',
    },
    {
      name: 'dns_domain',
      defaultValue: 'contoso.local',
      description: 'Kerberos realm and DNS suffix',
    },
    {
      name: 'domain_dn',
      defaultValue: 'DC=contoso,DC=local',
      description: 'Distinguished-name suffix',
    },
    {
      name: 'domain_sid',
      defaultValue: 'S-1-5-21-3457937927-2839227994-823803824',
      description: 'Base domain SID',
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
      name: 'attack_ip',
      defaultValue: '10.99.4.22',
      description:
        'Shared bastion address used by the chain and ordinary authentication',
    },
    {
      name: 'attack_member',
      defaultValue: 'svc_sync',
      description: 'Account added to Domain Admins and modified',
    },
    {
      name: 'attack_member_rid',
      defaultValue: '2108',
      description: 'RID of that account',
    },
    {
      name: 'attack_object_guid',
      defaultValue: '{62ae5b92-0fab-4f0d-9393-1cfab99c9742}',
      description: 'Stable directory object GUID',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the linked intrusion chain; `false` emits only routine events',
    },
  ],
  sampleOutputs: [
    {
      title: '4728: member added to Domain Admins',
      json: String.raw`{
  "@timestamp": "2026-09-25T16:38:19+00:00",
  "agent": {
    "ephemeral_id": "943942bd-09ec-48aa-957d-2f12ecb83866",
    "id": "a51465f9-72f4-4761-89bb-55de00ec6701",
    "name": "dc01.contoso.local",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "ecs": {
    "version": "8.11.0"
  },
  "event": {
    "action": "added-member-to-group",
    "category": [
      "iam"
    ],
    "code": "4728",
    "kind": "event",
    "outcome": "success",
    "provider": "Microsoft-Windows-Security-Auditing",
    "sequence": 900379,
    "type": [
      "group",
      "change"
    ]
  },
  "group": {
    "domain": "CONTOSO",
    "id": "S-1-5-21-3457937927-2839227994-823803824-512",
    "name": "Domain Admins"
  },
  "host": {
    "name": "dc01.contoso.local",
    "os": {
      "family": "windows",
      "type": "windows"
    }
  },
  "log": {
    "level": "information"
  },
  "related": {
    "user": [
      "helpdesk.admin",
      "svc_sync"
    ]
  },
  "user": {
    "domain": "CONTOSO",
    "id": "S-1-5-21-3457937927-2839227994-823803824-1114",
    "name": "helpdesk.admin",
    "target": {
      "domain": "CONTOSO",
      "group": {
        "domain": "CONTOSO",
        "id": "S-1-5-21-3457937927-2839227994-823803824-512",
        "name": "Domain Admins"
      },
      "id": "S-1-5-21-3457937927-2839227994-823803824-2108",
      "name": "svc_sync"
    }
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "dc01.contoso.local",
    "event_data": {
      "MemberName": "CN=svc_sync,CN=Users,DC=contoso,DC=local",
      "MemberSid": "S-1-5-21-3457937927-2839227994-823803824-2108",
      "SubjectDomainName": "CONTOSO",
      "SubjectLogonId": "0x9648a9",
      "SubjectUserName": "helpdesk.admin",
      "SubjectUserSid": "S-1-5-21-3457937927-2839227994-823803824-1114",
      "TargetDomainName": "CONTOSO",
      "TargetSid": "S-1-5-21-3457937927-2839227994-823803824-512",
      "TargetUserName": "Domain Admins"
    },
    "event_id": "4728",
    "keywords": [
      "Audit Success"
    ],
    "level": "information",
    "logon": {
      "id": "0x9648a9"
    },
    "opcode": "Info",
    "outcome": "success",
    "process": {
      "pid": 516,
      "thread": {
        "id": 8007
      }
    },
    "provider_guid": "{54849625-5478-4994-a5ba-3e3b0328c30d}",
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": "900379",
    "task": "Security Group Management",
    "time_created": "2026-09-25T16:38:19+00:00",
    "version": 0
  }
}`,
    },
  ],
};
