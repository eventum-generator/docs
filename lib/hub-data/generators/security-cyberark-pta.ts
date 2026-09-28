import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCyberarkPta: GeneratorMeta = {
  slug: 'security-cyberark-pta',
  displayName: 'CyberArk Privileged Threat Analytics',
  category: 'security',
  description:
    'CyberArk Privileged Threat Analytics (PTA) security alerts as PTA sends them to a SIEM over syslog in CEF, each line the ECS JSON document the Elastic cyberark_pta integration builds, with the CEF record in event.original. For SIEM parsing and correlation testing: one PTA server watches one Vault with 41 Vault users, 55 privileged accounts and 32 administrator workstations and jump hosts. Every record is a PTA detection, not benign activity. Recurring episodes chain dormant-user, irregular-hours and credential-theft alerts on one privileged account.',
  dataSource:
    'CyberArk PTA 12.0 CEF security events over syslog, in the ECS JSON of the Elastic cyberark_pta integration',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  generatorId: 'pta',
  highlights: [
    'CEF layout of two real PTA 11.4 and 12.0 exports',
    'Per-actor alert schedules over one Vault',
    'Dormant user, irregular-hours access and credential theft on one account',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "On one privileged account, PTA raises Active dormant Vault user (26) for Vault user V, then Privileged access to the Vault during irregular hours (23) for the same V a minute or two later, sometimes repeated, then a workstation or jump host that normally uses the account raises Suspected credentials theft (1), typically 10-30 minutes later; an episode usually spans under half an hour and at most a few hours. Episodes recur on source time every anomaly_interval_hours (default 24, minimum 6). The first starts within the first min(interval, 24 h) of the run, at a time drawn with the hour-of-day profile of background dormant-then-irregular incidents (mostly nights and weekends); each next one is due one interval after the previous episode's actual start and starts within a window of min(interval / 4, 6 h) centred on the due time, weighted by the square of that profile plus a small floor, so any hour stays possible (measured 22.4-26.3 h apart at the default, 7.1-8.8 h at 8 h). Missed intervals are not caught up. Every alert and every pair of them also occurs in background; only a background credential-theft alert that would complete the full sequence within four hours of the opening dormant-user alert is not raised, and nothing else moves.",
  eventTypes: [
    {
      id: '23',
      description:
        'Privileged access to the Vault during irregular hours (severity 2)',
      frequency: '58.2% measured share',
      category: 'Vault access',
    },
    {
      id: '1',
      description: 'Suspected credentials theft (severity 8)',
      frequency: '33.0% measured share',
      category: 'Credential use outside the Vault',
    },
    {
      id: '26',
      description: 'Active dormant Vault user (severity 5)',
      frequency: '8.8% measured share',
      category: 'Vault access',
    },
  ],
  realismFeatures: [
    'Every Vault user and workstation raises alerts on its own schedule: independent lognormal gaps weighted per actor, thinned by an hour-of-day profile. Irregular-hours alerts fall mostly at night and at weekends, lone dormant-user alerts mostly in working hours, credential-theft alerts across the day with a daytime lean. Six days of the default configuration measured 204 alerts per day, five background-only runs 190-222.',
    'Background holds single alerts, repeats by the same actor within minutes and every two-step part of the chain. Episode actors are drawn from recent background alerts, so every user, account, workstation and actor-account pair of an episode also occurs in ordinary alerts; neither the Vault user nor the account repeats between consecutive episodes.',
    'The CEF header and 16 extension keys follow a real PTA 11.4 Elastic fixture and a PTA 12.0 Secureworks Taegis sample, with their labels and link form for all three classes; the EventID is a MongoDB ObjectId prefixed with the detection second, as in both records. Class 1 comes from the Elastic PTA 12.6 example, which matches the CyberArk documentation example rather than a captured record.',
    'The JSON follows the Elastic parsed output without collector fields; deviceCustomDate1 stays in epoch milliseconds, and source.ip is left out when src=None because no public fixture shows how the pipeline parses that value.',
    'Only the three detections with a published raw record are modeled. The meaning of duser, dhost and dst in Vault-user alerts is assumed; rates, hour-of-day profiles and actor pools are synthetic, and dormant-user alerts recur for one user more often than a real dormancy period would allow. Severities are fixed per class, with no risk scoring, aggregation, syslog header or transport.',
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
      json: String.raw`{"@timestamp": "2026-09-14T20:56:21Z", "cef": {"device": {"event_class_id": "23", "product": "PTA", "vendor": "CyberArk", "version": "12.0"}, "extensions": {"destinationAddress": "10.20.11.84", "destinationHostName": "dc-03.corp.example.test", "destinationUserName": "administrator@dc-03.corp.example.test", "deviceCustomDate1": "1789419381000", "deviceCustomDate1Label": "DetectionDate", "deviceCustomString1": "None", "deviceCustomString1Label": "ExtraData", "deviceCustomString2": "6aa85f7534828bcc7ef3d533", "deviceCustomString2Label": "EventID", "deviceCustomString3": "https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa85f7534828bcc7ef3d533", "deviceCustomString3Label": "PTALink", "deviceCustomString4": "None", "deviceCustomString4Label": "ExternalLink", "sourceHostName": "None", "sourceUserName": "m.orlov(Vault user)"}, "name": "Privileged access to the Vault during irregular hours", "severity": "2", "version": "0"}, "cyberark_pta": {"log": {"event_type": "23"}}, "destination": {"domain": "dc-03.corp.example.test", "ip": "10.20.11.84", "user": {"domain": "dc-03.corp.example.test", "email": "administrator@dc-03.corp.example.test", "name": "administrator"}}, "ecs": {"version": "8.11.0"}, "event": {"code": "23", "dataset": "cyberark_pta.events", "id": "6aa85f7534828bcc7ef3d533", "original": "CEF:0|CyberArk|PTA|12.0|23|Privileged access to the Vault during irregular hours|2|suser=m.orlov(Vault user) shost=None src=None duser=administrator@dc-03.corp.example.test dhost=dc-03.corp.example.test dst=10.20.11.84 cs1Label=ExtraData cs1=None cs2Label=EventID cs2=6aa85f7534828bcc7ef3d533 deviceCustomDate1Label=DetectionDate deviceCustomDate1=1789419381000 cs3Label=PTALink cs3=https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa85f7534828bcc7ef3d533 cs4Label=ExternalLink cs4=None", "reason": "Privileged access to the Vault during irregular hours", "reference": "https://pvwa.corp.example.test:443/PasswordVault/v10/pta/events/6aa85f7534828bcc7ef3d533", "severity": 2, "url": "None"}, "observer": {"product": "PTA", "vendor": "CyberArk", "version": "12.0"}, "related": {"user": ["m.orlov(Vault user)", "administrator", "administrator@dc-03.corp.example.test"]}, "source": {"domain": "None", "user": {"name": "m.orlov(Vault user)"}}}`,
    },
  ],
};
