import type { Metadata } from 'next';

import BlogContent from './blog-content';
import { getAllTags, getBlogPostsMeta } from '@/lib/blog-source';

export const metadata: Metadata = {
  title: 'Blog | Eventum',
  description:
    'Product updates, use cases, and engineering insights from the Eventum team.',
};

export default function BlogPage() {
  const posts = getBlogPostsMeta();
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-fd-foreground mb-8">
        Blog
      </h1>
      <BlogContent posts={posts} tags={tags} />
    </main>
  );
}
