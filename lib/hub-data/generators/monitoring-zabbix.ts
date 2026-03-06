import type { GeneratorMeta } from '@/lib/hub-types';

export const monitoringZabbix: GeneratorMeta = {
  slug: 'monitoring-zabbix',
  displayName: 'Zabbix Server',
  category: 'monitoring',
  description:
    'Zabbix Server events covering all five event sources: trigger problems and recoveries, operator acknowledgments, network discovery, active agent autoregistration, and internal state changes. Includes correlated problem-recovery chains with monotonically increasing event IDs, weighted severity distribution across six Zabbix severity levels, and ECS-compatible JSON output.',
  format: ['JSON'],
  dataSource: 'Zabbix Server Event API',
  eventCount: 6,
  templateCount: 7,
  highlights: [
    'Problem-recovery correlation via shared state',
    'Monotonically increasing event IDs',
    '15 trigger scenarios across all severity levels',
    'All 5 Zabbix event sources covered',
  ],
  generatorId: 'monitoring-zabbix',
  eventTypes: [
    {
      id: 'trigger-problem',
      description: 'Trigger problem — new alerts from threshold breaches',
      frequency: '40%',
      category: 'host',
    },
    {
      id: 'trigger-recovery',
      description: 'Trigger recovery — resolved problems with correlated IDs',
      frequency: '25%',
      category: 'host',
    },
    {
      id: 'acknowledge',
      description: 'Acknowledgment — operator actions on open problems',
      frequency: '15%',
      category: 'process',
    },
    {
      id: 'internal',
      description: 'Internal event — unsupported items, unknown triggers, failed LLD',
      frequency: '10%',
      category: 'host',
    },
    {
      id: 'discovery',
      description: 'Network discovery — host/service up/down from scheduled scans',
      frequency: '7%',
      category: 'network',
    },
    {
      id: 'autoregistration',
      description: 'Autoregistration — new agents joining monitored infrastructure',
      frequency: '3%',
      category: 'host',
    },
  ],
  realismFeatures: [
    'Problem-recovery correlation via shared state pool with matching trigger IDs and calculated durations',
    'Monotonically increasing event IDs via shared counter across all event types',
    '15 trigger scenarios covering CPU, memory, disk, network, service availability, agent connectivity, MySQL, I/O wait, SSL, temperature, swap, and process count',
    'Weighted severity distribution across all six Zabbix levels (Not classified through Disaster)',
    'Operator workflow simulation with six action types: acknowledge, add message, change severity, close, suppress, unsuppress',
    'Internal event subtypes: unsupported items (50%), unknown triggers (30%), failed LLD rules (20%)',
    'Network discovery with Zabbix agent, ICMP, TCP, and SNMPv2 check types',
    '20 monitored hosts across Linux servers, Windows servers, workstations, and network devices',
  ],
  parameters: [
    {
      name: 'zabbix_server',
      defaultValue: 'zabbix-srv01',
      description: 'Zabbix server hostname',
    },
    {
      name: 'zabbix_server_ip',
      defaultValue: '10.1.0.5',
      description: 'Zabbix server IP address',
    },
    {
      name: 'zabbix_version',
      defaultValue: '7.0.6',
      description: 'Zabbix server version',
    },
    {
      name: 'agent_version',
      defaultValue: '7.0.6',
      description: 'Default Zabbix agent version',
    },
  ],
  sampleOutputs: [
    {
      title: 'Trigger Problem Event',
      json: `{
    "@timestamp": "2026-03-07T14:22:31.456Z",
    "event": {
        "kind": "alert",
        "module": "zabbix",
        "dataset": "zabbix.events",
        "category": ["host"],
        "type": ["info"],
        "severity": 8,
        "outcome": "success",
        "timezone": "UTC",
        "created": "2026-03-07T14:22:31.456Z"
    },
    "message": "High CPU utilization on SRV-WEB01",
    "observer": {
        "vendor": "Zabbix",
        "product": "Zabbix Server",
        "version": "7.0.6",
        "hostname": "zabbix-srv01",
        "ip": ["10.1.0.5"]
    },
    "zabbix": {
        "event": {
            "eventid": 5000042,
            "source": 0,
            "object": 0,
            "objectid": "13500",
            "value": 1,
            "acknowledged": false,
            "severity": 4,
            "severity_name": "High",
            "name": "High CPU utilization on SRV-WEB01",
            "opdata": "CPU: {ITEM.LASTVALUE1}%",
            "suppressed": false,
            "problem_duration": 0
        },
        "trigger": {
            "triggerid": "13500",
            "description": "High CPU utilization on {HOST.NAME}",
            "expression": "avg(/host/system.cpu.util,5m)>90",
            "priority": 4,
            "priority_name": "High",
            "status": "enabled",
            "value": 1,
            "tags": [
                {"tag": "scope", "value": "performance"},
                {"tag": "component", "value": "cpu"}
            ]
        },
        "host": {
            "hostid": "10084",
            "host": "SRV-WEB01",
            "host_group": "Linux servers/Web"
        },
        "item": {
            "name": "CPU utilization",
            "key_": "system.cpu.util"
        }
    },
    "host": {
        "hostname": "SRV-WEB01",
        "ip": ["10.1.2.20"],
        "os": {
            "name": "Linux",
            "version": "Ubuntu 22.04"
        }
    },
    "agent": {
        "type": "zabbix-agent",
        "version": "7.0.6"
    },
    "related": {
        "hosts": ["SRV-WEB01"],
        "ip": ["10.1.2.20"]
    }
}`,
    },
    {
      title: 'Trigger Recovery Event',
      json: `{
    "@timestamp": "2026-03-07T14:35:12.789Z",
    "event": {
        "kind": "alert",
        "module": "zabbix",
        "dataset": "zabbix.events",
        "category": ["host"],
        "type": ["info"],
        "severity": 4,
        "outcome": "success",
        "timezone": "UTC",
        "created": "2026-03-07T14:35:12.789Z"
    },
    "message": "Resolved: High network interface utilization on SRV-WEB02",
    "observer": {
        "vendor": "Zabbix",
        "product": "Zabbix Server",
        "version": "7.0.6",
        "hostname": "zabbix-srv01",
        "ip": ["10.1.0.5"]
    },
    "zabbix": {
        "event": {
            "eventid": 5000058,
            "source": 0,
            "object": 0,
            "objectid": "13505",
            "value": 0,
            "acknowledged": true,
            "severity": 2,
            "severity_name": "Warning",
            "name": "Resolved: High network interface utilization on SRV-WEB02",
            "suppressed": false,
            "r_eventid": 5000058,
            "c_eventid": 5000041,
            "problem_duration": 6974
        },
        "trigger": {
            "triggerid": "13505",
            "description": "High network interface utilization on {HOST.NAME}",
            "expression": "avg(/host/net.if.in[eth0],5m)>100000000",
            "priority": 2,
            "priority_name": "Warning",
            "status": "enabled",
            "value": 0,
            "tags": [
                {"tag": "scope", "value": "performance"},
                {"tag": "component", "value": "network"}
            ]
        },
        "host": {
            "hostid": "10085",
            "host": "SRV-WEB02",
            "host_group": "Linux servers/Web"
        }
    },
    "host": {
        "hostname": "SRV-WEB02",
        "ip": ["10.1.2.21"],
        "os": {
            "name": "Linux",
            "version": "Ubuntu 22.04"
        }
    },
    "agent": {
        "type": "zabbix-agent",
        "version": "7.0.6"
    },
    "related": {
        "hosts": ["SRV-WEB02"],
        "ip": ["10.1.2.21"]
    }
}`,
    },
    {
      title: 'Network Discovery Event',
      json: `{
    "@timestamp": "2026-03-07T15:00:05.123Z",
    "event": {
        "kind": "event",
        "module": "zabbix",
        "dataset": "zabbix.events",
        "category": ["host", "network"],
        "type": ["info"],
        "severity": 2,
        "outcome": "success",
        "timezone": "UTC",
        "created": "2026-03-07T15:00:05.123Z"
    },
    "message": "Discovered host 10.1.5.100 via Zabbix agent check",
    "observer": {
        "vendor": "Zabbix",
        "product": "Zabbix Server",
        "version": "7.0.6",
        "hostname": "zabbix-srv01",
        "ip": ["10.1.0.5"]
    },
    "zabbix": {
        "event": {
            "eventid": 5000072,
            "source": 1,
            "object": 1,
            "value": 0,
            "name": "Discovered host 10.1.5.100 via Zabbix agent check"
        },
        "discovery": {
            "druleid": "3",
            "rule_name": "Local network scan (10.1.0.0/16)",
            "dcheckid": "5",
            "check_type": "Zabbix agent",
            "key_": "system.uname",
            "ip": "10.1.5.100",
            "port": 10050,
            "status": "up",
            "dns": "srv-new01.corp.local"
        }
    },
    "related": {
        "ip": ["10.1.5.100"]
    }
}`,
    },
  ],
};
