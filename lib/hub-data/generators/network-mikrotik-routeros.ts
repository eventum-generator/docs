/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkMikrotikRouteros: GeneratorMeta = {
  slug: 'network-mikrotik-routeros',
  displayName: 'MikroTik RouterOS Syslog',
  category: 'network',
  description:
    'RouterOS 7 account, configuration, DHCP and firewall syslog from one router, with a switchable linked administrator session.',
  dataSource:
    'RouterOS 7 BSD Syslog UDP, local0/info with topic prefix enabled',
  format: ['JSON', 'ECS', 'RFC 3164'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Eight RouterOS action types in both modes',
    'One event per minute from one router',
    'One switchable five-event administrator session',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 120 routine events, an external admin Winbox login is followed by mangle add, move and change, then logout over four minutes.',
  generatorId: 'network-mikrotik-routeros',
  eventTypes: [
    {
      id: 'DHCP assigned',
      description: 'Assign a client lease',
      frequency: '5% of non-session routine slots, alternating with releases',
      category: 'network',
    },
    {
      id: 'DHCP deassigned',
      description: 'Release an existing client lease',
      frequency:
        '5% of non-session routine slots, alternating with assignments',
      category: 'network',
    },
    {
      id: 'Firewall packet',
      description: 'Logged firewall traffic',
      frequency: '95% of non-session routine slots',
      category: 'network',
    },
    {
      id: 'Winbox login',
      description: 'Administrator session starts',
      frequency: 'Daily sessions and one extra linked login when enabled',
      category: 'authentication',
    },
    {
      id: 'Winbox logout',
      description: 'Administrator session ends',
      frequency: 'Daily sessions and one extra linked logout when enabled',
      category: 'authentication',
    },
    {
      id: 'Mangle rule added',
      description: 'Add a mangle rule',
      frequency: 'Daily maintenance and one extra linked edit when enabled',
      category: 'configuration',
    },
    {
      id: 'Mangle rule moved',
      description: 'Move a mangle rule',
      frequency: 'Daily maintenance and one extra linked edit when enabled',
      category: 'configuration',
    },
    {
      id: 'Mangle rule changed',
      description: 'Change a mangle rule',
      frequency: 'Daily maintenance and one extra linked edit when enabled',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'DHCP releases follow assignments for eight bounded clients; firewall traffic varies by source and ports.',
    'Background includes external admin sessions and all mangle edit actions, separated in time.',
    'Constructed BSD Syslog message requires a specific remote action; exact UDP framing awaits a matching capture.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'mt-edge-01',
      description: 'Router hostname',
    },
    { name: 'router_ip', defaultValue: '10.30.0.1', description: 'Router IP' },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.30.1.12',
      description: 'Routine administrator source',
    },
    {
      name: 'admin_internal_source_ip',
      defaultValue: '10.30.1.11',
      description: 'Internal maintenance source',
    },
    {
      name: 'anomaly_user',
      defaultValue: 'admin',
      description: 'Administrator also present in background',
    },
    {
      name: 'anomaly_source_ip',
      defaultValue: '198.51.100.83',
      description: 'External administrator source also present in background',
    },
    {
      name: 'anomaly_delay_events',
      defaultValue: '120',
      description: 'Routine events before the one linked session',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the linked session; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Mangle rule moved',
      json: String.raw`{"@timestamp": "2026-09-25T19:11:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "mikrotik", "dataset": "mikrotik.routeros.syslog", "category": ["configuration"], "type": ["info"], "action": "mangle_rule_moved", "original": "<134>Sep 25 19:11:00 mt-edge-01 system,info mangle rule moved by admin"}, "message": "mangle rule moved by admin", "observer": {"hostname": "mt-edge-01", "ip": "10.30.0.1", "vendor": "MikroTik", "product": "RouterOS", "type": "router"}, "log": {"syslog": {"priority": 134, "facility": {"code": 16}, "severity": {"code": 6}}}, "mikrotik": {"topics": ["system", "info"]}, "user": {"name": "admin"}}`,
    },
  ],
};
