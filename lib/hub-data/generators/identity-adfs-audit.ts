/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAdfsAudit: GeneratorMeta = {
  slug: 'identity-adfs-audit',
  displayName: 'Microsoft AD FS Event XML',
  category: 'identity',
  description:
    'AD FS Event 1200 token-issuance XML with a switchable cross-application token fan-out chain.',
  dataSource: 'AD FS Security Event 1200 XML',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'identity-adfs-audit',
  highlights: [
    'Event 1200 AppTokenAudit XML',
    'Distinct Activity IDs per request',
    'Five relying parties in chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One user and client address receive five successful tokens for five distinct relying parties in a short window, each with its own Activity ID.',
  eventTypes: [
    {
      id: '1200',
      description: 'Successful token issuance',
      frequency: '1 per routine tick; 5 per chain',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Windows Event XML with the documented AppTokenAudit content is retained in event.original.',
    'Each token issue has its own EventRecordID and Activity ID.',
    'Fifty relying-party samples vary routine users, client addresses and applications.',
  ],
  parameters: [
    {
      name: 'server_name',
      defaultValue: 'adfs-01.corp.example',
      description: 'Federation server name',
    },
    {
      name: 'anomaly_user',
      defaultValue: String.raw`CORP\finance_admin`,
      description: 'Chain principal',
    },
    {
      name: 'anomaly_ip',
      defaultValue: '10.99.4.51',
      description: 'Chain client address',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '250',
      description: 'Routine events between chains',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable chain; false emits background only',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated anomaly event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:43:46+00:00",
  "adfs": {
    "audit": {
      "activity_id": "{6e65d788-1692-4bc0-8e27-15dffa73c8f1}",
      "audit_result": "Success",
      "audit_type": "AppToken",
      "ip_address": "10.99.4.51",
      "relying_party": "urn:corp:admin",
      "user_id": "CORP\\finance_admin"
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "token-issued",
    "category": [
      "authentication"
    ],
    "code": "1200",
    "dataset": "adfs.audit",
    "kind": "event",
    "original": "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"AD FS Auditing\"/><EventID>1200</EventID><Version>0</Version><Level>0</Level><Task>3</Task><Opcode>0</Opcode><TimeCreated SystemTime=\"2026-09-25T12:43:46+00:00\"/><EventRecordID>10255</EventRecordID><Correlation ActivityID=\"{6e65d788-1692-4bc0-8e27-15dffa73c8f1}\"/><Channel>Security</Channel><Computer>adfs-01.corp.example</Computer></System><EventData><Data>{6e65d788-1692-4bc0-8e27-15dffa73c8f1}</Data><Data>&lt;AuditBase xmlns:xsd=&#34;http://www.w3.org/2001/XMLSchema&#34; xmlns:xsi=&#34;http://www.w3.org/2001/XMLSchema-instance&#34; xsi:type=&#34;AppTokenAudit&#34;&gt;&lt;AuditType&gt;AppToken&lt;/AuditType&gt;&lt;AuditResult&gt;Success&lt;/AuditResult&gt;&lt;FailureType&gt;None&lt;/FailureType&gt;&lt;ErrorCode&gt;N/A&lt;/ErrorCode&gt;&lt;ContextComponents&gt;&lt;Component xsi:type=&#34;ResourceAuditComponent&#34;&gt;&lt;RelyingParty&gt;urn:corp:admin&lt;/RelyingParty&gt;&lt;ClaimsProvider&gt;AD AUTHORITY&lt;/ClaimsProvider&gt;&lt;UserId&gt;CORP\\finance_admin&lt;/UserId&gt;&lt;/Component&gt;&lt;Component xsi:type=&#34;AuthNAuditComponent&#34;&gt;&lt;PrimaryAuth&gt;urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport&lt;/PrimaryAuth&gt;&lt;DeviceAuth&gt;false&lt;/DeviceAuth&gt;&lt;DeviceId&gt;N/A&lt;/DeviceId&gt;&lt;MfaPerformed&gt;false&lt;/MfaPerformed&gt;&lt;MfaMethod&gt;N/A&lt;/MfaMethod&gt;&lt;TokenBindingProvidedId&gt;true&lt;/TokenBindingProvidedId&gt;&lt;TokenBindingReferredId&gt;false&lt;/TokenBindingReferredId&gt;&lt;SsoBindingValidationLevel&gt;TokenBoundAndValid&lt;/SsoBindingValidationLevel&gt;&lt;/Component&gt;&lt;Component xsi:type=&#34;ProtocolAuditComponent&#34;&gt;&lt;OAuthClientId&gt;N/A&lt;/OAuthClientId&gt;&lt;OAuthGrant&gt;N/A&lt;/OAuthGrant&gt;&lt;/Component&gt;&lt;Component xsi:type=&#34;RequestAuditComponent&#34;&gt;&lt;Server&gt;https://adfs-01.corp.example/adfs/services/trust&lt;/Server&gt;&lt;AuthProtocol&gt;WSFederation&lt;/AuthProtocol&gt;&lt;NetworkLocation&gt;Intranet&lt;/NetworkLocation&gt;&lt;IpAddress&gt;10.99.4.51&lt;/IpAddress&gt;&lt;ForwardedIpAddress /&gt;&lt;ProxyIpAddress&gt;N/A&lt;/ProxyIpAddress&gt;&lt;NetworkIpAddress&gt;N/A&lt;/NetworkIpAddress&gt;&lt;ProxyServer&gt;N/A&lt;/ProxyServer&gt;&lt;UserAgentString&gt;Mozilla/5.0&lt;/UserAgentString&gt;&lt;Endpoint&gt;/adfs/ls&lt;/Endpoint&gt;&lt;/Component&gt;&lt;/ContextComponents&gt;&lt;/AuditBase&gt;</Data></EventData></Event>",
    "outcome": "success",
    "type": [
      "allowed"
    ]
  },
  "host": {
    "name": "adfs-01.corp.example"
  },
  "message": "The Federation Service issued a valid token. See XML for details.",
  "related": {
    "ip": [
      "10.99.4.51"
    ],
    "user": [
      "CORP\\finance_admin"
    ]
  },
  "source": {
    "ip": "10.99.4.51"
  },
  "tags": [
    "adfs-audit",
    "preserve_original_event"
  ],
  "user": {
    "name": "CORP\\finance_admin"
  },
  "winlog": {
    "activity_id": "{6e65d788-1692-4bc0-8e27-15dffa73c8f1}",
    "channel": "Security",
    "event_id": 1200,
    "provider_name": "AD FS Auditing",
    "record_id": 10255
  }
}`,
    },
  ],
};
