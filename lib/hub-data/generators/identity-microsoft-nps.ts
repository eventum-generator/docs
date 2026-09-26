/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftNps: GeneratorMeta = {
  slug: 'identity-microsoft-nps',
  displayName: 'Microsoft Network Policy Server',
  category: 'identity',
  dataSource: 'Windows Security events 6272, 6273 and 6274 from NPS',
  description:
    'Windows NPS Security Event XML v1 for RADIUS grants, denials and discards, with recurring six-hour failure-to-success episodes.',
  generatorId: 'microsoft-nps',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Complete selected native Security Event XML',
    'Distinct 27/27/25-field EventData variants',
    'Recurring five-decision episodes every six hours',
  ],
  anomalyChain:
    'Every six hours by default, four credential denials precede a grant for one account/station within two minutes. EventRecordIDs are fresh but AccountSessionIdentifier remains the native hyphen; the same account and station also have ordinary grants and denials in both modes.',
  eventTypes: [
    {
      id: '6272',
      description: 'RADIUS access granted',
      frequency: '88% synthetic baseline weight',
      category: 'authentication',
    },
    {
      id: '6273',
      description: 'RADIUS access denied',
      frequency: '11.8% synthetic baseline weight',
      category: 'authentication',
    },
    {
      id: '6274',
      description: 'RADIUS request discarded (internal EAP error, reason 1)',
      frequency: '0.2% synthetic baseline weight',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Selected Event XML v1 variants have distinct 6272/6273/6274 EventData schemas: 27/27/25 fields.',
    'RADIUS client IP identifies the access point, not the endpoint; station MAC and BSSID:SSID retain their distinct meanings.',
    'One decision every 30 seconds with increasing record IDs; native and ECS times normalize to UTC, including timezone overrides.',
    'The selected wireless profile exposes no session identifier; correlate account, station, client and policy in a short time window.',
    'Source/output checks cover selected published variants, not a new live NPS deployment capture or measured production rates.',
  ],
  format: ['JSON', 'ECS', 'XML'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring failure-to-success episodes; `false` emits only background',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '21600',
      description:
        'Time between episode starts; the first follows one interval; use a positive value above 150 seconds',
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
      description: 'RADIUS client IP',
    },
    {
      name: 'access_point_bssid',
      defaultValue: '00-19-92-74-3C-A1',
      description: 'Access point BSSID',
    },
    {
      name: 'ssid',
      defaultValue: 'CORP',
      description: 'Wireless network name',
    },
    {
      name: 'network_policy',
      defaultValue: 'Corporate WiFi',
      description: 'Matched network policy',
    },
    {
      name: 'connection_policy',
      defaultValue: 'Corporate WiFi RADIUS',
      description: 'Connection request policy',
    },
    {
      name: 'suspicious_station',
      defaultValue: 'DA-7A-11-B2-6F-48',
      description: 'Station MAC used in the incident and baseline',
    },
    {
      name: 'target_user',
      defaultValue: 'finance.admin',
      description: 'Account in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Microsoft Network Policy Server event',
      json: String.raw`{
  "@timestamp": "2026-09-27T06:02:30+00:00",
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
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>6272</EventID><Version>1</Version><Level>0</Level><Task>12552</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-27T06:02:30.000000000Z\"/><EventRecordID>210726</EventRecordID><Correlation/><Execution ProcessID=\"584\" ThreadID=\"4712\"/><Channel>Security</Channel><Computer>nps01.corp.example</Computer><Security/></System><EventData><Data Name=\"SubjectUserSid\">S-1-5-21-3124921703-1242075836-1035668124-1120</Data><Data Name=\"SubjectUserName\">finance.admin</Data><Data Name=\"SubjectDomainName\">CORP</Data><Data Name=\"FullyQualifiedSubjectUserName\">CORP\\finance.admin</Data><Data Name=\"SubjectMachineSID\">S-1-0-0</Data><Data Name=\"SubjectMachineName\">-</Data><Data Name=\"FullyQualifiedSubjectMachineName\">-</Data><Data Name=\"MachineInventory\">-</Data><Data Name=\"CalledStationID\">00-19-92-74-3C-A1:CORP</Data><Data Name=\"CallingStationID\">DA-7A-11-B2-6F-48</Data><Data Name=\"NASIPv4Address\">10.20.1.20</Data><Data Name=\"NASIPv6Address\">-</Data><Data Name=\"NASIdentifier\">office-wifi-ap</Data><Data Name=\"NASPortType\">Wireless - IEEE 802.11</Data><Data Name=\"NASPort\">0</Data><Data Name=\"ClientName\">office-wifi-ap</Data><Data Name=\"ClientIPAddress\">10.20.1.20</Data><Data Name=\"ProxyPolicyName\">Corporate WiFi RADIUS</Data><Data Name=\"NetworkPolicyName\">Corporate WiFi</Data><Data Name=\"AuthenticationProvider\">Windows</Data><Data Name=\"AuthenticationServer\">nps01.corp.example</Data><Data Name=\"AuthenticationType\">PEAP</Data><Data Name=\"EAPType\">Microsoft: Secured password (EAP-MSCHAP v2)</Data><Data Name=\"AccountSessionIdentifier\">-</Data><Data Name=\"QuarantineState\">Full Access</Data><Data Name=\"QuarantineSessionIdentifier\">-</Data><Data Name=\"LoggingResult\">Accounting information was written to the local log file.</Data></EventData></Event>",
    "outcome": "success",
    "provider": "Microsoft-Windows-Security-Auditing",
    "type": [
      "end"
    ]
  },
  "host": {
    "name": "nps01.corp.example"
  },
  "log": {
    "level": "information"
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
      "finance.admin"
    ]
  },
  "source": {
    "mac": "DA-7A-11-B2-6F-48"
  },
  "user": {
    "domain": "CORP",
    "id": "S-1-5-21-3124921703-1242075836-1035668124-1120",
    "name": "finance.admin"
  },
  "winlog": {
    "channel": "Security",
    "computer_name": "nps01.corp.example",
    "event_data": {
      "AccountSessionIdentifier": "-",
      "AuthenticationProvider": "Windows",
      "AuthenticationServer": "nps01.corp.example",
      "AuthenticationType": "PEAP",
      "CalledStationID": "00-19-92-74-3C-A1:CORP",
      "CallingStationID": "DA-7A-11-B2-6F-48",
      "ClientIPAddress": "10.20.1.20",
      "ClientName": "office-wifi-ap",
      "EAPType": "Microsoft: Secured password (EAP-MSCHAP v2)",
      "FullyQualifiedSubjectMachineName": "-",
      "FullyQualifiedSubjectUserName": "CORP\\finance.admin",
      "LoggingResult": "Accounting information was written to the local log file.",
      "MachineInventory": "-",
      "NASIPv4Address": "10.20.1.20",
      "NASIPv6Address": "-",
      "NASIdentifier": "office-wifi-ap",
      "NASPort": "0",
      "NASPortType": "Wireless - IEEE 802.11",
      "NetworkPolicyName": "Corporate WiFi",
      "ProxyPolicyName": "Corporate WiFi RADIUS",
      "QuarantineSessionIdentifier": "-",
      "QuarantineState": "Full Access",
      "SubjectDomainName": "CORP",
      "SubjectMachineName": "-",
      "SubjectMachineSID": "S-1-0-0",
      "SubjectUserName": "finance.admin",
      "SubjectUserSid": "S-1-5-21-3124921703-1242075836-1035668124-1120"
    },
    "event_id": "6272",
    "keywords": [
      "Audit Success"
    ],
    "opcode": "Info",
    "provider_name": "Microsoft-Windows-Security-Auditing",
    "record_id": "210726",
    "task": "Network Policy Server",
    "time_created": "2026-09-27T06:02:30.000000000Z"
  }
}`,
    },
  ],
};
