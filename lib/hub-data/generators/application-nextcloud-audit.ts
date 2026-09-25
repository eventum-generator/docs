/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationNextcloudAudit: GeneratorMeta = {
  slug: 'application-nextcloud-audit',
  displayName: 'Nextcloud Admin Audit',
  category: 'application',
  description:
    'ECS events with complete native Nextcloud admin_audit JSON, including a switchable public-link exposure chain.',
  dataSource: 'Nextcloud 35 audit.log JSON',
  format: ['JSON', 'ECS'],
  eventCount: 7,
  templateCount: 1,
  generatorId: 'application-nextcloud-audit',
  highlights: [
    '12/12 native audit fields',
    'Nextcloud 35 audit.log JSON',
    'Three failed logins, success, file read, public-link creation, expiration removal and permission change.',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed logins, success, file read, public-link creation, expiration removal and permission change.',
  eventTypes: [
    {
      id: 'Login successful',
      description: 'User login',
      frequency: '15% routine',
      category: 'authentication',
    },
    {
      id: 'File accessed',
      description: 'File read',
      frequency: '55% routine',
      category: 'file',
    },
    {
      id: 'File written to',
      description: 'File update',
      frequency: '20% routine',
      category: 'file',
    },
    {
      id: 'Shared via link',
      description: 'Public-link creation',
      frequency: '10% routine',
      category: 'file',
    },
    {
      id: 'Login failed',
      description: 'Repeated login failure',
      frequency: 'Anomaly only',
      category: 'authentication',
    },
    {
      id: 'Expiration removed',
      description: 'Public-share expiry removed',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
    {
      id: 'Permissions changed',
      description: 'Public-share permissions widened',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'All 12 native audit.log fields under nextcloud.audit and exact JSON in event.original.',
    'Fifty routine file paths and IDs.',
    'Each reqId identifies one HTTP request, not the full chain.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'cloud-01.corp.example',
      description: 'ECS host name',
    },
    {
      name: 'server_version',
      defaultValue: '35.0.0.1',
      description: 'Logged Nextcloud version',
    },
    { name: 'normal_user', defaultValue: 'alice', description: 'Routine user' },
    {
      name: 'normal_ip',
      defaultValue: '10.90.1.20',
      description: 'Routine client',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'finance_admin',
      description: 'Chain user',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'Chain client',
    },
    {
      name: 'anomaly_file',
      defaultValue: '/finance_admin/files/Finance/Payroll/2026-Q3.xlsx',
      description: 'Target file path',
    },
    {
      name: 'anomaly_file_id',
      defaultValue: '84521',
      description: 'Target file ID',
    },
    {
      name: 'anomaly_share_id',
      defaultValue: '32019',
      description: 'Starting public share ID; increments per chain',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include anomaly chain; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Public link in the anomalous chain',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:26:19+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "share-create",
    "category": [
      "file"
    ],
    "dataset": "nextcloud.audit",
    "kind": "event",
    "original": "{\"app\": \"admin_audit\", \"level\": 1, \"message\": \"The file \\\"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\\\" with ID \\\"84521\\\" has been shared via link with permissions \\\"1\\\" (Share ID: 32019)\", \"method\": \"POST\", \"remoteAddr\": \"10.99.3.51\", \"reqId\": \"GZtwFBJlRxjbQxducFQG\", \"scriptName\": \"/ocs/v2.php\", \"time\": \"2026-09-25T12:26:19+00:00\", \"url\": \"/ocs/v2.php/apps/files_sharing/api/v1/shares\", \"user\": \"finance_admin\", \"userAgent\": \"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36\", \"version\": \"35.0.0.1\"}",
    "outcome": "success",
    "type": [
      "creation"
    ]
  },
  "host": {
    "name": "cloud-01.corp.example"
  },
  "http": {
    "request": {
      "method": "POST"
    }
  },
  "log": {
    "level": "info"
  },
  "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32019)",
  "nextcloud": {
    "audit": {
      "app": "admin_audit",
      "level": 1,
      "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32019)",
      "method": "POST",
      "remoteAddr": "10.99.3.51",
      "reqId": "GZtwFBJlRxjbQxducFQG",
      "scriptName": "/ocs/v2.php",
      "time": "2026-09-25T12:26:19+00:00",
      "url": "/ocs/v2.php/apps/files_sharing/api/v1/shares",
      "user": "finance_admin",
      "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
      "version": "35.0.0.1"
    }
  },
  "related": {
    "ip": [
      "10.99.3.51"
    ],
    "user": [
      "finance_admin"
    ]
  },
  "source": {
    "ip": "10.99.3.51"
  },
  "tags": [
    "nextcloud",
    "admin_audit"
  ],
  "url": {
    "path": "/ocs/v2.php/apps/files_sharing/api/v1/shares"
  },
  "user": {
    "name": "finance_admin"
  },
  "user_agent": {
    "original": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
  }
}`,
    },
  ],
};
