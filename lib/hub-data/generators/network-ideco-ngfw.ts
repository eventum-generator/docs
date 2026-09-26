/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic source addresses match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkIdecoNgfw: GeneratorMeta = {
  slug: 'network-ideco-ngfw',
  displayName: 'Ideco NGFW Novum Syslog',
  category: 'network',
  description:
    'Ideco v22 traffic-journal decisions and fail2ban findings and bans, with recurring rapid-findings episodes.',
  dataSource: 'Ideco NGFW Novum v22 displayed Syslog',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    '19/39 documented traffic fields selected',
    'Background findings and bans share the episode jail',
    'Recurring six-findings-to-ban sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every two hours, six adjacent Found records for one source and jail precede a Ban. The target also occurs in ordinary traffic and isolated findings; a modeled 45-minute ban suppresses its traffic before it returns.',
  generatorId: 'ideco-ngfw',
  eventTypes: [
    {
      id: 'traffic-journal accept',
      description: 'Allowed connection',
      frequency: '~74% background',
      category: 'network',
    },
    {
      id: 'traffic-journal drop',
      description: 'Denied connection',
      frequency: '~19% background',
      category: 'network',
    },
    {
      id: 'fail2ban Found',
      description: 'Jail finding',
      frequency: '~6% background; also episodes',
      category: 'intrusion_detection',
    },
    {
      id: 'fail2ban Ban',
      description: 'IP ban',
      frequency: '~1% background; also episodes',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Displayed Syslog payload is retained in event.original; network framing is outside this profile.',
    'Distinct flow_id values and varying rules, ports, sources and destinations model ordinary traffic.',
    'Six attempts within 15 minutes and a 45-minute hold are v21-based scenario assumptions, not verified v22 jail defaults.',
    'BLOCKED_RAW_EVIDENCE: the vendor traffic example is truncated, and a complete Ban envelope and alternate-jail capture are missing.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring rapid-findings episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Hours between episode eligibility; use a positive value above 0.75 to allow the modeled ban to expire',
    },
    {
      name: 'ngfw_host',
      defaultValue: 'ideco-ngfw-01',
      description: 'Hostname in the displayed Syslog record',
    },
    {
      name: 'ngfw_ip',
      defaultValue: '10.50.0.1',
      description: 'NGFW observer IP and INPUT destination',
    },
    {
      name: 'internal_source_ip',
      defaultValue: '10.50.1.20',
      description: 'One ordinary LAN source',
    },
    {
      name: 'target_source_ip',
      defaultValue: '198.51.100.25',
      description: 'Source in the rapid-findings chain and ordinary traffic',
    },
    {
      name: 'external_destination_ip',
      defaultValue: '198.51.100.10',
      description: 'One ordinary WAN destination',
    },
    {
      name: 'fail2ban_jail',
      defaultValue: 'utm-vpn-authd',
      description: 'Jail; the v22 guide also lists `utm-web-interface`',
    },
  ],
  sampleOutputs: [
    {
      title: 'Ideco NGFW Novum Syslog event from finite generator output',
      json: String.raw`{"@timestamp": "2026-09-25T02:00:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "fail2ban_found", "category": ["intrusion_detection"], "dataset": "ideco.ngfw_syslog", "kind": "event", "original": "2026-09-25T02:00:00+00:00 ideco-ngfw-01 fail2ban - - - INFO [utm-vpn-authd] Found 198.51.100.25 - 2026-09-25 02:00:00", "type": ["info"]}, "ideco": {"ngfw": {"fields": {"action": "Found", "found_at": "2026-09-25 02:00:00", "jail": "utm-vpn-authd", "src_ip": "198.51.100.25"}, "service": "fail2ban"}}, "message": "INFO [utm-vpn-authd] Found 198.51.100.25 - 2026-09-25 02:00:00", "observer": {"hostname": "ideco-ngfw-01", "ip": "10.50.0.1", "product": "NGFW Novum", "vendor": "Ideco"}, "related": {"ip": ["198.51.100.25"]}, "source": {"ip": "198.51.100.25"}}`,
    },
  ],
};
