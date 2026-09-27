/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webMicrosoftIis: GeneratorMeta = {
  slug: 'web-microsoft-iis',
  displayName: 'Microsoft IIS 10 W3C Access Logs',
  category: 'web-access',
  description:
    'Microsoft IIS 10 W3C Extended access logs of a small intranet HTTPS site, as ECS JSON with one 15-field W3C data row in event.original. Twenty-four clients run independent random processes: a monitor, browsing workstations, records users, script hosts, IT staff and a scanner. Recurring episodes probe /backup/, /admin/ and /exports/ from one client and end with an authenticated export download.',
  dataSource:
    'Microsoft IIS 10.0 W3C Extended access log, explicit 15-field profile',
  format: ['JSON', 'ECS', 'W3C'],
  eventCount: 14,
  templateCount: 1,
  highlights: [
    '15-field UTC W3C data row in event.original',
    '24 independent clients, interactive ones on office hours',
    'Recurring four-request sensitive-path chain, 6 hours by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 6 hours by default (the first due one interval after the first generated timestamp, each next one interval after the previous actual start; each episode begins at a random point 0-10 minutes after it is due, so starts drift later by about five minutes per episode on average, with no catch-up), one records user or script host requests /backup/ (404 0 2), /admin/ (403 14 0) and /exports/ (403 14 0), then downloads one of its own export files (200 0 0) with its Windows account. Steps link by c-ip and time only; episodes are typically under three minutes (29-161 s in 50 validation episodes). The actor differs from the previous episode and is weighted by current activity. Every step and partial sequence also occurs in background, which never contains the complete ordered sequence ending in a download within 30 minutes from one client.',
  generatorId: 'web-microsoft-iis',
  eventTypes: [
    {
      id: 'Monitor status poll',
      description: 'Monitor request to /api/status?site=main, 200 0 0',
      frequency: '50.4% background share',
      category: 'web',
    },
    {
      id: 'Page view',
      description:
        'Page such as /Default.htm, /news.htm or /reports.htm, 200 0 0',
      frequency: '10.5% background share',
      category: 'web',
    },
    {
      id: 'Static asset',
      description: 'Logo, stylesheet or script asset, 200 0 0',
      frequency: '10.0% background share',
      category: 'web',
    },
    {
      id: 'Static asset revalidation',
      description: 'Cached asset answered from the browser cache, 304 0 0',
      frequency: '8.6% background share',
      category: 'web',
    },
    {
      id: 'Export download',
      description: 'Authenticated /exports/<file> download, 200 0 0',
      frequency: '4.3% background share',
      category: 'web',
    },
    {
      id: 'Scanner probe',
      description: 'Nmap probe of a common path, 404 0 2, 403 14 0 or 200 0 0',
      frequency: '3.2% background share',
      category: 'web',
    },
    {
      id: 'Legacy favicon',
      description: 'Missing /favicon-old.ico linked by legacy pages, 404 0 2',
      frequency: '3.1% background share',
      category: 'web',
    },
    {
      id: 'Admin directory',
      description: '/admin/ directory listing denied, 403 14 0',
      frequency: '2.2% background share',
      category: 'web',
    },
    {
      id: 'Exports directory',
      description: '/exports/ directory listing denied, 403 14 0',
      frequency: '2.2% background share',
      category: 'web',
    },
    {
      id: 'Page revalidation',
      description: 'Cached page answered from the browser cache, 304 0 0',
      frequency: '1.4% background share',
      category: 'web',
    },
    {
      id: 'iPhone touch icons',
      description: 'Missing apple-touch-icon files, 404 0 2',
      frequency: '1.3% background share',
      category: 'web',
    },
    {
      id: 'Backup path',
      description: 'Removed /backup/ path, 404 0 2',
      frequency: '1.2% background share',
      category: 'web',
    },
    {
      id: 'Export retry or typo',
      description: 'Export not generated yet or mistyped file name, 404 0 2',
      frequency: '0.8% background share',
      category: 'web',
    },
    {
      id: 'Stale link',
      description: 'Stale link from a legacy page, 404 0 2',
      frequency: '0.6% background share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Explicit 15-field W3C layout matching a published IIS 10.0 log and the Elastic IIS integration: space-delimited UTC rows at one-second resolution, - for unavailable values, + for spaces in the User-Agent, millisecond time-taken and coherent status triples (200 0 0, 304 0 0, 403 14 0, 404 0 2). File headers are not emitted, and the selection is not a universal IIS default; 2026 updates add byte counters on eligible systems.',
    'Workstations browse in sessions: a first view loads the page and most assets within two seconds, later views mostly revalidate with 304 and carry the previous page as referer. A browser download with a /reports.htm referer is preceded 3-20 seconds earlier by a view of that page; legacy pages and iPhone clients request missing files.',
    'Records users and script hosts download their own exports with their Windows accounts and try the /exports/ listing, /admin/ and /backup/ in random combinations and orders; script hosts retry exports not generated yet. The scanner runs a few bursts a day, and the monitor polls about once a minute with a random 16-204 s gap rather than an exact interval.',
    'Interactive clients follow one UTC office-hours curve (peak around 11:30, about 15% of the peak rate at night); the monitor, scanner and script hosts do not. At most five requests in any five-second window, 2,625-2,857 a day in background runs; all weights and rates are synthetic workload values, not measured IIS traffic.',
    'Background holds about 18 /backup/ -> /admin/ -> /exports/ and 15 /admin/ -> /exports/ -> download sequences a day within 15 minutes. An ordinary download that would complete the chain inside a window drawn per decision from 30-60 minutes is skipped, so only 30 minutes are guaranteed: complete ordinary sequences occur about 3 times a day between 30 and 60 minutes. Intervals below 3 hours are treated as 3, because shorter ones measurably raise the /backup/ share and night-time sensitive activity.',
    'Windows authentication appears only as the account on successful export downloads; the anonymous 401 2 5 challenge is not modeled and directory probes are anonymous. Access rows do not show how the client obtained access or how many bytes it downloaded, and behind a load balancer c-ip can be the proxy address unless a forwarded-client field is logged.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'WEB-IIS-01',
      description: 'IIS host name in host.name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 's-ip, host.ip and destination.ip',
    },
    {
      name: 'server_port',
      defaultValue: '443',
      description: 's-port and destination.port',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '6',
      description:
        'Hours between episode starts; values below 3 are treated as 3',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring four-request episodes; false generates only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Episode export download (step 4, without a referer)',
      json: String.raw`{"@timestamp": "2026-09-25T12:13:37+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "iis", "dataset": "iis.access", "category": ["web"], "type": ["access"], "action": "http_request", "outcome": "success", "duration": 392000000, "original": "2026-09-25 12:13:37 10.20.0.10 GET /exports/payroll.csv - 443 CONTOSO\\lwhite 10.20.1.23 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/150.0.0.0+Safari/537.36+Edg/150.0.0.0 - 200 0 0 392"}, "host": {"name": "WEB-IIS-01", "ip": "10.20.0.10"}, "source": {"ip": "10.20.1.23"}, "destination": {"ip": "10.20.0.10", "port": 443}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "url": {"path": "/exports/payroll.csv"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0"}, "iis": {"access": {"sub_status": 0, "win32_status": 0}}, "user": {"name": "CONTOSO\\lwhite"}}`,
    },
  ],
};
