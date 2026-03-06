import type { GeneratorMeta } from '@/lib/hub-types';

export const kubernetesAudit: GeneratorMeta = {
  slug: 'kubernetes-audit',
  displayName: 'Kubernetes Audit Logs',
  category: 'cloud',
  description:
    'Kubernetes API server audit log events — CRUD operations on cluster resources, health probes, RBAC access checks, watch streams, pod exec/attach, and API discovery across a multi-namespace production cluster.',
  format: ['JSON', 'ECS'],
  dataSource: 'Kubernetes Audit Logs',
  eventCount: 10,
  templateCount: 10,
  highlights: [
    'Full CRUD lifecycle coverage',
    'Multi-namespace cluster topology',
    'Error injection (~3%)',
    '5 sample datasets (users, namespaces, IPs, resources, user agents)',
  ],
  generatorId: 'kubernetes-audit',
  eventTypes: [
    {
      id: 'health-probe',
      description: 'Health/readiness/liveness probe checks',
      frequency: '~25%',
      category: 'web',
    },
    {
      id: 'get-resource',
      description: 'GET single resource (pods, services, configmaps, secrets)',
      frequency: '~17%',
      category: 'web',
    },
    {
      id: 'list-resource',
      description: 'LIST resources across namespaces',
      frequency: '~13%',
      category: 'web',
    },
    {
      id: 'watch-resource',
      description: 'Long-running WATCH streams from controllers/operators',
      frequency: '~15%',
      category: 'web',
    },
    {
      id: 'api-discovery',
      description: 'API discovery endpoints (/api, /apis, /openapi)',
      frequency: '~10%',
      category: 'web',
    },
    {
      id: 'create-resource',
      description: 'CREATE new resources (pods, deployments, services)',
      frequency: '~5%',
      category: 'web',
    },
    {
      id: 'update-resource',
      description: 'UPDATE/PATCH existing resources and status subresources',
      frequency: '~5%',
      category: 'web',
    },
    {
      id: 'delete-resource',
      description: 'DELETE resources',
      frequency: '~2%',
      category: 'web',
    },
    {
      id: 'rbac-access',
      description: 'RBAC operations (clusterroles, roles, bindings)',
      frequency: '~5%',
      category: 'iam',
    },
    {
      id: 'exec-attach',
      description: 'Pod exec, attach, port-forward, and log access',
      frequency: '~3%',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Jinja2 base template macro eliminates boilerplate across 10 templates',
    'Multi-namespace cluster — 8 namespaces with weighted selection',
    'Error injection (~3%) — 403, 404, 409, 422 status codes',
    'Realistic user agents — kubectl, kube-probe, controller-manager, operator SDKs',
    '5 identity types — human users, service accounts, system components',
    'Full audit metadata — auditID, request/stage timestamps, annotations',
  ],
  parameters: [
    {
      name: 'agent_id',
      defaultValue: '6e730a0c-...',
      description: 'Filebeat agent UUID',
    },
    {
      name: 'agent_version',
      defaultValue: '8.17.0',
      description: 'Elastic Agent version',
    },
    {
      name: 'agent_name',
      defaultValue: 'kind-control-plane',
      description: 'Agent hostname',
    },
    {
      name: 'cluster_name',
      defaultValue: 'production-cluster',
      description: 'Kubernetes cluster name',
    },
    {
      name: 'error_rate',
      defaultValue: '3',
      description: 'Error injection rate (percentage, 0-100)',
    },
  ],
  sampleOutputs: [
    {
      title: 'GET resource (pod)',
      json: `{
    "@timestamp": "2026-03-06T14:30:45.123456+00:00",
    "agent": {
        "ephemeral_id": "d27511c8-9cd1-402c-8b1b-234abbd9dcae",
        "id": "6e730a0c-7da5-48ff-b4c9-f6c63844975d",
        "name": "kind-control-plane",
        "type": "filebeat",
        "version": "8.17.0"
    },
    "ecs": {"version": "8.17.0"},
    "data_stream": {
        "dataset": "kubernetes.audit_logs",
        "namespace": "default",
        "type": "logs"
    },
    "event": {
        "action": "get",
        "category": ["web"],
        "dataset": "kubernetes.audit_logs",
        "kind": "event",
        "module": "kubernetes",
        "outcome": "success",
        "type": ["access"]
    },
    "kubernetes": {
        "audit": {
            "auditID": "bcacfeaa-5ab5-48de-8bac-3a87d1474b6a",
            "apiVersion": "audit.k8s.io/v1",
            "kind": "Event",
            "level": "RequestResponse",
            "stage": "ResponseComplete",
            "verb": "get",
            "requestURI": "/api/v1/namespaces/production/pods/api-server-7b8c9d-x4k2m",
            "user": {
                "username": "alice.chen@acme.io",
                "groups": ["system:authenticated", "developers"]
            },
            "sourceIPs": ["10.0.15.42"],
            "userAgent": "kubectl/v1.29.2 (linux/amd64)",
            "responseStatus": {"metadata": {}, "code": 200},
            "requestReceivedTimestamp": "2026-03-06T14:30:45.123456Z",
            "stageTimestamp": "2026-03-06T14:30:45.124567Z"
        }
    },
    "orchestrator": {
        "cluster": {"name": "production-cluster"},
        "type": "kubernetes"
    },
    "related": {"ip": ["10.0.15.42"], "user": ["alice.chen@acme.io"]},
    "source": {"ip": "10.0.15.42"},
    "tags": ["forwarded", "kubernetes-audit"],
    "user": {"name": "alice.chen@acme.io"},
    "user_agent": {"original": "kubectl/v1.29.2 (linux/amd64)"}
}`,
    },
  ],
};
