import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnCitrixNetscaler: GeneratorMeta = {
    slug: 'vpn-citrix-netscaler',
    displayName: 'Citrix NetScaler Gateway VPN',
    category: 'web-access',
    description:
      'Citrix ADC / NetScaler Gateway VPN syslog events covering the full SSL VPN session lifecycle — authentication, login/logout, ICA application launches, TCP/UDP connection statistics, HTTP resource access, client security checks, session timeouts, and license limit alerts.',
    format: ['JSON', 'ECS'],
    dataSource: 'Citrix ADC Syslog',
    eventCount: 11,
    templateCount: 11,
    highlights: [
      'Full SSL VPN lifecycle',
      'ICA application sessions',
      'Client security checks',
      'Connection statistics',
    ],
    generatorId: 'vpn-citrix-netscaler',
    eventTypes: [
      {
        id: 'sslvpn-login',
        description: 'SSL VPN session login with client and group info',
        frequency: '~11.1%',
        category: 'authentication',
      },
      {
        id: 'aaa-login-failed',
        description: 'Failed authentication with failure reason',
        frequency: '~0.9%',
        category: 'authentication',
      },
      {
        id: 'sslvpn-logout',
        description: 'Session end with duration, bytes, and connection stats',
        frequency: '~6.1%',
        category: 'authentication',
      },
      {
        id: 'ica-start',
        description: 'Citrix ICA application launch (Workspace apps)',
        frequency: '~20.0%',
        category: 'network',
      },
      {
        id: 'ica-end',
        description: 'ICA application terminated with transfer stats',
        frequency: '~13.3%',
        category: 'network',
      },
      {
        id: 'tcp-connstat',
        description: 'TCP connection statistics for VPN tunnel',
        frequency: '~22.2%',
        category: 'network',
      },
      {
        id: 'udp-flowstat',
        description: 'UDP flow statistics (DNS, NTP, SNMP, etc.)',
        frequency: '~4.4%',
        category: 'network',
      },
      {
        id: 'http-request',
        description: 'HTTP resource access through VPN',
        frequency: '~16.7%',
        category: 'network',
      },
      {
        id: 'tcp-conn-timedout',
        description: 'VPN connection timed out',
        frequency: '~2.8%',
        category: 'network',
      },
      {
        id: 'clisec-check',
        description: 'Client endpoint security compliance check',
        frequency: '~1.7%',
        category: 'security',
      },
      {
        id: 'license-limit',
        description: 'VPN license limit reached alert',
        frequency: '~0.8%',
        category: 'security',
      },
    ],
    realismFeatures: [
      'Correlated VPN sessions — login events produce session context consumed by logout with matching user/IP/session ID',
      'Correlated ICA sessions — ICA start events produce context consumed by ICA end with matching app/UUID/user',
      'Logout method distribution — UserLogout (55%), TimedOut (25%), AdminLogout (10%), InternalError (5%), ForceLogout (5%)',
      'Session duration distribution — short, medium, long, workday, and extended durations',
      'Authentication failure scenarios — 70% real users with typos, 30% attacker-style usernames',
      'Client security checks with endpoint compliance expressions (AV, firewall, OS version, domain)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'NSGW-01',
        description: 'NetScaler Gateway hostname',
      },
      {
        name: 'domain',
        defaultValue: 'corp.example.com',
        description: 'Domain for FQDN and user domain',
      },
      {
        name: 'vserver_ip',
        defaultValue: '10.200.1.10',
        description: 'VPN virtual server IP',
      },
      {
        name: 'nat_ip',
        defaultValue: '203.0.113.50',
        description: 'NAT/mapped IP address',
      },
      {
        name: 'agent_id',
        defaultValue: 'c3d4e5f6-...',
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
        title: 'SSLVPN LOGIN',
        json: `{
    "@timestamp": "2026-03-06T10:15:22.000000+00:00",
    "event": {
        "action": "logged-in",
        "category": ["authentication", "session"],
        "dataset": "citrix_adc.log",
        "kind": "event",
        "module": "citrix_adc",
        "outcome": "success",
        "type": ["start", "allowed"]
    },
    "citrix": {
        "device_product": "NetScaler",
        "device_vendor": "Citrix",
        "hostname": "NSGW-01",
        "name": "SSLVPN LOGIN",
        "session_id": "3847291"
    },
    "citrix_adc": {
        "log": {
            "browser_type": "Citrix Workspace 24.3.0.36",
            "client_ip": "198.51.100.42",
            "group": "VPN_Users",
            "session_id": "3847291",
            "sslvpn_client_type": "ICA",
            "user": "jsmith",
            "vserver": { "ip": "10.200.1.10", "port": 443 }
        }
    },
    "observer": {
        "product": "Netscaler",
        "type": "firewall",
        "vendor": "Citrix"
    },
    "user": { "name": "jsmith", "domain": "corp.example.com" }
}`,
      },
    ],
  };
