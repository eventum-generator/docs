import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationOneCTechjournal: GeneratorMeta = {
  slug: 'application-1c-techjournal',
  displayName: '1C:Enterprise Technological Log',
  category: 'application',
  description:
    '1C:Enterprise 8.3.27 technological-log JSON records (SCALL, CALL, TLOCK, EXCP) of one rphost process serving fourteen client and service sessions of one infobase, in an ECS envelope. About 44,000 records a day: interactive users follow a working day in UTC, background jobs keep the same pace day and night. Managed locks on document keys are granted at once, queued, or time out after 20 seconds. Recurring episodes are lock convoys: one very long posting blocks a busy document key until six distinct sessions have timed out on it within 50 minutes.',
  dataSource:
    '1C:Enterprise 8.3.27 technological log in JSON format (log.format=json), one rphost process',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native technological-log JSON in event.original',
    'About 44,000 records a day on a UTC working day',
    'Recurring six-session lock convoy on a busy document key',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "A lock convoy: the first of the four posting sessions to start a call at the episode's time, never the previous blocker, takes a lock on one of the busiest document keys and holds it until six distinct sessions have timed out on it within 50 minutes, then about 15 s more: from about two minutes to about half an hour, typically about 11 minutes by default. The victims are ordinary requests for that key; each waits 20 s, writes a TLOCK whose WaitConnections names the blocker, then EXCP, and requests in the last seconds wait for the release. Episodes start only between 08:00 and 17:00 UTC. The first starts within min(anomaly_interval_hours, 24 h) of the run start, at a time weighted by the interactive activity of each hour; each later one within ±w/2 of its due time, one interval after the previous actual start, where w = min(interval / 4, 6 h), at a time weighted by the square of that activity. A window with no hour between 08:00 and 17:00 has no episode, and the next is due one interval after it. The episode starts with the next posting session's call after that time, usually within seconds; there is no catch-up. At the default 2 hours there are four or five episodes a day, the first soon after 08:00, none at night. Groups of two to five timeouts on one key and connection are common without episodes; six occur only in episodes, and each episode adds its own six timeouts. Within 30 minutes after a convoy's release, a request waits on that connection for that key in about 5% of cases, against about 40% after an ordinary group of two or more timeouts.",
  generatorId: 'onec-techjournal',
  eventTypes: [
    {
      id: 'SCALL',
      description:
        'Outgoing call of the server process, for example to the lock service',
      frequency: '67% of records without episodes',
      category: 'remote call',
    },
    {
      id: 'CALL',
      description:
        'Incoming client call, written when the call ends; duration spans the whole call',
      frequency: '18% of records without episodes',
      category: 'remote call',
    },
    {
      id: 'TLOCK',
      description:
        'Managed transaction lock; about 95% are granted at once with empty WaitConnections',
      frequency:
        '14% of records without episodes, varying from day to day with the posting workload',
      category: 'lock',
    },
    {
      id: 'EXCP',
      description: 'Managed-lock wait timeout exception',
      frequency:
        '0.3% of records without episodes, varying from day to day with the posting workload',
      category: 'error',
    },
  ],
  realismFeatures: [
    'About 44,000 records a day (±3% from day to day): about 58 a minute at 09:00-13:00 and 14:00-17:00 UTC, 40 at 08:00-09:00, 13:00-14:00 and 17:00-18:00, 21 at 07:00-08:00 and 18:00-20:00, and 13 from 20:00 to 07:00. Interactive users make about 5% of their daytime calls at night; the background jobs batch_admin (BackgroundJob) and exchange_service (COMConnection) write about 10-12 records a minute around the clock. Every day follows the same UTC curve, weekends included, with no weekly cycle, holidays or time-zone offset; busy and calm periods and the day-to-day posting workload vary at random.',
    'Each session alternates server calls and think time (mostly seconds, sometimes minutes). A call runs on a free worker thread (OSThread) and writes its SCALL, TLOCK and EXCP records in order, then its CALL; the records of one call follow each other within milliseconds, and a lock wait, transaction or timeout spans exactly the time its duration states. About one read call in a hundred is a report that runs for minutes without locks. Sessions stay connected for the whole run, and work inside a call (SDBL, DBMSSQL) is not logged, so postings and reports show as pauses.',
    'Write calls take exclusive or shared managed locks on document keys DOC-0031 to DOC-0060 of InfoRg42.DIMS, some much busier than others; most users write in about 40% of their calls, auditor and hr_specialist only read. A compatible request is granted at once; a conflicting one waits, and WaitConnections names the t:connectID of one session whose running call holds a conflicting lock, even when several do. Locks are held until the call ends or an exception rolls the transaction back, and waiting requests are granted in arrival order.',
    'Four sessions post documents (batch_admin, exchange_service, storekeeper01, storekeeper02): they write in 75-80% of their calls and hold their first lock about 10 s for an ordinary posting, 35-75 s for a long one and a few minutes for one long posting in ten. Long postings are more frequent in busy periods and on busy days, so waits name mostly these four connections.',
    'A request still waiting after 20 s writes a TLOCK with its 20-second wait, then EXCP. The transaction is rolled back and often retried, or the call ends after zero to two rollback SCALLs and the user sometimes repeats the operation on the same document within seconds. Timeouts average about 130 a day (under 100 to over 250), about 1.7% of calls and 2% of lock requests: 8-16 an hour from 09:00 to 17:00 and one to two an hour at night, mostly background jobs waiting on each other. A long posting sometimes times out one to three sessions; without episodes, at most five distinct sessions time out on one key naming one connection within 50 minutes.',
    'TTIMEOUT and TDEADLOCK are not generated (mutual waits end in two timeouts), and depth is fixed per event type (TLOCK 5). The 20-second timeout is an assumption with no first-party 1C statement of the default. Shares and rates are synthetic workload settings, not measured 1C rates; contexts, module names and document keys describe a synthetic configuration.',
    'Complete first-party 8.3.27 JSON records for CALL, TLOCK and EXCP were not found, so their shapes follow the vendor text examples and text-to-JSON rule; native values are JSON strings, duration in microseconds. The file is ECS JSON with the native object in event.original and parsed fields in one_c.techjournal. No Elastic integration exists, and the KUMA 1C TechJournal regexp normalizer is unverified for this JSON profile.',
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
        'Hours between episodes, 0.5 to 8,760; the next is due one interval after the previous actual start, and episodes fall between 08:00 and 17:00 UTC',
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
      title: 'Timed-out TLOCK of the first victim of the first episode',
      json: String.raw`{"@timestamp": "2026-09-14T08:03:32.989296+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "TLOCK", "dataset": "1c.techjournal", "kind": "event", "original": "{\"ts\":\"2026-09-14T08:03:32.989296\",\"duration\":\"20000235\",\"name\":\"TLOCK\",\"depth\":\"5\",\"level\":\"INFO\",\"process\":\"rphost\",\"p:processName\":\"accounting\",\"OSThread\":\"23200\",\"t:clientID\":\"552\",\"t:applicationName\":\"1CV8C\",\"t:computerName\":\"client-11\",\"t:connectID\":\"26\",\"SessionID\":\"125\",\"Usr\":\"manager_sales01\",\"AppID\":\"1CV8C\",\"Regions\":\"InfoRg42.DIMS\",\"Locks\":\"InfoRg42.DIMS Exclusive Fld43=\\\"DOC-0031\\\"\",\"WaitConnections\":\"16\",\"Context\":\"\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442.\u0420\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f\u0422\u043e\u0432\u0430\u0440\u043e\u0432\u0423\u0441\u043b\u0443\u0433.\u041c\u043e\u0434\u0443\u043b\u044c\u041e\u0431\u044a\u0435\u043a\u0442\u0430 : 214 : \u0411\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430\u0414\u0430\u043d\u043d\u044b\u0445.\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c();\"}", "type": ["info"]}, "host": {"name": "onec-app-01"}, "one_c": {"techjournal": {"AppID": "1CV8C", "Context": "\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442.\u0420\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f\u0422\u043e\u0432\u0430\u0440\u043e\u0432\u0423\u0441\u043b\u0443\u0433.\u041c\u043e\u0434\u0443\u043b\u044c\u041e\u0431\u044a\u0435\u043a\u0442\u0430 : 214 : \u0411\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430\u0414\u0430\u043d\u043d\u044b\u0445.\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c();", "Locks": "InfoRg42.DIMS Exclusive Fld43=\"DOC-0031\"", "OSThread": "23200", "Regions": "InfoRg42.DIMS", "SessionID": "125", "Usr": "manager_sales01", "WaitConnections": "16", "depth": "5", "duration": "20000235", "level": "INFO", "name": "TLOCK", "p:processName": "accounting", "process": "rphost", "t:applicationName": "1CV8C", "t:clientID": "552", "t:computerName": "client-11", "t:connectID": "26", "ts": "2026-09-14T08:03:32.989296"}}, "process": {"name": "rphost"}, "user": {"name": "manager_sales01"}}`,
    },
  ],
};
