import type { GeneratorMeta } from '@/lib/hub-types';

export const dlpInfowatch: GeneratorMeta = {
    slug: 'dlp-infowatch',
    displayName: 'InfoWatch Traffic Monitor',
    category: 'security',
    description:
      'InfoWatch Traffic Monitor DLP events — enterprise data leak prevention system monitoring email, web, messengers, USB devices, and printers for policy violations and sensitive data exfiltration. Generates policy violation alerts, content capture records, device control actions, print control events, system health notifications, and incident workflow updates in CEF/syslog-compatible JSON format with ECS field mapping.',
    format: ['JSON'],
    dataSource: 'InfoWatch Traffic Monitor CEF/Syslog',
    eventCount: 6,
    templateCount: 7,
    highlights: [
      'Six DLP event types with realistic distributions',
      'Multi-channel monitoring (email, web, IM, USB, print)',
      'CSV-sampled employee and department pools',
      'ECS-compatible field mapping',
    ],
    generatorId: 'dlp-infowatch',
    eventTypes: [
      {
        id: 'content-capture',
        description: 'Content Capture (data channel interception)',
        frequency: '35%',
        category: 'network',
      },
      {
        id: 'policy-violation',
        description: 'Policy Violation (DLP rule triggered)',
        frequency: '25%',
        category: 'intrusion_detection',
      },
      {
        id: 'device-control',
        description: 'Device Control (removable media events)',
        frequency: '12%',
        category: 'host',
      },
      {
        id: 'system-event',
        description: 'System Event (service health and status)',
        frequency: '10%',
        category: 'host',
      },
      {
        id: 'incident-update',
        description: 'Incident Update (workflow state changes)',
        frequency: '10%',
        category: 'configuration',
      },
      {
        id: 'print-control',
        description: 'Print Control (print job monitoring)',
        frequency: '8%',
        category: 'file',
      },
    ],
    realismFeatures: [
      'Shared monotonic event ID counter across all event types for consistent ordering',
      'CSV-sampled employee pool with username, full name, department, and position for realistic user attribution',
      'Multi-channel content capture covering email, web uploads, messenger, USB copy, and print channels',
      'DLP policy library with category names, sensitivity levels, and pattern match descriptions',
      'Device inventory with vendor, model, serial number for USB and removable media events',
      'Incident lifecycle with assignee, status transitions, and resolution timestamps',
      'File metadata with MIME types, sizes, and content fingerprint hashes',
    ],
    parameters: [
      {
        name: 'iw_version',
        defaultValue: '6.11.0.2345',
        description: 'InfoWatch Traffic Monitor version',
      },
      {
        name: 'iw_server',
        defaultValue: 'IW-TM01',
        description: 'InfoWatch server hostname',
      },
      {
        name: 'iw_server_ip',
        defaultValue: '10.1.0.20',
        description: 'InfoWatch server IP address',
      },
      {
        name: 'domain',
        defaultValue: 'CORP.ACME.COM',
        description: 'Active Directory domain',
      },
      {
        name: 'organization',
        defaultValue: 'ACME Corp',
        description: 'Organization name',
      },
    ],
    sampleOutputs: [
      {
        title: 'Policy Violation (DLP rule triggered)',
        json: `{
    "@timestamp": "2026-03-07T10:22:15.000Z",
    "event": {
        "kind": "alert",
        "module": "infowatch",
        "dataset": "infowatch.dlp",
        "category": ["intrusion_detection"],
        "type": ["info"],
        "severity": 4,
        "outcome": "success"
    },
    "observer": {
        "vendor": "InfoWatch",
        "product": "Traffic Monitor",
        "version": "6.11.0.2345",
        "hostname": "IW-TM01",
        "ip": ["10.1.0.20"]
    },
    "infowatch": {
        "event_id": 500012,
        "event_type": "policy_violation",
        "channel": "email",
        "policy": {
            "name": "Confidential Documents",
            "category": "Data Protection",
            "sensitivity": "high",
            "action": "block"
        },
        "content": {
            "subject": "Q1 Financial Report",
            "recipient": "external@partner.com",
            "match_count": 3,
            "match_pattern": "Credit card numbers (PCI DSS)"
        },
        "verdict": "blocked"
    },
    "host": {
        "hostname": "DESKTOP-FIN03",
        "ip": ["10.1.10.33"],
        "os": { "name": "Windows 10", "version": "10.0.19045" },
        "domain": "CORP.ACME.COM"
    },
    "user": {
        "name": "petrov.av",
        "full_name": "Petrov Alexey V.",
        "domain": "CORP"
    },
    "file": {
        "name": "Q1_Financial_Report.xlsx",
        "size": 1482752,
        "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "hash": { "sha256": "b3f1a2c4d5e6..." }
    },
    "related": {
        "hosts": ["DESKTOP-FIN03"],
        "ip": ["10.1.10.33"],
        "user": ["petrov.av"]
    }
}`,
      },
      {
        title: 'Content Capture (email interception)',
        json: `{
    "@timestamp": "2026-03-07T10:25:42.000Z",
    "event": {
        "kind": "event",
        "module": "infowatch",
        "dataset": "infowatch.dlp",
        "category": ["network"],
        "type": ["info"],
        "severity": 1,
        "outcome": "success"
    },
    "observer": {
        "vendor": "InfoWatch",
        "product": "Traffic Monitor",
        "version": "6.11.0.2345",
        "hostname": "IW-TM01",
        "ip": ["10.1.0.20"]
    },
    "infowatch": {
        "event_id": 500034,
        "event_type": "content_capture",
        "channel": "email",
        "capture": {
            "direction": "outbound",
            "subject": "Meeting notes",
            "sender": "ivanova.mn@corp.acme.com",
            "recipients": ["colleague@corp.acme.com"],
            "attachment_count": 1,
            "size_bytes": 245760
        },
        "verdict": "passed"
    },
    "host": {
        "hostname": "DESKTOP-HR05",
        "ip": ["10.1.10.45"],
        "os": { "name": "Windows 11", "version": "23H2" },
        "domain": "CORP.ACME.COM"
    },
    "user": {
        "name": "ivanova.mn",
        "full_name": "Ivanova Maria N.",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["DESKTOP-HR05"],
        "ip": ["10.1.10.45"],
        "user": ["ivanova.mn"]
    }
}`,
      },
      {
        title: 'Device Control (USB blocked)',
        json: `{
    "@timestamp": "2026-03-07T10:30:08.000Z",
    "event": {
        "kind": "event",
        "module": "infowatch",
        "dataset": "infowatch.dlp",
        "category": ["host"],
        "type": ["denied"],
        "severity": 3,
        "outcome": "failure"
    },
    "observer": {
        "vendor": "InfoWatch",
        "product": "Traffic Monitor",
        "version": "6.11.0.2345",
        "hostname": "IW-TM01",
        "ip": ["10.1.0.20"]
    },
    "infowatch": {
        "event_id": 500056,
        "event_type": "device_control",
        "device": {
            "type": "USB Flash Drive",
            "class": "USB Mass Storage",
            "vendor": "Kingston",
            "model": "DataTraveler 3.0",
            "serial": "E0D55EA573DCF450",
            "vid_pid": "0951:1666"
        },
        "action": "blocked",
        "reason": "Removable media not in whitelist"
    },
    "host": {
        "hostname": "DESKTOP-DEV02",
        "ip": ["10.1.10.52"],
        "os": { "name": "Windows 10", "version": "10.0.19045" },
        "domain": "CORP.ACME.COM"
    },
    "user": {
        "name": "kozlov.ds",
        "full_name": "Kozlov Dmitry S.",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["DESKTOP-DEV02"],
        "ip": ["10.1.10.52"],
        "user": ["kozlov.ds"]
    }
}`,
      },
    ],
  };
