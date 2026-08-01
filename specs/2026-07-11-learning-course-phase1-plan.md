# Eventum Learn — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Каждый урок (Часть 2) исполняется через скилл `new-docs-page`** — он не разворачивается в bite-sized MDX здесь, потому что это творческое письмо, а не механический код.

**Goal:** Перестроить раздел `content/docs/tutorials/` в обучающий курс «Eventum Learn» и наполнить его ядром Фазы 1 — треки B (форматы), D (доставка), E (сценарии): навигационный каркас + pillar'ы + приоритетные уроки-пробелы.

**Architecture:** Реструктуризация внутри существующего раздела `tutorials/` (URL-база сохраняется). Новые треки — подпапки с `index.mdx`-pillar и `meta.json`; существующие 6 туториалов остаются на своих URL и группируются в sidebar через separators. Контентные уроки создаются по единому шаблону анатомии (объяснитель + компаньон на одной странице) через скилл `new-docs-page`.

**Tech Stack:** Next.js 16 (App Router, `output: export`, `trailingSlash: true`), Fumadocs 16 (fumadocs-mdx, fumadocs-core `source`), MDX, Mermaid, pnpm.

## Global Constraints

- **База ветки:** `feat/learning-course` от `develop`. Feature-ветки — только от `develop` (git-flow).
- **ПРЕДУСЛОВИЕ (блокирующее):** Фаза 1 переиспользует SEO-инфраструктуру PR #43 (`lib/seo.ts`, `components/JsonLd.tsx`, canonical в `generateMetadata`, sitemap). Она сейчас в `master`, НЕ в `develop`. До старта реализации нужен **back-merge `master` → `develop`** (или пересадка этих файлов в базу курса). Без этого задачи с JSON-LD и sitemap невыполнимы как написано.
- **URL-стабильность:** НЕ менять URL существующих 6 туториалов (`/docs/tutorials/{siem-events,csv-dataset,telegram-alerts,web-clickstream,load-testing,iot-telemetry}`). Никаких редиректов в этой фазе (отклонение от spec §9 — механизм редиректов при `output: export` без известного хостинга хрупок; сохранение URL убирает риск).
- **Стиль docs (правила `../docs` scope):** end-user язык, без внутренних движковых терминов; формальный регистр; конкретика вместо общих фраз; без деталей реализации и перечисления полей вывода; single hyphen `-` в коде, em dash `—` допустим в MDX-прозе; не хардврапить прозу.
- **Модель урока:** объяснитель + прикладной компаньон на ОДНОЙ странице; один урок = один primary-запрос.
- **Верификация после любой правки контента/навигации:** `pnpm types:check` и `pnpm build` проходят; новые страницы попадают в sitemap; внутренние ссылки резолвятся.
- **Целевые запросы:** #2 = `log generator for opensearch`, #3 = `generate data for SIEM`.

---

## Часть 1 — Навигационный каркас (код/конфиг)

### Task 1: Переименовать раздел в «Learn» и переписать обзор курса

**Files:**
- Modify: `content/docs/meta.json` (строка со ссылкой на tutorials)
- Modify: `content/docs/tutorials/index.mdx` (полная перезапись в обзор курса)
- Modify: `content/docs/tutorials/meta.json` (порядок с треками)

**Interfaces:**
- Produces: раздел «Learn» с обзорной pillar-страницей курса и sidebar-структурой 5 треков; последующие задачи кладут pillar'ы/уроки в подпапки, объявленные здесь.

- [ ] **Step 1: Переименовать в root sidebar**

В `content/docs/meta.json` заменить строку:
```
    "[GraduationCap][Tutorials](/docs/tutorials#)",
```
на:
```
    "[GraduationCap][Learn](/docs/tutorials#)",
```

- [ ] **Step 2: Переписать `tutorials/index.mdx` в обзор курса**

