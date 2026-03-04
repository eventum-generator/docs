import Link from 'next/link';

import { CATEGORY_MAP } from '@/lib/hub-categories';
import type { GeneratorMeta } from '@/lib/hub-types';

interface RelatedGeneratorsProps {
  current: GeneratorMeta;
  all: GeneratorMeta[];
}

export function RelatedGenerators({ current, all }: RelatedGeneratorsProps) {
  // Same category first (excluding current), then other categories
  const sameCategory = all.filter(
    (g) => g.category === current.category && g.slug !== current.slug,
  );
  const otherCategory = all.filter(
    (g) => g.category !== current.category && g.slug !== current.slug,
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {related.map((g) => {
        const category = CATEGORY_MAP.get(g.category);
        const Icon = category?.icon;
        return (
          <Link
            key={g.slug}
            href={`/hub/${g.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-fd-border/50 p-4 transition-all duration-200 hover:border-fd-border hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon
                  size={14}
                  className="text-fd-primary"
                />
              )}
              <span className="text-xs text-fd-muted-foreground/60">
                {category?.name}
              </span>
            </div>
            <h4 className="text-sm font-medium text-fd-foreground group-hover:text-fd-primary transition-colors">
              {g.displayName}
            </h4>
            <p className="text-xs text-fd-muted-foreground/60 line-clamp-2">
              {g.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
