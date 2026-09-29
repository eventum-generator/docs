import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudNetskopeCasb: GeneratorMeta = {
  slug: 'cloud-netskope-casb',
  displayName: 'Netskope CASB via Cloud Exchange Syslog',
  category: 'cloud',
  description:
    'Netskope tenant application events and admin audit events as delivered to a SIEM by the Cloud Exchange Log Shipper Syslog plugin v4.1.x in CEF with its default mapping, as native syslog lines in event.original with ECS and netskope.* fields. Sixty staff, six of them tenant admins, use a few cloud-storage, collaboration and CRM apps from an office or home egress address; about 4,700 events a day follow the working day in UTC. Recurring episodes show a tenant admin deleting an inline policy and then downloading a batch of files from a cloud-storage app.',
  dataSource:
    'Netskope Cloud Exchange Log Shipper Syslog plugin v4.1.x, CEF with the default mapping',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 14,
  templateCount: 1,
  highlights: [
    'Syslog plugin CEF line kept byte for byte in event.original',
    '60 staff on a UTC working day with an overnight team',
    'Recurring inline-policy deletion followed by a storage download burst',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every anomaly_interval_hours (default 24, minimum 6) of event time. The first episode starts within the first 24 h (or the first interval, if shorter), at an hour drawn from the daily curve; each later one starts one interval after the previous start, give or take half of min(interval / 4, 6 h), with busy hours far more likely than quiet ones. Missed episodes are not replayed; at the default interval episodes start 21-27 h apart, at 8 h 7-9 h apart. One of the three inline-policy owners, never the same one twice in a row, signs in to the admin console, deletes one or two inline policies a few minutes later, and a few minutes after the last deletion (median 4 min, at most 15 min) downloads three files from one of their usual cloud-storage apps in one appSessionId from their current source address. Every step also occurs in background; only three or more cloud-storage downloads by an admin within 30 minutes after a deletion are absent from it.',
  generatorId: 'netskope',
  eventTypes: [
    {
      id: 'application / View',
      description: 'File or record viewed in a cloud app',
      frequency: '44.38% of records',
      category: 'file',
    },
    {
      id: 'application / Download',
      description: 'File downloaded from a cloud app',
      frequency: '18.32% of records',
      category: 'file',
    },
    {
      id: 'application / Login Successful',
      description: 'User login to a cloud app',
      frequency: '13.97% of records',
      category: 'authentication',
    },
    {
      id: 'application / Upload',
      description: 'File uploaded to a cloud-storage or collaboration app',
      frequency: '8.98% of records',
      category: 'file',
    },
    {
      id: 'application / Edit',
      description: 'File edited in a cloud-storage app',
      frequency: '4.11% of records',
      category: 'file',
    },
    {
      id: 'application / Join',
      description: 'Join activity in a collaboration app',
      frequency: '2.91% of records',
      category: 'session',
    },
    {
      id: 'application / Logout',
      description: 'User logout from a collaboration or CRM app',
      frequency: '1.57% of records',
      category: 'authentication',
    },
    {
      id: 'application / Share',
      description: 'File shared from a cloud-storage app',
      frequency: '1.26% of records',
      category: 'file',
    },
    {
      id: 'application / View All',
      description: 'View All activity in the CRM app',
      frequency: '1.22% of records',
      category: 'file',
    },
    {
      id: 'application / Move',
      description: 'File moved in a cloud-storage app',
      frequency: '0.99% of records',
      category: 'file',
    },
    {
      id: 'application / Rename',
      description: 'File renamed in a cloud-storage app',
      frequency: '0.74% of records',
      category: 'file',
    },
    {
      id: 'audit / Login Successful',
      description: 'Tenant admin logs in to the admin console',
      frequency: '0.62% of records',
      category: 'authentication',
    },
    {
      id: 'application / Copy',
      description: 'File copied in a cloud-storage app',
      frequency: '0.57% of records',
      category: 'file',
    },
    {
      id: 'audit / Deleted Inline Policy',
      description: 'Tenant admin deletes an inline policy',
      frequency: '0.37% of records',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'Sixty staff work in daily sessions from an office or home egress address, using a few cloud-storage, collaboration and CRM apps each. Most start between 07:00 and 09:30 UTC (some until 11:00, a few from 06:00) and work 6.5-10.5 h; about one in five adds a short evening session from home. Six staff form an overnight team working from about 22:00 to 07:00 UTC.',
    'About 4,700 events a day (day-to-day variation about 3%): 475 an hour between 10:00 and 15:00 UTC, 54 an hour overnight from a handful of users and 24 an hour between 19:00 and 23:00. Each user produces about 9 events per hour at work; about 50 users are seen per hour at midday, 6 overnight and 4-5 in the evening. The daily curve is the same every day, with no weekly cycle.',
    'Six staff are tenant admins who also open the admin console now and then; three of them own the inline policies and delete one on most console visits, 2-7 a day each, more than a typical tenant sees. Console logins, single and double deletions, deletions followed a few minutes later by a check of one or two files in a storage app, and bursts of many downloads by one user from one app all occur in background, but an admin who deleted a policy within the last 30 minutes makes at most two cloud-storage downloads in that window; an ordinary burst that would make a third ends at the second (about 1.5 times a day across the tenant).',
    'Line layout follows the plugin source: <14> priority, header time, Log Source Identifier, the CEF header with the tenant as Device Product, and extensions sorted by the key=value string. Application events carry the 14 keys of the published example plus url and appSessionId with severity Unknown; audit events carry the four published keys, High for Deleted Inline Policy and Medium for Login Successful, without supportingData.',
    'appSessionId stays the same for a user and app until 15 minutes of inactivity; device, OS and browser are fixed per user (Native for some sync clients). The syslog header time is the Cloud Exchange send time, assumed UTC, a random delay after the event (median about 50 s, 2 s to about 17 min); timestamp and @timestamp are the event time in whole seconds. Real batched sends are less regular, and repeated actions of one user in one app (a median 27 s apart at midday, about a minute overnight) are often only milliseconds to seconds apart in real logs.',
    'Only the two audit event names with published raw examples are modeled; policy creation, edits and applied changes are not. The per-app activity mix, CCI/CCL values, URLs and addresses are synthetic. With anomaly_mode true, counts of the chain parts (console logins, policy deletions, storage downloads right after a deletion) are about one per episode higher than with false.',
    'The default audit mapping carries no policy name or before/after state, so the chain is a temporal correlation on the actor, not proof that the deleted policy was blocking those downloads, and no restoring step is emitted. SIEM parser compatibility is untested; the ECS mapping is CEF-ingest-style enrichment, not a vendor-published mapping.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add anomaly chain episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours of event time, 6 to 8,760',
    },
    {
      name: 'tenant_name',
      defaultValue: 'Example Tenant',
      description: 'CEF Device Product (the plugin tenant name)',
    },
    {
      name: 'log_source_identifier',
      defaultValue: 'netskopece',
      description: 'Syslog hostname field (the plugin Log Source Identifier)',
    },
    {
      name: 'email_domain',
      defaultValue: 'example.com',
      description: 'Domain of user e-mail addresses in suser',
    },
  ],
  sampleOutputs: [
    {
      title: 'First cloud-storage download of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T14:38:10Z", "destination": {"ip": "192.0.2.20"}, "ecs": {"version": "8.17.0"}, "event": {"action": "Download", "category": ["file"], "kind": "event", "original": "\u003c14\u003eSep 01 14:39:36 netskopece CEF:0|Netskope|Example Tenant|NULL|application|NULL|Unknown|act=Download appSessionId=4396508595117720143 appcategory=Cloud Storage applicationType=nspolicy browser=Safari cci=92 ccl=excellent device=Mac Device dst=192.0.2.20 os=Sonoma requestClientApplication=Google Drive sourceServiceName=Google Drive src=198.51.100.11 suser=julia.moore@example.com timestamp=1788273490 url=drive.google.com/file/d/u197a6fe47153cd09d12e751f083", "type": ["access"]}, "log": {"syslog": {"hostname": "netskopece", "priority": 14}}, "netskope": {"activity": "Download", "app": "Google Drive", "app_session_id": "4396508595117720143", "appcategory": "Cloud Storage", "browser": "Safari", "cci": "92", "ccl": "excellent", "device": "Mac Device", "os": "Sonoma", "site": "Google Drive", "type": "nspolicy"}, "related": {"ip": ["198.51.100.11", "192.0.2.20"], "user": ["julia.moore@example.com"]}, "source": {"ip": "198.51.100.11"}, "url": {"original": "drive.google.com/file/d/u197a6fe47153cd09d12e751f083"}, "user": {"email": "julia.moore@example.com"}}`,
    },
  ],
};
