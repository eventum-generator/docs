import type { GeneratorMeta } from '@/lib/hub-types';

export const identityOkta: GeneratorMeta = {
    slug: 'identity-okta',
    displayName: 'Okta Identity Provider',
    category: 'cloud',
    description:
      'Okta System Log — SSO sign-in logs, MFA events, admin audit events, user lifecycle management, group and application membership changes, and sign-on policy evaluations.',
    format: ['JSON', 'ECS'],
    dataSource: 'Okta System Log API',
    eventCount: 18,
    templateCount: 18,
    highlights: [
      '15 SSO applications',
      '6 MFA factor types',
      'Session chaining',
      '22 users',
    ],
    generatorId: 'okta',
    eventTypes: [
      {
        id: 'user.session.start',
        description: 'Successful user sign-in',
        frequency: '~20%',
        category: 'authentication',
      },
      {
        id: 'user.authentication.sso',
        description: 'SSO to application',
        frequency: '~18%',
        category: 'authentication',
      },
      {
        id: 'user.authentication.auth_via_mfa',
        description: 'MFA challenge',
        frequency: '~12%',
        category: 'authentication',
      },
      {
        id: 'policy.evaluate_sign_on',
        description: 'Sign-on policy evaluation',
        frequency: '~10%',
        category: 'configuration',
      },
      {
        id: 'user.session.end',
        description: 'User sign-out',
        frequency: '~8%',
        category: 'session',
      },
      {
        id: 'user.mfa.factor.verify',
        description: 'MFA factor verification',
        frequency: '~8%',
        category: 'authentication',
      },
      {
        id: 'user.session.start (failed)',
        description: 'Failed user sign-in',
        frequency: '~4%',
        category: 'authentication',
      },
      {
        id: 'group.user_membership.add',
        description: 'Group membership change',
        frequency: '~3%',
        category: 'iam',
      },
      {
        id: 'application.user_membership.add',
        description: 'Application assignment',
        frequency: '~2.5%',
        category: 'iam',
      },
      {
        id: 'user.account.update_password',
        description: 'Self-service password change',
        frequency: '~2%',
        category: 'iam',
      },
      {
        id: 'user.session.access_admin_app',
        description: 'Admin console access',
        frequency: '~2%',
        category: 'configuration',
      },
      {
        id: 'user.mfa.factor.update',
        description: 'MFA factor enrollment',
        frequency: '~1.5%',
        category: 'iam',
      },
      {
        id: 'user.account.lock',
        description: 'Account lockout',
        frequency: '~1%',
        category: 'iam',
      },
      {
        id: 'user.lifecycle.create',
        description: 'New user provisioning',
        frequency: '~1%',
        category: 'iam',
      },
      {
        id: 'user.lifecycle.activate',
        description: 'User activation',
        frequency: '~1%',
        category: 'iam',
      },
      {
        id: 'user.account.reset_password',
        description: 'Admin password reset',
        frequency: '~1%',
        category: 'iam',
      },
      {
        id: 'user.lifecycle.deactivate',
        description: 'User deactivation',
        frequency: '~0.5%',
        category: 'iam',
      },
      {
        id: 'system.api_token.create',
        description: 'API token creation',
        frequency: '~0.5%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      '6 event categories — SSO sign-in, MFA, policy evaluation, account management, user lifecycle, admin operations',
      'Shared state correlations — user.session.start stores sessions; SSO and session end events reuse same user identity',
      '6 login failure scenarios — INVALID_CREDENTIALS, LOCKED_OUT, PASSWORD_EXPIRED, VERIFICATION_ERROR, AUTH_FAILED, INVALID_LOGIN',
      '6 MFA factor types — Okta Verify Push, TOTP, SMS, Email, WebAuthn/FIDO, YubiKey',
      '15 SSO applications — Salesforce, Slack, AWS, Jira, GitHub, Google Workspace, and more',
      '22 users across 10 departments + 2 admin accounts with admin-only operations',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'a1b2c3d4-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_name',
        defaultValue: 'okta-system-forwarder',
        description: 'Agent hostname',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'User Session Start',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "event": {
        "action": "user.session.start",
        "category": ["session", "authentication"],
        "dataset": "okta.system",
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "kind": "event",
        "module": "okta",
        "outcome": "success",
        "type": ["start", "info"]
    },
    "user": {
        "email": "sarah.jones@acmecorp.com",
        "full_name": "Sarah Jones",
        "id": "00u1a2b3c4d5e6f7g8",
        "name": "sarah.jones@acmecorp.com"
    },
    "okta": {
        "actor": {
            "alternate_id": "sarah.jones@acmecorp.com",
            "display_name": "Sarah Jones",
            "id": "00u1a2b3c4d5e6f7g8",
            "type": "User"
        },
        "authentication_context": {
            "authentication_provider": "OKTA_AUTHENTICATION_PROVIDER",
            "authentication_step": 0,
            "credential_type": "PASSWORD",
            "external_session_id": "idx1a2b3c4d5e6f7g8"
        },
        "display_message": "User login to Okta",
        "event_type": "user.session.start",
        "outcome": {
            "reason": null,
            "result": "SUCCESS"
        },
        "request": {
            "ip_chain": [
                {
                    "geographicalContext": {
                        "city": "San Francisco",
                        "country": "United States",
                        "geolocation": { "lat": 37.7749, "lon": -122.4194 },
                        "postalCode": "94105",
                        "state": "California"
                    },
                    "ip": "203.0.113.42",
                    "version": "V4"
                }
            ]
        },
        "security_context": {
            "as": {
                "number": 13335,
                "organization": { "name": "Cloudflare Inc" }
            },
            "domain": "cloudflare.com",
            "is_proxy": false,
            "isp": "Cloudflare Inc"
        },
        "severity": "INFO",
        "version": "0",
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
}`,
      },
    ],
  };
