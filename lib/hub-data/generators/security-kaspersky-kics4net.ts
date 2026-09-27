/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyKics4net: GeneratorMeta = {
  slug: 'security-kaspersky-kics4net',
  displayName: 'Kaspersky KICS for Networks 4.2 CEF',
  category: 'security',
  description:
    'Kaspersky Industrial CyberSecurity for Networks 4.2 Asset Management events for new devices and address changes, and Intrusion Detection events for ARP spoofing signs, in an industrial (OT) plant network. Each record follows the EventMessage structure KICS sends to a SIEM in CEF; Eventum writes ECS JSON with the CEF line in event.original. For SIEM detection engineering and parser testing. Recurring episodes show a new device impersonating an existing one.',
  dataSource:
    'Kaspersky Industrial CyberSecurity for Networks 4.2 EventMessage forwarded to a SIEM in CEF',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'EventMessage layout with documented severity bands',
    '60 known OT devices, 9 redundant pairs, 36 laptops',
    'Recurring new device, IP conflict, ARP spoofing chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    'The first episode is due one hour after the generator starts, each next one anomaly_interval_hours (default 24, minimum 3) after the actual start of the previous one; each start waits a random delay of up to one hour (or one eighth of the interval when shorter) and then a time of day at which transient devices visit, with no catch-up. A transient device is detected as a new device with the IP of an existing device X, KICS registers an IP conflict on X challenged by it, then the device sends spoofed ARP for X to a host in the subnet of X, often as a burst. Episodes spanned 2 to 19 minutes measured. Every part also occurs in background; only the complete sequence within one hour is kept out of it.',
  generatorId: 'kics4net',
  eventTypes: [
    {
      id: '4000005003',
      description: 'New device detected on network',
      frequency: '22.6% measured share',
      category: 'host',
    },
    {
      id: '4000005007',
      description: 'New device IP address detected',
      frequency: '18.5% measured share',
      category: 'host',
    },
    {
      id: '4000005009',
      description: 'IP address added to the device',
      frequency: '9.0% measured share',
      category: 'host',
    },
    {
      id: '4000005008',
      description: 'MAC address added to the device',
      frequency: '1.6% measured share',
      category: 'host',
    },
    {
      id: '4000005010',
      description: 'New device MAC address detected',
      frequency: '1.7% measured share',
      category: 'host',
    },
    {
      id: '4000005005',
      description: 'IP address conflict detected',
      frequency: '17.9% measured share',
      category: 'network',
    },
    {
      id: '4000004001',
      description: 'Symptoms of ARP spoofing detected in ARP replies',
      frequency: '20.2% measured share',
      category: 'intrusion_detection, network',
    },
    {
      id: '4000004002',
      description: 'Symptoms of ARP spoofing detected in ARP requests',
      frequency: '8.4% measured share',
      category: 'intrusion_detection, network',
    },
  ],
  realismFeatures: [
    'Three subnets, each seen by one monitoring point: two production cells with PLCs, HMIs and switches and a SCADA subnet with servers, engineering workstations and gateways. 60 known devices (9 redundant pairs with a backup MAC) and 36 transient engineering, contractor and diagnostic laptops; RFC 1918 addresses, MACs random within vendor prefixes, synthetic names.',
    'Independent processes with skewed per-device gaps and activity levels, about 240 events per day: transient laptops visit mostly 05:00-16:00 UTC and are re-detected as new devices, get new DHCP addresses or are misconfigured with the IP of an existing device from their three-IP service profile; known devices occasionally gain an IP or MAC; redundant pairs fail over around the clock and back tens of minutes later.',
    'ARP spoofing signs come in bursts sharing one attackStartTimestamp, targeting an HMI, server, workstation or gateway in the same subnet as the claimed IP. The score adds device importance (PLCs highest) to a synthetic per-type base, and severity follows the documented 3, 6, 9 bands. KICS registers no event when a conflict or ARP spoofing ends.',
    'Kaspersky publishes the EventMessage field table but no complete raw record: header per the table, dateTime, hostname, messageType and score as leading extension keys; key order, some value formats and the absence of a syslog header are assumptions, and byte parity with a live KICS installation or KUMA 4.2 normalizer compatibility is not established. Event titles are the event type names.',
    'Only Asset Management address events and ARP spoofing signs: no Process Control, Intrusion Detection rules, Command Control, PLC project, application or audit messages, and no optional common fields such as cnt, end, ports, vlanId or triggeredRule. Rates, shares, device pools and the service-profile behaviour are scenario assumptions.',
    'A background ARP burst that would complete the chain claims another IP of the same subnet, picked per record: about once per 36 capture-days this leaves a conflict on one IP followed by ARP spoofing for another inside the hour, and a burst can carry several substituted IPs. At an 8 h interval about 30% of episodes start at night against about 14% of background activity.',
  ],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description:
        'Add the recurring new device, IP conflict, ARP spoofing episode; false produces background only',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description:
        'Hours from the start of one episode to the time the next is due, range 3-8760',
    },
    {
      name: 'server_host',
      defaultValue: '10.20.40.5',
      description: 'KICS for Networks Server address (hostname)',
    },
    {
      name: 'device_version',
      defaultValue: '4.2.0.335',
      description: 'KICS for Networks version in the CEF header',
    },
  ],
  sampleOutputs: [
    {
      title: 'ARP spoofing step of an anomaly episode',
      json: String.raw`{"@timestamp": "2026-09-26T04:29:46.124+00:00", "destination": {"ip": "10.20.30.26", "mac": "00-1B-1B-3D-E3-8D"}, "ecs": {"version": "8.17.0"}, "event": {"action": "Symptoms of ARP spoofing detected in ARP replies", "category": ["intrusion_detection", "network"], "code": "4000004001", "dataset": "kaspersky.kics_networks", "kind": "alert", "original": "CEF:0|Kaspersky Lab|Kaspersky Industrial CyberSecurity for Networks|4.2.0.335|4000004001|Symptoms of ARP spoofing detected in ARP replies|6|dateTime=2026-09-26T04:29:46.124Z hostname=10.20.40.5 messageType=Event score=7.5 dmac=00:1b:1b:3d:e3:8d dst=10.20.30.26 smac=00:21:cc:44:78:79 src=10.20.30.15 start=2026-09-26T04:29:46.200Z technology=Intrusion Detection protocol=ARP monitoringPoint=MP-CellA-SPAN eventIdentifier=3926816 substitutedIpAddress=10.20.30.15 targetIpAddress=10.20.30.26 attackStartTimestamp=2026-09-26T04:29:46.124Z srcAssetName=ENG-LT01 srcVendor=Lenovo srcOS=Windows 10 Enterprise dstAssetName=HMI-A03 dstVendor=Siemens dstOS=WinCC Unified", "risk_score": 7.5, "severity": 6, "type": ["indicator"]}, "kaspersky": {"kics_networks": {"event_identifier": 3926816, "message_type": "Event", "monitoring_point": "MP-CellA-SPAN", "score": 7.5, "substituted_ip": "10.20.30.15", "target_ip": "10.20.30.26", "technology": "Intrusion Detection"}}, "observer": {"hostname": "10.20.40.5", "product": "Kaspersky Industrial CyberSecurity for Networks", "vendor": "Kaspersky Lab", "version": "4.2.0.335"}, "related": {"ip": ["10.20.30.15", "10.20.30.26"]}, "source": {"ip": "10.20.30.15", "mac": "00-21-CC-44-78-79"}}`,
    },
  ],
};
