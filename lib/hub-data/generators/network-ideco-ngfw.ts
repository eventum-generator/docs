/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const networkIdecoNgfw: GeneratorMeta = {
  slug: 'network-ideco-ngfw',
  displayName: 'Ideco NGFW Novum Syslog',
  category: 'network',
  description:
    "Syslog of one Ideco NGFW Novum v22 that publishes a PPTP VPN to remote users and faces ordinary internet noise: traffic-journal flows, ideco-vpn-authd authorizations and fail2ban Found, Ban and Unban, each native line kept in event.original inside an ECS JSON envelope. About 27,000 records a day on UTC hour-of-day curves from 300 VPN users, brute-force campaigns, administrators and LAN and internet traffic. CEF is not modeled. Recurring episodes show a guessed VPN password: one user's home address fails four or five VPN authorizations, then authorizes as that user.",
  dataSource:
    'Ideco NGFW Novum v22 Syslog: traffic-journal, ideco-vpn-authd and fail2ban',
  format: ['JSON', 'ECS', 'Syslog'],
  eventCount: 6,
  templateCount: 1,
  highlights: [
    'Native v22 Syslog line in event.original',
    'About 27,000 records a day from 300 VPN users, brute-force campaigns and LAN and internet traffic',
    'Recurring VPN password-guessing chain below the ban threshold',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "One VPN user's home address opens a PPTP control connection to the NGFW (inp, port 1723), fails 4 or 5 VPN authorizations (fail2ban utm-vpn-authd Found) and then authorizes as that user, followed by session flows from the tunnel address to internal servers. The chain lasts about half a minute to three minutes, below the six-failure ban threshold. The first episode starts at a random time within the first min(interval, 24 hours) of the data, its hour drawn from the VPN login curve. Each later episode is due anomaly_interval_hours (default 24, minimum 1) after the actual start of the previous one and starts in a window of min(interval / 4, 6 hours) centred on the due time, weighted towards busy login hours, so daily episodes fall in busy hours; at intervals of 8 hours or less, episodes move around the clock. Missed episodes are not caught up. The user is drawn with the ordinary user weights, never the previous episode's user and never a user whose address has a VPN failure in the last 15 minutes or an active ban. Every user, address, jail and action of the chain also occurs in ordinary data; only the full order is episode-only.",
  generatorId: 'ideco-ngfw',
  eventTypes: [
    {
      id: 'traffic_accept',
      description: 'traffic-journal flow with result:accept',
      frequency: '79.04% / 78.99% of records (anomaly_mode true / false)',
      category: 'network',
    },
    {
      id: 'traffic_drop',
      description: 'traffic-journal flow with result:drop',
      frequency: '16.50% / 16.43% of records (anomaly_mode true / false)',
      category: 'network',
    },
    {
      id: 'vpn_authorized',
      description: 'ideco-vpn-authd tunnel subnet authorized as a user',
      frequency: '3.31% / 3.34% of records (anomaly_mode true / false)',
      category: 'authentication',
    },
    {
      id: 'fail2ban_found',
      description: 'fail2ban INFO [jail] Found for a failed attempt',
      frequency: '0.99% / 1.06% of records (anomaly_mode true / false)',
      category: 'intrusion_detection',
    },
    {
      id: 'fail2ban_ban',
      description: 'fail2ban NOTICE [jail] Ban after six Found in 900 s',
      frequency: '0.08% / 0.09% of records (anomaly_mode true / false)',
      category: 'intrusion_detection',
    },
    {
      id: 'fail2ban_unban',
      description: 'fail2ban NOTICE [jail] Unban 2700 s after a Ban',
      frequency: '0.08% / 0.09% of records (anomaly_mode true / false)',
      category: 'intrusion_detection',
    },
  ],
  realismFeatures: [
    'VPN users (300 by default, each with one home address and an activity weight between 0.7 and 2.5) log in about three times a day over a PPTP control connection (inp, port 1723), may fail first (each failure is a utm-vpn-authd Found), then authorize and produce a few flows (median 6, about 90 s apart) from a 10.128.0-3.x tunnel address to internal servers. 96.9% of ordinary logins succeed at once, 2.5% after one failure and 0.6% after two. About 1% of logins, more on some days than others, use a stale saved password and fail three to eight times: after three failures the user types the right password, after more the user gives up and in 60% of cases returns later (median 40 minutes), usually succeeding at once. About 4% of logins see at least one failure, and about 8-11% of VPN authorization attempts fail.',
    'About 40 brute-force campaigns a day from 40 internet addresses against utm-vpn-authd, utm-ssh or utm-web-interface, each address with its own jail preferences; a campaign makes about five attempts in median, a few seconds apart, and long campaigns end in a ban. Administrators mistype the web-interface password about six times a day, one to four failures from one of three LAN workstations. Traffic is LAN browsing (7% dropped), name and time lookups on the NGFW, and internet connections to NGFW ports, half of them from the brute-force addresses.',
    'About 27,000 records a day on UTC hour-of-day curves: LAN traffic from 296 records an hour at 21:00-06:00 to 1,432 at 08:00-17:00, VPN logins from 4 to 76 an hour, and internet traffic 250 an hour around the clock (each hour varying by up to 10%; daily LAN and VPN counts vary by up to 3%). Failures, authorizations, session flows and fail2ban records take the place of traffic records at their time, so they do not add to the volume.',
    'fail2ban is consistent: six Found for one address and jail within 900 s produce Ban (3 s later in median, at most about 30 s), a banned address makes no attempts in that jail, and Unban follows 2700 s later plus a few seconds. The 6 failures / 15 minutes / 45 minutes thresholds come from the v21 guide and apply to every jail, so ban durations are nearly constant; a real NGFW writes a ban within milliseconds of the failure that triggers it.',
    "Ordinary data contains every user, address, user/address pair, jail and action of the chain, including failure runs of four or more without success and successes after one to three failures. Only the full order is absent: when a returning user's address already has four VPN failures in the last 15 minutes, that attempt fails once more instead of authorizing (a few times a week). With anomaly_mode true, counts of four- and five-failure VPN runs, of authorizations after failures and of VPN control connections are about one per episode higher.",
    'The guide traffic-journal example is cut off after ips_pro, so 19 of the 39 documented keys are emitted in a plausible order without NAT, user, location, cluster and VCE keys, and the random 16-digit flow_id format is undocumented. Unban wording is inferred; only the documented successful pptp authorization is produced, failed VPN authorizations appear only as fail2ban Found, and VPN disconnections are not modeled.',
    'Records of one login, campaign or ban are seconds apart; timestamps have whole-second precision and are UTC, and Syslog transport framing is not modeled. Rates and failure shares are synthetic. No Elastic integration exists, so the ECS mapping is inferred. Home addresses are in 198.18.0.0/15, internet addresses in documentation ranges and internal ones in RFC 1918 networks; zone names, rule IDs and security profile names are examples of one deployment, not vendor defaults.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring VPN password-guessing episodes; false emits ordinary activity only',
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
      description: 'NGFW address, destination of inp traffic',
    },
    {
      name: 'vpn_user_count',
      defaultValue: '300',
      description:
        'Number of VPN users taken from samples/vpn_users.csv, 100 to 500',
    },
    {
      name: 'vpn_type',
      defaultValue: 'pptp',
      description: 'Value of type in VPN authorization messages',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final record of the first episode (vpn_authorized)',
      json: String.raw`{"@timestamp": "2026-09-01T11:26:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "vpn_authorized", "category": ["authentication", "network"], "dataset": "ideco.ngfw_syslog", "kind": "event", "original": "2026-09-01T11:26:00+00:00 ideco-ngfw ideco-vpn-authd - - - Subnet 10.128.0.68/32 is authorized as user \u0027p.vlasov\u0027. Connection made from \u0027198.19.71.123\u0027, type \u0027pptp\u0027", "outcome": "success", "type": ["start", "allowed"]}, "ideco": {"ngfw": {"fields": {"connected_from": "198.19.71.123", "subnet": "10.128.0.68/32", "type": "pptp", "user": "p.vlasov"}, "service": "ideco-vpn-authd"}}, "message": "Subnet 10.128.0.68/32 is authorized as user \u0027p.vlasov\u0027. Connection made from \u0027198.19.71.123\u0027, type \u0027pptp\u0027", "observer": {"hostname": "ideco-ngfw", "ip": "10.50.0.1", "product": "NGFW Novum", "vendor": "Ideco"}, "process": {"name": "ideco-vpn-authd"}, "related": {"ip": ["198.19.71.123", "10.128.0.68"], "user": ["p.vlasov"]}, "source": {"ip": "198.19.71.123"}, "user": {"name": "p.vlasov"}}`,
    },
  ],
};
