/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityCiscoIse: GeneratorMeta = {
  slug: 'identity-cisco-ise',
  displayName: 'Cisco ISE Administrative Audit',
  category: 'identity',
  description:
    'Cisco ISE Administrative and Operational Audit remote syslog with linked administrator sessions and a switchable log-routing sequence.',
  dataSource: 'Cisco ISE 3.4 CISE_Administrative_and_Operational_Audit',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Four administrative codes in both modes',
    'Native syslog envelope in event.original',
    'One switchable seven-event session',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After at least 100 routine events, three failed GUI logins are followed by success, disabling Passed Authentications logging and RemoteCollector, then logout for one administrator and IP.',
  generatorId: 'identity-cisco-ise',
  eventTypes: [
    {
      id: '51001',
      description: 'Administrator login succeeded',
      frequency: 'About 47% of routine events',
      category: 'authentication',
    },
    {
      id: '51002',
      description: 'Administrator logged off',
      frequency: 'About 47% of routine events',
      category: 'authentication',
    },
    {
      id: '51000',
      description: 'Administrator login failed',
      frequency: 'About 3% of routine events',
      category: 'authentication',
    },
    {
      id: '52001',
      description: 'Logging category or remote target changed',
      frequency: 'About 3% of routine events',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Five-minute administrative cadence; each logout follows a successful login for the same actor.',
    'Syslog message number and payload sequence advance independently.',
    'The same accounts, source IPs and edited objects occur in both modes.',
    'Exact 3.4 wire bytes for the two targeted 52001 changes await an appliance capture; RADIUS and TACACS are outside this pack.',
  ],
  parameters: [
    {
      name: 'ise_name',
      defaultValue: 'ise-01.corp.example',
      description: 'ISE hostname in syslog header',
    },
    {
      name: 'normal_admin',
      defaultValue: 'iseops',
      description: 'Primary routine administrator',
    },
    {
      name: 'normal_admin_ip',
      defaultValue: '10.40.1.20',
      description: 'Primary routine administrator address',
    },
    {
      name: 'anomaly_admin',
      defaultValue: 'admin',
      description: 'Administrator also used in background',
    },
    {
      name: 'anomaly_admin_ip',
      defaultValue: '10.99.2.41',
      description: 'Administrator source also used in background',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '100',
      description: 'Minimum routine events before one chain',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked session; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'ISE logging category changed',
      json: String.raw`{
  "@timestamp": "2026-09-26T16:35:05.757+00:00",
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
        "id": 2742
      },
      "failure": {
        "flag": false
      },
      "local_logging": "disable",
      "message": {
        "code": "52001",
        "description": "Configuration-Changes: Changed configuration",
        "id": "0000027657"
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
    "original": "<181>Sep 26 16:35:05 ise-01.corp.example CISE_Administrative_and_Operational_Audit 0000027657 1 0 2026-09-26 16:35:05.757 +00:00 0000188543 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=2742, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, ConfigChangeData=Object modified:\\, Log Severity Level = INFO\\,Local Logging = disable\\,Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
    "sequence": 188543,
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
  "message": "2026-09-26 16:35:05.757 +00:00 0000188543 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=2742, FailureFlag=false, RequestResponseType=initial, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, ConfigChangeData=Object modified:\\, Log Severity Level = INFO\\,Local Logging = disable\\,Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
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
