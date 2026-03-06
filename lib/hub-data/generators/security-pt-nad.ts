import type { GeneratorMeta } from '@/lib/hub-types';

export const securityPtNad: GeneratorMeta = {
  slug: 'security-pt-nad',
  displayName: 'PT Network Attack Discovery',
  category: 'security',
  description:
    'Positive Technologies Network Attack Discovery (PT NAD) events — network traffic analysis system logs covering rule-based attack detections, behavioral suspicious activity analysis, reputation/IOC alerts, lateral movement detection, C2 communication channels, protocol anomalies, credential leak detection, and parsed network session metadata in ECS-compatible JSON format.',
  format: ['JSON', 'ECS'],
  dataSource: 'PT NAD Syslog to SIEM (MaxPatrol SIEM, Elastic, Splunk)',
  eventCount: 8,
  templateCount: 8,
  highlights: [
    'Rule-based attack detection with MITRE ATT&CK mapping',
    'Behavioral analysis for suspicious activities and lateral movement',
    'C2 channel detection with beacon interval and jitter analysis',
    'Threat intelligence IOC/reputation matching with confidence scores',
  ],
  generatorId: 'security-pt-nad',
  eventTypes: [
    {
      id: 'session',
      description: 'Parsed protocol session metadata (Layer 7)',
      frequency: '30%',
      category: 'network',
    },
    {
      id: 'attack',
      description: 'Rule-based attack detection (IDS rules)',
      frequency: '20%',
      category: 'intrusion_detection',
    },
    {
      id: 'suspicious_activity',
      description: 'Behavioral analysis detection',
      frequency: '15%',
      category: 'intrusion_detection',
    },
    {
      id: 'reputation',
      description: 'IOC/reputation list match from threat intelligence',
      frequency: '10%',
      category: 'threat_intel',
    },
    {
      id: 'protocol_anomaly',
      description: 'Deep packet inspection anomaly detection',
      frequency: '8%',
      category: 'network',
    },
    {
      id: 'lateral_movement',
      description: 'East/west lateral movement detection',
      frequency: '7%',
      category: 'intrusion_detection',
    },
    {
      id: 'c2_communication',
      description: 'Command & control channel detection',
      frequency: '5%',
      category: 'intrusion_detection',
    },
    {
      id: 'credential_leak',
      description: 'Cleartext credential detection in network traffic',
      frequency: '5%',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Rule-based attack detections with PT ESC rule IDs and MITRE ATT&CK technique mapping',
    'C2 channel detection with beacon interval, jitter percentage, and beacon count metrics',
    'Reputation alerts with IOC type (IP/domain/hash), confidence scores, and threat intelligence feed attribution',
    'Behavioral suspicious activity analysis with DPI-level protocol inspection',
    'Lateral movement detection for east/west internal traffic patterns',
    'Credential leak detection for cleartext protocols (FTP, HTTP Basic, Telnet, LDAP)',
    'CSV-sampled internal host pool with correlated hostname, IP, MAC, and OS fields',
    'GeoIP and ASN enrichment for external IP addresses',
  ],
  parameters: [
    {
      name: 'nad_version',
      defaultValue: '12.1.0.1234',
      description: 'PT NAD platform version',
    },
    {
      name: 'sensor_name',
      defaultValue: 'PT-NAD-01',
      description: 'Sensor hostname',
    },
    {
      name: 'sensor_ip',
      defaultValue: '10.1.0.100',
      description: 'Sensor IP address',
    },
    {
      name: 'internal_subnet',
      defaultValue: '10.1',
      description: 'Internal network prefix for IP generation',
    },
  ],
  sampleOutputs: [
    {
      title: 'Attack Detection (attack)',
      json: `{
    "@timestamp": "2026-03-06T22:37:22.000Z",
    "event": {
        "kind": "alert",
        "module": "pt_nad",
        "dataset": "pt_nad.alert",
        "category": ["network", "intrusion_detection"],
        "type": ["denied"],
        "severity": 3
    },
    "observer": {
        "vendor": "Positive Technologies",
        "product": "Network Attack Discovery",
        "version": "12.1.0.1234",
        "hostname": "PT-NAD-01",
        "type": "ids"
    },
    "pt_nad": {
        "event_id": 1000001,
        "detection_type": "attack",
        "detection_method": "rules",
        "rule": {
            "id": "PT-10011",
            "name": "RDP Brute Force: Multiple Failed Authentication Attempts",
            "category": "Credential Access",
            "severity": "medium"
        },
        "app_protocol": "rdp",
        "sensor": "PT-NAD-01"
    },
    "source": { "ip": "209.141.33.152", "port": 22352, "bytes": 9975 },
    "destination": { "ip": "10.1.30.5", "port": 3389, "bytes": 318273 },
    "host": {
        "hostname": "LAPTOP-EXEC01",
        "ip": ["10.1.30.5"],
        "os": { "name": "Windows", "version": "11.0.22631" },
        "domain": "CORP.ACME.COM"
    },
    "network": { "transport": "tcp", "protocol": "rdp", "direction": "inbound" },
    "rule": {
        "id": "PT-10011",
        "name": "RDP Brute Force: Multiple Failed Authentication Attempts",
        "category": "Credential Access"
    },
    "threat": {
        "framework": "MITRE ATT&CK",
        "tactic": { "id": ["TA0006"], "name": ["Credential Access"] },
        "technique": { "id": ["T1110.001"], "name": ["Password Guessing"] }
    },
    "related": { "hosts": ["LAPTOP-EXEC01"], "ip": ["209.141.33.152", "10.1.30.5"] }
}`,
    },
    {
      title: 'C2 Communication Detection (c2_communication)',
      json: `{
    "@timestamp": "2026-03-06T22:37:22.000Z",
    "event": {
        "kind": "alert",
        "module": "pt_nad",
        "dataset": "pt_nad.alert",
        "category": ["network", "intrusion_detection"],
        "type": ["info"],
        "severity": 5
    },
    "observer": {
        "vendor": "Positive Technologies",
        "product": "Network Attack Discovery",
        "version": "12.1.0.1234",
        "hostname": "PT-NAD-01",
        "type": "ids"
    },
    "pt_nad": {
        "event_id": 1000003,
        "detection_type": "c2_communication",
        "detection_method": "behavioral_analysis",
        "c2": {
            "channel_type": "DNS C2 Channel",
            "beacon_interval_s": 36,
            "jitter_pct": 7,
            "beacon_count": 8,
            "protocol": "dns"
        },
        "threat_name": "Malware Distribution Domain",
        "app_protocol": "dns",
        "sensor": "PT-NAD-01"
    },
    "source": { "ip": "10.1.5.10", "port": 50851, "bytes": 1372 },
    "destination": {
        "ip": "91.219.236.174", "port": 53, "bytes": 587,
        "geo": { "country_iso_code": "UA", "city_name": "Kyiv" },
        "as": { "number": 15626, "organization": { "name": "ITL" } }
    },
    "host": {
        "hostname": "LNX-PROXY01",
        "ip": ["10.1.5.10"],
        "os": { "name": "Linux", "version": "CentOS 8" },
        "domain": "CORP.ACME.COM"
    },
    "user": { "name": "novikov", "domain": "CORP" },
    "network": { "transport": "udp", "protocol": "dns", "direction": "outbound" },
    "threat": {
        "framework": "MITRE ATT&CK",
        "tactic": { "id": ["TA0011"], "name": ["Command and Control"] },
        "technique": { "id": ["T1071"], "name": ["Application Layer Protocol"] }
    },
    "related": { "hosts": ["LNX-PROXY01"], "ip": ["10.1.5.10", "91.219.236.174"], "user": ["novikov"] }
}`,
    },
    {
      title: 'Reputation/IOC Alert (reputation)',
      json: `{
    "@timestamp": "2026-03-06T22:37:22.000Z",
    "event": {
        "kind": "alert",
        "module": "pt_nad",
        "dataset": "pt_nad.alert",
        "category": ["network", "threat"],
        "type": ["indicator"],
        "severity": 3
    },
    "observer": {
        "vendor": "Positive Technologies",
        "product": "Network Attack Discovery",
        "version": "12.1.0.1234",
        "hostname": "PT-NAD-01",
        "type": "ids"
    },
    "pt_nad": {
        "event_id": 1000002,
        "detection_type": "reputation",
        "detection_method": "threat_intelligence",
        "indicator": {
            "type": "domain",
            "value": "data-collector.click",
            "confidence": 85,
            "feed": "PT ESC Threat Intelligence"
        },
        "threat_name": "Data Exfiltration Domain",
        "sensor": "PT-NAD-01"
    },
    "source": { "ip": "162.247.74.206", "port": 47106 },
    "destination": { "ip": "10.1.20.50", "port": 80 },
    "dns": { "question": { "name": "data-collector.click", "type": "A" } },
    "host": {
        "hostname": "DESKTOP-IT06",
        "ip": ["10.1.20.50"],
        "os": { "name": "Windows", "version": "10.0.22631" },
        "domain": "CORP.ACME.COM"
    },
    "threat": {
        "indicator": {
            "type": "domain",
            "description": "Data Exfiltration Domain",
            "confidence": 85,
            "provider": "PT ESC Threat Intelligence",
            "url": { "domain": "data-collector.click" }
        }
    },
    "related": { "hosts": ["DESKTOP-IT06", "data-collector.click"], "ip": ["162.247.74.206", "10.1.20.50"] }
}`,
    },
  ],
};
