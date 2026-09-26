/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webMicrosoftIis: GeneratorMeta = {
  slug: 'web-microsoft-iis',
  displayName: 'Microsoft IIS 10 W3C Access Logs',
  category: 'web-access',
  description:
    'IIS 10 W3C access rows for a small HTTPS site, with ordinary browsing and recurring four-request sensitive-path episodes every two hours.',
  dataSource: 'IIS 10 W3C Extended access log, explicit 15-field profile',
  format: ['JSON', 'ECS', 'W3C'],
  eventCount: 9,
  templateCount: 1,
  highlights: [
    '15-field UTC W3C access row in event.original',
    'One HTTPS request every 30 seconds',
    'Recurring four-request sequence with background overlap',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every two hours, one client probes backup, admin and exports paths, then accesses an authenticated payroll CSV within 90 seconds. First start follows the initial interval plus one 30-second slot; episodes use time windows because this W3C profile has no request or session ID. All four exact request signatures also occur independently in background.',
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
      frequency: 'Once per 2,880 ordinary slots; also recurring episodes',
      category: 'web',
    },
    {
      id: 'Admin 403 sensitive',
      description: 'Admin path probe by selected client',
      frequency: 'Once per 2,880 ordinary slots; also recurring episodes',
      category: 'web',
    },
    {
      id: 'Exports 403',
      description: 'Exports directory listing denied',
      frequency: 'Once per 2,880 ordinary slots; also recurring episodes',
      category: 'web',
    },
    {
      id: 'Payroll 200',
      description: 'Authenticated payroll CSV access',
      frequency: 'Once per 2,880 ordinary slots; also recurring episodes',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Explicit 15-field W3C layout uses UTC, spaces, hyphen placeholders, coherent status/substatus/Win32 values and millisecond duration.',
    'Both modes contain the same client, account, User-Agent and four sensitive request signatures, separated by hours in background.',
    'event.original is one data row; headers and byte counters are not emitted. Access does not prove credential acquisition or download size.',
    'Episodes recur by generated UTC timestamps with bounded scheduler state; native request/session IDs are not fabricated.',
    'The selected field layout is source-supported but not universal IIS defaults; behind a balancer c-ip can identify the proxy instead of the requester.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'WEB-IIS-01',
      description: 'IIS host metadata and `s-ip`',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'IIS host metadata and `s-ip`',
    },
    {
      name: 'server_port',
      defaultValue: '443',
      description: '`s-port`',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.77',
      description: 'Client used in both modes for the four sensitive requests',
    },
    {
      name: 'anomaly_user',
      defaultValue: String.raw`CONTOSO\svc-reports`,
      description: '`cs-username` on authorized export requests in both modes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Hours between anomaly episode starts, minimum 0.5; first starts one 30-second slot after this initial wait',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add the close four-request sequence',
    },
  ],
  sampleOutputs: [
    {
      title: 'Authenticated payroll CSV access',
      json: String.raw`{"@timestamp": "2026-09-25T02:02:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "iis", "dataset": "iis.access", "category": ["web"], "type": ["access"], "action": "http_request", "outcome": "success", "duration": 487000000, "original": "2026-09-25 02:02:00 10.20.0.10 GET /exports/payroll.csv - 443 CONTOSO\\svc-reports 198.51.100.77 curl/8.5.0 - 200 0 0 487"}, "host": {"name": "WEB-IIS-01", "ip": "10.20.0.10"}, "source": {"ip": "198.51.100.77"}, "destination": {"ip": "10.20.0.10", "port": 443}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "url": {"path": "/exports/payroll.csv"}, "user_agent": {"original": "curl/8.5.0"}, "iis": {"access": {"sub_status": 0, "win32_status": 0}}, "user": {"name": "CONTOSO\\svc-reports"}}`,
    },
  ],
};
