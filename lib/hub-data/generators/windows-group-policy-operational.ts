import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsGroupPolicyOperational: GeneratorMeta = {
  slug: 'windows-group-policy-operational',
  displayName: 'Windows Group Policy Operational',
  category: 'endpoint',
  description:
    'Microsoft-Windows-GroupPolicy/Operational computer policy refreshes (periodic and manual gpupdate) and client-side extension processing from 48 domain members, as Winlogbeat-style ECS JSON with the native Event XML in event.original. Recurring episodes break the Security extension on three hosts that apply the same changed GPO; each host then recovers at its next Security run.',
  dataSource:
    'Microsoft-Windows-GroupPolicy/Operational channel, Windows Server 2022 manifest (gpsvc.dll 10.0.20348)',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 9,
  templateCount: 1,
  highlights: [
    'Native Event XML in event.original',
    'Independent refresh schedules of 48 domain members',
    'Recurring three-host Security extension failure chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode due one hour after the start, each start delayed by a random 0 to min(1 h, interval / 8), the next due one interval after the actual start; missed episodes are not replayed), a change to one Security-bearing GPO makes the Security extension fail (7016, ErrorCode 1252) on three hosts that apply it, each at its own next refresh, so the errors spread over minutes to a few hours; the next Security run of each host succeeds. The GPO and hosts change every episode, and up to two background errors of other hosts shortly before an episode may complete it earlier. Every event type, error code and the two-host failure-then-recovery pattern occur in background, and only a third distinct host within 6 hours is withheld from it.',
  generatorId: 'gpo',
  eventTypes: [
    {
      id: '4006',
      description: 'Periodic computer policy processing started',
      frequency: '17.56% measured share',
      category: 'configuration',
    },
    {
      id: '8006',
      description: 'Periodic computer policy processing completed',
      frequency: '17.28% measured share',
      category: 'configuration',
    },
    {
      id: '7006',
      description: 'Periodic computer policy processing failed',
      frequency: '0.28% measured share',
      category: 'configuration',
    },
    {
      id: '4004',
      description: 'Manual computer policy processing started',
      frequency: '0.85% measured share',
      category: 'configuration',
    },
    {
      id: '8004',
      description: 'Manual computer policy processing completed',
      frequency: '0.83% measured share',
      category: 'configuration',
    },
    {
      id: '7004',
      description: 'Manual computer policy processing failed',
      frequency: '0.02% measured share',
      category: 'configuration',
    },
    {
      id: '4016',
      description:
        'Client-side extension processing started, with applicable GPOs',
      frequency: '31.59% measured share',
      category: 'configuration',
    },
    {
      id: '5016',
      description: 'Client-side extension processing completed',
      frequency: '31.29% measured share',
      category: 'configuration',
    },
    {
      id: '7016',
      description: 'Client-side extension processing completed with an error',
      frequency: '0.30% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'A fleet of 36 workstations and 12 servers applies 10 GPOs. Every host refreshes computer policy every 90 minutes plus a random 0-30 minute offset, skipping refreshes while asleep or off the network, and administrators run gpupdate on individual hosts at random. Each refresh has one Activity ID shared by all of its events.',
    "Each refresh runs the client-side extensions of the host's GPOs that have work, Registry first and the rest in extension-GUID order; Audit Policy Configuration completes with ErrorCode 2147483658 (E_PENDING), which Microsoft documents as expected.",
    'Security extension errors come in short background spells: one host fails once or twice, or one shared cause breaks the next Security run of two hosts that apply the same GPO. A failed refresh is often followed within minutes by a manual gpupdate, and the chain is not recognisable from any single event.',
    'Fields, versions, levels, opcodes and messages follow the Windows Server 2022 manifest and Microsoft\'s published 4016 and 7016 Event XML. Version 1 of the refresh events, several EventData values, multi-GPO list concatenation and 7006/7004 after an extension error are inferred; GPOListStatusString is always "No changes were detected."',
    'Only computer policy and these nine event IDs are modelled: other Operational events of a refresh appear as EventRecordID gaps, and Security errors always carry ErrorCode 1252. Rates, extension run shares, durations and the fleet are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours of source time between episode starts, 12 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Security error completing the first episode (third host)',
      json: String.raw`{"@timestamp": "2026-09-01T05:51:30.152Z", "ecs": {"version": "8.17.0"}, "event": {"action": "cse-processing-failed", "category": ["configuration"], "code": "7016", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-GroupPolicy\" Guid=\"{AEA1B4FA-97D1-45F2-A64C-4D69FFFD92C9}\"/\u003e\u003cEventID\u003e7016\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e2\u003c/Level\u003e\u003cTask\u003e0\u003c/Task\u003e\u003cOpcode\u003e2\u003c/Opcode\u003e\u003cKeywords\u003e0x4000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-01T05:51:30.1526675Z\"/\u003e\u003cEventRecordID\u003e695272\u003c/EventRecordID\u003e\u003cCorrelation ActivityID=\"{27F303D3-BEF7-4C1A-8C35-047EAC6E8195}\"/\u003e\u003cExecution ProcessID=\"10744\" ThreadID=\"3132\"/\u003e\u003cChannel\u003eMicrosoft-Windows-GroupPolicy/Operational\u003c/Channel\u003e\u003cComputer\u003ews-1159.corp.contoso.com\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cEventData\u003e\u003cData Name=\"CSEElaspedTimeInMilliSeconds\"\u003e911\u003c/Data\u003e\u003cData Name=\"ErrorCode\"\u003e1252\u003c/Data\u003e\u003cData Name=\"CSEExtensionName\"\u003eSecurity\u003c/Data\u003e\u003cData Name=\"CSEExtensionId\"\u003e{827D319E-6EAC-11D2-A4EA-00C04F79F83A}\u003c/Data\u003e\u003c/EventData\u003e\u003c/Event\u003e", "outcome": "failure", "provider": "Microsoft-Windows-GroupPolicy", "type": ["info"]}, "host": {"name": "ws-1159.corp.contoso.com"}, "log": {"level": "error"}, "message": "Completed Security Extension Processing in 911 milliseconds.", "winlog": {"activity_id": "{27F303D3-BEF7-4C1A-8C35-047EAC6E8195}", "channel": "Microsoft-Windows-GroupPolicy/Operational", "computer_name": "ws-1159.corp.contoso.com", "event_data": {"CSEElaspedTimeInMilliSeconds": "911", "CSEExtensionId": "{827D319E-6EAC-11D2-A4EA-00C04F79F83A}", "CSEExtensionName": "Security", "ErrorCode": "1252"}, "event_id": "7016", "opcode": "Stop", "process": {"pid": 10744, "thread": {"id": 3132}}, "provider_guid": "{AEA1B4FA-97D1-45F2-A64C-4D69FFFD92C9}", "provider_name": "Microsoft-Windows-GroupPolicy", "record_id": "695272", "user": {"identifier": "S-1-5-18"}, "version": 0}}`,
    },
  ],
};
