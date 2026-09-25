/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const emailCiscoSecureEmailGateway: GeneratorMeta = {
  slug: 'email-cisco-secure-email-gateway',
  displayName: 'Cisco Secure Email Gateway',
  category: 'email',
  description:
    'Cisco SEG native mail_logs with correlated SMTP injection and delivery, including a large outbound message.',
  dataSource: 'Cisco Secure Email Gateway mail_logs',
  format: ['JSON', 'ECS', 'mail_logs'],
  eventCount: 13,
  templateCount: 1,
  highlights: [
    'Native ICID, MID, RID, and DCID lifecycle',
    'Complete ordinary message injection and delivery cycles',
    'Large service-account message to two external recipients',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'A service account injects a large message to two external recipients; the gateway queues and completes delivery.',
  generatorId: 'seg',
  eventTypes: [
    {
      id: 'open',
      description: 'Inbound SMTP connection',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'start',
      description: 'Message ID assigned',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'sender',
      description: 'Envelope sender',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'recipient-0',
      description: 'Primary recipient',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'recipient-1',
      description: 'Second external recipient',
      frequency: 'Chain only',
      category: 'email',
    },
    {
      id: 'ready',
      description: 'Message accepted with byte count',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'antivirus',
      description: 'Negative antivirus result',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'queued',
      description: 'Queued for delivery',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'outbound',
      description: 'Outbound SMTP connection',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'delivery-start',
      description: 'Recipient delivery starts',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'icid-close',
      description: 'Inbound connection closes',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'delivery-done',
      description: 'Recipient delivery completes',
      frequency: 'Every cycle',
      category: 'email',
    },
    {
      id: 'dcid-close',
      description: 'Outbound connection closes',
      frequency: 'Every cycle',
      category: 'email',
    },
  ],
  realismFeatures: [
    'ICID and MID connect sender and recipient records',
    'MID and DCID connect queueing and delivery',
    'Structured IDs appear only when present in the raw line',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include the large outbound message cycle',
    },
    {
      name: 'host_name',
      defaultValue: 'esa-01.example.test',
      description: 'Gateway name',
    },
    {
      name: 'interface_name',
      defaultValue: 'mail.example.test',
      description: 'SMTP listener name',
    },
    {
      name: 'interface_ip',
      defaultValue: '10.20.30.25',
      description: 'SMTP interface address',
    },
    {
      name: 'suspect_sender',
      defaultValue: 'svc-backup@example.test',
      description: 'Sender in the anomalous cycle',
    },
    {
      name: 'suspect_ip',
      defaultValue: '10.20.40.77',
      description: 'Client IP in the anomalous cycle',
    },
    {
      name: 'external_domain',
      defaultValue: 'external.example.test',
      description: 'Recipient domain in the anomalous cycle',
    },
  ],
  sampleOutputs: [
    {
      title: 'Large outbound message accepted',
      json: String.raw`{
  "@timestamp": "2026-09-25T13:38:37+00:00",
  "cisco": {
    "esa": {
      "message": "MID 200257090 ready 16296275 bytes from <svc-backup@example.test>",
      "message_size": 16296275,
      "mid": 200257090
    }
  },
  "ecs": {
    "version": "8.17.0"
  },
  "email": {
    "from": {
      "address": [
        "svc-backup@example.test"
      ]
    }
  },
  "event": {
    "action": "ready",
    "category": [
      "email"
    ],
    "kind": "event",
    "original": "Fri Sep 25 13:38:37 2026 Info: MID 200257090 ready 16296275 bytes from <svc-backup@example.test>",
    "type": [
      "info"
    ]
  },
  "host": {
    "ip": [
      "10.20.30.25"
    ],
    "name": "esa-01.example.test"
  },
  "log": {
    "file": {
      "path": "mail_logs"
    },
    "level": "info"
  },
  "related": {
    "user": [
      "svc-backup@example.test"
    ]
  }
}`,
    },
  ],
};
