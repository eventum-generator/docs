import { IconBrandGithub, IconChevronRight } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from 'fumadocs-ui/components/card';
import { HomeLayout, type HomeLayoutProps } from 'fumadocs-ui/layouts/home';
import { motion } from 'motion/react';
import { LayoutGroup } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';

import type { Route } from './+types/home';
import LightRays from '@/components/LightRays';
import RotatingText from '@/components/RotatingText';
import { GridPattern } from '@/components/grid';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { baseOptions } from '@/lib/layout.shared';
import { cn } from '@/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Eventum' },
    { name: 'description', content: 'Welcome to Eventum' },
  ];
}

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const features = [
    {
      title: 'Precise scheduling of events',
      image: {
        dark: '/landing/time_distribution_dark.png',
        light: '/landing/time_distribution_light.png',
      },
    },
    {
      title: 'Template engine with extended API',
      image: {
        dark: '/landing/template_dark.png',
        light: '/landing/template_light.png',
      },
    },
    {
      title: 'Ability to generate data using Python scripts',
      image: {
        dark: '/landing/script_dark.png',
        light: '/landing/script_light.png',
      },
    },
    {
      title: 'Generation debugging',
      image: {
        dark: '/landing/debug_dark.png',
        light: '/landing/debug_light.png',
      },
    },
    {
      title: 'Various endpoints for sending events',
      image: {
        dark: '/landing/outputs_dark.png',
        light: '/landing/outputs_light.png',
      },
    },
  ];

  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col items-center justify-center">
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
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-5">
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
              <div className="h-15 w-0.5 bg-gray-400/30 rounded-sm" />
              <span
                className={
                  'text-md lg:text-2xl font-medium bg-linear-to-br dark:from-white from-black dark:to-neutral-400 to-black bg-clip-text text-transparent'
                }
              >
                Data generation platform
              </span>
            </div>

            <LayoutGroup>
              <motion.p className="flex items-center gap-2" layout>
                <motion.span
                  className="
                text-md lg:text-xl font-light
                text-black dark:text-white
              "
                  layout
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                >
                  Fuel your systems with{' '}
                </motion.span>
                <RotatingText
                  texts={[
                    'scheduled events',
                    'application logs',
                    'feature-rich datasets',
                    'live data streams',
                    'testing workloads',
                  ]}
                  mainClassName="
                    inline-flex items-center
                    px-2 sm:px-2 md:px-3
                    bg-[#8282ef]/90
                    text-md lg:text-xl font-normal text-white
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

            <div className="flex flex-row justify-center align-center gap-3">
              <Link
                to={'https://github.com/eventum-generator/eventum'}
                target="_blank"
                className="
                flex items-center justify-center border rounded-2xl px-4 py-1 gap-1.5
              "
              >
                <IconBrandGithub size={16} />
                <span>GitHub</span>
              </Link>
              <Link
                to={'/docs'}
                className="
                flex items-center justify-center border rounded-2xl px-4 py-1 gap-1.5
              "
              >
                <span>Get started</span>
                <IconChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="invisible lg:visible flex flex-col gap-2 items-center justify-center">
            <span
              className={
                'text-md lg:text-2xl font-medium bg-linear-to-br dark:from-white from-black dark:to-neutral-400 to-black bg-clip-text text-transparent'
              }
            >
              Features
            </span>

            <Carousel
              className="w-[85%] text-center"
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {features.map((item) => (
                  <CarouselItem key={item.title}>
                    <Card title={item.title}>
                      <Dialog>
                        <DialogTrigger>
                          <img
                            src={item.image.light}
                            alt={item.title}
                            className="h-auto w-full object-contain rounded-md dark:hidden"
                          />
                          <img
                            src={item.image.dark}
                            alt={item.title}
                            className="h-auto w-full object-contain rounded-md not-dark:hidden"
                          />
                        </DialogTrigger>
                        <DialogContent
                          showCloseButton={false}
                          className="p-0
                          max-w-[80%]!
                          border-none!
                          rounded-none"
                        >
                          <DialogHeader>
                            <DialogDescription>
                              <img
                                src={item.image.light}
                                alt={item.title}
                                className="h-auto w-full object-contain dark:hidden"
                              />
                              <img
                                src={item.image.dark}
                                alt={item.title}
                                className="h-auto w-full object-contain not-dark:hidden"
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
}
