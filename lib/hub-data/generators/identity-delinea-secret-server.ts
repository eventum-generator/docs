/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const identityDelineaSecretServer: GeneratorMeta = {
  slug: 'identity-delinea-secret-server',
  displayName: 'Delinea Secret Server CEF',
  category: 'identity',
  description:
    'Secret Server 11.3 secret-view CEF events with a five-secret access burst.',
  dataSource: 'Delinea Secret Server 11.3 CEF syslog',
  format: ['CEF', 'Syslog', 'ECS'],
  eventCount: 1,
  templateCount: 1,
  generatorId: 'identity-delinea-secret-server',
  highlights: [
    'Complete 11.3 SECRET - VIEW CEF profile',
    'All 12 reference extension fields preserved',
    'Five distinct privileged secrets viewed by one actor',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'One user views five different privileged secrets from the same IP and folder within seconds.',
  eventTypes: [
    {
      id: '10004',
      description: 'SECRET - VIEW',
      frequency: 'All events; five views per anomaly chain',
      category: 'iam',
    },
  ],
  realismFeatures: [
    'CEF header, event code and extension fields follow the complete Secret Server 11.3 reference line.',
    'Ordinary and isolated privileged views use consistent actor, secret, and folder identifiers.',
    'The profile does not claim compatibility with newer CEF variants or other event classes.',
  ],
  parameters: [
    {
      name: 'server_host',
      defaultValue: 'SECRET-SRV-01',
      description: 'Secret Server syslog host',
    },
    {
      name: 'device_version',
      defaultValue: '11.3.000001',
      description: 'Version in the validated CEF header',
    },
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable the five-view chain; false emits background only',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '80',
      description: 'Routine pairs between chains',
    },
    {
      name: 'chain_user',
      defaultValue: 'privileged-auditor',
      description: 'Linked actor username',
    },
    {
      name: 'chain_user_id',
      defaultValue: '217',
      description: 'Linked actor ID',
    },
    {
      name: 'chain_source_ip',
      defaultValue: '10.20.30.77',
      description: 'Linked actor source IP',
    },
    {
      name: 'chain_folder',
      defaultValue: 'Infrastructure',
      description: 'Folder for linked secrets',
    },
    {
      name: 'chain_folder_id',
      defaultValue: '44',
      description: 'Folder ID in the CEF message',
    },
  ],
  sampleOutputs: [
    {
      title: 'Generated secret view',
      json: String.raw`
{
  "@timestamp": "2026-09-25T14:20:22+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "secret-view",
    "category": [
      "iam"
    ],
    "code": "10004",
    "dataset": "thycotic_ss.logs",
    "kind": "event",
    "original": "Sep 25 14:20:22 SECRET-SRV-01 CEF:0|Thycotic Software|Secret Server|11.3.000001|10004|SECRET - VIEW|2|msg=[[SecretServer]] Event: [Secret] Action: [View] By User: privileged-auditor Item Name: Domain Controller Admin (Item Id: 701) Container Name: Infrastructure (Container Id: 44)  suid=217 suser=privileged-auditor cs4=Privileged Auditor cs4Label=suser Display Name src=10.20.30.77 rt=Sep 25 2026 14:20:22 fname=Domain Controller Admin fileType=Secret fileId=701 cs3Label=Folder cs3=Infrastructure",
    "type": [
      "access"
    ]
  },
  "host": {
    "name": "SECRET-SRV-01"
  },
  "observer": {
    "hostname": "SECRET-SRV-01",
    "product": "Secret Server",
    "vendor": "Thycotic Software",
    "version": "11.3.000001"
  },
  "related": {
    "hosts": [
      "SECRET-SRV-01"
    ],
    "ip": [
      "10.20.30.77"
    ],
    "user": [
      "privileged-auditor"
    ]
  },
  "source": {
    "ip": "10.20.30.77"
  },
  "thycotic_ss": {
    "cef": {
      "class_id": "10004",
      "device_version": "11.3.000001",
      "extension": {
        "cs3": "Infrastructure",
        "cs3Label": "Folder",
        "cs4": "Privileged Auditor",
        "cs4Label": "suser Display Name",
        "fileId": "701",
        "fileType": "Secret",
        "fname": "Domain Controller Admin",
        "msg": "[[SecretServer]] Event: [Secret] Action: [View] By User: privileged-auditor Item Name: Domain Controller Admin (Item Id: 701) Container Name: Infrastructure (Container Id: 44)",
        "rt": "Sep 25 2026 14:20:22",
        "src": "10.20.30.77",
        "suid": "217",
        "suser": "privileged-auditor"
      },
      "name": "SECRET - VIEW",
      "product": "Secret Server",
      "severity": 2,
      "vendor": "Thycotic Software",
      "version": 0
    },
    "event": {
      "secret": {
        "folder": "Infrastructure",
        "folder_id": "44",
        "id": "701",
        "name": "Domain Controller Admin"
      }
    }
  },
  "user": {
    "full_name": "Privileged Auditor",
    "id": "217",
    "name": "privileged-auditor"
  }
}
`,
    },
  ],
};
