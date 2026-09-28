/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webF5AdvancedWaf: GeneratorMeta = {
  slug: 'web-f5-advanced-waf',
  displayName: 'F5 BIG-IP ASM / Advanced WAF',
  category: 'web-access',
  description:
    'F5 BIG-IP ASM (Advanced WAF) request log in the ArcSight CEF format over syslog, from one BIG-IP unit protecting four virtual servers, as ECS JSON with the native line in event.original. Recurring episodes show one client cycling blocked payloads against one URI until a plain request passes.',
  dataSource:
    'F5 BIG-IP ASM 11.3.0 request log, remote logging profile in ArcSight CEF over syslog',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native syslog CEF request line in event.original',
    'Browsing sessions and attack bursts from 360 independent clients',
    'Recurring blocked-payload cycling then pass chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first within the first min(interval, 24 h) at a time drawn with the background hour-of-day load; each later start drawn in a window of min(interval / 4, 6 h) centred one interval after the actual previous start and weighted toward busy hours, with no catch-up), one client is blocked on one URI of one virtual server for three or four distinct violations (SQL injection, XSS, wget client, oversized query string, IP address in the Host header), then a plain request from it to the same URI passes with status 200; matched spans measured 25-79 s by default. Client and target come from recent ordinary traffic and differ from the previous episode; every chain feature also occurs in background, and only the complete ordered chain within 30 minutes is kept out of it.',
  generatorId: 'web-f5-advanced-waf',
  eventTypes: [
    {
      id: 'Successful Request',
      description: 'Request passed (act=passed)',
      frequency: '89.3% measured share',
      category: 'web',
    },
    {
      id: 'Illegal HTTP status in response',
      description: 'Backend status 403, 409 or 500, alerted',
      frequency: '2.0% measured share',
      category: 'intrusion_detection',
    },
    {
      id: '200002273',
      description: 'SQL-INJ exec() signature',
      frequency: '1.9% blocked, 0.3% alerted (measured)',
      category: 'intrusion_detection',
    },
    {
      id: '200000098',
      description: 'XSS script tag (Parameter) signature',
      frequency: '1.8% blocked, 0.3% alerted (measured)',
      category: 'intrusion_detection',
    },
    {
      id: 'Illegal URL',
      description: 'Probe for a file that does not exist',
      frequency: '1.2% blocked, 0.1% alerted (measured)',
      category: 'intrusion_detection',
    },
    {
      id: 'Host header contains IP address',
      description: 'HTTP protocol compliance failed',
      frequency: '1.0% blocked, 0.2% alerted (measured)',
      category: 'intrusion_detection',
    },
    {
      id: '200021069',
      description: 'Automated client access "wget" signature',
      frequency: '0.9% blocked, 0.1% alerted (measured)',
      category: 'intrusion_detection',
    },
    {
      id: 'Illegal query string length',
      description: 'Oversized query string',
      frequency: '0.8% blocked, 0.1% alerted (measured)',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'One BIG-IP unit protects four virtual servers for 360 clients: about 6,300 events per day with the defaults, at most one per second, with diurnal load by UTC hour. Browsing sessions by clients with skewed weights request 1-60 URIs with lognormal gaps; backend 403, 409 and 500 raise alerted Illegal HTTP status, and about 0.6% of dynamic requests trip a violation, often followed by a retry of the same URI within a minute or two.',
    'Automated attack bursts (about one per 15 minutes) send signature and violation payloads to one to six URIs of an application and probe files that do not exist; about a third of attacked URIs also get one plain request, usually early in the sequence. Blocked requests carry cn1=0 and others the backend status; externalId grows by random steps and suid is shared within a session or burst.',
    'Background holds every chain feature: per 126 hours about 1,800 repeated blocks by one client within a minute and 600-670 sets of three or more distinct blocks by one client on one URI within 30 minutes. An ordinary pass that would complete the chain keeps its URI and time and trips one of those violations again, so the next request after two versus three or more distinct blocks is a same-URI violation in about 61% of cases either way. A passed request alone does not prove a bypass.',
    'The layout is the ASM 11.3.0 CEF request message published by F5; non-signature violation headers follow the 10.1.0 ArcSight guide and third-party 11.6.1 and 15.1 raw logs, and severities 5 and 2 and the syslog PRI mapping are inferred. Keys added in 14.x and later, such as violation_rating and microservice, are not modelled, and SIEM parser compatibility (KUMA, Elastic CEF) is untested.',
    'One violation per request and three documented signature IDs; multi-violation requests, violation_details, brute force, web scraping, DoS and bot defense messages, request bodies and XFF values are absent. geo_location is a synthetic country per client, times are UTC whole seconds, and episodes are weighted to busy hours more strongly than background.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add anomaly episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 2 to 8,760',
    },
    {
      name: 'device_hostname',
      defaultValue: 'bigip-waf-01.example.com',
      description: 'Syslog host and CEF dvchost',
    },
    {
      name: 'device_management_ip',
      defaultValue: '10.60.0.5',
      description: 'BIG-IP management address, CEF dvc',
    },
    {
      name: 'device_version',
      defaultValue: '11.3.0',
      description: 'CEF Device Version',
    },
    {
      name: 'client_count',
      defaultValue: '360',
      description:
        'Client addresses in 198.51.100.0/24 and 192.0.2.0/24, 50 to 480',
    },
    {
      name: 'virtual_servers',
      defaultValue:
        '4 servers: shop.example.com (203.0.113.10:443), api.example.com (203.0.113.11:443), partners.example.com (203.0.113.12:443), news.example.com (203.0.113.13:80)',
      description:
        'Host name, address, port (80 or 443), ASM policy name, traffic weight and URI list (method, path, query template with {n} or {q}, weight) of each virtual server',
    },
    {
      name: 'forceful_paths',
      defaultValue:
        '/.env, /.git/config, /wp-login.php, /phpmyadmin/index.php, /admin.php, /backup.zip, /server-status, /config.php.bak',
      description: 'Non-existent paths probed by attack bursts',
    },
    {
      name: 'search_terms',
      defaultValue:
        'shoes, laptop, gift card, headphones, desk lamp, backpack, coffee, monitor, jacket, charger',
      description: 'Values for the {q} query placeholder',
    },
  ],
  sampleOutputs: [
    {
      title: 'Blocked SQL injection, second step of an episode',
      json: String.raw`{"@timestamp": "2026-09-26T08:59:12+00:00", "destination": {"ip": "203.0.113.12", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "blocked", "category": ["web", "intrusion_detection"], "code": "200002273", "dataset": "f5.asm", "kind": "alert", "original": "\u003c131\u003eSep 26 08:59:13 bigip-waf-01.example.com ASM:CEF:0|F5|ASM|11.3.0|200002273|SQL-INJ exec()|5|dvchost=bigip-waf-01.example.com dvc=10.60.0.5 cs1=partner-portal cs1Label=policy_name cs2=/Common/partner-portal cs2Label=http_class_name deviceCustomDate1=Sep 17 2026 14:33:52 deviceCustomDate1Label=policy_apply_date externalId=13481800479857545456 act=blocked cn1=0 cn1Label=response_code src=192.0.2.241 spt=44054 dst=203.0.113.12 dpt=443 requestMethod=GET app=HTTPS cs5=N/A cs5Label=x_forwarded_for_header_value rt=Sep 26 2026 08:59:12 deviceExternalId=0 cs4=SQL-Injection cs4Label=attack_type cs6=GB cs6Label=geo_location c6a1= c6a1Label=device_address c6a2= c6a2Label=source_address c6a3= c6a3Label=destination_address c6a4=N/A c6a4Label=ip_address_intelligence msg=N/A suid=ae658d149e4cc25d suser=N/A request=/documents?id\\=1;exec(char(0x73656c656374)) cs3Label=full_request cs3=GET /documents?id\\=1;exec(char(0x73656c656374)) HTTP/1.1\\r\\nHost: partners.example.com\\r\\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\\r\\nAccept: text/html,application/xhtml+xml,application/xml;q\\=0.9,*/*;q\\=0.8\\r\\nAccept-Language: en-US,en;q\\=0.9\\r\\nAccept-Encoding: gzip, deflate, br\\r\\nConnection: keep-alive\\r\\n\\r\\n", "outcome": "failure", "severity": 5, "type": ["access", "denied"]}, "f5": {"asm": {"attack_type": "SQL-Injection", "http_class_name": "/Common/partner-portal", "policy_apply_date": "Sep 17 2026 14:33:52", "policy_name": "partner-portal", "request_status": "blocked", "response_code": 0, "session_id": "ae658d149e4cc25d", "support_id": "13481800479857545456"}}, "http": {"request": {"method": "GET"}}, "network": {"protocol": "https"}, "observer": {"ip": ["10.60.0.5"], "name": "bigip-waf-01.example.com", "product": "ASM", "type": "waf", "vendor": "F5", "version": "11.3.0"}, "related": {"ip": ["192.0.2.241", "203.0.113.12"]}, "rule": {"id": "200002273", "name": "SQL-INJ exec()"}, "source": {"geo": {"country_iso_code": "GB"}, "ip": "192.0.2.241", "port": 44054}, "url": {"original": "/documents?id=1;exec(char(0x73656c656374))", "path": "/documents", "query": "id=1;exec(char(0x73656c656374))"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"}}`,
    },
  ],
};
