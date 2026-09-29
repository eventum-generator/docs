/* eslint-disable sonarjs/no-hardcoded-ip -- Synthetic IPs document generator defaults. */
import type { GeneratorMeta } from '@/lib/hub-types';

export const securityKasperskyKics4net: GeneratorMeta = {
  slug: 'security-kaspersky-kics4net',
  displayName: 'Kaspersky KICS for Networks 4.2 CEF',
  category: 'security',
  description:
    "Kaspersky Industrial CyberSecurity for Networks 4.2 Asset Management events for new devices and address changes, and Intrusion Detection events for ARP spoofing signs, in an industrial (OT) plant network. Each record follows the EventMessage structure KICS sends to a SIEM in CEF; Eventum writes ECS JSON with the CEF line in event.original. About 690 records a day from 60 known devices and 54 transient laptops follow the plant's working day in UTC. For SIEM detection engineering and parser testing. Recurring episodes show a commissioning laptop taking over the address of an existing device.",
  dataSource:
    'Kaspersky Industrial CyberSecurity for Networks 4.2 EventMessage forwarded to a SIEM in CEF',
  format: ['JSON', 'ECS', 'CEF'],
  eventCount: 8,
  templateCount: 1,
  highlights: [
    'EventMessage CEF line with documented severity bands',
    '60 OT devices, 9 redundant pairs and 54 laptops',
    'Recurring new device, IP conflict, ARP spoofing chain',
  ],
  generationModes: ['background', 'anomaly'],
  anomalyChain:
    "A commissioning laptop is detected as a new device with the IP of an existing device X (its main service IP); usually one to ten minutes later KICS registers an IP address conflict on X, with X's known MAC as owner and the laptop as challenger, sometimes repeated within minutes; a few minutes later one ARP spoofing record from the laptop claims X towards X's peer. The steps link by the laptop's MAC (smac, source.mac; ownerMac of step 1, challengerMac of step 2) and the claimed IP (src, source.ip; ownerIp of steps 1 and 2, substitutedIpAddress of step 3). An episode usually spans about 2 to 20 minutes, up to about 40 minutes at night, always within one hour, and has no closing record. The first episode starts within anomaly_interval_hours (at most 24 hours) of the start of the data, at an hour drawn from the working-day curve; each next one is due anomaly_interval_hours (default 24, minimum 3) after the actual start of the previous one and starts within about one eighth of the interval (at most three hours) before or after that time, favouring working hours. A missed episode is not caught up. Each episode uses another commissioning laptop and another IP than the previous one. Every part of the episode also occurs in ordinary data; only the complete sequence within one hour is absent from it.",
  generatorId: 'kics4net',
  eventTypes: [
    {
      id: '4000005007',
      description: 'New device IP address detected',
      frequency: '39.5% of records',
      category: 'host',
    },
    {
      id: '4000005003',
      description: 'New device detected on network',
      frequency: '26.0% of records',
      category: 'host',
    },
    {
      id: '4000005009',
      description: 'IP address added to the device',
      frequency: '24.8% of records',
      category: 'host',
    },
    {
      id: '4000005008',
      description: 'MAC address added to the device',
      frequency: '2.9% of records',
      category: 'host',
    },
    {
      id: '4000005005',
      description: 'IP address conflict detected',
      frequency: '2.0% of records',
      category: 'network',
    },
    {
      id: '4000005010',
      description: 'New device MAC address detected',
      frequency: '1.9% of records',
      category: 'host',
    },
    {
      id: '4000004001',
      description: 'Symptoms of ARP spoofing detected in ARP replies',
      frequency: '1.8% of records',
      category: 'intrusion_detection, network',
    },
    {
      id: '4000004002',
      description: 'Symptoms of ARP spoofing detected in ARP requests',
      frequency: '1.0% of records',
      category: 'intrusion_detection, network',
    },
  ],
  realismFeatures: [
    'Three subnets, each seen by one monitoring point: two production cells (10.20.30.0/24, 10.20.31.0/24) with PLCs, HMIs and switches and a SCADA subnet (10.20.40.0/24) with SCADA and historian servers, engineering workstations and gateways. 60 known devices, nine of them redundant pairs with a backup MAC, each polled by a peer HMI or server; 54 transient engineering, contractor and diagnostic laptops, three of them commissioning laptops with the IPs of the devices they service. RFC 1918 addresses, MACs random within vendor prefixes, synthetic names.',
    "About 690 records a day (+/- 3% from day to day) follow the plant's working day in UTC: about 13 an hour from 19:00 to 04:00, about 19 at 04:00 and 17:00-19:00, about 33 at 05:00 and 15:00-17:00 and about 45 from 06:00 to 15:00. Laptops make about 90% of records: new or additional DHCP addresses and re-detection as a new device after removal from the devices table, each laptop with its own activity level. Known devices occasionally gain an IP or MAC address or get a new IP; redundant pairs fail over about twice a day around the clock, mostly three flaky pairs, and the primary takes the shared IP back tens of minutes later.",
    "In about one of five appearances a commissioning laptop comes up with the IP of the device it services. While that device is disconnected, the laptop is only registered with the IP; while it is online, the laptop is either detected as a new device with the IP and then conflicts with the device one to three times within minutes, or, as a known laptop, conflicts and/or shows ARP spoofing signs for the IP towards the device's peer. Other laptops do this rarely, with the IP of some device.",
    "Detections are a small part of the data: about 10 ARP spoofing bursts (20 records) and 9 IP conflict incidents (14 records) a day, two thirds of them from the three commissioning laptops and a fifth from the redundant pairs. A burst shares one attackStartTimestamp and targets the claimed device's peer, otherwise another HMI, server, workstation or gateway of its subnet. The score adds device importance (PLCs highest) to a synthetic per-type base score, and severity follows the documented 3, 6, 9 bands. KICS registers no event when a conflict or ARP spoofing ends.",
    'Records that KICS registers seconds apart are further apart here: records of one ARP spoofing burst are a median 100 seconds apart (90% within 6 minutes) and repeated conflicts a median 3 minutes. Laptops change addresses more often than a quiet plant would show (commissioning laptops about 23 to 30 records a day each). Rates, shares, device pools, peers, service IPs and the UTC working day are scenario assumptions, not Kaspersky measurements.',
    'Kaspersky publishes the EventMessage field table but no complete raw record: the CEF header follows the table, and dateTime, hostname, messageType and score are the first extension keys. Key order, value formats of technology, MAC addresses and start, and the absence of a syslog header are assumptions; byte parity with a live KICS installation and compatibility with the KUMA 4.2 syslog normalizer are not established. Event titles are the event type names; installations may show other titles.',
    'Only Asset Management address events and ARP spoofing signs: no Process Control, Intrusion Detection rules, Command Control, PLC project, application or audit messages, and no optional common fields such as cnt, end, ports, vlanId, triggeredRule, industrial addresses, device network name or model.',
    'An ordinary ARP spoofing burst that would complete the anomaly sequence claims another IP of the same subnet, so a few times a week a conflict on one IP is followed within the hour by ARP spoofing signs from the same laptop for a neighbouring IP. With anomaly_mode on, each episode adds about one new-device, conflict and ARP spoofing record for a commissioning laptop and its main service IP; at intervals shorter than a day, a larger share of episodes falls at night than of ordinary activity.',
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
      json: String.raw`{"@timestamp": "2026-09-21T13:21:12.824+00:00", "destination": {"ip": "10.20.40.10", "mac": "18-66-DA-E1-D7-BD"}, "ecs": {"version": "8.17.0"}, "event": {"action": "Symptoms of ARP spoofing detected in ARP requests", "category": ["intrusion_detection", "network"], "code": "4000004002", "dataset": "kaspersky.kics_networks", "kind": "alert", "original": "CEF:0|Kaspersky Lab|Kaspersky Industrial CyberSecurity for Networks|4.2.0.335|4000004002|Symptoms of ARP spoofing detected in ARP requests|6|dateTime=2026-09-21T13:21:12.824Z hostname=10.20.40.5 messageType=Event score=7.6 dmac=18:66:da:e1:d7:bd dst=10.20.40.10 smac=f8:bc:12:48:ef:ed src=10.20.40.18 start=2026-09-21T13:21:15.491Z technology=Intrusion Detection protocol=ARP monitoringPoint=MP-SCADA-SPAN eventIdentifier=2353604 substitutedIpAddress=10.20.40.18 targetIpAddress=10.20.40.10 attackStartTimestamp=2026-09-21T13:21:12.824Z srcAssetName=ENG-LT06 srcVendor=Dell srcOS=Windows 10 Enterprise dstAssetName=SCADA-SRV01 dstVendor=Dell dstOS=Windows Server 2019", "risk_score": 7.6, "severity": 6, "type": ["indicator"]}, "kaspersky": {"kics_networks": {"event_identifier": 2353604, "message_type": "Event", "monitoring_point": "MP-SCADA-SPAN", "score": 7.6, "substituted_ip": "10.20.40.18", "target_ip": "10.20.40.10", "technology": "Intrusion Detection"}}, "observer": {"hostname": "10.20.40.5", "product": "Kaspersky Industrial CyberSecurity for Networks", "vendor": "Kaspersky Lab", "version": "4.2.0.335"}, "related": {"ip": ["10.20.40.18", "10.20.40.10"]}, "source": {"ip": "10.20.40.18", "mac": "F8-BC-12-48-EF-ED"}}`,
    },
  ],
};
