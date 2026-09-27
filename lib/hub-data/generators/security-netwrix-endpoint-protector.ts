import type { GeneratorMeta } from '@/lib/hub-types';

export const securityNetwrixEndpointProtector: GeneratorMeta = {
  slug: 'security-netwrix-endpoint-protector',
  displayName: 'Netwrix Endpoint Protector Device Control',
  category: 'security',
  description:
    'Netwrix Endpoint Protector 5.9.4 Device Control events as sent to a SIEM in the documented Standard format with Exclude Headers on, the native body in event.original and all 26 columns in ECS JSON. For DLP and USB-control detection work: an office of staff plugging approved company storage, reading and writing files, and occasionally trying personal phones or flash drives that the policy blocks. Recurring episodes show a user whose personal device was blocked switching to an approved one and bulk-copying files to it.',
  dataSource:
    'Netwrix Endpoint Protector 5.9.4 SIEM export, Device Control log type, Standard format with Exclude Headers on',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'All 26 documented Device Control columns in documented order',
    'Independent users with own, shared and blocked personal devices',
    'Recurring blocked device followed by a bulk copy to an approved one',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Every 24 hours of source time by default (minimum 6): the first episode is armed 1 h after the start plus a random delay of up to min(1 h, interval / 8), and the next background blocked attempt that is naturally followed by an approved device, by a user other than the previous episode's, becomes the episode. The next episode is due one interval after this episode's first Blocked record and is armed after a new random delay; missed episodes are not replayed. The wait for a natural attempt adds to the interval: 25.2-29.5 h apart at the default, 8.8-19.3 h at 8 h. Per user and computer, a personal device is Blocked, a different approved device is Connected, at least five File Write records reach it within one hour of the block (2.3-11.8 min to the fifth write measured), and the device is Disconnected. Every step occurs in background; only the complete sequence is absent from it.",
  generatorId: 'epp',
  eventTypes: [
    {
      id: 'File Write',
      description: 'File written to the device',
      frequency: '34.6% measured share',
      category: 'file',
    },
    {
      id: 'File Read',
      description: 'File read from the device',
      frequency: '30.4% measured share',
      category: 'file',
    },
    {
      id: 'Connected',
      description: 'Approved device connected',
      frequency: '14.7% measured share',
      category: 'host',
    },
    {
      id: 'Disconnected',
      description: 'Device disconnected',
      frequency: '14.7% measured share',
      category: 'host',
    },
    {
      id: 'File Delete',
      description: 'File deleted from the device',
      frequency: '4.4% measured share',
      category: 'file',
    },
    {
      id: 'Blocked',
      description: 'Unapproved device blocked (event.outcome failure)',
      frequency: '1.2% measured share',
      category: 'host',
    },
  ],
  realismFeatures: [
    'staff_count users (80 by default) in eight departments, each with an own workstation (name, IP, MAC, hardware serial, OS, client version, time zone). About 70% own an approved company stick or portable SSD, every department shares two approved devices, and about 65% carry one or two personal devices (iPhone, Android phone, personal flash drive) that the policy blocks.',
    'Users work randomly phased shifts (about 9 h on, 14.5 h off, sometimes longer absences) and start device activities at lognormal gaps scaled by a per-user pace. An approved-device session is Connected, then browsing reads, a few writes, a mixed read/write/delete session, a bulk copy or nothing, then Disconnected; a blocked personal device is re-plugged and blocked again within a minute or two in 40% of cases per attempt, and half of the attempts are followed a few minutes later by an approved-device session.',
    "Files come from a per-department pool with skewed popularity, so the same user writes the same file repeatedly; reads and deletes act on what is actually on the device, and shared devices carry other users' files.",
    'Date/Time(Client) is in the workstation zone: head office at utc_offset_hours (75% of workstations), branch offices 2 h, 4 h or -1 h away. Date/Time(Server) trails the client time by a few seconds, and @timestamp is the client event time at second precision.',
    'No vendor-captured raw record was available, so the format follows the documented field list only. The value formats of the four date columns, OS, Device Type, Log ID and File Hash, the file path style, and a blocked device emitting Blocked only are inferred; the MAC hyphen style follows the Google SecOps parser. Parser compatibility (for example the KUMA normalizer) was not tested.',
    'Only six Device Control events are modeled, with no syslog header, no weekday or business-hours cycle, one workstation per user and static IPs; volumes and rates are synthetic. The guard that keeps the complete chain out of background also removes bulk copies from the two hours after a blocked device. The chain is a detection exercise, not proof of data theft.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring anomaly chain episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        "Hours between episodes (6 to 8760), counted from the previous episode's start",
    },
    {
      name: 'epp_server',
      defaultValue: 'epp-01',
      description: 'Endpoint Protector server name in observer.name',
    },
    {
      name: 'staff_count',
      defaultValue: '80',
      description: 'Number of users and workstations (20 to 1000)',
    },
    {
      name: 'utc_offset_hours',
      defaultValue: '3',
      description:
        'Server time zone (hours from UTC, -12 to 14) for Date/Time(Server); head-office workstations use it for Date/Time(Client) too',
    },
  ],
  sampleOutputs: [
    {
      title: 'Fifth File Write of an anomaly episode',
      json: String.raw`{"@timestamp": "2026-09-04T12:44:53Z", "ecs": {"version": "8.17.0"}, "endpoint_protector": {"device_control": {"fields": {"Client Computer": "FIN-WS-256", "Client User": "psorokin", "Date/Time(Client UTC)": "2026-09-04 12:44:53", "Date/Time(Client)": "2026-09-04 15:44:53", "Date/Time(Server UTC)": "2026-09-04 12:44:55", "Date/Time(Server)": "2026-09-04 15:44:55", "Device": "Kingston DataTraveler 3.0", "Device PID": "1666", "Device Serial": "160DD8A45DB0EEF5", "Device Type": "Removable Storage Devices", "Device VID": "0951", "EPP Client Version": "5.9.4", "Event Name": "File Write", "File Hash": "2b715c2633308664c7a2382d82e9fc2e", "File Name": "D:\\Finance\\Work\\Payroll 2026.csv", "File Size": "578866", "File Type": "CSV", "IP Address": "10.20.3.120", "Justification": "", "Log ID": "46d60465370d4501b39027677534ae92", "MAC Address": "F8-B4-6A-4B-46-57", "OS": "Windows 10 Enterprise", "Repository Type": "", "Serial Number": "MXLVLUEKGH", "Shadow Exists": "No", "Time Interval": ""}}}, "event": {"action": "file_write", "category": ["file"], "dataset": "endpoint_protector.device_control", "id": "46d60465370d4501b39027677534ae92", "kind": "event", "module": "endpoint_protector", "original": "Device Control \u2013 File Write: [Log ID] 46d60465370d4501b39027677534ae92 | [Event Name] File Write | [Client Computer] FIN-WS-256 | [IP Address] 10.20.3.120 | [MAC Address] F8-B4-6A-4B-46-57 | [Serial Number] MXLVLUEKGH | [OS] Windows 10 Enterprise | [Client User] psorokin | [Device Type] Removable Storage Devices | [Device] Kingston DataTraveler 3.0 | [Device VID] 0951 | [Device PID] 1666 | [Device Serial] 160DD8A45DB0EEF5 | [EPP Client Version] 5.9.4 | [File Name] D:\\Finance\\Work\\Payroll 2026.csv | [File Hash] 2b715c2633308664c7a2382d82e9fc2e | [File Type] CSV | [File Size] 578866 | [Justification]  | [Time Interval]  | [Date/Time(Server)] 2026-09-04 15:44:55 | [Date/Time(Client)] 2026-09-04 15:44:53 | [Date/Time(Server UTC)] 2026-09-04 12:44:55 | [Date/Time(Client UTC)] 2026-09-04 12:44:53 | [Shadow Exists] No | [Repository Type] ", "outcome": "success", "type": ["change"]}, "file": {"extension": "csv", "name": "Payroll 2026.csv", "path": "D:\\Finance\\Work\\Payroll 2026.csv", "size": 578866}, "host": {"ip": ["10.20.3.120"], "mac": ["F8-B4-6A-4B-46-57"], "name": "FIN-WS-256", "os": {"name": "Windows 10 Enterprise"}}, "message": "Device Control \u2013 File Write", "observer": {"name": "epp-01", "product": "Endpoint Protector", "vendor": "Netwrix", "version": "5.9.4"}, "related": {"hosts": ["FIN-WS-256"], "ip": ["10.20.3.120"], "user": ["psorokin"]}, "source": {"ip": "10.20.3.120"}, "user": {"name": "psorokin"}}`,
    },
  ],
};
