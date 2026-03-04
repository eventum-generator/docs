import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { generators } from '@/lib/hub-data';

export const revalidate = false;

const logoSrc = `data:image/svg+xml;base64,${Buffer.from(readFileSync(path.join(process.cwd(), 'public/logo.svg'))).toString('base64')}`;

function getGenerator(slug: string) {
  return generators.find((g) => g.slug === slug);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const generatorSlug = slug.slice(0, -1).join('/');
  const generator = getGenerator(generatorSlug);
  if (!generator) notFound();

  return generateOGImage({
    title: generator.displayName,
    site: 'Eventum Hub',
    icon: <img src={logoSrc} alt="" width={48} height={48} />,
    primaryColor: 'rgba(130,130,239,0.3)',
    primaryTextColor: 'rgb(130,130,239)',
  });
}

export function generateStaticParams() {
  return generators.map((g) => ({
    slug: [g.slug, 'image.png'],
  }));
}
