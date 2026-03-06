import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPaloaltoTraffic: GeneratorMeta = {
  slug: 'network-paloalto-traffic',
  displayName: 'Palo Alto Traffic',
  category: 'network',
  description:
    'Palo Alto PAN-OS Traffic logs — network session lifecycle with start/end/drop/deny subtypes, zone-aware flow profiles (trust, untrust, DMZ), source NAT translation, 30 App-ID applications, and byte/packet counters with lognormal distributions.',
  format: ['JSON', 'ECS'],
  dataSource: 'PAN-OS Traffic Log',
  eventCount: 30,
  templateCount: 4,
  highlights: [
    '4 zone flow profiles',
    '30 App-ID applications',
    'Lognormal byte distributions',
    'Protocol-aware end reasons',
  ],
  generatorId: 'panw-traffic',
  eventTypes: [
    {
      id: 'end',
      description: 'Session ended — normal traffic termination',
      frequency: '~72%',
      category: 'network',
    },
    {
      id: 'start',
      description: 'Session started',
      frequency: '~14%',
      category: 'network',
    },
    {
      id: 'drop',
      description: 'Dropped before App-ID identification',
      frequency: '~7%',
      category: 'network',
    },
    {
      id: 'deny',
      description: 'Denied after App-ID identification',
      frequency: '~7%',
      category: 'network',
    },
  ],
  realismFeatures: [
    '4 zone flow profiles — outbound (trust→untrust 70%), inbound DMZ (15%), internal (10%), DMZ-to-internal (5%)',
    '30 PAN-OS App-IDs with weighted selection (ssl, web-browsing, dns, ms-office365, ssh, etc.)',
    'Lognormal byte/packet distributions — realistic right-skewed traffic volumes',
    'Protocol-aware session end reasons — TCP uses tcp-fin/aged-out/tcp-rst; UDP/ICMP always aged-out',
    'Source NAT translation only on outbound (trust→untrust) flows',
    'Zone-matched security rules — allow rules for permitted traffic, deny rules for blocked traffic',
  ],
  parameters: [
    {
      name: 'hostname',
      defaultValue: 'PA-3260',
      description: 'PAN-OS firewall hostname',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Active Directory domain',
    },
    {
      name: 'serial_number',
      defaultValue: '012801096514',
      description: 'Firewall serial number',
    },
    {
      name: 'nat_ip',
      defaultValue: '198.51.100.1',
      description: 'Source NAT IP',
    },
    {
      name: 'agent_id',
      defaultValue: 'f7a3b1c2-...',
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
      title: 'Traffic End (Session Terminated)',
      json: `{
    "@timestamp": "2026-03-06T14:30:15.123456+00:00",
    "event": {
        "action": "flow_terminated",
        "category": ["network"],
        "dataset": "panw.panos",
        "duration": 45000000000,
        "kind": "event",
        "outcome": "success",
        "type": ["connection", "end", "allowed"]
    },
    "source": { "ip": "10.1.1.14", "bytes": 2847, "port": 52340 },
    "destination": { "ip": "203.0.113.42", "bytes": 148502, "port": 443 },
    "network": {
        "application": "ssl",
        "bytes": 151349,
        "transport": "tcp",
        "direction": "outbound"
    },
    "panw": {
        "panos": {
            "action": "allow",
            "sub_type": "end",
            "type": "TRAFFIC",
            "session_end_reason": "tcp-fin"
        }
    },
    "observer": { "product": "PAN-OS", "vendor": "Palo Alto Networks" }
}`,
    },
  ],
};
