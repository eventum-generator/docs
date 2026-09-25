import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneCTechjournal: GeneratorMeta = {
  slug: 'application-1c-techjournal',
  displayName: '1C:Enterprise Technological Log',
  category: 'application',
  description:
    'Platform calls, transaction locks, timeouts, and exceptions from the 1C:Enterprise technological log.',
  dataSource: '1C:Enterprise 8.3 technological log JSON',
  format: ['JSON', 'ECS'],
  eventCount: 5,
  templateCount: 5,
  highlights: [
    'Native technological-log JSON in event.original',
    'CALL and SCALL activity',
    'Transaction lock diagnostics',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One client session has a slower CALL, then TLOCK, TTIMEOUT, and EXCP for the same infobase and thread.',
  generatorId: 'onec-techjournal',
  eventTypes: [
    {
      id: 'SCALL',
      description: 'Outbound server call',
      frequency: '80% baseline',
      category: 'process',
    },
    {
      id: 'CALL',
      description: 'Incoming server call',
      frequency: '18% baseline',
      category: 'process',
    },
    {
      id: 'TLOCK',
      description: 'Managed transaction lock check',
      frequency: '2% baseline',
      category: 'database',
    },
    {
      id: 'TTIMEOUT',
      description: 'Managed transaction lock timeout',
      frequency: 'chain only',
      category: 'database',
    },
    {
      id: 'EXCP',
      description: 'Platform exception after timeout',
      frequency: 'chain only',
      category: 'process',
    },
  ],
  realismFeatures: [
    '14 documented fields from the vendor SCALL JSON sample are covered',
    'Native JSON record retained under one_c.techjournal',
    'ClientID, SessionID, OSThread, and user link the lock-failure sequence',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include the lock-failure chain; false emits only background',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '200',
      description: 'Routine events between chains',
    },
    {
      name: 'host_name',
      defaultValue: 'onec-app-01',
      description: 'Application host',
    },
    {
      name: 'infobase',
      defaultValue: 'accounting',
      description: 'Infobase name',
    },
    {
      name: 'process_name',
      defaultValue: 'rphost',
      description: '1C process name',
    },
    {
      name: 'routine_user',
      defaultValue: 'accountant01',
      description: 'Routine actor',
    },
    {
      name: 'unusual_user',
      defaultValue: 'batch_admin',
      description: 'Chain actor',
    },
    {
      name: 'routine_client_id',
      defaultValue: '8',
      description: 'Routine client ID',
    },
    {
      name: 'unusual_client_id',
      defaultValue: '92',
      description: 'Chain client ID',
    },
  ],
  sampleOutputs: [
    {
      title: '1C:Enterprise Technological Log anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:25:32+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "TTIMEOUT", "category": ["database"], "dataset": "1c.techjournal", "kind": "event", "original": "{\"ClientID\": \"92\", \"OSThread\": \"15968\", \"Regions\": \"Document.SalesOrder\", \"SessionID\": \"421\", \"Usr\": \"batch_admin\", \"WaitConnections\": \"ClientID=88\", \"depth\": \"0\", \"duration\": \"900000\", \"level\": \"ERROR\", \"name\": \"TTIMEOUT\", \"p:processName\": \"accounting\", \"process\": \"rphost\", \"ts\": \"2026-09-25T12:25:32.000000\"}", "type": ["error"]}, "host": {"name": "onec-app-01"}, "one_c": {"techjournal": {"ClientID": "92", "OSThread": "15968", "Regions": "Document.SalesOrder", "SessionID": "421", "Usr": "batch_admin", "WaitConnections": "ClientID=88", "depth": "0", "duration": "900000", "level": "ERROR", "name": "TTIMEOUT", "p:processName": "accounting", "process": "rphost", "ts": "2026-09-25T12:25:32.000000"}}, "process": {"name": "rphost"}, "user": {"name": "batch_admin"}}`,
    },
  ],
};
