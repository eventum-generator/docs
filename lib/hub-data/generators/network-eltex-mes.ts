/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexMes: GeneratorMeta = {
  slug: 'network-eltex-mes',
  displayName: 'Eltex MES Switch Syslog',
  category: 'network',
  description:
    'Syslog messages of one Eltex MES5324 access switch as ECS JSON: HTTPS logins of administrators and automation accounts, interface speed and link changes, MAC table notifications and logging configuration changes, with the native message body verbatim in event.original and message. About 900 messages an hour around the clock, almost all of them MAC table notifications. Recurring episodes join a run of failed logins of a shared account to a port disruption and logging changes on the same switch.',
  dataSource:
    'Eltex MES5324 syslog message bodies, unversioned MES23xx/MES33xx/MES35xx/MES5324 message catalog',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'Native catalog message body in event.original',
    '24 ports, two automation and six administrator accounts',
    'Recurring failed-login to port-disruption chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One shared account fails three HTTPS logins from one source seconds apart, logs in, sets a 10G server port to 1G (Down and MAC removals of that port follow), clears the local logging file, removes the auxiliary syslog receiver (re-adding it first if another administrator removed it meanwhile) and disconnects. Port speed, link and receiver are restored within the same session or by the next administrator to log in, usually minutes to about two hours later. An episode spans about two to fifteen minutes; the account normally alternates between the two shared accounts and the port differs from the previous episode's. The first episode starts within the first anomaly_interval_hours or 24 hours, whichever is shorter (default 24, minimum 6); each later one starts one interval after the previous start, within a window a quarter of the interval wide but at most 6 hours, centred on that time (default 21 to 27 hours after the previous start). If no shared account or server port is free within the window, that episode is skipped and not made up later. Starts fall at any hour of the day. Each step, and every shorter part of the sequence, also occurs in ordinary administration, which never holds the complete sequence within one hour. An episode is one extra session, so counts of the chain's parts are about one per episode higher than in background-only data.",
  generatorId: 'mes',
  eventTypes: [
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED (Removed)',
      description:
        'MAC address removed by aging or after a port Down (mac_removed)',
      frequency: '48.79% typical share',
      category: 'network',
    },
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED (learnt)',
      description:
        'MAC address learnt, including relearning after Up (mac_learned)',
      frequency: '48.77% typical share',
      category: 'network',
    },
    {
      id: 'AAA-I-CONNECT',
      description: 'HTTPS login accepted (login_accepted)',
      frequency: '0.89% typical share',
      category: 'authentication',
    },
    {
      id: 'AAA-I-DISCONNECT',
      description: 'HTTPS session terminated (session_terminated)',
      frequency: '0.89% typical share',
      category: 'authentication',
    },
    {
      id: 'LINK-W-Down',
      description: 'Interface link down (interface_down)',
      frequency: '0.19% typical share',
      category: 'network',
    },
    {
      id: 'LINK-W-Up',
      description: 'Interface link up (interface_up)',
      frequency: '0.19% typical share',
      category: 'network',
    },
    {
      id: 'LINK-N-PortConfRecover',
      description:
        'Server port set to 1G or back to 10G (interface_speed_changed)',
      frequency: '0.11% typical share',
      category: 'configuration, network',
    },
    {
      id: 'AAA-W-REJECT',
      description: 'HTTPS login rejected (login_rejected)',
      frequency: '0.09% typical share',
      category: 'authentication',
    },
    {
      id: 'SYSLOG-N-CLEARLOGGINGFILE',
      description: 'Local logging file cleared (logging_file_cleared)',
      frequency: '0.04% typical share',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NOSYSLOGSERVER',
      description: 'Auxiliary syslog receiver deleted (syslog_server_deleted)',
      frequency: '0.02% typical share',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NEWSYSLOGSERVER',
      description: 'Auxiliary syslog receiver added (syslog_server_added)',
      frequency: '0.02% typical share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'One switch with 24 ports: twenty access ports with 64 MAC addresses each and four dual-rate 1G/10G server ports with three each, configured for 10G. About 900 messages an hour (±5% from hour to hour) at random moments around the clock, with no daily cycle. Every endpoint, port and administrator follows its own random schedule, with no fixed period, rotation or global wave.',
    'Each MAC address is learnt and later removed by aging after lognormal present and absent times; a Down removes every present address of that port one by one, and the addresses are learnt again after Up. Ports flap on their own (Up after seconds to minutes), and administrators also shut ports down and re-enable them.',
    'Two automation accounts log in over HTTPS from their own addresses and change nothing: nms-backup about every hour, nms-poll about every ten minutes, each cycle a few percent early or late. They make up most logins and almost never fail.',
    'Six administrator accounts log in over HTTPS: the shared admin and noc-duty accounts, used by several NOC engineers, about every one and a half to two and a half hours each, and four personal accounts about twice a day. Mistyped passwords come mostly from the shared accounts, on every day; a single failure is the most common, each longer run up to four in a row is rarer, and consecutive failures stay below a lockout threshold of 5. About 8% of login attempts fail. An ordinary session changes something only now and then, usually a port shutdown and re-enable; changed state is restored within the session or by the next administrator to log in.',
    'About three days in ten carry planned work: most shared-account sessions that day are change sessions, whose login often starts with mistyped passwords after a password rotation and which set a server port to 1G, clear the logging file and remove the auxiliary receiver, usually in that order, before the changes are restored. A typical change day has about 182 logins, 26 failed logins, 37 speed changes, 15 file clears and 9 receiver removals; another day about 185, 12, 9, 1.7 and 1.1. Rates, durations and operation mix are synthetic workload choices, not measured Eltex production frequencies.',
    'Message bodies only: the catalog carries no firmware version, and no syslog priority, timestamp, hostname or transport framing is emitted; observer.model and the parsed eltex.mes.details fields are normalization. The learnt form comes from the catalog parameter table, so its live capitalization is unconfirmed. Console, Telnet and SSH sessions are not modeled. Configuration lines name no user, so linking them to a login is temporal only. Messages the switch writes within milliseconds appear seconds apart: a Down follows its speed change after a median of 3.0 s, and the MAC removals after an access port Down take a median of 3.3 minutes. No live capture, exact-build trace or maintained Elastic integration for Eltex MES was available for comparison.',
  ],
  parameters: [
    {
      name: 'switch_name',
      defaultValue: 'mes-access-01',
      description: 'Switch name in observer.name and observer.hostname',
    },
    {
      name: 'switch_ip',
      defaultValue: '10.40.0.11',
      description: 'Switch address; destination of administrator logins',
    },
    {
      name: 'syslog_server_ip',
      defaultValue: '10.40.0.12',
      description:
        'Auxiliary syslog receiver removed and re-added; the collector receiving this stream is a second destination that is never changed',
    },
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
        'Hours between episode starts; 6 to 8760, smaller values fail validation',
    },
  ],
  sampleOutputs: [
    {
      title: "An episode's first failed login",
      json: String.raw`{"@timestamp": "2026-09-02T21:18:31.319+00:00", "destination": {"ip": "10.40.0.11"}, "ecs": {"version": "8.17.0"}, "eltex": {"mes": {"component": "AAA", "details": {"connection": {"auth_method": "local user table", "type": "https"}}, "mnemonic": "REJECT", "severity_code": "W"}}, "event": {"action": "login_rejected", "category": ["authentication"], "dataset": "eltex.mes.syslog", "kind": "event", "module": "eltex", "original": "AAA-W-REJECT: New https connection for user noc-duty, source 10.40.1.12 destination 10.40.0.11, local user table REJECTED.", "outcome": "failure", "type": ["start", "denied"]}, "log": {"level": "warning"}, "message": "AAA-W-REJECT: New https connection for user noc-duty, source 10.40.1.12 destination 10.40.0.11, local user table REJECTED.", "observer": {"hostname": "mes-access-01", "ip": ["10.40.0.11"], "model": "MES5324", "name": "mes-access-01", "product": "MES", "type": "switch", "vendor": "Eltex"}, "source": {"ip": "10.40.1.12"}, "user": {"name": "noc-duty"}}`,
    },
  ],
};
