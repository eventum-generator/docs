export const SITE_URL = 'https://eventum.run';
export const SITE_NAME = 'Eventum';

// First two sentences of the approved master product description.
export const SITE_DESCRIPTION =
  'Eventum is an open-source platform for generating realistic synthetic data. You describe events in YAML and get a stream of them: logs, metrics, security events, transactions etc.';

const GITHUB_URL = 'https://github.com/eventum-generator/eventum';

/**
 * Normalize a path to the site's trailing-slash routing.
 *
 * Returns a root-relative path with a single leading and trailing
 * slash, mirroring `trailingSlash: true` in the Next.js config so
 * canonical links and sitemap entries match the served URL.
 */
export function canonicalPath(path: string): string {
  const segments = path.split('/').filter((segment) => segment.length > 0);
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`;
}

/** Absolute URL for a page path, normalized with a trailing slash. */
export function pageUrl(path: string): string {
  return `${SITE_URL}${canonicalPath(path)}`;
}

type JsonLd = Record<string, unknown>;

const ORGANIZATION: JsonLd = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  sameAs: [GITHUB_URL],
};

export function organizationSchema(): JsonLd {
  return { '@context': 'https://schema.org', ...ORGANIZATION };
}

export function webSiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}

export function softwareApplicationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Linux, macOS, Windows',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
  };
}

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
}): JsonLd {
  const url = pageUrl(`/blog/${post.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    image: `${SITE_URL}/og/blog/${post.slug}/image.png`,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    publisher: ORGANIZATION,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  };
}

export function courseSchema(course: {
  name: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    url: pageUrl(course.path),
    provider: ORGANIZATION,
  };
}
