/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityImpervaSecuresphere: GeneratorMeta = {
  slug: 'security-imperva-securesphere',
  displayName: 'Imperva SecureSphere 8.5',
  category: 'security',
  description:
    'Version-pinned SecureSphere CEF alerts with a signature, protocol and correlation escalation.',
  dataSource: 'Imperva SecureSphere 8.5 security-event CEF action set',
  format: ['CEF', 'Syslog', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  generatorId: 'security-imperva-securesphere',
  highlights: [
    'Complete 19-key security-alert CEF template for versions 6.2-8.5',
    'Signature and protocol alerts precede a blocked correlation alert',
    'Shared client and protected server across the chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client causes a low signature alert, a medium protocol alert and a high blocked correlation alert against one protected server.',
  eventTypes: [
    {
      id: 'signature',
      description: 'Signature security alert',
      frequency: 'About 70% of routine events; one per chain',
      category: 'intrusion_detection, web',
    },
    {
      id: 'protocol',
      description: 'Protocol security alert',
      frequency: 'About 20% of routine events; one per chain',
      category: 'intrusion_detection, web',
    },
    {
      id: 'profile',
      description: 'Profile security alert',
      frequency: 'About 10% of routine events',
      category: 'intrusion_detection, web',
    },
    {
      id: 'correlation',
      description: 'Correlated security alert',
      frequency: 'Chain only',
      category: 'intrusion_detection, web',
    },
  ],
  realismFeatures: [
    'CEF header and all 19 extension keys follow the Imperva security-event template.',
    'Names, policies and descriptions are representative configurable metadata.',
    'Compatibility with newer SecureSphere releases is unverified.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'securesphere-mx-01.example.test',
      description: 'ECS device host',
    },
    {
      name: 'device_version',
      defaultValue: '8.5',
      description: 'Pinned documented CEF profile',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'chain_source_ip',
      defaultValue: '10.43.9.77',
      description: 'Stable chain client',
    },
    {
      name: 'protected_server_ip',
      defaultValue: '10.43.20.15',
      description: 'Protected server',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated signature alert',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:59:20+00:00",
  "destination": {
    "ip": "10.43.20.15",
    "port": 443
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "no-action",
    "category": [
      "intrusion_detection",
      "web"
    ],
    "code": "signature",
    "dataset": "imperva_securesphere.cef",
    "kind": "alert",
    "original": "CEF:0|Imperva Inc.|SecureSphere|8.5|signature|Signature violation|Low|act=None dst=10.43.20.15 dpt=443 duser=anonymous src=10.43.9.77 spt=53430 proto=TCP rt=Sep 25 2026 13:59:20 cat=Alert cs1=SignaturePolicy cs1Label=Policy cs2=PortalGroup cs2Label=ServerGroup cs3=HTTPS cs3Label=ServiceName cs4=CustomerPortal cs4Label=ApplicationName cs5=SignatureMatch cs5Label=Description",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "securesphere-mx-01.example.test"
  },
  "imperva": {
    "securesphere": {
      "class_id": "signature",
      "device_version": "8.5",
      "extension": {
        "act": "None",
        "cat": "Alert",
        "cs1": "SignaturePolicy",
        "cs1Label": "Policy",
        "cs2": "PortalGroup",
        "cs2Label": "ServerGroup",
        "cs3": "HTTPS",
        "cs3Label": "ServiceName",
        "cs4": "CustomerPortal",
        "cs4Label": "ApplicationName",
        "cs5": "SignatureMatch",
        "cs5Label": "Description",
        "dpt": 443,
        "dst": "10.43.20.15",
        "duser": "anonymous",
        "proto": "TCP",
        "rt": "Sep 25 2026 13:59:20",
        "spt": 53430,
        "src": "10.43.9.77"
      },
      "name": "Signature violation",
      "product": "SecureSphere",
      "severity": "Low",
      "vendor": "Imperva Inc.",
      "version": 0
    }
  },
  "network": {
    "transport": "tcp"
  },
  "related": {
    "ip": [
      "10.43.9.77",
      "10.43.20.15"
    ]
  },
  "source": {
    "ip": "10.43.9.77",
    "port": 53430
  }
}`,
    },
  ],
};
