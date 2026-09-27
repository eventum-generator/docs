import type { GeneratorMeta } from '@/lib/hub-types';

export const networkStormshieldSns: GeneratorMeta = {
  slug: 'network-stormshield-sns',
  displayName: 'Stormshield SNS Audit Logs',
  category: 'network',
  description:
    'Stormshield Network Security (SNS v4) audit records of one firewall separating office workstations from a server segment: IPS alarm 85 (interactive connection detected) from l_alarm and closed-connection records from l_connection, as ECS JSON with the native WELF key-value body in event.original. Recurring episodes show one admin workstation opening interactive SSH sessions to three different servers, then pulling a bulk SSH transfer.',
  dataSource:
    'Stormshield SNS v4 l_alarm and l_connection audit logs, WELF body as forwarded over syslog',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native WELF key-value body in event.original',
    'Independent SSH work of 12 admin and web traffic of 40 office workstations',
    'Recurring three-server SSH fan-out to bulk transfer chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One episode per 24 hours of source time by default (the first is due one interval after generation starts; once due, an episode starts after a random delay that follows the admin day curve, mean about 18 minutes in office hours, 40 minutes in the evening and 2 hours at night; the next is due one interval after that actual start, with no catch-up of missed intervals). One admin workstation raises alarm 85 for interactive SSH sessions to three different servers, then closes an SSH connection with rcvd of at least 104857600 bytes, all within one hour (measured 6-15 minutes by default). The workstation differs from the previous episode; fan-outs to three servers, 100 MiB transfers and transfers after two servers also occur in ordinary traffic, and only the complete order is reserved.',
  generatorId: 'stormshield',
  eventTypes: [
    {
      id: 'l_connection https',
      description: 'HTTPS connection closed (proto=https, port 443)',
      frequency: '51.5% measured share',
      category: 'network',
    },
    {
      id: 'l_connection ssh',
      description: 'SSH connection closed (proto=ssh, port 22)',
      frequency: '17.7% measured share',
      category: 'network',
    },
    {
      id: 'l_alarm 85',
      description:
        'Alarm 85, interactive SSH connection detected (action=pass)',
      frequency: '16.3% measured share',
      category: 'network, intrusion_detection',
    },
    {
      id: 'l_connection http',
      description: 'HTTP connection closed (proto=http, port 80)',
      frequency: '10.5% measured share',
      category: 'network',
    },
    {
      id: 'l_connection ntp',
      description: 'NTP exchange with the firewall (ipproto=udp, port 123)',
      frequency: '4.0% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    "Admin workstations run SSH work tasks as a merged random stream, busier in office hours and weighted per workstation: a task opens one to six sessions to servers from the workstation's own set of 6-11 servers. The 78-hour default capture holds 18,760 records.",
    'An interactive session produces alarm 85 at its start and an l_connection record at close with startime, duration, sent and rcvd. About 8% of sessions are scp-style transfers with a log-normal received volume around 60 MB and no alarm, so transfers of 100 MiB and more occur in ordinary traffic; that alarm 85 is not raised for transfers is a modelling assumption.',
    'Office and admin workstations reach internal web servers over HTTPS and HTTP and synchronise time with the firewall. Host names, addresses, rule numbers, rates and volumes are synthetic, not measured SNS rates.',
    'The vendor publishes one complete raw alarm line (alarm 85); the l_connection layout follows the SNS v4 field reference and lab syslog captures from the Elastic integration test fixtures. logtype is the family field of the syslog export, not part of the on-disk WELF files, and no syslog header is added.',
    'Only l_alarm alarm 85 and l_connection are generated: filter, authentication, web, VPN and system logs, other alarms and blocked traffic are out of scope. No address translation is modelled, tz=+0000 with local time equal to UTC, at most one record per second; SNS 5.x is not claimed.',
    'An ordinary 100 MiB transfer that would complete the chain carries a smaller volume but keeps its duration, so these rare transfers show a low throughput; gaps between the sessions of one episode are capped at 15 minutes. The records show permitted SSH sessions, not authentication, lateral movement or data theft.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Add the anomaly episodes to the background',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Source-time interval between episode starts, 2 to 8,760',
    },
    {
      name: 'firewall_name',
      defaultValue: 'sns-fw-01',
      description: 'Firewall name written to fw and observer.name',
    },
    {
      name: 'admin_count',
      defaultValue: '12',
      description: 'Admin workstations (4-60), 10.10.5.11 upwards',
    },
    {
      name: 'user_count',
      defaultValue: '40',
      description: 'Office workstations (10-200), 10.10.1.20 upwards',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final step of an episode: bulk SSH transfer',
      json: String.raw`{"@timestamp": "2026-09-27T04:51:09+00:00", "destination": {"bytes": 200593679, "domain": "srv_k8s03", "ip": "10.20.0.93", "port": 22}, "ecs": {"version": "8.17.0"}, "event": {"action": "connection_closed", "category": ["network"], "dataset": "stormshield.sns", "duration": 3267236206, "end": "2026-09-27T04:51:09+00:00", "kind": "event", "original": "id=firewall time=\"2026-09-27 04:51:09\" fw=\"sns-fw-01\" tz=+0000 startime=\"2026-09-27 04:51:05\" pri=5 confid=01 slotlevel=2 ruleid=5 srcif=\"Ethernet1\" srcifname=\"in\" ipproto=tcp proto=ssh src=10.10.5.21 srcport=34939 srcportname=ephemeral_fw srcname=adm_ws11 dst=10.20.0.93 dstport=22 dstportname=ssh dstname=srv_k8s03 modsrc=10.10.5.21 modsrcport=34939 origdst=10.20.0.93 origdstport=22 ipv=4 sent=5780117 rcvd=200593679 duration=3.27 action=pass logtype=\"connection\"", "start": "2026-09-27T04:51:05+00:00", "type": ["connection", "end", "allowed"]}, "network": {"bytes": 206373796, "protocol": "ssh", "transport": "tcp", "type": "ipv4"}, "observer": {"ingress": {"interface": {"id": "Ethernet1", "name": "in"}}, "name": "sns-fw-01", "product": "SNS", "type": "firewall", "vendor": "Stormshield"}, "related": {"hosts": ["adm_ws11", "srv_k8s03"], "ip": ["10.10.5.21", "10.20.0.93"]}, "rule": {"id": "5"}, "source": {"bytes": 5780117, "ip": "10.10.5.21", "port": 34939}, "stormshield": {"sns": {"action": "pass", "confid": "01", "logtype": "connection", "priority": 5, "slotlevel": 2}}}`,
    },
  ],
};
