/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsAppLocker: GeneratorMeta = {
  slug: 'windows-applocker',
  displayName: 'Windows AppLocker EXE/DLL',
  category: 'endpoint',
  description:
    'AppLocker Event 8004 XML for enforced executable blocks, including a switchable path-hopping chain.',
  dataSource: 'Microsoft-Windows-AppLocker/EXE and DLL',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'windows-applocker',
  highlights: [
    'Event 8004 native XML',
    '18/18 RuleAndFileData fields',
    'Same SID and logon ID across path changes',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same user SID and logon ID attempts updater.exe from four paths and each launch is blocked by AppLocker Event 8004.',
  eventTypes: [
    {
      id: '8004',
      description: 'EXE/DLL execution blocked',
      frequency: '1 per routine tick; 4 per chain',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Event 8004 UserData/RuleAndFileData retains all 18 fields in the Microsoft-published XML example.',
    'Fifty routine blocked paths vary the background.',
    'TargetUser and TargetLogonId stay stable across a chain; target process ID changes with each attempt.',
  ],
  parameters: [
    {
      name: 'host_name',
      defaultValue: 'ws-01.corp.example',
      description: 'Windows endpoint name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.140.0.21',
      description: 'Endpoint address',
    },
    {
      name: 'normal_user_sid',
      defaultValue: 'S-1-5-21-111111111-222222222-333333333-1101',
      description: 'Background user SID',
    },
    {
      name: 'anomaly_user_sid',
      defaultValue: 'S-1-5-21-111111111-222222222-333333333-1199',
      description: 'Chain user SID',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:02:17+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "executable-blocked",
    "category": [
      "process"
    ],
    "code": "8004",
    "dataset": "windows.applocker",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-AppLocker\" Guid=\"{cbda4dbf-8d5d-4f69-9578-be14aa540d22}\"/><EventID>8004</EventID><Version>0</Version><Level>2</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x8000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T13:02:17.0000000Z\"/><EventRecordID>10251</EventRecordID><Correlation/><Execution ProcessID=\"10660\" ThreadID=\"4064\"/><Channel>Microsoft-Windows-AppLocker/EXE and DLL</Channel><Computer>ws-01.corp.example</Computer><Security UserID=\"S-1-5-21-111111111-222222222-333333333-1199\"/></System><UserData><RuleAndFileData xmlns=\"http://schemas.microsoft.com/schemas/event/Microsoft.Windows/1.0.0.0\"><PolicyNameLength>3</PolicyNameLength><PolicyName>Exe</PolicyName><RuleId>{00000000-0000-0000-0000-000000000000}</RuleId><RuleNameLength>1</RuleNameLength><RuleName>-</RuleName><RuleSddlLength>1</RuleSddlLength><RuleSddl>-</RuleSddl><TargetUser>S-1-5-21-111111111-222222222-333333333-1199</TargetUser><TargetProcessId>15210</TargetProcessId><FilePathLength>27</FilePathLength><FilePath>C:\\Users\\Public\\updater.exe</FilePath><FileHashLength>0</FileHashLength><FileHash></FileHash><FqbnLength>1</FqbnLength><Fqbn>-</Fqbn><TargetLogonId>0x3e7a9</TargetLogonId><FullFilePathLength>27</FullFilePathLength><FullFilePath>C:\\Users\\Public\\updater.exe</FullFilePath></RuleAndFileData></UserData></Event>",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "file": {
    "path": "C:\\Users\\Public\\updater.exe"
  },
  "host": {
    "ip": [
      "10.140.0.21"
    ],
    "name": "ws-01.corp.example"
  },
  "message": "C:\\Users\\Public\\updater.exe was prevented from running.",
  "process": {
    "pid": 15210
  },
  "related": {
    "user": [
      "S-1-5-21-111111111-222222222-333333333-1199"
    ]
  },
  "tags": [
    "applocker",
    "preserve_original_event"
  ],
  "user": {
    "id": "S-1-5-21-111111111-222222222-333333333-1199"
  },
  "windows": {
    "applocker": {
      "FileHash": "",
      "FileHashLength": 0,
      "FilePath": "C:\\Users\\Public\\updater.exe",
      "FilePathLength": 27,
      "Fqbn": "-",
      "FqbnLength": 1,
      "FullFilePath": "C:\\Users\\Public\\updater.exe",
      "FullFilePathLength": 27,
      "PolicyName": "Exe",
      "PolicyNameLength": 3,
      "RuleId": "{00000000-0000-0000-0000-000000000000}",
      "RuleName": "-",
      "RuleNameLength": 1,
      "RuleSddl": "-",
      "RuleSddlLength": 1,
      "TargetLogonId": "0x3e7a9",
      "TargetProcessId": 15210,
      "TargetUser": "S-1-5-21-111111111-222222222-333333333-1199"
    }
  },
  "winlog": {
    "channel": "Microsoft-Windows-AppLocker/EXE and DLL",
    "event_id": 8004,
    "provider_name": "Microsoft-Windows-AppLocker",
    "record_id": 10251
  }
}`,
    },
  ],
};
