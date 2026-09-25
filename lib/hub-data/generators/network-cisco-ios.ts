/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoIos: GeneratorMeta = {
  slug: 'network-cisco-ios',
  displayName: 'Cisco IOS Syslog',
  category: 'network',
  description:
    'Cisco IOS 15SY remote syslog with ACL decisions, SSH logins, configuration and line-state messages, plus a switchable ACL-change chain.',
  dataSource: 'Cisco IOS remote syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'network-cisco-ios',
  highlights: [
    '35/35 Elastic sample leaf fields',
    'Native IOS message body and sequence',
    'ACL rule state changes with configuration commands',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One 40-second sequence: denied flow, three failed SSH logins, success, insertion of a permit before the deny, configuration change and permitted flow.',
  eventTypes: [
    {
      id: '%SEC-6-IPACCESSLOGP deny',
      description: 'Logged ACL deny',
      frequency: 'Part of 96.8% routine ACL traffic',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP permit',
      description: 'Logged ACL permit',
      frequency: 'Part of 96.8% routine ACL traffic',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-5-LOGIN_SUCCESS',
      description: 'Successful SSH login',
      frequency: '1.0% routine selection weight',
      category: 'authentication',
    },
    {
      id: '%SEC_LOGIN-4-LOGIN_FAILED',
      description: 'Failed SSH login',
      frequency: '0.8% routine selection weight',
      category: 'authentication',
    },
    {
      id: '%PARSER-5-CFGLOG_LOGGEDCMD',
      description: 'Configuration command logged',
      frequency: '0.8% routine selection weight',
      category: 'configuration',
    },
    {
      id: '%SYS-5-CONFIG_I',
      description: 'Configuration changed',
      frequency: '0.5% routine selection weight',
      category: 'configuration',
    },
    {
      id: '%LINEPROTO-5-UPDOWN',
      description: 'Interface line protocol changed',
      frequency: '0.1% routine selection weight',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Single-router TCP syslog with local7 facility, numbered messages and UTC milliseconds.',
    'A sequence-50 permit is inserted before the logged sequence-100 deny; matching traffic follows the current ACL state.',
    'Both modes include ordinary ACL maintenance; the suspicious login-to-permit order occurs only with anomaly mode enabled.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'edge-ios-01',
      description: 'Router name',
    },
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Router address',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine operator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.24',
      description: 'Routine management source',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description: 'Shared administrator identity',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '10.99.2.41',
      description: 'Shared remote address',
    },
    {
      name: 'anomaly_target_ip',
      defaultValue: '10.50.2.15',
      description: 'Protected target',
    },
    { name: 'acl_name', defaultValue: 'OUTSIDE_IN', description: 'Edited ACL' },
    {
      name: 'maintenance_after_events',
      defaultValue: '360',
      description: 'Routine events before ordinary ACL maintenance',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '720',
      description: 'Routine events before the one-time intrusion sequence',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the intrusion sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Logged IOS ACL command',
      json: String.raw`{
  "@timestamp": "2026-09-25T17:40:25+00:00",
  "agent": {
    "ephemeral_id": "c0ffee00-1111-4444-8888-123456789abc",
    "id": "c0ffee00-1111-4444-8888-123456789abc",
    "name": "syslog-collector",
    "type": "filebeat",
    "version": "8.17.0"
  },
  "cisco": {
    "ios": {
      "access_list": "OUTSIDE_IN",
      "command": "50 permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
      "facility": "PARSER",
      "message_count": 100735
    }
  },
  "data_stream": {
    "dataset": "cisco_ios.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "c0ffee00-1111-4444-8888-123456789abc",
    "snapshot": false,
    "version": "8.17.0"
  },
  "event": {
    "action": "configuration-command",
    "agent_id_status": "verified",
    "category": [
      "configuration"
    ],
    "code": "CFGLOG_LOGGEDCMD",
    "dataset": "cisco_ios.log",
    "ingested": "2026-09-25T17:40:25+00:00",
    "kind": "event",
    "original": "<189>100735: Sep 25 2026 17:40:25.000 UTC: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin  logged command:50 permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
    "provider": "firewall",
    "sequence": 100735,
    "severity": 5,
    "timezone": "+00:00",
    "type": [
      "change"
    ]
  },
  "input": {
    "type": "tcp"
  },
  "log": {
    "level": "notification",
    "source": {
      "address": "10.30.0.1:49152"
    },
    "syslog": {
      "priority": 189
    }
  },
  "message": "User:admin  logged command:50 permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
  "observer": {
    "hostname": "edge-ios-01",
    "ip": "10.30.0.1",
    "product": "IOS",
    "type": "router",
    "vendor": "Cisco"
  },
  "related": {
    "user": [
      "admin"
    ]
  },
  "tags": [
    "preserve_original_event",
    "cisco-ios",
    "forwarded"
  ],
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
