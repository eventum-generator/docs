/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic generator addresses. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsRdpSessionOperational: GeneratorMeta = {
  displayName: 'Windows RDP sessions',
  category: 'identity',
  description:
    'About 3,000 native XML and ECS records/day from one RDS host serving 200 accounts, including shift operators and shared jump hosts.',
  dataSource: 'TerminalServices-LocalSessionManager/Operational',
  eventFormat: 'ECS JSON',
  originalFormat: 'XML',
  highlights: [
    'Session logon, shell startup, disconnect, reconnect and logoff',
    'Sessions retain their user, address and ID until logoff',
  ],
  anomalyChain:
    'Five distinct accounts log on from one shared jump-host address within one hour. Consecutive episodes rotate among four administrator groups. The same accounts and addresses also appear in ordinary traffic. Default interval is 24 hours. First start is within min(interval,24h), weighted by daily activity; later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'windows-rdp-session-operational',
  eventTypes: [
    {
      id: '21',
      description: 'Session logon succeeded',
      frequency: 'Per session lifecycle',
      category: 'session',
    },
    {
      id: '22',
      description: 'Shell startup notification',
      frequency: 'Per session lifecycle',
      category: 'session',
    },
    {
      id: '23',
      description: 'Session logoff succeeded',
      frequency: 'Per session lifecycle',
      category: 'session',
    },
    {
      id: '24',
      description: 'Session disconnected',
      frequency: 'Per session lifecycle',
      category: 'session',
    },
    {
      id: '25',
      description: 'Session reconnection succeeded',
      frequency: 'Per session lifecycle',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Session logon, shell startup, disconnect, reconnect and logoff',
    'Sessions retain their user, address and ID until logoff',
    'Only successful remote sessions are included; a shared jump host can produce this pattern legitimately',
  ],
  slug: 'windows-rdp-session-operational',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 5,
  parameters: [
    {
      name: 'host_name',
      defaultValue: 'rds-01.corp.example',
      description: 'RDS host name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.170.0.21',
      description: 'RDS host address',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring multi-account logon episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Approximate interval between episode starts, from 6 to 8,760 hours',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{
  "@timestamp": "2026-09-01T00:00:37.464584+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "session-logon",
    "category": [
      "authentication",
      "session"
    ],
    "code": "21",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-TerminalServices-LocalSessionManager\" Guid=\"{5d896912-022d-40aa-a3a8-4fa5515c76d7}\"/><EventID>21</EventID><Version>0</Version><Level>4</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x1000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-01T00:00:37.4645845Z\"/><EventRecordID>40001</EventRecordID><Correlation ActivityID=\"{3b848838-005c-40b7-a0bf-283e9fb5c247}\"/><Execution ProcessID=\"3452\" ThreadID=\"432\"/><Channel>Microsoft-Windows-TerminalServices-LocalSessionManager/Operational</Channel><Computer>rds-01.corp.example</Computer><Security UserID=\"S-1-5-18\"/></System><UserData><EventXML xmlns=\"Event_NS\"><User>CORP\\operator156</User><SessionID>101</SessionID><Address>10.170.1.175</Address></EventXML></UserData></Event>",
    "provider": "Microsoft-Windows-TerminalServices-LocalSessionManager",
    "type": [
      "start"
    ]
  },
  "host": {
    "ip": [
      "10.170.0.21"
    ],
    "name": "rds-01.corp.example"
  },
  "log": {
    "level": "information"
  },
  "related": {
    "ip": [
      "10.170.1.175"
    ],
    "user": [
      "CORP\\operator156"
    ]
  },
  "source": {
    "ip": "10.170.1.175"
  },
  "user": {
    "domain": "CORP",
    "name": "operator156"
  },
  "winlog": {
    "activity_id": "{3b848838-005c-40b7-a0bf-283e9fb5c247}",
    "channel": "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational",
    "computer_name": "rds-01.corp.example",
    "event_id": "21",
    "process": {
      "pid": 3452,
      "thread": {
        "id": 432
      }
    },
    "provider_guid": "{5d896912-022d-40aa-a3a8-4fa5515c76d7}",
    "provider_name": "Microsoft-Windows-TerminalServices-LocalSessionManager",
    "record_id": 40001,
    "user": {
      "identifier": "S-1-5-18"
    },
    "user_data": {
      "Address": "10.170.1.175",
      "SessionID": "101",
      "User": "CORP\\operator156",
      "xml_name": "EventXML"
    },
    "version": 0
  }
}`,
    },
  ],
};