Полная замена файла:
```mdx
---
title: Learn
description: A hands-on course on generating realistic synthetic event and log data — formats, realism techniques, delivery to your stack, and end-to-end scenarios.
---

<div className="not-prose my-6 rounded-2xl border border-fd-border bg-linear-to-br from-fd-card via-fd-card to-fd-accent/20 p-8 text-center">
  <div className="flex justify-center mb-4 text-fd-muted-foreground"><GraduationCap size={40} strokeWidth={1.5} /></div>
  <div className="text-2xl font-semibold mb-2">Eventum Learn</div>
  <div className="text-fd-muted-foreground max-w-xl mx-auto">
    From flat logs to synthetic-data mastery. Learn the formats your data
    uses, how to make it realistic, how to deliver it to your stack, and
    how to prove a pipeline works — before touching production.
  </div>
</div>

<Mermaid chart={`graph LR
    FND["Foundations"]:::section --> FMT["Formats"]:::section
    FMT --> RLS["Realism"]:::section
    RLS --> DLV["Delivery"]:::section
    DLV --> SCN["Scenarios"]:::section
    classDef section fill:#8282ef,color:#fff,stroke:#6b6bd4,stroke-width:2px`} />

---

## Formats & schemas

Understand the shape of your data — syslog, CEF, LEEF, Windows events — and generate a compliant sample of each.

<Cards>
  <Card title="Log & event formats" description="A field guide to the formats your pipeline speaks, and how to generate each." href="/docs/tutorials/formats" />
</Cards>

## Delivery

Stream synthetic data into the backend you actually use.

<Cards>
  <Card title="Stream to your stack" description="Deliver generated events to OpenSearch, Kafka, ClickHouse, HTTP and more." href="/docs/tutorials/delivery" />
</Cards>

## Scenarios

End-to-end projects that prove a use case from an empty directory to working output.

<Cards>
  <Card title="Synthetic data for SIEM" description="Generate realistic security telemetry for detection development and testing." href="/docs/tutorials/scenarios" />
  <Card title="SIEM: Windows Security → OpenSearch" description="Build a stateful Windows Security Event Log generator and index it into OpenSearch." href="/docs/tutorials/siem-events" />
  <Card title="E-Commerce Transactions → CSV" description="Produce a shaped CSV dataset of purchases, refunds, and chargebacks." href="/docs/tutorials/csv-dataset" />
  <Card title="Scheduled Telegram Alerts" description="Simulate a monitoring system that sends alerts to Telegram on a cron schedule." href="/docs/tutorials/telegram-alerts" />
  <Card title="Web Clickstream → ClickHouse" description="Model browsing sessions with a state machine and stream page views into ClickHouse." href="/docs/tutorials/web-clickstream" />
  <Card title="API Load Testing" description="Stress-test a REST API with diverse payloads at maximum throughput." href="/docs/tutorials/load-testing" />
  <Card title="IoT Sensor Telemetry" description="Stream continuous sensor readings with realistic drift and noise as NDJSON." href="/docs/tutorials/iot-telemetry" />
</Cards>
```

- [ ] **Step 3: Обновить `tutorials/meta.json` под треки Фазы 1**

Заменить содержимое на:
```json
{
  "root": true,
  "icon": "GraduationCap",
  "pages": [
    "index",
    "---Formats---",
    "formats",
    "---Delivery---",
    "delivery",
    "---Scenarios---",
    "scenarios",
    "siem-events",
    "csv-dataset",
    "telegram-alerts",
    "web-clickstream",
    "load-testing",
    "iot-telemetry"
  ]
}
```
(Треки `foundations` и `realism` добавятся в Фазе 2; `formats`/`delivery`/`scenarios` — папки, создаются в Task 2-4.)

- [ ] **Step 4: Verify build**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Expected: PASS. Sidebar показывает «Learn» с группами Formats/Delivery/Scenarios. Обзор `/docs/tutorials/` рендерит Mermaid и Cards. (Cards с href на ещё-не-созданные `/formats`,`/delivery`,`/scenarios` не ломают сборку — это пропсы, не markdown-ссылки; станут валидны после Task 2-4.)

- [ ] **Step 5: Commit**
```bash
git add content/docs/meta.json content/docs/tutorials/index.mdx content/docs/tutorials/meta.json
git commit -m "docs(tutorials): rename section to Learn and restructure overview into a course"
```

### Task 2: Создать трек Formats (pillar B)

**Files:**
- Create: `content/docs/tutorials/formats/index.mdx` (pillar)
- Create: `content/docs/tutorials/formats/meta.json`

**Interfaces:**
- Produces: `/docs/tutorials/formats` — pillar трека B; уроки-форматы (Task 6-9) кладутся сюда и перечисляются в `meta.json`.

- [ ] **Step 1: Создать `formats/meta.json`**
```json
{
  "pages": ["index", "windows-event-log", "cef", "leef", "syslog"]
}
```

- [ ] **Step 2: Создать `formats/index.mdx` (pillar)**
```mdx
---
title: "Log and event formats: a field guide"
description: The formats your pipeline speaks — syslog, CEF, LEEF, Windows Event Log — explained, with a generated sample of each.
---

