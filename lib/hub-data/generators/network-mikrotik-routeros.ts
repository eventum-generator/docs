/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkMikrotikRouteros: GeneratorMeta = {
  slug: 'network-mikrotik-routeros',
  displayName: 'MikroTik RouterOS Syslog',
  category: 'network',
  description:
    'Remote syslog stream of one MikroTik RouterOS edge router: Winbox logins and logouts of six administrators, generic mangle-rule and item edits, DHCP lease assignments for 40 LAN clients and internet UDP packets logged by an input-chain rule, as ECS JSON with the RouterOS message and a constructed BSD-syslog line in event.original. Recurring episodes show an administrator adding, moving, changing and removing a mangle rule within one external Winbox session, leaving no rule behind.',
  dataSource:
    'MikroTik RouterOS 7 remote syslog (remote-log-format=syslog, BSD, UDP), local0.info with topics',
  eventFormat: 'ECS JSON',
  originalFormat: 'Syslog',
  eventCount: 10,
  templateCount: 1,
  highlights: [
    'RouterOS message and constructed BSD-syslog line in event.original',
    'Winbox sessions on a working-hours curve, 40 DHCP clients and internet UDP probes',
    'Recurring external-session mangle add, move, change and remove chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "An administrator logs in via Winbox from one of their external addresses, adds, moves, changes and removes a mangle rule, then logs out from the same address, all within 30 minutes (login to remove typically about 5 minutes); no rule is left behind. Each episode is an extra session on top of background, by a user other than the previous episode's. Edits link to the session by user and time only. anomaly_interval_hours (default 24, minimum 4) is measured in event time: the first episode starts within the first min(interval, 24 h) of the run, its hour drawn from the working-hours curve squared plus a small floor; each later start is drawn in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, with the same weighting, so episodes stay in busy hours (at intervals up to 8 h the window covers much of the clock). Missed episodes are not replayed.",
  generatorId: 'network-mikrotik-routeros',
  eventTypes: [
    {
      id: 'firewall_log',
      description: 'Internet UDP packet logged by an input-chain rule',
      frequency: '83.89% measured share (background 82.5-85.4%)',
      category: 'network',
    },
    {
      id: 'dhcp_assigned',
      description: 'Lease assigned to a LAN client',
      frequency: '3.66% measured share (background 3.22-3.80%)',
      category: 'network',
    },
    {
      id: 'dhcp_deassigned',
      description: 'Lease of a LAN client deassigned',
      frequency: '3.51% measured share (background 3.08-3.63%)',
      category: 'network',
    },
    {
      id: 'login',
      description: 'Administrator logs in via Winbox',
      frequency: '2.01% measured share (background 1.85-2.27%)',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'Administrator logs out of Winbox',
      frequency: '2.01% measured share (background 1.85-2.27%)',
      category: 'authentication',
    },
    {
      id: 'mangle_rule_changed',
      description: 'Mangle rule changed by an administrator',
      frequency: '1.57% measured share (background 1.10-2.04%)',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_added',
      description: 'Mangle rule added by an administrator',
      frequency: '1.07% measured share (background 0.95-1.23%)',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_removed',
      description: 'Mangle rule removed by an administrator',
      frequency: '1.04% measured share (background 0.93-1.21%)',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_moved',
      description: 'Mangle rule moved by an administrator',
      frequency: '1.01% measured share (background 0.78-1.18%)',
      category: 'configuration',
    },
    {
      id: 'item_added',
      description: 'Generic item added by an administrator',
      frequency: '0.23% measured share (background 0.17-0.39%)',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'About 2,600 records per day in UTC. Administrator sessions follow a working-hours curve, about 38 Winbox logins a day plus reconnects, from 3.1 sessions per hour at 07-15 UTC down to 0.27 at 22-05; logged internet UDP packets arrive at about 107 an hour around the clock; DHCP records follow the office day for workstations and laptops and are spread over the day for other devices. Daily and hourly counts vary by up to ±20%; records of one session are seconds to minutes apart, and about 1.5% of seconds hold two or three records.',
    'Logged packets are unsolicited UDP probes of the WAN address (DNS, NTP, SNMP, IKE, SSDP, SIP) from random sources, one to five packets to one port in quick succession. The rule uses action=log, which records the packet and passes it to the next rule, so no accept/drop outcome is claimed. Each of the 40 DHCP clients joins, stays for a lognormal lease and is deassigned.',
    "Six administrators are weighted by activity; about 40% of sessions come from the user's own external addresses in 203.0.113.0/24, the rest from the user's internal workstation. About 65% of sessions edit: 60% of those start with work on one mangle rule (added, moved and changed, sometimes removed again as a test rule; added and taken back; or an earlier temporary rule moved, changed and removed as clean-up), followed by random edits with lognormal gaps. Temporary rules stay few without a hard limit; users may hold overlapping sessions and reconnect from the same address minutes after 30% of logouts.",
    'Background never contains the full chain of one user: an external login followed within 30 minutes by mangle add, move, change and remove. Complete add/move/change/remove sequences from internal addresses and external sessions with any subset of the edits occur in both modes. In default output each episode adds its own records, so counts of chain parts are about one per episode higher than in background alone, more at short intervals.',
    'RouterOS edit messages carry no session, rule ID, client address or change content, and packet logging is not tied to mangle changes. No complete RouterOS 7 remote frame with this profile was found, so the PRI, header, hostname and topic placement are constructed from RFC 3164 and the manual, with a UTC router clock (PRI 134, local0.info). The DHCP assigned message is inferred by symmetry and the removal wording comes from a RouterOS 6.35rc record. Only Winbox sessions are modelled; login failures, SSH/WebFig/API sessions and filter or NAT rules are out of scope. The ECS mapping follows the vendor Elasticsearch guide for packet fields, the rest is a synthetic choice, and rates are synthetic.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'mt-edge-01',
      description: 'Router identity in the syslog header and observer.hostname',
    },
    {
      name: 'router_ip',
      defaultValue: '10.30.0.1',
      description: 'Management address in observer.ip',
    },
    {
      name: 'wan_ip',
      defaultValue: '192.0.2.10',
      description: 'WAN address targeted by logged UDP packets',
    },
    {
      name: 'wan_gateway_mac',
      defaultValue: '02:00:5E:10:00:01',
      description: 'Upstream gateway MAC in packet lines (src-mac)',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring external-session mangle episodes; false produces only the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, minimum 4',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final episode step: mangle rule removed',
      json: String.raw`{"@timestamp": "2026-09-01T08:49:09+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "mikrotik", "dataset": "mikrotik.routeros.syslog", "category": ["configuration"], "type": ["change"], "action": "mangle_rule_removed", "original": "<134>Sep  1 08:49:09 mt-edge-01 system,info mangle rule removed by netops"}, "message": "mangle rule removed by netops", "observer": {"hostname": "mt-edge-01", "ip": "10.30.0.1", "vendor": "MikroTik", "product": "RouterOS", "type": "router"}, "log": {"syslog": {"priority": 134, "facility": {"code": 16, "name": "local0"}, "severity": {"code": 6, "name": "info"}}}, "mikrotik": {"topics": ["system", "info"]}, "user": {"name": "netops"}, "related": {"user": ["netops"]}}`,
    },
  ],
};
