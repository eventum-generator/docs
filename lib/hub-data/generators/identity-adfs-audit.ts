import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAdfsAudit: GeneratorMeta = {
  slug: 'identity-adfs-audit',
  displayName: 'Microsoft AD FS Audit Events',
  category: 'identity',
  description:
    "Security-log audit events 1200-1203 of one Active Directory Federation Services farm node (Windows Server 2016 or later, basic audit level), as NXLog im_msvistalog JSON records with the AuditBase XML kept verbatim in event.original and wrapped in ECS. About 150 users sign in from workstations or through a Web Application Proxy from home. Recurring episodes show password guessing from one of a user's usual addresses that succeeds.",
  dataSource:
    'Microsoft AD FS Security-log audit events 1200-1203 (basic audit level), collected by NXLog im_msvistalog',
  format: ['JSON', 'ECS', 'XML'],
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'NXLog record with AuditBase XML in event.original',
    'Independent sign-ins and SSO tokens of about 150 users',
    'Recurring password-guessing-then-success chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'About every 24 hours of source time by default (the first within the first min(interval, 24 h) at an hour drawn from the background curve; each later one due one interval after the actual previous start and started in a window of min(interval / 4, 6 h) centred on the due time, weighted toward busy hours, with no catch-up), one user fails five to eight fresh credential validations (1203) from one of their usual addresses seconds apart, then the password is accepted (1202) and a token is issued (1200) with the same Activity ID, followed by ordinary SSO tokens, all within 15 minutes. The user is drawn with the background weights among idle users and differs from the previous episode; every user, address and relying party also occurs in background, and only the episode completes the sequence.',
  generatorId: 'identity-adfs-audit',
  eventTypes: [
    {
      id: '1200',
      description:
        'Application Token Success: token issued to a relying party (fresh sign-in or SSO)',
      frequency: '64.3% measured share',
      category: 'authentication',
    },
    {
      id: '1202',
      description: 'Fresh Credential Validation Success: password validated',
      frequency: '26.9% measured share',
      category: 'authentication',
    },
    {
      id: '1203',
      description: 'Fresh Credential Validation Error: password rejected',
      frequency: '7.4% measured share',
      category: 'authentication',
    },
    {
      id: '1201',
      description: 'Application Token Failure: token issuance failed',
      frequency: '1.5% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'About 150 users sign in independently, on lognormal idle gaps thinned by a UTC office-hours curve, from their workstations or through a Web Application Proxy from home. 86% of sign-ins are clean, 12% start with a burst of 1-8 mistyped passwords seconds apart (the chance of finally getting it right falls with each failure, otherwise the user gives up) and 2% come from a device with a stale saved password retrying every few tens of minutes.',
    "Each fresh sign-in is zero or more 1203, then a 1202 and its 1200 with the same Activity ID; the SSO session then yields more 1200 events, each with its own Activity ID, for the user's usual relying parties over up to 8 hours. About 2% of token requests fail (1201). Remote sign-ins carry NetworkLocation Extranet, the proxy name and the forwarded client address.",
    'Background holds every part of the chain: 934 failure pairs of one user and address within 5 minutes across five 120-hour off captures, bursts of five or more failures, give-ups and bursts followed by a validated password. A background token that would complete the chain within 900 s of the first failure is denied at its own time (1201): 10 such first tokens across those captures, while 161 tokens after the window were left unchanged. This denial, about 2.0 per 120 hours in either mode, is a modelled policy, not documented AD FS behaviour.',
    "The NXLog record layout and the 1201/1203 XML follow public intake fixtures and the 1200 XML Microsoft's published example; 1202 uses the 1203 layout with a successful result. Keywords is Classic plus Audit Failure or Classic plus Audit Success (derived, no fixture), and EventTime is written in UTC. No capture from a running AD FS server was available, and no Elastic integration exists, so the ECS mapping is inferred.",
    'Only WS-Federation passive sign-in to /adfs/ls/ with forms authentication is modelled: no WS-Trust, OAuth, SAML-P, MFA, device authentication, Extranet Smart Lockout (1210), password change or sign-out events, and no 1201 failure types other than GenericError. One server node, UTC office hours with no weekday cycle, and a single forwarded client address on extranet records.',
    'At intervals of 8 hours or less the episode due times cover the whole clock, so some episodes start at night.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the password-guessing episodes; false emits background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode recurrence interval in hours, 2 to 720',
    },
    {
      name: 'federation_service',
      defaultValue: 'sts.corp.example',
      description:
        'Federation service name, used in Server and the fresh-credential RelyingParty',
    },
    {
      name: 'host_name',
      defaultValue: 'adfs-01.corp.example',
      description: 'AD FS server name (Hostname, host.name)',
    },
    {
      name: 'proxy_server',
      defaultValue: 'wap-01',
      description: 'Web Application Proxy name on extranet requests',
    },
    {
      name: 'domain',
      defaultValue: 'CORP',
      description: 'NetBIOS domain of users and of the service account',
    },
    {
      name: 'service_account',
      defaultValue: 'gmsa-adfs$',
      description: 'AD FS service account (AccountName)',
    },
    {
      name: 'service_account_sid',
      defaultValue: 'S-1-5-21-3623811015-3361044348-30300820-1613',
      description: 'Service account SID (UserID)',
    },
  ],
  sampleOutputs: [
    {
      title: 'Final 1200 of the first episode',
      json: String.raw`{"@timestamp": "2026-03-02T07:18:40+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "adfs", "dataset": "adfs.audit", "code": "1200", "action": "token-issued", "category": ["authentication"], "type": ["info"], "outcome": "success", "original": "{\"EventTime\":\"2026-03-02 07:18:40\",\"Hostname\":\"adfs-01.corp.example\",\"Keywords\":-9178336040581070848,\"EventType\":\"AUDIT_SUCCESS\",\"SeverityValue\":2,\"Severity\":\"INFO\",\"EventID\":1200,\"SourceName\":\"AD FS Auditing\",\"Task\":3,\"RecordNumber\":60039641,\"ProcessID\":0,\"ThreadID\":0,\"Channel\":\"Security\",\"Domain\":\"CORP\",\"AccountName\":\"gmsa-adfs$\",\"UserID\":\"S-1-5-21-3623811015-3361044348-30300820-1613\",\"AccountType\":\"User\",\"Message\":\"The Federation Service issued a valid token. See XML for details. \\r\\n\\r\\nActivity ID: 9bfa2086-82e9-4410-a4e7-e185e2d8fa25 \\r\\n\\r\\nAdditional Data \\r\\nXML: <?xml version=\\\"1.0\\\" encoding=\\\"utf-16\\\"?>\\r\\n<AuditBase xmlns:xsd=\\\"http://www.w3.org/2001/XMLSchema\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xsi:type=\\\"AppTokenAudit\\\">\\r\\n  <AuditType>AppToken</AuditType>\\r\\n  <AuditResult>Success</AuditResult>\\r\\n  <FailureType>None</FailureType>\\r\\n  <ErrorCode>N/A</ErrorCode>\\r\\n  <ContextComponents>\\r\\n    <Component xsi:type=\\\"ResourceAuditComponent\\\">\\r\\n      <RelyingParty>https://intranet.corp.example/</RelyingParty>\\r\\n      <ClaimsProvider>AD AUTHORITY</ClaimsProvider>\\r\\n      <UserId>CORP\\\\adam.petrova</UserId>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"AuthNAuditComponent\\\">\\r\\n      <PrimaryAuth>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</PrimaryAuth>\\r\\n      <DeviceAuth>false</DeviceAuth>\\r\\n      <DeviceId>N/A</DeviceId>\\r\\n      <MfaPerformed>false</MfaPerformed>\\r\\n      <MfaMethod>N/A</MfaMethod>\\r\\n      <TokenBindingProvidedId>false</TokenBindingProvidedId>\\r\\n      <TokenBindingReferredId>false</TokenBindingReferredId>\\r\\n      <SsoBindingValidationLevel>NotSet</SsoBindingValidationLevel>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"ProtocolAuditComponent\\\">\\r\\n      <OAuthClientId>N/A</OAuthClientId>\\r\\n      <OAuthGrant>N/A</OAuthGrant>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"RequestAuditComponent\\\">\\r\\n      <Server>http://sts.corp.example/adfs/services/trust</Server>\\r\\n      <AuthProtocol>WSFederation</AuthProtocol>\\r\\n      <NetworkLocation>Intranet</NetworkLocation>\\r\\n      <IpAddress>10.20.12.152</IpAddress>\\r\\n      <ForwardedIpAddress />\\r\\n      <ProxyIpAddress>N/A</ProxyIpAddress>\\r\\n      <NetworkIpAddress>N/A</NetworkIpAddress>\\r\\n      <ProxyServer>N/A</ProxyServer>\\r\\n      <UserAgentString>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.2478.80</UserAgentString>\\r\\n      <Endpoint>/adfs/ls/</Endpoint>\\r\\n    </Component>\\r\\n  </ContextComponents>\\r\\n</AuditBase>\",\"Opcode\":\"Info\",\"EventReceivedTime\":\"2026-03-02 07:18:40\",\"SourceModuleName\":\"in\",\"SourceModuleType\":\"im_msvistalog\"}"}, "message": "The Federation Service issued a valid token. See XML for details.", "host": {"name": "adfs-01.corp.example"}, "winlog": {"channel": "Security", "provider_name": "AD FS Auditing", "event_id": "1200", "record_id": 60039641, "activity_id": "9bfa2086-82e9-4410-a4e7-e185e2d8fa25", "computer_name": "adfs-01.corp.example", "keywords": ["Audit Success", "Classic"]}, "user": {"name": "adam.petrova", "domain": "CORP"}, "source": {"ip": "10.20.12.152"}, "user_agent": {"original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.2478.80"}, "related": {"user": ["adam.petrova"], "ip": ["10.20.12.152"]}, "adfs": {"audit": {"audit_type": "AppToken", "audit_result": "Success", "failure_type": "None", "error_code": "N/A", "relying_party": "https://intranet.corp.example/", "claims_provider": "AD AUTHORITY", "user_id": "CORP\\adam.petrova", "primary_auth": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport", "mfa_performed": false, "server": "http://sts.corp.example/adfs/services/trust", "auth_protocol": "WSFederation", "network_location": "Intranet", "ip_address": "10.20.12.152", "proxy_server": "N/A", "endpoint": "/adfs/ls/"}}}`,
    },
  ],
};
