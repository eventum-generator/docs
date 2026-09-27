import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyCybertrace: GeneratorMeta = {
  slug: 'security-kaspersky-cybertrace',
  displayName: 'Kaspersky CyberTrace ArcSight CEF Detections',
  category: 'security',
  description:
    'Kaspersky CyberTrace 4.0 detections, each recording that an event from an endpoint matched a URL or file hash from Kaspersky Threat Data Feeds, in the CEF pattern Kaspersky documents for ArcSight, placed in event.original of ECS JSON. 84 endpoints produce detections independently. Recurring episodes show one endpoint matching a malicious URL, then a file MD5, then the same URL again.',
  dataSource:
    'Kaspersky CyberTrace 4.0 CyberTrace Detection Event, ArcSight CEF pattern',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Documented ArcSight CEF pattern in event.original',
    'Independent incidents from 84 endpoints',
    'Recurring URL, file hash, same URL chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first episode one hour after the generator starts plus a random delay; each next one due the configured hours after the actual start of the previous one, then delayed by up to one hour, or one eighth of the interval when shorter; a missed episode is not caught up), one endpoint and user match a malicious URL, a malicious file MD5 about a minute or two later, then the same URL a few minutes later. Endpoint, URL and hash change between episodes; every part also occurs in background, and only the complete sequence for one endpoint and user is episode-only.',
  generatorId: 'cybertrace',
  eventTypes: [
    {
      id: 'KL_Malicious_URL',
      description: 'URL from the Malicious URL Data Feed',
      frequency: '57.5% measured share',
      category: 'threat',
    },
    {
      id: 'KL_Malicious_Hash_MD5',
      description: 'File MD5 from the Malicious Hash Data Feed',
      frequency: '20.6% measured share',
      category: 'threat',
    },
    {
      id: 'KL_Phishing_URL',
      description: 'URL from the Phishing URL Data Feed',
      frequency: '21.9% measured share',
      category: 'threat',
    },
  ],
  realismFeatures: [
    'Each of 84 endpoints has its own activity level and skewed gaps between incidents. User endpoints are about three times as active from 06:00 to 17:00 UTC as at night, six endpoints run under two service accounts and are active around the clock, and a few shared hosts have several users. The rate (about 530 detections per day) and the shares are scenario assumptions, not Kaspersky measurements.',
    'Incidents are URL matches retried within seconds, phishing redirects with two phishing URLs, downloads (a malicious URL, then a file MD5 a minute or two later, often followed by other malicious URLs), hash-first detections, and beacon-like repeats of one URL over one or two hours.',
    'Indicators carry fixed feed record fields (mask, first and last seen dates, popularity, threat name, category or industry, file hashes and size). Domains use reserved .test, .example and .invalid names, and addresses are documentation or RFC 1918 ranges.',
    'The header, extension key order and cs5/cn3/cs6 labels follow the CyberTrace 4.0 ArcSight integration procedure, with actionable fields in the CEF keys it lists per feed. The actionable field order, the - for an empty field and the cs6 record context layout follow the complete CyberTrace 5.3 record; no complete 4.0 record was found, so 4.0 byte parity is not established. URL record context omits nested feed fields (files, whois, geo, IP).',
    'For URL detections the matched indicator is the feed record mask, an interpretation of the documentation. sourceServiceName and sproc stand for the incoming event source, @timestamp is Eventum time because the pattern has no time field, and confidence is always 100. Detection events only: no Feed Service alerts, raw endpoint telemetry or TCP transport.',
    'An ordinary match that would complete the URL, MD5, same URL sequence for one endpoint and user within two hours is given another URL. The chain suggests the host went back to the resource it fetched a detected file from; CyberTrace detections alone do not prove that the URL delivered that file.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring URL, file hash, same URL episode; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the start of one episode to the time the next is due, minimum 3',
    },
  ],
  sampleOutputs: [
    {
      title: 'File hash match of an anomaly episode (KL_Malicious_Hash_MD5)',
      json: String.raw`{"@timestamp": "2026-09-02T02:55:14.484147+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "indicator_match", "category": ["threat"], "code": "KL_Malicious_Hash_MD5", "dataset": "kaspersky.cybertrace", "kind": "alert", "original": "CEF:0|Kaspersky|Kaspersky CyberTrace for ArcSight|2.0|2|CyberTrace Detection Event|8| reason=KL_Malicious_Hash_MD5 dst=- src=10.20.4.175 fileHash=A0F85F1082FB3D525DAE8F5522EABC8B request=- sourceServiceName=ExampleVendor sproc=EndpointSecurity suser=o.popov msg=CyberTrace detected KL_Malicious_Hash_MD5 externalId=7096745 flexString1=16.06.2022 03:53 flexString2=04.06.2026 22:17 cn2=3 cs3=HEUR:Trojan-Dropper.Win32.Agent.gen cs4=http://cdn-docs33.test/update/patch.bin fsize=3775663 cs5Label=MatchedIndicator cs5=A0F85F1082FB3D525DAE8F5522EABC8B cn3Label=Confidence cn3=100 cs6Label=Context cs6=MD5:A0F85F1082FB3D525DAE8F5522EABC8B SHA1:B1F4FB26D4C2BECFCC5D810E0A69C45E11101A89 SHA256:03FE587258F70945E8D4F039ADE809B8B1FA7339260C38A90175C218D6C9F79D file_size:3775663 first_seen:16.06.2022 03:53 last_seen:04.06.2026 22:17 popularity:3 threat:HEUR:Trojan-Dropper.Win32.Agent.gen ", "severity": 8, "type": ["indicator"]}, "file": {"hash": {"md5": "a0f85f1082fb3d525dae8f5522eabc8b", "sha1": "b1f4fb26d4c2becfcc5d810e0a69c45e11101a89", "sha256": "03fe587258f70945e8d4f039ade809b8b1fa7339260c38a90175c218d6c9f79d"}, "size": 3775663}, "kaspersky": {"cybertrace": {"confidence": 100, "external_id": 7096745, "matched_indicator": "A0F85F1082FB3D525DAE8F5522EABC8B", "record_context": "MD5:A0F85F1082FB3D525DAE8F5522EABC8B SHA1:B1F4FB26D4C2BECFCC5D810E0A69C45E11101A89 SHA256:03FE587258F70945E8D4F039ADE809B8B1FA7339260C38A90175C218D6C9F79D file_size:3775663 first_seen:16.06.2022 03:53 last_seen:04.06.2026 22:17 popularity:3 threat:HEUR:Trojan-Dropper.Win32.Agent.gen "}}, "observer": {"product": "Kaspersky CyberTrace for ArcSight", "vendor": "Kaspersky"}, "related": {"hash": ["a0f85f1082fb3d525dae8f5522eabc8b", "b1f4fb26d4c2becfcc5d810e0a69c45e11101a89", "03fe587258f70945e8d4f039ade809b8b1fa7339260c38a90175c218d6c9f79d"], "ip": ["10.20.4.175"], "user": ["o.popov"]}, "source": {"ip": "10.20.4.175"}, "user": {"name": "o.popov"}}`,
    },
  ],
};
