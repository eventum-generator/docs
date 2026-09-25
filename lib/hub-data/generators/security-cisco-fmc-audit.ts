import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCiscoFmcAudit: GeneratorMeta = {
  slug: 'security-cisco-fmc-audit',
  displayName: 'Cisco FMC Audit Logs',
  category: 'security',
  description: 'Secure Firewall Management Center 7.4 console audit Syslog.',
  dataSource: 'Cisco Secure Firewall Management Center audit',
  format: ['Syslog', 'ECS'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Cisco-published FMC-AUDIT management actions',
    'Network object creation followed by NAT policy save',
    'Independent management changes also occur in background mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One administrator opens the NAT editor, creates a network object, saves a NAT policy, then a pre-deploy task completes.',
  generatorId: 'fmc',
  eventTypes: [
    {
      id: 'nat_policy_page_view',
      description: 'NAT policy editor Page View',
      frequency: '~53% background',
      category: 'web',
    },
    {
      id: 'nat_page_view',
      description: 'NAT Page View',
      frequency: '~20% background',
      category: 'web',
    },
    {
      id: 'login_success',
      description: 'System login success',
      frequency: '~8% background',
      category: 'authentication',
    },
    {
      id: 'network_object_create',
      description: 'NetworkObject create',
      frequency: '~6% background; also in sequence',
      category: 'configuration',
    },
    {
      id: 'nat_policy_save',
      description: 'NAT policy save',
      frequency: '~6% background; also in sequence',
      category: 'configuration',
    },
    {
      id: 'predeploy_config_generation_complete',
      description: 'Pre-deploy task completion',
      frequency: '~6% background; also in sequence',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'FMC-originating Syslog syntax from Cisco 7.4.0 examples',
    'Stable administrator and source address across console changes',
    'No inferred policy ID or deployment result on the task line',
    'Three-minute management sequence in a five-minute detection window',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable management-change sequence.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records before each sequence.',
    },
    {
      name: 'management_center',
      defaultValue: 'firepower',
      description: 'Synthetic FMC hostname.',
    },
    {
      name: 'unusual_admin_ip',
      defaultValue: '198.51.100.44',
      description: 'Administrator source in the sequence.',
    },
    {
      name: 'network_object',
      defaultValue: 'csm-lab',
      description: 'Created network object.',
    },
    {
      name: 'nat_policy',
      defaultValue: 'NATPolicy',
      description: 'Saved NAT policy.',
    },
  ],
  sampleOutputs: [
    {
      title: 'FMC network object creation',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:52:00+00:00",
  "cisco": {
    "fmc": {
      "audit": {
        "component": "sfdccsm",
        "detail": "Objects > Object Management > NetworkObject, create csm-lab"
      }
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "network_object_create",
    "category": [
      "configuration"
    ],
    "code": "FMC-AUDIT",
    "dataset": "cisco.fmc.audit",
    "kind": "event",
    "original": "Sep 25 14:52:00 firepower: [FMC-AUDIT] sfdccsm: admin@198.51.100.44, Objects > Object Management > NetworkObject, create csm-lab",
    "type": [
      "creation"
    ]
  },
  "observer": {
    "name": "firepower",
    "product": "Secure Firewall Management Center",
    "vendor": "Cisco"
  },
  "related": {
    "ip": [
      "198.51.100.44"
    ]
  },
  "source": {
    "ip": "198.51.100.44"
  },
  "user": {
    "name": "admin"
  }
}`,
    },
  ],
};
