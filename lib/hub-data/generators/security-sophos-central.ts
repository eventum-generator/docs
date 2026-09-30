import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySophosCentral: GeneratorMeta = {
  slug: 'security-sophos-central',
  displayName: 'Sophos Central SIEM CEF Events',
  category: 'security',
  description:
    'Sophos Central endpoint events in the CEF that the Sophos Central SIEM Integration script (siem.py 2.1.0) writes from the SIEM API events endpoint, as ECS JSON with the CEF line in event.original. About 640 events a day from 74 endpoints, mostly update checks, web control blocks, peripheral alerts and scheduled scans, with a normal malware and PUA baseline concentrated on three busy endpoints. Recurring episodes show malware on one endpoint that survives a failed cleanup, is detected again and is then cleaned up.',
  dataSource:
    'Sophos Central SIEM Integration siem.py 2.1.0, format cef, events endpoint (/siem/v1/events)',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'CEF built as siem.py 2.1.0 does, in event.original',
    '74 endpoints with routine events and a normal threat baseline',
    'Recurring detect, cleanup failed, redetect, clean chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One of the three busy endpoints reports Detected, CleanupFailed one to a few minutes later, Detected again several minutes later at the same path and CleanedUp a minute or two after that, for the same threat (Mal/Generic-S or ML/PE-A) and file; an episode spans from a few minutes to about an hour and a half and always stays within two hours. The first episode starts at a random time within the first anomaly_interval_hours (default 24, minimum 3) or the first 24 hours, whichever is shorter, more likely in business hours than at night; each next one starts within a window centred on anomaly_interval_hours after the actual start of the previous one, a quarter of the interval wide and at most six hours, preferring hours with more detections. Start times therefore drift through the day: consecutive episodes are 21-27 hours apart at the default interval and 7-9 hours apart at 8 hours. Each episode picks another endpoint and threat than the previous one. Every step, endpoint and threat also occurs in ordinary traffic; only the complete ordered sequence is absent from it.',
  generatorId: 'sophos-central',
  eventTypes: [
    {
      id: 'Event::Endpoint::UpdateSuccess',
      description: 'Update succeeded',
      frequency: '68.8% of records',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::WebControlViolation',
      description: 'Website blocked by web control',
      frequency: '17.8% of records',
      category: 'web',
    },
    {
      id: 'Event::Endpoint::Device::AlertedOnly',
      description: 'Peripheral allowed (device control in alert-only mode)',
      frequency: '6.0% of records',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::SavScanComplete',
      description: 'Scheduled scan completed',
      frequency: '3.9% of records',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::Threat::Detected',
      description: 'Malware detected',
      frequency: '1.1% of records',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanedUp',
      description: 'Malware cleaned up',
      frequency: '0.8% of records',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::UpdateFailure',
      description: 'Update failed',
      frequency: '0.7% of records',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::UserAutoCreated',
      description: 'New user added automatically',
      frequency: '0.4% of records',
      category: 'iam',
    },
    {
      id: 'Event::Endpoint::Threat::CleanupFailed',
      description: 'Manual cleanup required',
      frequency: '0.2% of records',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaDetected',
      description: 'PUA detected',
      frequency: '0.2% of records',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaCleanupFailed',
      description: 'Manual PUA cleanup required',
      frequency: '0.1% of records',
      category: 'malware',
    },
  ],
  realismFeatures: [
    '74 endpoints (64 workstations with one user each, 10 servers) report independently, about 640 events a day. Workstations (about 545 a day) follow the office day in UTC: about 10 events an hour from 20:00 to 05:00, rising through 05:00-07:00 to about 35 an hour from 07:00 to 17:00 and falling back by 20:00; servers (about 95 a day) send about 4 an hour around the clock. Each day differs from the base volume by up to 3%, weekends carry the same volume as weekdays, and there is no holiday cycle. Rate and shares are scenario assumptions, not Sophos measurements.',
    'Most records are routine: every endpoint checks for updates several times a day and about 1% of the checks fail, and each endpoint completes a scheduled scan about twice a week. Workstation users hit blocked web categories (games, streaming, social networking, gambling and others; about 110 blocks a day) and connect USB drives and phones that device control allows with an alert (about 37 a day), almost entirely in the office day; a new user is added automatically two or three times a day.',
    'Threat activity is a normal baseline rather than an outbreak: about 5 malware detections, fewer than one PUA detection and about one failed cleanup a day, most on two workstations whose users download a lot and one terminal server; in a typical week about 9-17 endpoints have a detection and 3-7 a failed cleanup. Mal/Generic-S and ML/PE-A make up about 60% of the malware detections. Incidents are automatic cleanups 30 s to 6 min after detection (median about 2 min), repeat detections of the same file 4-36 min apart, failed cleanups resolved manually after a median of about 1.5 hours or followed by another detection, and PUA detections often followed by a failed PUA cleanup.',
    'Episodes keep the total volume and its hour curve, replacing about four routine records each; threat records are not reduced, so at the default interval the tenant has about two more detections and one more failed cleanup a day than with anomaly_mode false. Episode file paths come from the same folders and file names as ordinary detections. An ordinary cleanup that would complete the ordered sequence for the same endpoint, threat and file within two hours of the first detection is reported as CleanupFailed at the same time, as is any later cleanup of that file inside the same window; this affects less than one ordinary cleanup a month.',
    'The CEF follows siem.py 2.1.0 and name_mapping.py: threat descriptions are split into detection_identity_name and filePath, severity is mapped low 1, medium 5, high 8, source_info.ip is flattened, the renamed fields move to the end of the extension, and = and backslash in values are escaped with a backslash. end is when the endpoint reported the event and rt when Central recorded it, seconds or occasionally tens of minutes later. Records a real endpoint sends seconds apart (a detection and its cleanup or failed cleanup) are one to several minutes apart here, at night up to about half an hour.',
    'Only SIEM API event schema fields are used, plus the datastream field the script adds; the API key order follows the Elastic sophos_central test fixture. Web control and peripheral texts follow published SIEM samples, and the PUA cleanup text follows the script changelog; the other descriptions, per-type severities and some groups are modeled, and no live-tenant raw CEF line was found, so byte parity is established only against the script code.',
    'Events endpoint only: no alerts records, IPS, AMSI, core detection, web filtering, application control, compliance or DLP events. Names, RFC 1918 addresses, .example web domains and identifiers are synthetic; the shipped output writes ECS JSON documents rather than the script stdout, file or syslog transport.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring Detected, CleanupFailed, Detected, CleanedUp episode; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the start of one episode to the time the next is due, 3 to 8,760',
    },
    {
      name: 'customer_id',
      defaultValue: '6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13',
      description: 'Sophos Central tenant (customer) ID in customer_id',
    },
    {
      name: 'domain',
      defaultValue: 'CONTOSO',
      description: String.raw`Windows domain in suser (DOMAIN\user) for workstation users`,
    },
  ],
  sampleOutputs: [
    {
      title: 'First detection of an anomaly episode (Detected)',
      json: String.raw`{"@timestamp": "2026-09-02T20:12:30.847Z", "ecs": {"version": "8.11.0"}, "event": {"kind": "event", "dataset": "sophos_central.event", "module": "sophos_central", "category": ["malware"], "type": ["info"], "code": "Event::Endpoint::Threat::Detected", "action": "Malware detected: 'ML/PE-A' at 'C:\\Users\\yuri.smith\\Desktop\\crack_keygen.exe'", "id": "42559af0-b52a-4079-b3eb-60c7479a04ad", "created": "2026-09-02T20:12:35.761Z", "severity": 8, "original": "CEF:0|sophos|sophos central|1.0|Event::Endpoint::Threat::Detected|ML/PE-A|8|source_info_ip=10.20.15.139 customer_id=6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13 threat=ML/PE-A endpoint_id=595864a4-07e6-42be-8e14-f2deb6c1b27d endpoint_type=computer group=MALWARE id=42559af0-b52a-4079-b3eb-60c7479a04ad datastream=event detection_identity_name=ML/PE-A filePath=C:\\\\Users\\\\yuri.smith\\\\Desktop\\\\crack_keygen.exe suser=CONTOSO\\\\yuri.smith rt=2026-09-02T20:12:35.761Z duid=4cc74ae9af9f2e66038ff7e7 end=2026-09-02T20:12:30.847Z dhost=WS-ENG-679"}, "observer": {"vendor": "Sophos", "product": "Sophos Central"}, "organization": {"id": "6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13"}, "host": {"name": "WS-ENG-679", "id": "595864a4-07e6-42be-8e14-f2deb6c1b27d"}, "source": {"ip": "10.20.15.139"}, "related": {"ip": ["10.20.15.139"], "hosts": ["WS-ENG-679"], "user": ["yuri.smith"]}, "sophos_central": {"event": {"type": "Event::Endpoint::Threat::Detected", "group": "MALWARE", "severity": "high", "source": "CONTOSO\\yuri.smith", "location": "WS-ENG-679", "when": "2026-09-02T20:12:30.847Z", "created_at": "2026-09-02T20:12:35.761Z", "endpoint": {"id": "595864a4-07e6-42be-8e14-f2deb6c1b27d", "type": "computer"}, "datastream": "event", "user_id": "4cc74ae9af9f2e66038ff7e7", "threat": "ML/PE-A", "detection_identity_name": "ML/PE-A"}}, "user": {"name": "yuri.smith", "domain": "CONTOSO", "id": "4cc74ae9af9f2e66038ff7e7"}, "file": {"path": "C:\\Users\\yuri.smith\\Desktop\\crack_keygen.exe", "name": "crack_keygen.exe"}}`,
    },
  ],
};
