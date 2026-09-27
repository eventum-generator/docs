import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsAppLocker: GeneratorMeta = {
  slug: 'windows-applocker',
  displayName: 'Windows AppLocker EXE/DLL and MSI/Script',
  category: 'endpoint',
  description:
    'Microsoft-Windows-AppLocker records from the EXE and DLL and MSI and Script channels as Winlogbeat-style ECS JSON with the raw event XML in event.original. Workstations under an enforced policy allow signed binaries from Program Files, System32 and the corporate app folder and block executables and scripts from user-writable folders; three hosts audit scripts only. Recurring episodes show a blocked executable, a blocked script and an allowed proxy-binary launch in one logon session.',
  dataSource:
    'Microsoft-Windows-AppLocker, EXE and DLL and MSI and Script channels (8002-8007)',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'windows-applocker',
  highlights: [
    'Raw AppLocker event XML in event.original',
    'Allowed, blocked and audit-only records from two channels',
    'Recurring blocked exe, blocked script, proxy launch chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours of source time by default (the first about 1 hour after generation starts, each next one interval after the previous actual start plus a random delay of up to min(1 h, interval/8), with no catch-up; a start waits for an eligible open session, checked once a minute), inside a standard user's ordinary logon session on their own enforced workstation and within about 25 minutes: an executable from a user-writable folder is blocked (8004), a script or installer from one is blocked (8007), then rundll32, regsvr32, mshta, certutil or MSBuild launches and is allowed (8002). The steps share host, user SID and logon ID; user and host differ from the previous episode. Every step and two-step prefix also occurs in background.",
  eventTypes: [
    {
      id: '8002',
      description: 'EXE and DLL: executable/DLL allowed to run',
      frequency: '76.0% measured share (~459 per host per day)',
      category: 'process',
    },
    {
      id: '8005',
      description: 'MSI and Script: script/MSI allowed to run',
      frequency: '20.9% measured share (~126 per host per day)',
      category: 'process',
    },
    {
      id: '8004',
      description: 'EXE and DLL: executable/DLL prevented from running',
      frequency: '2.0% measured share (~12 per host per day)',
      category: 'process',
    },
    {
      id: '8007',
      description: 'MSI and Script: script/MSI prevented from running',
      frequency: '0.9% measured share (~5.5 per host per day)',
      category: 'process',
    },
    {
      id: '8006',
      description:
        'MSI and Script: script/MSI would have been blocked (Audit only)',
      frequency: '0.2% measured share (~1.2 per day on the 3 audit hosts)',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Shares measured over a 96-hour default capture of 43,514 records from 18 workstations. Block rates (about 12 blocked executables and 5.5 blocked scripts per host per day) are set by hand, not measured from a real fleet; a well-tuned managed fleet may block less.',
    'Fields follow the Elastic Windows integration output for these channels: event.code is a string, event.action is None, event.type is start, and log.level and winlog.level are information, warning or error per the Microsoft event table. The XML carries the RuleAndFileData fields in the documented order.',
    'Every ingredient of the chain occurs in background in both modes: blocked executables and scripts from user folders, repeated blocks by one user within minutes, proxy-binary launches and partial two-step combinations. Only the full three-step sequence within one session is withheld from the background.',
    'RuleSddl uses the documented path-rule SDDL form; script and MSI rule GUIDs and the two custom rules (CorpApps, Configuration Manager cache) are invented, and only the three EXE default-rule GUIDs match Microsoft default policy. FileHash values are synthetic SHA-256 digests; Fqbn, PE and x509 fields follow the Microsoft and Elastic examples.',
    'Only runtime events 8002-8007: no policy-application 8000/8001, 8008, packaged-app 8020-8027 or Config CI and Managed Installer 8028-8040 events, no Packaged app channel and no DLL-load records. Activity is flat over 24 hours with users logged on (screen locked) most of the day. Fleet size, session lengths and application mix are synthetic; hosts, users, applications and files are editable in samples.',
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
  "@timestamp": "2026-09-01T01:10:10.819Z",
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
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-AppLocker\" Guid=\"{cbda4dbf-8d5d-4f69-9578-be14aa540d22}\"/><EventID>8002</EventID><Version>0</Version><Level>4</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x8000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-01T01:10:10.8199730Z\"/><EventRecordID>1573108</EventRecordID><Correlation/><Execution ProcessID=\"8136\" ThreadID=\"4164\"/><Channel>Microsoft-Windows-AppLocker/EXE and DLL</Channel><Computer>ws-ops-116.contoso.local</Computer><Security UserID=\"S-1-5-21-1504711230-2873091451-3906125842-1212\"/></System><UserData><RuleAndFileData xmlns=\"http://schemas.microsoft.com/schemas/event/Microsoft.Windows/1.0.0.0\"><PolicyNameLength>3</PolicyNameLength><PolicyName>EXE</PolicyName><RuleId>{921CC481-6E17-4653-8F75-050B80ACCA20}</RuleId><RuleNameLength>60</RuleNameLength><RuleName>(Default Rule) All files located in the Program Files folder</RuleName><RuleSddlLength>63</RuleSddlLength><RuleSddl>D:(XA;;FX;;;S-1-1-0;(APPID://PATH Contains \"%PROGRAMFILES%\\*\"))</RuleSddl><TargetUser>S-1-5-21-1504711230-2873091451-3906125842-1212</TargetUser><TargetProcessId>5448</TargetProcessId><FilePathLength>51</FilePathLength><FilePath>%PROGRAMFILES%\\GOOGLE\\CHROME\\APPLICATION\\CHROME.EXE</FilePath><FileHashLength>32</FileHashLength><FileHash>5407D34AF3F59BE98E28F7E62FA638D7A825927136FCE00705FDD29C5958F50D</FileHash><FqbnLength>89</FqbnLength><Fqbn>O=GOOGLE LLC, L=MOUNTAIN VIEW, S=CALIFORNIA, C=US\\GOOGLE CHROME\\CHROME.EXE\\118.0.5993.118</Fqbn><TargetLogonId>0x3b1a180</TargetLogonId><FullFilePathLength>53</FullFilePathLength><FullFilePath>C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe</FullFilePath></RuleAndFileData></UserData></Event>",
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
    "name": "ws-ops-116.contoso.local"
  },
  "log": {
    "level": "information"
  },
  "message": "%PROGRAMFILES%\\GOOGLE\\CHROME\\APPLICATION\\CHROME.EXE was allowed to run.",
  "process": {
    "pid": 8136
  },
  "tags": [
    "preserve_original_event"
  ],
  "user": {
    "id": "S-1-5-21-1504711230-2873091451-3906125842-1212"
  },
  "winlog": {
    "channel": "Microsoft-Windows-AppLocker/EXE and DLL",
    "computer_name": "ws-ops-116.contoso.local",
    "event_id": "8002",
    "level": "information",
    "opcode": "Info",
    "process": {
      "pid": 8136,
      "thread": {
        "id": 4164
      }
    },
    "provider_guid": "{cbda4dbf-8d5d-4f69-9578-be14aa540d22}",
    "provider_name": "Microsoft-Windows-AppLocker",
    "record_id": "1573108",
    "task": "None",
    "time_created": "2026-09-01T01:10:10.819Z",
    "user": {
      "identifier": "S-1-5-21-1504711230-2873091451-3906125842-1212"
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
      "TargetLogonId": "0x3b1a180",
      "TargetProcessId": 5448,
      "TargetUser": "S-1-5-21-1504711230-2873091451-3906125842-1212",
      "xml_name": "RuleAndFileData"
    },
    "version": 0
  }
}`,
    },
  ],
};
