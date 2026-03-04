import type { GeneratorMeta } from '@/lib/hub-types';

export const networkFirewall: GeneratorMeta = {
    slug: 'network-firewall',
    displayName: 'Network Firewall (Vendor-Agnostic)',
    category: 'network',
    description:
      'Vendor-agnostic firewall — ECS-normalized traffic flow decisions, session lifecycle, NAT translations, and IDS/IPS threat detections. Plug into any SIEM pipeline without vendor lock-in.',
    format: ['JSON', 'ECS'],
    dataSource: 'Generic Firewall (vendor-agnostic)',
    eventCount: 8,
    templateCount: 8,
    highlights: [
      'Vendor-agnostic',
      'Correlated sessions',
      'NAT tracking',
      'IDS/IPS threats',
    ],
    generatorId: 'fw',
    eventTypes: [
      {
        id: 'traffic-allowed',
        description: 'Permitted connection through firewall',
        frequency: '~53%',
        category: 'network',
      },
      {
        id: 'traffic-denied',
        description: 'Connection rejected with RST/unreachable',
        frequency: '~13%',
        category: 'network',
      },
      {
        id: 'session-start',
        description: 'Stateful session establishment',
        frequency: '~11%',
        category: 'network',
      },
      {
        id: 'session-end',
        description: 'Session teardown with counters',
        frequency: '~10%',
        category: 'network',
      },
      {
        id: 'traffic-dropped',
        description: 'Silently dropped (default deny)',
        frequency: '~9%',
        category: 'network',
      },
      {
        id: 'nat-translation',
        description: 'Source/destination NAT event',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'threat-detected',
        description: 'IDS/IPS signature match',
        frequency: '~1%',
        category: 'intrusion_detection',
      },
      {
        id: 'system-event',
        description: 'Device operational events',
        frequency: 'rare',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      'Correlated sessions — session-start events consumed by session-end with matching 5-tuple',
      'NAT tracking — outbound sessions carry source NAT details through session lifecycle',
      'Zone-aware routing — trust/untrust/dmz zones with correct interface mappings per direction',
      'Direction-specific behavior — denied/dropped traffic predominantly inbound; allowed mostly outbound',
      '15 IDS/IPS signatures across SQL injection, brute force, C2, exploits',
      'Session end reasons — tcp-fin (50%), aged-out (20%), tcp-rst (25%), policy-deny (5%)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'fw-01',
        description: 'Firewall hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain for FQDN',
      },
      {
        name: 'serial_number',
        defaultValue: 'FW00A1B2C3D4',
        description: 'Firewall serial number',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'Public NAT IP',
      },
      {
        name: 'agent_id',
        defaultValue: 'e4f8c1a2-...',
        description: 'Filebeat agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Traffic Allowed',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "event": {
        "action": "allow",
        "category": ["network"],
        "dataset": "firewall.traffic",
        "outcome": "success",
        "type": ["connection", "allowed"]
    },
    "source": { "ip": "10.1.1.30", "port": 52341 },
    "destination": { "ip": "142.250.80.46", "port": 443 },
    "network": {
        "application": "ssl",
        "direction": "outbound",
        "transport": "tcp"
    },
    "observer": { "hostname": "fw-01", "type": "firewall", "vendor": "Generic" },
    "rule": { "name": "Allow-HTTPS-Out" }
}`,
      },
    ],
  };
