/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexEsr: GeneratorMeta = {
  displayName: 'Eltex ESR Router Syslog',
  description:
    'Selected ESR1.40 router message profile with fixed firewall policy, NAT, IPS and closed SSH sessions. Daily account sequences share ordinary actors and include visible application and cleanup.',
  dataSource: 'Selected Eltex ESR1.40 remote message profile',
  format: ['JSON', 'ECS', 'RFC 5424'],
  generatorId: 'esr',
  highlights: [
    'Fourteen actions shared by both modes',
    'Bounded account and SSH lifecycle',
    'Daily sequences span130 seconds',
  ],
  anomalyChain:
    'Every24 hours, three failed passwords precede accepted administrator SSH, enable-password change, local account creation at privilege1, increase to14, visible configuration application, TIME notification and closed service/admin sessions. Fourteen records span130 seconds. Visible account removal/application precedes reuse. Ordinary work shares all actors, aliases and actions.',
  eventTypes: [
    {
      id: 'firewall_permitted',
      description: 'Permit according to fixed rules10/20/30',
      frequency: '620 synthetic network-slot weight',
      category: 'network',
    },
    {
      id: 'firewall_denied',
      description: 'Deny according to fixed rule40',
      frequency: '200 synthetic network-slot weight',
      category: 'network',
    },
    {
      id: 'snat_translation',
      description: 'Source translation for an allowed selected flow',
      frequency: '150 synthetic network-slot weight',
      category: 'network',
    },
    {
      id: 'ips_drop',
      description:
        'Selected ICMP signature drop; native endpoint suffixes retained',
      frequency: '15 synthetic network-slot weight',
      category: 'intrusion_detection',
    },
    {
      id: 'ssh_password_failed',
      description: 'Password rejection below configured lockout threshold',
      frequency: 'Ordinary isolated failure; three per episode',
      category: 'authentication',
    },
    {
      id: 'ssh_password_accepted',
      description: 'Authenticate a selected existing/applied account',
      frequency: 'Ordinary administration/service tests and episodes',
      category: 'authentication',
    },
    {
      id: 'session_opened',
      description: 'Open the context of the accepted SSH session',
      frequency: 'Every selected SSH session',
      category: 'authentication',
    },
    {
      id: 'session_closed',
      description: 'Close that session without live tuple overlap',
      frequency: 'Every selected SSH session',
      category: 'authentication',
    },
    {
      id: 'enable_password_changed',
      description: 'Native privileged-password notification',
      frequency: 'Ordinary maintenance and one per episode',
      category: 'configuration',
    },
    {
      id: 'user_created',
      description: 'Create one absent rotating temporary account at privilege1',
      frequency: 'Ordinary maintenance and one per episode',
      category: 'iam',
    },
    {
      id: 'user_privilege_changed',
      description: 'Raise the existing account from1 to14',
      frequency: 'Ordinary maintenance and one per episode',
      category: 'iam',
    },
    {
      id: 'configuration_applied',
      description: 'Apply the pending selected configuration',
      frequency: 'Ordinary mutations and one per episode',
      category: 'configuration',
    },
    {
      id: 'system_time_changed',
      description: 'Native TIME actor notification without a clock delta',
      frequency: 'Ordinary maintenance and one per episode',
      category: 'configuration',
    },
    {
      id: 'user_removed',
      description: 'Remove the existing temporary account before reuse',
      frequency: 'Visible ordinary cleanup',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'One record every ten seconds. One current temporary account, at most two SSH sessions and fourteen pending records keep source state bounded. Rates are a selected training workload.',
    'Matching firewall rule decisions are fixed. NAT selects allowed inventory. Native ICMP2048/0 suffixes are retained privately without assigning TCP/UDP port semantics.',
    'Creation starts at documented privilege1, service use follows visible SYS application, and removal/application precedes the next incarnation. Administrator/service ports differ while both sessions are live.',
    'Both modes have ordinary authentication and actual creation for the same three aliases and both administrators. Separate bounded cursors avoid interval-dependent reservation of an alias for episodes.',
    'USER/SYS configuration bodies remain actorless. Temporal session context does not establish native user attribution. TIME does not prove rollback or evasion.',
    'Selected message patterns and a complete remote AAA example are documented. Non-AAA program/facility binding and global counter are profile assumptions. Full wire capture and live parser parity remain unverified. SSH console commit/confirm records are excluded; timely confirmation is an explicit outside-subset assumption.',
  ],
  slug: 'network-eltex-esr',
  category: 'network',
  eventCount: 14,
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'esr-edge-01',
      description: 'Router name',
    },
    {
      name: 'router_ip',
      defaultValue: '10.50.0.1',
      description: 'Router ip',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'First existing administrator, active in both modes',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.50.1.25',
      description: 'First administrator source, shared by both modes',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin',
      description: 'Second existing administrator, active in both modes',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.99.4.33',
      description: 'Second administrator source, shared by both modes',
    },
    {
      name: 'service_user_prefix',
      defaultValue: 'svc_remote_',
      description:
        'Same three bounded account aliases for ordinary and injected activity',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Default true includes periodic combined sequences; false retains ordinary activity',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between actual starts; supported minimum6',
    },
  ],
  sampleOutputs: [
    {
      title: 'Applied-profile privilege1 to14 notification',
      json: String.raw`{
  "@timestamp": "2026-09-27T00:01:10+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "user_privilege_changed",
    "category": [
      "iam"
    ],
    "dataset": "eltex.esr.syslog",
    "kind": "event",
    "module": "eltex",
    "original": "<134>1 2026-09-27T00:01:10+00:00 esr-edge-01 user - - - 8648: %USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14",
    "outcome": "success",
    "type": [
      "change"
    ]
  },
  "message": "%USER-I-INFO: Privilege level of user svc_remote_001 was changed from 1 to 14",
  "log": {
    "level": "info",
    "syslog": {
      "priority": 134,
      "facility": {
        "code": 16
      },
      "severity": {
        "code": 6
      },
      "appname": "user",
      "version": "1"
    }
  },
  "observer": {
    "hostname": "esr-edge-01",
    "ip": [
      "10.50.0.1"
    ],
    "name": "esr-edge-01",
    "product": "ESR",
    "type": "router",
    "vendor": "Eltex"
  },
  "eltex": {
    "esr": {
      "group": "USER",
      "mnemonic": "INFO",
      "severity_code": "I",
      "sequence_number": 8648,
      "details": {
        "privilege": {
          "new": 14,
          "old": 1
        }
      }
    }
  },
  "user": {
    "target": {
      "name": "svc_remote_001"
    }
  },
  "related": {
    "user": [
      "svc_remote_001"
    ]
  }
}`,
    },
  ],
};
