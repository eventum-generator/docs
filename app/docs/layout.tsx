import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  AppWindow,
  Blocks,
  BookOpen,
  Box,
  CodeXml,
  GraduationCap,
} from 'lucide-react';

import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        enabled: true,
        tabs: [
          {
            title: 'Overview',
            description: 'Navigation guide',
            url: '/docs',
            icon: <BookOpen size={16} />,
          },
          {
            title: 'Core',
            description: 'Basics and key concepts',
            url: '/docs/core',
            icon: <Box size={16} />,
          },
          {
            title: 'Plugins',
            description: 'Building blocks',
            url: '/docs/plugins',
            icon: <Blocks size={16} />,
          },
          {
            title: 'Eventum Studio',
            description: 'Web interface',
            url: '/docs/studio',
            icon: <AppWindow size={16} />,
          },
          {
            title: 'API',
            description: 'API reference',
            url: '/docs/api',
            icon: <CodeXml size={16} />,
          },
          {
            title: 'Tutorials',
            description: 'Step-by-step guides',
            url: '/docs/tutorials',
            icon: <GraduationCap size={16} />,
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}
