import type { GeneratorMeta } from '@/lib/hub-types';

export const networkContinent: GeneratorMeta = {
    slug: 'network-continent',
    displayName: 'Network Traffic (Continent-Level Geo)',
    category: 'network',
    description:
      'Network traffic events enriched with continent-level geographic information. Models cross-continent and same-continent flows for both inbound and outbound directions, with realistic allow/deny outcomes based on geographic policy.',
    format: ['JSON', 'ECS'],
    dataSource: 'Generic Network (continent-enriched)',
    eventCount: 6,
    templateCount: 6,
    highlights: [
      'Continent-level geo enrichment',
      'Cross-continent vs same-continent flows',
      'Direction-aware allow/deny policies',
      'Inbound threat modeling',
    ],
    generatorId: 'network-continent',
    eventTypes: [
      {
        id: 'cross-continent-outbound-allow',
        description: 'Outbound traffic to a different continent — allowed',
        frequency: '~25%',
        category: 'network',
      },
      {
        id: 'same-continent-outbound-allow',
        description: 'Outbound traffic within the same continent — allowed',
        frequency: '~30%',
        category: 'network',
      },
      {
        id: 'cross-continent-inbound-allow',
        description: 'Inbound traffic from a different continent — allowed',
        frequency: '~15%',
        category: 'network',
      },
      {
        id: 'same-continent-inbound-allow',
        description: 'Inbound traffic from the same continent — allowed',
        frequency: '~15%',
        category: 'network',
      },
      {
        id: 'cross-continent-inbound-denied',
        description: 'Inbound traffic from a different continent — denied by geo policy',
        frequency: '~10%',
        category: 'network',
      },
      {
        id: 'same-continent-inbound-denied',
        description: 'Inbound traffic from the same continent — denied',
        frequency: '~5%',
        category: 'network',
      },
    ],
    realismFeatures: [
      'Continent-level geolocation — source and destination enriched with continent codes (NA, EU, AS, SA, AF, OC)',
      'Cross-continent vs same-continent traffic split reflects real-world routing patterns',
      'Direction-aware policies — outbound traffic predominantly allowed; inbound subject to geo-based filtering',
      'Denied traffic skewed toward cross-continent inbound, modeling geographic access restrictions',
      'ECS geo fields — source.geo.continent_name and destination.geo.continent_name populated on every event',
    ],
    parameters: [
      {
        name: 'hostname',
        defaultValue: 'gw-01',
        description: 'Gateway hostname',
      },
      {
        name: 'domain',
        defaultValue: 'example.com',
        description: 'Domain for FQDN',
      },
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
        description: 'Filebeat agent ID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Filebeat version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Cross-Continent Outbound (Allow)',
        json: `{
    "@timestamp": "2026-03-07T10:15:32.456789+00:00",
    "event": {
        "action": "allow",
        "category": ["network"],
        "dataset": "network.continent",
        "outcome": "success",
        "type": ["connection", "allowed"]
    },
    "source": {
        "ip": "10.1.1.45",
        "port": 49821,
        "geo": { "continent_name": "North America" }
    },
    "destination": {
        "ip": "203.0.113.80",
        "port": 443,
        "geo": { "continent_name": "Europe" }
    },
    "network": {
        "direction": "outbound",
        "transport": "tcp"
    },
    "observer": { "hostname": "gw-01", "type": "firewall", "vendor": "Generic" }
}`,
      },
    ],
  };
