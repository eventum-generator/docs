import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#8282ef',
    icons: [{ src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
