import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsTaskSchedulerOperational: GeneratorMeta = {
  displayName: 'Windows Task Scheduler',
  category: 'endpoint',
  description:
    'About 2,600 selected events/day from ten Windows servers, with native XML and Winlogbeat-style ECS fields.',
  dataSource: 'Microsoft-Windows-TaskScheduler/Operational',
  format: ['JSON', 'ECS'],
  highlights: [
    'Run records retain their instance GUID and process identity',
    'Temporary tasks have independent SYSTEM cleanup after two to three hours',
  ],
  anomalyChain:
    'One administrator registers a temporary task, runs it and deletes it within one hour. Administrator and server rotate. Episode timing follows the administrator working-day curve. Default interval is 24 hours. First start is within min(interval,24h); subsequent starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'tasks',
  eventTypes: [
    {
      id: '129',
      description: 'Task process created',
      frequency: 'One per run',
      category: 'process',
    },
    {
      id: '100',
      description: 'Task started',
      frequency: 'One per run',
      category: 'process',
    },
    {
      id: '200',
      description: 'Action started',
      frequency: 'One per run',
      category: 'process',
    },
    {
      id: '201',
      description: 'Action completed',
      frequency: 'One per run, usually return code 0',
      category: 'process',
    },
    {
      id: '102',
      description: 'Task completed',
      frequency: 'One per run',
      category: 'process',
    },
    {
      id: '106',
      description: 'Task registered',
      frequency: 'Temporary work and policy replacements',
      category: 'configuration',
    },
    {
      id: '141',
      description: 'Task deleted',
      frequency: 'Temporary cleanup and policy replacements',
      category: 'configuration',
    },
    {
      id: '140',
      description: 'Task updated',
      frequency: 'Occasional administrative changes',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Run records retain their instance GUID and process identity',
    'Temporary tasks have independent SYSTEM cleanup after two to three hours',
    'Selected Server 2019 provider profile; trigger and startup-failure records are omitted',
  ],
  slug: 'windows-task-scheduler-operational',
  templateCount: 2,
  generationModes: ['background', 'anomaly'],
  eventCount: 8,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring correlated episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, from 6 to 8760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-01T00:54:26.472Z", "ecs": {"version": "8.17.0"}, "event": {"action": "task-deleted", "category": ["configuration"], "code": "141", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-TaskScheduler\" Guid=\"{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}\"/\u003e\u003cEventID\u003e141\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e4\u003c/Level\u003e\u003cTask\u003e141\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-01T00:54:26.4724655Z\"/\u003e\u003cEventRecordID\u003e785173\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"1472\" ThreadID=\"400\"/\u003e\u003cChannel\u003eMicrosoft-Windows-TaskScheduler/Operational\u003c/Channel\u003e\u003cComputer\u003eAPP02.corp.contoso.test\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cEventData Name=\"TaskDeleted\"\u003e\u003cData Name=\"TaskName\"\u003e\\Collect-Logs-56bfd7c2-f27c-4394-9252-c845e446b1d5\u003c/Data\u003e\u003cData Name=\"UserName\"\u003eCORP\\adm_rpatel\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "provider": "Microsoft-Windows-TaskScheduler", "type": ["deletion"]}, "host": {"ip": ["10.20.2.32"], "name": "APP02.corp.contoso.test"}, "log": {"level": "information"}, "message": "User \"CORP\\adm_rpatel\"  deleted Task Scheduler task \"\\Collect-Logs-56bfd7c2-f27c-4394-9252-c845e446b1d5\"", "related": {"user": ["adm_rpatel"]}, "user": {"domain": "CORP", "name": "adm_rpatel"}, "winlog": {"channel": "Microsoft-Windows-TaskScheduler/Operational", "computer_name": "APP02.corp.contoso.test", "event_data": {"TaskName": "\\Collect-Logs-56bfd7c2-f27c-4394-9252-c845e446b1d5", "UserName": "CORP\\adm_rpatel"}, "event_id": "141", "process": {"pid": 1472, "thread": {"id": 400}}, "provider_guid": "{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}", "provider_name": "Microsoft-Windows-TaskScheduler", "record_id": 785173, "user": {"identifier": "S-1-5-18"}, "version": 0}}`,
    },
  ],
};
