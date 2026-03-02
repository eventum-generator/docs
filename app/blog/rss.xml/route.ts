import { getBlogPosts, getPostSlug } from '@/lib/blog-source';

export const revalidate = false;

const SITE_URL = 'https://eventum.run';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const posts = getBlogPosts();

  const items = posts
    .map((post) => {
      const categories = (post.tags ?? [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${SITE_URL}/blog/${getPostSlug(post)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${getPostSlug(post)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Eventum Blog</title>
    <description>News, tutorials, and deep dives into synthetic event generation with Eventum.</description>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
