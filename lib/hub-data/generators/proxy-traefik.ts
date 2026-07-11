import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyTraefik: GeneratorMeta = {
  slug: 'proxy-traefik',
  displayName: 'Traefik Access Logs',
  category: 'web-access',
  description:
    'Traefik reverse proxy and Kubernetes ingress — access logs with the dual-latency breakdown (origin duration versus proxy overhead), upstream status, retry attempts, and router/service routing across a dynamic backend catalogue. Operational telemetry for latency SLOs and error budgets, not audit.',
  format: ['JSON', 'ECS'],
  dataSource: 'Traefik access logs',
  eventCount: 3,
  templateCount: 4,
  highlights: [
    'Dual-latency model (origin + overhead)',
    'Per-route log-normal latency classes',
    'Correlated 5xx failure modes with retries',
    'Monotonic request counter',
  ],
  generatorId: 'traefik',
  eventTypes: [
    {
      id: 'access-success',
      description: '2xx/3xx responses; http->https 308 redirects',
      frequency: '~90%',
      category: 'web',
    },
    {
      id: 'access-client-error',
      description: '4xx — backend 4xx and Traefik rateLimit 429',
      frequency: '~7%',
      category: 'web',
    },
    {
      id: 'access-upstream-error',
      description: '5xx Traefik generates on backend failure (502/503/504)',
      frequency: '~3%',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Dual-latency model — event.duration equals traefik.access.origin.duration plus traefik.access.overhead, always consistent',
    'Per-route latency classes — fast / normal / slow services draw from distinct log-normal distributions (median ~4 ms / ~35 ms / ~220 ms) with a heavy tail; gateway timeouts reach ~30 s',
    'Routing table from samples — requests are matched to routers and forwarded to backend services modelling an e-commerce Kubernetes platform',
    'Correlated failure modes — 5xx errors carry origin status 0, zero origin content size, and retry attempts that match the failure type',
    'Monotonic request counter — traefik.access.request_count increases per event, as a Traefik process does',
  ],
  parameters: [
    {
      name: 'traefik_provider',
      defaultValue: 'kubernetes',
      description:
        'Provider suffix on router and service names (@kubernetes, @docker, @file, @kubernetescrd)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Access Log — HTTP 200 (dual latency)',
      json: `{
    "@timestamp": "2026-02-21T14:32:07.123456+00:00",
    "destination": { "address": "10.1.10.36:8080", "ip": "10.1.10.36", "port": 8080 },
    "ecs": { "version": "8.11.0" },
    "event": {
        "category": ["web"],
        "duration": 29956413,
        "kind": "event",
        "outcome": "success",
        "type": ["access"]
    },
    "http": {
        "request": { "body": { "bytes": 0 }, "method": "GET" },
        "response": { "body": { "bytes": 1397 }, "status_code": 200 },
        "version": "2.0"
    },
    "log": { "level": "info" },
    "network": { "community_id": "1:YPIKJmLuQRcy3BDjhM84xxtnl2g=", "transport": "tcp" },
    "observer": {
        "egress": { "interface": { "name": "shop-cart-api-8080@kubernetes" } },
        "ingress": { "interface": { "name": "websecure" } },
        "product": "traefik",
        "type": "proxy",
        "vendor": "traefik"
    },
    "source": { "address": "192.0.1.60:53566", "ip": "192.0.1.60", "port": 53566 },
    "traefik": {
        "access": {
            "origin": { "content_size": 1397, "duration": 29847534, "status_code": 200 },
            "overhead": 108879,
            "request_count": 57,
            "retry_attempts": 0,
            "router": { "name": "shop-cart-api-example-com-cart@kubernetes" },
            "service": { "url": { "domain": "10.1.10.36:8080" } }
        }
    },
    "url": { "domain": "api.example.com", "original": "/cart/v1/items/add", "scheme": "https" },
    "user": { "name": "-" }
}`,
    },
  ],
};
