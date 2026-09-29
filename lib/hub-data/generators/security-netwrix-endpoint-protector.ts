import type { GeneratorMeta } from '@/lib/hub-types';

export const securityNetwrixEndpointProtector: GeneratorMeta = {
  slug: 'security-netwrix-endpoint-protector',
  displayName: 'Netwrix Endpoint Protector Device Control',
  category: 'security',
  description:
    'Netwrix Endpoint Protector 5.9.4 Device Control events as sent to a SIEM in the documented Standard format with Exclude Headers on, the native body in event.original and all 26 columns in ECS JSON. For DLP and USB-control detection work: an organisation of 1,000 staff plugging approved company storage, reading and writing files, and trying personal phones or flash drives that the policy blocks, about 15,000 records a day along the head-office working day. Recurring episodes show a user whose personal phone was blocked switching to an approved company stick and copying five files to it.',
  dataSource:
    'Netwrix Endpoint Protector 5.9.4 SIEM export, Device Control log type, Standard format with Exclude Headers on',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'All 26 documented Device Control columns in documented order',
    'About 15,000 records a day from 1,000 staff along a UTC+3 office day',
    'Recurring blocked phone followed by a five-file copy to a company stick',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Per user and computer: a personal device D is Blocked, an approved device S different from D is Connected, five File Write records reach S, all within one hour of the Blocked record, and S is Disconnected. The actor is one of the users who plug their own phone in several times a day and had no Blocked record in the previous hour; D is that phone, S the user's own company stick, and the same user never takes two episodes in a row. The span from the first Blocked record to the fifth write is usually under 12 minutes, up to about 20 minutes at night. Episodes recur every anomaly_interval_hours (default 24, minimum 6) of record time: the first starts within min(interval, 24 h) of the start of the data, at an hour that follows the daily volume curve, and each later one within ±min(interval / 4, 6 h) / 2 of one interval after the previous episode's start, weighted toward the busiest hours; missed episodes are not replayed. At the default, episodes are 21-27 h apart, mostly between 09:00 and 17:00; at an 8 h interval they are 7-9 h apart and include night hours. Every step occurs in background; only the complete sequence is absent from it.",
  generatorId: 'epp',
  eventTypes: [
    {
      id: 'File Write',
      description: 'File written to the device',
      frequency: '34.7% of records',
      category: 'file',
    },
    {
      id: 'File Read',
      description: 'File read from the device',
      frequency: '29.2% of records',
      category: 'file',
    },
    {
      id: 'Connected',
      description: 'Approved device connected',
      frequency: '14.4% of records',
      category: 'host',
    },
    {
      id: 'Disconnected',
      description: 'Device disconnected',
      frequency: '14.4% of records',
      category: 'host',
    },
    {
      id: 'File Delete',
      description: 'File deleted from the device',
      frequency: '4.4% of records',
      category: 'file',
    },
    {
      id: 'Blocked',
      description: 'Unapproved device blocked (event.outcome failure)',
      frequency: '3.0% of records',
      category: 'host',
    },
  ],
  realismFeatures: [
    'About 15,000 records a day (14,650-15,270 per day over two weeks) along the working day of the head office, UTC+3 by default: about 0.3% of the daily volume per hour at night, a rise in steps from 05:00 (about 190 records an hour until 07:30, 530 until 08:00 and 390 until 08:30), about 9.8% per hour from 09:00 to 17:00, and a fall through 17:00-19:00. Every day is a working day, with no weekday or weekend cycle.',
    'The organisation has 1,000 staff in eight departments, each with an own workstation (name, IP, MAC, hardware serial, OS, client version, time zone). About a tenth are Operations and IT duty staff on alternating 12-hour day or night shifts at head office, who carry the night-time records. The rest work an office day of about nine hours in their own office zone (head office for three quarters, branch offices 2 h or 4 h east or 1 h west), start within about 20 minutes of their usual time and are away on about 4% of days; users differ in how often they use USB storage.',
    'About 70% own an approved company stick or portable SSD, and every department shares two approved devices; about 65% carry one or two personal devices (iPhone, Android phone, personal flash drive) that the policy blocks. About 40 users plug their own phone in several times a day, mostly to charge it. Blocked is about 3% of records (about 420 a day): about half of all users are blocked at least once in two weeks, and the 40 most frequent carry about 55% of blocks.',
    "An approved session is Connected, then browsing reads, a few writes, a mixed read/write/delete session, a bulk copy of many files written seconds apart, or nothing, then Disconnected; the median session lasts about six minutes. A personal device is re-plugged and blocked again within a minute or two in 40% of cases per attempt, and in half of the attempts an approved device follows a few minutes later. Files come from a per-department pool with skewed popularity, so the same user writes the same file repeatedly; reads and deletes act on what is on the device, and shared devices carry other users' files.",
    'Date/Time(Client) is in the workstation zone: head office at utc_offset_hours (about three quarters of workstations), branch offices 2 h, 4 h or -1 h away. Date/Time(Server) trails the client time by a few seconds, and @timestamp is the client event time at second precision. Records of one session are seconds to minutes apart, not milliseconds: a bulk copy of 20 or more files takes about five minutes in office hours, and at night consecutive records of one session are often minutes apart.',
    'No vendor-captured raw record was available, so the format follows the documented field list only. The value formats of the four date columns, OS, Device Type, Log ID and File Hash, the file path style, and a blocked device emitting Blocked only are inferred; the MAC hyphen style follows the Google SecOps parser. Parser compatibility (for example the KUMA normalizer) was not tested.',
    'Only six Device Control events are modeled (no File Copy, File Rename, Unblocked, Trusted Device, remediation, Content Aware Protection, eDiscovery or Admin Action logs), with no syslog header, one workstation per user and static IPs; volumes and rates are synthetic. Outside episodes, a user writes at most four files to each approved device connected within one hour after a Blocked record, so in that hour sessions with exactly four writes are about twice as common as elsewhere and five or more are almost absent. Each episode adds its own records, so with anomaly_mode true the counts of these records and of the chain parts are about one per episode higher than with it false. The chain is a detection exercise, not proof of data theft.',
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
      defaultValue: '1000',
      description: 'Number of users and workstations (100 to 5000)',
    },
    {
      name: 'utc_offset_hours',
      defaultValue: '3',
      description:
        'Head-office and server time zone (hours from UTC, -12 to 14) for Date/Time(Server) and head-office Date/Time(Client)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Fifth File Write of an anomaly episode',
      json: String.raw`{"@timestamp": "2026-09-02T08:30:54Z", "ecs": {"version": "8.17.0"}, "endpoint_protector": {"device_control": {"fields": {"Client Computer": "ENG-WS-252", "Client User": "dkovaleva2", "Date/Time(Client UTC)": "2026-09-02 08:30:54", "Date/Time(Client)": "2026-09-02 10:30:54", "Date/Time(Server UTC)": "2026-09-02 08:30:55", "Date/Time(Server)": "2026-09-02 11:30:55", "Device": "WD My Passport 25E2", "Device PID": "25E2", "Device Serial": "C4942DEB0E08EFF2", "Device Type": "External HDDs / portable hard disks", "Device VID": "1058", "EPP Client Version": "5.9.4", "Event Name": "File Write", "File Hash": "b98ea0a0c945413292b19310ba2d5493", "File Name": "E:\\Engineering\\Archive\\Firmware mar.bin", "File Size": "5673101", "File Type": "BIN", "IP Address": "10.20.26.156", "Justification": "", "Log ID": "a72942a6c95848e3b1d1b0b485afae9b", "MAC Address": "00-1B-21-72-25-56", "OS": "Windows 10 Enterprise", "Repository Type": "", "Serial Number": "CZCDEDGJTA", "Shadow Exists": "No", "Time Interval": ""}}}, "event": {"action": "file_write", "category": ["file"], "dataset": "endpoint_protector.device_control", "id": "a72942a6c95848e3b1d1b0b485afae9b", "kind": "event", "module": "endpoint_protector", "original": "Device Control \u2013 File Write: [Log ID] a72942a6c95848e3b1d1b0b485afae9b | [Event Name] File Write | [Client Computer] ENG-WS-252 | [IP Address] 10.20.26.156 | [MAC Address] 00-1B-21-72-25-56 | [Serial Number] CZCDEDGJTA | [OS] Windows 10 Enterprise | [Client User] dkovaleva2 | [Device Type] External HDDs / portable hard disks | [Device] WD My Passport 25E2 | [Device VID] 1058 | [Device PID] 25E2 | [Device Serial] C4942DEB0E08EFF2 | [EPP Client Version] 5.9.4 | [File Name] E:\\Engineering\\Archive\\Firmware mar.bin | [File Hash] b98ea0a0c945413292b19310ba2d5493 | [File Type] BIN | [File Size] 5673101 | [Justification]  | [Time Interval]  | [Date/Time(Server)] 2026-09-02 11:30:55 | [Date/Time(Client)] 2026-09-02 10:30:54 | [Date/Time(Server UTC)] 2026-09-02 08:30:55 | [Date/Time(Client UTC)] 2026-09-02 08:30:54 | [Shadow Exists] No | [Repository Type] ", "outcome": "success", "type": ["change"]}, "file": {"extension": "bin", "name": "Firmware mar.bin", "path": "E:\\Engineering\\Archive\\Firmware mar.bin", "size": 5673101}, "host": {"ip": ["10.20.26.156"], "mac": ["00-1B-21-72-25-56"], "name": "ENG-WS-252", "os": {"name": "Windows 10 Enterprise"}}, "message": "Device Control \u2013 File Write", "observer": {"name": "epp-01", "product": "Endpoint Protector", "vendor": "Netwrix", "version": "5.9.4"}, "related": {"hosts": ["ENG-WS-252"], "ip": ["10.20.26.156"], "user": ["dkovaleva2"]}, "source": {"ip": "10.20.26.156"}, "user": {"name": "dkovaleva2"}}`,
    },
  ],
};
