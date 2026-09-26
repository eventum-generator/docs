/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsRdpSessionOperational: GeneratorMeta = {
  slug: 'windows-rdp-session-operational',
  displayName: 'Windows RDP Session Operational',
  category: 'identity',
  description:
    'RDP LocalSessionManager logon and disconnect XML with a switchable multi-account source fan-out chain.',
  dataSource:
    'Microsoft-Windows-TerminalServices-LocalSessionManager/Operational',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 2,
  templateCount: 1,
  generatorId: 'windows-rdp-session-operational',
  highlights: [
    'Events 21 and 24 native XML',
    'User/SessionID/Address linkage',
    'Five accounts from one source',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Five distinct Windows accounts log on to the same RDP host from one source IP and disconnect, each with a separate SessionID.',
  eventTypes: [
    {
      id: '21',
      description: 'Session logon succeeded',
      frequency: '1 per session',
      category: 'authentication',
    },
    {
      id: '24',
      description: 'Session disconnected',
      frequency: '1 per session',
      category: 'session',
    },
  ],
  realismFeatures: [
    'Event 21 and 24 retain the three published UserData/EventXML fields: User, SessionID and Address.',
    'Logon/disconnect pairs reuse a SessionID; separate sessions get distinct IDs.',
    'Fifty routine user/address samples vary the background.',
  ],
  parameters: [
    {
      name: 'host_name',
      defaultValue: 'rds-01.corp.example',
      description: 'RDP host name',
    },
    {
      name: 'host_ip',
      defaultValue: '10.170.0.21',
      description: 'RDP host address',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.4.51',
      description: 'Chain client address',
    },
    {
      name: 'anomaly_users',
      defaultValue: String.raw`['CORP\svc_backup', 'CORP\it_admin', 'CORP\finance_admin', 'CORP\hr_admin', 'CORP\domain_admin']`,
      description: 'Accounts used in chain',
    },
    {
      name: 'anomaly_interval_sessions',
      defaultValue: '50',
      description: 'Routine sessions between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:05:03+00:00",
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
    "dataset": "windows.rdp_session_operational",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-TerminalServices-LocalSessionManager\" Guid=\"{5d896912-022d-40aa-a3a8-4fa5515c76d7}\"/><EventID>21</EventID><Version>0</Version><Level>4</Level><Task>0</Task><Opcode>0</Opcode><Keywords>0x1000000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T13:05:03.0000000Z\"/><EventRecordID>40101</EventRecordID><Correlation ActivityID=\"{5d4d5a90-98a3-4694-bd02-67b7fef72e24}\"/><Execution ProcessID=\"1152\" ThreadID=\"1636\"/><Channel>Microsoft-Windows-TerminalServices-LocalSessionManager/Operational</Channel><Computer>rds-01.corp.example</Computer><Security UserID=\"S-1-5-18\"/></System><UserData><EventXML xmlns=\"Event_NS\"><User>CORP\\svc_backup</User><SessionID>151</SessionID><Address>10.99.4.51</Address></EventXML></UserData></Event>",
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
  "message": "Remote Desktop Services: Session logon succeeded",
  "related": {
    "ip": [
      "10.99.4.51"
    ],
    "user": [
      "CORP\\svc_backup"
    ]
  },
  "source": {
    "ip": "10.99.4.51"
  },
  "tags": [
    "rdp-session-operational",
    "preserve_original_event"
  ],
  "user": {
    "name": "CORP\\svc_backup"
  },
  "windows": {
    "rdp_session": {
      "address": "10.99.4.51",
      "session_id": 151,
      "user": "CORP\\svc_backup"
    }
  },
  "winlog": {
    "activity_id": "{5d4d5a90-98a3-4694-bd02-67b7fef72e24}",
    "channel": "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational",
    "event_id": 21,
    "provider_name": "Microsoft-Windows-TerminalServices-LocalSessionManager",
    "record_id": 40101
  }
}`,
    },
  ],
};
