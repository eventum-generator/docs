import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFortinetFortipam: GeneratorMeta = {
  slug: 'identity-fortinet-fortipam',
  displayName: 'Fortinet FortiPAM Secret Events',
  category: 'identity',
  description:
    'Secret-request and clear-text-view logs of one Fortinet FortiPAM appliance, for testing privileged-access analytics. Records are ECS JSON with the native FortiPAM key-value message kept byte-for-byte in event.original and parsed under fortinet.fortipam.* with its native key names. Sixty users in seven roles work with 43 secrets in seven folders. Recurring episodes show clear-text password harvesting after an access request.',
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
    "About every 24 hours by default (the first one within the first min(interval, 24 h) of generation, at a time drawn from the background hour-of-day load; each later one due one interval after the previous episode's actual start and started in a window of min(interval / 4, 6 h) centred on that due time, so gaps stay within the interval plus or minus half that window (measured 22.5-26.1 h at the default); missed time is never caught up), one user requests an approval-gated secret, views its clear text after an approval delay, then views five more distinct secrets from their own folders, all within 30 minutes of the request (measured 4-28 minutes). The user and the first secret never repeat the previous episode's; every element also occurs in background, and only the complete sequence within 30 minutes is episode-only.",
  generatorId: 'fortipam',
  eventTypes: [
    {
      id: '2303064603',
      description: 'clear-text-view: clear text view allowed',
      frequency: '90.2% measured background share',
      category: 'iam',
    },
    {
      id: '2304064604',
      description: 'request: secret request created',
      frequency: '9.8% measured background share',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Each user opens sessions at random, weighted per user and by the hour of day: most sessions view one to five secret passwords in clear text; about one in five starts with a request for an approval-gated secret, usually followed by a view of it after approval and sometimes by more views or a second request. Volume is about 700 records per day, mostly 08:00-18:00 UTC; shares, volumes and session shapes are synthetic choices, not measured production frequencies.',
    'Every chain element also occurs in background of both modes, including near misses (a request, a view and four more distinct secrets); 57 of 60 chain user-secret pairs in the default capture and 122 of 126 in the 12 h capture also occur outside the chains. An ordinary view that would complete the sequence reopens a secret already in it instead, at the same time, and complete background sequences show no pile-up just past the 30-minute window.',
    'Episode hours follow the background only loosely because each start is anchored to the previous one: at the default 24 h all 10 measured starts fell between 13:51 and 16:37 UTC, while with 12 h, 9 of 21 starts fell at 21:00-07:00, where the background has 8% of its records.',
    'Only the two log IDs with published raw lines are modeled: secret request created (FortiSIEM FortiPAM sample) and clear text view allowed (FortiPAM 1.7.0). Request approval and denial, launches, check-in/out and password changes are absent. Each record keeps the key set and order of its source example, so clear-text views carry no devname/devid, and no syslog envelope is emitted.',
    'uuid is assumed to be the secret object UUID, stable per secret; starttime is the request minute and expirytime a preset duration of 30 min to 8 h; agent is always GUI and the time zone is UTC. A match does not prove misuse: the documented logs carry no approval decision, source address or view reason. No Elastic integration exists, so the ECS projection is inferred.',
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
      title: 'Request that opens an episode, from a default-mode capture',
      json: String.raw`{"@timestamp": "2026-09-16T15:37:37.824160Z", "ecs": {"version": "8.17.0"}, "event": {"action": "request", "category": ["iam"], "code": "2304064604", "dataset": "fortinet.fortipam", "kind": "event", "module": "fortinet", "original": "date=2026-09-16 time=15:37:37 devname=\"FPAVULTM1234567\" devid=\"FPAVULTM1234567\" eventtime=1789573057824160174 tz=\"+0000\" logid=\"2304064604\" type=\"secret\" subtype=\"secret-request\" eventtype=\"secret-request\" action=\"pass\" operation=\"request\" secretid=564 secret=\"ws-laps-hr\" account=\"localadmin\" uuid=\"3b844f7c-a4e3-52dd-9fb1-0a9ec1309254\" user=\"k.reyes\" starttime=\"2026-09-16 15:37:00\" expirytime=\"2026-09-16 16:07:00\" msg=\"Created secret request.\"", "outcome": "success", "type": ["creation"]}, "fortinet": {"fortipam": {"account": "localadmin", "action": "pass", "eventtime": 1789573057824160174, "eventtype": "secret-request", "expirytime": "2026-09-16 16:07:00", "logid": "2304064604", "msg": "Created secret request.", "operation": "request", "secret": "ws-laps-hr", "secretid": 564, "starttime": "2026-09-16 15:37:00", "subtype": "secret-request", "type": "secret", "tz": "+0000", "user": "k.reyes", "uuid": "3b844f7c-a4e3-52dd-9fb1-0a9ec1309254"}}, "observer": {"hostname": "FPAVULTM1234567", "product": "FortiPAM", "serial_number": "FPAVULTM1234567", "vendor": "Fortinet"}, "related": {"user": ["k.reyes"]}, "user": {"name": "k.reyes"}}`,
    },
  ],
};
