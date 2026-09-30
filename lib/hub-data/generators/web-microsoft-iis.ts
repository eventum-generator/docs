/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webMicrosoftIis: GeneratorMeta = {
  slug: 'web-microsoft-iis',
  displayName: 'Microsoft IIS 10 W3C Access Logs',
  category: 'web-access',
  description:
    'Microsoft IIS 10 W3C Extended access logs of a small intranet HTTPS site, as ECS JSON with one 15-field W3C data row in event.original. 353 clients act on their own random schedules: an uptime monitor, 340 browsing workstations and iPhones, records users and script hosts downloading exports, IT staff and a scanner. Recurring episodes from one client probe /backup/, /admin/ and /exports/ and end with an authenticated export download.',
  dataSource:
    'Microsoft IIS 10.0 W3C Extended access log, explicit 15-field profile',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 14,
  templateCount: 1,
  highlights: [
    '15-field UTC W3C data row in event.original',
    '353 clients on their own random schedules, browsers on office hours',
    'Recurring four-request sensitive-path chain, 6 hours by default',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One records user or script host requests /backup/ (404 0 2), /admin/ (403 14 0) and /exports/ (403 14 0), then downloads one of its own export files (200 0 0) with its own address, User-Agent and Windows account. Steps link by c-ip and time only; an episode typically lasts one to three minutes, with no upper bound on the gaps. Every 6 hours by default (values below 3 are treated as 3), in event time: the first episode starts within the first interval (at most 24 hours) at a moment drawn in proportion to the browser hour curve; each later one is due one interval after the previous actual start and begins within a window of min(interval / 4, 6 h) centred on that due time (plus or minus 45 minutes at the default), leaning towards busy hours, so default starts are 5.3-6.8 hours apart. Missed episodes are not made up and episodes never overlap. The actor differs from the previous episode and is weighted by its current activity. Episode requests come on top of ordinary traffic, which never contains the complete sequence ending in a successful download within 15 minutes of the /backup/ request from one client.',
  generatorId: 'web-microsoft-iis',
  eventTypes: [
    {
      id: 'Static asset',
      description:
        '/DeptLogo.gif, /styles/site.css or /scripts/site.js, 200 0 0',
      frequency: '26.7% background share',
      category: 'web',
    },
    {
      id: 'Page view',
      description:
        'Page such as /Default.htm, /news.htm or /reports.htm, 200 0 0',
      frequency: '26.7% background share',
      category: 'web',
    },
    {
      id: 'Static asset revalidation',
      description: 'Static asset answered from the browser cache, 304 0 0',
      frequency: '20.9% background share',
      category: 'web',
    },
    {
      id: 'Legacy favicon',
      description: 'Missing /favicon-old.ico linked by legacy pages, 404 0 2',
      frequency: '8.6% background share',
      category: 'web',
    },
    {
      id: 'Monitor status poll',
      description: 'Monitor request to /api/status?site=main, 200 0 0',
      frequency: '6.2% background share',
      category: 'web',
    },
    {
      id: 'iPhone touch icons',
      description:
        'Missing apple-touch-icon files requested by iPhones, 404 0 2',
      frequency: '4.0% background share',
      category: 'web',
    },
    {
      id: 'Page revalidation',
      description: 'Page answered from the browser cache, 304 0 0',
      frequency: '3.2% background share',
      category: 'web',
    },
    {
      id: 'Stale link',
      description: 'Stale link from a legacy page, 404 0 2',
      frequency: '1.7% background share',
      category: 'web',
    },
    {
      id: 'Export download',
      description: 'Authenticated /exports/<file> download, 200 0 0',
      frequency: '0.62% background share',
      category: 'web',
    },
    {
      id: 'Backup path',
      description: 'Removed /backup/ path, 404 0 2',
      frequency: '0.34% background share',
      category: 'web',
    },
    {
      id: 'Admin directory',
      description: '/admin/ directory listing denied, 403 14 0',
      frequency: '0.33% background share',
      category: 'web',
    },
    {
      id: 'Exports directory',
      description: '/exports/ directory listing denied, 403 14 0',
      frequency: '0.33% background share',
      category: 'web',
    },
    {
      id: 'Scanner probe',
      description: 'Nmap probe of a common path, 404 0 2, 403 14 0 or 200 0 0',
      frequency: '0.28% background share',
      category: 'web',
    },
    {
      id: 'Export not available',
      description: 'Export not there yet, mistyped or withheld, 404 0 2',
      frequency: '0.20% background share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Explicit 15-field W3C Extended layout matching a published IIS 10.0 log and the Elastic IIS integration: space-delimited UTC rows at one-second resolution, - for unavailable values, + for spaces in the User-Agent, millisecond time-taken, HTTPS port 443 and the status triples 200 0 0, 304 0 0, 403 14 0 and 404 0 2. Rows carry no #Software, #Version, #Date or #Fields headers, so a parser of event.original needs the layout configured; the selection is not a universal IIS default (2026 updates add sc-bytes and cs-bytes on some builds), and response size is not available.',
    '280 office PCs and 60 iPhones browse in sessions: a first view loads the page and most static assets, later views mostly revalidate them with 304 and carry the previous page as referer. Legacy pages link a missing favicon and stale URLs, and iPhones request missing apple-touch-icon files. Requests a browser sends together are seconds apart rather than milliseconds: assets follow their page after a median of 5-6 s.',
    'Seven records users (two remote), two script hosts (curl and PowerShell) and two IT staff work in /backup/, /admin/ and /exports/ in sittings of two to four visits, about 14, 36 and 10 visits a day per client. Records users and script hosts download their own exports with their Windows accounts; a browser download with a /reports.htm referer (about 60%) follows a view of that page, script hosts retry exports not generated yet and records users occasionally mistype a file name.',
    "About 23,200 requests a day (21,900-24,400). Browser traffic follows one UTC office-hours curve peaking around 11:30, and the mean rate is 0.66-0.71 requests per second at 10:00-12:59 UTC against 0.12-0.13 at 18:00-04:59; the monitor (once a minute, gaps of about 43-78 s), the scanner (a few bursts a day), the script hosts and part of the records users' work run around the clock. All weights and rates are synthetic workload values, not measured IIS traffic.",
    'Every step and partial sequence of the chain also occurs in ordinary traffic of both modes from the same clients, including about 32 /backup/ -> /admin/ -> /exports/ sequences a day within 15 minutes from one client. An ordinary download that would complete the sequence within 15 minutes of the /backup/ request is answered 404 0 2 (withheld, about 27 a day); later ones succeed, so a window longer than 15 minutes finds about 2-3 ordinary complete sequences a day between 15 and 30 minutes. With anomaly_mode true, counts of the chain parts are about one per episode higher.',
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
        'Add the recurring four-request episodes; false generates only ordinary traffic',
    },
  ],
  sampleOutputs: [
    {
      title: 'Episode export download (step 4, with the /reports.htm referer)',
      json: String.raw`{"@timestamp": "2026-09-02T09:21:15+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "iis", "dataset": "iis.access", "category": ["web"], "type": ["access"], "action": "http_request", "outcome": "success", "duration": 223000000, "original": "2026-09-02 09:21:15 10.20.0.10 GET /exports/ap-aging.csv - 443 CONTOSO\\tgarcia 10.20.2.44 Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64;+rv:152.0)+Gecko/20100101+Firefox/152.0 https://intranet.contoso.example/reports.htm 200 0 0 223"}, "host": {"name": "WEB-IIS-01", "ip": "10.20.0.10"}, "source": {"ip": "10.20.2.44"}, "destination": {"ip": "10.20.0.10", "port": 443}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "url": {"path": "/exports/ap-aging.csv"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0"}, "iis": {"access": {"sub_status": 0, "win32_status": 0}}, "user": {"name": "CONTOSO\\tgarcia"}}`,
    },
  ],
};
