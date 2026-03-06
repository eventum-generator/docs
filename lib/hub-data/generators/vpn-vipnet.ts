import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnVipnet: GeneratorMeta = {
  slug: 'vpn-vipnet',
  displayName: 'ViPNet Coordinator',
  category: 'web-access',
  description:
    'ViPNet Coordinator VPN gateway events from InfoTeCS — a Russian cryptographic platform for secure network communication using GOST encryption. Covers IPsec tunnel lifecycle, authentication, firewall decisions, packet encryption/decryption, configuration changes, keepalives, and time synchronization errors.',
  format: ['JSON', 'ECS'],
  dataSource: 'ViPNet Coordinator Syslog',
  eventCount: 11,
  templateCount: 11,
  highlights: [
    'IPsec tunnel lifecycle',
    'GOST encryption events',
    'Firewall allow/block decisions',
    'Configuration audit trail',
  ],
  generatorId: 'vpn-vipnet',
  eventTypes: [
    {
      id: 'tunnel-established',
      description: 'IPsec tunnel successfully established with peer',
      frequency: '~12.0%',
      category: 'network',
    },
    {
      id: 'tunnel-destroyed',
      description: 'IPsec tunnel torn down with peer',
      frequency: '~8.0%',
      category: 'network',
    },
    {
      id: 'auth-success',
      description: 'Successful administrator or peer authentication',
      frequency: '~10.0%',
      category: 'authentication',
    },
    {
      id: 'auth-failure',
      description: 'Failed authentication attempt with reason',
      frequency: '~3.0%',
      category: 'authentication',
    },
    {
      id: 'firewall-allowed',
      description: 'Firewall rule permitted traffic through the gateway',
      frequency: '~20.0%',
      category: 'network',
    },
    {
      id: 'firewall-blocked',
      description: 'Firewall rule denied traffic through the gateway',
      frequency: '~8.0%',
      category: 'network',
    },
    {
      id: 'packet-encrypted',
      description: 'Packet encrypted with GOST algorithm before transmission',
      frequency: '~15.0%',
      category: 'network',
    },
    {
      id: 'packet-unencrypted',
      description: 'Received packet decrypted with GOST algorithm',
      frequency: '~15.0%',
      category: 'network',
    },
    {
      id: 'config-changed',
      description: 'Configuration modification by administrator',
      frequency: '~3.0%',
      category: 'configuration',
    },
    {
      id: 'keepalive',
      description: 'Tunnel keepalive probe sent or received',
      frequency: '~4.0%',
      category: 'network',
    },
    {
      id: 'time-sync-error',
      description: 'NTP time synchronization failure detected',
      frequency: '~2.0%',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Correlated tunnel sessions — establish events produce tunnel context consumed by destroy with matching peer/tunnel ID',
    'GOST encryption suite selection — GOST R 34.12-2015 (Magma/Kuznyechik) with realistic cipher negotiation',
    'Authentication failure scenarios — expired certificates, wrong credentials, revoked keys',
    'Firewall rule distribution — allow/block ratio with realistic protocol and port distributions',
    'Configuration change audit — parameter names, old/new values, administrator identity',
    'Time sync errors with realistic NTP server addresses and drift values',
  ],
  parameters: [
    {
      name: 'hostname',
      defaultValue: 'vipnet-gw-01',
      description: 'ViPNet Coordinator hostname',
    },
    {
      name: 'domain',
      defaultValue: 'corp.example.com',
      description: 'Corporate domain name',
    },
    {
      name: 'gateway_ip',
      defaultValue: '10.1.1.1',
      description: 'Gateway management IP address',
    },
    {
      name: 'agent_id',
      defaultValue: 'a1b2c3d4-...',
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
      title: 'TUNNEL ESTABLISHED',
      json: `{
  "@timestamp": "2026-03-07T09:32:15.000000+00:00",
  "event": {
    "action": "tunnel-established",
    "category": ["network"],
    "dataset": "vipnet.log",
    "kind": "event",
    "module": "vipnet",
    "outcome": "success",
    "type": ["connection", "start"]
  },
  "vipnet": {
    "tunnel_id": "TUN-00048271",
    "peer_id": "0x1A2B3C4D",
    "cipher_suite": "GOST R 34.12-2015 Kuznyechik",
    "hostname": "vipnet-gw-01"
  },
  "source": { "ip": "10.1.1.1", "port": 55777 },
  "destination": { "ip": "10.2.1.1", "port": 55777 },
  "observer": {
    "product": "ViPNet Coordinator",
    "type": "vpn",
    "vendor": "InfoTeCS"
  },
  "network": { "transport": "udp", "protocol": "ipsec" }
}`,
    },
  ],
};
