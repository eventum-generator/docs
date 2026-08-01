# Eventum Learn — Фаза 2: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: используйте superpowers:subagent-driven-development для исполнения по задачам. Шаги — чекбоксы (`- [ ]`).

**Goal:** Достроить курс «Eventum Learn» треками A (Основы) и C (Механики реалистичности), доп-форматами B (NDJSON/OCSF/ECS), доставкой D (ClickHouse/HTTP) и сценариями E (test-pipeline, detection, load, seeding) — согласно карте дизайна §6, фаза 2.

**Architecture:** Контент идёт волнами, каждая волна — самодостаточный набор задач с собственным subagent-driven прогоном и чек-пойнтом, все в ветке `feat/learning-course` (PR #45). Волны: W1 треки A+C + навигация → W2 форматы B → W3 доставка D → W4 сценарии E.

**Tech Stack:** Next.js 16 (App Router, `output: export`), Fumadocs 16 (MDX-коллекции), pnpm. SEO-инфра из PR #43 (`lib/seo.ts`, `JsonLd`, canonical/sitemap) переиспользуется.

## Global Constraints

- **Рабочая директория:** worktree `docs/.claude/worktrees/learning-course`, ветка `feat/learning-course`. Все пути ниже — от корня worktree.
- **Дизайн — источник истины:** `specs/2026-07-11-eventum-learning-course-design.md`. Анатомия урока §7, SEO-механика §8, IA §9.
- **Стиль docs** (правило `.claude/rules/docs/mdx.md` + память): end-user язык без внутренних движковых терминов; формальный регистр (без «live in», «out of the box», «hands you»); конкретика вместо общих фраз; без деталей реализации и перечислений внутренних полей; **прозу не хардврапить**; в коде single hyphen `-`, em dash `—` допустим только в MDX-прозе.
- **Анатомия урока (§7), единый порядок:** (1) Hook/задача; (2) Теория/объяснитель + Mermaid где помогает; (3) Как это в Eventum — `generator.yml` + шаблоны; (4) Результат — блок вывода в нужном формате; (5) Дальше — перелинковка cluster↔pillar + reference/Hub/Studio; (6) FAQ где есть реальные вопросы.
- **SEO (§8):** frontmatter `title`+`description` под ОДИН primary-запрос; H2 — под вторичные под-запросы; перелинковка cluster→pillar и pillar→cluster обязательна; Course JSON-LD только на pillar'ах (набор `COURSE_PILLARS`), уроки несут breadcrumb.
- **Точность фактов:** форматы/схемы сверять с первоисточниками (RFC, спецификации ECS/OCSF, вендор-доки); каждый Eventum-конфиг сверять с plugin reference (`content/docs/plugins/**`) и, где не нужен внешний бэкенд, прогонять через реальный CLI (`uv run eventum generate`).
- **URL стабильны:** существующие уроки не переезжают, редиректы не вводятся. Новые треки A/C — подпапки `foundations/`, `realism/`; новые сценарии — в корне `tutorials/`.
- **Primary-запросы (verbatim, из карты §6):**
  - `foundations/index.mdx` → `synthetic event data`, `synthetic log data`
  - `foundations/structured-logging.mdx` → `structured logging`
  - `realism/index.mdx` → `realistic test data`
  - `realism/timing.mdx` → `simulate traffic patterns`
  - `realism/sessions.mdx` → `simulate user sessions`
  - `realism/values.mdx` → `realistic fake data`
  - `formats/ndjson.mdx` → `NDJSON`, `json lines`
  - `formats/ocsf.mdx` → `OCSF`, `generate OCSF`
  - `formats/ecs.mdx` → `ECS fields`, `elastic common schema`
  - `delivery/clickhouse.mdx` → `clickhouse test data`
  - `delivery/http.mdx` → `send test data to api`
  - `test-data-pipeline.mdx` → `test data pipeline`
  - `detection-testing.mdx` → `test sigma rules`, `attack telemetry`
  - `load-testing.mdx` (переписать) → `load test data`
  - `csv-dataset.mdx` (переписать) → `seed database test data`
- **Verify:** `pnpm -C /home/nikita/projects/personal/eventum-generator/docs/.claude/worktrees/learning-course types:check && pnpm -C ... build`. Все внутренние ссылки и якоря должны резолвиться к концу волны.
- **Формат контентных задач:** уроки задаются БРИФОМ (primary-запрос, H2-структура, что покрыть в теории + источники сверки, какой Eventum-конфиг + reference, output-блок, перелинковка, FAQ), а не готовым MDX — текст урока пишет реализатор по исследованию. Scaffold/навигация/JSON-LD задаются полным кодом.

---

## Карта волн

| Волна | Состав | Новые файлы | Изменяемые файлы |
|---|---|---|---|
| **W1** | Треки A + C + навигация | `foundations/` (index+meta+structured-logging), `realism/` (index+meta+timing+sessions+values) | root `meta.json`, `index.mdx` (арка), `app/docs/[[...slug]]/page.tsx` (COURSE_PILLARS) |
| **W2** | Форматы (трек B) | `formats/ndjson.mdx`, `formats/ocsf.mdx`, `formats/ecs.mdx` | `formats/index.mdx` (Cards), `formats/meta.json` |
| **W3** | Доставка (трек D) | `delivery/clickhouse.mdx`, `delivery/http.mdx` | `delivery/index.mdx` (Cards), `delivery/meta.json` |
| **W4** | Сценарии (трек E) | `test-data-pipeline.mdx`, `detection-testing.mdx` | `load-testing.mdx` + `csv-dataset.mdx` (переписать), `scenarios/index.mdx` (Cards), root `meta.json` (scenario-группа) |

Детально ниже расписана **Волна 1**. Волны W2-W4 — состав в конце документа; их задачи детализируются брифами перед запуском соответствующей волны (как в Фазе 1 уроки детализировались по ходу через `task-brief`).

---

## Волна 1 — треки A (Основы) и C (Механики реалистичности) + навигация

Порядок: сначала оба pillar'а (задают Cards на свои cluster-уроки), затем cluster-уроки, затем навигация/JSON-LD одной задачей. Внутри волны Cards pillar'а могут временно ссылаться на ещё не написанный cluster — все ссылки обязаны резолвиться к чек-пойнту волны (проверяет ревью волны).

### Task 1.1: Pillar трека A — Foundations

**Files:**
- Create: `content/docs/tutorials/foundations/index.mdx`
- Create: `content/docs/tutorials/foundations/meta.json`

**Interfaces:**
- Produces: pillar-страница по URL `/docs/tutorials/foundations`; Cards на cluster-уроки трека A (`/docs/tutorials/foundations/structured-logging` — пишется Task 1.2; в Фазе 2 у трека A один cluster, остальные уроки трека A — фаза 3).
- `meta.json`: `{ "pages": ["index", "structured-logging"] }`.

**Бриф урока:**
- **Primary:** `synthetic event data` / `synthetic log data`. **Title/description** под него.
- **Роль:** образовательный вход в курс, угол «событийная/потоковая синтетика», НЕ privacy/ML (§2.3, §12 — не тянуть Gretel/Tonic/SDV термины).
- **Hook:** инженеру нужны реалистичные событийные/лог-данные, а реальных нет (прод трогать нельзя, статические датасеты мертвы, Faker не стримит) — §3 нарратив.
- **Теория:** что такое синтетические событийные/лог-данные; чем отличаются от плоских дампов Faker/Mockaroo (time-aware, непрерывные, параметризуемые — ось §2.4); где применяются (роли §4 кратко). Без privacy/ML уклона.
- **Как в Eventum (обзорно, pillar):** трёхстадийный пайплайн input→event→output одной фразой пользовательского уровня; ссылка на overview/quickstart docs, не углубляться (детали — в cluster-уроках и reference).
- **Cards** на: `structured-logging` (Task 1.2). Плюс cross-track Cards/ссылки на pillar'ы Formats и Realism (арка A→B→C).
- **Дальше / Related:** pillar Formats, pillar Realism, quickstart/overview docs, Hub.
- **Источники сверки:** существующие overview/quickstart страницы docs (`content/docs/**` — найти реальные пути); НЕ выдумывать возможности.

### Task 1.2: Cluster трека A — Structured logging

**Files:**
- Create: `content/docs/tutorials/foundations/structured-logging.mdx`

**Бриф урока:**
- **Primary:** `structured logging`. Title/H1/description под него.
- **Hook:** боль плоских строковых логов (grep-парсинг хрупок), переход к структурным (ключ-значение/JSON) — §3 «конвенции».
- **Теория:** что такое structured logging; строковые vs JSON/ключ-значение; почему структура нужна для парсинга/поиска/детектов; связь с форматами (мост к треку B — ECS/OCSF как структурные схемы). H2 под вторичные: «structured logging vs plain text», «structured logging format», «structured logging best practices» — только те, что несут реальный ответ.
- **Как в Eventum:** генерация структурных событий template-плагином + JSON formatter; пример `generator.yml` с template event + JSON output; шаблон, эмитящий структурные поля. Сверить с `content/docs/plugins/event/template/**` и `content/docs/plugins/formatters.mdx` (реальные поля/синтаксис). Прогнать конфиг через реальный CLI (output в локальный файл — внешний бэкенд не нужен).
- **Результат:** блок сгенерированного структурного JSON-события.
- **Дальше:** pillar Foundations; ECS-урок (трек B, фаза 2 W2) — forward-link допустим (закроется в W2, финальное ревью Фазы 2 проверит); формат-pillar; reference template/formatters.
- **FAQ:** реальные вопросы («is JSON structured logging?», «structured vs unstructured») где несут ответ.

### Task 1.3: Pillar трека C — Making synthetic data realistic

**Files:**
- Create: `content/docs/tutorials/realism/index.mdx`
- Create: `content/docs/tutorials/realism/meta.json`

**Interfaces:**
- Produces: pillar по URL `/docs/tutorials/realism`; Cards на `timing`, `sessions`, `values` (Tasks 1.4-1.6).
- `meta.json`: `{ "pages": ["index", "timing", "sessions", "values"] }`.

**Бриф урока:**
- **Primary:** `realistic test data`. Title/description под него.
- **Роль:** ось дифференциации курса (§2.4, §5-C) — что делает синтетику правдоподобной, обзор техник с картой на cluster-уроки.
- **Hook:** равномерный рандом даёт нереалистичный трафик; реальные данные скошены во времени, значениях, имеют сессии и корреляции.
- **Теория (обзор трёх осей реалистичности, каждая → свой cluster):** (1) тайминг — пики/всплески/затишья вместо ровной струи; (2) сессии/состояние — события связаны в жизненные циклы; (3) значения — скошенные распределения и доменные значения вместо uniform. Кратко, без ухода в детали (детали — cluster-уроки).
- **Как в Eventum (обзорно):** назвать пользовательские механизмы — временны́е паттерны на входе, состояние в шаблонах, распределения/выборки значений; без внутренних терминов.
- **Cards** на: `timing`, `sessions`, `values`. Cross-link на pillar'ы Formats (что делаем реалистичным) и Delivery (куда доставляем).
- **Источники сверки:** `.claude/rules/content/templates.md` (реальные фичи: `module.rand.number` lognormal/exponential/gauss, `weighted_choice`, `fsm` mode, state scopes, `time_patterns` input) + соответствующие `content/docs/plugins/**`.

### Task 1.4: Cluster трека C — Realistic timing

**Files:**
- Create: `content/docs/tutorials/realism/timing.mdx`

**Бриф урока:**
- **Primary:** `simulate traffic patterns`. H2 под вторичные («simulate peak traffic», «bursty traffic», «diurnal pattern»).
- **Hook:** ровный cron/timer поток нереалистичен; реальный трафик имеет суточные пики, всплески, затишья.
- **Теория:** временны́е паттерны нагрузки (диурнальность, всплески, выходные/ночь); почему это важно для нагрузочных/детект-тестов.
- **Как в Eventum:** input-плагин временны́х паттернов (`time_patterns`, `patterns/` YAML) — распределение таймстампов во времени; пример конфигурации с паттерном пик/затишье. Сверить с `content/docs/plugins/input/**` (реальный синтаксис time_patterns и файлов паттернов). CLI-прогон (output в файл).
- **Результат:** демонстрация распределённых во времени таймстампов (напр. счётчик по часам / фрагмент вывода).
- **Дальше:** pillar Realism; sessions/values (соседние cluster); delivery-pillar (нагрузка на бэкенд); reference input-плагинов; Hub.
- **FAQ:** где есть реальные вопросы.

### Task 1.5: Cluster трека C — Modeling sessions

**Files:**
- Create: `content/docs/tutorials/realism/sessions.mdx`

**Бриф урока:**
- **Primary:** `simulate user sessions`. H2 под вторичные («user session simulation», «state machine events», «login logout sequence»).
- **Hook:** независимые случайные события нереалистичны; реальная активность — связанные сессии (login → действия → logout).
- **Теория:** моделирование сессий/состояния; конечные автоматы (state machine) для последовательностей; корреляция событий одной сессии (мост к треку C «корреляция» — фаза 3).
- **Как в Eventum:** template-плагин, `mode: fsm` (state machine по полю состояния) + `shared`/`locals` state для корреляции внутри сессии; пример `generator.yml` с fsm-переходами login→activity→logout. Сверить с `content/docs/plugins/event/template/**` (реальные mode/state семантики). CLI-прогон.
- **Результат:** блок последовательности событий одной сессии (общий session id, упорядоченные шаги).
- **Дальше:** pillar Realism; timing/values; web-clickstream сценарий (трек E — использует ту же технику); reference template state/modes.
- **FAQ:** где уместно.
- **Примечание:** это НЕ переезд `web-clickstream` — это отдельный обучающий урок про технику сессий; web-clickstream остаётся сценарием трека E (фаза 3). Не дублировать сборку clickstream — фокус на технике.

### Task 1.6: Cluster трека C — Realistic values

**Files:**
- Create: `content/docs/tutorials/realism/values.mdx`

**Бриф урока:**
- **Primary:** `realistic fake data`. H2 под вторичные («realistic fake data generator», «weighted random data», «skewed distribution test data»).
- **Hook:** uniform-рандом даёт плоские нереалистичные значения; реальные метрики скошены, категориальные — взвешены.
- **Теория:** скошенные распределения (lognormal для размеров, exponential для длительностей, gauss для метрик); взвешенный выбор (status codes, протоколы); доменные значения (имена/адреса/продукты) vs синтетический шум; предгенерированные пулы (samples). Мост к памяти `feedback_module_helpers_scope` — генерировать значения в реалистичных диапазонах, не считать аналитику.
- **Как в Eventum:** `module.rand.number` (lognormal/exponential/gauss), `module.rand.weighted_choice`, `module.faker`/`module.mimesis`, `samples`; пример шаблона, комбинирующего скошенные числа + взвешенные категории + faker-значения. Сверить с `content/docs/plugins/event/template/modules.mdx` (реальные функции/неймспейсы). CLI-прогон.
- **Результат:** блок события с правдоподобными значениями (скошенные размеры, взвешенный статус, доменные строки).
- **Дальше:** pillar Realism; timing/sessions; formats-уроки (значения в контексте формата); reference template modules.
- **FAQ:** где уместно.

### Task 1.7: Навигация, арка и Course JSON-LD

Механическая задача — полный код ниже.

**Files:**
- Modify: `content/docs/tutorials/meta.json`
- Modify: `content/docs/tutorials/index.mdx`
- Modify: `app/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `/docs/tutorials/foundations` и `/docs/tutorials/realism` (Tasks 1.1, 1.3) должны существовать до этой задачи, иначе Cards/nav ссылаются в пустоту. Ставить последней в волне.

- [ ] **Шаг 1: root `meta.json` — вставить Foundations в начало арки, Realism между Formats и Delivery**

```json
{
  "root": true,
  "icon": "GraduationCap",
  "pages": [
    "index",
    "---Foundations---",
    "foundations",
    "---Formats---",
    "formats",
    "---Realism---",
    "realism",
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

- [ ] **Шаг 2: `app/docs/[[...slug]]/page.tsx` — добавить два pillar'а в `COURSE_PILLARS`**

Заменить набор (и снять из комментария «Phase 2 adds …», т.к. добавлено):

```tsx
// Course JSON-LD belongs on course pillars only (overview + track
// indexes), not on individual lessons.
const COURSE_PILLARS = new Set([
  '/docs/tutorials',
  '/docs/tutorials/foundations',
  '/docs/tutorials/formats',
  '/docs/tutorials/realism',
  '/docs/tutorials/delivery',
  '/docs/tutorials/scenarios',
]);
```

- [ ] **Шаг 3: `content/docs/tutorials/index.mdx` — арка (снять upcoming с FND/RLS, убрать caption) + секции Foundations и Realism**

В Mermaid-блоке заменить классы FND и RLS с `:::upcoming` на `:::section`; удалить строку-подпись `_Foundations and Realism tracks are on the way._`. Добавить секции (Foundations — первой, перед «Formats & schemas»; Realism — между Formats и Delivery), например:

```mdx
## Foundations

Start here: what synthetic event and log data is, and why structure matters.

<Cards>
  <Card title="Synthetic data for event & log pipelines" description="What it is, how it differs from flat Faker dumps, and where it fits." href="/docs/tutorials/foundations" />
</Cards>
```

```mdx
## Realism

Techniques that turn a flat stream into data that behaves like production.

<Cards>
  <Card title="Making synthetic data realistic" description="Timing, sessions, and value distributions that mimic real sources." href="/docs/tutorials/realism" />
</Cards>
```

- [ ] **Шаг 4: verify + commit**

Run: `pnpm -C <worktree> types:check && pnpm -C <worktree> build`
Expected: PASS; Course JSON-LD присутствует на 6 pillar'ах (overview + 5 треков), отсутствует на уроках/root docs; Foundations и Realism видны в sidebar в порядке арки; арка в overview без пунктирных upcoming-узлов.

### Чек-пойнт Волны 1

- Все ссылки треков A/C резолвятся (pillar↔cluster, cross-track).
- `types:check` + `build` зелёные.
- Ledger `progress.md`: записи Task 1.1-1.7.
- Финальное ревью Фазы 2 (после W4) отдельно подтверждает forward-links (напр. structured-logging → ecs) закрыты.

---

## Волна 2 — Форматы (трек B): NDJSON, OCSF, ECS

Новые cluster-уроки в `formats/`, обновление `formats/index.mdx` (Cards) и `formats/meta.json` (`["index","windows-event-log","cef","leef","syslog","ndjson","ocsf","ecs"]`).

- **NDJSON / JSON Lines** (`NDJSON`,`json lines`): что такое NDJSON vs JSON-массив, где применяется (лог-шипперы, bulk-ingest); генерация NDJSON — JSON formatter, по событию на строку. Сверить с `content/docs/plugins/formatters.mdx`.
- **OCSF** (`OCSF`,`generate OCSF`): Open Cybersecurity Schema Framework — классы/категории/атрибуты; сверить с ocsf.io schema (первоисточник); генерация OCSF-события template-плагином.
- **ECS** (`ECS fields`,`elastic common schema`): Elastic Common Schema - core поля (`@timestamp`,`event.*`,`host.*`,`related.*`); сверить с Elastic ECS reference; генерация ECS-совместимого события. Закрывает forward-link из structured-logging (W1).

### Task 2.1: Cluster трека B — NDJSON / JSON Lines

**Files:**
- Create: `content/docs/tutorials/formats/ndjson.mdx`

**Бриф урока:**
- **Primary:** `NDJSON` / `json lines`. Title/H1/description под него. Вторичные H2: «NDJSON vs JSON», «what is JSON Lines», «NDJSON example».
- **Hook:** один JSON-массив нельзя стримить/докидывать построчно; лог-шипперы и bulk-ingest хотят по объекту на строку.
- **Теория:** NDJSON = newline-delimited JSON (одно валидное JSON-значение на строку, разделитель `\n`); синонимы JSON Lines / JSONL; отличие от JSON-массива (стримится, дописывается, обрабатывается построчно); где применяется (Elasticsearch/OpenSearch bulk, Filebeat/Fluent Bit, `jq`, load в аналитические хранилища). Не выдумывать RFC (это de-facto формат, jsonlines.org / ndjson.org).
- **Как в Eventum:** file output + JSON formatter - каждое событие пишется своей строкой. Сверить с `content/docs/plugins/formatters.mdx` (json formatter: компактный, по событию на строку) и `content/docs/plugins/output/file.mdx`. Пример `generator.yml`. CLI-прогон (output в локальный файл), убедиться что вывод - валидный NDJSON.
- **Результат:** блок NDJSON-вывода (несколько строк реального вывода).
- **Дальше:** formats pillar; structured-logging (foundations - JSON как структура); ecs/ocsf (схемы поверх NDJSON, forward - ecs/ocsf пишутся 2.2/2.3, by design); delivery/opensearch (bulk API использует NDJSON); reference formatters/file.
- **FAQ:** «is NDJSON valid JSON?» (файл целиком - нет, каждая строка - да); «NDJSON vs JSON Lines vs JSONL» (одно и то же).

### Task 2.2: Cluster трека B — OCSF

**Files:**
- Create: `content/docs/tutorials/formats/ocsf.mdx`

**Бриф урока:**
- **Primary:** `OCSF` / `generate OCSF`. Title/H1/description под него. Вторичные H2: «what is OCSF», «OCSF example», «OCSF vs ECS».
- **Hook:** каждый security-вендор изобретал свою схему; OCSF - вендор-нейтральная унифицированная схема событий безопасности.
- **Теория:** Open Cybersecurity Schema Framework - категории (`category_uid`), классы событий (`class_uid`), активность (`activity_id`), составной `type_uid`; обязательный каркас (`metadata`, `time`, `severity_id`, `class_uid`, `category_uid`, `activity_id`); кто применяет (AWS Security Lake, Splunk и др.). **Сверить с первоисточником schema.ocsf.io** (WebFetch): выбрать один реальный класс (напр. Authentication `3002` или Process Activity `1007`) и его реальные поля/enum-значения. Точность критична - неверная схема вредит авторитету.
- **Как в Eventum:** template-плагин + JSON formatter; шаблон, эмитящий валидное OCSF-событие выбранного класса. Сверить структуру с OCSF schema; конфиг - с `content/docs/plugins/event/template/**` и `formatters.mdx`. CLI-прогон.
- **Результат:** блок реального OCSF-события (валидная структура выбранного класса).
- **Дальше:** formats pillar; ecs (сравнение схем, forward - ecs пишется 2.3, by design); detection-testing (трек E - security-телеметрия, forward к W4, by design); delivery; reference.
- **FAQ:** «OCSF vs ECS» (обе - схемы нормализации; кратко о разнице фокуса); «who uses OCSF».

### Task 2.3: Cluster трека B — ECS

**Files:**
- Create: `content/docs/tutorials/formats/ecs.mdx`

**Interfaces:**
- Closes the forward link `structured-logging -> /docs/tutorials/formats/ecs` (opened in W1). After this task that link resolves.

**Бриф урока:**
- **Primary:** `ECS fields` / `elastic common schema`. Title/H1/description под него. Вторичные H2: «what is Elastic Common Schema», «ECS fields», «ECS example».
- **Hook:** разные источники называют одно и то же по-разному; ECS даёт единый словарь полей для Elastic/OpenSearch.
- **Теория:** Elastic Common Schema - структура и namespacing; core-поля (`@timestamp`, `ecs.version`, `event.*` [`event.category`/`event.type`/`event.action`/`event.outcome`], `host.*`, `related.*`); правило `related.*` = всегда массивы (даже одно значение как `["x"]`). **Сверить с первоисточником Elastic ECS reference** (WebFetch elastic.co/guide ECS): реальные имена полей, допустимые значения `event.category`/`event.type`. H2 вторичные несут реальный ответ.
- **Как в Eventum:** template-плагин + JSON formatter; шаблон, эмитящий ECS-совместимое событие. Сверить поля с ECS reference; конфиг - с template/formatters reference. CLI-прогон. Согласовать терминологию с тем, как structured-logging (foundations) уже описывает ECS.
- **Результат:** блок реального ECS-совместимого события.
- **Дальше:** formats pillar; **structured-logging (обратная ссылка - закрывает forward-link)**; ocsf (сравнение); siem-events / delivery/opensearch (ECS в SIEM-контексте); reference.
- **FAQ:** «ECS vs OCSF»; «which ECS fields are required» (честно: минимальный практичный набор).

### Task 2.4: Formats pillar Cards + meta.json (навигация трека B)

Механическая задача.

**Files:**
- Modify: `content/docs/tutorials/formats/index.mdx` (добавить Cards на ndjson, ocsf, ecs к существующим 4)
- Modify: `content/docs/tutorials/formats/meta.json`

**Interfaces:**
- Consumes: ndjson/ocsf/ecs (Tasks 2.1-2.3) должны существовать. Ставить последней в волне.
- `meta.json`: `{ "pages": ["index", "windows-event-log", "cef", "leef", "syslog", "ndjson", "ocsf", "ecs"] }`.

- [ ] **Шаг 1:** прочитать реальные frontmatter `ndjson.mdx`, `ocsf.mdx`, `ecs.mdx`; добавить в `formats/index.mdx` три `<Card>` (после существующих syslog Card), тексты - точные к реальным title/description уроков, тон - как у существующих Card.
- [ ] **Шаг 2:** обновить `formats/meta.json` набором выше.
- [ ] **Шаг 3:** verify + commit. `pnpm -C <worktree> types:check && build`. Course JSON-LD на formats pillar не меняется (formats уже в наборе). Убедиться, что sidebar трека B показывает 7 уроков в заданном порядке.

### Чек-пойнт Волны 2

- Все ссылки трека B резолвятся; forward-link `structured-logging -> formats/ecs` теперь ЗАКРЫТ (Task 2.3).
- `types:check` + `build` зелёные.
- Ledger: записи Task 2.1-2.4.

## Волна 3 — Доставка (трек D): ClickHouse, HTTP

Новые cluster-уроки в `delivery/`, обновление `delivery/index.mdx` (Cards) и `delivery/meta.json` (`["index","opensearch","kafka","clickhouse","http"]`).

- **ClickHouse** (`clickhouse test data`): позиционирование против `generateRandom` (§2.3); output-плагин ClickHouse; сверить поля с `content/docs/plugins/output/**` (в т.ч. `pool_maxsize`, см. ветку fix/clickhouse-pool-maxsize).
- **HTTP endpoint** (`send test data to api`): отправка событий в произвольный HTTP-эндпоинт; output-плагин HTTP; сверить с reference.

### Task 3.1: Cluster трека D — ClickHouse

**Files:**
- Create: `content/docs/tutorials/delivery/clickhouse.mdx`

**Бриф урока** (анатомия как `delivery/kafka.mdx` - образец):
- **Primary:** `clickhouse test data`. Title/H1/description под него. Вторичные H2: «insert test data into ClickHouse», «ClickHouse sample data», «generateRandom vs ...».
- **Hook:** нужны данные в ClickHouse для проверки запросов/дашбордов/materialized views/партиционирования, но прод трогать нельзя, а встроенный `generateRandom()` / `INSERT ... SELECT` даёт плоский одноразовый набор без времени, сессий и реалистичных распределений.
- **Теория:** ClickHouse - колоночная аналитическая БД; вставка через HTTP-интерфейс; `input_format` (`JSONEachRow` - по JSON-объекту на строку). Позиционирование vs `generateRandom` (§2.3): generateRandom - одноразовая плоская выборка внутри БД; Eventum - непрерывный time-aware поток со скошенными распределениями, наполняющий таблицу так, как это делал бы реальный источник (важно для time-series запросов, TTL, партиционирования по времени).
- **Как в Eventum:** `clickhouse` output (`host`, `database`, `table`, `username`, `password: ${secrets.ch_password}` через keyring), `json` formatter + дефолтный `JSONEachRow`. Пример `generator.yml`: template-событие (аналитическое событие/метрика с реалистичными значениями) + `time_patterns` для реалистичного темпа (как в kafka-уроке) + `clickhouse` output. Упомянуть `pool_maxsize` (дефолт 32) и связь с `generation.max_concurrency` при всплесках. Сверить ВСЕ поля с `content/docs/plugins/output/clickhouse.mdx`.
- **Результат:** реального ClickHouse-сервера нет - валидировать через `stdout` swap (ТОЧНО как kafka-урок: "no cluster reachable, validated by pointing at stdout"), показать реальные `JSONEachRow`-строки, что ушли бы в INSERT, + краткую подсказку `CREATE TABLE` под них. Callout про swap `clickhouse`->`stdout` для проверки без сервера. BOUNDED CLI через stdout (timeout + live-mode).
- **Дальше:** delivery pillar; opensearch/kafka (соседи); web-clickstream сценарий (ClickHouse-приёмник, существует в корне); realism/timing (реалистичный темп); reference `clickhouse` output.
- **FAQ:** «generateRandom vs Eventum» (конкретно); `pool_maxsize`/`max_concurrency` при bulk; «какой `input_format`/schema».

### Task 3.2: Cluster трека D — HTTP endpoint

**Files:**
- Create: `content/docs/tutorials/delivery/http.mdx`

**Бриф урока:**
- **Primary:** `send test data to api`. Title/H1/description под него. Вторичные H2: «test data for API endpoint», «webhook test data», «batch vs per-request».
- **Hook:** нужно накормить/протестировать HTTP API, webhook-приёмник или ingest-эндпоинт реалистичными payload в потоке, но реального источника нет; `curl` в цикле шлёт один и тот же payload, не поток с реалистичным темпом и содержимым.
- **Теория:** HTTP-доставка событий (метод, целевой URL, ожидаемый `success_code`); батчинг - `json-batch` (все события батча одним JSON-массивом, одна request на batch) vs `json` (по событию); заголовки и аутентификация (Bearer-токен, basic auth). Где применяется: webhook-приёмники, ingest-API, HTTP-логколлекторы, нагрузка на API (мост к load-testing сценарию).
- **Как в Eventum:** `http` output (`url`, `method: POST`, `success_code`, `headers` с `Authorization: "Bearer ${secrets.api_token}"`, `formatter: json-batch` по умолчанию). Пояснить, что размер батча задаётся `batch.size`/`batch.delay` генератора, не самим output. Пример `generator.yml`. Сверить ВСЕ поля с `content/docs/plugins/output/http.mdx`.
- **Результат:** реального эндпоинта нет - валидировать через `stdout` swap (как kafka/clickhouse), показать реальный `json-batch` payload (JSON-массив событий), что ушёл бы одной POST-request. Callout про swap. BOUNDED CLI через stdout.
- **Дальше:** delivery pillar; opensearch/kafka/clickhouse (соседи); load-testing сценарий (HTTP-нагрузка, существует в корне); reference `http` output; Secrets (keyring для токена).
- **FAQ:** «batch vs per-event» (`json-batch` vs `json` formatter + batch settings); аутентификация (Bearer/basic/keyring); что если `success_code` не совпал (write counted failed).

### Task 3.3: Delivery pillar Cards + meta.json (навигация трека D)

Механическая задача.

**Files:**
- Modify: `content/docs/tutorials/delivery/index.mdx` (добавить Cards на clickhouse, http после kafka)
- Modify: `content/docs/tutorials/delivery/meta.json`

**Interfaces:**
- Consumes: clickhouse/http (Tasks 3.1-3.2) должны существовать. Ставить последней в волне.
- `meta.json`: `{ "pages": ["index", "opensearch", "kafka", "clickhouse", "http"] }`.

- [ ] **Шаг 1:** прочитать реальные frontmatter `clickhouse.mdx`, `http.mdx`; добавить в `delivery/index.mdx` два `<Card>` (после kafka Card), тексты точны к реальным title/description, тон как у существующих Card. Intro pillar'а УЖЕ упоминает OpenSearch/Kafka/ClickHouse/HTTP - НЕ менять (уже полон).
- [ ] **Шаг 2:** обновить `delivery/meta.json` набором выше.
- [ ] **Шаг 3:** verify `pnpm types:check` (НЕ build); commit. Убедиться, что sidebar трека D показывает 5 уроков в заданном порядке.

### Чек-пойнт Волны 3

- Все ссылки трека D резолвятся; `types:check` зелёный.
- Ledger: записи Task 3.1-3.3.

## Волна 4 — Сценарии (трек E): test-pipeline, detection, load, seeding

Новые в корне `tutorials/`; переписать `load-testing.mdx` и `csv-dataset.mdx` на месте; обновить `scenarios/index.mdx` и root `meta.json` (scenario-группа += `test-data-pipeline`, `detection-testing`).

**Решение по scenarios pillar (утв. пользователем, расходится с design-спекой §трек E):** дизайн-спека таргетила `scenarios/index.mdx` узко под `generate data for SIEM`; в W4 pillar РАСШИРЯЕТСЯ до общего applied-зонтика трека E (title/description/hook с SIEM → обзор применения синтетики; Cards на все сценарии). URL и Course JSON-LD стабильны. Каннибализацию с `test-data-pipeline` (`test data pipeline`) снимаем разведением primary: pillar = обзорный зонтик применения, test-data-pipeline = конкретный сквозной how-to; связать перелинковкой.

- **Test your data pipeline before production** (`test data pipeline`, ⭐ pillar-grade): цель арки (§3 этап 6); сквозной сценарий — сгенерировать → доставить → проверить, что бэкенд принял; крупная страница.
- **Detection testing** (`test sigma rules`,`attack telemetry`): телеметрия под Sigma/ATT&CK без реальных атак; связать с siem-events и Windows/Sysmon форматами.
- **Load testing** (`load test data`, переписать `load-testing.mdx`): добавить теорию нагрузки + реалистичные payload; сохранить рабочую сборку, править аддитивно (как siem-events в Фазе 1).
- **Seeding** (`seed database test data`, переписать `csv-dataset.mdx`): добавить теорию seed dev/staging; сохранить рабочую CSV-сборку, править аддитивно.

Порядок: 4.1-4.4 создают/переписывают уроки, 4.5 (навигация) последней (consumes 4.1-4.4). Общие требования (все задачи W4): SEO — primary в title/H1/description; вторичные фразы в H2 verbatim, но естественно (не stuffing). Факты сверять с reference `content/docs/plugins/**` и первоисточниками. Стиль docs: end-user язык, формальный регистр, single hyphen `-` в коде / em dash `—` в прозе, без hard-wrap. Верификация: `pnpm types:check` ТОЛЬКО (НЕ `pnpm build` - вешает WSL). CLI-валидация bounded (timeout + `--live-mode`); доставку в http/broker/DB валидировать через swap на `stdout` (сервера нет); НЕ `pkill eventum` (на машине живёт пользовательский процесс); temp-файлы удалять. FSM comparison conditions (eq/gt/ge/lt/le/len_*/matches/contains/in) сломаны багом eventum#178 - использовать `defined`/chance-веса, НЕ сравнения.

### Task 4.1: Cluster трека E — Test your data pipeline (⭐ pillar-grade, сквозной)

**Files:**
- Create: `content/docs/tutorials/test-data-pipeline.mdx` (в корне `tutorials/`)

**Бриф урока** (крупная страница; анатомия как pillar-урок - обзор темы + сквозной прогон + карта на компоненты арки):
- **Primary:** `test data pipeline`. Title/H1/description под него. Вторичные H2 (verbatim, естественно): «test data pipeline before production», «end-to-end data pipeline testing», «validate data pipeline».
- **Hook:** перед продом надо убедиться, что весь конвейер работает целиком - источник → транспорт → хранилище/бэкенд → дашборды/алерты/запросы - на реалистичном потоке, а не на трёх примерах, вставленных руками; ждать реального трафика, чтобы найти сломанный парсер или упавший индекс, дорого и поздно.
- **Теория:** что значит «протестировать data pipeline» end-to-end: сгенерировать реалистичный поток → доставить в бэкенд тем же транспортом, что и прод → подтвердить, что бэкенд принял (счётчики приёма, запрос к данным, число документов в индексе). Роль синтетики: воспроизводимый, параметризуемый, безопасный (без PII/без прода) поток, который можно гонять в CI и на staging. Где применяется: приёмка нового источника, регресс парсеров/маппингов, проверка дашбордов/алертов на реальном объёме.
- **Как в Eventum:** это сквозная страница-хаб, собирающая всю арку - реалистичный шаблон (трек C realism), формат под бэкенд (трек B formats), доставка (трек D delivery), проверка приёма (метрики `write_ok`/`write_failed` через REST API либо summary при exit). Показать ОДИН связный `generator.yml` (напр. события → OpenSearch либо ClickHouse либо HTTP - выбрать один бэкенд, наиболее наглядный для «проверить приём»). Сверить метрики-поля и способ их чтения с `content/docs/core/**` (REST-метрики) и `content/docs/plugins/output/**`.
- **Результат:** три наблюдаемых шага - (a) генерация (реальный вывод событий), (b) доставка (что ушло бы в бэкенд), (c) проверка приёма (метрики `write_ok`/`write_failed` из summary, либо запрос к бэкенду). Реального сервера нет: (a)+(b) валидировать через `stdout` swap + метрики bounded CLI; (c) - показать реальный summary с метриками, а серверную проверку описать (запрос/counter) с swap-подсказкой. Callout про swap на `stdout` для прогона без бэкенда.
- **Дальше (сквозной хаб):** это узловая страница трека E - ссылки на delivery-track (`delivery/opensearch`,`kafka`,`clickhouse`,`http`), realism-track (`realism`), formats-track (`formats`) как на «слои» конвейера; и на конкретные сценарии-источники (`siem-events`, `load-testing`, `csv-dataset`, `detection-testing`) как на примеры того, ЧТО прогонять через конвейер. Плюс scenarios pillar и Hub.
- **FAQ:** «как убедиться, что бэкенд принял» (метрики приёма / запрос к данным); «нет реального бэкенда» (swap на `stdout` + summary-метрики); «чем отличается от load-testing» (pipeline correctness/приёмка vs пропускная способность).

### Task 4.2: Cluster трека E — Detection testing (закрывает forward-link из ocsf.mdx)

**Files:**
- Create: `content/docs/tutorials/detection-testing.mdx` (в корне `tutorials/`)

**Бриф урока** (defensive/blue-team тема: форма событий под детекты, НЕ эксплойт-код/payload):
- **Primary:** `test sigma rules`. Title/H1/description под него. Вторичные H2 (verbatim, естественно): «attack telemetry», «test detection rules», «Sigma rule testing».
- **Hook:** детект-инженеру нужно доказать, что правило срабатывает на нужной телеметрии и молчит на benign-шуме; реальные атаки требуют лаборатории, а статические образцы устаревают и не покрывают вариации (разные хосты, пользователи, тайминг).
- **Теория:** detection testing = прогнать правило против телеметрии, содержащей и «сработку» (attack-like паттерн), и benign-фон. Sigma - generic signature-формат для правил; ATT&CK - таксономия техник для маппинга. Синтетика даёт параметризуемую attack-like телеметрию БЕЗ запуска эксплойтов - воспроизводит ФОРМУ событий (последовательность, поля), которую матчит правило, не вредоносный код. Что можно (форма/последовательность событий, benign+malicious микс), что нельзя/не нужно (реальные payload/эксплойты).
- **Как в Eventum:** template-события в SIEM-формате (Windows Security / Sysmon / OCSF Authentication из `formats/ocsf` - выбрать наглядный), воспроизводящие паттерн, который матчит конкретное Sigma-правило (напр. серия failed logon EventID 4625 → success 4624 = brute-force; либо подозрительный process-ancestry). Benign-фон + attack-like смешать через `chance`-веса (НЕ FSM-сравнения - eventum#178). Показать конкретное Sigma-правило (в docs, как иллюстрацию) и телеметрию, которую оно поймает. Сверить event-поля с `formats/windows-event-log` / `formats/ocsf` и Sigma-схемой (первоисточник sigmahq).
- **Результат:** реальный вывод телеметрии (bounded CLI), в котором виден паттерн под правило (напр. N×4625 подряд с одного src → 4624). Опционально - показать сам Sigma-detection блок как иллюстрацию соответствия.
- **Дальше (ОБЯЗАТЕЛЬНО закрыть back-link):** урок ДОЛЖЕН содержать ссылку на `formats/ocsf` (ocsf.mdx:265 ссылается сюда - `/docs/tutorials/detection-testing`). Плюс: `siem-events` (сессии/OpenSearch), `formats/windows-event-log`, scenarios pillar, Hub security-генераторы (`windows-security`, `windows-sysmon`).
- **FAQ:** «нужны ли реальные атаки» (нет - форма событий, не эксплойты); «как связать с ATT&CK» (маппинг техники → event-поля); «benign + malicious микс» (chance-веса).

### Task 4.3: Rewrite трека E — Load testing (аддитивно)

**Files:**
- Modify: `content/docs/tutorials/load-testing.mdx` (переписать НА МЕСТЕ, аддитивно)

**Бриф** (модель - siem-events reframe в Фазе 1: НЕ ломать рабочую сборку, добавить учебный слой сверху + переориентировать frontmatter под primary):
- **Primary:** `load test data`. Title/H1/description переориентировать под него (сейчас «API Load Testing» - сохранить смысл, добавить `load test data` в title/description). Вторичные H2 (verbatim): «realistic load test data», «load testing with diverse payloads».
- **Что ДОБАВИТЬ (учебный слой):** intro/теория - что такое load test data и почему разнообразие payload важно (один и тот же body из `curl` в цикле не бьёт по кэшам, ветвлениям валидатора, разным путям кода; реальная нагрузка - разнообразные, реалистично-распределённые запросы); реализм payload (faker/rand-распределения вместо константных тел); связь throughput vs correctness.
- **Что СОХРАНИТЬ (рабочая сборка, не ломать):** существующие шаги, `static` input count 5000, `chance` CRUD-микс (get/create/update/delete), 4 шаблона, `http` output `json-batch`, флаги `--batch.size`/`--max-concurrency`, секции Prerequisites/Project structure/Build it/Going further/What's next. Callout про «только свои API» сохранить.
- **Cross-links (вписать в арку):** `delivery/http` (доставка/батчинг в глубину), `realism/values` (распределения payload), `test-data-pipeline` (нагрузка как один из прогонов конвейера), scenarios pillar.
- **ПОЧИНИТЬ drift (найдено при 4.1, сверено с source - обязательно при переписывании):** текущий `load-testing.mdx` содержит неверные факты: (1) метрика `write_ok` → реальное поле `written` (реальные output-поля: `written`/`write_failed`/`format_failed`, модель `OutputPluginStats`); (2) endpoint `http://localhost:9474/api/v1/instances/load-test/metrics` → реально `http://localhost:9474/api/generators/{id}/stats` (нет `/v1`, нет `/instances`, `metrics`→`stats`; mount `/api` + prefix `/generators` + route `/{id}/stats`); (3) `eventum generate` НЕ печатает exit-summary ни при какой verbosity - live-метрики доступны только под `eventum run` через stats-endpoint/Studio - секцию «Monitor results» переформулировать честно; (4) битый якорь `/docs/core/concepts/scheduling#live-mode-vs-sample-mode` → `/docs/core/concepts/generator#sample-mode`.
- **Верификация:** после правок убедиться, что существующая сборка ВСЁ ЕЩЁ валидна - bounded CLI через `stdout` swap для http (эндпоинта нет), реальный вывод. types:check.

### Task 4.4: Rewrite трека E — Seeding (аддитивно)

**Files:**
- Modify: `content/docs/tutorials/csv-dataset.mdx` (переписать НА МЕСТЕ, аддитивно)

**Бриф** (модель - siem-events reframe: НЕ ломать рабочую CSV-сборку, добавить учебный слой + переориентировать frontmatter):
- **Primary:** `seed database test data`. Title/H1/description переориентировать (сейчас «E-Commerce Transactions → CSV» - сохранить сам build, но заголовок под seeding). Вторичные H2 (verbatim): «seed dev database», «database seeding with realistic data», «seed staging environment».
- **Что ДОБАВИТЬ (учебный слой):** intro/теория seeding - зачем наполнять dev/staging реалистичным объёмом и распределениями (пустая БД скрывает баги пагинации, производительности запросов, граничных случаев; production-дамп = PII-риск); CSV как универсальный import-формат (`COPY`/`LOAD DATA`/import-мастера); прямой seed в аналитическую БД.
- **Что СОХРАНИТЬ (рабочая сборка, не ломать):** `data/products.json`, 3 шаблона (purchase/refund/chargeback), `linspace` count 10000, `chance` 80/15/5, CSV-вывод, `shared` revenue-counter, все шаги Build it/Going further/What's next, Callout про shared state.
- **Cross-links (вписать в арку):** `delivery/clickhouse` (прямой seed в аналитическую БД вместо CSV - уже есть в Going further, усилить), `realism/values` (реалистичные распределения сумм), `test-data-pipeline`, scenarios pillar.
- **ПОЧИНИТЬ битый якорь (найдено при 4.1):** `csv-dataset.mdx:18` ссылается на `/docs/core/concepts/scheduling#live-mode-vs-sample-mode` (такого якоря нет) → заменить на `/docs/core/concepts/generator#sample-mode`.
- **ПОЧИНИТЬ неверное утверждение о chance (найдено при 4.3, сверено с source):** `csv-dataset.mdx:115` «The chances must sum to 1.0» - НЕВЕРНО. chance-значения это ОТНОСИТЕЛЬНЫЕ веса (`random.choices` нормализует, config требует только `gt=0`, без cross-field суммы) - сумма 1.0 НЕ обязательна. Переформулировать честно (как в load-testing.mdx: «relative weights, need not sum to 1; only the ratio matters»). Сами значения 0.80/0.15/0.05 можно оставить (они и так дают нужный ratio).
- **Верификация:** существующая CSV-сборка ВСЁ ЕЩЁ валидна - bounded CLI (`--live-mode false`), реальный CSV-вывод. types:check.

### Task 4.5: Scenarios pillar (общий applied) + root meta.json (навигация трека E)

**Files:**
- Modify: `content/docs/tutorials/scenarios/index.mdx` (расширить SIEM → общий applied-pillar)
- Modify: `content/docs/tutorials/meta.json` (scenario-группа)

**Interfaces:**
- Consumes: 4.1-4.4 (`test-data-pipeline`, `detection-testing`, переписанные `load-testing`/`csv-dataset`) должны существовать. Ставить ПОСЛЕДНЕЙ в волне.

**Бриф:**
- **scenarios/index.mdx - расширение (решение «общий applied-pillar», см. выше):** сменить title/description/hook с узкого SIEM на общий applied-зонтик трека E - обзор применения синтетических данных (pipeline testing, detection, load, seeding, SIEM, и пр.). **Primary pillar:** обзорный applied-запрос (напр. `synthetic test data` / обзор use-cases) - НЕ head-термин «what is synthetic data»; избежать каннибализации с `test-data-pipeline` (тот = конкретный сквозной how-to под `test data pipeline`, pillar = обзорный зонтик). Cards на ключевые сценарии: `test-data-pipeline` (⭐ первым, сквозной), `siem-events`, `detection-testing`, `load-testing`, `csv-dataset`, и существующие (`web-clickstream`, `iot-telemetry`, `telegram-alerts`) - тексты Card точны к реальным frontmatter. Related обновить (formats-ссылка сейчас `Windows Event Log, CEF, syslog` - трек имеет 7 форматов; поправить в духе polish, но не раздувать). Course JSON-LD остаётся (pillar в COURSE_PILLARS) - не трогать механику.
- **root meta.json - scenario-группа:** добавить `test-data-pipeline` и `detection-testing` в секцию `---Scenarios---`. Рекомендуемый порядок: `scenarios` (pillar) → `test-data-pipeline` (⭐ сквозной, сразу за pillar) → `siem-events` → `detection-testing` (рядом с siem, security) → `csv-dataset` → `load-testing` → `web-clickstream` → `iot-telemetry` → `telegram-alerts`. Остальные секции/треки НЕ трогать.
- **Шаги:** (1) прочитать реальные frontmatter 4.1-4.4 + существующих сценариев; (2) переписать scenarios/index.mdx (title/description/hook + Cards + Related); (3) обновить root meta.json; (4) `pnpm types:check` (НЕ build), commit. Проверить: sidebar-раздел Scenarios показывает все уроки в заданном порядке; ссылки резолвятся.

### Чек-пойнт Волны 4

- Все ссылки трека E резолвятся; forward-link `formats/ocsf` → `detection-testing` ЗАКРЫТ (back-link есть); `types:check` зелёный.
- Ledger: записи Task 4.1-4.5.
- Волна 4 закрывает трек E и Фазу 2.

Каждая волна финиширует чек-пойнтом; после W4 — финальное whole-branch ревью Фазы 2 (opus) + осторожный memory-bounded полный `pnpm build` (не гонялся с начала W1) + polish-проход (Minor-роллап из ledger) + переименование/обновление PR #45.

## Self-Review (плана)

- **Покрытие §6 фаза 2:** трек A (pillar+structured-logging) — W1; трек C (pillar+timing+sessions+values) — W1; трек B (ndjson/ocsf/ecs) — W2; трек D (clickhouse/http) — W3; трек E (test-pipeline/detection/load/seeding) — W4. ⭐ pillar'ы A и C — W1; ⭐ test-data-pipeline — W4. Все 15 позиций карты фазы 2 покрыты.
- **Типы/пути консистентны:** meta.json наборы и COURSE_PILLARS согласованы между задачами; URL существующих не двигаются.
- **Открытые допущения (подтвердить у пользователя перед W1):** (1) та же ветка/PR #45; (2) URL не двигаем, редиректов нет; (3) volны по трекам, W1 первой.
