'use client';

import type {
  EventFormat,
  GeneratorMeta,
  OriginalFormat,
} from '@/lib/hub-types';

interface FormatFilterProps {
  activeEventFormats: Set<EventFormat>;
  activeOriginalFormats: Set<OriginalFormat>;
  onEventFormatToggle: (format: EventFormat) => void;
  onOriginalFormatToggle: (format: OriginalFormat) => void;
  generators: GeneratorMeta[];
}

function countBy<T extends string>(values: (T | undefined)[]): [T, number][] {
  const counts = new Map<T, number>();
  for (const value of values) {
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].toSorted((a, b) => b[1] - a[1]);
}

interface FilterRowProps<T extends string> {
  label: string;
  hint: string;
  options: [T, number][];
  active: Set<T>;
  onToggle: (value: T) => void;
}

function FilterRow<T extends string>({
  label,
  hint,
  options,
  active,
  onToggle,
}: FilterRowProps<T>) {
  if (options.length <= 1) return null;
  const hasActive = active.size > 0;

  return (
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 cursor-help text-xs font-medium text-fd-muted-foreground/50"
        title={hint}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([value, count]) => {
          const isActive = active.has(value);
          let stateClass =
            'border-fd-border/50 text-fd-muted-foreground hover:border-fd-border hover:text-fd-foreground';
          if (isActive) {
            stateClass =
              'border-fd-primary/30 bg-fd-primary/10 font-medium text-fd-foreground';
          } else if (hasActive) {
            stateClass += ' opacity-40 hover:opacity-100';
          }
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${stateClass}`}
            >
              {value}
              <span className="text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FormatFilter({
  activeEventFormats,
  activeOriginalFormats,
  onEventFormatToggle,
  onOriginalFormatToggle,
  generators,
}: FormatFilterProps) {
  return (
    <>
      <FilterRow
        label="Event"
        hint="Structure of the generated event"
        options={countBy(generators.map((g) => g.eventFormat))}
        active={activeEventFormats}
        onToggle={onEventFormatToggle}
      />
      <FilterRow
        label="Original"
        hint="Format of the native source record kept in event.original"
        options={countBy(generators.map((g) => g.originalFormat))}
        active={activeOriginalFormats}
        onToggle={onOriginalFormatToggle}
      />
    </>
  );
}
