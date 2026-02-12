import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex flex-row gap-2 items-center">
          <img
            src="/logo.svg"
            alt="Eventum Logo"
            width="auto"
            className="h-7.5 w-auto object-contain"
          />
          <p className="text-xl">Eventum</p>
        </div>
      ),
    },
  };
}
