import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeradius: GeneratorMeta = {
  slug: 'identity-freeradius',
  displayName: 'FreeRADIUS Linelog Authentication and Accounting',
  category: 'identity',
  description:
    "FreeRADIUS 3.2.10 file linelog output of one server authenticating 802.1X wireless clients of one controller: Accepted and Rejected user lines from an explicitly configured linelog instance and tagged accounting Connect and Disconnect lines, as ECS JSON with the verbatim line in event.original. Recurring episodes show password guessing from a device's usual station that succeeds and opens a network session.",
  dataSource:
    'FreeRADIUS 3.2.10 file linelog: custom auth_siemaudit instance and tagged log_accounting Start/Stop',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Verbatim linelog file lines in event.original',
    'Independent processes of 50 devices of 36 users on six access points',
    'Recurring reject burst, accept and accounting session chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default (the first within min(interval, 24 h) of the first event at an hour drawn from the office-hours curve; each next one due one interval after the previous actual start and started inside a window of width min(interval / 4, 6 h) centred on that due time, so consecutive starts are 24 ± 3 h apart, start hours do not drift and missed intervals are never caught up), one idle device's user is rejected five to eight times seconds apart from its usual station, then accepted, and an accounting Start follows 0-3 seconds later on the same NAS port; the Stop comes after an ordinary session length with the real elapsed time. Devices follow the background activity weights and the previous user is never repeated. Every part of the chain also occurs in ordinary traffic; only the complete ordered chain is absent from background.",
  generatorId: 'freeradius',
  eventTypes: [
    {
      id: 'accept',
      description: 'Accepted user: line of the auth_siemaudit instance',
      frequency: '29.4% measured share',
      category: 'authentication',
    },
    {
      id: 'connect',
      description: 'Connect: accounting Start line, 0-3 s after an accept',
      frequency: '29.4% measured share',
      category: 'session',
    },
    {
      id: 'disconnect',
      description:
        'Disconnect: accounting Stop line with the actual session seconds',
      frequency: '29.3% measured share',
      category: 'session',
    },
    {
      id: 'reject',
      description: 'Rejected user: line of the auth_siemaudit instance',
      frequency: '11.8% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'The authentication lines require the explicit auth_siemaudit linelog instance and post-auth calls shown in the README, because built-in log.auth is off and the default linelog messages carry only the user name; the accounting lines follow the tagged log_accounting Start and Stop formats verbatim. Authentication and accounting go to two files, and the station IDs use the RFC 3580 form with :SSID after the access-point MAC.',
    'The site has 36 users with 50 client devices (14 users carry a laptop and a phone) and six access points of one SSID. Each device is an independent process with its own activity weight and preferred access points: a lognormal idle gap thinned by a UTC office-hours curve, one attempt, a Start 0-3 seconds after the accept and a Stop after a lognormal session (median about 35 minutes) whose Acct-Session-Time equals the real elapsed time. The final 120-hour default capture held 6,007 lines.',
    'About 12% of attempts start with one to eight mistyped passwords a few seconds apart, each extra reject half as likely as the previous count, and 15% of them give up; about 2% come from a device with a stale saved password rejected 2 to 14 times until it is updated. All rates are synthetic, not measured FreeRADIUS statistics.',
    'An ordinary attempt whose Start would complete five rejects of its user and station within ten minutes ends silently, like a user who gives up. In five background-only 120-hour captures, reject bursts of lengths 4/5/6/7/8 numbered 86/40/21/7/1, 86-88% of two- to four-reject bursts ended in an accept and none of five or more did; the shortest background five-reject-to-Start spans were 638, 662 and 709 seconds, and a detector with a lower threshold or a longer window also matches background near misses.',
    'event.original and message hold the bare file line without a syslog header; @timestamp, host.name and radius.client_shortname are collector enrichment. The selected formats carry no Acct-Session-Id, so a session is the Start/Stop pair of one station. The ECS layout is inferred.',
    'No raw output from a running FreeRADIUS 3.2.10 server was available, and the custom authentication instance was not exercised on a daemon; compatibility with syslog-oriented FreeRADIUS parsers is not claimed. One server, controller and SSID, with no roaming, Interim-Update or NAS reboots, and office hours in UTC with no weekday cycle. With a short interval the start window narrows (2 h at 8 h), so some episodes start outside office hours.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit recurring episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 2 to 720; a value outside fails the render',
    },
    {
      name: 'radius_host',
      defaultValue: 'radius-01',
      description: 'host.name enrichment',
    },
    {
      name: 'nas_client',
      defaultValue: 'wlc-01',
      description:
        "radius.client_shortname enrichment, the controller's clients.conf short name",
    },
    {
      name: 'ssid',
      defaultValue: 'corp-wifi',
      description: 'SSID appended to the access-point MAC in Called-Station-Id',
    },
  ],
  sampleOutputs: [
    {
      title: 'Chain Start of the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T19:56:53.334+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "connect", "category": ["session"], "dataset": "freeradius.linelog", "kind": "event", "module": "freeradius", "original": "Connect: [ekaterina.romanova] (did 06-1B-2C-41-10-A2:corp-wifi cli 02-4C-1A-EE-32-EA port 117 ip 10.50.1.223)", "outcome": "success", "type": ["start"]}, "host": {"name": "radius-01"}, "message": "Connect: [ekaterina.romanova] (did 06-1B-2C-41-10-A2:corp-wifi cli 02-4C-1A-EE-32-EA port 117 ip 10.50.1.223)", "radius": {"acct_status_type": "Start", "called_station_id": "06-1B-2C-41-10-A2:corp-wifi", "calling_station_id": "02-4C-1A-EE-32-EA", "client_shortname": "wlc-01", "framed_ip_address": "10.50.1.223", "nas_port": 117}, "service": {"name": "radiusd"}, "source": {"ip": "10.50.1.223", "mac": "02-4C-1A-EE-32-EA"}, "user": {"name": "ekaterina.romanova"}}`,
    },
  ],
};
