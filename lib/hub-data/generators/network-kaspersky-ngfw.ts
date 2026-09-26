/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses are documented defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKasperskyNgfw: GeneratorMeta = {
  slug: 'network-kaspersky-ngfw',
  displayName: 'Kaspersky NGFW 1.0 CEF sessions',
  category: 'network',
  description:
    'Kaspersky NGFW Firewall CEF session records with paired start and end events and transfer volumes.',
  dataSource: 'Kaspersky NGFW 1.0',
  format: ['CEF', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Vendor-documented CEF fields in event.original',
    'Correlated multi-event anomaly chain',
    'Background-only mode for baseline traffic',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Two SMB sessions from one workstation to one server each start and finish with the same session ID and unusually large server-to-client byte counts.',
  generatorId: 'kaspersky-ngfw',
  eventTypes: [
    {
      id: 'Session start',
      description: 'Session opened',
      frequency: '~2.5% in anomaly mode',
      category: 'network',
    },
    {
      id: 'Firewall',
      description: 'Session ended',
      frequency: '~97.5% in anomaly mode',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Native source identifiers and event classes',
    'Stable actors and targets throughout the chain',
    'Time-sorted sequence suitable for SIEM correlation',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the SMB transfer chain.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine records between chains.',
    },
    {
      name: 'device_host',
      defaultValue: 'ngfw-01.example.test',
      description: 'NGFW hostname.',
    },
    {
      name: 'device_version',
      defaultValue: '1.0.0.0',
      description: 'CEF device version.',
    },
    {
      name: 'unusual_source_ip',
      defaultValue: '10.20.1.87',
      description: 'Chain client.',
    },
    {
      name: 'sensitive_destination_ip',
      defaultValue: '10.20.2.14',
      description: 'Chain server.',
    },
  ],
  sampleOutputs: [
    {
      title: 'Kaspersky NGFW 1.0 CEF sessions anomaly event',
      json: String.raw`{"@timestamp":"2026-09-25T13:04:04+00:00","destination":{"bytes":0,"ip":"10.20.2.14","port":445},"ecs":{"version":"8.17.0"},"event":{"action":"Session start","category":["network"],"dataset":"kaspersky.ngfw","kind":"event","original":"CEF:0|Kaspersky|NGFW|1.0.0.0|Firewall|Session start|Unknown|rt=2026-09-25T13:04:04Z dtz=UTC+00:00 cs4=Low cs4Label=Priority devicePayloadId=911 cs1=Internal SMB inspection cs1Label=SecurityRule act=Inspect FullMatch=yes start=2026-09-25T13:04:04Z cn1=0 cn1Label=Duration cn2=1 cn2Label=ClientPackets cn3=0 cn3Label=ServerPackets in=64 out=0 dvchost=ngfw-01.example.test src=10.20.1.87 dst=10.20.2.14 proto=TCP spt=49220 dpt=445 KasperskyNGFWTCPRedir=no app=Unknown","type":["start"]},"kaspersky":{"ngfw":{"action":"Inspect","rule":"Internal SMB inspection","session_id":"911"}},"network":{"protocol":"smb","transport":"tcp"},"observer":{"hostname":"ngfw-01.example.test","product":"NGFW","vendor":"Kaspersky","version":"1.0.0.0"},"source":{"bytes":64,"ip":"10.20.1.87","port":49220}}`,
    },
  ],
};
