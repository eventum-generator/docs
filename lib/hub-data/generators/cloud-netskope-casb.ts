import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudNetskopeCasb: GeneratorMeta = {
  slug: 'cloud-netskope-casb',
  displayName: 'Netskope CASB via Cloud Exchange Syslog',
  category: 'cloud',
  description:
    'Netskope tenant application events and admin audit events as delivered to a SIEM by the Cloud Exchange Log Shipper Syslog plugin v4.1.x in CEF with its default mapping, from 60 users of cloud-storage, collaboration and CRM apps, six of them tenant admins, as native syslog lines in event.original with ECS and netskope.* fields. Recurring episodes show a tenant admin deleting an inline policy and then downloading a batch of files from a cloud-storage app.',
  dataSource:
    'Netskope Cloud Exchange Log Shipper Syslog plugin v4.1.x, CEF with the default mapping',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 14,
  templateCount: 1,
  highlights: [
    'Syslog plugin CEF line kept byte for byte in event.original',
    'Application and admin audit events share the suser actor',
    'Recurring inline-policy deletion followed by a storage download burst',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours of source time by default (minimum 6): the first episode is due 1 h after generation starts plus a random delay of up to min(1 h, interval / 8), each later one one interval after the previous episode deletion plus a new delay of the same kind. The next inline-policy deletion by an eligible admin becomes the episode; if none comes within min(interval / 4, 6 h), an on-duty admin makes an ordinary console visit with a deletion inside that window (later only if no eligible admin is on duty at all). Missed episodes are not replayed; measured spacing 24.5-26.4 h at 24 h (24.5-28.3 h in a later review run) and 8.5-10.8 h at 8 h. An admin other than the previous episode one deletes an inline policy, and a few minutes later (median 4 min, at most 15) downloads three or more files from one of their usual cloud-storage apps in one appSessionId from their usual source address. Every step also occurs in background; only three or more cloud-storage downloads by an admin within 30 minutes after a deletion are absent from it.',
  generatorId: 'netskope',
  eventTypes: [
    {
      id: 'application / View',
      description: 'File or record viewed in a cloud app',
      frequency: '42.50% measured share',
      category: 'file',
    },
    {
      id: 'application / Download',
      description: 'File downloaded from a cloud app',
      frequency: '19.07% measured share',
      category: 'file',
    },
    {
      id: 'application / Login Successful',
      description: 'User login to a cloud app',
      frequency: '15.53% measured share',
      category: 'authentication',
    },
    {
      id: 'application / Upload',
      description: 'File uploaded to a cloud-storage or collaboration app',
      frequency: '8.43% measured share',
      category: 'file',
    },
    {
      id: 'application / Edit',
      description: 'File edited in a cloud-storage app',
      frequency: '4.46% measured share',
      category: 'file',
    },
    {
      id: 'application / Join',
      description: 'Join activity in a collaboration app',
      frequency: '2.88% measured share',
      category: 'session',
    },
    {
      id: 'application / Logout',
      description: 'User logout from a collaboration or CRM app',
      frequency: '1.15% measured share',
      category: 'authentication',
    },
    {
      id: 'application / Move',
      description: 'File moved in a cloud-storage app',
      frequency: '1.13% measured share',
      category: 'file',
    },
    {
      id: 'application / Share',
      description: 'File shared from a cloud-storage app',
      frequency: '1.12% measured share',
      category: 'file',
    },
    {
      id: 'application / View All',
      description: 'View All activity in the CRM app',
      frequency: '0.97% measured share',
      category: 'file',
    },
    {
      id: 'audit / Login Successful',
      description: 'Tenant admin logs in to the admin console',
      frequency: '0.91% measured share',
      category: 'authentication',
    },
    {
      id: 'application / Rename',
      description: 'File renamed in a cloud-storage app',
      frequency: '0.76% measured share',
      category: 'file',
    },
    {
      id: 'audit / Deleted Inline Policy',
      description: 'Tenant admin deletes an inline policy',
      frequency: '0.57% measured share',
      category: 'configuration',
    },
    {
      id: 'application / Copy',
      description: 'File copied in a cloud-storage app',
      frequency: '0.53% measured share',
      category: 'file',
    },
  ],
  realismFeatures: [
    'Staff work in randomly phased sessions from an office or home egress address, using a few cloud-storage, collaboration and CRM apps each; device, OS and browser are fixed per user, and appSessionId stays the same for a user and app until 15 minutes of inactivity. There is no working-hours or weekday cycle.',
    'Tenant admins are ordinary staff who open the console about every 2 hours on shift and delete an inline policy on about half of the visits (35-98 deletions per 120 h across six admins in background captures, more than a typical tenant sees); about half of the deletions are followed within minutes by viewing or downloading one or two files in a storage app.',
    'Line layout follows the plugin source: <14> priority, header time, Log Source Identifier, the CEF header with the tenant as Device Product, and extensions sorted by the key=value string. Application events carry the 14 keys of the published example plus url and appSessionId with severity Unknown; audit events carry the four published keys, High for Deleted Inline Policy and Medium for Login Successful, without supportingData.',
    'The syslog header time is the Cloud Exchange send time, assumed UTC, a random delay after the event (median 51 s in the default capture); timestamp and @timestamp are the event time in whole seconds. Real batched sends are less regular.',
    'Only the two audit event names with published raw examples are modeled; policy creation, edits and applied changes are not. The per-app activity mix, CCI/CCL values, URLs and addresses are synthetic.',
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
      description: 'Episode interval in hours of source time, 6 to 8,760',
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
    {
      name: 'user_count',
      defaultValue: '60',
      description: 'Number of users, 10 to 500',
    },
    {
      name: 'admin_count',
      defaultValue: '6',
      description: 'Number of users who are also tenant admins, 2 to 20',
    },
  ],
  sampleOutputs: [
    {
      title: 'First cloud-storage download of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T06:42:23Z", "destination": {"ip": "192.0.2.20"}, "ecs": {"version": "8.17.0"}, "event": {"action": "Download", "category": ["file"], "kind": "event", "original": "\u003c14\u003eSep 01 06:44:05 netskopece CEF:0|Netskope|Example Tenant|NULL|application|NULL|Unknown|act=Download appSessionId=4954799521857995773 appcategory=Cloud Storage applicationType=nspolicy browser=Chrome cci=92 ccl=excellent device=Windows Device dst=192.0.2.20 os=Windows 10 requestClientApplication=Google Drive sourceServiceName=Google Drive src=198.51.100.11 suser=tom.moore@example.com timestamp=1788244943 url=drive.google.com/file/d/l03b912bd9d25a7e3123797395a2", "type": ["access"]}, "log": {"syslog": {"hostname": "netskopece", "priority": 14}}, "netskope": {"activity": "Download", "app": "Google Drive", "app_session_id": "4954799521857995773", "appcategory": "Cloud Storage", "browser": "Chrome", "cci": "92", "ccl": "excellent", "device": "Windows Device", "os": "Windows 10", "site": "Google Drive", "type": "nspolicy"}, "related": {"ip": ["198.51.100.11", "192.0.2.20"], "user": ["tom.moore@example.com"]}, "source": {"ip": "198.51.100.11"}, "url": {"original": "drive.google.com/file/d/l03b912bd9d25a7e3123797395a2"}, "user": {"email": "tom.moore@example.com"}}`,
    },
  ],
};
