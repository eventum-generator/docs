# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **documentation site** for [Eventum](https://github.com/eventum-generator/eventum) — a synthetic event generation tool. Built with Next.js 16, Fumadocs, and Tailwind CSS 4. Uses static export mode (`output: 'export'`).

Part of a monorepo where the Python backend lives in `../eventum/`.

## Commands

```bash
pnpm dev                  # Dev server on port 3000
pnpm build                # Static build (outputs to out/)
pnpm lint                 # ESLint
pnpm types:check          # Full type check (fumadocs-mdx → next typegen → tsc --noEmit)
pnpm generate-api-docs    # Regenerate API docs from OpenAPI spec (requires bun)
```

## Architecture

### Content Pipeline

MDX content lives in `content/docs/`. Fumadocs MDX processes it via `source.config.ts` with Zod schema validation (using `pageSchema` / `metaSchema` from fumadocs-core). The content source is loaded in `lib/source.ts` with lucide icons and OpenAPI plugins.

API documentation is auto-generated from `public/schemas/eventum-openapi.json` into `content/docs/api/` by running `pnpm generate-api-docs` (uses `fumadocs-openapi` via `scripts/generate-docs.ts`).

### Routing

- `app/(home)/` — Landing page (route group)
- `app/docs/` — Documentation layout and pages
- `app/api/search/` — Search endpoint
- `app/og/` — Open Graph image generation
- `app/llms.txt/` and `app/llms-full.txt/` — LLM-friendly content endpoints

### Key Files

- `lib/source.ts` — Fumadocs source loader, page image helper, LLM text helper
- `lib/layout.shared.tsx` — Shared layout options, GitHub config, nav links
- `lib/openapi.ts` — OpenAPI schema loader (reads from `public/schemas/`)
- `source.config.ts` — Fumadocs MDX configuration, content directory setup

### UI Components

Uses shadcn/ui (New York style) with Radix UI primitives. Component config in `components.json`. UI components in `components/ui/`, page-specific components in `components/pages/`. Custom animated components (GridPattern, LightRays, RotatingText) at top level of `components/`.

## Conventions

- **Package manager**: pnpm
- **Path aliases**: `@/*` maps to project root, `fumadocs-mdx:collections/*` maps to `.source/*`
- **Formatting**: Prettier with single quotes, es5 trailing commas, auto-sorted imports (`@trivago/prettier-plugin-sort-imports`)
- **Linting**: ESLint with next/core-web-vitals, unicorn, sonarjs, and prettier configs
- **Icons**: Lucide React
- **Git**: Main branch is `master`, development on `develop`
