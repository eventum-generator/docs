/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityCiscoIse: GeneratorMeta = {
  slug: 'identity-cisco-ise',
  displayName: 'Cisco ISE 3.4 Administrative Audit Syslog',
  category: 'identity',
  description:
    'Cisco ISE CISE_Administrative_and_Operational_Audit remote syslog and matching ECS-style JSON for one Policy Administration Node, with the complete syslog record in event.original. Administrator logins, logoffs, failed logins and logging-configuration changes, not RADIUS or TACACS traffic. Recurring episodes show an administrator account taken over by password guessing and used to switch off log forwarding.',
  dataSource:
    'Cisco ISE 3.4 CISE_Administrative_and_Operational_Audit remote syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native remote syslog envelope in event.original',
    'Five administrators with independent GUI sessions',
    'Recurring failed-login, login and logging-disable chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One administrator and source address, within 30 minutes: three 51000 failed logins seconds apart, a 51001 login, a 52001 UPSCategory edit disabling local logging for Passed Authentications, Failed Attempts or RADIUS Accounting, a 52001 UPSLogTarget edit disabling RemoteCollector or BackupCollector, and a 51002 logout. Episodes recur every 24 hours by default (anomaly_interval_hours, at least 2): the first within the first min(interval, 24 h) at an hour drawn from the office-hour curve, each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards busy hours, plus a random delay of about 3 minutes; when no administrator is offline for the whole episode or nothing is enabled, the start moves 5-60 minutes later, with no catch-up. Administrator, category and target rotate. Every element occurs in background; a background session that would complete the ordered chain within 30 minutes skips its final target disable.',
  generatorId: 'identity-cisco-ise',
  eventTypes: [
    {
      id: '51001',
      description: 'Administrator login succeeded',
      frequency: '26.4% measured share',
      category: 'iam, authentication',
    },
    {
      id: '51002',
      description: 'Administrator logged off',
      frequency: '26.3% measured share',
      category: 'iam, authentication',
    },
    {
      id: '52001 UPSCategory',
      description:
        'Configuration changed: logging category severity change, disable or enable',
      frequency: '25.3% measured share',
      category: 'iam, configuration',
    },
    {
      id: '52001 UPSLogTarget',
      description:
        'Configuration changed: remote target status ENABLED/DISABLED',
      frequency: '9.8% measured share',
      category: 'iam, configuration',
    },
    {
      id: '51000',
      description: 'Administrator login failed',
      frequency: '12.2% measured share',
      category: 'none',
    },
  ],
  realismFeatures: [
    'Five GUI administrators, each with an own workstation address and a shared jump host, start sessions independently on a UTC office-hour curve that is lower at night and at weekends, with per-administrator rates.',
    'A session may begin with one to four mistyped passwords a few seconds apart, staying below the lockout threshold of five, and administrators sometimes give up after failures. Sessions last a log-normal time and hold zero to three edits before the logout.',
    'About 30% of sessions are logging maintenance that disables a category or target and often re-enables it; disabled objects are re-enabled by later ordinary edits. A separate always-enabled AuditCollector receives this stream, so disabling RemoteCollector or BackupCollector does not cut it off.',
    'Message number and payload sequence advance together by one plus a random count of other audit records, keeping the per-node offset of the raw fixtures; ConfigVersionId advances with every edit. AdminGUI_Session is the captured literal, not a unique session ID.',
    'No complete ISE 3.4 appliance capture was obtained: login and UPSCategory shapes follow Elastic raw fixtures of unspecified version, and the UPSLogTarget payload follows Cisco ISE 3.1 Common Criteria guidance; the inverse enable form and other severities are extrapolated.',
    'Only codes 51000, 51001, 51002 and 52001 are emitted. Rates, the office-hour curve, the administrator pool and the initial enabled state are scenario assumptions; concurrent sessions of one administrator are not modeled.',
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
      description: 'GUI administrator accounts',
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
      description: 'Shared jump host, used for about 22% of sessions',
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
      defaultValue: '24',
      description: 'Episode interval, at least 2 hours',
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
      json: String.raw`{"@timestamp": "2026-09-28T08:47:56.218+00:00", "cisco_ise": {"log": {"admin": {"interface": "GUI"}, "category": {"name": "CISE_Administrative_and_Operational_Audit"}, "config_change": {"data": "Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,"}, "config_version": {"id": 1699}, "failure": {"flag": false}, "message": {"code": "52001", "description": "Configuration-Changes: Changed configuration", "id": "0000255796"}, "object": {"name": "RemoteCollector", "type": "UPSLogTarget"}, "operation_message": {"text": "LoggingTargets \"RemoteCollector\" has been edited successfully."}, "request_response": {"type": "initial"}, "segment": {"number": 0, "total": 1}}}, "client": {"ip": "10.99.2.41", "user": {"name": "secops"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "configuration-changes", "category": ["iam", "configuration"], "code": "52001", "dataset": "cisco_ise.log", "kind": "event", "original": "\u003c181\u003eSep 28 08:47:56 ise-01.corp.example CISE_Administrative_and_Operational_Audit 0000255796 1 0 2026-09-28 08:47:56.218 +00:00 0000255857 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=1699, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=secops, ConfigChangeData=Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,, ObjectType=UPSLogTarget, ObjectName=RemoteCollector, OperationMessageText=LoggingTargets \"RemoteCollector\" has been edited successfully.,", "sequence": 255857, "timezone": "+00:00", "type": ["change", "info"]}, "host": {"hostname": "ise-01.corp.example"}, "log": {"level": "notice", "syslog": {"priority": 181, "severity": {"name": "notice"}}}, "message": "2026-09-28 08:47:56.218 +00:00 0000255857 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=1699, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=secops, ConfigChangeData=Object modified:\\,Port = 514\\,IP Address = 10.40.0.20\\,Facility Code = LOCAL6\\,Length = 1024\\,Description = Remote UDP Collector\\,Include Alarms = FALSE\\,Old status = ENABLED New status = DISABLED\\,, ObjectType=UPSLogTarget, ObjectName=RemoteCollector, OperationMessageText=LoggingTargets \"RemoteCollector\" has been edited successfully.,", "observer": {"name": "ise-01.corp.example", "product": "Identity Services Engine", "vendor": "Cisco", "version": "3.4"}, "related": {"hosts": ["ise-01.corp.example"], "ip": ["10.99.2.41"], "user": ["secops"]}, "user": {"name": "secops"}}`,
    },
  ],
};
