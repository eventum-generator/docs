import type { MetadataRoute } from 'next';

import { getBlogPostsMeta } from '@/lib/blog-source';
import { generators } from '@/lib/hub-data';
import { pageUrl } from '@/lib/seo';
import { source } from '@/lib/source';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: pageUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: pageUrl('/docs'), changeFrequency: 'weekly', priority: 0.8 },
    { url: pageUrl('/blog'), changeFrequency: 'weekly', priority: 0.6 },
    { url: pageUrl('/hub'), changeFrequency: 'weekly', priority: 0.7 },
  ];

  for (const page of source.getPages()) {
    entries.push({
      url: pageUrl(page.url),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const post of getBlogPostsMeta()) {
    entries.push({
      url: pageUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const generator of generators) {
    entries.push({
      url: pageUrl(`/hub/${generator.slug}`),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Deduplicate by URL, keeping the first (higher-priority) entry.
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
