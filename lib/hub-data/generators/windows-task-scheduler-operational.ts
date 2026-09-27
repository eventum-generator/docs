import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsTaskSchedulerOperational: GeneratorMeta = {
  slug: 'windows-task-scheduler-operational',
  displayName: 'Windows Task Scheduler Operational',
  category: 'endpoint',
  description:
    'Microsoft-Windows-TaskScheduler/Operational records from ten Windows servers as Winlogbeat-style ECS JSON with the raw event XML in event.original: recurring task runs, admin task changes and Group Policy task refreshes. Recurring episodes show one admin registering, running and deleting an ad-hoc task within an hour, the one-shot remote execution pattern of schtasks or atexec.',
  dataSource:
    'Microsoft-Windows-TaskScheduler/Operational, provider manifest build 17763 (Windows Server 2019 base)',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Raw Windows event XML in event.original',
    'Task runs, admin sessions and Group Policy refreshes on 10 servers',
    'Recurring register-run-delete chain by one admin',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode starts 1 to 2 hours after the first event, each next one anomaly_interval_hours (default 24) after the actual start of the previous one plus a random delay of up to 1 hour (at most an eighth of the interval); missed episodes are not replayed. An admin account registers a new task on a server (106), runs it once, or twice in 20% of episodes (129, 100, 200, 201, 102), and deletes it with the same account (141) within one hour of the registration (13-44 minutes measured). Each episode uses a different admin and host than the previous one; every step occurs in background, which never has the registrant delete a task inside the hour after a run.',
  generatorId: 'task-scheduler',
  eventTypes: [
    {
      id: '129',
      description: 'Created task process',
      frequency: '18.9% measured share',
      category: 'process',
    },
    {
      id: '100',
      description: 'Task started',
      frequency: '18.9% measured share',
      category: 'process',
    },
    {
      id: '200',
      description: 'Action started',
      frequency: '18.9% measured share',
      category: 'process',
    },
    {
      id: '201',
      description: 'Action completed, with return code',
      frequency: '18.9% measured share',
      category: 'process',
    },
    {
      id: '102',
      description: 'Task completed',
      frequency: '18.9% measured share',
      category: 'process',
    },
    {
      id: '106',
      description: 'Task registered',
      frequency: '2.6% measured share',
      category: 'configuration',
    },
    {
      id: '141',
      description: 'Task registration deleted',
      frequency: '2.5% measured share',
      category: 'configuration',
    },
    {
      id: '140',
      description: 'Task registration updated',
      frequency: '0.3% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Ten servers each run 13 to 14 recurring tasks (Windows maintenance tasks and corporate agents) with lognormal gaps around nominal intervals of 1 hour to 1 week. Each run logs 129, 100, 200, 201 and 102 with one instance GUID, the 129 ProcessID equal to the 200/201 EnginePID; 1-8% of runs return a nonzero code that Task Scheduler still reports as completed. Measured volume is about 2,700 records per day.',
    String.raw`Six admins open sessions at lognormal gaps (median 8 hours) and register, run, update and delete ad-hoc tasks on one or more hosts; about 65% of ad-hoc tasks are deleted later by the registrant, another admin or SYSTEM. Four hosts carry a Group Policy Preferences Replace task, so each policy refresh logs 141 and 106 for it by NT AUTHORITY\System.`,
    'Record numbers rise per host and skip one number before each run for the trigger record (107 or 110) that is not modeled, plus occasional random gaps. Event IDs, versions, opcodes, keywords and message text follow the provider manifest; EventData layouts come from published Microsoft Q&A, TechNet, Splunk and EvtxECmd examples because Microsoft does not document them, and the 129, 100, 200 order inside a run is undocumented too.',
    'Background holds every chain step: per 96 hours about 13 ad-hoc tasks registered and deleted by the same admin within an hour without a run, 4 to 8 registered, run and deleted within an hour by a different account, and about 10 deleted by their registrant more than an hour after a run. That post-run delay is redrawn until it passes the hour, so about a third fall at 60-77 minutes and a detector window slightly longer than one hour also matches background.',
    'Only eight event IDs are modeled; trigger (107, 110, 118, 119), failure (101, 103, 202, 203), 322/325 queueing and service records are absent. The Operational log does not show the task definition, arguments or remote source, which need Security events 4698/4699 or the task XML. event.category/type/action, user.*, related.user and process.* are Winlogbeat-style normalization, and task cadences, durations, failure rates, admin behavior and process IDs are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include periodic anomaly episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the actual start of one episode to the next, plus a random delay of up to 1 hour (at most an eighth of the interval); 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Deletion completing the first episode (141)',
      json: String.raw`{"@timestamp": "2026-09-20T01:42:49.433Z", "ecs": {"version": "8.17.0"}, "event": {"action": "task-deleted", "category": ["configuration"], "code": "141", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-TaskScheduler\" Guid=\"{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}\"/\u003e\u003cEventID\u003e141\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e4\u003c/Level\u003e\u003cTask\u003e141\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-20T01:42:49.4338544Z\"/\u003e\u003cEventRecordID\u003e59724\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"1036\" ThreadID=\"4932\"/\u003e\u003cChannel\u003eMicrosoft-Windows-TaskScheduler/Operational\u003c/Channel\u003e\u003cComputer\u003eFS01.corp.contoso.test\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cEventData Name=\"TaskDeleted\"\u003e\u003cData Name=\"TaskName\"\u003e\\Reset-IIS-f57e\u003c/Data\u003e\u003cData Name=\"UserName\"\u003eCORP\\adm_jsmith\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "provider": "Microsoft-Windows-TaskScheduler", "type": ["deletion"]}, "host": {"ip": ["10.20.1.21"], "name": "FS01.corp.contoso.test"}, "log": {"level": "information"}, "message": "User \"CORP\\adm_jsmith\"  deleted Task Scheduler task \"\\Reset-IIS-f57e\"", "related": {"user": ["adm_jsmith"]}, "user": {"domain": "CORP", "name": "adm_jsmith"}, "winlog": {"channel": "Microsoft-Windows-TaskScheduler/Operational", "computer_name": "FS01.corp.contoso.test", "event_data": {"TaskName": "\\Reset-IIS-f57e", "UserName": "CORP\\adm_jsmith"}, "event_id": "141", "process": {"pid": 1036, "thread": {"id": 4932}}, "provider_guid": "{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}", "provider_name": "Microsoft-Windows-TaskScheduler", "record_id": 59724, "user": {"identifier": "S-1-5-18"}, "version": 0}}`,
    },
  ],
};
