import type { GeneratorMeta } from '@/lib/hub-types';

export const networkCiscoWlc9800: GeneratorMeta = {
  slug: 'network-cisco-wlc-9800',
  displayName: 'Cisco Catalyst 9800 Wireless Client State',
  category: 'network',
  description:
    'Cisco Catalyst 9800 IOS XE 17.11 detailed client-state messages (RUN, IP update, DELETE) for 600 named wireless stations on one controller, as native text in event.original with a declared ECS mapping. About 24,300 records a day follow an office working day, from about 50 associated stations at night to about 410 in working hours. Models associations and address learning, not authentication results. Recurring episodes move one station through three rapid associations on the three APs of its floor.',
  dataSource:
    'Cisco Catalyst 9800 IOS XE 17.11 %CLIENT_ORCH_LOG-7 detailed client-state messages, console/buffer form',
  format: ['JSON', 'ECS', 'Syslog body'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Native %CLIENT_ORCH_LOG-7 text in event.original',
    '600 stations on 30 APs following an office working day',
    'Recurring rapid three-AP reassociation chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default, one station returning from an ordinary absence makes three associations on AP-A, AP-B and AP-C of its floor, each RUN followed by the station's normal address learning. The first two are short (1-165 s, most 20-110 s) with reconnects of 0-45 s, the third continues as an ordinary session and ends with an ordinary DELETE; RUN on AP-A to the IP update on AP-C takes 57-285 s. The first episode starts within the first anomaly_interval_hours (within the first 24 hours for longer intervals), each later one within a window of min(interval / 4, 6 h) centred one interval after the actual start of the previous one, 21-27 hours apart at the default; episodes fall mostly in working hours; at short intervals they also reach the night, where they are carried by always-on devices. Missed episodes are never made up. Episodes use stations that learn one address by update, preferring those that have not yet taken part, and rotate the order of the floor's three APs. Every action, station and station-AP pair of an episode also occurs in ordinary traffic; the complete shape (RUN on three distinct APs, each earlier association closed by DELETE, the IP update on the third within 400 s of the first RUN) occurs only in episodes.",
  generatorId: 'cisco-wlc-9800',
  eventTypes: [
    {
      id: 'CLIENT_MOVED_TO_RUN_STATE',
      description: 'Client enters RUN on the named AP',
      frequency: '31.7% of records',
      category: 'network',
    },
    {
      id: 'CLIENT_IP_UPDATED',
      description:
        "RUN client's address list gains a learned address on the same AP",
      frequency: '36.6% of records',
      category: 'network',
    },
    {
      id: 'CLIENT_MOVED_TO_DELETE_STATE',
      description: 'RUN client is deleted from its current AP',
      frequency: '31.7% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    "One controller serves 600 fixed named stations across 30 APs on 10 floors, three per floor: 540 office stations carried by employees and 60 always-on devices (phones left on chargers, scanners, sensors). Each station cycles through absence, RUN on one AP of its floor (home AP 50%, each other AP 25%), address learning and DELETE from the same AP. Some stations are already associated at the first record, so a station's first record may be its DELETE.",
    'Office stations come in on about 9 of 10 days, arrive around 08:45 UTC (07:00-11:00) and leave about 9 hours later (6.5-11.5 h); always-on devices stay associated apart from short sleep/wake gaps. About 50 stations are associated at night and about 410 between 10:00 and 16:00; records range from about 435 an hour at night to about 2,050 in the 09:00 hour, about 24,300 a day with 3% variation from day to day, about 2 s apart in working hours and 8 s at night. Every day is a working day: no weekends or holidays, working hours fixed to the UTC clock, and the record rate steps from hour to hour.',
    'Sessions have a lognormal body with a 35-minute median for office stations and 15 minutes for always-on devices (at most 12 h), absences 10 and 3 minutes (at most 8 h); each carries a 12% short tail of about 10 s-3 min sessions (sleep/wake, band steering, re-authentication) or 1-60 s quick reconnects. The median session is about 28 minutes for office stations and 12.5 minutes for always-on devices. These distributions and the attendance are synthetic choices, not measured production workload.',
    'RUN carries the IPv4 address, IP updates append the link-local address and, for dual-stack stations, a global IPv6 address seconds later, and DELETE lists link-local, global IPv6, then IPv4. An IP update comes a median 2.2 s after RUN in working hours and 7.5 s at night (up to about 1 and 3 minutes), not the sub-second delay of the Cisco example. The inventory holds 350 IPv4 plus link-local, 150 dual-stack, 50 IPv4-only and 50 IPv6-only stations; lists hold one to three addresses, their order is one rule fitted to the single same-client Cisco example, and IPv6-only RUN records are a synthetic assumption. Renumbering, DHCP renewal to a new lease and roaming without DELETE are not modeled.',
    'These severity 7 messages require wireless client syslog-detailed, and a forwarding syslog filter must include severity 7 (for example logging trap debugging). event.original is the console/buffer record with no invented RFC 3164/5424 envelope; controller and reader context is synthetic.',
    'Short sessions and quick reconnects are frequent in both modes: about 14% of sessions last under 3 minutes and about 11% of absences under 20 s. About seven times a day an ordinary association reaching its third distinct AP within 400 s logs no IP update although its station normally learns an address. The chain signals rapid reassociation or instability; it does not establish seamless roaming, an authentication failure, a deauthentication attack, an AP outage, a cloned client or an intrusion.',
    'Text follows the published 17.11 guide examples, whose MAC and IP values are redacted: complete values are synthetic, no unredacted live-controller capture was available for byte comparison, and collector or parser compatibility (Elastic, KUMA, Smart Monitor) is untested. The 17.12 channel variant is not generated.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic rapid three-AP episodes to ordinary traffic; false produces ordinary traffic only',
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
        'Username of inventory slot 0, used by ordinary traffic in both modes and eligible for episodes like any other station',
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
      title: 'IP update on AP-C completing an episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T12:36:55.168+00:00",
  "agent": {
    "name": "synthetic-wlc-reader",
    "type": "eventum"
  },
  "cisco_wlc": {
    "ap_name": "AP-Floor7-C",
    "chassis": "1 R0/0",
    "client_ips": [
      "10.20.30.115",
      "fe80::5eff:fe10:254"
    ],
    "client_mac": "0200.5e10.0254",
    "client_state": "ip_update",
    "ssid": "corp-wifi"
  },
  "client": {
    "address": "10.20.30.115",
    "ip": "10.20.30.115",
    "mac": "02-00-5E-10-02-54"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ip-update",
    "category": [
      "network"
    ],
    "code": "CLIENT_IP_UPDATED",
    "kind": "event",
    "original": "Sep  1 12:36:55.168 UTC: %CLIENT_ORCH_LOG-7-CLIENT_IP_UPDATED: Chassis 1 R0/0: wncd: Username (employee-596), MAC: 0200.5e10.0254, IP 10.20.30.115 fe80::5eff:fe10:254 IP address updated, associated to AP (AP-Floor7-C) with SSID (corp-wifi)",
    "provider": "CLIENT_ORCH_LOG",
    "severity": 7,
    "timezone": "+00:00",
    "type": [
      "connection",
      "info"
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
      "10.20.30.115",
      "fe80::5eff:fe10:254"
    ],
    "user": [
      "employee-596"
    ]
  },
  "user": {
    "name": "employee-596"
  }
}`,
    },
  ],
};
