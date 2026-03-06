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
import { networkContinent } from './generators/network-continent';
import { networkDns } from './generators/network-dns';
import { networkFirewall } from './generators/network-firewall';
import { networkFortigate } from './generators/network-fortigate';
import { networkJuniperSrx } from './generators/network-juniper-srx';
import { networkNetflow } from './generators/network-netflow';
import { networkPaloaltoTraffic } from './generators/network-paloalto-traffic';
import { networkPaloaltoThreat } from './generators/network-paloalto-threat';
import { networkPaloaltoUrl } from './generators/network-paloalto-url';
import { networkSnort } from './generators/network-snort';
import { networkUsergate } from './generators/network-usergate';
import { networkWirelessAruba } from './generators/network-wireless-aruba';
import { webApache } from './generators/web-apache';
import { linuxAuditd } from './generators/linux-auditd';
import { linuxSyslog } from './generators/linux-syslog';
import { emailExchange } from './generators/email-exchange';
import { fortinetFortimail } from './generators/fortinet-fortimail';
import { vpnCiscoAnyconnect } from './generators/vpn-cisco-anyconnect';
import { databaseMssqlAudit } from './generators/database-mssql-audit';
import { databasePostgresql } from './generators/database-postgresql';
import { identityOkta } from './generators/identity-okta';
import { proxyZscaler } from './generators/proxy-zscaler';
import { securityWaf } from './generators/security-waf';
import { securityCrowdstrikeFalcon } from './generators/security-crowdstrike-falcon';
import { securityKasperskyKata } from './generators/security-kaspersky-kata';
import { securityKasperskyKsc } from './generators/security-kaspersky-ksc';
import { defenderEndpoint } from './generators/defender-endpoint';
import { kubernetesAudit } from './generators/kubernetes-audit';
import { vpnCitrixNetscaler } from './generators/vpn-citrix-netscaler';
import { vpnPaloaltoGlobalprotect } from './generators/vpn-paloalto-globalprotect';
import { vpnVipnet } from './generators/vpn-vipnet';
import { endpointSecretNet } from './generators/endpoint-secret-net';
import { dlpInfowatch } from './generators/dlp-infowatch';
import { proxyKasperskyKwts } from './generators/proxy-kaspersky-kwts';
import { securityPtNad } from './generators/security-pt-nad';
import { monitoringZabbix } from './generators/monitoring-zabbix';

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
  networkContinent,
  networkDns,
  networkFirewall,
  networkFortigate,
  networkJuniperSrx,
  networkNetflow,
  networkPaloaltoThreat,
  networkPaloaltoTraffic,
  networkPaloaltoUrl,
  networkSnort,
  networkUsergate,
  networkWirelessAruba,
  webApache,
  linuxAuditd,
  linuxSyslog,
  emailExchange,
  fortinetFortimail,
  vpnCiscoAnyconnect,
  vpnCitrixNetscaler,
  proxyZscaler,
  databaseMssqlAudit,
  databasePostgresql,
  identityOkta,
  securityWaf,
  securityCrowdstrikeFalcon,
  securityKasperskyKata,
  securityKasperskyKsc,
  defenderEndpoint,
  kubernetesAudit,
  vpnPaloaltoGlobalprotect,
  vpnVipnet,
  endpointSecretNet,
  dlpInfowatch,
  proxyKasperskyKwts,
  securityPtNad,
  monitoringZabbix,
];
