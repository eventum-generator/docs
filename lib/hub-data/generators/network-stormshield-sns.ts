import type { GeneratorMeta } from '@/lib/hub-types';

export const networkStormshieldSns: GeneratorMeta = {
  slug: 'network-stormshield-sns',
  displayName: 'Stormshield SNS Audit Logs',
  category: 'network',
  description:
    'Stormshield Network Security (SNS v4) audit records of one firewall separating office workstations from a server segment: IPS alarm 85 (interactive connection detected) from l_alarm and closed-connection records from l_connection, as ECS JSON with the native WELF key-value body in event.original. About 6,000 records a day follow an office day in UTC. Recurring episodes show one admin workstation opening interactive SSH sessions to three different servers, then pulling a bulk SSH transfer of 100 MiB or more.',
  dataSource:
    'Stormshield SNS v4 l_alarm and l_connection audit logs, WELF body as forwarded over syslog',
  eventFormat: 'ECS JSON',
  originalFormat: 'KV',
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Native WELF key-value body in event.original',
    '12 admin and 40 office workstations, about 6,000 records a day on a UTC office day',
    'Recurring three-server SSH fan-out to bulk transfer chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One admin workstation raises alarm 85 for interactive SSH sessions to three different servers, then closes an SSH connection with rcvd of at least 104857600 bytes (100 MiB); the whole sequence spans at most one hour, usually about 2-20 minutes and occasionally longer. One episode per anomaly_interval_hours of source time (default 24, minimum 2): the first starts within min(interval, 24 h) of the first record, at an hour drawn from the day curve; each next one is due one interval after the previous actual start and starts within +/- w/2 of that time, w = min(interval / 4, 6 h), favouring busy hours, so starts never drift; missed intervals are not caught up. The workstation is drawn by ordinary activity among admin workstations doing at least 0.8 of an average share of admin work and differs from the previous episode; its servers are ones it reaches at least about ten times in four days. An episode's own records take the place of a few ordinary new connections, so the hourly volume is the same in both modes. Alarm 85 to three or more different servers within an hour (about 50 a day), transfers of 100 MiB and more and transfers after sessions to two servers all occur in ordinary traffic; only the complete order is reserved.",
  generatorId: 'stormshield',
  eventTypes: [
    {
      id: 'l_connection https',
      description: 'HTTPS connection closed (proto=https, port 443)',
      frequency: '65.0% of records',
      category: 'network',
    },
    {
      id: 'l_connection http',
      description: 'HTTP connection closed (proto=http, port 80)',
      frequency: '13.2% of records',
      category: 'network',
    },
    {
      id: 'l_connection ssh',
      description: 'SSH connection closed (proto=ssh, port 22)',
      frequency: '9.3% of records',
      category: 'network',
    },
    {
      id: 'l_alarm 85',
      description:
        'Alarm 85, interactive SSH connection detected (action=pass)',
      frequency: '7.4% of records',
      category: 'network, intrusion_detection',
    },
    {
      id: 'l_connection ntp',
      description: 'NTP exchange with the firewall (ipproto=udp, port 123)',
      frequency: '5.1% of records',
      category: 'network',
    },
  ],
  realismFeatures: [
    'About 6,000 records a day (+/- 3% from day to day) follow an office day in UTC: about 440 records an hour from 08:00 to 18:00, 200 an hour from 18:00 to 22:00 and 80 an hour at night. Every source is a workstation, so all traffic follows this curve.',
    "Admin workstations (10.10.5.11 and up, host objects adm_ws01...) run SSH work tasks weighted per workstation, the busiest doing up to four times the work of the quietest. A task opens one to six sessions to servers from the workstation's own set of 6-11 servers, each session starting up to 15 minutes after the previous one.",
    'An interactive session produces alarm 85 at its start and an l_connection record at close with startime, duration, sent and rcvd. About 20% of sessions are scp-style transfers with a log-normal received volume around 60 MB and no alarm, so transfers of 100 MiB and more occur in ordinary traffic (about 20 a day); that alarm 85 is not raised for transfers is a modelling assumption.',
    'Office workstations (10.10.1.20 and up, no host object) and admin workstations reach internal web servers over HTTPS and HTTP and synchronise time with the firewall. Host names, addresses, rule numbers, rates and volumes are synthetic, not measured SNS volumes.',
    'The vendor publishes one complete raw alarm line (alarm 85); the l_connection layout follows the SNS v4 field reference and lab syslog captures from the Elastic integration test fixtures. logtype is the family field of the syslog export, not part of the on-disk WELF files, and no syslog header is added.',
    'Only l_alarm alarm 85 and l_connection are generated: filter, authentication, web, VPN and system logs, other alarms and blocked traffic are out of scope. No address translation is modelled (modsrc and origdst equal src and dst), tz=+0000 with local time equal to UTC; SNS 5.x is not claimed.',
    'Records that coincide are logged one after another over the following seconds, so an admin session can be logged a few seconds late (median about 30 s, occasionally several minutes at night) and its duration includes that wait.',
    'An ordinary SSH transfer of 100 MiB or more that would complete the chain (about 13 a day) carries a smaller volume but keeps its original duration, so these transfers show a low throughput. With anomaly_mode true, alarm 85, SSH connection records and transfers of 100 MiB or more are each a few per episode higher than with false. The records show SSH sessions permitted by the filter policy, not authentication, lateral movement or data theft.',
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
      description:
        'Admin workstations (4-60), 10.10.5.11 upwards; the total admin work stays the same, so more workstations each do less',
    },
    {
      name: 'user_count',
      defaultValue: '40',
      description: 'Office workstations (10-200), 10.10.1.20 upwards',
    },
  ],
  sampleOutputs: [
    {
      title:
        'Final step of an episode: bulk SSH transfer after alarms for three different servers',
      json: String.raw`{"@timestamp": "2026-09-02T16:46:59+00:00", "destination": {"bytes": 363275464, "domain": "srv_app02", "ip": "10.20.0.12", "port": 22}, "ecs": {"version": "8.17.0"}, "event": {"action": "connection_closed", "category": ["network"], "dataset": "stormshield.sns", "duration": 11168025732, "end": "2026-09-02T16:46:59+00:00", "kind": "event", "original": "id=firewall time=\"2026-09-02 16:46:59\" fw=\"sns-fw-01\" tz=+0000 startime=\"2026-09-02 16:46:48\" pri=5 confid=01 slotlevel=2 ruleid=5 srcif=\"Ethernet1\" srcifname=\"in\" ipproto=tcp proto=ssh src=10.10.5.13 srcport=14255 srcportname=ephemeral_fw srcname=adm_ws03 dst=10.20.0.12 dstport=22 dstportname=ssh dstname=srv_app02 modsrc=10.10.5.13 modsrcport=14255 origdst=10.20.0.12 origdstport=22 ipv=4 sent=9533853 rcvd=363275464 duration=11.16 action=pass logtype=\"connection\"", "start": "2026-09-02T16:46:48+00:00", "type": ["connection", "end", "allowed"]}, "network": {"bytes": 372809317, "protocol": "ssh", "transport": "tcp", "type": "ipv4"}, "observer": {"ingress": {"interface": {"id": "Ethernet1", "name": "in"}}, "name": "sns-fw-01", "product": "SNS", "type": "firewall", "vendor": "Stormshield"}, "related": {"hosts": ["adm_ws03", "srv_app02"], "ip": ["10.10.5.13", "10.20.0.12"]}, "rule": {"id": "5"}, "source": {"bytes": 9533853, "ip": "10.10.5.13", "port": 14255}, "stormshield": {"sns": {"action": "pass", "confid": "01", "logtype": "connection", "priority": 5, "slotlevel": 2}}}`,
    },
  ],
};
