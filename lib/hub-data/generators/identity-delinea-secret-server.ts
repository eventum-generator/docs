import type { GeneratorMeta } from '@/lib/hub-types';

export const identityDelineaSecretServer: GeneratorMeta = {
  slug: 'identity-delinea-secret-server',
  displayName: 'Delinea Secret Server CEF',
  category: 'identity',
  description:
    'SECRET - VIEW audit records that one Delinea Secret Server 11.3 instance (formerly Thycotic) sends to a syslog/CEF collector, as ECS JSON with the syslog line in event.original, for SIEM content on privileged credential access. Thirty accounts open secrets in five shared folders and personal folders; recurring episodes show one administrator viewing five distinct Tier 0 credentials within half an hour.',
  dataSource:
    'Delinea (Thycotic) Secret Server 11.3.000001 syslog/CEF, SECRET - VIEW (class 10004)',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  generatorId: 'delinea-ss',
  highlights: [
    'Syslog/CEF line in the layout of the complete 11.3 fixture',
    '30 accounts with per-user activity and office-hours sessions',
    'Recurring five-distinct Tier 0 credential views chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One administrator, from the usual workstation address, views five distinct secrets in folder Tier 0 - Infrastructure within 30 minutes, with occasional re-opens in between. Episodes recur every 24 hours by default (anomaly_interval_hours, minimum 2) of source time: the first start is drawn within the first min(interval, 24 h) weighted by the office-hours factor; each later one is due one interval after the previous actual start and drawn in a window of min(interval / 4, 6 h) centred on the due time, weighted towards busy hours (24 h plus or minus 3 h by default), with no catch-up. The administrator differs from the previous episode and the five secrets are a fresh draw. Every fragment occurs in background; an ordinary view that would be the fifth distinct Tier 0 secret of a user within 30 minutes (by event time) re-opens one of the four instead.',
  eventTypes: [
    {
      id: 'Applications',
      description:
        'SECRET - VIEW by DevOps, DBAs, administrators and automation accounts',
      frequency: '27.27% measured share',
      category: 'iam',
    },
    {
      id: 'Personal folders',
      description: 'SECRET - VIEW of a personal folder by its owner',
      frequency: '21.84% measured share',
      category: 'iam',
    },
    {
      id: 'Network Devices',
      description: 'SECRET - VIEW by network engineers and administrators',
      frequency: '18.46% measured share',
      category: 'iam',
    },
    {
      id: 'Service Desk',
      description: 'SECRET - VIEW by service desk and administrators',
      frequency: '12.79% measured share',
      category: 'iam',
    },
    {
      id: 'Tier 0 - Infrastructure',
      description:
        'SECRET - VIEW by administrators, occasionally network engineers',
      frequency: '12.16% measured share',
      category: 'iam',
    },
    {
      id: 'Databases',
      description: 'SECRET - VIEW by DBAs, DevOps and administrators',
      frequency: '7.48% measured share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Every record is SECRET - VIEW (CEF class 10004). The CEF header keeps the historical Thycotic Software vendor name of this version, and the JSON mirrors the document the Elastic Thycotic Secret Server integration produces from the line.',
    'People start sessions as one Poisson stream scaled by an office-hours factor and pick a person by a fixed per-user weight; automation accounts add a flat stream. Sessions of 1-6 views re-open the previous secret or pick a folder by role and a secret by popularity.',
    'A quarter of administrator sessions are infrastructure work of 2-9 views, mostly Tier 0 secrets, so several distinct Tier 0 secrets by one administrator within minutes and four distinct ones within 30 minutes occur in background.',
    'The syslog header carries the send time, a log-normal delay (median 3 s) after the event time rt, as in the Elastic fixture. Counted by send time, that delay pulls a few background spans of 1803-1809 s under 30 minutes.',
    'Only SECRET - VIEW is generated: other 11.3 event layouts are not published. Day padding in the header and rt is unconfirmed by the fixture, only the legacy rt DateTime format is modelled, and clocks are UTC with second resolution.',
    'Users, secrets, folders, IDs and rates are an assumed mid-size organisation from a fixed seed, not measured production data; at most one record per second.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add periodic episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2-8,760',
    },
    {
      name: 'server_host',
      defaultValue: 'SECRET-SRV-01',
      description: 'Syslog hostname, host.name and observer.hostname',
    },
    {
      name: 'device_version',
      defaultValue: '11.3.000001',
      description:
        'Version in the CEF header; the layout is validated for this version only',
    },
    {
      name: 'domain',
      defaultValue: 'contoso',
      description:
        'Domain prefix in personal admin account and breakglass secret names',
    },
  ],
  sampleOutputs: [
    {
      title: 'View that completes the second episode',
      json: String.raw`{"@timestamp": "2026-09-27T01:32:25.000Z", "ecs": {"version": "8.11.0"}, "event": {"action": "view", "category": ["iam"], "code": "10004", "dataset": "thycotic_ss.logs", "kind": "event", "original": "Sep 27 01:32:25 SECRET-SRV-01 CEF:0|Thycotic Software|Secret Server|11.3.000001|10004|SECRET - VIEW|2|msg=[[SecretServer]] Event: [Secret] Action: [View] By User: D.Lee Item Name: SCCM Network Access Account (Item Id: 2670) Container Name: Tier 0 - Infrastructure (Container Id: 162)  suid=709 suser=D.Lee cs4=David Lee cs4Label=suser Display Name src=10.20.5.41 rt=Sep 27 2026 01:32:19 fname=SCCM Network Access Account fileType=Secret fileId=2670 cs3Label=Folder cs3=Tier 0 - Infrastructure", "provider": "secret", "type": ["info"]}, "host": {"name": "SECRET-SRV-01"}, "message": "[[SecretServer]] Event: [Secret] Action: [View] By User: D.Lee Item Name: SCCM Network Access Account (Item Id: 2670) Container Name: Tier 0 - Infrastructure (Container Id: 162)", "observer": {"hostname": "SECRET-SRV-01", "product": "Secret Server", "vendor": "Thycotic Software", "version": "11.3.000001"}, "related": {"hosts": ["SECRET-SRV-01"], "ip": ["10.20.5.41"], "user": ["D.Lee"]}, "source": {"ip": "10.20.5.41"}, "thycotic_ss": {"event": {"secret": {"folder": "Tier 0 - Infrastructure", "id": "2670", "name": "SCCM Network Access Account"}, "time": "2026-09-27T01:32:19.000Z"}}, "user": {"full_name": "David Lee", "id": "709", "name": "D.Lee"}}`,
    },
  ],
};
