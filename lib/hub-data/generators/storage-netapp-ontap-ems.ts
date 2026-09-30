import type { GeneratorMeta } from '@/lib/hub-types';

export const storageNetappOntapEms: GeneratorMeta = {
  slug: 'storage-netapp-ontap-ems',
  displayName: 'NetApp ONTAP EMS',
  category: 'storage',
  description:
    'NetApp ONTAP 9.12.1 Event Management System (EMS) notifications from a two-node cluster in the default legacy-netapp syslog format, as event.original with parsed ECS and netapp.ems fields: ZAPI Snapshot copies made by backup applications, failed management logins, account lockouts and anti-ransomware state changes. About 1,100 records a day: Snapshot copies around the clock, administrator activity on a working-day curve. Recurring episodes lock out one administrator, have a second one fail to log in and disable anti-ransomware protection on a volume.',
  dataSource:
    'NetApp ONTAP 9.12.1 EMS notifications, syslog destination in legacy-netapp format',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Documented legacy-netapp syslog line in event.original',
    'About 1,100 records a day from 48 volumes and 8 accounts',
    'Recurring lockout, spray, anti-ransomware disable chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Administrator A fails logins until the lockout threshold (lockout_attempts, default 3), a few seconds apart, and is locked out one to three seconds after the last failure on the same node. A few minutes later a different administrator B fails once or twice, below the threshold (password spraying), and several minutes after that anti-ransomware protection is disabled on volume V. Protection on V is turned back on after a hold like that of ordinary pauses, A is unlocked on the ordinary schedule, and B's attempts end with a successful login that resets B's counter. From the first failure to the disable a chain spans about 3-40 minutes, always within one hour. A and B are two of the first three administrators on their usual application and the first node, V is one of the frequently paused volumes; A differs from the previous episode's A, V from the previous V, and B from the previous B when that account is free. user.name links A and B, netapp.ems.parameters.volumeName and volumeUuid link V; these EMS messages carry no client IP. Recurrence (anomaly_interval_hours, default 24): the first episode starts within min(interval, 24 h) of the start of the data, at an hour drawn from the administrators' working-day curve; each later one is due one interval after the previous actual start and starts within a window of min(interval / 4, 6 h) around that time, at an hour weighted toward working hours. Missed episodes are never caught up.",
  generatorId: 'ontap',
  eventTypes: [
    {
      id: 'zapi.snapshot.success',
      description: 'A backup application created a Snapshot copy through ZAPI',
      frequency: '96.6% of records',
      category: 'configuration',
    },
    {
      id: 'security.invalid.login',
      description: 'Failed login to the cluster over ssh, http or ontapi',
      frequency: '2.0% of records (1.3-1.7% without episodes)',
      category: 'authentication',
    },
    {
      id: 'arw.volume.state',
      description:
        'Anti-ransomware state of a volume changed (disabled, enabled)',
      frequency: '1.1% of records (1.0-1.1% without episodes)',
      category: 'configuration',
    },
    {
      id: 'useradmin.lockedout.user',
      description: 'Account locked after the configured number of failures',
      frequency: '0.3% of records (0.1-0.3% without episodes)',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'About 1,100 records a day in time order, UTC with one-second precision. About 1,070 are ZAPI Snapshot copies of 48 volumes, evenly around the clock, each volume in proportion to its snapshot_weight: on average every 15 minutes to 2 hours for database, log and virtual machine volumes, about every 4 hours for file shares, daily for archives and boot volumes.',
    'Five administrators fail 7-10 logins a day on a working-day curve (07:00-18:00 UTC full rate, 18:00-22:00 about 40%, night about 15%): a session holds one to four failures a few seconds apart (median 7 s), the first three administrators are the busiest, each mostly uses one application (ssh, or http for System Manager), and nine logins in ten reach the first node. Three service accounts fail 5-9 times a day around the clock in retry loops of one to six failures about 40 s apart, over ontapi or http.',
    "An account that reaches lockout_attempts consecutive failures is locked one to three seconds after the last one (1.5-3 lockouts a day) and makes no attempt until an unlock that EMS does not log (median two hours). A successful login, also not logged, resets the counter; after a session that gives up, the counter stays until the account's next successful login about an hour later.",
    'Anti-ransomware protection is paused on a volume about 5-6 times a day and turned back on after a median of about 50 minutes (5 minutes to several hours). The three bulk-data volumes vol_backup_stage, vol_ci_cache and vol_scans are paused one to two times a day each, more often than in a typical cluster; other volumes rarely. A few volumes start in dry-run mode and switch to enabled within the first days. Volume and Vserver UUIDs stay stable within one output.',
    'Every chain step is ordinary activity in both modes: every administrator fails logins, accounts are locked out every day, several accounts fail within minutes of each other, and the same volumes have protection paused and turned back on. Only the complete ordered chain is kept out: an ordinary pause that would complete it does not happen. A day with an episode has about one more lockout, four to five more failed logins and about half a pause more than a day without.',
    'No captured ONTAP syslog line was available: event.original follows the documented legacy-netapp grammar (RFC 3164 timestamp, hostname only) and the 9.12.1 catalog message templates, with catalog parameter names in netapp.ems.parameters; RFC 5424 output is not emitted. The severity token is lower case although its case is undocumented, facility user (1) is a scenario choice, and the ECS mapping is inferred with no Elastic integration to follow. Successful logins, unlocks, failures on a locked account and other EMS events (hardware, WAFL, SnapMirror) are not produced. Snapshot names, rates and hold durations are assumptions; there is no weekly cycle and working hours are fixed in UTC. KUMA 4.2 normalization is untested.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring episodes to the background; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, 6 to 8,760',
    },
    {
      name: 'cluster_name',
      defaultValue: 'cluster1',
      description: 'Admin Vserver name in failed-login messages',
    },
    {
      name: 'nodes',
      defaultValue: '[cluster1-01, cluster1-02]',
      description:
        'Node hostnames; the first hosts the cluster management interface and receives most logins',
    },
    {
      name: 'admin_users',
      defaultValue: '[admin, jsmith, mlee, kpatel, storageops]',
      description:
        'Human administrators, at least three, busiest first, distinct from the service accounts',
    },
    {
      name: 'service_users',
      defaultValue: '[harvest, snapcenter, ansible]',
      description: 'Service accounts that log in through ontapi or http',
    },
    {
      name: 'lockout_attempts',
      defaultValue: '3',
      description:
        'Failures that lock an account (attempts in the lockout message), 2 to 10',
    },
  ],
  sampleOutputs: [
    {
      title: 'Anti-ransomware disable step of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T11:08:56+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "arw.volume.state", "category": ["configuration"], "kind": "event", "original": "\u003c13\u003eSep  1 11:08:56 [cluster1-01:arw.volume.state:notice]: Anti-ransomware state was changed to \"disabled\" on volume \"vol_ci_cache\" (UUID: \"5c18ce97-b4b6-4f41-bbb2-4d30c695d6dd\") in Vserver \"svm_nfs01\" (UUID: \"84e08f81-2502-4a44-bd5d-da6a31aec8fc\").", "outcome": "success", "type": ["change"]}, "host": {"name": "cluster1-01"}, "log": {"syslog": {"facility": {"code": 1, "name": "user"}, "priority": 13, "severity": {"code": 5, "name": "notice"}}}, "netapp": {"ems": {"message": "Anti-ransomware state was changed to \"disabled\" on volume \"vol_ci_cache\" (UUID: \"5c18ce97-b4b6-4f41-bbb2-4d30c695d6dd\") in Vserver \"svm_nfs01\" (UUID: \"84e08f81-2502-4a44-bd5d-da6a31aec8fc\").", "name": "arw.volume.state", "parameters": {"op": "disabled", "volumeName": "vol_ci_cache", "volumeUuid": "5c18ce97-b4b6-4f41-bbb2-4d30c695d6dd", "vserverName": "svm_nfs01", "vserverUuid": "84e08f81-2502-4a44-bd5d-da6a31aec8fc"}, "severity": "notice"}}}`,
    },
  ],
};
