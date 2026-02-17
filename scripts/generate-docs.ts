import { generateFiles } from 'fumadocs-openapi';

import { openapi } from '@/lib/openapi';

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
    items: [
      {
        path: 'index.mdx',
        title: 'Overview',
        description: 'Eventum API reference',
      },
    ],
  },
});
