import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationSharepointServerUls: GeneratorMeta = {
  slug: 'application-sharepoint-server-uls',
  displayName: 'Microsoft SharePoint Server ULS Trace Log',
  category: 'application',
  description:
    'SharePoint Server 2019 Unified Logging Service (ULS) trace rows from two web front ends and the legacy workflow timer job on an application server, with the raw tab-separated ULS line in event.original of ECS JSON. About 151,000 rows per weekday and 39,000 per weekend day from 348 office accounts, 8 of them site owners, on 12 sites, plus the search crawl account. Models ULS diagnostic traces, not SharePoint audit records or Microsoft 365 activity. Recurring episodes show a site owner granting permissions, downloading documents and removing the grant within one hour.',
  dataSource:
    'Microsoft SharePoint Server 2019 ULS trace log (build 16.0.10390.20000), nine tab-separated columns',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'Raw nine-column ULS line in event.original',
    '349 accounts on 12 sites following an office working week',
    'Recurring grant, download, remove chain on one site',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One site owner on one of their sites grants permissions from the share dialog (POST aclinv.aspx, sometimes preceded by the NTLM challenge and a GET user.aspx), downloads four to nine distinct documents about 40 s apart (sometimes after a library view), then removes the grant (POST user.aspx) about 4 to 55 minutes after the grant, which restores the site's permission state. Linking fields are user.name and sharepoint.site.url; each request has its own correlation ID, and the episode's requests have the same row shapes and pauses as ordinary requests. Episodes recur by event time every anomaly_interval_hours (default 24): the first start falls within the first min(interval, 24 h), each later one in a window of min(interval / 4, 6 h) centred on the previous actual start plus the interval, both weighted by the square of the office-hours curve plus a small floor, so episodes sit mostly in weekday office hours, more tightly than ordinary sessions. At the default interval consecutive grants are 21 to 27 h apart; at 12 hours every second start falls in the evening; at 8 hours or less starts cover the whole clock. Missed episodes are not replayed, and ordinary traffic is not paused or shifted around an episode. Owner and site differ from the previous episode's. Every shorter part of the chain occurs in ordinary traffic for every owner, but never the full ordered sequence within the hour.",
  generatorId: 'sharepoint-uls',
  eventTypes: [
    {
      id: 'xmnv',
      description:
        'Logging Correlation Data: request name, timer job name or site',
      frequency: '30.5% of rows',
      category: 'process, web',
    },
    {
      id: 'nasq',
      description:
        'Monitoring: entering monitored scope (request or timer job)',
      frequency: '16.1% of rows',
      category: 'process, web',
    },
    {
      id: 'b4ly',
      description:
        'Monitoring: leaving monitored scope, with execution time, CPU ms and SQL query count',
      frequency: '16.1% of rows',
      category: 'process, web',
    },
    {
      id: 'avwhz',
      description:
        'Asp Runtime: SPRequestModule.BeginRequestHandler end, with the build number',
      frequency: '15.9% of rows',
      category: 'web',
    },
    {
      id: 'agb9s',
      description:
        'Authentication Authorization: request identity (IsAuthenticated, UserIdentityName, claims count)',
      frequency: '15.9% of rows',
      category: 'authentication',
    },
    {
      id: 'af32k',
      description:
        'Claims Authentication: Windows sign-in challenge, 401 for an unauthenticated request',
      frequency: '1.5% of rows',
      category: 'authentication',
    },
    {
      id: 'b6p2',
      description: 'General: HTTP 401 response sent',
      frequency: '1.5% of rows',
      category: 'web',
    },
    {
      id: 'aoxsq',
      description:
        'Runtime: HTTP 302 response sent (site-root and access-denied redirects)',
      frequency: '1.0% of rows',
      category: 'web',
    },
    {
      id: 'ahk8y',
      description:
        'Legacy Workflow Infrastructure (Verbose): workflow instance begins processing',
      frequency: '0.5% of rows',
      category: 'process',
    },
    {
      id: 'b6p4',
      description: 'Database (VerboseEx): workflow-association SQL command',
      frequency: '0.5% of rows',
      category: 'database',
    },
    {
      id: 'tzkv',
      description: 'Database (Verbose): parameters of that SQL command',
      frequency: '0.5% of rows',
      category: 'database',
    },
  ],
  realismFeatures: [
    'A browser request writes nasq, xmnv Name=Request, avwhz, agb9s, xmnv Site=, an optional aoxsq redirect and b4ly, in the order of a published SharePoint Server 2019 trace; the first request of about 70% of sessions is an anonymous NTLM challenge (agb9s with IsAuthenticated=False, af32k, b6p2). A job-workflow timer run writes nasq, xmnv, one ahk8y, b6p4, tzkv triple per workflow instance it processes, and b4ly.',
    'About 11,800 rows per hour in weekday office hours (08:00-18:00 UTC), 4,900 in the shoulder hours (07:00-08:00, 18:00-20:00) and 1,600 at night and all weekend. About 205 accounts make requests in a weekday office hour, 95 in a shoulder hour and 16 in a night hour; the search crawl account and the timer job add a flat 1,100 rows per hour. A site owner makes about 80 to 115 requests on a weekday, most other accounts 20 to 85, in sessions of a few requests about 40 s apart.',
    'Requests cover site home pages (26%), document downloads (22%), search crawl (16%), library views (14%), NTLM challenges (10%), uploads (7%), site-root redirects (5%) and access-denied pages (1%). Sessions tend to stay on one site; a request to a site the account cannot open gets a 302 to AccessDenied.aspx and is retried up to three more times within minutes, after which most users go back to a site they can open.',
    'Site owners open the permissions page, grant permissions from the share dialog (about 47 a weekday) and plan a removal for 75% of grants: 40% are quick reverts with a 15-minute median delay, the rest follow after a median of three hours, and 45% of removals come right after one to six downloads of that site. An owner who granted access and then downloaded three or more documents of the site within the hour opens the permissions page instead of removing the grant (3 to 13 times a weekday). Uploads to the six workflow sites start instances that the five-minute timer job processes one to three times.',
    'event.original holds all nine ULS columns, repeated one to one in sharepoint.uls.*; @timestamp keeps the native 10 ms resolution with the farm in UTC, and the nasq row that opens a request has an empty Correlation column. user.name, url.*, http.request.method and sharepoint.site.url are copied to every row of a correlation ID, as a SIEM pipeline would join them; they are not ULS columns.',
    'The rows of one request are about 1.4 s apart in the median (99% within 16 s, wider at night) instead of milliseconds, while b4ly still states a duration of tens to hundreds of milliseconds; rows of different requests do not interleave. Line shapes come from published Microsoft examples (the Tx sample, a SharePoint Server 2019 Q&A trace and the workflow timer-job article), not a format specification; the timer-job b4ly text follows the 2019 request form. Only a filtered subset of tags is emitted, rows are unpadded, correlation IDs follow the shape of the samples and aoxsq appears only for 302 responses.',
    "Volumes, the hour curve, session behaviour, the crawl rate and the timer schedule are synthetic, with no holidays and the same shape every week; compatibility with the KUMA SharePoint Server 2016 normalizer is not established. ULS carries no permission delta: the granted or removed principal is only in the SharePoint audit log, so the chain is a hunting lead, not proof. In ordinary traffic a removal that would complete the chain within the hour shows as a permission-page view; with anomaly_mode on, counts of grants, owner downloads and removals are about one episode's worth higher.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the anomaly chain; false produces ordinary traffic only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time (6 to 8760)',
    },
    {
      name: 'web_app_url',
      defaultValue: 'https://portal.contoso.test',
      description:
        'HTTPS web application URL (scheme and host) in request names and ECS url.*; requests always carry port 443',
    },
    {
      name: 'wfe_hosts',
      defaultValue: '[sp-wfe-01, sp-wfe-02]',
      description: 'The two web front ends that run w3wp.exe',
    },
    {
      name: 'app_host',
      defaultValue: 'sp-app-01',
      description: 'Application server that runs OWSTIMER.EXE',
    },
  ],
  sampleOutputs: [
    {
      title: 'Grant request of an episode (xmnv Name=Request row)',
      json: String.raw`{"@timestamp": "2026-09-21T17:38:22.970Z", "ecs": {"version": "8.17.0"}, "event": {"action": "correlation-data", "category": ["web"], "code": "xmnv", "dataset": "sharepoint.uls", "kind": "event", "module": "sharepoint", "original": "09/21/2026 17:38:22.97\tw3wp.exe (0x83E4)\t0x0FA8\tSharePoint Foundation\tLogging Correlation Data\txmnv\tMedium\tName=Request (POST:https://portal.contoso.test:443/sites/it/_layouts/15/aclinv.aspx)\t90874d28-8cb3-06e6-d2a6-418013147e49", "type": ["info"]}, "host": {"name": "sp-wfe-02"}, "http": {"request": {"method": "POST"}}, "log": {"level": "medium"}, "message": "Name=Request (POST:https://portal.contoso.test:443/sites/it/_layouts/15/aclinv.aspx)", "process": {"name": "w3wp.exe", "pid": 33764, "thread": {"id": 4008}}, "related": {"hosts": ["sp-wfe-02"], "user": ["a.smirnov"]}, "service": {"name": "SharePoint Server", "version": "16.0.10390.20000"}, "sharepoint": {"site": {"url": "/sites/it"}, "uls": {"area": "SharePoint Foundation", "category": "Logging Correlation Data", "correlation_id": "90874d28-8cb3-06e6-d2a6-418013147e49", "event_id": "xmnv", "level": "Medium", "message": "Name=Request (POST:https://portal.contoso.test:443/sites/it/_layouts/15/aclinv.aspx)", "process": "w3wp.exe (0x83E4)", "thread_id": "0x0FA8", "timestamp_local": "09/21/2026 17:38:22.97"}}, "url": {"domain": "portal.contoso.test", "original": "https://portal.contoso.test:443/sites/it/_layouts/15/aclinv.aspx", "path": "/sites/it/_layouts/15/aclinv.aspx", "port": 443, "scheme": "https"}, "user": {"domain": "contoso", "name": "a.smirnov"}}`,
    },
  ],
};
