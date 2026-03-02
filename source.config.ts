import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
  cover: z.string().optional(),
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogSchema,
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
  },
});
