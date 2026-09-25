import type { GeneratorMeta } from '@/lib/hub-types';

export const emailDovecotImap: GeneratorMeta = {
  slug: 'email-dovecot-imap',
  displayName: 'Dovecot IMAP / POP3',
  category: 'email',
  description:
    'Dovecot login syslog with a switchable failed-login, success and protocol-switch sequence.',
  dataSource: 'Dovecot IMAP and POP3 login process syslog',
  format: ['JSON', 'ECS', 'syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native imap-login and pop3-login lines',
    'Remote and local IP, TLS, session and mpid fields',
    'Six-event mailbox access sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Four failed IMAP logins from one IP precede a successful IMAP and then POP3 login to the same mailbox.',
  generatorId: 'dovecot-imap',
  eventTypes: [
    {
      id: 'imap-login-success',
      description: 'Successful IMAP login',
      frequency: '96% baseline',
      category: 'authentication',
    },
    {
      id: 'imap-login-failure',
      description: 'Failed IMAP login',
      frequency: '4% baseline',
      category: 'authentication',
    },
    {
      id: 'pop3-login-success',
      description: 'Successful POP3 login',
      frequency: 'Chain only',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Dovecot default login_log_format_elements field syntax.',
    'Login records do not report mailbox reads.',
    'Syslog prefix varies with deployment.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include failed-login and protocol-switch sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'mail01.corp.example',
      description: 'Dovecot host name',
    },
    {
      name: 'local_ip',
      // eslint-disable-next-line sonarjs/no-hardcoded-ip -- Documented sample address.
      defaultValue: '10.20.0.20',
      description: 'Local listener IP',
    },
    {
      name: 'target_user',
      defaultValue: 'accounts@corp.example',
      description: 'Mailbox in the chain',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description: 'Remote IP in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Example anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:45:02+00:00",
  "destination": {
    "ip": "10.20.0.20",
    "port": 993
  },
  "dovecot": {
    "login_result": "failure",
    "method": "PLAIN",
    "protocol": "imap",
    "session": "747e1335926d02ac",
    "tls": true
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "login-failure",
    "category": [
      "authentication"
    ],
    "kind": "event",
    "original": "Sep 25 12:45:02 mail01.corp.example dovecot: imap-login: Disconnected (auth failed, 1 attempts in 2 secs): user=<accounts@corp.example>, method=PLAIN, rip=192.0.2.91, lip=10.20.0.20, TLS, session=<747e1335926d02ac>",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "host": {
    "ip": [
      "10.20.0.20"
    ],
    "name": "mail01.corp.example"
  },
  "related": {
    "ip": [
      "192.0.2.91",
      "10.20.0.20"
    ],
    "user": [
      "accounts@corp.example"
    ]
  },
  "service": {
    "name": "dovecot",
    "type": "imap"
  },
  "source": {
    "ip": "192.0.2.91"
  },
  "user": {
    "name": "accounts@corp.example"
  }
}`,
    },
  ],
};
