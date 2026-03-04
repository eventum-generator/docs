import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudAzureEntraId: GeneratorMeta = {
  slug: 'cloud-azure-entra-id',
  displayName: 'Azure Entra ID (Azure AD)',
  category: 'cloud',
  description:
    'Microsoft Entra ID sign-in and audit logs — interactive and non-interactive authentication, service principal sign-ins, and directory changes. Covers MFA, Conditional Access, AADSTS errors, and role/group management.',
  format: ['JSON', 'ECS'],
  dataSource: 'Microsoft Entra ID (Azure AD) Sign-In and Audit Logs',
  eventCount: 6,
  templateCount: 6,
  highlights: [
    '14 AADSTS error codes',
    'Conditional Access policies',
    'MFA + 5 auth methods',
    '21 audit operations',
  ],
  generatorId: 'entra-id',
  eventTypes: [
    {
      id: 'signin-interactive-success',
      description: 'Interactive sign-ins (browser, desktop apps)',
      frequency: '~30%',
      category: 'authentication',
    },
    {
      id: 'signin-interactive-failure',
      description: 'Failed interactive sign-ins (AADSTS errors)',
      frequency: '~10%',
      category: 'authentication',
    },
    {
      id: 'signin-noninteractive-success',
      description: 'Token refresh, SSO, background auth',
      frequency: '~25%',
      category: 'authentication',
    },
    {
      id: 'signin-noninteractive-failure',
      description: 'Expired tokens, revoked sessions',
      frequency: '~5%',
      category: 'authentication',
    },
    {
      id: 'signin-service-principal',
      description: 'App/service principal authentication',
      frequency: '~15%',
      category: 'authentication',
    },
    {
      id: 'audit-directory-change',
      description: 'Directory changes (user/group/role/app mgmt)',
      frequency: '~15%',
      category: 'iam',
    },
  ],
  realismFeatures: [
    '14 AADSTS error codes — bad password, locked, CA block, MFA required, KMSI interrupt',
    '7 Conditional Access policies with enforced/reportOnly modes and grant controls',
    '5 authentication methods — Password, FIDO2, Windows Hello, Authenticator push + passwordless',
    'Service principal sign-ins with client secrets, certificates, and federated credentials',
    '21 audit operations across 6 categories (User, Group, App, Role, Policy, Device)',
    '18 users across 9 departments including 2 admins and 2 service accounts',
  ],
  parameters: [
    {
      name: 'agent_id',
      defaultValue: 'e3f4a5b6-...',
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
      description: 'Azure AD / Entra ID tenant ID',
    },
  ],
  sampleOutputs: [
    {
      title: 'Interactive Sign-In — Success',
      json: `{
    "@timestamp": "2026-03-04T10:15:22+00:00",
    "cloud": {
        "provider": "azure",
        "account": { "id": "aaaabbbb-0000-cccc-1111-dddd2222eeee" }
    },
    "event": {
        "action": "UserLoggedIn",
        "category": ["authentication"],
        "dataset": "azure.signinlogs",
        "outcome": "success",
        "type": ["start", "allowed"]
    },
    "user": {
        "domain": "contoso.com",
        "email": "sarah.jones@contoso.com",
        "full_name": "Sarah Jones",
        "name": "sarah.jones"
    },
    "azure": {
        "signinlogs": {
            "category": "SignInLogs",
            "result_type": "0",
            "properties": {
                "app_display_name": "Microsoft Graph",
                "client_app_used": "Browser",
                "conditional_access_status": "success",
                "is_interactive": true,
                "risk_level_aggregated": "none",
                "device_detail": {
                    "browser": "Chrome 122.0.0",
                    "operating_system": "Windows 10",
                    "trust_type": "Hybrid Azure AD joined"
                },
                "authentication_details": [{
                    "authentication_method": "Microsoft Authenticator (push notification)",
                    "succeeded": true
                }]
            }
        }
    }
}`,
    },
  ],
};
