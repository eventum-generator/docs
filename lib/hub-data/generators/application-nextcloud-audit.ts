/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationNextcloudAudit: GeneratorMeta = {
  slug: 'application-nextcloud-audit',
  displayName: 'Nextcloud Admin Audit',
  category: 'application',
  description:
    'Nextcloud 35.0.0 admin_audit JSON from the dedicated audit.log file, with routine HTTP activity and a switchable one-time sequence.',
  dataSource: 'Nextcloud 35.0.0 admin_audit file JSON',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 13,
  highlights: [
    '13/13 non-optional native audit fields in event.original',
    'Request-level login attempt and result correlation',
    'Stateful public links and 60 existing files',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One 12-record sequence after 250 background records: three failed login request pairs, one successful pair, a file read, public-link creation, expiration removal and permission change. The target user, IP and file also occur in routine traffic; reqId joins only each attempt/result pair.',
  generatorId: 'application-nextcloud-audit',
  eventTypes: [
    {
      id: 'Login attempt',
      description: 'Password login request',
      frequency: '10% routine selection weight',
      category: 'authentication',
    },
    {
      id: 'Login successful',
      description: 'Password accepted for a login request',
      frequency: '88% of routine logins',
      category: 'authentication',
    },
    {
      id: 'Login failed',
      description: 'Password rejected for a login request',
      frequency: '12% of routine logins plus target background',
      category: 'authentication',
    },
    {
      id: 'File accessed',
      description: 'DAV file read',
      frequency: '53% routine selection weight',
      category: 'file',
    },
    {
      id: 'File written to',
      description: 'DAV file update',
      frequency: '23% routine selection weight',
      category: 'file',
    },
    {
      id: 'Shared via link',
      description: 'Public-link creation',
      frequency: '9% routine selection weight',
      category: 'file',
    },
    {
      id: 'Expiration removed',
      description: 'Public-link expiration removal',
      frequency: '3% routine selection weight',
      category: 'configuration',
    },
    {
      id: 'Permissions changed',
      description: 'Public-link permissions changed from 1 to 3',
      frequency: '2% routine selection weight',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Native compact JSON follows the tagged 35.0.0 serializer order and is parsed under nextcloud.audit.',
    'Login attempt and result share one reqId and timestamp; separate requests use distinct IDs.',
    'Ordinary link creation and one-time updates use bounded share state; the target also appears in background.',
    'A running 35.0.0 audit.log capture is still needed to confirm end-to-end native bytes and deployment-specific routes.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'cloud-01.corp.example',
      description: 'ECS server host name',
    },
    {
      name: 'server_version',
      defaultValue: '35.0.0.10',
      description: 'Native four-part internal Nextcloud version',
    },
    {
      name: 'audit_log_path',
      defaultValue: '/var/www/html/data/audit.log',
      description: 'ECS path of collected audit file',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'finance_admin',
      description: 'User used in routine traffic and the sequence',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'Remote IP used in routine traffic and the sequence',
    },
    {
      name: 'anomaly_file',
      defaultValue: '/finance_admin/files/Finance/Payroll/2026-Q3.xlsx',
      description: 'File used in routine traffic and the sequence',
    },
    {
      name: 'anomaly_file_id',
      defaultValue: '84521',
      description: 'Native file ID for the target file',
    },
    {
      name: 'first_share_id',
      defaultValue: '32019',
      description: 'First public-link ID for routine and sequence links',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '250',
      description: 'Background records before the one-time sequence',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the one-time sequence; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Nextcloud 35.0.0 public-link audit event from generator output',
      json: String.raw`{
  "@timestamp": "2026-09-25T00:04:19+00:00",
  "agent": {
    "name": "cloud-01.corp.example",
    "type": "filebeat"
  },
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
    "original": "{\"reqId\":\"bY4sfp3P0V99Zwz9kRSa\",\"level\":1,\"time\":\"2026-09-25T00:04:19+00:00\",\"remoteAddr\":\"10.99.3.51\",\"user\":\"finance_admin\",\"app\":\"admin_audit\",\"method\":\"POST\",\"url\":\"/ocs/v2.php/apps/files_sharing/api/v1/shares\",\"scriptName\":\"/ocs/v2.php\",\"message\":\"The file \\\"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\\\" with ID \\\"84521\\\" has been shared via link with permissions \\\"1\\\" (Share ID: 32034)\",\"userAgent\":\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36\",\"version\":\"35.0.0.10\",\"data\":{\"app\":\"admin_audit\"}}",
    "outcome": "success",
    "type": [
      "creation"
    ]
  },
  "file": {
    "path": "/finance_admin/files/Finance/Payroll/2026-Q3.xlsx"
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
    "file": {
      "path": "/var/www/html/data/audit.log"
    },
    "level": "info"
  },
  "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32034)",
  "nextcloud": {
    "audit": {
      "app": "admin_audit",
      "data": {
        "app": "admin_audit"
      },
      "level": 1,
      "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32034)",
      "method": "POST",
      "remoteAddr": "10.99.3.51",
      "reqId": "bY4sfp3P0V99Zwz9kRSa",
      "scriptName": "/ocs/v2.php",
      "time": "2026-09-25T00:04:19+00:00",
      "url": "/ocs/v2.php/apps/files_sharing/api/v1/shares",
      "user": "finance_admin",
      "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
      "version": "35.0.0.10"
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
    "original": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"
  }
}`,
    },
  ],
};
