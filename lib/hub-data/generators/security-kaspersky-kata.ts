import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyKata: GeneratorMeta = {
  slug: 'security-kaspersky-kata',
  displayName: 'Kaspersky Anti Targeted Attack',
  category: 'security',
  description:
    'Kaspersky Anti Targeted Attack Platform (KATA) events — network-level threat detection appliance logs covering file analysis from web and mail traffic, endpoint file submissions, IDS alerts, URL reputation verdicts, DNS query inspection, IOC scanning results, TAA (Targeted Attack Analyzer) detections, and sensor heartbeat status in ECS-compatible JSON format.',
  format: ['JSON', 'ECS'],
  dataSource: 'Kaspersky KATA Central Node Syslog/CEF',
  eventCount: 10,
  templateCount: 10,
  highlights: [
    'Network sandbox and static analysis verdicts',
    'IDS signature-based intrusion detection',
    'IOC and TAA scanning with MITRE ATT&CK mapping',
    'ECS-compatible field mapping',
  ],
  generatorId: 'security-kaspersky-kata',
  eventTypes: [
    {
      id: 'file_web',
      description: 'File detected in web traffic (HTTP/HTTPS)',
      frequency: '15%',
      category: 'malware',
    },
    {
      id: 'file_mail',
      description: 'File detected in mail traffic (SMTP)',
      frequency: '12%',
      category: 'malware',
    },
    {
      id: 'ids',
      description: 'IDS signature match on network traffic',
      frequency: '14%',
      category: 'intrusion_detection',
    },
    {
      id: 'url_web',
      description: 'URL reputation verdict from web traffic',
      frequency: '12%',
      category: 'web',
    },
    {
      id: 'url_mail',
      description: 'URL reputation verdict from email links',
      frequency: '8%',
      category: 'web',
    },
    {
      id: 'dns',
      description: 'Suspicious DNS query detection',
      frequency: '10%',
      category: 'network',
    },
    {
      id: 'file_endpoint',
      description: 'File submitted from endpoint agent',
      frequency: '10%',
      category: 'malware',
    },
    {
      id: 'iocScanning',
      description: 'IOC scanning match against threat intelligence feeds',
      frequency: '7%',
      category: 'threat_intel',
    },
    {
      id: 'taaScanning',
      description: 'Targeted Attack Analyzer heuristic detection',
      frequency: '7%',
      category: 'intrusion_detection',
    },
    {
      id: 'heartbeat',
      description: 'Sensor health and connectivity status',
      frequency: '5%',
      category: 'host',
    },
  ],
  realismFeatures: [
    'Sandbox verdicts with static and dynamic analysis scores for file detections',
    'IDS alerts with Suricata-compatible signature IDs and CVE references',
    'IOC scanning results with hash, IP, and domain indicator types from threat feeds',
    'TAA detections with MITRE ATT&CK technique IDs and kill chain phases',
    'DNS query inspection with resolved IP addresses and domain reputation categories',
    'Sensor heartbeat with component health, throughput metrics, and version info',
    'CSV-sampled internal host pool with correlated hostname, IP, and OS fields',
  ],
  parameters: [
    {
      name: 'kata_version',
      defaultValue: '6.1.0.438',
      description: 'KATA Central Node version',
    },
    {
      name: 'kata_server',
      defaultValue: 'KATA-CN01',
      description: 'KATA Central Node hostname',
    },
    {
      name: 'kata_server_ip',
      defaultValue: '10.1.0.20',
      description: 'KATA Central Node IP address',
    },
    {
      name: 'sensor_count',
      defaultValue: '3',
      description: 'Number of network sensors reporting to KATA',
    },
    {
      name: 'sandbox_enabled',
      defaultValue: 'true',
      description: 'Whether sandbox analysis is enabled for file verdicts',
    },
  ],
  sampleOutputs: [
    {
      title: 'File Detected in Web Traffic (file_web)',
      json: `{
    "@timestamp": "2026-03-07T10:22:15.000Z",
    "event": {
        "category": ["malware"],
        "type": ["info"],
        "severity": 4,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.kata"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Anti Targeted Attack Platform",
        "version": "6.1.0.438",
        "name": "KATA-CN01",
        "ip": "10.1.0.20"
    },
    "kaspersky": {
        "kata": {
            "detection_type": "file_web",
            "verdict": "malware",
            "confidence": 95,
            "sandbox_score": 87,
            "static_score": 72,
            "technologies": ["sandbox", "static_analysis", "anti_malware"],
            "threat": {
                "name": "HEUR:Trojan.Script.Miner.gen",
                "level": "High"
            },
            "file": {
                "source": "web",
                "url": "http://cdn.example.com/scripts/update.js",
                "content_type": "application/javascript"
            }
        }
    },
    "source": {
        "ip": "10.1.30.55",
        "port": 52341
    },
    "destination": {
        "ip": "203.0.113.42",
        "port": 80,
        "domain": "cdn.example.com"
    },
    "file": {
        "name": "update.js",
        "size": 34521,
        "hash": {
            "sha256": "e3b0c44298fc1c14...",
            "md5": "d41d8cd98f00b204..."
        }
    },
    "host": {
        "hostname": "WS-MKT-PC12",
        "ip": "10.1.30.55"
    },
    "related": {
        "hosts": ["WS-MKT-PC12", "KATA-CN01"],
        "ip": ["10.1.30.55", "203.0.113.42", "10.1.0.20"]
    }
}`,
    },
    {
      title: 'IDS Alert (ids)',
      json: `{
    "@timestamp": "2026-03-07T11:05:33.000Z",
    "event": {
        "category": ["intrusion_detection"],
        "type": ["alert"],
        "severity": 3,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.kata"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Anti Targeted Attack Platform",
        "version": "6.1.0.438",
        "name": "KATA-CN01",
        "ip": "10.1.0.20"
    },
    "kaspersky": {
        "kata": {
            "detection_type": "ids",
            "rule": {
                "id": "2024897",
                "name": "ET EXPLOIT Possible CVE-2024-1234 Attempt",
                "category": "Attempted Administrator Privilege Gain"
            },
            "sensor": {
                "name": "KATA-SENSOR-01",
                "ip": "10.1.0.21"
            }
        }
    },
    "source": {
        "ip": "198.51.100.77",
        "port": 44821
    },
    "destination": {
        "ip": "10.1.10.15",
        "port": 443
    },
    "network": {
        "protocol": "tcp",
        "bytes": 1523
    },
    "host": {
        "hostname": "SRV-WEB01",
        "ip": "10.1.10.15"
    },
    "related": {
        "hosts": ["SRV-WEB01"],
        "ip": ["198.51.100.77", "10.1.10.15"]
    }
}`,
    },
    {
      title: 'IOC Scanning Match (iocScanning)',
      json: `{
    "@timestamp": "2026-03-07T09:48:07.000Z",
    "event": {
        "category": ["threat_intel"],
        "type": ["indicator"],
        "severity": 4,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.kata"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Anti Targeted Attack Platform",
        "version": "6.1.0.438",
        "name": "KATA-CN01",
        "ip": "10.1.0.20"
    },
    "kaspersky": {
        "kata": {
            "detection_type": "iocScanning",
            "ioc": {
                "type": "domain",
                "value": "malware-c2.example.net",
                "feed": "Kaspersky Threat Intelligence",
                "confidence": 90,
                "threat_name": "APT-XZ-Backdoor",
                "first_seen": "2026-02-15T00:00:00Z"
            }
        }
    },
    "source": {
        "ip": "10.1.20.88",
        "port": 61234
    },
    "destination": {
        "ip": "192.0.2.100",
        "port": 443,
        "domain": "malware-c2.example.net"
    },
    "host": {
        "hostname": "WS-DEV-PC07",
        "ip": "10.1.20.88"
    },
    "related": {
        "hosts": ["WS-DEV-PC07"],
        "ip": ["10.1.20.88", "192.0.2.100"]
    }
}`,
    },
  ],
};
