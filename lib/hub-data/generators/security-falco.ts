/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFalco: GeneratorMeta = {
  slug: 'security-falco',
  displayName: 'Falco Runtime Alerts',
  category: 'security',
  description:
    'Synthetic Falco 0.45.0 syscall alerts under stable rules 5.2.0, as JSON file output with explicitly configured extra fields, from five Kubernetes node sensors and 50 persistent application containers. Covers three standard rules, not Kubernetes audit-plugin events or Sysdig Secure incidents. Recurring episodes show an interactive shell whose children read /etc/shadow and query Kubernetes API discovery.',
  dataSource:
    'Falco 0.45.0 syscall JSON file output, stable rules 5.2.0, selected append_output',
  format: ['JSON', 'ECS'],
  eventCount: 4,
  templateCount: 2,
  highlights: [
    'Complete native Falco JSON in event.original',
    'Independent exec sessions and entrypoint API contacts of 50 pods',
    'Recurring shell, shadow read and API discovery lineage',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours by default (the first start falls in the first min(interval, 24 h) of the run; each next one is due one interval after the previous actual start, with no catch-up, and starts in a window of width min(interval / 4, 6 h) centred on that due time, weighted toward busy session hours; while no pod qualifies early in a run, a start is postponed in 1-30 min steps), one container opens a new interactive bash shell, a Python child of it reads /etc/shadow, and a curl child of the same shell queries API discovery /api, all within 280 s. Parent PID, parent start and tty link the steps. Every pod and value of the chain also occurs in ordinary traffic; only the ordered shell, read, /api lineage within 300 s is episode-only.',
  generatorId: 'falco',
  eventTypes: [
    {
      id: 'Terminal shell in container',
      description:
        'Interactive bash execve with a terminal and containerd-shim parent',
      frequency: '14.7% measured share',
      category: 'process',
    },
    {
      id: 'Read sensitive file untrusted',
      description:
        'Python child of a session shell opens /etc/shadow for reading',
      frequency: '35.3% measured share',
      category: 'file',
    },
    {
      id: 'Contact K8S API Server From Container (session shell)',
      description:
        'curl child of a session shell connects to the API service (/version 27.2%, /api 2.8%)',
      frequency: '30.0% measured share',
      category: 'network',
    },
    {
      id: 'Contact K8S API Server From Container (entrypoint)',
      description:
        'Application entrypoint sh, tty 0, connects to the API service (/version 12.5%, /api 7.5%)',
      frequency: '20.0% measured share',
      category: 'network',
    },
  ],
  realismFeatures: [
    'Five node sensors and 50 persistent application containers. Each pod has its own activity weight and its own interactive exec-session process with lognormal gaps (about 180 sessions per day in total); a session raises the shell alert, then its bash children raise shadow reads (55%) and API contacts (45%) until it ends (median 10 minutes), and sessions of one pod may overlap. Independently, every entrypoint contacts the API server, about 240 times per day in total. Both follow one UTC hour-of-day profile with nights at 10-22% and weekends at 35%; the final 4-day default run produced 5,866 alerts.',
    'Ordinary traffic contains repeated alerts of one pod within minutes, shell-to-read and shell-to-API lineage pairs and pod-level shell, read, API triples, including permitted maintenance that triggers the selected rules. A session child that queries the API after a shadow read of the same shell queries /version while that shell is at most 300 s old; measured /api share was 0.000 up to 300 s, then 0.115-0.132.',
    'event.original is a complete native JSON object with UTC nanosecond time, the exact tagged rule output plus the configured suffix, sorted tags and keys and unchanged native types. The outer event follows the relevant pinned Elastic Falco integration ECS mappings; ECS process start dates are converted from native nanoseconds to UTC ISO dates as a documented correction, not exact pipeline-output parity. Coverage: 78/78 paths of the maintained ECS sample and 20/20 of its native record.',
    'PIDs are host PIDs, not Kubernetes user identities. Read alerts are successful read-mode opens of /etc/shadow with a valid FD; API alerts are connect attempts and do not establish HTTP success, token authorization, transferred data or compromise, and the chain does not identify the Kubernetes user who invoked exec. event.agent_id_status: verified is synthetic collector context.',
    'Episode hours follow the squared session profile, which favors peak hours: in a 36-day default run, 0/22/69/8% of starts fell into 00-06/06-12/12-18/18-24 UTC against 5.5/35/46/14% of background shells, and 31% fell on weekends against 13%, because a daily interval cannot skip a weekend day. A start drawn into the night can stay near night hours for several days; the episode pod is restricted to pods with the needed background history, which slightly favors active pods.',
    'Exact Falco 0.45.0/rules 5.2.0 native records with this append_output, a coherent full process trace and a live parser run were not obtained; older Elastic 2024 fixtures and the official 2021 API example are format evidence only. Only three rules are modeled, with no process exits or container lifecycle, and rates, profile, session shapes and the /version and /api mix are modeling assumptions.',
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
        'Hours from the actual start of one episode to the next due time, 1 to 8,760; other values fail validation',
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
      json: String.raw`{"@timestamp": "2026-09-14T01:53:03.793+00:00", "agent": {"ephemeral_id": "ef48dd34-7392-4eea-a6c2-0db179650002", "id": "ef48dd34-7392-4eea-a6c2-0db179650002", "name": "elastic-agent-worker-02", "type": "filebeat", "version": "8.13.3"}, "container": {"id": "a4c8e0200020", "name": "inventory-app"}, "data_stream": {"dataset": "falco.alerts", "namespace": "lab-k8s", "type": "logs"}, "destination": {"address": "10.96.0.1", "ip": "10.96.0.1", "port": 443}, "ecs": {"version": "8.17.0"}, "elastic_agent": {"id": "ef48dd34-7392-4eea-a6c2-0db179650002", "snapshot": false, "version": "8.13.3"}, "event": {"agent_id_status": "verified", "category": ["network"], "dataset": "falco.alerts", "ingested": "2026-09-14T01:53:05.218+00:00", "kind": "alert", "original": "{\"hostname\":\"worker-02\",\"output\":\"2026-09-14T01:53:03.793525823+0000: Notice Unexpected connection to K8s API Server from container | connection=10.244.2.42:53399-\u003e10.96.0.1:443 lport=53399 rport=443 fd_type=ipv4 fd_proto=tcp evt_type=connect user=root user_uid=0 user_loginuid=-1 process=curl proc_exepath=/usr/bin/curl parent=bash command=curl -ks https://kubernetes.default.svc.cluster.local/api terminal=34816 container_id=a4c8e0200020 container_name=inventory-app\",\"output_fields\":{\"container.id\":\"a4c8e0200020\",\"container.image.repository\":\"registry.example.test/inventory/app\",\"container.image.tag\":\"2.4.1\",\"container.name\":\"inventory-app\",\"evt.category\":\"net\",\"evt.time.iso8601\":1789350783793525823,\"evt.type\":\"connect\",\"fd.l4proto\":\"tcp\",\"fd.lip\":\"10.244.2.42\",\"fd.lport\":53399,\"fd.name\":\"10.244.2.42:53399-\u003e10.96.0.1:443\",\"fd.rip\":\"10.96.0.1\",\"fd.rport\":443,\"fd.sip\":\"10.96.0.1\",\"fd.sip.name\":\"kubernetes.default.svc.cluster.local\",\"fd.type\":\"ipv4\",\"fd.typechar\":\"4\",\"k8s.ns.name\":\"inventory\",\"k8s.pod.name\":\"inventory-app-7df86c5d4-02\",\"proc.cmdline\":\"curl -ks https://kubernetes.default.svc.cluster.local/api\",\"proc.exepath\":\"/usr/bin/curl\",\"proc.name\":\"curl\",\"proc.pid\":132326,\"proc.pid.ts\":1789350783688301937,\"proc.pname\":\"bash\",\"proc.ppid\":132293,\"proc.ppid.ts\":1789350682519064431,\"proc.tty\":34816,\"user.loginuid\":-1,\"user.name\":\"root\",\"user.uid\":0},\"priority\":\"Notice\",\"rule\":\"Contact K8S API Server From Container\",\"source\":\"syscall\",\"tags\":[\"T1565\",\"container\",\"k8s\",\"maturity_stable\",\"mitre_discovery\",\"network\"],\"time\":\"2026-09-14T01:53:03.793525823Z\"}", "provider": "syscall", "severity": 47, "timezone": "+00:00", "type": ["connection"]}, "falco": {"hostname": "worker-02", "output": "2026-09-14T01:53:03.793525823+0000: Notice Unexpected connection to K8s API Server from container | connection=10.244.2.42:53399-\u003e10.96.0.1:443 lport=53399 rport=443 fd_type=ipv4 fd_proto=tcp evt_type=connect user=root user_uid=0 user_loginuid=-1 process=curl proc_exepath=/usr/bin/curl parent=bash command=curl -ks https://kubernetes.default.svc.cluster.local/api terminal=34816 container_id=a4c8e0200020 container_name=inventory-app", "output_fields": {"container": {"id": "a4c8e0200020", "image": {"repository": "registry.example.test/inventory/app", "tag": "2.4.1"}, "name": "inventory-app"}, "destination": {"ip": "10.96.0.1"}, "evt": {"category": "net", "time": {"iso8601": 1789350783793}, "type": "connect"}, "fd": {"l4proto": "tcp", "lport": 53399, "name": "10.244.2.42:53399-\u003e10.96.0.1:443", "rport": 443, "sip": {"name": "kubernetes.default.svc.cluster.local"}, "type": "ipv4", "typechar": "4"}, "k8s": {"ns": {"name": "inventory"}, "pod": {"name": "inventory-app-7df86c5d4-02"}}, "proc": {"cmdline": "curl -ks https://kubernetes.default.svc.cluster.local/api", "exepath": "/usr/bin/curl", "name": "curl", "pid": {"ts": 1789350783688301937}, "pname": "bash", "ppid": {"ts": 1789350682519064431}, "tty": 34816}, "process": {"parent": {"pid": 132293}, "pid": 132326}, "server": {"ip": "10.96.0.1"}, "source": {"ip": "10.244.2.42"}, "user": {"loginuid": -1, "name": "root", "uid": "0"}}, "priority": "Notice", "rule": "Contact K8S API Server From Container", "source": "syscall", "tags": ["T1565", "container", "k8s", "maturity_stable", "mitre_discovery", "network"], "time": "2026-09-14T01:53:03.793525823Z"}, "falco.container.mounts": null, "host": {"architecture": "x86_64", "containerized": true, "hostname": "worker-02", "id": "ef48dd34-7392-4eea-a6c2-0db179650002", "ip": ["10.20.0.12"], "mac": ["02-42-ac-14-00-02"], "name": "worker-02", "os": {"codename": "jammy", "family": "debian", "kernel": "5.15.0-91-generic", "name": "Ubuntu", "platform": "ubuntu", "type": "linux", "version": "22.04"}}, "input": {"type": "log"}, "log": {"file": {"path": "/var/log/falco/events.log"}, "offset": 24188}, "message": "Contact K8S API Server From Container", "observer": {"hostname": "worker-02", "product": "falco", "type": "sensor", "vendor": "sysdig"}, "orchestrator": {"namespace": "inventory", "resource": {"name": "inventory-app-7df86c5d4-02", "type": "pod"}}, "process": {"command_line": "curl -ks https://kubernetes.default.svc.cluster.local/api", "executable": "/usr/bin/curl", "name": "curl", "parent": {"name": "bash", "pid": 132293, "start": "2026-09-14T01:51:22.519+00:00"}, "pid": 132326, "start": "2026-09-14T01:53:03.688+00:00", "user": {"id": "0", "name": "root"}}, "related": {"hosts": ["worker-02"]}, "rule": {"name": "Contact K8S API Server From Container"}, "server": {"address": "10.96.0.1", "domain": "kubernetes.default.svc.cluster.local", "ip": "10.96.0.1"}, "source": {"address": "10.244.2.42", "ip": "10.244.2.42", "port": 53399}, "tags": ["preserve_original_event", "preserve_falco_fields"], "threat.technique.id": ["T1565"]}`,
    },
  ],
};
