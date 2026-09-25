/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftNps: GeneratorMeta = {
  slug: 'identity-microsoft-nps',
  displayName: 'Microsoft Network Policy Server',
  category: 'identity',
  dataSource: 'Windows Security events 6272, 6273 and 6274 from NPS',
  description:
    'RADIUS grant, denial and discard events with a switchable repeated-failure-to-success sequence on one station.',
  generatorId: 'microsoft-nps',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Windows Security Event XML retained in event.original',
    'Named NPS EventData fields',
    'Four failures followed by a grant for one account and station',
  ],
  anomalyChain:
    'Four RADIUS denials for one administrative account and station MAC are followed by a grant under the same connection policy.',
  eventTypes: [
    {
      id: '6272',
      description: 'RADIUS access granted',
      frequency: '86% baseline',
      category: 'authentication',
    },
    {
      id: '6273',
      description: 'RADIUS access denied',
      frequency: '12% baseline',
      category: 'authentication',
    },
    {
      id: '6274',
      description: 'RADIUS request discarded',
      frequency: '2% baseline',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    '27 named NPS fields and native Windows Security XML are generated together.',
    'RADIUS client IP is kept distinct from the endpoint station MAC.',
    'Windows EventRecordID is unique even when delivery order differs.',
  ],
  format: ['JSON', 'ECS', 'XML'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include failure-to-success chain; false emits only background',
    },
    {
      name: 'host_name',
      defaultValue: 'nps01.corp.example',
      description: 'NPS server name',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'Account domain',
    },
    {
      name: 'radius_client_name',
      defaultValue: 'office-wifi-ap',
      description: 'RADIUS client name',
    },
    {
      name: 'radius_client_ip',
      defaultValue: '10.20.1.20',
      description: 'RADIUS client or access-point IP',
    },
    {
      name: 'network_policy',
      defaultValue: 'Corporate WiFi',
      description: 'Policy on grants',
    },
    {
      name: 'connection_policy',
      defaultValue: 'Corporate WiFi RADIUS',
      description: 'Connection request policy',
    },
    {
      name: 'suspicious_station',
      defaultValue: '02-42-AC-11-00-91',
      description: 'Station MAC in the chain',
    },
    {
      name: 'target_user',
      defaultValue: 'finance.admin',
      description: 'Account targeted by the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Microsoft Network Policy Server event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:07:53+00:00",
  "client": {
    "ip": "10.20.1.20"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "radius-access-granted",
    "category": [
      "authentication"
    ],
    "code": "6272",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>6272</EventID><Version>1</Version><Level>0</Level><Task>12552</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-25T12:07:53+00:00\"/><EventRecordID>210001</EventRecordID><Correlation/><Execution ProcessID=\"584\" ThreadID=\"4712\"/><Channel>Security</Channel><Computer>nps01.corp.example</Computer><Security/></System><EventData><Data Name=\"SubjectUserSid\">S-1-0-0</Data><Data Name=\"SubjectUserName\">marina</Data><Data Name=\"SubjectDomainName\">CORP</Data><Data Name=\"FullyQualifiedSubjectUserName\">CORP\\marina</Data><Data Name=\"SubjectMachineSID\">S-1-0-0</Data><Data Name=\"SubjectMachineName\">-</Data><Data Name=\"FullyQualifiedSubjectMachineName\">-</Data><Data Name=\"MachineInventory\">-</Data><Data Name=\"CalledStationID\">02-42-AC-11-00-01:CORP</Data><Data Name=\"CallingStationID\">02-42-AC-11-00-3A</Data><Data Name=\"NASIPv4Address\">10.20.1.20</Data><Data Name=\"NASIPv6Address\">-</Data><Data Name=\"NASIdentifier\">office-wifi-ap</Data><Data Name=\"NASPortType\">Wireless - IEEE 802.11</Data><Data Name=\"NASPort\">0</Data><Data Name=\"ClientName\">office-wifi-ap</Data><Data Name=\"ClientIPAddress\">10.20.1.20</Data><Data Name=\"ProxyPolicyName\">Corporate WiFi RADIUS</Data><Data Name=\"NetworkPolicyName\">Corporate WiFi</Data><Data Name=\"AuthenticationProvider\">Windows</Data><Data Name=\"AuthenticationServer\">nps01.corp.example</Data><Data Name=\"AuthenticationType\">PEAP</Data><Data Name=\"EAPType\">Microsoft: Secured password (EAP-MSCHAP v2)</Data><Data Name=\"AccountSessionIdentifier\">-</Data><Data Name=\"ReasonCode\">0</Data><Data Name=\"Reason\">The connection request was successfully authenticated</Data><Data Name=\"LoggingResult\">Accounting information was written to the local log file.</Data></EventData></Event>",
    "outcome": "success",
    "provider": "Microsoft-Windows-Security-Auditing",
    "type": [
      "start"
    ]
  },
  "host": {
    "name": "nps01.corp.example"
  },
  "observer": {
    "name": "nps01.corp.example",
    "type": "radius"
  },
  "related": {
    "ip": [
      "10.20.1.20"
    ],
    "user": [
      "marina"
    ]
  },
  "source": {
    "mac": "02-42-AC-11-00-3A"
  },
  "user": {
    "domain": "CORP",
    "name": "marina"
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "nps01.corp.example",
    "event_data": {
      "AccountSessionIdentifier": "-",
      "AuthenticationProvider": "Windows",
      "AuthenticationServer": "nps01.corp.example",
      "AuthenticationType": "PEAP",
      "CalledStationID": "02-42-AC-11-00-01:CORP",
      "CallingStationID": "02-42-AC-11-00-3A",
      "ClientIPAddress": "10.20.1.20",
      "ClientName": "office-wifi-ap",
      "EAPType": "Microsoft: Secured password (EAP-MSCHAP v2)",
      "FullyQualifiedSubjectMachineName": "-",
      "FullyQualifiedSubjectUserName": "CORP\\marina",
      "LoggingResult": "Accounting information was written to the local log file.",
      "MachineInventory": "-",
      "NASIPv4Address": "10.20.1.20",
      "NASIPv6Address": "-",
      "NASIdentifier": "office-wifi-ap",
      "NASPort": "0",
      "NASPortType": "Wireless - IEEE 802.11",
      "NetworkPolicyName": "Corporate WiFi",
      "ProxyPolicyName": "Corporate WiFi RADIUS",
      "Reason": "The connection request was successfully authenticated",
      "ReasonCode": "0",
      "SubjectDomainName": "CORP",
      "SubjectMachineName": "-",
      "SubjectMachineSID": "S-1-0-0",
      "SubjectUserName": "marina",
      "SubjectUserSid": "S-1-0-0"
    },
    "event_id": 6272,
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": 210001,
    "task": "Network Policy Server"
  }
}`,
    },
  ],
};
