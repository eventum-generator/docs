import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationGrafanaServerJson: GeneratorMeta = {
  slug: 'application-grafana-server-json',
  displayName: 'Grafana OSS JSON Server Log',
  category: 'application',
  description:
    'Grafana OSS 9.5.1 server log lines in the JSON log format, wrapped in ECS JSON, for testing detections of login abuse and service account token creation in Grafana. One instance with router logging on serves 80 browser users, four of them organization admins, and four service accounts that call the HTTP API around the clock; about 32,000 lines a day follow a working-day curve in UTC. Recurring episodes show failed form logins from one admin workstation address, a successful login and a service account token creation.',
  dataSource:
    'Grafana OSS 9.5.1 server log, [log] format = json, level = info, [server] router_logging = true',
  format: ['JSON', 'ECS'],
  eventCount: 18,
  templateCount: 1,
  highlights: [
    'Native go-kit JSON line in event.original',
    '80 users and 4 service accounts on a UTC working-day curve',
    'Recurring failed-login, login and token-creation chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default, three or four POST /login requests from one admin workstation address fail with 401, the next succeeds, and after zero to three ordinary requests that admin creates a token for the service account they look after; the session then continues and ends like any other admin session, and an admin signed in at that moment later deletes the token. The steps share source.ip, and the first failed login and the token creation are usually 1-5 minutes apart. The first episode starts within min(anomaly_interval_hours, 24 h) of the start of the data, at an hour that follows the working-day curve; each later one is due one interval after the previous one actually started and starts within a window of min(interval / 4, 6 h) centred on that due time, mostly in working hours. An episode waits for an admin who is signed out and has no failed login in the last 10 minutes; missed episodes are not replayed. Consecutive episodes use different admins and therefore different service accounts. Failure runs, lockouts, failures followed by a login and token creations soon after a login also occur in ordinary traffic; only the full ordered sequence within an hour is episode-only.',
  generatorId: 'grafana',
  eventTypes: [
    {
      id: 'POST /api/ds/query 200',
      description: 'Request Completed line for a data source query',
      frequency: '43.7% of lines',
      category: 'web',
    },
    {
      id: 'GET /api/dashboards/uid/<uid> 200',
      description: 'Request Completed line for a dashboard read',
      frequency: '13.2% of lines',
      category: 'web',
    },
    {
      id: 'GET /api/annotations 200',
      description: 'Request Completed line for an annotations read',
      frequency: '11.6% of lines',
      category: 'web',
    },
    {
      id: 'GET /api/search 200',
      description: 'Request Completed line for a dashboard search',
      frequency: '10.2% of lines',
      category: 'web',
    },
    {
      id: 'POST /api/frontend-metrics 200',
      description: 'Request Completed line for frontend metrics',
      frequency: '7.5% of lines',
      category: 'web',
    },
    {
      id: 'GET /api/user 200',
      description: 'Request Completed line for the signed-in user',
      frequency: '4.9% of lines',
      category: 'web',
    },
    {
      id: 'GET / 200',
      description: 'Request Completed line for the home page',
      frequency: '4.2% of lines',
      category: 'web',
    },
    {
      id: 'Successful Login',
      description: 'http.server message after a form login',
      frequency: '1.23% of lines',
      category: 'authentication',
    },
    {
      id: 'POST /login 200',
      description: 'Request Completed line for a successful form login',
      frequency: '1.23% of lines',
      category: 'web, authentication',
    },
    {
      id: 'GET /login 200',
      description: 'Request Completed line for the login page',
      frequency: '0.85% of lines',
      category: 'web',
    },
    {
      id: 'Successful Logout',
      description: 'http.server message on logout',
      frequency: '0.36% of lines',
      category: 'authentication',
    },
    {
      id: 'GET /logout 302',
      description: 'Request Completed line for a logout redirect',
      frequency: '0.36% of lines',
      category: 'web',
    },
    {
      id: 'GET /api/serviceaccounts/search 200',
      description: 'Request Completed line for a service account search',
      frequency: '0.19% of lines',
      category: 'web',
    },
    {
      id: 'Invalid username or password',
      description:
        'context logger error line for a failed form login, with the lockout text after repeated failures',
      frequency: '0.13% of lines',
      category: 'authentication',
    },
    {
      id: 'POST /login 401',
      description: 'Request Completed line for a failed form login',
      frequency: '0.13% of lines',
      category: 'web, authentication',
    },
    {
      id: 'GET /api/serviceaccounts/<id>/tokens 200',
      description: 'Request Completed line for a service account token list',
      frequency: '0.13% of lines',
      category: 'web',
    },
    {
      id: 'POST /api/serviceaccounts/<id>/tokens 200',
      description:
        'Request Completed line for a service account token creation',
      frequency: '0.06% of lines',
      category: 'web',
    },
    {
      id: 'DELETE /api/serviceaccounts/<id>/tokens/<tokenId> 200',
      description:
        'Request Completed line for a service account token deletion',
      frequency: '0.06% of lines',
      category: 'web',
    },
  ],
  realismFeatures: [
    '80 browser users, four of them organization admins, sign in with the login form, open dashboards and run data source queries, occasionally mistype passwords, give up or hit the brute-force lockout (the sixth failure within five minutes gets the lockout text), and sign out. About 9% of POST /login requests fail: about one admin login in six starts with one or more failures, against one in twenty-five for other users. A session lasts about 40 minutes (median, up to eight hours); admins work in sessions of about 15 minutes and sign in about 11 to 17 times a day. About 30% of sessions end with an explicit logout.',
    'Admins list, create and delete service account tokens: about 15 tokens a day, mostly for the service account each admin looks after, each deleted later by an admin signed in at that time, usually within an hour (a token created late in the day may stay until the next morning). Four service accounts call the API with bearer tokens at a flat 0.05 lines/s, day and night.',
    'Browser users follow a working-day curve in UTC: about 0.07 lines/s at night, rising from 05:00, peaking at about 0.95 lines/s near 10:40 and back to the night level after 18:00, with about 15 distinct accounts active an hour at night and about 70 at the peak. Weekends look like weekdays. Requests of a session are seconds to minutes apart, so the burst of panel queries a real dashboard load makes within one second is not reproduced; the two lines of one request are microseconds apart. Request mix, session lengths, sign-in frequency, failure rates, token activity and data request durations and sizes are synthetic.',
    'event.original is compact JSON with alphabetically sorted keys, an RFC 3339 t with up to nine fractional digits (trailing zeros dropped), and level, logger and msg on every line; four real 9.5.0/9.5.1 lines in Grafana issue 67582 confirm the layout and the Request Completed field set. Request Completed fields follow the 9.5.1 request logging middleware: Go duration text, whole-millisecond time_ms and the registered route pattern in handler, whose trailing-slash forms for /api/search and /api/user are inferred from route registration. Login, logout and token-deletion body sizes are exact.',
    'Ordinary traffic in both modes contains failed logins by every admin, runs of three or more failures from one address within 10 minutes (about 4-5 a day), lockouts (about one a day), three or more failures followed by a successful login (about 2 a day) and token creations within ten minutes of a login (about 6 a day). The failed-login line names no username, so failures of different accounts from one address look the same.',
    'Grafana defaults to text logs and router_logging = false; with router logging off only the 302 and 401 request lines and the Invalid username or password, Successful Login and Successful Logout messages remain. Not modeled: static files, /api/health probes, live websocket traffic, 304, 403, 404 and 5xx responses, expired-session and API-key authentication, LDAP/OAuth/JWT logins, alerting and provisioning logs, and tracing (traceID stays empty). The clock is UTC; ECS fields repeat values from the native line only.',
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
      description:
        'Add recurring anomaly chain episodes to the background; false emits only background',
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
      json: String.raw`{"@timestamp": "2026-09-01T12:45:46.243362+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "invalid-username-or-password", "category": ["authentication"], "dataset": "grafana.server", "kind": "event", "module": "grafana", "original": "{\"error\":\"invalid username or password\",\"level\":\"error\",\"logger\":\"context\",\"msg\":\"Invalid username or password\",\"orgId\":0,\"remote_addr\":\"10.40.2.21\",\"t\":\"2026-09-01T12:45:46.243362334Z\",\"traceID\":\"\",\"uname\":\"\",\"userId\":0}", "outcome": "failure", "reason": "invalid username or password", "type": ["info"]}, "grafana": {"log": {"error": "invalid username or password", "level": "error", "logger": "context", "msg": "Invalid username or password", "orgId": 0, "remote_addr": "10.40.2.21", "t": "2026-09-01T12:45:46.243362334Z", "traceID": "", "uname": "", "userId": 0}}, "host": {"name": "grafana-01"}, "log": {"level": "error", "logger": "context"}, "message": "Invalid username or password", "related": {"hosts": ["grafana-01"], "ip": ["10.40.2.21"]}, "service": {"name": "grafana", "type": "grafana", "version": "9.5.1"}, "source": {"ip": "10.40.2.21"}}`,
    },
    {
      title: 'Token creation of the same episode',
      json: String.raw`{"@timestamp": "2026-09-01T12:48:35.411114+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "request-completed", "category": ["web"], "dataset": "grafana.server", "duration": 11271685, "kind": "event", "module": "grafana", "original": "{\"duration\":\"11.271685ms\",\"handler\":\"/api/serviceaccounts/:serviceAccountId/tokens\",\"level\":\"info\",\"logger\":\"context\",\"method\":\"POST\",\"msg\":\"Request Completed\",\"orgId\":1,\"path\":\"/api/serviceaccounts/17/tokens\",\"referer\":\"https://grafana.example.test/org/serviceaccounts/17\",\"remote_addr\":\"10.40.2.21\",\"size\":89,\"status\":200,\"t\":\"2026-09-01T12:48:35.411114386Z\",\"time_ms\":11,\"uname\":\"akozlova\",\"userId\":3}", "outcome": "success", "type": ["creation"]}, "grafana": {"log": {"duration": "11.271685ms", "handler": "/api/serviceaccounts/:serviceAccountId/tokens", "level": "info", "logger": "context", "method": "POST", "msg": "Request Completed", "orgId": 1, "path": "/api/serviceaccounts/17/tokens", "referer": "https://grafana.example.test/org/serviceaccounts/17", "remote_addr": "10.40.2.21", "size": 89, "status": 200, "t": "2026-09-01T12:48:35.411114386Z", "time_ms": 11, "uname": "akozlova", "userId": 3}}, "host": {"name": "grafana-01"}, "http": {"request": {"method": "POST", "referrer": "https://grafana.example.test/org/serviceaccounts/17"}, "response": {"body": {"bytes": 89}, "status_code": 200}}, "log": {"level": "info", "logger": "context"}, "message": "Request Completed", "related": {"hosts": ["grafana-01"], "ip": ["10.40.2.21"], "user": ["akozlova"]}, "service": {"name": "grafana", "type": "grafana", "version": "9.5.1"}, "source": {"ip": "10.40.2.21"}, "url": {"path": "/api/serviceaccounts/17/tokens"}, "user": {"id": "3", "name": "akozlova"}}`,
    },
  ],
};
