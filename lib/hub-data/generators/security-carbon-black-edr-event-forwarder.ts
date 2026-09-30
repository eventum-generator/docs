import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCarbonBlackEdrEventForwarder: GeneratorMeta = {
  displayName: 'Carbon Black EDR Event Forwarder',
  category: 'security',
  description:
    'About 9,840 records/day from ten workstations and two automation servers, with legacy ingress JSON and selected Elastic normalization.',
  dataSource: 'Legacy Carbon Black EDR Event Forwarder ingress',
  eventFormat: 'ECS JSON',
  originalFormat: 'JSON',
  highlights: [
    'Stable process identity and GUIDs encoding sensor, PID and creation time',
    'Temporary registry values and files are removed before process exit',
  ],
  anomalyChain:
    'One process starts, writes a registry value, writes a file and makes an external application connection within ten minutes. Host and process GUID join the records. Workstations rotate between episodes. Default interval is 24 hours. First start is within min(interval,24h), weighted by daily activity; later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'carbonblack',
  eventTypes: [
    {
      id: 'ingress.event.procstart',
      description: 'Process starts',
      frequency: '6.1%',
      category: 'process',
    },
    {
      id: 'ingress.event.procend',
      description: 'Process exits',
      frequency: '6.1%',
      category: 'process',
    },
    {
      id: 'ingress.event.regmod',
      description: 'Temporary registry value written or deleted',
      frequency: '3.0%',
      category: 'registry',
    },
    {
      id: 'ingress.event.filemod',
      description: 'Temporary file written or deleted',
      frequency: '10.2%',
      category: 'file',
    },
    {
      id: 'ingress.event.netconn',
      description: 'Outbound application connection',
      frequency: '74.6%',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Stable process identity and GUIDs encoding sensor, PID and creation time',
    'Temporary registry values and files are removed before process exit',
    'Selected ingress types; executable hashes and parent references are synthetic',
  ],
  slug: 'security-carbon-black-edr-event-forwarder',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 5,
  parameters: [
    {
      name: 'cb_server',
      defaultValue: 'cb-01.example.test',
      description: 'EDR server name',
    },
    {
      name: 'link_base',
      defaultValue: 'https://cb-01.example.test/',
      description: 'Console base URL for process and sensor links',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring correlated process activity',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, from 2 to 8760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-21T00:00:33.394736+00:00", "carbonblack": {"edr": {"command_line": "\"c:\\program files\\Fabrikam\\update.exe\"", "computer_name": "SRV-OPS-01", "event_type": "proc", "expect_followon_w_md5": false, "filtering_known_dlls": false, "link_parent": "https://cb-01.example.test/#analyze/0000001f-0000-05dc-01dd-494b758411e0/1", "link_process": "https://cb-01.example.test/#analyze/0000001f-0000-07d4-01dd-495c390ce1e0/0", "link_sensor": "https://cb-01.example.test/#/host/31", "md5": "90A22F0022EB9B544F2731AA76C9C3C3", "parent_create_time": 1789941633, "parent_guid": "0000001f-0000-05dc-01dd-494b758411e0", "parent_md5": "CC528C115378F7E5EB404837962C2206", "parent_path": "c:\\windows\\explorer.exe", "parent_pid": 1500, "parent_process_guid": "0000001f-0000-05dc-01dd-494b758411e0", "path": "c:\\program files\\Fabrikam\\update.exe", "pid": 2004, "process_guid": "0000001f-0000-07d4-01dd-495c390ce1e0", "process_path": "c:\\program files\\Fabrikam\\update.exe", "sensor_id": 31, "sha256": "357DA3610A6743839006711F24AB657BAEBF808A58EFE5761F742A4F9A75F2AD", "timestamp": 1789948833.394736, "username": "svc-monitor1@example.test"}}, "ecs": {"version": "8.11.0"}, "event": {"action": "ingress.event.procstart", "dataset": "carbonblack_edr.log", "kind": "event", "original": "{\"cb_server\": \"cb-01.example.test\", \"command_line\": \"\\\"c:\\\\program files\\\\Fabrikam\\\\update.exe\\\"\", \"computer_name\": \"SRV-OPS-01\", \"event_type\": \"proc\", \"expect_followon_w_md5\": false, \"filtering_known_dlls\": false, \"link_parent\": \"https://cb-01.example.test/#analyze/0000001f-0000-05dc-01dd-494b758411e0/1\", \"link_process\": \"https://cb-01.example.test/#analyze/0000001f-0000-07d4-01dd-495c390ce1e0/0\", \"link_sensor\": \"https://cb-01.example.test/#/host/31\", \"md5\": \"90A22F0022EB9B544F2731AA76C9C3C3\", \"parent_create_time\": 1789941633.394736, \"parent_guid\": \"0000001f-0000-05dc-01dd-494b758411e0\", \"parent_md5\": \"CC528C115378F7E5EB404837962C2206\", \"parent_path\": \"c:\\\\windows\\\\explorer.exe\", \"parent_pid\": 1500, \"parent_process_guid\": \"0000001f-0000-05dc-01dd-494b758411e0\", \"path\": \"c:\\\\program files\\\\Fabrikam\\\\update.exe\", \"pid\": 2004, \"process_guid\": \"0000001f-0000-07d4-01dd-495c390ce1e0\", \"process_path\": \"c:\\\\program files\\\\Fabrikam\\\\update.exe\", \"sensor_id\": 31, \"sha256\": \"357DA3610A6743839006711F24AB657BAEBF808A58EFE5761F742A4F9A75F2AD\", \"timestamp\": 1789948833.394736, \"type\": \"ingress.event.procstart\", \"username\": \"svc-monitor1@example.test\"}"}, "observer": {"name": "cb-01.example.test", "product": "Carbon Black EDR", "type": "edr", "vendor": "VMWare"}, "tags": ["carbonblack_edr-log", "forwarded", "preserve_original_event"]}`,
    },
  ],
};
