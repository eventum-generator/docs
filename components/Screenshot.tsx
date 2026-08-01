'use client';

import { X } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { cn } from '@/lib/cn';

interface ScreenshotProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
}

/**
 * A UI screenshot on a monotone plate.
 *
 * The plate spans the content column whatever the image measures, so a narrow
 * panel crop and a full-window frame keep the same edges as the text and as
 * each other. Clicking opens the image full size over a blurred page.
 */
export default function Screenshot({
  lightSrc,
  darkSrc,
  alt,
  className,
}: ScreenshotProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialog.current?.showModal(), []);
  const close = useCallback(() => dialog.current?.close(), []);

  return (
    <figure className={cn('screenshot not-prose', className)}>
      <button
        type="button"
        className="screenshot-plate"
        onClick={open}
        aria-label={`Enlarge screenshot: ${alt}`}
      >
        <img src={lightSrc} alt={alt} className="screenshot-image dark:hidden" />
        <img
          src={darkSrc}
          alt={alt}
          className="screenshot-image not-dark:hidden"
        />
      </button>

      {/* Clicking anywhere closes, as does Escape - the dialog element's own
          behaviour. */}
      <dialog ref={dialog} className="screenshot-dialog" onClick={close}>
        <img src={lightSrc} alt={alt} className="dark:hidden" />
        <img src={darkSrc} alt={alt} className="not-dark:hidden" />
        <button
          type="button"
          className="screenshot-close"
          onClick={close}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </dialog>
    </figure>
  );
}
