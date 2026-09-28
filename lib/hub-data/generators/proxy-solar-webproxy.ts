import type { GeneratorMeta } from '@/lib/hub-types';

export const proxySolarWebproxy: GeneratorMeta = {
  slug: 'proxy-solar-webproxy',
  displayName: 'Solar webProxy SIEM Log',
  category: 'web-access',
  description:
    'Solar webProxy 4.3.1 request messages in the vendor siem-log syslog format from one filtering node in forward mode with TLS inspection serving 30 office users, as native text in event.original mapped to ECS. For testing web-proxy detections; models filtering decisions and traffic volumes, not administrator audit, access-log JSON, cef-log or ip-translation-log output. Recurring episodes show one user denied repeated uploads to a blocked file-sharing site, then uploading to sanctioned cloud storage.',
  dataSource:
    'Solar webProxy 4.3.1 siem-log syslog messages, forward mode with TLS inspection',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native 27-field siem-log line in event.original',
    '30 independent users with their own working hours',
    'Recurring denied-upload to sanctioned-upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode starts within the first anomaly_interval_hours (at most 24 h) of generation, at a time of day drawn from the combined working hours of all users; each later one is due anomaly_interval_hours (default 24) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours. One user is denied two or more POST uploads to the same blocked file-sharing site, retrying seconds to minutes apart, then makes an allowed large POST upload to a sanctioned cloud-storage host, usually within 10 minutes of the first denial. The user and the blocked site change from one episode to the next; every element also occurs in ordinary traffic.',
  generatorId: 'solar-webproxy',
  eventTypes: [
    {
      id: 'page',
      description:
        'Page and embedded-object GET to an allowed site (200, 304, 302, 404)',
      frequency: '87.42% measured share',
      category: 'web, network',
    },
    {
      id: 'deny',
      description:
        'GET to a blocked entertainment site, with user retries (403, URL block)',
      frequency: '3.86% measured share',
      category: 'web, network',
    },
    {
      id: 'upload',
      description: 'POST upload to sanctioned cloud storage (200)',
      frequency: '1.94% measured share',
      category: 'web, network',
    },
    {
      id: 'api',
      description: 'Small POST to a business application (200, 201, 400)',
      frequency: '2.16% measured share',
      category: 'web, network',
    },
    {
      id: 'share',
      description:
        'POST upload to a blocked file-sharing site, with user retries (403, URL block)',
      frequency: '3.14% measured share',
      category: 'web, network',
    },
    {
      id: 'download',
      description: 'GET download from cloud storage (200)',
      frequency: '1.47% measured share',
      category: 'web, network',
    },
  ],
  realismFeatures: [
    "One filtering node serves 30 users, each an independent random process with a skewed activity weight and its own working hours: a start between 06:00 and 11:30 local time, a length of 7 to 10.5 hours, a daily shift (standard deviation about 35 minutes) and about one day in ten off. The final 156-hour default capture holds 121,473 messages, about 13 per minute, with a working-hours peak in the node's local time.",
    'Blocked browsing, blocked uploads with retries, a single blocked upload followed by an upload to sanctioned storage, and repeated blocked uploads without any upload occur in ordinary traffic in both modes; with anomaly_mode false the background has the same mix within run-to-run variation.',
    'An ordinary sanctioned upload to another host that would complete the chain (two or more denied uploads by the same user to one host in the preceding 30 minutes) is not logged; denials stay as generated. In six 156-hour background captures, same-user sanctioned uploads follow at 1.4-1.6 per hour between 30 and 60 minutes after the first denial, and uploads by other users run at 19-20 per hour both inside and outside the window.',
    "event.original follows table 9.2 and the raw example of the 4.3.1 installation manual: a syslog-ng header and 27 bracketed fields in the example's order, including the bare [x-virus-id] marker. The header clock is local time, written flt-time milliseconds after the UTC req-time, and its day is not zero-padded, as in the example.",
    'flt-codes values are copied from the vendor examples (11 for the decryption rule, 0 for layer transitions, 2 for the blocking rule), since the manual does not document the numeric mapping; flt-categories is 0 or the one numeric category from the example. Blocked requests carry zero byte counts and application/skvt-unchecked, as in the vendor example.',
    'Only URL-list blocks are modelled: antivirus, DLP, category, schedule and quota blocks, reverse-proxy mode and authentication failures are not generated. Traffic ratios are scenario choices, since Solar does not publish them; hosts use reserved test domains and documentation address ranges.',
    'The chain flags possible circumvention of an upload block; the log does not show file contents, so it is a correlation, not proof that the same data was uploaded. Compatibility with third-party siem-log normalizers has not been tested. The allowed upload of an episode follows its last denial within 20 minutes; ordinary uploads after denials have no such cap (about 1% of them come later).',
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
        "Local time offset of the syslog header and of the users' working hours; req-time stays UTC",
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
      title: 'Final upload of the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T09:59:50.535+00:00", "destination": {"bytes": 655, "domain": "disk.fabrikam.test", "ip": "198.51.100.30", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "http-allowed", "category": ["web", "network"], "duration": 177000000, "kind": "event", "original": "Sep 1 12:59:50 wp-01 java: [acc-domain:CORP] [acc-groups:Employees] [acc-ip:10.20.4.47] [acc-name:x.kiseleva] [acc-port:49944] [bytes-in:655] [bytes-out:17223918] [flt-categories:0] [flt-codes:11,0,0,0,0,0] [flt-policy:\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438] [flt-rules:https,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Request,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter req,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Response,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter resps,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438] [flt-status:200] [flt-time:177] [req-hostname:disk.fabrikam.test] [req-method:POST] [req-pathname:/api/v1/files/upload] [req-protocol:https] [req-query:uploadType=resumable] [req-referer:https://disk.fabrikam.test/] [req-time:2026-09-01T09:59:50.535Z] [req-user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36] [res-datatype:application/json] [res-ip:198.51.100.30] [traf-mode:forward] [x-virus-id] [req-port:443] [flt-reason:]", "outcome": "success", "type": ["allowed", "connection"]}, "host": {"name": "wp-01"}, "http": {"request": {"bytes": 17223918, "method": "POST", "referrer": "https://disk.fabrikam.test/"}, "response": {"bytes": 655, "mime_type": "application/json", "status_code": 200}}, "observer": {"hostname": "wp-01", "product": "Solar webProxy", "type": "proxy", "vendor": "Solar"}, "related": {"hosts": ["disk.fabrikam.test"], "ip": ["10.20.4.47", "198.51.100.30"], "user": ["x.kiseleva"]}, "rule": {"name": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438"}, "solar_webproxy": {"account_groups": "Employees", "filter_categories": "0", "filter_codes": "11,0,0,0,0,0", "filter_policy": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438", "filter_reason": "", "filter_rules": "https,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Request,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter req,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Icap Response,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e Filter resps,\u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043a \u0441\u043b\u043e\u044e \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u0435 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u043e\u043b\u0438\u0442\u0438\u043a\u0438", "filter_status": 200, "filter_time_ms": 177, "request_time": "2026-09-01T09:59:50.535Z", "response_datatype": "application/json", "traffic_mode": "forward"}, "source": {"bytes": 17223918, "ip": "10.20.4.47", "port": 49944}, "url": {"domain": "disk.fabrikam.test", "full": "https://disk.fabrikam.test/api/v1/files/upload?uploadType=resumable", "path": "/api/v1/files/upload", "port": 443, "query": "uploadType=resumable", "scheme": "https"}, "user": {"domain": "CORP", "group": {"name": "Employees"}, "name": "x.kiseleva"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}}`,
    },
  ],
};
