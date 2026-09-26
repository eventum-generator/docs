/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFalco: GeneratorMeta = {
  slug: 'security-falco',
  displayName: 'Falco Runtime Alerts',
  category: 'security',
  description:
    'Selected Falco 0.45.0 and stable rules 5.2.0 alerts with configured extra fields. Recurring shell, sensitive-file read and Kubernetes API connection attempts share ordinary container activity.',
  format: ['JSON', 'ECS'],
  dataSource:
    'Falco 0.45.0 syscall JSON, stable rules 5.2.0, selected append_output',
  eventCount: 3,
  templateCount: 2,
  highlights: [
    'Three tagged syscall rules',
    'Fifty persistent container contexts',
    'Periodic causal process chains',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 12 hours an eligible container emits a fresh interactive bash, then a Python child reading/etc/shadow after 60 seconds and a curl child connecting to the Kubernetes API after another 60 seconds. Parent PID/start and tty join the 120-second trace; API success is not claimed.',
  generatorId: 'falco',
  eventTypes: [
    {
      id: 'Terminal shell in container',
      description: 'Interactive bash execve with container-entrypoint parent',
      frequency: 'Weight 6, also shell replacement',
      category: 'process',
    },
    {
      id: 'Read sensitive file untrusted',
      description: 'Successful Python read-mode openat of /etc/shadow',
      frequency: 'Weight 3',
      category: 'file',
    },
    {
      id: 'Contact K8S API Server From Container',
      description: 'Connect attempt to the DNS-identified API service',
      frequency: 'Weight 1; forced every sixth eligible visit',
      category: 'network',
    },
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Enable periodic complete episodes; false retains ordinary alerts',
    },
    {
      name: 'agent_version',
      defaultValue: '8.13.3',
      description: 'Synthetic Elastic Agent version',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.17.0',
      description: 'ECS version',
    },
    {
      name: 'data_stream_namespace',
      defaultValue: 'lab-k8s',
      description: 'Data-stream namespace',
    },
    {
      name: 'log_path',
      defaultValue: '/var/log/falco/events.log',
      description: 'Synthetic collector source-file path',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '12',
      description:
        'Finite interval in hours, minimum 1; smaller values clamp to 1',
    },
    {
      name: 'api_server_ip',
      defaultValue: '10.96.0.1',
      description:
        'IPv4 address of the selected API DNS service, used in both modes',
    },
  ],
  sampleOutputs: [
    {
      title: 'Actual final Falco alert',
      json: String.raw`{
  "@timestamp": "2026-09-01T09:02:00.573+00:00",
  "agent": {
    "ephemeral_id": "ef48dd34-7392-4eea-a6c2-0db179650001",
    "id": "ef48dd34-7392-4eea-a6c2-0db179650001",
    "name": "elastic-agent-worker-01",
    "type": "filebeat",
    "version": "8.13.3"
  },
  "container": {
    "id": "a4c8e0200001",
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
    "id": "ef48dd34-7392-4eea-a6c2-0db179650001",
    "snapshot": false,
    "version": "8.13.3"
  },
  "event": {
    "agent_id_status": "verified",
    "category": [
      "file"
    ],
    "dataset": "falco.alerts",
    "ingested": "2026-09-01T09:02:00.573+00:00",
    "kind": "alert",
    "original": "{\"hostname\":\"worker-01\",\"output\":\"2026-09-01T09:02:00.573000000+0000: Warning Sensitive file opened for reading by non-trusted program | file=/etc/shadow gparent=containerd-shim ggparent=containerd gggparent=systemd evt_type=openat user=root user_uid=0 user_loginuid=-1 process=python3 proc_exepath=/usr/bin/python3.10 parent=bash command=python3 /opt/maintenance/check_shadow.py terminal=34819 container_id=a4c8e0200001 container_name=payments-app\",\"output_fields\":{\"container.id\":\"a4c8e0200001\",\"container.image.repository\":\"registry.example.test/payments/app\",\"container.image.tag\":\"2.4.1\",\"container.name\":\"payments-app\",\"evt.category\":\"file\",\"evt.failed\":false,\"evt.is_open_read\":true,\"evt.rawres\":9,\"evt.time.iso8601\":1788253320573000000,\"evt.type\":\"openat\",\"fd.name\":\"/etc/shadow\",\"fd.num\":9,\"fd.type\":\"file\",\"fd.typechar\":\"f\",\"k8s.ns.name\":\"payments\",\"k8s.pod.name\":\"payments-app-7df86c5d4-01\",\"proc.aname[2]\":\"containerd-shim\",\"proc.aname[3]\":\"containerd\",\"proc.aname[4]\":\"systemd\",\"proc.cmdline\":\"python3 /opt/maintenance/check_shadow.py\",\"proc.exepath\":\"/usr/bin/python3.10\",\"proc.name\":\"python3\",\"proc.pid\":100480,\"proc.pid.ts\":1788253320553000000,\"proc.pname\":\"bash\",\"proc.ppid\":100479,\"proc.ppid.ts\":1788253260553000000,\"proc.tty\":34819,\"user.loginuid\":-1,\"user.name\":\"root\",\"user.uid\":0},\"priority\":\"Warning\",\"rule\":\"Read sensitive file untrusted\",\"source\":\"syscall\",\"tags\":[\"T1555\",\"container\",\"filesystem\",\"host\",\"maturity_stable\",\"mitre_credential_access\"],\"time\":\"2026-09-01T09:02:00.573000000Z\"}",
    "provider": "syscall",
    "severity": 47,
    "timezone": "+00:00",
    "type": [
      "access"
    ]
  },
  "falco": {
    "hostname": "worker-01",
    "output": "2026-09-01T09:02:00.573000000+0000: Warning Sensitive file opened for reading by non-trusted program | file=/etc/shadow gparent=containerd-shim ggparent=containerd gggparent=systemd evt_type=openat user=root user_uid=0 user_loginuid=-1 process=python3 proc_exepath=/usr/bin/python3.10 parent=bash command=python3 /opt/maintenance/check_shadow.py terminal=34819 container_id=a4c8e0200001 container_name=payments-app",
    "output_fields": {
      "container": {
        "id": "a4c8e0200001",
        "image": {
          "repository": "registry.example.test/payments/app",
          "tag": "2.4.1"
        },
        "name": "payments-app"
      },
      "evt": {
        "category": "file",
        "failed": false,
        "is_open_read": true,
        "rawres": 9,
        "time": {
          "iso8601": 1788253320573
        },
        "type": "openat"
      },
      "fd": {
        "name": "/etc/shadow",
        "num": 9,
        "type": "file",
        "typechar": "f"
      },
      "k8s": {
        "ns": {
          "name": "payments"
        },
        "pod": {
          "name": "payments-app-7df86c5d4-01"
        }
      },
      "proc": {
        "cmdline": "python3 /opt/maintenance/check_shadow.py",
        "exepath": "/usr/bin/python3.10",
        "name": "python3",
        "pid": {
          "ts": 1788253320553000000
        },
        "pname": "bash",
        "ppid": {
          "ts": 1788253260553000000
        },
        "tty": 34819
      },
      "process": {
        "parent": {
          "pid": 100479
        },
        "pid": 100480
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
    "time": "2026-09-01T09:02:00.573000000Z"
  },
  "falco.container.mounts": null,
  "file": {
    "path": "/etc/shadow",
    "type": "file"
  },
  "host": {
    "architecture": "x86_64",
    "containerized": true,
    "hostname": "worker-01",
    "id": "ef48dd34-7392-4eea-a6c2-0db179650001",
    "ip": [
      "10.20.0.11"
    ],
    "mac": [
      "02-42-ac-14-00-01"
    ],
    "name": "worker-01",
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
    "offset": 171724
  },
  "message": "Read sensitive file untrusted",
  "observer": {
    "hostname": "worker-01",
    "product": "falco",
    "type": "sensor",
    "vendor": "sysdig"
  },
  "orchestrator": {
    "namespace": "payments",
    "resource": {
      "name": "payments-app-7df86c5d4-01",
      "type": "pod"
    }
  },
  "process": {
    "command_line": "python3 /opt/maintenance/check_shadow.py",
    "executable": "/usr/bin/python3.10",
    "name": "python3",
    "parent": {
      "name": "bash",
      "pid": 100479,
      "start": "2026-09-01T09:01:00.553+00:00"
    },
    "pid": 100480,
    "start": "2026-09-01T09:02:00.553+00:00",
    "user": {
      "id": "0",
      "name": "root"
    }
  },
  "related": {
    "hosts": [
      "worker-01"
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
  realismFeatures: [
    'Five node sensors and 50 persistent application containers. One selected alert per minute with source jitter and ten-minute ordinary per-pod eligibility. Background is alerts, including maintenance triggering these rules.',
    'Native PID/parent-start nanoseconds and inherited tty correlate children with the observed shell. Process creation/exit and initial shell contexts outside selected alerts are stated assumptions.',
    'Every 12h an eligible target emits shell, Python sensitive read and curl API connect at 60-second spacing. New PIDs/ports and rotating targets use the same pools as ordinary alerts.',
    'Successful read mode has a valid FD. API connect does not establish HTTP success, token authorization or transferred data. ECS process-start nanoseconds are explicitly converted to ISO dates.',
    'Tagged rule/formatter contracts and older complete fixtures support the profile. Exact current-version configured raw capture and live parser parity remain unverified. Broader optional native fixture gaps remain explicit. The sample verified agent status is synthetic collector context, not live verification.',
  ],
};
