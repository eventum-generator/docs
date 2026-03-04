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

      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
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
      </div>
    </Link>
  );
}
