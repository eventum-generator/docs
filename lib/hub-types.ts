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

export interface GeneratorMeta {
  slug: string;
  displayName: string;
  category: CategoryId;
  description: string;
  dataSource: string;
  format: string[];
  eventCount: number;
  templateCount: number;
  highlights: string[];
  generatorId: string;
  eventTypes: EventType[];
  realismFeatures: string[];
  parameters: Parameter[];
  sampleOutputs: SampleOutput[];
}
