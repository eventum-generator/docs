import type { GeneratorMeta } from '@/lib/hub-types';

export const webAtlassianJiraSecurity: GeneratorMeta = {
  displayName: 'Atlassian Jira security logs',
  category: 'application',
  description:
    'About 6,600 records/day from one Jira node and 512 accounts, with native security messages and ECS enrichment.',
  dataSource: 'Jira Data Center 9.5+ atlassian-jira-security.log',
  format: ['JSON', 'ECS'],
  highlights: [
    'Office-hour activity, account-wide failure counts and overlapping authenticated sessions',
    'Login and logout preserve request IDs and session replacement records',
  ],
  anomalyChain:
    'One account/address/session has three failed passwords, three successive CAPTCHA refusals and successful authentication within one hour. Accounts rotate. Ordinary CAPTCHA-to-success remains present. Default interval is 24 hours. First start is within min(interval,24h), weighted by daily activity; later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'jira-security',
  eventTypes: [
    {
      id: 'session-created',
      description: 'session created',
      frequency: '42.55%',
      category: 'Session lifecycle',
    },
    {
      id: 'session-destroyed',
      description: 'session destroyed',
      frequency: '28.35%',
      category: 'Session lifecycle',
    },
    {
      id: 'authentication-passed',
      description: 'authentication passed',
      frequency: '14.19%',
      category: 'Authentication',
    },
    {
      id: 'logout',
      description: 'logout',
      frequency: '14.15%',
      category: 'Authentication',
    },
    {
      id: 'authentication-failed',
      description: 'authentication failed',
      frequency: '0.64%',
      category: 'Authentication',
    },
    {
      id: 'captcha-required',
      description: 'captcha required',
      frequency: '0.11%',
      category: 'Authentication',
    },
  ],
  realismFeatures: [
    'Office-hour activity, account-wide failure counts and overlapping authenticated sessions',
    'Login and logout preserve request IDs and session replacement records',
    'The retry sequence alone does not prove compromise',
  ],
  slug: 'web-atlassian-jira-security',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 6,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the recurring retry sequence',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Recurrence interval, from 1 to 8760 hours',
    },
    {
      name: 'host_name',
      defaultValue: 'jira-dc-01.example.test',
      description: 'Jira node name in the ECS wrapper',
    },
    {
      name: 'context_path',
      defaultValue: '/jira',
      description: "Application context in the thread's request URL",
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-01T00:01:23.300000+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "authentication-passed", "category": ["authentication"], "kind": "event", "original": "2026-09-01 00:01:23,300+0000 http-nio-8080-exec-8 url: /jira/login.jsp user0029 0x103x1 4mk6er2 10.20.10.29 /login.jsp The user \u0027user0029\u0027 has PASSED authentication.", "outcome": "success", "type": ["start"]}, "host": {"name": "jira-dc-01.example.test"}, "jira": {"security": {"context_url": "/jira/login.jsp", "message": "The user \u0027user0029\u0027 has PASSED authentication.", "request_id": "0x103x1", "request_url": "/login.jsp", "session_id": "4mk6er2", "target_user": "user0029"}}, "log": {"file": {"path": "atlassian-jira-security.log"}}, "process": {"thread": {"name": "http-nio-8080-exec-8"}}, "related": {"ip": ["10.20.10.29"], "user": ["user0029"]}, "source": {"ip": "10.20.10.29"}, "user": {"name": "user0029"}}`,
    },
  ],
};
