/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFalco: GeneratorMeta = {
  slug: 'security-falco',
  displayName: 'Falco Runtime Alerts',
  category: 'security',
  description:
    'Synthetic Falco 0.45.0 syscall alerts under stable rules 5.2.0, as JSON file output with explicitly configured extra fields, from 50 Kubernetes node sensors and 500 persistent application containers. Covers three standard rules, not Kubernetes audit-plugin events or Sysdig Secure incidents. Recurring episodes show an interactive shell whose children read /etc/shadow and query Kubernetes API discovery.',
  dataSource:
    'Falco 0.45.0 syscall JSON file output, stable rules 5.2.0, selected append_output',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 2,
  highlights: [
    'Complete native Falco JSON in event.original',
    'Exec sessions of 500 pods on a weekday and weekend hour curve',
    'Recurring shell, shadow read and API discovery lineage',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first start falls at a point of the first min(interval, 24 h) of the run drawn from the background hour-of-day and weekday curve; each next one is due one interval after the previous actual start, with no catch-up, and starts in a window of width min(interval / 4, 6 h) centred on that due time, weighted by the squared curve plus a 0.02 floor; while no pod qualifies early in a run, a start is postponed in 1-30 min steps), one container opens a new interactive bash shell, a Python child of it reads /etc/shadow, and a curl child of the same shell queries API discovery /api, the whole chain ending at most 280 s after the shell (measured 35-269 s). Parent PID, parent start and tty link the steps. The pod is drawn by session weight among the 109 busiest pods, never the previous one, and every pod and value of the chain also occurs in ordinary traffic; only the ordered shell, read, /api lineage within 300 s is episode-only.',
  generatorId: 'falco',
  eventTypes: [
    {
      id: 'Terminal shell in container',
      description:
        'Interactive bash execve with a terminal and containerd-shim parent',
      frequency: '14.4% measured share',
      category: 'process',
    },
    {
      id: 'Read sensitive file untrusted',
      description:
        'Python child of a session shell opens /etc/shadow for reading',
      frequency: '36.6% measured share',
      category: 'file',
    },
    {
      id: 'Contact K8S API Server From Container (session shell)',
      description:
        'curl child of a session shell connects to the API service (/version 26.8%, /api 3.1%)',
      frequency: '29.9% measured share',
      category: 'network',
    },
    {
      id: 'Contact K8S API Server From Container (entrypoint)',
      description:
        'Application entrypoint sh, tty 0, connects to the API service (/version 11.5%, /api 7.6%)',
      frequency: '19.1% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    '50 node sensors and 500 persistent application containers. Exec sessions hit a pod drawn by one fixed set of lognormal activity weights, so every run models the same busy and quiet pods; a session raises the shell alert, then its bash children raise shadow reads (55%) and API contacts (45%) at lognormal gaps until it ends (median 10 minutes, at most 4 hours and 12 children), and sessions of one pod may overlap, each on the lowest free pts of its pod. Entrypoint API contacts hit a uniformly drawn pod. Per pod this is about 3.6 sessions and 4.8 entrypoint contacts a weekday, half that on Saturday and Sunday.',
    'The input sets the rate and every timestamp becomes exactly one alert; none is dropped. Stacked UTC bands give 120 alerts/h at night and 950/h in 08-18 on weekdays (about 12,600 a day); on Saturday and Sunday the daytime bands drop to 35% (peak 410/h, about 6,300 a day, measured 0.47-0.52 of a weekday). Every weekday follows the same curve and holidays are not modeled. Session children and episode steps take the first timestamp at or after their due time, so their gaps are rounded up (on average 3.9 s in weekday office hours, 30 s at night).',
    'Ordinary traffic contains repeated alerts of one pod within minutes, shell-to-read and shell-to-API lineage pairs and pod-level shell, read, API triples, including permitted maintenance that triggers the selected rules. A session child that queries the API after a shadow read of the same shell queries /version while that shell is at most 300 s old, keeping times, pod and lineage; measured /api share by shell age was 0.000 up to 300 s, then 0.113-0.130.',
    'event.original is a complete native JSON object with UTC nanosecond time, the exact tagged rule output plus the configured suffix, sorted tags and keys and unchanged native types. The outer event follows the relevant pinned Elastic Falco integration ECS mappings; ECS process start dates are converted from native nanoseconds to UTC ISO dates as a documented correction, not exact pipeline-output parity. Coverage: 78/78 paths of the maintained ECS sample and 20/20 of its native record.',
    'PIDs are host PIDs, not Kubernetes user identities. Read alerts are successful read-mode opens of /etc/shadow with a valid FD; API alerts are connect attempts and do not establish HTTP success, token authorization, transferred data or compromise, and the chain does not identify the Kubernetes user who invoked exec. event.agent_id_status: verified is synthetic collector context.',
    'Episode hours follow the squared curve, which favors office hours more than background does: in a 14-day default run from a Thursday all 14 starts fell into 12-18 UTC against 44% of background shells, and 29% on Saturday or Sunday against 17%, because a 24 h interval cannot skip weekend days. Each run tends to stay near the hour of its first episode, and a start drawn into the night can stay near night hours for several days. Episode pods are limited to the 109 busiest pods so every chain value recurs in their ordinary traffic; the first episode waits for that history (6-8 h after a start at 00:00 UTC).',
    'Exact Falco 0.45.0/rules 5.2.0 native records with this append_output, a coherent full process trace and a live parser run were not obtained; older Elastic 2024 fixtures and the official 2021 API example are format evidence only. Only three rules are modeled, with no process exits or container lifecycle, and rates, the hour curve, session shapes and the /version and /api mix are modeling assumptions.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Enable recurring complete episodes; false keeps background alerts only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the actual start of one episode to the due time of the next, 1 to 8760; other values fail validation',
    },
    {
      name: 'api_server_ip',
      defaultValue: '10.96.0.1',
      description:
        'IPv4 address of the selected API DNS service, used in both modes',
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
  ],
  sampleOutputs: [
    {
      title: 'API discovery step ending the first episode',
      json: String.raw`{"@timestamp": "2026-09-17T12:18:48.186+00:00", "agent": {"ephemeral_id": "ef48dd34-7392-4eea-a6c2-0db17965000d", "id": "ef48dd34-7392-4eea-a6c2-0db17965000d", "name": "elastic-agent-worker-13", "type": "filebeat", "version": "8.13.3"}, "container": {"id": "a4c8e020018a", "name": "webhooks-app"}, "data_stream": {"dataset": "falco.alerts", "namespace": "lab-k8s", "type": "logs"}, "destination": {"address": "10.96.0.1", "ip": "10.96.0.1", "port": 443}, "ecs": {"version": "8.17.0"}, "elastic_agent": {"id": "ef48dd34-7392-4eea-a6c2-0db17965000d", "snapshot": false, "version": "8.13.3"}, "event": {"agent_id_status": "verified", "category": ["network"], "dataset": "falco.alerts", "ingested": "2026-09-17T12:18:49.457+00:00", "kind": "alert", "original": "{\"hostname\":\"worker-13\",\"output\":\"2026-09-17T12:18:48.186051241+0000: Notice Unexpected connection to K8s API Server from container | connection=10.244.13.18:51597-\u003e10.96.0.1:443 lport=51597 rport=443 fd_type=ipv4 fd_proto=tcp evt_type=connect user=root user_uid=0 user_loginuid=-1 process=curl proc_exepath=/usr/bin/curl parent=bash command=curl -ks https://kubernetes.default.svc.cluster.local/api terminal=34816 container_id=a4c8e020018a container_name=webhooks-app\",\"output_fields\":{\"container.id\":\"a4c8e020018a\",\"container.image.repository\":\"registry.example.test/webhooks/app\",\"container.image.tag\":\"1.14.7\",\"container.name\":\"webhooks-app\",\"evt.category\":\"net\",\"evt.time.iso8601\":1789647528186051241,\"evt.type\":\"connect\",\"fd.l4proto\":\"tcp\",\"fd.lip\":\"10.244.13.18\",\"fd.lport\":51597,\"fd.name\":\"10.244.13.18:51597-\u003e10.96.0.1:443\",\"fd.rip\":\"10.96.0.1\",\"fd.rport\":443,\"fd.sip\":\"10.96.0.1\",\"fd.sip.name\":\"kubernetes.default.svc.cluster.local\",\"fd.type\":\"ipv4\",\"fd.typechar\":\"4\",\"k8s.ns.name\":\"webhooks\",\"k8s.pod.name\":\"webhooks-app-hpgsmv9l24-04\",\"proc.cmdline\":\"curl -ks https://kubernetes.default.svc.cluster.local/api\",\"proc.exepath\":\"/usr/bin/curl\",\"proc.name\":\"curl\",\"proc.pid\":220332,\"proc.pid.ts\":1789647528149592099,\"proc.pname\":\"bash\",\"proc.ppid\":220307,\"proc.ppid.ts\":1789647480110727812,\"proc.tty\":34816,\"user.loginuid\":-1,\"user.name\":\"root\",\"user.uid\":0},\"priority\":\"Notice\",\"rule\":\"Contact K8S API Server From Container\",\"source\":\"syscall\",\"tags\":[\"T1565\",\"container\",\"k8s\",\"maturity_stable\",\"mitre_discovery\",\"network\"],\"time\":\"2026-09-17T12:18:48.186051241Z\"}", "provider": "syscall", "severity": 47, "timezone": "+00:00", "type": ["connection"]}, "falco": {"hostname": "worker-13", "output": "2026-09-17T12:18:48.186051241+0000: Notice Unexpected connection to K8s API Server from container | connection=10.244.13.18:51597-\u003e10.96.0.1:443 lport=51597 rport=443 fd_type=ipv4 fd_proto=tcp evt_type=connect user=root user_uid=0 user_loginuid=-1 process=curl proc_exepath=/usr/bin/curl parent=bash command=curl -ks https://kubernetes.default.svc.cluster.local/api terminal=34816 container_id=a4c8e020018a container_name=webhooks-app", "output_fields": {"container": {"id": "a4c8e020018a", "image": {"repository": "registry.example.test/webhooks/app", "tag": "1.14.7"}, "name": "webhooks-app"}, "destination": {"ip": "10.96.0.1"}, "evt": {"category": "net", "time": {"iso8601": 1789647528186}, "type": "connect"}, "fd": {"l4proto": "tcp", "lport": 51597, "name": "10.244.13.18:51597-\u003e10.96.0.1:443", "rport": 443, "sip": {"name": "kubernetes.default.svc.cluster.local"}, "type": "ipv4", "typechar": "4"}, "k8s": {"ns": {"name": "webhooks"}, "pod": {"name": "webhooks-app-hpgsmv9l24-04"}}, "proc": {"cmdline": "curl -ks https://kubernetes.default.svc.cluster.local/api", "exepath": "/usr/bin/curl", "name": "curl", "pid": {"ts": 1789647528149592099}, "pname": "bash", "ppid": {"ts": 1789647480110727812}, "tty": 34816}, "process": {"parent": {"pid": 220307}, "pid": 220332}, "server": {"ip": "10.96.0.1"}, "source": {"ip": "10.244.13.18"}, "user": {"loginuid": -1, "name": "root", "uid": "0"}}, "priority": "Notice", "rule": "Contact K8S API Server From Container", "source": "syscall", "tags": ["T1565", "container", "k8s", "maturity_stable", "mitre_discovery", "network"], "time": "2026-09-17T12:18:48.186051241Z"}, "falco.container.mounts": null, "host": {"architecture": "x86_64", "containerized": true, "hostname": "worker-13", "id": "ef48dd34-7392-4eea-a6c2-0db17965000d", "ip": ["10.20.0.23"], "mac": ["02-42-ac-14-00-0d"], "name": "worker-13", "os": {"codename": "jammy", "family": "debian", "kernel": "5.15.0-91-generic", "name": "Ubuntu", "platform": "ubuntu", "type": "linux", "version": "22.04"}}, "input": {"type": "log"}, "log": {"file": {"path": "/var/log/falco/events.log"}, "offset": 271353}, "message": "Contact K8S API Server From Container", "observer": {"hostname": "worker-13", "product": "falco", "type": "sensor", "vendor": "sysdig"}, "orchestrator": {"namespace": "webhooks", "resource": {"name": "webhooks-app-hpgsmv9l24-04", "type": "pod"}}, "process": {"command_line": "curl -ks https://kubernetes.default.svc.cluster.local/api", "executable": "/usr/bin/curl", "name": "curl", "parent": {"name": "bash", "pid": 220307, "start": "2026-09-17T12:18:00.110+00:00"}, "pid": 220332, "start": "2026-09-17T12:18:48.149+00:00", "user": {"id": "0", "name": "root"}}, "related": {"hosts": ["worker-13"]}, "rule": {"name": "Contact K8S API Server From Container"}, "server": {"address": "10.96.0.1", "domain": "kubernetes.default.svc.cluster.local", "ip": "10.96.0.1"}, "source": {"address": "10.244.13.18", "ip": "10.244.13.18", "port": 51597}, "tags": ["preserve_original_event", "preserve_falco_fields"], "threat.technique.id": ["T1565"]}`,
    },
  ],
};
