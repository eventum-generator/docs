import type { GeneratorMeta } from '@/lib/hub-types';

export const securitySymantecSepm: GeneratorMeta = {
  slug: 'security-symantec-sepm',
  displayName: 'Symantec Endpoint Protection Manager External Logs',
  category: 'security',
  description:
    'Symantec Endpoint Protection Manager (SEPM) 14.3 external-log records of one SEPM server: the comma-delimited Administrative, Policy and Agent Activity payloads SEPM sends to a syslog server, kept verbatim in event.original in the labelled layout of the Elastic symantec_endpoint fixtures, with the rest of the document following that integration. For teams that test SIEM parsing and detection. About 9,500 records a day from 60 clients and 12 administrators follow the working day in UTC. Recurring episodes show one administrator failing to log on several times, then succeeding and editing the same shared policy twice, reverting the change.',
  dataSource:
    'Symantec Endpoint Protection Manager 14.3 external logging: Administrative, Policy and Agent Activity payloads, without the syslog envelope',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 7,
  templateCount: 1,
  highlights: [
    'Native labelled external-log payload in event.original',
    'About 9,500 records a day from 60 clients and 12 administrators',
    'Recurring failed log-on to repeated policy edit chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "In an extra console session on top of their own, one administrator fails to log on two to four times seconds apart, succeeds, edits one shared policy as the first operation, performs zero to two other operations (edits of other policies or a new group) and edits the same policy again, reverting the change; the clients assigned to that policy download it after each edit, and further ordinary operations may follow. The steps link by symantec_endpoint.log.admin (user.name), the two edits also by symantec_endpoint.log.policy_name. From the first failure to the second edit an episode spans about 2 to 20 minutes, rarely about an hour. The interval is anomaly_interval_hours, 24 by default and at least 6. The first episode starts within min(24 h, interval) of the start of the data, at an hour drawn from the administrators' daily curve; each later one is due one interval after the actual start of the previous one and starts within a window of min(interval / 4, 6 h) centred on that due time, preferring working hours, so later episodes recur at about the same time of day as the first. Missed episodes are not replayed. Episodes start 21.4-27.4 hours apart at the default and 47.4-50.2 hours apart at 48. Each episode uses one of the busy administrator and policy pairs (helpdesk-sec and the USB device control policy, sepm-ops and the exceptions policy, jdoe and the workstation AV policy, msmith and the workstation firewall policy), weighted by how often each pair occurs; consecutive episodes use a different administrator and a different policy. Every step and pair of steps also occurs in the background, each pair dozens of times a week; the background never completes the sequence within 2 hours of the first failure, and beyond 2 hours it occurs as it naturally would.",
  generatorId: 'sepm',
  eventTypes: [
    {
      id: 'client-log-received',
      description:
        'Agent Activity: The management server received the client log successfully',
      frequency: '81.1% of records',
      category: 'none',
    },
    {
      id: 'policy-downloaded',
      description:
        'Agent Activity: The client has downloaded the policy successfully',
      frequency: '17.0% of records',
      category: 'none',
    },
    {
      id: 'policy-edited',
      description:
        'Policy: Policy has been edited: Edited shared <type> policy: <name>',
      frequency: '0.74% of records',
      category: 'none',
    },
    {
      id: 'auto-upgrade-config-downloaded',
      description:
        'Agent Activity: The client has downloaded the auto-upgrade configuration file successfully',
      frequency: '0.64% of records',
      category: 'none',
    },
    {
      id: 'admin-logon (success)',
      description: 'Administrative: Administrator log on succeeded',
      frequency: '0.38% of records',
      category: 'authentication',
    },
    {
      id: 'admin-logon (failure)',
      description:
        'Administrative: Administrator  log on failed (double space, as in the Elastic fixtures)',
      frequency: '0.05% of records',
      category: 'authentication',
    },
    {
      id: 'group-added',
      description: "Administrative: Group '<name>' was added",
      frequency: '0.05% of records',
      category: 'none',
    },
  ],
  realismFeatures: [
    'About 9,500 records a day follow the working day in UTC: about 680 an hour from 08:00 to 18:00, about 320 at 07:00 and 18:00, and about 170 an hour at night. The 10 servers upload logs around the clock, about 8 uploads per server per hour; the 50 workstations in the Workstations, Finance and Sales groups are switched on from 07:00 to 19:00 UTC and upload about 9 times an hour each, and at night only about 10 of them, a different set each night, stay on. About one upload in 125 is an auto-upgrade configuration download instead, roughly one per client per day.',
    'Twelve administrators work console sessions on their own schedules: the time between sessions is lognormal in working hours with a per-account median of 1.25 to 9 hours, and about 3% of administrator records fall between 20:00 and 07:00. Four busy accounts log on about 4 to 7 times a day, the others once or twice. 7% of first log-on attempts fail and 35% of retries after a failure fail too (about one attempt in ten fails); retries follow seconds to minutes later, the administrator gives up after 10% of failures, and five failures in a row lock the account for 15 minutes, with the next attempt after the lockout. The console writes no logout record.',
    'After a successful log-on a quarter of sessions end without an operation; otherwise operations follow a few seconds to 20 minutes apart, each followed by another with probability 0.6. An operation edits one of eight shared policies, or in 7% of cases adds a group; each administrator prefers a few policies, and about a third of edits edit the same policy again in the same session.',
    "Every client in a group assigned to an edited policy downloads it once, even after several edits: 75% within five minutes and 92% within ten, the rest, which were offline, minutes to hours later; workstations switched off at night download it after they are switched on in the morning. Agent Activity records do not name the downloaded policy, so downloads link to an edit only through time and the policy's groups.",
    'Every chain step also occurs in background on its own and in partial sequences: log-ons with two or more failures followed by a success (a few per week), edits of a policy the same administrator edited within the past hour (20 to 30 a day) and failures without a following success. With anomaly_mode on, each episode adds one such log-on sequence (about one a day at the default interval) and one more session for its administrator that day.',
    'Field order follows Broadcom KB 155205; the labelled layout and the exact policy-edit and failed log-on strings are copied from the Elastic integration fixtures. Wording for policy types other than Intrusion Prevention is inferred; policy add or delete, logout, System logs and all client-side logs (scan, risk, traffic, security) are not generated.',
    'No syslog header, dump-file time stamp or severity columns are emitted; @timestamp is the receive time in UTC with milliseconds, and the working day is fixed at 08:00-18:00 UTC with no weekends or holidays. Records the server writes at the same moment are seconds apart instead of milliseconds, a burst of policy downloads spreads over a few minutes, and log-on retries are about 18 seconds apart at the median. As in the Elastic pipeline, event.category and event.outcome are set only for log-on records; event.action is added for convenience.',
    'Log-on records carry no source address, so the chain links by account only; policy records do not show what changed, so the revert is inferred from the repeated edit. Rates and mixes are synthetic workload choices; no recording from a live SEPM server was available for comparison, and compatibility with the KUMA 4.2 Symantec normalizer is not verified.',
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
      json: String.raw`{"@timestamp": "2026-09-07T09:43:32.311Z", "ecs": {"version": "8.11.0"}, "event": {"action": "policy-edited", "dataset": "symantec_endpoint.log", "kind": "event", "original": "Site: Site HQ-SEPM01,Server: HQ-SEPM01,Domain: Default,Admin: msmith,Event Description: Policy has been edited: Edited shared Firewall policy: Workstations Firewall Policy,Workstations Firewall Policy", "provider": "Policy Log"}, "message": "Policy has been edited: Edited shared Firewall policy: Workstations Firewall Policy", "symantec_endpoint": {"log": {"admin": "msmith", "domain_name": "Default", "event_description": "Policy has been edited: Edited shared Firewall policy: Workstations Firewall Policy", "policy_name": "Workstations Firewall Policy", "server": "HQ-SEPM01", "site": "Site HQ-SEPM01"}}, "user": {"domain": "Default", "name": "msmith"}}`,
    },
  ],
};
