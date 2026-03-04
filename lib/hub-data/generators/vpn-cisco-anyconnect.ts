import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnCiscoAnyconnect: GeneratorMeta = {
    slug: 'vpn-cisco-anyconnect',
    displayName: 'Cisco AnyConnect VPN',
    category: 'web-access',
    description:
      'Cisco ASA AnyConnect SSL VPN — session lifecycle from RADIUS authentication through tunnel establishment, IP assignment, DAP policy evaluation, session roaming between gateways, to graceful disconnection.',
    format: ['JSON', 'ECS'],
    dataSource: 'Cisco ASA VPN Syslog',
    eventCount: 11,
    templateCount: 11,
    highlights: [
      'Full session lifecycle',
      'Session roaming',
      'Client platform diversity',
      'DAP evaluation',
    ],
    generatorId: 'vpn',
    eventTypes: [
      {
        id: '722022',
        description: 'SVC Tunnel Established',
        frequency: '~20.1%',
        category: 'network',
      },
      {
        id: '722023',
        description: 'SVC Tunnel Terminated',
        frequency: '~19%',
        category: 'network',
      },
      {
        id: '113039',
        description: 'AnyConnect Session Started',
        frequency: '~11.2%',
        category: 'network',
      },
      {
        id: '722051',
        description: 'IPv4 Address Assigned',
        frequency: '~11.2%',
        category: 'network',
      },
      {
        id: '734001',
        description: 'DAP Records Selected',
        frequency: '~11.2%',
        category: 'authentication',
      },
      {
        id: '113004',
        description: 'AAA Auth Successful',
        frequency: '~11.2%',
        category: 'authentication',
      },
      {
        id: '113019',
        description: 'Session Disconnected with Stats',
        frequency: '~6.7%',
        category: 'network',
      },
      {
        id: '716002',
        description: 'WebVPN Session Terminated',
        frequency: '~5.6%',
        category: 'network',
      },
      {
        id: '716058',
        description: 'Session Lost Connection',
        frequency: '~1.7%',
        category: 'network',
      },
      {
        id: '716059',
        description: 'Session Resumed from New IP',
        frequency: '~1.3%',
        category: 'network',
      },
      {
        id: '113005',
        description: 'AAA Auth Rejected',
        frequency: '~0.9%',
        category: 'authentication',
      },
    ],
    realismFeatures: [
      'Correlated VPN sessions — session start (113039) produces context consumed by disconnect (113019)',
      'Correlated tunnels — established (722022) and terminated (722023) share protocol and user',
      'Session roaming — lost sessions (716058) correlated with resume (716059), 40% IP change',
      'Disconnect reasons — User Requested (45%), Idle Timeout (25%), Max Time Exceeded (8%)',
      '12 Cisco Secure Client versions across Windows, macOS, and Linux',
      'Multiple tunnel groups and group policies — CorpVPN, EMPLOYEE_VPN, CONTRACTOR_VPN',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'ASA-FW-01',
        description: 'ASA device hostname',
      },
      {
        name: 'domain',
        defaultValue: 'corp.example.com',
        description: 'Domain for FQDN',
      },
      {
        name: 'vpn_pool_network',
        defaultValue: '10.10.10',
        description: 'VPN IP pool /24 prefix',
      },
      {
        name: 'asa_ip',
        defaultValue: '203.0.113.1',
        description: 'ASA outside IP address',
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
        title: 'AnyConnect Session Started (113039)',
        json: `{
    "@timestamp": "2026-02-21T14:32:18.000000+00:00",
    "event": {
        "action": "client-vpn-connected",
        "category": ["network", "session"],
        "code": "113039",
        "dataset": "cisco_asa.log",
        "outcome": "success"
    },
    "source": {
        "ip": "198.51.100.42",
        "user": { "group": { "name": "GP_AnyConnect" }, "name": "jsmith" }
    },
    "observer": {
        "hostname": "ASA-FW-01",
        "product": "asa",
        "type": "firewall",
        "vendor": "Cisco"
    }
}`,
      },
    ],
  };
