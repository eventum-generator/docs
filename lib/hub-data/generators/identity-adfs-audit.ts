import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAdfsAudit: GeneratorMeta = {
  slug: 'identity-adfs-audit',
  displayName: 'Microsoft AD FS Audit Events',
  category: 'identity',
  description:
    "Security-log audit events 1200-1203 of one Active Directory Federation Services farm node (Windows Server 2016 or later, basic audit level), as NXLog im_msvistalog records wrapped in ECS, with the Windows event fields and the Message text with its AuditBase XML kept verbatim in event.original. About 500 users sign in from their workstations or through a Web Application Proxy from home, with mistyped passwords, give-ups, stale saved passwords and SSO token requests, at about 14,800 events a day. Recurring episodes show password guessing that succeeds from one of a user's usual addresses.",
  dataSource:
    'Microsoft AD FS Security-log audit events 1200-1203 (Windows Server 2016 or later, basic audit level), collected by NXLog im_msvistalog',
  eventFormat: 'ECS JSON',
  originalFormat: 'JSON',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'NXLog record with AuditBase XML in event.original',
    'Sign-ins and SSO tokens of about 500 users, about 14,800 events a day',
    'Recurring password-guessing-then-success chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "By source time, every anomaly_interval_hours (default 24, allowed 2-720): the first start falls within min(interval, 24 h) of the first event, its hour drawn from the hour-of-day curve; each later start is due one interval after the actual previous start and falls at a random time in a window of min(interval / 4, 6 h) centred on the due time, weighted toward busy hours, so starts drift toward busy hours and stay there, with no catch-up. At intervals of 8 h or less the due times cover the whole clock, so some episodes start at night. One user, drawn with the ordinary activity weights among users with no sign-in session in progress and never the previous episode's user, fails five to eight fresh credential validations (1203) seconds apart from one of their usual addresses; the password is then accepted (1202) and a token is issued (1200) with the same Activity ID, followed by ordinary SSO tokens. Linked by user.name and source.ip. Every part of the sequence also occurs in background of both modes; only an episode completes five or more 1203 followed by 1202 and 1200 within 15 minutes, once per episode.",
  generatorId: 'identity-adfs-audit',
  eventTypes: [
    {
      id: '1200',
      description:
        'Application Token Success: token issued to a relying party (fresh sign-in or SSO)',
      frequency: '75.2% measured share',
      category: 'authentication',
    },
    {
      id: '1202',
      description: 'Fresh Credential Validation Success: password validated',
      frequency: '19.7% measured share',
      category: 'authentication',
    },
    {
      id: '1203',
      description: 'Fresh Credential Validation Error: password rejected',
      frequency: '3.5% measured share',
      category: 'authentication',
    },
    {
      id: '1201',
      description: 'Application Token Failure: token issuance failed',
      frequency: '1.6% measured share',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    "About 500 users sign in from their workstations or, through a Web Application Proxy, from their one home address. Each user has at most one sign-in session at a time and signs in with a password three to eight times a day, more often the more active the user; 20-50% of a user's sign-ins are remote. Remote sign-ins (about 35% of events) carry NetworkLocation Extranet, the proxy name and the forwarded client address.",
    '91% of sign-ins are clean; 8% start with a burst of 1-8 mistyped passwords about 15 s apart (median), each extra failure about a third as likely and the chance of finally getting the password right falling by a quarter per failure, otherwise the user gives up; 1% come from a device with a stale saved password that retries 2-14 times, tens of minutes apart. About 15% of password submissions fail.',
    "Each fresh sign-in is zero or more 1203, then a 1202 and its 1200 with the same Activity ID a few seconds apart (median 4 s, up to about 3 minutes at night), where AD FS writes them within the same second. The SSO session then yields more 1200 events, each with its own Activity ID, for the user's usual relying parties at log-normal gaps (median 15 minutes) for up to 8 hours, longer in office hours. About 2% of tokens fail (1201).",
    'The event rate follows the same UTC hour-of-day curve every day: 0.30 events/s at 07:00-17:00, 0.15 at 06:00-07:00 and 17:00-19:00, 0.09 at 19:00-22:00 and 0.05 at night, with daily volume varying by about 3% and no weekday or weekend cycle. The data starts with no open SSO sessions, so in about the first hour new password sign-ins (1202) make up a larger share of records.',
    'Background holds every part of the chain in both modes: repeated failures of one user and address within minutes, bursts of five or more failures, give-ups and bursts followed by a validated password; five or more failures followed by a sign-in come mostly from stale saved passwords, usually an hour or more later. Within 15 minutes of the first of five or more failures of one user and address, a token that follows a validated password is denied (1201) instead of issued, about three times a day in both modes; this denial is a modelled policy, not documented AD FS behaviour. With anomaly_mode true, bursts of five or more failures followed by a sign-in within 15 minutes are about one per episode more frequent.',
    "No capture from a running AD FS server was available: the NXLog record layout and the 1201/1203 XML follow public intake fixtures, the 1200 XML Microsoft's published example, and 1202 uses the 1203 layout with a successful result. Keywords is Classic plus Audit Failure or Classic plus Audit Success (derived, no fixture), and EventTime is written in UTC. Fresh-credential events and 1201 name the federation service as relying party and carry the typed UPN, and Endpoint is /adfs/ls/ on every record. No Elastic integration exists, so the ECS mapping is inferred.",
    'Only WS-Federation passive sign-in to /adfs/ls/ with forms authentication is modelled: no WS-Trust, OAuth, SAML-P, MFA, device authentication, Extranet Smart Lockout (1210), password change or sign-out events, and no 1201 failure types other than GenericError. One server node with no farm load balancing, and a single client address on extranet records where a real proxy chain can list several.',
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
      title: 'Completing 1200 of an episode',
      json: String.raw`{"@timestamp": "2026-09-01T04:54:45+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "adfs", "dataset": "adfs.audit", "code": "1200", "action": "token-issued", "category": ["authentication"], "type": ["info"], "outcome": "success", "original": "{\"EventTime\":\"2026-09-01 04:54:45\",\"Hostname\":\"adfs-01.corp.example\",\"Keywords\":-9178336040581070848,\"EventType\":\"AUDIT_SUCCESS\",\"SeverityValue\":2,\"Severity\":\"INFO\",\"EventID\":1200,\"SourceName\":\"AD FS Auditing\",\"Task\":3,\"RecordNumber\":66897109,\"ProcessID\":0,\"ThreadID\":0,\"Channel\":\"Security\",\"Domain\":\"CORP\",\"AccountName\":\"gmsa-adfs$\",\"UserID\":\"S-1-5-21-3623811015-3361044348-30300820-1613\",\"AccountType\":\"User\",\"Message\":\"The Federation Service issued a valid token. See XML for details. \\r\\n\\r\\nActivity ID: 33f2a194-5b29-4517-bad1-aef1dd1e1abe \\r\\n\\r\\nAdditional Data \\r\\nXML: <?xml version=\\\"1.0\\\" encoding=\\\"utf-16\\\"?>\\r\\n<AuditBase xmlns:xsd=\\\"http://www.w3.org/2001/XMLSchema\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xsi:type=\\\"AppTokenAudit\\\">\\r\\n  <AuditType>AppToken</AuditType>\\r\\n  <AuditResult>Success</AuditResult>\\r\\n  <FailureType>None</FailureType>\\r\\n  <ErrorCode>N/A</ErrorCode>\\r\\n  <ContextComponents>\\r\\n    <Component xsi:type=\\\"ResourceAuditComponent\\\">\\r\\n      <RelyingParty>https://hr.corp.example/</RelyingParty>\\r\\n      <ClaimsProvider>AD AUTHORITY</ClaimsProvider>\\r\\n      <UserId>CORP\\\\irina.lebedeva</UserId>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"AuthNAuditComponent\\\">\\r\\n      <PrimaryAuth>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</PrimaryAuth>\\r\\n      <DeviceAuth>false</DeviceAuth>\\r\\n      <DeviceId>N/A</DeviceId>\\r\\n      <MfaPerformed>false</MfaPerformed>\\r\\n      <MfaMethod>N/A</MfaMethod>\\r\\n      <TokenBindingProvidedId>false</TokenBindingProvidedId>\\r\\n      <TokenBindingReferredId>false</TokenBindingReferredId>\\r\\n      <SsoBindingValidationLevel>NotSet</SsoBindingValidationLevel>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"ProtocolAuditComponent\\\">\\r\\n      <OAuthClientId>N/A</OAuthClientId>\\r\\n      <OAuthGrant>N/A</OAuthGrant>\\r\\n    </Component>\\r\\n    <Component xsi:type=\\\"RequestAuditComponent\\\">\\r\\n      <Server>http://sts.corp.example/adfs/services/trust</Server>\\r\\n      <AuthProtocol>WSFederation</AuthProtocol>\\r\\n      <NetworkLocation>Extranet</NetworkLocation>\\r\\n      <IpAddress>192.0.2.107</IpAddress>\\r\\n      <ForwardedIpAddress>192.0.2.107</ForwardedIpAddress>\\r\\n      <ProxyIpAddress>N/A</ProxyIpAddress>\\r\\n      <NetworkIpAddress>N/A</NetworkIpAddress>\\r\\n      <ProxyServer>wap-01</ProxyServer>\\r\\n      <UserAgentString>Mozilla/5.0 (Linux; Android 11; SM-A217F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.85 Mobile Safari/537.36</UserAgentString>\\r\\n      <Endpoint>/adfs/ls/</Endpoint>\\r\\n    </Component>\\r\\n  </ContextComponents>\\r\\n</AuditBase>\",\"Opcode\":\"Info\",\"EventReceivedTime\":\"2026-09-01 04:54:46\",\"SourceModuleName\":\"in\",\"SourceModuleType\":\"im_msvistalog\"}"}, "message": "The Federation Service issued a valid token. See XML for details.", "host": {"name": "adfs-01.corp.example"}, "winlog": {"channel": "Security", "provider_name": "AD FS Auditing", "event_id": "1200", "record_id": 66897109, "activity_id": "33f2a194-5b29-4517-bad1-aef1dd1e1abe", "computer_name": "adfs-01.corp.example", "keywords": ["Audit Success", "Classic"]}, "user": {"name": "irina.lebedeva", "domain": "CORP"}, "source": {"ip": "192.0.2.107"}, "user_agent": {"original": "Mozilla/5.0 (Linux; Android 11; SM-A217F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.85 Mobile Safari/537.36"}, "related": {"user": ["irina.lebedeva"], "ip": ["192.0.2.107"]}, "adfs": {"audit": {"audit_type": "AppToken", "audit_result": "Success", "failure_type": "None", "error_code": "N/A", "relying_party": "https://hr.corp.example/", "claims_provider": "AD AUTHORITY", "user_id": "CORP\\irina.lebedeva", "primary_auth": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport", "mfa_performed": false, "server": "http://sts.corp.example/adfs/services/trust", "auth_protocol": "WSFederation", "network_location": "Extranet", "ip_address": "192.0.2.107", "proxy_server": "wap-01", "endpoint": "/adfs/ls/", "forwarded_ip_address": "192.0.2.107"}}}`,
    },
  ],
};
