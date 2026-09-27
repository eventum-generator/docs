/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkIdecoNgfw: GeneratorMeta = {
  slug: 'network-ideco-ngfw',
  displayName: 'Ideco NGFW Novum Syslog',
  category: 'network',
  description:
    'Ideco NGFW Novum v22 Syslog of one NGFW that publishes a PPTP VPN to remote users and faces ordinary internet noise: traffic-journal flows, ideco-vpn-authd authorizations and fail2ban Found, Ban and Unban, each native line kept in event.original inside an ECS JSON envelope. CEF is not modeled. Recurring episodes show a guessed VPN password: the home address of one user fails four or five VPN authorizations, then authorizes as that user.',
  dataSource:
    'Ideco NGFW Novum v22 Syslog: traffic-journal, ideco-vpn-authd and fail2ban',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native v22 Syslog line in event.original',
    'Consistent fail2ban: six Found in 900 s, Ban, Unban 2700 s later',
    'Recurring VPN password-guessing chain below the ban threshold',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default (the first one at a random time within the first min(interval, 24 hours) of the run, its hour drawn from the VPN login curve; each next one due one interval after the previous actual start and started within a window of min(interval / 4, 6 hours) centred on the due time, so gaps stay within the interval plus or minus half that window (measured 21.0-26.9 h at the default); missed episodes are not caught up), one VPN user's home address opens a PPTP control connection to the NGFW, fails 4 or 5 VPN authorizations (utm-vpn-authd Found) and then authorizes as that user, within 30 seconds to about 5 minutes and below the six-failure ban threshold. The user never repeats the previous episode's; every user, address, jail and action also occurs in background, and only the full order is episode-only.",
  generatorId: 'ideco-ngfw',
  eventTypes: [
    {
      id: 'traffic_accept',
      description: 'traffic-journal flow with result:accept',
      frequency: '72.8% measured share (72.8% background only)',
      category: 'network',
    },
    {
      id: 'traffic_drop',
      description: 'traffic-journal flow with result:drop',
      frequency: '25.1% measured share (25.1% background only)',
      category: 'network',
    },
    {
      id: 'fail2ban_found',
      description: 'fail2ban INFO [jail] Found for a failed attempt',
      frequency: '1.21% measured share (1.16% background only)',
      category: 'intrusion_detection',
    },
    {
      id: 'vpn_authorized',
      description: 'ideco-vpn-authd tunnel subnet authorized as a user',
      frequency: '0.72% measured share (0.74% background only)',
      category: 'authentication',
    },
    {
      id: 'fail2ban_ban',
      description: 'fail2ban NOTICE [jail] Ban after six Found in 900 s',
      frequency: '0.09% measured share (0.09% background only)',
      category: 'intrusion_detection',
    },
    {
      id: 'fail2ban_unban',
      description: 'fail2ban NOTICE [jail] Unban 2700 s after a Ban',
      frequency: '0.09% measured share (0.09% background only)',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'Independent random processes weighted by hour of day (UTC): 60 VPN users by default, each with one or two home addresses and a skewed activity weight, log in about 2.5 times a day over a PPTP control connection (inp, port 1723), may fail a few times first and then produce flows from a 10.128.0.x tunnel address to internal servers. About 40 internet addresses run brute-force campaigns against utm-vpn-authd, utm-ssh or utm-web-interface, administrators occasionally mistype the web-interface password, and LAN browsing, DNS to the NGFW and internet port scans make up the traffic.',
    'fail2ban is applied consistently: six Found for one address and jail within 900 s produce Ban, a banned address produces no attempts in that jail, and Unban follows 2700 s later plus a few seconds. The 6 failures / 15 minutes / 45 minutes thresholds come from the v21 guide and are fixed, so ban durations are nearly constant in both modes.',
    'Every user, address, user/address pair, jail and action of the chain also occurs in background of both modes, including successes after one to three failures and failure runs of four or more without success. An ordinary login that would succeed from an address with four VPN failures in the last 900 s fails instead; such near-ban addresses attempt less often than just after that window, a fail2ban effect.',
    'Daily episodes stay in login hours: in the measured default run all 10 started between 08:00 and 20:00 UTC, and within one run daily starts usually span about 5.5 h. At intervals of 8 hours or less starts move around the clock (10 of 31 between 00:00 and 07:00 UTC with an 8-hour interval, against 6% of ordinary logins).',
    'The guide traffic-journal example is cut off, so 19 of the 39 documented keys are emitted in a plausible order without NAT, user, location, cluster and VCE keys, and the random 16-digit flow_id format is undocumented. Unban wording is inferred; only the documented successful pptp authorization is produced, VPN failures appear only as fail2ban Found and disconnections are not modeled.',
    'At most one record per second, with ordinary traffic thinned to about 0.25 records per second; UTC timestamps and no Syslog transport framing. No Elastic integration exists, so the ECS mapping is inferred; zone names, rule IDs and security profile names are examples of one deployment, not vendor defaults.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring VPN password-guessing episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from one episode start to the next due time, 1 to 8,760',
    },
    {
      name: 'ngfw_host',
      defaultValue: 'ideco-ngfw',
      description: 'Hostname in the Syslog header',
    },
    {
      name: 'ngfw_ip',
      defaultValue: '10.50.0.1',
      description:
        'NGFW address written to observer.ip, destination of inp traffic',
    },
    {
      name: 'vpn_user_count',
      defaultValue: '60',
      description: 'Number of VPN users, 10 to 200',
    },
    {
      name: 'vpn_type',
      defaultValue: 'pptp',
      description: 'Value of type in VPN authorization messages',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final record of the first episode in a 240-hour default run',
      json: String.raw`{"@timestamp": "2026-09-01T19:20:09+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "vpn_authorized", "category": ["authentication", "network"], "dataset": "ideco.ngfw_syslog", "kind": "event", "original": "2026-09-01T19:20:09+00:00 ideco-ngfw ideco-vpn-authd - - - Subnet 10.128.0.87/32 is authorized as user \u0027v.zaitsev\u0027. Connection made from \u0027203.0.113.72\u0027, type \u0027pptp\u0027", "outcome": "success", "type": ["start", "allowed"]}, "ideco": {"ngfw": {"fields": {"connected_from": "203.0.113.72", "subnet": "10.128.0.87/32", "type": "pptp", "user": "v.zaitsev"}, "service": "ideco-vpn-authd"}}, "message": "Subnet 10.128.0.87/32 is authorized as user \u0027v.zaitsev\u0027. Connection made from \u0027203.0.113.72\u0027, type \u0027pptp\u0027", "observer": {"hostname": "ideco-ngfw", "ip": "10.50.0.1", "product": "NGFW Novum", "vendor": "Ideco"}, "process": {"name": "ideco-vpn-authd"}, "related": {"ip": ["203.0.113.72", "10.128.0.87"], "user": ["v.zaitsev"]}, "source": {"ip": "203.0.113.72"}, "user": {"name": "v.zaitsev"}}`,
    },
  ],
};
