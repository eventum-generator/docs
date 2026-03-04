import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCheckpoint: GeneratorMeta = {
    slug: 'network-checkpoint',
    displayName: 'Check Point Security Gateway',
    category: 'network',
    description:
      'Check Point Security Gateway SmartLog — 8 software blades including Firewall, IPS, Application Control, URL Filtering, Anti-Bot, Anti-Virus, Threat Emulation, and Identity Awareness.',
    format: ['JSON', 'ECS'],
    dataSource: 'Check Point SmartLog',
    eventCount: 11,
    templateCount: 11,
    highlights: [
      '8 software blades',
      'Zone-aware routing',
      'IPS with CVE references',
      'Identity Awareness',
    ],
    generatorId: 'checkpoint-gw',
    eventTypes: [
      {
        id: 'fw-accept',
        description: 'Firewall Accept',
        frequency: '~55%',
        category: 'network',
      },
      {
        id: 'fw-drop',
        description: 'Firewall Drop',
        frequency: '~20%',
        category: 'network',
      },
      {
        id: 'app-control',
        description: 'Application Control',
        frequency: '~6%',
        category: 'network',
      },
      {
        id: 'url-filter',
        description: 'URL Filtering',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'fw-reject',
        description: 'Firewall Reject',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'ips-detect',
        description: 'IPS Detect',
        frequency: '~3%',
        category: 'intrusion_detection',
      },
      {
        id: 'vpn',
        description: 'VPN Encrypt/Decrypt',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'ips-prevent',
        description: 'IPS Prevent',
        frequency: '~1.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'anti-bot',
        description: 'Anti-Bot detection',
        frequency: '~1.5%',
        category: 'malware',
      },
      {
        id: 'anti-virus',
        description: 'Anti-Virus detection',
        frequency: '~1%',
        category: 'malware',
      },
      {
        id: 'identity',
        description: 'Identity Awareness login/logout',
        frequency: '~1%',
        category: 'authentication',
      },
    ],
    realismFeatures: [
      'Zone-aware routing — Internal→External, External→DMZ, Internal→Internal with interface assignment',
      'NAT translation — Source NAT for 70% of outbound accepted connections',
      '15 named firewall rules with UUIDs, layer hierarchy, and weighted selection',
      '15 IPS signatures with CVE references, severity, and confidence levels',
      '16 applications with risk scores (0–5) and risk-based allow/block decisions',
      '15 URL categories including blocked (gambling, malware, phishing)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'cpgw-01',
        description: 'Security Gateway hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain name',
      },
      {
        name: 'gateway_ip',
        defaultValue: '192.168.10.1',
        description: 'Gateway management IP',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'Public NAT IP address',
      },
      {
        name: 'agent_id',
        defaultValue: '7b2c5f1a-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Firewall Accept Event',
        json: `{
    "@timestamp": "2026-02-21T14:30:15.000000+00:00",
    "checkpoint": {
        "rule_action": "Accept",
        "layer_name": "Network",
        "sequencenum": 42
    },
    "event": {
        "action": "Accept",
        "category": ["network"],
        "dataset": "checkpoint.firewall",
        "outcome": "success",
        "type": ["allowed", "connection"]
    },
    "source": { "ip": "10.1.1.30", "port": 52481 },
    "destination": { "ip": "93.184.216.34", "port": 443 },
    "network": { "direction": "outbound", "transport": "tcp" },
    "observer": {
        "product": "VPN-1 & FireWall-1",
        "type": "firewall",
        "vendor": "Checkpoint"
    },
    "rule": { "name": "Allow Outbound HTTPS" }
}`,
      },
    ],
  };
