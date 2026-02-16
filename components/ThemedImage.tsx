'use client';

import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/cn';

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
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
      <Image
        src={lightSrc}
        alt={alt}
        className={cn('dark:hidden', className)}
        {...props}
      />
      <Image
        src={darkSrc}
        alt={alt}
        className={cn('not-dark:hidden', className)}
        {...props}
      />
    </>
  );
}
