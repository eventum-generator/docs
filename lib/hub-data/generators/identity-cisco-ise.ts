/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityCiscoIse: GeneratorMeta = {
  slug: 'identity-cisco-ise',
  displayName: 'Cisco ISE Administrative Audit',
  category: 'identity',
  description:
    'Cisco ISE 3.4 administrator-audit remote syslog with causal GUI sessions, visible logging restoration and recurring daily routing-change episodes.',
  dataSource: 'Cisco ISE 3.4 CISE_Administrative_and_Operational_Audit',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Four administrative codes in both modes',
    'Native remote syslog envelope and independent counters',
    'Seven-record GUI episodes recur every 24 hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, after an ordinary GUI session closes and both settings are enabled, one administrator/IP makes three failed logins, succeeds, disables local Passed Authentications logging/clears its targets, disables RemoteCollector, then logs out. Seven records span about 30 minutes. Visible ordinary login/edit/logout restoration reenables settings before recurrence; due scheduling may wait. A separate always-enabled AuditCollector keeps this stream visible.',
  generatorId: 'identity-cisco-ise',
  eventTypes: [
    {
      id: '51000',
      description: 'Administrator GUI login failed',
      frequency: 'About 2% of validated background; three per episode',
      category: 'authentication',
    },
    {
      id: '51001',
      description: 'Administrator GUI login succeeded',
      frequency: 'About 46% of validated background; opens a modeled session',
      category: 'authentication',
    },
    {
      id: '51002',
      description: 'Administrator GUI logged off',
      frequency:
        'About 46% of validated background; closes the same actor/IP session',
      category: 'authentication',
    },
    {
      id: '52001',
      description: 'Existing logging category or target changed',
      frequency:
        'About 6% of validated background; disables/enables and restorations',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Five-minute input slots with 0–9.999 second jitter normalize both native timestamps and ECS to UTC. Native message and payload sequence counters advance independently; AdminGUI_Session is a captured literal, not a unique session ID.',
    'No edit/logout occurs without login. Both administrators edit both categories and targets, with at most two routine edits before logout. Background isolated failure is followed by success.',
    'Three episode failures stay below the selected five-attempt lockout threshold. Sixty-minute GUI idle timeout, privileged administrators and initially enabled local Passed Authentications are explicit profile assumptions; Cisco defaults that local logging off.',
    'Restoration eligibility starts about an hour after disable, or at a due episode, and waits for the current session/retry. Visible changes reenable settings; no hidden reset or exact restoration deadline is claimed.',
    'Separate AuditCollector routes Administrative and Operational Audit with LOCAL6/NOTICE, 1024-byte limit and RFC3164 compliance unchecked. Editable RemoteCollector serves other categories, so its disable preserves this selected audit stream.',
    'BLOCKED_RAW_EVIDENCE: older Cisco 3.1 object examples and unspecified-version Elastic fixtures do not prove exact 3.4 disable/enable/restoration wire bytes. The inspected Elastic pipeline was not executed; observer.version is synthetic profile context. No RADIUS/TACACS or localStore format is claimed.',
  ],
  parameters: [
    {
      name: 'ise_name',
      defaultValue: 'ise-01.corp.example',
      description: 'PAN hostname in native syslog',
    },
    {
      name: 'normal_admin',
      defaultValue: 'iseops',
      description: 'Routine and restoration administrator/IP',
    },
    {
      name: 'normal_admin_ip',
      defaultValue: '10.40.1.20',
      description: 'Routine and restoration administrator/IP',
    },
    {
      name: 'anomaly_admin',
      defaultValue: 'admin',
      description: 'Episode administrator/IP, also used in background',
    },
    {
      name: 'anomaly_admin_ip',
      defaultValue: '10.99.2.41',
      description: 'Episode administrator/IP, also used in background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Positive recurrence interval, at least two hours',
    },
    {
      name: 'remote_collector_ip',
      defaultValue: '10.40.0.20',
      description: 'Address of the existing editable `RemoteCollector`',
    },
    {
      name: 'backup_collector_ip',
      defaultValue: '10.40.0.21',
      description: 'Address of the existing editable `BackupCollector`',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include repeated episodes; `false` emits background only',
    },
  ],
  sampleOutputs: [
    {
      title:
        'Passed Authentications logging changed in an administrator session',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:30:02.919+00:00",
  "cisco_ise": {
    "log": {
      "admin": {
        "interface": "GUI"
      },
      "assigned_targets": [],
      "category": {
        "name": "CISE_Administrative_and_Operational_Audit"
      },
      "config_change": {
        "data": "Object modified:\\, Log Severity Level = INFO\\,Local Logging = disable\\,Assigned Targets = {}"
      },
      "config_version": {
        "id": 2761
      },
      "failure": {
        "flag": false
      },
      "local_logging": "disable",
      "message": {
        "code": "52001",
        "description": "Configuration-Changes: Changed configuration",
        "id": "0000027679"
      },
      "object": {
        "name": "Passed Authentications",
        "type": "UPSCategory"
      },
      "operation_message": {
        "text": "LoggingCategories \"Passed Authentications\" has been edited successfully."
      },
      "request_response": {
        "type": "initial"
      },
      "segment": {
        "number": 0,
        "total": 1
      }
    }
  },
  "client": {
    "ip": "10.99.2.41",
    "user": {
      "name": "admin"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "configuration-changes",
    "category": [
      "iam",
      "configuration"
    ],
    "code": "52001",
    "dataset": "cisco_ise.log",
    "kind": "event",
    "original": "<181>Sep 27 00:30:02 ise-01.corp.example CISE_Administrative_and_Operational_Audit 0000027679 1 0 2026-09-27 00:30:02.919 +00:00 0000188565 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=2761, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, ConfigChangeData=Object modified:\\, Log Severity Level = INFO\\,Local Logging = disable\\,Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
    "sequence": 188565,
    "timezone": "+00:00",
    "type": [
      "change",
      "info"
    ]
  },
  "host": {
    "hostname": "ise-01.corp.example"
  },
  "log": {
    "level": "notice",
    "syslog": {
      "priority": 181,
      "severity": {
        "name": "notice"
      }
    }
  },
  "message": "2026-09-27 00:30:02.919 +00:00 0000188565 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=2761, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, ConfigChangeData=Object modified:\\, Log Severity Level = INFO\\,Local Logging = disable\\,Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
  "observer": {
    "name": "ise-01.corp.example",
    "product": "Identity Services Engine",
    "vendor": "Cisco",
    "version": "3.4"
  },
  "related": {
    "hosts": [
      "ise-01.corp.example"
    ],
    "ip": [
      "10.99.2.41"
    ],
    "user": [
      "admin"
    ]
  },
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
