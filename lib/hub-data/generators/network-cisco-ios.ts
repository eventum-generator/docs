/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoIos: GeneratorMeta = {
  slug: 'network-cisco-ios',
  displayName: 'Cisco IOS Syslog',
  category: 'network',
  description:
    'Native Cisco IOS syslog for ACL, login and configuration events, including a switchable admin-login and ACL-change chain.',
  dataSource: 'Cisco IOS remote syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'network-cisco-ios',
  highlights: [
    '35/35 Elastic sample fields',
    'Native IOS facility and mnemonic',
    'Login-to-ACL command correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed admin logins, success, logged ACL permit command, config event and first matching permitted flow.',
  eventTypes: [
    {
      id: '%SEC-6-IPACCESSLOGP deny',
      description: 'ACL denied',
      frequency: '55% routine',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP permit',
      description: 'ACL permitted',
      frequency: '30% routine',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-5-LOGIN_SUCCESS',
      description: 'Administrator login',
      frequency: '8% routine',
      category: 'authentication',
    },
    {
      id: '%SYS-5-CONFIG_I',
      description: 'Configuration changed',
      frequency: '4% routine',
      category: 'configuration',
    },
    {
      id: '%LINEPROTO-5-UPDOWN',
      description: 'Line state changed',
      frequency: '3% routine',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-4-LOGIN_FAILED',
      description: 'Failed login',
      frequency: 'Anomaly only',
      category: 'authentication',
    },
    {
      id: '%PARSER-5-CFGLOG_LOGGEDCMD',
      description: 'ACL command logged',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Syslog envelope and IOS sequence remain coherent.',
    'Fifty flow samples avoid static one-flow traffic.',
    'ACL command requires archive log config with notify syslog.',
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
      description: 'Routine administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.24',
      description: 'Routine management source',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description: 'Chain administrator',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '10.99.2.41',
      description: 'Chain source',
    },
    {
      name: 'anomaly_target_ip',
      defaultValue: '10.50.2.15',
      description: 'Permitted target',
    },
    {
      name: 'acl_name',
      defaultValue: 'OUTSIDE_IN',
      description: 'Changed ACL',
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
      title: 'Logged IOS ACL command',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:29:44+00:00",
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
      "command": "permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
      "facility": "PARSER",
      "message_count": 109544,
      "sequence": "109544"
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
    "ingested": "2026-09-25T14:29:44+00:00",
    "kind": "event",
    "original": "Sep 25 14:29:44 edge-ios-01 109544: Sep 25 14:29:44.000: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin logged command:permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
    "outcome": "success",
    "provider": "firewall",
    "sequence": 109544,
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
      "address": "10.30.0.1:514"
    },
    "syslog": {
      "priority": 189
    }
  },
  "message": "User:admin logged command:permit tcp host 10.99.2.41 host 10.50.2.15 eq 443 log",
  "observer": {
    "hostname": "edge-ios-01",
    "ip": "10.30.0.1",
    "product": "IOS",
    "type": "router",
    "vendor": "Cisco"
  },
  "related": {
    "ip": [
      "10.99.2.41",
      "10.50.2.15"
    ],
    "user": [
      "admin"
    ]
  },
  "source": {
    "ip": "10.99.2.41"
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
