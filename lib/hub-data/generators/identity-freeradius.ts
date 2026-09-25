import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeradius: GeneratorMeta = {
  slug: 'identity-freeradius',
  displayName: 'FreeRADIUS Linelog Authentication',
  category: 'identity',
  description:
    'FreeRADIUS authentication decisions and accounting Start/Stop records from documented linelog formats.',
  dataSource: 'FreeRADIUS 4.0 linelog',
  format: ['JSON', 'ECS', 'Text'],
  eventCount: 4,
  templateCount: 9,
  highlights: [
    'Native linelog text in event.original',
    'Paired routine accounting records',
    'NAS client and station correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three rejects for one user and station are followed by Login OK, Connect, and Disconnect on the same NAS port.',
  generatorId: 'freeradius',
  eventTypes: [
    {
      id: 'Login OK',
      description: 'RADIUS authentication accepted',
      frequency: '70% of routine attempts',
      category: 'authentication',
    },
    {
      id: 'Login incorrect',
      description: 'RADIUS authentication rejected',
      frequency: '30% of routine attempts',
      category: 'authentication',
    },
    {
      id: 'Connect',
      description: 'Accounting session started',
      frequency: 'after each routine acceptance',
      category: 'session',
    },
    {
      id: 'Disconnect',
      description: 'Accounting session stopped',
      frequency: 'after Connect',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Message text uses documented linelog substitutions',
    'Accounting records follow successful routine authentication',
    'User, Calling-Station-Id, NAS client, and NAS port link the anomaly chain',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include reject-to-success chain; false emits only background',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine attempts between chains',
    },
    {
      name: 'radius_host',
      defaultValue: 'radius-01',
      description: 'RADIUS server hostname',
    },
    {
      name: 'nas_client',
      defaultValue: 'wifi-controller-01',
      description: 'RADIUS client short name',
    },
    {
      name: 'ordinary_user',
      defaultValue: 'employee01',
      description: 'Routine user',
    },
    {
      name: 'ordinary_station',
      defaultValue: '02-11-22-33-44-55',
      description: 'Routine station MAC',
    },
    {
      name: 'unusual_user',
      defaultValue: 'admin01',
      description: 'Chain user',
    },
    {
      name: 'unusual_station',
      defaultValue: '02-AA-BB-CC-DD-EE',
      description: 'Chain station MAC',
    },
    {
      name: 'nas_port',
      defaultValue: '12',
      description: 'NAS port',
    },
    {
      name: 'called_station',
      defaultValue: '02-66-77-88-99-AA',
      description: 'Accounting called-station ID',
    },
  ],
  sampleOutputs: [
    {
      title: 'FreeRADIUS Linelog Authentication anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:32:17+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "accept", "category": ["authentication"], "dataset": "freeradius.linelog", "kind": "event", "module": "freeradius", "original": "Login OK: [admin01] (from wifi-controller-01 port 12 cli 02-AA-BB-CC-DD-EE)", "outcome": "success", "type": ["start"]}, "host": {"name": "radius-01"}, "message": "Login OK: [admin01] (from wifi-controller-01 port 12 cli 02-AA-BB-CC-DD-EE)", "radius": {"calling_station_id": "02-AA-BB-CC-DD-EE", "client_shortname": "wifi-controller-01", "nas_port": 12}, "service": {"name": "radiusd"}, "source": {"mac": "02-AA-BB-CC-DD-EE"}, "user": {"name": "admin01"}}`,
    },
  ],
};
