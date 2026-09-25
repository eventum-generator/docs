/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyCybertrace: GeneratorMeta = {
  slug: 'security-kaspersky-cybertrace',
  displayName: 'Kaspersky CyberTrace ArcSight CEF',
  category: 'security',
  description:
    'CyberTrace 4.0 indicator matches in its configurable ArcSight CEF pattern, with a switchable three-detection sequence.',
  dataSource: 'Kaspersky CyberTrace 4.0 ArcSight CEF Detection Event',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Three documented indicator categories',
    'Configured ArcSight CEF pattern in event.original',
    'One switchable URL-MD5-URL sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After 12 routine detections, one endpoint and user match a malicious URL, a malicious MD5 five minutes later, then the same URL five minutes later.',
  generatorId: 'cybertrace',
  eventTypes: [
    {
      id: 'KL_Malicious_URL',
      description: 'Malicious URL match',
      frequency: 'About 65% of modeled routine detections',
      category: 'threat',
    },
    {
      id: 'KL_Phishing_URL',
      description: 'Phishing URL match',
      frequency: 'About 25% of modeled routine detections',
      category: 'threat',
    },
    {
      id: 'KL_Malicious_Hash_MD5',
      description: 'Malicious MD5 match',
      frequency: 'About 10% of modeled routine detections',
      category: 'threat',
    },
  ],
  realismFeatures: [
    "CEF header and extension order follow the vendor's configurable ArcSight pattern.",
    'Source IP is the incoming endpoint address; Eventum supplies the event timestamp.',
    'Both modes contain each target indicator signature; the ten-minute order distinguishes the chain.',
    'A complete populated CyberTrace 4.0 ArcSight CEF event and target-collector parse remain unavailable; the sequence does not prove a download.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include one short sequence; false emits background only',
    },
    {
      name: 'anomaly_delay_events',
      defaultValue: '12',
      description: 'Routine detections before the sequence',
    },
    {
      name: 'target_endpoint_ip',
      defaultValue: '10.20.1.44',
      description: 'Endpoint in routine matches and the sequence',
    },
    {
      name: 'target_destination_ip',
      defaultValue: '198.51.100.10',
      description: 'Destination from incoming events',
    },
    {
      name: 'target_user',
      defaultValue: 'operator',
      description: 'User in incoming events',
    },
    {
      name: 'target_url',
      defaultValue: 'https://malware.example.test/dropper',
      description: 'Repeated malicious URL indicator',
    },
    {
      name: 'target_md5',
      defaultValue: 'C912705B4BBB14EC7E78FA8B370532C9',
      description: 'Malicious MD5 indicator',
    },
  ],
  sampleOutputs: [
    {
      title: 'CyberTrace MD5 detection',
      json: String.raw`{
  "@timestamp": "2026-09-25T18:55:00+00:00",
  "destination": {
    "ip": "198.51.100.10"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "indicator_match",
    "category": [
      "threat"
    ],
    "code": "KL_Malicious_Hash_MD5",
    "dataset": "kaspersky.cybertrace",
    "kind": "alert",
    "original": "CEF:0|Kaspersky|Kaspersky CyberTrace for ArcSight|2.0|2|CyberTrace Detection Event|8| reason=KL_Malicious_Hash_MD5 dst=198.51.100.10 src=10.20.1.44 fileHash=C912705B4BBB14EC7E78FA8B370532C9 request=- sourceServiceName=ExampleVendor sproc=EndpointSecurity suser=operator msg=CyberTrace detected KL_Malicious_Hash_MD5 externalId=675033 cs5Label=MatchedIndicator cs5=C912705B4BBB14EC7E78FA8B370532C9 cn3Label=Confidence cn3=100 cs6Label=Context cs6=MD5:C912705B4BBB14EC7E78FA8B370532C9",
    "severity": 8,
    "type": [
      "indicator"
    ]
  },
  "file": {
    "hash": {
      "md5": "c912705b4bbb14ec7e78fa8b370532c9"
    }
  },
  "kaspersky": {
    "cybertrace": {
      "confidence": 100,
      "external_id": 675033,
      "matched_indicator": "C912705B4BBB14EC7E78FA8B370532C9",
      "record_context": "MD5:C912705B4BBB14EC7E78FA8B370532C9"
    }
  },
  "observer": {
    "product": "Kaspersky CyberTrace for ArcSight",
    "vendor": "Kaspersky"
  },
  "related": {
    "ip": [
      "10.20.1.44",
      "198.51.100.10"
    ],
    "user": [
      "operator"
    ]
  },
  "source": {
    "ip": "10.20.1.44"
  },
  "user": {
    "name": "operator"
  }
}`,
    },
  ],
};
