# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Eventum

[Eventum](https://github.com/eventum-generator/eventum) is a **data generation platform** that produces synthetic events and delivers them anywhere — in real time or in batch. It generates continuous streams of logs for SIEMs, seeds staging databases with realistic data, or stress-tests pipelines with high-throughput traffic. Everything is defined in YAML, no code required.

**Core pipeline**: Input (scheduling) → Event (data generation) → Output (delivery). Each stage is a plugin — swap, combine, or extend independently.

**Two modes**: **live mode** streams events at scheduled timestamps in real time; **sample mode** generates everything as fast as possible.

**Application mode** (`eventum run`) starts a server on port **9474** with REST API, WebSocket monitoring, and **Eventum Studio** (web UI) for managing multiple generators.

## Monorepo Structure

This is the **documentation site** repo. It lives alongside two sibling repos under a shared parent:

```
eventum-generator/
  docs/           ← THIS REPO: Next.js documentation site (eventum.run)
  eventum/        ← Python backend: the Eventum tool itself
  content-packs/  ← Ready-to-use generator projects (SIEM data sources)
```

- **Docs** (`docs/`): Next.js 16 + Fumadocs + Tailwind CSS 4 static site. Deployed to [eventum.run](https://eventum.run).
- **Backend** (`../eventum/`): Python package `eventum-generator`. FastAPI server, plugin system, CLI.
- **Content Packs** (`../content-packs/`): Collection of generator projects producing ECS-compatible synthetic events across different categories (Windows, Linux, Web, Network, Security, Email, VPN, etc.).

## Commands

### Docs site

```bash
pnpm dev                  # Dev server on port 3000
pnpm build                # Static build → out/ (ALWAYS run after content changes)
pnpm lint                 # ESLint (next/core-web-vitals + unicorn + sonarjs + prettier)
pnpm types:check          # Full type check: fumadocs-mdx → next typegen → tsc --noEmit
pnpm generate-api-docs    # Regenerate API docs from OpenAPI spec (requires bun)
```

### Python backend (from `../eventum/`)

```bash
uv run pytest             # Run tests with coverage
uv run ruff check         # Lint (ruff, select=ALL)
uv run mypy eventum       # Type check (pydantic plugin)
```

### Content packs (from `../content-packs/`)

```bash
eventum generate --path generators/<name>/generator.yml --id test --live-mode
eventum generate --path generators/<name>/generator.yml --id test --no-live-mode
```

## Docs Site Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (static export) | 16.1.6 |
| Content | Fumadocs MDX + Core + UI | 14.2.7 / 16.6.2 |
| API Docs | fumadocs-openapi | 10.3.6 |
| Styling | Tailwind CSS 4 (@tailwindcss/postcss) | 4.1.18 |
| UI Components | shadcn/ui (New York style) + Radix UI | — |
| Animations | motion/react, ogl (WebGL) | 12.23.12 / 1.0.11 |
| Syntax Highlighting | Shiki | 3.22.0 |
| Diagrams | Mermaid (client-side, theme-aware) | 11.12.3 |
| Icons | Lucide React | 0.563.0 |
| React | React 19 | 19.2.4 |

### Content Pipeline

MDX content lives in `content/docs/`. Fumadocs MDX processes it via `source.config.ts`:
- Schema: `pageSchema` (docs) and `metaSchema` (navigation) from fumadocs-core
- Postprocessing: `includeProcessedMarkdown: true` (enables LLM text endpoints)
- Remark plugins: `remarkMdxMermaid` for diagram support
- Source loader in `lib/source.ts` with `lucideIconsPlugin()` and `openapiPlugin()`

API docs are auto-generated from `public/schemas/eventum-openapi.json` into `content/docs/api/` by `scripts/generate-docs.ts` (uses `fumadocs-openapi` `generateFiles()`, grouped by route).

### Routing

```
app/
  layout.tsx                    # Root: RootProvider, Poppins font, static search
  global.css                    # Tailwind imports, oklch color system, dark mode
  (home)/
    layout.tsx                  # HomeLayout (fumadocs-ui/layouts/home)
    page.tsx                    # Landing: GridPattern, LightRays (WebGL), RotatingPhrases, Features carousel
  docs/
    layout.tsx                  # DocsLayout with sidebar tabs (6 sections)
    [[...slug]]/
      page.tsx                  # Dynamic docs pages: MDX body + LLM copy button + view options
  api/search/
    route.ts                    # Static full-text search (Orama via fumadocs-core)
  og/docs/[...slug]/
    route.tsx                   # OG image generation (purple #8282ef theme)
  llms.txt/
    route.ts                    # LLM index: all page titles + descriptions
  llms-full.txt/
    route.ts                    # LLM full: complete markdown of all pages
  llms.mdx/docs/[[...slug]]/
    route.ts                    # Individual page markdown (Content-Type: text/markdown)
```

**Sidebar tabs** (defined in `app/docs/layout.tsx`):
1. **Overview** (BookOpen) → `/docs`
2. **Core** (Box) → `/docs/core`
3. **Plugins** (Blocks) → `/docs/plugins`
4. **Eventum Studio** (AppWindow) → `/docs/studio`
5. **API** (CodeXml) → `/docs/api`
6. **Tutorials** (GraduationCap) → `/docs/tutorials`

### Content Structure

```
content/docs/
  index.mdx                     # Getting started
  faq.mdx                       # FAQ
  glossary.mdx                  # Terminology
  meta.json                     # Root nav with Lucide icons and separators
  core/
    introduction/               # installation, features, first-run
    concepts/                   # generator, plugins, scheduling, output, producing
    config/                     # eventum.yml, generator.yml, parameters, secrets, project-structure, startup.yml
    cli/                        # eventum-generate, eventum-run, eventum-keyring
    whats-next.mdx
  plugins/
    input/                      # cron, http, linspace, static, time-patterns, timer, timestamps (7)
    event/                      # template, script, replay (3)
    output/                     # stdout, file, http, clickhouse, opensearch (5)
    formatters.mdx              # Formatter overview
  studio/                       # overview, instances, projects, settings
  api/                          # AUTO-GENERATED from OpenAPI (auth, generators, configs, instance, preview, secrets, startup)
  tutorials/                    # csv-dataset, iot-telemetry, load-testing, siem-events, telegram-alerts, web-clickstream
  changelog/                    # 2.0.0, 2.0.1, 2.0.2, 2.1.0
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/source.ts` | Fumadocs source loader + `getPageImage()` + `getLLMText()` helpers |
| `lib/layout.shared.tsx` | `baseOptions()` for nav, `gitConfig` / `docsGitConfig` (GitHub URLs) |
| `lib/openapi.ts` | `createOpenAPI()` from `public/schemas/eventum-openapi.json` |
| `lib/cn.ts` | `twMerge` re-export as `cn` |
| `lib/utils.ts` | `clsx` + `twMerge` classname helper |
| `source.config.ts` | Fumadocs MDX config: content dir, schema, mermaid plugin |
| `next.config.mjs` | Static export (`output: 'export'`), trailing slashes, strict mode |
| `mdx-components.tsx` | MDX component registry: Accordion, Steps, Files, APIPage, Mermaid, ThemedImage, Lucide icons |
| `scripts/generate-docs.ts` | Auto-generates `content/docs/api/` from OpenAPI spec (requires bun) |
| `app/global.css` | Tailwind + fumadocs CSS imports, oklch colors, dark mode (`@custom-variant dark`) |

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `GridPattern` | `components/GridPattern.tsx` | SVG grid background pattern (home page) |
| `LightRays` | `components/LightRays.tsx` | WebGL animated light rays via ogl (dark mode only) |
| `RotatingText` | `components/RotatingText.tsx` | Character-level text animation via motion/react |
| `ThemedImage` | `components/ThemedImage.tsx` | Light/dark image switcher (`dark:hidden` / `not-dark:hidden`) |
| `Mermaid` | `components/mdx/mermaid.tsx` | Client-side mermaid diagram renderer (theme-aware, lazy-loaded) |
| `APIPage` | `components/api-page.tsx` | fumadocs-openapi UI wrapper |
| `LLMCopyButton` | `components/ai/page-actions.tsx` | Copy page markdown to clipboard |
| `ViewOptions` | `components/ai/page-actions.tsx` | Popover with ChatGPT and GitHub source links |
| `RotatingPhrases` | `components/pages/home/RotatingPhrases.tsx` | Animated phrases on landing page |
| `Features` | `components/pages/home/Features/` | Embla carousel showcasing feature screenshots |
| UI (shadcn) | `components/ui/` | button, carousel, dialog (Radix-based) |

### Build Process

1. `fumadocs-mdx` processes `content/docs/` → `.source/` (auto-generated, gitignored)
2. `next build` compiles with static export → `out/` directory
3. Ready for deployment to any static host

**Important**: `.source/` is auto-generated. Never edit files in that directory. The `postinstall` hook runs `fumadocs-mdx` to regenerate it.

## Eventum Backend Architecture

### Package Structure

```
eventum/eventum/
  __init__.py                   # Version (dynamic via hatch)
  api/                          # FastAPI REST API
    main.py                     # build_api_app() — assembles routers
    routers/                    # Route handlers by domain
      auth/                     # Login, token management
      generators/               # Generator control (start/stop/status) + WebSocket
      generator_configs/        # Config CRUD
      instance/                 # Instance info + WebSocket
      preview/                  # Config validation/preview
      startup/                  # Startup config management
      secrets/                  # Secret CRUD
      docs/                     # API documentation
  app/                          # Application layer
    main.py                     # App class — orchestrates generators + server
    manager.py                  # GeneratorManager — lifecycle for multiple generators
    hooks.py                    # InstanceHooks TypedDict (get_settings_file_path, terminate, restart)
    models/
      settings.py               # Settings (server, generation, log, path)
      parameters/
        path.py                 # PathParameters (logs, startup, generators_dir, keyring_cryptfile)
        server.py               # ServerParameters (host, port, ssl, auth)
  cli/                          # Click CLI
    commands/
      eventum.py                # `eventum run` and `eventum generate` commands
      eventum_keyring.py        # `eventum-keyring` (set/get/list secrets)
    pydantic_converter.py       # Click ↔ Pydantic model bridge
  core/                         # Generation engine
    config.py                   # GeneratorConfig (input, event, output — plugin configs)
    config_loader.py            # load() — YAML + Jinja2 substitution (${params.*}, ${secrets.*})
    generator.py                # Generator class — thread-wrapped lifecycle
    executor.py                 # Executor — async pipeline: input → event → output (uvloop + aiostream)
    parameters.py               # GeneratorParameters, GenerationParameters, BatchParameters, QueueParameters
    plugins_initializer.py      # init_plugins() → InitializedPlugins dataclass
  plugins/                      # Plugin system
    base/plugin.py              # Plugin ABC (Generic[ConfigT, ParamsT])
    registry.py                 # PluginsRegistry (auto-registration via __init_subclass__)
    loader.py                   # load_*_plugin(), get_*_plugin_names() (cached)
    input/                      # INPUT plugins — generate timestamps as NDArray[datetime64]
      base/plugin.py            # InputPlugin.generate() yields timestamp batches
      plugins/
        static/                 # Static count of current timestamps
        timer/                  # Timer-based with interval
        cron/                   # Cron expression scheduling
        linspace/               # Linear space of timestamps
        time_patterns/          # Statistical time curves
        http/                   # HTTP-triggered timestamps
        timestamps/             # Direct timestamp input
    event/                      # EVENT plugins — produce event strings
      base/plugin.py            # EventPlugin.produce(params: ProduceParams) → list[str]
      plugins/
        template/               # Jinja2 templates (with Faker, Mimesis, rand modules)
        script/                 # Python script-based generation
        replay/                 # Replay events from file
    output/                     # OUTPUT plugins — write events + formatting
      base/plugin.py            # OutputPlugin — async open/write/close
      plugins/
        stdout/                 # Print to stdout/stderr
        file/                   # Write to files
        http/                   # HTTP POST delivery
        opensearch/             # OpenSearch bulk API
        clickhouse/             # ClickHouse insert
      formatters/               # Event formatters (JSON, CSV, etc.)
  server/                       # Server wrapper
    main.py                     # build_server_app() — combines API + UI
  security/                     # Encrypted keyring for secrets
  logging/                      # Structured logging (structlog)
  ui/                           # Web UI source (Eventum Studio)
  utils/                        # Shared utilities
```

### Key Models

| Model | Import | Description |
|-------|--------|-------------|
| `GeneratorConfig` | `eventum.core.config` | Pipeline config: `input` (list), `event` (single), `output` (list). Keys must be real plugin names. |
| `GeneratorParameters` | `eventum.core.parameters` | Runtime params: id, path, timezone, live_mode, batch, queue, keep_order, max_concurrency |
| `Settings` | `eventum.app.models.settings` | App config: server, generation, log, path |
| `ServerParameters` | `eventum.app.models.parameters.server` | Host (`0.0.0.0`), port (`9474`), SSL, auth (default: `eventum:eventum`) |
| `PathParameters` | `eventum.app.models.parameters.path` | Logs, startup YAML, generators dir, keyring file. **All paths must be absolute.** |
| `ProduceParams` | `eventum.plugins.event.base.plugin` | TypedDict: `timestamp` (datetime) + `tags` (tuple[str, ...]) |
| `GeneratorManager` | `eventum.app.manager` | Multi-generator lifecycle: add/remove/start/stop/bulk operations |
| `InstanceHooks` | `eventum.app.hooks` | TypedDict callbacks: get_settings_file_path, terminate, restart |

### Plugin System Details

- **Registration**: Automatic via `__init_subclass__`. Module path must be `eventum.plugins.<type>.plugins.<name>.plugin`.
- **Config validation**: `GeneratorConfig` keys must match registered plugin names (e.g., `cron`, `template`, `stdout` — not arbitrary names).
- **Config loading**: YAML with Jinja2 substitution for `${params.*}` and `${secrets.*}` tokens.
- **Base path**: Plugins receive `base_path` (generator config directory). Relative paths resolve against it.
- **Execution flow**: Input plugins yield `NDArray[datetime64]` batches → Event plugin's `produce()` returns `list[str]` → Output plugins `write()` asynchronously with configurable concurrency.
- **Async model**: Output uses `uvloop` + `aiostream`. Input/event run synchronously in threads.
- **Formatters**: Output plugins can have formatters (JSON, CSV, etc.) that transform events before writing.

### CLI Entry Points

```
eventum                         # Main CLI group
  run --config <path>           # Start app mode (server + generators)
  generate [OPTIONS]            # Run single generator without server
    --id <id>                   # Required: unique generator ID
    --path <path>               # Required: path to generator.yml
    --timezone <tz>             # Default: UTC
    --live-mode / --no-live-mode
    --batch-size <n>            # Default: 10000
    --batch-delay <s>           # Default: 1.0
    --keep-order / --no-keep-order
    --max-concurrency <n>       # Default: 100

eventum-keyring                 # Secret management
  set <name>                    # Store secret
  get <name>                    # Retrieve secret
  list                          # List all secrets
```

### Python Dependencies (key ones)

FastAPI + Uvicorn (server), NumPy (timestamp arrays), Pydantic (models), Faker + Mimesis (data generation), Jinja2 (templates), croniter (scheduling), clickhouse-connect (ClickHouse output), aiostream + uvloop (async pipeline), structlog (logging), PyYAML + msgspec (serialization), keyring + keyrings-cryptfile (secrets).

**Build system**: Hatchling. **Python**: >=3.13. **Linting**: Ruff (ALL rules, single quotes, 79 char line). **Testing**: pytest with coverage + asyncio + httpx mocking.

## Content Packs

The `../content-packs/` repo contains ready-to-use generators.

All output is **ECS-compatible JSON** (Elastic Common Schema). Each generator is self-contained with `generator.yml`, Jinja2 templates, sample data, and documentation.

**Realism techniques**: Weighted event distributions, correlated sessions via `shared` state, `module.rand.weighted_choice()`, sample CSV/JSON data, monotonic counters, Faker/Mimesis for realistic names.

## Conventions

### Docs site

- **Package manager**: pnpm
- **Path aliases**: `@/*` → project root, `fumadocs-mdx:collections/*` → `.source/*`
- **Formatting**: Prettier — single quotes, es5 trailing commas, auto-sorted imports (`@trivago/prettier-plugin-sort-imports`). Import order: external packages first, then `@/` and relative.
- **Linting**: ESLint flat config — next/core-web-vitals, unicorn (filename-case off, prevent-abbreviations off, no-null off), sonarjs (void-use off), prettier. Ignores: `.next`, `out`, `build`, `.source`.
- **Icons**: Lucide React (used in nav, sidebar tabs, MDX content)
- **Themes**: oklch color model in `global.css`. Custom variant: `@custom-variant dark (&:is(.dark *))`.
- **Font**: Poppins 500, latin subset only.
- **Static export**: `output: 'export'` + `trailingSlash: true`. No server-side rendering.
- **Search**: Static (Orama-based, built at compile time).

### Python backend

- **Package manager**: uv
- **Style**: Ruff with ALL rules selected, single quotes, 79 char lines
- **Types**: Pydantic models (frozen, extra='forbid'), mypy with pydantic plugin
- **Testing**: pytest + pytest-asyncio + pytest-cov + pytest-httpx
- **Changelog**: git-cliff with conventional commits

### Git

- **Main branch**: `master`
- **Development branch**: `develop`
- **GitHub org**: `eventum-generator` (repos: `eventum`, `docs`, `content-packs`)
- Don't commit unless explicitly asked

## Keeping CLAUDE.md Accurate

This file is the primary context for AI tools working on the codebase. It must stay current. Update it when:

- **Tech stack version bump** — update versions in the tech stack table (compare with `package.json`)
- **New/removed docs page or section** — update the content structure tree
- **New component** — update the components table
- **Routing change** — update the routing section
- **New sidebar tab** — update sidebar tabs list
- **Content-packs change** — update generator count/table if generators were added or removed
- **New changelog version** — add to the changelog list in the content structure tree
- **Key file added/renamed** — update the key files table
