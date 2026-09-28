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
    'Episodes are scheduled by event time: the first starts within the first min(anomaly_interval_hours, 24) hours, each later one within a window of min(interval / 4, 6) hours centred one interval (default 24 hours) after the actual start of the previous episode, weighted toward admin working hours; missed episodes are not replayed. An admin account registers a new task on a server (106), runs it once, or twice in 20% of episodes (129, 100, 200, 201, 102), and deletes it with the same account (141) within one hour of the registration (1-30 minutes measured at the default interval). Each episode uses a different admin and host than the previous one; every step occurs in background, where a registrant deletion that would complete the chain is dropped and the task stays registered.',
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
      frequency: '2.4% measured share',
      category: 'configuration',
    },
    {
      id: '140',
      description: 'Task registration updated',
      frequency: '0.2% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Ten servers each run 13 to 14 recurring tasks (Windows maintenance tasks and corporate agents) with lognormal gaps around nominal intervals of 1 hour to 1 week. Each run logs 129, 100, 200, 201 and 102 with one instance GUID, the 129 ProcessID equal to the 200/201 EnginePID; 1-8% of runs return a nonzero code that Task Scheduler still reports as completed. Measured volume is about 2,700 records per day.',
    String.raw`Six admins open sessions at lognormal gaps (median about 4 hours) thinned by a UTC hour-of-day curve, about twice a day each and mostly in working hours, and register, run, update and delete ad-hoc tasks on one or more hosts. About 65% of ad-hoc tasks get a planned deletion by the registrant, another admin or SYSTEM, only after their runs end. Four hosts carry a Group Policy Preferences Replace task, so each policy refresh logs 141 and 106 for it by NT AUTHORITY\System.`,
    'Record numbers rise per host and skip one number before each run for the trigger record (107 or 110) that is not modeled, plus occasional random gaps. Event IDs, versions, opcodes, keywords and message text follow the provider manifest; EventData layouts come from published Microsoft Q&A, TechNet, Splunk and EvtxECmd examples because Microsoft does not document them, and the 129, 100, 200 order inside a run is undocumented too.',
    'Background holds every chain step: per 96 hours about 18 ad-hoc tasks registered and deleted by the same admin within an hour without a run, 5 registered, run and deleted within an hour by a different account, and 3 registered, run and deleted by their registrant after more than an hour. A registrant deletion that would fall within the hour after a run is dropped at its own time, so about 53% of ad-hoc tasks that ran are never deleted, against about 20% of those that did not run; other deletions keep the unmodified delay distribution on both sides of the one-hour mark.',
    'Only eight event IDs are modeled; trigger (107, 110, 118, 119), failure (101, 103, 202, 203), 322/325 queueing and service records are absent. The Operational log does not show the task definition, arguments or remote source, which need Security events 4698/4699 or the task XML. event.category/type/action, user.*, related.user and process.* are Winlogbeat-style normalization, and task cadences, durations, failure rates, admin behavior and process IDs are synthetic.',
    'Scheduled runs and Group Policy refreshes have no daily cycle. Episode starts are more concentrated in working hours than background admin activity; at a 12-hour interval every second one lands near night. Registered ad-hoc tasks are capped at 30, so live runs longer than about two months register fewer new ad-hoc tasks, in both modes.',
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
        'Hours between episode starts; 6 to 8,760, other values fail validation',
    },
  ],
  sampleOutputs: [
    {
      title: 'Deletion completing the first episode (141)',
      json: String.raw`{"@timestamp": "2026-09-20T15:07:23.251Z", "ecs": {"version": "8.17.0"}, "event": {"action": "task-deleted", "category": ["configuration"], "code": "141", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-TaskScheduler\" Guid=\"{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}\"/\u003e\u003cEventID\u003e141\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e4\u003c/Level\u003e\u003cTask\u003e141\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-20T15:07:23.2519006Z\"/\u003e\u003cEventRecordID\u003e624577\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"3016\" ThreadID=\"10460\"/\u003e\u003cChannel\u003eMicrosoft-Windows-TaskScheduler/Operational\u003c/Channel\u003e\u003cComputer\u003eWEB02.corp.contoso.test\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cEventData Name=\"TaskDeleted\"\u003e\u003cData Name=\"TaskName\"\u003e\\Collect-Logs-2a11\u003c/Data\u003e\u003cData Name=\"UserName\"\u003eCORP\\adm_jsmith\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "provider": "Microsoft-Windows-TaskScheduler", "type": ["deletion"]}, "host": {"ip": ["10.20.4.52"], "name": "WEB02.corp.contoso.test"}, "log": {"level": "information"}, "message": "User \"CORP\\adm_jsmith\"  deleted Task Scheduler task \"\\Collect-Logs-2a11\"", "related": {"user": ["adm_jsmith"]}, "user": {"domain": "CORP", "name": "adm_jsmith"}, "winlog": {"channel": "Microsoft-Windows-TaskScheduler/Operational", "computer_name": "WEB02.corp.contoso.test", "event_data": {"TaskName": "\\Collect-Logs-2a11", "UserName": "CORP\\adm_jsmith"}, "event_id": "141", "process": {"pid": 3016, "thread": {"id": 10460}}, "provider_guid": "{DE7B24EA-73C8-4A09-985D-5BDADCFA9017}", "provider_name": "Microsoft-Windows-TaskScheduler", "record_id": 624577, "user": {"identifier": "S-1-5-18"}, "version": 0}}`,
    },
  ],
};
