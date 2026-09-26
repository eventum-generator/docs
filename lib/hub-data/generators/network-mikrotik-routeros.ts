/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkMikrotikRouteros: GeneratorMeta = {
  slug: 'network-mikrotik-routeros',
  displayName: 'MikroTik RouterOS Syslog',
  category: 'network',
  description:
    'RouterOS 7 account, temporary mangle-rule, DHCP and UDP firewall messages, with recurring external administrator episodes and bounded session state.',
  dataSource:
    'RouterOS 7 BSD Syslog UDP, local0/info with topic prefix enabled',
  format: ['JSON', 'ECS', 'RFC 3164'],
  eventCount: 9,
  templateCount: 1,
  highlights: [
    'Nine action branches in both modes',
    'Paired sessions, temporary rules and bounded leases',
    'Recurring six-record episodes every 24 hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, an external administrator Winbox login precedes temporary mangle add, move, change and remove operations, then a matching logout over five minutes. The shared external-address pool rotates between episodes and ordinary logins. Scheduling waits for daily sessions and maintenance to finish; generic edit records establish no session or rule ID.',
  generatorId: 'network-mikrotik-routeros',
  eventTypes: [
    {
      id: 'DHCP assigned',
      description: 'Assign a client lease',
      frequency: 'Part of 5% ordinary DHCP choices, toggled per client',
      category: 'network',
    },
    {
      id: 'DHCP deassigned',
      description: 'Release an existing client lease',
      frequency: 'Part of 5% ordinary DHCP choices, toggled per client',
      category: 'network',
    },
    {
      id: 'UDP firewall packet',
      description: 'Logged input-chain UDP packet; no accept/drop decision',
      frequency: '95% ordinary non-session choices',
      category: 'network',
    },
    {
      id: 'Winbox login',
      description: 'Administrator or normal operator logs in',
      frequency: 'Daily paired sessions; periodic external episode',
      category: 'authentication',
    },
    {
      id: 'Winbox logout',
      description: 'Same-address paired session closes',
      frequency: 'Daily paired sessions; periodic external episode',
      category: 'authentication',
    },
    {
      id: 'Mangle rule added',
      description: 'Create one temporary mangle rule',
      frequency: 'Daily internal maintenance and periodic episode',
      category: 'configuration',
    },
    {
      id: 'Mangle rule moved',
      description: 'Move the existing temporary rule',
      frequency: 'Daily internal maintenance and periodic episode',
      category: 'configuration',
    },
    {
      id: 'Mangle rule changed',
      description: 'Change the existing temporary rule',
      frequency: 'Daily internal maintenance and periodic episode',
      category: 'configuration',
    },
    {
      id: 'Mangle rule removed',
      description: 'Remove the temporary rule before logout',
      frequency: 'Daily internal maintenance and periodic episode',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'One-minute UTC cadence; login/logout, DHCP assignments/releases and temporary-rule operations retain causal state without a growing inventory.',
    'Daily background includes the same actors, external address pool and all edit operations; reservations prevent ordinary sessions from losing their login or logout.',
    'Packet MAC, UDP addresses, ports and length agree with ECS; packet logs do not establish a policy decision or firewall bypass.',
    'BLOCKED_RAW_EVIDENCE: exact RouterOS 7 UDP PRI/header/topic placement is unverified; the removal body is inferred from a firsthand RouterOS 6.35rc record.',
    'Generic mangle records contain no rule ID or client IP. The edit-to-session and single-rule association is a scenario assumption; no full remote-wire compatibility is claimed.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'mt-edge-01',
      description: 'Router identity and UDP packet destination',
    },
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Router identity and UDP packet destination',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Ordinary operator and management address',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.12',
      description: 'Ordinary operator and management address',
    },
    {
      name: 'admin_internal_source_ip',
      defaultValue: '10.30.1.11',
      description: 'Internal administrator maintenance address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description:
        'Administrator used in both background and incident sessions',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.83',
      description: 'First address in the shared external administrator pool',
    },
    {
      name: 'additional_external_source_ips',
      defaultValue: '[198.51.100.84, 198.51.100.85]',
      description: 'Other addresses in that pool, used by both modes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'First wait and recurrence, minimum one hour; ordinary sessions can delay scheduling',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include periodic external-login-and-edit episodes',
    },
  ],
  sampleOutputs: [
    {
      title: 'Mangle rule moved during external episode',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:04:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "kind": "event",
    "module": "mikrotik",
    "dataset": "mikrotik.routeros.syslog",
    "category": [
      "configuration"
    ],
    "type": [
      "info"
    ],
    "action": "mangle_rule_changed",
    "original": "<134>Sep 26 00:04:00 mt-edge-01 system,info mangle rule changed by admin"
  },
  "message": "mangle rule changed by admin",
  "observer": {
    "hostname": "mt-edge-01",
    "ip": "10.30.0.1",
    "vendor": "MikroTik",
    "product": "RouterOS",
    "type": "router"
  },
  "log": {
    "syslog": {
      "priority": 134,
      "facility": {
        "code": 16
      },
      "severity": {
        "code": 6
      }
    }
  },
  "mikrotik": {
    "topics": [
      "system",
      "info"
    ]
  },
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
