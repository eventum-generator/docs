/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkOpenvpnCommunity: GeneratorMeta = {
  slug: 'network-openvpn-community',
  displayName: 'OpenVPN Community Server',
  category: 'network',
  description:
    'OpenVPN server-file connection and tunnel messages with a same-CN reconnect from a second public IP.',
  dataSource: 'OpenVPN Community server log',
  format: ['Text', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native server log in event.original',
    'Verified certificate CN and tunnel allocation',
    'Correlated source-address switch',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The same client CN connects from two public IPs and OpenVPN drops the prior session.',
  generatorId: 'openvpn',
  eventTypes: [
    {
      id: 'VERIFY OK',
      description: 'Client certificate CN verified',
      frequency: 'Once per routine connection',
      category: 'network',
    },
    {
      id: 'Peer Connection Initiated',
      description: 'New peer connection',
      frequency: 'Once per routine connection',
      category: 'network',
    },
    {
      id: 'MULTI_sva',
      description: 'Tunnel IPv4 assigned',
      frequency: 'Once per routine connection',
      category: 'network',
    },
    {
      id: 'Data Channel',
      description: 'Cipher-negotiated tunnel active',
      frequency: 'Once per routine connection',
      category: 'network',
    },
    {
      id: 'MULTI: new connection by client',
      description: 'Previous same-CN session dropped',
      frequency: 'Chain only',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Timestamped OpenVPN file lines modeled on upstream examples',
    'Routine certificate verification precedes peer connection',
    'CN, public IP and tunnel IP connect the anomaly steps',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include same-CN source-switch chain',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records between chains',
    },
    {
      name: 'vpn_host',
      defaultValue: 'vpn-01.example.test',
      description: 'VPN server host',
    },
    {
      name: 'suspicious_common_name',
      defaultValue: 'finance-admin',
      description: 'Chain certificate CN',
    },
    {
      name: 'first_public_ip',
      defaultValue: '198.51.100.31',
      description: 'First chain source address',
    },
    {
      name: 'second_public_ip',
      defaultValue: '203.0.113.74',
      description: 'Replacement source address',
    },
    {
      name: 'tunnel_ip',
      defaultValue: '10.8.0.50',
      description: 'Chain tunnel address',
    },
  ],
  sampleOutputs: [
    {
      title: 'OpenVPN Community Server anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:37:51+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "openvpn", "dataset": "openvpn.server", "action": "duplicate-cn-drop", "category": ["network"], "type": ["info"], "original": "Fri Sep 25 12:37:51 2026 MULTI: new connection by client \u0027finance-admin\u0027 will cause previous active sessions by this client to be dropped. Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect."}, "host": {"name": "vpn-01.example.test"}, "source": {"ip": "203.0.113.74", "port": 59021}, "user": {"name": "finance-admin"}, "openvpn": {"common_name": "finance-admin", "source_address": "203.0.113.74:59021", "tunnel_ip": "10.8.0.50"}, "message": "MULTI: new connection by client \u0027finance-admin\u0027 will cause previous active sessions by this client to be dropped. Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect."}`,
    },
  ],
};
