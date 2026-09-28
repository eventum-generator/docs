import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySophosCentral: GeneratorMeta = {
  slug: 'security-sophos-central',
  displayName: 'Sophos Central SIEM CEF Events',
  category: 'security',
  description:
    'Sophos Central endpoint events in the CEF that the Sophos Central SIEM Integration script (siem.py 2.1.0) writes from the SIEM API events endpoint, as ECS JSON with the CEF line in event.original. 74 endpoints report updates, malware and PUA detections, cleanups and cleanup failures independently. Recurring episodes show malware on one endpoint that survives a failed cleanup, is detected again and is then cleaned up.',
  dataSource:
    'Sophos Central SIEM Integration siem.py 2.1.0, format cef, events endpoint (/siem/v1/events)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'CEF built as siem.py 2.1.0 does, in event.original',
    'Independent incidents on 74 endpoints',
    'Recurring detect, cleanup failed, redetect, clean chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One endpoint reports Detected, CleanupFailed tens of seconds later, Detected again several minutes later at the same path and CleanedUp seconds after that, for the same threat and file; an episode spans about 3-66 minutes (measured) and always stays within two hours. The first episode starts at a random time within the first anomaly_interval_hours (default 24, minimum 3) or 24 hours, whichever is shorter, with the hour of day following the detection rate; each next one starts within a window centred on the interval after the actual start of the previous one, a quarter of the interval wide and at most six hours, preferring hours with more detections. Scheduling is on event time and a missed episode is not caught up (measured 21.8-26.8 h apart at the default, 7.1-9.0 h at 8 hours). Endpoint and threat differ from the previous episode. Every step also occurs in background; only the complete ordered sequence is absent from it.',
  generatorId: 'sophos-central',
  eventTypes: [
    {
      id: 'Event::Endpoint::UpdateSuccess',
      description: 'Update succeeded',
      frequency: '60.9% measured share',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::Threat::Detected',
      description: 'Malware detected',
      frequency: '18.6% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanedUp',
      description: 'Malware cleaned up',
      frequency: '11.8% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaDetected',
      description: 'PUA detected',
      frequency: '3.5% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanupFailed',
      description: 'Manual cleanup required',
      frequency: '3.4% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaCleanupFailed',
      description: 'Manual PUA cleanup required',
      frequency: '1.6% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::UserAutoCreated',
      description: 'New user added automatically',
      frequency: '0.3% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    '74 endpoints (64 workstations with one user each, 10 servers) report independently, each with its own activity level and skewed gaps between detection incidents. Workstations are about four times as active in UTC business hours as at night, servers around the clock, and update checks arrive every few hours per endpoint. Measured volume is about 650 events and 150 detection incidents per day; rate and shares are scenario assumptions, not Sophos measurements.',
    'Incidents are automatic cleanups within seconds, repeat detections of the same file within minutes, failed cleanups later resolved manually (median about 1.5 hours) or followed by another detection, and PUA detections often followed by a failed PUA cleanup. Every step, endpoint, threat and path of the episode occurs in ordinary traffic in both modes; an ordinary cleanup that would complete the ordered sequence for the same endpoint, threat and file within two hours of the first detection is reported as CleanupFailed at the same time, also after an episode; any later cleanup of that file inside the same two-hour window is reported the same way, and cleanups after the window are not changed.',
    'The CEF follows siem.py 2.1.0 and name_mapping.py: threat descriptions are split into detection_identity_name and filePath, severity is mapped low 1, medium 5, high 8, source_info.ip is flattened, the renamed fields move to the end of the extension, and = and backslash in values are escaped with a backslash. end is when the endpoint reported the event and rt when Central recorded it, seconds or occasionally tens of minutes later.',
    'Only SIEM API event schema fields are used, plus the datastream field the script adds; the API key order follows the Elastic sophos_central test fixture. Apart from the PUA cleanup text from the script changelog, descriptions, per-type severities and the UserAutoCreated group are modeled, and no live-tenant raw CEF line was found, so byte parity is established only against the script code.',
    'Events endpoint only: no alerts records, IPS, AMSI, core detection, web control, device control or DLP events. Names, RFC 1918 addresses and identifiers are synthetic; the shipped output writes ECS JSON documents rather than the script stdout, file or syslog transport.',
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
      title: 'Failed cleanup of an anomaly episode (CleanupFailed)',
      json: String.raw`{"@timestamp": "2026-09-01T18:36:13.534Z", "ecs": {"version": "8.11.0"}, "event": {"kind": "event", "dataset": "sophos_central.event", "module": "sophos_central", "category": ["malware"], "type": ["info"], "code": "Event::Endpoint::Threat::CleanupFailed", "action": "Manual cleanup required: 'EICAR-AV-Test' at 'C:\\Users\\vlad.jensen\\Downloads\\eicar_test.txt'", "id": "c07f64f3-61d1-4842-8ce0-4863b2888781", "created": "2026-09-01T18:36:18.439Z", "severity": 8, "original": "CEF:0|sophos|sophos central|1.0|Event::Endpoint::Threat::CleanupFailed|EICAR-AV-Test|8|source_info_ip=10.20.36.54 customer_id=6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13 threat=EICAR-AV-Test endpoint_id=ef81a040-ab4e-4620-8a24-710ab2a116cc endpoint_type=computer group=MALWARE id=c07f64f3-61d1-4842-8ce0-4863b2888781 datastream=event detection_identity_name=EICAR-AV-Test filePath=C:\\\\Users\\\\vlad.jensen\\\\Downloads\\\\eicar_test.txt suser=CONTOSO\\\\vlad.jensen rt=2026-09-01T18:36:18.439Z duid=b7d3b36e2925155c0b4966b7 end=2026-09-01T18:36:13.534Z dhost=WS-HR-285"}, "observer": {"vendor": "Sophos", "product": "Sophos Central"}, "organization": {"id": "6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13"}, "host": {"name": "WS-HR-285", "id": "ef81a040-ab4e-4620-8a24-710ab2a116cc"}, "source": {"ip": "10.20.36.54"}, "related": {"ip": ["10.20.36.54"], "hosts": ["WS-HR-285"], "user": ["vlad.jensen"]}, "sophos_central": {"event": {"type": "Event::Endpoint::Threat::CleanupFailed", "group": "MALWARE", "severity": "high", "source": "CONTOSO\\vlad.jensen", "location": "WS-HR-285", "when": "2026-09-01T18:36:13.534Z", "created_at": "2026-09-01T18:36:18.439Z", "endpoint": {"id": "ef81a040-ab4e-4620-8a24-710ab2a116cc", "type": "computer"}, "datastream": "event", "user_id": "b7d3b36e2925155c0b4966b7", "threat": "EICAR-AV-Test", "detection_identity_name": "EICAR-AV-Test"}}, "user": {"name": "vlad.jensen", "domain": "CONTOSO", "id": "b7d3b36e2925155c0b4966b7"}, "file": {"path": "C:\\Users\\vlad.jensen\\Downloads\\eicar_test.txt", "name": "eicar_test.txt"}}`,
    },
  ],
};
