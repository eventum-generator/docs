import type { GeneratorMeta } from '@/lib/hub-types';

export const crowdstrikeFalcon: GeneratorMeta = {
    slug: 'crowdstrike-falcon',
    displayName: 'CrowdStrike Falcon',
    category: 'security',
    description:
      'CrowdStrike Falcon Event Stream events — endpoint detections with MITRE ATT&CK mapping, authentication and user activity audits, firewall rule matches, incident summaries, and Real Time Response sessions in the native Event Streams envelope format.',
    format: ['JSON'],
    dataSource: 'CrowdStrike Falcon Event Streams API',
    eventCount: 7,
    templateCount: 8,
    highlights: [
      'MITRE ATT&CK mapping',
      'Pattern disposition flags',
      'Remote session correlation',
      'Shared monotonic offset counter',
    ],
    generatorId: 'crowdstrike-falcon',
    eventTypes: [
      {
        id: 'epp-detection',
        description: 'Endpoint Detection (EPP)',
        frequency: '29.1%',
        category: 'intrusion_detection',
      },
      {
        id: 'auth-audit',
        description: 'Authentication Audit',
        frequency: '23.3%',
        category: 'authentication',
      },
      {
        id: 'user-audit',
        description: 'User Activity Audit',
        frequency: '17.4%',
        category: 'iam',
      },
      {
        id: 'firewall-match',
        description: 'Firewall Rule Match',
        frequency: '17.4%',
        category: 'network',
      },
      {
        id: 'incident-summary',
        description: 'Incident Summary',
        frequency: '5.8%',
        category: 'intrusion_detection',
      },
      {
        id: 'remote-session-start',
        description: 'Remote Response Session Start',
        frequency: '3.5%',
        category: 'session',
      },
      {
        id: 'remote-session-end',
        description: 'Remote Response Session End',
        frequency: '3.5%',
        category: 'session',
      },
    ],
    realismFeatures: [
      '20 detection scenarios covering all MITRE ATT&CK tactics from Initial Access through Impact, plus CrowdStrike-specific objectives',
      '25 process chains mixing benign and suspicious execution paths (e.g., winword->powershell->certutil)',
      'Pattern disposition flags with 20 boolean fields per detection reflecting realistic prevention/detection configurations',
      'Shared monotonic offset counter ensuring consistent event stream ordering across all event types',
      'Remote session correlation — session start events store state; session end events pop from a bounded pool of 20',
    ],
    parameters: [
      {
        name: 'customer_id',
        defaultValue: 'a1b2c3d4...',
        description: 'CrowdStrike Customer ID (CID)',
      },
      {
        name: 'falcon_base_url',
        defaultValue: 'https://falcon.crowdstrike.com',
        description: 'Falcon console base URL',
      },
    ],
    sampleOutputs: [
      {
        title: 'Endpoint Detection (EPP)',
        json: `{
    "metadata": {
        "customerIDString": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        "offset": 42,
        "eventType": "EppDetectionSummaryEvent",
        "eventCreationTime": 1741276800000,
        "version": "1.0"
    },
    "event": {
        "ProcessStartTime": 1741276500,
        "ProcessId": 15234,
        "ParentProcessId": 8012,
        "Hostname": "DESKTOP-HR01",
        "UserName": "jsmith",
        "Name": "Malicious PowerShell Execution",
        "Severity": 80,
        "SeverityName": "High",
        "FileName": "powershell.exe",
        "CommandLine": "powershell.exe -nop -w hidden -enc SQBF...",
        "Tactic": "Execution",
        "Technique": "PowerShell",
        "Objective": "Falcon Detection Method",
        "PatternDispositionDescription": "Prevention, process killed.",
        "PatternDispositionFlags": {
            "KillProcess": true,
            "KillSubProcess": true,
            "OperationBlocked": true,
            "ProcessBlocked": true
        }
    }
}`,
      },
      {
        title: 'Authentication Audit',
        json: `{
    "metadata": {
        "customerIDString": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        "offset": 87,
        "eventType": "AuthActivityAuditEvent",
        "eventCreationTime": 1741277400000,
        "version": "1.0"
    },
    "event": {
        "UserId": "admin@acme.com",
        "UserIp": "203.0.113.45",
        "OperationName": "saml2Assert",
        "ServiceName": "CrowdStrike Authentication",
        "Success": true,
        "UTCTimestamp": 1741277400000,
        "AuditKeyValues": [
            {"Key": "IPAddress", "ValueString": "203.0.113.45"},
            {"Key": "ClientId", "ValueString": "a4f8c2e1b7d93061"}
        ]
    }
}`,
      },
      {
        title: 'Firewall Rule Match',
        json: `{
    "metadata": {
        "customerIDString": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        "offset": 104,
        "eventType": "FirewallMatchEvent",
        "eventCreationTime": 1741278000000,
        "version": "1.0"
    },
    "event": {
        "HostName": "SRV-DC01",
        "EventType": "FirewallRuleIP4Matched",
        "ConnectionDirection": 1,
        "Protocol": 6,
        "LocalAddress": "10.1.10.10",
        "LocalPort": 52431,
        "RemoteAddress": "198.51.100.25",
        "RemotePort": 443,
        "RuleName": "Block Known C2 Servers",
        "RuleAction": 2,
        "RuleGroupName": "Threat Intelligence",
        "PolicyName": "Default Workstation Policy",
        "ImageFileName": "powershell.exe",
        "Platform": "Windows"
    }
}`,
      },
    ],
  };
