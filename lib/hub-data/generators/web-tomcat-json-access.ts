/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const webTomcatJsonAccess: GeneratorMeta = {
  slug: 'web-tomcat-json-access',
  displayName: 'Apache Tomcat JSON Access',
  category: 'web-access',
  description:
    'Tomcat JsonAccessLogValve HTTP records with a switchable manager-access and deploy-request chain.',
  dataSource: 'Tomcat JsonAccessLogValve',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'web-tomcat-json-access',
  highlights: [
    '13 JsonAccessLogValve keys',
    'Native string-valued fields',
    'Manager session correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client receives three /manager/html 401 responses, then 200, POSTs a manager deploy request and accesses the deployed path.',
  eventTypes: [
    {
      id: 'HTTP access',
      description: 'Routine request and response',
      frequency: '1 per routine tick',
      category: 'web',
    },
    {
      id: 'Manager 401',
      description: 'Denied manager request',
      frequency: '3 per chain',
      category: 'web',
    },
    {
      id: 'Manager 200',
      description: 'Manager access response',
      frequency: '1 per chain',
      category: 'web',
    },
    {
      id: 'Deploy POST',
      description: 'Manager deploy request',
      frequency: '1 per chain',
      category: 'web',
    },
    {
      id: 'App GET',
      description: 'Request to deployed path',
      frequency: '1 per chain',
      category: 'web',
    },
  ],
  realismFeatures: [
    'Native JsonAccessLogValve record is retained in event.original and tomcat.access.',
    'All valve-rendered values are strings; missing values use - and zero-byte size uses -.',
    'Fifty request samples vary routine paths and status codes.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'tomcat-01.corp.example',
      description: 'Tomcat host name',
    },
    {
      name: 'server_ip',
      defaultValue: '10.120.0.5',
      description: 'Tomcat address',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.4.51',
      description: 'Chain client address',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'manager',
      description: 'Authenticated manager user',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:43:41+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "http-access",
    "category": [
      "web"
    ],
    "dataset": "tomcat.access",
    "kind": "event",
    "original": "{\"elapsedTime\": \"429\", \"localServerName\": \"tomcat-01.corp.example\", \"method\": \"POST\", \"path\": \"/manager/text/deploy\", \"protocol\": \"HTTP/1.1\", \"query\": \"?war=file:/tmp/support.war\\u0026path=/support\", \"remoteAddr\": \"10.99.4.51\", \"request\": \"POST /manager/text/deploy?war=file:/tmp/support.war\\u0026path=/support HTTP/1.1\", \"sessionId\": \"B4MANAGER1\", \"size\": \"142\", \"statusCode\": \"200\", \"time\": \"[25/Sep/2026:12:43:41 +0000]\", \"user\": \"manager\"}",
    "outcome": "success",
    "type": [
      "access"
    ]
  },
  "host": {
    "ip": [
      "10.120.0.5"
    ],
    "name": "tomcat-01.corp.example"
  },
  "http": {
    "request": {
      "method": "POST"
    },
    "response": {
      "bytes": 142,
      "status_code": 200
    },
    "version": "1.1"
  },
  "message": "POST /manager/text/deploy?war=file:/tmp/support.war&path=/support HTTP/1.1",
  "observer": {
    "hostname": "tomcat-01.corp.example",
    "ip": "10.120.0.5",
    "product": "Tomcat",
    "type": "web",
    "vendor": "Apache"
  },
  "related": {
    "ip": [
      "10.99.4.51"
    ],
    "user": [
      "manager"
    ]
  },
  "source": {
    "ip": "10.99.4.51"
  },
  "tags": [
    "tomcat-json-access",
    "preserve_original_event"
  ],
  "tomcat": {
    "access": {
      "elapsedTime": "429",
      "localServerName": "tomcat-01.corp.example",
      "method": "POST",
      "path": "/manager/text/deploy",
      "protocol": "HTTP/1.1",
      "query": "?war=file:/tmp/support.war&path=/support",
      "remoteAddr": "10.99.4.51",
      "request": "POST /manager/text/deploy?war=file:/tmp/support.war&path=/support HTTP/1.1",
      "sessionId": "B4MANAGER1",
      "size": "142",
      "statusCode": "200",
      "time": "[25/Sep/2026:12:43:41 +0000]",
      "user": "manager"
    }
  },
  "url": {
    "path": "/manager/text/deploy",
    "query": "?war=file:/tmp/support.war&path=/support"
  },
  "user": {
    "name": "manager"
  }
}`,
    },
  ],
};
