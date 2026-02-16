import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, House } from 'lucide-react';
import Image from 'next/image';

export const gitConfig = {
  user: 'eventum-generator',
  repo: 'eventum',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/logo.svg"
            alt="Eventum Logo"
            width={50}
            height={50}
            className="h-7.5 w-auto object-contain"
          />
          <p className="text-xl">Eventum</p>
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        icon: <House size={16} />,
        text: 'Home',
        url: '/',
        on: 'menu',
      },
      {
        icon: <BookOpen size={16} />,
        text: 'Documentation',
        url: '/docs',
        on: 'all',
        active: 'nested-url',
      },
    ],
  };
}
