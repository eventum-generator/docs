/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkEltexMes: GeneratorMeta = {
  displayName: 'Eltex MES Switch Syslog',
  description:
    'Selected MES5324 message bodies with current MAC, port, receiver and HTTPS-session state. Daily failure-to-disruption sequences have visible restoration and share ordinary actors and actions.',
  dataSource:
    'Selected MES5324 message-body profile; unversioned vendor catalog',
  format: ['JSON', 'ECS'],
  generatorId: 'mes',
  highlights: [
    'Ten native classes shared by both modes',
    'MAC, port and receiver transitions',
    'Daily sequences with visible restoration',
  ],
  anomalyChain:
    'Every24 hours, three failed HTTPS attempts precede acceptance, speed1G, port Down, MAC removal, local-file clearing, auxiliary-receiver deletion and disconnect. Ten records span270 seconds. A separate administrator starts restoration fifteen minutes after deletion; receiver addition is visible seventeen minutes after deletion. Ordinary maintenance shares every action, actor and target.',
  eventTypes: [
    {
      id: 'BRG_MACNTFY-I-MAC_CHANGED',
      description: 'Learn an absent MAC or remove a present selected entry',
      frequency: 'Background FDB transitions and target maintenance',
      category: 'network',
    },
    {
      id: 'AAA-W-REJECT',
      description: 'Reject selected HTTPS local-table authentication',
      frequency: 'Ordinary isolated failure; three per episode',
      category: 'authentication',
    },
    {
      id: 'AAA-I-CONNECT',
      description: 'Accept authentication and open the selected session',
      frequency: 'Every selected ordinary/episode session',
      category: 'authentication',
    },
    {
      id: 'AAA-I-DISCONNECT',
      description: 'Terminate that same-user/source session',
      frequency: 'Every selected ordinary/episode session',
      category: 'authentication',
    },
    {
      id: 'LINK-N-PortConfRecover',
      description: 'Report configured speed1G or10G',
      frequency: 'Ordinary port work, episode and restoration',
      category: 'configuration',
    },
    {
      id: 'LINK-W-Down',
      description: 'Transition an up target port down',
      frequency: 'Ordinary port work and episode',
      category: 'network',
    },
    {
      id: 'LINK-W-Up',
      description: 'Restore the selected down port',
      frequency: 'Ordinary port work and episode recovery',
      category: 'network',
    },
    {
      id: 'SYSLOG-N-CLEARLOGGINGFILE',
      description: 'Clear the local logging file',
      frequency: 'Ordinary file maintenance and episode',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NOSYSLOGSERVER',
      description: 'Delete the existing auxiliary receiver',
      frequency: 'Ordinary receiver work and episode',
      category: 'configuration',
    },
    {
      id: 'SYSLOG-N-NEWSYSLOGSERVER',
      description: 'Re-add that absent auxiliary receiver',
      frequency: 'Ordinary receiver work and episode recovery',
      category: 'configuration',
    },
  ],
  realismFeatures: [
    'One record every30 seconds, one switch,52 current FDB entries, eight selected ports and four target speeds. Selected aging/clearing amid unlogged traffic does not implement a complete packet or MAC-aging engine.',
    'Learning requires an absent entry and an up port. A held maintenance endpoint cannot relearn before visible Up and restoration. Current speed/link/FDB/receiver state prevents contradictory transitions.',
    'A separate retained collector continues to receive the feed while only the auxiliary receiver is absent. Clearing a local file does not erase already exported records.',
    'Both existing administrators rotate ordinary maintenance, sharing the same four physical targets, speed values and native actions as episodes. Sessions visibly disconnect before the next selected session.',
    'PortConfRecover is a documented configured-speed result, with no native actor or cause. Configuration joins are temporal/device context rather than command attribution.',
    'The unversioned MES-family catalog defines selected bodies. Same-family4.0.27.3 manual supports hardware/configuration assumptions only. Exact build/full transport/live parser and complete native learning example remain unverified. Outer UTC time is a synthetic event clock because the body has no time field.',
  ],
  slug: 'network-eltex-mes',
  category: 'network',
  eventCount: 10,
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'switch_name',
      defaultValue: 'mes-access-01',
      description: 'Switch name',
    },
    {
      name: 'switch_ip',
      defaultValue: '10.40.0.11',
      description: 'Switch ip',
    },
    {
      name: 'normal_user',
      defaultValue: 'netops',
      description: 'First existing administrator, active in both modes',
    },
    {
      name: 'normal_source_ip',
      defaultValue: '10.40.1.25',
      description: 'First administrator source, shared by both modes',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin',
      description: 'Second existing administrator, active in both modes',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.99.4.21',
      description: 'Second administrator source, shared by both modes',
    },
    {
      name: 'target_port',
      defaultValue: 'te1/0/5',
      description:
        'First existing physical target port; distinct valid profile inventory',
    },
    {
      name: 'target_mac',
      defaultValue: 'e0:d9:e3:2c:19:b0',
      description: 'First existing target MAC; distinct profile inventory',
    },
    {
      name: 'target_vlan',
      defaultValue: '20',
      description: 'Existing target VLAN',
    },
    {
      name: 'syslog_server_ip',
      defaultValue: '10.40.0.12',
      description: 'Auxiliary receiver, separate from retained collector',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Default true includes periodic combined sequences; false retains ordinary activity',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between actual starts; supported minimum6',
    },
  ],
  sampleOutputs: [
    {
      title: 'Actorless configured-speed message body',
      json: String.raw`{
  "@timestamp": "2026-09-26T00:02:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "eltex": {
    "mes": {
      "component": "LINK",
      "details": {
        "interface": {
          "speed": "1G"
        }
      },
      "mnemonic": "PortConfRecover",
      "severity_code": "N"
    }
  },
  "event": {
    "action": "interface_speed_changed",
    "category": [
      "configuration",
      "network"
    ],
    "dataset": "eltex.mes.syslog",
    "kind": "event",
    "module": "eltex",
    "original": "LINK-N-PortConfRecover: Port te1/0/5 configured to speed 1G",
    "outcome": "unknown",
    "type": [
      "change"
    ]
  },
  "interface": {
    "name": "te1/0/5"
  },
  "log": {
    "level": "notice"
  },
  "message": "LINK-N-PortConfRecover: Port te1/0/5 configured to speed 1G",
  "observer": {
    "hostname": "mes-access-01",
    "ip": [
      "10.40.0.11"
    ],
    "model": "MES5324",
    "name": "mes-access-01",
    "product": "MES",
    "type": "switch",
    "vendor": "Eltex"
  }
}`,
    },
  ],
};
