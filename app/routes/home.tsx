import cn from 'classnames';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { motion } from 'motion/react';
import { LayoutGroup } from 'motion/react';
import { Link } from 'react-router';

import type { Route } from './+types/home';
import LightRays from '@/components/LightRays';
import RotatingText from '@/components/RotatingText';
import { GridPattern } from '@/components/background/grid';
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
      <main className="flex flex-1 flex-col items-center justify-center text-center gap-12">
        <div className="pointer-events-none absolute -z-10 inset-0 invisible dark:visible">
          <LightRays
            raysOrigin="top-left"
            raysColor="#8facff"
            raysSpeed={0.25}
            lightSpread={4}
            rayLength={10}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-5">
          <img
            src="/logo.svg"
            alt="Eventum Logo"
            width="auto"
            className="h-12.5 lg:h-19 w-auto object-contain"
          />
          <h1
            className={
              'text-3xl lg:text-5xl uppercase font-medium bg-linear-to-br dark:from-white from-black dark:to-neutral-400 to-black bg-clip-text text-transparent'
            }
          >
            Eventum
          </h1>
        </div>
        <LayoutGroup>
          <motion.p className="flex items-center gap-2" layout>
            <motion.span
              className="
                text-md lg:text-2xl font-light
                text-black dark:text-white
              "
              layout
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              Generate sophisticated{' '}
            </motion.span>
            <RotatingText
              texts={[
                'events',
                'logs',
                'datasets',
                'data streams',
                'workloads',
              ]}
              mainClassName="
      inline-flex items-center
      px-2 sm:px-2 md:px-3
      bg-[#8282ef]/90
      text-md lg:text-2xl font-normal text-black dark:text-white
      overflow-hidden
      py-0.5 sm:py-1 md:py-1
      rounded-lg
      backdrop-blur-sm
    "
              staggerFrom="last"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              rotationInterval={3500}
            />
          </motion.p>
        </LayoutGroup>

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
            'mask-[linear-gradient(-45deg,white,transparent,transparent)] '
          )}
        />
      </main>
    </HomeLayout>
  );
}
