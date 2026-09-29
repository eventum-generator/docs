import type { GeneratorMeta } from '@/lib/hub-types';

export const identityNetwrixAuditorCef: GeneratorMeta = {
  slug: 'identity-netwrix-auditor-cef',
  displayName: 'Netwrix Auditor CEF Export',
  category: 'identity',
  description:
    'Netwrix Auditor audit trail for Active Directory changes and domain logons, as exported by the SIEM Generic Integration for CEF Export add-on: each event is one Activity Record rendered as a CEF line in event.original and parsed into ECS the way the Filebeat decode_cef processor does it. A domain of about 3,000 staff and twelve operators produces about 22,000 records a day following a working day in UTC. Recurring episodes show an account created by an accounts desk operator, used to log on and deleted again by the same operator.',
  dataSource:
    'Netwrix Auditor 10.8 SIEM Generic Integration for CEF Export add-on: Active Directory and Logon Activity data sources',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 11,
  templateCount: 1,
  generatorId: 'netwrix',
  highlights: [
    'Header and extension key order of the published 10.8 CEF record',
    'About 22,000 records a day from 3,000 staff and twelve operators',
    'Short-lived account created, used and deleted by one desk operator',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One of the three accounts desk operators creates an account (Added user, with Modified user edits within seconds and sometimes Modified group); the account logs on to its workstation after a median of 25 minutes, sometimes after mistyped attempts, and to servers like any other account while it exists; the same operator deletes it (Removed user) a median of 10 minutes after that logon, 9 minutes to about 2.5 hours after the creation, typically 30-60 minutes. The records link by account name (last segment of filePath, the name after the domain in suser on logons) and by operator suser. Episodes recur every anomaly_interval_hours (default 24, minimum 6) of source time, but only in the desk working hours (08:00-17:00 UTC) and while a desk operator is at work. The first starts within the first min(interval, 24 h), or anywhere in the first working day when that span ends earlier, at an hour drawn from the desk working-hours curve. Each later one is due one interval after the previous actual start: a due time in 08:00-17:00 UTC gives a start within a window of min(interval / 4, 6 h) centred on it, a due time outside those hours a start drawn across the next working day, and a start at which no desk operator would still be at work is redrawn earlier within the same window. Missed episodes are not replayed. At 24 h episodes come one a day, 21-27 h apart; from 9 to 23 h one a day at any working hour, 15-33 h apart; from 6 to 8 h a second episode follows about one interval later on the same day when the first starts before 17:00 UTC minus the interval (about one day in three at 6 h, one in ten at 8 h), otherwise one a day. Above 24 h the same rule applies: a due time in desk hours keeps the interval, one in the evening or at night moves the episode into the next working day; multiples of 24 h keep their spacing, and an interval whose remainder after whole days is 9-15 h behaves like the next whole number of days (36 h gives gaps of about 44-52 h). The operator differs from the previous episode unless no other desk operator is at work; account name, container, workstation, edits, groups and mistyped attempts are new each time. Each episode adds its own records, so account creations and deletions are about one per episode higher than in background only. Every step also occurs on its own in both modes, by the same three operators; only the complete ordered chain is absent from background, where an account is never offboarded within five hours of its creation.',
  eventTypes: [
    {
      id: 'Successful Logon Logon',
      description:
        'Class Successful Logon, Logon Activity: workstation and server logons',
      frequency: '91.4% of records',
      category: 'authentication',
    },
    {
      id: 'Failed Logon Logon',
      description: 'Class Failed Logon, Logon Activity',
      frequency: '6.1% of records',
      category: 'authentication',
    },
    {
      id: 'Modified user',
      description: 'Class Modified, Active Directory',
      frequency: '1.3% of records',
      category: 'iam',
    },
    {
      id: 'Modified group',
      description: 'Class Modified, Active Directory',
      frequency: '0.79% of records',
      category: 'iam',
    },
    {
      id: 'Modified computer',
      description: 'Class Modified, Active Directory',
      frequency: '0.14% of records',
      category: 'iam',
    },
    {
      id: 'Added computer',
      description: 'Class Added, Active Directory',
      frequency: '0.10% of records',
      category: 'iam',
    },
    {
      id: 'Removed computer',
      description: 'Class Removed, Active Directory',
      frequency: '0.04% of records',
      category: 'iam',
    },
    {
      id: 'Added user',
      description: 'Class Added, Active Directory',
      frequency: '0.038% of records',
      category: 'iam',
    },
    {
      id: 'Removed user',
      description: 'Class Removed, Active Directory',
      frequency: '0.036% of records',
      category: 'iam',
    },
    {
      id: 'Added group',
      description: 'Class Added, Active Directory',
      frequency: '0.02% of records',
      category: 'iam',
    },
    {
      id: 'Removed group',
      description: 'Class Removed, Active Directory',
      frequency: '0.02% of records',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'About 22,000 records a day follow a working day in UTC: 75-95 an hour at 00-06 and 20-24, about 660 at 06-07, 1,850-2,450 during the 07-09 morning arrivals, 1,780-2,000 at 09-16, 1,650 falling to 580 at 16-19 and about 150 at 19-20. The number of people logging on per hour goes from 45-65 at night to 1,000-1,400 between 07:00 and 16:00. There is no weekly cycle: every day is a working day.',
    'Each person opens the working day with a workstation logon, mostly between 06:00 and 10:00 UTC (peak around 08:00), and stays about nine hours; on a given day about 85% come in and a few work late or at night. During the day each logs on to servers every hour or two. About 7% of workstation logons and 3% of server logons follow one to four mistyped attempts, each repeat less likely than the one before, and the successful logon to the same host follows a mistyped password after a median of 10 s. An old saved password also produces failed logons.',
    'Three admins and nine helpdesk operators reset passwords, edit accounts, change group memberships and manage computer accounts. They come in mostly between 07:00 and 08:30 UTC unless absent (about one day in twelve) and stay about nine hours; directory changes run 08:00-17:00 UTC at about 45 an hour, and at about 2-3 an hour outside those hours from an operator at work or on call.',
    'About twelve account tasks a day, 08:00-17:00 UTC, nine in ten of them by an accounts desk of three helpdesk operators: onboarding and offboarding in equal numbers, keeping the staff pool within 85-120% of staff_count, and about two a day of accounts created by mistake or for a test and deleted within minutes without being used. About three in ten new hires log on at the desk (median 25 minutes after creation); offboarding, half direct deletions and half disabled first, hits accounts that logged on shortly before. Each desk operator creates and deletes about eight accounts per four days. An account is not offboarded while a password reset or a logon of its own is still in progress.',
    'Netwrix publishes one complete raw record for the current add-on (10.8, Added user) and no field map. The header and its five extension keys shost, cat, suser, filePath and start (MMM dd yyyy HH:mm:ss) keep the published order, with backslashes escaped as in the sample. Records of other classes, the data source as header product, the <Action> <ObjectType> name (which gives Successful Logon Logon), severity 0, header version 1.0 and start in UTC are inferred.',
    'The Activity Record Workstation and msg (Details) are not emitted because their CEF form is not published, so group membership changes do not name the member. Times have second precision, and @timestamp is the record time, not the export time of the add-on scheduled batches. Records that belong together follow each other seconds apart, not milliseconds, and can be minutes apart at night.',
    'ECS parsing follows decode_cef (source.domain = shost, source.user.name = suser, file.path = filePath); event.category, event.type, event.action, event.outcome, user.* and related.* are enrichment an ingest pipeline would add. Only Active Directory user, group and computer changes and Logon Activity logons are modeled; volumes, mixes and names are synthetic.',
    'Lockout records are not modeled; the data assumes no account lockout, or a threshold of 10 or more failed attempts with the counter reset after at most 30 minutes without a failure (the current Windows default is 10 attempts and 10 minutes). Counted that way, the failed logons of one account rarely exceed six and reached eight or nine at most in two weeks of data; runs of ten or more are possible but very rare.',
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
      description:
        'Episode interval in hours (6 to 8760); episodes start only in desk working hours, so the spacing follows the anomaly chain rules',
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
      defaultValue: '3000',
      description:
        'Staff accounts (100 to 20,000); onboarding and offboarding keep the pool within 85-120% of it. The daily record volume and hour curve do not change with it',
    },
  ],
  sampleOutputs: [
    {
      title: 'Added user record of an episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T13:19:16Z",
  "cef": {
    "device": {
      "event_class_id": "Added",
      "product": "Active Directory",
      "vendor": "Netwrix",
      "version": "1.0"
    },
    "extensions": {
      "deviceEventCategory": "user",
      "filePath": "\\local\\example\\Users\\fpeterson2",
      "sourceHostName": "dc-03.example.local",
      "sourceUserName": "EXAMPLE\\hd.scampbell",
      "startTime": "2026-09-01T13:19:16Z"
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
    "original": "CEF:0|Netwrix|Active Directory|1.0|Added|Added user|0|shost=dc-03.example.local cat=user suser=EXAMPLE\\\\hd.scampbell filePath=\\\\local\\\\example\\\\Users\\\\fpeterson2 start=Sep 01 2026 13:19:16",
    "severity": 0,
    "start": "2026-09-01T13:19:16Z",
    "type": [
      "user",
      "creation"
    ]
  },
  "file": {
    "path": "\\local\\example\\Users\\fpeterson2"
  },
  "message": "Added user",
  "observer": {
    "product": "Active Directory",
    "vendor": "Netwrix",
    "version": "1.0"
  },
  "related": {
    "hosts": [
      "dc-03.example.local"
    ],
    "user": [
      "hd.scampbell",
      "fpeterson2"
    ]
  },
  "source": {
    "domain": "dc-03.example.local",
    "user": {
      "name": "EXAMPLE\\hd.scampbell"
    }
  },
  "user": {
    "domain": "EXAMPLE",
    "name": "hd.scampbell",
    "target": {
      "name": "fpeterson2"
    }
  }
}`,
    },
  ],
};
