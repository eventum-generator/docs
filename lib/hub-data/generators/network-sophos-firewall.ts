/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSophosFirewall: GeneratorMeta = {
  slug: 'network-sophos-firewall',
  displayName: 'Sophos Firewall SFOS 20',
  category: 'network',
  description:
    'SFOS 20 Firewall Rule allow and deny syslog with correlated multi-port probing.',
  dataSource: 'Sophos Firewall SFOS 20 Device Standard Format',
  format: ['Syslog', 'KV', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  generatorId: 'network-sophos-firewall',
  highlights: [
    'Vendor-documented Firewall Rule IDs',
    '55 native fields in event.original and sophos.firewall',
    'Denied SSH, SMB and RDP followed by allowed HTTPS',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client is denied on ports 22, 445 and 3389, then allowed on 443 to the same destination.',
  eventTypes: [
    {
      id: '010101600001',
      description: 'Firewall Rule Allowed',
      frequency: 'About 82% of routine events',
      category: 'network',
    },
    {
      id: '010102600002',
      description: 'Firewall Rule Denied',
      frequency: 'About 18% of routine events',
      category: 'network',
    },
  ],
  realismFeatures: [
    'SFOS 20 legacy device-standard key-value fields',
    'Rule IDs, ports, addresses and decision are internally consistent',
    'Stable source and destination link the four anomaly steps',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'sophos-fw-01.example.test',
      description: 'Firewall hostname',
    },
    {
      name: 'device_id',
      defaultValue: 'SFV-EXAMPLE-001',
      description: 'Synthetic device ID',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'probe_source_ip',
      defaultValue: '10.40.9.77',
      description: 'Stable chain source',
    },
    {
      name: 'probe_destination_ip',
      defaultValue: '10.40.20.15',
      description: 'Stable chain destination',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated denied probe',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:49:45+00:00",
  "destination": {
    "ip": "10.40.20.15",
    "port": 22
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "firewall-deny",
    "category": [
      "network"
    ],
    "code": "010102600002",
    "dataset": "sophos_firewall.log",
    "kind": "event",
    "original": "device=\"SFW\" date=2026-09-25 time=13:49:45 timezone=\"UTC\" device_name=\"sophos-fw-01.example.test\" device_id=SFV-EXAMPLE-001 log_id=010102600002 log_type=\"Firewall\" log_component=\"Firewall Rule\" log_subtype=\"Denied\" status=\"Deny\" priority=Information duration=0 fw_rule_id=0 policy_type=1 user_name=\"\" user_gp=\"\" iap=0 ips_policy_id=0 appfilter_policy_id=0 in_interface=\"Port2\" out_interface=\"Port1\" src_ip=10.40.9.77 dst_ip=10.40.20.15 protocol=\"TCP\" src_port=55667 dst_port=22 sent_pkts=0 recv_pkts=0 sent_bytes=0 recv_bytes=0 srczonetype=\"LAN\" srczone=\"LAN\" dstzonetype=\"LAN\" dstzone=\"LAN\" connid=\"\" hb_health=\"No Heartbeat\" message=\"\" appresolvedby=\"Signature\" app_is_cloud=0 log_occurrence=1 src_mac=02:40:01:00:00:4d dst_mac=02:40:20:00:00:0f src_country_code=R1 dst_country_code=R1 application=\"\" application_risk=0 application_technology=\"\" application_category=\"\" tran_src_ip= tran_src_port=0 tran_dst_ip= tran_dst_port=0 dir_disp=\"\" vconnid=\"\"",
    "type": [
      "denied"
    ]
  },
  "host": {
    "id": "SFV-EXAMPLE-001",
    "name": "sophos-fw-01.example.test"
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
  "sophos": {
    "firewall": {
      "app_is_cloud": 0,
      "appfilter_policy_id": 0,
      "application": "",
      "application_category": "",
      "application_risk": 0,
      "application_technology": "",
      "appresolvedby": "Signature",
      "connid": "",
      "date": "2026-09-25",
      "device": "SFW",
      "device_id": "SFV-EXAMPLE-001",
      "device_name": "sophos-fw-01.example.test",
      "dir_disp": "",
      "dst_country_code": "R1",
      "dst_ip": "10.40.20.15",
      "dst_mac": "02:40:20:00:00:0f",
      "dst_port": 22,
      "dstzone": "LAN",
      "dstzonetype": "LAN",
      "duration": 0,
      "fw_rule_id": 0,
      "hb_health": "No Heartbeat",
      "iap": 0,
      "in_interface": "Port2",
      "ips_policy_id": 0,
      "log_component": "Firewall Rule",
      "log_id": "010102600002",
      "log_occurrence": 1,
      "log_subtype": "Denied",
      "log_type": "Firewall",
      "message": "",
      "out_interface": "Port1",
      "policy_type": 1,
      "priority": "Information",
      "protocol": "TCP",
      "recv_bytes": 0,
      "recv_pkts": 0,
      "sent_bytes": 0,
      "sent_pkts": 0,
      "src_country_code": "R1",
      "src_ip": "10.40.9.77",
      "src_mac": "02:40:01:00:00:4d",
      "src_port": 55667,
      "srczone": "LAN",
      "srczonetype": "LAN",
      "status": "Deny",
      "time": "13:49:45",
      "timezone": "UTC",
      "tran_dst_ip": "",
      "tran_dst_port": 0,
      "tran_src_ip": "",
      "tran_src_port": 0,
      "user_gp": "",
      "user_name": "",
      "vconnid": ""
    }
  },
  "source": {
    "ip": "10.40.9.77",
    "port": 55667
  }
}`,
    },
  ],
};
