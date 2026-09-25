/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityCiscoIse: GeneratorMeta = {
  slug: 'identity-cisco-ise',
  displayName: 'Cisco ISE Administrative Audit',
  category: 'identity',
  description:
    'Cisco ISE administrative syslog for login and configuration events, with a switchable authentication-to-log-routing anomaly.',
  dataSource: 'Cisco ISE Administrative and Operational Audit',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'identity-cisco-ise',
  highlights: [
    '45/45 selected Elastic fixture fields',
    'Native 51000/51001/52001/52002 codes',
    'Correlated log-routing change',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed admin logins, success, Passed Authentications logging disabled, then a remote log target deleted.',
  eventTypes: [
    {
      id: '51001',
      description: 'Administrator login succeeded',
      frequency: '65% routine',
      category: 'authentication',
    },
    {
      id: '51002',
      description: 'Administrator logged off',
      frequency: '20% routine',
      category: 'authentication',
    },
    {
      id: '51000',
      description: 'Administrator login failed',
      frequency: '10% routine',
      category: 'authentication',
    },
    {
      id: '52001',
      description: 'Configuration changed',
      frequency: '5% routine',
      category: 'configuration',
    },
    {
      id: '52002',
      description: 'Configuration deleted',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Remote target syslog envelope and message code match Cisco ISE samples.',
    'Administrative and Operational Audit is kept separate from RADIUS endpoint events.',
    'Native AdminName and AdminIPAddress link login and logging changes.',
  ],
  parameters: [
    {
      name: 'ise_name',
      defaultValue: 'ise-01.corp.example',
      description: 'ISE node name',
    },
    {
      name: 'ise_ip',
      defaultValue: '10.40.0.11',
      description: 'ISE node address',
    },
    {
      name: 'normal_admin',
      defaultValue: 'iseops',
      description: 'Routine administrator',
    },
    {
      name: 'normal_admin_ip',
      defaultValue: '10.40.1.20',
      description: 'Routine admin address',
    },
    {
      name: 'anomaly_admin',
      defaultValue: 'admin',
      description: 'Chain administrator',
    },
    {
      name: 'anomaly_admin_ip',
      defaultValue: '10.99.2.41',
      description: 'Chain source',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit anomaly chain alongside background; false keeps background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'ISE authentication logging change',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:07:17+00:00",
  "agent": {
    "ephemeral_id": "15e00000-1111-4444-8888-123456789abc",
    "id": "15e00000-1111-4444-8888-123456789abc",
    "name": "syslog-collector",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "cisco_ise": {
    "log": {
      "acs": {
        "instance": "ise-01.corp.example"
      },
      "admin": {
        "interface": "GUI"
      },
      "assigned_targets": [],
      "category": {
        "name": "CISE_Administrative_and_Operational_Audit"
      },
      "component": "Administration",
      "config_change": {
        "attributes": [
          {
            "name": "Local Logging",
            "value": "disable"
          },
          {
            "name": "Assigned Targets",
            "value": []
          }
        ],
        "data": "Object modified: Local Logging = disable; Assigned Targets = {}"
      },
      "config_version": {
        "id": 3177
      },
      "failure": {
        "flag": false
      },
      "local_logging": "disable",
      "message": {
        "code": "52001",
        "description": "Configuration-Changes: Changed configuration",
        "id": "0000108191"
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
  "data_stream": {
    "dataset": "cisco_ise.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "15e00000-1111-4444-8888-123456789abc",
    "snapshot": false,
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
    "original": "<181>Sep 25 14:07:17 ise-01.corp.example CISE_Administrative_and_Operational_Audit 0000108191 1 0 2026-09-25 14:07:17.000 +00:00 0000108191 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=3177, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, FailureFlag=false, RequestResponseType=initial, ConfigChangeData=Object modified: Local Logging = disable; Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
    "outcome": "success",
    "sequence": 108191,
    "timezone": "+00:00",
    "type": [
      "change",
      "info"
    ]
  },
  "host": {
    "hostname": "ise-01.corp.example",
    "ip": [
      "10.40.0.11"
    ]
  },
  "input": {
    "type": "udp"
  },
  "log": {
    "level": "notice",
    "source": {
      "address": "10.40.0.11:514"
    },
    "syslog": {
      "priority": 181,
      "severity": {
        "name": "notice"
      }
    }
  },
  "message": "2026-09-25 14:07:17.000 +00:00 0000108191 52001 NOTICE Configuration-Changes: Changed configuration, ConfigVersionId=3177, AdminInterface=GUI, AdminIPAddress=10.99.2.41, AdminName=admin, FailureFlag=false, RequestResponseType=initial, ConfigChangeData=Object modified: Local Logging = disable; Assigned Targets = {}, ObjectType=UPSCategory, ObjectName=Passed Authentications, OperationMessageText=LoggingCategories \"Passed Authentications\" has been edited successfully.,",
  "related": {
    "hosts": [
      "ise-01.corp.example"
    ],
    "ip": [
      "10.99.2.41",
      "10.40.0.11"
    ],
    "user": [
      "admin"
    ]
  },
  "tags": [
    "preserve_original_event",
    "cisco-ise",
    "forwarded"
  ],
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
