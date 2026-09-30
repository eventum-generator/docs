import type { GeneratorMeta } from '@/lib/hub-types';

export const identityOpenldapAuditlog: GeneratorMeta = {
  displayName: 'OpenLDAP auditlog',
  category: 'identity',
  description:
    'About 1,980 successful directory changes per day, with native multiline LDIF and a custom ECS wrapper.',
  dataSource: 'OpenLDAP 2.6.15 slapo-auditlog',
  format: ['JSON', 'ECS'],
  highlights: [
    'Three administrators and ordinary provisioning throughout the day',
    'Temporary accounts and their memberships expire after two to four hours',
  ],
  anomalyChain:
    'One administrator/address creates an account, adds it to directory-admins and replaces its password within 15 minutes. Default recurrence is two hours; actors rotate. First start is within min(interval,24h), weighted by daily activity. Later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'openldap',
  eventTypes: [
    {
      id: 'modify:attributes',
      description: 'Person description, telephone, title or mail',
      frequency: 'About 86%',
      category: 'iam',
    },
    {
      id: 'modify:userPassword',
      description: 'Password replacement',
      frequency: 'About 5%',
      category: 'iam',
    },
    {
      id: 'modify:member',
      description: 'Group membership addition or removal',
      frequency: 'About 6%',
      category: 'iam',
    },
    {
      id: 'add',
      description: 'Temporary service account creation',
      frequency: 'About 2%',
      category: 'iam',
    },
    {
      id: 'delete',
      description: 'Expired service account deletion',
      frequency: 'About 2%',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Three administrators and ordinary provisioning throughout the day',
    'Temporary accounts and their memberships expire after two to four hours',
    'Bind, search and failed-operation logs are outside this feed',
  ],
  slug: 'identity-openldap-auditlog',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 5,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring linked sequences',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '2',
      description: 'Recurrence in hours, minimum 1',
    },
    {
      name: 'host_name',
      defaultValue: 'ldap01.corp.example',
      description: 'Directory server hostname',
    },
    {
      name: 'base_dn',
      defaultValue: 'dc=corp,dc=example',
      description: 'Directory suffix',
    },
    {
      name: 'operator_dn',
      defaultValue: 'uid=svc-maint,ou=People,dc=corp,dc=example',
      description: 'Maintenance administrator DN',
    },
    {
      name: 'backdoor_uid',
      defaultValue: 'svc-backup',
      description: 'One account prefix shared by ordinary work and episodes',
    },
    {
      name: 'privileged_group',
      defaultValue: 'directory-admins',
      description: 'Existing privileged group',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-20T01:26:42.938437+00:00", "ecs": {"version": "8.17.0"}, "event": {"action": "ldap-add", "category": ["iam"], "kind": "event", "original": "# add 1789867602 dc=corp,dc=example uid=svc-maint,ou=People,dc=corp,dc=example IP=10.24.1.11:46066 conn=1012\ndn: uid=svc-worker-000001,ou=People,dc=corp,dc=example\nchangetype: add\nobjectClass: top\nobjectClass: person\nobjectClass: organizationalPerson\nobjectClass: inetOrgPerson\nuid: svc-worker-000001\ncn: Service Account svc-worker-000001\nsn: Service\nuserPassword: {SSHA}6W3S5Qd7mfKOi9XaQIvaLxOeyv0wMDAwMDA4Nw==\nstructuralObjectClass: inetOrgPerson\nentryUUID: 94eb35b2-ea54-4956-bd14-4f22ba691e8f\ncreatorsName: uid=svc-maint,ou=People,dc=corp,dc=example\ncreateTimestamp: 20260920012642Z\nentryCSN: 20260920012642.938437Z#000000#000#000000\nmodifiersName: uid=svc-maint,ou=People,dc=corp,dc=example\nmodifyTimestamp: 20260920012642Z\n# end add 1789867602\n\n", "outcome": "success", "type": ["creation"]}, "host": {"name": "ldap01.corp.example"}, "ldap": {"auditlog": {"actor_dn": "uid=svc-maint,ou=People,dc=corp,dc=example", "attribute": "uid", "base_dn": "dc=corp,dc=example", "change_type": "add", "connection_id": 1012, "entry_csn": "20260920012642.938437Z#000000#000#000000", "operation": null, "peer_ip": "10.24.1.11", "peer_port": 46066, "target_dn": "uid=svc-worker-000001,ou=People,dc=corp,dc=example", "value": "svc-worker-000001"}}, "related": {"ip": ["10.24.1.11"], "user": ["uid=svc-maint,ou=People,dc=corp,dc=example", "uid=svc-worker-000001,ou=People,dc=corp,dc=example"]}, "source": {"ip": "10.24.1.11", "port": 46066}, "user": {"name": "uid=svc-maint,ou=People,dc=corp,dc=example"}}`,
    },
  ],
};
