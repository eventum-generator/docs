/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityCarbonBlackEdrEventForwarder: GeneratorMeta = {
  slug: 'security-carbon-black-edr-event-forwarder',
  displayName: 'Carbon Black EDR Event Forwarder',
  category: 'security',
  description:
    'Native EDR JSON process and network events with a linked PowerShell persistence sequence.',
  dataSource: 'Carbon Black EDR Event Forwarder JSON',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'security-carbon-black-edr-event-forwarder',
  highlights: [
    'Five vendor-documented endpoint JSON event types',
    'All 84 native field positions from the examples',
    'Process and sensor GUIDs link the five steps within 4 seconds',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Word creates PowerShell, which writes a Run key, changes a file and connects outbound on one sensor.',
  eventTypes: [
    {
      id: 'ingress.event.procstart',
      description: 'Process start',
      frequency: 'About 40%',
      category: 'process',
    },
    {
      id: 'ingress.event.netconn',
      description: 'Outbound TCP connection',
      frequency: 'About 40%',
      category: 'network',
    },
    {
      id: 'ingress.event.childproc',
      description: 'Child process creation',
      frequency: 'About 4%; present in both modes',
      category: 'process',
    },
    {
      id: 'ingress.event.regmod',
      description: 'Registry value write',
      frequency: 'About 6%',
      category: 'registry',
    },
    {
      id: 'ingress.event.filemod',
      description: 'File last-write change',
      frequency: 'About 11%',
      category: 'file',
    },
  ],
  realismFeatures: [
    'The native payload and event.original follow full Carbon Black EDR Event Forwarder JSON examples.',
    'All five event types occur in background, including PowerShell and child-process start pairs on the chain sensor; correlation needs process and sensor links.',
    'KUMA 4.2 lists a CEF syslog normalizer for Carbon Black EDR, which cannot parse this separate JSON stream.',
  ],
  parameters: [
    {
      name: 'cb_server',
      defaultValue: 'cb-01.example.test',
      description: 'EDR server name in the native record',
    },
    {
      name: 'link_base',
      defaultValue: 'https://cb-01.example.test',
      description: 'Base URL for process and sensor links',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the correlated chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine process starts between chains',
    },
    {
      name: 'chain_host',
      defaultValue: 'WS-FIN-01',
      description: 'Hostname for the correlated series',
    },
    {
      name: 'chain_sensor_id',
      defaultValue: '7',
      description: 'Sensor ID for the correlated series',
    },
    {
      name: 'chain_user',
      defaultValue: 'alice@example.test',
      description: 'User context of the process',
    },
    {
      name: 'chain_local_ip',
      defaultValue: '10.20.30.77',
      description: 'Source address of the final connection',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated EDR registry event',
      json: String.raw`
{
  "@timestamp": "2026-09-25T14:53:12+00:00",
  "carbon_black": {
    "edr": {
      "action": "writeval",
      "actiontype": 2,
      "cb_server": "cb-01.example.test",
      "computer_name": "WS-FIN-01",
      "event_type": "regmod",
      "link_process": "https://cb-01.example.test/#analyze/00000007-0000-7470-7708-38e8b8dc068b/1",
      "link_sensor": "https://cb-01.example.test/#/host/7",
      "md5": "E3F7D643F0133A6BCB598EAD3B4F1C76",
      "path": "\\registry\\user\\s-1-5-21-1000-1000-1000-1001\\software\\microsoft\\windows\\currentversion\\run\\updater",
      "pid": 2003,
      "process_guid": "00000007-0000-7470-7708-38e8b8dc068b",
      "sensor_id": 7,
      "timestamp": 1790347992,
      "type": "ingress.event.regmod"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ingress.event.regmod",
    "category": [
      "registry"
    ],
    "dataset": "carbon_black_edr.event_forwarder",
    "kind": "event",
    "original": "{\"action\": \"writeval\", \"actiontype\": 2, \"cb_server\": \"cb-01.example.test\", \"computer_name\": \"WS-FIN-01\", \"event_type\": \"regmod\", \"link_process\": \"https://cb-01.example.test/#analyze/00000007-0000-7470-7708-38e8b8dc068b/1\", \"link_sensor\": \"https://cb-01.example.test/#/host/7\", \"md5\": \"E3F7D643F0133A6BCB598EAD3B4F1C76\", \"path\": \"\\\\registry\\\\user\\\\s-1-5-21-1000-1000-1000-1001\\\\software\\\\microsoft\\\\windows\\\\currentversion\\\\run\\\\updater\", \"pid\": 2003, \"process_guid\": \"00000007-0000-7470-7708-38e8b8dc068b\", \"sensor_id\": 7, \"timestamp\": 1790347992, \"type\": \"ingress.event.regmod\"}",
    "type": [
      "change"
    ]
  },
  "host": {
    "name": "WS-FIN-01"
  },
  "observer": {
    "name": "cb-01.example.test",
    "product": "EDR",
    "vendor": "Carbon Black"
  },
  "process": {
    "entity_id": "00000007-0000-7470-7708-38e8b8dc068b",
    "executable": "c:\\windows\\system32\\windowspowershell\\v1.0\\powershell.exe",
    "pid": 2003
  },
  "registry": {
    "path": "\\registry\\user\\s-1-5-21-1000-1000-1000-1001\\software\\microsoft\\windows\\currentversion\\run\\updater"
  },
  "related": {
    "hosts": [
      "WS-FIN-01"
    ],
    "user": [
      "alice@example.test"
    ]
  },
  "user": {
    "name": "alice@example.test"
  }
}
`,
    },
  ],
};
