/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkFortinetFortiadc: GeneratorMeta = {
  slug: 'network-fortinet-fortiadc',
  displayName: 'Fortinet FortiADC 7.1',
  category: 'network',
  description:
    'FortiADC SLB HTTP key-value traffic with inconsistent /admin responses across real servers.',
  dataSource: 'Fortinet FortiADC 7.1 SLB HTTP traffic log',
  format: ['Syslog', 'KV', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'network-fortinet-fortiadc',
  highlights: [
    '37 native fields from the FortiADC 7.1 traffic sample',
    'Virtual and real server correlation',
    '404, 403 and 200 for /admin across three backends',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client requests /admin through one virtual server; three real servers return 404, 403 and 200.',
  eventTypes: [
    {
      id: '0101008001',
      description: 'SLB HTTP traffic and response',
      frequency: 'All events; 200/301/404/500 background mix',
      category: 'web',
    },
  ],
  realismFeatures: [
    'FortiADC 7.1 key-value traffic body in event.original',
    'Policy, VIP and real-server address remain consistent',
    'Background requests avoid the anomaly client and path',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'fortiadc-01.example.test',
      description: 'ADC hostname in ECS',
    },
    {
      name: 'virtual_server',
      defaultValue: 'vs_web',
      description: 'Native policy value',
    },
    {
      name: 'virtual_ip',
      defaultValue: '10.41.20.15',
      description: 'Virtual-server destination',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'probe_source_ip',
      defaultValue: '10.41.9.77',
      description: 'Stable chain source',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated /admin probe',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:50:19+00:00",
  "destination": {
    "ip": "10.41.20.15",
    "port": 80
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "slb-http-response",
    "category": [
      "web"
    ],
    "code": "0101008001",
    "dataset": "fortinet_fortiadc.log",
    "kind": "event",
    "original": "date=2026-09-25 time=13:50:19 log_id=0101008001 type=traffic subtype=slb_http pri=information vd=root msg_id=39233960 duration=2 ibytes=337 obytes=586 proto=6 service=http src=10.41.9.77 src_port=59614 dst=10.41.20.15 dst_port=80 trans_src=10.41.30.1 trans_src_port=29613 trans_dst=10.41.30.11 trans_dst_port=80 policy=vs_web action=none http_method=get http_host=10.41.20.15 http_agent=curl/8.0 http_url=/admin http_qry=none http_referer=none http_cookie=none http_retcode=404 user=none usrgrp=none auth_status=none srccountry=Reserved dstcountry=Reserved real_server=app01",
    "type": [
      "access"
    ]
  },
  "fortinet": {
    "fortiadc": {
      "action": "none",
      "auth_status": "none",
      "date": "2026-09-25",
      "dst": "10.41.20.15",
      "dst_port": 80,
      "dstcountry": "Reserved",
      "duration": 2,
      "http_agent": "curl/8.0",
      "http_cookie": "none",
      "http_host": "10.41.20.15",
      "http_method": "get",
      "http_qry": "none",
      "http_referer": "none",
      "http_retcode": 404,
      "http_url": "/admin",
      "ibytes": 337,
      "log_id": "0101008001",
      "msg_id": 39233960,
      "obytes": 586,
      "policy": "vs_web",
      "pri": "information",
      "proto": 6,
      "real_server": "app01",
      "service": "http",
      "src": "10.41.9.77",
      "src_port": 59614,
      "srccountry": "Reserved",
      "subtype": "slb_http",
      "time": "13:50:19",
      "trans_dst": "10.41.30.11",
      "trans_dst_port": 80,
      "trans_src": "10.41.30.1",
      "trans_src_port": 29613,
      "type": "traffic",
      "user": "none",
      "usrgrp": "none",
      "vd": "root"
    }
  },
  "host": {
    "name": "fortiadc-01.example.test"
  },
  "http": {
    "request": {
      "method": "GET"
    },
    "response": {
      "status_code": 404
    }
  },
  "network": {
    "protocol": "http",
    "transport": "tcp"
  },
  "related": {
    "ip": [
      "10.41.9.77",
      "10.41.20.15",
      "10.41.30.11"
    ]
  },
  "source": {
    "ip": "10.41.9.77",
    "port": 59614
  },
  "url": {
    "path": "/admin"
  }
}`,
    },
  ],
};
