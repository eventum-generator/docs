import { SiGithub } from '@icons-pack/react-simple-icons';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next/types';

import { GridPattern } from '@/components/GridPattern';
import LightRays from '@/components/LightRays';
import { Features } from '@/components/pages/home/Features';
import { RotatingPhrases } from '@/components/pages/home/RotatingPhrases';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Eventum',
  description: 'Welcome to Eventum',
};

export default function HomePage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex flex-col items-center justify-center">
      <GridPattern
        width={50}
        height={50}
        className={cn(
          'mask-[linear-gradient(-45deg,white,transparent,transparent)] -z-20'
        )}
      />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="flex flex-1 flex-col items-center justify-center text-center gap-5 mx-5">
          <div className="flex flex-row justify-center items-center gap-5">
            <img
              src="/logo.svg"
              alt="Eventum Logo"
              className="h-12.5 lg:h-19 w-auto object-contain"
            />
            <h1
              className={
                'text-3xl lg:text-5xl uppercase font-medium bg-linear-to-br dark:from-white from-black dark:to-neutral-400 to-black bg-clip-text text-transparent'
              }
            >
              Eventum
            </h1>
            <div className="h-15 w-0.5 bg-gray-400/30 rounded-sm" />
            <span
              className={
                'text-md lg:text-2xl font-medium bg-linear-to-br dark:from-white from-black dark:to-neutral-400 to-black bg-clip-text text-transparent'
              }
            >
              Data generation platform
            </span>
          </div>

          <RotatingPhrases />

          <div className="flex flex-row justify-center align-center gap-3">
            <Link
              href={'https://github.com/eventum-generator/eventum'}
              target="_blank"
              className="
                flex items-center justify-center border rounded-2xl px-3 py-1 gap-1.5
              "
            >
              <SiGithub size={16} />
              <span>GitHub</span>
            </Link>
            <Link
              href={'/docs'}
              className="
                flex items-center justify-center border rounded-2xl px-3 py-1 gap-1.5
              "
            >
              <span>Get started</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="hidden lg:block mx-5">
          <Features />
        </div>
      </div>
    </main>
  );
}
