import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeradius: GeneratorMeta = {
  slug: 'identity-freeradius',
  displayName: 'FreeRADIUS Linelog Authentication and Accounting',
  category: 'identity',
  description:
    "FreeRADIUS 3.2.10 file linelog output of one server authenticating 802.1X wireless clients of one controller: Accepted user and Rejected user lines from an explicitly configured linelog instance and tagged accounting Connect and Disconnect lines, as ECS JSON with the verbatim line in event.original. About 27,800 lines a day from 1,000 devices of 726 users on 30 access points. Recurring episodes show password guessing from a device's usual station that succeeds and opens a network session.",
  dataSource:
    'FreeRADIUS 3.2.10 file linelog: custom auth_siemaudit instance and tagged log_accounting Start/Stop',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Verbatim linelog file lines in event.original',
    '1,000 devices of 726 users on 30 access points, about 27,800 lines a day',
    'Recurring reject burst, accept and accounting session chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Five to eight Rejected user lines for one user and calling station, seconds apart and all within about six minutes, then Accepted user and, a few seconds later, an accounting Start on the same NAS port with the device's framed IP and one of its access points; the Stop follows after an ordinary session length with the real elapsed time. About every 24 hours by default: the first episode starts within min(anomaly_interval_hours, 24 h) of the first line, at an hour drawn from the volume curve; each next one is due one interval after the actual start of the previous one and starts inside a window of w = min(interval / 4, 6 h) centred on that due time, weighted towards busy hours, so consecutive starts are interval ± w/2 apart (24 ± 3 h by default), start hours do not drift far and missed intervals are never caught up. An episode that first falls at night keeps the next ones near that hour and moves towards office hours by about an hour a day; with an 8 h interval some episodes fall at night as well. The device is chosen with the ordinary activity levels among devices with no attempt or session open, never the previous episode's user. Everything the chain uses also occurs in ordinary traffic; only the complete chain is absent from it.",
  generatorId: 'freeradius',
  eventTypes: [
    {
      id: 'accept',
      description: 'Accepted user: line of the auth_siemaudit instance',
      frequency: '31.8% of lines',
      category: 'authentication',
    },
    {
      id: 'connect',
      description:
        'Connect: accounting Start line, a few seconds after an accept',
      frequency: '31.2% of lines',
      category: 'session',
    },
    {
      id: 'disconnect',
      description:
        'Disconnect: accounting Stop line with the actual session seconds',
      frequency: '31.2% of lines',
      category: 'session',
    },
    {
      id: 'reject',
      description: 'Rejected user: line of the auth_siemaudit instance',
      frequency: '5.7% of lines',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'The authentication lines require the explicit auth_siemaudit linelog instance and post-auth calls shown in the README, because built-in log.auth is off and the default linelog authentication messages carry only the user name; the accounting lines follow the tagged log_accounting Start and Stop formats verbatim. Authentication and accounting go to two files, and the station IDs use the RFC 3580 form with :SSID after the access-point MAC. Interim-Update, Accounting-On/Off and Access-Challenge lines are not generated.',
    'The site has 726 users with 1,000 client devices (274 users carry a laptop and a phone) and 30 access points of one SSID. Each device has its own activity level, within a factor of four of the others, and one to three preferred neighbouring access points; it has at most one attempt or session at a time, a fixed framed IP lease and a new NAS-Port association ID for each attempt.',
    'Volume is about 27,800 lines a day on a fixed UTC hour curve: 0.06 lines/s from 00:00 to 05:00, rising through 06:00-08:00 to 0.6 lines/s from 08:00 to 16:00, then tapering hour by hour to 0.08 lines/s at 23:00. The daily total varies by about 2%, and up to about 690 sessions are open at the same time in office hours.',
    '93.5% of attempts succeed at once, with the accounting Start a median 3 s after the accept; 5% start with one to eight mistyped passwords a few seconds apart, each extra reject half as likely as the previous count, and 15% of these users give up; 1.5% come from a device with a stale saved password rejected 2 to 14 times about every 20 minutes until it is updated; 1.5% of accepts have no accounting Start. Sessions last about 12 minutes, 36 minutes and 1.8 hours at the 10th, 50th and 90th percentile, at most about 12 hours. All rates are synthetic, not measured FreeRADIUS statistics.',
    'An accept that follows five or more rejects of its user and station within ten minutes (about 25 a day) is never followed by an accounting Start in ordinary traffic, while other accepts miss their Start only 1.5% of the time; a detector with a lower threshold or a longer window also matches ordinary near misses. With anomaly_mode true, runs of five or more rejects and such runs followed by an accept are about one per episode more frequent: about seven more a week at the default interval, on top of roughly 175 such runs a week.',
    'event.original and message hold the bare file line without a syslog header; @timestamp, host.name and radius.client_shortname are collector enrichment. The selected formats carry no Acct-Session-Id, so a session is the Start/Stop pair of one station. The ECS layout is inferred. No raw output from a running FreeRADIUS 3.2.10 server was available, the custom authentication instance was not exercised on a daemon, and compatibility with syslog-oriented FreeRADIUS parsers is not claimed. One server, controller and SSID, with no roaming, Interim-Update or NAS reboots; the hour curve repeats every day with no weekday cycle, and at night an accounting Start can follow its accept by up to about three minutes.',
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
      title: 'Accounting Start that completes an episode',
      json: String.raw`{"@timestamp": "2026-09-04T08:18:12.849+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "connect", "category": ["session"], "dataset": "freeradius.linelog", "kind": "event", "module": "freeradius", "original": "Connect: [matvey.titov] (did 06-1B-2C-41-2F-95:corp-wifi cli 02-4C-1A-7E-8C-C3 port 224 ip 10.50.7.129)", "outcome": "success", "type": ["start"]}, "host": {"name": "radius-01"}, "message": "Connect: [matvey.titov] (did 06-1B-2C-41-2F-95:corp-wifi cli 02-4C-1A-7E-8C-C3 port 224 ip 10.50.7.129)", "radius": {"acct_status_type": "Start", "called_station_id": "06-1B-2C-41-2F-95:corp-wifi", "calling_station_id": "02-4C-1A-7E-8C-C3", "client_shortname": "wlc-01", "framed_ip_address": "10.50.7.129", "nas_port": 224}, "service": {"name": "radiusd"}, "source": {"ip": "10.50.7.129", "mac": "02-4C-1A-7E-8C-C3"}, "user": {"name": "matvey.titov"}}`,
    },
  ],
};
