import type { GeneratorMeta } from '@/lib/hub-types';

export const proxySolarWebproxy: GeneratorMeta = {
  slug: 'proxy-solar-webproxy',
  displayName: 'Solar webProxy SIEM Log',
  category: 'web-access',
  description:
    "Solar webProxy 4.3.1 request messages in the vendor siem-log syslog format from one filtering node in forward mode with TLS inspection serving 30 office users, as native text in event.original mapped to ECS. About 20,300 messages a day follow an office day in the node's local time (UTC+3). For testing web-proxy detections; models filtering decisions and traffic volumes, not administrator audit, access-log JSON, cef-log or ip-translation-log output. Recurring episodes show one user denied repeated uploads to a blocked file-sharing site, then uploading to sanctioned cloud storage.",
  dataSource:
    'Solar webProxy 4.3.1 siem-log syslog messages, forward mode with TLS inspection',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native 27-field siem-log line in event.original',
    '30 users on an office day at UTC+3, about 20,300 messages a day',
    'Recurring denied-upload to sanctioned-upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user is denied two to five POST uploads to the same blocked file-sharing site (flt-status 403, bytes-out 0, URL block), retrying a few seconds to minutes apart, then makes an allowed POST upload with large bytes-out to a sanctioned cloud-storage host, usually within 10 minutes of the first denial and always within 25 minutes. The first episode starts within the first anomaly_interval_hours (at most 24 h), at a time of day drawn from the hourly volume curve; each later one is due anomaly_interval_hours (default 24, 1 to 8,760) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours. At the default, episodes are 21 to 27 hours apart and mostly start between 08:00 and 14:00 UTC; when the first falls in the evening, later ones stay in the evening and night hours for several days. Each episode takes one of the six most active users, other than the previous episode's user, and that user's habitual file-sharing site, other than the previous episode's site; every user, site, address, method and status of the chain also occurs in ordinary traffic.",
  generatorId: 'solar-webproxy',
  eventTypes: [
    {
      id: 'page',
      description:
        'Page and embedded-object GET to an allowed site (200, 304, 302, 404)',
      frequency: '84.5-85.3% of messages',
      category: 'web, network',
    },
    {
      id: 'poll',
      description:
        'Application polling GET to JSON endpoints of business applications (200, 304)',
      frequency: '5.6-6.1% of messages',
      category: 'web, network',
    },
    {
      id: 'deny',
      description:
        'GET to a blocked entertainment site, with user retries (403, URL block)',
      frequency: '3.5-4.0% of messages',
      category: 'web, network',
    },
    {
      id: 'api',
      description: 'Small POST to a business application (200, 201, 400)',
      frequency: '1.9-2.0% of messages',
      category: 'web, network',
    },
    {
      id: 'upload',
      description: 'POST upload to sanctioned cloud storage (200)',
      frequency: '1.9-2.1% of messages',
      category: 'web, network',
    },
    {
      id: 'download',
      description: 'GET download from cloud storage (200)',
      frequency: '1.3-1.4% of messages',
      category: 'web, network',
    },
    {
      id: 'share',
      description:
        'POST upload to a blocked file-sharing site, occasionally retried (403, URL block)',
      frequency: '0.2-0.3% of messages',
      category: 'web, network',
    },
  ],
  realismFeatures: [
    "One filtering node serves 30 office users, about 20,300 messages a day, each daily total within about 3%. Volume follows the office day in the node's local time (UTC+3): about 120 messages an hour at night, 265 at 07:00 and 19:00, 815 at 08:00 and 18:00, 1,365 at 09:00 and 17:00, and 2,000 an hour from 10:00 to 17:00. Every day has the same shape, without weekends or holidays.",
    'Each user has a fixed activity weight (the busiest carry 4-12% of all messages, the quietest about 0.4%) and fixed working hours: a start between 07:00 and 10:00 local and a length of 8 to 10 hours, shifted each day (standard deviation about 35 minutes). About one day in ten a user is absent, about one day in three stays 0.5 to 3 hours late, and about one day in eight a workstation stays logged on overnight and keeps polling business applications. About 27 of the 30 users appear in each office hour and 4 to 11 at night.',
    'Blocked uploads number about 45-60 a day; about three quarters or more come from the six busiest users (4 to 10 a day each), each mostly to one habitual file-sharing site, and about one attempt in six is retried. A user refused twice on one site within 30 minutes usually makes no upload for the next 40 minutes to 2 hours. Outside episodes, no user makes an allowed upload to another host within 30 minutes of two or more denied uploads to one host.',
    'Blocked browsing, blocked uploads with retries, a single blocked upload followed by an upload to sanctioned storage, and repeated blocked uploads without any upload occur in ordinary traffic in both modes; with anomaly_mode false the ordinary traffic has the same mix. With anomaly_mode true each episode adds its own records, so counts of denied uploads and uploads to storage are a few records per episode higher.',
    "event.original follows table 9.2 and the raw example of the 4.3.1 installation manual: a syslog-ng header and 27 bracketed fields in the example's order, including acc-name and the bare [x-virus-id] marker. The header clock is local time, written when filtering ends, flt-time milliseconds after the UTC req-time, and its day is not zero-padded, as in the example.",
    'flt-codes values are copied from the vendor examples (11 for the decryption rule, 0 for layer transitions, 2 for the blocking rule), since the manual does not document the numeric mapping; flt-categories is 0 or one numeric category from the example. Blocked requests carry zero byte counts and application/skvt-unchecked, as in the vendor example; whether a blocked POST reports its partial body is not documented.',
    'Only URL-list blocks are modelled: antivirus, DLP, category, schedule and quota blocks, reverse-proxy mode and authentication failures are not generated. Traffic ratios are scenario choices, since Solar does not publish them; hosts use reserved test domains and documentation address ranges, and users and groups are synthetic. Compatibility with third-party siem-log normalizers has not been tested.',
    'Requests are seconds apart rather than milliseconds: the embedded objects of a page follow it after a median of about 6 seconds in office hours and about 70 seconds at night, where a browser fetches them within a second. The allowed upload of an episode comes within 25 minutes of the first denial; an ordinary upload after a single denial has no such limit (about 1% of them come later). The chain flags possible circumvention of an upload block; the log does not show file contents, so it is a correlation, not proof that the same data was uploaded.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring anomaly episodes; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval on source time, 1 to 8,760 hours',
    },
    {
      name: 'proxy_host',
      defaultValue: 'wp-01',
      description: 'Host name in the syslog header',
    },
    {
      name: 'syslog_utc_offset_hours',
      defaultValue: '3',
      description:
        "Local time offset of the syslog header and of the users' working hours; req-time stays UTC. The hourly volume in patterns/ is set in UTC for an office at UTC+3: when changing the offset, shift the band hours in those files by the same amount",
    },
    {
      name: 'account_domain',
      defaultValue: 'CORP',
      description: 'acc-domain value',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.4.',
      description: 'Prefix of user addresses',
    },
    {
      name: 'client_first',
      defaultValue: '21',
      description:
        'Last octet of the first user address; users get consecutive addresses (client_first plus the user count must stay at most 255)',
    },
    {
      name: 'users',
      defaultValue: '30 logins',
      description: 'acc-name values, at least 4',
    },
    {
      name: 'groups',
      defaultValue: '[Employees, Finance, Engineering, Sales]',
      description:
        'acc-groups values, one per user, drawn at start with a skew toward the first',
    },
    {
      name: 'decrypt_rule',
      defaultValue: 'https',
      description:
        'Name of the TLS inspection rule that leads flt-rules for HTTPS requests',
    },
    {
      name: 'block_layer',
      defaultValue: 'Restricted',
      description:
        'Policy layer that blocks, written to flt-policy and flt-rules',
    },
    {
      name: 'sites',
      defaultValue: '8 sites',
      description: 'Allowed sites: host, address, flt-categories value, pages',
    },
    {
      name: 'blocked_sites',
      defaultValue: '3 sites',
      description:
        'Blocked entertainment sites: host, address, category, blocking rule name, pages',
    },
    {
      name: 'sharing_sites',
      defaultValue: '3 sites',
      description:
        'Blocked file-sharing sites: host, address, category, blocking rule name, upload path',
    },
    {
      name: 'storage_sites',
      defaultValue: '2 sites',
      description:
        'Sanctioned cloud storage: host, address, category, upload path',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final upload of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T08:41:30.355+00:00", "destination": {"bytes": 649, "domain": "disk.fabrikam.test", "ip": "198.51.100.30", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "http-allowed", "category": ["web", "network"], "duration": 9000000, "kind": "event", "original": "Sep 1 11:41:30 wp-01 java: [acc-domain:CORP] [acc-groups:Employees] [acc-ip:10.20.4.25] [acc-name:e.popova] [acc-port:59633] [bytes-in:649] [bytes-out:320919] [flt-categories:0] [flt-codes:11,0,0,0,0,0] [flt-policy:\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438] [flt-rules:https,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Request,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter req,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Response,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter resps,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438] [flt-status:200] [flt-time:9] [req-hostname:disk.fabrikam.test] [req-method:POST] [req-pathname:/api/v1/files/upload] [req-protocol:https] [req-query:] [req-referer:https://disk.fabrikam.test/] [req-time:2026-09-01T08:41:30.355Z] [req-user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36] [res-datatype:application/json] [res-ip:198.51.100.30] [traf-mode:forward] [x-virus-id] [req-port:443] [flt-reason:]", "outcome": "success", "type": ["allowed", "connection"]}, "host": {"name": "wp-01"}, "http": {"request": {"bytes": 320919, "method": "POST", "referrer": "https://disk.fabrikam.test/"}, "response": {"bytes": 649, "mime_type": "application/json", "status_code": 200}}, "observer": {"hostname": "wp-01", "product": "Solar webProxy", "type": "proxy", "vendor": "Solar"}, "related": {"hosts": ["disk.fabrikam.test"], "ip": ["10.20.4.25", "198.51.100.30"], "user": ["e.popova"]}, "rule": {"name": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438"}, "solar_webproxy": {"account_groups": "Employees", "filter_categories": "0", "filter_codes": "11,0,0,0,0,0", "filter_policy": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438", "filter_reason": "", "filter_rules": "https,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Request,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter req,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Response,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter resps,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438", "filter_status": 200, "filter_time_ms": 9, "request_time": "2026-09-01T08:41:30.355Z", "response_datatype": "application/json", "traffic_mode": "forward"}, "source": {"bytes": 320919, "ip": "10.20.4.25", "port": 59633}, "url": {"domain": "disk.fabrikam.test", "full": "https://disk.fabrikam.test/api/v1/files/upload", "path": "/api/v1/files/upload", "port": 443, "scheme": "https"}, "user": {"domain": "CORP", "group": {"name": "Employees"}, "name": "e.popova"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}}`,
    },
  ],
};
