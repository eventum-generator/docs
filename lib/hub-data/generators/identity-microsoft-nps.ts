/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityMicrosoftNps: GeneratorMeta = {
  slug: 'identity-microsoft-nps',
  displayName: 'Microsoft Network Policy Server',
  category: 'identity',
  dataSource: 'Windows Security events 6272, 6273 and 6274 from NPS',
  description:
    'Network Policy Server (NPS) RADIUS grants, denials and discards from the Windows Security channel as ECS JSON, with the complete Security Event XML record in event.original and the named fields in winlog.event_data, normalized to UTC. Background decisions include retry bursts of denials by one account and station. Recurring episodes show four credential denials followed by a grant for one account and station within two to four and a half minutes.',
  generatorId: 'microsoft-nps',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Complete native Security Event XML v1 in event.original',
    'Distinct 27/27/25-field EventData variants for 6272/6273/6274',
    'Recurring four-denials-then-grant episodes about every six hours',
  ],
  anomalyChain:
    'Four 6273 credential denials followed by one 6272 grant for finance.admin from station DA-7A-11-B2-6F-48. The steps follow the background retry law (30, 60, 90 or 120 seconds apart, redrawn until the grant falls at most 270 seconds after the first denial) with ordinary decisions between the steps, so the sequence spans two to four and a half minutes; every episode has fresh EventRecordID values, and AccountSessionIdentifier stays the native hyphen, so correlate on SubjectUserName and CallingStationID within five minutes. The first episode starts at a uniformly drawn time within the first min(anomaly_interval_seconds, 24 h) of the run, with no preferred hour; each next one is due one interval after the previous actual start and starts at a uniform time within a window of min(interval / 4, 6 h) centred on that due time, so starts are 6 h ± 45 min apart by default, do not drift, and missed intervals are never caught up (about 5.40-6.70 h). The same account and station also produce ordinary grants, denials and retry bursts in both modes; only an ordinary grant that would complete four denials of the same account and station within 300 seconds of the first does not happen, and that 30-second slot has no record. Episode denials count too, so each episode completes the chain exactly once.',
  eventTypes: [
    {
      id: '6272',
      description: 'RADIUS access granted',
      frequency: '87.2% measured share',
      category: 'authentication',
    },
    {
      id: '6273',
      description: 'RADIUS access denied',
      frequency: '12.7% measured share',
      category: 'authentication',
    },
    {
      id: '6274',
      description: 'RADIUS request discarded (internal EAP error, reason 1)',
      frequency: '0.2% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'The selected published v1 records give distinct EventData schemas: 27, 27 and 25 fields for 6272, 6273 and 6274. The grant has quarantine fields and no reason fields; the discard has neither MachineInventory nor LoggingResult. Reason code 16 on 6273 carries the full invalid-credentials text and a matched network policy.',
    'One decision every 30 seconds: the next retry of a running burst, or else an ordinary decision for a random account (91.8% grant, 8% denial, 0.2% discard). 30% of ordinary denials start a retry burst of one to six more denials of the same account and station 30-120 seconds apart, and 80% of bursts end with a grant, so runs of one to ten denials of one account and station occur in background (about 60 runs of four, 45 of five and 30 of six a week). Weights, cadence and the retry law are illustrative defaults, not measured rates.',
    'Each record carries a random sub-second offset in 100-nanosecond units: the XML SystemTime has nine fractional digits, as in the published 6274 record, and winlog.time_created has seven, as in the Elastic 6272 fixture.',
    "ClientIPAddress identifies the RADIUS client or access point, not the user's device; CallingStationID is the station MAC and CalledStationID the access point BSSID and SSID. The sequence does not imply a policy change.",
    'Background never completes the chain: a week of background holds about 157 sequences of four denials of one account and station within 300 seconds; a grant of that pair never follows inside the window, and in each of the five minutes after it 8-10% of these sequences get one, while the grant share of other accounts stays level. The slots of withheld grants stay empty, 104-143 a week in background (about 0.6% of slots), and are the only gaps in the 30-second grid.',
    'Fields follow the selected published variants, not a live NPS capture; the 6274 record comes from a PEAP deployment rather than a Wi-Fi access point. Event IDs 6275-6280, NPS operational logs and accounting files are out of scope, and actual rates and optional field values depend on Windows version, access point, authentication method and policy.',
  ],
  eventFormat: 'ECS JSON',
  originalFormat: 'XML',
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Include recurring failure-to-success episodes; false emits only background',
    },
    {
      name: 'anomaly_interval_seconds',
      defaultValue: '21600',
      description:
        'Mean time between episode starts (each start within ± min(interval / 8, 3 h) of its due time); the first falls within min(interval, 24 h) of the run start; use a value above 600 seconds',
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
      title: 'Grant ending the first episode',
      json: String.raw`{
  "@timestamp": "2026-09-01T03:29:30.495859+00:00",
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
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Microsoft-Windows-Security-Auditing\" Guid=\"{54849625-5478-4994-A5BA-3E3B0328C30D}\"/><EventID>6272</EventID><Version>1</Version><Level>0</Level><Task>12552</Task><Opcode>0</Opcode><Keywords>0x8020000000000000</Keywords><TimeCreated SystemTime=\"2026-09-01T03:29:30.495859700Z\"/><EventRecordID>210419</EventRecordID><Correlation/><Execution ProcessID=\"584\" ThreadID=\"4712\"/><Channel>Security</Channel><Computer>nps01.corp.example</Computer><Security/></System><EventData><Data Name=\"SubjectUserSid\">S-1-5-21-3124921703-1242075836-1035668124-1120</Data><Data Name=\"SubjectUserName\">finance.admin</Data><Data Name=\"SubjectDomainName\">CORP</Data><Data Name=\"FullyQualifiedSubjectUserName\">CORP\\finance.admin</Data><Data Name=\"SubjectMachineSID\">S-1-0-0</Data><Data Name=\"SubjectMachineName\">-</Data><Data Name=\"FullyQualifiedSubjectMachineName\">-</Data><Data Name=\"MachineInventory\">-</Data><Data Name=\"CalledStationID\">00-19-92-74-3C-A1:CORP</Data><Data Name=\"CallingStationID\">DA-7A-11-B2-6F-48</Data><Data Name=\"NASIPv4Address\">10.20.1.20</Data><Data Name=\"NASIPv6Address\">-</Data><Data Name=\"NASIdentifier\">office-wifi-ap</Data><Data Name=\"NASPortType\">Wireless - IEEE 802.11</Data><Data Name=\"NASPort\">0</Data><Data Name=\"ClientName\">office-wifi-ap</Data><Data Name=\"ClientIPAddress\">10.20.1.20</Data><Data Name=\"ProxyPolicyName\">Corporate WiFi RADIUS</Data><Data Name=\"NetworkPolicyName\">Corporate WiFi</Data><Data Name=\"AuthenticationProvider\">Windows</Data><Data Name=\"AuthenticationServer\">nps01.corp.example</Data><Data Name=\"AuthenticationType\">PEAP</Data><Data Name=\"EAPType\">Microsoft: Secured password (EAP-MSCHAP v2)</Data><Data Name=\"AccountSessionIdentifier\">-</Data><Data Name=\"QuarantineState\">Full Access</Data><Data Name=\"QuarantineSessionIdentifier\">-</Data><Data Name=\"LoggingResult\">Accounting information was written to the local log file.</Data></EventData></Event>",
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
    "record_id": "210419",
    "task": "Network Policy Server",
    "time_created": "2026-09-01T03:29:30.4958597Z"
  }
}`,
    },
  ],
};
