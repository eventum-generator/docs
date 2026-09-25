/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsGroupPolicyOperational: GeneratorMeta = {
  slug: 'windows-group-policy-operational',
  displayName: 'Windows Group Policy Operational',
  category: 'endpoint',
  description:
    'Selected Group Policy CSE start and failure XML with a switchable Security-extension failure burst.',
  dataSource: 'Microsoft-Windows-GroupPolicy/Operational',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 2,
  templateCount: 1,
  generatorId: 'windows-group-policy-operational',
  highlights: [
    '4016 start and 7016 failure',
    'Activity ID joins one CSE cycle',
    'Repeated Security CSE error 1252',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three Security CSE processing cycles start with Event 4016 and fail with Event 7016/error 1252, each with its own Activity ID.',
  eventTypes: [
    {
      id: '4016',
      description: 'CSE processing started',
      frequency: 'Routine and chain',
      category: 'configuration',
    },
    {
      id: '7016',
      description: 'CSE processing failed',
      frequency: '3 per chain',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Event 4016 retains all seven EventData fields in the Microsoft XML example; Event 7016 retains its four documented fields.',
    'Each start/failure pair shares an Activity ID; distinct refreshes use distinct IDs, as Microsoft documents.',
    'Fifty GPO-name samples vary routine start events.',
  ],
  parameters: [
    {
      name: 'host_name',
      defaultValue: 'ws-gp-01.corp.example',
      description: 'Windows endpoint name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.150.0.21',
      description: 'Endpoint address',
    },
    {
      name: 'anomaly_interval_cycles',
      defaultValue: '50',
      description: 'Routine CSE cycles between chains',
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
  "@timestamp": "2026-09-25T13:09:35+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "cse-processing-failed",
    "category": [
      "configuration"
    ],
    "code": "7016",
    "dataset": "windows.group_policy_operational",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-GroupPolicy\" Guid=\"{AEA1B4FA-97D1-45F2-A64C-4D69FFFD92C9}\"/><EventID>7016</EventID><Version>0</Version><Level>2</Level><Task>0</Task><Opcode>2</Opcode><Keywords>0x4000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T13:09:35.0000000Z\"/><EventRecordID>20052</EventRecordID><Correlation ActivityID=\"{743f24f2-dadc-40e4-8345-bb35659d8d86}\"/><Execution ProcessID=\"1260\" ThreadID=\"1404\"/><Channel>Microsoft-Windows-GroupPolicy/Operational</Channel><Computer>ws-gp-01.corp.example</Computer><Security UserID=\"S-1-5-18\"/></System><EventData><Data Name=\"CSEElaspedTimeInMilliSeconds\">20984</Data><Data Name=\"ErrorCode\">1252</Data><Data Name=\"CSEExtensionName\">Security</Data><Data Name=\"CSEExtensionId\">{827D319E-6EAC-11D2-A4EA-00C04F79F83A}</Data></EventData></Event>",
    "outcome": "failure",
    "type": [
      "error"
    ]
  },
  "group_policy": {
    "cse": {
      "CSEElaspedTimeInMilliSeconds": 20984,
      "CSEExtensionId": "{827D319E-6EAC-11D2-A4EA-00C04F79F83A}",
      "CSEExtensionName": "Security",
      "ErrorCode": 1252
    },
    "gpo_name": "Corp Security Baseline"
  },
  "host": {
    "ip": [
      "10.150.0.21"
    ],
    "name": "ws-gp-01.corp.example"
  },
  "message": "Security extension processing failed",
  "tags": [
    "group-policy-operational",
    "preserve_original_event"
  ],
  "winlog": {
    "activity_id": "{743f24f2-dadc-40e4-8345-bb35659d8d86}",
    "channel": "Microsoft-Windows-GroupPolicy/Operational",
    "event_id": 7016,
    "provider_name": "Microsoft-Windows-GroupPolicy",
    "record_id": 20052
  }
}`,
    },
  ],
};
