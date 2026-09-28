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
    'Linked DNS, HTTP, TLS and connection records of 12 clients',
    'Recurring beacon-then-upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (the first within the first min(interval, 24 h); each later one in a window of min(interval / 4, 6 h) centred one interval after the actual previous start, weighted toward busier hours, then after an exponential delay with a 4-minute mean; missed episodes are never caught up), one client resolves a fresh node-<hex8> name under the watched domain, makes five to seven TLS 1.3 connections to its address with that SNI, resolves the name again and posts a 250,000-2,000,000-byte body to it with status 200, within 25 minutes (measured 577-951 s by default). Client and destination change between episodes; every step and client/destination pair also occurs in background, and only the complete ordered sequence is absent from it.',
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
      frequency: '22.5% measured share',
      category: 'network',
    },
    {
      id: 'dns.log',
      description: 'Recursive A query: NOERROR answer or NXDOMAIN',
      frequency: '17.5% measured share',
      category: 'network',
    },
    {
      id: 'http.log',
      description: 'HTTP/1.1 GET 200, 304 or 404; POST /upload 200 or 503',
      frequency: '10.0% measured share',
      category: 'network, web',
    },
  ],
  realismFeatures: [
    'Selected Zeek 8.0.0 JSON profile (TS_EPOCH timestamps, unset fields omitted, local_nets 10.0.0.0/8) for completely observed IPv4 traffic: each flow has one DNS transaction, HTTP transaction or TLS handshake and a later connection summary with the same UID and 4-tuple. Native times follow the stream, with TCP summaries after the five-second close timer and DNS summaries after the 10 s dns_session_timeout, as microsecond epoch doubles.',
    'Twelve clients are independent Poisson processes, each with its own weight and an office-hours UTC curve shifted by up to three hours. A client keeps up to three resolved names for their TTL and uses them over TLS or HTTP; fresh node names under the watched domain resolve to the watched addresses, so every client beacons to, re-resolves and posts to watched hosts in ordinary traffic.',
    'A collector poll every two seconds reads the earliest completed record, so @timestamp can go backwards across streams while event.created increases; run with --keep-order true to keep collector order. The 96-hour default capture holds 58,243 records.',
    'Negative DNS answers log RA=false with no rtt, answers or TTLs, as the tagged Answer hook implies. HTTP carries Content-Length bodies, fixed ETag representations and bodyless 304s; TLS 1.3 handshakes show history Cs with certificates and next_protocol unset. The TCP packet model, TTLs and traffic rates are synthetic assumptions.',
    'A background POST that would complete the chain within 1,800 s of the first DNS keeps its time and body but gets a 503, so about two POSTs per 96 hours to watched names fail, identically in both modes. Completed prefixes followed by a POST occur inside and outside that window with no step at the edge. Episodes sit in busier hours than the average background flow.',
    'Four streams only (no files.log, x509.log or weird.log), and no live Zeek, version-matched four-stream capture or RapidJSON number parity was verified. Elastic sample-path coverage is 88.24% conn, 91.07% DNS, 89.09% HTTP and 60.00% SSL; Community ID, network.direction and verified agent status are not emitted, and the Filebeat inventory is synthetic.',
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
      json: String.raw`{"@timestamp": "2026-09-22T14:30:51.391148+00:00", "agent": {"ephemeral_id": "d2c2e56b-4915-4dc4-8ad9-6112f1d26e43", "id": "8aaedfb4-c8a3-4dd8-853f-5c270abfd47a", "name": "zeek-sensor-01", "type": "filebeat", "version": "8.7.1"}, "data_stream": {"dataset": "zeek.ssl", "namespace": "default", "type": "logs"}, "destination": {"address": "203.0.113.201", "ip": "203.0.113.201", "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"category": ["network"], "created": "2026-09-22T14:30:52.943047+00:00", "dataset": "zeek.ssl", "id": "CbuZvt44kjC5iDd5YT", "ingested": "2026-09-22T14:30:54.544987+00:00", "kind": "event", "module": "zeek", "original": "{\"ts\":1790087451.391148,\"uid\":\"CbuZvt44kjC5iDd5YT\",\"id.orig_h\":\"10.20.9.31\",\"id.orig_p\":38573,\"id.resp_h\":\"203.0.113.201\",\"id.resp_p\":443,\"version\":\"TLSv13\",\"cipher\":\"TLS_AES_128_GCM_SHA256\",\"curve\":\"x25519\",\"server_name\":\"node-9ba06b0b.sync-gw.example.net\",\"resumed\":false,\"established\":true,\"ssl_history\":\"Cs\"}", "type": ["connection", "protocol", "info"]}, "host": {"name": "zeek-sensor-01"}, "input": {"type": "filestream"}, "log": {"file": {"path": "/opt/zeek/logs/current/ssl.log"}}, "message": "{\"ts\":1790087451.391148,\"uid\":\"CbuZvt44kjC5iDd5YT\",\"id.orig_h\":\"10.20.9.31\",\"id.orig_p\":38573,\"id.resp_h\":\"203.0.113.201\",\"id.resp_p\":443,\"version\":\"TLSv13\",\"cipher\":\"TLS_AES_128_GCM_SHA256\",\"curve\":\"x25519\",\"server_name\":\"node-9ba06b0b.sync-gw.example.net\",\"resumed\":false,\"established\":true,\"ssl_history\":\"Cs\"}", "network": {"protocol": "tls", "transport": "tcp"}, "observer": {"name": "zeek-sensor-01", "product": "Zeek", "type": "ids", "version": "8.0.0"}, "related": {"ip": ["10.20.9.31", "203.0.113.201"]}, "source": {"address": "10.20.9.31", "ip": "10.20.9.31", "port": 38573}, "tags": ["zeek-ssl"], "tls": {"cipher": "TLS_AES_128_GCM_SHA256", "client": {"server_name": "node-9ba06b0b.sync-gw.example.net"}, "curve": "x25519", "established": true, "resumed": false, "version": "1.3", "version_protocol": "tls"}, "zeek": {"session_id": "CbuZvt44kjC5iDd5YT", "ssl": {"cipher": "TLS_AES_128_GCM_SHA256", "curve": "x25519", "established": true, "resumed": false, "server_name": "node-9ba06b0b.sync-gw.example.net", "ssl_history": "Cs", "version": "TLSv13"}}}`,
    },
  ],
};
