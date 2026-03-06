import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyKsc: GeneratorMeta = {
    slug: 'security-kaspersky-ksc',
    displayName: 'Kaspersky Security Center',
    category: 'security',
    description:
      'Kaspersky Security Center (KSC) events — centralized endpoint security management console logs covering threat detections, network attacks, task completion, database updates, device health status, policy enforcement, license management, protection component status, and administration audit trails in JSON format.',
    format: ['JSON'],
    dataSource: 'Kaspersky Security Center Syslog/CEF',
    eventCount: 9,
    templateCount: 10,
    highlights: [
      'Monotonic event ID counter',
      'CSV-sampled host and user pools',
      'Threat scenario library',
      'ECS-compatible field mapping',
    ],
    generatorId: 'security-kaspersky-ksc',
    eventTypes: [
      {
        id: 'task-completed',
        description: 'Task Completed (GNRL_EV_TASK_STATE_CHANGED)',
        frequency: '20%',
        category: 'package',
      },
      {
        id: 'device-status',
        description: 'Device Status (KLSRV_HOST_STATUS_*)',
        frequency: '15%',
        category: 'host',
      },
      {
        id: 'update-status',
        description: 'Update Status (GNRL_EV_BASES_UPDATED/OUTDATED)',
        frequency: '15%',
        category: 'package',
      },
      {
        id: 'threat-detected',
        description: 'Threat Detected (GNRL_EV_VIRUS_FOUND)',
        frequency: '12%',
        category: 'malware',
      },
      {
        id: 'policy-event',
        description: 'Policy Events',
        frequency: '10%',
        category: 'configuration',
      },
      {
        id: 'network-attack',
        description: 'Network Attack (GNRL_EV_ATTACK_DETECTED)',
        frequency: '8%',
        category: 'intrusion_detection',
      },
      {
        id: 'protection-status',
        description: 'Protection Status',
        frequency: '8%',
        category: 'host',
      },
      {
        id: 'audit-event',
        description: 'Audit Events (KLAUD_EV_SERVERACTION)',
        frequency: '7%',
        category: 'authentication',
      },
      {
        id: 'license-event',
        description: 'License Events',
        frequency: '5%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      'Shared monotonic event ID counter across all event types for consistent ordering',
      'CSV-sampled host pool with hostname, IP, OS, group, and domain fields for correlated device identity',
      'CSV-sampled user pool with username, domain, department, and role for realistic user attribution',
      'Threat scenario library with KSC event class IDs, threat names, severity levels, and detection components',
      'Network attack scenarios with attacker IPs, protocols, CVE references, and IDS rule IDs',
      'Task metadata covering scan, update, patch, and inventory task types with duration and object counts',
      'Malware path templates with per-user directory substitution for realistic file system paths',
    ],
    parameters: [
      {
        name: 'ksc_version',
        defaultValue: '14.2.0.26967',
        description: 'KSC Administration Server version',
      },
      {
        name: 'ksc_server',
        defaultValue: 'KSC-SRV01',
        description: 'KSC server hostname',
      },
      {
        name: 'ksc_server_ip',
        defaultValue: '10.1.0.10',
        description: 'KSC server IP address',
      },
      {
        name: 'kes_version',
        defaultValue: '12.0.0.1131',
        description: 'Kaspersky Endpoint Security agent version',
      },
      {
        name: 'update_source',
        defaultValue: 'https://dnl-01.geo.kaspersky.com/',
        description: 'Signature database update source URL',
      },
      {
        name: 'license_type',
        defaultValue: 'KES for Business Advanced',
        description: 'Kaspersky license edition',
      },
      {
        name: 'license_count',
        defaultValue: '500',
        description: 'Total licensed seat count',
      },
    ],
    sampleOutputs: [
      {
        title: 'Threat Detected (GNRL_EV_VIRUS_FOUND)',
        json: `{
    "@timestamp": "2026-03-07T10:15:32.000Z",
    "event": {
        "category": ["malware"],
        "type": ["info"],
        "severity": 4,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.ksc"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Security Center",
        "version": "14.2.0.26967",
        "name": "KSC-SRV01",
        "ip": "10.1.0.10"
    },
    "host": {
        "hostname": "WS-FIN-PC03",
        "ip": "10.1.20.33",
        "os": { "name": "Windows 11", "version": "23H2" }
    },
    "kaspersky": {
        "ksc": {
            "event_id": 1042,
            "event_class_id": "GNRL_EV_VIRUS_FOUND",
            "event_type": "Virus found",
            "component": "File Threat Protection",
            "result": "Disinfected",
            "threat": {
                "name": "HEUR:Trojan.Win32.Generic",
                "level": "High"
            },
            "object": {
                "type": "file",
                "name": "C:\\\\Users\\\\jdoe\\\\Downloads\\\\invoice.exe",
                "path": "C:\\\\Users\\\\jdoe\\\\Downloads\\\\invoice.exe"
            },
            "task": "Real-time protection",
            "group": "Managed devices/Workstations/Finance"
        }
    },
    "file": {
        "name": "invoice.exe",
        "path": "C:\\\\Users\\\\jdoe\\\\Downloads\\\\invoice.exe",
        "size": 245760,
        "hash": {
            "sha256": "a1b2c3d4e5f6...",
            "md5": "d4e5f6a1b2c3..."
        }
    },
    "user": {
        "name": "jdoe",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["WS-FIN-PC03"],
        "ip": ["10.1.20.33"],
        "user": ["jdoe"]
    }
}`,
      },
      {
        title: 'Task Completed (GNRL_EV_TASK_STATE_CHANGED)',
        json: `{
    "@timestamp": "2026-03-07T11:30:45.000Z",
    "event": {
        "category": ["package"],
        "type": ["info"],
        "severity": 1,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.ksc"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Security Center",
        "version": "14.2.0.26967",
        "name": "KSC-SRV01",
        "ip": "10.1.0.10"
    },
    "host": {
        "hostname": "SRV-DC01",
        "ip": "10.1.10.10",
        "os": { "name": "Windows Server 2022", "version": "21H2" }
    },
    "kaspersky": {
        "ksc": {
            "event_id": 1087,
            "event_class_id": "GNRL_EV_TASK_STATE_CHANGED",
            "event_type": "Task completed",
            "component": "Full Scan",
            "result": "Completed successfully",
            "task": {
                "name": "Full Scan",
                "display_name": "Full Virus Scan",
                "type": "scan",
                "duration_seconds": 3420,
                "objects_processed": 287654,
                "threats_detected": 0
            },
            "group": "Managed devices/Servers/Domain Controllers"
        }
    },
    "user": {
        "name": "SYSTEM",
        "domain": "NT AUTHORITY"
    },
    "related": {
        "hosts": ["SRV-DC01"],
        "ip": ["10.1.10.10"],
        "user": ["SYSTEM"]
    }
}`,
      },
      {
        title: 'Audit Event (KLAUD_EV_SERVERACTION)',
        json: `{
    "@timestamp": "2026-03-07T09:05:12.000Z",
    "event": {
        "category": ["authentication"],
        "type": ["authentication_success"],
        "severity": 1,
        "outcome": "success",
        "module": "kaspersky",
        "dataset": "kaspersky.ksc"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Security Center",
        "version": "14.2.0.26967",
        "name": "KSC-SRV01",
        "ip": "10.1.0.10"
    },
    "kaspersky": {
        "ksc": {
            "event_id": 1103,
            "event_class_id": "KLAUD_EV_SERVERACTION",
            "event_type": "Audit: login",
            "component": "Console",
            "result": "Console login successful",
            "audit": {
                "action": "login",
                "description": "Console login successful",
                "admin_user": "ksc_admin",
                "source_ip": "10.1.20.50"
            }
        }
    },
    "source": {
        "ip": "10.1.20.50"
    },
    "user": {
        "name": "ksc_admin",
        "domain": "CORP",
        "roles": ["KSC Administrator"]
    },
    "related": {
        "hosts": ["KSC-SRV01"],
        "ip": ["10.1.0.10", "10.1.20.50"],
        "user": ["ksc_admin"]
    }
}`,
      },
    ],
  };
