/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexMes: GeneratorMeta = {
  slug: 'network-eltex-mes',
  displayName: 'Eltex MES Switch Syslog',
  category: 'network',
  description:
    'Eltex MES switch syslog message bodies normalized into ECS, covering MAC learning, port state and administrator logins. Switch between background traffic and a login-to-port-change-to-logging-tamper sequence.',
  dataSource: 'Eltex MES23xx/MES33xx/MES35xx/MES5324 syslog',
  format: ['JSON', 'ECS'],
  eventCount: 9,
  templateCount: 1,
  generatorId: 'mes',
  highlights: [
    '15/15 documented message fields',
    'One coherent switch identity',
    'Switchable port and logging anomaly',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three rejected admin logins, a successful login, port speed change and link loss, MAC removal, then local log clearing and syslog receiver deletion.',
  eventTypes: [
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED',
      description: 'MAC learned or removed',
      frequency: '78% / 18% routine weight',
      category: 'network',
    },
    {
      id: 'LINK-W-Down / LINK-W-Up',
      description: 'Alternating interface state',
      frequency: '2% combined routine weight',
      category: 'network',
    },
    {
      id: 'AAA-W-REJECT',
      description: 'HTTPS login rejected',
      frequency: '0.5% routine weight',
      category: 'authentication',
    },
    {
      id: 'AAA-I-CONNECT / DISCONNECT',
      description: 'Linked normal admin session',
      frequency: '1.5% routine trigger',
      category: 'authentication',
    },
    {
      id: 'LINK-N-PortConfRecover',
      description: 'Interface speed changed',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-CLEARLOGGINGFILE / NOSYSLOGSERVER',
      description: 'Local log cleared and receiver deleted',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'MAC entries preserve matching addresses, VLANs and ports from four endpoint samples.',
    'Port state alternates down and up on one routine interface.',
    'Normal administrator connections have a linked disconnect.',
    'The anomaly keeps one switch, unusual source and target port throughout.',
  ],
  parameters: [
    {
      name: 'switch_name',
      defaultValue: 'mes-access-01',
      description: 'Switch name',
    },
    {
      name: 'switch_ip',
      defaultValue: '10.40.0.11',
      description: 'Switch IP address',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.40.1.25',
      description: 'Routine management source',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin',
      description: 'Anomaly administrator',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.99.4.21',
      description: 'Unusual management source',
    },
    {
      name: 'target_port',
      defaultValue: 'te1/0/5',
      description: 'Anomaly target port',
    },
    {
      name: 'target_mac',
      defaultValue: 'e0:d9:e3:2c:19:b0',
      description: 'MAC removed from target port',
    },
    {
      name: 'target_vlan',
      defaultValue: '20',
      description: 'Target VLAN',
    },
    {
      name: 'syslog_server_ip',
      defaultValue: '10.40.0.12',
      description: 'Receiver removed at chain end',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '1000',
      description: 'Routine events between anomaly chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the correlated anomaly chain alongside routine events; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'MES port speed change',
      json: String.raw`{"@timestamp": "2026-09-25T12:00:16+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "interface_speed_changed", "category": ["configuration", "network"], "dataset": "eltex.mes.syslog", "kind": "event", "module": "eltex", "original": "LINK-N-PortConfRecover: Port te1/0/5 configured to speed 1G", "outcome": "success", "type": ["change"]}, "message": "LINK-N-PortConfRecover: Port te1/0/5 configured to speed 1G", "log": {"level": "notice"}, "observer": {"hostname": "mes-access-01", "ip": "10.40.0.11", "name": "mes-access-01", "product": "MES", "type": "switch", "vendor": "Eltex"}, "eltex": {"mes": {"component": "LINK", "mnemonic": "PortConfRecover", "severity_code": "N", "details": {"interface": {"speed": "1G"}}}}, "interface": {"name": "te1/0/5"}}`,
    },
  ],
};
