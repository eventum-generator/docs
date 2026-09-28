/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityArubaClearpass: GeneratorMeta = {
  slug: 'identity-aruba-clearpass',
  displayName: 'Aruba ClearPass Policy Manager',
  category: 'identity',
  description:
    'ClearPass 6.11 administrative audit records in ECS JSON, with a ClearPass-like RFC 5424 syslog message in event.original, for testing detections on administrator logins and configuration changes. Ten administrators work in independent WebUI sessions. Recurring episodes show a guessed administrator password followed by weakened logging and a new SSH key.',
  dataSource: 'ClearPass 6.11 Audit Records with RFC 5424 explicitly selected',
  format: ['JSON', 'ECS', 'RFC5424'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Six vendor-grounded administrative event classes',
    'Independent WebUI sessions of ten administrators',
    'Recurring failed-logins-to-SSH-key chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One administrator fails WebUI login four times from one client, a few seconds to about a minute apart, then logs in successfully from that client; minutes later, with delays drawn from the ordinary change-delay distribution (limited to what fits in 30 minutes), the account modifies the Log Service Configuration and adds an SSH Public Key (3-27 minutes per episode measured). The first episode starts within the first anomaly_interval_hours (at most 24 hours) at a time of day drawn from the administrator activity curve; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours, with no catch-up; at intervals of 8 hours or less episodes also fall into quiet hours. Administrator and client differ from the previous episode; the client is one of that administrator's own VPN addresses or the jump host. Only an ordinary SSH key addition that would complete four failures and a success from one client, a log-service change and an SSH key addition by that account within 30 minutes of the first failure, in any combination of its records, is left out.",
  generatorId: 'clearpass',
  eventTypes: [
    {
      id: 'Logged in / None',
      description: 'WebUI administrator login',
      frequency: '24.3% measured share',
      category: 'authentication',
    },
    {
      id: 'Login Failed / None',
      description: 'Failed WebUI administrator login',
      frequency: '15.6% measured share',
      category: 'authentication',
    },
    {
      id: 'Account Settings / MODIFY',
      description: 'Account settings modification',
      frequency: '22.3% measured share',
      category: 'configuration',
    },
    {
      id: 'Cluster-wide Parameter / MODIFY',
      description: 'Cluster-wide parameter modification',
      frequency: '19.3% measured share',
      category: 'configuration',
    },
    {
      id: 'Log Service Configuration / MODIFY',
      description: 'Log service configuration modification',
      frequency: '11.2% measured share',
      category: 'configuration',
    },
    {
      id: 'SSH Public Key / ADD',
      description: 'SSH public key addition',
      frequency: '7.2% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Ten administrators, including the built-in admin account, open WebUI sessions at their own random rates, mostly during UTC working hours, from their desk, one of two VPN addresses or a shared jump host. About 15% of logins start with one to five mistyped passwords, and a session makes zero to eight configuration changes minutes apart. Stale browser tabs or scripts retry outdated passwords, and outside addresses guess passwords a few times a day.',
    'Every part of the chain occurs in background: per 7 days, 60-113 cases of four failures of one account and client within 10 minutes, 13-20 cases of four failures followed by a success from that client within 30 minutes, and 41-73 successful logins followed by a log-service change and an SSH key addition within 30 minutes.',
    "The profile is the Audit Records export template with RFC 5424 explicitly selected; ClearPass defaults to Standard/raw export. The eventId, native action, category, field names and representative values follow Aruba's 6.11 auditable-event examples. ECS @timestamp follows the inner audit time, the later export time is kept separately, and descriptions keep the vendor's literal backslash-n separators.",
    "Configuration records carry the native User but no client IP or login session ID, so their association with a login is only by user, node and time; a rule keyed on the account can join an episode's changes to an ordinary failed-then-successful login of the same account shortly before it.",
    "The full native Audit Records RFC 5424 packet is not verified (BLOCKED_RAW_EVIDENCE): Aruba's audit examples omit <PRI>1, so priority 151, the process ID, message ID progression, the 6-31 second export delay, session IDs, names, addresses and activity distributions are synthetic assumptions. One node and six audit classes are modeled.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring anomaly episodes to the background; false emits only background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 3 to 8,760',
    },
    {
      name: 'node_ip',
      defaultValue: '10.20.0.10',
      description:
        'ClearPass node and syslog hostname; also fixes the administrator organisation',
    },
    {
      name: 'admin_user',
      defaultValue: 'admin',
      description:
        'Name of the built-in administrator account; must differ from the names in samples/admins.json',
    },
    {
      name: 'software_version',
      defaultValue: '6.11.11.261850',
      description: 'Documented 6.11 example version in origin',
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
      title: 'Successful WebUI login of an episode',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:31:46.793Z",
  "clearpass": {
    "action": "None",
    "audit_timestamp": "2026-09-25T14:31:46.793Z",
    "category": "Logged in",
    "component": "Policy Manager UI",
    "description": "User: security-admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: 47955c47f859d7520970e1dbf5cf2e37\\nClient IP Address: 10.8.1.42\\nSession Inactive Expiry Time: 359 mins",
    "event_id": 3003,
    "export_timestamp": "2026-09-25T14:32:00.833Z",
    "level": "INFO",
    "message_id": "527-1-0",
    "process_id": 26172,
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
    "original": "<151>1 2026-09-25T14:32:00.833Z 10.20.0.10 ClearPass 26172 527-1-0 [timeQuality tzKnown=\"1\"][origin swVersion=\"6.11.11.261850\" software=\"PolicyManager\" ip=\"10.20.0.10\" enterpriseId=\"1.3.6.1.4.1.14823\"][clearPass@14823 eventId=\"3003\" Action=\"None\" Category=\"Logged in\" Description=\"User: security-admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: 47955c47f859d7520970e1dbf5cf2e37\\nClient IP Address: 10.8.1.42\\nSession Inactive Expiry Time: 359 mins\" Level=\"INFO\" Component=\"Policy Manager UI\" CppmNode.CPPM-Node=\"10.20.0.10\" Timestamp=\"2026-09-25T14:31:46.793Z\"]",
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
      "10.8.1.42"
    ],
    "user": [
      "security-admin"
    ]
  },
  "source": {
    "ip": "10.8.1.42"
  },
  "user": {
    "name": "security-admin"
  }
}`,
    },
  ],
};
