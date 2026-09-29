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
    'About 12,200 records a day on a working-hours curve, with an ACL that follows its rule set',
    'Recurring deny, failed logins, self-permit and allow chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "From one administrator workstation: OUTSIDE_IN denies its connection to its management server on 443, three to five LOGIN_FAILED for the owner account from that address are followed by LOGIN_SUCCESS, CFGLOG_LOGGEDCMD records a host-to-host permit on 443 with CONFIG_I from the same address, and OUTSIDE_IN then permits the connection, all within 30 minutes of the denial. The permit is later removed like any temporary permit. The workstation belongs to netops, admin or a.petrov and differs from the previous episode's. Episodes repeat every 24 hours by default (anomaly_interval_hours, minimum 4): the first starts within the first min(interval, 24 h) of the run; each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, at an hour weighted to administrator activity, plus a random delay of about a minute. Missed episodes are not replayed, and at intervals of 8 hours or less starts cover night hours. Every step occurs in background in both modes; only the complete ordered sequence within 30 minutes never does, and each episode completes it exactly once. Counts of the chain parts are about one per episode higher than with anomaly_mode false.",
  eventTypes: [
    {
      id: '%SEC-6-IPACCESSLOGP OUTSIDE_IN permitted',
      description:
        'Client connection to a permitted service, or to a management server while a temporary permit exists',
      frequency: '76.27% measured share',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP EDGE_FILTER denied',
      description: 'Internet probe of the outside address',
      frequency: '12.32% measured share',
      category: 'network',
    },
    {
      id: '%SEC-6-IPACCESSLOGP OUTSIDE_IN denied',
      description: 'Management-server retries and connections to closed ports',
      frequency: '9.46% measured share',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-5-LOGIN_SUCCESS',
      description:
        'SSH login of an administrator, the config backup account or the compliance job',
      frequency: '1.22% measured share',
      category: 'network',
    },
    {
      id: '%PARSER-5-CFGLOG_LOGGEDCMD',
      description: 'Logged configuration command',
      frequency: '0.33% measured share',
      category: 'network',
    },
    {
      id: '%SYS-5-CONFIG_I',
      description: 'Configuration change from a vty session',
      frequency: '0.17% measured share',
      category: 'network',
    },
    {
      id: '%SEC_LOGIN-4-LOGIN_FAILED',
      description: 'Failed SSH login',
      frequency: '0.17% measured share',
      category: 'network',
    },
    {
      id: '%LINEPROTO-5-UPDOWN',
      description: 'Interface line protocol down or up',
      frequency: '0.06% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'The router sends to a TCP collector with the local7 facility, message counters, UTC timestamps with milliseconds and year, logged ACEs, SSH login logging and archive config logging; event.original uses the frame of the Elastic sample event.',
    'ACL records carry the access list, five-tuple, deny/allow action and a Community ID; LOGIN_SUCCESS carries the user, source address and port 22; LOGIN_FAILED, CFGLOG_LOGGEDCMD, CONFIG_I and UPDOWN carry only message, as the pipeline leaves them. event.category is network for every message.',
    'OUTSIDE_IN permits the server services and ends with a logged deny, so applications that try the management servers 10.50.2.15-10.50.2.19 on 443 are denied unless an administrator has inserted a temporary host-to-host permit ahead of it; EDGE_FILTER denies unsolicited internet connections to 192.0.2.10. An ACL decision always follows the current rule set, and the same first-packet record is not repeated for one ACL, action and five-tuple inside the five-minute log interval.',
    'About 10,700 business connections a day (±3% day to day) on a working-hours curve, UTC by default: about 170 an hour at night, 780 an hour from 07:00 to 15:00. Internet probes come at about 72 an hour around the clock, management-server retries every 10-50 minutes, interface flaps about 2.4 times a day. Rates are synthetic, not measured Cisco production frequencies.',
    'Six administrators make about 30-35 SSH logins a day. About one login in six starts with failed attempts: one or two mistyped passwords, or a run of three to five when the SSH client offers a saved password not valid on this router, sometimes followed by giving up. Sessions are show-only, make one to three configuration changes, or insert or remove a temporary permit (held a median 45 minutes); after a denied retry an administrator sometimes grants their own workstation a permit.',
    'The config backup account oxidized logs in about hourly and now and then fails three times in a row; the read-only compliance account ansible logs in every 15 minutes. About 10% of all login attempts fail, about a third of administrator attempts.',
    'Records a router emits within milliseconds of each other are seconds apart: records of one SSH session a median of about 17 seconds apart (90% within about 75 seconds). Command records name the user but not the session. The message counter skips values to stand for messages outside the modeled families.',
    'Only first-packet IPACCESSLOGP records are produced, with no five-minute aggregated counts or IPACCESSLOGRL summaries. Collector metadata is synthetic, patterned on the Elastic sample event; field values follow the pipeline processors as written in its source, not output of a pipeline run. The CONFIG_I user/vty/address form comes from the Elastic sample and a device capture without an IOS version, so full raw parity with one IOS release is not established.',
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
      json: String.raw`{"@timestamp": "2026-09-01T08:29:26.373Z", "agent": {"ephemeral_id": "960a0fda-a7b7-4362-9018-34b1d0d119c4", "id": "f00ff835-626e-4a18-a8a2-0bb3ebb7503f", "name": "syslog-collector", "type": "filebeat", "version": "8.17.0"}, "cisco": {"ios": {"facility": "PARSER", "message_count": 1065116}}, "data_stream": {"dataset": "cisco_ios.log", "namespace": "default", "type": "logs"}, "ecs": {"version": "8.17.0"}, "elastic_agent": {"id": "f00ff835-626e-4a18-a8a2-0bb3ebb7503f", "snapshot": false, "version": "8.17.0"}, "event": {"agent_id_status": "verified", "category": ["network"], "code": "CFGLOG_LOGGEDCMD", "dataset": "cisco_ios.log", "ingested": "2026-09-01T08:29:26Z", "original": "<189>1065116: Sep  1 2026 08:29:26.373: %PARSER-5-CFGLOG_LOGGEDCMD: User:admin  logged command:80 permit tcp host 10.30.1.31 host 10.50.2.16 eq 443 log", "provider": "firewall", "sequence": 1065116, "severity": 5, "timezone": "+00:00", "type": ["info"]}, "input": {"type": "tcp"}, "log": {"level": "notification", "source": {"address": "10.30.0.1:20745"}, "syslog": {"priority": 189}}, "message": "User:admin  logged command:80 permit tcp host 10.30.1.31 host 10.50.2.16 eq 443 log", "observer": {"product": "IOS", "type": "router", "vendor": "Cisco"}, "tags": ["preserve_original_event", "cisco-ios", "forwarded"]}`,
    },
  ],
};
