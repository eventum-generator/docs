# Eventum Learn — Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Fresh implementer subagent per task, task review (spec + quality) after each, broad whole-branch review at the end. Steps use `### Task N.M` briefs.

**Goal:** Complete the "Eventum Learn" course by writing the Phase 3 lessons — the remaining Foundations concepts, the remaining format guides, the delivery-transport lessons, and the additive rewrites of the last three scenario tutorials — filling out the 5-track arc to the full lesson map in the design spec.

**Architecture:** Phase 3 adds cluster leaves under the five existing pillars (Foundations/Formats/Realism/Delivery/Scenarios). No new pillars, so the Course JSON-LD (6 pillars) is untouched. Work continues on `feat/learning-course` (PR #45 grows into the full course); Phases 1+2 are already present in the working tree, so cluster↔pillar and cluster↔cluster interlinks resolve locally.

**Tech Stack:** Next.js + Fumadocs MDX under `content/docs/tutorials/`. Verification: `pnpm types:check` per task; full `pnpm build` only as a final controller step. Facts verified against primary sources (RFC/vendor specs, Elastic/AWS docs, and the content-pack generators that already model each source).

## Global Constraints

Every task's requirements implicitly include this section. Reviewers: use it as the attention lens.

- **One primary query per lesson.** Title / H1 / description target one primary search query; H2s target secondary sub-queries (featured-snippet structure). Query targets are named per task, taken verbatim from the design spec §6.
- **Lesson anatomy** (design spec §7): hook/pain (lead with substance) → theory/explainer (accurate, diagram where it helps) → "how in Eventum" (concrete `generator.yml` + templates) → the result (a real generated output block) → what's next (cluster↔pillar links, reference, Hub) → FAQ where real questions exist.
- **Docs style** (`.claude/rules/docs/mdx.md` + the docs feedback memories): end-user language, not engine jargon (`Plugin.produce()`, `FSM picker`, `expand_dotted_keys`); formal register (no "live in", "out of the box", "hands you", "for real"); concrete action+outcome, not hollow umbrellas; no implementation details / internal edge-cases / output-field enumerations; overview sections stay high-level.
- **Dashes:** single hyphen `-` in code/config; em dash `—` allowed in MDX prose only. **No hard-wrapping** of prose — one paragraph per line, let the renderer wrap.
- **Fumadocs components** over raw HTML: `<Card>/<Cards>`, `<Callout>`, `<Steps>/<Step>`, `<Files>`, `<Accordions>/<Accordion>`, `<Tabs>/<Tab>`, `<Mermaid>`, `<ThemedImage>`. Parameter tables use 5 columns `Name | Type | Default | Constraints | Description` with `—` where N/A. A lone `<Card>` renders full-width only WITHOUT a `<Cards>` wrapper; two or more cards go in `<Cards>` (2-col grid).
- **Frontmatter:** `title` + `description` only (quote the title when it contains a colon). No `icon` on cluster leaves. No inline `JsonLd` — Article/Course JSON-LD is emitted automatically by the layout; do not hand-add it.
- **First-source verification.** Format/RFC/schema facts must be checked against the authoritative source AND the matching content-pack generator (named per task) — never invented. Inaccurate explainers hurt authority (design spec §13).
- **Additive rewrites** (Track E): keep the working example, layer the teaching (explainer + FAQ + interlinks + primary-query reframe) on top, do not gut a runnable tutorial. Fix only what is broken or drifted.
- **eventum#178 (OPEN):** FSM comparison conditions (`eq`/`gt`/`ge`/`lt`/`le`) on dotted state keys (`shared.X`) fail validation. Do NOT write any transition `when:` that compares a dotted state key. The working pattern already in the course (`realism/sessions.mdx`): compute the threshold inside the Jinja template, set a boolean flag in `shared`, and test it with `when: { defined: shared.flag }`. Use that, or `chance`/`spin`/`all` modes. This also governs the web-clickstream rewrite (Task 4.1), whose current example uses the broken pattern.
- **Cross-cutting mirror** (per new lesson): add its slug to the track's `meta.json` `pages` array (or it stays hidden); add/refresh a `<Card>` on the track pillar `index.mdx`; wire bidirectional interlinks (cluster→pillar, pillar→cluster, and cluster↔cluster where the topics reference each other); refresh the relevant blurb on the course overview `tutorials/index.mdx` when the track's format/destination list changes.
- **Verification protocol:** `pnpm types:check` ONLY per task (from `docs/`); NEVER `pnpm build` inside a task subagent (WSL memory). Any full `generator.yml` shown in a lesson must be CLI-verified once, bounded: `timeout 20 uv run eventum generate --path <cfg> --id t --live-mode false` (or a short live run with `timeout`), from the eventum repo. Do NOT `pkill eventum` (a user process runs on the machine). Delete temp files.

---

## Waves

| Wave | Track | Tasks | Lessons |
|------|-------|-------|---------|
| **W1** | A Foundations + C Realism | 1.1-1.4 | logs-vs-metrics-events, streaming-vs-bulk, correlated-events, replay |
| **W2** | B Formats | 2.1-2.4 | apache/nginx access logs, cloudtrail, suricata-eve, auditd (Open Q1: three separate security lessons) |
| **W3** | D Delivery | 3.1-3.2 | syslog over TCP/UDP to collectors, output formatters |
| **W4** | E Scenarios (rewrite) | 4.1-4.3 | web-clickstream, iot-telemetry, telegram-alerts |

W1 briefs are detailed below. W2/W3/W4 are overviews — their detailed `### Task` briefs are appended before dispatching that wave (as Phase 2 did for its later waves), after the wave's targeted source recon (content-pack generators, tcp/udp configs, existing scenario files).

Interlink targets for all Phase 3 lessons already exist in the tree (Phases 1+2), so wave order is not constrained by link dependencies.

---

## Wave 1 — Foundations concepts + Realism mechanics

### Task 1.1: Logs vs metrics vs events

**File:** Create `content/docs/tutorials/foundations/logs-vs-metrics-events.mdx`

**Primary query:** `logs vs metrics` (secondary: `logs vs metrics vs events`, `logs vs events`).

**Anatomy (H2 target structure):**
- Hook: choosing what to generate and where to send it starts with knowing which of the three telemetry shapes you need; the terms are routinely conflated, and the choice drives format, destination, and volume.
- `## Logs, metrics, and events: three shapes of telemetry` — precise definitions. Log = timestamped textual record of a discrete occurrence. Metric = numeric measurement of a system, sampled or aggregated over time. Event = structured record of a discrete occurrence carrying named fields. State the relationship plainly: a log is an event rendered as a line of text; a metric sample is an event whose payload is a measurement at a time. Events are the general shape; logs and metrics are two specializations.
- `## How they differ` — one comparison table (not a 5-col param table): rows = Logs / Metrics / Events; columns = Shape · Typical example · Where it's stored · How it's queried. Keep it high-level and accurate (log store / time-series database / event stream or index).
- `## Where events fit as the common abstraction` — Eventum produces events; the same three-stage pipeline yields a log line, a metric reading, or a structured event depending on the template and formatter. Tie to `/docs/core/concepts/generator`.
- `## Generate each with Eventum` — three short illustrative snippets (a plain log line, a numeric metric reading over time, a structured JSON event), each 6-12 lines, pointing to the sibling lesson that builds it fully rather than repeating a full project: structured events → `foundations/structured-logging`; metric readings with drift → `/docs/tutorials/iot-telemetry`; realistic values → `realism/values`.
- `## FAQ` — "Is a log an event?", "Can Eventum generate metrics?", "What about traces?" (name traces as the third observability signal, note it is outside Eventum's core event/log focus, keep to two sentences).

**Teach / mechanics:** conceptual lesson (Foundations, like the pillar `index` — light on full config). Snippets may use `template` + `module.rand.number.*` + `json`/`plain` formatter; keep them illustrative.

**First source:** the observability signal taxonomy (logs/metrics/traces — widely documented, e.g. OpenTelemetry data model) for definitions; `/docs/core/concepts/generator` for the events-as-abstraction framing. Do not overclaim Eventum as a metrics/TSDB tool — it emits metric-shaped events, it is not a metrics aggregator.

**Interlinks:** In — `foundations/index.mdx` (add a card/Related entry). Out — `foundations/structured-logging`, `/docs/tutorials/iot-telemetry`, `realism/values`, `/docs/tutorials/formats`. Bidirectional: add this lesson to `foundations/index.mdx`.

**Cross-cutting:**
- `foundations/meta.json` → `pages`: `["index", "logs-vs-metrics-events", "structured-logging", "streaming-vs-bulk"]` (this task adds `logs-vs-metrics-events` after `index`; Task 1.2 adds `streaming-vs-bulk` last).
- `foundations/index.mdx`: the "How Eventum generates it" section currently holds a single full-width `<Card>` to structured-logging. Add cards for the two new Foundations lessons; with 3 cards, wrap them in `<Cards>` (grid). Keep the pillar prose high-level.

**Anti-duplication:** don't re-explain structured logging (link it) or live/sample mode (Task 1.2's topic — link it).

**Verification:** `pnpm types:check`. CLI-verify any snippet that is a complete `generator.yml`; illustrative fragments need no run.

---

### Task 1.2: Streaming vs bulk (live vs sample mode)

**File:** Create `content/docs/tutorials/foundations/streaming-vs-bulk.mdx`

**Primary query:** `streaming vs batch test data` (secondary: `live vs sample mode`, `streaming vs bulk data generation`, `generate finite dataset`).

**Anatomy (H2 target structure):**
- Hook: the same generator can feed data two fundamentally different ways — as a continuous paced stream that behaves like a live source, or as a finite bulk dump produced as fast as possible; the choice shapes every downstream test.
- `## Streaming vs bulk: two ways to produce test data` — streaming = continuous, paced to wall-clock, open-ended, mimics a live source; bulk = finite, timing ignored, produced at full speed, a dataset you keep.
- `## When to use each` — comparison table: streaming → real-time pipeline test, SIEM/monitoring feed, stress at a realistic rate, live dashboard demo; bulk → seed a database, build a fixed test dataset, backfill a time range, a CI fixture.
- `## Live mode and sample mode in Eventum` — live mode (default, emits at each timestamp synchronized to the wall clock, `skip_past` skips already-passed timestamps) vs sample mode (`--live-mode false`, ignores timing, finishes as fast as possible). Link the core-concept anchors `/docs/core/concepts/generator#live-mode-default` and `#sample-mode` and the `--live-mode`/`--skip-past` flags on `/docs/core/cli/eventum-generate`; do NOT re-explain the internal queue/backpressure mechanics.
- `## Making a run finite` — continuous inputs (`timer`, `cron`, `time_patterns` with `end: never`) run forever; bound a run with an input that ends (`cron` `count`, `timer` `repeat`, `linspace`/`timestamps` finite ranges) or with sample mode. Show one small before/after.
- `## Same generator, both modes` — one config, the flag flips behavior: seed dev data once (bulk), then feed the same shape live (streaming).
- `## FAQ` — "streaming vs batch data?", "How do I generate a finite dataset?", "Does live mode replay past timestamps?" (`skip_past`).

**Teach / mechanics:** `--live-mode` true/false, `--skip-past`, input plugins that terminate vs run forever. Consolidates the live/sample `<Callout>`s that currently repeat across `realism/{sessions,timing,values}.mdx` into one authoritative lesson (do not rewrite those siblings; this becomes the link target).

**First source:** `/docs/core/concepts/generator.mdx` §Execution modes (verbatim behavior), `/docs/core/cli/eventum-generate.mdx` (`--live-mode` default `true`, `--skip-past` default `true`), `/docs/core/concepts/scheduling.mdx`.

**Interlinks:** In — `foundations/index.mdx`. Out — `/docs/tutorials/delivery` (streaming to a stack), `/docs/tutorials/load-testing` (streaming stress), `/docs/tutorials/csv-dataset` (bulk seed), `/docs/core/concepts/generator#live-mode-default`. Bidirectional with foundations/index.

**Cross-cutting:**
- `foundations/meta.json` → append `streaming-vs-bulk` (final order in Task 1.1).
- `foundations/index.mdx`: card added alongside Task 1.1's.

**Anti-duplication:** don't duplicate the generator concept page's internals (queues, tuning params); link them. Don't re-teach `time_patterns` (realism/timing owns it).

**Verification:** `pnpm types:check`. CLI-verify the finite/streaming behavior with one tiny generator run each way, bounded (`timeout 15 ... --live-mode false` finite; short `timeout` live run).

---

### Task 1.3: Correlated events in a stream

**File:** Create `content/docs/tutorials/realism/correlated-events.mdx`

**Primary query:** `correlated log events` (secondary: `event correlation`, `event.sequence`, `correlate events across a stream`).

**Anatomy (H2 target structure):**
- Hook: real events are not independent — they belong to a flow, a transaction, a chain on one host; flat generation emits unrelated lines, but correlation is exactly what a detection rule, a trace view, or a funnel query keys on.
- `## What correlated events look like` — a shared correlation id across related events, causal ordering, and per-source sequence numbers. Distinguish from `realism/sessions` up front: sessions models ONE user journey in order via FSM; this lesson covers concurrent/interleaved streams and cross-entity correlation (e.g. a src/dst flow, request/response pairs, multi-host).
- `## Correlation identifiers and sequence numbers` — a correlation id (shared UUID) ties related events; `event.sequence` is a strictly increasing counter per host or source (ECS); `related.*` fields are arrays. Keep ECS facts accurate.
- `## Correlate events in Eventum` — mechanics WITHOUT FSM dotted comparisons (eventum#178): keep a pool of in-flight correlations in `shared` state (a dict keyed by correlation id), advance a per-host `event.sequence` counter, and pick templates with `chance`/`all`/`spin`. Concrete example: a network flow (open → transfer → close) sharing a `flow_id` and incrementing a sequence, OR request→response pairs; cap the pool size (`if len(pool) > N: pop`). Mention `globals` for correlation across generators (thread-safe) briefly.
- `## The result` — output block showing several interleaved correlations, each line carrying its shared id and an increasing sequence.
- `## FAQ` — "What is event.sequence?", "Correlate across multiple generators?" (`globals`), "How is this different from simulating sessions?" (link `realism/sessions`).

**Teach / mechanics:** `shared` state as a keyed pool, per-key counters, `module.rand.*`, `mode: chance`/`all`. Explicitly NOT `when: { ge: { "shared.x": n } }` (broken by #178). Cap growing collections.

**First source:** ECS `event.sequence` + `related.*` semantics (content rules §"ECS fields"; verify against Elastic ECS docs); `/docs/core/concepts/producing.mdx` §State management; contrast against `realism/sessions.mdx`.

**Interlinks:** Bidirectional with `realism/sessions` (add a cross-link there too — sessions currently links only forward to web-clickstream; add correlated-events). In — `realism/index.mdx` card. Out — `/docs/tutorials/detection-testing` (correlated attack telemetry), `/docs/tutorials/formats/ecs` (event.sequence field), `/docs/plugins/event/template/state`.

**Cross-cutting:**
- `realism/meta.json` → `pages`: add `correlated-events` (proposed order `["index", "timing", "sessions", "correlated-events", "values", "replay"]`; keep timing→sessions→values existing order intact, insert correlated-events after sessions, replay last — finalize with Task 1.4).
- `realism/index.mdx`: add a `<Card>` (the pillar currently cards timing/sessions/values → becomes a 5-card grid with Task 1.4).

**Anti-duplication:** don't re-teach FSM (sessions owns it) or single-session correlation; this is the concurrent/multi-entity + event.sequence angle.

**Verification:** `pnpm types:check`. CLI-verify the example generator (bounded) — confirm the output shows a shared id and a strictly increasing sequence per source.

---

### Task 1.4: Replay real logs with fresh timestamps

**File:** Create `content/docs/tutorials/realism/replay.mdx`

**Primary query:** `replay logs` (secondary: `log replay`, `replay logs with new timestamps`, `replay historical logs`).

**Anatomy (H2 target structure):**
- Hook: sometimes you already HAVE a real log file — a captured production sample, an incident capture, a golden dataset — but its timestamps are old; generating from scratch reproduces the shape, not that exact sequence. Replay takes the real file and plays it back with current timestamps.
- `## When to replay instead of generate` — replay preserves the exact real content and ordering; generation synthesizes novel, parameterized, unbounded data. Use replay for a captured incident, an exact reproduction, a fixed golden file; generate when you need variety, parameters, or an open-ended stream.
- `## How log replay works` — the `replay` event plugin reads a file line by line and emits each line as an event; with a `timestamp_pattern` (a regex with a named `timestamp` group) and a `timestamp_format` (strftime), it rewrites the matched timestamp to the event's current time; unmatched lines pass through unchanged. Note `repeat` (loop the file) at a high level.
- `## Replay a log with fresh timestamps in Eventum` — full worked example (`<Steps>`): a small source log under `samples/` (a handful of lines with ISO-8601 timestamps), a `generator.yml` with an input plugin driving cadence (`timer`/`cron`) and the `replay` event plugin (`path`, `timestamp_pattern`, `timestamp_format`), and an output. Show the config with correct field names from the config model.
- `## The result` — the original lines re-emitted with rewritten current timestamps.
- `## FAQ` — "Does replay change the log content?" (only the matched timestamp; the rest is verbatim), "Can I loop the file?" (`repeat: true`), "Live or bulk replay?" (link `streaming-vs-bulk`).

**Teach / mechanics (source-verified config):** `replay` event plugin config fields — `path` (Path), `timestamp_pattern` (regex with named group `timestamp`, default None), `timestamp_format` (C89 strftime, default ISO-8601), `repeat` (bool, default False), `chunk_size` (int, default 1048576), `encoding` (default utf_8). Example pattern/format from producing.mdx: `timestamp_pattern: '(?P<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})'`, `timestamp_format: '%Y-%m-%dT%H:%M:%S'`. NO content-pack uses replay — build the source log from scratch.

**First source:** `/docs/core/concepts/producing.mdx` §Replay + §Timestamp replacement (exact syntax); `eventum/plugins/event/plugins/replay/config.py` (field names/defaults).

**Interlinks:** In — `realism/index.mdx` card. Out — `/docs/tutorials/formats` (what you're replaying), `/docs/tutorials/foundations/streaming-vs-bulk` (replay live vs bulk), a scenario link (e.g. detection-testing / test-data-pipeline — replay a captured sample), `/docs/plugins/event/template` sibling reference for the event stage. Bidirectional with realism/index.

**Cross-cutting:**
- `realism/meta.json` → append `replay` (final order in Task 1.3).
- `realism/index.mdx`: add a `<Card>` (5-card grid with Task 1.3). The pillar prose names "three axes" (timing/sessions/values) — replay and correlation are additional realism techniques; adjust the pillar framing minimally so 5 leaves read coherently (e.g. "techniques" rather than a hard "three axes" count) without a heavy rewrite.

**Anti-duplication:** don't re-explain the template plugin; replay is the alternative event source. Don't re-teach live/sample (link streaming-vs-bulk).

**Verification:** `pnpm types:check`. CLI-verify: write the tiny source log, run the replay generator bounded, confirm timestamps are rewritten to current and content is otherwise unchanged.

---

## Wave 2 — Formats (overview; detailed briefs appended before dispatch)

Recon before dispatch: read `content-packs/generators/{web-apache,web-nginx,cloud-aws-cloudtrail,security-suricata,linux-auditd}/` (`generator.yml`, `README.md`, templates/samples) as first sources; read `formats/index.mdx` + `formats/meta.json` for card/nav shape.

### Task 2.1: Apache & Nginx access logs

**File:** Create `content/docs/tutorials/formats/apache-nginx-access-logs.mdx`

**Primary query:** `apache log format` (secondary: `nginx access log sample`, `combined log format`, `common log format`).

**Anatomy (H2 target structure):** hook (a parser/pipeline needs access-log lines shaped exactly right; the real web server is not available or its output is on its schedule) → `## Common Log Format and Combined Log Format` (the raw wire format, field by field) → `## Apache vs Nginx defaults` (comparison table + the caveats) → `## Generate an access log with Eventum` (`<Steps>`: template → raw Combined line via a text formatter) → `## The result` (real captured raw lines) → `## FAQ` → `## Related`.

**First-source facts (verbatim-accurate, from vendor specs — verify against them):**
- **Apache Common Log Format (CLF)** — `LogFormat "%h %l %u %t \"%r\" %>s %b"`: `remote_host  ident(%l, usually -)  authuser  [day/Mon/yyyy:HH:MM:SS +zzzz]  "request-line"  status  bytes(%b, "-" when zero)`. Example: `127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`.
- **Apache Combined** = CLF + `\"%{Referer}i\" \"%{User-agent}i\"` (two more quoted fields appended).
- **Nginx default `log_format combined`** — `$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"` — byte-for-byte the same visible layout as Apache Combined (nginx modeled it on Apache).
- **Caveats (the "care points"):** (1) Apache `%l` is a real (RFC 1413) ident field almost always `-`; nginx has no ident variable, its `-` after `$remote_addr` is a hardcoded literal. (2) Zero-byte body: Apache `%b` prints `-`, nginx `$body_bytes_sent` prints `0` (Apache `%B` also prints `0`). (3) Both default fields count response BODY only, excluding headers (Apache `%O` includes headers, no nginx combined-default equivalent).
- Vendor specs to cite: Apache `https://httpd.apache.org/docs/2.4/logs.html`; Nginx `ngx_http_log_module` docs.

**Teach / mechanics:** generate the RAW access-log text line (NOT ECS JSON). Use the `template` event plugin rendering a Combined-format line, output `file` with the `plain` formatter (the rendered line is already the final text — `plain` passes it through; `json` would be wrong here). Show CLF first, then Combined. Then briefly note the alternative parsed target (see below).

**Key framing (verified):** the content-pack generators `web-apache` and `web-nginx` do NOT emit raw CLF/Combined text — they emit the downstream ECS-parsed JSON document (post-Filebeat/Elastic-Agent, `apache.access` / `nginx.access` datasets). So this lesson teaches the raw wire format from the vendor specs and generates the raw line itself; mention that the Hub's `web-apache`/`web-nginx` generators produce the ECS-parsed form and link them + `formats/ecs`. Do not claim the content-packs emit raw text.

**Interlinks:** In — `formats/index.mdx` card. Out — `/docs/tutorials/formats/ecs` (the parsed target), `/docs/tutorials/formats/ndjson` (if emitting JSON per line instead), `/docs/tutorials/delivery` (ship access logs), `/docs/tutorials/web-clickstream` and `/docs/tutorials/load-testing` (scenarios using web traffic), `/hub` (web-apache/web-nginx). Bidirectional with formats/index.

**Cross-cutting:**
- `formats/meta.json` → append `apache-nginx-access-logs` (order: after `ecs`).
- `formats/index.mdx` → add a `<Card>` to the `<Cards>` grid; update the pillar `description` frontmatter (it enumerates the formats — add Apache/Nginx access logs).
- `tutorials/index.mdx` → the "Formats & schemas" blurb enumerates the formats; add access logs.

**Anti-duplication:** don't re-teach NDJSON/ECS (link them). This lesson is the raw text access-log format.

**Verification:** `pnpm types:check` FROM WORKTREE ROOT. CLI-verify the worked `generator.yml` bounded (`--live-mode false`, `timeout 20`) — confirm the output file holds real Combined-format lines matching the field order taught. Delete temp files. Do NOT `pkill eventum`.

**DECIDED (Open Question 1):** three separate lessons — cloudtrail, suricata-eve, auditd — one primary query each, matching the one-format-one-lesson pattern of the seven existing format lessons.

**Shared framing for all three (verified this session):** the content-pack generators (`cloud-aws-cloudtrail`, `security-suricata`, `linux-auditd`) all emit the ECS / Elastic-integration JSON (the downstream parsed shape), NOT the raw wire format. So each lesson teaches the RAW format from the vendor/spec source, generates the raw shape itself, and mentions the ECS-parsed variant with a link to the Hub generator + `formats/ecs`. Do not present the content-pack ECS output as "the raw format".

Shared cross-cutting for 2.2-2.4: each appends its slug to `formats/meta.json` (order after `apache-nginx-access-logs`); adds a `<Card>` to `formats/index.mdx` + updates the pillar `description`; updates the `tutorials/index.mdx` Formats blurb. Verification each: `pnpm types:check` FROM WORKTREE ROOT + CLI-verify the worked config bounded (`--live-mode false`, `timeout 20`), delete temp files, never `pkill eventum`.

### Task 2.2: AWS CloudTrail log format

**File:** Create `content/docs/tutorials/formats/cloudtrail.mdx`

**Primary query:** `cloudtrail log format` (secondary: `aws cloudtrail log example`, `cloudtrail event structure`, `cloudtrail json format`, `cloudtrail record contents`).

**Anatomy:** hook (validating a CloudTrail parser or a detection written against CloudTrail fields needs records shaped to the exact case; a real AWS account is slow/off-limits and its events arrive on their own schedule) → `## The CloudTrail record format` (the `{"Records": [ ... ]}` envelope wrapping flat camelCase event objects) → `## Key fields of a CloudTrail event` → `## Generate CloudTrail records with Eventum` (`<Steps>`) → `## The result` → `## FAQ` → `## Related`.

**First-source facts (verify against AWS "CloudTrail Record Contents" + "CloudTrail userIdentity Element"):** CloudTrail delivers to S3 as gzipped JSON objects of the form `{"Records": [ {event}, {event}, ... ]}`. Each event is a flat camelCase record: `eventVersion`, `eventTime`, `eventSource`, `eventName`, `awsRegion`, `sourceIPAddress`, `userAgent`, `userIdentity{type, principalId, arn, accountId, accessKeyId, userName, sessionContext}`, `requestParameters`, `responseElements`, `eventID`, `eventType` (`AwsApiCall`, `AwsConsoleSignIn`), `readOnly`, `managementEvent`, `recipientAccountId`, plus `errorCode`/`errorMessage` on failures.

**Teach / mechanics:** teach the raw camelCase record. Two formatter shapes (relate to `delivery/formatters`): to reproduce the exact `{"Records": [...]}` envelope, use `template-batch` with a `{"Records": {{ events }}}` wrapper (only this yields the NAMED `Records` key; `json-batch` gives a bare `[...]` array); to teach the per-record schema as a stream, use `json` (one object per line — the NDJSON view most SIEMs/Athena/CloudWatch consume after the S3 files are exploded). Recommended: lead with a single record via `json` for schema clarity, then show the `template-batch` `Records` wrapper for the authentic S3-delivery shape. Distinguish the two layers explicitly (raw S3 `Records` batch vs per-record camelCase schema vs ECS-normalized ingest).

**Key framing:** `cloud-aws-cloudtrail` emits ECS `aws.cloudtrail.*` (snake_case, `@timestamp`, no `Records`) — NOT raw. Teach raw camelCase from the AWS spec; link the Hub generator + `formats/ecs` + `delivery/opensearch` (the content-pack documents an opensearch output).

**Interlinks:** In — `formats/index.mdx` card. Out — `formats/ndjson` (per-record stream), `formats/ecs` (parsed target), `/docs/plugins/formatters` (template-batch), `/docs/tutorials/delivery/opensearch`, `/docs/tutorials/detection-testing`, `/hub`.

**Verification:** types:check (worktree) + CLI-verify the worked config (if you show the `template-batch` wrapper, confirm the emitted object has the named `Records` array; if single-record `json`, confirm the camelCase fields).

### Task 2.3: Suricata EVE JSON format

**File:** Create `content/docs/tutorials/formats/suricata-eve.mdx`

**Primary query:** `suricata eve json` (secondary: `suricata log format`, `suricata json output`, `eve.json format`, `suricata alert json fields`).

**Anatomy:** hook (validating IDS alert parsing or a detection against Suricata fields needs EVE events shaped right; standing up a live Suricata sensor and triggering the exact alert is slow) → `## What is Suricata EVE JSON` (NDJSON, one event per line, `event_type` discriminator, shared common fields + one type-specific sub-object) → `## Common fields and event types` → `## The alert event` (the five core alert fields) → `## Generate EVE JSON with Eventum` (`<Steps>`) → `## The result` → `## FAQ` → `## Related`.

**First-source facts (verify against docs.suricata.io EVE JSON format + Elastic suricata integration):** raw EVE = NDJSON, one event/line. Discriminator `event_type` at root (`alert`, `dns`, `http`, `tls`, `flow`, `fileinfo`, `ssh`, `smtp`, `dhcp`, `anomaly`, `stats`). Common root fields: `timestamp`, `flow_id`, `in_iface`, `event_type`, `src_ip`, `src_port`, `dest_ip`, `dest_port`, `proto` (+ `community_id`, `app_proto`). Each line carries exactly one type-named sub-object. `alert` sub-object core fields: `action` (`allowed`/`blocked`), `signature`, `signature_id` (the SID), `category`, `severity` (1 = highest); plus `gid`, `rev`, `metadata`.

**Teach / mechanics:** teach the RAW EVE shape (fields at ROOT, not nested). Generate with the `template` plugin rendering an EVE JSON line + `json` formatter (`indent: 0` → compact NDJSON, one event per line; pair with `file` `separator: "\n"` as `ndjson.mdx` does). Lead with the `alert` event (the highest-value case), show one or two other `event_type`s (e.g. `dns`, `flow`) to make the discriminator concrete.

**Key framing:** `security-suricata` emits the Elastic integration ECS shape — raw EVE nested under `suricata.eve.*`, ECS fields at root, `alert.action` mapped to `event.type` — NOT raw-root EVE. Teach raw-root EVE (with `alert.action` present); note the ECS variant + link the Hub generator + `formats/ecs`.

**Interlinks:** In — `formats/index.mdx` card. Out — `formats/ndjson` (EVE is NDJSON), `formats/ecs` (parsed target), `/docs/tutorials/detection-testing` (IDS alert telemetry), `/docs/tutorials/delivery/opensearch`, `/hub`.

**Verification:** types:check (worktree) + CLI-verify (confirm NDJSON one-event-per-line, `event_type` discriminator, alert sub-object with the five core fields).

### Task 2.4: Linux auditd log format

**File:** Create `content/docs/tutorials/formats/auditd.mdx`

**Primary query:** `auditd log format` (secondary: `linux audit log format`, `audit.log format`, `/var/log/audit/audit.log format`).

**Anatomy:** hook (validating an auditd parser or a syscall/execve detection needs `audit.log` records shaped right; capturing them means running the exact activity on an audited host) → `## The auditd record format` (`type=<TYPE> msg=audit(<epoch>.<ms>:<serial>): <k>=<v> ...`) → `## One event, several records` (a logical event spans multiple lines sharing the `audit(epoch.ms:serial)` id: SYSCALL + EXECVE + CWD + PATH + PROCTITLE) → `## Generate auditd logs with Eventum` (`<Steps>`) → `## The result` → `## FAQ` → `## Related`.

**First-source facts (verify against Red Hat "Understanding Audit Log Files" + the auditd/ausearch docs):** each record is `type=<TYPE> msg=audit(<epoch>.<ms>:<serial>): <key>=<value> <key>=<value> ...` — space-separated key=value pairs. A single logical event is several record lines SHARING the same `audit(epoch.ms:serial)` id (the serial stitches them). Record types and key fields: SYSCALL (`arch`, `syscall`, `success`, `exit`, `a0`-`a3` [hex], `uid`, `auid`, `pid`, `comm`, `exe`, `key`), EXECVE (`argc`, `a0`, `a1`, ... [some hex]), CWD (`cwd`), PATH (`item`, `name`, `inode`, `mode`, `ouid`), PROCTITLE (hex-encoded), plus USER_LOGIN / USER_AUTH / USER_CMD. Some values are hex-encoded (register args, PROCTITLE).

**Teach / mechanics:** teach the raw line-oriented key=value text. Generate with the `template` plugin rendering a MULTI-RECORD event (the SYSCALL+EXECVE+CWD+PATH+PROCTITLE block, all lines sharing one `audit(epoch.ms:serial)`) + `file` output + `plain` formatter (NOT `json` — auditd is line-oriented text, not JSON). One rendered event = a multi-line block. Show the hex-encoding on a field or two and explain it.

**Key framing:** `linux-auditd` emits ECS/Auditbeat JSON — raw fields folded under `auditd.data.*`, no `msg=audit(...)` id, no multi-record coalescing, correlation via ECS `event.sequence` — NOT the raw `audit.log` syntax. Teach the raw multi-record format from the Red Hat spec and BUILD the example from scratch (the content-pack does not produce raw text); note the ECS/Auditbeat variant + link the Hub generator + `formats/ecs`.

**Interlinks:** In — `formats/index.mdx` card. Out — `formats/ecs` (parsed target), `/docs/tutorials/detection-testing` (syscall/execve detection), `/docs/tutorials/delivery`, `/hub`.

**Verification:** types:check (worktree) + CLI-verify the worked config (confirm the multi-record block shares one `audit(...)` serial, key=value shape, `plain` formatter emits it as text).

## Wave 3 — Delivery (overview; detailed briefs appended before dispatch)

Recon before dispatch: read `eventum/plugins/output/plugins/{tcp,udp}/config.py` + `plugin.py` (exact fields, framing behavior, `_open` eager/lazy) and `docs/content/docs/plugins/output/` for existing tcp/udp reference pages; read `delivery/index.mdx` + `delivery/meta.json`; read `docs/content/docs/plugins/formatters.mdx` (the formatter reference this lesson complements).

Shared for 3.1-3.2: delivery-lesson exemplar = `delivery/http.mdx` (hook → plugin/shape overview → formatter/transport choice → "Generate with Eventum" (`<Steps>`: template + generator config + keyring where needed) → "The result" → FAQ → Related). `delivery/index.mdx` = 4-card grid (opensearch/kafka/clickhouse/http) + `description` enumerating destinations; `delivery/meta.json` = `["index", "opensearch", "kafka", "clickhouse", "http"]`. Each W3 task appends its slug + adds a `<Card>` + updates the index `description` + the `tutorials/index.mdx` Delivery blurb. Verify: `pnpm types:check` FROM WORKTREE ROOT + CLI-verify bounded.

### Task 3.1: Syslog over TCP/UDP to collectors & SIEM

**File:** Create `content/docs/tutorials/delivery/syslog-transport.mdx`

**Primary query:** `send syslog to collector` (secondary: `syslog over tcp`, `syslog udp`, `send logs to siem`, `syslog tls`).

**Anatomy:** hook (a generated syslog stream is only useful once it reaches the collector/SIEM that will parse it; writing to a file tests the format but not the wire path a real syslog source takes) → `## Syslog on the wire: UDP vs TCP` (transport, not message format) → `## Send syslog over UDP` (`<Steps>`) → `## Send syslog over TCP` (framing + TLS) → `## The result` → `## FAQ` → `## Related`.

**First-source facts (verify against the RFCs):** UDP syslog = RFC 5426, one datagram per message, fire-and-forget (no delivery guarantee, no ordering). TCP syslog = RFC 6587, two framings: **octet-counting** (`MSG-LEN SP SYSLOG-MSG`, a decimal length prefix) and **non-transparent framing** (the message followed by a trailing delimiter, almost always `LF`). The syslog MESSAGE format itself (PRI, RFC 5424 vs 3164 headers) is taught in `formats/syslog` — link it, do NOT re-teach it here; this lesson is the TRANSPORT.

**Teach / mechanics (source-verified):**
- `udp` output config: `host`, `port`, `encoding` (default utf_8), `separator` (default `\n`). Sends one datagram per event (`sendto`). Its `_open` creates a datagram endpoint (a connected UDP socket) but performs NO handshake — an unreachable target does NOT stop the run; datagrams are sent into the void and any ICMP errors are logged, not raised.
- `tcp` output config: `host`, `port`, `encoding`, `separator` (default `\n` → this IS non-transparent framing per RFC 6587), `connect_timeout` (default 10), `ssl` (default false), `verify` (default true), `ca_cert`, `client_cert`, `client_cert_key` (mutual TLS). Its `_open` opens a real TCP connection (`asyncio.open_connection`) with the timeout — **EAGER**: an unreachable target STOPS the run with a `PluginOpenError` (contrast UDP, and contrast the `http`/`opensearch` lazy plugins). TLS syslog is RFC 5425 — enable `ssl: true` (+ `ca_cert`/mTLS as needed).
- **Framing:** the default `separator: "\n"` gives non-transparent (LF-delimited) framing — the common case most collectors accept. Note octet-counting exists (a length prefix) and can be produced by rendering the prefix in the template if a collector requires it, but keep non-transparent as the worked default.
- **Callout (transport-specific, do NOT reuse the http/opensearch lazy Callout):** TCP is eager — a closed/unreachable port fails the run immediately at open, so a syslog TCP misconfiguration surfaces loudly; UDP is fire-and-forget — an unreachable target fails silently, writes "succeed" locally while nothing arrives.

**Interlinks:** In — `delivery/index.mdx` card. Out — bidirectional with `formats/syslog` (transport ↔ format), `/docs/tutorials/detection-testing` + `/docs/tutorials/siem-events` (SIEM ingest), `formats/cef` / `formats/leef` (CEF/LEEF often ride syslog), `/docs/plugins/output/tcp` + `/docs/plugins/output/udp` references, `/docs/plugins/formatters#plain` (syslog text uses `plain`). Add a reciprocal link in `formats/syslog.mdx` pointing here (transport companion).

**Cross-cutting:** `delivery/meta.json` append `syslog-transport`; `delivery/index.mdx` card + `description`; `tutorials/index.mdx` Delivery blurb.

**Verification:** types:check (worktree). CLI-verify bounded: run a tiny local listener (e.g. `python3 -c` socketserver or `nc -l -u`/`nc -l` on a high port in the background) and point a short generator at it via `udp`/`tcp` to confirm lines arrive with the LF framing; ALSO demonstrate the TCP eager-fail by pointing at a closed port and showing the `PluginOpenError` (that itself is a verifiable, listener-free check). Kill only your own listener/generator PIDs — never `pkill eventum`. Delete temp files.

### Task 3.2: Output formatters — shape data per destination

**File:** Create `content/docs/tutorials/delivery/formatters.mdx`

**Primary query:** `output formatters` (secondary: `shape log data per destination`, `json vs ndjson output`, `batch vs per-event output`).

**Anatomy:** hook (the same generated stream has to leave in a different shape for each destination — a file wants one JSON object per line, a bulk API wants a single array, a custom endpoint wants its own envelope; the formatter is where that shaping happens) → `## One stream, a shape per destination` (each output plugin applies its own formatter; the same events fan out differently) → `## Choosing a formatter` (the mapping table) → `## Per-event vs per-batch` (which formatters emit one-per-event vs one-per-batch, and why it matters — request count, failure blast radius) → `## Worked examples` (`<Steps>` or sequential: 2-3 concrete — NDJSON file via `json`, a bulk array via `json-batch`, a custom envelope via `template-batch`) → `## The result` → `## FAQ` → `## Related`.

**This is an APPLIED teaching page, NOT a reference.** The full per-formatter reference already exists at `/docs/plugins/formatters` (it documents all six with envelope/CSV/XML/NDJSON/summary examples) — link it prominently and do NOT duplicate it. This lesson's job is the destination-shape MAPPING and the per-event-vs-per-batch decision.

**Source-verified facts (`eventum/plugins/output/formatters.py` + `fields.py`):** the six formats (Format enum strings verbatim): `plain` (pass-through, raw text — syslog/CLF/auditd), `json` (validates + compacts each event to one line — NDJSON file, per-record stream), `json-batch` (validates all events, joins into ONE JSON array — bulk-ingest APIs), `template` (per-event custom render — a custom wire body per event), `template-batch` (ALL events → one via a template — custom envelope/NDJSON batch/CSV/XML), `eventum-http-input` (emits `{"count": N}` for Eventum's own HTTP input plugin). `json`/`json-batch` take `indent` (default 0; `msgspec.json.format` KEEPS single spaces after `:` and `,` — compact ≠ whitespace-stripped). Per-event = plain/json/template; per-batch = json-batch/template-batch/eventum-http-input.

**Mapping table (destination → formatter):** raw text collector (syslog/file) → `plain`; NDJSON file / per-record index → `json` (+ `file` `separator: "\n"`); bulk-ingest array API → `json-batch`; one custom request/line per event → `template`; a named envelope (e.g. CloudTrail `{"Records": [...]}`), CSV, or XML batch → `template-batch`. REUSE the Task 2.2 fact: a named-array envelope needs `template-batch` with `{"Records": [{{ events | join(", ") }}]}` (bare `{{ events }}` renders an invalid single-quoted Python list repr).

**Interlinks:** In — `delivery/index.mdx` card. Out — `/docs/plugins/formatters` (the full reference — prominent), `formats/ndjson` (json → NDJSON), `formats/cloudtrail` (template-batch Records envelope), `delivery/http` (json-batch vs json request shaping), `delivery/opensearch` (bulk body), `/docs/tutorials/formats` (formatters produce these shapes).

**Cross-cutting:** `delivery/meta.json` append `formatters` (after `syslog-transport`); `delivery/index.mdx` card + `description`; `tutorials/index.mdx` Delivery blurb.

**Verification:** types:check (worktree). CLI-verify each worked formatter example bounded (`--live-mode false`, `timeout`) — confirm `json` yields one object per line, `json-batch` yields one array, `template-batch` yields the named envelope. Delete temp files. Never `pkill eventum`.

## Wave 4 — Scenarios rewrite (overview; detailed briefs appended before dispatch)

Additive rewrites (keep the working project, add the teaching layer + primary-query reframe + FAQ + interlinks). These slugs are already in `tutorials/meta.json` — no nav change, edit in place. Recon before dispatch: re-read each current file (done once in planning; re-read at wave time for exact anchors).

Shared for 4.1-4.3 (ADDITIVE rewrites): each edits an EXISTING file in place. Keep the working project (templates, generator config, the real result) — layer the teaching on top: reframe title/description/hook to the primary query, add an explainer of the domain concept, add a FAQ (`<Accordions>`), add cluster↔pillar/cluster interlinks, tie into the Phase-1/2/3 lessons now available. Do NOT gut a runnable tutorial; fix only what is broken or drifted. Slugs already in `tutorials/meta.json` (root) — NO nav change, edit in place. The implementer reads the current file first, then layers. Verify: `pnpm types:check` FROM WORKTREE ROOT + CLI-verify bounded (stdout swap for ClickHouse/Telegram). No new meta.json entries.

### Task 4.1: Web clickstream to ClickHouse

**File:** Rewrite `content/docs/tutorials/web-clickstream.mdx` in place.

**Primary query:** `clickstream data` (secondary: `clickstream analytics test data`, `funnel test data`, `user journey test data`).

**MUST FIX (eventum#178) — the reason this rewrite is not purely additive:** the current FSM transitions use `when: { lt/ge: { "shared.page_views": n } }` and `and:` on dotted state keys (`shared.page_views`, `shared.items_in_cart`) — these FAIL validation under eventum#178, so the shipped example does not run. Rewrite the transitions to the working `defined`-flag pattern that `realism/sessions.mdx` already uses (study it): compute each funnel threshold INSIDE the template, set a boolean flag in `shared` (e.g. `ready_to_add`, `ready_to_checkout`, `session_done`), and branch the FSM with `when: { defined: shared.flag }` / `when: { always: }` only. Preserve the funnel semantics (landing → browse → add-to-cart → checkout → exit, with a browse-loop and a bounce path) and the ClickHouse target. CLI-verify the rewritten config VALIDATES and runs (bounded, `stdout` swapped in for ClickHouse) with NO #178 error.

**Additive teaching:** reframe title/description/hook around `clickstream data` (what clickstream is, why funnel/session data matters for analytics testing). Add a FAQ. The existing daily-traffic pattern uses `triangular` — optionally align to `beta` (a:4/b:4) per the windows-event-log/timing precedent (evaluate; not mandatory).

**Interlinks:** reciprocate `realism/sessions` (the FSM session pattern this reuses — sessions already forward-links here) and `realism/correlated-events`; `delivery/clickhouse`; `foundations/streaming-vs-bulk` (bulk seed vs live stream). Bidirectional where the sibling doesn't already point here.

**Verification:** types:check (worktree) + CLI-verify the FSM validates and the funnel runs end to end (stdout swap), NO #178 error, sessions progress landing→checkout/exit.

### Task 4.2: IoT sensor telemetry

**File:** Rewrite `content/docs/tutorials/iot-telemetry.mdx` in place.

**Primary query:** `iot test data` (secondary: `iot sensor data generator`, `synthetic sensor data`, `sensor telemetry test data`).

**Additive teaching:** keep the working timer + spin + locals-drift NDJSON generator (temperature/humidity/pressure with value drift + clamping). Layer teaching: reframe title/description/hook around `iot test data`; explain sensor telemetry as METRIC-shaped events over time (drift/noise vs flat random) and tie explicitly to `foundations/logs-vs-metrics-events` (metric-shaped events) and `realism/values` (drift/distributions). Note the finite-dataset path ties to `foundations/streaming-vs-bulk` (the current file's `--live-mode false`/`repeat` hint — align it to the streaming-vs-bulk lesson's framing). Add a FAQ. Not FSM — unaffected by #178.

**Interlinks:** `foundations/logs-vs-metrics-events` (metrics), `realism/values` (drift/skew), `foundations/streaming-vs-bulk` (finite dataset), `/docs/tutorials/delivery` (stream sensors to a backend), `formats/ndjson` (the output shape).

**Verification:** types:check (worktree) + CLI-verify the generator runs, drift is visible across readings (bounded).

### Task 4.3: Scheduled Telegram alerts

**File:** Rewrite `content/docs/tutorials/telegram-alerts.mdx` in place.

**Primary query:** `alert simulation` (secondary: `test alerting pipeline`, `simulate monitoring alerts`, `alert notification test data`).

**Additive teaching:** keep the working cron + template(all) + http-to-Telegram-Bot-API generator (secrets/params for token/chat_id). Layer teaching: reframe title/description/hook around `alert simulation` / testing an alerting pipeline (why simulated alerts matter — exercising notification routing, on-call, dashboards without a real incident). Add a FAQ. `mode: all` — unaffected by #178.

**Interlinks:** `delivery/http` (the HTTP delivery mechanism, incl. `success_code`/secrets), `foundations/logs-vs-metrics-events` (an alert as an event), `/docs/tutorials/detection-testing` (alerts as the output of a detection), `/docs/core/config/secrets` (keyring). 

**Verification:** types:check (worktree) + CLI-verify the generator renders the alert JSON body via `stdout` (no real Telegram token/endpoint needed — stdout swap).

---

## Open Questions

1. **W2 security formats — one lesson or three?** The design spec §6 lists CloudTrail / Suricata EVE / auditd as a single row (one lesson, three sub-sections, mini field-guide). Three separate lessons would give three distinct primary queries (more SEO surface) at the cost of thinner pages and more upkeep. Default: follow the spec (one lesson). Confirm with the user at W2 before writing.
2. **Realism pillar framing.** `realism/index.mdx` currently frames "three axes" (timing/sessions/values). Phase 3 adds correlated-events and replay as further realism techniques. Adjust the pillar framing to "techniques" (not a hard count of three) — minimal edit, decided at W1 (Task 1.4).
3. **Redirects (design spec §9/§13, deferred).** The six original scenario tutorials kept their root `/docs/tutorials/*` URLs (they were NOT moved into `/scenarios/*`), so the planned old→new redirects are moot for those. No redirect work in Phase 3 unless a URL actually changes.

## Post-wave (controller)

After W4: broad whole-branch review (most-capable model) over the Phase 3 diff (`review-package <phase3-base> HEAD`); fix Critical/Important in one batched fix subagent; memory-bounded full `pnpm build` (`NODE_OPTIONS=--max-old-space-size=3072`, watch WSL memory); integrity link-sweep across the new lessons; refresh the static preview (`out/`); update PR #45 body to the full course incl. Phase 3; update the ledger + memory. Then `superpowers:finishing-a-development-branch`.
