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
    '258/263 reference field paths modeled',
    'New service-account targets and correlation IDs per cycle',
    'Recurring 130-second correlated sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 3600 ordinary records and each further 3600-record interval, four-user password spray precedes a TGT success, three RC4 service tickets, a Domain Admins addition and a delegation-value delete/add pair within 130 seconds. Each cycle uses another pre-existing account and fresh episode IDs; approved maintenance and the same actor/IP/actions also occur in background.',
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
      frequency: 'One approved addition per cycle; also episodes',
      category: 'iam',
    },
    {
      id: '5136',
      description: 'Directory attribute value deleted or added',
      frequency: 'One approved pair per cycle; also episodes',
      category: 'iam, configuration',
    },
  ],
  realismFeatures: [
    'Security record IDs increase with event time on one domain controller; ordinary maintenance shares the episode object and establishes the later deleted value.',
    'Targets have distinct pre-existing service-account names/RIDs and stable object GUIDs within each cycle; membership is never added twice.',
    '4768 ResponseTicket joins 4769 RequestTicketHash for the same account/client; each sweep retains its TGT and client LogonGuid. RC4-only requests use an advertised RC4 session key.',
    '4728 and 5136 share SubjectLogonId; the 5136 pair shares OpCorrelationID. KDC-to-administration correlation is only by account, IP and time.',
    'One current TGT per modeled account/client; initial requests may use credentials predating the capture. Ticket expiry, renewals and simultaneous credentials are outside scope.',
    'Sensitive LDAP/controller delegation values occur in episodes; background maintenance shares actors and objects but replaces CIFS values.',
    '4768/4769 version 2 models Server 2016/2019/2022 after the January 14, 2025 update; 5136 requires Directory Service Changes auditing and a matching SACL.',
    '258/263 reference field paths are modeled (98.1%); this is normalized synthetic ECS, not raw XML replay or production-calibrated rates. Changing msDS-AllowedToDelegateTo alone does not prove usable delegation.',
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
        'Shared bastion address used by the chain and some ordinary authentications',
    },
    {
      name: 'attack_member',
      defaultValue: 'svc_sync',
      description:
        'Prefix for pre-existing service accounts in both modes; cycle targets receive numeric suffixes',
    },
    {
      name: 'attack_member_rid',
      defaultValue: '2108',
      description:
        'First target RID; later account RIDs increase without reuse',
    },
    {
      name: 'attack_object_guid',
      defaultValue: '{62ae5b92-0fab-4f0d-9393-1cfab99c9742}',
      description:
        'First target GUID; later objects get new GUIDs, stable within their cycle',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit periodic linked episodes; `false` emits only routine events',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '3600',
      description: 'Ordinary records before the first episode',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '3600',
      description:
        'Ordinary records between episodes; both timing values are clamped to at least 102 for complete maintenance',
    },
  ],
  sampleOutputs: [
    {
      title: '4728: member added to Domain Admins',
      json: String.raw`{
  "@timestamp": "2026-09-25T01:02:08+00:00",
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
    "sequence": 903729,
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
      "svc_sync_001"
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
      "name": "svc_sync_001"
    }
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "dc01.contoso.local",
    "event_data": {
      "MemberName": "CN=svc_sync_001,CN=Users,DC=contoso,DC=local",
      "MemberSid": "S-1-5-21-3457937927-2839227994-823803824-2108",
      "SubjectDomainName": "CONTOSO",
      "SubjectLogonId": "0x338f51",
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
      "id": "0x338f51"
    },
    "opcode": "Info",
    "outcome": "success",
    "process": {
      "pid": 516,
      "thread": {
        "id": 4703
      }
    },
    "provider_guid": "{54849625-5478-4994-a5ba-3e3b0328c30d}",
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": "903729",
    "task": "Security Group Management",
    "time_created": "2026-09-25T01:02:08+00:00",
    "version": 0
  }
}`,
    },
  ],
};
