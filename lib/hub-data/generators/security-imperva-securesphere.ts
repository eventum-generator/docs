import type { GeneratorMeta } from '@/lib/hub-types';

export const securityImpervaSecuresphere: GeneratorMeta = {
  slug: 'security-imperva-securesphere',
  displayName: 'Imperva SecureSphere WAF Alerts',
  category: 'security',
  description:
    'Imperva SecureSphere 14.x web application firewall security alerts and management console logins, sent by the Management Server syslog action sets in CEF, as ECS JSON with the native syslog message in event.original and Elastic imperva.securesphere field names. 600 client addresses raise alerts against five web applications in four server groups, about 9,750 records a day, busiest at 09:00-18:00 UTC. Recurring episodes show one client triggering two distinct signature rules on one application, then a signature on another application within 30 minutes.',
  dataSource:
    'Imperva SecureSphere 14.x Management Server action sets, security and system events in CEF over syslog',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native CEF syslog message in event.original',
    '600 weighted clients, each with a home and a second application',
    'Recurring multi-rule burst, then a move to a second application',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default, one client raises a burst of two to six alerts on one application with two or more distinct signature rules, then a signature violation on another application a few minutes later (median 4 minutes), all within 30 minutes and linked by the source address. The first episode starts within the first anomaly_interval_hours (at most 24 hours), at a time drawn from the hourly rate of bursts; each next one is due one interval after the actual start of the previous one and starts in a window of a quarter of the interval (at most 6 hours) centred on the due time, weighted toward the busier burst hours. Missed episodes are not caught up. The client and both applications differ from the previous episode; every fragment of the chain also occurs in the background, and only the complete sequence is kept out of it.',
  generatorId: 'securesphere',
  eventTypes: [
    {
      id: 'Signature',
      description:
        'Signature violation (7 rules: SQL injection, cross-site scripting, traversal and more)',
      frequency: '42.9% of records with act none, 17.5% with act block',
      category: 'alert',
    },
    {
      id: 'Profile',
      description:
        'Profile violation (4 rules: unknown parameter, value length and more)',
      frequency: '17.0% of records with act none, 0.9% with act block',
      category: 'alert',
    },
    {
      id: 'Protocol',
      description: 'HTTP protocol violation (4 rules)',
      frequency: '14.8% of records with act none, 1.7% with act block',
      category: 'alert',
    },
    {
      id: 'Correlation',
      description: 'Correlation alert (2 rules)',
      frequency: '2.3% of records with act none, 2.7% with act block',
      category: 'alert',
    },
    {
      id: 'User logged in',
      description: 'Management console login (system event)',
      frequency: '0.2% of records',
      category: 'event',
    },
  ],
  realismFeatures: [
    'Five web applications in four server groups (seven servers); the HR Portal is reachable from the internal network only. 600 client addresses, 396 from external networks and 204 internal, each have an activity weight, a home application that takes about 70% of their alerts, a second application with about 20%, and the rest spread over the applications by weight. Every address belongs to one of 106 application users, named in the alert when the client is signed in; about a quarter of the alerts carry a user name. The shares are synthetic workload weights, not measured Imperva rates.',
    'About 9,750 records a day, all times UTC: about 255 an hour at night (21:00-07:00), 420 at 07:00-09:00 and 18:00-21:00, and 560 at 09:00-18:00, with daily totals varying by about 3%. Every day follows the same hour curve; weekends and holidays are not quieter.',
    'Single alerts on ordinary traffic (false positives, profile deviations of signed-in users, odd clients) follow the working day of the users. About 1,600 bursts a day of scanners, attack tools and broken clients come around the clock: one to six signature and protocol violations of one client against one application, a median of about 40 s apart, with rules repeating inside a burst, and a quarter of them followed by a correlation alert a minute or two later. About 90 standalone correlation alerts a day cover traffic that raised no single alert, and three administrators log in to the console about 23 times a day, almost all at 08:00-18:00.',
    'Multi-rule bursts on one application, correlation alerts after them and clients raising signature violations on their other applications all occur in both modes, and the hourly volume is the same in both. Within 30 minutes after a client raises two distinct signature rules on one application, its further signature violations stay on that application, so moves to another application in that time are about a quarter as frequent as in the following half hour. With anomaly_mode true each episode adds its own multi-rule burst and move, so these patterns are about one per episode more frequent than with false.',
    'Alert names, policy names, descriptions, server groups, services and applications are configurable metadata in the sample files; the shipped values are examples, not a vendor signature catalog. Alerts of traffic without a signed-in application user keep the unresolved duser=${Alert.username} placeholder, as in the Elastic fixture of a SecureSphere 15.0 alert. Severity is fixed per rule (Low, Medium, High), console logins carry severity High as in the Elastic fixtures, and the syslog PRI is constant.',
    'The complete CEF template is documented for versions 6.2-8.5; it is used for 14.x because the v14 placeholder guide keeps the same placeholders and the Elastic 14.16 and 15.0 fixtures carry the same extension keys, but no vendor document states it for 14.x. The act value block comes from the Elastic fixture; the literal none is an assumption. Timestamps are whole seconds as in rt, which carries no time zone (UTC is used), and several records can share a second.',
    'Only security (non-firewall) and system event action-set templates are modeled, and of system events only console logins; firewall alerts, custom policy alerts, DAM audit events and database alerts are not generated. The same 600 client addresses recur every day, no new addresses appear, and each address signs in as one user.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic episodes to the background; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 2 to 8,760',
    },
    {
      name: 'device_version',
      defaultValue: '14.16.1.10_0',
      description: 'CEF Device Version, as typed into the action set message',
    },
    {
      name: 'syslog_pri',
      defaultValue: '14',
      description:
        'Syslog PRI prefix, the facility and level of the action set',
    },
    {
      name: 'signature_policy',
      defaultValue: 'Recommended Signatures Policy for Web Applications',
      description: 'cs1 of signature violations',
    },
    {
      name: 'protocol_policy',
      defaultValue: 'Web Protocol Policy',
      description: 'cs1 of protocol violations',
    },
    {
      name: 'profile_policy',
      defaultValue: 'Web Profile Policy',
      description: 'cs1 of profile violations',
    },
    {
      name: 'correlation_policy',
      defaultValue: 'Web Correlation Policy',
      description: 'cs1 of correlation alerts',
    },
  ],
  sampleOutputs: [
    {
      title: 'Violation on the second application closing the first episode',
      json: String.raw`{"@timestamp": "2026-10-05T14:27:16.000Z", "destination": {"ip": "10.43.22.30", "port": 8443, "user": {"name": "${'$'}{Alert.username}"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "block", "code": "Signature", "kind": "alert", "original": "\u003c14\u003eCEF:0|Imperva Inc.|SecureSphere|14.16.1.10_0|Signature|SQL Injection|High|act=block dst=10.43.22.30 dpt=8443 duser=${'$'}{Alert.username} src=203.0.113.176 spt=50806 proto=TCP rt=Oct 05 2026 14:27:16 cat=Alert cs1=Recommended Signatures Policy for Web Applications cs1Label=Policy cs2=Partner-SG cs2Label=ServerGroup cs3=Partner-API cs3Label=ServiceName cs4=Partner API cs4Label=ApplicationName cs5=SQL injection pattern in parameter cs5Label=Description", "severity": 7}, "imperva": {"securesphere": {"destination": {"address": "10.43.22.30", "port": 8443, "user_name": "${'$'}{Alert.username}"}, "device": {"action": "block", "custom_string1": {"label": "Policy", "value": "Recommended Signatures Policy for Web Applications"}, "custom_string2": {"label": "ServerGroup", "value": "Partner-SG"}, "custom_string3": {"label": "ServiceName", "value": "Partner-API"}, "custom_string4": {"label": "ApplicationName", "value": "Partner API"}, "custom_string5": {"label": "Description", "value": "SQL injection pattern in parameter"}, "event": {"category": "Alert", "class_id": "Signature"}, "product": "SecureSphere", "receipt_time": "2026-10-05T14:27:16.000Z", "vendor": "Imperva Inc.", "version": "14.16.1.10_0"}, "name": "SQL Injection", "severity": "High", "source": {"address": "203.0.113.176", "port": 50806}, "transport_protocol": "TCP", "version": "0"}}, "message": "SQL Injection", "network": {"transport": "tcp"}, "observer": {"product": "SecureSphere", "vendor": "Imperva Inc.", "version": "14.16.1.10_0"}, "related": {"ip": ["10.43.22.30", "203.0.113.176"], "user": ["${'$'}{Alert.username}"]}, "service": {"name": "Partner-API"}, "source": {"ip": "203.0.113.176", "port": 50806}, "tags": ["preserve_original_event", "preserve_duplicate_custom_fields"]}`,
    },
  ],
};
