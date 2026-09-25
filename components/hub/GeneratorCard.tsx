import { Waves, Waypoints } from 'lucide-react';
import Link from 'next/link';

import { CATEGORY_MAP } from '@/lib/hub-categories';
import type { GeneratorMeta } from '@/lib/hub-types';

interface GeneratorCardProps {
  generator: GeneratorMeta;
  index: number;
}

export function GeneratorCard({ generator, index }: GeneratorCardProps) {
  const category = CATEGORY_MAP.get(generator.category);
  const Icon = category?.icon;
  const modes = generator.generationModes ?? ['background'];

  return (
    <Link
      href={`/hub/${generator.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-fd-border/50 p-5 transition-all duration-200 hover:border-fd-border hover:shadow-sm blog-animate-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
          {Icon && <Icon size={18} />}
        </div>
        <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors duration-200 leading-tight">
          {generator.displayName}
        </h3>
      </div>

      <p className="text-sm text-fd-muted-foreground/70 leading-relaxed line-clamp-3">
        {generator.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${category?.color ?? ''}`}
        >
          {category?.name}
        </span>
        {generator.format.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-fd-border/40 px-2 py-0.5 text-xs text-fd-muted-foreground/60"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1">
          {modes.includes('background') && (
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-sky-600 dark:text-sky-400 cursor-help"
              role="img"
              aria-label="Background events"
              title="Background events"
            >
              <Waves size={17} aria-hidden="true" />
            </span>
          )}
          {modes.includes('anomaly') && (
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-amber-600 dark:text-amber-400 cursor-help"
              role="img"
              aria-label={`Anomaly chain: ${generator.anomalyChain ?? 'correlated suspicious events'}`}
              title={`Anomaly chain: ${generator.anomalyChain ?? 'correlated suspicious events'}`}
            >
              <Waypoints size={17} aria-hidden="true" />
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
