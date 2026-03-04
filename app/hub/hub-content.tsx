'use client';

import { useEffect, useDeferredValue, useMemo, useState } from 'react';

import { CategoryFilter } from '@/components/hub/CategoryFilter';
import { FormatFilter } from '@/components/hub/FormatFilter';
import { GeneratorCard } from '@/components/hub/GeneratorCard';
import { HubSearch } from '@/components/hub/HubSearch';
import type { CategoryId } from '@/lib/hub-categories';
import type { GeneratorMeta } from '@/lib/hub-types';

const PAGE_SIZE = 30;

interface HubContentProps {
  generators: GeneratorMeta[];
}

export default function HubContent({ generators }: HubContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(
    null,
  );
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(searchQuery);

  const filtered = useMemo(() => {
    let result = generators;

    if (activeCategory) {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (activeFormats.size > 0) {
      result = result.filter((g) =>
        [...activeFormats].every((f) => g.format.includes(f)),
      );
    }

    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.displayName.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.dataSource.toLowerCase().includes(q) ||
          g.slug.includes(q) ||
          g.eventTypes.some(
            (e) =>
              e.id.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q),
          ),
      );
    }

    return result;
  }, [generators, activeCategory, activeFormats, deferredQuery]);

  const handleFormatToggle = (format: string) => {
    setActiveFormats((prev) => {
      const next = new Set(prev);
      if (next.has(format)) {
        next.delete(format);
      } else {
        next.add(format);
      }
      return next;
    });
  };

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeFormats, deferredQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-6">
      <HubSearch value={searchQuery} onChange={setSearchQuery} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-fd-muted-foreground/50">
            Categories
          </span>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            generators={generators}
          />
        </div>
        <FormatFilter
          activeFormats={activeFormats}
          onFormatToggle={handleFormatToggle}
          generators={generators}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-fd-muted-foreground/60">
          {deferredQuery
            ? `No generators match "${deferredQuery}". Try a different search.`
            : 'No generators in this category.'}
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((g, i) => (
              <GeneratorCard
                key={g.slug}
                generator={g}
                index={i < PAGE_SIZE ? i : 0}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => c + PAGE_SIZE)
                }
                className="rounded-full border border-fd-border/50 px-6 py-2 text-sm text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-border transition-colors"
              >
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
