import { Step, Steps } from 'fumadocs-ui/components/steps';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { APIPage } from './components/api-page';
import ThemedImage from './components/ThemedImage';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    Steps,
    Step,
    ThemedImage,
    ...components,
  };
}
