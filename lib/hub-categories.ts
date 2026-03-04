import type { LucideIcon } from 'lucide-react';
import { Cloud, Globe, Mail, Monitor, Network, Shield } from 'lucide-react';

export type CategoryId =
  | 'cloud'
  | 'email'
  | 'endpoint'
  | 'network'
  | 'security'
  | 'web-access';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'cloud',
    name: 'Cloud',
    icon: Cloud,
    description: 'AWS, Azure, and Microsoft 365',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'endpoint',
    name: 'Endpoint',
    icon: Monitor,
    description: 'Windows and Linux host telemetry',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
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
    'windows-security': 'endpoint',
    'windows-powershell': 'endpoint',
    'windows-sysmon': 'endpoint',
    'linux-auditd': 'endpoint',
    'cloud-aws-cloudtrail': 'cloud',
    'cloud-aws-vpc-flow': 'cloud',
    'cloud-azure-activity': 'cloud',
    'cloud-m365-audit': 'cloud',
    'network-cisco-asa': 'network',
    'network-checkpoint': 'network',
    'network-dns': 'network',
    'network-firewall': 'network',
    'network-fortigate': 'network',
    'network-juniper-srx': 'network',
    'network-netflow': 'network',
    'network-wireless-aruba': 'network',
    'security-suricata': 'security',
    'network-snort': 'security',
    'network-paloalto-url': 'security',
    'web-nginx': 'web-access',
    'web-apache': 'web-access',
    'proxy-zscaler': 'web-access',
    'vpn-cisco-anyconnect': 'web-access',
    'email-exchange': 'email',
    'fortinet-fortimail': 'email',
  };

  return SLUG_CATEGORY_MAP[slug] ?? 'network';
}
