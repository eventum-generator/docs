import type { GeneratorMeta } from '@/lib/hub-types';

export const networkUsergate: GeneratorMeta = {
    slug: 'network-usergate',
    displayName: 'UserGate NGFW',
    category: 'network',
    description:
      'UserGate next-generation firewall and UTM appliance logs — traffic accept/deny decisions, web content filtering, DNS queries, IDS/IPS alerts, user authentication, VPN sessions, and system operational events.',
    format: ['JSON', 'ECS'],
    dataSource: 'UserGate NGFW Syslog',
    eventCount: 8,
    templateCount: 8,
    highlights: [
      'Full UTM coverage',
      'IDS/IPS alert detection',
      'Web content filtering',
      'VPN session tracking',
    ],
    generatorId: 'usergate',
    eventTypes: [
      {
        id: 'traffic-accept',
        description: 'Traffic Accept (allowed connections)',
        frequency: '~49%',
        category: 'network',
      },
      {
        id: 'traffic-deny',
        description: 'Traffic Deny (blocked connections)',
        frequency: '~16%',
        category: 'network',
      },
      {
        id: 'web-filter',
        description: 'Web Content Filter',
        frequency: '~7%',
        category: 'network',
      },
      {
        id: 'dns',
        description: 'DNS Query Logging',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'system-event',
        description: 'System Operational Events',
        frequency: '~5%',
        category: 'host',
      },
      {
        id: 'idps-alert',
        description: 'IDS/IPS Alert Detection',
        frequency: '~4%',
        category: 'intrusion_detection',
      },
      {
        id: 'auth',
        description: 'User Authentication',
        frequency: '~4%',
        category: 'authentication',
      },
      {
        id: 'vpn',
        description: 'VPN Session Events',
        frequency: '~3%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Weighted event distributions matching production UserGate log volumes (traffic ~65%, UTM ~16%, system/auth/vpn ~12%)',
      'UserGate-specific fields — rule_id, zone pairs (Trusted/Untrusted/DMZ), content filtering categories',
      'Zone-aware routing with UserGate interface naming conventions',
      'IDS/IPS alerts with signature IDs and severity levels matching real threat classifications',
      'Web content filter categories aligned with UserGate URL filtering engine',
      'VPN session lifecycle — tunnel establishment and teardown with user identity correlation',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'ug-fw-01',
        description: 'UserGate device hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain name',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'Public NAT IP for outbound connections',
      },
      {
        name: 'agent_id',
        defaultValue: 'b5c8d3e2-...',
        description: 'Elastic Agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Traffic Accept',
        json: `{
    "@timestamp": "2026-03-07T11:24:18.000000+00:00",
    "event": {
        "action": "accept",
        "category": ["network"],
        "dataset": "usergate.log",
        "outcome": "success",
        "type": ["connection", "allowed"]
    },
    "source": { "ip": "10.1.1.25", "port": 51843 },
    "destination": { "ip": "93.184.216.34", "port": 443 },
    "network": {
        "direction": "outbound",
        "transport": "tcp"
    },
    "observer": {
        "hostname": "ug-fw-01",
        "product": "NGFW",
        "type": "firewall",
        "vendor": "UserGate"
    },
    "rule": { "id": "12", "name": "Allow-Internet" },
    "usergate": {
        "zone_src": "Trusted",
        "zone_dst": "Untrusted"
    }
}`,
      },
    ],
  };
