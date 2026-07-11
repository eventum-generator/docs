import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { docsGitConfig } from '@/lib/layout.shared';
import { breadcrumbSchema, canonicalPath, courseSchema } from '@/lib/seo';
import { getPageImage, source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

// Course JSON-LD belongs on course pillars only (overview + track
// indexes), not on individual lessons.
const COURSE_PILLARS = new Set([
  '/docs/tutorials',
  '/docs/tutorials/foundations',
  '/docs/tutorials/formats',
  '/docs/tutorials/realism',
  '/docs/tutorials/delivery',
  '/docs/tutorials/scenarios',
]);

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `/llms.mdx/docs/${[...page.slugs, 'index.mdx'].join('/')}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Documentation', path: '/docs' },
          { name: page.data.title, path: page.url },
        ])}
      />
      {COURSE_PILLARS.has(page.url) && (
        <JsonLd
          data={courseSchema({
            name: page.data.title,
            description: page.data.description ?? '',
            path: page.url,
          })}
        />
      )}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${docsGitConfig.user}/${docsGitConfig.repo}/blob/${docsGitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: canonicalPath(page.url) },
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
