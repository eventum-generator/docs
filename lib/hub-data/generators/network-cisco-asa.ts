import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoAsa: GeneratorMeta = {
    slug: 'network-cisco-asa',
    displayName: 'Cisco ASA Firewall',
    category: 'network',
    description:
      'Cisco ASA adaptive security appliance syslog — TCP/UDP/ICMP connection lifecycle, ACL permit/deny decisions, NAT translations, VPN tunnel events, and failover status messages.',
    format: ['JSON', 'ECS'],
    dataSource: 'Cisco ASA Syslog',
    eventCount: 14,
    templateCount: 14,
    highlights: [
      'Correlated connections',
      'NAT translation tracking',
      'VPN session lifecycle',
      'ASA syslog format',
    ],
    generatorId: 'asa',
    eventTypes: [
      {
        id: '302013',
        description: 'TCP Built',
        frequency: '~25%',
        category: 'connection',
      },
      {
        id: '302014',
        description: 'TCP Teardown',
        frequency: '~24%',
        category: 'connection',
      },
      {
        id: '302015',
        description: 'UDP Built',
        frequency: '~8%',
        category: 'connection',
      },
      {
        id: '302016',
        description: 'UDP Teardown',
        frequency: '~8%',
        category: 'connection',
      },
      {
        id: '302020',
        description: 'ICMP Built',
        frequency: '~2%',
        category: 'connection',
      },
      {
        id: '302021',
        description: 'ICMP Teardown',
        frequency: '~2%',
        category: 'connection',
      },
      {
        id: '106100',
        description: 'ACL Hit',
        frequency: '~13%',
        category: 'firewall',
      },
      {
        id: '106023',
        description: 'ACL Deny',
        frequency: '~7%',
        category: 'firewall',
      },
      {
        id: '305011',
        description: 'NAT Built',
        frequency: '~3%',
        category: 'nat',
      },
      {
        id: '305012',
        description: 'NAT Teardown',
        frequency: '~3%',
        category: 'nat',
      },
      {
        id: '113xxx',
        description: 'Authentication',
        frequency: '~3%',
        category: 'auth',
      },
      { id: '722xxx', description: 'VPN', frequency: '~3%', category: 'vpn' },
      { id: '725xxx', description: 'SSL', frequency: '~2%', category: 'ssl' },
      {
        id: '199xxx',
        description: 'System',
        frequency: '~1%',
        category: 'system',
      },
    ],
    realismFeatures: [
      'Correlated connection pairs — built events push to shared state; teardown events consume with matching connection IDs',
      'NAT correlation — NAT built/teardown events use shared state for consistent address mapping',
      'VPN session tracking — connect events store sessions consumed by disconnect events',
      'ASA-specific message format — event.original contains the full syslog line matching real ASA output',
      'TCP teardown reasons — weighted distribution of FINs (50%), Reset-I (15%), Reset-O (10%), Idle Timeout (20%)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'ASA-FW-01',
        description: 'ASA device hostname',
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
        defaultValue: 'a3b7e2c1-...',
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
        title: 'TCP Connection Built (302013)',
        json: `{
    "@timestamp": "2026-02-21T14:30:15.000000+00:00",
    "cisco": {
        "asa": {
            "connection_id": "100042",
            "destination_interface": "outside",
            "message_id": "302013",
            "source_interface": "inside"
        }
    },
    "event": {
        "action": "flow-creation",
        "category": ["network"],
        "code": "302013",
        "original": "%ASA-6-302013: Built outbound TCP connection 100042 for inside:10.1.1.30/52847 to outside:93.184.216.34/443",
        "outcome": "success"
    },
    "network": {
        "direction": "outbound",
        "transport": "tcp"
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
