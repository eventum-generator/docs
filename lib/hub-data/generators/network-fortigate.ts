import type { GeneratorMeta } from '@/lib/hub-types';

export const networkFortigate: GeneratorMeta = {
    slug: 'network-fortigate',
    displayName: 'Fortinet FortiGate',
    category: 'network',
    description:
      'FortiGate next-gen firewall logs — traffic forwarding, UTM security modules (web filter, IPS, app control, DNS filter, antivirus), anomaly detection, and system operational events across the full FortiOS log taxonomy.',
    format: ['JSON', 'ECS'],
    dataSource: 'FortiGate FortiOS Syslog',
    eventCount: 12,
    templateCount: 12,
    highlights: [
      'Full UTM coverage',
      'VPN tunnel correlation',
      'FortiGuard categories',
      'GeoIP country names',
    ],
    generatorId: 'fortigate',
    eventTypes: [
      {
        id: 'traffic-forward-close',
        description: 'Traffic Forward (session close)',
        frequency: '~46%',
        category: 'network',
      },
      {
        id: 'traffic-forward-deny',
        description: 'Traffic Forward (deny)',
        frequency: '~15%',
        category: 'network',
      },
      {
        id: 'utm-appctrl',
        description: 'Application Control',
        frequency: '~6%',
        category: 'network',
      },
      {
        id: 'traffic-local',
        description: 'Traffic Local (management)',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'utm-webfilter',
        description: 'FortiGuard Web Filter',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'utm-dns',
        description: 'DNS Filter/Logging',
        frequency: '~5%',
        category: 'network',
      },
      {
        id: 'event-system',
        description: 'System Admin Events',
        frequency: '~4%',
        category: 'authentication',
      },
      {
        id: 'utm-ips',
        description: 'IPS Signature Detection',
        frequency: '~4%',
        category: 'intrusion_detection',
      },
      {
        id: 'event-vpn',
        description: 'VPN Tunnel Events',
        frequency: '~3%',
        category: 'network',
      },
      {
        id: 'event-user',
        description: 'User Authentication',
        frequency: '~3%',
        category: 'authentication',
      },
      {
        id: 'utm-virus',
        description: 'Antivirus Detection',
        frequency: '~1%',
        category: 'malware',
      },
      {
        id: 'utm-anomaly',
        description: 'DoS/Anomaly Detection',
        frequency: '~1%',
        category: 'intrusion_detection',
      },
    ],
    realismFeatures: [
      'Weighted event distributions matching production FortiGate log volumes (traffic ~70%, UTM ~22%, events ~8%)',
      'FortiGate-specific fields — sessionid, vd, policyid, poluuid, trandisp, srccountry/dstcountry, crscore/crlevel',
      'Zone-aware routing with FortiGate interface naming (port1=WAN, port2=LAN, port3=DMZ)',
      'VPN tunnel correlation via shared state — tunnel-up events paired with tunnel-down events',
      'FortiGuard web categories with proper category IDs matching real FortiGuard classification',
      'GeoIP country names for external IPs weighted by real-world traffic patterns',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'fg-01',
        description: 'FortiGate device hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain name',
      },
      {
        name: 'serial_number',
        defaultValue: 'FG200F2024000001',
        description: 'FortiGate serial number',
      },
      {
        name: 'vdom',
        defaultValue: 'root',
        description: 'Virtual domain name',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'NAT/public IP',
      },
      {
        name: 'agent_id',
        defaultValue: 'e4f8c1a2-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Traffic Forward — Session Close',
        json: `{
    "@timestamp": "2026-02-21T14:32:07+00:00",
    "event": {
        "action": "close",
        "category": ["network"],
        "code": "0000000013",
        "dataset": "fortinet_fortigate.log",
        "outcome": "success",
        "type": ["connection", "end", "allowed"]
    },
    "source": { "ip": "10.1.1.11", "port": 60446 },
    "destination": { "ip": "172.217.14.206", "port": 443 },
    "network": { "application": "HTTPS.BROWSER", "direction": "outbound", "transport": "tcp" },
    "observer": {
        "name": "fg-01",
        "product": "Fortigate",
        "serial_number": "FG200F2024000001",
        "vendor": "Fortinet"
    },
    "fortinet": {
        "firewall": { "subtype": "forward", "type": "traffic", "vd": "root" }
    }
}`,
      },
    ],
  };
