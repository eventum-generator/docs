import type { GeneratorMeta } from '@/lib/hub-types';

export const identityOpenldapAuditlog: GeneratorMeta = {
  slug: 'identity-openldap-auditlog',
  displayName: 'OpenLDAP 2.6.15 auditlog LDIF',
  category: 'identity',
  dataSource: 'OpenLDAP 2.6.15 slapo-auditlog file records',
  description:
    'Successful add and modify operations as multiline LDIF with routine directory changes and recurring privileged-account episodes.',
  generatorId: 'openldap-auditlog',
  eventCount: 4,
  templateCount: 1,
  highlights: [
    'Native multiline LDIF preserved in event.original',
    'One-minute routine directory changes from three administrators',
    'Recurring service-account, group-membership and password sequence',
  ],
  anomalyChain:
    'Every two hours by default, one actor creates a fresh service account, adds it to the privileged group and replaces its password in adjacent records.',
  eventTypes: [
    {
      id: 'modify person attribute',
      description: 'Description, phone, title or address update',
      frequency: '88% background selection weight',
      category: 'iam',
    },
    {
      id: 'modify userPassword',
      description: 'Routine password rotation',
      frequency: '5% background selection weight',
      category: 'iam',
    },
    {
      id: 'modify group member',
      description: 'Group membership add or delete',
      frequency: '5% background selection weight',
      category: 'iam',
    },
    {
      id: 'add person',
      description: 'New service account',
      frequency: '2% background selection weight',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Native add/modify LDIF includes source header, changed attributes, operational fields, matching end comment and blank separator.',
    'Routine account creation, privileged-group edits and password changes overlap with the linked episodes; each episode target DN differs.',
    'The auditlog overlay records successful writes, not binds or searches; native multiline collection and exact daemon output still need live verification.',
  ],
  format: ['JSON', 'ECS', 'LDIF'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring three-record episodes',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description: 'Hours between episode starts',
    },
    {
      name: 'host_name',
      defaultValue: 'ldap01.corp.example',
      description: 'Directory server host',
    },
    {
      name: 'base_dn',
      defaultValue: 'dc=corp,dc=example',
      description: 'Backend suffix for native header and DNs',
    },
    {
      name: 'operator_dn',
      defaultValue: 'uid=svc-maint,ou=People,dc=corp,dc=example',
      description: 'Bound administrator in routine and episode activity',
    },
    {
      name: 'backdoor_uid',
      defaultValue: 'svc-backup',
      description: 'Service-account prefix in both modes',
    },
    {
      name: 'privileged_group',
      defaultValue: 'directory-admins',
      description: 'Existing group modified in both modes',
    },
  ],
  sampleOutputs: [
    {
      title: 'OpenLDAP 2.6.15 auditlog LDIF change',
      json: String.raw`{
  "@timestamp": "2026-09-25T02:02:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "ldap-modify",
    "category": [
      "iam"
    ],
    "kind": "event",
    "original": "# modify 1790301720 dc=corp,dc=example uid=svc-maint,ou=People,dc=corp,dc=example IP=10.24.1.11:52111 conn=1002\ndn: cn=directory-admins,ou=Groups,dc=corp,dc=example\nchangetype: modify\nadd: member\nmember: uid=svc-backup-000003,ou=People,dc=corp,dc=example\n-\nreplace: entryCSN\nentryCSN: 20260925020200.000000Z#000123#000#000000\n-\nreplace: modifiersName\nmodifiersName: uid=svc-maint,ou=People,dc=corp,dc=example\n-\nreplace: modifyTimestamp\nmodifyTimestamp: 20260925020200Z\n-\n# end modify 1790301720\n\n",
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
      "connection_id": 1002,
      "entry_csn": "20260925020200.000000Z#000123#000#000000",
      "operation": "add",
      "peer_ip": "10.24.1.11",
      "peer_port": 52111,
      "target_dn": "cn=directory-admins,ou=Groups,dc=corp,dc=example",
      "value": "uid=svc-backup-000003,ou=People,dc=corp,dc=example"
    }
  },
  "related": {
    "ip": [
      "10.24.1.11"
    ],
    "user": [
      "uid=svc-maint,ou=People,dc=corp,dc=example",
      "uid=svc-backup-000003,ou=People,dc=corp,dc=example"
    ]
  },
  "source": {
    "ip": "10.24.1.11",
    "port": 52111
  },
  "user": {
    "name": "uid=svc-maint,ou=People,dc=corp,dc=example"
  }
}`,
    },
  ],
};
