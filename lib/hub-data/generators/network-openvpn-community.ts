import type { GeneratorMeta } from '@/lib/hub-types';

export const networkOpenvpnCommunity: GeneratorMeta = {
  slug: 'network-openvpn-community',
  displayName: 'OpenVPN Community Server Log',
  category: 'network',
  description:
    'Server file log of one OpenVPN 2.6.14 Community remote-access server (verb 3, UDP, certificate authentication, no --duplicate-cn) as ECS JSON with each native line verbatim in event.original: connections from the TLS initial packet to the pushed data-channel options, duplicate-CN session replacements, clean exits and ping timeouts of 800 users. About 50,000 lines a day follow an office-hours curve in UTC. Recurring episodes show one certificate used from two places at once.',
  dataSource:
    'OpenVPN 2.6.14 Community server file log (--log-append, --verb 3)',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 16,
  templateCount: 1,
  highlights: [
    'Verbosity 1-3 lines from the tagged 2.6.14 source',
    '800 users, about 50,000 lines a day on an office-hours curve',
    'Recurring four-step alternating duplicate-CN replacement chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One user's device connects from one of the user's usual addresses; after a lognormal delay (median 15 minutes, 1-60 minutes) a second device with the same certificate connects from another usual address and replaces it (duplicate-CN line). The replaced device reconnects about two minutes after it was dropped and replaces the second, which does the same: four replacements in all, alternating X, Y, X, Y within about six minutes. Then the second device stops and the first stays for an ordinary session that ends with a clean exit (75%) or a ping timeout. Episodes recur every 24 hours by default (anomaly_interval_hours, 2 to 720): the first starts within min(interval, 24 h) of the first line at an hour drawn from the office-hours curve; each next one is due one interval after the actual start of the previous one and starts in a window of w = min(interval / 4, 6 h) centred on that due time, weighted towards office hours, so starts are interval ± w/2 apart (24 ± 3 h by default), start hours do not drift and missed intervals are never caught up. An episode starts later only when no user is eligible, then within a minute of one becoming eligible; at short intervals some episodes start outside office hours. The episode user is one of 39 very active users with two frequently used addresses, has connected from both before and differs from the previous episode's user. Every user|address pair, single and repeated replacements and three alternating replacements X, Y, X also occur in ordinary traffic; only the complete four-step alternation within ten minutes is episode-only.",
  generatorId: 'openvpn',
  eventTypes: [
    {
      id: 'tls-initial-packet',
      description: 'TLS: Initial packet from the client address',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'certificate-verified',
      description: 'VERIFY OK for the CA (depth=1) and the client (depth=0)',
      frequency: '14.6% of lines',
      category: 'authentication',
    },
    {
      id: 'control-channel-established',
      description:
        'Control Channel: TLSv1.3 with peer certificate and peer temporary key',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'peer-connection-initiated',
      description: '[CN] Peer Connection Initiated',
      frequency: '7.3% of lines',
      category: 'session',
    },
    {
      id: 'virtual-address-assigned',
      description: 'MULTI_sva: pool returned IPv4',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'route-learned',
      description: 'MULTI: Learn: pool address -> CN/IP:port',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'primary-virtual-address',
      description: 'MULTI: primary virtual IP',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'push-request',
      description: 'PUSH: Received control message: PUSH_REQUEST',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'data-channel-established',
      description: 'Data Channel: cipher AES-256-GCM, peer-id',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'timers',
      description: 'Timers: ping 10, ping-restart 240',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'protocol-options',
      description: 'Protocol options: protocol-flags',
      frequency: '7.3% of lines',
      category: 'network',
    },
    {
      id: 'exit-scheduled',
      description: 'Delayed exit in 5 seconds after a client exit notification',
      frequency: '4.3% of lines',
      category: 'session',
    },
    {
      id: 'client-exited',
      description:
        'SIGTERM[soft,delayed-exit] received, client-instance exiting',
      frequency: '4.3% of lines',
      category: 'session',
    },
    {
      id: 'duplicate-cn-replaced',
      description:
        'MULTI: new connection by client CN will cause previous active sessions to be dropped',
      frequency: '1.8% of lines',
      category: 'session',
    },
    {
      id: 'inactivity-timeout',
      description: '[CN] Inactivity timeout (--ping-restart), restarting',
      frequency: '1.2% of lines',
      category: 'session',
    },
    {
      id: 'client-restarted',
      description:
        'SIGUSR1[soft,ping-restart] received, client-instance restarting',
      frequency: '1.2% of lines',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Every line is YYYY-MM-DD HH:MM:SS <prefix> <text> in the server local time (UTC), with no syslog header; the prefix is the client IP:port before certificate verification and CN/IP:port after. event.original keeps the line, message drops the timestamp, and user.name is set only on lines that carry the client CN.',
    'About 50,000 lines a day (daily volume varies by about ±3%) on a stepped UTC office-hours curve: 0.15 lines/s at 23-07, 0.55 at 07-08 and 18-21, 1.0 at 08-18 and 0.30 at 21-23, with no weekday cycle. About 3,700 new connections a day, up to about 440 clients connected at the office-hours peak and up to about 35 lines of several clients in a busy second. The log starts with no clients connected.',
    'Each of the 800 users has a certificate CN, a persistent pool address in 10.8.0.0/22 and two or three usual public addresses: a unique home address, a mobile carrier address shared with a few other users and, for 37% of users, a shared branch-office NAT address. Users connect about 4.6 times a day on average, from about 1.5 times for the least active to about 14 for the most active; after a session a user stays offline for a lognormal pause (median 45 minutes divided by the activity weight, 0.35-4.0, at least 5 minutes).',
    "A session consists of segments: short (median about 2.5 minutes) on an unstable network, more likely right after a reconnect, and long otherwise (median 90 minutes divided by the activity weight). It ends with a clean exit, a vanished client (server ping timeout after 240 s) or a reconnect from the same or another of the user's networks, at once or after the client's 120 s ping-restart. A reconnect that reaches the server before the old instance times out replaces it and logs the duplicate-CN line; about a quarter of connections replace a live instance of the same CN.",
    "A client's connection lines fall within 0-3 s of its TLS: Initial packet line, SIGTERM follows Delayed exit in 5 seconds after exactly 5 s, and SIGUSR1 shares the second of its Inactivity timeout line. The server runs keepalive 10 120 (ping every 10 s, drop after 240 s, ping-restart 120 pushed to clients); peer-id is the lowest free slot, each CN keeps its pool address across sessions, and a replaced instance closes without a line of its own. The connection sequences of two new clients never overlap; reconnects and session ends interleave with them.",
    'Lines follow the format strings of the tagged 2.6.14 source, with TLS suite, key size, key-exchange group and protocol flags fixed for one OpenSSL 3 build and 2.6 clients; no raw log from a running server was available. Peer info, PUSH_REPLY, MTU and key lines, hourly TLS renegotiations and startup/status lines are omitted, as are failed verifications, tls-crypt unwrapping failures, TCP, IPv6 pools and --duplicate-cn servers. Most home addresses come from the benchmarking range 198.18.0.0/15, which does not occur on the public internet. All rates are synthetic.',
    'In ordinary traffic four alternating replacements of one CN never fall within ten minutes of the first, so a detector with fewer steps or a longer window also matches ordinary near misses. With anomaly_mode true, replacement counts are about four per episode higher than with false.',
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
        'Hours from one episode start to the next due time, 2 to 720 (a value outside stops generation with an error)',
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
      json: String.raw`{"@timestamp": "2026-09-01T11:47:19+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "duplicate-cn-replaced", "category": ["session"], "dataset": "openvpn.server", "kind": "event", "module": "openvpn", "original": "2026-09-01 11:47:19 nikolai.hart/198.51.100.58:59766 MULTI: new connection by client \u0027nikolai.hart\u0027 will cause previous active sessions by this client to be dropped.  Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect.", "type": ["end"]}, "host": {"name": "vpn-01"}, "message": "nikolai.hart/198.51.100.58:59766 MULTI: new connection by client \u0027nikolai.hart\u0027 will cause previous active sessions by this client to be dropped.  Remember to use the --duplicate-cn option if you want multiple clients using the same certificate or username to concurrently connect.", "process": {"name": "openvpn"}, "related": {"ip": ["198.51.100.58"], "user": ["nikolai.hart"]}, "source": {"ip": "198.51.100.58", "port": 59766}, "user": {"name": "nikolai.hart"}}`,
    },
  ],
};
