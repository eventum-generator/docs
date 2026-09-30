/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webF5AdvancedWaf: GeneratorMeta = {
  slug: 'web-f5-advanced-waf',
  displayName: 'F5 BIG-IP ASM / Advanced WAF',
  category: 'web-access',
  description:
    'F5 BIG-IP ASM (Advanced WAF) request log in the ArcSight CEF format over syslog, from one BIG-IP unit protecting four virtual servers for 360 clients, as ECS JSON with the native line in event.original. About 15,000 requests a day: browsing on a daily curve by UTC hour, from about 160 requests an hour at 03:00 to about 1,030 at 13:00, and automated attack bursts around the clock. Recurring episodes show one client cycling blocked payloads against one URI until a plain request passes.',
  dataSource:
    'F5 BIG-IP ASM 11.3.0 request log, remote logging profile in ArcSight CEF over syslog',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native syslog CEF request line in event.original',
    'Browsing sessions and attack bursts from 360 clients',
    'Recurring blocked-payload cycling then pass chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One client sends requests to one URI of one virtual server that are blocked for three or four distinct violations (SQL injection, XSS, wget client, oversized query string, IP address in the Host header, in random order, with up to two repeats), then a plain request from the same client to the same URI passes with status 200; an episode spans about 5-140 s. anomaly_interval_hours defaults to 24 (2 to 8,760). The first start falls within the first min(interval, 24 h), at a time drawn with the hour-of-day request volume; each later start is drawn in a window of min(interval / 4, 6 h) centred on the due time (actual previous start + interval), weighted by the hour-of-day volume squared plus a small floor, so episodes mostly fall between 07:00 and 21:00 UTC and consecutive starts are interval ± w/2 apart. There is no catch-up; at intervals of 8 h or less the start phase drifts around the clock. Each episode takes a busy client and a virtual server URI with a query that the client browses in several sessions a day, so the client and the client-server-URI combination also occur in ordinary traffic; client and target differ from the previous episode, and episodes do not change the hourly request volume. Ordinary traffic holds every chain feature: about 470 repeated blocks by one client within a minute and about 170 sets of three or more distinct violations by one client on one URI within 30 minutes a day, and passes after one or two distinct blocks. Only the complete ordered chain never occurs in background: after three or more distinct blocks by one client on one URI, that client's later requests to the same URI within 30 minutes are violations again, never a pass.",
  generatorId: 'web-f5-advanced-waf',
  eventTypes: [
    {
      id: 'Successful Request',
      description: 'Request passed (act=passed)',
      frequency: '92.4% of records',
      category: 'web',
    },
    {
      id: 'Illegal HTTP status in response',
      description: 'Backend status 403, 409 or 500, alerted',
      frequency: '2.2% of records',
      category: 'intrusion_detection',
    },
    {
      id: '200000098',
      description: 'XSS script tag (Parameter) signature',
      frequency: '1.1% blocked, 0.2% alerted',
      category: 'intrusion_detection',
    },
    {
      id: '200002273',
      description: 'SQL-INJ exec() signature',
      frequency: '1.1% blocked, 0.2% alerted',
      category: 'intrusion_detection',
    },
    {
      id: 'Illegal URL',
      description: 'Probe for a file that does not exist',
      frequency: '0.8% blocked, 0.1% alerted',
      category: 'intrusion_detection',
    },
    {
      id: 'Host header contains IP address',
      description: 'HTTP protocol compliance failed',
      frequency: '0.8% blocked, 0.1% alerted',
      category: 'intrusion_detection',
    },
    {
      id: '200021069',
      description: 'Automated client access "wget" signature',
      frequency: '0.5% blocked, 0.1% alerted',
      category: 'intrusion_detection',
    },
    {
      id: 'Illegal query string length',
      description: 'Oversized query string',
      frequency: '0.5% blocked, 0.1% alerted',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'One BIG-IP unit protects four virtual servers for 360 client addresses in 198.51.100.0/24 and 192.0.2.0/24, each with a fixed request weight (0.2-8), a browser user agent and a country code. About 15,000 requests a day, with daily totals varying by about 3%: browsing follows a daily curve by UTC hour (160-310 requests an hour at 00-05, 870-1,030 at 10-17 with the peak at 13:00), while attack traffic stays flat. Every day has the same hourly curve; there is no weekly cycle.',
    'Browsing (about 1,800 sessions a day): a client picked by a skewed weight requests 1-60 URIs of one application with lognormal gaps (median about 12 s in the afternoon). Backend 403, 409 and 500 raise alerted Illegal HTTP status, and about 0.6% of dynamic requests trip a violation, often followed by a retry of the same URI within a minute or two that is blocked again or passes.',
    'Automated attack bursts (about 130 a day, evenly around the clock) send signature and violation payloads to one to six URIs of an application and probe for files that do not exist; about a third of attacked URIs also get one plain request, usually early in the sequence. Blocked requests carry cn1=0 and others the backend status; externalId grows by random steps and suid is shared within a session or burst.',
    'After a block with two versus three or more distinct violations on a URI, the next request of that client within a minute is another violation on that URI in about 60% versus 58% of cases and goes to another URI in about 14% versus 16%; about 8% and 5% of blocks after one or two distinct violations are followed within a minute by a pass on the same URI. A passed request alone does not prove a bypass or data access.',
    'Requests of one session or attack burst are never closer together than the site-wide request spacing: at night consecutive requests of one client are typically about 20 s apart, against about 12 s in the afternoon, and automated payload sequences are slowed the same way. The syslog header time equals rt or is one second later; times are UTC with whole-second resolution. With anomaly_mode on, counts of blocked sequences with three or more distinct violations by one client on one URI are about one per episode higher.',
    'The layout is the ASM 11.3.0 CEF request message published by F5; non-signature violation headers follow the 10.1.0 ArcSight guide and third-party 11.6.1 and 15.1 raw logs, and severities 5 and 2 and the syslog PRI mapping are inferred. Keys added in 14.x and later, such as violation_rating and microservice, are not modelled, and SIEM parser compatibility (KUMA, Elastic CEF) is untested.',
    'One violation per request and three documented signature IDs; multi-violation requests, violation_details, brute force, web scraping, DoS and bot defense messages, request bodies and XFF values are absent. geo_location is a synthetic country per client, and rates, weights, sessions and payloads are synthetic. Episodes are weighted to busy hours more strongly than background and use a frequent browsing client, whereas ordinary attack bursts come from any client with equal probability, so most client addresses trip a violation within a few days.',
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
      title: 'Blocked XSS request, second step of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T14:05:48+00:00", "destination": {"ip": "203.0.113.10", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "blocked", "category": ["web", "intrusion_detection"], "code": "200000098", "dataset": "f5.asm", "kind": "alert", "original": "\u003c131\u003eSep  1 14:05:48 bigip-waf-01.example.com ASM:CEF:0|F5|ASM|11.3.0|200000098|XSS script tag (Parameter)|5|dvchost=bigip-waf-01.example.com dvc=10.60.0.5 cs1=shop-web cs1Label=policy_name cs2=/Common/shop-web cs2Label=http_class_name deviceCustomDate1=Jul 25 2026 20:32:05 deviceCustomDate1Label=policy_apply_date externalId=13504540882566727567 act=blocked cn1=0 cn1Label=response_code src=192.0.2.10 spt=49717 dst=203.0.113.10 dpt=443 requestMethod=GET app=HTTPS cs5=N/A cs5Label=x_forwarded_for_header_value rt=Sep 01 2026 14:05:48 deviceExternalId=0 cs4=Cross Site Scripting (XSS) cs4Label=attack_type cs6=US cs6Label=geo_location c6a1= c6a1Label=device_address c6a2= c6a2Label=source_address c6a3= c6a3Label=destination_address c6a4=N/A c6a4Label=ip_address_intelligence msg=N/A suid=45f4c6c0cf4461ac suser=N/A request=/products?page\\=%22%3E\u003cscript src\\=//cdn.example.net/x.js\u003e\u003c/script\u003e cs3Label=full_request cs3=GET /products?page\\=%22%3E\u003cscript src\\=//cdn.example.net/x.js\u003e\u003c/script\u003e HTTP/1.1\\r\\nHost: shop.example.com\\r\\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\\r\\nAccept: text/html,application/xhtml+xml,application/xml;q\\=0.9,*/*;q\\=0.8\\r\\nAccept-Language: en-US,en;q\\=0.9\\r\\nAccept-Encoding: gzip, deflate, br\\r\\nConnection: keep-alive\\r\\n\\r\\n", "outcome": "failure", "severity": 5, "type": ["access", "denied"]}, "f5": {"asm": {"attack_type": "Cross Site Scripting (XSS)", "http_class_name": "/Common/shop-web", "policy_apply_date": "Jul 25 2026 20:32:05", "policy_name": "shop-web", "request_status": "blocked", "response_code": 0, "session_id": "45f4c6c0cf4461ac", "support_id": "13504540882566727567"}}, "http": {"request": {"method": "GET"}}, "network": {"protocol": "https"}, "observer": {"ip": ["10.60.0.5"], "name": "bigip-waf-01.example.com", "product": "ASM", "type": "waf", "vendor": "F5", "version": "11.3.0"}, "related": {"ip": ["192.0.2.10", "203.0.113.10"]}, "rule": {"id": "200000098", "name": "XSS script tag (Parameter)"}, "source": {"geo": {"country_iso_code": "US"}, "ip": "192.0.2.10", "port": 49717}, "url": {"original": "/products?page=%22%3E\u003cscript src=//cdn.example.net/x.js\u003e\u003c/script\u003e", "path": "/products", "query": "page=%22%3E\u003cscript src=//cdn.example.net/x.js\u003e\u003c/script\u003e"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"}}`,
    },
  ],
};
