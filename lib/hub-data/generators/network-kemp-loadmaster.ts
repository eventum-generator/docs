/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKempLoadmaster: GeneratorMeta = {
  slug: 'network-kemp-loadmaster',
  displayName: 'Progress Kemp LoadMaster ESP CEF',
  category: 'network',
  description:
    'Edge Security Pack (ESP) user logs of a Progress Kemp LoadMaster in Common Event Format, for one virtual service that pre-authenticates a webmail portal, as ECS JSON with the CEF body in event.original and the parsed header and extension under kemp.loadmaster. Forty users run full portal sessions; recurring episodes show repeated ESP logon failures followed by a logon and Exchange control panel requests. The rates are a synthetic workload, not measured LoadMaster traffic.',
  dataSource:
    'Progress Kemp LoadMaster ESP user logs, CEF body without a syslog envelope (firmware 7.2.50 or later)',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 12,
  templateCount: 1,
  highlights: [
    'CEF body in event.original, parsed under kemp.loadmaster',
    '12 ESP class IDs in full portal sessions of 40 users',
    'Recurring repeated-denial logon then /ecp/ chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first within the first 24 hours at a time drawn from the background activity curve; each next one due one interval after the actual start of the previous one and started in a window of a quarter of the interval, at most 6 h, centred on the due time and weighted toward office hours; missed episodes are not caught up), one user gets three to five Access Denied records from one address seconds apart, then User AAA success and Logged on from that address, then one to three /ecp/ requests among the first of the session, which ends like any other. Measured episodes lasted 3.0-27.5 minutes from the first denial to the session end; the user is never the previous episode user. Every user, address type, class ID and /ecp/ path also occurs in background; only the full sequence within 30 minutes is kept out of it.',
  generatorId: 'kemp-loadmaster',
  eventTypes: [
    {
      id: 'Request (14)',
      description: 'Authenticated portal request',
      frequency: '48.1% measured share',
      category: 'web',
    },
    {
      id: 'SSL accept (2)',
      description: 'TLS connection accepted by the virtual service',
      frequency: '13.3% measured share',
      category: 'network',
    },
    {
      id: 'Connected (4)',
      description: 'Connection to a real server',
      frequency: '11.0% measured share',
      category: 'network',
    },
    {
      id: 'Attempt (15)',
      description: 'Unauthenticated request',
      frequency: '6.7% measured share',
      category: 'web',
    },
    {
      id: 'User AAA (100)',
      description: 'Successful authentication against the AAA server',
      frequency: '5.0% measured share',
      category: 'authentication',
    },
    {
      id: 'Logged on (8)',
      description: 'ESP logon',
      frequency: '5.0% measured share',
      category: 'authentication, session',
    },
    {
      id: 'Logged off (6)',
      description: 'ESP logoff',
      frequency: '2.8% measured share',
      category: 'authentication, session',
    },
    {
      id: 'User session kill (102)',
      description: 'Session removed after logoff',
      frequency: '2.8% measured share',
      category: 'session',
    },
    {
      id: 'Access Denied (9)',
      description: 'Failed ESP logon',
      frequency: '2.2% measured share',
      category: 'authentication',
    },
    {
      id: 'User session timeout (101)',
      description: 'Session ended after the idle time',
      frequency: '2.2% measured share',
      category: 'session',
    },
    {
      id: 'Connection timed out (3)',
      description: 'Client connection timed out',
      frequency: '0.7% measured share',
      category: 'network',
    },
    {
      id: 'Connection failed (5)',
      description: 'Real server connection failed',
      frequency: '0.2% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Forty users start portal sessions as independent random processes, about five per user per day, with the highest activity from 07:00 to 17:00 UTC, a middle level from 17:00 to 21:00 and a low night level (hours fixed to UTC). Users connect from their office address or, in 30% of sessions, from a random external address; anonymous clients add TLS accepts that time out or send one Attempt.',
    'A session is a TLS accept and an unauthenticated Attempt for /owa/, zero to five Access Denied records (about 6% of sessions have three or more, and 15% of sessions with a failure end without a logon), then User AAA, Logged on and Connected to a real server. Requests follow with log-normal gaps, about 5% under /ecp/, and the session ends with Logged off plus User session kill, or with User session timeout after the idle time.',
    'Names, severities, extension keys and key order follow the vendor examples for each class ID, including Device Version 1.0 (the CEF header table states 0). No raw syslog line is documented for the L7 ESP classes, so event.original holds the CEF body only; session records 101 and 102 follow the 7.2.53 behavior.',
    'User AAA failure strings are not documented, so User AAA appears only for successful logons and a failed logon produces Access Denied alone. Access Blocked, Access Locked, Access Disabled, Password Expired, User interaction, WAF, SMTP, Kill all sessions and Flush SSO cache are not modelled. The User Logs page also says a session is deleted on invalid credentials; the pack emits no 101/102 session records after denials.',
    'Background contains every chain fragment: 61 to 81 logons after three or more denials from the same address and /ecp/ requests by 40 of 40 users per 156-hour background capture. An ordinary /ecp/ request that would complete the chain (three denials, then a logon, from its address, the first denial at most 30 minutes earlier) becomes an /owa/ request at the same time; a later one is left as is. The chain shows portal behavior; it does not show whether the account was compromised.',
    'The start window is narrower than the night: after a first episode at night, later ones can stay at night for several days, as in the default capture (first start 21:00 UTC, later ones 20:00-03:00 UTC).',
    'Timestamps have one-second resolution and at most one record is emitted per second, so a few records are delayed by a second or two.',
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
      name: 'sessions_per_user_day',
      defaultValue: '6',
      description:
        'Mean session starts per user per day before office-hours thinning (about 5 are realized)',
    },
    {
      name: 'session_idle_seconds',
      defaultValue: '900',
      description: 'Idle time before User session timeout',
    },
    {
      name: 'probes_per_day',
      defaultValue: '80',
      description: 'Anonymous client connections per day',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include anomaly episodes; false emits background only',
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
      title: 'First /ecp/ request of the first episode',
      json: String.raw`{"@timestamp": "2026-09-26T21:10:49+00:00", "destination": {"ip": "10.42.20.15", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "request", "category": ["web"], "code": "14", "dataset": "kemp_loadmaster.esp", "kind": "event", "module": "kemp_loadmaster", "original": "CEF:0|Kemp|LM|1.0|14|Request|1|vs=10.42.20.15:443 event=Request srcip=10.60.11.68 srcport=61824 method=GET url=https://mail.example.test/ecp/Security/AdminRoles.slab user=e.lindqvist@example.test useragent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0", "severity": 1, "type": ["access"]}, "http": {"request": {"method": "GET"}}, "kemp": {"loadmaster": {"cef": {"device_event_class_id": "14", "device_product": "LM", "device_vendor": "Kemp", "device_version": "1.0", "name": "Request", "severity": 1, "version": 0}, "extension": {"event": "Request", "method": "GET", "srcip": "10.60.11.68", "srcport": "61824", "url": "https://mail.example.test/ecp/Security/AdminRoles.slab", "user": "e.lindqvist@example.test", "useragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0", "vs": "10.42.20.15:443"}}}, "observer": {"hostname": "lm-edge-01", "product": "LoadMaster", "type": "load-balancer", "vendor": "Progress Kemp"}, "related": {"ip": ["10.60.11.68", "10.42.20.15"], "user": ["e.lindqvist@example.test"]}, "source": {"ip": "10.60.11.68", "port": 61824}, "url": {"domain": "mail.example.test", "full": "https://mail.example.test/ecp/Security/AdminRoles.slab", "path": "/ecp/Security/AdminRoles.slab", "scheme": "https"}, "user": {"name": "e.lindqvist@example.test"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"}}`,
    },
  ],
};
