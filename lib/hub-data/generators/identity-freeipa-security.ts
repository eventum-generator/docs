/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic addresses document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityFreeipaSecurity: GeneratorMeta = {
  slug: 'identity-freeipa-security',
  displayName: 'FreeIPA Directory Server Security',
  category: 'identity',
  description:
    '389 Directory Server JSON security-log binds from a FreeIPA deployment, including a privileged failed-to-success sequence.',
  dataSource: 'FreeIPA / 389 DS security log',
  format: ['JSON', 'ECS'],
  eventCount: 2,
  templateCount: 1,
  highlights: [
    'Native 389 DS security JSON in event.original',
    'Distinct LDAP connection IDs',
    'Privileged bind correlation',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'Three failed Directory Manager binds from one IP are followed by a successful bind.',
  generatorId: 'freeipa',
  eventTypes: [
    {
      id: 'BIND_SUCCESS',
      description: 'LDAP simple bind accepted',
      frequency: 'About 90% of routine binds',
      category: 'authentication',
    },
    {
      id: 'BIND_FAILED',
      description: 'LDAP simple bind rejected',
      frequency: 'About 10% of routine binds',
      category: 'authentication',
    },
  ],
  realismFeatures: [
    'Documented security-log keys and bind outcomes',
    'Separate increasing connection IDs',
    'Single client IP and root DN link the chain',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include privileged failed-to-success chain',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine events between chains',
    },
    {
      name: 'server_host',
      defaultValue: 'ipa-01.example.test',
      description: 'Directory Server host',
    },
    {
      name: 'server_ip',
      defaultValue: '10.20.0.10',
      description: 'Directory Server address',
    },
    {
      name: 'suspicious_ip',
      defaultValue: '198.51.100.77',
      description: 'Chain client address',
    },
    {
      name: 'directory_suffix',
      defaultValue: 'dc=example,dc=test',
      description: 'Routine user DN suffix',
    },
  ],
  sampleOutputs: [
    {
      title: 'FreeIPA Directory Server Security anomaly event',
      json: String.raw`{"@timestamp": "2026-09-25T12:37:44+00:00", "ecs": {"version": "8.17.0"}, "event": {"kind": "event", "module": "freeipa", "dataset": "freeipa.security", "action": "bind_success", "category": ["authentication"], "type": ["start"], "outcome": "success", "original": "{\"date\":\"[25/Sep/2026:12:37:44.000000000 +0000]\",\"utc_time\":\"1790339864.000000000\",\"event\":\"BIND_SUCCESS\",\"dn\":\"cn=Directory Manager\",\"bind_method\":\"SIMPLE\",\"root_dn\":true,\"client_ip\":\"198.51.100.77\",\"server_ip\":\"10.20.0.10\",\"ldap_version\":3,\"conn_id\":83,\"op_id\":0,\"msg\":\"\"}"}, "host": {"name": "ipa-01.example.test", "ip": ["10.20.0.10"]}, "source": {"ip": "198.51.100.77"}, "user": {"name": "cn=Directory Manager"}, "freeipa": {"security": {"event": "BIND_SUCCESS", "dn": "cn=Directory Manager", "bind_method": "SIMPLE", "root_dn": true, "conn_id": 83, "op_id": 0, "msg": ""}}}`,
    },
  ],
};
