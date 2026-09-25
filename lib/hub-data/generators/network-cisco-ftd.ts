/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoFtd: GeneratorMeta = {
  slug: 'network-cisco-ftd',
  displayName: 'Cisco Firepower Threat Defense',
  category: 'network',
  description:
    'FTD connection and intrusion syslog with a correlated IPS-drop chain.',
  dataSource: 'Cisco FTD security-event syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'network-cisco-ftd',
  highlights: [
    'FTD IDs 430001, 430002 and 430003',
    'Connection-linked IPS drops',
    'Native syslog in event.original',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One allowed connection produces two IPS dropped-packet alerts with distinct SIDs, then an end event; all share the FTD connection identifiers.',
  eventTypes: [
    {
      id: '430002',
      description: 'Connection start',
      frequency: '1 per ordinary flow; 1 per chain',
      category: 'network',
    },
    {
      id: '430003',
      description: 'Connection end',
      frequency: '1 per ordinary flow; 1 per chain',
      category: 'network',
    },
    {
      id: '430001',
      description: 'Intrusion with packet dropped',
      frequency: '2 per chain',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'DeviceUUID, InstanceID, FirstPacketSecond and ConnectionID link a connection to IPS events.',
    'The normal stream pairs starts and ends; attack traffic uses the same FTD device.',
    'The source is modeled as FTD 6.5+ security-event syslog.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'ftd-edge-01.corp.example',
      description: 'Syslog sender and ECS host',
    },
    {
      name: 'device_uuid',
      defaultValue: '9d1a0010-2a2b-4c4d-8e8f-010203040506',
      description: 'FTD device identifier',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Ordinary flows between chains',
    },
    {
      name: 'attack_source_ip',
      defaultValue: '10.40.9.77',
      description: 'Stable chain source',
    },
    {
      name: 'attack_destination_ip',
      defaultValue: '10.40.20.15',
      description: 'Stable chain target',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:35:48+00:00",
  "cisco": {
    "ftd": {
      "message_id": "430002",
      "security_event": {
        "access_control_rule_name": "Allow to DMZ",
        "connection_id": 1251,
        "device_uuid": "9d1a0010-2a2b-4c4d-8e8f-010203040506",
        "dst_ip": "10.40.20.15",
        "dst_port": 443,
        "first_packet_second": "2026-09-25T13:35:48Z",
        "instance_id": 2,
        "protocol": "tcp",
        "src_ip": "10.40.9.77",
        "src_port": 44986
      }
    }
  },
  "destination": {
    "ip": "10.40.20.15",
    "port": 443
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "connection-start",
    "category": [
      "network"
    ],
    "code": "430002",
    "dataset": "cisco_ftd.log",
    "kind": "event",
    "original": "Sep 25 13:35:48 ftd-edge-01.corp.example %FTD-6-430002: EventPriority: Low, DeviceUUID: 9d1a0010-2a2b-4c4d-8e8f-010203040506, InstanceID: 2, FirstPacketSecond: 2026-09-25T13:35:48Z, ConnectionID: 1251, SrcIP: 10.40.9.77, DstIP: 10.40.20.15, SrcPort: 44986, DstPort: 443, Protocol: tcp, IngressInterface: inside, EgressInterface: dmz, IngressZone: Inside, EgressZone: DMZ, ACPolicy: Corporate Access Policy, AccessControlRuleName: Allow to DMZ, Client: SSL client, ApplicationProtocol: HTTPS, AccessControlRuleAction: Allow, InitiatorPackets: 1, ResponderPackets: 0, InitiatorBytes: 74, ResponderBytes: 0, NAPPolicy: Balanced Security and Connectivity",
    "type": [
      "start"
    ]
  },
  "host": {
    "name": "ftd-edge-01.corp.example"
  },
  "network": {
    "transport": "tcp"
  },
  "related": {
    "ip": [
      "10.40.9.77",
      "10.40.20.15"
    ]
  },
  "source": {
    "ip": "10.40.9.77",
    "port": 44986
  }
}`,
    },
  ],
};
