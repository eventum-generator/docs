/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAldPro: GeneratorMeta = {
  slug: 'identity-ald-pro',
  displayName: 'ALD Pro Domain Controller',
  category: 'identity',
  description:
    'MIT KDC and 389 Directory Server audit events from an ALD Pro domain controller, preserving native Kerberos, access-log, and LDIF records in ECS JSON.',
  format: ['JSON', 'ECS'],
  dataSource: 'ALD Pro MIT KDC and 389 Directory Server logs',
  eventCount: 9,
  templateCount: 11,
  highlights: [
    'Native Kerberos and LDAP records',
    'GSSAPI bind correlation',
    'Attribute-level LDIF audit',
    'Privileged group and SUDO changes',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Kerberos spray, successful TGT, GSSAPI bind, admins-group addition, then a SUDO rule broadened to all commands.',
  generatorId: 'ald-pro',
  eventTypes: [
    {
      id: 'AS_REQ ISSUE',
      description: 'Kerberos TGT issued',
      frequency: '55% baseline',
      category: 'authentication',
    },
    {
      id: 'TGS_REQ ISSUE',
      description: 'Kerberos service ticket issued',
      frequency: '39% baseline',
      category: 'authentication',
    },
    {
      id: 'AS_REQ PREAUTH_FAILED',
      description: 'Kerberos pre-authentication failed',
      frequency: '6% baseline',
      category: 'authentication',
    },
    {
      id: 'BIND',
      description: 'GSSAPI bind request',
      frequency: 'chain only',
      category: 'authentication',
    },
    {
      id: 'BIND RESULT',
      description: 'GSSAPI bind result',
      frequency: 'chain only',
      category: 'authentication',
    },
    {
      id: 'MOD',
      description: 'Directory modification request for group or SUDO rule',
      frequency: 'chain only',
      category: 'iam',
    },
    {
      id: 'MOD RESULT',
      description: 'Directory modification result',
      frequency: 'chain only',
      category: 'iam',
    },
    {
      id: 'audit add: member',
      description: 'Attribute-level group membership addition',
      frequency: 'chain only',
      category: 'iam',
    },
    {
      id: 'audit replace: cmdCategory',
      description: 'SUDO rule broadened to all commands',
      frequency: 'chain only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Native MIT KDC AS_REQ and TGS_REQ text preserved in event.original',
    '389 DS request and RESULT records share connection and operation IDs',
    'LDIF audit records name the actor DN, target DN, and changed attribute',
    'One 13-event chain follows every 300 routine events when enabled',
    'Routine principals and client addresses come from a synthetic inventory',
  ],
  parameters: [
    {
      name: 'dc_host',
      defaultValue: 'dc-1.lab.example',
      description: 'Domain controller hostname',
    },
    {
      name: 'realm',
      defaultValue: 'LAB.EXAMPLE',
      description: 'Kerberos realm',
    },
    {
      name: 'base_dn',
      defaultValue: 'dc=lab,dc=example',
      description: 'LDAP suffix',
    },
    {
      name: 'directory_instance',
      defaultValue: 'LAB-EXAMPLE',
      description: '389 DS instance name in log paths',
    },
    {
      name: 'attack_ip',
      defaultValue: '10.99.8.42',
      description: 'Correlated chain client IP',
    },
    {
      name: 'compromised_user',
      defaultValue: 'helpdesk.admin',
      description: 'Account that succeeds after failed attempts',
    },
    {
      name: 'added_user',
      defaultValue: 'svc_sync',
      description: 'Account added to the privileged group',
    },
    {
      name: 'privileged_group',
      defaultValue: 'admins',
      description: 'Group modified in the chain',
    },
    {
      name: 'sudo_rule',
      defaultValue: 'maintenance',
      description: 'Rule broadened in the chain',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Emit the chain; `false` emits only background',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS version in the normalized envelope',
    },
  ],
  sampleOutputs: [
    {
      title: '389 DS audit: privileged group membership added',
      json: String.raw`{"@timestamp": "2026-09-25T10:37:58+00:00", "agent": {"type": "eventum"}, "aldpro": {"dirsrv": {"audit": {"attribute": "member", "attribute_operation": "add", "attribute_value": "uid=svc_sync,cn=users,cn=accounts,dc=lab,dc=example", "changetype": "modify", "dn": "cn=admins,cn=groups,cn=accounts,dc=lab,dc=example", "entryusn": 100001, "modifiersname": "uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example", "modifytimestamp": "20260925103758Z", "result": 0, "time": "20260925103758"}}}, "ecs": {"version": "8.11.0"}, "event": {"action": "modify-member", "category": ["iam"], "dataset": "aldpro.dirsrv_audit", "kind": "event", "module": "aldpro", "original": "time: 20260925103758\ndn: cn=admins,cn=groups,cn=accounts,dc=lab,dc=example\nresult: 0\nchangetype: modify\nadd: member\nmember: uid=svc_sync,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifiersname\nmodifiersname: uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260925103758Z\n-\nreplace: entryusn\nentryusn: 100001\n-", "outcome": "success", "type": ["change"]}, "host": {"name": "dc-1.lab.example"}, "log": {"file": {"path": "/var/log/dirsrv/slapd-LAB-EXAMPLE/audit"}}, "message": "time: 20260925103758\ndn: cn=admins,cn=groups,cn=accounts,dc=lab,dc=example\nresult: 0\nchangetype: modify\nadd: member\nmember: uid=svc_sync,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifiersname\nmodifiersname: uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260925103758Z\n-\nreplace: entryusn\nentryusn: 100001\n-", "related": {"user": ["helpdesk.admin", "svc_sync"]}, "user": {"domain": "LAB.EXAMPLE", "name": "helpdesk.admin"}}`,
    },
  ],
};
