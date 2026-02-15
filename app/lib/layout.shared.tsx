import { IconBook, IconHome } from '@tabler/icons-react';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex flex-row gap-2 items-center">
          <img
            src="/logo.svg"
            alt="Eventum Logo"
            width="auto"
            className="h-7.5 w-auto object-contain"
          />
          <p className="text-xl">Eventum</p>
        </div>
      ),
    },
    githubUrl: 'https://github.com/eventum-generator/eventum',
    links: [
      {
        icon: <IconHome size={16} />,
        text: 'Home',
        url: '/',
        on: 'menu',
      },
      {
        icon: <IconBook size={16} />,
        text: 'Documentation',
        url: '/docs',
        on: 'all',
        active: 'nested-url', // TODO: https://github.com/fuma-nama/fumadocs/issues/3003
      },
    ],
  };
}
