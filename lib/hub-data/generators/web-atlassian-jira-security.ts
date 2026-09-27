import type { GeneratorMeta } from '@/lib/hub-types';

export const webAtlassianJiraSecurity: GeneratorMeta = {
  slug: 'web-atlassian-jira-security',
  displayName: 'Atlassian Jira Security Log',
  category: 'application',
  description:
    'Jira Data Center 9.5+ atlassian-jira-security.log records (Log4j2 layout) of user login and session activity, with the raw line in event.original and its eight documented columns parsed into jira.security fields. Ten accounts sign in from their own workstation, a neighbouring desk or a shared VPN pool, mistype passwords, trip the CAPTCHA check and log out; recurring episodes add a credential-guessing run that ends in a successful login.',
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
    'About every 24 hours of source time by default (the first episode is due one interval after the first event plus a random delay of up to 30 minutes or interval/8, each next one the same way after the previous actual start, with no catch-up; the start waits for an account signed out for at least 30 minutes), one address the target already uses guesses the password of an account idle for at least 30 minutes: three authentication-failed records (failure counts 1-3), a CAPTCHA refusal (failure count 4), then an authentication-passed, all in one anonymous pre-login session, followed later by a logout. Target and address differ from the previous episode; ordinary lockouts reach the CAPTCHA refusal but never pass in that session.',
  generatorId: 'jira',
  eventTypes: [
    {
      id: 'session-created',
      description: 'HttpSession created',
      frequency: '39.2% measured share',
      category: 'session',
    },
    {
      id: 'session-destroyed',
      description: 'HttpSession destroyed for a user',
      frequency: '26.0% measured share',
      category: 'session',
    },
    {
      id: 'authentication-passed',
      description: 'User has PASSED authentication',
      frequency: '12.8% measured share',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'User has logged out',
      frequency: '12.7% measured share',
      category: 'authentication',
    },
    {
      id: 'authentication-failed',
      description: 'User has FAILED authentication, with failure count',
      frequency: '8.7% measured share',
      category: 'authentication',
    },
    {
      id: 'captcha-required',
      description:
        'CAPTCHA elevated security check required at failure count 4',
      frequency: '0.7% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Ten accounts sign in mostly from their own workstation, sometimes from a neighbouring desk or through a shared VPN pool, so every address carries several accounts. Users mistype passwords, trip the CAPTCHA check after three failures and give up, and log out; every action appears in both modes. Shares describe synthetic traffic, not measured Jira frequencies.',
    'The eight documented columns (timestamp, thread, username, request ID, session ID, source IP, request URL, message) are in event.original and in jira.security fields. The first request ID segment equals the minutes since midnight as in the Atlassian examples (the article text says seconds); session IDs are 6-7 lowercase base-36 characters.',
    'Every step of an episode shares one anonymous pre-login session ID and source IP; failed and CAPTCHA records carry user.name anonymous with the guessed account in the message and jira.security.target_user. Output line order is not guaranteed, so sort by @timestamp before applying sequence logic.',
    'The CAPTCHA refusal after three failures assumes the default of three allowed attempts. Failure counts restart at 1 on every new sign-in, although Jira keeps the count per user until a successful login. An episode targets only an account signed out for at least 30 minutes while about 7% of ordinary sign-ins follow a logout more quickly; over roughly 65 episodes (about 65 days at the default interval) this gap becomes statistically visible.',
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
      json: String.raw`{"@timestamp": "2026-09-02T00:20:04.060000+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "authentication-passed", "category": ["authentication"], "kind": "event", "original": "2026-09-02 00:20:04,060+0000 http-nio-8080-exec-11 url: /jira/login.jsp pnovak 20x318x1 0k70cem 10.20.9.52 /login.jsp The user \u0027pnovak\u0027 has PASSED authentication.", "outcome": "success", "type": ["start"]}, "host": {"name": "jira-dc-01.example.test"}, "jira": {"security": {"context_url": "/jira/login.jsp", "message": "The user \u0027pnovak\u0027 has PASSED authentication.", "request_id": "20x318x1", "request_url": "/login.jsp", "session_id": "0k70cem", "target_user": "pnovak"}}, "log": {"file": {"path": "atlassian-jira-security.log"}}, "process": {"thread": {"name": "http-nio-8080-exec-11"}}, "related": {"ip": ["10.20.9.52"], "user": ["pnovak"]}, "source": {"ip": "10.20.9.52"}, "user": {"name": "pnovak"}}`,
    },
  ],
};
