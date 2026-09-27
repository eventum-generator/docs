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
    'About every 24 hours by default (the first due one hour after the generator starts, each next due the configured hours after the previous actual start; each start waits a random delay of up to one hour, or up to one eighth of the interval when shorter; a missed episode is not caught up), one endpoint reports Detected, CleanupFailed tens of seconds later, Detected again several minutes later and CleanedUp seconds after that, for the same threat and file path. Episodes span about 3-35 minutes; endpoint and threat differ from the previous episode. Every step also occurs in background; only the complete ordered sequence is absent from it.',
  generatorId: 'sophos-central',
  eventTypes: [
    {
      id: 'Event::Endpoint::UpdateSuccess',
      description: 'Update succeeded',
      frequency: '59.1% measured share',
      category: 'host',
    },
    {
      id: 'Event::Endpoint::Threat::Detected',
      description: 'Malware detected',
      frequency: '19.5% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanedUp',
      description: 'Malware cleaned up',
      frequency: '13.0% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaDetected',
      description: 'PUA detected',
      frequency: '3.6% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::CleanupFailed',
      description: 'Manual cleanup required',
      frequency: '3.1% measured share',
      category: 'malware',
    },
    {
      id: 'Event::Endpoint::Threat::PuaCleanupFailed',
      description: 'Manual PUA cleanup required',
      frequency: '1.4% measured share',
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
    '74 endpoints (64 workstations with one user each, 10 servers) report independently, each with its own activity level and skewed gaps between detection incidents. Workstations are about four times as active in UTC business hours as at night, servers around the clock, and update checks arrive every few hours per endpoint. Measured volume is about 660 events and 150 detection incidents per day; rate and shares are scenario assumptions, not Sophos measurements.',
    'Incidents are automatic cleanups within seconds, repeat detections of the same file within minutes, failed cleanups later resolved manually (median about 1.5 hours) or followed by another detection, and PUA detections often followed by a failed PUA cleanup. Every step, endpoint, threat and path of the episode occurs in ordinary traffic in both modes; an ordinary cleanup that would complete the ordered sequence within three hours is reported as another CleanupFailed.',
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
      json: String.raw`{"@timestamp": "2026-09-01T01:38:20.730Z", "ecs": {"version": "8.11.0"}, "event": {"kind": "event", "dataset": "sophos_central.event", "module": "sophos_central", "category": ["malware"], "type": ["info"], "code": "Event::Endpoint::Threat::CleanupFailed", "action": "Manual cleanup required: 'Mal/EncPk-APV' at 'C:\\Users\\kirill.orlov\\Downloads\\packed_loader.exe'", "id": "f53c0ec6-1b21-4a1e-8ad3-5e9b30f3c9e1", "created": "2026-09-01T01:38:20.841Z", "severity": 8, "original": "CEF:0|sophos|sophos central|1.0|Event::Endpoint::Threat::CleanupFailed|Mal/EncPk-APV|8|source_info_ip=10.20.26.203 customer_id=6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13 threat=Mal/EncPk-APV endpoint_id=49e440da-4cd8-4174-a9ea-2df41d0ccbee endpoint_type=computer group=MALWARE id=f53c0ec6-1b21-4a1e-8ad3-5e9b30f3c9e1 datastream=event detection_identity_name=Mal/EncPk-APV filePath=C:\\\\Users\\\\kirill.orlov\\\\Downloads\\\\packed_loader.exe suser=CONTOSO\\\\kirill.orlov rt=2026-09-01T01:38:20.841Z duid=046ef5454a7bb0775691b45d end=2026-09-01T01:38:20.730Z dhost=WS-ENG-169"}, "observer": {"vendor": "Sophos", "product": "Sophos Central"}, "organization": {"id": "6f1c2a9e-3b7d-4c58-9e21-0d4b8a7f5c13"}, "host": {"name": "WS-ENG-169", "id": "49e440da-4cd8-4174-a9ea-2df41d0ccbee"}, "source": {"ip": "10.20.26.203"}, "related": {"ip": ["10.20.26.203"], "hosts": ["WS-ENG-169"], "user": ["kirill.orlov"]}, "sophos_central": {"event": {"type": "Event::Endpoint::Threat::CleanupFailed", "group": "MALWARE", "severity": "high", "source": "CONTOSO\\kirill.orlov", "location": "WS-ENG-169", "when": "2026-09-01T01:38:20.730Z", "created_at": "2026-09-01T01:38:20.841Z", "endpoint": {"id": "49e440da-4cd8-4174-a9ea-2df41d0ccbee", "type": "computer"}, "datastream": "event", "user_id": "046ef5454a7bb0775691b45d", "threat": "Mal/EncPk-APV", "detection_identity_name": "Mal/EncPk-APV"}}, "user": {"name": "kirill.orlov", "domain": "CONTOSO", "id": "046ef5454a7bb0775691b45d"}, "file": {"path": "C:\\Users\\kirill.orlov\\Downloads\\packed_loader.exe", "name": "packed_loader.exe"}}`,
    },
  ],
};
