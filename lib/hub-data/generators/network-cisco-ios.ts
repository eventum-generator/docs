/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoIos: GeneratorMeta = {
  slug: 'network-cisco-ios',
  displayName: 'Cisco IOS Syslog',
  category: 'network',
  description:
    'Cisco IOS 15SY-style TCP syslog for stateful ACL decisions, SSH and configuration, with hourly intrusion episodes and observable permit cleanup.',
  dataSource: 'Cisco IOS remote syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'network-cisco-ios',
  highlights: [
    '35/35 Elastic sample leaf fields modeled',
    'Hourly nine-record denied-to-permitted flow sequence',
    'Logged ACL cleanup and shared background maintenance',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After an hourly source-time interval, a denied flow, three failed logins and a success precede an inserted sequence-50 permit, configuration notification and permitted flow. Nine records span 40 seconds; each episode uses a different TCP port. The normal operator removes that exact permit about ten minutes later, and the next episode waits for a closed ACL. Both modes also include one ordinary insert/test/revoke maintenance sequence.',
  eventTypes: [
    {
      id: '%SEC-6-IPACCESSLOGP',
      description: 'Logged TCP ACL decision',
      frequency: '96.8% routine selection weight',
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
    'One router uses TCP collection, local7 PRI, numbered native messages and UTC milliseconds, with ACL log and archive log config / notify syslog enabled.',
    'ACE 50 precedes logged deny 100; controlled decisions include source, target and TCP port 443, while the non-overlapping ACE-30 normal flow stays separate.',
    'A bounded 128-entry ACL/action/five-tuple cache prevents repeated first-packet records inside 300 seconds only at the shipped count-1 five-second cadence; aggregation summaries are outside scope.',
    'Parser command notifications identify the user but contain no native management-client IP or session ID; configuration messages do not prove command success.',
    '35/35 is normalized field-shape coverage. Full same-version raw parity and collector parsing are unverified; the user/vty/IP CONFIG_I example is non-versioned, and selected TCP/source records were retrieved through the search index.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'edge-ios-01',
      description: 'Single router identity',
    },
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Single router identity',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine operator and management address',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.24',
      description: 'Routine operator and management address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description: 'User and remote address shared by the intrusion sequence',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '10.99.2.41',
      description: 'User and remote address shared by the intrusion sequence',
    },
    {
      name: 'anomaly_target_ip',
      defaultValue: '10.50.2.15',
      description: 'Protected target and edited ACL',
    },
    {
      name: 'acl_name',
      defaultValue: 'OUTSIDE_IN',
      description: 'Protected target and edited ACL',
    },
    {
      name: 'maintenance_after_events',
      defaultValue: '360',
      description: 'Routine events before the one-time maintenance test',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '1',
      description:
        'Hours before and between episode starts, minimum 0.5; delayed by any active maintenance or recovery',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the intrusion sequence; `false` emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Logged IOS ACL command',
      json: String.raw`{
  "@timestamp": "2026-09-25T01:00:35+00:00",
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
      "message_count": 100728
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
    "ingested": "2026-09-25T01:00:35+00:00",
    "kind": "event",
    "original": "<189>100728: Sep 25 2026 01:00:35.000 UTC: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin  logged command:50 permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
    "provider": "firewall",
    "sequence": 100728,
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
