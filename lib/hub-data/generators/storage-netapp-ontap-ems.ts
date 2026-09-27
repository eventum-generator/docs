import type { GeneratorMeta } from '@/lib/hub-types';

export const storageNetappOntapEms: GeneratorMeta = {
  slug: 'storage-netapp-ontap-ems',
  displayName: 'NetApp ONTAP EMS',
  category: 'storage',
  description:
    'NetApp ONTAP 9.12.1 EMS notifications from a two-node cluster in the default legacy-netapp syslog format, as event.original with parsed ECS and netapp.ems fields: failed management logins, account lockouts, anti-ransomware state changes and ZAPI Snapshot copies. Recurring episodes lock out one administrator, spray a second account and disable anti-ransomware protection on a volume.',
  dataSource:
    'NetApp ONTAP 9.12.1 EMS notifications, syslog destination in legacy-netapp format',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Documented legacy-netapp syslog line in event.original',
    'Independent activity of 8 accounts and 16 volumes',
    'Recurring lockout, spray, anti-ransomware disable chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode due one interval after the start of the source clock, each next one interval after the previous actual start; a due episode starts after an exponential delay averaging 20 minutes once its administrator and volume are free, and missed episodes are never caught up), administrator A fails logins up to the lockout threshold and is locked out, a different account fails once or twice, and anti-ransomware protection is disabled on a volume, then re-enabled after an ordinary maintenance hold. The chain spans about 4-18 minutes; administrators rotate, and every step also occurs in background, where only the complete ordered chain is suppressed.',
  generatorId: 'ontap',
  eventTypes: [
    {
      id: 'zapi.snapshot.success',
      description: 'Backup application created a Snapshot copy through ZAPI',
      frequency: '73.2% measured share (background 74-78%)',
      category: 'configuration',
    },
    {
      id: 'security.invalid.login',
      description: 'Failed cluster login over ssh, http or ontapi',
      frequency: '16.8% measured share (background 14-18%)',
      category: 'authentication',
    },
    {
      id: 'arw.volume.state',
      description: 'Anti-ransomware state of a volume changed',
      frequency: '6.5% measured share (background 4-6%)',
      category: 'configuration',
    },
    {
      id: 'useradmin.lockedout.user',
      description: 'Account locked after the configured number of failures',
      frequency: '3.5% measured share (background 2-3%)',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Five administrators (office-hours sessions) and three service accounts (around the clock) log in at their own rates. A session succeeds after zero to six failures or gives up; successful logins produce no EMS record, and a locked account stays silent until an unlock that EMS does not log.',
    'Each of 16 volumes gets ZAPI Snapshot copies at log-normal intervals and occasional anti-ransomware maintenance (disabled, then enabled after a log-normal hold); some volumes start in dry-run mode. The maintenance rate is higher than in a typical cluster so that chain steps are common in the background, and all rates are training assumptions.',
    'Every chain step is ordinary background in both modes: every account fails logins and can be locked out, several accounts fail within minutes of each other, and every volume has its protection disabled and re-enabled. Only an ordinary disable that would complete the chain is skipped. The EMS messages carry no client IP, so none is invented.',
    'No captured ONTAP syslog line was available: event.original is assembled from the documented legacy-netapp grammar and the 9.12.1 catalog message templates, with catalog parameter names in netapp.ems.parameters. The severity token is written in lower case although its case is undocumented, facility user is a scenario choice, the ECS mapping is inferred, RFC 5424 output is not emitted, and KUMA normalization is untested.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring episodes; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 6 to 8,760',
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
        'Human administrators, at least three, distinct from the service accounts',
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
      title: 'Anti-ransomware disable step of the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T00:24:16+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "arw.volume.state", "category": ["configuration"], "kind": "event", "original": "\u003c13\u003eSep 21 00:24:16 [cluster1-01:arw.volume.state:notice]: Anti-ransomware state was changed to \"disabled\" on volume \"vol_home01\" (UUID: \"90708e43-b052-4fd1-b5e3-1c1d9bddb62a\") in Vserver \"svm_cifs01\" (UUID: \"70cb3884-b460-42ef-a14d-b285d7282e3d\").", "outcome": "success", "type": ["change"]}, "host": {"name": "cluster1-01"}, "log": {"syslog": {"facility": {"code": 1, "name": "user"}, "priority": 13, "severity": {"code": 5, "name": "notice"}}}, "netapp": {"ems": {"message": "Anti-ransomware state was changed to \"disabled\" on volume \"vol_home01\" (UUID: \"90708e43-b052-4fd1-b5e3-1c1d9bddb62a\") in Vserver \"svm_cifs01\" (UUID: \"70cb3884-b460-42ef-a14d-b285d7282e3d\").", "name": "arw.volume.state", "parameters": {"op": "disabled", "volumeName": "vol_home01", "volumeUuid": "90708e43-b052-4fd1-b5e3-1c1d9bddb62a", "vserverName": "svm_cifs01", "vserverUuid": "70cb3884-b460-42ef-a14d-b285d7282e3d"}, "severity": "notice"}}}`,
    },
  ],
};
