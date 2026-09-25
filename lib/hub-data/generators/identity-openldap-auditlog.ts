import type { GeneratorMeta } from '@/lib/hub-types';

export const identityOpenldapAuditlog: GeneratorMeta = {
  slug: 'identity-openldap-auditlog',
  displayName: 'OpenLDAP auditlog.ldif',
  category: 'identity',
  dataSource: 'slapo-auditlog LDIF change records',
  description:
    'Directory change records with a switchable account-creation and privileged-group sequence.',
  generatorId: 'openldap-auditlog',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native LDIF retained in event.original',
    'Account add, privileged group edit and password change',
    'Actor, DN and entryCSN correlation',
  ],
  anomalyChain:
    'The same operator adds a service account, adds its DN to a privileged group, then changes that account password.',
  eventTypes: [
    {
      id: 'routine modify',
      description: 'Account metadata edit',
      frequency: '100% baseline',
      category: 'iam',
    },
    {
      id: 'account add',
      description: 'New service account',
      frequency: 'Chain only',
      category: 'iam',
    },
    {
      id: 'group modify',
      description: 'Privileged group membership',
      frequency: 'Chain only',
      category: 'iam',
    },
    {
      id: 'password modify',
      description: 'New account password change',
      frequency: 'Chain only',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'LDIF records retain start/end comments and OpenLDAP change syntax.',
    'Routine metadata attributes vary with weighted synthetic frequency.',
    'The auditlog overlay records writes, not binds or searches.',
  ],
  format: ['JSON', 'ECS', 'LDIF'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include three-change privileged-account chain',
    },
    {
      name: 'host_name',
      defaultValue: 'ldap01.corp.example',
      description: 'Directory server name',
    },
    {
      name: 'base_dn',
      defaultValue: 'dc=corp,dc=example',
      description: 'Directory suffix',
    },
    {
      name: 'operator_dn',
      defaultValue: 'uid=svc-maint,ou=People,dc=corp,dc=example',
      description: 'Operator DN in the chain',
    },
    {
      name: 'backdoor_uid',
      defaultValue: 'svc-backup',
      description: 'New service account UID',
    },
    {
      name: 'privileged_group',
      defaultValue: 'directory-admins',
      description: 'Group modified in the chain',
    },
  ],
  sampleOutputs: [
    {
      title: 'OpenLDAP auditlog.ldif event',
      json: String.raw`{
  "@timestamp": "2026-09-25T12:21:25+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ldap-modify",
    "category": [
      "iam"
    ],
    "kind": "event",
    "original": "# modify 1790338885 dc=corp,dc=example uid=svc-maint,ou=People,dc=corp,dc=example\ndn: cn=directory-admins,ou=Groups,dc=corp,dc=example\nchangetype: modify\nadd: member\nmember: uid=svc-backup,ou=People,dc=corp,dc=example\n-\nreplace: entryCSN\nentryCSN: 20260925122125.000000Z#001062#000#000000\n-\nreplace: modifiersName\nmodifiersName: uid=svc-maint,ou=People,dc=corp,dc=example\n-\nreplace: modifyTimestamp\nmodifyTimestamp: 20260925122125Z\n-\n# end modify 1790338885",
    "outcome": "success",
    "type": [
      "change"
    ]
  },
  "host": {
    "name": "ldap01.corp.example"
  },
  "ldap": {
    "auditlog": {
      "actor_dn": "uid=svc-maint,ou=People,dc=corp,dc=example",
      "attribute": "member",
      "base_dn": "dc=corp,dc=example",
      "change_type": "modify",
      "entry_csn": "20260925122125.000000Z#001062#000#000000",
      "target_dn": "cn=directory-admins,ou=Groups,dc=corp,dc=example",
      "value": "uid=svc-backup,ou=People,dc=corp,dc=example"
    }
  },
  "related": {
    "user": [
      "uid=svc-maint,ou=People,dc=corp,dc=example",
      "cn=directory-admins,ou=Groups,dc=corp,dc=example"
    ]
  },
  "user": {
    "name": "uid=svc-maint,ou=People,dc=corp,dc=example"
  }
}`,
    },
  ],
};
