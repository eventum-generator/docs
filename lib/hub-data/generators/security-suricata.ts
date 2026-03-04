import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySuricata: GeneratorMeta = {
    slug: 'security-suricata',
    displayName: 'Suricata IDS/IPS',
    category: 'security',
    description:
      'Suricata EVE JSON output — IDS alerts with ET Open signatures, DNS/HTTP/TLS/SSH protocol logs, NetFlow records, and anomaly detections with correlated flow IDs and MITRE ATT&CK mapping.',
    format: ['JSON', 'ECS'],
    dataSource: 'Suricata EVE JSON',
    eventCount: 13,
    templateCount: 13,
    highlights: [
      'Correlated flow_id',
      'ET Open rule signatures',
      'JA3/JA3S fingerprints',
      'MITRE ATT&CK mapping',
    ],
    generatorId: 'suricata-01',
    eventTypes: [
      {
        id: 'flow-tcp',
        description: 'Flow (TCP)',
        frequency: '28.7%',
        category: 'network',
      },
      {
        id: 'flow-udp',
        description: 'Flow (UDP)',
        frequency: '17.2%',
        category: 'network',
      },
      {
        id: 'dns-query',
        description: 'DNS Query',
        frequency: '14.3%',
        category: 'network',
      },
      {
        id: 'dns-answer',
        description: 'DNS Answer',
        frequency: '14.3%',
        category: 'network',
      },
      {
        id: 'http',
        description: 'HTTP',
        frequency: '10.0%',
        category: 'network, web',
      },
      { id: 'tls', description: 'TLS', frequency: '7.2%', category: 'network' },
      {
        id: 'fileinfo',
        description: 'File Info',
        frequency: '2.2%',
        category: 'network',
      },
      { id: 'ssh', description: 'SSH', frequency: '1.4%', category: 'network' },
      {
        id: 'alert-policy',
        description: 'Alert (Policy)',
        frequency: '1.4%',
        category: 'intrusion_detection',
      },
      {
        id: 'anomaly',
        description: 'Anomaly',
        frequency: '1.1%',
        category: 'network',
      },
      {
        id: 'alert-threat',
        description: 'Alert (Threat)',
        frequency: '0.7%',
        category: 'intrusion_detection',
      },
      {
        id: 'smtp',
        description: 'SMTP',
        frequency: '0.7%',
        category: 'network',
      },
      {
        id: 'dhcp',
        description: 'DHCP',
        frequency: '0.7%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Weighted event distribution matching production Suricata deployments',
      'Correlated flow_id — protocol events push connection metadata; flow events pop correlated records',
      'DNS query/answer pairing — queries push to shared pool, answers pop correlated responses',
      'ET Open rule signatures with real SIDs, categories, severity levels, and MITRE ATT&CK metadata',
      'JA3/JA3S TLS fingerprints from real certificate data for major websites',
      'Deterministic community_id computed from connection tuple for cross-event correlation',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'suricata-sensor-01',
        description: 'Suricata sensor hostname',
      },
      {
        name: 'interface',
        defaultValue: 'eth0',
        description: 'Network interface name',
      },
      {
        name: 'internal_subnet',
        defaultValue: '192.168.1',
        description: 'Internal network prefix',
      },
      {
        name: 'dns_server_ip',
        defaultValue: '192.168.1.1',
        description: 'DNS server IP address',
      },
      {
        name: 'agent_id',
        defaultValue: '7b2c5f18-...',
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
        title: 'DNS Query Event',
        json: `{
    "@timestamp": "2026-02-21T14:30:22.123456Z",
    "dns": {
        "id": "45321",
        "question": { "name": "www.google.com", "type": "A" },
        "type": "query"
    },
    "event": {
        "category": ["network"],
        "dataset": "suricata.eve",
        "kind": "event",
        "module": "suricata"
    },
    "network": {
        "community_id": "1:fmTf/MbjDMinU9coqCwDUc82LmA=",
        "protocol": "dns",
        "transport": "udp"
    },
    "observer": {
        "hostname": "suricata-sensor-01",
        "product": "Suricata",
        "type": "ids"
    }
}`,
      },
    ],
  };
