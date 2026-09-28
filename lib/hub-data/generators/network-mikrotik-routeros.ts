/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkMikrotikRouteros: GeneratorMeta = {
  slug: 'network-mikrotik-routeros',
  displayName: 'MikroTik RouterOS Syslog',
  category: 'network',
  description:
    'Remote syslog stream of one MikroTik RouterOS edge router: Winbox logins and logouts of six administrators, generic mangle-rule and item edits, DHCP lease assignments for 40 LAN clients and internet UDP packets logged by an input-chain rule, as ECS JSON with the RouterOS message and a constructed BSD-syslog line in event.original. Recurring episodes show an administrator adding, moving, changing and removing a mangle rule within one external Winbox session.',
  dataSource:
    'MikroTik RouterOS 7 remote syslog (remote-log-format=syslog, BSD, UDP), local0.info with topics',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 10,
  templateCount: 1,
  highlights: [
    'RouterOS message and constructed BSD-syslog line in event.original',
    'Six administrators, 40 DHCP clients and internet UDP probes',
    'Recurring external-session mangle add, move, change and remove chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "Recurs by anomaly_interval_hours (default 24, minimum 4), measured in event time: the first episode starts within the first min(interval, 24 h) of the run, its hour drawn from the working-hours curve squared; each later start falls in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, with the same weighting, and a lognormal delay (median one minute) follows each start. Missed episodes are not replayed. An administrator logs in via Winbox from one of their external addresses, adds, moves, changes and removes a mangle rule, then logs out, all within 30 minutes; the user is never the previous episode's. Edits link to the session by user and time only; background never completes the chain.",
  generatorId: 'network-mikrotik-routeros',
  eventTypes: [
    {
      id: 'firewall_log',
      description: 'Internet UDP packet logged by an input-chain rule',
      frequency: '85.65% measured share',
      category: 'network',
    },
    {
      id: 'dhcp_assigned',
      description: 'Lease assigned to a LAN client',
      frequency: '3.64% measured share',
      category: 'network',
    },
    {
      id: 'dhcp_deassigned',
      description: 'Lease of a LAN client deassigned',
      frequency: '3.44% measured share',
      category: 'network',
    },
    {
      id: 'login',
      description: 'Administrator logs in via Winbox',
      frequency: '1.98% measured share',
      category: 'authentication',
    },
    {
      id: 'logout',
      description: 'Administrator logs out of Winbox',
      frequency: '1.98% measured share',
      category: 'authentication',
    },
    {
      id: 'mangle_rule_changed',
      description: 'Mangle rule changed by an administrator',
      frequency: '1.29% measured share',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_added',
      description: 'Mangle rule added by an administrator',
      frequency: '0.62% measured share',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_removed',
      description: 'Mangle rule removed by an administrator',
      frequency: '0.56% measured share',
      category: 'configuration',
    },
    {
      id: 'mangle_rule_moved',
      description: 'Mangle rule moved by an administrator',
      frequency: '0.51% measured share',
      category: 'configuration',
    },
    {
      id: 'item_added',
      description: 'Generic item added by an administrator',
      frequency: '0.33% measured share',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'About 2,600 records per day from independent processes: unsolicited UDP probes of the WAN address (DNS, NTP, SNMP, IKE, SSDP, SIP) from random sources with exponential gaps and short repeat bursts; DHCP joins of 40 clients, where workstations and laptops follow a working-hours curve and phones, printers and cameras do not, each followed by a lognormal lease stay and a deassignment.',
    "Administrator sessions follow the working-hours curve; about 40% come from the user's own external addresses in 203.0.113.0/24, the rest from the user's internal workstation. A session carries zero to a dozen random edits with lognormal gaps, sessions may overlap, and users often reconnect from the same address minutes after logging out. At most eight temporary rules exist at a time.",
    'Background holds partial add/move/change/remove sequences in external sessions and complete ones from internal addresses in both modes. A background remove that would complete the chain for the same user inside the 30-minute window is not logged, and the rule stays until a later ordinary remove.',
    'The packet rule uses action=log, which records the packet and passes it to the next rule, so no accept/drop outcome is claimed. RouterOS edit messages carry no session, rule ID, client address or change content.',
    'No complete RouterOS 7 remote frame with this profile was found, so the PRI, header, hostname and topic placement are constructed from RFC 3164 and the manual, with a UTC router clock (PRI 134, local0.info). The removal wording comes from a RouterOS 6.35rc record. Only Winbox sessions are modelled; login failures, SSH/WebFig/API sessions and filter or NAT rules are out of scope. The ECS mapping follows the vendor Elasticsearch guide for packet fields, the rest is a synthetic choice, and rates are synthetic.',
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
        'Include recurring external-session mangle episodes; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, minimum 4',
    },
  ],
  sampleOutputs: [
    {
      title: 'Episode step: mangle rule added',
      json: String.raw`{"@timestamp": "2026-09-01T16:10:24+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "mikrotik", "dataset": "mikrotik.routeros.syslog", "category": ["configuration"], "type": ["change"], "action": "mangle_rule_added", "original": "<134>Sep  1 16:10:24 mt-edge-01 system,info mangle rule added by admin"}, "message": "mangle rule added by admin", "observer": {"hostname": "mt-edge-01", "ip": "10.30.0.1", "vendor": "MikroTik", "product": "RouterOS", "type": "router"}, "log": {"syslog": {"priority": 134, "facility": {"code": 16, "name": "local0"}, "severity": {"code": 6, "name": "info"}}}, "mikrotik": {"topics": ["system", "info"]}, "user": {"name": "admin"}, "related": {"user": ["admin"]}}`,
    },
  ],
};
