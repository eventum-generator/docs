import type { GeneratorMeta } from '@/lib/hub-types';

import { windowsSecurity } from './generators/windows-security';
import { networkCiscoAsa } from './generators/network-cisco-asa';
import { webNginx } from './generators/web-nginx';
import { securitySuricata } from './generators/security-suricata';
import { cloudAwsCloudtrail } from './generators/cloud-aws-cloudtrail';
import { cloudAwsGuardduty } from './generators/cloud-aws-guardduty';
import { cloudAwsVpcFlow } from './generators/cloud-aws-vpc-flow';
import { cloudAzureActivity } from './generators/cloud-azure-activity';
import { cloudAzureEntraId } from './generators/cloud-azure-entra-id';
import { cloudGcpAudit } from './generators/cloud-gcp-audit';
import { cloudM365Audit } from './generators/cloud-m365-audit';
import { windowsPowershell } from './generators/windows-powershell';
import { windowsSysmon } from './generators/windows-sysmon';
import { networkCheckpoint } from './generators/network-checkpoint';
import { networkDns } from './generators/network-dns';
import { networkFirewall } from './generators/network-firewall';
import { networkFortigate } from './generators/network-fortigate';
import { networkJuniperSrx } from './generators/network-juniper-srx';
import { networkNetflow } from './generators/network-netflow';
import { networkPaloaltoUrl } from './generators/network-paloalto-url';
import { networkSnort } from './generators/network-snort';
import { networkWirelessAruba } from './generators/network-wireless-aruba';
import { webApache } from './generators/web-apache';
import { linuxAuditd } from './generators/linux-auditd';
import { emailExchange } from './generators/email-exchange';
import { fortinetFortimail } from './generators/fortinet-fortimail';
import { vpnCiscoAnyconnect } from './generators/vpn-cisco-anyconnect';
import { databasePostgresql } from './generators/database-postgresql';
import { identityOkta } from './generators/identity-okta';
import { proxyZscaler } from './generators/proxy-zscaler';
import { securityWaf } from './generators/security-waf';

export const generators: GeneratorMeta[] = [
  windowsSecurity,
  networkCiscoAsa,
  webNginx,
  securitySuricata,
  cloudAwsCloudtrail,
  cloudAwsGuardduty,
  cloudAwsVpcFlow,
  cloudAzureActivity,
  cloudAzureEntraId,
  cloudGcpAudit,
  cloudM365Audit,
  windowsPowershell,
  windowsSysmon,
  networkCheckpoint,
  networkDns,
  networkFirewall,
  networkFortigate,
  networkJuniperSrx,
  networkNetflow,
  networkPaloaltoUrl,
  networkSnort,
  networkWirelessAruba,
  webApache,
  linuxAuditd,
  emailExchange,
  fortinetFortimail,
  vpnCiscoAnyconnect,
  proxyZscaler,
  databasePostgresql,
  identityOkta,
  securityWaf,
];
