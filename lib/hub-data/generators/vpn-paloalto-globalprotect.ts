import type { GeneratorMeta } from '@/lib/hub-types';

export const vpnPaloaltoGlobalprotect: GeneratorMeta = {
    slug: 'vpn-paloalto-globalprotect',
    displayName: 'Palo Alto GlobalProtect VPN',
    category: 'web-access',
    description:
      'Palo Alto Networks GlobalProtect VPN log events covering the full remote access lifecycle — portal prelogin, LDAP/SAML/certificate authentication, gateway configuration, IPSec tunnel establishment, HIP compliance checks, latency monitoring, and session logout.',
    format: ['JSON', 'ECS'],
    dataSource: 'Palo Alto Networks GlobalProtect',
    eventCount: 11,
    templateCount: 11,
    highlights: [
      'Full VPN session lifecycle',
      'Weighted auth methods',
      'HIP compliance checks',
      'Tunnel latency monitoring',
    ],
    generatorId: 'vpn-paloalto-globalprotect',
    eventTypes: [
      {
        id: 'portal-prelogin',
        description: 'Portal SSL handshake and auth method discovery',
        frequency: '~9.1%',
        category: 'network',
      },
      {
        id: 'portal-auth',
        description: 'User authenticates to GlobalProtect portal (LDAP/SAML/Certificate/RADIUS)',
        frequency: '~9.1%',
        category: 'authentication',
      },
      {
        id: 'portal-getconfig',
        description: 'Client retrieves portal configuration and gateway list',
        frequency: '~9.1%',
        category: 'configuration',
      },
      {
        id: 'gateway-auth',
        description: 'User authenticates to VPN gateway',
        frequency: '~12%',
        category: 'authentication',
      },
      {
        id: 'gateway-auth-failure',
        description: 'Failed gateway authentication attempt',
        frequency: '~3%',
        category: 'authentication',
      },
      {
        id: 'gateway-getconfig',
        description: 'Client retrieves gateway VPN configuration',
        frequency: '~9.1%',
        category: 'configuration',
      },
      {
        id: 'gateway-setup-ipsec',
        description: 'IPSec tunnel establishment between client and gateway',
        frequency: '~9.1%',
        category: 'network',
      },
      {
        id: 'gateway-hip-check',
        description: 'Host Information Profile compliance check',
        frequency: '~12%',
        category: 'security',
      },
      {
        id: 'gateway-tunnel-latency',
        description: 'Periodic pre/post-tunnel latency measurement',
        frequency: '~12%',
        category: 'network',
      },
      {
        id: 'gateway-config-release',
        description: 'Gateway pushes configuration to connected client',
        frequency: '~6.5%',
        category: 'configuration',
      },
      {
        id: 'gateway-logout',
        description: 'VPN session termination with duration tracking',
        frequency: '~9%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Weighted authentication methods (LDAP 50%, SAML 30%, Certificate 15%, RADIUS 5%)',
      'Correlated device fields (hostname, host ID, serial, MAC, OS platform)',
      'Exponential session duration distribution (mean ~4 hours)',
      'Gaussian latency distributions for tunnel measurements',
      'Multiple gateway locations with priority-based selection',
      'Connect method distribution (pre-logon, user-logon, on-demand, manual)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'PA-GP-01',
        description: 'Firewall hostname',
      },
      {
        name: 'serial_number',
        defaultValue: '012345678901',
        description: 'Firewall serial number',
      },
      {
        name: 'domain',
        defaultValue: 'corp.example.com',
        description: 'Corporate domain',
      },
      {
        name: 'virtual_sys',
        defaultValue: 'vsys1',
        description: 'Virtual system name',
      },
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
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
        title: 'Gateway Authentication Success',
        json: `{
    "@timestamp": "2026-03-06T09:14:32.000000+00:00",
    "event": {
        "action": "globalprotect-gateway-auth",
        "category": ["authentication", "network"],
        "dataset": "panw.globalprotect",
        "outcome": "success",
        "type": ["start"]
    },
    "source": {
        "ip": "198.51.100.87",
        "user": { "name": "jdoe", "domain": "corp.example.com" }
    },
    "observer": {
        "hostname": "PA-GP-01",
        "serial_number": "012345678901",
        "product": "PAN-OS",
        "type": "firewall",
        "vendor": "Palo Alto Networks"
    },
    "paloalto": {
        "globalprotect": {
            "virtual_sys": "vsys1",
            "auth_method": "LDAP",
            "client_os": "Windows",
            "client_version": "6.2.1",
            "connect_method": "user-logon",
            "gateway": "gw-us-east-1"
        }
    }
}`,
      },
      {
        title: 'HIP Compliance Check',
        json: `{
    "@timestamp": "2026-03-06T09:15:04.000000+00:00",
    "event": {
        "action": "globalprotect-hip-check",
        "category": ["host"],
        "dataset": "panw.globalprotect",
        "outcome": "success",
        "type": ["info"]
    },
    "host": {
        "hostname": "DESKTOP-A1B2C3D",
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "os": { "platform": "Windows", "version": "10.0.19045" },
        "mac": "AA:BB:CC:11:22:33"
    },
    "observer": {
        "hostname": "PA-GP-01",
        "serial_number": "012345678901",
        "product": "PAN-OS",
        "vendor": "Palo Alto Networks"
    },
    "paloalto": {
        "globalprotect": {
            "hip_match": true,
            "hip_profiles": ["Antivirus", "DiskEncryption", "HostFirewall"],
            "serial": "5CG0123ABC"
        }
    }
}`,
      },
      {
        title: 'Gateway Logout',
        json: `{
    "@timestamp": "2026-03-06T13:42:17.000000+00:00",
    "event": {
        "action": "globalprotect-gateway-logout",
        "category": ["authentication", "network"],
        "dataset": "panw.globalprotect",
        "outcome": "success",
        "type": ["end"],
        "duration": 16065000000000
    },
    "source": {
        "ip": "198.51.100.87",
        "user": { "name": "jdoe", "domain": "corp.example.com" }
    },
    "observer": {
        "hostname": "PA-GP-01",
        "serial_number": "012345678901",
        "product": "PAN-OS",
        "vendor": "Palo Alto Networks"
    },
    "paloalto": {
        "globalprotect": {
            "virtual_sys": "vsys1",
            "gateway": "gw-us-east-1",
            "reason": "user-logoff",
            "session_duration_sec": 16065
        }
    }
}`,
      },
    ],
  };
