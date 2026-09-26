import type { GeneratorMeta } from '@/lib/hub-types';

export const webAtlassianJiraSecurity: GeneratorMeta = {
  slug: 'web-atlassian-jira-security',
  displayName: 'Atlassian Jira security log',
  category: 'application',
  description:
    'Jira Data Center 9.5+ authentication and session logs with a failed-login-to-success sequence.',
  dataSource: 'Atlassian Jira Data Center atlassian-jira-security.log',
  format: ['JSON', 'ECS', 'Jira security log'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Atlassian-published Log4j2 security log layout',
    'Attempted username preserved when Jira logs anonymous',
    'Session rotation reflected between login and logout',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed logins reach a CAPTCHA requirement, then the same account and IP pass authentication and log out.',
  generatorId: 'jira',
  eventTypes: [
    {
      id: 'authentication-passed',
      description: 'Successful authentication',
      frequency: '65% baseline',
      category: 'authentication',
    },
    {
      id: 'authentication-failed',
      description: 'Failed authentication',
      frequency: '20% baseline; chain',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'User logout',
      frequency: '15% baseline; chain',
      category: 'authentication',
    },
    {
      id: 'captcha-required',
      description: 'CAPTCHA elevated security check',
      frequency: 'Chain only',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Eight native log columns retained in structured fields',
    'Jira Data Center 9.5+ context URL and request URL',
    'Correlated failures, CAPTCHA requirement, login, and logout',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the authentication sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'jira-dc-01.example.test',
      description: 'Jira node name',
    },
    {
      name: 'target_user',
      defaultValue: 'admin',
      description: 'Account targeted by the sequence',
    },
    {
      name: 'suspect_ip',
      defaultValue: '192.0.2.91',
      description: 'Source IP for the sequence',
    },
  ],
  sampleOutputs: [
    {
      title: 'CAPTCHA required after failed logins',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:16:05+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "captcha-required",
    "category": [
      "authentication"
    ],
    "kind": "event",
    "original": "2026-09-25 13:16:05,000+0000 http-nio-8080-exec-12 url: /jira/login.jsp anonymous 1054x153x1 scswrbt 192.0.2.91 /login.jsp The user 'admin' is required to answer a CAPTCHA elevated security check. Failure count equals 4",
    "type": [
      "denied"
    ]
  },
  "host": {
    "name": "jira-dc-01.example.test"
  },
  "jira": {
    "security": {
      "context_url": "/jira/login.jsp",
      "failure_count": 4,
      "message": "The user 'admin' is required to answer a CAPTCHA elevated security check. Failure count equals 4",
      "request_id": "1054x153x1",
      "request_url": "/login.jsp",
      "session_id": "scswrbt",
      "target_user": "admin"
    }
  },
  "log": {
    "file": {
      "path": "atlassian-jira-security.log"
    }
  },
  "process": {
    "thread": {
      "name": "http-nio-8080-exec-12"
    }
  },
  "related": {
    "ip": [
      "192.0.2.91"
    ],
    "user": [
      "admin"
    ]
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "user": {
    "name": "anonymous"
  }
}`,
    },
  ],
};
