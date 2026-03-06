import type { GeneratorMeta } from '@/lib/hub-types';

export const endpointSecretNet: GeneratorMeta = {
    slug: 'endpoint-secret-net',
    displayName: 'Secret Net Studio',
    category: 'endpoint',
    description:
      'Secret Net Studio endpoint protection events by Security Code — authentication, mandatory and discretionary access control, integrity monitoring, device control, closed software environment, network protection, data protection with secure erasure, and audit events in ECS-compatible JSON format with Russian-locale descriptions matching real Secret Net Studio output.',
    format: ['JSON'],
    dataSource: 'Secret Net Studio (Security Code)',
    eventCount: 9,
    templateCount: 10,
    highlights: [
      'Nine distinct security subsystems',
      'Russian-locale event descriptions',
      'Three-tier mandatory access control levels',
      'CSV-sampled host and user pools',
    ],
    generatorId: 'endpoint-secret-net',
    eventTypes: [
      {
        id: 'authentication',
        description: 'Authentication (SN_AUTH_*)',
        frequency: '25%',
        category: 'authentication',
      },
      {
        id: 'discretionary-access',
        description: 'Discretionary Access Control (SN_DAC_*)',
        frequency: '18%',
        category: 'file',
      },
      {
        id: 'integrity-control',
        description: 'Integrity Control (SN_INTEGRITY_*)',
        frequency: '15%',
        category: 'host',
      },
      {
        id: 'device-control',
        description: 'Device Control (SN_DEVICE_*)',
        frequency: '12%',
        category: 'host',
      },
      {
        id: 'mandatory-access',
        description: 'Mandatory Access Control (SN_MAC_*)',
        frequency: '8%',
        category: 'file',
      },
      {
        id: 'closed-environment',
        description: 'Closed Software Environment (SN_CSE_*)',
        frequency: '7%',
        category: 'process',
      },
      {
        id: 'network-protection',
        description: 'Network Protection (SN_NET_*)',
        frequency: '7%',
        category: 'network',
      },
      {
        id: 'data-protection',
        description: 'Data Protection (SN_DATA_*)',
        frequency: '4%',
        category: 'file',
      },
      {
        id: 'audit',
        description: 'Audit (SN_AUDIT_*)',
        frequency: '4%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      'Shared monotonic event ID counter across all event types for consistent ordering',
      'CSV-sampled host pool with hostname, IP, MAC, OS, and domain fields for correlated device identity',
      'CSV-sampled user pool with Russian full names, departments, and clearance levels',
      'Three-tier confidentiality levels (Несекретно, Конфиденциально, Строго конфиденциально) matching Russian classification scheme',
      'Russian-language event descriptions and subsystem names matching real Secret Net Studio output',
      'Device inventory with vendor, model, serial, and VID/PID for USB device control events',
      'Integrity object database with file paths, registry keys, and expected checksums',
    ],
    parameters: [
      {
        name: 'sn_version',
        defaultValue: '8.10.0.1573',
        description: 'Secret Net Studio version',
      },
      {
        name: 'sn_server',
        defaultValue: 'SN-SRV01',
        description: 'Secret Net management server hostname',
      },
      {
        name: 'sn_server_ip',
        defaultValue: '10.1.0.15',
        description: 'Secret Net management server IP',
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
        title: 'Authentication (SN_AUTH_LOGIN_OK)',
        json: `{
    "@timestamp": "2026-03-07T10:15:23.456Z",
    "event": {
        "kind": "event",
        "module": "secret_net",
        "dataset": "secret_net.endpoint",
        "category": ["authentication"],
        "type": ["start"],
        "severity": 1,
        "outcome": "success"
    },
    "observer": {
        "vendor": "Security Code",
        "product": "Secret Net Studio",
        "version": "8.10.0.1573",
        "hostname": "SN-SRV01",
        "ip": ["10.1.0.15"]
    },
    "host": {
        "hostname": "DESKTOP-FIN02",
        "ip": ["10.1.10.35"],
        "mac": ["00:50:56:8a:23:45"],
        "os": { "name": "Windows 10", "version": "10.0.19045" },
        "domain": "CORP.ACME.COM"
    },
    "secret_net": {
        "event_id": 1000001,
        "event_class": "SN_AUTH_LOGIN_OK",
        "subsystem": "Идентификация и аутентификация",
        "action": "login_success",
        "description": "Успешный вход в систему",
        "auth_method": "password+token",
        "logon_type": 2,
        "computer_level": "Строго конфиденциально"
    },
    "user": {
        "name": "sidorova.en",
        "full_name": "Сидорова Елена Николаевна",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["DESKTOP-FIN02"],
        "ip": ["10.1.10.35"],
        "user": ["sidorova.en"]
    }
}`,
      },
      {
        title: 'Mandatory Access Denied (SN_MAC_ACCESS_DENIED)',
        json: `{
    "@timestamp": "2026-03-07T10:16:45.789Z",
    "event": {
        "kind": "event",
        "module": "secret_net",
        "dataset": "secret_net.endpoint",
        "category": ["file"],
        "type": ["access"],
        "severity": 3,
        "outcome": "failure"
    },
    "observer": {
        "vendor": "Security Code",
        "product": "Secret Net Studio",
        "version": "8.10.0.1573",
        "hostname": "SN-SRV01",
        "ip": ["10.1.0.15"]
    },
    "host": {
        "hostname": "DESKTOP-MKT05",
        "ip": ["10.1.10.42"],
        "os": { "name": "Windows 10", "version": "10.0.19045" },
        "domain": "CORP.ACME.COM"
    },
    "secret_net": {
        "event_id": 1000002,
        "event_class": "SN_MAC_ACCESS_DENIED",
        "subsystem": "Мандатное управление доступом",
        "action": "access_denied",
        "description": "Мандатный доступ: доступ запрещен",
        "mandatory_access": {
            "resource_path": "C:\\\\Confidential\\\\Finance\\\\budget_2026.xlsx",
            "resource_level": "Строго конфиденциально",
            "user_clearance": "Несекретно",
            "session_level": "Несекретно"
        }
    },
    "user": {
        "name": "fedorov.mk",
        "full_name": "Федоров Максим Константинович",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["DESKTOP-MKT05"],
        "ip": ["10.1.10.42"],
        "user": ["fedorov.mk"]
    }
}`,
      },
      {
        title: 'Device Blocked (SN_DEVICE_BLOCKED)',
        json: `{
    "@timestamp": "2026-03-07T10:18:12.234Z",
    "event": {
        "kind": "event",
        "module": "secret_net",
        "dataset": "secret_net.endpoint",
        "category": ["host"],
        "type": ["denied"],
        "severity": 3,
        "outcome": "failure"
    },
    "observer": {
        "vendor": "Security Code",
        "product": "Secret Net Studio",
        "version": "8.10.0.1573",
        "hostname": "SN-SRV01",
        "ip": ["10.1.0.15"]
    },
    "host": {
        "hostname": "DESKTOP-HR01",
        "ip": ["10.1.10.21"],
        "os": { "name": "Windows 10", "version": "10.0.19045" },
        "domain": "CORP.ACME.COM"
    },
    "secret_net": {
        "event_id": 1000003,
        "event_class": "SN_DEVICE_BLOCKED",
        "subsystem": "Контроль устройств",
        "action": "blocked",
        "description": "Подключение устройства заблокировано",
        "device": {
            "type": "USB Flash Drive",
            "class": "USB",
            "vendor": "SanDisk",
            "model": "Ultra USB 3.0",
            "serial": "4C530001130921119244",
            "vid_pid": "0781:5581"
        }
    },
    "user": {
        "name": "smirnova.ov",
        "full_name": "Смирнова Ольга Витальевна",
        "domain": "CORP"
    },
    "related": {
        "hosts": ["DESKTOP-HR01"],
        "ip": ["10.1.10.21"],
        "user": ["smirnova.ov"]
    }
}`,
      },
    ],
  };
