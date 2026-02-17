'use client';

import { LayoutGroup, motion } from 'motion/react';

import RotatingText from '@/components/RotatingText';

export function RotatingPhrases() {
  return (
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
  );
}
