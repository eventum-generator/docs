import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationSharepointServerUls: GeneratorMeta = {
  slug: 'application-sharepoint-server-uls',
  displayName: 'Microsoft SharePoint Server ULS Trace Log',
  category: 'application',
  description:
    'SharePoint Server 2019 Unified Logging Service (ULS) trace rows from two web front ends and the legacy workflow timer job on an application server, with the raw tab-separated ULS line in event.original of ECS JSON. Models ULS diagnostic traces, not SharePoint audit records or Microsoft 365 activity. Recurring episodes show a site owner granting permissions, downloading documents and removing the grant within one hour.',
  dataSource:
    'Microsoft SharePoint Server 2019 ULS trace log (build 16.0.10390.20000), nine tab-separated columns',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'Raw nine-column ULS line in event.original',
    'Request traces of 37 accounts and a workflow timer job',
    'Recurring grant, download, remove chain on one site',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode due one hour after the start of generation, each next one due the configured hours after the actual start of the previous one; a start comes up to min(1 h, interval / 8) after it is due and is then thinned by the weekday business-hours curve, so a due time at night usually waits for the morning; missed episodes are not replayed), one site owner on one of their sites grants permissions from the share dialog (POST aclinv.aspx), downloads four to nine documents, then removes the grant (POST user.aspx) within one hour (16-23 minutes from grant to removal in the default capture), restoring the permission state of the site. Owner and site rotate; every request also occurs in background, as do grant-then-removal, grant-then-downloads and downloads-then-removal, but never the full ordered chain.',
  generatorId: 'sharepoint-uls',
  eventTypes: [
    {
      id: 'xmnv',
      description: 'Logging Correlation Data: request, timer job or site name',
      frequency: '30.8% measured share',
      category: 'process, web',
    },
    {
      id: 'nasq',
      description: 'Monitoring: entering monitored scope',
      frequency: '18.8% measured share',
      category: 'process, web',
    },
    {
      id: 'b4ly',
      description:
        'Monitoring: leaving monitored scope, with execution time, CPU ms and SQL query count',
      frequency: '18.8% measured share',
      category: 'process, web',
    },
    {
      id: 'avwhz',
      description:
        'Asp Runtime: BeginRequestHandler end, with the build number',
      frequency: '13.3% measured share',
      category: 'web',
    },
    {
      id: 'agb9s',
      description: 'Authentication Authorization: request identity',
      frequency: '13.3% measured share',
      category: 'authentication',
    },
    {
      id: 'af32k',
      description: 'Claims Authentication: 401 Windows sign-in challenge',
      frequency: '1.2% measured share',
      category: 'authentication',
    },
    {
      id: 'b6p2',
      description: 'General: HTTP 401 response sent',
      frequency: '1.2% measured share',
      category: 'web',
    },
    {
      id: 'aoxsq',
      description: 'Runtime: HTTP 302 response sent',
      frequency: '1.1% measured share',
      category: 'web',
    },
    {
      id: 'ahk8y',
      description:
        'Legacy Workflow Infrastructure: workflow instance begins processing',
      frequency: '0.5% measured share',
      category: 'process',
    },
    {
      id: 'b6p4',
      description: 'Database (VerboseEx): workflow-association SQL command',
      frequency: '0.5% measured share',
      category: 'database',
    },
    {
      id: 'tzkv',
      description: 'Database: parameters of that SQL command',
      frequency: '0.5% measured share',
      category: 'database',
    },
  ],
  realismFeatures: [
    'A browser request writes nasq, xmnv Name=Request, avwhz, agb9s, xmnv Site=, an optional aoxsq redirect and b4ly in the order of a published SharePoint Server 2019 trace; the first request of about 70% of sessions is an anonymous NTLM challenge (agb9s, af32k, b6p2). A job-workflow timer run writes one ahk8y, b6p4, tzkv triple per workflow instance.',
    '37 accounts, including 8 site owners and the search crawl account, open sessions at lognormal intervals thinned by a weekday business-hours curve. Requests cover home pages, library views, document downloads, uploads, site-root redirects and access-denied redirects retried up to three more times within minutes.',
    'Site owners open the permissions page, grant permissions from the share dialog and plan a removal for 75% of grants: 40% are quick reverts (15-minute median delay), the rest follow after a median of three hours, and 45% of removals come right after one to six downloads. Uploads to six workflow sites start instances that the five-minute timer job processes one to three times.',
    'event.original holds all nine ULS columns, repeated one to one in sharepoint.uls.*; @timestamp keeps the native 10 ms resolution with the farm in UTC. user.name, url.*, http.request.method and sharepoint.site.url are copied to every row of a correlation ID, as a SIEM pipeline would join them; they are not ULS columns.',
    'Line shapes come from published Microsoft examples (the Tx sample, a SharePoint Server 2019 Q&A trace and the workflow timer-job article), not from a format specification; the timer-job b4ly text follows the 2019 request form. Only a filtered subset of tags is emitted, rows are unpadded, the correlation ID algorithm is approximated and aoxsq appears only for 302 responses. Volumes and cadences are synthetic, and the pack is not tested against the KUMA SharePoint Server 2016 normalizer.',
    'ULS carries no permission delta: the granted or removed principal is only in the SharePoint audit log, so the chain is a hunting lead, not proof. A background removal that would complete the chain opens the permissions page instead.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the anomaly chain; false produces background only',
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
        'Web application URL (scheme and host) in request names and ECS url.*',
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
      title: 'Grant request of the first episode (xmnv Name=Request row)',
      json: String.raw`{"@timestamp": "2026-09-21T08:50:23.880Z", "ecs": {"version": "8.17.0"}, "event": {"action": "correlation-data", "category": ["web"], "code": "xmnv", "dataset": "sharepoint.uls", "kind": "event", "module": "sharepoint", "original": "09/21/2026 08:50:23.88\tw3wp.exe (0x7F1C)\t0x1AE8\tSharePoint Foundation\tLogging Correlation Data\txmnv\tMedium\tName=Request (POST:https://portal.contoso.test:443/sites/hr/_layouts/15/aclinv.aspx)\tda1c0771-4409-3b8d-774b-6a417e11d05d", "type": ["info"]}, "host": {"name": "sp-wfe-01"}, "http": {"request": {"method": "POST"}}, "log": {"level": "medium"}, "message": "Name=Request (POST:https://portal.contoso.test:443/sites/hr/_layouts/15/aclinv.aspx)", "process": {"name": "w3wp.exe", "pid": 32540, "thread": {"id": 6888}}, "related": {"hosts": ["sp-wfe-01"], "user": ["n.sokolova"]}, "service": {"name": "SharePoint Server", "version": "16.0.10390.20000"}, "sharepoint": {"site": {"url": "/sites/hr"}, "uls": {"area": "SharePoint Foundation", "category": "Logging Correlation Data", "correlation_id": "da1c0771-4409-3b8d-774b-6a417e11d05d", "event_id": "xmnv", "level": "Medium", "message": "Name=Request (POST:https://portal.contoso.test:443/sites/hr/_layouts/15/aclinv.aspx)", "process": "w3wp.exe (0x7F1C)", "thread_id": "0x1AE8", "timestamp_local": "09/21/2026 08:50:23.88"}}, "url": {"domain": "portal.contoso.test", "original": "https://portal.contoso.test:443/sites/hr/_layouts/15/aclinv.aspx", "path": "/sites/hr/_layouts/15/aclinv.aspx", "port": 443, "scheme": "https"}, "user": {"domain": "contoso", "name": "n.sokolova"}}`,
    },
  ],
};
