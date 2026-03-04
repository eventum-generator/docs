import type { GeneratorMeta } from '@/lib/hub-types';

export const networkSnort: GeneratorMeta = {
    slug: 'network-snort',
    displayName: 'Snort IDS/IPS',
    category: 'security',
    description:
      'Snort IDS/IPS alert output — malware C2 callbacks, web application attacks, network reconnaissance, policy violations, protocol anomalies, and DoS detection across 13 alert classifications.',
    format: ['JSON', 'ECS'],
    dataSource: 'Snort Alert Output',
    eventCount: 13,
    templateCount: 13,
    highlights: [
      '57 Snort signatures',
      'Real-world CVEs',
      'Multi-stage recon correlation',
      'IPS action variety',
    ],
    generatorId: 'snort',
    eventTypes: [
      {
        id: 'trojan-activity',
        description: 'Trojan / C2 activity',
        frequency: '~15%',
        category: 'intrusion_detection',
      },
      {
        id: 'policy-violation',
        description: 'Corporate policy violations',
        frequency: '~12.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'misc-activity',
        description: 'Suspicious user agents, PowerShell, IRC',
        frequency: '~12.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'web-app-attack',
        description: 'SQL injection, XSS, RCE',
        frequency: '~10%',
        category: 'intrusion_detection',
      },
      {
        id: 'network-scan',
        description: 'Port/host scans, ICMP probes',
        frequency: '~10%',
        category: 'intrusion_detection',
      },
      {
        id: 'attempted-recon',
        description: 'Nmap scans, version probes',
        frequency: '~7.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'protocol-decode',
        description: 'DNS zone transfer, FTP bounce, SMTP',
        frequency: '~7.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'bad-unknown',
        description: 'Suspicious outbound, self-signed certs',
        frequency: '~6%',
        category: 'intrusion_detection',
      },
      {
        id: 'attempted-admin',
        description: 'Admin privilege escalation',
        frequency: '~5%',
        category: 'intrusion_detection',
      },
      {
        id: 'icmp-event',
        description: 'Echo, unreachable, time exceeded',
        frequency: '~5%',
        category: 'intrusion_detection',
      },
      {
        id: 'attempted-dos',
        description: 'SYN/UDP/ICMP flood, amplification',
        frequency: '~4%',
        category: 'intrusion_detection',
      },
      {
        id: 'attempted-user',
        description: 'User privilege escalation',
        frequency: '~4%',
        category: 'intrusion_detection',
      },
      {
        id: 'shellcode-detect',
        description: 'NOOP sled, reverse shell',
        frequency: '~1%',
        category: 'intrusion_detection',
      },
    ],
    realismFeatures: [
      '57 inline Snort signatures covering real CVEs (Log4j, EternalBlue, ProxyShell, Heartbleed, Spring4Shell)',
      'Direction-aware traffic — trojans predominantly outbound, web attacks inbound, policy violations internal',
      'Multi-stage reconnaissance correlation — scan source IPs persist in shared state across templates',
      'Protocol-specific metadata — TCP flags, seq/ack numbers, window sizes, TTL; ICMP type/code pairs',
      'IPS action variety — allow, would_drop, drop with classification-appropriate ratios',
      'Real Snort SID ranges — VRT/Talos-style SIDs (100–999999) and local rules (1000000+)',
    ],
    parameters: [
      {
        name: 'sensor_hostname',
        defaultValue: 'IDS01',
        description: 'Snort sensor hostname',
      },
      {
        name: 'sensor_interface',
        defaultValue: 'eth0',
        description: 'Monitored interface',
      },
      {
        name: 'home_network_prefix',
        defaultValue: '10.1.',
        description: 'Internal network prefix',
      },
      {
        name: 'agent_id',
        defaultValue: 'a7c3e1f0-...',
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
        title: 'Trojan Activity — Cobalt Strike C2',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "event": {
        "action": "would_drop",
        "category": ["network", "intrusion_detection"],
        "dataset": "snort.log",
        "kind": "alert",
        "severity": 1
    },
    "source": { "ip": "10.1.1.30", "port": 52341 },
    "destination": { "ip": "198.51.100.47", "port": 443 },
    "network": { "direction": "outbound", "transport": "tcp" },
    "rule": {
        "category": "Trojan Activity",
        "description": "MALWARE-CNC Cobalt Strike beacon outbound connection",
        "id": "45000"
    },
    "observer": { "name": "IDS01", "product": "ids", "vendor": "snort" }
}`,
      },
    ],
  };
