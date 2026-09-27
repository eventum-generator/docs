import type { GeneratorMeta } from '@/lib/hub-types';

export const identityNetwrixAuditorCef: GeneratorMeta = {
  slug: 'identity-netwrix-auditor-cef',
  displayName: 'Netwrix Auditor CEF Export',
  category: 'identity',
  description:
    'Netwrix Auditor audit trail for Active Directory changes and domain logons, as exported by the SIEM Generic Integration for CEF Export add-on: each event is one Activity Record rendered as a CEF line in event.original and parsed into ECS the way the Filebeat decode_cef processor does it. Staff log on in randomly phased work sessions while helpdesk and admin operators reset passwords, edit accounts and groups, onboard and offboard users and manage computer accounts. Recurring episodes show an account created, used to log on and deleted again by the same operator.',
  dataSource:
    'Netwrix Auditor 10.8 SIEM Generic Integration for CEF Export add-on: Active Directory and Logon Activity data sources',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 11,
  templateCount: 1,
  generatorId: 'netwrix',
  highlights: [
    'Header and extension key order of the published 10.8 CEF record',
    'Directory changes and logons from staff and eight operators',
    'Short-lived account created, used and deleted by one operator',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours of source time by default (minimum 6), the first due 1 h after generation starts; from each due time plus a random delay of up to min(1 h, interval / 8), the next background pair of an account created by mistake and deleted within minutes becomes the episode, which adds a wait of its own (about 2 h on average). The first episode started 4.5-6.6 h after generation began, and episodes were 24.3-31.6 h apart at the default (mean about 26 h); the next due time counts from the actual creation, with no replay of missed episodes. The operator adds the user, the fresh account logs on to its workstation (median 25 min later), and the same operator removes it, usually within one or two hours; the only addition to background is that logon. The operator differs from the previous episode.',
  eventTypes: [
    {
      id: 'Successful Logon Logon',
      description: 'Class Successful Logon, Logon Activity data source',
      frequency: '70.1% measured share',
      category: 'authentication',
    },
    {
      id: 'Failed Logon Logon',
      description: 'Class Failed Logon, Logon Activity data source',
      frequency: '14.2% measured share',
      category: 'authentication',
    },
    {
      id: 'Modified user',
      description: 'Class Modified, Active Directory data source',
      frequency: '8.2% measured share',
      category: 'iam',
    },
    {
      id: 'Modified group',
      description: 'Class Modified, Active Directory data source',
      frequency: '4.0% measured share',
      category: 'iam',
    },
    {
      id: 'Added user',
      description: 'Class Added, Active Directory data source',
      frequency: '1.0% measured share',
      category: 'iam',
    },
    {
      id: 'Removed user',
      description: 'Class Removed, Active Directory data source',
      frequency: '1.0% measured share',
      category: 'iam',
    },
    {
      id: 'Modified computer',
      description: 'Class Modified, Active Directory data source',
      frequency: '0.7% measured share',
      category: 'iam',
    },
    {
      id: 'Added computer',
      description: 'Class Added, Active Directory data source',
      frequency: '0.3% measured share',
      category: 'iam',
    },
    {
      id: 'Removed computer',
      description: 'Class Removed, Active Directory data source',
      frequency: '0.2% measured share',
      category: 'iam',
    },
    {
      id: 'Added group',
      description: 'Class Added, Active Directory data source',
      frequency: '0.1% measured share',
      category: 'iam',
    },
    {
      id: 'Removed group',
      description: 'Class Removed, Active Directory data source',
      frequency: '0.08% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Eight operators (three adm.*, five hd.*) on randomly phased shifts take one task about every 10-20 minutes while on duty; when nobody is on shift, an on-call operator handles a task about every 40 minutes, so directory changes never stop for hours. Staff sessions are randomly phased per user, with no working-hours or weekday cycle.',
    'Every chain step also occurs on its own in both modes: onboarding with a first logon at the desk (about a third of new hires), accounts created by mistake and deleted within minutes without a logon, offboarding of accounts that logged on shortly before, password resets followed by a logon, repeated failed logons and quick successive edits by one operator. Only the complete ordered chain is absent from background.',
    'Netwrix publishes one complete raw record for the current add-on (10.8, Added user) and no field map. The header and its five extension keys shost, cat, suser, filePath and start keep the published order, with backslashes escaped as in the sample. Other classes, the product and name pattern (which gives Successful Logon Logon), severity 0, header version 1.0 and UTC start are inferred.',
    'The Activity Record Workstation and msg (Details) are not emitted because their CEF form is not published, so group membership changes do not name the member. Times have second precision, and @timestamp is the record time, not the export time of the scheduled batches.',
    'ECS parsing follows decode_cef; event.category, event.type, event.action, event.outcome, user.* and related.* are enrichment an ingest pipeline would add. Only Active Directory user, group and computer changes and Logon Activity logons are modeled; volumes, mixes, names and operator workload are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add anomaly chain episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours of source time (6 to 8760)',
    },
    {
      name: 'domain',
      defaultValue: 'example.local',
      description: String.raw`DNS domain: host names and the \local\example object path prefix`,
    },
    {
      name: 'netbios',
      defaultValue: 'EXAMPLE',
      description: 'NetBIOS domain in suser',
    },
    {
      name: 'staff_count',
      defaultValue: '200',
      description:
        'Initial number of staff accounts (20 to 2000); onboarding and offboarding keep the pool within 85-120% of it',
    },
  ],
  sampleOutputs: [
    {
      title: 'Added user record of an episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T05:59:51Z",
  "cef": {
    "device": {
      "event_class_id": "Added",
      "product": "Active Directory",
      "vendor": "Netwrix",
      "version": "1.0"
    },
    "extensions": {
      "deviceEventCategory": "user",
      "filePath": "\\local\\example\\Corp\\Staff\\amurphy",
      "sourceHostName": "dc-02.example.local",
      "sourceUserName": "EXAMPLE\\hd.dhoward",
      "startTime": "2026-09-01T05:59:51Z"
    },
    "name": "Added user",
    "severity": "0",
    "version": "0"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "added-user",
    "category": [
      "iam"
    ],
    "code": "Added",
    "dataset": "cef.log",
    "kind": "event",
    "module": "cef",
    "original": "CEF:0|Netwrix|Active Directory|1.0|Added|Added user|0|shost=dc-02.example.local cat=user suser=EXAMPLE\\\\hd.dhoward filePath=\\\\local\\\\example\\\\Corp\\\\Staff\\\\amurphy start=Sep 01 2026 05:59:51",
    "severity": 0,
    "start": "2026-09-01T05:59:51Z",
    "type": [
      "user",
      "creation"
    ]
  },
  "file": {
    "path": "\\local\\example\\Corp\\Staff\\amurphy"
  },
  "message": "Added user",
  "observer": {
    "product": "Active Directory",
    "vendor": "Netwrix",
    "version": "1.0"
  },
  "related": {
    "hosts": [
      "dc-02.example.local"
    ],
    "user": [
      "hd.dhoward",
      "amurphy"
    ]
  },
  "source": {
    "domain": "dc-02.example.local",
    "user": {
      "name": "EXAMPLE\\hd.dhoward"
    }
  },
  "user": {
    "domain": "EXAMPLE",
    "name": "hd.dhoward",
    "target": {
      "name": "amurphy"
    }
  }
}`,
    },
  ],
};
