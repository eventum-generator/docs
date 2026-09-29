import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyCybertrace: GeneratorMeta = {
  slug: 'security-kaspersky-cybertrace',
  displayName: 'Kaspersky CyberTrace ArcSight CEF Detections',
  category: 'security',
  description:
    'Kaspersky CyberTrace 4.0 detection events, each recording that an event from an endpoint matched a URL or file hash from Kaspersky Threat Data Feeds, in the CEF pattern Kaspersky documents for ArcSight, placed in event.original of ECS JSON. 84 endpoints produce about 510 detections a day, about 12 an hour at night and 30 an hour from 06:00 to 17:00 UTC. Recurring episodes show one endpoint and user matching a malicious URL, then a file MD5, then the same URL again.',
  dataSource:
    'Kaspersky CyberTrace 4.0 CyberTrace Detection Event, ArcSight CEF pattern',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Documented ArcSight CEF pattern in event.original',
    'About 510 detections a day from 84 endpoints on a UTC day curve',
    'Recurring URL, file hash, same URL chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One endpoint and user match a malicious URL, a malicious file MD5 about a minute or two later, then the same URL a few minutes later; half of the episodes then contact another malicious URL, and an episode usually spans 2-25 minutes, occasionally up to about 30. The first episode starts at a random time within the first anomaly_interval_hours (default 24, minimum 3) or the first 24 hours, whichever is shorter, its hour of day following the detection rate. Each next one starts within a window centred on anomaly_interval_hours after the actual start of the previous one, a quarter of the interval wide and at most six hours, preferring hours with more detections, so episode times tend toward busy hours, though a run of episodes can wander through the night. Timing follows event time and a missed episode is not caught up; episodes are 21.3-26.7 h apart at the default and 7.4-9.0 h apart at 8 hours. Endpoint, URL and file hash change between episodes; every part also occurs in ordinary traffic, and only the complete sequence for one endpoint and user is episode-only.',
  generatorId: 'cybertrace',
  eventTypes: [
    {
      id: 'KL_Malicious_URL',
      description: 'URL from the Malicious URL Data Feed',
      frequency: '58.3% of detections',
      category: 'threat',
    },
    {
      id: 'KL_Malicious_Hash_MD5',
      description: 'File MD5 from the Malicious Hash Data Feed',
      frequency: '20.3% of detections',
      category: 'threat',
    },
    {
      id: 'KL_Phishing_URL',
      description: 'URL from the Phishing URL Data Feed',
      frequency: '21.4% of detections',
      category: 'threat',
    },
  ],
  realismFeatures: [
    '84 endpoints produce detections independently, each at its own activity level; together they produce about 12 an hour at night and 30 an hour from 06:00 to 17:00 UTC, about 510 a day. User endpoints are about three times as active from 06:00 to 17:00 UTC as from 20:00 to 06:00, with 17:00-20:00 in between, and fewer users have detections at night; six service-account endpoints (svc-sccm and svc-build, three each) produce about 90 a day evenly around the clock. Most endpoints have one user, and about one in five are shared hosts with several users. The rate and the shares are scenario assumptions, not Kaspersky measurements.',
    'Incidents are malicious or phishing URL matches often repeated within seconds, phishing redirects with two phishing URLs within seconds, downloads (a malicious URL, then a file MD5 a minute or two later, often followed by other malicious URLs over the next minutes), hash-first detections (sometimes rescanned, sometimes followed by a malicious URL contact), and beacon-like repeats of one malicious URL two to six times usually over 15 minutes to two hours. In live output, most later detections of an incident keep their own @timestamp but arrive after it: a median of about 4 minutes, rarely up to about 35 minutes, and up to an hour at night.',
    'Indicators carry fixed feed record fields (mask, first and last seen dates, popularity, threat name, category or industry, file hashes and size). Domains use reserved .test, .example and .invalid names, and addresses are documentation or RFC 1918 ranges.',
    'The header, extension key order and cs5/cn3/cs6 labels follow the CyberTrace 4.0 ArcSight integration procedure, with actionable fields in the CEF keys it lists per feed. The actionable field order, the - for an empty field and the cs6 record context layout follow the complete CyberTrace 5.3 record; no complete 4.0 record was found, so 4.0 byte parity is not established. URL record context omits nested feed fields (files, whois, geo, IP).',
    "For URL detections the matched indicator is the feed record mask, an interpretation of the documentation. sourceServiceName and sproc stand for the incoming event source, externalId is the endpoint's own event counter, and hash detections carry dst=-. @timestamp is the Eventum event time because the pattern has no time field, and confidence is always 100. Detection events only: no Feed Service alerts, raw endpoint telemetry or TCP transport.",
    'Episode endpoints and users are drawn in proportion to their ordinary detection volume at that hour, among pairs with at least about 1.4 incidents a day, and continue their ordinary detections during the episode; episode detections take the place of about as many ordinary ones, so the daily volume and hour curve are the same in both modes. An ordinary match that would complete the URL, MD5, same URL sequence for one endpoint and user within one hour of the first URL match is reported for another URL of the same feed, at the same time and for the same endpoint and user, also after an episode; a match more than one hour after the first is not changed. The chain suggests the host went back to the resource it fetched a detected file from; CyberTrace detections alone do not prove that the URL delivered that file.',
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
      json: String.raw`{"@timestamp": "2026-09-02T17:51:33.754684+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "indicator_match", "category": ["threat"], "code": "KL_Malicious_Hash_MD5", "dataset": "kaspersky.cybertrace", "kind": "alert", "original": "CEF:0|Kaspersky|Kaspersky CyberTrace for ArcSight|2.0|2|CyberTrace Detection Event|8| reason=KL_Malicious_Hash_MD5 dst=- src=10.20.8.54 fileHash=0866B4C3F67DE4BF91804B67F6354CC2 request=- sourceServiceName=ExampleVendor sproc=EndpointSecurity suser=y.nikitin msg=CyberTrace detected KL_Malicious_Hash_MD5 externalId=3509109 flexString1=19.11.2025 14:17 flexString2=07.04.2026 18:38 cn2=1 cs3=Trojan-Spy.Win32.Agent.gen cs4=https://cdn-cdn50.example/doc/view fsize=77520 cs5Label=MatchedIndicator cs5=0866B4C3F67DE4BF91804B67F6354CC2 cn3Label=Confidence cn3=100 cs6Label=Context cs6=MD5:0866B4C3F67DE4BF91804B67F6354CC2 SHA1:C7CE1F47139A080304ACFB26168532493C4BCD3B SHA256:002730128AB1FD01D1B2BAC652C45F183DA6BC5CC0FDD7A5F981C665FB022A40 file_size:77520 first_seen:19.11.2025 14:17 last_seen:07.04.2026 18:38 popularity:1 threat:Trojan-Spy.Win32.Agent.gen ", "severity": 8, "type": ["indicator"]}, "file": {"hash": {"md5": "0866b4c3f67de4bf91804b67f6354cc2", "sha1": "c7ce1f47139a080304acfb26168532493c4bcd3b", "sha256": "002730128ab1fd01d1b2bac652c45f183da6bc5cc0fdd7a5f981c665fb022a40"}, "size": 77520}, "kaspersky": {"cybertrace": {"confidence": 100, "external_id": 3509109, "matched_indicator": "0866B4C3F67DE4BF91804B67F6354CC2", "record_context": "MD5:0866B4C3F67DE4BF91804B67F6354CC2 SHA1:C7CE1F47139A080304ACFB26168532493C4BCD3B SHA256:002730128AB1FD01D1B2BAC652C45F183DA6BC5CC0FDD7A5F981C665FB022A40 file_size:77520 first_seen:19.11.2025 14:17 last_seen:07.04.2026 18:38 popularity:1 threat:Trojan-Spy.Win32.Agent.gen "}}, "observer": {"product": "Kaspersky CyberTrace for ArcSight", "vendor": "Kaspersky"}, "related": {"hash": ["0866b4c3f67de4bf91804b67f6354cc2", "c7ce1f47139a080304acfb26168532493c4bcd3b", "002730128ab1fd01d1b2bac652c45f183da6bc5cc0fdd7a5f981c665fb022a40"], "ip": ["10.20.8.54"], "user": ["y.nikitin"]}, "source": {"ip": "10.20.8.54"}, "user": {"name": "y.nikitin"}}`,
    },
  ],
};
