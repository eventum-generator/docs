import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex flex-row gap-3 items-center">
          <img
            src="/logo.svg"
            alt="Eventum Logo"
            width="auto"
            className="h-[25px] w-auto object-contain"
          />
          <p>Eventum</p>
        </div>
      ),
    },
  };
}
