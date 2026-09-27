import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySymantecSepm: GeneratorMeta = {
  slug: 'security-symantec-sepm',
  displayName: 'Symantec Endpoint Protection Manager External Logs',
  category: 'security',
  description:
    'Symantec Endpoint Protection Manager (SEPM) 14.3 external-log records of one SEPM server: the comma-delimited Administrative, Policy and Agent Activity payloads SEPM sends to a syslog server, kept verbatim in event.original in the labelled layout of the Elastic symantec_endpoint fixtures, with the rest of the document following that integration. For teams that test SIEM parsing and detection. Recurring episodes show one administrator failing to log on several times, then succeeding and editing the same shared policy twice within minutes.',
  dataSource:
    'Symantec Endpoint Protection Manager 14.3 external logging: Administrative, Policy and Agent Activity payloads, without the syslog envelope',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native labelled external-log payload in event.original',
    '12 administrators and 60 clients on independent schedules',
    'Recurring failed log-on to repeated policy edit chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due at a random point within the first min(4 h, interval/6) of the run; each next one is due one anomaly_interval_hours (24 by default, at least 6) plus a random delay of up to min(4 h, interval/6) after the actual start, so start times drift across the day, and missed episodes are not replayed. An episode starts at the first tick at or after its due time when an administrator other than the previous one is out of session with no own session due within 2 hours. That administrator fails to log on two or more times, succeeds, edits one shared policy as the first operation, performs zero to two other operations and edits the same policy again; the assigned clients download it after each edit. Measured 1.5 to 9.1 minutes from the first failure to the second edit. Administrator and policy change each episode. Every step and pair of steps also occurs in background; only the complete sequence within 2 hours of the first failure is kept out of it.',
  generatorId: 'sepm',
  eventTypes: [
    {
      id: 'policy-downloaded',
      description:
        'Agent Activity: The client has downloaded the policy successfully',
      frequency: '48.7% measured share',
      category: 'none',
    },
    {
      id: 'client-log-received',
      description:
        'Agent Activity: The management server received the client log successfully',
      frequency: '45.8% measured share',
      category: 'none',
    },
    {
      id: 'admin-logon (success)',
      description: 'Administrative: Administrator log on succeeded',
      frequency: '1.8% measured share',
      category: 'authentication',
    },
    {
      id: 'policy-edited',
      description:
        'Policy: Policy has been edited: Edited shared <type> policy: <name>',
      frequency: '1.7% measured share',
      category: 'none',
    },
    {
      id: 'auto-upgrade-config-downloaded',
      description:
        'Agent Activity: The client has downloaded the auto-upgrade configuration file successfully',
      frequency: '1.2% measured share',
      category: 'none',
    },
    {
      id: 'admin-logon (failure)',
      description:
        'Administrative: Administrator  log on failed (double space, as in the Elastic fixtures)',
      frequency: '0.6% measured share',
      category: 'authentication',
    },
    {
      id: 'group-added',
      description: "Administrative: Group '<name>' was added",
      frequency: '0.1% measured share',
      category: 'none',
    },
  ],
  realismFeatures: [
    'Twelve administrators follow their own random console-session schedules, with a per-account median gap of 1.5 to 9 hours. 20% of first log-on attempts fail and 45% of retries after a failure fail too; after a success a session holds zero or more operations, each an edit of one of eight weighted shared policies or, in 7% of cases, a new group, and about a third of edits edit the same policy again. The console writes no logout record.',
    'Sixty clients in the Workstations, Finance, Sales and Servers groups upload logs on independent schedules, each with its own median gap of 20 to 80 minutes, and download the auto-upgrade configuration about daily. After each edit every client in a group assigned to that policy downloads it, 88% within about five minutes and the rest minutes to hours later.',
    'Chain steps occur in background: per 10-day background capture, 12 to 27 log-ons with two or more failures followed by a success, 109 to 138 edits of a policy the same administrator edited within the past hour, and 10 to 19 failures with no success within 10 minutes. Beyond 2 hours from the first failure, the complete sequence occurs in background as it naturally would.',
    'Field order follows Broadcom KB 155205; the labelled layout and the exact policy-edit and failed log-on strings are copied from the Elastic integration fixtures. Wording for policy types other than Intrusion Prevention is inferred; policy add or delete, logout, System logs and all client-side logs are not generated.',
    'No syslog header, dump-file time stamp or severity columns are emitted; @timestamp is the receive time in UTC with milliseconds, and sessions and uploads have no diurnal pattern. As in the Elastic pipeline, event.category and event.outcome are set only for log-on records; event.action is added for convenience.',
    'Log-on records carry no source address, so the chain links by account only; policy records do not show what changed, so the revert is inferred from the repeated edit, and Agent Activity records do not name the downloaded policy. Rates and mixes are synthetic workload choices; no live SEPM capture was compared and KUMA compatibility is not verified.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include periodic anomaly episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours between episode starts, 6 to 8,760; other values fail validation',
    },
    {
      name: 'site_name',
      defaultValue: 'Site HQ-SEPM01',
      description: 'SEPM site name (Site: field)',
    },
    {
      name: 'server_name',
      defaultValue: 'HQ-SEPM01',
      description: 'SEPM server name (Server: / Server Name: field)',
    },
    {
      name: 'sepm_domain',
      defaultValue: 'Default',
      description: 'SEPM domain (Domain: / Domain Name: field)',
    },
    {
      name: 'machine_domain',
      defaultValue: 'corp.contoso.com',
      description: 'Client machine domain, the last Agent Activity field',
    },
  ],
  sampleOutputs: [
    {
      title: 'Second edit of the policy in an episode (step 5)',
      json: String.raw`{"@timestamp": "2026-09-01T01:23:24.130Z", "ecs": {"version": "8.11.0"}, "event": {"action": "policy-edited", "dataset": "symantec_endpoint.log", "kind": "event", "original": "Site: Site HQ-SEPM01,Server: HQ-SEPM01,Domain: Default,Admin: helpdesk-sec,Event Description: Policy has been edited: Edited shared Virus and Spyware Protection policy: Workstations AV Policy,Workstations AV Policy", "provider": "Policy Log"}, "message": "Policy has been edited: Edited shared Virus and Spyware Protection policy: Workstations AV Policy", "symantec_endpoint": {"log": {"admin": "helpdesk-sec", "domain_name": "Default", "event_description": "Policy has been edited: Edited shared Virus and Spyware Protection policy: Workstations AV Policy", "policy_name": "Workstations AV Policy", "server": "HQ-SEPM01", "site": "Site HQ-SEPM01"}}, "user": {"domain": "Default", "name": "helpdesk-sec"}}`,
    },
  ],
};
