import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudAzureActivity: GeneratorMeta = {
    slug: 'cloud-azure-activity',
    displayName: 'Azure Activity Log',
    category: 'cloud',
    description:
      'Azure Monitor Activity Log — control plane operations across VMs, storage, networking, and RBAC. Covers all 7 log categories: Administrative, Security, Service Health, Alert, Autoscale, Policy, and Recommendation.',
    format: ['JSON', 'ECS'],
    dataSource: 'Azure Monitor Activity Log',
    eventCount: 9,
    templateCount: 9,
    highlights: [
      'All 7 log categories',
      'Multi-subscription',
      '12 Azure AD users',
      'Error injection',
    ],
    generatorId: 'azure-activity',
    eventTypes: [
      {
        id: 'admin-write',
        description: 'Create/update resources (VM, Storage, NSG)',
        frequency: '~40%',
        category: 'configuration',
      },
      {
        id: 'admin-action',
        description: 'Actions (start/stop/restart VM, regen keys)',
        frequency: '~25%',
        category: 'configuration',
      },
      {
        id: 'policy-compliance',
        description: 'Azure Policy evaluation results',
        frequency: '~12%',
        category: 'configuration',
      },
      {
        id: 'admin-delete',
        description: 'Delete resources',
        frequency: '~5%',
        category: 'configuration',
      },
      {
        id: 'security-alert',
        description: 'Microsoft Defender for Cloud alerts',
        frequency: '~5%',
        category: 'threat',
      },
      {
        id: 'service-health',
        description: 'Service incidents, maintenance, advisories',
        frequency: '~5%',
        category: 'configuration',
      },
      {
        id: 'autoscale',
        description: 'Autoscale scale-up/scale-down actions',
        frequency: '~3%',
        category: 'configuration',
      },
      {
        id: 'resource-health',
        description: 'Resource availability status changes',
        frequency: '~3%',
        category: 'host',
      },
      {
        id: 'alert',
        description: 'Azure Monitor metric/log alert activations',
        frequency: '~2%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      'All 7 activity log categories with production-accurate distribution weights',
      'Error injection (~5%) — Administrative operations produce failures (403, 409, 400, 404)',
      'Azure resource ID format — proper /subscriptions/{sub}/resourceGroups/{rg}/providers structure',
      'Identity with claims — Azure AD identity block with JWT claims, UPN, object ID, tenant ID',
      'Multi-subscription environment — 3 Azure subscriptions (production, staging, development)',
      '12 Azure AD users across 8 departments including service accounts',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'f1a2b3c4-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
      {
        name: 'tenant_id',
        defaultValue: 'aaaabbbb-0000-cccc-...',
        description: 'Azure AD tenant ID',
      },
      {
        name: 'error_rate',
        defaultValue: '5',
        description: 'Error injection rate (percentage, 0-100)',
      },
    ],
    sampleOutputs: [
      {
        title: 'Administrative Write — VM Created',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "cloud": {
        "account": { "id": "a1b2c3d4-...", "name": "contoso-production" },
        "provider": "azure",
        "region": "eastus"
    },
    "event": {
        "action": "Microsoft.Compute/virtualMachines/write",
        "category": ["configuration"],
        "dataset": "azure.activitylogs",
        "outcome": "success",
        "type": ["creation", "change"]
    },
    "user": {
        "name": "john.smith@contoso.com",
        "email": "john.smith@contoso.com"
    },
    "azure": {
        "activitylogs": {
            "category": "Administrative",
            "operation_name": "Microsoft.Compute/virtualMachines/write",
            "result_type": "Success"
        }
    }
}`,
      },
    ],
  };
