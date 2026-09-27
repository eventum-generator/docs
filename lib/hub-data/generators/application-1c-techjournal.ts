import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneCTechjournal: GeneratorMeta = {
  slug: 'application-1c-techjournal',
  displayName: '1C:Enterprise Technological Log',
  category: 'application',
  description:
    '1C:Enterprise 8.3.27 technological-log JSON records (SCALL, CALL, TLOCK, EXCP) of one rphost process serving fourteen parallel sessions of one infobase, in an ECS envelope, with managed locks granted, queued and timed out by a lock manager. Recurring episodes are lock convoys: one very long write transaction blocks a busy document key until six distinct sessions have timed out on it.',
  dataSource:
    '1C:Enterprise 8.3.27 technological log in JSON format, one rphost process',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Managed locks granted, queued and timed out by a lock manager',
    'Fourteen client and service sessions working in parallel',
    'Recurring six-victim lock convoy on a busy document key',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due anomaly_interval_hours (default 2) after the run starts, each next one interval after the previous actual start, with no catch-up; measured start delays were 0-81 s, so start times drift later. The idle session whose next call comes first (never the previous blocker) starts a write call and holds a busy document key for minutes (6-22 min measured, at most 30) until six distinct sessions have timed out on it, then about 15 s more. The victims are ordinary requests for that key: each writes a 20-second TLOCK naming the blocker in WaitConnections, then EXCP. Two to four timeouts on one key and blocker were measured in background; six or more within one hold did not occur in background-only runs.',
  generatorId: 'onec-techjournal',
  eventTypes: [
    {
      id: 'SCALL',
      description:
        'Outgoing call of the server process, for example to the lock service',
      frequency: '70.2% measured share without episodes',
      category: 'remote call',
    },
    {
      id: 'CALL',
      description: 'Incoming client call, written when the call ends',
      frequency: '20.3% measured share without episodes',
      category: 'remote call',
    },
    {
      id: 'TLOCK',
      description:
        'Managed transaction lock; most are granted at once with empty WaitConnections',
      frequency: '9.3% measured share without episodes',
      category: 'lock',
    },
    {
      id: 'EXCP',
      description: 'Managed-lock wait timeout exception',
      frequency: '0.1% measured share without episodes',
      category: 'error',
    },
  ],
  realismFeatures: [
    'Each session alternates server calls on a free worker thread with think time. A call writes its SCALL, TLOCK and EXCP records in order, then a CALL whose duration spans the whole call; about one read call in a hundred is a minutes-long report without locks. Background-only runs varied from 3,100 to 3,700 records per hour; shares and rates are synthetic workload settings, with no working-day or weekly cycle.',
    'About a third of calls take exclusive or shared managed locks on document keys DOC-0031 to DOC-0060 of InfoRg42.DIMS, some much busier than others. Compatible requests are granted at once (96-99% of TLOCK records, with empty WaitConnections); conflicting ones wait and name a session whose running call holds a conflicting lock. Locks are held until the call ends or an exception rolls the transaction back, and waiters are granted in arrival order.',
    'Some write calls pause about 30-60 s after their first lock, more often in busy periods. A request still waiting after 20 s writes its TLOCK and then EXCP; the transaction is rolled back and often retried, or the call ends after zero to two rollback SCALLs. Across eight background-only runs (35 h), holds with 0, 1, 2, 3 and 4 timed-out sessions numbered 10,878, 122, 13, 2 and 1, and none reached six.',
    'TTIMEOUT and TDEADLOCK are not generated (mutual waits end in two timeouts), work inside a call (SDBL, DBMSSQL) is not logged, sessions stay connected for the whole run, depth is fixed per event type, and each second offers 32 record slots. The 20-second timeout is an assumption with no first-party 1C statement of the default; contexts, module names and document keys describe a synthetic configuration.',
    'BLOCKED_RAW_EVIDENCE: complete first-party 8.3.27 JSON records for CALL, TLOCK and EXCP were not found, so their shapes follow the vendor text examples and text-to-JSON rule. The file is ECS JSON with the native object in event.original. No Elastic integration exists, and the KUMA 1C TechJournal regexp normalizer is unverified for this JSON profile.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring lock convoys; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description:
        'Hours between episodes, 0.5 to 8,760; the next is due one interval after the previous actual start',
    },
    {
      name: 'host_name',
      defaultValue: 'onec-app-01',
      description: 'Server host; also t:computerName of background jobs',
    },
    {
      name: 'infobase',
      defaultValue: 'accounting',
      description: 'Infobase name (p:processName)',
    },
    {
      name: 'process_name',
      defaultValue: 'rphost',
      description: '1C process',
    },
  ],
  sampleOutputs: [
    {
      title: 'First victim TLOCK of the first episode',
      json: String.raw`{"@timestamp": "2026-09-25T02:01:52.133783+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "TLOCK", "dataset": "1c.techjournal", "kind": "event", "original": "{\"ts\":\"2026-09-25T02:01:52.133783\",\"duration\":\"20003092\",\"name\":\"TLOCK\",\"depth\":\"5\",\"level\":\"INFO\",\"process\":\"rphost\",\"p:processName\":\"accounting\",\"OSThread\":\"18860\",\"t:clientID\":\"552\",\"t:applicationName\":\"1CV8C\",\"t:computerName\":\"client-11\",\"t:connectID\":\"26\",\"SessionID\":\"125\",\"Usr\":\"manager_sales01\",\"AppID\":\"1CV8C\",\"Regions\":\"InfoRg42.DIMS\",\"Locks\":\"InfoRg42.DIMS Exclusive Fld43=\\\"DOC-0046\\\"\",\"WaitConnections\":\"19\",\"Context\":\"\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442.\u041f\u043e\u0441\u0442\u0443\u043f\u043b\u0435\u043d\u0438\u0435\u0422\u043e\u0432\u0430\u0440\u043e\u0432\u0423\u0441\u043b\u0443\u0433.\u041c\u043e\u0434\u0443\u043b\u044c\u041e\u0431\u044a\u0435\u043a\u0442\u0430 : 188 : \u0411\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430\u0414\u0430\u043d\u043d\u044b\u0445.\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c();\"}", "type": ["info"]}, "host": {"name": "onec-app-01"}, "one_c": {"techjournal": {"AppID": "1CV8C", "Context": "\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442.\u041f\u043e\u0441\u0442\u0443\u043f\u043b\u0435\u043d\u0438\u0435\u0422\u043e\u0432\u0430\u0440\u043e\u0432\u0423\u0441\u043b\u0443\u0433.\u041c\u043e\u0434\u0443\u043b\u044c\u041e\u0431\u044a\u0435\u043a\u0442\u0430 : 188 : \u0411\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430\u0414\u0430\u043d\u043d\u044b\u0445.\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c();", "Locks": "InfoRg42.DIMS Exclusive Fld43=\"DOC-0046\"", "OSThread": "18860", "Regions": "InfoRg42.DIMS", "SessionID": "125", "Usr": "manager_sales01", "WaitConnections": "19", "depth": "5", "duration": "20003092", "level": "INFO", "name": "TLOCK", "p:processName": "accounting", "process": "rphost", "t:applicationName": "1CV8C", "t:clientID": "552", "t:computerName": "client-11", "t:connectID": "26", "ts": "2026-09-25T02:01:52.133783"}}, "process": {"name": "rphost"}, "user": {"name": "manager_sales01"}}`,
    },
  ],
};
