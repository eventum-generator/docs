import type { GeneratorMeta } from '@/lib/hub-types';

export const cloudM365Audit: GeneratorMeta = {
    slug: 'cloud-m365-audit',
    displayName: 'Microsoft 365 Unified Audit Log',
    category: 'cloud',
    description:
      'Microsoft 365 Unified Audit Log — Azure AD sign-ins and MFA, Exchange mailbox activity, SharePoint/OneDrive file operations, Teams meetings and messaging, DLP alerts, and admin configuration changes.',
    format: ['JSON', 'ECS'],
    dataSource: 'Microsoft 365 Unified Audit Log',
    eventCount: 17,
    templateCount: 17,
    highlights: [
      '5 M365 workloads',
      'Session chaining',
      '8 login failure codes',
      '15 users',
    ],
    generatorId: 'm365-audit',
    eventTypes: [
      {
        id: 'UserLoggedIn',
        description: 'Successful user sign-in',
        frequency: '~20%',
        category: 'authentication',
      },
      {
        id: 'MailItemsAccessed',
        description: 'Email message accessed',
        frequency: '~15%',
        category: 'email',
      },
      {
        id: 'FileAccessed',
        description: 'File opened/viewed',
        frequency: '~15%',
        category: 'file',
      },
      {
        id: 'Send',
        description: 'Email message sent',
        frequency: '~8%',
        category: 'email',
      },
      {
        id: 'FileModified',
        description: 'File content changed',
        frequency: '~5%',
        category: 'file',
      },
      {
        id: 'UserLoginFailed',
        description: 'Failed user sign-in',
        frequency: '~5%',
        category: 'authentication',
      },
      {
        id: 'MessageSent',
        description: 'Teams chat/channel message',
        frequency: '~5%',
        category: 'web',
      },
      {
        id: 'SharingSet',
        description: 'File/folder shared',
        frequency: '~3%',
        category: 'file',
      },
      {
        id: 'FileDownloaded',
        description: 'File downloaded',
        frequency: '~3%',
        category: 'file',
      },
      {
        id: 'MeetingParticipantJoined',
        description: 'Joined a Teams meeting',
        frequency: '~3%',
        category: 'session',
      },
      {
        id: 'Add member to group',
        description: 'Add user to group/role',
        frequency: '~3%',
        category: 'iam',
      },
      {
        id: 'FileDeleted',
        description: 'File moved to recycle bin',
        frequency: '~2%',
        category: 'file',
      },
      {
        id: 'FileUploaded',
        description: 'File uploaded',
        frequency: '~2%',
        category: 'file',
      },
      {
        id: 'MailboxLogin',
        description: 'Mailbox sign-in',
        frequency: '~2%',
        category: 'authentication',
      },
      {
        id: 'Change user password',
        description: 'Password change',
        frequency: '~2%',
        category: 'iam',
      },
      {
        id: 'MemberAdded',
        description: 'Member added to team',
        frequency: '~2%',
        category: 'iam',
      },
      {
        id: 'Admin operations',
        description: 'Admin cmdlets and policies',
        frequency: '~5%',
        category: 'configuration',
      },
    ],
    realismFeatures: [
      '5 workloads — Azure AD / Entra ID, Exchange Online, SharePoint / OneDrive, Microsoft Teams, and admin operations',
      'Shared state correlations — UserLoggedIn stores sessions; MailItemsAccessed and FileAccessed reuse same user+IP',
      '8 login failure scenarios — AADSTS error codes (InvalidPassword, Locked, Disabled, MFA required, Conditional Access blocked)',
      'SharePoint site diversity — 8 sites with multiple document libraries and realistic folder paths',
      'Teams collaboration — 7 teams with 25 channels, weighted by activity',
      '15 users across 7 departments + admin and service accounts',
    ],
    parameters: [
      {
        name: 'agent_id',
        defaultValue: 'f7a1b2c3-...',
        description: 'Filebeat agent UUID',
      },
      {
        name: 'agent_version',
        defaultValue: '8.17.0',
        description: 'Elastic Agent version',
      },
      {
        name: 'error_rate',
        defaultValue: '5',
        description: 'Error injection rate (percentage, 0-100)',
      },
    ],
    sampleOutputs: [
      {
        title: 'SharePoint FileAccessed',
        json: `{
    "@timestamp": "2026-03-04T14:22:31+00:00",
    "event": {
        "action": "FileAccessed",
        "category": ["file"],
        "dataset": "o365.audit",
        "outcome": "success"
    },
    "user": {
        "email": "sarah.jones@contoso.com",
        "name": "sarah.jones"
    },
    "file": {
        "directory": "sites/Engineering/Shared Documents/Architecture",
        "name": "Architecture-Overview.docx"
    },
    "o365": {
        "audit": {
            "operation": "FileAccessed",
            "workload": "SharePoint",
            "record_type": "6"
        }
    }
}`,
      },
    ],
  };
