/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkZeek: GeneratorMeta = {
  slug: 'network-zeek',
  displayName: 'Zeek Network Telemetry',
  category: 'network',
  description:
    'Linked Zeek 8.0.0 conn.log, dns.log, http.log and ssl.log records as ECS-compatible JSON, as collected by Filebeat from one Zeek sensor watching a fleet of IPv4 clients, with the compact native JSON line in event.original. Recurring episodes show one client beaconing over TLS to a watched host, re-resolving it and uploading a large body.',
  dataSource: 'Selected Zeek 8.0.0 JSON conn/dns/http/ssl logs',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Compact native Zeek JSON line in event.original',
    'Linked DNS, HTTP, TLS and connection records of 12 clients behind one recursive resolver',
    'Recurring beacon-then-upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client resolves a fresh node-<hex8> name under the watched domain, makes five to seven TLS 1.3 connections to its address with that SNI, resolves the name again and posts a 250,000-2,000,000-byte body to it with status 200, typically over about 10 to 22 minutes. Client and destination address change between episodes. Episodes repeat every anomaly_interval_hours of source time (default 24, minimum 6): the first within the first min(interval, 24 h); each later one in a window of min(interval / 4, 6 h) centred one interval after the previous start, with busier hours more likely, then after a random delay of about 4 minutes. Missed episodes are never caught up. At the default interval episodes start mostly between 10:00 and 18:00 UTC, 21-27 hours apart; at intervals of 8 h or less starts cover the whole clock. Every step and client/destination pair also occurs in background, including sync jobs that repeat the sequence without its first lookup; only the complete ordered sequence is absent from it. Counts of the chain parts are about one per episode higher than with anomaly_mode false.',
  generatorId: 'zeek',
  eventTypes: [
    {
      id: 'conn.log',
      description:
        'Normally completed TCP/UDP flows, SF, byte and packet totals',
      frequency: '50.0% measured share',
      category: 'network',
    },
    {
      id: 'ssl.log',
      description: 'Successful non-resumed TLS 1.3 handshake with visible SNI',
      frequency: '22.4% measured share',
      category: 'network',
    },
    {
      id: 'dns.log',
      description:
        'Recursive A query: NOERROR answer (96.4%) or NXDOMAIN (3.6%)',
      frequency: '18.0% measured share',
      category: 'network',
    },
    {
      id: 'http.log',
      description:
        'HTTP/1.1 GET 200 (71.8%), 304 (7.5%), 404 (2.6%); POST /upload 200 (17.4%), 503 (0.7%)',
      frequency: '9.6% measured share',
      category: 'network, web',
    },
  ],
  realismFeatures: [
    'Selected Zeek 8.0.0 JSON profile (TS_EPOCH timestamps, unset fields omitted, local_nets 10.0.0.0/8) for completely observed IPv4 traffic: each flow has one DNS transaction, HTTP transaction or TLS handshake and a later connection summary with the same UID and 4-tuple. Native times follow the stream, with TCP summaries after the five-second close timer and DNS summaries after the 10 s dns_session_timeout, as microsecond epoch doubles.',
    'Records arrive in collector read order: event.created increases from record to record while @timestamp can go backwards across the interleaved streams. A DNS, TLS or HTTP record is read 1 ms-1.9 s after it completed, a connection summary a median 6 s after its close timer (90% within 22 s, up to about 4 minutes at night).',
    'About 14,500 records a day (up to 10% day to day): about 5,500 around the clock plus 9,000 on an office-hours curve peaking at 12:00-14:00, UTC by default, from about 230 records an hour at night to 1,050 at the peak. Each client has its own activity level (the busiest about six times the quietest) and its own daily rhythm, shifted by up to four and a half hours.',
    'A client keeps up to three resolved names until their TTL runs out and uses them over TLS or HTTP. All clients query one recursive resolver: cached names are answered in about a millisecond with the remaining TTL counting down, others after about 12 ms with the full zone TTL (1,800, 3,600 or 7,200 s per name). Each client uploads its own share of HTTP requests, from a few percent to about half, 18% overall.',
    'Watched node names resolve to the watched addresses in ordinary traffic too, so every client resolves them, beacons to them over TLS within minutes, re-resolves them and uploads to them. About 20 sync jobs a day repeat four to six TLS connections, a re-resolution and a POST /upload within about 25 minutes. Uploads to watched names fail with 503 somewhat more often than other uploads, in both modes.',
    'Negative DNS answers log RA=false with no rtt, answers or TTLs, as the tagged Answer hook implies. HTTP carries Content-Length bodies, fixed ETag representations and bodyless 304s; TLS 1.3 handshakes show history Cs with certificates and next_protocol unset. The TCP packet model, TTLs and traffic rates are synthetic assumptions, not a measured trace.',
    'Four streams only (no files.log, x509.log or weird.log). Native JSON follows the tagged Zeek schemas, writer and baselines, not a live sensor, and number formatting may differ from the Zeek JSON writer byte for byte. Elastic sample-path coverage is 88.24% conn, 91.07% DNS, 89.09% HTTP and 60.00% SSL; Community ID, network.direction and verified agent status are not emitted, and the Filebeat inventory is synthetic.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Background plus recurring episodes; false is background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, minimum 6',
    },
    {
      name: 'sensor_name',
      defaultValue: 'zeek-sensor-01',
      description: 'Sensor and collector host name',
    },
    {
      name: 'sensor_id',
      defaultValue: '8aaedfb4-c8a3-4dd8-853f-5c270abfd47a',
      description: 'Synthetic collector agent ID',
    },
    {
      name: 'sensor_ephemeral_id',
      defaultValue: 'd2c2e56b-4915-4dc4-8ad9-6112f1d26e43',
      description: 'Synthetic collector process ID',
    },
    {
      name: 'sensor_version',
      defaultValue: '8.7.1',
      description: 'Synthetic Filebeat version, not the Zeek version',
    },
    {
      name: 'dns_server_ip',
      defaultValue: '10.20.0.53',
      description: 'Recursive DNS resolver the clients query',
    },
    {
      name: 'suspicious_name',
      defaultValue: 'sync-gw.example.net',
      description: 'Parent domain of the watched node-<hex8> names',
    },
    {
      name: 'suspicious_ips',
      defaultValue: '[198.51.100.77, 198.51.100.140, 203.0.113.201]',
      description: 'Addresses the watched names resolve to, at least two',
    },
    {
      name: 'internal_domain',
      defaultValue: 'corp.example',
      description: 'Internal zone for db. and the NXDOMAIN name',
    },
    {
      name: 'client_ips',
      defaultValue:
        '[10.20.8.12, 10.20.8.25, 10.20.8.44, 10.20.8.61, 10.20.9.31, 10.20.9.52, 10.20.9.77, 10.20.9.103, 10.20.10.14, 10.20.10.38, 10.20.10.90, 10.20.10.121]',
      description: 'Client fleet, 4-32 distinct addresses inside 10.0.0.0/8',
    },
  ],
  sampleOutputs: [
    {
      title: 'Episode TLS handshake (ssl.log)',
      json: String.raw`{"@timestamp": "2026-09-02T10:42:23.506643+00:00", "agent": {"ephemeral_id": "d2c2e56b-4915-4dc4-8ad9-6112f1d26e43", "id": "8aaedfb4-c8a3-4dd8-853f-5c270abfd47a", "name": "zeek-sensor-01", "type": "filebeat", "version": "8.7.1"}, "data_stream": {"dataset": "zeek.ssl", "namespace": "default", "type": "logs"}, "destination": {"address": "198.51.100.77", "ip": "198.51.100.77", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"category": ["network"], "created": "2026-09-02T10:42:25.323658+00:00", "dataset": "zeek.ssl", "id": "CVc1wy81OhorikBAZL", "ingested": "2026-09-02T10:42:26.674532+00:00", "kind": "event", "module": "zeek", "original": "{\"ts\":1788345743.506643,\"uid\":\"CVc1wy81OhorikBAZL\",\"id.orig_h\":\"10.20.10.14\",\"id.orig_p\":56512,\"id.resp_h\":\"198.51.100.77\",\"id.resp_p\":443,\"version\":\"TLSv13\",\"cipher\":\"TLS_AES_128_GCM_SHA256\",\"curve\":\"x25519\",\"server_name\":\"node-c0ac0423.sync-gw.example.net\",\"resumed\":false,\"established\":true,\"ssl_history\":\"Cs\"}", "type": ["connection", "protocol", "info"]}, "host": {"name": "zeek-sensor-01"}, "input": {"type": "filestream"}, "log": {"file": {"path": "/opt/zeek/logs/current/ssl.log"}}, "message": "{\"ts\":1788345743.506643,\"uid\":\"CVc1wy81OhorikBAZL\",\"id.orig_h\":\"10.20.10.14\",\"id.orig_p\":56512,\"id.resp_h\":\"198.51.100.77\",\"id.resp_p\":443,\"version\":\"TLSv13\",\"cipher\":\"TLS_AES_128_GCM_SHA256\",\"curve\":\"x25519\",\"server_name\":\"node-c0ac0423.sync-gw.example.net\",\"resumed\":false,\"established\":true,\"ssl_history\":\"Cs\"}", "network": {"protocol": "tls", "transport": "tcp"}, "observer": {"name": "zeek-sensor-01", "product": "Zeek", "type": "ids", "version": "8.0.0"}, "related": {"ip": ["10.20.10.14", "198.51.100.77"]}, "source": {"address": "10.20.10.14", "ip": "10.20.10.14", "port": 56512}, "tags": ["zeek-ssl"], "tls": {"cipher": "TLS_AES_128_GCM_SHA256", "client": {"server_name": "node-c0ac0423.sync-gw.example.net"}, "curve": "x25519", "established": true, "resumed": false, "version": "1.3", "version_protocol": "tls"}, "zeek": {"session_id": "CVc1wy81OhorikBAZL", "ssl": {"cipher": "TLS_AES_128_GCM_SHA256", "curve": "x25519", "established": true, "resumed": false, "server_name": "node-c0ac0423.sync-gw.example.net", "ssl_history": "Cs", "version": "TLSv13"}}}`,
    },
  ],
};
