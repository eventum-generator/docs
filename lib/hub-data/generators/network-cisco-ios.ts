/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoIos: GeneratorMeta = {
  slug: 'network-cisco-ios',
  displayName: 'Cisco IOS Syslog',
  category: 'network',
  description:
    'Remote TCP syslog from one Cisco IOS router as the Elastic Cisco IOS integration stores it: ACL decisions, SSH logins, configuration commands and changes, and interface line-protocol changes, with the native message in event.original. For SIEM content that correlates access-list changes with administrator logins; recurring episodes show an administrator opening a management server to their own workstation after failed logins.',
  dataSource:
    'Cisco IOS remote TCP syslog (local7, sequence numbers, UTC msec timestamps), Elastic Cisco IOS integration fields',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 8,
  templateCount: 1,
  generatorId: 'network-cisco-ios',
  highlights: [
    'Fields per message type as the Elastic ingest pipeline produces them',
    'Six administrators, 40 clients and an ACL that follows its rule set',
    'Recurring deny, failed logins, self-permit and allow chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'From one administrator workstation: OUTSIDE_IN denies its connection to its management server on 443, three to five LOGIN_FAILED for the owner account are followed by LOGIN_SUCCESS, CFGLOG_LOGGEDCMD records a host-to-host permit on 443 with CONFIG_I from the same address, and OUTSIDE_IN then permits the connection, all within 30 minutes of the denial. The permit is later removed like any temporary permit. Episodes repeat every 24 hours by default (anomaly_interval_hours, minimum 4): the first within the first min(interval, 24 h) of the run, each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted to administrator activity hours, plus about a minute of delay; missed episodes are not replayed, and at intervals of 8 hours or less starts cover night hours. The workstation differs from the previous episode. Every step occurs in background; a background permitted connection that would complete the chain is not logged.',
  eventTypes: [
    {
      id: '%SEC-6-IPACCESSLOGP OUTSIDE_IN permitted',
      description:
        'Client connection to a permitted service, or to a management server while a temporary permit exists',
      frequency: '80.03% measured share',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP EDGE_FILTER denied',
      description: 'Internet probe of the outside address',
      frequency: '12.58% measured share',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP OUTSIDE_IN denied',
      description: 'Management-server retries and connections to closed ports',
      frequency: '6.44% measured share',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-5-LOGIN_SUCCESS',
      description: 'SSH login of an administrator or the config backup account',
      frequency: '0.34% measured share',
      category: 'network',
    },
    {
      id: '%PARSER-5-CFGLOG_LOGGEDCMD',
      description: 'Logged configuration command',
      frequency: '0.27% measured share',
      category: 'network',
    },
    {
      id: '%SYS-5-CONFIG_I',
      description: 'Configuration change from a vty session',
      frequency: '0.15% measured share',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-4-LOGIN_FAILED',
      description: 'Failed SSH login',
      frequency: '0.15% measured share',
      category: 'network',
    },
    {
      id: '%LINEPROTO-5-UPDOWN',
      description: 'Interface line protocol down or up',
      frequency: '0.05% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'The router sends to a TCP collector with the local7 facility, message counters, UTC timestamps with milliseconds and year, logged ACEs, SSH login logging and archive config logging; event.original uses the frame of the Elastic sample event.',
    'ACL records carry the access list, five-tuple, deny/allow action and a Community ID; LOGIN_SUCCESS carries the user, source address and port 22; LOGIN_FAILED, CFGLOG_LOGGEDCMD, CONFIG_I and UPDOWN carry only message, as the pipeline leaves them. event.category is network for every message.',
    'Background is a set of independent random processes: business connections on a UTC working-hours curve, management-server retries, internet probe bursts, administrator sessions with typo failures and give-ups, temporary permits held a median 45 minutes, a config backup account that sometimes fails three times in a row, and interface flaps.',
    'An ACL decision always follows the current rule set, and the same first-packet record is not repeated for one ACL, action and five-tuple inside the five-minute log interval. Rates are synthetic, not measured Cisco production frequencies.',
    'Only first-packet IPACCESSLOGP records are produced (no aggregated counts or IPACCESSLOGRL), at most one message per second. Collector metadata is synthetic; output was checked against the pipeline source, not by running it, and full raw parity with one IOS release is not established.',
  ],
  parameters: [
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Router address; the collector peer in log.source.address',
    },
    {
      name: 'acl_name',
      defaultValue: 'OUTSIDE_IN',
      description: 'Name of the edited ACL protecting the servers',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the anomaly chain; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episode starts, 4 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Permit command of an episode',
      json: String.raw`{"@timestamp": "2026-09-25T11:37:42.893Z", "agent": {"ephemeral_id": "960a0fda-a7b7-4362-9018-34b1d0d119c4", "id": "f00ff835-626e-4a18-a8a2-0bb3ebb7503f", "name": "syslog-collector", "type": "filebeat", "version": "8.17.0"}, "cisco": {"ios": {"facility": "PARSER", "message_count": 1827406}}, "data_stream": {"dataset": "cisco_ios.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.17.0"}, "elastic_agent": {"id": "f00ff835-626e-4a18-a8a2-0bb3ebb7503f", "snapshot": false, "version": "8.17.0"}, "event": {"agent_id_status": "verified", "category": ["network"], "code": "CFGLOG_LOGGEDCMD", "dataset": "cisco_ios.log", "ingested": "2026-09-25T11:37:43Z", "original": "<189>1827406: Sep 25 2026 11:37:42.893: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin  logged command:90 permit tcp host 10.30.1.31 host 10.50.2.16 eq 443 log", "provider": "firewall", "sequence": 1827406, "severity": 5, "timezone": "+00:00", "type": ["info"]}, "input": {"type": "tcp"}, "log": {"level": "notification", "source": {"address": "10.30.0.1:29659"}, "syslog": {"priority": 189}}, "message": "User:admin  logged command:90 permit tcp host 10.30.1.31 host 10.50.2.16 eq 443 log", "observer": {"product": "IOS", "type": "router", "vendor": "Cisco"}, "tags": ["preserve_original_event", "cisco-ios", "forwarded"]}`,
    },
  ],
};
