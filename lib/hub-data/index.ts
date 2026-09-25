import { applicationOneC } from './generators/application-1c';
import { applicationOneCTechjournal } from './generators/application-1c-techjournal';
import { applicationCiscoCucmAudit } from './generators/application-cisco-cucm-audit';
import { applicationNextcloudAudit } from './generators/application-nextcloud-audit';
import { applicationSharepointServerUls } from './generators/application-sharepoint-server-uls';
import { backupVeeamVbr } from './generators/backup-veeam-vbr';
import { cloudAwsCloudtrail } from './generators/cloud-aws-cloudtrail';
import { cloudAwsGuardduty } from './generators/cloud-aws-guardduty';
import { cloudAwsVpcFlow } from './generators/cloud-aws-vpc-flow';
import { cloudAzureActivity } from './generators/cloud-azure-activity';
import { cloudAzureEntraId } from './generators/cloud-azure-entra-id';
import { cloudGcpAudit } from './generators/cloud-gcp-audit';
import { cloudGithubAudit } from './generators/cloud-github-audit';
import { cloudM365Audit } from './generators/cloud-m365-audit';
import { cloudNetskopeCasb } from './generators/cloud-netskope-casb';
import { cloudYandex360Audit } from './generators/cloud-yandex-360-audit';
import { cloudYandexAuditTrails } from './generators/cloud-yandex-audit-trails';
import { databaseApacheCassandraAudit } from './generators/database-apache-cassandra-audit';
import { databaseMariadbAudit } from './generators/database-mariadb-audit';
import { databaseMongodbLog } from './generators/database-mongodb-log';
import { databaseMssqlAudit } from './generators/database-mssql-audit';
import { databaseMysqlAudit } from './generators/database-mysql-audit';
import { databaseOracleUnifiedAudit } from './generators/database-oracle-unified-audit';
import { databasePostgresql } from './generators/database-postgresql';
import { databaseSapHana } from './generators/database-sap-hana';
import { dlpInfowatch } from './generators/dlp-infowatch';
import { emailCiscoSecureEmailGateway } from './generators/email-cisco-secure-email-gateway';
import { emailDovecotImap } from './generators/email-dovecot-imap';
import { emailExchange } from './generators/email-exchange';
import { emailKasperskyKlms } from './generators/email-kaspersky-klms';
import { emailKasperskyKsmg } from './generators/email-kaspersky-ksmg';
import { emailPostfix } from './generators/email-postfix';
import { endpointSecretNet } from './generators/endpoint-secret-net';
import { fortinetFortimail } from './generators/fortinet-fortimail';
import { identityAdfsAudit } from './generators/identity-adfs-audit';
import { identityAldPro } from './generators/identity-ald-pro';
import { identityArubaClearpass } from './generators/identity-aruba-clearpass';
import { identityCiscoIse } from './generators/identity-cisco-ise';
import { identityDelineaSecretServer } from './generators/identity-delinea-secret-server';
import { identityFortinetFortipam } from './generators/identity-fortinet-fortipam';
import { identityFreeipaSecurity } from './generators/identity-freeipa-security';
import { identityFreeradius } from './generators/identity-freeradius';
import { identityKeycloak } from './generators/identity-keycloak';
import { identityMicrosoftAdcs } from './generators/identity-microsoft-adcs';
import { identityMicrosoftNps } from './generators/identity-microsoft-nps';
import { identityNetwrixAuditorCef } from './generators/identity-netwrix-auditor-cef';
import { identityOkta } from './generators/identity-okta';
import { identityOpenldapAuditlog } from './generators/identity-openldap-auditlog';
import { kubernetesAudit } from './generators/kubernetes-audit';
import { linuxAuditd } from './generators/linux-auditd';
import { linuxSyslog } from './generators/linux-syslog';
import { messagingApacheKafkaAuthorizer } from './generators/messaging-apache-kafka-authorizer';
import { monitoringZabbix } from './generators/monitoring-zabbix';
import { networkBind9Query } from './generators/network-bind9-query';
import { networkCheckpoint } from './generators/network-checkpoint';
import { networkCiscoAsa } from './generators/network-cisco-asa';
import { networkCiscoFtd } from './generators/network-cisco-ftd';
import { networkCiscoIos } from './generators/network-cisco-ios';
import { networkCiscoWlc9800 } from './generators/network-cisco-wlc-9800';
import { networkContinent } from './generators/network-continent';
import { networkDns } from './generators/network-dns';
import { networkEltexEsr } from './generators/network-eltex-esr';
import { networkEltexMes } from './generators/network-eltex-mes';
import { networkFirewall } from './generators/network-firewall';
import { networkFortigate } from './generators/network-fortigate';
import { networkFortinetFortiadc } from './generators/network-fortinet-fortiadc';
import { networkIdecoNgfw } from './generators/network-ideco-ngfw';
import { networkJuniperSrx } from './generators/network-juniper-srx';
import { networkKasperskyNgfw } from './generators/network-kaspersky-ngfw';
import { networkKempLoadmaster } from './generators/network-kemp-loadmaster';
import { networkKerioControl } from './generators/network-kerio-control';
import { networkMikrotikRouteros } from './generators/network-mikrotik-routeros';
import { networkNetflow } from './generators/network-netflow';
import { networkOpenvpnCommunity } from './generators/network-openvpn-community';
import { networkPaloaltoThreat } from './generators/network-paloalto-threat';
import { networkPaloaltoTraffic } from './generators/network-paloalto-traffic';
import { networkPaloaltoUrl } from './generators/network-paloalto-url';
import { networkPfsense } from './generators/network-pfsense';
import { networkPowerdnsAuthoritative } from './generators/network-powerdns-authoritative';
import { networkSnort } from './generators/network-snort';
import { networkSonicwallTz } from './generators/network-sonicwall-tz';
import { networkSophosFirewall } from './generators/network-sophos-firewall';
import { networkStormshieldSns } from './generators/network-stormshield-sns';
import { networkUnbound } from './generators/network-unbound';
import { networkUsergate } from './generators/network-usergate';
import { networkVmwareNsxManager } from './generators/network-vmware-nsx-manager';
import { networkWatchguardFirebox } from './generators/network-watchguard-firebox';
import { networkWirelessAruba } from './generators/network-wireless-aruba';
import { networkZeek } from './generators/network-zeek';
import { proxyCiscoSecureWebAppliance } from './generators/proxy-cisco-secure-web-appliance';
import { proxyKasperskyKwts } from './generators/proxy-kaspersky-kwts';
import { proxySolarWebproxy } from './generators/proxy-solar-webproxy';
import { proxyTraefik } from './generators/proxy-traefik';
import { proxyZscaler } from './generators/proxy-zscaler';
import { securityCarbonBlackEdrEventForwarder } from './generators/security-carbon-black-edr-event-forwarder';
import { securityCiscoFmcAudit } from './generators/security-cisco-fmc-audit';
import { securityCrowdstrikeFalcon } from './generators/security-crowdstrike-falcon';
import { securityCyberarkPta } from './generators/security-cyberark-pta';
import { securityDefenderEndpoint } from './generators/security-defender-endpoint';
import { securityDrwebEss } from './generators/security-drweb-ess';
import { securityEsetProtect } from './generators/security-eset-protect';
import { securityFalco } from './generators/security-falco';
import { securityFortinetFortisoar } from './generators/security-fortinet-fortisoar';
import { securityHashicorpVault } from './generators/security-hashicorp-vault';
import { securityImpervaSecuresphere } from './generators/security-imperva-securesphere';
import { securityKasperskyCybertrace } from './generators/security-kaspersky-cybertrace';
import { securityKasperskyKata } from './generators/security-kaspersky-kata';
import { securityKasperskyKics4net } from './generators/security-kaspersky-kics4net';
import { securityKasperskyKsc } from './generators/security-kaspersky-ksc';
import { securityPtNad } from './generators/security-pt-nad';
import { securitySophosCentral } from './generators/security-sophos-central';
import { securityStaffcopEnterprise } from './generators/security-staffcop-enterprise';
import { securitySuricata } from './generators/security-suricata';
import { securitySymantecSepm } from './generators/security-symantec-sepm';
import { securityTrendmicroDeepSecurity } from './generators/security-trendmicro-deep-security';
import { securityWaf } from './generators/security-waf';
import { storageNetappOntapEms } from './generators/storage-netapp-ontap-ems';
import { virtualizationMicrosoftHypervVmms } from './generators/virtualization-microsoft-hyperv-vmms';
import { virtualizationProxmoxVe } from './generators/virtualization-proxmox-ve';
import { virtualizationVmware } from './generators/virtualization-vmware';
import { virtualizationVmwareEsxiHostd } from './generators/virtualization-vmware-esxi-hostd';
import { vpnCiscoAnyconnect } from './generators/vpn-cisco-anyconnect';
import { vpnCitrixNetscaler } from './generators/vpn-citrix-netscaler';
import { vpnPaloaltoGlobalprotect } from './generators/vpn-paloalto-globalprotect';
import { vpnSTerraGate } from './generators/vpn-s-terra-gate';
import { vpnVipnet } from './generators/vpn-vipnet';
import { webApache } from './generators/web-apache';
import { webAtlassianJiraSecurity } from './generators/web-atlassian-jira-security';
import { webF5AdvancedWaf } from './generators/web-f5-advanced-waf';
import { webHaproxyHttp } from './generators/web-haproxy-http';
import { webMicrosoftIis } from './generators/web-microsoft-iis';
import { webNginx } from './generators/web-nginx';
import { webSquidAccess } from './generators/web-squid-access';
import { webTomcatJsonAccess } from './generators/web-tomcat-json-access';
import { windowsActiveDirectory } from './generators/windows-active-directory';
import { windowsAppLocker } from './generators/windows-applocker';
import { windowsDhcpAudit } from './generators/windows-dhcp-audit';
import { windowsDnsServerAudit } from './generators/windows-dns-server-audit';
import { windowsGroupPolicyOperational } from './generators/windows-group-policy-operational';
import { windowsPowershell } from './generators/windows-powershell';
import { windowsRdpSessionOperational } from './generators/windows-rdp-session-operational';
import { windowsSecurity } from './generators/windows-security';
import { windowsSysmon } from './generators/windows-sysmon';
import { windowsTaskSchedulerOperational } from './generators/windows-task-scheduler-operational';
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
  identityFreeipaSecurity,
  networkOpenvpnCommunity,
  securityEsetProtect,
  databaseMariadbAudit,
  databaseMongodbLog,
  webTomcatJsonAccess,
  identityAdfsAudit,
  identityArubaClearpass,
  emailDovecotImap,
  networkCiscoWlc9800,
  messagingApacheKafkaAuthorizer,
  emailKasperskyKlms,
  networkKasperskyNgfw,
  securitySophosCentral,
  windowsAppLocker,
  windowsGroupPolicyOperational,
  windowsTaskSchedulerOperational,
  windowsRdpSessionOperational,
  virtualizationVmwareEsxiHostd,
  virtualizationMicrosoftHypervVmms,
  virtualizationProxmoxVe,
  networkVmwareNsxManager,
  webAtlassianJiraSecurity,
  databaseApacheCassandraAudit,
  securityKasperskyCybertrace,
  securityKasperskyKics4net,
  securitySymantecSepm,
  networkCiscoFtd,
  securityTrendmicroDeepSecurity,
  webF5AdvancedWaf,
  identityFortinetFortipam,
  networkKerioControl,
  networkBind9Query,
  proxyCiscoSecureWebAppliance,
  emailCiscoSecureEmailGateway,
  securityFortinetFortisoar,
  networkSophosFirewall,
  networkFortinetFortiadc,
  storageNetappOntapEms,
  cloudNetskopeCasb,
  networkSonicwallTz,
  networkWatchguardFirebox,
  networkKempLoadmaster,
  securityImpervaSecuresphere,
  proxySolarWebproxy,
  identityNetwrixAuditorCef,
  securityStaffcopEnterprise,
  networkStormshieldSns,
  vpnSTerraGate,
  identityDelineaSecretServer,
  securityCiscoFmcAudit,
  securityCyberarkPta,
  applicationSharepointServerUls,
  applicationCiscoCucmAudit,
  securityCarbonBlackEdrEventForwarder,
];
