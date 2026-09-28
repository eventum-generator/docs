import type { GeneratorMeta } from '@/lib/hub-types';

export const webAtlassianJiraSecurity: GeneratorMeta = {
  slug: 'web-atlassian-jira-security',
  displayName: 'Atlassian Jira Security Log',
  category: 'application',
  description:
    'Jira Data Center 9.5+ atlassian-jira-security.log records (Log4j2 layout) of user login and session activity, with the raw line in event.original and its eight documented columns parsed into jira.security fields. Ten accounts sign in from their own workstation, a neighbouring desk or a shared VPN pool, mistype passwords, trip the CAPTCHA check after three failures (then give up, answer it at once or come back to the open login page later) and log out; recurring episodes add a credential-guessing run that ends in a successful login.',
  dataSource:
    'Atlassian Jira Data Center 9.5+ atlassian-jira-security.log (Log4j2 layout)',
  format: ['JSON', 'ECS', 'Log4j'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Raw security log line plus eight parsed columns',
    'Shared workstation and VPN addresses across ten accounts',
    'Recurring failed-logins-to-CAPTCHA-to-success chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One address guesses the password of one account: three authentication-failed records (failure counts 1-3), a CAPTCHA refusal (failure count 4), then an authentication-passed, all in one anonymous pre-login session, followed later by a logout. Episodes recur by source time every anomaly_interval_hours (default 24, 1-8760): the first is scheduled uniformly within the first min(interval, 24 h), each next one is due one interval after the previous actual start and scheduled uniformly within a window of min(interval / 4, 6 h) centred on the due time, with no catch-up; the episode starts as soon as a suitable target is available (measured 21.4-26.9 h apart at the default, 5.4-6.8 h at 6 h). The target is idle for at least 30 minutes, not the previous target, and its own next sign-in is due more than 10 minutes after the episode logout, so the episode never overlaps its own sessions; the address is one the target already uses and not the previous one. Ordinary users also reach the CAPTCHA refusal and some sign in later in the same anonymous session; only an ordinary successful login that would complete the run within 3600 s of the session's first failed login is not logged, with no replacement record: that session ends without a logged teardown and the account stays quiet until its logout would have come.",
  generatorId: 'jira',
  eventTypes: [
    {
      id: 'session-created',
      description: 'HttpSession created',
      frequency: '38.5% measured share',
      category: 'session',
    },
    {
      id: 'session-destroyed',
      description: 'HttpSession destroyed for a user',
      frequency: '25.3% measured share',
      category: 'session',
    },
    {
      id: 'authentication-passed',
      description: 'User has PASSED authentication',
      frequency: '12.6% measured share',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'User has logged out',
      frequency: '12.5% measured share',
      category: 'authentication',
    },
    {
      id: 'authentication-failed',
      description: 'User has FAILED authentication, with failure count',
      frequency: '10.2% measured share',
      category: 'authentication',
    },
    {
      id: 'captcha-required',
      description:
        'CAPTCHA elevated security check required at failure count 4',
      frequency: '0.8% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Ten accounts sign in mostly from their own workstation, sometimes from a neighbouring desk or through a shared VPN pool, so every address carries several accounts. Users mistype passwords, trip the CAPTCHA check after three failures and then give up, answer it at once or come back to the open login page later, and log out; every action appears in both modes. Shares describe synthetic traffic, not measured Jira frequencies.',
    'The eight documented columns (timestamp, thread, username, request ID, session ID, source IP, request URL, message) are in event.original and in jira.security fields. The first request ID segment equals the minutes since midnight as in the Atlassian examples (the article text says seconds); session IDs are 6-7 lowercase base-36 characters.',
    'Every step of an episode shares one anonymous pre-login session ID and source IP; failed and CAPTCHA records carry user.name anonymous with the guessed account in the message and jira.security.target_user. Output line order is not guaranteed, so sort by @timestamp before applying sequence logic.',
    'The CAPTCHA refusal after three failures assumes the default of three allowed attempts. Failure counts restart at 1 on every new sign-in, although Jira keeps the count per user until a successful login. An episode targets only an account signed out for at least 30 minutes while about 7% of ordinary sign-ins follow a logout more quickly; over roughly 65 episodes (about 65 days at the default interval, about 3 days at the 1 h minimum) this gap becomes statistically visible. Episode targets have been idle longer than accounts usually are before a session (median about 223 vs 139 minutes), and idle time alone flags about one episode per ten ordinary sessions at a 600-minute cutoff.',
    'Not emitted: the secondary tried-to-login diagnostic line, the NOT AUTHORIZED no-application-access variant, session expiry and REST API 403 records. The timestamp offset is fixed to +0000, the IP column holds a single origin address with no origin,proxy pair, and SIEM normalizer compatibility (for example KUMA) is unverified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Weave the credential-guessing episodes into the stream; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time interval between episodes, 1-8760',
    },
    {
      name: 'host_name',
      defaultValue: 'jira-dc-01.example.test',
      description: 'Jira node emitting the log, written to host.name',
    },
    {
      name: 'context_path',
      defaultValue: '/jira',
      description: 'Servlet context path prefixing each request URL',
    },
  ],
  sampleOutputs: [
    {
      title: 'Successful login completing an episode',
      json: String.raw`{"@timestamp": "2026-09-01T10:59:24.403000+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "authentication-passed", "category": ["authentication"], "kind": "event", "original": "2026-09-01 10:59:24,403+0000 http-nio-8080-exec-8 url: /jira/login.jsp pnovak 659x463x3 saw5wm7 10.20.9.52 /login.jsp The user \u0027pnovak\u0027 has PASSED authentication.", "outcome": "success", "type": ["start"]}, "host": {"name": "jira-dc-01.example.test"}, "jira": {"security": {"context_url": "/jira/login.jsp", "message": "The user \u0027pnovak\u0027 has PASSED authentication.", "request_id": "659x463x3", "request_url": "/login.jsp", "session_id": "saw5wm7", "target_user": "pnovak"}}, "log": {"file": {"path": "atlassian-jira-security.log"}}, "process": {"thread": {"name": "http-nio-8080-exec-8"}}, "related": {"ip": ["10.20.9.52"], "user": ["pnovak"]}, "source": {"ip": "10.20.9.52"}, "user": {"name": "pnovak"}}`,
    },
  ],
};
