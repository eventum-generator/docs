import type { GeneratorMeta } from '@/lib/hub-types';

export const networkNetflow: GeneratorMeta = {
    slug: 'network-netflow',
    displayName: 'NetFlow / IPFIX',
    category: 'network',
    description:
      'NetFlow v9 / IPFIX biflow records — network telemetry as exported by routers, switches, and firewalls. TCP, UDP, and ICMP flows with byte/packet counters, AS numbers, and interface indexes.',
    format: ['JSON', 'ECS'],
    dataSource: 'NetFlow v9 / IPFIX',
    eventCount: 3,
    templateCount: 3,
    highlights: [
      'IPFIX biflow records',
      'TCP flag simulation',
      'BGP AS numbers',
      'VLAN tagging',
    ],
    generatorId: 'netflow',
    eventTypes: [
      {
        id: 'tcp-flow',
        description: 'TCP flows (HTTPS, HTTP, SSH, RDP, SMB, LDAP)',
        frequency: '~71%',
        category: 'network',
      },
      {
        id: 'udp-flow',
        description: 'UDP flows (DNS, NTP, SNMP, syslog)',
        frequency: '~27%',
        category: 'network',
      },
      {
        id: 'icmp-flow',
        description: 'ICMP flows (echo, unreachable, time exceeded)',
        frequency: '~2%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Protocol-realistic traffic profiles — each service has appropriate byte ranges, packet counts, and flow durations',
      'TCP flag simulation — cumulative bitmasks for completed (70%), active (15%), refused (10%), half-open (5%) flows',
      'Direction-aware routing — outbound (60%), inbound (25%), internal (15%)',
      'BGP AS numbers from 13 major cloud/CDN providers (Google, Cloudflare, AWS, Microsoft, Meta)',
      'Response ratio modeling — each service defines initiator-to-responder byte ratios',
      'VLAN tagging — workstations (VLAN 10), servers (VLAN 20), DMZ (VLAN 30)',
    ],
    parameters: [
      {
        name: 'exporter_ip',
        defaultValue: '10.0.0.1',
        description: 'NetFlow/IPFIX exporter IP',
      },
      {
        name: 'exporter_port',
        defaultValue: '2055',
        description: 'Exporter UDP port',
      },
      {
        name: 'source_id',
        defaultValue: '512',
        description: 'IPFIX Observation Domain ID',
      },
      {
        name: 'collector_name',
        defaultValue: 'netflow-collector',
        description: 'Filebeat collector hostname',
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
        title: 'TCP Flow (HTTPS)',
        json: `{
    "@timestamp": "2026-02-21T12:00:05.000000+00:00",
    "event": {
        "action": "netflow_flow",
        "category": ["network", "session"],
        "dataset": "netflow.log",
        "kind": "event"
    },
    "source": { "ip": "10.1.1.30", "port": 52341, "locality": "internal" },
    "destination": { "ip": "203.0.113.50", "port": 443, "locality": "external" },
    "network": {
        "bytes": 397540,
        "direction": "outbound",
        "transport": "tcp"
    },
    "netflow": {
        "bgp_destination_as_number": 13335,
        "tcp_control_bits": 27,
        "vlan_id": 10
    }
}`,
      },
    ],
  };
