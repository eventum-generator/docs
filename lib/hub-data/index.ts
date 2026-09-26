import { applicationOneC } from './generators/application-1c';
import { applicationOneCTechjournal } from './generators/application-1c-techjournal';
import { applicationNextcloudAudit } from './generators/application-nextcloud-audit';
import { backupVeeamVbr } from './generators/backup-veeam-vbr';
import { cloudAwsCloudtrail } from './generators/cloud-aws-cloudtrail';
import { cloudAwsGuardduty } from './generators/cloud-aws-guardduty';
import { cloudAwsVpcFlow } from './generators/cloud-aws-vpc-flow';
import { cloudAzureActivity } from './generators/cloud-azure-activity';
import { cloudAzureEntraId } from './generators/cloud-azure-entra-id';
import { cloudGcpAudit } from './generators/cloud-gcp-audit';
import { cloudGithubAudit } from './generators/cloud-github-audit';
import { cloudM365Audit } from './generators/cloud-m365-audit';
import { cloudYandex360Audit } from './generators/cloud-yandex-360-audit';
import { cloudYandexAuditTrails } from './generators/cloud-yandex-audit-trails';
import { databaseMssqlAudit } from './generators/database-mssql-audit';
import { databaseMysqlAudit } from './generators/database-mysql-audit';
import { databaseOracleUnifiedAudit } from './generators/database-oracle-unified-audit';
import { databasePostgresql } from './generators/database-postgresql';
import { databaseSapHana } from './generators/database-sap-hana';
import { dlpInfowatch } from './generators/dlp-infowatch';
import { emailExchange } from './generators/email-exchange';
import { emailKasperskyKsmg } from './generators/email-kaspersky-ksmg';
import { emailPostfix } from './generators/email-postfix';
import { endpointSecretNet } from './generators/endpoint-secret-net';
import { fortinetFortimail } from './generators/fortinet-fortimail';
import { identityAldPro } from './generators/identity-ald-pro';
import { identityCiscoIse } from './generators/identity-cisco-ise';
import { identityFreeradius } from './generators/identity-freeradius';
import { identityKeycloak } from './generators/identity-keycloak';
import { identityMicrosoftAdcs } from './generators/identity-microsoft-adcs';
import { identityMicrosoftNps } from './generators/identity-microsoft-nps';
import { identityOkta } from './generators/identity-okta';
import { identityOpenldapAuditlog } from './generators/identity-openldap-auditlog';
import { kubernetesAudit } from './generators/kubernetes-audit';
import { linuxAuditd } from './generators/linux-auditd';
import { linuxSyslog } from './generators/linux-syslog';
import { monitoringZabbix } from './generators/monitoring-zabbix';
import { networkCheckpoint } from './generators/network-checkpoint';
import { networkCiscoAsa } from './generators/network-cisco-asa';
import { networkCiscoIos } from './generators/network-cisco-ios';
import { networkContinent } from './generators/network-continent';
import { networkDns } from './generators/network-dns';
import { networkEltexEsr } from './generators/network-eltex-esr';
import { networkEltexMes } from './generators/network-eltex-mes';
import { networkFirewall } from './generators/network-firewall';
import { networkFortigate } from './generators/network-fortigate';
import { networkIdecoNgfw } from './generators/network-ideco-ngfw';
import { networkJuniperSrx } from './generators/network-juniper-srx';
import { networkMikrotikRouteros } from './generators/network-mikrotik-routeros';
import { networkNetflow } from './generators/network-netflow';
import { networkPaloaltoThreat } from './generators/network-paloalto-threat';
import { networkPaloaltoTraffic } from './generators/network-paloalto-traffic';
import { networkPaloaltoUrl } from './generators/network-paloalto-url';
import { networkPfsense } from './generators/network-pfsense';
import { networkPowerdnsAuthoritative } from './generators/network-powerdns-authoritative';
import { networkSnort } from './generators/network-snort';
import { networkUnbound } from './generators/network-unbound';
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
import { webHaproxyHttp } from './generators/web-haproxy-http';
import { webMicrosoftIis } from './generators/web-microsoft-iis';
import { webNginx } from './generators/web-nginx';
import { webSquidAccess } from './generators/web-squid-access';
import { windowsActiveDirectory } from './generators/windows-active-directory';
import { windowsDhcpAudit } from './generators/windows-dhcp-audit';
import { windowsDnsServerAudit } from './generators/windows-dns-server-audit';
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
  windowsDnsServerAudit,
  windowsDhcpAudit,
  networkCiscoIos,
  identityCiscoIse,
  webMicrosoftIis,
  networkMikrotikRouteros,
  backupVeeamVbr,
  cloudYandexAuditTrails,
  cloudYandex360Audit,
  identityMicrosoftAdcs,
  identityMicrosoftNps,
  networkPfsense,
  applicationOneCTechjournal,
  identityFreeradius,
  networkIdecoNgfw,
  webHaproxyHttp,
  webSquidAccess,
  emailPostfix,
  applicationNextcloudAudit,
  databaseOracleUnifiedAudit,
  identityOpenldapAuditlog,
  networkUnbound,
  networkPowerdnsAuthoritative,
];
