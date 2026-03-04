import type { Metadata } from 'next';
import { Layers, Package } from 'lucide-react';

import { generators } from '@/lib/hub-data';

import HubContent from './hub-content';

export const metadata: Metadata = {
  title: 'Eventum Hub',
  description:
    'Production-quality synthetic data for testing, development, and training. Browse ready-to-use event generators across multiple categories.',
};

const categoryCount = new Set(generators.map((g) => g.category)).size;

export default function HubPage() {
  return (
    <div
      role="main"
      className="mx-auto max-w-7xl px-6 py-10 sm:py-14 overflow-y-auto"
    >
      {/* Hero */}
      <div className="mb-10 blog-animate-in">
        <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
          Eventum Hub
        </h1>
        <p className="mt-3 max-w-2xl text-base text-fd-muted-foreground/70 leading-relaxed">
          Production-quality synthetic data for testing, development, and
          training. One command to start generating realistic, schema-compliant
          events from any source.
        </p>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-5">
          <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
            <Package size={16} className="text-fd-primary" />
            <span className="font-medium text-fd-foreground">
              {generators.length}
            </span>{' '}
            generators
          </div>
          <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
            <Layers size={16} className="text-fd-primary" />
            <span className="font-medium text-fd-foreground">
              {categoryCount}
            </span>{' '}
            categories
          </div>
        </div>
      </div>

      {/* Catalog */}
      <HubContent generators={generators} />

      {/* Disclaimer */}
      <p className="mt-16 text-center text-xs text-fd-muted-foreground/40 leading-relaxed">
        All product names, logos, and brands are property of their respective
        owners. Eventum is not affiliated with or endorsed by any of them.
      </p>
    </div>
  );
}
