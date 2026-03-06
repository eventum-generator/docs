import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPaloaltoThreat: GeneratorMeta = {
  slug: 'network-paloalto-threat',
  displayName: 'Palo Alto Threat',
  category: 'security',
  description:
    'Palo Alto PAN-OS Threat logs — IPS vulnerability exploits, antivirus detections, anti-spyware (DNS sinkhole and C2 callback), WildFire cloud verdicts, file type matching, and network scan detection with correlated severity, action, and threat category fields.',
  format: ['JSON', 'ECS'],
  dataSource: 'PAN-OS Threat Log',
  eventCount: 7,
  templateCount: 6,
  highlights: [
    '70 threat signatures across 6 subtypes',
    'DNS sinkhole and C2 callback correlation',
    'WildFire cloud verdicts with file hashes',
    'Severity-aware syslog mappings',
  ],
  generatorId: 'panw-threat',
  eventTypes: [
    {
      id: 'spyware-dns',
      description: 'DNS-based spyware — malware domains, C2 callbacks, DNS tunneling',
      frequency: '~35%',
      category: 'threat',
    },
    {
      id: 'vulnerability',
      description: 'IPS vulnerability exploit signatures',
      frequency: '~20%',
      category: 'threat',
    },
    {
      id: 'spyware-callback',
      description: 'C2 callback over HTTP/HTTPS',
      frequency: '~15%',
      category: 'threat',
    },
    {
      id: 'virus',
      description: 'Antivirus file-based detections (PE, ELF, scripts)',
      frequency: '~12%',
      category: 'threat',
    },
    {
      id: 'file-scan',
      description: 'File type matching and network scan detection',
      frequency: '~10%',
      category: 'threat',
    },
    {
      id: 'wildfire',
      description: 'WildFire cloud verdicts — malware, grayware, phishing',
      frequency: '~8%',
      category: 'threat',
    },
  ],
  realismFeatures: [
    '70 threat signatures with realistic ID ranges per subtype (spyware, vulnerability, virus, wildfire, file, scan)',
    'Correlated action distributions per subtype — DNS spyware uses sinkhole/drop; virus uses reset-both; vulnerability mostly alerts',
    'Severity-to-syslog mapping with per-subtype severity distributions (critical through informational)',
    'Direction correlation — DNS/C2/scan outbound, virus/wildfire/file inbound',
    'Subtype-specific content versions (Antivirus-* for virus, AppThreat-* for others)',
    '55 malicious domains organized by threat category (C2, malware download, DNS tunnel)',
  ],
  parameters: [
    {
      name: 'hostname',
      defaultValue: 'PA-5260',
      description: 'PAN-OS firewall hostname',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Active Directory domain',
    },
    {
      name: 'serial_number',
      defaultValue: '007200001056',
      description: 'Firewall serial number',
    },
    {
      name: 'nat_ip',
      defaultValue: '198.51.100.1',
      description: 'Source NAT IP',
    },
    {
      name: 'agent_id',
      defaultValue: 'e4f8c1a2-...',
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
      title: 'Spyware DNS Sinkhole',
      json: `{
    "@timestamp": "2026-03-06T14:22:31.000+00:00",
    "event": {
        "action": "spyware_detected",
        "category": ["intrusion_detection", "threat", "network"],
        "dataset": "panw.panos",
        "kind": "alert",
        "outcome": "failure",
        "severity": 3,
        "type": ["denied"]
    },
    "source": { "ip": "10.1.1.14", "user": { "name": "jsmith" } },
    "destination": { "ip": "10.100.15.1", "port": 53 },
    "network": { "application": "dns-base", "transport": "udp" },
    "panw": {
        "panos": {
            "action": "sinkhole",
            "severity": "medium",
            "sub_type": "spyware",
            "threat": { "name": "Suspicious DNS Query (Generic:c2-beacon.xyz)(327891564)" },
            "threat_category": "dns-malware"
        }
    },
    "observer": { "product": "PAN-OS", "vendor": "Palo Alto Networks" }
}`,
    },
    {
      title: 'Virus Detection',
      json: `{
    "@timestamp": "2026-03-06T14:25:10.000+00:00",
    "event": {
        "action": "virus_detected",
        "category": ["intrusion_detection", "threat", "network"],
        "dataset": "panw.panos",
        "kind": "alert",
        "outcome": "failure",
        "severity": 2,
        "type": ["denied"]
    },
    "source": { "ip": "10.1.1.11", "user": { "name": "mjohnson" } },
    "destination": { "ip": "67.43.156.12", "port": 443 },
    "file": { "name": "payload.exe", "type": "pe" },
    "network": { "application": "web-browsing", "transport": "tcp" },
    "panw": {
        "panos": {
            "action": "reset-both",
            "severity": "high",
            "sub_type": "virus",
            "threat": { "name": "Virus/Win32.Emotet.gen(419149938)" },
            "threat_category": "pe",
            "content_version": "Antivirus-4012-4550"
        }
    },
    "observer": { "product": "PAN-OS", "vendor": "Palo Alto Networks" }
}`,
    },
  ],
};
