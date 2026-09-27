/* eslint-disable sonarjs/no-hardcoded-ip -- The default build 11.1.20.0 is a version string, not an address. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityEsetProtect: GeneratorMeta = {
  slug: 'security-eset-protect',
  displayName: 'ESET PROTECT On-Prem CEF',
  category: 'security',
  description:
    'ESET PROTECT On-Prem 11.1 Threat, Firewall and HIPS detection events as exported to Syslog in CEF, from 48 fictional Windows workstations, written as ECS JSON with the bare CEF payload in event.original. Recurring episodes show one endpoint repeatedly blocked from launching a file that a scanner then cleans.',
  dataSource: 'ESET PROTECT On-Prem 11.1 Syslog export in CEF',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Bare CEF payload in event.original',
    'Independent incidents on 48 workstations',
    'Recurring repeated-HIPS-block-to-cleanup chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due one hour after the generator starts; each starts after a random delay of up to one hour past its due time (or up to one eighth of the interval when shorter), and the next is due 24 hours by default after the actual start, with no catch-up. On one endpoint, HIPS blocks the same application from running the same suspicious file three or four times minutes apart, then the on-demand or real-time scanner cleans that file by deleting it, about 10-45 minutes in the measured captures, longer ones possible. Endpoint and file change every episode; every element also occurs in background, and only a cleanup after three or more blocks of that file on that endpoint within three hours is episode-only.',
  generatorId: 'eset-protect',
  eventTypes: [
    {
      id: 'ESET Firewall Event',
      description:
        'Class 209: inbound TCP port scan blocked, one to four probes from one scanner within minutes',
      frequency: '47.3% measured share',
      category: 'network, intrusion_detection',
    },
    {
      id: 'ESET Threat Event',
      description:
        'Class 183: file cleaned by deleting, by real-time protection on file creation or by either scanner after HIPS blocks',
      frequency: '30.3% measured share',
      category: 'malware, file',
    },
    {
      id: 'ESET HIPS Event',
      description:
        'Class 303: attempt to run a suspicious object blocked, one to four attempts of the same file minutes apart',
      frequency: '22.4% measured share',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Every endpoint produces its own incidents at random intervals, with fewer outside office hours (UTC); a default 10-day capture held 3,364 events, about 335 per day. Rates, the diurnal curve, detection names, file names, hashes and scanner addresses are synthetic, not ESET production ratios.',
    'Background HIPS incidents block one file one to four times, launched by Explorer, cmd, wscript, PowerShell, Word or svchost, and up to 40% end with the file cleaned later; real-time cleanups sometimes repeat when a user downloads a file again. Episode gaps come from the same distributions.',
    'Fields and their order follow the vendor raw examples and field tables, with no live capture. Endpoints are linked by deviceExternalId, dvchost and dvc, files by HIPS cs5 and the decoded Threat filePath; HIPS events carry no hash, so cs8 cannot join the steps.',
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
      json: String.raw`{"@timestamp": "2026-09-01T02:08:39Z", "ecs": {"version": "8.17.0"}, "event": {"kind": "alert", "module": "eset", "dataset": "eset.protect", "code": "183", "action": "Cleaned by deleting", "category": ["malware", "file"], "type": ["info", "deletion"], "severity": 5, "original": "CEF:0|ESET|Protect|11.1.20.0|183|File scanner cleaned a virus|5|dvc=10.20.1.57 dvchost=ws-hr-07 deviceExternalId=ceaf535f-9788-4dc2-ab65-ef20909e6fad ESETProtectDeviceGroupName=All/Workstations/HR ESETProtectDeviceOsName=Microsoft Windows 11 Enterprise ESETProtectDeviceGroupDescription=HR department workstations cat=ESET Threat Event rt=Sep 01 2026 02:08:39 cs1=Win32/Agent.Gen cs1Label=Threat Name cs2=34040 (20260901) cs2Label=Engine Version cs3=Virus cs3Label=Threat Type cs4=On-demand scanner cs4Label=Scanner ID act=Cleaned by deleting fileType=File filePath=file:///C:/Users/hr07/Downloads/task-helper.exe cn1=1 cn1Label=Handled cn2=0 cn2Label=Restart Needed suser=EXAMPLE\\\\hr07 deviceCustomDate1=Sep 01 2026 02:08:39 deviceCustomDate1Label=FirstSeen cs8=3ccf83ba204b33d808b3c663b82bb8b3eb57d073 cs8Label=Hash"}, "observer": {"name": "protect-01.example.test", "vendor": "ESET", "product": "Protect", "version": "11.1.20.0"}, "host": {"name": "ws-hr-07", "id": "ceaf535f-9788-4dc2-ab65-ef20909e6fad", "ip": ["10.20.1.57"], "os": {"name": "Microsoft Windows 11 Enterprise"}}, "eset": {"protect": {"category": "threat", "class_id": "183", "group": "All/Workstations/HR", "threat_name": "Win32/Agent.Gen", "scanner": "On-demand scanner", "engine_version": "34040 (20260901)"}}, "related": {"ip": ["10.20.1.57"], "hosts": ["ws-hr-07"], "user": ["hr07"], "hash": ["3ccf83ba204b33d808b3c663b82bb8b3eb57d073"]}, "file": {"path": "C:\\Users\\hr07\\Downloads\\task-helper.exe", "name": "task-helper.exe", "hash": {"sha1": "3ccf83ba204b33d808b3c663b82bb8b3eb57d073"}}, "user": {"name": "hr07", "domain": "EXAMPLE"}}`,
    },
  ],
};
