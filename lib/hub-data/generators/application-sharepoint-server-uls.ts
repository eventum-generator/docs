import type { GeneratorMeta } from '@/lib/hub-types';

export const applicationSharepointServerUls: GeneratorMeta = {
  slug: 'application-sharepoint-server-uls',
  displayName: 'Microsoft SharePoint Server ULS',
  category: 'application',
  dataSource: 'SharePoint Server 2016 ULS workflow-timer diagnostic file',
  description:
    'Correlated workflow-timer diagnostics with a switchable repeated-processing sequence.',
  generatorId: 'sharepoint',
  eventCount: 3,
  templateCount: 1,
  highlights: [
    'Nine-column native ULS trace rows',
    'Three related workflow and SQL diagnostic EventIDs',
    'Repeated workflow instance across distinct correlation IDs',
  ],
  anomalyChain:
    'One workflow instance enters processing three times; each pass joins ahk8y, b6p4, and tzkv by correlation ID while retaining the same site, web, item, and list.',
  eventTypes: [
    {
      id: 'ahk8y',
      description: 'Workflow instance begins processing',
      frequency: '33.3%',
      category: 'process',
    },
    {
      id: 'b6p4',
      description: 'Workflow-association SQL command',
      frequency: '33.3%',
      category: 'process',
    },
    {
      id: 'tzkv',
      description: 'SQL command parameters for the lookup',
      frequency: '33.3%',
      category: 'process',
    },
  ],
  realismFeatures: [
    'Tab-separated event.original preserves all nine ULS columns.',
    'Linked records retain workflow object IDs and use one correlation ID per pass.',
    'The source is diagnostic ULS, not SharePoint audit; Verbose and VerboseEx tracing must be enabled.',
  ],
  format: ['JSON', 'ECS', 'ULS tab-separated'],
  generationModes: ['background', 'anomaly'],
  parameters: [
    {
      name: 'anomaly_mode',
      defaultValue: 'true',
      description: 'Include three linked passes for one workflow instance',
    },
    {
      name: 'farm_host',
      defaultValue: 'sp-app-01',
      description: 'SharePoint server name',
    },
    {
      name: 'suspect_workflow_id',
      defaultValue: '11111111-2222-4333-8444-555555555555',
      description: 'Workflow instance in the anomaly chain',
    },
    {
      name: 'routine_workflows_before_chain',
      defaultValue: '32',
      description: 'Ordinary workflow passes between anomaly chains',
    },
  ],
  sampleOutputs: [
    {
      title: 'Workflow association lookup in a repeated pass',
      json: String.raw`{
  "@timestamp": "2026-09-25T16:04:00+00:00",
  "ecs": {
    "version": "8.17.0"
  },
  "event": {
    "action": "workflow_association_lookup",
    "category": [
      "process"
    ],
    "code": "b6p4",
    "dataset": "sharepoint.uls",
    "kind": "event",
    "module": "sharepoint",
    "original": "09/25/2026 16:04:00.00\tOWSTIMER.EXE (0x9318)\t0x6DF0\tSharePoint Foundation\tDatabase\tb6p4\tVerboseEx\tSqlCommand: ; EXEC proc_getworkflowassociations '89731438-aba4-4f6c-a763-af07abc5c7e0', '16dd7828-193f-4e28-bfe9-1a3aa346df89', '0a4d8bdd-e7d3-47f2-95b9-209659d05e9c', 'ead1e62d-fdd2-4eb2-a52d-38bdb8f47960', @contenttypeid, @RequestGuid OUTPUT\tc997636f-eb02-4e6c-aa4f-d62630a183f2",
    "type": [
      "info"
    ]
  },
  "host": {
    "name": "sp-app-01"
  },
  "log": {
    "level": "verboseex"
  },
  "message": "SqlCommand: ; EXEC proc_getworkflowassociations '89731438-aba4-4f6c-a763-af07abc5c7e0', '16dd7828-193f-4e28-bfe9-1a3aa346df89', '0a4d8bdd-e7d3-47f2-95b9-209659d05e9c', 'ead1e62d-fdd2-4eb2-a52d-38bdb8f47960', @contenttypeid, @RequestGuid OUTPUT",
  "process": {
    "name": "OWSTIMER.EXE",
    "pid": 37656,
    "thread": {
      "id": 28144
    }
  },
  "related": {
    "hosts": [
      "sp-app-01"
    ]
  },
  "service": {
    "name": "SharePoint Server",
    "version": "2016"
  },
  "sharepoint": {
    "uls": {
      "area": "SharePoint Foundation",
      "category": "Database",
      "correlation_id": "c997636f-eb02-4e6c-aa4f-d62630a183f2",
      "event_id": "b6p4",
      "level": "VerboseEx",
      "message": "SqlCommand: ; EXEC proc_getworkflowassociations '89731438-aba4-4f6c-a763-af07abc5c7e0', '16dd7828-193f-4e28-bfe9-1a3aa346df89', '0a4d8bdd-e7d3-47f2-95b9-209659d05e9c', 'ead1e62d-fdd2-4eb2-a52d-38bdb8f47960', @contenttypeid, @RequestGuid OUTPUT",
      "process": "OWSTIMER.EXE (0x9318)",
      "thread_id": "0x6DF0",
      "timestamp_local": "09/25/2026 16:04:00.00"
    },
    "workflow": {
      "instance_id": "11111111-2222-4333-8444-555555555555",
      "item_id": "0a4d8bdd-e7d3-47f2-95b9-209659d05e9c",
      "list_id": "ead1e62d-fdd2-4eb2-a52d-38bdb8f47960",
      "site_id": "89731438-aba4-4f6c-a763-af07abc5c7e0",
      "web_id": "16dd7828-193f-4e28-bfe9-1a3aa346df89"
    }
  }
}`,
    },
  ],
};
