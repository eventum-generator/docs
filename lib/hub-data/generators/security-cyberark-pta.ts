import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCyberarkPta: GeneratorMeta = {
  slug: 'security-cyberark-pta',
  displayName: 'CyberArk Privileged Threat Analytics',
  category: 'security',
  description:
    'CyberArk Privileged Threat Analytics (PTA) security alerts as PTA sends them to a SIEM over syslog in CEF, each line the ECS JSON document the Elastic cyberark_pta integration builds, with the CEF record in event.original. For SIEM parsing and correlation testing: one PTA server watches one Vault with 120 Vault users, 163 privileged accounts and 97 administrator workstations and jump hosts, about 490 alerts on a weekday and 405 on a weekend day. Every record is a PTA detection, not benign activity. Recurring episodes chain dormant-user, irregular-hours and credential-theft alerts on one privileged account.',
  dataSource:
    'CyberArk PTA 12.0 CEF security events over syslog, in the ECS JSON of the Elastic cyberark_pta integration',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'pta',
  highlights: [
    'CEF layout of two real PTA 11.4 and 12.0 exports',
    'About 490 alerts a weekday and 405 a weekend day on weekly curves',
    'Dormant user, irregular-hours access and credential theft on one account',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "On one privileged account, Vault user V raises Active dormant Vault user (26), then Privileged access to the Vault during irregular hours (23) on the same account, usually 1-9 minutes later and occasionally up to about 18, sometimes repeated; then a workstation or jump host that normally uses the account raises a single Suspected credentials theft (1), typically 3-70 minutes after the last irregular-hours alert. An episode usually spans under an hour. anomaly_interval_hours (default 24, minimum 6) sets the spacing of episode starts. The first episode starts within the first min(interval, 24 h) of the data, at an hour drawn with the curve of background dormant-then-irregular incidents (evenings, nights and weekend afternoons); each next one is due one interval after the previous episode's start and starts within a window of min(interval / 4, 6 h) around the due time, weighted by the square of that curve plus a small floor, so any hour stays possible. Starts are about 21-27 h apart at the default, between about 18:00 and 23:00 UTC, and 7-9 h apart at 8 h; missed intervals are not caught up. V, the account and the workstation are drawn by their background frequency among combinations that ordinary alerts carry often, so every user, account, workstation and actor-account pair of an episode also occurs in ordinary alerts, and each alert on its own and each pair of them is ordinary; neither V nor the account repeats between consecutive episodes. A background credential-theft alert that would complete the sequence within four hours of the opening dormant-user alert names another account that the same workstation normally uses; with no such account it is absent (about 1-3% of theft alerts).",
  eventTypes: [
    {
      id: '23',
      description:
        'Privileged access to the Vault during irregular hours (severity 2)',
      frequency: '60.3% of alerts',
      category: 'Vault access',
    },
    {
      id: '1',
      description: 'Suspected credentials theft (severity 8)',
      frequency: '27.5% of alerts',
      category: 'Credential use outside the Vault',
    },
    {
      id: '26',
      description: 'Active dormant Vault user (severity 5)',
      frequency: '12.2% of alerts',
      category: 'Vault access',
    },
  ],
  realismFeatures: [
    'About 490 alerts on a weekday and 405 on a weekend day, hours in UTC. Irregular-hours alerts peak in the evening (about 26 an hour at 20:00 on weekdays and 32 at weekends), with a smaller early-morning peak (about 14 an hour at 06:00), 3-4 an hour after midnight and about 11 an hour in office hours from users whose usual hours differ; Saturdays and Sundays add about 8 an hour between 08:00 and 22:00. Credential-theft and dormant-user alerts follow the weekday working day (about 10-13 and 4-6 an hour between 08:00 and 18:00, about 1 an hour or fewer at night), with 3-5 theft alerts an hour through the weekend day.',
    'Activity is uneven across actors: fourteen on-call administrators raise about 40% of the irregular-hours alerts (about 7-8 a day each) and about 64% of the dormant-user alerts, and six administrator workstations whose owners connect with known passwords raise about 22% of the theft alerts (4-5 a day each). Other users raise about ten alerts a week at the median, and most other workstations a few.',
    'Incidents vary in shape: single alerts, repeats by the same actor minutes later (an irregular-hours access on the same or another account, a workstation reusing the account) and every two-alert part of the chain - a dormant user accessing the same account at an irregular hour minutes later in the evening or at night, irregular-hours access followed by credential theft on that account 5-60 minutes later, and a dormant-user alert followed by credential theft.',
    'The CEF header and 16 extension keys follow a real PTA 11.4 Elastic fixture and a PTA 12.0 Secureworks Taegis sample, with their labels and link form for all three classes; the EventID is a MongoDB ObjectId prefixed with the detection second, as in both records. Class 1 comes from the Elastic PTA 12.6 example, which matches the CyberArk documentation example rather than a captured record.',
    'The JSON follows the Elastic parsed output without collector fields. @timestamp is the detection time on a whole second without milliseconds, deviceCustomDate1 stays in epoch milliseconds, and sourceAddress and source.ip are left out when src=None because no public fixture shows how the pipeline parses that value.',
    'Only the three detections with a published raw record are modeled, and the meaning of duser, dhost and dst in Vault-user alerts is assumed. Rates, hour and weekday curves, repeat frequencies and actor pools are synthetic; the busiest Vault users raise dormant-user alerts up to about three times a day, far more often than a real dormancy period would allow. Repeated alerts of one actor are rarely less than a minute and a half apart (median about 6 minutes), where PTA may raise alerts of one Vault login within seconds. Severities are fixed per class, with no risk scoring, alert aggregation, ExtraData content, external links, syslog header or transport.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add recurring anomaly episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts; at least 6',
    },
    {
      name: 'pta_version',
      defaultValue: '12.0',
      description:
        'Version in the CEF header, cef.device.version and observer.version',
    },
    {
      name: 'pvwa_host',
      defaultValue: 'pvwa.corp.example.test',
      description: 'PVWA host in the PTA event link (cs3)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Second alert of an episode (step 2, class 23)',
      json: String.raw`{"@timestamp": "2026-09-15T19:14:08Z", "cef": {"device": {"event_class_id": "23", "product": "PTA", "vendor": "CyberArk", "version": "12.0"}, "extensions": {"destinationAddress": "10.20.30.37", "destinationHostName": "srv-app-02.corp.example.test", "destinationUserName": "administrator@srv-app-02.corp.example.test", "deviceCustomDate1": "1789499648000", "deviceCustomDate1Label": "DetectionDate", "deviceCustomString1": "None", "deviceCustomString1Label": "ExtraData", "deviceCustomString2": "6aa9990050dae0b42a456337", "deviceCustomString2Label": "EventID", "deviceCustomString3": "https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa9990050dae0b42a456337", "deviceCustomString3Label": "PTALink", "deviceCustomString4": "None", "deviceCustomString4Label": "ExternalLink", "sourceHostName": "None", "sourceUserName": "i.tarasov(Vault user)"}, "name": "Privileged access to the Vault during irregular hours", "severity": "2", "version": "0"}, "cyberark_pta": {"log": {"event_type": "23"}}, "destination": {"domain": "srv-app-02.corp.example.test", "ip": "10.20.30.37", "user": {"domain": "srv-app-02.corp.example.test", "email": "administrator@srv-app-02.corp.example.test", "name": "administrator"}}, "ecs": {"version": "8.11.0"}, "event": {"code": "23", "dataset": "cyberark_pta.events", "id": "6aa9990050dae0b42a456337", "original": "CEF:0|CyberArk|PTA|12.0|23|Privileged access to the Vault during irregular hours|2|suser=i.tarasov(Vault user) shost=None src=None duser=administrator@srv-app-02.corp.example.test dhost=srv-app-02.corp.example.test dst=10.20.30.37 cs1Label=ExtraData cs1=None cs2Label=EventID cs2=6aa9990050dae0b42a456337 deviceCustomDate1Label=DetectionDate deviceCustomDate1=1789499648000 cs3Label=PTALink cs3=https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa9990050dae0b42a456337 cs4Label=ExternalLink cs4=None", "reason": "Privileged access to the Vault during irregular hours", "reference": "https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa9990050dae0b42a456337", "severity": 2, "url": "None"}, "observer": {"product": "PTA", "vendor": "CyberArk", "version": "12.0"}, "related": {"user": ["i.tarasov(Vault user)", "administrator", "administrator@srv-app-02.corp.example.test"]}, "source": {"domain": "None", "user": {"name": "i.tarasov(Vault user)"}}}`,
    },
  ],
};
