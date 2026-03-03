import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getBlogPost, getBlogSlugs } from '@/lib/blog-source';
import { getMDXComponents } from '@/mdx-components';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const MDX = post.body;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <Link
        href="/blog"
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground/60 hover:text-fd-foreground transition-colors duration-200 mb-8"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Blog
      </Link>

      <article className="blog-animate-in">
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-fd-muted-foreground/60 mb-4">
            <time
              dateTime={post.date}
              className="font-medium uppercase tracking-wide tabular-nums"
            >
              {formatDate(post.date)}
            </time>
            <span className="inline-block h-3.5 w-px bg-fd-border/50" />
            <span>{post.author}</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-fd-foreground leading-snug sm:text-3xl">
            {post.title}
          </h1>

          <p className="mt-3 text-base text-fd-muted-foreground/70 leading-relaxed">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-fd-muted-foreground/50 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 border-b border-fd-border/40" />
        </header>

        <div className="prose prose-headings:tracking-tight prose-headings:font-semibold prose-p:leading-[1.75] prose-p:text-fd-foreground/85 prose-a:text-fd-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-fd-primary/30 prose-blockquote:not-italic prose-blockquote:text-fd-muted-foreground/80">
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return getBlogSlugs();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [`/og/blog/${slug}/image.png`],
    },
  };
}
