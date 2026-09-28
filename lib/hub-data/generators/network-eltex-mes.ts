/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexMes: GeneratorMeta = {
  slug: 'network-eltex-mes',
  displayName: 'Eltex MES Switch Syslog',
  category: 'network',
  description:
    'Syslog messages of one Eltex MES5324 access switch as ECS JSON: HTTPS administrator logins, interface speed and link changes, MAC table notifications and logging configuration changes, with the native message body verbatim in event.original. Recurring episodes join repeated failed logins to a port disruption and logging changes on the same switch.',
  dataSource:
    'Eltex MES5324 syslog message bodies, unversioned MES23xx/MES33xx/MES35xx/MES5324 message catalog',
  format: ['JSON', 'ECS', 'Syslog body'],
  eventCount: 11,
  templateCount: 1,
  highlights: [
    'Native catalog message body in event.original',
    'Independent schedules for 60 endpoints, 8 ports and 6 administrators',
    'Recurring failed-login to port-disruption chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One administrator fails three HTTPS logins, logs in, sets a server port to 1G (Down and MAC removals follow), clears the logging file, removes the auxiliary syslog receiver (re-adding it first if another administrator removed it meanwhile) and disconnects; the next administrator to log in restores the port and receiver. Episodes span about 1 to 7 minutes. The first episode starts within the first anomaly_interval_hours or 24 hours, whichever is shorter (default 24, minimum 6); each later one is due one interval after the previous actual start and starts inside a window centred on that due time, a quarter of the interval wide but at most 6 hours. A start time is drawn uniformly in the window; from then on each free administrator (idle, next own login more than an hour away, not the previous episode's) opens the episode at a rate following the ordinary absence distribution, rising over the window's last hour, with a weighted pick on its last second, so the time from logout to the episode login matches ordinary absences (median 2.8 h against 3.1). Starts are uniform over the day and missed episodes are not replayed. The port differs from the previous episode's, and other administrators keep working during the episode. Every step also occurs in ordinary administration; only an ordinary receiver removal that would complete the whole sequence within one hour of the first failed login is not performed, and the check stays active after an episode completes.",
  generatorId: 'mes',
  eventTypes: [
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED (Removed)',
      description: 'MAC address removed by aging or port Down',
      frequency: '41.7% measured share',
      category: 'network',
    },
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED (learnt)',
      description: 'MAC address learnt, including relearning after Up',
      frequency: '41.7% measured share',
      category: 'network',
    },
    {
      id: 'LINK-W-Down',
      description: 'Interface link down',
      frequency: '2.6% measured share',
      category: 'network',
    },
    {
      id: 'LINK-W-Up',
      description: 'Interface link up',
      frequency: '2.6% measured share',
      category: 'network',
    },
    {
      id: 'AAA-I-CONNECT',
      description: 'HTTPS administrator login accepted',
      frequency: '2.4% measured share',
      category: 'authentication',
    },
    {
      id: 'AAA-I-DISCONNECT',
      description: 'Administrator session terminated',
      frequency: '2.4% measured share',
      category: 'authentication',
    },
    {
      id: 'AAA-W-REJECT',
      description: 'HTTPS administrator login rejected',
      frequency: '2.0% measured share',
      category: 'authentication',
    },
    {
      id: 'LINK-N-PortConfRecover',
      description: 'Server port configured to 1G or back to 10G',
      frequency: '1.8% measured share',
      category: 'configuration, network',
    },
    {
      id: 'SYSLOG-N-CLEARLOGGINGFILE',
      description: 'Local logging file cleared',
      frequency: '1.4% measured share',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NOSYSLOGSERVER',
      description: 'Auxiliary syslog receiver deleted',
      frequency: '0.8% measured share',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NEWSYSLOGSERVER',
      description: 'Auxiliary syslog receiver added',
      frequency: '0.8% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'One switch with eight ports: four access uplinks with twelve MAC addresses each and four dual-rate 1G/10G server ports with three each, configured for 10G. Every endpoint, port and administrator follows its own random schedule, with no fixed period, rotation or global wave.',
    'Each MAC address is learnt and later removed after lognormal present and absent times; a Down removes every present address of that port within seconds and the addresses are learnt again after Up. Ports also flap on their own.',
    'Six administrators log in over HTTPS with the local user table every few hours. About a third of logins start with one to four mistyped passwords, some attempts are abandoned and retried later, and consecutive failures stay below the configured lockout threshold (1 to 5).',
    'A session holds zero to several operations: a speed change on a server port, a port shutdown and re-enable, a logging file clear or removal of the auxiliary receiver. Changed state is restored within the session or by whichever administrator logs in next, including a receiver removed during an episode.',
    'Configuration lines name no user, so linking them to the preceding login is temporal only. The link drop after a speed change, the MAC flush on Down and aging-driven removals are modeled behavior, not documented event timing; rates, durations and operation mix are synthetic workload choices.',
    'The catalog carries no firmware version and shows message bodies only: no syslog priority, timestamp, hostname or transport framing is emitted. The learnt form comes from the catalog parameter table, so its live capitalization is unconfirmed; only HTTPS logins are modeled, and no live capture or Elastic integration was available for comparison.',
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
        'Auxiliary syslog receiver removed and re-added; the collector receiving this stream is never changed',
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
      description: 'Hours between episode starts, 6 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: "An episode's first failed login",
      json: String.raw`{"@timestamp": "2026-09-20T02:12:41.653+00:00", "destination": {"ip": "10.40.0.11"}, "ecs": {"version": "8.17.0"}, "eltex": {"mes": {"component": "AAA", "details": {"connection": {"auth_method": "local user table", "type": "https"}}, "mnemonic": "REJECT", "severity_code": "W"}}, "event": {"action": "login_rejected", "category": ["authentication"], "dataset": "eltex.mes.syslog", "kind": "event", "module": "eltex", "original": "AAA-W-REJECT: New https connection for user i.petrov, source 10.40.1.31 destination 10.40.0.11, local user table REJECTED.", "outcome": "failure", "type": ["start", "denied"]}, "log": {"level": "warning"}, "message": "AAA-W-REJECT: New https connection for user i.petrov, source 10.40.1.31 destination 10.40.0.11, local user table REJECTED.", "observer": {"hostname": "mes-access-01", "ip": ["10.40.0.11"], "model": "MES5324", "name": "mes-access-01", "product": "MES", "type": "switch", "vendor": "Eltex"}, "source": {"ip": "10.40.1.31"}, "user": {"name": "i.petrov"}}`,
    },
  ],
};
