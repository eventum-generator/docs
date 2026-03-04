import type { GeneratorMeta } from '@/lib/hub-types';

export const securityWaf: GeneratorMeta = {
    slug: 'security-waf',
    displayName: 'Web Application Firewall',
    category: 'security',
    description:
      'WAF log events with OWASP CRS rule detections (SQLi, XSS, RCE, LFI, SSRF), bot management, rate limiting, geo-blocking, and CAPTCHA challenges — modeled after ModSecurity with realistic attack payloads and GeoIP data.',
    format: ['JSON', 'ECS'],
    dataSource: 'ModSecurity / WAF JSON',
    eventCount: 11,
    templateCount: 11,
    highlights: [
      'OWASP CRS rule IDs',
      'Real attack payloads',
      'GeoIP enrichment',
      'MITRE ATT&CK mapping',
    ],
    generatorId: 'waf-01',
    eventTypes: [
      {
        id: 'allowed',
        description: 'Allowed Traffic',
        frequency: '73.9%',
        category: 'web, network',
      },
      {
        id: 'sqli',
        description: 'SQL Injection',
        frequency: '4.9%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'xss',
        description: 'Cross-Site Scripting',
        frequency: '3.9%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'rate-limit',
        description: 'Rate Limiting',
        frequency: '3.9%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'bot-detection',
        description: 'Bot Detection',
        frequency: '3.0%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'rce',
        description: 'Remote Code Execution',
        frequency: '2.0%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'lfi',
        description: 'Local File Inclusion',
        frequency: '2.0%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'geo-block',
        description: 'Geo-Blocking',
        frequency: '2.0%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'captcha-challenge',
        description: 'CAPTCHA Challenge',
        frequency: '1.5%',
        category: 'web, authentication',
      },
      {
        id: 'ssrf',
        description: 'Server-Side Request Forgery',
        frequency: '1.5%',
        category: 'web, intrusion_detection',
      },
      {
        id: 'protocol-violation',
        description: 'Protocol Violation',
        frequency: '1.5%',
        category: 'web, network',
      },
    ],
    realismFeatures: [
      'OWASP CRS 3.x/4.x rule IDs across 6 attack categories (SQLi, XSS, RCE, LFI, SSRF, protocol enforcement)',
      '35 realistic attack payloads including SQL tautology, UNION injection, XSS event handlers, path traversal, and SSRF cloud metadata',
      '45 target URLs spanning pages, APIs, static assets, and well-known paths',
      '26 user agents covering browsers, mobile, bots, developer tools, and vulnerability scanners (sqlmap, nikto, nuclei)',
      'GeoIP data for 18 cities across 14 countries with geo-blocking from restricted nations',
      'MITRE ATT&CK tactic/technique mapping on all attack events',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'waf-prod-01',
        description: 'WAF node hostname',
      },
      {
        name: 'server_name',
        defaultValue: 'app.example.com',
        description: 'Protected web application domain',
      },
      {
        name: 'server_ip',
        defaultValue: '10.0.1.50',
        description: 'Backend server IP address',
      },
      {
        name: 'waf_vendor',
        defaultValue: 'ModSecurity',
        description: 'WAF product name',
      },
      {
        name: 'waf_mode',
        defaultValue: 'blocking',
        description: 'WAF operating mode (blocking/detection)',
      },
      {
        name: 'agent_id',
        defaultValue: 'c4f2e8a1-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'SQL Injection Alert (Blocked)',
        json: `{
    "@timestamp": "2026-03-04T14:30:25.654321+00:00",
    "event": {
        "action": "denied",
        "category": ["web", "intrusion_detection"],
        "dataset": "waf.log",
        "kind": "alert",
        "module": "waf",
        "outcome": "failure",
        "severity": 2,
        "type": ["access", "denied"]
    },
    "http": {
        "request": { "bytes": 891, "method": "POST" },
        "response": { "status_code": 403 },
        "version": "1.1"
    },
    "message": "SQL Injection Attack Detected via libinjection",
    "observer": {
        "hostname": "waf-prod-01",
        "product": "WAF",
        "type": "waf",
        "vendor": "ModSecurity"
    },
    "rule": {
        "category": "SQLI",
        "id": "942100",
        "name": "SQL Injection Attack Detected via libinjection",
        "ruleset": "OWASP CRS"
    },
    "source": {
        "ip": "198.51.100.73",
        "geo": {
            "city_name": "Moscow",
            "country_iso_code": "RU",
            "country_name": "Russia"
        }
    },
    "threat": {
        "tactic": { "name": ["Initial Access"] },
        "technique": { "name": ["Exploit Public-Facing Application"] }
    },
    "url": {
        "domain": "app.example.com",
        "path": "/api/v1/search",
        "scheme": "https"
    },
    "waf": {
        "action": "blocked",
        "anomaly_score": 15,
        "matched_data": "' OR 1=1--",
        "matched_var": "ARGS",
        "mode": "blocking",
        "rule_count": 2
    },
    "tags": ["waf", "attack-sqli"]
}`,
      },
    ],
  };
