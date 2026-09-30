/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses from the generator parameters. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webTomcatJsonAccess: GeneratorMeta = {
  displayName: 'Apache Tomcat JSON Access',
  category: 'web-access',
  description:
    'Apache Tomcat 10.1 JsonAccessLogValve records for one application server, preserved in event.original and enriched with ECS fields.',
  dataSource: 'Apache Tomcat JsonAccessLogValve',
  format: ['JSON', 'ECS'],
  highlights: [
    'About 46,800 requests/day',
    'Browser activity peaks at 08:00-18:00 UTC',
    'Eight release-service clients share ordinary and correlated Manager requests',
  ],
  anomalyChain:
    'For one release-service address, three HTTP 401 list responses, an HTTP 200 list response and an HTTP 200 deploy response within 15 minutes. First start within min(interval,24h); later starts are centred on previous start plus interval with width min(interval/4,6h), uniformly across 24h. Consecutive clients differ. HTTP 200 does not establish successful deployment.',
  generatorId: 'tomcat',
  eventTypes: [
    {
      id: 'success',
      description: 'Successful responses, redirects and 304',
      frequency: '93.5%',
      category: 'web-access',
    },
    {
      id: 'missing',
      description: 'Missing resources',
      frequency: '2.2%',
      category: 'web-access',
    },
    {
      id: 'authentication',
      description: 'Authentication challenges',
      frequency: '1.9%',
      category: 'authentication',
    },
    {
      id: 'server-error',
      description: 'Application server errors',
      frequency: '1.3%',
      category: 'web-access',
    },
    {
      id: 'client-error',
      description: 'Other client errors',
      frequency: '1.1%',
      category: 'web-access',
    },
  ],
  realismFeatures: [
    'Native scalar values are strings; absent values and zero-byte bodies use a dash',
    'HTTP/1.1 request sizes and durations vary by class',
    'Manager Basic authentication uses no session ID',
    'Response bodies, deployment results and lifecycle logs are absent; ECS fields are enrichment',
  ],
  slug: 'web-tomcat-json-access',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 5,
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'tomcat-01.corp.example',
      description: 'Application server name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.120.0.5',
      description: 'Application server address',
    },
    {
      name: 'jvm_offset_minutes',
      defaultValue: '0',
      description: 'Offset in the native access-log time',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include correlated manager requests',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Time between episode centers',
    },
    {
      name: 'anomaly_min_interval_hours',
      defaultValue: '1',
      description: 'Lower interval bound',
    },
    {
      name: 'session_pool_cap',
      defaultValue: '200',
      description: 'Maximum concurrent synthetic browser sessions',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-01T00:00:02.000Z", "apache_tomcat": {"access": {"elapsedTime": "23398", "http": {"ident": "-", "useragent": "Go-http-client/2.0"}, "localServerName": "tomcat-01.corp.example", "logicalUserName": "-", "sessionId": "-", "user": "-"}}, "destination": {"bytes": 556}, "ecs": {"version": "8.11.0"}, "event": {"category": ["web"], "dataset": "apache_tomcat.access", "duration": 23398000, "kind": "event", "module": "apache_tomcat", "original": "{\"remoteAddr\":\"10.10.0.51\",\"logicalUserName\":\"-\",\"user\":\"-\",\"time\":\"[01/Sep/2026:00:00:02 +0000]\",\"request\":\"POST /api/v1/auth/token HTTP/1.1\",\"statusCode\":\"200\",\"size\":\"556\",\"elapsedTime\":\"23398\",\"sessionId\":\"-\",\"localServerName\":\"tomcat-01.corp.example\",\"requestHeaders\": {\"Referer\":\"-\",\"User-Agent\":\"Go-http-client/2.0\"}}", "outcome": "success", "type": ["access"]}, "host": {"hostname": "tomcat-01.corp.example", "ip": ["10.120.0.5"], "name": "tomcat-01.corp.example"}, "http": {"request": {"method": "POST"}, "response": {"body": {"bytes": 556}, "status_code": 200}, "version": "1.1"}, "observer": {"product": "Tomcat", "type": "web", "vendor": "Apache"}, "related": {"ip": ["10.10.0.51"]}, "source": {"address": "10.10.0.51", "ip": "10.10.0.51"}, "tags": ["apache_tomcat-access", "preserve_original_event"], "url": {"original": "/api/v1/auth/token", "path": "/api/v1/auth/token"}, "user_agent": {"original": "Go-http-client/2.0"}}`,
    },
  ],
};
