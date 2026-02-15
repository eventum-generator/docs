import {
  IconAppWindow,
  IconBook,
  IconCube,
  IconHome,
  IconPuzzle,
} from '@tabler/icons-react';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import browserCollections from 'fumadocs-mdx:collections/browser';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';

import type { Route } from './+types/page';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });

  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.getPageTree()),
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    // you can define props for the `<Content />` component
    props: {
      className?: string;
    }
  ) {
    return (
      <DocsPage toc={toc} {...props}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <Mdx components={{ ...defaultMdxComponents }} />
        </DocsBody>
      </DocsPage>
    );
  },
});

export default function Page({ loaderData }: Route.ComponentProps) {
  const Content = clientLoader.getComponent(loaderData.path);
  const { pageTree } = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      {...baseOptions()}
      tree={pageTree}
      sidebar={{
        enabled: true,
        tabs: [
          {
            title: 'Overview',
            description: 'Navigation guide',
            url: '/docs',
            icon: <IconBook size={16} />,
          },
          {
            title: 'Core',
            description: 'Basics and key concepts',
            url: '/docs/core',
            icon: <IconCube size={16} />,
          },
          {
            title: 'Plugins',
            description: 'Building blocks',
            url: '/docs/plugins',
            icon: <IconPuzzle size={16} />,
          },
          {
            title: 'Eventum Studio',
            description: 'Web interface',
            url: '/docs/studio',
            icon: <IconAppWindow size={16} />,
          },
        ],
      }}
    >
      <Content />
    </DocsLayout>
  );
}
