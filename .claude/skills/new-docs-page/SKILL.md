---
name: new-docs-page
description: Add a new documentation page to the Eventum docs site — MDX content, navigation, cross-references, build verification.
user-invocable: true
disable-model-invocation: true
argument-hint: "<section>/<page-name> (e.g. plugins/input/kafka, tutorials/webhook-alerts, core/concepts/batching)"
---

## Add New Documentation Page

Create a new documentation page at the path: **$ARGUMENTS**.

Parse the argument as a path under `content/docs/` (e.g., `plugins/input/kafka` → `content/docs/plugins/input/kafka.mdx`).

### Phase 1: Research

1. Read the existing pages in the same section to understand format, depth, and style:
   ```bash
   ls content/docs/<section>/
   ```
2. Read 1-2 nearby pages to match tone and structure.
3. Read the section's `meta.json` to understand navigation order.
4. If documenting a backend feature, read the relevant source code in `../eventum/`.

### Phase 2: Plan

1. Outline the page structure:
   - What sections will it have?
   - What code examples are needed?
   - What cross-references to other pages?
   - What callouts or diagrams?
2. Present the outline for approval.

### Phase 3: Write

Create the MDX page at `content/docs/<path>.mdx`:

**Frontmatter:**
```yaml
---
title: Page Title
description: One-sentence description for SEO and search.
icon: LucideIconName
---
```

**Content guidelines (approachable guide style):**
- Start with a brief overview: what this is, when you'd use it
- Guide the reader through concepts before diving into reference
- Include concrete input→output examples with real data
- Use code blocks with `title="filename"` for config examples
- Use `<Callout type="info|warn">` for important notes
- Use `<Steps><Step>` for sequential procedures
- Use tables for parameter references (Name, Type, Default, Description)
- Cross-reference related pages with relative links: `[page title](/docs/path/to/page)`
- End with a "What's next" or "See also" section linking to related pages

**Available MDX components:**
- `<Callout type="info|warn">` — info boxes and warnings
- `<Steps><Step>` — numbered step sequences
- `<Cards><Card>` — card grid for linking to related pages
- `<Files><Folder><File>` — file tree diagrams
- `<Tabs><Tab value="...">` — tabbed content (e.g., different config examples)
- `<Accordions><Accordion>` — collapsible sections
- Code blocks with `title="..."` — titled code snippets

### Phase 4: Navigation

1. Add the page to the appropriate `meta.json` file:
   - Read the current `meta.json` in the page's directory
   - Add the new page slug in the correct position
   - If the page is in a new subdirectory, create a `meta.json` for it

2. If this creates a new section, also update the parent `meta.json`.

### Phase 5: Cross-references

Search for existing pages that should link to the new page:

1. Find pages that mention the topic: search `content/docs/` for relevant keywords.
2. Add cross-reference links where appropriate (don't force links — only where they naturally fit).

### Phase 6: Update CLAUDE.md

Update CLAUDE.md files to reflect the new page:

1. **`CLAUDE.md`** (this repo) — Add the new page to the **Content Structure** tree under the appropriate section. If a new subdirectory was created, add it too.
2. If the new page documents a new sidebar tab or section, update the **Sidebar tabs** list.

Reference the "Keeping CLAUDE.md Accurate" section at the bottom of `CLAUDE.md` for the full list of triggers.

### Phase 7: Verify

Run the docs build to verify everything works:

```bash
pnpm build
```

Check for:
- MDX syntax errors
- Broken links
- Missing navigation entries
- Component rendering issues

Fix any build errors before presenting results.

### Important

- Do NOT commit or push unless the user explicitly asks.
- Match the tone and depth of existing pages in the same section.
- Use generic names in examples (not hardcoded environment-specific values).
- Every page should have at least one concrete code example.
- Track progress with the todo list throughout.
