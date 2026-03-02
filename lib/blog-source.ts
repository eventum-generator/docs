import { blog } from 'fumadocs-mdx:collections/server';

function toSlug(path: string): string {
  return path.replace(/\.mdx?$/, '');
}

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  tags?: string[];
  pinned?: boolean;
  slug: string;
}

export function getBlogPosts() {
  return [...blog].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPostsMeta(): BlogPostMeta[] {
  return getBlogPosts().map((post) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    tags: post.tags,
    pinned: post.pinned,
    slug: getPostSlug(post),
  }));
}

export function getBlogPost(slug: string) {
  return blog.find((post) => toSlug(post.info.path) === slug);
}

export function getBlogSlugs() {
  return blog.map((post) => ({ slug: toSlug(post.info.path) }));
}

export function getPostSlug(post: (typeof blog)[number]): string {
  return toSlug(post.info.path);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of blog) {
    if (post.tags) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }
  }
  return [...tags].sort();
}
