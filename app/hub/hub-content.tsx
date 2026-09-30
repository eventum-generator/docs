'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';

import { CategoryFilter } from '@/components/hub/CategoryFilter';
import { FormatFilter } from '@/components/hub/FormatFilter';
import { GeneratorCard } from '@/components/hub/GeneratorCard';
import { HubSearch } from '@/components/hub/HubSearch';
import type { CategoryId } from '@/lib/hub-categories';
import type {
  EventFormat,
  GeneratorMeta,
  OriginalFormat,
} from '@/lib/hub-types';

const PAGE_SIZE = 30;

interface HubContentProps {
  generators: GeneratorMeta[];
}

export default function HubContent({ generators }: HubContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeEventFormats, setActiveEventFormats] = useState<
    Set<EventFormat>
  >(new Set());
  const [activeOriginalFormats, setActiveOriginalFormats] = useState<
    Set<OriginalFormat>
  >(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(searchQuery);

  const filtered = useMemo(() => {
    let result = generators;

    if (activeCategory) {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (activeEventFormats.size > 0) {
      result = result.filter((g) => activeEventFormats.has(g.eventFormat));
    }

    if (activeOriginalFormats.size > 0) {
      result = result.filter(
        (g) =>
          g.originalFormat !== undefined &&
          activeOriginalFormats.has(g.originalFormat)
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
              e.description.toLowerCase().includes(q)
          )
      );
    }

    return result;
  }, [
    generators,
    activeCategory,
    activeEventFormats,
    activeOriginalFormats,
    deferredQuery,
  ]);

  const toggle =
    <T,>(value: T) =>
    (prev: Set<T>) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    };

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    activeCategory,
    activeEventFormats,
    activeOriginalFormats,
    deferredQuery,
  ]);

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
          activeEventFormats={activeEventFormats}
          activeOriginalFormats={activeOriginalFormats}
          onEventFormatToggle={(f) => setActiveEventFormats(toggle(f))}
          onOriginalFormatToggle={(f) => setActiveOriginalFormats(toggle(f))}
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
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
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
