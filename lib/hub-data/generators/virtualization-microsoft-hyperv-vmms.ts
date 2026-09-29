import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationMicrosoftHypervVmms: GeneratorMeta = {
  slug: 'virtualization-microsoft-hyperv-vmms',
  displayName: 'Microsoft Hyper-V VMMS Checkpoint and Merge Failures',
  category: 'virtualization',
  description:
    'Microsoft-Windows-Hyper-V-VMMS-Admin error records for failed VM checkpoints and background disk merges on four Hyper-V hosts with 60 VMs, as Winlogbeat-style ECS JSON with the raw Windows event XML in event.original. About 120 records a day, most of them in the nightly 22:00-05:00 backup window; ten VMs with recurring checkpoint trouble carry most failures. Recurring episodes show one of those VMs with a cancelled checkpoint followed by three failed checkpoint attempts, each followed by a disk merge failure.',
  dataSource:
    'Microsoft-Windows-Hyper-V-VMMS-Admin events 18014, 18012 and 19100, Event Viewer XML from Windows Server 2022/2025',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Raw Windows event XML in event.original',
    'About 120 failures a day on 60 VMs, most in the nightly backup window',
    'Recurring same-VM checkpoint and merge failure chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'On one of the ten VMs with recurring checkpoint trouble, a checkpoint is cancelled and fails, then the background disk merge fails with 0x80070020; the backup job retries, and the second and third attempts fail the same way (18012, sometimes preceded by 18014, then 19100). In 30% of episodes a fourth failed attempt without a merge failure follows. Linked by winlog.user_data.VmId, the chain spans a few minutes to over 2 hours, about 15 minutes in the median. anomaly_interval_hours (default 24, minimum 6) is measured in event time: the first episode starts within the first min(interval, 24 h) of the run, each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards the backup window, so consecutive episodes start 21-27 hours apart at the default and 7-9 hours apart at 8 hours. Missed episodes are not replayed, and each episode uses a different VM and host than the previous one. The record count is the same in both modes. Every step also occurs in the background; only the complete sequence on one VM within 6 hours is episode-only.',
  generatorId: 'hyperv',
  eventTypes: [
    {
      id: '18012',
      description: 'Checkpoint operation failed (checkpoint-failed)',
      frequency: '45.0% of records',
      category: 'host',
    },
    {
      id: '19100',
      description:
        'Background disk merge failed, 0x80070020 (disk-merge-failed)',
      frequency: '29.1% of records',
      category: 'host',
    },
    {
      id: '18014',
      description: 'Checkpoint operation cancelled (checkpoint-cancelled)',
      frequency: '25.8% of records',
      category: 'host',
    },
  ],
  realismFeatures: [
    'About 120 records a day, each day varying by up to 3%: about 2 an hour from 05:00 to 22:00 and about 12 an hour in the nightly backup window from 22:00 to 05:00 (UTC by default). Successful checkpoints and merges write nothing to the Admin channel, so the stream holds failures only.',
    'Ten VMs with recurring checkpoint trouble (the SQL and Exchange servers, two ERP and two file servers, two or three per host) log three to four failing series a day and fail on almost every night; each of the other 50 VMs fails about once in six days. On a typical night about 15 of the 60 VMs log a failure, about 18 over a whole day, and over 12 days about 7 of the other VMs log nothing.',
    'A failed attempt logs 18012, preceded by 18014 in 55% of attempts (median 68 microseconds earlier, on the same VMMS worker thread) and followed by 19100 in 40% (median 22 ms later). The backup job retries 60% of failures (median 6 minutes, up to 2 hours) and a retry fails again in half of them; in 15% of series the merge of an earlier checkpoint fails on its own and may be retried several times.',
    'Each host has a stable VMMS process ID, a worker thread pool and record numbers that rise with gaps for Admin records that are not modeled. Repeated failures of one VM within minutes, cancelled attempts followed by failures and merge failures, and merge-retry loops are ordinary background.',
    'A VM whose last 6 hours hold a cancelled checkpoint followed by three failed attempts with two merge failures logs no merge failure until that cancelled checkpoint is 6 hours old; after an episode this lasts until 6 to about 8 hours after its start. Its cancelled and failed checkpoints continue as usual.',
    'The record runs as SYSTEM and does not name the user or backup product that started the checkpoint; the pattern points to storage or backup trouble, not an intrusion.',
    'Only three event IDs are modeled and 19100 always carries 0x80070020; the Microsoft Q&A post is the only raw example found. The ECS projection is Winlogbeat-style without winlog.keywords, opcode, task and user_data.xml_name. The troubled VMs fail more often than on a cluster whose checkpoint problems get fixed; failure rates, retries, the backup window, thread IDs and the TimeCreated clock are synthetic, and an episode has three to four failing rounds where the Q&A author reports the failure repeating on every attempt until a reboot.',
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
      title: 'Merge failure that completes the first episode of a default run',
      json: String.raw`{"@timestamp": "2026-09-01T03:44:12.027Z", "ecs": {"version": "8.17.0"}, "event": {"action": "disk-merge-failed", "category": ["host"], "code": "19100", "kind": "event", "original": "\u003cEvent xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"\u003e\u003cSystem\u003e\u003cProvider Name=\"Microsoft-Windows-Hyper-V-VMMS\" Guid=\"{6066f867-7ca1-4418-85fd-36e3f9c0600c}\"/\u003e\u003cEventID\u003e19100\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e2\u003c/Level\u003e\u003cTask\u003e0\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8000000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\"2026-09-01T03:44:12.0279698Z\"/\u003e\u003cEventRecordID\u003e101312\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\"2616\" ThreadID=\"9912\"/\u003e\u003cChannel\u003eMicrosoft-Windows-Hyper-V-VMMS-Admin\u003c/Channel\u003e\u003cComputer\u003eHV-NODE02.corp.contoso.test\u003c/Computer\u003e\u003cSecurity UserID=\"S-1-5-18\"/\u003e\u003c/System\u003e\u003cUserData\u003e\u003cVmlEventLog xmlns=\"http://www.microsoft.com/Windows/Virtualization/Events\"\u003e\u003cVmName\u003eSQL-02\u003c/VmName\u003e\u003cVmId\u003eD5C4A602-CC4A-41B7-BFCB-85359B37E457\u003c/VmId\u003e\u003cErrorMessage\u003e%%2147942432\u003c/ErrorMessage\u003e\u003cErrorCode\u003e0x80070020\u003c/ErrorCode\u003e\u003c/VmlEventLog\u003e\u003c/UserData\u003e\u003c/Event\u003e", "outcome": "failure", "provider": "Microsoft-Windows-Hyper-V-VMMS", "type": ["change"]}, "host": {"name": "HV-NODE02.corp.contoso.test"}, "log": {"level": "error"}, "message": "\u0027SQL-02\u0027 background disk merge failed to complete: The process cannot access the file because it is being used by another process. (0x80070020). (Virtual machine ID D5C4A602-CC4A-41B7-BFCB-85359B37E457)", "related": {"hosts": ["HV-NODE02.corp.contoso.test"]}, "winlog": {"channel": "Microsoft-Windows-Hyper-V-VMMS-Admin", "computer_name": "HV-NODE02.corp.contoso.test", "event_id": "19100", "process": {"pid": 2616, "thread": {"id": 9912}}, "provider_guid": "{6066f867-7ca1-4418-85fd-36e3f9c0600c}", "provider_name": "Microsoft-Windows-Hyper-V-VMMS", "record_id": 101312, "user": {"identifier": "S-1-5-18"}, "user_data": {"ErrorCode": "0x80070020", "ErrorMessage": "%%2147942432", "VmId": "D5C4A602-CC4A-41B7-BFCB-85359B37E457", "VmName": "SQL-02"}, "version": 0}}`,
    },
  ],
};
