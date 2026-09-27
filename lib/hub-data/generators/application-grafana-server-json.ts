import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationGrafanaServerJson: GeneratorMeta = {
  slug: 'application-grafana-server-json',
  displayName: 'Grafana OSS JSON Server Log',
  category: 'application',
  description:
    'Grafana OSS 9.5.1 server log lines in the JSON log format, wrapped in ECS JSON, for testing detections of login abuse and service account token creation in Grafana. One instance with router logging on serves nine browser users and two service accounts. Recurring episodes show failed form logins from one admin address, a successful login and a service account token creation.',
  dataSource:
    'Grafana OSS 9.5.1 server log, [log] format = json, level = info, [server] router_logging = true',
  format: ['JSON', 'ECS'],
  eventCount: 18,
  templateCount: 1,
  highlights: [
    'Native go-kit JSON line in event.original',
    'Independent sessions of nine users and two service accounts',
    'Recurring failed-login, login and token-creation chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode is due one interval after the generator starts; at each due time it starts after a random delay of up to min(30 min, interval / 8) and waits for an idle admin; the next due time is one interval after the actual start, and missed episodes are not replayed), three or four POST /login requests from one admin workstation address fail with 401, the next succeeds, and after zero to three ordinary requests that admin creates a service account token; a signed-in admin later deletes it. Measured spans from the first failed login to the token creation are 37-212 s. Admin and service account rotate; failure runs, lockouts, fail-then-success and token creation after login also occur in ordinary traffic, and only the full ordered sequence is episode-only.',
  generatorId: 'grafana',
  eventTypes: [
    {
      id: 'POST /api/ds/query 200',
      description: 'Request Completed line for a data source query',
      frequency: '43.04% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/dashboards/uid/<uid> 200',
      description: 'Request Completed line for a dashboard read',
      frequency: '13.29% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/annotations 200',
      description: 'Request Completed line for an annotations read',
      frequency: '11.03% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/search 200',
      description: 'Request Completed line for a dashboard search',
      frequency: '10.58% measured share',
      category: 'web',
    },
    {
      id: 'POST /api/frontend-metrics 200',
      description: 'Request Completed line for frontend metrics',
      frequency: '6.95% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/user 200',
      description: 'Request Completed line for the signed-in user',
      frequency: '4.59% measured share',
      category: 'web',
    },
    {
      id: 'GET / 200',
      description: 'Request Completed line for the home page',
      frequency: '3.74% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/serviceaccounts/search 200',
      description: 'Request Completed line for a service account search',
      frequency: '1.38% measured share',
      category: 'web',
    },
    {
      id: 'GET /api/serviceaccounts/<id>/tokens 200',
      description: 'Request Completed line for a service account token list',
      frequency: '1.08% measured share',
      category: 'web',
    },
    {
      id: 'Successful Login',
      description: 'http.server message after a form login',
      frequency: '0.80% measured share',
      category: 'authentication',
    },
    {
      id: 'POST /login 200',
      description: 'Request Completed line for a successful form login',
      frequency: '0.80% measured share',
      category: 'web, authentication',
    },
    {
      id: 'GET /login 200',
      description: 'Request Completed line for the login page',
      frequency: '0.63% measured share',
      category: 'web',
    },
    {
      id: 'Invalid username or password',
      description: 'context logger error line for a failed form login',
      frequency: '0.57% measured share',
      category: 'authentication',
    },
    {
      id: 'POST /login 401',
      description: 'Request Completed line for a failed form login',
      frequency: '0.57% measured share',
      category: 'web, authentication',
    },
    {
      id: 'POST /api/serviceaccounts/<id>/tokens 200',
      description:
        'Request Completed line for a service account token creation',
      frequency: '0.25% measured share',
      category: 'web',
    },
    {
      id: 'DELETE /api/serviceaccounts/<id>/tokens/<tokenId> 200',
      description:
        'Request Completed line for a service account token deletion',
      frequency: '0.24% measured share',
      category: 'web',
    },
    {
      id: 'Successful Logout',
      description: 'http.server message on logout',
      frequency: '0.24% measured share',
      category: 'authentication',
    },
    {
      id: 'GET /logout 302',
      description: 'Request Completed line for a logout redirect',
      frequency: '0.24% measured share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Nine browser users, four of them organization admins, run independent random sessions: the login page, form logins with occasional mistyped passwords, give-ups and brute-force lockouts after five failures in five minutes, dashboard reads and data source queries, and logouts. Admins also list, create and delete service account tokens, and two service accounts call the API with bearer tokens around the clock. The default 120-hour capture holds 31,945 events; rates, session lengths and data request durations and sizes are synthetic, with no daily activity pattern.',
    'event.original is compact JSON with alphabetically sorted keys, an RFC 3339 t with up to nine fractional digits, and level, logger and msg on every line; four real 9.5.0/9.5.1 lines in Grafana issue 67582 confirm the layout. Request Completed fields follow the 9.5.1 request logging middleware: Go duration text, whole-millisecond time_ms and the registered route pattern in handler, whose trailing-slash forms for /api/search and /api/user are inferred from route registration. Login, logout and token-deletion body sizes are exact.',
    'Ordinary traffic in both modes contains one to six failed logins from one address seconds to minutes apart (24-36 runs of three or more within 10 minutes per 120 hours), lockouts, give-ups, three or more failures followed by a successful login, and token creations within ten minutes of a login. An ordinary token creation that would complete the chain within an hour is replaced by a read. The failed-login line carries no username, so failures of different accounts from one address look the same.',
    'Grafana defaults to text logs and router_logging = false; with router logging off only the 302 and 401 request lines and the login, logout and failure messages remain. Not modelled: static files, /api/health probes, websocket traffic, 304, 403, 404 and 5xx responses, expired sessions and API keys, LDAP/OAuth/JWT logins, alerting, provisioning and tracing. The clock is UTC and at most one event is emitted per one-second tick; ECS fields repeat values from the native line only.',
  ],
  parameters: [
    {
      name: 'grafana_host',
      defaultValue: 'grafana-01',
      description: 'host.name of the Grafana server',
    },
    {
      name: 'root_url',
      defaultValue: 'https://grafana.example.test',
      description: 'Scheme and host used in referer values',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring chain episodes; false emits only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode due times, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'First failed login of an episode',
      json: String.raw`{"@timestamp": "2026-09-21T00:04:39.860672+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "invalid-username-or-password", "category": ["authentication"], "dataset": "grafana.server", "kind": "event", "module": "grafana", "original": "{\"error\":\"invalid username or password\",\"level\":\"error\",\"logger\":\"context\",\"msg\":\"Invalid username or password\",\"orgId\":0,\"remote_addr\":\"10.40.2.21\",\"t\":\"2026-09-21T00:04:39.860672394Z\",\"traceID\":\"\",\"uname\":\"\",\"userId\":0}", "outcome": "failure", "reason": "invalid username or password", "type": ["info"]}, "grafana": {"log": {"error": "invalid username or password", "level": "error", "logger": "context", "msg": "Invalid username or password", "orgId": 0, "remote_addr": "10.40.2.21", "t": "2026-09-21T00:04:39.860672394Z", "traceID": "", "uname": "", "userId": 0}}, "host": {"name": "grafana-01"}, "log": {"level": "error", "logger": "context"}, "message": "Invalid username or password", "related": {"hosts": ["grafana-01"], "ip": ["10.40.2.21"]}, "service": {"name": "grafana", "type": "grafana", "version": "9.5.1"}, "source": {"ip": "10.40.2.21"}}`,
    },
    {
      title: 'Token creation of the same episode',
      json: String.raw`{"@timestamp": "2026-09-21T00:05:47.280460+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "request-completed", "category": ["web"], "dataset": "grafana.server", "duration": 9599001, "kind": "event", "module": "grafana", "original": "{\"duration\":\"9.599001ms\",\"handler\":\"/api/serviceaccounts/:serviceAccountId/tokens\",\"level\":\"info\",\"logger\":\"context\",\"method\":\"POST\",\"msg\":\"Request Completed\",\"orgId\":1,\"path\":\"/api/serviceaccounts/17/tokens\",\"referer\":\"https://grafana.example.test/org/serviceaccounts/17\",\"remote_addr\":\"10.40.2.21\",\"size\":90,\"status\":200,\"t\":\"2026-09-21T00:05:47.280460563Z\",\"time_ms\":9,\"uname\":\"akozlova\",\"userId\":3}", "outcome": "success", "type": ["creation"]}, "grafana": {"log": {"duration": "9.599001ms", "handler": "/api/serviceaccounts/:serviceAccountId/tokens", "level": "info", "logger": "context", "method": "POST", "msg": "Request Completed", "orgId": 1, "path": "/api/serviceaccounts/17/tokens", "referer": "https://grafana.example.test/org/serviceaccounts/17", "remote_addr": "10.40.2.21", "size": 90, "status": 200, "t": "2026-09-21T00:05:47.280460563Z", "time_ms": 9, "uname": "akozlova", "userId": 3}}, "host": {"name": "grafana-01"}, "http": {"request": {"method": "POST", "referrer": "https://grafana.example.test/org/serviceaccounts/17"}, "response": {"body": {"bytes": 90}, "status_code": 200}}, "log": {"level": "info", "logger": "context"}, "message": "Request Completed", "related": {"hosts": ["grafana-01"], "ip": ["10.40.2.21"], "user": ["akozlova"]}, "service": {"name": "grafana", "type": "grafana", "version": "9.5.1"}, "source": {"ip": "10.40.2.21"}, "url": {"path": "/api/serviceaccounts/17/tokens"}, "user": {"id": "3", "name": "akozlova"}}`,
    },
  ],
};
