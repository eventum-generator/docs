/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webMicrosoftIis: GeneratorMeta = {
  slug: 'web-microsoft-iis',
  displayName: 'Microsoft IIS 10 W3C Access Logs',
  category: 'web-access',
  description:
    'IIS 10 W3C access rows for a small HTTPS site, with background browsing and a switchable four-request sequence.',
  dataSource: 'IIS 10 W3C Extended access log, explicit 15-field profile',
  format: ['JSON', 'ECS', 'W3C'],
  eventCount: 9,
  templateCount: 1,
  highlights: [
    '15-field UTC W3C access row in event.original',
    'One HTTPS request every 30 seconds',
    'One switchable four-request sensitive-path sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 240 routine requests, one client probes backup, admin and exports paths, then accesses an authenticated payroll CSV within 90 seconds.',
  generatorId: 'web-microsoft-iis',
  eventTypes: [
    {
      id: 'Page 200',
      description: 'Main page request',
      frequency: '50% of ordinary slots',
      category: 'web',
    },
    {
      id: 'Asset 200',
      description: 'Static asset request',
      frequency: '32% of ordinary slots',
      category: 'web',
    },
    {
      id: 'API 200',
      description: 'Status API request',
      frequency: '12% of ordinary slots',
      category: 'web',
    },
    {
      id: 'Missing 404',
      description: 'Missing favicon request',
      frequency: '5% of ordinary slots',
      category: 'web',
    },
    {
      id: 'Admin 403',
      description: 'Admin directory listing denied',
      frequency: '1% of ordinary slots',
      category: 'web',
    },
    {
      id: 'Backup 404',
      description: 'Backup path probe',
      frequency: 'Once per background day plus one linked request when enabled',
      category: 'web',
    },
    {
      id: 'Admin 403 sensitive',
      description: 'Admin path probe by selected client',
      frequency: 'Once per background day plus one linked request when enabled',
      category: 'web',
    },
    {
      id: 'Exports 403',
      description: 'Exports directory listing denied',
      frequency: 'Once per background day plus one linked request when enabled',
      category: 'web',
    },
    {
      id: 'Payroll 200',
      description: 'Authenticated payroll CSV access',
      frequency: 'Once per background day plus one linked request when enabled',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Explicit 15-field W3C layout uses UTC, spaces, documented hyphens, status/substatus and millisecond duration.',
    'Both modes contain the same four sensitive request signatures, separated by hours in background.',
    'event.original is a data row; native file headers and byte-count fields are not included.',
    'Behind a load balancer, c-ip can be the proxy address unless a forwarded-client field is configured.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'WEB-IIS-01',
      description: 'IIS host',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'IIS server IP',
    },
    {
      name: 'server_port',
      defaultValue: '443',
      description: 'HTTPS listener port',
    },
    {
      name: 'anomaly_user',
      defaultValue: String.raw`CONTOSO\svc-reports`,
      description: 'Authenticated account used in both modes',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.77',
      description: 'Selected client used in both modes',
    },
    {
      name: 'anomaly_delay_events',
      defaultValue: '240',
      description: 'Routine requests before the one linked sequence',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the close sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Authenticated payroll CSV access',
      json: String.raw`{"@timestamp": "2026-09-25T19:19:30+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "iis", "dataset": "iis.access", "category": ["web"], "type": ["access"], "action": "http_request", "outcome": "success", "duration": 99000000, "original": "2026-09-25 19:19:30 10.20.0.10 GET /exports/payroll.csv - 443 CONTOSO\\svc-reports 198.51.100.77 curl/8.5.0 - 200 0 0 99"}, "host": {"name": "WEB-IIS-01", "ip": "10.20.0.10"}, "source": {"ip": "198.51.100.77"}, "destination": {"ip": "10.20.0.10", "port": 443}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "url": {"path": "/exports/payroll.csv"}, "user_agent": {"original": "curl/8.5.0"}, "iis": {"access": {"sub_status": 0, "win32_status": 0}}, "user": {"name": "CONTOSO\\svc-reports"}}`,
    },
  ],
};
