import type { GeneratorMeta } from '@/lib/hub-types';

export const webApache: GeneratorMeta = {
    slug: 'web-apache',
    displayName: 'Apache HTTP Server',
    category: 'web-access',
    description:
      'Apache httpd access and error logs — page/asset/API requests, bot crawlers (Googlebot, GPTBot), scanner probes, 3xx redirects, and correlated 4xx/5xx error log entries with module context.',
    format: ['JSON', 'ECS'],
    dataSource: 'Apache httpd access & error logs',
    eventCount: 8,
    templateCount: 8,
    highlights: [
      'Correlated access/error logs',
      'Bot traffic simulation',
      'Scanner probe paths',
      'Content-aware sizes',
    ],
    generatorId: 'apache',
    eventTypes: [
      {
        id: 'access-success',
        description: 'Successful request (2xx/304)',
        frequency: '~68%',
        category: 'web',
      },
      {
        id: 'access-bot',
        description: 'Bot/crawler request',
        frequency: '~11%',
        category: 'web',
      },
      {
        id: 'access-client-error',
        description: 'Client error (4xx)',
        frequency: '~9%',
        category: 'web',
      },
      {
        id: 'access-redirect',
        description: 'Redirect (3xx)',
        frequency: '~5%',
        category: 'web',
      },
      {
        id: 'error-file-not-found',
        description: 'File not found (error log)',
        frequency: '~3.2%',
        category: 'web',
      },
      {
        id: 'access-server-error',
        description: 'Server error (5xx)',
        frequency: '~1.4%',
        category: 'web',
      },
      {
        id: 'error-module',
        description: 'Module error/warning',
        frequency: '~1.4%',
        category: 'web',
      },
      {
        id: 'error-notice',
        description: 'Operational notice',
        frequency: '~0.9%',
        category: 'web',
      },
    ],
    realismFeatures: [
      'Correlated access/error logs — 404 access events produce matching "File does not exist" error entries',
      'Correlated server errors — 5xx access events produce matching module error entries',
      'URL distribution — pages (30%), static assets (50%), API endpoints (20%)',
      'Bot traffic — Googlebot, bingbot, YandexBot, AhrefsBot, GPTBot with correct UA strings',
      'Attack surface probing — .env, wp-admin, phpMyAdmin, .git/config in 404 paths',
      'Content-aware response sizes — CSS/JS/image sizes match real-world ranges; 304 returns 0 bytes',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'webserver01',
        description: 'Server hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Website domain name',
      },
      {
        name: 'agent_id',
        defaultValue: '9326664e-...',
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
        title: 'Access Log — HTTP 200',
        json: `{
    "@timestamp": "2026-02-21T12:00:01.234567+00:00",
    "event": {
        "category": ["web"],
        "dataset": "apache.access",
        "module": "apache",
        "outcome": "success"
    },
    "http": {
        "request": { "method": "GET" },
        "response": { "body": { "bytes": 12847 }, "status_code": 200 }
    },
    "url": { "original": "/products", "path": "/products" },
    "user_agent": { "name": "Chrome", "original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" }
}`,
      },
    ],
  };
