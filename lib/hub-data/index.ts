import { applicationOneC } from './generators/application-1c';
import { cloudAwsCloudtrail } from './generators/cloud-aws-cloudtrail';
import { cloudAwsGuardduty } from './generators/cloud-aws-guardduty';
import { cloudAwsVpcFlow } from './generators/cloud-aws-vpc-flow';
import { cloudAzureActivity } from './generators/cloud-azure-activity';
import { cloudAzureEntraId } from './generators/cloud-azure-entra-id';
import { cloudGcpAudit } from './generators/cloud-gcp-audit';
import { cloudGithubAudit } from './generators/cloud-github-audit';
import { cloudM365Audit } from './generators/cloud-m365-audit';
import { databaseMssqlAudit } from './generators/database-mssql-audit';
import { databaseMysqlAudit } from './generators/database-mysql-audit';
import { databasePostgresql } from './generators/database-postgresql';
import { databaseSapHana } from './generators/database-sap-hana';
import { dlpInfowatch } from './generators/dlp-infowatch';
import { emailExchange } from './generators/email-exchange';
import { emailKasperskyKsmg } from './generators/email-kaspersky-ksmg';
import { endpointSecretNet } from './generators/endpoint-secret-net';
import { fortinetFortimail } from './generators/fortinet-fortimail';
import { identityAldPro } from './generators/identity-ald-pro';
import { identityKeycloak } from './generators/identity-keycloak';
import { identityOkta } from './generators/identity-okta';
import { kubernetesAudit } from './generators/kubernetes-audit';
import { linuxAuditd } from './generators/linux-auditd';
import { linuxSyslog } from './generators/linux-syslog';
import { monitoringZabbix } from './generators/monitoring-zabbix';
import { networkCheckpoint } from './generators/network-checkpoint';
import { networkCiscoAsa } from './generators/network-cisco-asa';
import { networkContinent } from './generators/network-continent';
import { networkDns } from './generators/network-dns';
import { networkEltexEsr } from './generators/network-eltex-esr';
import { networkEltexMes } from './generators/network-eltex-mes';
import { networkFirewall } from './generators/network-firewall';
import { networkFortigate } from './generators/network-fortigate';
import { networkJuniperSrx } from './generators/network-juniper-srx';
import { networkNetflow } from './generators/network-netflow';
import { networkPaloaltoThreat } from './generators/network-paloalto-threat';
import { networkPaloaltoTraffic } from './generators/network-paloalto-traffic';
import { networkPaloaltoUrl } from './generators/network-paloalto-url';
import { networkSnort } from './generators/network-snort';
import { networkUsergate } from './generators/network-usergate';
import { networkWirelessAruba } from './generators/network-wireless-aruba';
import { networkZeek } from './generators/network-zeek';
import { proxyKasperskyKwts } from './generators/proxy-kaspersky-kwts';
import { proxyTraefik } from './generators/proxy-traefik';
import { proxyZscaler } from './generators/proxy-zscaler';
import { securityCrowdstrikeFalcon } from './generators/security-crowdstrike-falcon';
import { securityDefenderEndpoint } from './generators/security-defender-endpoint';
import { securityDrwebEss } from './generators/security-drweb-ess';
import { securityFalco } from './generators/security-falco';
import { securityHashicorpVault } from './generators/security-hashicorp-vault';
import { securityKasperskyKata } from './generators/security-kaspersky-kata';
import { securityKasperskyKsc } from './generators/security-kaspersky-ksc';
import { securityPtNad } from './generators/security-pt-nad';
import { securitySuricata } from './generators/security-suricata';
import { securityWaf } from './generators/security-waf';
import { virtualizationVmware } from './generators/virtualization-vmware';
import { vpnCiscoAnyconnect } from './generators/vpn-cisco-anyconnect';
import { vpnCitrixNetscaler } from './generators/vpn-citrix-netscaler';
import { vpnPaloaltoGlobalprotect } from './generators/vpn-paloalto-globalprotect';
import { vpnVipnet } from './generators/vpn-vipnet';
import { webApache } from './generators/web-apache';
import { webNginx } from './generators/web-nginx';
import { windowsActiveDirectory } from './generators/windows-active-directory';
import { windowsPowershell } from './generators/windows-powershell';
import { windowsSecurity } from './generators/windows-security';
import { windowsSysmon } from './generators/windows-sysmon';
import type { GeneratorMeta } from '@/lib/hub-types';

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
  emailKasperskyKsmg,
  fortinetFortimail,
  vpnCiscoAnyconnect,
  vpnCitrixNetscaler,
  proxyZscaler,
  databaseMssqlAudit,
  databaseMysqlAudit,
  databasePostgresql,
  databaseSapHana,
  identityOkta,
  securityWaf,
  securityCrowdstrikeFalcon,
  securityKasperskyKata,
  securityKasperskyKsc,
  securityDefenderEndpoint,
  kubernetesAudit,
  vpnPaloaltoGlobalprotect,
  vpnVipnet,
  endpointSecretNet,
  dlpInfowatch,
  proxyKasperskyKwts,
  securityPtNad,
  monitoringZabbix,
  proxyTraefik,
  networkZeek,
  identityKeycloak,
  securityHashicorpVault,
  cloudGithubAudit,
  windowsActiveDirectory,
  applicationOneC,
  securityDrwebEss,
  identityAldPro,
  networkEltexMes,
  networkEltexEsr,
  securityFalco,
  virtualizationVmware,
];
