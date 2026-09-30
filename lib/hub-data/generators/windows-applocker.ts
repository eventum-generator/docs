import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsAppLocker: GeneratorMeta = {
  slug: 'windows-applocker',
  displayName: 'Windows AppLocker EXE/DLL and MSI/Script',
  category: 'endpoint',
  description:
    'Microsoft-Windows-AppLocker records from the EXE and DLL and MSI and Script channels as Winlogbeat-style ECS JSON with the raw event XML in event.original. About 9,250 records a day from 18 workstations and two administrators follow a working day in UTC. Signed binaries from Program Files, System32 and the corporate app folder are allowed, executables and scripts from user-writable folders are blocked, and three hosts audit scripts only. Recurring episodes show a blocked executable, a blocked script and an allowed proxy-binary launch in one logon session.',
  dataSource:
    'Microsoft-Windows-AppLocker, EXE and DLL and MSI and Script channels (8002-8007)',
  eventFormat: 'ECS JSON',
  originalFormat: 'XML',
  eventCount: 5,
  templateCount: 1,
  generatorId: 'windows-applocker',
  highlights: [
    'Raw AppLocker event XML in event.original',
    'About 9,250 records a day on a UTC working day',
    'Recurring blocked exe, blocked script, proxy launch chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Inside a standard user's ordinary logon session on their own enforced workstation, within about 25 minutes: an executable from a user-writable folder is blocked (8004, with the odd immediate retry), a script or installer from one is blocked (8007), then rundll32, regsvr32, mshta, certutil or MSBuild launches and is allowed by the Windows-folder default rule (8002). The steps share host.name, TargetUser and TargetLogonId. Episodes recur every anomaly_interval_hours of source time (default 24, minimum 6): the first starts within min(interval, 24 h) of the start of the data, at an hour drawn from the volume curve; each next is due one interval after the actual previous start and starts within a window of min(interval / 4, 6 h) centred on that time, busy hours strongly preferred, so start hours do not drift and missed time is not caught up. If no eligible session is open, the start waits for one, at most a few minutes. User and host differ from the previous episode, and the session's own launches continue around the episode. Every step and two-step prefix also occurs in the background; only the full ordered sequence in one session is distinctive.",
  eventTypes: [
    {
      id: '8002',
      description: 'EXE and DLL: executable/DLL allowed to run',
      frequency: '76.0% of records (~390 per host per day)',
      category: 'process',
    },
    {
      id: '8005',
      description: 'MSI and Script: script/MSI allowed to run',
      frequency: '20.9% of records (~108 per host per day)',
      category: 'process',
    },
    {
      id: '8004',
      description: 'EXE and DLL: executable/DLL prevented from running',
      frequency: '2.0% of records (~10 per host per day)',
      category: 'process',
    },
    {
      id: '8007',
      description: 'MSI and Script: script/MSI prevented from running',
      frequency:
        '1.0% of records (~6 per host per day on the 15 enforced hosts)',
      category: 'process',
    },
    {
      id: '8006',
      description:
        'MSI and Script: script/MSI would have been blocked (Audit only)',
      frequency:
        '0.15-0.3% of records (4.5-8 per host per day on the 3 audit hosts)',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Volume follows a working day in UTC, every day the same shape within about 3%: about 0.012 records per second across the fleet at night (00:00-07:00, 19:00-24:00), about 0.08 at 07:00-08:00 and 17:00-19:00, and about 0.24 at 08:00-17:00, which carries 85% of the daily volume. There is no weekly cycle and no holidays.',
    'Each standard user works on their own workstation in one logon session of most of a day (the screen stays locked overnight), about one logon a day starting with explorer.exe, and users differ in pace by up to about three times. Each of the two administrators makes about three visits a day of roughly 40 minutes to random workstations, and the default admin rules allow what they launch from user folders. In a session about 84% of operations launch an application, 15% start a script host or msiexec that loads several scripts or packages, and 1.5% try a file from a user-writable folder; a blocked file is retried with falling probability.',
    'Records of one moment (a script host and the scripts it loads, a blocked file and its retries) are a few seconds apart, median about 4 s in office hours and up to minutes at night, rather than milliseconds. Block rates of about 10 blocked executables and 6 blocked scripts per host per day are set by hand, not measured from a real fleet; a well-tuned managed fleet may block less.',
    'Fields follow the Elastic Windows integration output for these channels: event.code is a string, event.action is None, event.type is start, and log.level and winlog.level are information, warning or error per the Microsoft event table. The XML carries the RuleAndFileData fields in the documented order.',
    'Blocked executables and scripts from user folders, repeated blocks by one user within minutes, proxy-binary launches and the partial two-step combinations occur in both modes on the same users and workstations the episodes use. In ordinary activity a session with a blocked executable followed by a blocked script has no proxy-binary launch until about 32 minutes after that executable. With anomaly_mode true, counts of blocked executables, blocked scripts and proxy-binary launches are about one per episode higher than with false.',
    'RuleSddl uses the documented path-rule SDDL form; script and MSI rule GUIDs and the two custom rules (CorpApps, Configuration Manager cache) are invented, and only the three EXE default-rule GUIDs match Microsoft default policy. FileHash values are synthetic SHA-256 digests; Fqbn, PE and x509 fields follow the Microsoft and Elastic examples.',
    'Only runtime events 8002-8007: no policy-application 8000/8001, 8008, packaged-app 8020-8027 or Config CI and Managed Installer 8028-8040 events, no Packaged app channel, no DLL-load records and no non-RuleAndFileData layouts. Fleet size, session lengths and the application mix are synthetic; hosts, users, applications and files are editable in samples.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Mix in the anomaly chain; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time interval between episodes, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Allowed Chrome launch (8002)',
      json: String.raw`{
  "@timestamp": "2026-09-01T10:00:56.705Z",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "None",
    "category": [
      "process"
    ],
    "code": "8002",
    "dataset": "windows.applocker_exe_and_dll",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-AppLocker\" Guid=\"{cbda4dbf-8d5d-4f69-9578-be14aa540d22}\"/><EventID>8002</EventID><Version>0</Version><Level>4</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x8000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-01T10:00:56.7054870Z\"/><EventRecordID>169311</EventRecordID><Correlation/><Execution ProcessID=\"10540\" ThreadID=\"30480\"/><Channel>Microsoft-Windows-AppLocker/EXE and DLL</Channel><Computer>ws-legal-106.contoso.local</Computer><Security UserID=\"S-1-5-21-1504711230-2873091451-3906125842-1139\"/></System><UserData><RuleAndFileData xmlns=\"http://schemas.microsoft.com/schemas/event/Microsoft.Windows/1.0.0.0\"><PolicyNameLength>3</PolicyNameLength><PolicyName>EXE</PolicyName><RuleId>{921CC481-6E17-4653-8F75-050B80ACCA20}</RuleId><RuleNameLength>60</RuleNameLength><RuleName>(Default Rule) All files located in the Program Files folder</RuleName><RuleSddlLength>63</RuleSddlLength><RuleSddl>D:(XA;;FX;;;S-1-1-0;(APPID://PATH Contains \"%PROGRAMFILES%\\*\"))</RuleSddl><TargetUser>S-1-5-21-1504711230-2873091451-3906125842-1139</TargetUser><TargetProcessId>29320</TargetProcessId><FilePathLength>51</FilePathLength><FilePath>%PROGRAMFILES%\\GOOGLE\\CHROME\\APPLICATION\\CHROME.EXE</FilePath><FileHashLength>32</FileHashLength><FileHash>5407D34AF3F59BE98E28F7E62FA638D7A825927136FCE00705FDD29C5958F50D</FileHash><FqbnLength>89</FqbnLength><Fqbn>O=GOOGLE LLC, L=MOUNTAIN VIEW, S=CALIFORNIA, C=US\\GOOGLE CHROME\\CHROME.EXE\\118.0.5993.118</Fqbn><TargetLogonId>0x1bb7a92</TargetLogonId><FullFilePathLength>53</FullFilePathLength><FullFilePath>C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe</FullFilePath></RuleAndFileData></UserData></Event>",
    "provider": "Microsoft-Windows-AppLocker",
    "type": [
      "start"
    ]
  },
  "file": {
    "hash": {
      "sha256": "5407D34AF3F59BE98E28F7E62FA638D7A825927136FCE00705FDD29C5958F50D"
    },
    "name": "chrome.exe",
    "pe": {
      "file_version": "118.0.5993.118",
      "original_file_name": "CHROME.EXE",
      "product": "GOOGLE CHROME"
    },
    "x509": {
      "subject": {
        "country": [
          "US"
        ],
        "locality": "MOUNTAIN VIEW",
        "organization": [
          "GOOGLE LLC"
        ],
        "state_or_province": [
          "CALIFORNIA"
        ]
      }
    }
  },
  "host": {
    "name": "ws-legal-106.contoso.local"
  },
  "log": {
    "level": "information"
  },
  "message": "%PROGRAMFILES%\\GOOGLE\\CHROME\\APPLICATION\\CHROME.EXE was allowed to run.",
  "process": {
    "pid": 10540
  },
  "tags": [
    "preserve_original_event"
  ],
  "user": {
    "id": "S-1-5-21-1504711230-2873091451-3906125842-1139"
  },
  "winlog": {
    "channel": "Microsoft-Windows-AppLocker/EXE and DLL",
    "computer_name": "ws-legal-106.contoso.local",
    "event_id": "8002",
    "level": "information",
    "opcode": "Info",
    "process": {
      "pid": 10540,
      "thread": {
        "id": 30480
      }
    },
    "provider_guid": "{cbda4dbf-8d5d-4f69-9578-be14aa540d22}",
    "provider_name": "Microsoft-Windows-AppLocker",
    "record_id": "169311",
    "task": "None",
    "time_created": "2026-09-01T10:00:56.705Z",
    "user": {
      "identifier": "S-1-5-21-1504711230-2873091451-3906125842-1139"
    },
    "user_data": {
      "FileHash": "5407D34AF3F59BE98E28F7E62FA638D7A825927136FCE00705FDD29C5958F50D",
      "FileHashLength": 32,
      "FilePath": "%PROGRAMFILES%\\GOOGLE\\CHROME\\APPLICATION\\CHROME.EXE",
      "FilePathLength": 51,
      "Fqbn": "O=GOOGLE LLC, L=MOUNTAIN VIEW, S=CALIFORNIA, C=US\\GOOGLE CHROME\\CHROME.EXE\\118.0.5993.118",
      "FqbnLength": 89,
      "FullFilePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "FullFilePathLength": 53,
      "PolicyName": "EXE",
      "PolicyNameLength": 3,
      "RuleId": "{921CC481-6E17-4653-8F75-050B80ACCA20}",
      "RuleName": "(Default Rule) All files located in the Program Files folder",
      "RuleNameLength": 60,
      "RuleSddl": "D:(XA;;FX;;;S-1-1-0;(APPID://PATH Contains \"%PROGRAMFILES%\\*\"))",
      "RuleSddlLength": 63,
      "TargetLogonId": "0x1bb7a92",
      "TargetProcessId": 29320,
      "TargetUser": "S-1-5-21-1504711230-2873091451-3906125842-1139",
      "xml_name": "RuleAndFileData"
    },
    "version": 0
  }
}`,
    },
  ],
};
