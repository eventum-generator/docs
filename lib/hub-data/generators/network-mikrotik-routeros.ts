/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkMikrotikRouteros: GeneratorMeta = {
  displayName: 'MikroTik RouterOS Syslog',
  category: 'network',
  description:
    'RouterOS DHCP, firewall and account syslog with an unusual administrator login followed by configuration edits.',
  dataSource: 'MikroTik RouterOS remote syslog',
  format: ['JSON', 'ECS', 'RFC 3164'],
  eventCount: 8,
  highlights: [
    '7/7 selected native elements',
    'Vendor topic and message forms',
    'Switchable admin configuration chain',
  ],
  anomalyChain:
    'Unusual Winbox login by admin, then mangle rule added, moved and changed by the same account on one router.',
  eventTypes: [
    {
      id: 'DHCP assigned',
      description: 'Address assignment',
      frequency: '45% routine weight',
      category: 'network',
    },
    {
      id: 'DHCP deassigned',
      description: 'Address release',
      frequency: '22% routine weight',
      category: 'network',
    },
    {
      id: 'Firewall packet',
      description: 'Packet log',
      frequency: '25% routine weight',
      category: 'network',
    },
    {
      id: 'Winbox login',
      description: 'Normal administrator login',
      frequency: '5% routine weight',
      category: 'authentication',
    },
    {
      id: 'Winbox logout',
      description: 'Normal administrator logout',
      frequency: '3% routine weight',
      category: 'authentication',
    },
    {
      id: 'Mangle edit',
      description: 'Rule add, move and change',
      frequency: 'Anomaly only',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'RFC 3164 transport with RouterOS topics and documented message bodies.',
    'DHCP, firewall and account activity share one router identity.',
    'Config records identify the user but do not invent a client IP.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'mt-edge-01',
      description: 'Router hostname',
    },
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Router IP',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.12',
      description: 'Routine source',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description: 'Anomaly administrator',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.83',
      description: 'Unusual source',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '240',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable correlated chain; false emits background only',
    },
  ],
  slug: 'network-mikrotik-routeros',
  generatorId: 'network-mikrotik-routeros',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  sampleOutputs: [
    {
      title: 'Mangle rule changed',
      json: String.raw`{"@timestamp": "2026-09-25T11:46:14+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "mikrotik", "dataset": "mikrotik.routeros.syslog", "category": ["configuration"], "type": ["info"], "action": "mangle_rule_changed", "original": "\u003c134\u003eSep 25 11:46:14 mt-edge-01 system,info mangle rule changed by admin"}, "message": "mangle rule changed by admin", "observer": {"hostname": "mt-edge-01", "ip": "10.30.0.1", "vendor": "MikroTik", "product": "RouterOS", "type": "router"}, "log": {"syslog": {"priority": 134, "facility": {"code": 16}, "severity": {"code": 6}}}, "mikrotik": {"topics": ["system", "info"]}, "user": {"name": "admin"}, "source": {"ip": null}}`,
    },
  ],
};
