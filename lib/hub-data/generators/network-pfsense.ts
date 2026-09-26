/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkPfsense: GeneratorMeta = {
  slug: 'network-pfsense',
  displayName: 'pfSense Firewall and IPsec',
  category: 'network',
  dataSource: 'pfSense CE 2.9.0 RFC 5424 filterlog and charon syslog',
  description:
    'pfSense CE 2.9.0 RFC 5424 firewall and IKEv1 IPsec records with causal SA closure, active-tunnel traffic and recurring peer-ID sequences.',
  generatorId: 'pfsense',
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'Native IPv4 filterlog CSV and charon SA bodies',
    'One live IKE/CHILD pair with native close/delete linkage',
    'Twelve-record core sequences recur every six hours',
  ],
  anomalyChain:
    'Every six hours, three mismatched peer-ID lookup/failure pairs precede a corrected identity, IKE/CHILD establishment and separate SMB, RDP and WinRM passes over enc0. Twelve core records span about 55 seconds. Any earlier tunnel closes and deletes first with its existing IDs/SPIs. Recurrence waits for ordinary pairs/cleanup, resets at the first mismatch and does not catch up in bursts. The same individual actions and administrative ports also occur in background.',
  eventTypes: [
    {
      id: 'filterlog pass',
      description: 'Logged LAN or active IPsec rule pass',
      frequency:
        'Weighted ordinary traffic and three administrative packets per episode',
      category: 'network',
    },
    {
      id: 'filterlog block',
      description: 'Logged default WAN deny',
      frequency: 'Weighted unsolicited WAN HTTPS/SSH probes',
      category: 'network',
    },
    {
      id: 'charon peer lookup',
      description: 'Peer configuration lookup with native IKE context',
      frequency:
        'One ordinary failed pair and ordinary valid establishment; four episode lookups',
      category: 'network',
    },
    {
      id: 'charon no peer config',
      description: 'Offered identity has no matching peer configuration',
      frequency: 'One per ordinary maintenance cycle; three per episode',
      category: 'network',
    },
    {
      id: 'charon IKE_SA established',
      description: 'Establish the selected IKEv1 PSK tunnel',
      frequency:
        'Ordinary establishment only when no active IKE; one per episode',
      category: 'network',
    },
    {
      id: 'charon CHILD_SA established',
      description: 'Establish CHILD ID, SPIs and traffic selectors',
      frequency: 'After a valid active IKE establishment',
      category: 'network',
    },
    {
      id: 'charon CHILD_SA closed',
      description: 'Close the existing CHILD with its SPIs/selectors/counters',
      frequency: 'Ordinary cleanup and any cleanup before an episode',
      category: 'network',
    },
    {
      id: 'charon IKE_SA deleting',
      description: 'Delete the actual active IKE after CHILD closure',
      frequency: 'After each modeled CHILD cleanup',
      category: 'network',
    },
  ],
  realismFeatures: [
    'UTC RFC 5424 log timestamps retain microseconds. Selected filterlog IPv4 UDP/TCP have all 23/29 documented CSV positions, stable LAN/WAN/enc0 interfaces and rule trackers.',
    'UDP length includes its eight-byte header: 69-byte IPv4 has 49-byte UDP and 41-byte payload. TCP 60 has 40-byte TCP header/options and zero application payload; these are packet lengths, not flow totals.',
    'Every enc0 pass requires an active CHILD. Failed attempts do not overwrite the live IKE identity; closure retains CHILD ID/SPIs/selectors, clears payload, then deletion clears the live IKE. One pair and bounded 720-phase scheduler retain no SA history.',
    'Fresh successful IDs/nonzero SPIs distinguish episodes. Both modes contain all eight actions and independent 445/3389/5985 passes; pass alone proves no connection/authentication success.',
    'Selected deployment enables optional RFC 5424 UDP forwarding for Firewall/VPN, logged pass rules, and IKE SA/IKE Child SA/Configuration Backend Diag with other categories Control. Synthetic SA counters include unlogged traffic and replies.',
    'BLOCKED_RAW_EVIDENCE: maintained pfSense formatter and upstream strongSwan 5.9.14 close/delete grammar do not prove the exact CE 2.9 bundled library or a complete raw trace. Native Charon PRI relies on older firsthand examples; live parser, cryptography, NAT and administrator authentication are unproven.',
  ],
  format: ['JSON', 'ECS', 'Syslog'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring 12-record core chains amid background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '6',
      description:
        'Generated-time recurrence; finite numeric values below one hour clamp to one',
    },
    {
      name: 'hostname',
      defaultValue: 'fw01.corp.example',
      description: 'Firewall host',
    },
    {
      name: 'wan_ip',
      defaultValue: '203.0.113.1',
      description: 'Local IPsec endpoint and WAN address',
    },
    {
      name: 'remote_peer_ip',
      defaultValue: '198.51.100.77',
      description: 'Remote IPsec endpoint',
    },
    {
      name: 'remote_tunnel_ip',
      defaultValue: '10.42.42.17',
      description: 'Remote host inside the tunnel',
    },
    {
      name: 'internal_target_ip',
      defaultValue: '10.20.0.10',
      description: 'Internal service host',
    },
    {
      name: 'tunnel_name',
      defaultValue: 'corp-remote',
      description: 'IPsec connection name',
    },
    {
      name: 'ipsec_pass_rule_tracker',
      defaultValue: '1534283903',
      description: 'Existing logged IPsec-tab pass rule',
    },
  ],
  sampleOutputs: [
    {
      title: 'CHILD_SA established after repeated identity mismatches',
      json: String.raw`{
  "@timestamp": "2026-09-25T06:00:45.172919+00:00",
  "data_stream": {
    "dataset": "pfsense.log",
    "namespace": "default",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ipsec-child-established",
    "category": [
      "network"
    ],
    "dataset": "pfsense.log",
    "kind": "event",
    "original": "<30>1 2026-09-25T06:00:45.172919+00:00 fw01.corp.example charon 18610 - - 16[IKE] <corp-remote|33> CHILD_SA corp-remote{7} established with SPIs 98e17ba1_i acf2193c_o and TS 10.20.0.0/24|/0 === 10.42.42.0/24|/0",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "fw01.corp.example"
  },
  "log": {
    "syslog": {
      "priority": 30
    }
  },
  "message": "16[IKE] <corp-remote|33> CHILD_SA corp-remote{7} established with SPIs 98e17ba1_i acf2193c_o and TS 10.20.0.0/24|/0 === 10.42.42.0/24|/0",
  "observer": {
    "name": "fw01.corp.example",
    "product": "pfSense",
    "type": "firewall",
    "vendor": "Netgate",
    "version": "2.9.0"
  },
  "process": {
    "name": "charon",
    "pid": 18610
  },
  "syslog": {
    "facility": {
      "code": 3
    },
    "priority": 30,
    "severity": {
      "code": 6
    }
  }
}`,
    },
  ],
};
