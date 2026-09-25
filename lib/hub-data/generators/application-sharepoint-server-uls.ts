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
    'Linked records retain workflow object IDs and use one correlation ID per pass within 20 ms.',
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
      description: 'Workflow instance in one benign pass and the anomaly chain',
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
  "@timestamp": "2026-09-25T14:52:13.010000+00:00",
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
    "original": "09/25/2026 14:52:13.01\tOWSTIMER.EXE (0x9318)\t0x6DF0\tSharePoint Foundation\tDatabase\tb6p4\tVerboseEx\tSqlCommand: ; EXEC proc_getworkflowassociations '285c2d48-d9c9-45d9-a726-8bc5033790b8', 'acff57c3-ea68-4eda-8f1d-3c641959299f', '6077cc34-5f9c-4bdd-8beb-c2aafe0a5b9e', '39fae561-5463-4dc7-8a8a-65ab28c8cb9b', @contenttypeid, @RequestGuid OUTPUT\t04bf54d9-3c8e-4034-ba8d-2d5749d91f44",
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
  "message": "SqlCommand: ; EXEC proc_getworkflowassociations '285c2d48-d9c9-45d9-a726-8bc5033790b8', 'acff57c3-ea68-4eda-8f1d-3c641959299f', '6077cc34-5f9c-4bdd-8beb-c2aafe0a5b9e', '39fae561-5463-4dc7-8a8a-65ab28c8cb9b', @contenttypeid, @RequestGuid OUTPUT",
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
      "correlation_id": "04bf54d9-3c8e-4034-ba8d-2d5749d91f44",
      "event_id": "b6p4",
      "level": "VerboseEx",
      "message": "SqlCommand: ; EXEC proc_getworkflowassociations '285c2d48-d9c9-45d9-a726-8bc5033790b8', 'acff57c3-ea68-4eda-8f1d-3c641959299f', '6077cc34-5f9c-4bdd-8beb-c2aafe0a5b9e', '39fae561-5463-4dc7-8a8a-65ab28c8cb9b', @contenttypeid, @RequestGuid OUTPUT",
      "process": "OWSTIMER.EXE (0x9318)",
      "thread_id": "0x6DF0",
      "timestamp_local": "09/25/2026 14:52:13.01"
    },
    "workflow": {
      "instance_id": "11111111-2222-4333-8444-555555555555",
      "item_id": "6077cc34-5f9c-4bdd-8beb-c2aafe0a5b9e",
      "list_id": "39fae561-5463-4dc7-8a8a-65ab28c8cb9b",
      "site_id": "285c2d48-d9c9-45d9-a726-8bc5033790b8",
      "web_id": "acff57c3-ea68-4eda-8f1d-3c641959299f"
    }
  }
}`,
    },
  ],
};
