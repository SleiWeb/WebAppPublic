# Prisme — platformen

> **Forstå det — så husk det.** Interaktiv naturvidenskab for 5.–9. klasse og
> gymnasiet: matematik, fysik, kemi, biologi og geografi i ét spektrum.

Dette er den kørende implementering af planen i [`../Prisme/`](../Prisme/README.md)
(dokument 01–09). Fase 1 (doc 09): **matematik 7.–9. klasse** med tre komplette
lektioner, opgavemotor med auto-retning, elev- og lærer-dashboard.

## Kom i gang

Krav: Node 20+, PostgreSQL 16 (eller Docker).

```bash
# 1) Database
docker compose up -d          # eller peg DATABASE_URL på din egen Postgres
cp .env.example .env

# 2) Skema + demo-data
npm install
npm run db:migrate            # Drizzle-migrationer (skema fra doc 07)
npm run db:seed               # demo-skole, 8.B Matematik, indhold + 14 dages aktivitet

# 3) Kør
npm run dev                   # http://localhost:3000
```

Log ind via **Demo-login** på `/login`:

| Rolle | Bruger | Ser |
|-------|--------|-----|
| 👩‍🏫 Lærer | Jonas Holm | "Kræver opmærksomhed", aktive tildelinger, holdets mestring, drill-down pr. elev |
| 🎒 Elev | Freja Andersen m.fl. | Fortsæt, afleveringer, "Repetition i dag", fagkort med mestringsfarver |

I produktion afløses demo-login af **Unilogin** (elever) og **MitID/lokal IdP**
(lærere) — auth-modulet (`src/lib/auth/providers.ts`) er bygget som en
provider-abstraktion, så de kan kobles på uden at røre UI'et (doc 06 §6.5).

## Test & kvalitet

```bash
npm test          # vitest: motor, validatorer, mastery, SM-2 + indholds-self-test
npm run lint
npm run build
```

Self-testen (doc 08 §8.7) genererer 100 instanser pr. opgaveskabelon og
verificerer, at facit altid består sin egen validator, og at alle distraktorer
diagnosticeres med den rigtige misforståelses-kode.

## Arkitektur (kort)

| Lag | Implementering | Spec |
|-----|----------------|------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind, KaTeX, SVG-widgets | doc 06 §6.2 |
| Backend | Next.js route handlers + server actions (modulær monolit) | doc 06 §6.1/6.3 |
| Database | PostgreSQL via Drizzle ORM; skemaet i `src/db/schema.ts` følger doc 07 tabel for tabel | doc 07 |
| Indhold | Versioneret JSON i `content/`, Zod-valideret (`src/lib/content/schema.ts`), seedet ind i DB — *content as data* | doc 08 |
| Opgavemotor | `src/lib/engine/`: seedet generator ((skabelon, seed) → deterministisk instans), typede validatorer (`numeric`, `expression`, `mcq`, `point`), distraktor → misforståelse → målrettet feedback | doc 06 §6.7–6.8 |
| Læringsmodel | BKT-agtig mestring pr. knowledge component (Ny/Øvet/Sikker/Mester) + SM-2 spaced repetition | doc 05 §5.9–5.10 |
| Widgets | Widget-registret (`src/components/widgets/`): `fraction-bar`, `graph-plotter` — JSON-spec → interaktiv model, genbruges af alle fag | doc 08 §8.3 |

### Læringssløjfen i koden

`Forklar → Udforsk → Prøv → Træn → Tjek → Repetér` er lektionens blokke
(`text`, `widget`, `workedExample`, `exerciseRef`, `checkpoint`), afspillet af
`LessonPlayer`. Hver skærm har én interaktiv handling; hints er en stige
(retningsgivende → begreb → næste skridt → worked step), og hintbrug logges og
indgår i mestringsestimatet.

### Retning er server-autoritativ

Facit forlader aldrig serveren: klienten får et saneret opgavebillede, svaret
valideres i `src/lib/exercise/service.ts`, og hvert forsøg skriver `attempts`,
`hint_views`, `feedback_given`, opdaterer `mastery_estimates` og
`review_schedule` og (ved tildelinger) `submissions`.

## Dansk data-tryghed (doc 02)

- Ingen tredjeparts-tracking eller reklame-SDK'er i elevfladen.
- Ingen eksterne fonts/CDN'er — alt serveres fra egen host (EU-klar).
- Dataminimering (kun fødselsår), audit-log ved læreradgang til elevdata,
  `consents`/`licenses`-tabeller klar til DPA-styring.

## Struktur

```
content/            # indhold som data: lektioner, skabeloner, KC'er, Fælles Mål, misforståelser
drizzle/            # genererede SQL-migrationer
src/db/             # Drizzle-skema (doc 07) + seed
src/lib/content/    # Zod-indholdsmodel (doc 08) + katalog
src/lib/engine/     # PRNG, generator, validatorer, feedback (doc 06 §6.7–6.8)
src/lib/mastery/    # BKT-agtigt mestringsestimat (doc 05 §5.9)
src/lib/review/     # SM-2 spaced repetition (doc 05 §5.10)
src/lib/auth/       # provider-abstraktion: demo nu, Unilogin/MitID senere
src/lib/data/       # forespørgsler til dashboards (elev/lærer/indhold)
src/lib/exercise/   # server-autoritativ opgave-service
src/app/            # forside, login, elev-, lærer- og lektionssider + API-ruter
src/components/     # widgets, lektionsafspiller, opgaveafspiller, shell
tests/              # vitest-suiten
```
