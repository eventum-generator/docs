/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationNextcloudAudit: GeneratorMeta = {
  slug: 'application-nextcloud-audit',
  displayName: 'Nextcloud Admin Audit',
  category: 'application',
  description:
    'Nextcloud 35.0.0 admin_audit JSON from the dedicated audit.log file, with routine HTTP activity and recurring hourly sequences.',
  dataSource: 'Nextcloud 35.0.0 admin_audit file JSON',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    '13/13 non-optional native audit fields in event.original',
    'Request-level login attempt and result correlation',
    'Stateful public links and fresh episode request IDs',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 3600 seconds, a twelve-record episode includes three failed login request pairs, a successful pair, file access, link creation, expiration removal and a permission change. Each episode has fresh request and share IDs; its user, IP, file and action classes also occur in background.',
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
    'Ordinary links have bounded state and one expiration removal and permission update per link.',
    'BLOCKED_RAW_EVIDENCE: a running 35.0.0 audit.log capture is still needed to confirm native bytes and deployment-specific routes.',
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
      description: 'Four-part native log version for Nextcloud 35.0.0',
    },
    {
      name: 'audit_log_path',
      defaultValue: '/var/www/html/data/audit.log',
      description:
        'ECS path of the collected audit file; does not change local generator output',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'finance_admin',
      description: 'User and remote IP used in both background and chain',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.3.51',
      description: 'User and remote IP used in both background and chain',
    },
    {
      name: 'anomaly_file',
      defaultValue: '/finance_admin/files/Finance/Payroll/2026-Q3.xlsx',
      description:
        'File used in both background and chain; keep path under `/<anomaly_user>/files/`',
    },
    {
      name: 'anomaly_file_id',
      defaultValue: '84521',
      description:
        'File used in both background and chain; keep path under `/<anomaly_user>/files/`',
    },
    {
      name: 'first_share_id',
      defaultValue: '32019',
      description: 'First public-link ID for routine and anomaly links',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '3600',
      description:
        'Time between anomaly episode starts; the first follows one interval',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: '`false` emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Nextcloud Admin Audit event from finite generator output',
      json: String.raw`{
  "@timestamp": "2026-09-27T01:00:10+00:00",
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
    "original": "{\"reqId\":\"UeTFWOkH2Q0dZKXMqmdZ\",\"level\":1,\"time\":\"2026-09-27T01:00:10+00:00\",\"remoteAddr\":\"10.99.3.51\",\"user\":\"finance_admin\",\"app\":\"admin_audit\",\"method\":\"POST\",\"url\":\"/ocs/v2.php/apps/files_sharing/api/v1/shares\",\"scriptName\":\"/ocs/v2.php\",\"message\":\"The file \\\"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\\\" with ID \\\"84521\\\" has been shared via link with permissions \\\"1\\\" (Share ID: 32311)\",\"userAgent\":\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36\",\"version\":\"35.0.0.10\",\"data\":{\"app\":\"admin_audit\"}}",
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
  "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32311)",
  "nextcloud": {
    "audit": {
      "app": "admin_audit",
      "data": {
        "app": "admin_audit"
      },
      "level": 1,
      "message": "The file \"/finance_admin/files/Finance/Payroll/2026-Q3.xlsx\" with ID \"84521\" has been shared via link with permissions \"1\" (Share ID: 32311)",
      "method": "POST",
      "remoteAddr": "10.99.3.51",
      "reqId": "UeTFWOkH2Q0dZKXMqmdZ",
      "scriptName": "/ocs/v2.php",
      "time": "2026-09-27T01:00:10+00:00",
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