Every log pipeline speaks a format. Get it wrong and your parser drops the
event; get it right and detections, dashboards, and alerts just work. This
track explains the formats you meet most often and shows how to generate a
compliant sample of each with Eventum.

<Cards>
  <Card title="Windows Event Log & Sysmon" description="The XML event model, EventIDs, and Sysmon — and how to generate them without running anything." href="/docs/tutorials/formats/windows-event-log" />
  <Card title="CEF" description="ArcSight Common Event Format: header, extensions, and a generated CEF stream." href="/docs/tutorials/formats/cef" />
  <Card title="LEEF" description="QRadar Log Event Extended Format and how to generate LEEF events." href="/docs/tutorials/formats/leef" />
  <Card title="syslog (RFC 5424 / 3164)" description="The two syslog headers, when each applies, and generating both." href="/docs/tutorials/formats/syslog" />
</Cards>
```

- [ ] **Step 3: Verify build**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Expected: PASS. `/docs/tutorials/formats` рендерит pillar; в sidebar под «Formats» появляется вложенная группа.

- [ ] **Step 4: Commit**
```bash
git add content/docs/tutorials/formats/
git commit -m "docs(tutorials): add Formats track pillar"
```

### Task 3: Создать трек Delivery (pillar D)

**Files:**
- Create: `content/docs/tutorials/delivery/index.mdx`
- Create: `content/docs/tutorials/delivery/meta.json`

**Interfaces:**
- Produces: `/docs/tutorials/delivery` — pillar трека D; уроки доставки (Task 10-11) кладутся сюда.

- [ ] **Step 1: Создать `delivery/meta.json`**
```json
{
  "pages": ["index", "opensearch", "kafka"]
}
```

- [ ] **Step 2: Создать `delivery/index.mdx` (pillar)**
```mdx
---
title: Stream synthetic data to your stack
description: Deliver generated events to the backend you actually use — OpenSearch, Kafka, ClickHouse, HTTP — with the right format per destination.
---

Generating events is half the job; getting them into your backend is the other half. Eventum fans out the same stream to one or more destinations in parallel, formatting per destination. This track shows how to deliver synthetic data to the systems you run.

<Cards>
  <Card title="Generating logs for OpenSearch" description="Index a realistic log stream into OpenSearch with the bulk API." href="/docs/tutorials/delivery/opensearch" />
  <Card title="Generate test data for Kafka" description="Produce a continuous, realistic event stream to a Kafka topic." href="/docs/tutorials/delivery/kafka" />
</Cards>
```

- [ ] **Step 3: Verify build**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Expected: PASS. `/docs/tutorials/delivery` рендерит pillar.

- [ ] **Step 4: Commit**
```bash
git add content/docs/tutorials/delivery/
git commit -m "docs(tutorials): add Delivery track pillar"
```

### Task 4: Создать трек Scenarios (pillar E) и связать существующие туториалы

**Files:**
- Create: `content/docs/tutorials/scenarios/index.mdx`
- Create: `content/docs/tutorials/scenarios/meta.json`

**Interfaces:**
- Produces: `/docs/tutorials/scenarios` — pillar трека E (целевой #3, `generate data for SIEM`); ссылается на существующий `siem-events` и новые сценарии Фазы 2.

- [ ] **Step 1: Создать `scenarios/meta.json`**
```json
{
  "pages": ["index"]
}
```
(Новые сценарии Фазы 2 добавятся сюда; существующие 6 остаются в корне `tutorials/` и уже перечислены в его `meta.json`.)

- [ ] **Step 2: Создать `scenarios/index.mdx` (pillar E, primary-запрос `generate data for SIEM`)**
```mdx
---
title: Synthetic data for SIEM and detection testing
description: Generate realistic security telemetry — Windows, Sysmon, network, endpoint — to build and test SIEM detections without touching production or running live attacks.
---

