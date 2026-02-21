---
name: update-changelog
description: Write changelog entries for a new Eventum release. Analyzes git commits in the backend repo, updates CHANGELOG.md, and creates a docs changelog page. Use when preparing a new version release.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
argument-hint: "[version]"
---

# Update Changelog

You are writing changelog entries for a new Eventum release. This skill updates two files:

1. **Backend CHANGELOG.md** — `../eventum/CHANGELOG.md`
2. **Docs changelog page** — `content/docs/changelog/<version>.mdx`

Use `$ARGUMENTS` as the version number if provided (e.g. "2.0.3"). If not provided, ask the user for the version.

## Step 1: Gather changes

Analyze git commits in the backend repo since the last release tag:

```bash
cd ../eventum
git tag --list 'v*' --sort=-version:refname | head -5    # find latest tag
git log <latest-tag>..HEAD --format='%H %s%n%b---'        # commits since last tag
git diff <latest-tag>..HEAD --stat                         # files changed summary
```

Review each commit and categorize changes into sections:

| Section | Emoji | When to use |
|---------|-------|-------------|
| New features | 🚀 | New user-facing functionality |
| Bug fixes | 🐛 | Corrections to existing behavior |
| Performance | ⚡ | Speed or resource improvements |
| Testing | 🧪 | New or improved tests |
| Architecture | 🏗️ | Internal structural changes |
| Other changes | 📝 | Docs, CI, tooling, cosmetic |

Only include sections that have entries. Skip internal-only changes that have no user relevance (e.g. release script tweaks) — but use your judgment; if a change is borderline, include it under "Other changes".

**Important**: The docs MDX page is user-facing. Keep descriptions a bit more general than `CHANGELOG.md` and avoid overly technical implementation details. Don't include super technical internal changes in the MDX page — save those for `CHANGELOG.md` only. But improving tests coverage notes etc. and small improvements can be included in general descriptions.

## Step 2: Read existing changelogs for format reference

Read both files to match the established format exactly:

- `../eventum/CHANGELOG.md` — for the markdown format and heading style
- `content/docs/changelog/` — read the most recent `.mdx` file for frontmatter and content style

### CHANGELOG.md format

```markdown
## <version> (<YYYY-MM-DD>)

### 🐛 Bug Fixes

- Description of fix — additional context if needed

### 🧪 Testing

- Description of test additions
```

- Use today's date for the release date
- Prepend the new entry above the previous version (after the file header)
- Each bullet starts with a verb (Fix, Add, Update, Remove, Improve, etc.)
- Use backticks for code references (`ClassName`, `--flag`, `file.py`)
- Keep descriptions concise — one line per change, with an em dash (—) separating the "what" from the "why/how" when needed

### Docs MDX page format

```mdx
---
title: 🛠️ <version>
description: Eventum <version> patch release — short summary of key changes.
---

Released **<month> <day>, <year>**

One-sentence summary of the release.

## 🐛 Bug fixes

- **Short label** — description of the fix.

---

## 📝 Other changes

- Description of change.
```

- Use 🎉 emoji in title for major releases, 🚩 for minor, and 🛠️ for patches
- Add horizontal rules (`---`) between sections
- Use **bold labels** at the start of each bullet in the MDX version for readability
- Link to relevant docs pages where applicable: `[text](/docs/path/to/page)`
- The `meta.json` in the changelog folder uses `"z...a"` sort, so no navigation update is needed — the new page appears automatically

## Step 3: Write the files

1. **Update `../eventum/CHANGELOG.md`** — insert the new version entry above the previous one
2. **Create `content/docs/changelog/<version>.mdx`** — the docs page

## Step 4: Verify

Run `pnpm build` in the docs project root to verify the new page builds correctly. If the build fails, fix the issue and rebuild.
