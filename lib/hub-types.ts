import type { CategoryId } from './hub-categories';

export interface EventType {
  id: string;
  description: string;
  frequency: string;
  category: string;
}

export interface Parameter {
  name: string;
  defaultValue: string;
  description: string;
}

export interface SampleOutput {
  title: string;
  json: string;
}

/** Structure of the generated event. */
export type EventFormat = 'ECS JSON' | 'JSON';

/** Format of the native source record the event keeps in `event.original`. */
export type OriginalFormat =
  | 'Syslog'
  | 'CEF'
  | 'KV'
  | 'XML'
  | 'CSV'
  | 'JSON'
  | 'Plain text';

export interface GeneratorMeta {
  slug: string;
  displayName: string;
  category: CategoryId;
  description: string;
  dataSource: string;
  eventFormat: EventFormat;
  originalFormat?: OriginalFormat;
  eventCount: number;
  templateCount: number;
  highlights: string[];
  generationModes?: Array<'background' | 'anomaly'>;
  anomalyChain?: string;
  generatorId: string;
  eventTypes: EventType[];
  realismFeatures: string[];
  parameters: Parameter[];
  sampleOutputs: SampleOutput[];
}
