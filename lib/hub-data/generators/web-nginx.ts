import type { GeneratorMeta } from '@/lib/hub-types';

export const webNginx: GeneratorMeta = {
    slug: 'web-nginx',
    displayName: 'Nginx Access & Error Logs',
    category: 'web-access',
    description:
      'Nginx reverse proxy and web server — access logs with upstream timing, error logs with module context, bot/crawler traffic, scanner probes, and correlated 4xx/5xx error entries.',
    format: ['JSON', 'ECS'],
    dataSource: 'nginx access & error logs',
    eventCount: 7,
    templateCount: 7,
    highlights: [
      'URL category distribution',
      'User agent diversity',
      'Scanner probe simulation',
      'Correlated error IDs',
    ],
    generatorId: 'nginx',
    eventTypes: [
      {
        id: 'access-success',
        description: 'HTTP 2xx/3xx responses',
        frequency: '~84%',
        category: 'web',
      },
      {
        id: 'access-failure',
        description: 'HTTP 4xx/5xx responses',
        frequency: '~11%',
        category: 'web',
      },
      {
        id: 'error-upstream',
        description: 'Upstream connect/timeout/reset',
        frequency: '~2.5%',
        category: 'web',
      },
      {
        id: 'error-filesystem',
        description: 'File not found, permission denied',
        frequency: '~1.5%',
        category: 'web',
      },
      {
        id: 'error-client',
        description: 'Body too large, premature close',
        frequency: '~0.5%',
        category: 'web',
      },
      {
        id: 'error-ssl',
        description: 'TLS handshake failures',
        frequency: '~0.3%',
        category: 'web',
      },
      {
        id: 'error-system',
        description: 'Bind failures, worker crashes',
        frequency: '~0.2%',
        category: 'web',
      },
    ],
    realismFeatures: [
      'Weighted event distribution matching production nginx traffic (~95% access, ~5% error)',
      'URL category distribution — static assets (40%), HTML pages (30%), API endpoints (18%), well-known files (12%)',
      'HTTP method correlation — GET 85%, POST 10%, with method-specific status codes',
      'User agent distribution — desktop browsers (55%), mobile (20%), bots (10%), tools (8%)',
      'Scanner probe simulation — wp-login.php, .env, .git/config with realistic 404 responses',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'web-srv-01',
        description: 'Nginx server hostname',
      },
      {
        name: 'server_name',
        defaultValue: 'example.com',
        description: 'Virtual host domain name',
      },
      {
        name: 'upstream_addr',
        defaultValue: '127.0.0.1:8080',
        description: 'Backend upstream address',
      },
      {
        name: 'agent_id',
        defaultValue: 'a7b8c9d0-...',
        description: 'Filebeat agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat version string',
      },
    ],
    sampleOutputs: [
      {
        title: 'Access Log — HTTP 200',
        json: `{
    "@timestamp": "2026-02-21T14:32:07.123456+00:00",
    "event": {
        "category": ["web"],
        "dataset": "nginx.access",
        "kind": "event",
        "module": "nginx",
        "outcome": "success",
        "type": ["access"]
    },
    "http": {
        "request": { "method": "GET" },
        "response": {
            "body": { "bytes": 18432 },
            "status_code": 200
        }
    },
    "url": { "original": "/products", "path": "/products" },
    "user_agent": {
        "name": "Chrome",
        "original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/133.0.0.0"
    }
}`,
      },
    ],
  };
