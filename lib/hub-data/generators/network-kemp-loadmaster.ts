/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKempLoadmaster: GeneratorMeta = {
  slug: 'network-kemp-loadmaster',
  displayName: 'Progress Kemp LoadMaster ESP CEF',
  category: 'network',
  description:
    'Edge Security Pack (ESP) user logs of a Progress Kemp LoadMaster in Common Event Format, for one virtual service that pre-authenticates a webmail portal, as ECS JSON with the CEF body in event.original and the parsed header and extension under kemp.loadmaster. About 40,000 records a day from 400 portal users follow a working-day curve in UTC. Recurring episodes show repeated ESP logon failures followed by a logon and an Exchange control panel request. The rates are a synthetic workload, not measured LoadMaster traffic.',
  dataSource:
    'Progress Kemp LoadMaster ESP user logs, CEF body without a syslog envelope (firmware 7.2.50 or later)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 12,
  templateCount: 1,
  highlights: [
    'CEF body in event.original, parsed under kemp.loadmaster',
    '12 ESP class IDs in full portal sessions of 400 users',
    'Recurring repeated-denial logon then /ecp/ chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user gets three to five Access Denied records from one address seconds apart, then User AAA success and Logged on from that address, then one Request for an /ecp/ path among the first three requests of the session, 20 seconds to about 4 minutes after the first denial; the session continues and ends like any other. The user is one of the more active half of the users, logs on from their office address and is never the previous episode's user. The first episode starts within the first anomaly_interval_hours (at most 24 h) at a time drawn from the day curve, not at a fixed offset from the start; each next one is due anomaly_interval_hours after the actual start of the previous one and starts in a window of a quarter of the interval (at most 6 h) centred on the due time, weighted by the square of the day curve plus a small floor, so episodes favour office hours; missed episodes are not caught up. At the default 24 h interval episodes start 21-27 h apart, at 8 h about 7-9 h apart. Every user, office address, class ID and /ecp/ path also occurs in ordinary traffic; only the full sequence is absent from it.",
  generatorId: 'kemp-loadmaster',
  eventTypes: [
    {
      id: 'Request (14)',
      description: 'Authenticated portal request',
      frequency: '51.7% of records',
      category: 'web',
    },
    {
      id: 'SSL accept (2)',
      description: 'TLS connection accepted by the virtual service',
      frequency: '12.0% of records',
      category: 'network',
    },
    {
      id: 'Connected (4)',
      description: 'Connection to a real server',
      frequency: '11.4% of records',
      category: 'network',
    },
    {
      id: 'Attempt (15)',
      description: 'Unauthenticated request',
      frequency: '5.6% of records',
      category: 'web',
    },
    {
      id: 'User AAA (100)',
      description: 'Successful authentication against the AAA server',
      frequency: '5.2% of records',
      category: 'authentication',
    },
    {
      id: 'Logged on (8)',
      description: 'ESP logon',
      frequency: '5.2% of records',
      category: 'authentication, session',
    },
    {
      id: 'Logged off (6)',
      description: 'ESP logoff',
      frequency: '2.9% of records',
      category: 'authentication, session',
    },
    {
      id: 'User session kill (102)',
      description: 'Session removed after logoff',
      frequency: '2.9% of records',
      category: 'session',
    },
    {
      id: 'User session timeout (101)',
      description: 'Session ended after the idle time',
      frequency: '2.3% of records',
      category: 'session',
    },
    {
      id: 'Access Denied (9)',
      description: 'Failed ESP logon',
      frequency: '0.4% of records',
      category: 'authentication',
    },
    {
      id: 'Connection timed out (3)',
      description: 'Client connection timed out',
      frequency: '0.2% of records',
      category: 'network',
    },
    {
      id: 'Connection failed (5)',
      description: 'Real server connection failed',
      frequency: '0.2% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    'The virtual service logs about 40,000 records a day (+/- 3% from day to day) on a working-day curve in UTC: about 0.2 records per second from 21:00 to 03:00, rising from about 03:00 to a peak of about 0.87 per second between 10:00 and 12:00, and declining through the afternoon and evening. Office hours are fixed to UTC and there is no weekly cycle: weekends look like weekdays.',
    'The portal has 400 users, each with a fixed activity level: the most active open about four times as many sessions as the least active, and a user averages about five sessions a day. About 40 distinct users are active in a night hour and about 170 in the 11:00 hour. A user connects from their office address or, in 30% of sessions, from a random external address; anonymous clients add about 240 TLS accepts a day around the clock that time out or send one Attempt.',
    'A session is a TLS accept and an unauthenticated Attempt for /owa/, then User AAA, Logged on and Connected to a real server. About 4% of logons follow one or more Access Denied records (under 1% of sessions have three or more), and 15% of sessions with a denial end without a logon, so about 6% of logon attempts fail. Requests follow with log-normal gaps, about 5% under /ecp/; new client connections add SSL accept and Connected, rarely after a Connection failed. A session ends with Logged off plus User session kill, or with User session timeout after the idle time.',
    'Names, severities, extension keys and key order follow the vendor examples for each class ID, including Device Version 1.0 (the CEF header table states 0). No raw syslog line is documented for the L7 ESP classes, so event.original holds the CEF body only. CEF logging requires firmware 7.2.50 or later; session records 101 and 102 follow the 7.2.53 behavior.',
    'User AAA failure strings are not documented, so User AAA appears only for successful logons and a failed logon produces Access Denied alone. Access Blocked, Access Locked, Access Disabled, Password Expired, User interaction, WAF, SMTP, Kill all sessions and Flush SSO cache are not modelled. The User Logs page also says a session is deleted on invalid credentials; the pack emits no 101/102 session records after denials.',
    'Ordinary traffic contains every chain fragment: logons that follow three or more denials from the same address within 30 minutes (about 40 to 70 per four days) and /ecp/ requests by almost every user. When three denials and then a logon from one address precede a request of that user from that address, and the first of those denials is at most 30 minutes old, the request is for an /owa/ path, with the method that path always uses (POST for /owa/service.svc and /owa/ev.owa2, GET otherwise). With anomaly_mode true the count of logons after three or more denials is about one per episode higher; the total volume is the same in both modes. The chain shows portal behavior; it does not show whether the account was compromised.',
    'Records that a LoadMaster writes in the same instant (User AAA and Logged on, Logged off and User session kill, SSL accept and Attempt) are seconds apart: 2 s at the median, 7 s at the 90th percentile, up to about a minute at night. Timestamps have one-second resolution.',
    'The episode start window is narrower than the night: after a first episode in the evening, later ones can stay in the evening for several days.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'lm-edge-01',
      description: 'LoadMaster host name in observer.hostname',
    },
    {
      name: 'virtual_ip',
      defaultValue: '10.42.20.15',
      description: 'ESP virtual service address (vs, destination.ip)',
    },
    {
      name: 'virtual_port',
      defaultValue: '443',
      description: 'Virtual service port',
    },
    {
      name: 'portal_host',
      defaultValue: 'mail.example.test',
      description: 'Host in request URLs',
    },
    {
      name: 'real_servers',
      defaultValue: '[172.20.0.21, 172.20.0.22, 172.20.0.23]',
      description: 'Real servers in Connected and Connection failed',
    },
    {
      name: 'real_server_port',
      defaultValue: '443',
      description: 'Real server port',
    },
    {
      name: 'user_domain',
      defaultValue: 'example.test',
      description: 'domain of User AAA',
    },
    {
      name: 'sso_domain',
      defaultValue: 'EXAMPLE-ESP',
      description: 'ESP SSO domain in session timeout and kill records',
    },
    {
      name: 'aaa_server',
      defaultValue: '10.42.30.10',
      description: 'Authentication server in User AAA',
    },
    {
      name: 'aaa_protocol',
      defaultValue: 'LDAP Unencrypted',
      description: 'Authentication protocol in User AAA',
    },
    {
      name: 'session_idle_seconds',
      defaultValue: '900',
      description: 'Idle time before User session timeout',
    },
    {
      name: 'probes_per_day',
      defaultValue: '240',
      description: 'Anonymous client connections per day',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include anomaly episodes; false emits ordinary traffic only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episodes, from the actual start of the previous one (6 to 8760)',
    },
  ],
  sampleOutputs: [
    {
      title: 'The /ecp/ request of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T18:34:30+00:00", "destination": {"ip": "10.42.20.15", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "request", "category": ["web"], "code": "14", "dataset": "kemp_loadmaster.esp", "kind": "event", "module": "kemp_loadmaster", "original": "CEF:0|Kemp|LM|1.0|14|Request|1|vs=10.42.20.15:443 event=Request srcip=10.60.26.201 srcport=53479 method=GET url=https://mail.example.test/ecp/ user=d.kaur@example.test useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0", "severity": 1, "type": ["access"]}, "http": {"request": {"method": "GET"}}, "kemp": {"loadmaster": {"cef": {"device_event_class_id": "14", "device_product": "LM", "device_vendor": "Kemp", "device_version": "1.0", "name": "Request", "severity": 1, "version": 0}, "extension": {"event": "Request", "method": "GET", "srcip": "10.60.26.201", "srcport": "53479", "url": "https://mail.example.test/ecp/", "user": "d.kaur@example.test", "useragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0", "vs": "10.42.20.15:443"}}}, "observer": {"hostname": "lm-edge-01", "product": "LoadMaster", "type": "load-balancer", "vendor": "Progress Kemp"}, "related": {"ip": ["10.60.26.201", "10.42.20.15"], "user": ["d.kaur@example.test"]}, "source": {"ip": "10.60.26.201", "port": 53479}, "url": {"domain": "mail.example.test", "full": "https://mail.example.test/ecp/", "path": "/ecp/", "scheme": "https"}, "user": {"name": "d.kaur@example.test"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"}}`,
    },
  ],
};
