'use client';

import { CATEGORIES } from '@/lib/hub-categories';
import type { CategoryId } from '@/lib/hub-categories';
import type { GeneratorMeta } from '@/lib/hub-types';

interface CategoryFilterProps {
  activeCategory: CategoryId | null;
  onCategoryChange: (category: CategoryId | null) => void;
  generators: GeneratorMeta[];
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  generators,
}: CategoryFilterProps) {
  const categoryCounts = new Map<CategoryId, number>();
  for (const g of generators) {
    categoryCounts.set(g.category, (categoryCounts.get(g.category) ?? 0) + 1);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${
          activeCategory === null
            ? 'border-fd-primary/30 bg-fd-primary/10 font-medium text-fd-foreground'
            : 'border-fd-border/50 text-fd-muted-foreground opacity-40 hover:opacity-100 hover:border-fd-border hover:text-fd-foreground'
        }`}
      >
        All
        <span className="text-xs opacity-60">{generators.length}</span>
      </button>
      {CATEGORIES.filter((c) => categoryCounts.has(c.id)).map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() =>
              onCategoryChange(cat.id === activeCategory ? null : cat.id)
            }
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${
              activeCategory === cat.id
                ? `border-transparent font-medium ${cat.color}`
                : `border-fd-border/50 ${cat.color} hover:border-transparent ${activeCategory !== null ? 'opacity-40 hover:opacity-100' : ''}`
            }`}
          >
            <Icon size={12} />
            {cat.name}
            <span className="text-xs opacity-60">
              {categoryCounts.get(cat.id)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
