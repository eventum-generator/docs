import type { GeneratorMeta } from '@/lib/hub-types';

export const proxyCiscoSecureWebAppliance: GeneratorMeta = {
  slug: 'proxy-cisco-secure-web-appliance',
  displayName: 'Cisco Secure Web Appliance Access Log',
  category: 'web-access',
  description:
    'Cisco Secure Web Appliance (AsyncOS 15.2) standard Squid-style access log entries from one appliance serving 40 office clients: page browsing, cache hits, software downloads from mirrors, and URL-category and web-reputation blocks, as the native line in event.original with an inferred ECS mapping. Recurring episodes show a client denied a package on a blocked file-sharing site that then downloads the same path from an allowed mirror.',
  dataSource:
    'Cisco Secure Web Appliance AsyncOS 15.2 standard (Squid-style) access log',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 10,
  templateCount: 1,
  highlights: [
    'Native AsyncOS 15.2 access line in event.original',
    'Background traffic following per-client working hours',
    'Recurring blocked-then-mirror package download chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One episode per 24 hours of source time by default (the first due one interval after the first event, each start delayed by a random exponential time with a 20-minute mean, the next due one interval after the actual start, no catch-up): one client is denied a software package on a blocked file-sharing site two or more times (TCP_DENIED/403 BLOCK_WEBCAT, spaced like ordinary retries), then downloads the same URL path from an allowed mirror a median of about 3 minutes (at most 20) after the last denial, with the AMP file name and SHA-256. Client and package differ from the previous episode; every element also occurs in background, and only two or more denials of one path followed by its download from another domain within an hour are episode-only.',
  generatorId: 'swa',
  eventTypes: [
    {
      id: 'TCP_MISS/200 DEFAULT_CASE',
      description: 'Page, asset or POST fetched from the origin server',
      frequency: '58.3% measured share',
      category: 'web',
    },
    {
      id: 'TCP_HIT/200',
      description: 'Served from disk cache',
      frequency: '9.0% measured share',
      category: 'web',
    },
    {
      id: 'TCP_IMS_HIT/304',
      description: 'If-Modified-Since answered from cache',
      frequency: '9.0% measured share',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 BLOCK_WEBCAT',
      description:
        'Blocked URL category (games, gambling, streaming, filter avoidance, file sharing)',
      frequency: '6.4% measured share',
      category: 'web',
    },
    {
      id: 'TCP_MEM_HIT/200',
      description: 'Served from memory cache',
      frequency: '6.0% measured share',
      category: 'web',
    },
    {
      id: 'TCP_REFRESH_HIT/200',
      description: 'Revalidated cached object',
      frequency: '5.0% measured share',
      category: 'web',
    },
    {
      id: 'TCP_CLIENT_REFRESH_MISS/200',
      description: 'Client sent Pragma: no-cache',
      frequency: '2.7% measured share',
      category: 'web',
    },
    {
      id: 'software download',
      description:
        'Package fetched from an allowed mirror (TCP_MISS/200, about 5% TCP_CLIENT_REFRESH_MISS/200) with AMP file name and SHA-256',
      frequency: '2.3% measured share',
      category: 'web, file',
    },
    {
      id: 'NONE/503, NONE/504',
      description: 'Upstream DNS failure or gateway timeout',
      frequency: '0.9% measured share',
      category: 'web',
    },
    {
      id: 'TCP_DENIED/403 BLOCK_WBRS',
      description: 'Low web-reputation score',
      frequency: '0.4% measured share',
      category: 'web',
    },
  ],
  realismFeatures: [
    'One appliance serves 40 office clients browsing 10 allowed sites; background volume follows the working hours of each client. Shares were measured on an 80-hour default capture of 96,992 entries; traffic shares and timings are synthetic, not measured appliance data.',
    'The native line follows the AsyncOS 15.2 standard access log with the six-component ACL decision tag and scanning-verdict positions 1-39 (URL category through AMP SHA-256). Archive-scan, Web Tap and YouTube positions 40-44 are omitted, and the exact verdict length may differ by release and enabled features.',
    'URL categories are written quoted as the guide states for AsyncOS 11.8 and later, although its example lines show them unquoted. No complete raw capture of a clean AsyncOS 15.2 transaction was available: Webroot, McAfee, Sophos, DLP and AVC positions are hyphens or "Unknown" as in the guide examples, and WBRS scores, bandwidth and AMP verdicts are synthetic within the documented value ranges.',
    'Every episode element also occurs in ordinary traffic of both modes: repeated denials of one package by a client within minutes, a single denial followed by the same package from a mirror, denials followed by a different package, and plain mirror downloads. The episode client is picked uniformly and may start at any hour, so a night-time episode by a rarely active client stands out more.',
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
      description: 'Source time between episodes, 1 to 8,760',
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
      json: String.raw`{"@timestamp": "2026-09-01T21:31:17.314+00:00", "cisco": {"swa": {"acl_decision_tag": "DEFAULT_CASE_11-Engineering-Corp_Identity-DefaultGroup-NONE-NONE-DefaultRouting", "elapsed_ms": 1568, "hierarchy": "DIRECT/updates.example.org", "mime_type": "application/x-msi", "policy_group": "Engineering", "result_code": "TCP_CLIENT_REFRESH_MISS", "scan_verdict": "\u003c\"IW_swup\",4.1,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,\"IW_swup\",-,\"-\",\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",23857.41,0,-,\"-\",\"-\",0,\"-\",-,0,\"pdfreader-2024.2.msi\",\"6460feee0a2441442ef11b7ed4a8184a95371bde3b7dd2d6f18571a217183c5a\"\u003e", "url_category": "IW_swup", "wbrs_score": "4.1"}}, "destination": {"domain": "updates.example.org"}, "ecs": {"version": "8.17.0"}, "event": {"action": "tcp_client_refresh_miss", "category": ["web", "network"], "dataset": "cisco_swa.access", "duration": 1568000000, "kind": "event", "original": "1788298277.314 1568 10.20.40.46 TCP_CLIENT_REFRESH_MISS/200 4676052 GET http://updates.example.org/pub/pdfreader/pdfreader-2024.2.msi - DIRECT/updates.example.org application/x-msi DEFAULT_CASE_11-Engineering-Corp_Identity-DefaultGroup-NONE-NONE-DefaultRouting \u003c\"IW_swup\",4.1,-,\"-\",-,-,-,-,\"-\",-,-,-,\"-\",-,-,\"-\",\"-\",-,-,\"IW_swup\",-,\"-\",\"-\",\"-\",\"Unknown\",\"Unknown\",\"-\",\"-\",23857.41,0,-,\"-\",\"-\",0,\"-\",-,0,\"pdfreader-2024.2.msi\",\"6460feee0a2441442ef11b7ed4a8184a95371bde3b7dd2d6f18571a217183c5a\"\u003e -", "outcome": "success", "type": ["allowed", "connection"]}, "file": {"hash": {"sha256": "6460feee0a2441442ef11b7ed4a8184a95371bde3b7dd2d6f18571a217183c5a"}, "name": "pdfreader-2024.2.msi"}, "host": {"name": "swa-01.example.test"}, "http": {"request": {"method": "GET"}, "response": {"bytes": 4676052, "mime_type": "application/x-msi", "status_code": 200}}, "network": {"protocol": "http"}, "observer": {"hostname": "swa-01.example.test", "product": "Secure Web Appliance", "type": "proxy", "vendor": "Cisco"}, "related": {"hash": ["6460feee0a2441442ef11b7ed4a8184a95371bde3b7dd2d6f18571a217183c5a"], "hosts": ["updates.example.org"], "ip": ["10.20.40.46"]}, "source": {"ip": "10.20.40.46"}, "url": {"domain": "updates.example.org", "full": "http://updates.example.org/pub/pdfreader/pdfreader-2024.2.msi", "original": "http://updates.example.org/pub/pdfreader/pdfreader-2024.2.msi", "path": "/pub/pdfreader/pdfreader-2024.2.msi", "scheme": "http"}}`,
    },
  ],
};
