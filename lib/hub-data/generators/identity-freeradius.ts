/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs match documented generator defaults and samples. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeradius: GeneratorMeta = {
  slug: 'identity-freeradius',
  displayName: 'FreeRADIUS Linelog Authentication',
  category: 'identity',
  description:
    'FreeRADIUS 3.2.10 custom file-linelog authentication and accounting, with measured session durations and recurring reject-to-session episodes.',
  dataSource: 'FreeRADIUS 3.2.10 file linelog',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Explicit custom authentication linelog profile',
    'Twenty background identities and bounded active sessions',
    'Recurring episodes at least three hours apart',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After at least 250 routine decisions, three rejects, an accept and accounting Start occur for one ordinary user/station. Stop follows at least 15 minutes later with actual elapsed duration. Episodes recur at least three hours apart when the target station is free; each has a separate Start/Stop pair reconstructed without an invented session ID.',
  generatorId: 'freeradius',
  eventTypes: [
    {
      id: 'Accepted user',
      description: 'Authentication accepted',
      frequency: '70% of routine decisions',
      category: 'authentication',
    },
    {
      id: 'Rejected user',
      description: 'Authentication rejected',
      frequency: '30% of routine decisions',
      category: 'authentication',
    },
    {
      id: 'Connect',
      description: 'Accounting session started after acceptance',
      frequency: 'After each acceptance',
      category: 'session',
    },
    {
      id: 'Disconnect',
      description: 'Accounting session stopped after its actual duration',
      frequency: 'After 10–30 minutes or a later due tick',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Authentication requires the custom linelog instance and post-auth calls shown in README; accounting uses tagged Start/Stop formats.',
    'Authentication and accounting use separate files; event.original is one bare file line with configured host/client enrichment outside it.',
    'One active session per station prevents overlaps; Stops carry measured elapsed time and a full pool may cause a silent tick.',
    'BLOCKED_RAW_EVIDENCE: a running 3.2.10 daemon capture is missing; this custom file profile is not a validated syslog-normalizer input.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit recurring chains',
    },
    {
      name: 'anomaly_after_attempts',
      defaultValue: '250',
      description:
        'Minimum routine authentication decisions before the first chain can start',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '10800',
      description:
        'Minimum time between chain starts; use a positive value above 1800 seconds',
    },
    {
      name: 'radius_host',
      defaultValue: 'radius-01',
      description: 'ECS host enrichment',
    },
    {
      name: 'nas_client',
      defaultValue: 'wifi-controller-01',
      description: 'ECS RADIUS client short-name enrichment',
    },
    {
      name: 'ordinary_user',
      defaultValue: 'employee01',
      description: 'First background user',
    },
    {
      name: 'ordinary_station',
      defaultValue: '02-11-22-33-44-55',
      description: 'First background calling station',
    },
    {
      name: 'ordinary_nas_port',
      defaultValue: '12',
      description: 'First background NAS port',
    },
    {
      name: 'ordinary_framed_ip',
      defaultValue: '10.50.0.45',
      description: 'First background framed IP',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin01',
      description: 'Correlation target, also present in background',
    },
    {
      name: 'unusual_station',
      defaultValue: '02-AA-BB-CC-DD-EE',
      description: 'Target calling station',
    },
    {
      name: 'unusual_nas_port',
      defaultValue: '23',
      description: 'Target NAS port',
    },
    {
      name: 'unusual_framed_ip',
      defaultValue: '10.50.0.46',
      description: 'Target framed IP',
    },
    {
      name: 'called_station',
      defaultValue: '02-66-77-88-99-AA',
      description: 'Accounting called station',
    },
  ],
  sampleOutputs: [
    {
      title: 'FreeRADIUS 3.2.10 accounting Stop from generator output',
      json: String.raw`{"@timestamp": "2026-09-27T05:41:00+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "disconnect", "category": ["session"], "dataset": "freeradius.linelog", "duration": 900000000000, "kind": "event", "module": "freeradius", "original": "Disconnect: [admin01] (did 02-66-77-88-99-AA cli 02-AA-BB-CC-DD-EE port 23 ip 10.50.0.46) 900 seconds", "outcome": "success", "type": ["end"]}, "host": {"name": "radius-01"}, "message": "Disconnect: [admin01] (did 02-66-77-88-99-AA cli 02-AA-BB-CC-DD-EE port 23 ip 10.50.0.46) 900 seconds", "radius": {"acct_session_time": 900, "acct_status_type": "Stop", "called_station_id": "02-66-77-88-99-AA", "calling_station_id": "02-AA-BB-CC-DD-EE", "client_shortname": "wifi-controller-01", "framed_ip_address": "10.50.0.46", "nas_port": 23}, "service": {"name": "radiusd"}, "source": {"ip": "10.50.0.46", "mac": "02-AA-BB-CC-DD-EE"}, "user": {"name": "admin01"}}`,
    },
  ],
};
