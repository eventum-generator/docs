/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkKasperskyNgfw: GeneratorMeta = {
  slug: 'network-kaspersky-ngfw',
  displayName: 'Kaspersky NGFW Firewall Session Log',
  category: 'network',
  description:
    'Kaspersky NGFW 1.0 Firewall session log (CEF) of one device as ECS JSON, with paired Session start and Firewall records for clients of a user segment reaching the internet, two internal file servers and an internal DNS server. Recurring episodes show one client reading two large files from one server over SMB, then uploading more than 50 MB to a cloud destination.',
  dataSource:
    'Kaspersky NGFW 1.0 Firewall session log, CEF message without a syslog envelope',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'CEF Firewall message in event.original',
    'Paired start and end records for 24 independent clients',
    'Recurring SMB staging then cloud upload chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (the first within the first 24 hours at a time drawn from the office-hours load curve; each next one due one interval after the actual start of the previous one and started in a window of a quarter of the interval, at most 6 h, centred on the due time and weighted toward office hours, with no catch-up), one client ends two SMB sessions from the same file server with more than 50 MB read, then ends an HTTPS session to a cloud destination with more than 50 MB uploaded (at least 55-75 MB). Episodes spanned 8-20 minutes at the default interval; the client and cloud destination differ from the previous episode. Every fragment also occurs in background; only the complete sequence within one hour is kept out of it.',
  generatorId: 'ngfw',
  eventTypes: [
    {
      id: 'Session start (HTTPS)',
      description: 'HTTPS session (TCP/443) created',
      frequency: '21.83% measured share',
      category: 'network',
    },
    {
      id: 'Firewall (HTTPS)',
      description: 'HTTPS session (TCP/443) removed, with counters',
      frequency: '21.82% measured share',
      category: 'network',
    },
    {
      id: 'Session start (DNS)',
      description: 'DNS session (UDP/53) created',
      frequency: '16.04% measured share',
      category: 'network',
    },
    {
      id: 'Firewall (DNS)',
      description: 'DNS session (UDP/53) removed, with counters',
      frequency: '16.04% measured share',
      category: 'network',
    },
    {
      id: 'Session start (SMB)',
      description: 'SMB session (TCP/445) created',
      frequency: '10.35% measured share',
      category: 'network',
    },
    {
      id: 'Firewall (SMB)',
      description: 'SMB session (TCP/445) removed, with counters',
      frequency: '10.35% measured share',
      category: 'network',
    },
    {
      id: 'Session start (HTTP)',
      description: 'HTTP session (TCP/80) created',
      frequency: '1.79% measured share',
      category: 'network',
    },
    {
      id: 'Firewall (HTTP)',
      description: 'HTTP session (TCP/80) removed, with counters',
      frequency: '1.79% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Each one-second tick emits at most one record, the earliest due session start or end. Client activity arrives as one merged Poisson stream (0.05 per second) scaled by an office-hours factor (06:00-16:00 UTC 1.64, 16:00-20:00 0.91, night 0.40); a fixed random weight per client keeps clients independent. This is a sampled view of a small office: rates, sizes and throughputs are training assumptions, not measured production volume.',
    'Web HTTPS goes to 40 internet addresses with skewed popularity, in 60% of cases after a DNS query; 18% of cloud HTTPS sessions are uploads (median 35 MB). SMB comes in bursts of 1-7 transfers from one file server with a per-burst size scale, so several reads above 50 MB can follow within minutes, and after any read above 50 MB the same client uploads to the cloud with probability 0.25, about 10 minutes later.',
    'Durations follow the transferred volume and a log-normal throughput (LAN median 20 MB/s, internet 2 MB/s), with directional packet and byte counters. A session start and end share devicePayloadId, addresses, ports and start time; session IDs grow by a random 1-40. UDP sessions end after an assumed 30 s idle timeout plus a random sweep delay.',
    'No field labels an episode. Large SMB read bursts, large cloud uploads and uploads after one large read occur in background in both modes; an ordinary upload above 50 MB that would complete the chain (two large reads from one server by the same client, the first at most one hour earlier) is reduced to 5-45 MB, and a later upload is left as is. Episode reads come from the upper tail of the background SMB size distribution; the episode client is picked uniformly among the other clients.',
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
      json: String.raw`{"@timestamp": "2026-09-26T11:34:27+00:00", "destination": {"bytes": 5111184, "ip": "203.0.113.13", "packets": 98292, "port": 443}, "ecs": {"version": "8.17.0"}, "event": {"action": "Firewall", "category": ["network"], "dataset": "kaspersky.ngfw", "duration": 87000000000, "end": "2026-09-26T11:34:27+00:00", "kind": "event", "original": "CEF:0|Kaspersky|NGFW|1.0.0.0|Firewall|Firewall|Unknown|rt=2026-09-26T11:34:27Z dtz=UTC+00:00 cs4=Low cs4Label=Priority devicePayloadId=1643667 cs1=Users to Internet cs1Label=SecurityRule act=Inspect FullMatch=yes start=2026-09-26T11:33:00Z end=2026-09-26T11:34:27Z cn1=87 cn1Label=Duration cn2=164155 cn2Label=ClientPackets cn3=98292 cn3Label=ServerPackets in=186629933 out=5111184 dvchost=ngfw-01.example.test src=10.20.1.38 dst=203.0.113.13 proto=TCP spt=61506 dpt=443 KasperskyNGFWTCPRedir=no app=Unknown sproc=Unknown", "start": "2026-09-26T11:33:00+00:00", "type": ["connection", "end"]}, "kaspersky": {"ngfw": {"action": "Inspect", "full_match": "yes", "session_id": "1643667"}}, "network": {"bytes": 191741117, "packets": 262447, "protocol": "tls", "transport": "tcp"}, "observer": {"hostname": "ngfw-01.example.test", "product": "NGFW", "vendor": "Kaspersky", "version": "1.0.0.0"}, "related": {"ip": ["10.20.1.38", "203.0.113.13"]}, "rule": {"name": "Users to Internet"}, "source": {"bytes": 186629933, "ip": "10.20.1.38", "packets": 164155, "port": 61506}}`,
    },
  ],
};
