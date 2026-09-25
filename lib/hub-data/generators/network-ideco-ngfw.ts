/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses are documented generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkIdecoNgfw: GeneratorMeta = {
  slug: 'network-ideco-ngfw',
  displayName: 'Ideco NGFW Novum Syslog',
  category: 'network',
  description:
    'Ideco traffic-journal decisions and fail2ban findings and bans in the documented Syslog format.',
  dataSource: 'Ideco NGFW Novum v22 Syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 4,
  templateCount: 6,
  highlights: [
    'Native Syslog preserved in event.original',
    'Traffic and fail2ban service correlation',
    'INPUT/FORWARD firewall table decisions',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three web-interface fail2ban findings for one source IP lead to a ban and a later denied HTTPS connection.',
  generatorId: 'ideco-ngfw',
  eventTypes: [
    {
      id: 'traffic-journal accept',
      description: 'Firewall permits a connection',
      frequency: '85% baseline',
      category: 'network',
    },
    {
      id: 'traffic-journal drop',
      description: 'Firewall denies a connection',
      frequency: '15% baseline; also chain',
      category: 'network',
    },
    {
      id: 'fail2ban Found',
      description: 'Web-interface jail detects a source',
      frequency: 'chain only',
      category: 'intrusion_detection',
    },
    {
      id: 'fail2ban Ban',
      description: 'Web-interface jail bans a source',
      frequency: 'chain only',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Source field names follow the vendor Syslog field table',
    'Documented utm-web-interface jail and fail2ban message bodies',
    'The same source IP links findings, ban, and denied traffic',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the fail2ban chain; false emits only background',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '220',
      description: 'Routine events between chains',
    },
    {
      name: 'ngfw_host',
      defaultValue: 'ideco-ngfw-01',
      description: 'NGFW Syslog hostname',
    },
    {
      name: 'ngfw_ip',
      defaultValue: '10.50.0.1',
      description: 'NGFW management IP',
    },
    {
      name: 'ordinary_source_ip',
      defaultValue: '10.50.1.20',
      description: 'Routine traffic source',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '198.51.100.25',
      description: 'Chain source IP',
    },
    {
      name: 'ordinary_destination_ip',
      defaultValue: '198.51.100.10',
      description: 'Routine destination IP',
    },
    {
      name: 'fail2ban_jail',
      defaultValue: 'utm-web-interface',
      description: 'Web-interface fail2ban jail',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ideco NGFW Novum Syslog anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:11:28+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "fail2ban_ban", "category": ["intrusion_detection"], "dataset": "ideco.ngfw_syslog", "kind": "event", "original": "2026-09-25T12:11:28+00:00 ideco-ngfw-01 fail2ban - - - NOTICE [utm-web-interface] Ban 198.51.100.25", "outcome": "success", "type": ["denied"]}, "ideco": {"ngfw": {"action": "Ban", "jail": "utm-web-interface", "service": "fail2ban", "src_ip": "198.51.100.25"}}, "message": "NOTICE [utm-web-interface] Ban 198.51.100.25", "observer": {"hostname": "ideco-ngfw-01", "ip": "10.50.0.1", "product": "NGFW Novum", "vendor": "Ideco"}, "source": {"ip": "198.51.100.25"}}`,
    },
  ],
};
