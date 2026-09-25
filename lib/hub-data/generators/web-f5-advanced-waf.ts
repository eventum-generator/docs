/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webF5AdvancedWaf: GeneratorMeta = {
  slug: 'web-f5-advanced-waf',
  displayName: 'F5 BIG-IP ASM / Advanced WAF',
  category: 'web-access',
  description:
    'Version-pinned ASM CEF requests with a blocked-to-passed sequence.',
  dataSource: 'F5 BIG-IP ASM 11.3.0 CEF syslog profile',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 2,
  templateCount: 1,
  generatorId: 'web-f5-advanced-waf',
  highlights: [
    'Vendor-published ASM CEF layout',
    'Unique support ID per request',
    'Repeated block then pass',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same source is blocked twice on /admin/export with a wget user agent, then a browser-like request to the same URI is passed.',
  eventTypes: [
    {
      id: 'Successful Request',
      description: 'Request passed security policy',
      frequency: '93% routine; 1 per chain',
      category: 'web',
    },
    {
      id: '200021069',
      description: 'Automated-client signature blocked',
      frequency: '7% routine; 2 per chain',
      category: 'web',
    },
  ],
  realismFeatures: [
    'CEF header is pinned to the vendor-published ASM 11.3.0 sample.',
    'The original CEF line is preserved in event.original; support IDs vary by request.',
    'KUMA Advanced WAF regexp-normalizer compatibility with this CEF profile is unverified.',
  ],
  parameters: [
    {
      name: 'device_name',
      defaultValue: 'bigip-waf-01.corp.example',
      description: 'Syslog sender and ECS host',
    },
    {
      name: 'device_ip',
      defaultValue: '10.60.0.5',
      description: 'BIG-IP management address',
    },
    {
      name: 'device_version',
      defaultValue: '11.3.0',
      description: 'Documented CEF profile version',
    },
    {
      name: 'policy_name',
      defaultValue: 'corporate-web',
      description: 'ASM security policy',
    },
    {
      name: 'policy_class',
      defaultValue: '/Common/corporate-web',
      description: 'HTTP classifier',
    },
    {
      name: 'virtual_server_ip',
      defaultValue: '10.60.20.15',
      description: 'Protected virtual server',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine requests between chains',
    },
    {
      name: 'attack_source_ip',
      defaultValue: '10.60.9.77',
      description: 'Stable chain source',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:31:27+00:00",
  "destination": {
    "ip": "10.60.20.15",
    "port": 443
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "request-blocked",
    "category": [
      "web"
    ],
    "code": "200021069",
    "dataset": "f5.asm",
    "kind": "alert",
    "original": "<131>Sep 25 13:31:27 bigip-waf-01.corp.example ASM:CEF:0|F5|ASM|11.3.0|200021069|Automated client access \"wget\"|5|dvchost=bigip-waf-01.corp.example dvc=10.60.0.5 cs1=corporate-web cs1Label=policy_name cs2=/Common/corporate-web cs2Label=http_class_name externalId=18205860747014045251 act=blocked cn1=0 cn1Label=response_code src=10.60.9.77 spt=50002 dst=10.60.20.15 dpt=443 requestMethod=GET app=HTTPS deviceCustomDate1=Sep 01 2026 00:00:00 deviceCustomDate1Label=policy_apply_date cs5=N/A cs5Label=x_forwarded_for_header_value rt=Sep 25 2026 13:31:27 deviceExternalId=0 cs4=Non-browser Client cs4Label=attack_type cs6=N/A cs6Label=geo_location c6a1= c6a1Label=device_address c6a2= c6a2Label=source_address c6a3= c6a3Label=destination_address c6a4=N/A c6a4Label=ip_address_intelligence msg=N/A suid=cd2a715fedcbbee6 suser=N/A request=/admin/export cs3Label=full_request cs3=GET /admin/export HTTP/1.1\\r\\nHost: app.corp.example\\r\\nUser-Agent: Wget/1.21\\r\\n\\r\\n",
    "outcome": "failure",
    "type": [
      "denied"
    ]
  },
  "f5": {
    "asm": {
      "attack_type": "Non-browser Client",
      "http_class_name": "/Common/corporate-web",
      "policy_name": "corporate-web",
      "request_status": "blocked",
      "support_id": 18205860747014045251
    }
  },
  "host": {
    "ip": [
      "10.60.0.5"
    ],
    "name": "bigip-waf-01.corp.example"
  },
  "http": {
    "request": {
      "method": "GET"
    },
    "response": {
      "status_code": 0
    }
  },
  "related": {
    "ip": [
      "10.60.9.77",
      "10.60.20.15"
    ]
  },
  "source": {
    "ip": "10.60.9.77",
    "port": 50002
  },
  "url": {
    "path": "/admin/export"
  }
}`,
    },
  ],
};
