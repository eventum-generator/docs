import type { GeneratorMeta } from '@/lib/hub-types';

export const emailKasperskyKsmg: GeneratorMeta = {
    slug: 'email-kaspersky-ksmg',
    displayName: 'Kaspersky Secure Mail Gateway',
    category: 'email',
    description:
      'Kaspersky Secure Mail Gateway (KSMG) ScanLogic events — anti-virus, anti-spam, anti-phishing, content filtering, mail authentication (SPF/DKIM/DMARC), KATA integration, message backup, and scan failure events in ECS-compatible JSON.',
    format: ['JSON', 'ECS'],
    dataSource: 'Kaspersky Secure Mail Gateway ScanLogic',
    eventCount: 8,
    templateCount: 3,
    highlights: [
      '6 scan modules (AV, AS, AP, CF, MA, KATA)',
      'Weighted outcome distributions per module',
      'SPF/DKIM/DMARC authentication checks',
      'Quarantine and scan failure events',
    ],
    generatorId: 'email-kaspersky-ksmg',
    eventTypes: [
      {
        id: 'av-scan',
        description: 'Anti-Virus scan results (clean, infected, disinfected, encrypted)',
        frequency: '25%',
        category: 'email',
      },
      {
        id: 'as-scan',
        description: 'Anti-Spam scan results (clean, spam, probable spam, mass mail)',
        frequency: '25%',
        category: 'email',
      },
      {
        id: 'ap-scan',
        description: 'Anti-Phishing scan results (clean, phishing, malicious links)',
        frequency: '15%',
        category: 'email',
      },
      {
        id: 'ma-auth',
        description: 'Mail Authentication checks (SPF/DKIM/DMARC)',
        frequency: '15%',
        category: 'email',
      },
      {
        id: 'cf-filter',
        description: 'Content Filtering (banned files, size violations)',
        frequency: '10%',
        category: 'email',
      },
      {
        id: 'kt-kata',
        description: 'KATA integration (APT/zero-day detection)',
        frequency: '4%',
        category: 'email',
      },
      {
        id: 'message-backup',
        description: 'Message quarantine events',
        frequency: '4%',
        category: 'email',
      },
      {
        id: 'not-processed',
        description: 'Scan failure events (errors, timeouts)',
        frequency: '2%',
        category: 'email',
      },
    ],
    realismFeatures: [
      'Weighted scan outcomes per module — e.g., AV: 93.5% clean, 3% infected, 1% disinfected, 2% encrypted',
      'Directional email flow — 72% inbound from external domains, 28% outbound from internal users',
      'Lognormal message sizes with realistic distribution (500 B to 30 MB)',
      'Categorized subjects tied to scan type — spam/phishing subjects for AS/AP, business subjects for others',
      'Threat database with realistic Kaspersky detection names (Trojan, Exploit, Ransomware, Stealer)',
      'Processing rule engine with weighted rule selection and configurable actions',
    ],
    parameters: [
      {
        name: 'ksmg_hostname',
        defaultValue: 'ksmg-node01',
        description: 'KSMG gateway hostname',
      },
      {
        name: 'ksmg_ip',
        defaultValue: '10.1.0.20',
        description: 'KSMG gateway IP address',
      },
      {
        name: 'domain',
        defaultValue: 'corp.example.com',
        description: 'Organization email domain',
      },
      {
        name: 'ksmg_version',
        defaultValue: '2.0.1.6960',
        description: 'KSMG software version',
      },
      {
        name: 'agent_id',
        defaultValue: 'c4d5e6f7-...',
        description: 'Elastic Agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
    ],
    sampleOutputs: [
      {
        title: 'Anti-Virus Scan — Infected',
        json: `{
    "@timestamp": "2026-03-06T14:22:31.000Z",
    "event": {
        "kind": "event",
        "category": ["email"],
        "type": ["info"],
        "action": "scan-result",
        "outcome": "failure",
        "severity": 7,
        "reason": "ThreatDetected"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Secure Mail Gateway",
        "version": "2.0.1.6960",
        "hostname": "ksmg-node01",
        "ip": ["10.1.0.20"]
    },
    "email": {
        "direction": "inbound",
        "from": { "address": ["jdoe@partner-corp.com"] },
        "to": { "address": ["d.brown@corp.example.com"] },
        "subject": "Updated invoice attached"
    },
    "kaspersky": {
        "ksmg": {
            "event_class": "LMS_EV_SCAN_LOGIC_AV_STATUS",
            "scan_type": "av",
            "status": "Infected",
            "action": "Reject",
            "threat_name": "HEUR:Trojan.Script.Generic",
            "threat_file": "invoice_2024.pdf.exe"
        }
    }
}`,
      },
      {
        title: 'Anti-Spam Scan — Spam Detected',
        json: `{
    "@timestamp": "2026-03-06T14:23:05.000Z",
    "event": {
        "kind": "event",
        "category": ["email"],
        "type": ["info"],
        "action": "scan-result",
        "outcome": "failure",
        "severity": 5,
        "reason": "SpamDetected"
    },
    "observer": {
        "vendor": "Kaspersky",
        "product": "Secure Mail Gateway",
        "version": "2.0.1.6960"
    },
    "email": {
        "direction": "inbound",
        "from": { "address": ["promo@deals-now.biz"] },
        "to": { "address": ["a.smith@corp.example.com"] },
        "subject": "Limited time offer - act now!"
    },
    "kaspersky": {
        "ksmg": {
            "event_class": "LMS_EV_SCAN_LOGIC_AS_STATUS",
            "scan_type": "as",
            "status": "Spam",
            "action": "Reject"
        }
    }
}`,
      },
    ],
  };
