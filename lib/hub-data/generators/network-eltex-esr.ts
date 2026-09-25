/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexEsr: GeneratorMeta = {
  slug: 'network-eltex-esr',
  displayName: 'Eltex ESR Router Syslog',
  category: 'network',
  description:
    'RFC 5424 syslog from an Eltex ESR router with firewall, NAT, IPS and administrator activity. Switch between background traffic and a correlated SSH takeover with high-privilege account changes.',
  dataSource: 'Eltex ESR-series software 1.40 syslog',
  format: ['JSON', 'ECS', 'RFC 5424'],
  eventCount: 12,
  templateCount: 1,
  generatorId: 'esr',
  highlights: [
    '58/58 selected reference fields',
    'Complete RFC 5424 event.original',
    'Switchable SSH account-takeover sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed SSH passwords, successful admin login, enable-password change, new user and privilege increase, system-time change, then SSH as that user.',
  eventTypes: [
    {
      id: '%FIREWALL-I-LOG permit',
      description: 'Zone-pair permit',
      frequency: '62% routine weight',
      category: 'network',
    },
    {
      id: '%FIREWALL-I-LOG deny',
      description: 'Zone-pair deny',
      frequency: '20% routine weight',
      category: 'network',
    },
    {
      id: '%NAT-I-LOG',
      description: 'SNAT translation',
      frequency: '15% routine weight',
      category: 'network',
    },
    {
      id: '%IPS-I-INFO',
      description: 'IPS signature drop',
      frequency: '1.5% routine weight',
      category: 'intrusion_detection',
    },
    {
      id: '%AAA-I-SSH / %AAA-LOCAL-I-SESSION',
      description: 'Linked normal SSH session',
      frequency: '1% routine trigger',
      category: 'authentication',
    },
    {
      id: '%AAA-I-SSH failed password',
      description: 'Failed SSH login',
      frequency: '0.5% routine weight',
      category: 'authentication',
    },
    {
      id: '%USER-I-INFO / %USER-I-ADD / %TIME-I-INFO',
      description: 'Privilege, account and time changes',
      frequency: 'Anomaly only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'RFC 5424 framing keeps timestamp, hostname, priority and bounded sequence in sync.',
    'Firewall and NAT messages use coherent source addresses, ports and interfaces from four flow samples.',
    'Normal SSH sessions contain accepted password, open and close records.',
    'Anomaly-created service accounts have distinct names and a documented privilege increase.',
  ],
  parameters: [
    {
      name: 'router_name',
      defaultValue: 'esr-edge-01',
      description: 'Router name',
    },
    {
      name: 'router_ip',
      defaultValue: '10.50.0.1',
      description: 'Router IP address',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'Routine SSH administrator',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.50.1.25',
      description: 'Routine management source',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin',
      description: 'Anomaly administrator',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.99.4.33',
      description: 'Unusual SSH source',
    },
    {
      name: 'service_user_prefix',
      defaultValue: 'svc_remote_',
      description: 'Created account prefix',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '1000',
      description: 'Routine events between anomaly chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit the correlated anomaly chain alongside routine events; false emits only background',
    },
  ],
  sampleOutputs: [
    {
      title: 'ESR privilege change',
      json: String.raw`{"@timestamp": "2026-09-25T11:16:11+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "user_privilege_changed", "category": ["iam"], "dataset": "eltex.esr.syslog", "kind": "event", "module": "eltex", "original": "<86>1 2026-09-25T11:16:11+00:00 esr-edge-01 user - - - 1026: %USER-I-INFO: Privilege level of user svc_remote_001 was changed from 5 to 14", "outcome": "success", "type": ["change"]}, "message": "%USER-I-INFO: Privilege level of user svc_remote_001 was changed from 5 to 14", "log": {"level": "info", "syslog": {"priority": 86, "facility": {"code": 10}, "severity": {"code": 6}, "appname": "user", "version": "1"}}, "observer": {"hostname": "esr-edge-01", "ip": "10.50.0.1", "name": "esr-edge-01", "product": "ESR", "type": "router", "vendor": "Eltex"}, "eltex": {"esr": {"group": "USER", "mnemonic": "INFO", "severity_code": "I", "sequence_number": 1026, "details": {"privilege": {"new": 14, "old": 5}}}}, "user": {"target": {"name": "svc_remote_001"}}}`,
    },
  ],
};
