import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Eye, Pencil, Save, Trash2 } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';

import ThemedImage from './components/ThemedImage';
import { APIPage } from './components/api-page';
import { Mermaid } from './components/mdx/mermaid';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    APIPage,
    Steps,
    Step,
    Files,
    Folder,
    File,
    ThemedImage,
    Mermaid,
    Eye,
    Pencil,
    Save,
    Trash2,
    ...components,
  };
}
