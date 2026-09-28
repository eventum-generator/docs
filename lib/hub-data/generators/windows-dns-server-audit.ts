/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsDnsServerAudit: GeneratorMeta = {
  slug: 'windows-dns-server-audit',
  displayName: 'Microsoft DNS Server Audit and Analytical Logs',
  category: 'network',
  description:
    'Windows Server 2022 DNS Server Audit policy operations (577/580) and ETW Analytical query records (256/257/259) for one authoritative zone with recursion disabled, as ECS JSON in the shape the Elastic microsoft_dnsserver ingest pipeline produces. Not a Windows XML, EVTX or ETL export. Recurring episodes show an administrator creating an Ignore policy that drops client queries and deleting it again within an hour.',
  dataSource:
    'Windows Server 2022 DNS Server Audit and Analytical channels, parsed by the Elastic microsoft_dnsserver pipeline',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Parsed Audit 577/580 and Analytical 256/257/259 records',
    '60 clients and 5 administrators acting independently',
    'Recurring create, drop and delete Ignore-policy chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'An administrator creates an Ignore policy for one target (577), ordinary client queries for that target are dropped by it three times or more (259), and the same administrator deletes the policy (580), all within one hour of the creation. Episodes repeat every 24 hours by default (anomaly_interval_hours, minimum 2) of source time: the first falls within the first min(interval, 24 h) of the capture, each later one in a window of min(interval / 4, 6 h) centred one interval after the previous actual start, weighted to busy hours (an interval far from a multiple of 24 h moves episodes into quieter hours); the creation follows about a minute after the drawn start, and a missed episode is not replayed. With fewer than three drops before a 24-58 minute deadline the policy is deleted anyway and the episode stays incomplete. Every step also occurs in background; a background deletion that would complete the chain is not performed.',
  generatorId: 'windows-dns-server-audit',
  eventTypes: [
    {
      id: '256',
      description:
        'QUERY_RECEIVED: incoming A query with source IP and port, XID, RD and DNS packet bytes',
      frequency: '49.9% measured share',
      category: 'network',
    },
    {
      id: '257',
      description:
        'RESPONSE_SUCCESS: authoritative A answer with the same client, port, XID and GUID',
      frequency: '36.5% measured share',
      category: 'network',
    },
    {
      id: '259',
      description:
        'IGNORED_QUERY: A query dropped by an Ignore policy, with no 257 following',
      frequency: '13.5% measured share',
      category: 'network',
    },
    {
      id: '577',
      description:
        'POLICY_OP: an administrator creates a server-level Ignore query policy',
      frequency: '0.06% measured share',
      category: 'none',
    },
    {
      id: '580',
      description: 'POLICY_OP: an administrator deletes a policy',
      frequency: '0.05% measured share',
      category: 'none',
    },
  ],
  realismFeatures: [
    'Sixty workstations resolve names from a weighted list at random, thinned by a UTC hour-of-day curve (busy 08:00-17:00), each with its own activity level. A lookup covers one name or up to six names resolved in parallel within a few milliseconds.',
    'An unmatched name gets a 257 answer after a fraction of a millisecond with QR/AA/RD flags, RA clear, one A record and TTL 300. A name matching an active policy is dropped (259), and the client retransmits after 1, 1, 2 and 4 seconds as the Windows DNS client does; each retransmission is dropped while the policy is active and answered once it is gone.',
    'Five administrators open sessions at different rates and perform one to four operations about a minute apart: most create a policy for one of ten targets, about one in four deletes an active policy. Policies live minutes, an hour or two, or several hours, and are deleted by their creator or another administrator.',
    'Records follow the pinned Elastic parsed fixtures: native data under microsoft_dnsserver.*, pipeline ECS fields (network.*, dns.question.* with registered_domain, event.outcome, event.reason, related.*) and the rendered message. data_stream and host.name are always present; agent, cloud, geo enrichment, event.created, event.ingested and event.original are omitted.',
    'Policy-drop Reason=Policy, policy name and zone on 259 are inferred (published 259 examples carry Reason=System and PolicyName=NULL); 580 fields follow the documented message placeholders, ElapsedTime units are unproven, and retransmissions reusing XID and port is an assumption.',
    'Only A queries for existing records are modeled: no NXDOMAIN, other record types, TCP, recursion or zone and record changes. Query volume (about 0.1 queries per second), policy churn (about 13 per day) and lifetimes are synthetic; a real enterprise server answers far more queries.',
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
      defaultValue: '24',
      description: 'Episode interval in hours, 2 to 8,760',
    },
  ],
  sampleOutputs: [
    {
      title: 'Policy drop (259) during an episode',
      json: String.raw`{"@timestamp": "2026-09-21T08:27:37.812Z", "data_stream": {"dataset": "microsoft_dnsserver.analytical", "namespace": "default", "type": "logs"}, "dns": {"id": "14084", "question": {"name": "print-old.corp.example.com", "registered_domain": "example.com", "subdomain": "print-old.corp", "top_level_domain": "com", "type": "A"}}, "ecs": {"version": "8.17.0"}, "event": {"action": "LOOK_UP", "category": ["network"], "code": "259", "dataset": "microsoft_dnsserver.analytical", "kind": "event", "provider": "Microsoft-Windows-DNSServer", "reason": "Policy", "severity": 2, "type": ["protocol"]}, "host": {"name": "dns-01.corp.example.com"}, "input": {"type": "etw"}, "log": {"file": {"path": "Microsoft-Windows-DNSServer-Analytical.etl"}, "level": "error"}, "message": "IGNORED_QUERY: TCP=0; InterfaceIP=; Source=10.20.5.112; Reason=Policy; QNAME=print-old.corp.example.com.; QTYPE=1; XID=14084; Zone=corp.example.com; PolicyName=QueryFilter-print-old-4703; AdditionalInfo = VirtualizationInstance: .", "microsoft_dnsserver": {"analytical": {"additional_info": ".", "description": "Ignored query", "policy_name": "QueryFilter-print-old-4703", "question_name": "print-old.corp.example.com.", "question_type": "A", "reason": "Policy", "source": {"ip": "10.20.5.112"}, "xid": "14084", "zone": "corp.example.com"}}, "network": {"direction": "ingress", "protocol": "dns", "transport": "udp"}, "process": {"pid": 3688, "thread": {"id": 5696}}, "related": {"ip": ["10.20.5.112"]}, "source": {"ip": "10.20.5.112"}, "tags": ["preserve_duplicate_custom_fields"], "user": {"id": "NT AUTHORITY\\SYSTEM"}, "winlog": {"channel": "Microsoft-Windows-DNS-Server/Analytical", "flags": ["64_BIT_HEADER", "EXTENDED_INFO", "PROCESSOR_INDEX"], "flags_raw": "0x241", "keywords": ["IGNORED_QUERY"], "keywords_raw": "0x8000000000000008", "level": "Error", "level_raw": 2, "opcode_raw": 0, "provider_guid": "{EB79061A-A566-4698-9119-3ED2807060E7}", "provider_message": "Microsoft-Windows-DNS-Server", "session": "Microsoft-Windows-DNSServer-Analytical.etl", "task": "LOOK_UP", "task_raw": 1, "version": 0}}`,
    },
  ],
};
