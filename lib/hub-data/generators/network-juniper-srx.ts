import type { GeneratorMeta } from '@/lib/hub-types';

export const networkJuniperSrx: GeneratorMeta = {
    slug: 'network-juniper-srx',
    displayName: 'Juniper SRX Firewall',
    category: 'network',
    description:
      'Juniper SRX series security gateway — RT_FLOW session lifecycle, RT_UTM Enhanced Web Filtering, RT_IDP intrusion detection alerts, and RT_IDS screen-based DoS protection with JunOS structured syslog.',
    format: ['JSON', 'ECS'],
    dataSource: 'Juniper SRX Structured Syslog',
    eventCount: 7,
    templateCount: 7,
    highlights: [
      'Enhanced Web Filtering',
      'Correlated sessions',
      'IDP signatures',
      'Screen DoS alerts',
    ],
    generatorId: 'srx',
    eventTypes: [
      {
        id: 'SESSION_CLOSE',
        description: 'RT_FLOW session teardown',
        frequency: '~45%',
        category: 'network',
      },
      {
        id: 'SESSION_CREATE',
        description: 'Permitted session establishment',
        frequency: '~31%',
        category: 'network',
      },
      {
        id: 'WEBFILTER_PERMITTED',
        description: 'URL allowed by EWF category',
        frequency: '~13%',
        category: 'network',
      },
      {
        id: 'WEBFILTER_BLOCKED',
        description: 'URL blocked by EWF',
        frequency: '~4.5%',
        category: 'network',
      },
      {
        id: 'SESSION_DENY',
        description: 'Session denied by security policy',
        frequency: '~4%',
        category: 'network',
      },
      {
        id: 'IDP_ATTACK',
        description: 'IDP signature match',
        frequency: '~1.5%',
        category: 'intrusion_detection',
      },
      {
        id: 'RT_SCREEN',
        description: 'Screen alerts (SYN flood, port scan)',
        frequency: '~1%',
        category: 'intrusion_detection',
      },
    ],
    realismFeatures: [
      'Correlated sessions — SESSION_CREATE pushes to shared pool; SESSION_CLOSE pops with matching 5-tuple',
      'Juniper predefined service names — junos-https, junos-dns-udp, junos-ssh, etc.',
      '27 real Enhanced Web Filtering categories (Enhanced_Social_Web_Youtube, Enhanced_Malicious_Web_Sites)',
      'NAT tracking — outbound sessions carry source NAT IP/port through session lifecycle',
      '15 IDP signatures with Juniper-style attack names and severity levels',
      '11 screen event types (SYN flood, TCP port scan, IP spoofing, ICMP flood)',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'srx-fw-01',
        description: 'SRX hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain for FQDN',
      },
      {
        name: 'nat_ip',
        defaultValue: '198.51.100.1',
        description: 'Public NAT IP',
      },
      {
        name: 'wf_profile',
        defaultValue: 'corporate-web-filter',
        description: 'Web filtering profile',
      },
      {
        name: 'agent_id',
        defaultValue: 'a7d2e4f1-...',
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
        title: 'RT_FLOW_SESSION_CLOSE',
        json: `{
    "@timestamp": "2026-02-21T14:32:10.123456+00:00",
    "event": {
        "action": "flow_close",
        "category": ["network"],
        "dataset": "juniper_srx.log",
        "outcome": "success",
        "type": ["end", "allowed", "connection"]
    },
    "source": { "ip": "10.1.1.30", "port": 52341 },
    "destination": { "ip": "142.250.80.46", "port": 443 },
    "juniper": {
        "srx": {
            "application": "SSL",
            "reason": "TCP FIN",
            "service_name": "junos-https",
            "tag": "RT_FLOW_SESSION_CLOSE"
        }
    },
    "observer": { "product": "SRX", "type": "firewall", "vendor": "Juniper" }
}`,
      },
    ],
  };
