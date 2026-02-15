import { icons } from '@tabler/icons-react';
import { loader } from 'fumadocs-core/source';
import { docs } from 'fumadocs-mdx:collections/server';
import { createElement } from 'react';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
