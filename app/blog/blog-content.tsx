'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { BookOpen, Rss } from 'lucide-react';

import type { BlogPostMeta } from '@/lib/blog-source';
import { getTagClassName } from '@/lib/blog-tags';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogContent({
  posts,
  tags,
}: {
  posts: BlogPostMeta[];
  tags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  const featuredPost = posts.find((p) => p.pinned) ?? posts[0];

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
      {/* Left sidebar */}
      <aside className="order-1 lg:w-52 shrink-0 blog-animate-in">
        <div className="lg:sticky lg:top-20 flex flex-col gap-8">
          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-fd-muted-foreground/50 uppercase tracking-wider mb-3">
                Topics
              </p>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`text-left text-sm px-2.5 py-1 rounded-md transition-colors duration-150 ${
                    activeTag === null
                      ? 'text-fd-foreground bg-fd-primary/10 font-medium'
                      : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50'
                  }`}
                >
                  All posts
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setActiveTag(tag === activeTag ? null : tag)
                    }
                    className={`text-left text-sm px-2.5 py-1 rounded-md transition-colors duration-150 capitalize ${
                      activeTag === tag
                        ? 'text-fd-foreground bg-fd-primary/10 font-medium'
                        : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Featured — desktop only */}
          {featuredPost && (
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-fd-muted-foreground/50 uppercase tracking-wider mb-3">
                Featured
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block p-3 -mx-1 rounded-lg border border-fd-border/40 hover:border-fd-border/80 transition-colors duration-200"
              >
                <p className="text-sm font-medium text-fd-foreground leading-snug group-hover:text-fd-primary transition-colors duration-200">
                  {featuredPost.title}
                </p>
                <p className="text-xs text-fd-muted-foreground/60 mt-1.5 line-clamp-2 leading-relaxed">
                  {featuredPost.description}
                </p>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Right sidebar — after posts on mobile, right column on desktop */}
      <aside
        className="order-3 lg:order-3 lg:w-60 shrink-0 blog-animate-in"
        style={{ animationDelay: '100ms' }}
      >
        <div className="lg:sticky lg:top-20 flex flex-col gap-8">
          {/* About */}
          <div>
            <p className="text-xs font-medium text-fd-muted-foreground/50 uppercase tracking-wider mb-3">
              About
            </p>
            <p className="text-sm text-fd-muted-foreground/70 leading-relaxed">
              Product updates, use cases, and engineering insights from the
              Eventum team.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium text-fd-muted-foreground/50 uppercase tracking-wider mb-3">
              Explore
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-200"
              >
                <BookOpen size={14} />
                Documentation
              </Link>
              <Link
                href="https://github.com/eventum-generator/eventum"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-200"
              >
                <SiGithub size={14} />
                GitHub
              </Link>
              <Link
                href="/blog/rss.xml"
                className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-200"
              >
                <Rss size={14} />
                RSS Feed
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Posts */}
      <div className="order-2 lg:order-2 flex-1 min-w-0">
        {filteredPosts.length === 0 ? (
          <p className="text-fd-muted-foreground/60 py-16">
            {activeTag
              ? `No posts tagged "${activeTag}" yet.`
              : 'First posts are on the way.'}
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-fd-border/50">
            {filteredPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2.5 py-7 first:pt-0 last:pb-0 blog-animate-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-2 text-sm text-fd-muted-foreground/60">
                  <time
                    dateTime={post.date}
                    className="font-medium uppercase tracking-wide tabular-nums"
                  >
                    {formatDate(post.date)}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-fd-border">·</span>
                      {post.tags.map((tag) => (
                        <span key={tag} className={getTagClassName(tag)}>
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-fd-foreground leading-snug group-hover:text-fd-primary transition-colors duration-200">
                  {post.title}
                </h2>

                <p className="text-[0.9375rem] text-fd-muted-foreground/70 leading-relaxed">
                  {post.description}
                </p>

                <span className="text-sm font-medium text-fd-primary opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                  Read post →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
