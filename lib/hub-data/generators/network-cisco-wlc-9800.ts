import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoWlc9800: GeneratorMeta = {
  slug: 'network-cisco-wlc-9800',
  displayName: 'Cisco Catalyst 9800 Wireless Client State',
  category: 'network',
  description:
    'Cisco Catalyst 9800 IOS XE 17.11 detailed client-state messages (RUN, IP update, DELETE) for 48 named wireless stations on one controller, as native text in event.original with a declared ECS mapping. Models associations and address learning, not authentication results. Recurring episodes move one station through three rapid associations on the three APs of its floor.',
  dataSource:
    'Cisco Catalyst 9800 IOS XE 17.11 %CLIENT_ORCH_LOG-7 detailed client-state messages, console/buffer form',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native %CLIENT_ORCH_LOG-7 text in event.original',
    'Independent lifecycles of 48 stations on 12 APs',
    'Recurring rapid three-AP reassociation chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first one interval after the first input timestamp, each next one interval after the previous actual start; a start may wait for the selected station to settle, up to 76 s measured), one station is deleted from its current AP if associated, then makes three associations on the three APs of its floor: the first two short (at most 100 s) with reconnects within 30 s, the third an ordinary session. Stations rotate through the inventory; every episode record also occurs in ordinary traffic, and only the full three-AP sequence is episode-only.',
  generatorId: 'cisco-wlc-9800',
  eventTypes: [
    {
      id: 'CLIENT_MOVED_TO_RUN_STATE',
      description: 'Client enters RUN on the named AP',
      frequency: '31.5-31.8% measured share',
      category: 'network',
    },
    {
      id: 'CLIENT_IP_UPDATED',
      description: 'RUN client learns an address on the same AP',
      frequency: '36.5-37.0% measured share',
      category: 'network',
    },
    {
      id: 'CLIENT_MOVED_TO_DELETE_STATE',
      description: 'RUN client is deleted from its current AP',
      frequency: '31.5-31.7% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'One controller serves 48 fixed named stations across 12 existing APs, three per floor. Each station cycles independently through absence, RUN on one AP of its floor, address learning and DELETE from the same AP. Measured volume is 3,186-3,283 records per day with 21-45 concurrently associated stations, never zero, and the stream starts in steady state.',
    'Sessions (35-minute median) and absences (10-minute median) each carry a 12% short tail for sleep/wake, band steering and quick reconnects; these shares and all session, absence and address-learning distributions are synthetic choices, not measured production workload. Rates are stationary, with no working-day cycle.',
    'RUN carries the IPv4 address, an IP update 5 ms-3 s later appends link-local, dual-stack stations add global IPv6 0.5-15 s after that, and DELETE lists link-local, global IPv6, then IPv4. This order is one rule fitted to the single same-client Cisco example sequence; lists hold at most three addresses and IPv6-only RUN records are a synthetic assumption.',
    'These severity 7 messages require wireless client syslog-detailed, and a forwarding syslog filter must include severity 7 (for example logging trap debugging). event.original is the console/buffer record with no invented RFC 3164/5424 envelope; controller and reader context is synthetic.',
    'Short sessions and quick reconnects are frequent in both modes, so a single one identifies an episode with only 1.5-2.4% precision by default. The three-AP chain signals rapid reassociation or instability; it does not establish an authentication failure, deauthentication attack, AP outage or intrusion.',
    'Text follows the published 17.11 guide examples, whose MAC and IP values are redacted: no same-version unredacted raw capture was available, and no live collector or parser parity (Elastic, KUMA, Smart Monitor) is claimed. The 17.12 channel variant is not generated.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add recurring three-AP episodes; false produces ordinary traffic only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the actual start of one episode to the next, 6 to 8,760',
    },
    {
      name: 'controller_name',
      defaultValue: 'wlc9800-01.corp.example',
      description: 'Controller identity written to host.name',
    },
    {
      name: 'ssid',
      defaultValue: 'corp-wifi',
      description:
        'Shared WLAN SSID, 1-32 ASCII characters without parentheses or newlines',
    },
    {
      name: 'suspicious_user',
      defaultValue: 'visitor01',
      description:
        'Username of inventory slot 0, used by ordinary traffic in both modes and by the first episode',
    },
    {
      name: 'suspicious_mac',
      defaultValue: '02aa.bbcc.ddee',
      description:
        'Dotted unicast MAC of slot 0; its link-local address is derived from it',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '192.0.2.91',
      description:
        'Primary address of slot 0; IPv4 gives an IPv4 plus link-local station, IPv6 an IPv6-only one',
    },
  ],
  sampleOutputs: [
    {
      title: 'DELETE ending the first episode association on AP-A',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:01:22.207+00:00",
  "agent": {
    "name": "synthetic-wlc-reader",
    "type": "eventum"
  },
  "cisco_wlc": {
    "ap_name": "AP-Floor1-A",
    "chassis": "1 R0/0",
    "client_ips": [
      "fe80::aa:bbff:fecc:ddee",
      "192.0.2.91"
    ],
    "client_mac": "02aa.bbcc.ddee",
    "client_state": "delete",
    "ssid": "corp-wifi"
  },
  "client": {
    "address": "192.0.2.91",
    "ip": "192.0.2.91",
    "mac": "02-AA-BB-CC-DD-EE"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "delete",
    "category": [
      "network"
    ],
    "code": "CLIENT_MOVED_TO_DELETE_STATE",
    "kind": "event",
    "original": "Sep 26 00:01:22.207 UTC: %CLIENT_ORCH_LOG-7-CLIENT_MOVED_TO_DELETE_STATE: Chassis 1 R0/0: wncd: Username (visitor01), MAC: 02aa.bbcc.ddee, IP fe80::aa:bbff:fecc:ddee 192.0.2.91 disconnected from AP (AP-Floor1-A) with SSID (corp-wifi)",
    "provider": "CLIENT_ORCH_LOG",
    "severity": 7,
    "timezone": "+00:00",
    "type": [
      "connection",
      "end"
    ]
  },
  "host": {
    "name": "wlc9800-01.corp.example"
  },
  "log": {
    "level": "debugging"
  },
  "process": {
    "name": "wncd"
  },
  "related": {
    "ip": [
      "fe80::aa:bbff:fecc:ddee",
      "192.0.2.91"
    ],
    "user": [
      "visitor01"
    ]
  },
  "user": {
    "name": "visitor01"
  }
}`,
    },
  ],
};
