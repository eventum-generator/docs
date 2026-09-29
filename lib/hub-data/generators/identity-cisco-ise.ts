/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityCiscoIse: GeneratorMeta = {
  slug: 'identity-cisco-ise',
  displayName: 'Cisco ISE 3.4 Administrative Audit Syslog',
  category: 'identity',
  description:
    'Cisco ISE CISE_Administrative_and_Operational_Audit remote syslog and matching ECS-style JSON for one Policy Administration Node, with the complete syslog record in event.original, for detections on ISE administrator activity. Logins, logoffs and failed logins of five administrators and 120 read-only operators, and logging-configuration changes; not RADIUS or TACACS traffic. Weekly episodes show an administrator account taken over by password guessing and used to switch off log forwarding.',
  dataSource:
    'Cisco ISE 3.4 CISE_Administrative_and_Operational_Audit remote syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native remote syslog envelope in event.original',
    'About 2,640 records a day from 5 administrators and 120 operators',
    'Recurring failed-login, login and logging-disable chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One administrator and source address, within 30 minutes: three 51000 failed logins seconds apart, a 51001 login, a 52001 UPSCategory edit disabling local logging and clearing targets for Passed Authentications, Failed Attempts or RADIUS Accounting, a 52001 UPSLogTarget edit from ENABLED to DISABLED for RemoteCollector or BackupCollector, and a 51002 logout. Episodes recur weekly by default (anomaly_interval_hours 168, minimum 2; lower values are clamped). The first starts within the first min(interval, 24 h) of the run at an hour weighted towards busy hours; each later one is due one interval after the actual start of the previous one and starts in a window of min(interval / 4, 6 h) centred on that due time, with the same weighting, plus a random delay averaging 3 minutes. If no eligible administrator is idle or no chain category or target is enabled, the start moves 5-60 minutes later as often as needed, occasionally stretching a gap by several hours; there is no catch-up. At intervals of 8 hours or less, episodes fall at all hours of the day. The administrator rotates (never the previous one, weighted like background activity), the address is the jump host in 80% of episodes and otherwise the own workstation of the administrator, the category rotates, and with the two default targets the disabled target alternates. Every step also occurs in background; only the complete ordered chain within 30 minutes is absent from it.',
  generatorId: 'identity-cisco-ise',
  eventTypes: [
    {
      id: '51001',
      description: 'Administrator login succeeded',
      frequency: '48.4% measured share',
      category: 'iam, authentication',
    },
    {
      id: '51002',
      description: 'Administrator logged off',
      frequency: '48.4% measured share',
      category: 'iam, authentication',
    },
    {
      id: '51000',
      description: 'Administrator login failed',
      frequency: '2.2% measured share',
      category: 'none',
    },
    {
      id: '52001 UPSCategory',
      description:
        'Configuration changed: logging category severity change, disable or enable',
      frequency: '0.85% measured share',
      category: 'iam, configuration',
    },
    {
      id: '52001 UPSLogTarget',
      description:
        'Configuration changed: remote target status ENABLED/DISABLED',
      frequency: '0.06% measured share',
      category: 'iam, configuration',
    },
  ],
  realismFeatures: [
    'About 2,640 records a day on a fixed UTC curve: 30 an hour round the clock, 60 at 06-07 and 18-21, 120 at 07-08 and 17-18, and 210 at 08-17. Weekdays and weekends look the same.',
    'Five full-access GUI administrators, each with an own workstation address, log in about 47 times a day together; 120 read-only operators (network operations and help desk) look up endpoints and live logs but change no configuration. Sessions of different accounts interleave, and each account has at most one session at a time. Operators sign in from the shared jump host in 10% of sessions, administrators in 15% of ordinary and 80% of logging-maintenance sessions.',
    'A session may begin with one to four mistyped passwords, one failure being more common than two. Administrators mistype more often on the jump host (8.5% of sessions) than on their own workstation (2.8%), operators in 3% of sessions. Accounts sometimes give up after failures, consecutive failures stay below the lockout threshold of five, and failed logins are about 4% of all login attempts. Retries after a failure are a median of about 32 seconds apart, longer at night.',
    'Ordinary administrator sessions hold zero to three logging-category edits before the logout: a severity change, a disable with targets cleared, or re-enabling a disabled category. About 6% of administrator sessions are logging maintenance that disables a category, in a quarter of them also detaches a remote target, and re-enables each object in 60% of cases. Remote targets change only in these sessions, about five disables a week, and a disabled target is usually restored within minutes (median about 4 minutes), a category within hours. Categories change more often than on a typical production node, about seven disables a day.',
    'The stream is received by a separate, always-enabled AuditCollector (LOCAL6/NOTICE, 1,024-byte limit, escaped delimiters), so disabling RemoteCollector or BackupCollector does not cut it off. Message number and payload sequence advance together by one plus a random count of other audit records, keeping the per-node offset of the raw fixtures; ConfigVersionId advances with every edit and with occasional other deployment changes. AdminGUI_Session is the captured literal, not a unique session ID.',
    'Background contains every part of the chain: repeated failures of one account within minutes, failure runs of three or four, give-ups, logins after failures, and maintenance sessions that disable a category and then a remote target. Only the complete ordered chain of one administrator and address within 30 minutes is absent. With anomaly_mode true, counts of these chain parts are about one per episode higher.',
    'No complete ISE 3.4 appliance capture was obtained: login, logout, failure and UPSCategory shapes follow Elastic raw fixtures of unspecified version, the UPSLogTarget payload follows Cisco ISE 3.1 Common Criteria guidance, and the inverse enable form and other severities are extrapolated. Only codes 51000, 51001, 51002 and 52001 are emitted, observer.version is profile context, and rates, the hour curve, the account pools and the initial enabled state are scenario assumptions. Concurrent sessions of one account are not modeled.',
  ],
  parameters: [
    {
      name: 'ise_name',
      defaultValue: 'ise-01.corp.example',
      description: 'PAN hostname in the syslog header',
    },
    {
      name: 'admins',
      defaultValue: '[iseops, admin, netadmin, secops, helpdesk-l2]',
      description: 'Full-access GUI administrator accounts (chain actors)',
    },
    {
      name: 'admin_ips',
      defaultValue:
        '[10.40.1.20, 10.40.1.21, 10.40.1.22, 10.40.1.23, 10.40.1.24]',
      description: 'Workstation address of each administrator',
    },
    {
      name: 'admin_weights',
      defaultValue: '[32, 26, 20, 13, 9]',
      description: 'Relative session rate of each administrator',
    },
    {
      name: 'jump_host_ip',
      defaultValue: '10.99.2.41',
      description:
        'Shared jump host (administrators: 15% of ordinary and 80% of maintenance sessions; operators: 10%)',
    },
    {
      name: 'remote_collector_ip',
      defaultValue: '10.40.0.20',
      description: 'Address of RemoteCollector',
    },
    {
      name: 'backup_collector_ip',
      defaultValue: '10.40.0.21',
      description: 'Address of BackupCollector',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '168',
      description: 'Episode interval (weekly), at least 2 hours',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add anomaly episodes; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'RemoteCollector disable of the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T12:55:38.182+00:00", "cisco_ise": {"log": {"admin": {"interface": "GUI"}, "category": {"name": "CISE_Administrative_and_Operational_Audit"}, "config_change": {"data": "Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,"}, "config_version": {"id": 1277}, "failure": {"flag": false}, "message": {"code": "52001", "description": "Configuration-Changes: Changed configuration", "id": "0000185982"}, "object": {"name": "RemoteCollector", "type": "UPSLogTarget"}, "operation_message": {"text": "LoggingTargets \"RemoteCollector\" has been edited successfully."}, "request_response": {"type": "initial"}, "segment": {"number": 0, "total": 1}}}, "client": {"ip": "10.99.2.41", "user": {"name": "secops"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "configuration-changes", "category": ["iam", "configuration"], "code": "52001", "dataset": "cisco_ise.log", "kind": "event", "original": "\u003c181\u003eSep  1 12:55:38 ise-01.corp.example CISE_Administrative_and_Operational_Audit 0000185982 1 0 2026-09-01 12:55:38.182 +00:00 0000186009 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=1277, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=secops, ConfigChangeData=Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,, ObjectType=UPSLogTarget, ObjectName=RemoteCollector, OperationMessageText=LoggingTargets \"RemoteCollector\" has been edited successfully.,", "sequence": 186009, "timezone": "+00:00", "type": ["change", "info"]}, "host": {"hostname": "ise-01.corp.example"}, "log": {"level": "notice", "syslog": {"priority": 181, "severity": {"name": "notice"}}}, "message": "2026-09-01 12:55:38.182 +00:00 0000186009 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=1277, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=secops, ConfigChangeData=Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,, ObjectType=UPSLogTarget, ObjectName=RemoteCollector, OperationMessageText=LoggingTargets \"RemoteCollector\" has been edited successfully.,", "observer": {"name": "ise-01.corp.example", "product": "Identity Services Engine", "vendor": "Cisco", "version": "3.4"}, "related": {"hosts": ["ise-01.corp.example"], "ip": ["10.99.2.41"], "user": ["secops"]}, "user": {"name": "secops"}}`,
    },
  ],
};
