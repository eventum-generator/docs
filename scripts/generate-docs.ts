import { generateFiles } from 'fumadocs-openapi';
import type { OutputEntry } from 'fumadocs-openapi';

import { openapi } from '@/lib/openapi';

/**
 * Flatten the generated entry tree into the file paths of its pages.
 *
 * With `groupBy: 'route'` the generator nests pages under group entries,
 * and the index builder skips groups - left to its default the overview
 * page comes out with an empty card list. Naming every page explicitly
 * keeps a card per endpoint.
 */
function collectPagePaths(entries: OutputEntry[]): string[] {
  return entries.flatMap((entry) =>
    entry.type === 'group' ? collectPagePaths(entry.entries) : [entry.path]
  );
}

void generateFiles({
  input: openapi,
  output: './content/docs/api/',
  includeDescription: true,
  groupBy: 'route',
  index: {
    url: {
      baseUrl: '/docs/api',
      contentDir: '.',
    },
    items: (ctx) => [
      {
        path: 'index.mdx',
        title: 'Overview',
        description: 'Eventum API reference',
        only: Object.values(ctx.generatedEntries).flatMap(collectPagePaths),
      },
    ],
  },
});
