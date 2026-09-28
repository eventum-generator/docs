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
    'One endpoint and user match a malicious URL, a malicious file MD5 about a minute or two later, then the same URL a few minutes later; half of the episodes then contact another malicious URL, and an episode spans 2-45 minutes. The first episode starts at a random time within the first anomaly_interval_hours (default 24, minimum 3) or 24 hours, whichever is shorter, with the hour of day following the detection rate; each next one starts within a window centred on the interval after the actual start of the previous one, a quarter of the interval wide and at most six hours, preferring hours with more detections, so episode times drift toward busy hours. Scheduling is on event time and a missed episode is not caught up (measured 21.0-26.3 h apart at the default, 7.0-9.0 h at 8 hours). Endpoint, URL and hash change between episodes; every part also occurs in background, and only the complete sequence for one endpoint and user is episode-only.',
  generatorId: 'cybertrace',
  eventTypes: [
    {
      id: 'KL_Malicious_URL',
      description: 'URL from the Malicious URL Data Feed',
      frequency: '59.7% measured share',
      category: 'threat',
    },
    {
      id: 'KL_Malicious_Hash_MD5',
      description: 'File MD5 from the Malicious Hash Data Feed',
      frequency: '20.4% measured share',
      category: 'threat',
    },
    {
      id: 'KL_Phishing_URL',
      description: 'URL from the Phishing URL Data Feed',
      frequency: '19.9% measured share',
      category: 'threat',
    },
  ],
  realismFeatures: [
    'Each of 84 endpoints has its own activity level and skewed gaps between incidents. User endpoints are about three times as active from 06:00 to 17:00 UTC as at night, six endpoints run under two service accounts and are active around the clock, and a few shared hosts have several users. The rate (about 490 detections per day) and the shares are scenario assumptions, not Kaspersky measurements.',
    'Incidents are URL matches retried within seconds, phishing redirects with two phishing URLs, downloads (a malicious URL, then a file MD5 a minute or two later, often followed by other malicious URLs), hash-first detections, and beacon-like repeats of one URL over one or two hours.',
    'Indicators carry fixed feed record fields (mask, first and last seen dates, popularity, threat name, category or industry, file hashes and size). Domains use reserved .test, .example and .invalid names, and addresses are documentation or RFC 1918 ranges.',
    'The header, extension key order and cs5/cn3/cs6 labels follow the CyberTrace 4.0 ArcSight integration procedure, with actionable fields in the CEF keys it lists per feed. The actionable field order, the - for an empty field and the cs6 record context layout follow the complete CyberTrace 5.3 record; no complete 4.0 record was found, so 4.0 byte parity is not established. URL record context omits nested feed fields (files, whois, geo, IP).',
    'For URL detections the matched indicator is the feed record mask, an interpretation of the documentation. sourceServiceName and sproc stand for the incoming event source, @timestamp is Eventum time because the pattern has no time field, and confidence is always 100. Detection events only: no Feed Service alerts, raw endpoint telemetry or TCP transport.',
    'An ordinary match that would complete the URL, MD5, same URL sequence for one endpoint and user within one hour of the first URL match is reported for another URL of the same feed, at the same time and for the same endpoint and user; this also applies after an episode, and a match more than one hour after the first is not changed. The chain suggests the host went back to the resource it fetched a detected file from; CyberTrace detections alone do not prove that the URL delivered that file.',
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
      json: String.raw`{"@timestamp": "2026-09-01T19:00:13.596615+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "indicator_match", "category": ["threat"], "code": "KL_Malicious_Hash_MD5", "dataset": "kaspersky.cybertrace", "kind": "alert", "original": "CEF:0|Kaspersky|Kaspersky CyberTrace for ArcSight|2.0|2|CyberTrace Detection Event|8| reason=KL_Malicious_Hash_MD5 dst=- src=10.20.8.146 fileHash=3AA8317DAEC29F235D3D71FF49DF7169 request=- sourceServiceName=ExampleVendor sproc=EndpointSecurity suser=v.sokolova msg=CyberTrace detected KL_Malicious_Hash_MD5 externalId=438455 flexString1=11.07.2019 22:11 flexString2=06.09.2025 23:13 cn2=1 cs3=HEUR:Trojan.Script.Generic cs4=- fsize=477257 cs5Label=MatchedIndicator cs5=3AA8317DAEC29F235D3D71FF49DF7169 cn3Label=Confidence cn3=100 cs6Label=Context cs6=MD5:3AA8317DAEC29F235D3D71FF49DF7169 SHA1:9F57E16FB47B96B170DAD78E26B96380E8262B9F SHA256:A6A69DB3767DB7F8DE9F1CD0AFA6928A276CFBE97170A826AE6857CBAD134154 file_size:477257 first_seen:11.07.2019 22:11 last_seen:06.09.2025 23:13 popularity:1 threat:HEUR:Trojan.Script.Generic ", "severity": 8, "type": ["indicator"]}, "file": {"hash": {"md5": "3aa8317daec29f235d3d71ff49df7169", "sha1": "9f57e16fb47b96b170dad78e26b96380e8262b9f", "sha256": "a6a69db3767db7f8de9f1cd0afa6928a276cfbe97170a826ae6857cbad134154"}, "size": 477257}, "kaspersky": {"cybertrace": {"confidence": 100, "external_id": 438455, "matched_indicator": "3AA8317DAEC29F235D3D71FF49DF7169", "record_context": "MD5:3AA8317DAEC29F235D3D71FF49DF7169 SHA1:9F57E16FB47B96B170DAD78E26B96380E8262B9F SHA256:A6A69DB3767DB7F8DE9F1CD0AFA6928A276CFBE97170A826AE6857CBAD134154 file_size:477257 first_seen:11.07.2019 22:11 last_seen:06.09.2025 23:13 popularity:1 threat:HEUR:Trojan.Script.Generic "}}, "observer": {"product": "Kaspersky CyberTrace for ArcSight", "vendor": "Kaspersky"}, "related": {"hash": ["3aa8317daec29f235d3d71ff49df7169", "9f57e16fb47b96b170dad78e26b96380e8262b9f", "a6a69db3767db7f8de9f1cd0afa6928a276cfbe97170a826ae6857cbad134154"], "ip": ["10.20.8.146"], "user": ["v.sokolova"]}, "source": {"ip": "10.20.8.146"}, "user": {"name": "v.sokolova"}}`,
    },
  ],
};
