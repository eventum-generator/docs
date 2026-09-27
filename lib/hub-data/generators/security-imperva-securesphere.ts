/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityImpervaSecuresphere: GeneratorMeta = {
  slug: 'security-imperva-securesphere',
  displayName: 'Imperva SecureSphere WAF Alerts',
  category: 'security',
  description:
    'Imperva SecureSphere 14.x web application firewall security alerts and management console logins, sent by the Management Server syslog action sets in CEF, as ECS JSON with the native syslog message in event.original and Elastic imperva.securesphere field names. About 300 clients raise alerts against five web applications in four server groups. Recurring episodes show one client triggering two distinct signature rules on one application, then a signature on another application within 30 minutes.',
  dataSource:
    'Imperva SecureSphere 14.x Management Server action sets, security and system events in CEF over syslog',
  format: ['JSON', 'ECS', 'CEF', 'Syslog'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native CEF syslog message in event.original',
    'About 300 weighted clients, each with a home application',
    'Recurring multi-rule burst, then a move to a second application',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (due one interval after generation starts, then one interval after each previous actual start; each start follows its due time by a random delay, exponential with a mean of 20 minutes, so episode times of day drift later and a late episode never causes catch-up), one client raises a burst of two to six alerts on one application with two or more distinct signature rules, then a signature violation on another application a few minutes later (median 4 minutes), all within 30 minutes and linked by the source address. Client and both applications differ from the previous episode; every fragment also occurs in background, and only the complete sequence is kept out of it.',
  generatorId: 'securesphere',
  eventTypes: [
    {
      id: 'Signature',
      description:
        'Signature violation (7 rules: SQL injection, cross-site scripting, traversal and more)',
      frequency: '41.1% act none, 17.4% act block, measured share',
      category: 'alert',
    },
    {
      id: 'Profile',
      description:
        'Profile violation (4 rules: unknown parameter, value length and more)',
      frequency: '20.0% act none, 1.1% act block, measured share',
      category: 'alert',
    },
    {
      id: 'Protocol',
      description: 'HTTP protocol violation (4 rules)',
      frequency: '13.8% act none, 1.8% act block, measured share',
      category: 'alert',
    },
    {
      id: 'Correlation',
      description: 'Correlation alert (2 rules)',
      frequency: '1.6% act none, 2.3% act block, measured share',
      category: 'alert',
    },
    {
      id: 'User logged in',
      description: 'Management console login (system event)',
      frequency: '0.9% measured share',
      category: 'event',
    },
  ],
  realismFeatures: [
    'Five web applications in four server groups (seven servers). About 300 clients, 70% from external networks and 30% internal, each have their own activity weight and a home application that takes about 85% of their alerts; about 60 application users sign in to them. Shares were measured on a 78-hour default capture of 7,444 events and are synthetic workload weights, not measured Imperva rates.',
    'Traffic is a superposition of independent random processes: single alerts of ordinary traffic (false positives and profile deviations of signed-in users, busier during the working day), flat bursts of one to six signature and protocol violations from one client against one application, a quarter of them followed by a correlation alert, standalone correlation alerts and console logins of three administrators.',
    'Multi-rule bursts on one application, correlation alerts after them (block share 55-58% whatever the preceding rule count) and clients raising signatures on a second application all occur in background. A background signature of a client that raised two or more distinct rules on another application within the last 30 minutes is reported on that application instead, which fires on about 2% of multi-rule bursts and lowers moves to a second application inside the window (0.17-0.54% per 10-minute step, against 0.8-1.1% after single-rule starts).',
    'Alert names, policies, descriptions, server groups, services and applications are configurable metadata; the shipped values are examples, not a vendor signature catalog. Alerts without an application user keep the unresolved duser=${Alert.username} placeholder, as in the Elastic fixture of a SecureSphere 15.0 alert. Severity is fixed per rule, and the syslog PRI is constant.',
    'The complete CEF template is documented for versions 6.2-8.5; it is used for 14.x because the v14 placeholder guide keeps the same placeholders and the Elastic 14.16 and 15.0 fixtures carry the same extension keys, but no vendor document states it for 14.x. The act value block comes from the Elastic fixture; the literal none is an assumption. Timestamps are whole seconds in UTC, one event per second at most.',
    'Only security (non-firewall) and system event action-set templates are modeled, and of system events only console logins; firewall alerts, custom policy alerts, DAM audit events and database alerts are not generated.',
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
      description:
        'Hours from the actual start of one episode to the next due time, 2 to 8,760',
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
      name: 'client_count',
      defaultValue: '300',
      description: 'Client addresses, 40 to 600',
    },
    {
      name: 'external_networks',
      defaultValue: '192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24',
      description: 'Networks of external clients',
    },
    {
      name: 'internal_network',
      defaultValue: '10.60.0.0/16',
      description: 'Network of internal clients',
    },
    {
      name: 'external_share',
      defaultValue: '0.7',
      description: 'Share of external clients',
    },
    {
      name: 'user_count',
      defaultValue: '60',
      description: 'Application users, 5 to 500',
    },
    {
      name: 'admins',
      defaultValue:
        'admin (10.43.5.10), secops.lead (10.43.5.21), waf.operator (10.43.5.22)',
      description: 'Console administrators with name and ip',
    },
    {
      name: 'applications',
      defaultValue:
        'Customer Portal, Default Web Application, Online Store, Partner API, HR Portal',
      description:
        'Protected applications with server_group, service, application, servers, port and weight; at least two',
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
    {
      name: 'signatures',
      defaultValue:
        'SQL Injection, Cross-Site Scripting, Directory Traversal, OS Command Injection, Remote File Inclusion, suspicious-pattern, Web Scanner User-Agent',
      description:
        'Signature violations with name, description, severity and weight; at least three',
    },
    {
      name: 'protocol_violations',
      defaultValue:
        'Unknown HTTP Request Method, Double URL Encoding, Malformed HTTP Header, HTTP Request Too Long',
      description:
        'Protocol violations with name, description, severity and weight',
    },
    {
      name: 'profile_violations',
      defaultValue:
        'Unknown Parameter, Parameter Value Length Violation, Unauthorized Method for Known URL, Parameter Type Violation',
      description:
        'Profile violations with name, description, severity and weight',
    },
    {
      name: 'correlations',
      defaultValue: 'Multiple Signature Violations, Scanner Activity',
      description:
        'Correlation alerts with name, description, severity and weight',
    },
  ],
  sampleOutputs: [
    {
      title: 'Violation on the second application closing the first episode',
      json: String.raw`{"@timestamp": "2026-09-27T01:03:26.000Z", "destination": {"ip": "10.43.21.20", "port": 443, "user": {"name": "${'$'}{Alert.username}"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "block", "code": "Signature", "kind": "alert", "original": "\u003c14\u003eCEF:0|Imperva Inc.|SecureSphere|14.16.1.10_0|Signature|SQL Injection|High|act=block dst=10.43.21.20 dpt=443 duser=${'$'}{Alert.username} src=192.0.2.130 spt=57931 proto=TCP rt=Sep 27 2026 01:03:26 cat=Alert cs1=Recommended Signatures Policy for Web Applications cs1Label=Policy cs2=Shop-SG cs2Label=ServerGroup cs3=Shop-HTTPS cs3Label=ServiceName cs4=Online Store cs4Label=ApplicationName cs5=SQL injection pattern in parameter cs5Label=Description", "severity": 7}, "imperva": {"securesphere": {"destination": {"address": "10.43.21.20", "port": 443, "user_name": "${'$'}{Alert.username}"}, "device": {"action": "block", "custom_string1": {"label": "Policy", "value": "Recommended Signatures Policy for Web Applications"}, "custom_string2": {"label": "ServerGroup", "value": "Shop-SG"}, "custom_string3": {"label": "ServiceName", "value": "Shop-HTTPS"}, "custom_string4": {"label": "ApplicationName", "value": "Online Store"}, "custom_string5": {"label": "Description", "value": "SQL injection pattern in parameter"}, "event": {"category": "Alert", "class_id": "Signature"}, "product": "SecureSphere", "receipt_time": "2026-09-27T01:03:26.000Z", "vendor": "Imperva Inc.", "version": "14.16.1.10_0"}, "name": "SQL Injection", "severity": "High", "source": {"address": "192.0.2.130", "port": 57931}, "transport_protocol": "TCP", "version": "0"}}, "message": "SQL Injection", "network": {"transport": "tcp"}, "observer": {"product": "SecureSphere", "vendor": "Imperva Inc.", "version": "14.16.1.10_0"}, "related": {"ip": ["10.43.21.20", "192.0.2.130"], "user": ["${'$'}{Alert.username}"]}, "service": {"name": "Shop-HTTPS"}, "source": {"ip": "192.0.2.130", "port": 57931}, "tags": ["preserve_original_event", "preserve_duplicate_custom_fields"]}`,
    },
  ],
};
