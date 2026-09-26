/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityAldPro: GeneratorMeta = {
  slug: 'identity-ald-pro',
  displayName: 'ALD Pro Domain Controller',
  category: 'identity',
  description:
    'ALD Pro KDC and 389 Directory Server native records with complete GSSAPI sessions, visible permission restoration and recurring daily spray sequences.',
  format: ['JSON', 'ECS'],
  dataSource: 'Selected dated ALD Pro MIT KDC and 389 DS native-file profile',
  eventCount: 15,
  templateCount: 1,
  highlights: [
    'Native KDC, access and LDIF audit records',
    'TGT-to-service-ticket-to-LDAP correlation',
    'Daily sequences with visible rights restoration',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Every 24 hours, four principals fail authentication one minute apart; an administrator then receives a TGT and its LDAP service ticket. A fresh TLS/GSSAPI connection adds an existing account to a privileged group and activates an existing dormant SUDO rule with cmdCategory all. Visible removal/category deletion follows after at least an hour. Eligibility waits for restoration, with no catch-up burst. All classes and administrators also occur in background.',
  generatorId: 'ald-pro',
  eventTypes: [
    {
      id: 'AS_REQ ISSUE',
      description: 'Issue a TGT to the selected principal',
      frequency:
        'Frequent ordinary issuance and one episode administrator ticket',
      category: 'authentication',
    },
    {
      id: 'TGS_REQ ISSUE',
      description: 'Issue a service ticket from an observed TGT',
      frequency: 'Frequent ordinary tickets and LDAP ticket before bind',
      category: 'authentication',
    },
    {
      id: 'AS_REQ PREAUTH_FAILED',
      description: 'Failed principal preauthentication',
      frequency: 'Isolated ordinary failures; four-principal episode spray',
      category: 'authentication',
    },
    {
      id: 'SSL connection',
      description: 'Open a fresh direct LDAP connection',
      frequency: 'Every selected LDAP session',
      category: 'network',
    },
    {
      id: 'TLS',
      description: 'Negotiate the selected protected LDAP connection',
      frequency: 'Every selected LDAP session',
      category: 'network',
    },
    {
      id: 'BIND',
      description: 'Request the next GSSAPI negotiation round',
      frequency: 'Three rounds per selected LDAP session',
      category: 'authentication',
    },
    {
      id: 'BIND RESULT',
      description: 'Return err 14 twice then err 0',
      frequency: 'Three matching results per selected LDAP session',
      category: 'authentication',
    },
    {
      id: 'MOD',
      description: 'Modify an existing group or SUDO rule',
      frequency: 'Ordinary activation/restoration and episode changes',
      category: 'iam',
    },
    {
      id: 'MOD RESULT',
      description: 'Successful matching directory modification result',
      frequency: 'One per modeled modification',
      category: 'iam',
    },
    {
      id: 'UNBIND',
      description: 'End the selected authenticated LDAP session',
      frequency: 'Every selected LDAP session',
      category: 'authentication',
    },
    {
      id: 'Disconnect',
      description: 'Close the existing connection cleanly',
      frequency: 'Every selected LDAP session',
      category: 'network',
    },
    {
      id: 'audit add: member',
      description: 'Add a currently absent group member',
      frequency: 'Ordinary activation and one per episode',
      category: 'iam',
    },
    {
      id: 'audit delete: member',
      description: 'Remove the existing group member',
      frequency: 'Visible ordinary restoration',
      category: 'iam',
    },
    {
      id: 'audit replace: cmdCategory',
      description: 'Set all on the existing dormant SUDO rule',
      frequency: 'Ordinary activation and one per episode',
      category: 'iam',
    },
    {
      id: 'audit delete: cmdCategory',
      description: 'Delete the existing all category',
      frequency: 'Visible ordinary restoration',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'The vendor SIEM guide is dated 06/10/2025 and contains 2023/2024 captures without installed build identifiers. Tagged upstream sources support selected semantics without asserting ALD package versions.',
    'Service ticket authtime comes from an observed TGT. Fresh LDAP connections include TLS, all three GSSAPI rounds, MOD/result/audit, UNBIND and disconnect with matching actor, target and operation.',
    'One existing group/member and enabled dormant SUDO rule use actual modeled before-state. Native rule RDN is ipauniqueid UUID; explicit allowed commands are absent before cmdCategory all.',
    'Rights change only on successful native RESULT. Visible member/category deletion occurs after a one-hour hold; new activations stop when needed so restoration and due episodes cannot starve.',
    'Thirty records per minute use a bounded eighteen-record LDAP trace. Access retains fractional UTC time; KDC/LDIF retain seconds, so interleaved audit timestamps may precede an access result by less than a second.',
    'The selected map covers 38 native fields. Exact ALD build, SUDO native capture and live parser fidelity remain unconfirmed. Connection/display-name enrichment, rates and timing distributions are explicit scenario choices.',
  ],
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
      title: 'Existing SUDO rule activated after successful MOD',
      json: String.raw`{
  "@timestamp": "2026-09-27T01:05:00+00:00",
  "aldpro": {
    "dirsrv": {
      "audit": {
        "attribute": "cmdCategory",
        "attribute_operation": "replace",
        "attribute_value": "all",
        "changetype": "modify",
        "dn": "ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae1,cn=sudorules,cn=sudo,dc=lab,dc=example",
        "entryusn": 100084,
        "modifiersname": "uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example",
        "modifytimestamp": "20260927010500Z",
        "object_name": "maintenance",
        "result": 0,
        "time": "20260927010500"
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
    "original": "time: 20260927010500\ndn: ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae1,cn=sudorules,cn=sudo,dc=lab,dc=example\nresult: 0\nchangetype: modify\nreplace: cmdCategory\ncmdCategory: all\n-\nreplace: modifiersname\nmodifiersname: uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260927010500Z\n-\nreplace: entryusn\nentryusn: 100084\n-\n\n",
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
  "message": "time: 20260927010500\ndn: ipauniqueid=a4a19e36-4c0c-4d2f-97aa-e7fe42aa6ae1,cn=sudorules,cn=sudo,dc=lab,dc=example\nresult: 0\nchangetype: modify\nreplace: cmdCategory\ncmdCategory: all\n-\nreplace: modifiersname\nmodifiersname: uid=helpdesk.admin,cn=users,cn=accounts,dc=lab,dc=example\n-\nreplace: modifytimestamp\nmodifytimestamp: 20260927010500Z\n-\nreplace: entryusn\nentryusn: 100084\n-\n\n",
  "related": {
    "user": [
      "helpdesk.admin"
    ]
  },
  "user": {
    "domain": "LAB.EXAMPLE",
    "name": "helpdesk.admin"
  }
}`,
    },
  ],
};
