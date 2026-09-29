/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkFortinetFortiadc: GeneratorMeta = {
  slug: 'network-fortinet-fortiadc',
  displayName: 'Fortinet FortiADC 7.1 SLB HTTP Traffic',
  category: 'network',
  description:
    'Traffic logs of one FortiADC 7.1 HTTP virtual server (traffic/slb_http, log ID 0101008001) balancing an internal web portal over three real servers, as ECS JSON with the complete native key=value record in event.original and its fields under fortinet.fortiadc. Sixty clients send about 5,100 requests a day on a UTC working day. For SOC analysts and detection engineers who need load-balancer access traffic with a recurring suspicious /admin access pattern.',
  dataSource:
    'Fortinet FortiADC 7.1 traffic/slb_http log, one HTTP virtual server',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'fortiadc',
  highlights: [
    'Complete native key=value record in event.original',
    '60 clients, about 5,100 requests a day on a UTC working day',
    'Recurring /admin 404, 403, 200 chain across three real servers',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "An administrator's browser requests /admin three times in a row and gets 404 from real server A, 403 from real server B and 200 from real server C, all within 15 minutes. The chain is one /admin run inside an ordinary session of an administrator with no session open, never the previous episode's; the day's request count stays the same. The first episode starts within the first anomaly_interval_hours (at most 24 h) at a time drawn from the browser hour curve, not at a fixed offset from the start; each next one is due anomaly_interval_hours after the actual start of the previous one and starts in a window of a quarter of the interval (at most 6 h) centred on the due time, weighted towards office hours; the chain starts within a minute or two of its drawn time in office hours, up to about 20 minutes off at night. Missed episodes are not caught up. With the default 24 h, chains start 21-27 h apart, mostly in office hours, and last about 20 s to a few minutes; at intervals of 8 h or less they also cover night hours. Every chain client, client-server pair and /admin 404, 403 and 200 also occur in background; only the full ordered sequence is not: an ordinary /admin request that would complete it gets another answer the client's role receives for /admin.",
  eventTypes: [
    {
      id: '0101008001',
      description:
        'type=traffic subtype=slb_http: one HTTP request through the virtual server, with client, virtual server, real server, request line and response code',
      frequency: '100% of records',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Sixty clients (48 office users and 8 administrators on browsers, 4 service scripts) send about 5,100 requests a day. Browser traffic follows a UTC working day: about 40 requests an hour at night (20:00-06:00), 120 at 06:00-07:00 and 18:00-20:00, 250 at 07:00-08:00 and 17:00-18:00 and 380 at 08:00-17:00; the service scripts send about 400 a day evenly around the clock. Daily totals vary by about 3%; every day follows the same curve, with no quieter weekends or holidays.',
    "Requests come in client sessions of a skewed size (median 9, mean 15), one open session per client, a median 34 s apart in office hours and about 2 minutes at night with a long tail; a real user's click pace does not slow down at night. Each request opens a new connection with probability 0.6, balanced to a random real server.",
    'Request shares: /api/items 22.6%, /assets/app.js 12.7%, /api/orders 11.5%, /assets/app.css 10.8%, /api/items/search 10.1%, /assets/logo.png 7.5%, / 6.4%, /admin 5.8%, /login 4.8%, /favicon.ico and /index.html 3.2% each, /logout 1.5%, each path with its own response mix.',
    'Administrators spend about a quarter to a third of their requests on /admin and mostly get 200; office users and scripts request it rarely and mostly get 403 or 404. Every /admin request is followed by another with probability 0.3 (reload or retry), so mixed /admin answers from different real servers within minutes are ordinary traffic: over 96 hours about 45 pairs of 404 then 403 and about 100 of 403 then 200 for one client on two servers within 15 minutes.',
    'msg_id is a device-wide 16-digit counter that advances by random steps, standing in for records of other log types and virtual servers.',
    'Only traffic/slb_http is generated, the one traffic record with a complete raw example in the 7.1 log reference; the reference page title says 0100008001 but its examples carry 0101008001, which the pack follows. One HTTP virtual server on port 80, with no HTTPS, persistence, content routing or health-check effects. No syslog header is generated.',
    'user, usrgrp and auth_status are none and countries Reserved, as in the vendor examples. The duration unit is undocumented; timestamps are UTC with one-second resolution and several records can share a second. With anomaly_mode true, administrators get about one more /admin 404, 403 and 200 per episode. The response mix, byte sizes and client behavior are synthetic workload settings, not measured FortiADC rates.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'fortiadc-01.example.test',
      description: 'ECS host.name of the appliance',
    },
    {
      name: 'virtual_server',
      defaultValue: 'vs_web',
      description: 'Virtual server name (policy)',
    },
    {
      name: 'virtual_ip',
      defaultValue: '10.41.20.15',
      description: 'Virtual server address (dst)',
    },
    {
      name: 'virtual_port',
      defaultValue: '80',
      description: 'Virtual server port (dst_port)',
    },
    {
      name: 'http_host',
      defaultValue: 'portal.example.test',
      description: 'Host header of the requests (http_host)',
    },
    {
      name: 'snat_ip',
      defaultValue: '10.41.30.1',
      description: 'Source NAT address toward the real servers (trans_src)',
    },
    {
      name: 'real_servers',
      defaultValue:
        'app01 10.41.30.11, app02 10.41.30.12, app03 10.41.30.13, port 80',
      description:
        'Pool members (real_server, trans_dst, trans_dst_port); the chain needs at least three',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the anomaly chain; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'The 200 step of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T16:43:15+00:00", "destination": {"ip": "10.41.20.15", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"action": "slb-http-response", "category": ["web"], "code": "0101008001", "dataset": "fortinet_fortiadc.log", "kind": "event", "original": "date=2026-09-01 time=16:43:15 log_id=0101008001 type=traffic subtype=slb_http pri=information vd=root msg_id=8892571232853858 duration=14 ibytes=637 obytes=3177 proto=6 service=http src=10.41.2.20 src_port=55066 dst=10.41.20.15 dst_port=80 trans_src=10.41.30.1 trans_src_port=22117 trans_dst=10.41.30.13 trans_dst_port=80 policy=vs_web action=none http_method=get http_host=portal.example.test http_agent=Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0 http_url=/admin http_qry=none http_referer=http://portal.example.test/ http_cookie=sessionid=bf3113a1f1fe9a1e3a124a9fbd1627bd http_retcode=200 user=none usrgrp=none auth_status=none srccountry=Reserved dstcountry=Reserved real_server=app03", "outcome": "success", "type": ["access"]}, "fortinet": {"fortiadc": {"action": "none", "auth_status": "none", "date": "2026-09-01", "dst": "10.41.20.15", "dst_port": 80, "dstcountry": "Reserved", "duration": 14, "http_agent": "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0", "http_cookie": "sessionid=bf3113a1f1fe9a1e3a124a9fbd1627bd", "http_host": "portal.example.test", "http_method": "get", "http_qry": "none", "http_referer": "http://portal.example.test/", "http_retcode": 200, "http_url": "/admin", "ibytes": 637, "log_id": "0101008001", "msg_id": 8892571232853858, "obytes": 3177, "policy": "vs_web", "pri": "information", "proto": 6, "real_server": "app03", "service": "http", "src": "10.41.2.20", "src_port": 55066, "srccountry": "Reserved", "subtype": "slb_http", "time": "16:43:15", "trans_dst": "10.41.30.13", "trans_dst_port": 80, "trans_src": "10.41.30.1", "trans_src_port": 22117, "type": "traffic", "user": "none", "usrgrp": "none", "vd": "root"}}, "host": {"name": "fortiadc-01.example.test"}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "network": {"protocol": "http", "transport": "tcp"}, "related": {"ip": ["10.41.2.20", "10.41.20.15", "10.41.30.13"]}, "source": {"ip": "10.41.2.20", "port": 55066}, "url": {"path": "/admin"}, "user_agent": {"original": "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"}}`,
    },
  ],
};
