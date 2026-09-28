import type { GeneratorMeta } from '@/lib/hub-types';

export const networkOpenvpnCommunity: GeneratorMeta = {
  slug: 'network-openvpn-community',
  displayName: 'OpenVPN Community Server Log',
  category: 'network',
  description:
    'Server file log of one OpenVPN 2.6.14 Community remote-access server (verb 3, UDP, certificate authentication, no --duplicate-cn) as ECS JSON with each native line verbatim in event.original: connections from the TLS initial packet to the pushed data-channel options, duplicate-CN session replacements, clean exits and ping timeouts of 60 users. Recurring episodes show one certificate used from two places at once.',
  dataSource:
    'OpenVPN 2.6.14 Community server file log (--log-append, --verb 3)',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 16,
  templateCount: 1,
  highlights: [
    'Verbosity 1-3 lines from the tagged 2.6.14 source',
    '60 users with independent sessions and usual addresses',
    'Recurring alternating duplicate-CN replacement chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One user connects from a usual address; a second device with the same certificate connects from another usual address and replaces it (duplicate-CN line), the replaced device reconnects about two minutes later after its ping-restart and replaces the second, and so on: four to six replacements alternating between the two addresses, then one device stays for an ordinary session. Episodes recur every 24 hours by default (anomaly_interval_hours, 2 to 720): the first within min(interval, 24 h) of the first event at an hour drawn from the office-hours curve, each next one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted towards office hours, with no catch-up. The user differs from the previous episode and has used both addresses before. Every element occurs in background; an ordinary reconnect that would be the fourth alternating replacement of its CN within ten minutes comes from the address of the session it replaces instead.',
  generatorId: 'openvpn',
  eventTypes: [
    {
      id: 'tls-initial-packet',
      description: 'TLS: Initial packet from the client address',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'certificate-verified',
      description: 'VERIFY OK for the CA (depth=1) and the client (depth=0)',
      frequency: '14.6% measured share',
      category: 'authentication',
    },
    {
      id: 'control-channel-established',
      description:
        'Control Channel: TLSv1.3 with peer certificate and peer temporary key',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'peer-connection-initiated',
      description: '[CN] Peer Connection Initiated',
      frequency: '7.3% measured share',
      category: 'session',
    },
    {
      id: 'virtual-address-assigned',
      description: 'MULTI_sva: pool returned IPv4',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'route-learned',
      description: 'MULTI: Learn: pool address -> CN/IP:port',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'primary-virtual-address',
      description: 'MULTI: primary virtual IP',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'push-request',
      description: 'PUSH: Received control message: PUSH_REQUEST',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'data-channel-established',
      description: 'Data Channel: cipher AES-256-GCM, peer-id',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'timers',
      description: 'Timers: ping 10, ping-restart 240',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'protocol-options',
      description: 'Protocol options: protocol-flags',
      frequency: '7.3% measured share',
      category: 'network',
    },
    {
      id: 'exit-scheduled',
      description: 'Delayed exit in 5 seconds after a client exit notification',
      frequency: '4.0% measured share',
      category: 'session',
    },
    {
      id: 'client-exited',
      description:
        'SIGTERM[soft,delayed-exit] received, client-instance exiting',
      frequency: '4.0% measured share',
      category: 'session',
    },
    {
      id: 'duplicate-cn-replaced',
      description:
        'MULTI: new connection by client CN will cause previous active sessions to be dropped',
      frequency: '2.0% measured share',
      category: 'session',
    },
    {
      id: 'inactivity-timeout',
      description: '[CN] Inactivity timeout (--ping-restart), restarting',
      frequency: '1.2% measured share',
      category: 'session',
    },
    {
      id: 'client-restarted',
      description:
        'SIGUSR1[soft,ping-restart] received, client-instance restarting',
      frequency: '1.2% measured share',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Every line is YYYY-MM-DD HH:MM:SS <prefix> <text> in the server local time (UTC), with no syslog header; the prefix is the client IP:port before verification and CN/IP:port after. event.original keeps the line and message drops the timestamp.',
    'Sixty users, each with a certificate CN, a persistent pool address and two or three usual public addresses (home, a shared mobile carrier address, sometimes a shared branch-office NAT), run as independent random processes on an office-hours curve.',
    'Sessions end with a clean exit, a server ping timeout after 240 s, or a reconnect from the same or another network; a reconnect that reaches the server before the old instance times out replaces it and logs the duplicate-CN line, so single replacements and roaming occur in background.',
    'keepalive 10 120 on the server: ping every 10 s, drop after 240 s, ping-restart 120 pushed to clients. peer-id is the lowest free slot, and each CN keeps its pool address across sessions.',
    'Lines follow the format strings of the tagged 2.6.14 source for one OpenSSL 3 build; no raw log from a running server was available. Peer info, PUSH_REPLY, MTU and key lines, TLS renegotiations and startup lines are omitted, as are failed verifications, TCP, IPv6 pools and --duplicate-cn servers.',
    'At most three lines per second, so concurrent connections shift some lines by one or two seconds. Office hours are UTC with no weekday cycle, and all rates are synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit recurring episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 2 to 720 (a value outside fails the render)',
    },
    {
      name: 'vpn_host',
      defaultValue: 'vpn-01',
      description:
        "host.name enrichment (the server's own lines carry no host name)",
    },
    {
      name: 'ca_common_name',
      defaultValue: 'Example Corp VPN CA',
      description: 'CN of the issuing CA in the depth=1 verification line',
    },
  ],
  sampleOutputs: [
    {
      title: 'First replacement of the first episode',
      json: String.raw`{"@timestamp": "2026-09-21T20:13:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "duplicate-cn-replaced", "category": ["session"], "dataset": "openvpn.server", "kind": "event", "module": "openvpn", "original": "2026-09-21 20:13:00 hugo.moreau/192.0.2.11:6598 MULTI: new connection by client \u0027hugo.moreau\u0027 will cause previous active sessions by this client to be dropped.  Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect.", "type": ["end"]}, "host": {"name": "vpn-01"}, "message": "hugo.moreau/192.0.2.11:6598 MULTI: new connection by client \u0027hugo.moreau\u0027 will cause previous active sessions by this client to be dropped.  Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect.", "process": {"name": "openvpn"}, "related": {"ip": ["192.0.2.11"], "user": ["hugo.moreau"]}, "source": {"ip": "192.0.2.11", "port": 6598}, "user": {"name": "hugo.moreau"}}`,
    },
  ],
};
