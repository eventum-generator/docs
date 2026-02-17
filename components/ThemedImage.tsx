'use client';

import { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

interface ThemedImageProps extends Omit<
  ComponentPropsWithoutRef<'img'>,
  'src'
> {
  lightSrc: string;
  darkSrc: string;
}

export default function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  ...props
}: ThemedImageProps) {
  return (
    <>
      <img
        src={lightSrc}
        alt={alt}
        className={cn('dark:hidden', className)}
        {...props}
      />
      <img
        src={darkSrc}
        alt={alt}
        className={cn('not-dark:hidden', className)}
        {...props}
      />
    </>
  );
}
