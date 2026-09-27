import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationMicrosoftHypervVmms: GeneratorMeta = {
  slug: 'virtualization-microsoft-hyperv-vmms',
  displayName: 'Microsoft Hyper-V VMMS Checkpoint and Merge Failures',
  category: 'virtualization',
  description:
    'Microsoft-Windows-Hyper-V-VMMS-Admin error records for failed VM checkpoints and background disk merges on four Hyper-V hosts with 60 VMs, as Winlogbeat-style ECS JSON with the raw Windows event XML in event.original. Recurring episodes show one VM failing three checkpoint attempts in a row, each followed by a disk merge failure.',
  dataSource:
    'Microsoft-Windows-Hyper-V-VMMS-Admin events 18014, 18012 and 19100, Event Viewer XML from Windows Server 2022/2025',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Raw Windows event XML in event.original',
    'Independent failure schedules for 60 VMs on 4 hosts',
    'Recurring same-VM checkpoint and merge failure chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due 1 hour after the first event, each next one anomaly_interval_hours (default 24, minimum 6) after the actual start of the previous one; it starts at a random delay of up to 1 hour after it is due (up to an eighth of the interval) on the first VM that is idle, has no Admin record in the last 6 hours and is not the previous VM or on its host, with no replay of missed episodes. On that VM three checkpoint attempts fail in a row, the first cancelled before it fails, and each is followed by a disk merge failure with 0x80070020; 30% of episodes add a fourth failed attempt. Every step also occurs in background, and recovery is not visible in the source.',
  generatorId: 'hyperv',
  eventTypes: [
    {
      id: '18012',
      description: 'Checkpoint operation failed (checkpoint-failed)',
      frequency: '45.5% measured share',
      category: 'host',
    },
    {
      id: '19100',
      description:
        'Background disk merge failed, 0x80070020 (disk-merge-failed)',
      frequency: '29.3% measured share',
      category: 'host',
    },
    {
      id: '18014',
      description: 'Checkpoint operation cancelled (checkpoint-cancelled)',
      frequency: '25.2% measured share',
      category: 'host',
    },
  ],
  realismFeatures: [
    'Every VM has its own random schedule of failing checkpoint series (lognormal gaps, median 4 hours), about 590 records per day. Successful checkpoints write nothing to the Admin channel, so the stream holds failures only.',
    'A failed attempt logs 18012, preceded by 18014 in 55% of attempts on the same VMMS worker thread and followed by 19100 in 40% about 20 ms later. The backup job retries 60% of failures; in 15% of series an earlier checkpoint merge fails on its own and VMMS may retry it several times.',
    'Each host has a stable VMMS process ID, a worker thread pool and record numbers that rise with gaps for Admin records that are not modeled. Repeated failures of one VM within minutes are ordinary background; only the merge failure that would complete the full chain is withheld.',
    'The record runs as SYSTEM and does not name the user or backup product that started the checkpoint; the pattern points to storage or backup trouble, not an intrusion.',
    'Only three event IDs are modeled and 19100 always carries 0x80070020; the Microsoft Q&A post is the only raw example found. The ECS projection is Winlogbeat-style without winlog.keywords, opcode, task and user_data.xml_name, and failure rates, retries, thread IDs and the TimeCreated clock are synthetic.',
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
      description: 'Hours between episode starts, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Merge failure that completes the first episode',
      json: String.raw`{"@timestamp": "2026-09-20T01:13:26.260Z", "ecs": {"version": "8.17.0"}, "event": {"action": "disk-merge-failed", "category": ["host"], "code": "19100", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-Hyper-V-VMMS\" Guid=\"{6066f867-7ca1-4418-85fd-36e3f9c0600c}\"/\u003e\u003cEventID\u003e19100\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e2\u003c/Level\u003e\u003cTask\u003e0\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-20T01:13:26.2601309Z\"/\u003e\u003cEventRecordID\u003e214592\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"4324\" ThreadID=\"760\"/\u003e\u003cChannel\u003eMicrosoft-Windows-Hyper-V-VMMS-Admin\u003c/Channel\u003e\u003cComputer\u003eHV-NODE04.corp.contoso.test\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cUserData\u003e\u003cVmlEventLog xmlns=\"http://www.microsoft.com/Windows/Virtualization/Events\"\u003e\u003cVmName\u003eERP-03\u003c/VmName\u003e\u003cVmId\u003eA1A699FE-9A97-4591-9C43-F9E1104985BA\u003c/VmId\u003e\u003cErrorMessage\u003e%%2147942432\u003c/ErrorMessage\u003e\u003cErrorCode\u003e0x80070020\u003c/ErrorCode\u003e\u003c/VmlEventLog\u003e\u003c/UserData\u003e\u003c/Event\u003e", "outcome": "failure", "provider": "Microsoft-Windows-Hyper-V-VMMS", "type": ["change"]}, "host": {"name": "HV-NODE04.corp.contoso.test"}, "log": {"level": "error"}, "message": "\u0027ERP-03\u0027 background disk merge failed to complete: The process cannot access the file because it is being used by another process. (0x80070020). (Virtual machine ID A1A699FE-9A97-4591-9C43-F9E1104985BA)", "related": {"hosts": ["HV-NODE04.corp.contoso.test"]}, "winlog": {"channel": "Microsoft-Windows-Hyper-V-VMMS-Admin", "computer_name": "HV-NODE04.corp.contoso.test", "event_id": "19100", "process": {"pid": 4324, "thread": {"id": 760}}, "provider_guid": "{6066f867-7ca1-4418-85fd-36e3f9c0600c}", "provider_name": "Microsoft-Windows-Hyper-V-VMMS", "record_id": 214592, "user": {"identifier": "S-1-5-18"}, "user_data": {"ErrorCode": "0x80070020", "ErrorMessage": "%%2147942432", "VmId": "A1A699FE-9A97-4591-9C43-F9E1104985BA", "VmName": "ERP-03"}, "version": 0}}`,
    },
  ],
};
