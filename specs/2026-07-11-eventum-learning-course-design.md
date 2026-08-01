# Eventum Learn: обучающий курс как SEO-движок

- **Дата:** 2026-07-11
- **Статус:** согласован (дизайн), ожидает вычитки spec
- **Область:** docs-сайт (`eventum.run`), репозиторий `docs`, ветка `feat/learning-course`
- **Язык документа:** русский (объяснения) + английские технические термины, названия уроков и целевые запросы в оригинале

## 1. Проблема и цель

Технический SEO закрыт (sitemap/robots/canonical/JSON-LD — PR #43), но это лишь гигиена индексации. Ранжирование по содержательным запросам требует контента под них.

Раздел `content/docs/tutorials/` сейчас — 6 разрозненных практических туториалов («построй проект»), без теории, прогрессии и SEO-заточки.

**Цель:** перестроить раздел в обучающий курс «Eventum Learn», который:
1. привлекает органический трафик по специфичным запросам сферы (в т.ч. общих, прямо не про Eventum);
2. строит topical authority вокруг тем Eventum, поднимая и продуктовые страницы;
3. нативно ведёт читателя от образовательной темы к продукту.

## 2. Стратегические принципы (из анализа выдачи)

Основано на разведке ландшафта (июнь-июль 2026, ~90 живых поисков).

1. **Не брать головные «what is» запросы в лоб.** Они заняты вендорами (Splunk, Databricks, Elastic, opentelemetry.io) и энциклопедиями. Ранжируемся на двух недообслуженных слоях: **форматы-пробелы** и **прикладная генерация/доставка**.
2. **Ниша Eventum — пустой шов** между инструментами нагрузки (не генерируют данные) и генераторами тестовых данных (игнорируют потоковое/событийное/time-aware).
3. **Позиционирование:** против ShadowTraffic, Kafka Connect Datagen, ClickHouse `generateRandom`, мёртвых статических security-датасетов. **Не** против Gretel/Tonic/K2view — это privacy/ML-ниша (статистическая верность реальным PII), ортогональная задаче «накормить пайплайн».
4. **Ось дифференциации:** непрерывный, time-aware, мульти-приёмник, свежие параметризуемые данные — против одноразовых плоских файлов Faker/Mockaroo и статических датасетов.
5. **Модель урока «объяснитель + компаньон»:** каждый урок объединяет образовательный объяснитель формата/техники и прикладной разворот «сгенерировать это → отправить в свой бэкенд» **в рамках одной страницы** (см. анатомию, §7). Теория ловит образовательный интент, практика передаёт в продукт. Это один урок = один primary-запрос, а не две конкурирующие страницы.

## 3. Ключевой learner journey (нарратив)

Инженер приходит с конкретной болью — протестировать пайплайн, разработать детект, дать нагрузку, показать демо — но **реальных данных нет**: прод трогать нельзя, статические датасеты мертвы, Faker не стримит.

Курс ведёт его по арке:

**разобраться в форматах своих данных → научиться делать их реалистичными → доставить в свой бэкенд → собрать сквозной сценарий и доказать, что работает до прода.**

На каждом шаге — нативно, как это сделать в Eventum. Слоган пути: «от плоских логов к мастерству синтетических данных».

Развёрнутая арка спроса (этапы 1→6): боль (плоские логи) → конвенции (structured logging) → **грамотность форматов** (syslog/CEF/LEEF/OCSF/EVTX — крупнейшие пробелы) → observability (OTel) → пайплайн/бэкенд (OpenSearch/Kafka/ClickHouse/SIEM) → **валидация и масштаб до прода** (генерация/нагрузка/seed — цель пути, наименее обслуживаемая точка). Контент ранжируется и конвертирует на этапах 3 и 6.

## 4. Аудитория и роли

Прогрессия «от азов к продвинутому». Сквозная задача, покрывающая все роли: **«нужны реалистичные лог/событийные данные в формате X, доставленные в бэкенд Y, в объёме/темпе Z — без касания продакшена».**

| Роль | Задачи |
|---|---|
| Data engineer (основная) | тест/бенчмарк пайплайна до реальных данных; наполнить Kafka/ClickHouse/OpenSearch в dev и CI |
| SRE / observability | нагрузка на ingestion, consumer lag, cardinality; демо дашбордов |
| Detection engineer / SOC | тест и тюнинг Sigma/детектов; валидация парсеров SIEM; lab без прода |
| Backend developer | seed dev/staging; параметризованные payload для нагрузки |
| ML engineer (узко) | синтетические событийные/временные ряды |

## 5. Архитектура курса (5 треков как воплощение арки)

| Трек | Этап арки | Роль в воронке / SEO |
|---|---|---|
| **A. Основы: данные, события, синтетика** | вход | образовательный вход; угол «событийная/потоковая синтетика», не privacy/ML |
| **B. Форматы и схемы** | грамотность форматов | ядро SEO — форматы-пробелы; объяснитель + компаньон |
| **C. Механики реалистичности** | мастерство правдоподобия | ось дифференциации (time-aware, сессии, корреляции, replay) |
| **D. Доставка в бэкенд** | пайплайн/приёмник | «generate/send data for Kafka/OpenSearch/ClickHouse»; целевой #2 |
| **E. Сценарии и валидация** | цель пути | низ воронки; целевой #3 SIEM; сюда переезжают 6 текущих туториалов |

## 6. Полная карта уроков

⭐ = pillar. Тип: [нов] новый / [пере] переписать существующий. Целевые запросы (#2 = «log generator for opensearch», #3 = «generate data for SIEM»).

### Трек A — Основы
| Урок | Целевой запрос | Тип | Фаза |
|---|---|---|---|
| ⭐ Synthetic data for event & log pipelines | `synthetic event data`, `synthetic log data` | нов | 2 |
| Structured logging (и как их генерировать) | `structured logging` | нов | 2 |
| Logs vs metrics vs events | `logs vs metrics` | нов | 3 |
| Streaming vs bulk (live vs sample) | `streaming vs batch test data` | нов | 3 |

### Трек B — Форматы и схемы (ядро SEO)
| Урок | Целевой запрос | Тип | Фаза |
|---|---|---|---|
| ⭐ Log & event formats: field guide | `log formats`, `event formats` | нов | 1 |
| Windows Event Log & Sysmon (+ генерация без атак) | `generate windows event logs`, `sysmon test logs` | нов | 1 |
| CEF (+ генерация CEF) | `CEF format`, `generate CEF logs` | нов | 1 |
| LEEF (+ генерация для QRadar) | `LEEF format` | нов | 1 |
| syslog RFC 5424 vs 3164 (+ генерация) | `syslog format`, `RFC 5424` | нов | 1 |
| NDJSON / JSON Lines (+ генерация) | `NDJSON`, `json lines` | нов | 2 |
| OCSF (+ генерация событий) | `OCSF`, `generate OCSF` | нов | 2 |
| ECS (+ ECS-совместимые события) | `ECS fields`, `elastic common schema` | нов | 2 |
| Apache/Nginx access logs (+ датасет) | `apache log format`, `nginx access log sample` | нов | 3 |
| CloudTrail / Suricata EVE / auditd | security-форматы | нов | 3 |

### Трек C — Механики реалистичности
| Урок | Целевой запрос | Тип | Фаза |
|---|---|---|---|
| ⭐ Making synthetic data realistic | `realistic test data` | нов | 2 |
| Реалистичный тайминг: пики, всплески, затишья | `simulate traffic patterns` | нов | 2 |
| Моделирование сессий (state machines) | `simulate user sessions` | нов (из web-clickstream) | 2 |
| Правдоподобные значения (Faker/Mimesis/weighted/samples) | `realistic fake data` | нов | 2 |
| Корреляция событий в потоке | `correlated log events` | нов | 3 |
| Replay реальных логов со свежими таймстампами | `replay logs`, `log replay` | нов | 3 |

### Трек D — Доставка в бэкенд
| Урок | Целевой запрос | Тип | Фаза |
|---|---|---|---|
| ⭐ Stream synthetic data to your stack | `generate data for pipeline` | нов | 1 |
| Generating logs for OpenSearch | `log generator for opensearch` (#2) | нов | 1 |
| Generate test data for Kafka | `generate test data for kafka` | нов | 1 |
| Generate test data for ClickHouse | `clickhouse test data` | нов | 2 |
| Send synthetic data to any HTTP endpoint | `send test data to api` | нов | 2 |
| Syslog over TCP/UDP to collectors & SIEM | `send syslog to collector` | нов | 3 |
| Output formatters: shape per destination | (Eventum) | нов | 3 |

### Трек E — Сценарии и валидация
| Урок | Целевой запрос | Тип | Фаза |
|---|---|---|---|
| ⭐ Synthetic data for SIEM & detection testing | `generate data for SIEM` (#3) | нов | 1 |
| ⭐ Test your data pipeline before production | `test data pipeline` | нов | 2 |
| SIEM: Windows Security → OpenSearch | `siem test data` | пере (siem-events) | 1 |
| Detection testing: телеметрия под Sigma/ATT&CK без атак | `test sigma rules`, `attack telemetry` | нов | 2 |
| Load testing с реалистичными payload | `load test data` | пере (load-testing) | 2 |
| Seeding базы / хранилища | `seed database test data` | пере (csv-dataset) | 2 |
| Web clickstream → ClickHouse | `clickstream data` | пере (web-clickstream) | 3 |
| IoT sensor telemetry | `iot test data` | пере (iot-telemetry) | 3 |
| Scheduled alerts (Telegram) | `alert simulation` | пере (telegram-alerts) | 3 |

**Итого ~35 уроков** (29 новых + 6 переписать). Карта — маршрут, не обязательство писать всё разом.

## 7. Анатомия урока (единый шаблон)

1. **Hook / задача** (1-2 абзаца) — боль, зачем читать. Ведём с сути.
2. **Теория / объяснитель** — суть формата/техники/концепта, ясно и точно; диаграмма (mermaid) где помогает. Ловит образовательный интент.
3. **Как это в Eventum** — конкретная конфигурация и шаги: `generator.yml`, шаблоны.
4. **Результат** — блок сгенерированного вывода в нужном формате/бэкенде (наглядная демонстрация).
5. **Дальше** — переход: связанные уроки (cluster↔pillar), reference плагинов, Hub, «попробовать в Studio».
6. **FAQ** (где есть реальные вопросы) — под featured snippets и FAQ-разметку.

Pillar-уроки объёмнее (обзор темы + карта на cluster-уроки); cluster-уроки — фокус на одном запросе.

Стиль подчиняется правилам docs (end-user язык, без внутренних движковых терминов, формальный регистр, конкретика вместо общих фраз, без деталей реализации).

## 8. SEO-механика (on-page)

- **Title/H1/description** под один primary-запрос; H2 — под вторичные под-запросы (структура под featured snippets).
- **FAQ-разметка** (FAQPage JSON-LD) и **breadcrumb** — компонент `JsonLd` и хлебные крошки уже есть из PR #43, переиспользуем.
- **Course / LearningResource** JSON-LD на pillar'ах; Article на уроках.
- **Перелинковка кластера обязательна:** cluster→pillar и pillar→cluster (сигнал topical authority) + уроки→reference/Hub. Каждый объяснитель формата явно ссылается на свой прикладной компаньон и наоборот.
- canonical — уже из PR #43.

## 9. Навигация / IA в Fumadocs

Структура папок (треки = подпапки, pillar = `index.mdx` трека):

```
content/docs/tutorials/
  index.mdx            — обзор курса (learning path)
  foundations/  (⭐ + уроки трека A)
  formats/      (⭐ + EVTX, CEF, LEEF, syslog…)
  realism/      (⭐ + техники C)
  delivery/     (⭐ + OpenSearch, Kafka…)
  scenarios/    (⭐ + существующие 6, переписанные)
```

- **Sidebar:** 5 треков — свёртываемые группы (`meta.json` на трек + корневой порядок A→E), иконка `GraduationCap` уже есть.
- **Имя раздела в навигации:** «Learn» (URL при этом не меняется).
- **URL:** базовый путь остаётся `/docs/tutorials/` ради стабильности. Существующие 6 переезжают в `/scenarios/*` → меняют URL, поэтому нужны **редиректы** со старых путей (`vercel.json`/хостинг, т.к. `output: export`).

## 10. Фазовый план

- **Фаза 1 (ядро, ~12 уроков):** форматы-пробелы (EVTX/Sysmon, CEF, LEEF, syslog) + целевые бэкенды/сценарии (OpenSearch #2, Kafka, SIEM #3, переписанный siem-events) + pillar'ы B/D/E + IA/навигация + редиректы. Максимальный ROI.
- **Фаза 2:** realism-трек C, NDJSON/OCSF/ECS, ClickHouse/HTTP, detection testing, load/seeding, pillar'ы A/C.
- **Фаза 3:** остальные форматы (Apache/Nginx, CloudTrail), TCP/UDP syslog, formatters, оставшиеся сценарии (clickstream, iot, telegram).

Каждая фаза — свой набор PR (контент docs, ветки от `develop`).

## 11. Метрики успеха

- Ранжирование в топ-10, затем топ-3 по целевым запросам фазы 1 (форматы-пробелы + #2/#3).
- Рост органического трафика на `/docs/tutorials/*` и переходов оттуда на reference/Hub.
- Индексация всех уроков (через sitemap PR #43) и валидные rich-результаты (FAQ/Breadcrumb) в Search Console.

## 12. Вне области (out of scope)

- Головные «what is» запросы как primary-цели (заняты вендорами).
- Privacy/ML synthetic data ниша и её термины (Gretel/Tonic/SDV).
- ML training data как отдельный трек (только узкий угол «событийные/временные ряды», если возникнет).
- Полное написание всех ~35 уроков в одном заходе — реализация идёт фазами, отдельными планами и PR.

## 13. Открытые вопросы и риски

- **Объём и поддержка:** ~35 уроков — большой контентный долг; риск тонкого контента. Митигируется фазовостью и правилом «объяснитель + компаньон» (каждый урок несёт уникальный практический разворот).
- **Редиректы при `output: export`:** механизм (vercel.json vs meta-refresh) уточняется на этапе реализации фазы 1.
- **Качество образовательных объяснителей:** должны быть точны (форматы/RFC), иначе вредят авторитету; при написании сверяться с первоисточниками (RFC, спецификации ECS/OCSF).
- **Каннибализация между треками:** урок-формат (Трек B, напр. CEF) и сценарий/доставка (Трек E/D, напр. SIEM или syslog-to-collector) могут целиться в близкие запросы. Каждому — свой чёткий primary-запрос (формат vs сквозной сценарий vs бэкенд), связывать перелинковкой, а не конкурировать за один и тот же.
