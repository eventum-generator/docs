/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationNextcloudAudit: GeneratorMeta = {
  slug: 'application-nextcloud-audit',
  displayName: 'Nextcloud Admin Audit',
  category: 'application',
  description:
    'Nextcloud 35.0.0 admin_audit HTTP records from the dedicated audit.log file backend, with each native JSON line in event.original and parsed under nextcloud.audit, for testing detections on logins, file access and public links. Twelve users work in independent sessions over 60 files. Recurring episodes show a guessed password followed by publishing a file for outside access through a public link.',
  dataSource:
    'Nextcloud 35.0.0 admin_audit file backend (data/audit.log), JSON lines',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    '13/13 non-optional native audit fields in event.original',
    'Independent sessions of 12 users with stateful public links',
    'Recurring failed-logins-to-public-link chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user fails password login three times from one home address, a few seconds to about a minute apart, then logs in successfully from that address; minutes later, from the same address and with ordinary operation delays, the user reads a file, creates a public link to it, removes the link's expiration date and changes it from read-only to read and update (3-20 minutes per episode measured). The first episode starts within the first anomaly_interval_hours (at most 24 hours) at a time of day drawn from the user activity curve; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours, with no catch-up; at intervals of 8 hours or less episodes also fall into quiet hours. User, home address and file differ from the previous episode and appear in that user's ordinary sessions. Only an ordinary permission change that would complete the full order for one user and address within 60 minutes of the first failure, in any combination of its records, is left out, and the session goes on unchanged.",
  generatorId: 'nextcloud-audit',
  eventTypes: [
    {
      id: 'Login attempt',
      description: 'Password login request',
      frequency: '10.3% measured share',
      category: 'authentication',
    },
    {
      id: 'Login successful',
      description: 'Login result: password accepted',
      frequency: '5.0% measured share',
      category: 'authentication',
    },
    {
      id: 'Login failed',
      description: 'Login result: password rejected',
      frequency: '5.4% measured share',
      category: 'authentication',
    },
    {
      id: 'File accessed',
      description: 'DAV file read',
      frequency: '46.1% measured share',
      category: 'file',
    },
    {
      id: 'File written to',
      description: 'DAV file update',
      frequency: '18.6% measured share',
      category: 'file',
    },
    {
      id: 'Shared via link',
      description: 'Public link creation',
      frequency: '6.8% measured share',
      category: 'file',
    },
    {
      id: 'Expiration removed',
      description: 'Public link expiration removal',
      frequency: '4.8% measured share',
      category: 'configuration',
    },
    {
      id: 'Permissions changed',
      description:
        'Public link changed from read-only (1) to read and update (3)',
      frequency: '3.1% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    "Twelve users work in sessions at their own random rates, mostly during UTC working hours, from the office address or one of two home addresses, over 60 files. About a third of sessions start with a password login, about 15% of those after one to five mistyped passwords; sessions read and write the user's files minutes apart and create read-only public links, later removing a link's expiration or allowing updates through it. Stale sync clients retry outdated passwords and outside addresses guess passwords a few times a day.",
    'A login attempt and its result share one reqId and native timestamp; separate requests never reuse that ID, so it does not prove a persistent session. Public link IDs grow by one to four per link, each property of a link changes at most once, and at most 64 links are retained.',
    'Every part of the chain occurs in background: per 7 days, 87-119 cases of three failed logins of one user and address within 10 minutes, 7-17 cases of three failures followed by a success within an hour, 128-156 reads followed by a link to the same file, and 37-78 links whose expiration was removed and permissions changed within an hour of creation.',
    'Field coverage is 13/13 non-optional native fields of the tagged 35.0.0 serializer, in its field order with compact separators. No captured production audit.log line from a running 35.0.0 server was available, so request routes and end-to-end native bytes remain unconfirmed; the native version 35.0.0.10 is the internal four-part number.',
    'The modeled sharing policy sets a default public-link expiration without enforcing it and permits editing a public file link. Rates, session shapes and addresses are synthetic; timestamps have one-second resolution, and KUMA compatibility (it lists Nextcloud 26.0.4 via syslog) is not asserted.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'cloud-01.corp.example',
      description: 'ECS server host name; also fixes the user organisation',
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
      name: 'first_share_id',
      defaultValue: '32019',
      description: 'Public-link IDs start after this value',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 3 to 8,760',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring anomaly episodes to the background; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'Public link creation from the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:21:18+00:00",
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
    "original": "{\"reqId\":\"te22OTIhWKqMTpIpkzI5\",\"level\":1,\"time\":\"2026-09-25T12:21:18+00:00\",\"remoteAddr\":\"198.51.100.30\",\"user\":\"konstantin\",\"app\":\"admin_audit\",\"method\":\"POST\",\"url\":\"/ocs/v2.php/apps/files_sharing/api/v1/shares\",\"scriptName\":\"/ocs/v2.php\",\"message\":\"The file \\\"/konstantin/files/IT/Inventory-01.pdf\\\" with ID \\\"14090\\\" has been shared via link with permissions \\\"1\\\" (Share ID: 32049)\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36\",\"version\":\"35.0.0.10\",\"data\":{\"app\":\"admin_audit\"}}",
    "outcome": "success",
    "type": [
      "creation"
    ]
  },
  "file": {
    "path": "/konstantin/files/IT/Inventory-01.pdf"
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
  "message": "The file \"/konstantin/files/IT/Inventory-01.pdf\" with ID \"14090\" has been shared via link with permissions \"1\" (Share ID: 32049)",
  "nextcloud": {
    "audit": {
      "app": "admin_audit",
      "data": {
        "app": "admin_audit"
      },
      "level": 1,
      "message": "The file \"/konstantin/files/IT/Inventory-01.pdf\" with ID \"14090\" has been shared via link with permissions \"1\" (Share ID: 32049)",
      "method": "POST",
      "remoteAddr": "198.51.100.30",
      "reqId": "te22OTIhWKqMTpIpkzI5",
      "scriptName": "/ocs/v2.php",
      "time": "2026-09-25T12:21:18+00:00",
      "url": "/ocs/v2.php/apps/files_sharing/api/v1/shares",
      "user": "konstantin",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
      "version": "35.0.0.10"
    }
  },
  "related": {
    "ip": [
      "198.51.100.30"
    ],
    "user": [
      "konstantin"
    ]
  },
  "source": {
    "ip": "198.51.100.30"
  },
  "tags": [
    "nextcloud",
    "admin_audit"
  ],
  "url": {
    "path": "/ocs/v2.php/apps/files_sharing/api/v1/shares"
  },
  "user": {
    "name": "konstantin"
  },
  "user_agent": {
    "original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"
  }
}`,
    },
  ],
};
