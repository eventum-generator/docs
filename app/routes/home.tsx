import cn from 'classnames';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';

import type { Route } from './+types/home';
import { GridPattern } from '@/components/background/grid';
import { Flare } from '@/components/light/flare';
import { baseOptions } from '@/lib/layout.shared';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Eventum' },
    { name: 'description', content: 'Welcome to Eventum' },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col z-10 items-center justify-center text-center gap-12">
        <Flare />
        <div className="flex flex-row justify-center items-center gap-5 z-10">
          <img
            src="/logo.svg"
            alt="Eventum Logo"
            width="auto"
            className="h-12.5 lg:h-19 w-auto object-contain"
          />
          <h1 className={'text-3xl lg:text-5xl uppercase font-medium'}>
            Eventum
          </h1>
        </div>
        <span className="text-md lg:text-2xl font-light text-wrap z-10">
          Generate sophisticated event streams
        </span>
        <div className="flex flex-col gap-2 z-10">
          <div className="flex flex-col w-full lg:flex-row gap-2 lg:gap-2 items-center justify-center motion-preset-expand motion-delay-[400ms]">
            <Link
              to={'/docs'}
              className="flex w-full items-center group border rounded-2xl px-5 py-2 gap-2"
            >
              <span>Get started</span>
            </Link>
          </div>
        </div>
        <GridPattern
          width={50}
          height={50}
          className={cn(
            'mask-[linear-gradient(-160deg,white,transparent,transparent)] '
          )}
        />
      </main>
    </HomeLayout>
  );
}
