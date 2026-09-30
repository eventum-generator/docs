/* eslint-disable sonarjs/no-hardcoded-ip -- The default build 11.1.20.0 is a version string, not an address. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityEsetProtect: GeneratorMeta = {
  slug: 'security-eset-protect',
  displayName: 'ESET PROTECT On-Prem CEF',
  category: 'security',
  description:
    'ESET PROTECT On-Prem 11.1 Threat, Firewall and HIPS detection events as exported to Syslog in CEF, from 48 fictional Windows workstations, written as ECS JSON with the bare CEF payload in event.original. About 340 records a day on a UTC daily curve. Recurring episodes show one endpoint repeatedly blocked from launching a file that a scanner then cleans.',
  dataSource: 'ESET PROTECT On-Prem 11.1 Syslog export in CEF',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Bare CEF payload in event.original',
    'Incidents on 48 workstations with a UTC daily curve',
    'Recurring repeated-HIPS-block-to-cleanup chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An episode is due every 24 hours of event time by default (anomaly_interval_hours, minimum 3). The first starts within the first min(interval, 24 h), at a time drawn from the hourly record rate; each later one starts at a random time in a window of min(interval / 4, 6 h) centred on its due time (the previous actual start plus the interval), favouring office hours, so consecutive episodes are 21-27 h apart at the default. At night a start can slip past its window by up to a few hours; missed intervals are never caught up. On one endpoint, HIPS blocks the same application from running the same suspicious file three times (four in 39% of episodes) minutes apart, then the on-demand (60%) or real-time scanner cleans that file by deleting it; an episode usually spans 20-70 minutes. When a long quiet spell at night would leave fewer than three blocks within the two hours before the cleanup, the application tries again (up to three more blocks, rarely stretching the episode to about five hours), so every episode ends with three blocks within two hours of its cleanup. Endpoint and file differ from the previous episode. Every element also occurs in background; only a cleanup of a file after three or more blocks of it on that endpoint within two hours is episode-only.',
  generatorId: 'eset-protect',
  eventTypes: [
    {
      id: 'ESET Firewall Event',
      description:
        'Class 209: inbound TCP port scan blocked, one to four probes from one scanner within minutes',
      frequency: '44.4% share over 14 days',
      category: 'network, intrusion_detection',
    },
    {
      id: 'ESET Threat Event',
      description:
        'Class 183: file cleaned by deleting, by real-time protection when a file is created or by either scanner after HIPS blocks',
      frequency: '31.5% share over 14 days',
      category: 'malware, file',
    },
    {
      id: 'ESET HIPS Event',
      description:
        'Class 303: attempt to run a suspicious object blocked, one to four attempts of the same file minutes apart',
      frequency: '24.1% share over 14 days',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Incidents start on the 48 endpoints in proportion to per-endpoint weights (the busiest about eleven times the quietest): 45% port scans, 36% real-time cleanups and 18% HIPS incidents. About 340 records a day in four UTC bands, from about 5.5 an hour at night to about 22 an hour in 07:00-18:00, each band varying by up to 3% a day; weekends carry the same volume as weekdays. Rates are synthetic, not ESET production ratios.',
    'A HIPS incident blocks one file one to four times (45/27/17/11%), launched by Explorer, cmd, wscript, PowerShell, Word or svchost; 40% end with the file cleaned later, 60% of those by the on-demand scanner. 15% of real-time cleanups repeat when the user downloads the file again.',
    'Records of one incident are spaced by random delays: HIPS retries 30 s to 15 min apart (median 3 min), the cleanup 1-40 min after the last block, port probes 5 s to 15 min apart, a repeated download cleanup 1 min to 2 h later; at night these gaps are often 10-30 minutes. Records a real agent would send in one replication batch are therefore seconds to minutes apart, and @timestamp and rt carry whole seconds.',
    'Runs of three or four blocks of one file, one or two blocks followed by a cleanup of that file, and cleanups without any block occur in both modes. Outside episodes, a cleanup that follows three or more blocks of the same file on that endpoint within two hours removes a copy in another user folder (about four a day), never the blocked file itself. With anomaly_mode true the record count is unchanged: runs of three or more blocks are about one per episode more frequent, and ordinary incidents correspondingly fewer.',
    'Fields and their order follow the vendor raw examples and field tables, with no live capture; the examples print CEF:O, the generator emits CEF:0. Endpoints are linked by deviceExternalId, dvchost and dvc, files by HIPS cs5 and the decoded Threat filePath; HIPS events carry no hash, so cs8 cannot join the steps. Detection names, file names, hashes, scanner addresses and the engine build in cs2 are synthetic, and cnt varies from 1 to 5 without modeling replication batches.',
    'Firewall class ID 209 follows the documented 200-299 range and the PROTECT Cloud example, while the On-Prem 11.1 firewall example prints 109; it is unconfirmed from an On-Prem export. Only documented class IDs 183, 209 and 303 are emitted: no failed cleanups, quarantine actions, Audit, ESET Inspect, Blocked File or Filtered Website events.',
    "The output is ECS JSON with a bare CEF payload, not a Syslog frame, and the ECS projection is this pack's own because the Elastic integration parses the JSON export, not CEF. Parsing with the KUMA ESET PROTECT 11.0 CEF normalizer is unverified.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring HIPS-to-cleanup episode; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, minimum 3',
    },
    {
      name: 'protect_version',
      defaultValue: '11.1.20.0',
      description:
        'On-Prem build in the CEF Device Version and observer.version; the 11.1 field profile does not change',
    },
    {
      name: 'protect_host',
      defaultValue: 'protect-01.example.test',
      description: 'Management server name in observer.name',
    },
  ],
  sampleOutputs: [
    {
      title: 'Threat cleanup ending an episode',
      json: String.raw`{"@timestamp": "2026-09-03T15:46:37Z", "ecs": {"version": "8.17.0"}, "event": {"kind": "alert", "module": "eset", "dataset": "eset.protect", "code": "183", "action": "Cleaned by deleting", "category": ["malware", "file"], "type": ["info", "deletion"], "severity": 5, "original": "CEF:0|ESET|Protect|11.1.20.0|183|File scanner cleaned a virus|5|dvc=10.20.1.63 dvchost=ws-dev-03 deviceExternalId=edb0d239-3061-4ba5-a149-1307e5ff1ced ESETProtectDeviceGroupName=All/Workstations/Development ESETProtectDeviceOsName=Microsoft Windows 11 Enterprise ESETProtectDeviceGroupDescription=Developer workstations cat=ESET Threat Event rt=Sep 03 2026 15:46:37 cs1=Win32/Agent.Gen cs1Label=Threat Name cs2=34052 (20260903) cs2Label=Engine Version cs3=Virus cs3Label=Threat Type cs4=On-demand scanner cs4Label=Scanner ID act=Cleaned by deleting fileType=File filePath=file:///C:/Users/dev03/Downloads/task-helper.exe cn1=1 cn1Label=Handled cn2=0 cn2Label=Restart Needed suser=EXAMPLE\\\\dev03 deviceCustomDate1=Sep 03 2026 15:46:37 deviceCustomDate1Label=FirstSeen cs8=3ccf83ba204b33d808b3c663b82bb8b3eb57d073 cs8Label=Hash"}, "observer": {"name": "protect-01.example.test", "vendor": "ESET", "product": "Protect", "version": "11.1.20.0"}, "host": {"name": "ws-dev-03", "id": "edb0d239-3061-4ba5-a149-1307e5ff1ced", "ip": ["10.20.1.63"], "os": {"name": "Microsoft Windows 11 Enterprise"}}, "eset": {"protect": {"category": "threat", "class_id": "183", "group": "All/Workstations/Development", "threat_name": "Win32/Agent.Gen", "scanner": "On-demand scanner", "engine_version": "34052 (20260903)"}}, "related": {"ip": ["10.20.1.63"], "hosts": ["ws-dev-03"], "user": ["dev03"], "hash": ["3ccf83ba204b33d808b3c663b82bb8b3eb57d073"]}, "file": {"path": "C:\\Users\\dev03\\Downloads\\task-helper.exe", "name": "task-helper.exe", "hash": {"sha1": "3ccf83ba204b33d808b3c663b82bb8b3eb57d073"}}, "user": {"name": "dev03", "domain": "EXAMPLE"}}`,
    },
  ],
};
