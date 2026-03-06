import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyKasperskyKwts: GeneratorMeta = {
  slug: 'proxy-kaspersky-kwts',
  displayName: 'Kaspersky Web Traffic Security (KWTS)',
  category: 'web-access',
  description:
    'Kaspersky Web Traffic Security gateway logs — enterprise web proxy events covering allowed browsing, antivirus-scanned downloads, URL policy blocks, malware and phishing detections, and warning page redirects with custom kaspersky.kwts.* namespace fields in ECS-compatible JSON format.',
  format: ['JSON', 'ECS'],
  dataSource: 'Kaspersky KWTS Syslog',
  eventCount: 6,
  templateCount: 6,
  highlights: [
    'Antivirus and anti-phishing verdicts',
    'URL filtering policy enforcement',
    'Warning page redirect simulation',
    'Russian-locale deployment focus',
  ],
  generatorId: 'proxy-kaspersky-kwts',
  eventTypes: [
    {
      id: 'allowed',
      description: 'Normal browsing traffic allowed through proxy',
      frequency: '~75%',
      category: 'web',
    },
    {
      id: 'allowed-scanned',
      description: 'File download scanned clean by antivirus engine',
      frequency: '~10%',
      category: 'web',
    },
    {
      id: 'blocked-policy',
      description: 'Blocked by URL filtering policy',
      frequency: '~6%',
      category: 'web',
    },
    {
      id: 'blocked-av',
      description: 'Blocked due to malware detection',
      frequency: '~4%',
      category: 'web',
    },
    {
      id: 'blocked-ap',
      description: 'Blocked due to phishing detection',
      frequency: '~3%',
      category: 'web',
    },
    {
      id: 'redirected',
      description: 'Redirected to warning page for risky content',
      frequency: '~2%',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Kaspersky antivirus engine verdicts with threat names and severity levels',
    'URL category filtering with policy rule references',
    'Anti-phishing detection with confidence scores and phishing URL patterns',
    'HTTP method and MIME type distribution matching real proxy traffic profiles',
    'Custom kaspersky.kwts.* namespace for product-specific fields',
    'Russian-locale user and hostname pools for realistic CIS deployment scenarios',
  ],
  parameters: [
    {
      name: 'kwts_server',
      defaultValue: 'KWTS-PROXY01',
      description: 'KWTS proxy server hostname',
    },
    {
      name: 'kwts_server_ip',
      defaultValue: '10.1.0.50',
      description: 'KWTS proxy server IP address',
    },
    {
      name: 'kwts_version',
      defaultValue: '6.1.0.4762',
      description: 'KWTS product version',
    },
    {
      name: 'agent_id',
      defaultValue: 'a1b2c3d4-...',
      description: 'Filebeat agent UUID',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Elastic Agent version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Allowed Web Traffic (allowed)',
      json: `{
    "@timestamp": "2026-03-07T14:22:05.000Z",
    "event": {
        "category": ["web"],
        "type": ["access"],
        "outcome": "success",
        "action": "allowed",
        "module": "kaspersky",
        "dataset": "kaspersky.kwts"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Web Traffic Security",
        "version": "6.1.0.4762",
        "name": "KWTS-PROXY01",
        "ip": "10.1.0.50"
    },
    "kaspersky": {
        "kwts": {
            "action": "Allow",
            "scan_result": "Clean",
            "processing_time_ms": 12
        }
    },
    "url": {
        "domain": "mail.yandex.ru",
        "full": "https://mail.yandex.ru/inbox",
        "scheme": "https"
    },
    "http": {
        "request": { "method": "GET" },
        "response": { "status_code": 200, "bytes": 45230 }
    },
    "source": {
        "ip": "10.1.20.34",
        "port": 52110
    },
    "user": { "name": "ivanov_av" },
    "host": {
        "hostname": "WS-BUH-PC03",
        "ip": "10.1.20.34"
    },
    "related": {
        "hosts": ["WS-BUH-PC03", "KWTS-PROXY01"],
        "ip": ["10.1.20.34", "10.1.0.50"],
        "user": ["ivanov_av"]
    }
}`,
    },
    {
      title: 'Blocked by Antivirus (blocked-av)',
      json: `{
    "@timestamp": "2026-03-07T15:08:41.000Z",
    "event": {
        "category": ["web", "malware"],
        "type": ["denied"],
        "outcome": "failure",
        "action": "blocked-av",
        "severity": 4,
        "module": "kaspersky",
        "dataset": "kaspersky.kwts"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Web Traffic Security",
        "version": "6.1.0.4762",
        "name": "KWTS-PROXY01",
        "ip": "10.1.0.50"
    },
    "kaspersky": {
        "kwts": {
            "action": "Block",
            "scan_result": "Detected",
            "threat": {
                "name": "HEUR:Trojan.Script.Generic",
                "level": "High",
                "engine": "KAV"
            },
            "rule": "Default AV Protection",
            "processing_time_ms": 340
        }
    },
    "url": {
        "domain": "free-soft.example.com",
        "full": "http://free-soft.example.com/download/setup.exe",
        "scheme": "http"
    },
    "http": {
        "request": { "method": "GET" },
        "response": { "status_code": 403, "bytes": 0 }
    },
    "file": {
        "name": "setup.exe",
        "size": 2458624,
        "mime_type": "application/x-msdownload"
    },
    "source": {
        "ip": "10.1.30.12",
        "port": 49882
    },
    "user": { "name": "petrov_ds" },
    "host": {
        "hostname": "WS-IT-PC07",
        "ip": "10.1.30.12"
    },
    "related": {
        "hosts": ["WS-IT-PC07", "KWTS-PROXY01"],
        "ip": ["10.1.30.12", "10.1.0.50"],
        "user": ["petrov_ds"]
    }
}`,
    },
  ],
};
