/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyKics4net: GeneratorMeta = {
  slug: 'security-kaspersky-kics4net',
  displayName: 'KICS for Networks 4.2 CEF',
  category: 'security',
  description:
    'Industrial network asset, address-conflict, and ARP alerts from KICS for Networks.',
  dataSource: 'Kaspersky Industrial CyberSecurity for Networks 4.2',
  format: ['CEF', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Vendor-documented CEF 20 field map',
    'Asset and network security events',
    'Device-conflict-ARP correlation chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'A new device is followed by an IP conflict and ARP spoofing signs at the same address.',
  generatorId: 'kics-networks',
  eventTypes: [
    {
      id: '4000005003',
      description: 'New device detected on network',
      frequency: '~60% routine',
      category: 'host',
    },
    {
      id: '4000005007',
      description: 'New device IP address detected',
      frequency: '~30% routine',
      category: 'host',
    },
    {
      id: '4000005005',
      description: 'IP address conflict detected',
      frequency: '~10% routine',
      category: 'network',
    },
    {
      id: '4000004001',
      description: 'ARP spoofing signs in replies',
      frequency: 'Anomaly chain only',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Documented KICS event IDs and severity bands',
    'Event-specific extension keys for each alert',
    'Consistent device IP across the timed chain',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the device-conflict-ARP chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Routine records between chains.',
    },
    {
      name: 'server_host',
      defaultValue: 'kics-srv-01.example.test',
      description: 'KICS server address.',
    },
    {
      name: 'target_ip',
      defaultValue: '10.20.30.15',
      description: 'Device IP in the chain.',
    },
    {
      name: 'challenger_mac',
      defaultValue: '02:42:ac:11:00:99',
      description: 'Conflicting MAC.',
    },
    {
      name: 'owner_mac',
      defaultValue: '02:42:ac:11:00:15',
      description: 'Device known MAC.',
    },
  ],
  sampleOutputs: [
    {
      title: 'KICS for Networks anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:21:10+00:00","destination":{"ip":"10.20.30.1"},"ecs":{"version":"8.17.0"},"event":{"action":"New device detected on network","category":["host"],"code":"4000005003","dataset":"kaspersky.kics_networks","kind":"event","original":"CEF:0|Kaspersky Lab|Kaspersky Industrial CyberSecurity for Networks|4.2.0.335|4000005003|New device detected on network|3|dateTime=2026-09-25T13:21:10.000Z hostname=kics-srv-01.example.test messageType=Event score=2.1 eventIdentifier=30060 src=10.20.30.15 dst=10.20.30.1 ownerIp=10.20.30.15 ownerMac=02:42:ac:11:00:15 assetName=example-device-60","type":["info"]},"host":{"name":"kics-srv-01.example.test"},"kaspersky":{"kics_networks":{"challenger_mac":null,"event_identifier":30060,"owner_mac":"02:42:ac:11:00:15","score":2.1}},"related":{"ip":["10.20.30.15","10.20.30.1"]},"source":{"ip":"10.20.30.15"}}`,
    },
  ],
};
