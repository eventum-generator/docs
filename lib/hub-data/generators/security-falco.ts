import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFalco: GeneratorMeta = {
  slug: 'security-falco',
  displayName: 'Falco Alerts',
  category: 'security',
  description:
    'Falco syscall alerts as ECS JSON, with the native Falco JSON alert preserved in event.original and pod, container and node context for correlation.',
  format: ['JSON', 'ECS'],
  dataSource: 'Falco JSON alerts',
  eventCount: 3,
  templateCount: 3,
  highlights: [
    'Native Falco JSON in event.original',
    '50 fictional pods across five namespaces',
    'Shell, sensitive-file and API-contact chain',
    'Elastic Falco alerts field structure',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Terminal shell, /etc/shadow read and Kubernetes API contact in one container, joined by container ID and pod.',
  generatorId: 'security-falco',
  eventTypes: [
    {
      id: 'terminal-shell',
      description: 'Terminal shell in container (Notice)',
      frequency: '67.5%',
      category: 'process',
    },
    {
      id: 'sensitive-file-read',
      description: 'Read sensitive file untrusted (Warning)',
      frequency: '27.5%',
      category: 'file',
    },
    {
      id: 'k8s-api-contact',
      description: 'Contact K8S API Server From Container (Notice)',
      frequency: '5%',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Native Falco JSON alert preserved in event.original alongside normalized ECS fields',
    'Fifty synthetic pods across five namespaces and five nodes',
    'Container image and Kubernetes names follow documented Falco append_output enrichment',
    'Linked alerts share container ID, pod and namespace across all three steps',
    'Independent background alerts remain when anomaly_mode is false',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Enable linked container chain; false emits independent background alerts',
    },
    {
      name: 'agent_version',
      defaultValue: '8.13.3',
      description: 'Synthetic Elastic Agent version',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.17.0',
      description: 'ECS version in the normalized event',
    },
    {
      name: 'data_stream_namespace',
      defaultValue: 'lab-k8s',
      description: 'Elastic data stream namespace',
    },
    {
      name: 'log_path',
      defaultValue: '/var/log/falco/events.log',
      description: 'Simulated source log path',
    },
  ],
  sampleOutputs: [
    {
      title: 'Read sensitive file untrusted',
      json: String.raw`{
  "@timestamp": "2026-09-25T10:37:29+00:00",
  "agent": {
    "ephemeral_id": "ef48dd34-7392-4eea-a6c2-0db179650004",
    "id": "ef48dd34-7392-4eea-a6c2-0db179650004",
    "name": "elastic-agent-worker-04",
    "type": "filebeat",
    "version": "8.13.3"
  },
  "container": {
    "id": "a4c8e0200004",
    "name": "payments-app"
  },
  "data_stream": {
    "dataset": "falco.alerts",
    "namespace": "lab-k8s",
    "type": "logs"
  },
  "ecs": {
    "version": "8.17.0"
  },
  "elastic_agent": {
    "id": "ef48dd34-7392-4eea-a6c2-0db179650004",
    "snapshot": false,
    "version": "8.13.3"
  },
  "event": {
    "agent_id_status": "verified",
    "category": [
      "process"
    ],
    "dataset": "falco.alerts",
    "ingested": "2026-09-25T10:37:29+00:00",
    "kind": "alert",
    "original": "{\"hostname\":\"worker-04\",\"output\":\"2026-09-25T10:37:29.000000000+0000: Warning Sensitive file opened for reading by non-trusted program | file=/etc/shadow evt_type=openat user=root user_uid=0 user_loginuid=-1 process=python3 proc_exepath=/usr/bin/python3 parent=bash command=python3 /tmp/check_users.py terminal=34816 container_id=a4c8e0200004 container_name=payments-app\",\"output_fields\":{\"container.id\":\"a4c8e0200004\",\"container.name\":\"payments-app\",\"container.image.repository\":\"registry.example.test/payments/app:2.4.1\",\"evt.time.iso8601\":1790332649000000000,\"evt.type\":\"openat\",\"k8s.ns.name\":\"payments\",\"k8s.pod.name\":\"payments-app-7df86c5d4-04\",\"proc.cmdline\":\"python3 /tmp/check_users.py\",\"proc.exepath\":\"/usr/bin/python3\",\"proc.name\":\"python3\",\"proc.pname\":\"bash\",\"proc.tty\":34816,\"user.loginuid\":-1,\"user.name\":\"root\",\"user.uid\":0,\"fd.name\":\"/etc/shadow\"},\"priority\":\"Warning\",\"rule\":\"Read sensitive file untrusted\",\"source\":\"syscall\",\"tags\":[\"T1555\",\"container\",\"filesystem\",\"host\",\"maturity_stable\",\"mitre_credential_access\"],\"time\":\"2026-09-25T10:37:29.000000000Z\"}",
    "provider": "syscall",
    "severity": 47,
    "timezone": "+00:00",
    "type": [
      "access"
    ]
  },
  "falco": {
    "hostname": "worker-04",
    "output": "2026-09-25T10:37:29.000000000+0000: Warning Sensitive file opened for reading by non-trusted program | file=/etc/shadow evt_type=openat user=root user_uid=0 user_loginuid=-1 process=python3 proc_exepath=/usr/bin/python3 parent=bash command=python3 /tmp/check_users.py terminal=34816 container_id=a4c8e0200004 container_name=payments-app",
    "output_fields": {
      "container": {
        "id": "a4c8e0200004",
        "image": {
          "repository": "registry.example.test/payments/app:2.4.1"
        },
        "name": "payments-app"
      },
      "evt": {
        "time": {
          "iso8601": 1790332649000
        },
        "type": "openat"
      },
      "fd": {
        "name": "/etc/shadow"
      },
      "k8s": {
        "ns": {
          "name": "payments"
        },
        "pod": {
          "name": "payments-app-7df86c5d4-04"
        }
      },
      "proc": {
        "cmdline": "python3 /tmp/check_users.py",
        "exepath": "/usr/bin/python3",
        "name": "python3",
        "pname": "bash",
        "tty": 34816
      },
      "user": {
        "loginuid": -1,
        "name": "root",
        "uid": "0"
      }
    },
    "priority": "Warning",
    "rule": "Read sensitive file untrusted",
    "source": "syscall",
    "tags": [
      "T1555",
      "container",
      "filesystem",
      "host",
      "maturity_stable",
      "mitre_credential_access"
    ],
    "time": "2026-09-25T10:37:29.000000000Z"
  },
  "host": {
    "architecture": "x86_64",
    "containerized": true,
    "hostname": "worker-04",
    "id": "ef48dd34-7392-4eea-a6c2-0db179650004",
    "ip": [
      "10.20.0.14"
    ],
    "mac": [
      "02-42-ac-14-00-04"
    ],
    "name": "worker-04",
    "os": {
      "codename": "jammy",
      "family": "debian",
      "kernel": "5.15.0-91-generic",
      "name": "Ubuntu",
      "platform": "ubuntu",
      "type": "linux",
      "version": "22.04"
    }
  },
  "input": {
    "type": "log"
  },
  "log": {
    "file": {
      "path": "/var/log/falco/events.log"
    },
    "offset": 7118
  },
  "message": "Read sensitive file untrusted",
  "observer": {
    "hostname": "worker-04",
    "product": "falco",
    "type": "sensor",
    "vendor": "sysdig"
  },
  "process": {
    "command_line": "python3 /tmp/check_users.py",
    "executable": "/usr/bin/python3",
    "name": "python3",
    "parent": {
      "name": "bash"
    },
    "user": {
      "id": "0",
      "name": "root"
    }
  },
  "related": {
    "hosts": [
      "worker-04"
    ]
  },
  "rule": {
    "name": "Read sensitive file untrusted"
  },
  "tags": [
    "preserve_original_event",
    "preserve_falco_fields"
  ],
  "threat.technique.id": [
    "T1555"
  ]
}`,
    },
  ],
};
