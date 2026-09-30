import type { GeneratorMeta } from '@/lib/hub-types';

export const networkUnbound: GeneratorMeta = {
  slug: 'network-unbound',
  displayName: 'Unbound DNS Query and Reply Logs',
  category: 'network',
  description:
    "Query and reply log of one Unbound 1.26.1 recursive resolver serving an office network: native query: and reply: lines from Unbound's own logfile in event.original, with ECS fields derived from each line. For DNS analytics and for testing detections of DNS tunnelling through TXT lookups. Recurring episodes show one client looking up a telemetry zone and then sending eight TXT lookups of new hex labels under it.",
  dataSource:
    'Unbound 1.26.1 own logfile with log-queries, log-replies and log-tag-queryreply enabled, ISO timestamps, UTC host',
  eventFormat: 'ECS JSON',
  originalFormat: 'Plain text',
  eventCount: 5,
  templateCount: 1,
  generatorId: 'network-unbound',
  highlights: [
    'Native Unbound 1.26.1 query: and reply: logfile lines',
    'About 36,000 lines a day from 70 clients on a UTC daily curve',
    'Recurring zone A lookup followed by eight hex-label TXT lookups',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client looks up the A record of a telemetry zone apex, then sends TXT queries for 32-hex labels under the same zone, each with its reply: a first burst like the first burst of a background run (usually one to three lookups), then a second burst that starts 1-6 minutes after the A lookup and lasts until the eighth TXT lookup, about 1.5 to 7 minutes after the A lookup. Afterwards the run goes on like any background run. An episode is due every 24 hours of event time by default (anomaly_interval_hours, minimum 2). The first starts within the first min(interval, 24 h), at a time drawn from the hourly line rate; each later one starts in a window of min(interval / 4, 6 h) centred on the previous actual start plus the interval, weighted towards busy hours, so at the default interval consecutive episodes are 21-27 h apart. Missed intervals are never caught up; at intervals of 8 hours or less start hours cover the whole clock. The client is drawn by background activity among clients that already used a telemetry zone, the zone is one it already used, and both differ from those of the previous episode.',
  eventTypes: [
    {
      id: 'A',
      description: 'Query and reply for corporate names and host-NNN',
      frequency: '71.0% of queries measured',
      category: 'network',
    },
    {
      id: 'AAAA',
      description: 'Query and reply for an AAAA record',
      frequency: '8.6% of queries measured',
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
      frequency: '1.4% of queries measured',
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
    'About 36,000 lines a day (queries and replies together) on the UTC clock: about 520 an hour at night (21:00-07:00), about 1,430 in the evening (17:00-21:00) and about 2,530 in office hours (07:00-17:00); each band varies by up to 3% a day.',
    'Every query has exactly one reply on the same worker thread, following it by the resolution time plus 40-900 microseconds (8 ms median, 43 ms at the 90th percentile), usually on the next line. Unbound logs no query ID, so a reply is linked to its query by client, question and worker thread. 92.2% of replies are NOERROR, 7.8% NXDOMAIN, and 34.7% come from cache.',
    'Each of the 70 default clients starts lookup sessions in proportion to its own fixed, log-normally skewed activity weight (0.4-3 times the typical client), so a few clients are much busier and every client is active every day. 30% of ordinary lookups are followed within seconds by a second lookup; lookups a real client sends within milliseconds are seconds apart here, 5 s in median within a burst and more at night.',
    'Three telemetry zones stand for vendor services answering TXT lookups of hashed 32-hex labels. A run is 1-10 bursts (40% single) of a few lookups, separated by pauses with a median of 40 minutes; 3% of bursts are scans of a batch of hashes (median 8, up to 40), never the first burst after an A lookup. 15% of labels repeat a recent one, and a zone answers each label with TXT data (60%) or NXDOMAIN and keeps that answer.',
    'A TTL cache of at most 256 entries (60 s for A/AAAA and zone apex, 180 s for corporate MX/TXT, 10 s for telemetry TXT data, 45-60 s for NXDOMAIN) drives the native from_cache flag: a cached reply carries 0.000000 and 1, an uncached one a log-normal resolution time (median 12 ms for corporate names, 45 ms for the telemetry zones). Response sizes are computed from the DNS message layout for the synthetic zone data; they are plausible values, not captured packet sizes.',
    'Background carries every chain part in both modes: zone apex lookups, hex-label TXT runs with NXDOMAIN and data answers, lookups seconds apart, scans of 8 or more distinct labels, runs that start with the zone A lookup, and A lookups followed by several TXT lookups within 10 minutes; the client and zone of an episode also appear together in background TXT lookups, and usually in background A lookups. Ordinary traffic never holds eight hex TXT lookups by one client under one zone within 10 minutes of its A lookup of that zone; with anomaly_mode true, counts of zone A lookups followed by many hex TXT lookups within 10 minutes are about one per episode higher. The logs carry no answer data, so a match shows the pattern, not that data left the network.',
    "The line grammar follows the Unbound 1.26.1 source formatter for the stated profile; no first-party runtime capture was found, so byte-level fidelity is unverified. @timestamp keeps microseconds while event.original has the logfile's millisecond precision; replies carry no destination address or transport; host name and dns.question.registered_domain (the last two labels) are collector enrichment. Zone data, TTLs, resolution times and client activity rates are synthetic, the telemetry zones use reserved example.* domains, and there is no forwarding, DNSSEC failure, SERVFAIL or rate limiting.",
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
      description: 'Event-time hours between episodes; 2 to 8,760',
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
        'sync-updates.example.net, telemetry.example.org, cdn-check.example.com',
      description:
        'Telemetry zones used by background TXT runs and by episodes; at least two, on distinct registered domains',
    },
  ],
  sampleOutputs: [
    {
      title: 'First TXT reply of the first episode',
      json: String.raw`{"@timestamp": "2026-09-01T12:16:57.811304+00:00", "dns": {"question": {"class": "IN", "name": "16ad8c7e4fe9e9a6d4cb8a64afc0d5e9.telemetry.example.org.", "registered_domain": "example.org", "type": "TXT"}, "response_code": "NXDOMAIN", "type": "answer"}, "ecs": {"version": "8.17.0"}, "event": {"action": "dns-reply", "category": ["network"], "kind": "event", "original": "2026-09-01T12:16:57.811+00:00 unbound[2137:0] reply: 10.20.30.33 16ad8c7e4fe9e9a6d4cb8a64afc0d5e9.telemetry.example.org. TXT IN NXDOMAIN 0.034614 0 146", "type": ["end"]}, "host": {"name": "dns01.corp.example"}, "process": {"name": "unbound", "pid": 2137}, "related": {"ip": ["10.20.30.33"]}, "source": {"ip": "10.20.30.33"}, "unbound": {"reply": {"from_cache": 0, "response_size": 146, "time_to_resolve": 0.034614}, "worker_id": 0}}`,
    },
  ],
};
