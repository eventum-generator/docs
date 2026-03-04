'use client';

import type { GeneratorMeta } from '@/lib/hub-types';

interface FormatFilterProps {
  activeFormats: Set<string>;
  onFormatToggle: (format: string) => void;
  generators: GeneratorMeta[];
}

export function FormatFilter({
  activeFormats,
  onFormatToggle,
  generators,
}: FormatFilterProps) {
  const formatCounts = new Map<string, number>();
  for (const g of generators) {
    for (const tag of g.format) {
      formatCounts.set(tag, (formatCounts.get(tag) ?? 0) + 1);
    }
  }

  const formats = [...formatCounts.entries()].sort((a, b) => b[1] - a[1]);

  if (formats.length <= 1) return null;

  const hasActive = activeFormats.size > 0;

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-xs font-medium text-fd-muted-foreground/50">
        Formats
      </span>
      <div className="flex flex-wrap gap-1.5">
      {formats.map(([tag, count]) => {
        const isActive = activeFormats.has(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onFormatToggle(tag)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${
              isActive
                ? 'border-fd-primary/30 bg-fd-primary/10 font-medium text-fd-foreground'
                : `border-fd-border/50 text-fd-muted-foreground hover:border-fd-border hover:text-fd-foreground ${hasActive ? 'opacity-40 hover:opacity-100' : ''}`
            }`}
          >
            {tag}
            <span className="text-xs opacity-60">{count}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
