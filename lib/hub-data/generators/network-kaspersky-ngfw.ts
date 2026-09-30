/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKasperskyNgfw: GeneratorMeta = {
  slug: 'network-kaspersky-ngfw',
  displayName: 'Kaspersky NGFW Firewall Session Log',
  category: 'network',
  description:
    'Kaspersky NGFW 1.0 Firewall session log (CEF) of one device as ECS JSON, with paired Session start and Firewall records for clients of a user segment reaching the internet, two internal file servers and an internal DNS server. About 14,000 records a day on a UTC office-hours curve. Recurring episodes show one client reading two large files from one server over SMB, then uploading more than 50 MB to a cloud destination.',
  dataSource:
    'Kaspersky NGFW 1.0 Firewall session log, CEF message without a syslog envelope',
  eventFormat: 'ECS JSON',
  originalFormat: 'CEF',
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'CEF Firewall message in event.original',
    'Paired start and end records for 24 independent clients',
    'Recurring SMB staging then cloud upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client ends two SMB sessions from the same file server with more than 50 MB read each, then ends an HTTPS session to a cloud destination with more than 50 MB uploaded (at least 55-75 MB), all within one hour; an episode spans 5-40 minutes from the end of the first read to the end of the upload. The first episode starts within the first anomaly_interval_hours of the data (at most 24 h), at a time following the hour-of-day volume curve. Each next one is due anomaly_interval_hours (default 24, minimum 2) after the actual start of the previous one and starts in a window a quarter of the interval wide (at most 6 h) centred on the due time, weighted toward office hours, with no catch-up: at the default interval episodes start 21-27 h apart, mostly between 06:00 and 16:00 UTC. The client and cloud destination differ from the previous episode; the file server is random. Every fragment also occurs in background; only the complete sequence within one hour is kept out of it.',
  generatorId: 'ngfw',
  eventTypes: [
    {
      id: 'Session start (HTTPS)',
      description: 'HTTPS session (TCP/443) created',
      frequency: '21.69% share',
      category: 'network',
    },
    {
      id: 'Firewall (HTTPS)',
      description: 'HTTPS session (TCP/443) removed, with counters',
      frequency: '21.69% share',
      category: 'network',
    },
    {
      id: 'Session start (DNS)',
      description: 'DNS session (UDP/53) created',
      frequency: '15.81% share',
      category: 'network',
    },
    {
      id: 'Firewall (DNS)',
      description: 'DNS session (UDP/53) removed, with counters',
      frequency: '15.81% share',
      category: 'network',
    },
    {
      id: 'Session start (SMB)',
      description: 'SMB session (TCP/445) created',
      frequency: '10.69% share',
      category: 'network',
    },
    {
      id: 'Firewall (SMB)',
      description: 'SMB session (TCP/445) removed, with counters',
      frequency: '10.69% share',
      category: 'network',
    },
    {
      id: 'Session start (HTTP)',
      description: 'HTTP session (TCP/80) created',
      frequency: '1.82% share',
      category: 'network',
    },
    {
      id: 'Firewall (HTTP)',
      description: 'HTTP session (TCP/80) removed, with counters',
      frequency: '1.82% share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'About 14,000 records a day (±3% from day to day) on a UTC hour-of-day curve: about 960 records an hour 06:00-16:00, 530 at 16:00-20:00 and 230 at night. The activity mix is the same at every hour and half of the records are session starts. Rates, sizes and throughputs are training assumptions, not measured production volume: this is a sampled view of a small office.',
    'Each new activity picks a client by a fixed random per-client weight, so clients act independently. Web (62%) is HTTPS to 40 internet addresses with skewed popularity, in 60% of cases after a DNS query; cloud (8%) is HTTPS to the cloud-storage addresses, 18% of it uploads (median 35 MB); plain HTTP and DNS-only take 6% each.',
    'SMB (18%) comes in bursts of 1-7 transfers from one file server with a per-burst size scale (median 300 kB), so several reads above 50 MB can follow within minutes. After any read above 50 MB the same client uploads to the cloud with probability 0.25, about 10 minutes later.',
    'Durations follow the transferred volume and a log-normal throughput (LAN median 20 MB/s, internet 2 MB/s), with directional packet and byte counters. A session start and end share devicePayloadId, addresses, ports and start time; session IDs grow by a random 1-40. UDP sessions end after an assumed 30 s idle timeout plus a random sweep delay. Records a real device logs milliseconds apart are seconds apart: a DNS query and the connection it resolves start a median 5 s apart (90% within 20 s), and session ends come a few seconds after the last packet, so cn1 includes that delay (DNS sessions: median 45 s instead of about 34 s).',
    'No field labels an episode. Large SMB read bursts, large cloud uploads and uploads after one large read occur in background in both modes; an ordinary upload that would complete the chain (two reads above 50 MB from one server by the same client, the first at most one hour earlier) is 5-45 MB, while an upload more than an hour after the first read is left as is. Episode reads come from the upper tail of the background SMB size distribution, and the episode client is picked by the same per-client weights. Each episode adds its own records, so counts of large SMB reads and large uploads are about two and one per episode higher than with anomaly_mode off.',
    'Kaspersky publishes the CEF header, the Firewall event names and the key table but no complete raw Firewall message, so key order after rt dtz, the label literals and optional-field omission are assumptions. app and sproc are always Unknown; reason, decryption, profile, application name and DNS domain fields are omitted.',
    'All sessions match a rule with the documented Inspect action (FullMatch=yes); denied traffic, ICMP, NAT and the other NGFW logs are out of scope, and the device time zone is UTC. No Elastic integration exists for this source, so the ECS mapping, including network.protocol inferred from the port, is an assumption.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add periodic episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in source hours, 2 to 8,760',
    },
    {
      name: 'device_host',
      defaultValue: 'ngfw-01.example.test',
      description: 'Written to dvchost and observer.hostname',
    },
    {
      name: 'device_version',
      defaultValue: '1.0.0.0',
      description: 'CEF header version (1.0.0.x)',
    },
    {
      name: 'client_prefix',
      defaultValue: '10.20.1.',
      description: 'Client addresses are this prefix plus a host number',
    },
    {
      name: 'client_first',
      defaultValue: '21',
      description: 'First client host number',
    },
    {
      name: 'client_count',
      defaultValue: '24',
      description:
        'Number of clients, at least 4; client_first + client_count at most 255',
    },
    {
      name: 'file_servers',
      defaultValue: '10.20.2.14, 10.20.2.15',
      description: 'SMB servers',
    },
    {
      name: 'dns_server',
      defaultValue: '10.20.0.53',
      description: 'DNS resolver',
    },
    {
      name: 'cloud_destinations',
      defaultValue: '203.0.113.10, 203.0.113.11, 203.0.113.12, 203.0.113.13',
      description: 'Cloud-storage addresses, at least 2',
    },
  ],
  sampleOutputs: [
    {
      title: 'Upload completing the first episode (Firewall)',
      json: String.raw`{"@timestamp": "2026-09-01T06:12:30+00:00", "destination": {"bytes": 1616836, "ip": "203.0.113.13", "packets": 31093, "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "Firewall", "category": ["network"], "dataset": "kaspersky.ngfw", "duration": 130000000000, "end": "2026-09-01T06:12:30+00:00", "kind": "event", "original": "CEF:0|Kaspersky|NGFW|1.0.0.0|Firewall|Firewall|Unknown|rt=2026-09-01T06:12:30Z dtz=UTC+00:00 cs4=Low cs4Label=Priority devicePayloadId=2537811 cs1=Users to Internet cs1Label=SecurityRule act=Inspect FullMatch=yes start=2026-09-01T06:10:20Z end=2026-09-01T06:12:30Z cn1=130 cn1Label=Duration cn2=53191 cn2Label=ClientPackets cn3=31093 cn3Label=ServerPackets in=61463722 out=1616836 dvchost=ngfw-01.example.test src=10.20.1.33 dst=203.0.113.13 proto=TCP spt=57094 dpt=443 KasperskyNGFWTCPRedir=no app=Unknown sproc=Unknown", "start": "2026-09-01T06:10:20+00:00", "type": ["connection", "end"]}, "kaspersky": {"ngfw": {"action": "Inspect", "full_match": "yes", "session_id": "2537811"}}, "network": {"bytes": 63080558, "packets": 84284, "protocol": "tls", "transport": "tcp"}, "observer": {"hostname": "ngfw-01.example.test", "product": "NGFW", "vendor": "Kaspersky", "version": "1.0.0.0"}, "related": {"ip": ["10.20.1.33", "203.0.113.13"]}, "rule": {"name": "Users to Internet"}, "source": {"bytes": 61463722, "ip": "10.20.1.33", "packets": 53191, "port": 57094}}`,
    },
  ],
};
