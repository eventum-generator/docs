import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsGroupPolicyOperational: GeneratorMeta = {
  slug: 'windows-group-policy-operational',
  displayName: 'Windows Group Policy Operational',
  category: 'endpoint',
  description:
    'Microsoft-Windows-GroupPolicy/Operational computer policy refreshes (periodic and manual gpupdate) and client-side extension processing from a fleet of 1,000 domain members (800 workstations, 200 servers), as Winlogbeat-style ECS JSON with the native Event XML in event.original, for SIEM content that watches whether Group Policy, and security policy in particular, is actually applied. About 40,000 events a day follow a working-day curve. Recurring episodes break the Security extension on three hosts that apply the same changed GPO; each host recovers at its next Security run.',
  dataSource:
    'Microsoft-Windows-GroupPolicy/Operational channel, Windows Server 2022 manifest (gpsvc.dll 10.0.20348)',
  eventFormat: 'ECS JSON',
  originalFormat: 'XML',
  eventCount: 9,
  templateCount: 1,
  highlights: [
    'Native Event XML in event.original',
    '1,000 domain members on a working-day curve',
    'Recurring three-host Security extension failure chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default, a change to one Security-bearing GPO (Default Domain Policy, Workstation Security Baseline or Server Security Baseline) makes the Security extension fail on three hosts that apply it and are on, each at the next Security run of its own refresh schedule: 4016, then 7016 with ErrorCode 1252, and the refresh ends with 7006, or 7004 for a manual gpupdate. An administrator may rerun gpupdate on a failed host within minutes, and each host's next Security run succeeds (5016, ErrorCode 0). Episode errors fall inside the hosts' ordinary refreshes, and the chain usually completes within two hours of the start. It is complete at the first episode error that has errors of two other hosts in the 6 hours before it; when background errors of other hosts shortly precede an episode, they count as its first or second host and the remaining episode hosts keep working settings, so each episode completes exactly one chain. The first episode starts within min(interval, 24 h) of the beginning, and each later one within a window of min(interval / 4, 6 h) centred one interval after the previous start. The first start hour follows the daily curve, favouring working hours; later episodes stay within about three hours of the previous start, so a first start at night keeps the following ones near night hours. Missed episodes are not replayed. Hosts change every episode and exclude those of the previous one. Every event type, error code, host, GPO and the two-host failure-then-recovery pattern also occur in background of both modes; only a third distinct host within 6 hours is withheld from it.",
  generatorId: 'gpo',
  eventTypes: [
    {
      id: '4006',
      description: 'Periodic computer policy processing started',
      frequency: '19.40% of events',
      category: 'configuration',
    },
    {
      id: '8006',
      description: 'Periodic computer policy processing completed',
      frequency: '19.39% of events',
      category: 'configuration',
    },
    {
      id: '7006',
      description: 'Periodic computer policy processing failed',
      frequency: '0.012% of events',
      category: 'configuration',
    },
    {
      id: '4004',
      description: 'Manual computer policy processing (gpupdate) started',
      frequency: '0.17% of events',
      category: 'configuration',
    },
    {
      id: '8004',
      description: 'Manual computer policy processing completed',
      frequency: '0.17% of events',
      category: 'configuration',
    },
    {
      id: '7004',
      description: 'Manual computer policy processing failed',
      frequency: '0.001% of events',
      category: 'configuration',
    },
    {
      id: '4016',
      description:
        'Client-side extension processing started, with applicable GPOs',
      frequency: '30.43% of events',
      category: 'configuration',
    },
    {
      id: '5016',
      description: 'Client-side extension processing completed',
      frequency: '30.42% of events',
      category: 'configuration',
    },
    {
      id: '7016',
      description: 'Client-side extension processing completed with an error',
      frequency: '0.013% of events',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'A fleet of 800 workstations and 200 servers applies 10 GPOs. Every host refreshes computer policy every 90 minutes plus a random 0-30 minute offset, the Windows default: intervals have a median of 104-112 minutes and range from about 70 to about 150 minutes, and there are no refreshes while a workstation is switched off. Each refresh has one Activity ID shared by all of its events.',
    'About 40,000 events a day (+/- 3% from day to day) on a working-day curve in the generator timezone (UTC by default): servers and the 120 workstations left on overnight give about 900 events an hour around the clock; the other 680 workstations switch on between about 07:25 and 08:35 and shut down between about 17:20 and 18:40, a little differently every day, raising the volume to about 2,950 events an hour from 09:00 to 18:00. A workstation gets a new Group Policy service process ID at every start-up while its EventRecordID keeps counting. Every day follows the same curve, with no weekends or holidays, and hourly volume changes in steps at 09:00 and 18:00.',
    "Each refresh runs the extensions of the host's GPOs that have work (Registry, Security, Audit Policy Configuration, Group Policy Registry, Group Policy Folders, Group Policy Scheduled Tasks, EFS recovery), Registry first and the rest in extension-GUID order; a manual refresh runs all of them, and a refresh is 5.1 events on average. Audit Policy Configuration completes with ErrorCode 2147483658 (E_PENDING), which Microsoft documents as expected. Administrators run gpupdate about 60 times a day, mostly between 09:00 and 18:00, and one run in five is repeated within minutes.",
    'Security extension errors (7016, ErrorCode 1252) come in short background spells, about three a day: one host fails once (65%) or twice (35%), or one shared cause breaks the next Security run of two hosts that apply the same GPO. A failed refresh ends with 7006/7004 and is often followed within minutes by a manual gpupdate; failed refreshes are about 0.07% of refreshes. The chain is not recognisable from any single event.',
    'Events of one refresh are further apart than on a real host: a median 1.8 s by day and 4.4 s at night, so a refresh takes a median 15 s by day and 27 s at night, and extension run times are mostly 1-2 s (Security about 4 s) instead of tens of milliseconds.',
    'Fields, versions, levels, opcodes and messages follow the Windows Server 2022 manifest (gpsvc.dll 10.0.20348) and Microsoft\'s published 4016 and 7016 Event XML. Version 1 of the refresh events, several EventData values, multi-GPO list concatenation and 7006/7004 after an extension error are inferred; GPOListStatusString is always "No changes were detected." event.category, event.type, event.action and event.outcome are ECS normalisation.',
    'Only computer policy and these nine event IDs are modelled: other Operational events of a refresh appear as EventRecordID gaps, user logon, start-up, script and connectivity processing are out of scope, and Security errors always carry ErrorCode 1252. On a day with an episode, 7016 and 7006/7004 counts are one to three higher. Rates, extension run shares, durations and the fleet are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring episodes to the background; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours of event time between episode starts, 12 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Security error completing the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T20:16:30.552Z", "ecs": {"version": "8.17.0"}, "event": {"action": "cse-processing-failed", "category": ["configuration"], "code": "7016", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-GroupPolicy\" Guid=\"{AEA1B4FA-97D1-45F2-A64C-4D69FFFD92C9}\"/\u003e\u003cEventID\u003e7016\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e2\u003c/Level\u003e\u003cTask\u003e0\u003c/Task\u003e\u003cOpcode\u003e2\u003c/Opcode\u003e\u003cKeywords\u003e0x4000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-01T20:16:30.5526290Z\"/\u003e\u003cEventRecordID\u003e124365\u003c/EventRecordID\u003e\u003cCorrelation ActivityID=\"{EBC0C866-9163-41BD-BDD1-215F596AF73B}\"/\u003e\u003cExecution ProcessID=\"6804\" ThreadID=\"10936\"/\u003e\u003cChannel\u003eMicrosoft-Windows-GroupPolicy/Operational\u003c/Channel\u003e\u003cComputer\u003esrv-rds06.corp.contoso.com\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cEventData\u003e\u003cData Name=\"CSEElaspedTimeInMilliSeconds\"\u003e3024\u003c/Data\u003e\u003cData Name=\"ErrorCode\"\u003e1252\u003c/Data\u003e\u003cData Name=\"CSEExtensionName\"\u003eSecurity\u003c/Data\u003e\u003cData Name=\"CSEExtensionId\"\u003e{827D319E-6EAC-11D2-A4EA-00C04F79F83A}\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "outcome": "failure", "provider": "Microsoft-Windows-GroupPolicy", "type": ["info"]}, "host": {"name": "srv-rds06.corp.contoso.com"}, "log": {"level": "error"}, "message": "Completed Security Extension Processing in 3024 milliseconds.", "winlog": {"activity_id": "{EBC0C866-9163-41BD-BDD1-215F596AF73B}", "channel": "Microsoft-Windows-GroupPolicy/Operational", "computer_name": "srv-rds06.corp.contoso.com", "event_data": {"CSEElaspedTimeInMilliSeconds": "3024", "CSEExtensionId": "{827D319E-6EAC-11D2-A4EA-00C04F79F83A}", "CSEExtensionName": "Security", "ErrorCode": "1252"}, "event_id": "7016", "opcode": "Stop", "process": {"pid": 6804, "thread": {"id": 10936}}, "provider_guid": "{AEA1B4FA-97D1-45F2-A64C-4D69FFFD92C9}", "provider_name": "Microsoft-Windows-GroupPolicy", "record_id": "124365", "user": {"identifier": "S-1-5-18"}, "version": 0}}`,
    },
  ],
};
