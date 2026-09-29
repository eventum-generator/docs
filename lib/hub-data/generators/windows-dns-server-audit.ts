/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDnsServerAudit: GeneratorMeta = {
  slug: 'windows-dns-server-audit',
  displayName: 'Microsoft DNS Server Audit and Analytical Logs',
  category: 'network',
  description:
    'Windows Server 2022 DNS Server Audit policy operations (577/580) and ETW Analytical query records (256/257/259) for one authoritative zone with recursion disabled, as ECS JSON in the shape the Elastic microsoft_dnsserver ingest pipeline produces. Not a Windows XML, EVTX or ETL export. Recurring episodes show an administrator creating an Ignore policy on a name they own, the policy dropping client queries, and the same administrator deleting it again within an hour.',
  dataSource:
    'Windows Server 2022 DNS Server Audit and Analytical channels, parsed by the Elastic microsoft_dnsserver pipeline',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Parsed Audit 577/580 and Analytical 256/257/259 records',
    'About 57,000 records a day on an office-hours curve',
    'Recurring create, drop and self-delete Ignore-policy chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "An administrator creates an Ignore policy for one target (577), ordinary client queries for that target are dropped by it three times or more (259), and the same administrator deletes the policy (580), all within one hour of the creation. Episodes repeat every 72 hours by default (anomaly_interval_hours, minimum 2) of source time: the first falls within the first min(interval, 24 h) of the run, each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted to busy hours (an interval far from a multiple of 24 h moves episodes into quieter hours); the creation follows the drawn start by about a minute, and a missed episode is not replayed. Each episode is run by one of the three name owners on its own name, never by the previous episode's account; an owner whose name already has an active policy is skipped. The deletion follows the third drop by a few minutes; with fewer than three drops before a deadline 24-58 minutes after creation the policy is deleted anyway and the episode stays incomplete. Every step also occurs in background; only a self-deletion within an hour after drops is missing.",
  generatorId: 'windows-dns-server-audit',
  eventTypes: [
    {
      id: '256',
      description:
        'QUERY_RECEIVED: incoming A query with source IP and port, XID, RD and DNS packet bytes',
      frequency: '50.00% share (50.00% without episodes)',
      category: 'network',
    },
    {
      id: '257',
      description:
        'RESPONSE_SUCCESS: authoritative A answer with the same client, port, XID and GUID',
      frequency: '49.17% share (46.9-49.1% without episodes)',
      category: 'network',
    },
    {
      id: '259',
      description:
        'IGNORED_QUERY: A query dropped by an Ignore policy, with no 257 following',
      frequency: '0.82% share (0.6-3.1% without episodes)',
      category: 'network',
    },
    {
      id: '577',
      description:
        'POLICY_OP: an administrator creates a server-level Ignore query policy',
      frequency: '0.004% share (0.003% without episodes)',
      category: 'none',
    },
    {
      id: '580',
      description: 'POLICY_OP: an administrator deletes a policy',
      frequency: '0.004% share (0.003% without episodes)',
      category: 'none',
    },
  ],
  realismFeatures: [
    'About 57,000 records a day, varying about ±3% from day to day, on an hour-of-day curve in the generator time zone (UTC by default): 1.20 records/s at 08-17, 0.54 at 06-08 and 17-20, 0.24 at night. Sixty workstations send about 28,000 queries a day (retransmissions included), each with its own activity level; a lookup covers one name or up to six names resolved in parallel.',
    'An unmatched name gets a 257 answer with QR/AA/RD flags, RA clear, one A record and TTL 300. A name matching an active policy is dropped (259), and the client retransmits after 1, 1, 2 and 4 seconds as the Windows DNS client does; each retransmission is dropped while the policy is active and answered once it is gone. About 0.2-1.3% of client lookups are dropped, each bringing up to five 259 records.',
    'Five administrators create about two policies a day, mostly in office hours. Three own a name they block about once every two days (a.petrov is retiring legacy-crm, dns.ops blocks wpad, m.sokolova vendor telemetry); i.volkov and adm.kuznetsov act every few days on any target. A fifth of the policies are mistakes undone by their creator within a minute or so, about 40% are rolled back by a colleague after roughly half an hour, and the rest last about two hours or several hours; about one operation in eight deletes an active policy picked at random.',
    'Records follow the pinned Elastic parsed fixtures: native data under microsoft_dnsserver.*, pipeline ECS fields (network.*, dns.question.* with registered_domain, event.outcome, event.reason, related.*) and the rendered message. data_stream and host.name are always present; agent, cloud, geo/AS enrichment, event.created, event.ingested, event.agent_id_status and event.original are omitted.',
    'Reason=Policy, the policy name and the zone on a policy drop are inferred (published 259 examples carry Reason=System and PolicyName=NULL); 580 fields follow the documented message placeholders, ElapsedTime units are unproven, and retransmissions reusing XID and port is an assumption. An answer or drop follows its query after a median of 1.1 s and up to about 80 s at night, not within milliseconds as on a real server.',
    'Only A queries for existing records are modeled: no NXDOMAIN, other record types, TCP, recursion or zone and record changes. Query volume (about 0.3 queries per second on average), policy activity and lifetimes are synthetic. Outside episodes a creator never deletes its own policy within an hour after three or more drops, so now and then a policy stays active hours or days longer; with episodes, counts of the chain parts are about one per episode higher.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'dns-01.corp.example.com',
      description:
        'DNS server host name (host.name, winlog.computer_name, name_server)',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.53',
      description: 'Server interface address (interface_ip on 256/257)',
    },
    {
      name: 'zone',
      defaultValue: 'corp.example.com',
      description: 'Authoritative zone reported on 257/259',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Domain of the administrator accounts',
    },
    {
      name: 'domain_sid',
      defaultValue: 'S-1-5-21-1004336348-1177238915-682003330',
      description: 'Domain SID; each account adds its RID',
    },
    {
      name: 'policy_name',
      defaultValue: 'QueryFilter',
      description: 'Policy name stem; names are <stem>-<target label>-<4 hex>',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enables the recurring episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '72',
      description: 'Episode interval in hours, 2 to 8760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Policy drop (259) during an episode',
      json: String.raw`{"@timestamp": "2026-09-04T08:34:28.653Z", "data_stream": {"dataset": "microsoft_dnsserver.analytical", "namespace": "default", "type": "logs"}, "dns": {"id": "31426", "question": {"name": "legacy-crm.corp.example.com", "registered_domain": "example.com", "subdomain": "legacy-crm.corp", "top_level_domain": "com", "type": "A"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "LOOK_UP", "category": ["network"], "code": "259", "dataset": "microsoft_dnsserver.analytical", "kind": "event", "provider": "Microsoft-Windows-DNSServer", "reason": "Policy", "severity": 2, "type": ["protocol"]}, "host": {"name": "dns-01.corp.example.com"}, "input": {"type": "etw"}, "log": {"file": {"path": "Microsoft-Windows-DNSServer-Analytical.etl"}, "level": "error"}, "message": "IGNORED_QUERY: TCP=0; InterfaceIP=; Source=10.20.5.100; Reason=Policy; QNAME=legacy-crm.corp.example.com.; QTYPE=1; XID=31426; Zone=corp.example.com; PolicyName=QueryFilter-legacy-crm-e3e7; AdditionalInfo = VirtualizationInstance: .", "microsoft_dnsserver": {"analytical": {"additional_info": ".", "description": "Ignored query", "policy_name": "QueryFilter-legacy-crm-e3e7", "question_name": "legacy-crm.corp.example.com.", "question_type": "A", "reason": "Policy", "source": {"ip": "10.20.5.100"}, "xid": "31426", "zone": "corp.example.com"}}, "network": {"direction": "ingress", "protocol": "dns", "transport": "udp"}, "process": {"pid": 5868, "thread": {"id": 9992}}, "related": {"ip": ["10.20.5.100"]}, "source": {"ip": "10.20.5.100"}, "tags": ["preserve_duplicate_custom_fields"], "user": {"id": "NT AUTHORITY\\SYSTEM"}, "winlog": {"channel": "Microsoft-Windows-DNS-Server/Analytical", "flags": ["64_BIT_HEADER", "EXTENDED_INFO", "PROCESSOR_INDEX"], "flags_raw": "0x241", "keywords": ["IGNORED_QUERY"], "keywords_raw": "0x8000000000000008", "level": "Error", "level_raw": 2, "opcode_raw": 0, "provider_guid": "{EB79061A-A566-4698-9119-3ED2807060E7}", "provider_message": "Microsoft-Windows-DNS-Server", "session": "Microsoft-Windows-DNSServer-Analytical.etl", "task": "LOOK_UP", "task_raw": 1, "version": 0}}`,
    },
  ],
};
