import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getPageImage, source } from '@/lib/source';

export const revalidate = false;

const logoSrc = `data:image/svg+xml;base64,${Buffer.from(readFileSync(path.join(process.cwd(), 'public/logo.svg'))).toString('base64')}`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'Eventum',
    icon: <img src={logoSrc} alt="" width={48} height={48} />,
    primaryColor: 'rgba(130,130,239,0.3)',
    primaryTextColor: 'rgb(130,130,239)',
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
