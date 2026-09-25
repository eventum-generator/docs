import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneCTechjournal: GeneratorMeta = {
  slug: 'application-1c-techjournal',
  displayName: '1C:Enterprise Technological Log',
  category: 'application',
  description:
    '1C:Enterprise 8.3.27 technological-log JSON for platform calls, managed locks and exceptions.',
  dataSource: '1C:Enterprise 8.3.27 technological log JSON',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 4,
  highlights: [
    'Native JSON preserved in event.original and parsed under one_c.techjournal',
    'SCALL, CALL, TLOCK and EXCP background activity',
    'One correlated managed-lock wait sequence',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'After at least 200 background records and an idle-thread gap, one TLOCK wait on another connection is followed by a managed-lock EXCP and the enclosing CALL completion. The same sessions, lock region and event types also occur in background.',
  generatorId: 'onec-techjournal',
  eventTypes: [
    {
      id: 'SCALL',
      description: 'Outgoing remote call',
      frequency: '79% background selection weight',
      category: 'platform',
    },
    {
      id: 'CALL',
      description: 'Incoming remote call',
      frequency: '17% background selection weight',
      category: 'platform',
    },
    {
      id: 'TLOCK',
      description: 'Managed transaction lock operation or wait',
      frequency: '3% background selection weight',
      category: 'locking',
    },
    {
      id: 'EXCP',
      description: 'Platform exception',
      frequency: '1% background selection weight',
      category: 'platform',
    },
  ],
  realismFeatures: [
    'All 14 fields of the tagged 8.3.27 SCALL JSON example are modeled; native values are JSON strings and duration is in microseconds.',
    'Two user sessions share stable client, connection and thread identifiers across ordinary traffic and the one-time sequence.',
    'The blocker is another t:connectID; the enclosing CALL duration spans the TLOCK wait and EXCP.',
    'Exact 8.3.27 JSON records for CALL, TLOCK and EXCP remain unverified against raw first-party output.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Enable the one-time lock sequence; false emits background only',
    },
    {
      name: 'anomaly_after_events',
      defaultValue: '200',
      description:
        'Minimum background records before an idle thread can start the sequence',
    },
    {
      name: 'host_name',
      defaultValue: 'onec-app-01',
      description: 'Server host',
    },
    {
      name: 'infobase',
      defaultValue: 'accounting',
      description: 'Infobase name in p:processName',
    },
    {
      name: 'process_name',
      defaultValue: 'rphost',
      description: '1C process name',
    },
    {
      name: 'routine_user',
      defaultValue: 'accountant01',
      description: 'First background session',
    },
    {
      name: 'contending_user',
      defaultValue: 'batch_admin',
      description: 'Second background session and sequence participant',
    },
    {
      name: 'routine_client_id',
      defaultValue: '518',
      description: 'First session t:clientID',
    },
    {
      name: 'contending_client_id',
      defaultValue: '592',
      description: 'Second session t:clientID',
    },
  ],
  sampleOutputs: [
    {
      title: '1C:Enterprise 8.3.27 synthetic TLOCK event from generator output',
      json: String.raw`{"@timestamp": "2026-09-25T00:03:23.016897+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "TLOCK", "dataset": "1c.techjournal", "kind": "event", "original": "{\"ts\":\"2026-09-25T00:03:23.016897\",\"duration\":\"2000000\",\"name\":\"TLOCK\",\"depth\":\"5\",\"level\":\"INFO\",\"process\":\"rphost\",\"p:processName\":\"accounting\",\"OSThread\":\"15968\",\"t:clientID\":\"592\",\"t:applicationName\":\"1CV8C\",\"t:computerName\":\"client-01\",\"t:connectID\":\"16\",\"SessionID\":\"421\",\"Usr\":\"batch_admin\",\"AppID\":\"1CV8C\",\"Regions\":\"InfoRg42.DIMS\",\"Locks\":\"InfoRg42.DIMS Exclusive Fld43=\\\"DOC-0042\\\"\",\"WaitConnections\":\"17\",\"Context\":\"\u041e\u0431\u0449\u0438\u0439\u041c\u043e\u0434\u0443\u043b\u044c.\u0417\u0430\u043f\u0438\u0441\u044c\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432.\u041c\u043e\u0434\u0443\u043b\u044c : 81 : \u041d\u0430\u0431\u043e\u0440\u0417\u0430\u043f\u0438\u0441\u0435\u0439.\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c();\"}", "type": ["info"]}, "host": {"name": "onec-app-01"}, "one_c": {"techjournal": {"AppID": "1CV8C", "Context": "\u041e\u0431\u0449\u0438\u0439\u041c\u043e\u0434\u0443\u043b\u044c.\u0417\u0430\u043f\u0438\u0441\u044c\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432.\u041c\u043e\u0434\u0443\u043b\u044c : 81 : \u041d\u0430\u0431\u043e\u0440\u0417\u0430\u043f\u0438\u0441\u0435\u0439.\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c();", "Locks": "InfoRg42.DIMS Exclusive Fld43=\"DOC-0042\"", "OSThread": "15968", "Regions": "InfoRg42.DIMS", "SessionID": "421", "Usr": "batch_admin", "WaitConnections": "17", "depth": "5", "duration": "2000000", "level": "INFO", "name": "TLOCK", "p:processName": "accounting", "process": "rphost", "t:applicationName": "1CV8C", "t:clientID": "592", "t:computerName": "client-01", "t:connectID": "16", "ts": "2026-09-25T00:03:23.016897"}}, "process": {"name": "rphost"}, "user": {"name": "batch_admin"}}`,
    },
  ],
};
