import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFortinetFortipam: GeneratorMeta = {
  slug: 'identity-fortinet-fortipam',
  displayName: 'Fortinet FortiPAM Secret Events',
  category: 'identity',
  description:
    'Secret-request and clear-text-view logs of one Fortinet FortiPAM appliance, for testing privileged-access analytics. Records are ECS JSON with the native FortiPAM key-value message kept byte-for-byte in event.original and parsed under fortinet.fortipam.* with its native key names. Sixty users in seven roles work with 43 secrets in seven folders, about 2,200 records a day on a UTC working-day curve. Recurring episodes show clear-text password harvesting after an access request.',
  dataSource:
    'Fortinet FortiPAM secret logs 2304064604 (secret request created) and 2303064603 (clear text view allowed)',
  format: ['JSON', 'ECS', 'KV'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Native FortiPAM key-value message in event.original',
    '60 users in seven roles, 43 secrets in seven folders',
    'Recurring request-then-harvest chain within 30 minutes',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "About every 24 hours by default, one user requests an approval-gated secret, views its clear text 2-23 minutes later (median 15), then views the clear text of five more distinct secrets, with ordinary re-views of already opened secrets possibly in between, all within 30 minutes of the request (23-29 minutes, 7-18 records, median 8). The first episode starts within the first min(interval, 24 h) at a time drawn from the hourly volume; each later one is due one interval after the previous episode's actual start and starts in a window of min(interval / 4, 6 h) centred on that due time, leaning towards busy hours. Missed time is never caught up. Episodes start only between 07:00 and 19:30 UTC; when the whole window falls outside those hours, the episode starts at the next 07:00-08:00, so gaps are 21.6-26.8 h at the default and 10.5-21.9 h with 12 h. The user is one of six busy users and never the previous episode's; the first secret is one the user often requests and never the previous episode's first secret. Every event type, user and user-secret pair of an episode also occurs in ordinary activity; only the complete sequence within 30 minutes is episode-only.",
  generatorId: 'fortipam',
  eventTypes: [
    {
      id: '2303064603',
      description: 'clear-text-view: clear text view allowed',
      frequency: '90.4% of records',
      category: 'iam',
    },
    {
      id: '2304064604',
      description: 'request: secret request created',
      frequency: '9.6% of records',
      category: 'iam',
    },
  ],
  realismFeatures: [
    "Each user opens sessions at random, weighted per user: most sessions view one to five secret passwords in clear text, sometimes opening the previous one again; about one in five starts with a request for an approval-gated secret, usually followed by a view of it after approval and sometimes by more views or a second request. A user's secrets come from the role's folders, weighted by folder and by the secret's popularity.",
    'About 2,200 records a day: 15 an hour at 00:00-07:00 and 21:00-24:00 UTC, 81 at 07:00-08:00 and 18:00-21:00, 173 at 08:00-18:00, with about 3% variation from day to day. Users are present in proportion to this curve, and night records come from the same users (on-call work). The busiest users log about 80 records a day, the quietest about 16.',
    "A user's consecutive records are a median of about 4 minutes apart (10% within 40 seconds), never a sub-second burst: seconds to minutes apart in office hours and several minutes apart at night. A view of a requested secret follows its request after a median of about 9 minutes (10% within 2 minutes); 78% of requests are followed by such a view.",
    'Requests, a request followed by a view of the same secret, sessions of several distinct views, re-views and second requests all occur in ordinary work of both modes, and each episode user requests each possible first secret about twice a day or more and opens each of the other episode secrets at least three times a day. In ordinary work, a user who views a requested secret views at most four other distinct secrets within 30 minutes of the request; the same sequence spread over 30-60 minutes occurs about 20 times a day.',
    "Episodes happen only between 07:00 and 19:30 UTC and only for six busy users, with secrets those users request and open often; with an interval that is not a multiple of 24 h, episodes due at night move to 07:00-08:00, so some gaps exceed the interval. Each episode adds its own records, so counts of the chain parts are about one per episode higher with anomaly_mode true. From an episode's request until 30 minutes after it, the user has no records other than the episode's; the last episode view comes 1-7 minutes before the end of that time. A match does not prove misuse: the documented logs carry no approval decision, source address or view reason.",
    'Only the two log IDs with published raw lines are modeled: secret request created (FortiSIEM FortiPAM sample) and clear text view allowed (FortiPAM 1.7.0). Request approval and denial, launches, check-in/out and password changes are absent. Each record keeps the key set and order of its source example, so clear-text views carry no devname/devid, and no syslog envelope is emitted.',
    'uuid is assumed to be the secret object UUID, stable per secret; starttime is the request minute and expirytime a preset duration of 30 min to 8 h; agent is always GUI and the time zone is UTC. Volumes, shares, session shapes and the hour curve are synthetic choices, not measured production frequencies, and the curve repeats every day with no weekday cycle. Secret, account and address names are fictional, on RFC 1918 addresses. No Elastic integration exists, so the ECS projection is inferred.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add harvesting episodes to the background; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Hours between episodes by source time, 2 to 8,760',
    },
    {
      name: 'device_name',
      defaultValue: 'FPAVULTM1234567',
      description: 'Appliance name, written to devname/devid and observer.*',
    },
  ],
  sampleOutputs: [
    {
      title: 'Request that opens an episode, from a default-mode run',
      json: String.raw`{"@timestamp": "2026-09-01T16:03:57.422325Z", "ecs": {"version": "8.17.0"}, "event": {"action": "request", "category": ["iam"], "code": "2304064604", "dataset": "fortinet.fortipam", "kind": "event", "module": "fortinet", "original": "date=2026-09-01 time=16:03:57 devname=\"FPAVULTM1234567\" devid=\"FPAVULTM1234567\" eventtime=1788278637422325394 tz=\"+0000\" logid=\"2304064604\" type=\"secret\" subtype=\"secret-request\" eventtype=\"secret-request\" action=\"pass\" operation=\"request\" secretid=777 secret=\"aws-prod-root\" account=\"root\" uuid=\"d45fdd32-a650-594a-9758-3f8f1f70a449\" user=\"s.lewis\" starttime=\"2026-09-01 16:03:00\" expirytime=\"2026-09-01 16:33:00\" msg=\"Created secret request.\"", "outcome": "success", "type": ["creation"]}, "fortinet": {"fortipam": {"account": "root", "action": "pass", "eventtime": 1788278637422325394, "eventtype": "secret-request", "expirytime": "2026-09-01 16:33:00", "logid": "2304064604", "msg": "Created secret request.", "operation": "request", "secret": "aws-prod-root", "secretid": 777, "starttime": "2026-09-01 16:03:00", "subtype": "secret-request", "type": "secret", "tz": "+0000", "user": "s.lewis", "uuid": "d45fdd32-a650-594a-9758-3f8f1f70a449"}}, "observer": {"hostname": "FPAVULTM1234567", "product": "FortiPAM", "serial_number": "FPAVULTM1234567", "vendor": "Fortinet"}, "related": {"user": ["s.lewis"]}, "user": {"name": "s.lewis"}}`,
    },
  ],
};
