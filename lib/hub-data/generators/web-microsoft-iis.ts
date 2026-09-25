/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webMicrosoftIis: GeneratorMeta = {
  displayName: 'Microsoft IIS Fixed-Format Logs',
  category: 'web-access',
  description:
    'Fixed 15-column IIS access logs with normal web traffic and a correlated sensitive-path discovery and download sequence.',
  dataSource: 'Microsoft IIS Log File Format (HTTP.sys)',
  format: ['JSON', 'ECS', 'IIS fixed'],
  eventCount: 9,
  highlights: [
    '15/15 native IIS columns',
    'Original comma-separated line',
    'Switchable sensitive-download chain',
  ],
  anomalyChain:
    'One client probes backup and admin paths, receives another denial, then downloads a large payroll file from the same IIS server.',
  eventTypes: [
    {
      id: 'Page 200',
      description: 'HTML access',
      frequency: '48% routine weight',
      category: 'web',
    },
    {
      id: 'Asset 200',
      description: 'Static asset',
      frequency: '31% routine weight',
      category: 'web',
    },
    {
      id: 'API 200',
      description: 'API status',
      frequency: '13% routine weight',
      category: 'web',
    },
    {
      id: 'Missing 404',
      description: 'Missing file',
      frequency: '6% routine weight',
      category: 'web',
    },
    {
      id: 'Admin 403',
      description: 'Restricted path',
      frequency: '2% routine weight',
      category: 'web',
    },
    {
      id: 'Discovery to download',
      description: 'Three probes then payroll CSV download',
      frequency: 'Anomaly only',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Exact 15-column fixed IIS field order and comma delimiters.',
    'Local date/time, site instance and HTTP.sys byte and status fields.',
    'Anomaly links four requests by client IP and server.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'WEB-IIS-01',
      description: 'IIS host',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'IIS IP',
    },
    {
      name: 'site_id',
      defaultValue: 'W3SVC1',
      description: 'Site instance',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.77',
      description: 'Unusual web client',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '240',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable correlated chain; false emits background only',
    },
  ],
  slug: 'web-microsoft-iis',
  generatorId: 'web-microsoft-iis',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Large payroll download',
      json: String.raw`{"@timestamp": "2026-09-25T11:45:58+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "iis", "dataset": "iis.access", "category": ["web"], "type": ["access"], "action": "http_request", "outcome": "success", "original": "198.51.100.77, CONTOSO\\svc-reports, 09/25/26, 11:45:58, W3SVC1, WEB-IIS-01, 10.20.0.10, 78, 222, 8341712, 200, 0, GET, /exports/payroll.csv, -"}, "host": {"name": "WEB-IIS-01", "ip": "10.20.0.10"}, "source": {"ip": "198.51.100.77"}, "user": {"name": "CONTOSO\\svc-reports"}, "http": {"request": {"method": "GET", "bytes": 222}, "response": {"status_code": 200, "bytes": 8341712}}, "url": {"path": "/exports/payroll.csv", "query": "-"}, "iis": {"access": {"service": "W3SVC1", "server_name": "WEB-IIS-01", "server_ip": "10.20.0.10", "client_ip": "198.51.100.77", "username": "CONTOSO\\svc-reports", "date": "09/25/26", "time": "11:45:58", "time_taken": 78, "client_bytes_sent": 222, "server_bytes_sent": 8341712, "service_status_code": 200, "windows_status_code": 0, "request_type": "GET", "target": "/exports/payroll.csv", "parameters": "-"}}}`,
    },
  ],
};
