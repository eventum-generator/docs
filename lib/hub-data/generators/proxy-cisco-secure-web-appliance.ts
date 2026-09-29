import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyCiscoSecureWebAppliance: GeneratorMeta = {
  slug: 'proxy-cisco-secure-web-appliance',
  displayName: 'Cisco Secure Web Appliance Access Log',
  category: 'web-access',
  description:
    'Cisco Secure Web Appliance (AsyncOS 15.2) standard Squid-style access log entries from one appliance serving 40 office clients: page browsing, cache hits, software downloads from mirrors, and URL-category and web-reputation blocks, as the native line in event.original with an inferred ECS mapping. About 29,200 entries a day follow a working-day curve in UTC. Recurring episodes show a client denied a package on a blocked file-sharing site that then downloads the same path from an allowed mirror.',
  dataSource:
    'Cisco Secure Web Appliance AsyncOS 15.2 standard (Squid-style) access log',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 10,
  templateCount: 1,
  highlights: [
    'Native AsyncOS 15.2 access line in event.original',
    'About 29,200 entries a day, clients on their own working hours',
    'Recurring blocked-then-mirror package download chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One client is denied a software package on a blocked file-sharing site two or more times (TCP_DENIED/403 BLOCK_WEBCAT, spaced like ordinary retries, median about 25 s, all within 15 minutes), then downloads the same URL path from an allowed mirror with the AMP file name and SHA-256, a median of about 3 minutes after the last denial and at most 25 minutes after the first. The first episode starts within the first anomaly_interval_hours (at most 24 h) of generation, at a time of day drawn from the hour curve. Each later one is due anomaly_interval_hours (default 24, minimum 1) after the actual start of the previous one and starts within a window centred on that due time, a quarter of the interval wide (at most 6 hours), favouring busier hours: 21 to 27 hours apart at the default, 5.25 to 6.75 hours at 6 hours. The episode client is one of the eight most active clients and differs from the previous episode's; the package differs from the previous one; the client's ordinary browsing continues around the episode. Every element also occurs in ordinary traffic; only an episode completes two or more denials of one path by one client followed by its download from another domain within 30 minutes.",
  generatorId: 'swa',
  eventTypes: [
    {
      id: 'TCP_MISS/200 DEFAULT_CASE',
      description: 'Page, asset or POST fetched from the origin server',
      frequency: '57.7% of records',
      category: 'web',
    },
    {
      id: 'TCP_HIT/200',
      description: 'Served from disk cache',
      frequency: '9.1% of records',
      category: 'web',
    },
    {
      id: 'TCP_IMS_HIT/304',
      description: 'If-Modified-Since answered from cache',
      frequency: '9.0% of records',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 BLOCK_WEBCAT',
      description:
        'Blocked URL category (games, gambling, streaming, filter avoidance, file sharing)',
      frequency: '6.7% of records',
      category: 'web',
    },
    {
      id: 'TCP_MEM_HIT/200',
      description: 'Served from memory cache',
      frequency: '5.9% of records',
      category: 'web',
    },
    {
      id: 'TCP_REFRESH_HIT/200',
      description: 'Revalidated cached object',
      frequency: '5.0% of records',
      category: 'web',
    },
    {
      id: 'TCP_CLIENT_REFRESH_MISS/200',
      description: 'Client sent Pragma: no-cache',
      frequency: '2.7% of records',
      category: 'web',
    },
    {
      id: 'software download',
      description:
        'Package fetched from an allowed mirror (TCP_MISS/200, about 5% TCP_CLIENT_REFRESH_MISS/200) with AMP file name and SHA-256',
      frequency: '2.5% of records',
      category: 'web, file',
    },
    {
      id: 'NONE/503, NONE/504',
      description: 'Upstream DNS failure or gateway timeout',
      frequency: '0.9% of records',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 BLOCK_WBRS',
      description: 'Low web-reputation score',
      frequency: '0.4% of records',
      category: 'web',
    },
  ],
  realismFeatures: [
    'About 29,200 entries a day, varying by about 3% from day to day: 350 an hour at 22:00-05:00 UTC, 750 at 05:00-06:00 and 19:00-22:00, 1,250 at 06:00-08:00 and 17:00-19:00, 1,750 at 08:00-09:00 and 15:00-17:00, and 2,250 at 09:00-15:00. Every day has the same working-day curve, with no weekend dip.',
    'One appliance serves 40 office clients browsing 10 allowed sites. Each client has its own working hours, starting between 04:00 and 11:00 UTC and lasting 7 to 10.5 hours, shifted by a random amount each day (standard deviation about 35 minutes), with about one day in ten off; outside them it stays at about an eighth of its daytime activity, and at 45% in the four hours after. Client activity weights are skewed but bounded (the busiest client carries about 8% of the entries), and the same clients are the busy ones on every run for a given subnet.',
    'Requests of one page view are spread over consecutive entries: embedded objects follow their page after a median of 1.6 s in office hours (90th percentile 5.5 s) and 7.5 s at night (90th percentile 26 s), where a real browser fetches them within about a second. Traffic shares and timings are synthetic, not measured appliance data.',
    'Every episode element also occurs in ordinary traffic of both modes: all clients, sharing sites, mirrors and packages, and every episode client with every package; repeated denials of one package by a client within minutes, a single denial followed by the same package from a mirror, denials followed by a different package, and plain mirror downloads. In ordinary traffic a client denied a package twice or more in the preceding 30 minutes does not download that same package and fetches a different package from the mirror instead. With anomaly_mode true, repeated denials of one package by one client are about one per episode more frequent.',
    'Episode starts follow the overall hour curve, which keeps some weight in the evening, and each later start is only pulled towards busier hours within its own window, so an evening start can repeat for several days.',
    "The native line follows the AsyncOS 15.2 standard access log with the six-component ACL decision tag (the example line's extra trailing -NONE is not reproduced) and scanning-verdict positions 1-39 (URL category through AMP SHA-256). Archive-scan, Web Tap and YouTube positions 40-44 are omitted, and the exact verdict length may differ by release and enabled features.",
    'URL categories are written quoted as the guide states for AsyncOS 11.8 and later, although its example lines show them unquoted. No complete raw AsyncOS 15.2 line of a clean transaction was available as a reference: Webroot, McAfee, Sophos, DLP and AVC positions are hyphens or "Unknown" as in the guide examples, and WBRS scores, bandwidth and AMP verdicts are synthetic within the documented value ranges.',
    'Only plain HTTP GET/POST through an explicit proxy is modeled: no HTTPS CONNECT tunnels, decryption decisions, authenticated usernames, W3C logs or syslog wrapping. No Elastic integration exists for this source, so the ECS mapping is inferred.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add periodic anomaly episodes to background; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Source time between episodes, counted from the actual start of the previous one, 1 to 8,760',
    },
    {
      name: 'host_name',
      defaultValue: 'swa-01.example.test',
      description: 'Appliance hostname',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.40.',
      description: 'Client subnet prefix',
    },
    {
      name: 'client_first',
      defaultValue: '11',
      description: 'First client host number',
    },
    {
      name: 'client_count',
      defaultValue: '40',
      description: 'Number of clients, at least 4',
    },
    {
      name: 'access_policies',
      defaultValue: '[Staff, Engineering]',
      description: 'Two Access Policy group names in the ACL decision tag',
    },
    {
      name: 'identity_policy',
      defaultValue: 'Corp_Identity',
      description: 'Identification Profile name in the ACL decision tag',
    },
    {
      name: 'sites',
      defaultValue: '10 allowed sites',
      description: 'Browsed domains with URL category abbreviation and pages',
    },
    {
      name: 'blocked_sites',
      defaultValue: '4 sites',
      description: 'Domains blocked by URL category',
    },
    {
      name: 'sharing_sites',
      defaultValue: '3 sites',
      description: 'Blocked file-sharing domains used for package downloads',
    },
    {
      name: 'mirrors',
      defaultValue: '3 sites',
      description: 'Allowed download mirrors',
    },
    {
      name: 'low_reputation_domains',
      defaultValue: '3 domains',
      description: 'Domains blocked by web reputation',
    },
    {
      name: 'packages',
      defaultValue: '10 paths',
      description: 'Software package paths hosted on sharing sites and mirrors',
    },
    {
      name: 'assets',
      defaultValue: '8 paths',
      description: 'Embedded page objects',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final mirror download of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T12:31:57.557+00:00", "cisco": {"swa": {"acl_decision_tag": "DEFAULT_CASE_11-Staff-Corp_Identity-DefaultGroup-NONE-NONE-DefaultRouting", "elapsed_ms": 1381, "hierarchy": "DIRECT/updates.example.org", "mime_type": "application/zip", "policy_group": "Staff", "result_code": "TCP_MISS", "scan_verdict": "\u003c\"IW_swup\",4.7,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,\"IW_swup\",-,\"-\",\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",54062.07,0,-,\"-\",\"-\",0,\"-\",-,0,\"netscan-3.5.zip\",\"5cf61ec035254ada6e53e0ec3b2c5c418646181bff880556d85f1dcb81ee0dfb\"\u003e", "url_category": "IW_swup", "wbrs_score": "4.7"}}, "destination": {"domain": "updates.example.org"}, "ecs": {"version": "8.17.0"}, "event": {"action": "tcp_miss", "category": ["web", "network"], "dataset": "cisco_swa.access", "duration": 1381000000, "kind": "event", "original": "1788265917.557 1381 10.20.40.17 TCP_MISS/200 9332465 GET http://updates.example.org/pub/netscan/netscan-3.5.zip - DIRECT/updates.example.org application/zip DEFAULT_CASE_11-Staff-Corp_Identity-DefaultGroup-NONE-NONE-DefaultRouting \u003c\"IW_swup\",4.7,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,\"IW_swup\",-,\"-\",\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",54062.07,0,-,\"-\",\"-\",0,\"-\",-,0,\"netscan-3.5.zip\",\"5cf61ec035254ada6e53e0ec3b2c5c418646181bff880556d85f1dcb81ee0dfb\"\u003e -", "outcome": "success", "type": ["allowed", "connection"]}, "file": {"hash": {"sha256": "5cf61ec035254ada6e53e0ec3b2c5c418646181bff880556d85f1dcb81ee0dfb"}, "name": "netscan-3.5.zip"}, "host": {"name": "swa-01.example.test"}, "http": {"request": {"method": "GET"}, "response": {"bytes": 9332465, "mime_type": "application/zip", "status_code": 200}}, "network": {"protocol": "http"}, "observer": {"hostname": "swa-01.example.test", "product": "Secure Web Appliance", "type": "proxy", "vendor": "Cisco"}, "related": {"hash": ["5cf61ec035254ada6e53e0ec3b2c5c418646181bff880556d85f1dcb81ee0dfb"], "hosts": ["updates.example.org"], "ip": ["10.20.40.17"]}, "source": {"ip": "10.20.40.17"}, "url": {"domain": "updates.example.org", "full": "http://updates.example.org/pub/netscan/netscan-3.5.zip", "original": "http://updates.example.org/pub/netscan/netscan-3.5.zip", "path": "/pub/netscan/netscan-3.5.zip", "scheme": "http"}}`,
    },
  ],
};
