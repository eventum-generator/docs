import type { GeneratorMeta } from '@/lib/hub-types';

export const windowsServiceControlManager: GeneratorMeta = {
  displayName: 'Windows Service Control Manager',
  category: 'endpoint',
  description:
    'About 7,500 selected System-channel records/day from 18 workstations and six servers, with rendered native XML and ECS fields.',
  dataSource: 'Windows System Service Control Manager',
  format: ['JSON', 'ECS'],
  highlights: [
    'Service runs, installation, start-type changes and unexpected termination',
    'One deployment per package across the fleet, with a 30-minute cooldown before that package is redeployed',
  ],
  anomalyChain:
    'One administrator installs the same service on two hosts, changes it to automatic start and starts it on each, within 30 minutes. Administrator, service and hosts rotate. Default interval is 24 hours. The first start follows the daily activity curve within min(interval,24h); later starts fall within +/-min(interval/4,6h)/2 of the preceding actual start plus interval.',
  generatorId: 'scm',
  eventTypes: [
    {
      id: '7036',
      description: 'Service running or stopped',
      frequency: '88.7%',
      category: 'process',
    },
    {
      id: '7040',
      description: 'Start type changed',
      frequency: '9.4%',
      category: 'configuration',
    },
    {
      id: '7045',
      description: 'Service installed',
      frequency: '1.7%',
      category: 'configuration',
    },
    {
      id: '7034',
      description: 'Unexpected termination',
      frequency: '0.2%',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Temporary automatic-start settings usually return to demand start within about 5–18 minutes; another configuration may return them sooner',
    'Ordinary runs continue during episodes, with the same restoration policy',
    'Selected English SCM records; removals between package deployments and other SCM event classes are omitted',
  ],
  slug: 'windows-service-control-manager',
  templateCount: 1,
  generationModes: ['background', 'anomaly'],
  eventCount: 4,
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include recurring correlated service deployments',
    },
    {
      name: 'anomaly_interval_hours',
      defaultValue: '24',
      description: 'Episode interval in hours, from 2 to 8760',
    },
    {
      name: 'dns_domain',
      defaultValue: 'corp.contoso.com',
      description: 'Hostname DNS suffix',
    },
    {
      name: 'ad_domain',
      defaultValue: 'CONTOSO',
      description: 'Administrator account domain',
    },
  ],
  sampleOutputs: [
    {
      title: 'Sample output',
      json: String.raw`{"@timestamp": "2026-09-21T01:30:58.391Z", "ecs": {"version": "8.11.0"}, "event": {"code": "7045", "dataset": "system.system", "kind": "event", "original": "\u003cEvent xmlns=\u0027http://schemas.microsoft.com/win/2004/08/events/event\u0027\u003e\u003cSystem\u003e\u003cProvider Name=\u0027Service Control Manager\u0027 Guid=\u0027{555908d1-a6d7-4695-8e1e-26931d2012f4}\u0027 EventSourceName=\u0027Service Control Manager\u0027/\u003e\u003cEventID Qualifiers=\u002716384\u0027\u003e7045\u003c/EventID\u003e\u003cVersion\u003e0\u003c/Version\u003e\u003cLevel\u003e4\u003c/Level\u003e\u003cTask\u003e0\u003c/Task\u003e\u003cOpcode\u003e0\u003c/Opcode\u003e\u003cKeywords\u003e0x8080000000000000\u003c/Keywords\u003e\u003cTimeCreated SystemTime=\u00272026-09-21T01:30:58.391607000Z\u0027/\u003e\u003cEventRecordID\u003e433609\u003c/EventRecordID\u003e\u003cCorrelation/\u003e\u003cExecution ProcessID=\u0027880\u0027 ThreadID=\u00273632\u0027/\u003e\u003cChannel\u003eSystem\u003c/Channel\u003e\u003cComputer\u003eWS-HR-01.corp.contoso.com\u003c/Computer\u003e\u003cSecurity UserID=\u0027S-1-5-18\u0027/\u003e\u003c/System\u003e\u003cEventData\u003e\u003cData Name=\u0027ServiceName\u0027\u003eLitware Remote Support\u003c/Data\u003e\u003cData Name=\u0027ImagePath\u0027\u003eC:\\ProgramData\\Litware\\lrsvc.exe\u003c/Data\u003e\u003cData Name=\u0027ServiceType\u0027\u003euser mode service\u003c/Data\u003e\u003cData Name=\u0027StartType\u0027\u003edemand start\u003c/Data\u003e\u003cData Name=\u0027AccountName\u0027\u003eLocalSystem\u003c/Data\u003e\u003c/EventData\u003e\u003cRenderingInfo Culture=\u0027en-US\u0027\u003e\u003cMessage\u003eA service was installed in the system.\n\nService Name:  Litware Remote Support\nService File Name:  C:\\ProgramData\\Litware\\lrsvc.exe\nService Type:  user mode service\nService Start Type:  demand start\nService Account:  LocalSystem\u003c/Message\u003e\u003cLevel\u003eInformation\u003c/Level\u003e\u003cTask\u003e\u003c/Task\u003e\u003cOpcode\u003e\u003c/Opcode\u003e\u003cChannel\u003e\u003c/Channel\u003e\u003cProvider\u003eMicrosoft-Windows-Service Control Manager\u003c/Provider\u003e\u003cKeywords\u003e\u003cKeyword\u003eClassic\u003c/Keyword\u003e\u003c/Keywords\u003e\u003c/RenderingInfo\u003e\u003c/Event\u003e", "provider": "Service Control Manager"}, "host": {"name": "WS-HR-01.corp.contoso.com"}, "log": {"level": "information"}, "message": "A service was installed in the system.\n\nService Name:  Litware Remote Support\nService File Name:  C:\\ProgramData\\Litware\\lrsvc.exe\nService Type:  user mode service\nService Start Type:  demand start\nService Account:  LocalSystem", "winlog": {"api": "wineventlog", "channel": "System", "computer_name": "WS-HR-01.corp.contoso.com", "event_data": {"AccountName": "LocalSystem", "ImagePath": "C:\\ProgramData\\Litware\\lrsvc.exe", "ServiceName": "Litware Remote Support", "ServiceType": "user mode service", "StartType": "demand start"}, "event_id": "7045", "keywords": ["Classic"], "opcode": "Info", "process": {"pid": 880, "thread": {"id": 3632}}, "provider_guid": "{555908d1-a6d7-4695-8e1e-26931d2012f4}", "provider_name": "Service Control Manager", "record_id": "433609", "user": {"domain": "NT AUTHORITY", "identifier": "S-1-5-18", "name": "SYSTEM", "type": "Well Known Group"}}}`,
    },
  ],
};
