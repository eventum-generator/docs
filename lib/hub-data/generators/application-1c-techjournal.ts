import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneCTechjournal: GeneratorMeta = {
  slug: 'application-1c-techjournal',
  displayName: '1C:Enterprise Technological Log',
  category: 'application',
  description:
    '1C:Enterprise 8.3.27 technological-log JSON for platform calls, managed locks and exceptions, with recurring correlated lock-wait episodes.',
  dataSource: '1C:Enterprise 8.3.27 technological log JSON',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    '14/14 native SCALL JSON fields modeled',
    'SCALL, CALL, TLOCK and EXCP background activity',
    'Recurring lock-wait episodes about every two hours',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every two hours, an idle contending thread records a TLOCK wait on another connection, a managed-lock EXCP and the enclosing CALL completion. Episodes rotate ordinary document keys and use fresh CallIDs; persistent users, sessions, lock region and context also occur in background.',
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
    'All 14 fields of the 8.3.27 SCALL JSON example are modeled; native values are strings and duration is in microseconds.',
    'Two persistent user sessions share client, connection and thread identifiers across ordinary traffic and episodes.',
    'The blocker is another t:connectID; the enclosing CALL starts before the lock wait and ends after its exception.',
    'BLOCKED_RAW_EVIDENCE: exact 8.3.27 JSON CALL, TLOCK and EXCP records remain missing; the KUMA text normalizer is unverified for this JSON profile.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include periodic lock-wait episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Positive hours between episode eligibility; actual start waits for a free thread',
    },
    {
      name: 'host_name',
      defaultValue: 'onec-app-01',
      description: 'Server host',
    },
    {
      name: 'infobase',
      defaultValue: 'accounting',
      description: 'Infobase name (`p:processName`)',
    },
    {
      name: 'process_name',
      defaultValue: 'rphost',
      description: '1C process',
    },
    {
      name: 'routine_user',
      defaultValue: 'accountant01',
      description: 'First background session',
    },
    {
      name: 'contending_user',
      defaultValue: 'batch_admin',
      description: 'Second background session and chain participant',
    },
    {
      name: 'routine_client_id',
      defaultValue: '518',
      description: "First session's `t:clientID`",
    },
    {
      name: 'contending_client_id',
      defaultValue: '592',
      description: "Second session's `t:clientID`",
    },
  ],
  sampleOutputs: [
    {
      title: '1C:Enterprise 8.3.27 synthetic TLOCK event from generator output',
      json: String.raw`{"@timestamp": "2026-09-25T02:00:03.672540+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "TLOCK", "dataset": "1c.techjournal", "kind": "event", "original": "{\"ts\":\"2026-09-25T02:00:03.672540\",\"duration\":\"2000000\",\"name\":\"TLOCK\",\"depth\":\"5\",\"level\":\"INFO\",\"process\":\"rphost\",\"p:processName\":\"accounting\",\"OSThread\":\"15968\",\"t:clientID\":\"592\",\"t:applicationName\":\"1CV8C\",\"t:computerName\":\"client-01\",\"t:connectID\":\"16\",\"SessionID\":\"421\",\"Usr\":\"batch_admin\",\"AppID\":\"1CV8C\",\"Regions\":\"InfoRg42.DIMS\",\"Locks\":\"InfoRg42.DIMS Exclusive Fld43=\\\"DOC-0042\\\"\",\"WaitConnections\":\"17\",\"Context\":\"\u041e\u0431\u0449\u0438\u0439\u041c\u043e\u0434\u0443\u043b\u044c.\u0417\u0430\u043f\u0438\u0441\u044c\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432.\u041c\u043e\u0434\u0443\u043b\u044c : 81 : \u041d\u0430\u0431\u043e\u0440\u0417\u0430\u043f\u0438\u0441\u0435\u0439.\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c();\"}", "type": ["info"]}, "host": {"name": "onec-app-01"}, "one_c": {"techjournal": {"AppID": "1CV8C", "Context": "\u041e\u0431\u0449\u0438\u0439\u041c\u043e\u0434\u0443\u043b\u044c.\u0417\u0430\u043f\u0438\u0441\u044c\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432.\u041c\u043e\u0434\u0443\u043b\u044c : 81 : \u041d\u0430\u0431\u043e\u0440\u0417\u0430\u043f\u0438\u0441\u0435\u0439.\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c();", "Locks": "InfoRg42.DIMS Exclusive Fld43=\"DOC-0042\"", "OSThread": "15968", "Regions": "InfoRg42.DIMS", "SessionID": "421", "Usr": "batch_admin", "WaitConnections": "17", "depth": "5", "duration": "2000000", "level": "INFO", "name": "TLOCK", "p:processName": "accounting", "process": "rphost", "t:applicationName": "1CV8C", "t:clientID": "592", "t:computerName": "client-01", "t:connectID": "16", "ts": "2026-09-25T02:00:03.672540"}}, "process": {"name": "rphost"}, "user": {"name": "batch_admin"}}`,
    },
  ],
};
