import type { GeneratorMeta } from '@/lib/hub-types';

export const networkWirelessAruba: GeneratorMeta = {
    slug: 'network-wireless-aruba',
    displayName: 'Aruba Wireless Controller',
    category: 'network',
    description:
      'Aruba wireless controller syslog — client association/disassociation, 802.1X/web/MAC authentication, AP up/down events, WIDS rogue AP detection, and ARM radio channel management across 20 access points.',
    format: ['JSON', 'ECS'],
    dataSource: 'Aruba ArubaOS Syslog',
    eventCount: 12,
    templateCount: 12,
    highlights: [
      'Full client lifecycle',
      'Multiple SSIDs',
      'Rogue AP detection',
      'ARM channel changes',
    ],
    generatorId: 'aruba-wlan',
    eventTypes: [
      {
        id: '522008',
        description: 'Auth Success (RADIUS)',
        frequency: '~24.9%',
        category: 'authentication',
      },
      {
        id: '501030',
        description: 'Station Associated',
        frequency: '~19.7%',
        category: 'network',
      },
      {
        id: '501199',
        description: 'User Authenticated with Role',
        frequency: '~19.8%',
        category: 'authentication',
      },
      {
        id: '501060',
        description: 'Station Disassociated',
        frequency: '~14.7%',
        category: 'network',
      },
      {
        id: '501080',
        description: 'User De-authenticated',
        frequency: '~7.9%',
        category: 'authentication',
      },
      {
        id: '501217',
        description: 'User Entry Deleted',
        frequency: '~7.9%',
        category: 'authentication',
      },
      {
        id: '522275',
        description: 'Auth Failed',
        frequency: '~1.6%',
        category: 'authentication',
      },
      {
        id: '500010',
        description: 'ARM Channel Change',
        frequency: '~1.2%',
        category: 'configuration',
      },
      {
        id: '302004',
        description: 'AP Up',
        frequency: '~0.8%',
        category: 'configuration',
      },
      {
        id: '404003',
        description: 'Interfering AP Detected',
        frequency: '~0.8%',
        category: 'intrusion_detection',
      },
      {
        id: '124001',
        description: 'Rogue AP Detected (WIDS)',
        frequency: '~0.5%',
        category: 'intrusion_detection',
      },
      {
        id: '302006',
        description: 'AP Down',
        frequency: '~0.3%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      'Correlated client sessions — associated events produce context consumed by disassociation',
      'Multiple SSIDs — Corp-WiFi (802.1X, 55%), Guest-WiFi (web-auth, 20%), IoT-Network (MAC-auth, 15%)',
      '20 access points across 3 buildings (HQ, DC, Branch)',
      'Rogue AP detection — random SSIDs (NETGEAR-5G, linksys, FreeWiFi) with confidence levels',
      'ARM channel changes — 2.4GHz: 1/6/11, 5GHz: 36-165 with interference-based reasons',
      'Authentication failure scenarios — 60% real users (expired creds), 40% unknown/attacker usernames',
    ],
    parameters: [
      {
        name: 'controller_hostname',
        defaultValue: 'aruba-mc01',
        description: 'Controller hostname',
      },
      {
        name: 'controller_ip',
        defaultValue: '192.168.1.1',
        description: 'Controller management IP',
      },
      {
        name: 'agent_id',
        defaultValue: 'b2c3d4e5-...',
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
        title: 'User Authentication Successful (522008)',
        json: `{
    "@timestamp": "2026-02-22T17:46:52+00:00",
    "event": {
        "action": "user-authentication-successful",
        "category": ["authentication"],
        "code": "522008",
        "outcome": "success"
    },
    "aruba": {
        "wireless": {
            "ap_name": "AP-HQ-F2-01",
            "auth_method": "802.1x",
            "ssid": "Corp-WiFi",
            "vlan": 100
        }
    },
    "user": { "name": "jsmith" },
    "observer": {
        "product": "ArubaOS",
        "type": "wireless",
        "vendor": "Aruba"
    }
}`,
      },
    ],
  };
