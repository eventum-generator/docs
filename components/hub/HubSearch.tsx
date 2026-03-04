'use client';

import { Search } from 'lucide-react';

interface HubSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HubSearch({ value, onChange }: HubSearchProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-fd-muted-foreground/50"
      />
      <input
        type="text"
        placeholder="Search generators..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-fd-border/60 bg-fd-background px-3 py-2.5 pl-9 text-sm text-fd-foreground placeholder:text-fd-muted-foreground/50 outline-none transition-colors focus:border-fd-primary/50 focus:ring-1 focus:ring-fd-primary/20"
      />
    </div>
  );
}
