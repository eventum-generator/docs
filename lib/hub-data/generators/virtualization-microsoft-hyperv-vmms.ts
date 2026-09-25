import type { GeneratorMeta } from '@/lib/hub-types';

export const virtualizationMicrosoftHypervVmms: GeneratorMeta = {
  slug: 'virtualization-microsoft-hyperv-vmms',
  displayName: 'Microsoft Hyper-V VMMS checkpoint events',
  category: 'virtualization',
  description:
    'Hyper-V VMMS Admin XML with a correlated checkpoint and disk-merge failure burst.',
  dataSource: 'Microsoft-Windows-Hyper-V-VMMS-Admin XML',
  format: ['JSON', 'ECS', 'Windows XML'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Full Event Viewer XML preserved in event.original',
    'Provider, channel, record ID and VM GUID remain queryable',
    'Same-VM fault burst amid isolated errors on other VMs',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Repeated checkpoint cancellation, failure and disk-merge error for the same Hyper-V VM.',
  generatorId: 'hyperv',
  eventTypes: [
    {
      id: '18014',
      description: 'Checkpoint operation cancelled',
      frequency: '45% baseline',
      category: 'host',
    },
    {
      id: '18012',
      description: 'Checkpoint operation failed',
      frequency: '40% baseline',
      category: 'host',
    },
    {
      id: '19100',
      description: 'Background disk merge failed',
      frequency: '15% baseline',
      category: 'host',
    },
  ],
  realismFeatures: [
    'Full Event Viewer XML preserved in event.original',
    'Provider, channel, record ID and VM GUID remain queryable',
    'Same-VM fault burst amid isolated errors on other VMs',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the correlated VM fault burst',
    },
    {
      name: 'host_name',
      defaultValue: 'hyperv-02.example.test',
      description: 'VMMS host',
    },
    {
      name: 'affected_vm_name',
      defaultValue: 'APP-02',
      description: 'VM in the fault burst',
    },
    {
      name: 'affected_vm_id',
      defaultValue: '8F233F6C-28E0-44B7-8A16-C57D0D72DB61',
      description: 'Stable affected VM GUID',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example disk-merge-failed',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:52:43+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "disk-merge-failed",
    "category": [
      "host"
    ],
    "code": "19100",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Hyper-V-VMMS\" Guid=\"{6066f867-7ca1-4418-85fd-36e3f9c0600c}\"/><EventID>19100</EventID><Version>0</Version><Level>2</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x8000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T12:52:43.000000Z\"/><EventRecordID>50048</EventRecordID><Correlation/><Execution ProcessID=\"2748\" ThreadID=\"1160\"/><Channel>Microsoft-Windows-Hyper-V-VMMS-Admin</Channel><Computer>hyperv-02.example.test</Computer><Security UserID=\"S-1-5-18\"/></System><UserData><VmlEventLog xmlns=\"http://www.microsoft.com/Windows/Virtualization/Events\"><VmName>APP-02</VmName><VmId>8F233F6C-28E0-44B7-8A16-C57D0D72DB61</VmId><ErrorMessage>%%2147942432</ErrorMessage><ErrorCode>0x80070020</ErrorCode></VmlEventLog></UserData></Event>",
    "outcome": "failure",
    "type": [
      "error"
    ]
  },
  "host": {
    "name": "hyperv-02.example.test"
  },
  "hyperv": {
    "error_code": "0x80070020",
    "vm": {
      "id": "8F233F6C-28E0-44B7-8A16-C57D0D72DB61",
      "name": "APP-02"
    }
  },
  "message": "'APP-02' background disk merge failed to complete: The process cannot access the file because it is being used by another process. (0x80070020). (Virtual machine ID 8F233F6C-28E0-44B7-8A16-C57D0D72DB61)",
  "related": {
    "hosts": [
      "hyperv-02.example.test"
    ]
  },
  "winlog": {
    "channel": "Microsoft-Windows-Hyper-V-VMMS-Admin",
    "provider_name": "Microsoft-Windows-Hyper-V-VMMS",
    "record_id": 50048,
    "user": {
      "identifier": "S-1-5-18"
    }
  }
}`,
    },
  ],
};
