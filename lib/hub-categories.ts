import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AppWindow,
  Archive,
  Boxes,
  Cloud,
  Database,
  Globe,
  KeyRound,
  Mail,
  Monitor,
  Network,
  Shield,
  Workflow,
} from 'lucide-react';

export type CategoryId =
  | 'application'
  | 'backup'
  | 'cloud'
  | 'database'
  | 'email'
  | 'identity'
  | 'messaging'
  | 'endpoint'
  | 'monitoring'
  | 'network'
  | 'security'
  | 'web-access'
  | 'virtualization';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'application',
    name: 'Application',
    icon: AppWindow,
    description: 'Business application audit logs',
    color: 'bg-lime-500/10 text-lime-600 dark:text-lime-400',
  },
  {
    id: 'backup',
    name: 'Backup',
    icon: Archive,
    description: 'Backup and recovery audit logs',
    color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    icon: Cloud,
    description: 'AWS, GCP, Azure, Microsoft 365, and Okta',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'database',
    name: 'Database',
    icon: Database,
    description: 'Database audit and query logs',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'endpoint',
    name: 'Endpoint',
    icon: Monitor,
    description: 'Windows and Linux host telemetry',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    icon: Activity,
    description: 'Infrastructure and application monitoring',
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    id: 'messaging',
    name: 'Messaging',
    icon: Workflow,
    description: 'Message broker and queue audit logs',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'identity',
    name: 'Identity',
    icon: KeyRound,
    description: 'Authentication and directory services',
    color: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    id: 'network',
    name: 'Network',
    icon: Network,
    description: 'Firewalls, routers, and wireless',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    description: 'IDS/IPS and threat detection',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    id: 'virtualization',
    name: 'Virtualization',
    icon: Boxes,
    description: 'Hypervisor and virtual infrastructure audit logs',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'web-access',
    name: 'Web & Access',
    icon: Globe,
    description: 'Web servers, proxies, and VPN',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    description: 'Email servers and security gateways',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryForSlug(slug: string): CategoryId {
  const SLUG_CATEGORY_MAP: Record<string, CategoryId> = {
    'application-1c': 'application',
    'application-1c-techjournal': 'application',
    'identity-freeradius': 'identity',
    'network-ideco-ngfw': 'network',
    'web-haproxy-http': 'web-access',
    'web-squid-access': 'web-access',
    'email-postfix': 'email',
    'application-nextcloud-audit': 'application',
    'database-oracle-unified-audit': 'database',
    'identity-openldap-auditlog': 'identity',
    'network-unbound': 'network',
    'network-powerdns-authoritative': 'network',
    'identity-freeipa-security': 'identity',
    'network-openvpn-community': 'network',
    'security-eset-protect': 'security',
    'database-mariadb-audit': 'database',
    'database-mongodb-log': 'database',
    'web-tomcat-json-access': 'web-access',
    'identity-adfs-audit': 'identity',
    'identity-aruba-clearpass': 'identity',
    'email-dovecot-imap': 'email',
    'network-cisco-wlc-9800': 'network',
    'messaging-apache-kafka-authorizer': 'messaging',
    'backup-veeam-vbr': 'backup',
    'windows-active-directory': 'identity',
    'identity-ald-pro': 'identity',
    'identity-keycloak': 'identity',
    'virtualization-vmware': 'virtualization',
    'network-zeek': 'network',
    'network-eltex-mes': 'network',
    'network-eltex-esr': 'network',
    'security-hashicorp-vault': 'security',
    'security-falco': 'security',
    'security-drweb-ess': 'security',
    'cloud-github-audit': 'cloud',
    'windows-dns-server-audit': 'network',
    'windows-dhcp-audit': 'network',
    'network-cisco-ios': 'network',
    'identity-cisco-ise': 'identity',
    'web-microsoft-iis': 'web-access',
    'network-mikrotik-routeros': 'network',
    'cloud-yandex-audit-trails': 'cloud',
    'cloud-yandex-360-audit': 'cloud',
    'identity-microsoft-nps': 'identity',
    'identity-microsoft-adcs': 'identity',
    'network-pfsense': 'network',
    'windows-security': 'endpoint',
    'windows-powershell': 'endpoint',
    'windows-sysmon': 'endpoint',
    'linux-auditd': 'endpoint',
    'linux-syslog': 'endpoint',
    'cloud-aws-cloudtrail': 'cloud',
    'cloud-aws-guardduty': 'cloud',
    'cloud-aws-vpc-flow': 'cloud',
    'cloud-azure-activity': 'cloud',
    'cloud-azure-entra-id': 'cloud',
    'cloud-gcp-audit': 'cloud',
    'cloud-m365-audit': 'cloud',
    'network-cisco-asa': 'network',
    'network-checkpoint': 'network',
    'network-dns': 'network',
    'network-firewall': 'network',
    'network-fortigate': 'network',
    'network-juniper-srx': 'network',
    'network-netflow': 'network',
    'network-wireless-aruba': 'network',
    'network-continent': 'network',
    'network-usergate': 'network',
    'security-suricata': 'security',
    'network-snort': 'security',
    'network-paloalto-traffic': 'network',
    'network-paloalto-threat': 'security',
    'network-paloalto-url': 'security',
    'web-nginx': 'web-access',
    'web-apache': 'web-access',
    'proxy-zscaler': 'web-access',
    'proxy-traefik': 'web-access',
    'vpn-cisco-anyconnect': 'web-access',
    'vpn-citrix-netscaler': 'web-access',
    'vpn-paloalto-globalprotect': 'web-access',
    'email-exchange': 'email',
    'email-kaspersky-ksmg': 'email',
    'fortinet-fortimail': 'email',
    'database-mssql-audit': 'database',
    'database-postgresql': 'database',
    'identity-okta': 'cloud',
    'kubernetes-audit': 'cloud',
    'security-waf': 'security',
    'security-crowdstrike-falcon': 'security',
    'security-kaspersky-kata': 'security',
    'security-kaspersky-ksc': 'security',
    'defender-endpoint': 'security',
    'endpoint-secret-net': 'endpoint',
    'dlp-infowatch': 'security',
    'vpn-vipnet': 'web-access',
    'proxy-kaspersky-kwts': 'web-access',
    'security-pt-nad': 'security',
    'monitoring-zabbix': 'monitoring',
  };

  return SLUG_CATEGORY_MAP[slug] ?? 'network';
}
