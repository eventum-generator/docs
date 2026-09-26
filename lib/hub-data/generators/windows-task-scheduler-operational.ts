/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsTaskSchedulerOperational: GeneratorMeta = {
  slug: 'windows-task-scheduler-operational',
  displayName: 'Windows TaskScheduler Operational',
  category: 'endpoint',
  description:
    'TaskScheduler action and task-completion XML with a switchable repeated-action failure and recovery chain.',
  dataSource: 'Microsoft-Windows-TaskScheduler/Operational',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 2,
  templateCount: 1,
  generatorId: 'windows-task-scheduler-operational',
  highlights: [
    'Events 201 and 102 native XML',
    'Instance ID links each action and task',
    'Nonzero-to-zero action result sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same PayrollDaily task produces three Event 201 nonzero action result codes, each followed by Event 102 task completion; a fourth run returns zero.',
  eventTypes: [
    {
      id: '201',
      description: 'Action completed with result code',
      frequency: '1 per run',
      category: 'process',
    },
    {
      id: '102',
      description: 'Task instance finished',
      frequency: '1 per run',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Event 201 retains the five documented ActionSuccess fields; Event 102 retains the three TaskSuccessEvent fields.',
    'Each 201/102 pair shares a task instance GUID; successive runs get distinct GUIDs.',
    'Fifty task/action/user samples vary routine runs.',
  ],
  parameters: [
    {
      name: 'host_name',
      defaultValue: 'tasks-01.corp.example',
      description: 'Scheduler host name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.160.0.21',
      description: 'Host address',
    },
    {
      name: 'anomaly_task',
      defaultValue: String.raw`\Corp\PayrollDaily`,
      description: 'Task path in chain',
    },
    {
      name: 'anomaly_action',
      defaultValue: String.raw`C:\Program Files\Corp\payroll-sync.exe`,
      description: 'Action executable in chain',
    },
    {
      name: 'anomaly_user',
      defaultValue: String.raw`CORP\svc_payroll`,
      description: 'Task user in chain',
    },
    {
      name: 'anomaly_interval_runs',
      defaultValue: '50',
      description: 'Routine task runs between chains',
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
  "@timestamp": "2026-09-25T13:03:01+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "action-completed",
    "category": [
      "process"
    ],
    "code": "201",
    "dataset": "windows.task_scheduler_operational",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-TaskScheduler\" Guid=\"{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}\"/><EventID>201</EventID><Version>2</Version><Level>4</Level><Task>201</Task><Opcode>2</Opcode><Keywords>0x8000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T13:03:01.0000000Z\"/><EventRecordID>30101</EventRecordID><Correlation ActivityID=\"{8a7958c0-fde4-440b-b81b-4ac9be23fe22}\"/><Execution ProcessID=\"884\" ThreadID=\"5524\"/><Channel>Microsoft-Windows-TaskScheduler/Operational</Channel><Computer>tasks-01.corp.example</Computer><Security UserID=\"S-1-5-18\"/></System><EventData Name=\"ActionSuccess\"><Data Name=\"TaskName\">\\Corp\\PayrollDaily</Data><Data Name=\"TaskInstanceId\">{8a7958c0-fde4-440b-b81b-4ac9be23fe22}</Data><Data Name=\"ActionName\">C:\\Program Files\\Corp\\payroll-sync.exe</Data><Data Name=\"ResultCode\">5</Data><Data Name=\"EnginePID\">1060</Data></EventData></Event>",
    "outcome": "failure",
    "type": [
      "error"
    ]
  },
  "host": {
    "ip": [
      "10.160.0.21"
    ],
    "name": "tasks-01.corp.example"
  },
  "message": "\\Corp\\PayrollDaily: action-completed",
  "process": {
    "executable": "C:\\Program Files\\Corp\\payroll-sync.exe"
  },
  "related": {
    "user": [
      "CORP\\svc_payroll"
    ]
  },
  "tags": [
    "task-scheduler-operational",
    "preserve_original_event"
  ],
  "user": {
    "name": "CORP\\svc_payroll"
  },
  "windows": {
    "task_scheduler": {
      "event_data": {
        "ActionName": "C:\\Program Files\\Corp\\payroll-sync.exe",
        "EnginePID": 1060,
        "ResultCode": 5,
        "TaskInstanceId": "{8a7958c0-fde4-440b-b81b-4ac9be23fe22}",
        "TaskName": "\\Corp\\PayrollDaily"
      },
      "task_instance_id": "{8a7958c0-fde4-440b-b81b-4ac9be23fe22}",
      "task_name": "\\Corp\\PayrollDaily"
    }
  },
  "winlog": {
    "activity_id": "{8a7958c0-fde4-440b-b81b-4ac9be23fe22}",
    "channel": "Microsoft-Windows-TaskScheduler/Operational",
    "event_id": 201,
    "provider_name": "Microsoft-Windows-TaskScheduler",
    "record_id": 30101
  }
}`,
    },
  ],
};
