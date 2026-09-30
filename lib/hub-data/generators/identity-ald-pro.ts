/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic generator addresses. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAldPro: GeneratorMeta = {
  displayName: 'ALD Pro domain controller',
  category: 'identity',
  description:
    'About 61,200 selected records/day from one domain controller, including native KDC, LDAP access and audit records.',
  dataSource: 'ALD Pro MIT KDC and 389 Directory Server',
  format: ['JSON', 'ECS'],
  highlights: [
    'Human working hours follow UTC+03:00; service accounts continue overnight',
    'LDAP negotiation, changes and restorations retain their request and actor relationships',
  ],
  anomalyChain:
    'Four-principal password spray, administrator TGT and LDAP ticket, followed by group membership and SUDO permission changes within 15 minutes. Administrators and policy resources rotate. Permissions are removed after about one hour. Default interval is 24 hours. First start is within min(interval,24h), weighted by daily activity; later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'ald-pro',
  eventTypes: [
    {
      id: 'AS_REQ NEEDED_PREAUTH / ISSUE',
      description: 'Preauthentication challenge and successful TGT issuance',
      frequency: 'Selected workload',
      category: 'authentication',
    },
    {
      id: 'TGS_REQ ISSUE',
      description: 'Service tickets using an already observed TGT',
      frequency: 'Selected workload',
      category: 'authentication',
    },
    {
      id: 'AS_REQ PREAUTH_FAILED',
      description: 'Isolated failures and periodic password spray',
      frequency: 'Selected workload',
      category: 'authentication',
    },
    {
      id: 'SSL connection, TLS, UNBIND, clean disconnect',
      description: 'Administrative LDAP sessions',
      frequency: 'Selected workload',
      category: 'iam',
    },
    {
      id: 'GSSAPI BIND / RESULT',
      description: 'Three rounds: op 0/1 return err 14, op 2 succeeds',
      frequency: 'Selected workload',
      category: 'iam',
    },
    {
      id: 'MOD / RESULT',
      description: 'Successful changes to existing groups or SUDO rules',
      frequency: 'Selected workload',
      category: 'iam',
    },
    {
      id: 'Add / delete member LDIF',
      description: 'Membership changes and restoration',
      frequency: 'Selected workload',
      category: 'iam',
    },
    {
      id: 'Replace / delete cmdCategory LDIF',
      description: 'SUDO activation and restoration',
      frequency: 'Selected workload',
      category: 'iam',
    },
    {
      id: 'Replace description LDIF',
      description: 'Ordinary policy maintenance',
      frequency: 'Selected workload',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'Human working hours follow UTC+03:00; service accounts continue overnight',
    'LDAP negotiation, changes and restorations retain their request and actor relationships',
    'Selected vendor guide profile; exact bundled versions and raw SUDO parity are unconfirmed',
  ],
  slug: 'identity-ald-pro',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 9,
  parameters: [
    {
      name: 'dc_host',
      defaultValue: 'dc-1.lab.example',
      description: 'Source hostname and LDAP service principal host',
    },
    {
      name: 'realm',
      defaultValue: 'LAB.EXAMPLE',
      description: 'Kerberos realm',
    },
    {
      name: 'base_dn',
      defaultValue: 'dc=lab,dc=example',
      description: 'Existing LDAP suffix',
    },
    {
      name: 'directory_instance',
      defaultValue: 'LAB-EXAMPLE',
      description: '389 DS instance in paths',
    },
    {
      name: 'attack_ip',
      defaultValue: '10.99.8.42',
      description: 'Client shared by ordinary activity and episodes',
    },
    {
      name: 'compromised_user',
      defaultValue: 'helpdesk.admin',
      description: 'Existing administrator shared with background',
    },
    {
      name: 'added_user',
      defaultValue: 'svc_sync',
      description: 'Existing account whose membership changes',
    },
    {
      name: 'privileged_group',
      defaultValue: 'admins',
      description: 'Existing group display name / DN component',
    },
    {
      name: 'sudo_rule',
      defaultValue: 'maintenance',
      description: 'Existing rule display name, inventory enrichment',
    },
    {
      name: 'ecs_version',
      defaultValue: '8.11.0',
      description: 'ECS version',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Periodic episodes mixed with background; false is background only',
    },
    {
      name: 'routine_admin',
      defaultValue: 'directory.admin',
      description: 'Second existing administrator',
    },
    {
      name: 'admin_ip',
      defaultValue: '10.20.4.22',
      description: 'Second ordinary administrative client',
    },
    {
      name: 'sudo_rule_uuid',
      defaultValue: 'a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae1',
      description: "Existing rule's native `ipauniqueid` RDN",
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Recurrence, values below 6 clamp to 6 hours',
    },
    {
      name: 'dc_ip',
      defaultValue: '10.20.0.10',
      description: 'Native LDAP connection destination',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{
  "@timestamp": "2026-09-20T01:03:03.401103+00:00",
  "aldpro": {
    "dirsrv": {
      "audit": {
        "attribute": "cmdCategory",
        "attribute_operation": "replace",
        "attribute_value": "all",
        "changetype": "modify",
        "dn": "ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae4,cn=sudorules,cn=sudo,dc=lab,dc=example",
        "entryusn": 100002,
        "modifiersname": "uid=directory.admin,cn=users,cn=accounts,dc=lab,dc=example",
        "modifytimestamp": "20260920010303Z",
        "object_name": "operations-3",
        "result": 0,
        "time": "20260920040303"
      }
    }
  },
  "ecs": {
    "version": "8.11.0"
  },
  "event": {
    "action": "replace-cmdCategory",
    "category": [
      "iam"
    ],
    "dataset": "aldpro.dirsrv_audit",
    "kind": "event",
    "module": "aldpro",
    "original": "time: 20260920040303\ndn: ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae4,cn=sudorules,cn=sudo,dc=lab,dc=example\nresult: 0\nchangetype: modify\nreplace: cmdCategory\ncmdCategory: all\n-\nreplace: modifiersname\nmodifiersname: uid=directory.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260920010303Z\n-\nreplace: entryusn\nentryusn: 100002\n-\n\n",
    "outcome": "success",
    "type": [
      "change"
    ]
  },
  "host": {
    "name": "dc-1.lab.example"
  },
  "log": {
    "file": {
      "path": "/var/log/dirsrv/slapd-LAB-EXAMPLE/audit"
    }
  },
  "message": "time: 20260920040303\ndn: ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae4,cn=sudorules,cn=sudo,dc=lab,dc=example\nresult: 0\nchangetype: modify\nreplace: cmdCategory\ncmdCategory: all\n-\nreplace: modifiersname\nmodifiersname: uid=directory.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260920010303Z\n-\nreplace: entryusn\nentryusn: 100002\n-\n\n",
  "related": {
    "user": [
      "directory.admin"
    ]
  },
  "source": {
    "ip": "10.20.4.22"
  },
  "user": {
    "domain": "LAB.EXAMPLE",
    "name": "directory.admin"
  }
}`,
    },
  ],
};
