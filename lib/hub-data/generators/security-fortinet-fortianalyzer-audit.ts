import type { GeneratorMeta } from '@/lib/hub-types';

export const securityFortinetFortianalyzerAudit: GeneratorMeta = {
  slug: 'security-fortinet-fortianalyzer-audit',
  displayName: 'Fortinet FortiAnalyzer Audit',
  category: 'security',
  description: 'FortiAnalyzer 7.2.4 local application incident audit messages.',
  dataSource: 'Fortinet FortiAnalyzer APPEVENT / INCIDENT',
  format: ['KV', 'ECS'],
  eventCount: 5,
  templateCount: 1,
  highlights: [
    'Fortinet 7.2.4 incident action IDs and fields',
    'Shared incident ID across evidence and incident deletions',
    'Separate background-only mode',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'A high-severity incident gains an attachment; another account deletes the attachment and incident seconds later.',
  generatorId: 'faz',
  eventTypes: [
    {
      id: '100001',
      description: 'Incident created',
      frequency: '35 background weight',
      category: 'incident audit',
    },
    {
      id: '100002',
      description: 'Incident updated',
      frequency: '50 background weight',
      category: 'incident audit',
    },
    {
      id: '100005',
      description: 'Attachment added',
      frequency: '15 background weight',
      category: 'incident audit',
    },
    {
      id: '100006',
      description: 'Attachment deleted',
      frequency: 'Anomaly only',
      category: 'incident audit',
    },
    {
      id: '100003',
      description: 'Incident deleted',
      frequency: 'Anomaly only',
      category: 'incident audit',
    },
  ],
  realismFeatures: [
    'Fortinet 7.2.4 documented APPEVENT key-value layout and incident catalog',
    'Synthetic incident identifiers shared within each sequence',
    'Local KV application audit, not KUMA CEF forwarding or an OOTB parser compatibility claim',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Enable incident suppression sequence.',
    },
    {
      name: 'anomaly_interval_events',
      defaultValue: '60',
      description: 'Background records before each sequence.',
    },
    {
      name: 'analyzer_id',
      defaultValue: 'FAZ-VM-LAB-01',
      description: 'Synthetic FortiAnalyzer identifier.',
    },
    {
      name: 'adom',
      defaultValue: 'root',
      description: 'Administrative domain.',
    },
    {
      name: 'suspicious_analyst',
      defaultValue: 'audit_admin',
      description: 'Account deleting evidence and incident.',
    },
    {
      name: 'incident_prefix',
      defaultValue: 'INC-2026',
      description: 'Synthetic incident ID prefix.',
    },
  ],
  sampleOutputs: [
    {
      title: 'FortiAnalyzer incident attachment deletion',
      json: String.raw`{
  "@timestamp": "2026-09-25T14:32:20+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "Incident_Attachment_Delete",
    "code": "100006",
    "dataset": "fortinet.fortianalyzer.appevent",
    "kind": "event",
    "original": "id=6826113487000000063 itime=2026-09-25 14:32:19 vd=root logid=100006 type=appevent subtype=incident level=information date=2026-09-25 time=14:32:20 user=audit_admin desc=Incident_Attachment_Delete msg=Attachment deleted from incident INC-2026-9000001 incident_id=INC-2026-9000001 incident_severity=high attachment=evidence-INC-2026-9000001.json adom=root devid=FAZ-VM-LAB-01 dtime=2026-09-25 14:32:19 itime_t=1790346739",
    "type": [
      "deletion"
    ]
  },
  "fortinet": {
    "fortianalyzer": {
      "adom": "root",
      "attachment": "evidence-INC-2026-9000001.json",
      "desc": "Incident_Attachment_Delete",
      "incident_id": "INC-2026-9000001",
      "incident_severity": "high",
      "logid": "100006",
      "subtype": "incident",
      "type": "appevent"
    }
  },
  "observer": {
    "name": "FAZ-VM-LAB-01",
    "product": "FortiAnalyzer",
    "vendor": "Fortinet"
  },
  "related": {
    "user": [
      "audit_admin"
    ]
  },
  "user": {
    "name": "audit_admin"
  }
}`,
    },
  ],
};
