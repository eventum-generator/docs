/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkFortinetFortiadc: GeneratorMeta = {
  slug: 'network-fortinet-fortiadc',
  displayName: 'Fortinet FortiADC 7.1 SLB HTTP Traffic',
  category: 'network',
  description:
    'Traffic logs of one FortiADC 7.1 HTTP virtual server (traffic/slb_http, log ID 0101008001) balancing an internal web portal over three real servers, as ECS JSON with the complete native key=value record in event.original and its fields under fortinet.fortiadc. For SOC analysts and detection engineers who need load-balancer access traffic with a recurring suspicious /admin access pattern.',
  dataSource:
    'Fortinet FortiADC 7.1 traffic/slb_http log, one HTTP virtual server',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'fortiadc',
  highlights: [
    'Complete native key=value record in event.original',
    '60 clients with independent sessions across three real servers',
    'Recurring /admin 404, 403, 200 chain across real servers',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client requests /admin three times in a row within 15 minutes and gets 404 from real server A, 403 from real server B and 200 from real server C. The chain replaces one /admin retry run inside an ordinary session of that client. Episodes recur every 24 hours by default (anomaly_interval_hours, 6 to 8,760): the first starts within the first interval (at most 24 h) at a time drawn from the activity curve; each next one is due one interval after the previous actual start and starts in a window of a quarter of the interval (at most 6 h) centred on the due time, weighted towards busy hours; missed episodes are not caught up. The client is drawn among idle clients, never the previous one. Every element occurs in background; an ordinary /admin request that would complete the sequence within 15 minutes is answered 403 instead of 200.',
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
    'Sixty clients (48 office users, 8 administrators, 4 service scripts) start sessions independently, thinned by an hour-of-day curve with office hours up to nine times the night rate. Sessions hold a skewed number of requests (median 9) with skewed gaps, and each connection is balanced to a random real server.',
    'Requests are measured at /api/items 22.4%, the three /assets/ files 32.4%, / and /index.html 10.5%, /login 4.7%, /admin 2.8% and /logout 1.7%, each path with its own response mix.',
    'Administrators request /admin often and mostly get 200; users and scripts rarely, mostly getting 403 or 404. Every /admin request is followed by another with probability 0.3, so mixed /admin answers from different real servers within minutes are ordinary traffic.',
    'msg_id is a device-wide 16-digit counter that advances by random steps, standing in for records of other log types and virtual servers.',
    'Only traffic/slb_http is generated, the one traffic record with a complete raw example in the 7.1 log reference; the reference page title says 0100008001 but its examples carry 0101008001, which the pack follows. No syslog header is generated.',
    'user, usrgrp and auth_status are none and countries Reserved, as in the vendor examples. The duration unit is undocumented, timestamps are UTC with one-second resolution, and the response mix, byte sizes and client behavior are synthetic workload settings.',
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
      name: 'sessions_per_client_day',
      defaultValue: '6',
      description: 'Mean sessions per client per day',
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
      json: String.raw`{"@timestamp": "2026-09-04T15:58:19+00:00", "destination": {"ip": "10.41.20.15", "port": 80}, "ecs": {"version": "8.17.0"}, "event": {"action": "slb-http-response", "category": ["web"], "code": "0101008001", "dataset": "fortinet_fortiadc.log", "kind": "event", "original": "date=2026-09-04 time=15:58:19 log_id=0101008001 type=traffic subtype=slb_http pri=information vd=root msg_id=8897080279353243 duration=3 ibytes=523 obytes=11489 proto=6 service=http src=10.41.1.141 src_port=65368 dst=10.41.20.15 dst_port=80 trans_src=10.41.30.1 trans_src_port=30673 trans_dst=10.41.30.11 trans_dst_port=80 policy=vs_web action=none http_method=get http_host=portal.example.test http_agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0 http_url=/admin http_qry=none http_referer=http://portal.example.test/ http_cookie=sessionid=d749f6ec5c322d52841438b2ea32543b http_retcode=200 user=none usrgrp=none auth_status=none srccountry=Reserved dstcountry=Reserved real_server=app01", "outcome": "success", "type": ["access"]}, "fortinet": {"fortiadc": {"action": "none", "auth_status": "none", "date": "2026-09-04", "dst": "10.41.20.15", "dst_port": 80, "dstcountry": "Reserved", "duration": 3, "http_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0", "http_cookie": "sessionid=d749f6ec5c322d52841438b2ea32543b", "http_host": "portal.example.test", "http_method": "get", "http_qry": "none", "http_referer": "http://portal.example.test/", "http_retcode": 200, "http_url": "/admin", "ibytes": 523, "log_id": "0101008001", "msg_id": 8897080279353243, "obytes": 11489, "policy": "vs_web", "pri": "information", "proto": 6, "real_server": "app01", "service": "http", "src": "10.41.1.141", "src_port": 65368, "srccountry": "Reserved", "subtype": "slb_http", "time": "15:58:19", "trans_dst": "10.41.30.11", "trans_dst_port": 80, "trans_src": "10.41.30.1", "trans_src_port": 30673, "type": "traffic", "user": "none", "usrgrp": "none", "vd": "root"}}, "host": {"name": "fortiadc-01.example.test"}, "http": {"request": {"method": "GET"}, "response": {"status_code": 200}}, "network": {"protocol": "http", "transport": "tcp"}, "related": {"ip": ["10.41.1.141", "10.41.20.15", "10.41.30.11"]}, "source": {"ip": "10.41.1.141", "port": 65368}, "url": {"path": "/admin"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0"}}`,
    },
  ],
};
