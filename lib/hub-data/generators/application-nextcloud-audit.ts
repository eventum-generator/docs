/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationNextcloudAudit: GeneratorMeta = {
  slug: 'application-nextcloud-audit',
  displayName: 'Nextcloud Admin Audit',
  category: 'application',
  description:
    'Nextcloud 35.0.0 admin_audit HTTP records from the dedicated audit.log file backend, with each native JSON line in event.original and parsed under nextcloud.audit, for testing detections on logins, file access and public links. 180 users work in sessions over 1,154 files, about 10,800 records a day. Recurring episodes show a guessed password followed by publishing a file for outside access through a public link.',
  dataSource:
    'Nextcloud 35.0.0 admin_audit file backend (data/audit.log), JSON lines',
  format: ['JSON', 'ECS'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    '13/13 non-optional native audit fields in event.original',
    'About 10,800 records a day from 180 users on a UTC working-day curve',
    'Recurring failed-logins-to-public-link chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user fails password login three times from their home address, seconds to about a minute apart, then logs in successfully from that address; minutes later, from the same address and with the delays of ordinary sessions, the user reads a file, creates a public link to it, removes the link's expiration date and changes it from read-only to read and update. Episodes last about 3-25 minutes and always finish within an hour of the first failure. An episode recurs every 24 hours by default (anomaly_interval_hours, 3 to 8,760): the first starts within the first interval (at most 24 hours) at a time of day drawn from the activity curve; each next one is due one interval after the previous actual start and starts in a window of a quarter interval (at most 6 hours) centred on that due time, weighted towards busy hours, so within three hours of its due time. Episodes that start in office hours stay there, moving through the day by a few hours at a time; one that starts late at night can recur at night for many days. Missed episodes are never caught up, and at intervals of 8 hours or less episodes also fall into quiet hours. User (in proportion to activity) and file differ from the previous episode. Every step, and the user, home address and file of every episode, also occur in ordinary traffic; ordinary traffic never completes the full ordered chain for one file from one user and address within 60 minutes of the first failure.",
  generatorId: 'nextcloud-audit',
  eventTypes: [
    {
      id: 'File accessed',
      description: 'DAV file read',
      frequency: '57.5% measured share (57.5-57.9% by week)',
      category: 'file',
    },
    {
      id: 'File written to',
      description: 'DAV file update',
      frequency: '24.0% measured share (23.7-24.0% by week)',
      category: 'file',
    },
    {
      id: 'Login attempt',
      description: 'Password login request',
      frequency: '8.4% measured share (8.4-8.5% by week)',
      category: 'authentication',
    },
    {
      id: 'Login successful',
      description: 'Login result: password accepted',
      frequency: '7.7% measured share (7.7-7.8% by week)',
      category: 'authentication',
    },
    {
      id: 'Shared via link',
      description: 'Public link creation',
      frequency: '0.9% measured share (0.7-1.1% by week)',
      category: 'file',
    },
    {
      id: 'Login failed',
      description: 'Login result: password rejected',
      frequency: '0.7% measured share (0.7% by week)',
      category: 'authentication',
    },
    {
      id: 'Expiration removed',
      description: 'Public link expiration removal',
      frequency: '0.5% measured share (0.4-0.6% by week)',
      category: 'file',
    },
    {
      id: 'Permissions changed',
      description:
        'Public link changed from read-only (1) to read and update (3)',
      frequency: '0.2% measured share (0.2-0.3% by week)',
      category: 'file',
    },
  ],
  realismFeatures: [
    'About 10,800 records a day on a UTC working-day curve: 0.27 records/s at 10-15, 0.20 at 08-10 and 15-17, 0.12 at 07-08 and 17-19, and 0.04 at night (19-07); the daily total varies by about ±10% from day to day. Timestamps have one-second resolution, as in the native log; records of one moment, such as a mistyped password and its retry, are a few seconds apart in office hours and 15-25 seconds apart at night, rather than milliseconds.',
    "180 users with 1,154 files work in sessions from the office address or their own home address, busier users more often. Half of the sessions start with a password login in the web interface; 3% of those logins follow one to five mistyped passwords seconds apart, and a tenth of those are given up. Sessions read and write the user's files minutes apart, often the file just used, and now and then create a read-only public link with a default expiration date, remove a link's expiration or allow updates through it; each property of a link changes at most once.",
    'A few web sessions are opened to share a file with someone outside: the user reads the file, creates a public link, in half of the cases removes its expiration minutes later and sometimes then allows updates. Their share of web sessions drifts between 4% and 12% from day to day, so users create about 75-120 public links a day; about half later lose their expiration date and about a quarter are opened for updates.',
    'About once a day a sync client with an outdated password retries three to eight times about a minute apart, and half of them end with a successful login; about five times a day an address from the documentation ranges tries passwords for a user without success. About 8% of login attempts fail.',
    "A login attempt and its result share one reqId and native timestamp; separate requests have distinct IDs, so reqId does not prove a persistent session. Public link IDs grow by one to four per link. The permission-change message gives the path relative to the owner's files folder, while reads, writes and link creation give the full path; file.path holds the full path in every file and link record.",
    'Every step of the chain occurs in ordinary traffic. A typical week of background holds about 75-90 cases of three failed logins of one user and address within 10 minutes, 55-65 cases of three failures followed by a success within an hour, and 80-120 reads followed within an hour by a link, expiration removal and permission change for the same file; about one to five a week reach the expiration removal after three failures, and at most two also reach the permission change after two failures. With anomaly_mode true, counts of these chain parts are about one per episode higher (about seven more a week at the default interval, 21 at 8 hours), several times the background count for the longest parts.',
    'Field coverage is 13/13 non-optional native fields of the tagged 35.0.0 serializer, in its field order with compact separators. No captured production audit.log line from a running 35.0.0 server was available, so request routes and end-to-end native bytes remain unconfirmed; the native version 35.0.0.10 is the internal four-part number, and the ECS agent.type and log.file.path fields model a file collector.',
    'The modeled sharing policy sets a default public-link expiration without enforcing it and permits editing a public file link. Rates, session shapes, the sharing share and addresses are synthetic workload settings on UTC working hours, and compatibility with the KUMA Nextcloud source (26.0.4 via syslog) is not asserted.',
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
      json: String.raw`{"@timestamp": "2026-09-21T11:08:04+00:00", "agent": {"name": "cloud-01.corp.example", "type": "filebeat"}, "ecs": {"version": "8.17.0"}, "event": {"action": "share-create", "category": ["file"], "dataset": "nextcloud.audit", "kind": "event", "original": "{\"reqId\":\"wQvQ0YOnvKhJDWzisYVe\",\"level\":1,\"time\":\"2026-09-21T11:08:04+00:00\",\"remoteAddr\":\"203.0.113.29\",\"user\":\"ulyana\",\"app\":\"admin_audit\",\"method\":\"POST\",\"url\":\"/ocs/v2.php/apps/files_sharing/api/v1/shares\",\"scriptName\":\"/ocs/v2.php\",\"message\":\"The file \\\"/ulyana/files/HR/Onboarding-02.xlsx\\\" with ID \\\"14432\\\" has been shared via link with permissions \\\"1\\\" (Share ID: 32120)\",\"userAgent\":\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36\",\"version\":\"35.0.0.10\",\"data\":{\"app\":\"admin_audit\"}}", "outcome": "success", "type": ["creation"]}, "file": {"path": "/ulyana/files/HR/Onboarding-02.xlsx"}, "host": {"name": "cloud-01.corp.example"}, "http": {"request": {"method": "POST"}}, "log": {"file": {"path": "/var/www/html/data/audit.log"}, "level": "info"}, "message": "The file \"/ulyana/files/HR/Onboarding-02.xlsx\" with ID \"14432\" has been shared via link with permissions \"1\" (Share ID: 32120)", "nextcloud": {"audit": {"app": "admin_audit", "data": {"app": "admin_audit"}, "level": 1, "message": "The file \"/ulyana/files/HR/Onboarding-02.xlsx\" with ID \"14432\" has been shared via link with permissions \"1\" (Share ID: 32120)", "method": "POST", "remoteAddr": "203.0.113.29", "reqId": "wQvQ0YOnvKhJDWzisYVe", "scriptName": "/ocs/v2.php", "time": "2026-09-21T11:08:04+00:00", "url": "/ocs/v2.php/apps/files_sharing/api/v1/shares", "user": "ulyana", "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36", "version": "35.0.0.10"}}, "related": {"ip": ["203.0.113.29"], "user": ["ulyana"]}, "source": {"ip": "203.0.113.29"}, "tags": ["nextcloud", "admin_audit"], "url": {"path": "/ocs/v2.php/apps/files_sharing/api/v1/shares"}, "user": {"name": "ulyana"}, "user_agent": {"original": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"}}`,
    },
  ],
};
