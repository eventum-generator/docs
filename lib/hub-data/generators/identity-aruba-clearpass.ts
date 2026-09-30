/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityArubaClearpass: GeneratorMeta = {
  slug: 'identity-aruba-clearpass',
  displayName: 'Aruba ClearPass Policy Manager',
  category: 'identity',
  description:
    'ClearPass 6.11 administrative audit records in ECS JSON, with a ClearPass-like RFC 5424 syslog message in event.original, for testing detections on administrator logins and configuration changes. About 300 records a day from twelve administrators on a UTC working-day curve. Recurring episodes show a guessed administrator password followed by weakened logging and a new SSH key.',
  dataSource: 'ClearPass 6.11 Audit Records with RFC 5424 explicitly selected',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Six administrative audit classes from Aruba 6.11 examples',
    'About 300 records a day from twelve administrators',
    'Recurring failed-logins-to-SSH-key chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One administrator fails WebUI login four times from one client, a few seconds to about a minute apart, then logs in successfully from that client. Minutes later, with delays drawn from the same distribution as ordinary configuration changes (limited to what fits in 30 minutes), the account modifies the Log Service Configuration and adds an SSH Public Key. The first episode starts within the first anomaly_interval_hours (at most 24 hours), at a time of day drawn from the volume curve; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours, and missed episodes are never caught up. At intervals of 8 hours or less episodes also fall into quiet hours. Each episode uses a different administrator (chosen in proportion to activity) and a different client from the previous one; the client is one of that administrator's own VPN addresses or the jump host. Every step and every administrator and client pair also occur in ordinary activity, which never completes the whole chain within 30 minutes of the first failure; each episode adds its seven records on top of it, so failed logins and counts of the chain parts are about one episode's worth per interval higher than in background-only data.",
  generatorId: 'clearpass',
  eventTypes: [
    {
      id: 'Logged in / None',
      description: 'WebUI administrator login',
      frequency: '38.5% background share',
      category: 'authentication',
    },
    {
      id: 'Account Settings / MODIFY',
      description: 'Account settings modification',
      frequency: '21.1% background share',
      category: 'configuration',
    },
    {
      id: 'Cluster-wide Parameter / MODIFY',
      description: 'Cluster-wide parameter modification',
      frequency: '18.5% background share',
      category: 'configuration',
    },
    {
      id: 'Log Service Configuration / MODIFY',
      description: 'Log service configuration modification',
      frequency: '11.1% background share',
      category: 'configuration',
    },
    {
      id: 'SSH Public Key / ADD',
      description: 'SSH public key addition',
      frequency: '8.8% background share',
      category: 'configuration',
    },
    {
      id: 'Login Failed / None',
      description: 'Failed WebUI administrator login',
      frequency: '2.1% background share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'About 300 audit records a day on a UTC working-day curve: about 2 an hour at night, rising to about 36 an hour around 12:00, with a daily variation of about 3%. Every day of the week looks alike.',
    "Twelve administrators, including the built-in admin_user account, open WebUI sessions at their own steady rates, one session at a time. About 12% of sessions are maintenance work on logging and CLI access, mostly from a shared jump host; routine sessions come from the administrator's desk, one of two VPN addresses or the jump host and mostly change account settings and cluster parameters. A session makes one to eight changes minutes apart; some routine sessions only log in.",
    'Failed logins are about 5% of login attempts. 1% of logins from a desk, 2% from a VPN laptop and 6% from the jump host start with one to five mistyped passwords a few seconds apart. Each administrator changes the password about every 45 days; one of their clients keeps the old saved password for about a day and retries it three to seven times about half a minute apart before the new one is typed, or gives up. About every other day, an address from the documentation ranges tries one to six passwords for admin_user or another administrator, without success.',
    "The profile is the Audit Records export template with RFC 5424 explicitly selected; ClearPass defaults to Standard/raw export. The eventId, native action, category, field names and representative values follow Aruba's 6.11 auditable-event examples. ECS @timestamp follows the inner audit time, the later export time is kept as clearpass.export_timestamp, and WebUI descriptions keep the vendor's literal backslash-n separators.",
    "Configuration records carry the native User but no client IP or login session ID, so their association with a login is only by user, node and time; a rule keyed on the account can join an episode's changes to an ordinary failed-then-successful login of the same account shortly before it.",
    "The full native Audit Records RFC 5424 message has not been compared with a real export: Aruba's audit examples omit <PRI>1 and its published <151>1 message is for Session Logs, so priority 151 is an assumption. Process ID, message ID progression, the 6-31 second export delay, session IDs, names, addresses and the activity mix are modeled. One node and six audit classes are covered, and every login uses the Super Administrator role.",
    'Delivered live, a record arrives after its own audit timestamp: about two minutes later at the median, within 20 minutes for 90% of records, and up to several hours for sessions that start during quiet hours; episode records arrive up to about 30 minutes late.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring anomaly episodes to the background; false keeps only background activity',
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
  "@timestamp": "2026-09-02T15:31:34.441Z",
  "clearpass": {
    "action": "None",
    "audit_timestamp": "2026-09-02T15:31:34.441Z",
    "category": "Logged in",
    "component": "Policy Manager UI",
    "description": "User: platform-admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: cd5726be9347be2a593fb506b33f7119\\nClient IP Address: 10.8.2.232\\nSession Inactive Expiry Time: 359 mins",
    "event_id": 3003,
    "export_timestamp": "2026-09-02T15:31:51.338Z",
    "level": "INFO",
    "message_id": "1178-1-0",
    "process_id": 31154,
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
    "original": "<151>1 2026-09-02T15:31:51.338Z 10.20.0.10 ClearPass 31154 1178-1-0 [timeQuality tzKnown=\"1\"][origin swVersion=\"6.11.11.261850\" software=\"PolicyManager\" ip=\"10.20.0.10\" enterpriseId=\"1.3.6.1.4.1.14823\"][clearPass@14823 eventId=\"3003\" Action=\"None\" Category=\"Logged in\" Description=\"User: platform-admin\\nRole: Super Administrator\\nAuthentication Source: Policy Manager Local Admin Users\\nSession ID: cd5726be9347be2a593fb506b33f7119\\nClient IP Address: 10.8.2.232\\nSession Inactive Expiry Time: 359 mins\" Level=\"INFO\" Component=\"Policy Manager UI\" CppmNode.CPPM-Node=\"10.20.0.10\" Timestamp=\"2026-09-02T15:31:34.441Z\"]",
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
      "10.8.2.232"
    ],
    "user": [
      "platform-admin"
    ]
  },
  "source": {
    "ip": "10.8.2.232"
  },
  "user": {
    "name": "platform-admin"
  }
}`,
    },
  ],
};
