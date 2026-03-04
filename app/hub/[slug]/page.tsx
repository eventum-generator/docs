import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { EventTypesTable } from '@/components/hub/EventTypesTable';
import { QuickStartTabs } from '@/components/hub/QuickStartTabs';
import { RelatedGenerators } from '@/components/hub/RelatedGenerators';
import { SampleOutput } from '@/components/hub/SampleOutput';
import { CATEGORY_MAP } from '@/lib/hub-categories';
import { generators } from '@/lib/hub-data';

function getGenerator(slug: string) {
  return generators.find((g) => g.slug === slug);
}

export default async function GeneratorDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const generator = getGenerator(slug);
  if (!generator) notFound();

  const category = CATEGORY_MAP.get(generator.category);
  const Icon = category?.icon;

  return (
    <div
      role="main"
      className="mx-auto w-full max-w-4xl px-6 py-10 sm:py-14 overflow-y-auto"
    >
      {/* Back link */}
      <Link
        href="/hub"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground/60 transition-colors duration-200 hover:text-fd-foreground"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Hub
      </Link>

      <article className="blog-animate-in">
        {/* Header */}
        <header className="mb-10">
          {/* Category pill */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${category?.color ?? ''}`}
            >
              {Icon && <Icon size={12} />}
              {category?.name}
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-fd-foreground leading-snug sm:text-3xl">
            {generator.displayName}
          </h1>

          <p className="mt-3 text-base text-fd-muted-foreground/70 leading-relaxed">
            {generator.description}
          </p>

          {/* View on GitHub */}
          <div className="mt-4">
            <Link
              href={`https://github.com/eventum-generator/content-packs/tree/master/generators/${generator.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <ExternalLink size={14} />
              View on GitHub
            </Link>
          </div>

          <div className="mt-8 border-b border-fd-border/40" />
        </header>

        {/* Quick Start */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
            Quick Start
          </h2>
          <QuickStartTabs
            slug={generator.slug}
            generatorId={generator.generatorId}
          />
        </section>

        {/* Event Types */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
            Event Types
          </h2>
          <EventTypesTable eventTypes={generator.eventTypes} />
        </section>

        {/* Realism Features */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
            Realism Features
          </h2>
          <ul className="flex flex-col gap-2">
            {generator.realismFeatures.map((feature) => (
              <li
                key={feature}
                className="flex gap-2 text-sm text-fd-muted-foreground/70 leading-relaxed"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fd-primary/50" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Sample Output */}
        {generator.sampleOutputs.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
              Sample Output
            </h2>
            <SampleOutput samples={generator.sampleOutputs} />
          </section>
        )}

        {/* Parameters */}
        {generator.parameters.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
              Parameters
            </h2>
            <div className="overflow-x-auto rounded-lg border border-fd-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fd-border/50 bg-fd-muted/30">
                    <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                      Parameter
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                      Default
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {generator.parameters.map((param) => (
                    <tr
                      key={param.name}
                      className="border-b border-fd-border/30 last:border-b-0"
                    >
                      <td className="px-4 py-2 font-mono text-xs text-fd-primary">
                        {param.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-fd-muted-foreground">
                        {param.defaultValue}
                      </td>
                      <td className="px-4 py-2 text-fd-muted-foreground/70">
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Related Generators */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-fd-foreground">
            Related Generators
          </h2>
          <RelatedGenerators current={generator} all={generators} />
        </section>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return generators.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const generator = getGenerator(slug);
  if (!generator) notFound();

  return {
    title: `${generator.displayName} | Eventum Hub`,
    description: generator.description,
    openGraph: {
      title: `${generator.displayName} | Eventum Hub`,
      description: generator.description,
      type: 'article',
      images: [`/og/hub/${slug}/image.png`],
    },
  };
}