Building a detection means proving it fires on the right events and stays quiet on the wrong ones. That needs data: attack-like telemetry, benign noise, and enough volume to be realistic. Live attacks need a lab; static sample sets are frozen and quickly stale. Eventum generates fresh, parameterized security telemetry on demand, in the format your SIEM ingests.

<Cards>
  <Card title="SIEM: Windows Security → OpenSearch" description="A complete stateful generator: Windows Security events indexed into OpenSearch." href="/docs/tutorials/siem-events" />
</Cards>

## Related

- Formats used in SIEM data: [Windows Event Log](/docs/tutorials/formats/windows-event-log), [CEF](/docs/tutorials/formats/cef), [syslog](/docs/tutorials/formats/syslog)
- Ready-made security generators in the [Eventum Hub](/hub)
```

- [ ] **Step 3: Verify build**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Expected: PASS. Все Cards из Task 1 overview теперь резолвятся (`/formats`, `/delivery`, `/scenarios` существуют).

- [ ] **Step 4: Commit**
```bash
git add content/docs/tutorials/scenarios/
git commit -m "docs(tutorials): add Scenarios track pillar (SIEM)"
```

### Task 5: Course JSON-LD на pillar'ах курса

**Files:**
- Modify: `lib/seo.ts` (добавить builder `courseSchema`)
- Modify: `app/docs/[[...slug]]/page.tsx` (вставить Course JSON-LD для pillar-страниц курса)

**Interfaces:**
- Consumes: `lib/seo.ts` из PR #43 (см. предусловие), `JsonLd` компонент, `SITE_URL`, `pageUrl`.
- Produces: `courseSchema(name, description, url)` → JSON-LD объект; на страницах под `/docs/tutorials` рендерится `Course` разметка в дополнение к существующему BreadcrumbList.

- [ ] **Step 1: Добавить builder в `lib/seo.ts`**
```ts
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
```

- [ ] **Step 2: Рендерить Course JSON-LD на pillar'ах курса**

В `app/docs/[[...slug]]/page.tsx`, в теле `Page`, рядом с существующим breadcrumb `JsonLd`, добавить Course JSON-LD ТОЛЬКО для pillar-страниц курса (обзор + индексы треков), не для отдельных уроков (по spec §8: Course на pillar'ах, Article на уроках). Задать явный набор pillar-путей на уровне модуля и проверять по нему:
```tsx
const COURSE_PILLARS = new Set([
  '/docs/tutorials',
  '/docs/tutorials/formats',
  '/docs/tutorials/delivery',
  '/docs/tutorials/scenarios',
]);
// ...в теле Page:
{COURSE_PILLARS.has(page.url) && (
  <JsonLd
    data={courseSchema({
      name: page.data.title,
      description: page.data.description ?? '',
      path: page.url,
    })}
  />
)}
```
Импорт: добавить `courseSchema` к существующему импорту из `@/lib/seo`.

- [ ] **Step 3: Verify build + разметка**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Then: проверить в `out/docs/tutorials/index.html` наличие `"@type":"Course"`.
Expected: PASS, Course JSON-LD присутствует на страницах курса.

- [ ] **Step 4: Commit**
```bash
git add lib/seo.ts "app/docs/[[...slug]]/page.tsx"
git commit -m "docs(tutorials): add Course JSON-LD on course pillar pages"
```

---

## Часть 2 — Контентные уроки Фазы 1 (через `new-docs-page`)

Каждый урок — отдельная задача, исполняется скиллом `new-docs-page` (research → plan → write → verify → review). Ниже — бриф на каждый: путь, primary-запрос, обязательные H2, что покрыть в теории (сверять с первоисточником), какой Eventum-механизм показать в практике, что в блоке «Результат», FAQ, перелинковка. Общий шаблон анатомии — из spec §7. Все уроки следуют Global Constraints (стиль docs, verify build, попадание в sitemap).

Порядок: сначала уроки-форматы (Task 6-9), затем доставка (Task 10-11), затем переписать siem-events (Task 12). После создания каждого урока — обновить ссылки в соответствующем pillar, если менялись.

### Task 6: Урок «Windows Event Log & Sysmon»
- **Файл:** `content/docs/tutorials/formats/windows-event-log.mdx`
- **Primary-запрос:** `generate windows event logs` (вторичные: `sysmon test logs`, `windows security event log format`). Крупнейший пробел выдачи — генератора «свежих» настраиваемых Windows-событий нет, только статические EVTX-репозитории.
- **Теория (H2 «What Windows Event Log looks like»):** модель Windows Event Log — каналы (Security/System/Application), EventID, Provider, рендеринг в XML; Sysmon как источник телеметрии процессов/сети. Сверять с MS Learn (Sysmon) и forensics.wiki (EVTX).
- **Практика (H2 «Generate it with Eventum»):** `template` event-плагин, шаблон под структуру Windows-события; input `time-patterns` для дневной кривой; output `file`/`stdout`. Сослаться на готовые Hub-генераторы `windows-security`, `windows-sysmon`.
- **Результат (H2):** пример сгенерированного события (JSON-представление ключевых полей: EventID, TimeCreated, Provider, event-specific data).
- **FAQ:** «Do I need a Windows host?» (нет), «EVTX binary vs XML/JSON?», «How to feed it into a SIEM?» → ссылка на scenarios SIEM.
- **Перелинковка:** → pillar formats; → scenarios SIEM; → Hub (windows-security).

### Task 7: Урок «CEF»
- **Файл:** `content/docs/tutorials/formats/cef.mdx`
- **Primary-запрос:** `CEF format` (вторичный `generate CEF logs`). Топ выдачи — форум Palo Alto; нейтрального объяснителя нет.
- **Теория (H2 «What CEF looks like»):** структура `CEF:Version|Device Vendor|Device Product|Device Version|Signature ID|Name|Severity|Extension`; extension key-value; типичные ключи (src, dst, spt, dpt). Сверять со спецификацией ArcSight CEF.
- **Практика (H2 «Generate CEF with Eventum»):** `template` с CEF-строкой; подстановка полей через `module.rand`/`faker`; output `tcp`/`syslog`-приёмник или `file`.
- **Результат:** пример валидной CEF-строки.
- **FAQ:** «CEF vs LEEF?» (кратко + ссылка на LEEF-урок), «How to send CEF over syslog?».
- **Перелинковка:** → pillar formats; → LEEF-урок; → delivery (syslog/tcp).

### Task 8: Урок «LEEF»
- **Файл:** `content/docs/tutorials/formats/leef.mdx`
- **Primary-запрос:** `LEEF format` (вторичный `generate LEEF QRadar`). Почти неконкурентно — только вендор-доки IBM.
- **Теория (H2 «What LEEF looks like»):** `LEEF:Version|Vendor|Product|Version|EventID|` + delimited attributes; отличие от CEF; связь с QRadar. Сверять с IBM QRadar docs.
- **Практика:** `template` с LEEF-строкой; output к коллектору.
- **Результат:** пример LEEF-события.
- **FAQ:** «LEEF vs CEF?», «Which QRadar versions?».
- **Перелинковка:** → pillar formats; → CEF-урок; → scenarios SIEM.

### Task 9: Урок «syslog (RFC 5424 vs 3164)»
- **Файл:** `content/docs/tutorials/formats/syslog.mdx`
- **Primary-запрос:** `syslog format` (вторичные `RFC 5424`, `syslog message format`).
- **Теория (H2 «The two syslog headers»):** RFC 3164 (BSD, PRI+timestamp+host+tag) vs RFC 5424 (VERSION, structured data, ISO-timestamp); PRI/facility/severity. Сверять с RFC 5424/3164 (IETF).
- **Практика (H2 «Generate syslog with Eventum»):** `template` под оба заголовка; output `udp`/`tcp` к syslog-коллектору.
- **Результат:** по одному примеру 3164 и 5424.
- **FAQ:** «Which RFC should I use?», «How to send to rsyslog/syslog-ng?».
- **Перелинковка:** → pillar formats; → delivery (TCP/UDP — Фаза 3); → CEF (CEF-over-syslog).

### Task 10: Урок «Generating logs for OpenSearch» (целевой #2)
- **Файл:** `content/docs/tutorials/delivery/opensearch.mdx`
- **Primary-запрос:** `log generator for opensearch` (вторичный `send logs to opensearch`). Выдача слабая (ingestion-доки + apache-fake-log-gen скрипт) — мы объективно сильнее.
- **Теория (H2 «How log ingestion into OpenSearch works»):** индексы, bulk API, mapping — кратко, end-user язык.
- **Практика (H2 «Generate and index with Eventum»):** `opensearch` output-плагин (hosts, index, formatter json), auth через секреты; input любой (напр. web-логи); показать конфиг `generator.yml`.
- **Результат:** документ, как он лёг в индекс (ключевые поля).
- **FAQ:** «Elasticsearch too?» (да, совместимо), «TLS/auth?», «What data can I generate?» → formats/scenarios.
- **Перелинковка:** → pillar delivery; → scenarios SIEM (Windows→OpenSearch); → reference `plugins/output/opensearch`.

### Task 11: Урок «Generate test data for Kafka»
- **Файл:** `content/docs/tutorials/delivery/kafka.mdx`
- **Primary-запрос:** `generate test data for kafka` (вторичный `produce sample data to kafka topic`). Дефолтный ответ выдачи — Confluent Datagen (Kafka-only, Avro, пиллар 2019). Дифференциация: непрерывный, time-aware, мульти-приёмник, любой формат.
- **Теория (H2 «Producing to a Kafka topic»):** topic, key, партиции, формат сообщения — кратко.
- **Практика (H2 «Generate a stream with Eventum»):** `kafka` output (bootstrap_servers, topic, key, formatter json); input `time-patterns` для реалистичного темпа.
- **Результат:** пример сообщения в топике.
- **FAQ:** «vs Kafka Connect Datagen?», «SASL/SSL?», «Multiple topics / fan-out?».
- **Перелинковка:** → pillar delivery; → realism (traffic patterns — Фаза 2); → reference `plugins/output/kafka`.

### Task 12: Переписать «SIEM: Windows Security → OpenSearch»
- **Файл:** `content/docs/tutorials/siem-events.mdx` (существующий; URL не меняется)
- **Primary-запрос:** `siem test data` (вторичный — существующий контент про Windows→OpenSearch).
- **Что сделать:** сохранить рабочий сквозной проект; добавить короткую теорию-врезку (что такое SIEM-тест-данные, зачем), заточить title/H1/description под запрос, добавить FAQ, добавить перелинковку на pillar scenarios, formats (Windows Event Log), delivery (OpenSearch). Не ломать существующие шаги/конфиги.
- **Результат:** без изменений по сути (уже есть).
- **Перелинковка:** → scenarios pillar; → formats/windows-event-log; → delivery/opensearch.

---

## Self-Review

**Spec coverage (§ spec → задача):**
- §5 треки B/D/E → Task 2/3/4 (pillar'ы) + Task 6-12 (уроки). Треки A/C — Фаза 2 (по плану вне scope Фазы 1). ✓
- §6 карта, уроки Фазы 1 → Task 6-12 покрывают все помеченные «Фаза 1»: formats field guide (Task 2 pillar), EVTX (6), CEF (7), LEEF (8), syslog (9), delivery pillar (3), OpenSearch (10), Kafka (11), SIEM pillar (4), siem-events (12). ✓
- §7 анатомия урока → брифы Task 6-12 следуют шаблону. ✓
- §8 SEO-механика → Task 5 (Course JSON-LD); breadcrumb/canonical/FAQ — из PR #43 + FAQ в брифах. ✓
- §9 IA/навигация → Task 1-4; **отклонение:** URL существующих не двигаем, редиректов нет (обосновано в Global Constraints). ✓
- §10 фазовый план → это план Фазы 1. ✓

**Placeholder scan:** навигационные задачи (1-5) содержат полный код/контент. Уроки (6-12) — намеренно брифы, не полный MDX, т.к. исполняются через `new-docs-page` (отмечено в заголовке плана). Это не placeholder-провал, а разделение механического кода и творческого письма.

**Type consistency:** `courseSchema` (Task 5) использует `pageUrl`, `ORGANIZATION`, `JsonLd` — имена из `lib/seo.ts` PR #43. Проверить их фактическое наличие после back-merge (предусловие).

**Открытый риск:** предусловие (PR #43 в базе) блокирует Task 5 и SEO-обвязку уроков — разрешить до старта.
