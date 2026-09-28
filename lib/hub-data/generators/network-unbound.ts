import type { GeneratorMeta } from '@/lib/hub-types';

export const networkUnbound: GeneratorMeta = {
  slug: 'network-unbound',
  displayName: 'Unbound DNS Query and Reply Logs',
  category: 'network',
  description:
    "Query and reply log of one Unbound 1.26.1 recursive resolver serving an office network: native query: and reply: lines from Unbound's own logfile in event.original, with ECS fields derived from each line. For DNS analytics and for testing detections of DNS tunnelling through TXT lookups. Recurring episodes show one client looking up a telemetry zone and then sending eight TXT lookups of new hex labels under it.",
  dataSource:
    'Unbound 1.26.1 own logfile with log-queries, log-replies and log-tag-queryreply enabled, ISO timestamps, UTC host',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 5,
  templateCount: 1,
  generatorId: 'unbound',
  highlights: [
    'Native Unbound 1.26.1 query: and reply: logfile lines',
    'Independent per-client lookups with an office-hours curve and a TTL cache',
    'Recurring zone A lookup followed by eight hex-label TXT lookups',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One client looks up the A record of a telemetry zone apex, then sends eight TXT queries for new 32-hex labels under the same zone, each with its reply, as one burst at the background burst pace; gaps are scaled down only if the burst would exceed 560 seconds, so the chain fits the 10-minute detection window (measured 17-139 s from the A lookup to the eighth TXT). Episodes are due every 24 hours of source time by default (minimum 2). The first starts within the first min(interval, 24 h), at a time drawn from the hour-of-day curve; each later one starts at a random time in a window of min(interval / 4, 6 h) centred on the previous actual start plus the interval, weighted by the squared hour curve plus a small floor, so episodes stay in busy hours; at intervals of 8 hours or less, start hours cover the whole clock. Missed intervals are never caught up. The client is drawn with the background activity weights among clients that already sent telemetry-zone lookups, the zone is one that client already used, and both differ from the previous episode. Every part of the chain occurs on its own in background; only a background TXT lookup that would be the eighth under a zone within 600 seconds of the same client's A lookup of that zone is not logged.",
  eventTypes: [
    {
      id: 'A',
      description: 'Query and reply for corporate names and host-NNN',
      frequency: '71.3% of queries measured',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'Query and reply for an AAAA record',
      frequency: '8.3% of queries measured',
      category: 'network',
    },
    {
      id: 'MX / corporate TXT',
      description:
        'Query and reply for MX or corporate TXT (DMARC, DKIM, ACME)',
      frequency: '7.1% of queries measured',
      category: 'network',
    },
    {
      id: 'Telemetry zone A',
      description: 'Query and reply for the A record of a telemetry zone apex',
      frequency: '1.3% of queries measured',
      category: 'network',
    },
    {
      id: 'Telemetry hex TXT',
      description:
        'Query and reply for TXT of a 32-hex label under a telemetry zone',
      frequency: '12.0% of queries measured',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Every query has exactly one reply on the same worker thread, following it by the resolution time plus 40-900 microseconds. Unbound logs no query ID, so a reply is linked to its query by client, question and worker thread. In the default capture 92.5% of replies are NOERROR, 7.5% NXDOMAIN, and 34.6% come from cache.',
    'Each client is an independent Poisson source with a fixed, log-normally skewed activity weight, and the rate follows an office-hours curve in UTC: 1.6x the daily mean from 07:00 to 17:00, 0.9x until 21:00, 0.33x overnight. 30% of ordinary lookups are followed within seconds by a second lookup.',
    'Three telemetry zones stand for vendor services answering TXT lookups of hashed 32-hex labels. A run is 1-10 bursts of a few lookups seconds apart, separated by pauses with a median of 40 minutes; 3% of bursts are scans of a batch of hashes (median 8, up to 40), never the first burst after an A lookup; 15% of labels repeat, and a zone answers each label with TXT data (60%) or NXDOMAIN and keeps that answer.',
    'A bounded TTL cache of 256 entries drives the native from_cache flag: a cached reply carries 0.000000 and 1, an uncached one a log-normal resolution time (median 12 ms for corporate names, 45 ms for the telemetry zones). Response sizes are computed from the DNS message layout for the synthetic zone data; they are plausible values, not captured packet sizes.',
    'Background carries every chain part: zone apex lookups, hex-label TXT runs with NXDOMAIN and data answers, scans of 8 or more distinct labels, and runs that start with the zone A lookup. Five 54-hour background-only captures hold 0 complete chains and as many as 17-20 hex TXT lookups by one client under one zone within some 10-minute span. The logs carry no answer data, so a match shows the pattern, not that data left the network.',
    "The line grammar follows the Unbound 1.26.1 source formatter for the stated profile; no first-party runtime capture was found, so byte-level fidelity is unverified. @timestamp keeps microseconds while event.original has the logfile's millisecond precision; replies carry no destination address; host name and dns.question.registered_domain (the last two labels) are collector enrichment. Zone data, TTLs and resolution times are synthetic, and there is no forwarding, DNSSEC failure, SERVFAIL or rate limiting.",
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Emit recurring tunnelling episodes; false gives background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time hours between episodes; minimum 2',
    },
    {
      name: 'sessions_per_second',
      defaultValue: '0.15',
      description: 'Daily mean of client lookup sessions per second',
    },
    {
      name: 'host_name',
      defaultValue: 'dns01.corp.example',
      description: 'Resolver host name in ECS enrichment',
    },
    {
      name: 'process_id',
      defaultValue: '2137',
      description: 'Unbound process ID in the log lines',
    },
    {
      name: 'worker_count',
      defaultValue: '4',
      description: 'Resolver threads (num-threads); at least 1',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.30.',
      description: 'Client address prefix',
    },
    {
      name: 'client_first',
      defaultValue: '11',
      description: 'Last octet of the first client',
    },
    {
      name: 'client_count',
      defaultValue: '70',
      description: 'Number of clients',
    },
    {
      name: 'tunnel_domains',
      defaultValue:
        '[sync-updates.example.net, telemetry.example.org, cdn-check.example.com]',
      description:
        'Telemetry zones used by background TXT runs and by episodes; at least two, on distinct registered domains',
    },
  ],
  sampleOutputs: [
    {
      title: 'First TXT reply of an episode',
      json: String.raw`{"@timestamp": "2026-09-26T22:22:28.983317+00:00", "dns": {"question": {"class": "IN", "name": "067c0defc48278b4acedd7992889e798.cdn-check.example.com.", "registered_domain": "example.com", "type": "TXT"}, "response_code": "NOERROR", "type": "answer"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-reply", "category": ["network"], "kind": "event", "original": "2026-09-26T22:22:28.983+00:00 unbound[2137:1] reply: 10.20.30.69 067c0defc48278b4acedd7992889e798.cdn-check.example.com. TXT IN NOERROR 0.018928 0 118", "type": ["end"]}, "host": {"name": "dns01.corp.example"}, "process": {"name": "unbound", "pid": 2137}, "related": {"ip": ["10.20.30.69"]}, "source": {"ip": "10.20.30.69"}, "unbound": {"reply": {"from_cache": 0, "response_size": 118, "time_to_resolve": 0.018928}, "worker_id": 1}}`,
    },
  ],
};
