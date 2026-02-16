'use client';

import Autoplay from 'embla-carousel-autoplay';
import { Card } from 'fumadocs-ui/components/card';
import { VisuallyHidden } from 'radix-ui';
import { FC, useRef } from 'react';

import { FEATURES } from './data/features';
import ThemedImage from '@/components/ThemedImage';
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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Features: FC = () => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
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
          {FEATURES.map((item) => (
            <CarouselItem key={item.title}>
              <Card
                title={item.title}
                className="border-none not-dark:bg-[#f4f4fa]"
              >
                <Dialog>
                  <DialogTrigger>
                    <ThemedImage
                      darkSrc={item.image.dark}
                      lightSrc={item.image.light}
                      alt={item.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-auto w-full object-contain rounded-md"
                    />
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="p-0
                          max-w-[80%]!
                          border-none!
                          rounded-none"
                  >
                    <VisuallyHidden.Root>
                      <DialogTitle className="bg-transparent" />
                    </VisuallyHidden.Root>

                    <DialogHeader>
                      <DialogDescription>
                        <ThemedImage
                          darkSrc={item.image.dark}
                          lightSrc={item.image.light}
                          alt={item.title}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="h-auto w-full object-contain"
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
  );
};
