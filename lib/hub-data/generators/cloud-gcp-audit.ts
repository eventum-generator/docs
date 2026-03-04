import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudGcpAudit: GeneratorMeta = {
    slug: 'cloud-gcp-audit',
    displayName: 'GCP Cloud Audit Logs',
    category: 'cloud',
    description:
      'GCP Cloud Audit Logs — API calls across Compute Engine, IAM, Cloud Storage, GKE, BigQuery, and VPC networking from a multi-project organization. Includes console logins, service account operations, error injection, and 3 caller identity types.',
    format: ['JSON', 'ECS'],
    dataSource: 'GCP Cloud Audit Logs',
    eventCount: 22,
    templateCount: 22,
    highlights: [
      '3 caller identity types',
      'Multi-project environment',
      'Error injection (~4%)',
      '6 GCP services covered',
    ],
    generatorId: 'gcp-audit',
    eventTypes: [
      {
        id: 'v1.compute.instances.list',
        description: 'List Compute Engine instances',
        frequency: '~12%',
        category: 'host',
      },
      {
        id: 'GetIamPolicy',
        description: 'Get project IAM policy',
        frequency: '~10%',
        category: 'iam',
      },
      {
        id: 'storage.objects.get',
        description: 'Get a Cloud Storage object',
        frequency: '~9%',
        category: 'file',
      },
      {
        id: 'v1.compute.instances.get',
        description: 'Get instance details',
        frequency: '~8%',
        category: 'host',
      },
      {
        id: 'google.login.LoginService.loginSuccess',
        description: 'Console login',
        frequency: '~8%',
        category: 'authentication',
      },
      {
        id: 'google.container.v1.ClusterManager.GetCluster',
        description: 'Get GKE cluster details',
        frequency: '~8%',
        category: 'configuration',
      },
      {
        id: 'v1.compute.instances.insert',
        description: 'Create a new VM instance',
        frequency: '~5%',
        category: 'host',
      },
      {
        id: 'google.cloud.bigquery.v2.JobService.InsertJob',
        description: 'Run BigQuery query/load job',
        frequency: '~6%',
        category: 'database',
      },
    ],
    realismFeatures: [
      'Jinja2 macros eliminate boilerplate across 22 templates',
      '3 caller identity types — Service Account (55%), User (40%), GCP Service (5%)',
      'Error injection (~4%) — 20 realistic error scenarios mapped to specific API methods',
      'Console login flow with ~5% failure rate',
      'Multi-project environment — 3 GCP projects (production, staging, development)',
      '10 IAM users across 7 departments, 10 service accounts',
      '6 GCP services — Compute, IAM, Storage, GKE, BigQuery, Networking',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'b2c3d4e5-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
      {
        name: 'error_rate',
        defaultValue: '4',
        description: 'Error injection rate (percentage, 0-100)',
      },
    ],
    sampleOutputs: [
      {
        title: 'Compute instances.insert',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "cloud": {
        "availability_zone": "us-central1-a",
        "project": { "id": "acme-prod-001", "name": "Acme Production" },
        "provider": "gcp",
        "region": "us-central1"
    },
    "event": {
        "action": "v1.compute.instances.insert",
        "category": ["host", "configuration"],
        "dataset": "gcp.audit",
        "kind": "event",
        "module": "gcp",
        "outcome": "success",
        "provider": "activity",
        "type": ["creation", "allowed"]
    },
    "gcp": {
        "audit": {
            "authentication_info": {
                "principal_email": "michael.chen@acme.io"
            },
            "authorization_info": [{
                "granted": true,
                "permission": "compute.instances.create",
                "resource_attributes": {
                    "name": "projects/acme-prod-001/zones/us-central1-a/instances/web-server-a1b2",
                    "service": "compute",
                    "type": "compute.instances"
                }
            }],
            "method_name": "v1.compute.instances.insert",
            "request_metadata": {
                "caller_ip": "198.51.100.25",
                "caller_supplied_user_agent": "google-cloud-sdk gcloud/462.0.1"
            },
            "resource": {
                "labels": {
                    "instance_id": "1234567890123456789",
                    "project_id": "acme-prod-001",
                    "zone": "us-central1-a"
                },
                "type": "gce_instance"
            },
            "resource_name": "projects/acme-prod-001/zones/us-central1-a/instances/web-server-a1b2",
            "service_name": "compute.googleapis.com",
            "type": "type.googleapis.com/google.cloud.audit.AuditLog"
        }
    },
    "service": { "name": "compute.googleapis.com" },
    "source": { "ip": "198.51.100.25" }
}`,
      },
    ],
  };
