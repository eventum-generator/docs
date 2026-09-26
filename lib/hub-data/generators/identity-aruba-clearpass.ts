/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityArubaClearpass: GeneratorMeta = {
  slug: 'identity-aruba-clearpass',
  displayName: 'Aruba ClearPass Policy Manager',
  category: 'identity',
  description:
    'ClearPass 6.11 administrative Audit Records in an explicitly selected RFC 5424 profile, with recurring login and configuration-change sequences.',
  dataSource: 'ClearPass 6.11 Audit Records with RFC 5424 explicitly selected',
  format: ['JSON', 'ECS', 'RFC5424'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Six vendor-grounded administrative event classes',
    'Audit time distinguished from later export time',
    'Background shares the episode account and actions',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 80 routine records, four failed WebUI logins precede a success, log-service modification and SSH-key addition. Subsequent seven-record episodes follow 144 routine records, about 12 hours 35 minutes apart; successful login session IDs differ.',
  generatorId: 'clearpass',
  eventTypes: [
    {
      id: 'login-success',
      description: 'WebUI administrator login',
      frequency: '45% routine selection weight',
      category: 'authentication',
    },
    {
      id: 'login-failure',
      description: 'Failed WebUI administrator login',
      frequency: '10% routine selection weight',
      category: 'authentication',
    },
    {
      id: 'account-settings',
      description: 'Account settings modification',
      frequency: '20% routine selection weight',
      category: 'configuration',
    },
    {
      id: 'cluster-parameter',
      description: 'Cluster-wide parameter modification',
      frequency: '15% routine selection weight',
      category: 'configuration',
    },
    {
      id: 'log-change',
      description: 'Log service configuration modification',
      frequency: '7% routine selection weight',
      category: 'configuration',
    },
    {
      id: 'key-add',
      description: 'SSH public key addition',
      frequency: '3% routine selection weight',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'RFC 5424 Audit Records export must be selected; Standard/raw is the ClearPass default.',
    'ECS timestamp follows the inner audit time; export time is retained separately and descriptions use literal backslash-n separators.',
    'Configuration records have user but no client IP or login session ID, so the login association is only by user, node and time.',
    'BLOCKED_RAW_EVIDENCE: complete Audit Records RFC 5424 PRI/header bytes remain unverified; priority 151 and export delay are explicit synthetic assumptions.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Insert recurring sequences',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '80',
      description: 'Routine records before the first sequence',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '144',
      description:
        'Routine records between sequence starts; about 12 hours of background',
    },
    {
      name: 'node_ip',
      defaultValue: '10.20.0.10',
      description: 'ClearPass node and syslog hostname',
    },
    {
      name: 'admin_user',
      defaultValue: 'admin',
      description: 'Account shared by the sequence and ordinary activity',
    },
    {
      name: 'suspicious_client_ip',
      defaultValue: '192.0.2.91',
      description:
        'WebUI client address shared by the sequence and ordinary activity',
    },
    {
      name: 'software_version',
      defaultValue: '6.11.11.261850',
      description: 'Documented 6.11 example version in `origin`',
    },
    {
      name: 'syslog_priority',
      defaultValue: '151',
      description:
        'Synthetic RFC 5424 priority; verify against an Audit Records capture',
    },
  ],
  sampleOutputs: [
    {
      title:
        'Aruba ClearPass Policy Manager event from finite generator output',
      json: String.raw`{
  "@timestamp": "2026-09-25T07:00:00.222Z",
  "clearpass": {
    "action": "None",
    "audit_timestamp": "2026-09-25T07:00:00.222Z",
    "category": "Logged in",
    "component": "Policy Manager UI",
    "description": "User: admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: ba08937b0a6f9384a55e982da2bf25c6\\nClient IP Address: 192.0.2.91\\nSession Inactive Expiry Time: 359 mins",
    "event_id": 3003,
    "export_timestamp": "2026-09-25T07:00:08.640Z",
    "level": "INFO",
    "message_id": "199-1-0",
    "process_id": 41040,
    "software_version": "6.11.11.261850",
    "syslog_priority": 151
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "login-success",
    "category": [
      "authentication"
    ],
    "dataset": "clearpass.audit",
    "kind": "event",
    "original": "<151>1 2026-09-25T07:00:08.640Z 10.20.0.10 ClearPass 41040 199-1-0 [timeQuality tzKnown=\"1\"][origin swVersion=\"6.11.11.261850\" software=\"PolicyManager\" ip=\"10.20.0.10\" enterpriseId=\"1.3.6.1.4.1.14823\"][clearPass@14823 eventId=\"3003\" Action=\"None\" Category=\"Logged in\" Description=\"User: admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: ba08937b0a6f9384a55e982da2bf25c6\\nClient IP Address: 192.0.2.91\\nSession Inactive Expiry Time: 359 mins\" Level=\"INFO\" Component=\"Policy Manager UI\" CppmNode.CPPM-Node=\"10.20.0.10\" Timestamp=\"2026-09-25T07:00:00.222Z\"]",
    "outcome": "success",
    "type": [
      "start"
    ]
  },
  "host": {
    "ip": [
      "10.20.0.10"
    ],
    "name": "10.20.0.10"
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
    "name": "admin"
  }
}`,
    },
  ],
};
