# 06 — Teknisk arkitektur

Designprincipper: **EU-hosting fra dag 1**, **én motor på tværs af fem fag**, **content-as-data** (indhold er JSON, ikke kode), og **deterministisk auto-retning**.

## 6.1 Overblik

```
                         ┌─────────────────────────────────────┐
   Browser (elev/lærer)  │  Frontend — Next.js/React (TypeScript)│
   Chromebook/iPad/PC ──►│  Widgets · KaTeX · Canvas/WebGL sim   │
                         └───────────────┬─────────────────────┘
                                         │ HTTPS (REST/tRPC + WebSocket)
                         ┌───────────────▼─────────────────────┐
                         │  API-gateway / BFF (Node)             │
                         └───┬───────────┬───────────┬──────────┘
             ┌───────────────┘     ┌─────┘      ┌────┘
   ┌─────────▼────────┐  ┌─────────▼──────┐  ┌──▼────────────────┐
   │ Auth-service     │  │ Content-service │  │ Learning-service   │
   │ Unilogin/MitID/  │  │ lektioner/      │  │ opgavemotor,       │
   │ lokal IdP, roller│  │ skabeloner (RO) │  │ retning, mastery,  │
   └─────────┬────────┘  └─────────┬──────┘  │ repetition, analytics│
             │                     │         └──┬────────────────┘
             │            ┌────────▼─────────┐  │        ┌──────────────┐
             └───────────►│ PostgreSQL (EU)  │◄─┴───────►│ Redis (kø/cache)│
                          └──────────────────┘           └──────┬───────┘
                          ┌──────────────────┐           ┌──────▼───────┐
                          │ Object storage    │           │ CAS-worker    │
                          │ (billeder/media,EU)│          │ (Python/SymPy)│
                          └──────────────────┘           └──────────────┘
```

Start som **modulær monolit** (ét deployerbart Node-backend med klare moduler), split til services kun ved reelt behov. CAS-retning (symbolsk algebra) kører som separat Python-worker.

## 6.2 Frontend

- **Framework:** Next.js (React + TypeScript, App Router). SSR/SSG til marketing + hurtig app-load; god SEO for offentlige sider.
- **UI:** Tailwind CSS + eget designsystem (fem fagfarver, WCAG 2.1 AA). Komponentbibliotek til lektionsblokke.
- **Matematik-rendering:** **KaTeX** (hurtig LaTeX).
- **Interaktive widgets:** React-komponenter oven på **SVG** (lette diagrammer/geometri) og **Canvas/WebGL** (simuleringer, mange partikler). Fælles widget-runtime der læser en widget-spec (JSON) → interaktiv model.
- **Grafer/plot:** let, egen-wrappet plot-lag (fx D3-primitiver) for fuld kontrol over interaktivitet.
- **State/data:** TanStack Query (server-state) + Zustand (lokal UI-state). WebSocket til lærerens live-holdoverblik.
- **Offline-tolerance:** PWA med service worker; en lektion i gang kan fuldføres ved kort netbortfald og synke bagefter (vigtigt i klasselokaler).
- **Tilgængelighed:** TTS-oplæsning, tastaturnavigation, høj kontrast, skalerbar tekst, reduceret bevægelse.

## 6.3 Backend

- **Sprog/runtime:** Node.js + TypeScript (delte typer/validering med frontend via Zod). Rammeværk: NestJS eller Fastify.
- **API:** tRPC eller REST + OpenAPI. WebSocket-lag (Socket.IO/native WS) til live-dashboard.
- **Moduler:** `auth`, `roster` (skoler/klasser/roller), `content` (læsning af lektioner/skabeloner), `exercise-engine` (generér/validér), `progress` (mastery/repetition), `assignments`, `analytics`.
- **Baggrundsjobs:** BullMQ på Redis (mastery-genberegning, repetitionsplanlægning, rapport-eksport, nightly roster-synk fra STIL).
- **CAS-worker:** Python-microservice (SymPy) til symbolsk svartjek (algebraisk ækvivalens) — kaldes af opgavemotoren, sandkasset og timeout-beskyttet.

## 6.4 Database

- **Primær:** **PostgreSQL** (managed, EU-region). Relationelt for brugere/roller/klasser/afleveringer; **JSONB** for fleksibelt indhold og forsøgs-payloads.
- **ORM:** Prisma eller Drizzle (TypeScript, migrationsstyret). *(Bemærk: ORM'et "Prisma" er årsagen til navne-varemærkeforsigtigheden i §03.)*
- **Cache/kø:** Redis (sessioner, rate-limiting, jobkø, live-tællere).
- **Object storage:** S3-kompatibelt i EU (Scaleway/Hetzner/OVH/AWS eu-north/eu-central) til billeder, media, eksporter.
- **Analytics-lag:** start i Postgres (materialiserede views); flyt tunge aggregeringer til et kolonne-lager (ClickHouse/DuckDB) hvis volumen kræver det.
- **Full-text søgning:** Postgres FTS til bibliotekssøgning; opgradér til OpenSearch ved behov.

## 6.5 Autentificering & autorisation

- **Elever:** **Unilogin** (STIL) via OIDC/SAML/WS-Fed gennem STIL-brokeren.
- **Lærere/personale:** **MitID** eller kommunens **lokale IdP**.
- **Forældre (senere):** MitID.
- **Egne konti:** til B2C/gymnasie-selvtilmelding og prøveperioder.
- **Roster-synk:** hent skole-/klasse-/holddata fra STIL, så brugere og hold oprettes automatisk (ingen manuel elevoprettelse).
- **Autorisation:** rolle- og kontekstbaseret (RBAC + scope): en bruger kan have flere roller i flere klasser/skoler; adgang afgøres af (rolle × klasse/skole × ressource). Al elevdata-adgang logges.
- **Sessioner:** korte JWT/access-tokens + roterende refresh; enhedsstyring.

## 6.6 Indholdsformat

- Indhold er **data, ikke kode**: lektioner, widgets, opgaveskabeloner, validatorer, hints, misforståelser og feedback-regler lagres som **versioneret JSON** (skema i §08), valideret mod JSON Schema/Zod.
- **Forfatterværktøj:** internt web-baseret CMS/autor-UI (senere) + Git-baseret indholds-repo i starten, så indhold reviewes som kode.
- Fordel: samme rendermotor + retningsmotor driver alle fem fag; nyt fag = nyt indhold, ikke ny kode.

## 6.7 Opgavemotor (exercise engine)

```
Skabelon (JSON) ──► Generator(seed) ──► Instans (konkrete tal/figur)
                                            │
Elevens svar ─────────────────────────────►│──► Validator ──► Resultat
                                            │        │         + misforståelses-kode
                                            └────────┴──► Feedback-regel ──► besked + hint-tilbud
```

- **Generator:** seedet PRNG + begrænsninger (fx "heltalsløsning", "a≠0"); producerer instans + facit + accepterede svarformer.
- **Determinisme:** (skabelon-id + seed) → samme instans; seed bindes til (elev, forsøg) for reproducérbarhed og snyd-resistens.
- **Sværhedsstyring:** parameter-intervaller + tags → adaptivt valg pr. elevs mestring.

## 6.8 Svartjeks-system (auto-retning)

Typede **validatorer**, som al retning bygges af:

| Validator | Tjekker | Metode |
|-----------|---------|--------|
| `numeric` | Tal m. tolerance & enheder | |værdi−facit| ≤ tol; enhedsnormalisering |
| `expression` | Algebraisk ækvivalens | CAS (SymPy/math.js): `simplify(a−b)==0` |
| `equation` | Ligningsløsning(er) | Løs & sammenlign mængder |
| `mcq` / `multi` | Valg / flervalg | Sæt-sammenligning + distraktor-tags |
| `set` / `ordering` | Mængde/rækkefølge | Normaliseret sammenligning |
| `point` / `graph` | Punkt/graf-interaktion | Geometrisk tolerance |
| `interval` / `vector` | Interval/vektor | Komponent-tolerance |
| `chem-equation` | Afstemt reaktion | Atombalance + ladning |
| `table` / `data` | Udfyldt tabel/aflæsning | Cellevis m. tolerance |
| `text-short` | Kort fritekst | Nøgleord/regex + (senere) AI-assisteret rubric |
| `drag-label` | Placering af labels | Positions-/tilhørs-tjek |

- Hver validator returnerer `{correct, closeness, misconceptionCode?, feedbackId?}`.
- **CAS** kører i sandkasse med timeout; deterministiske fallback-tjek hvis CAS fejler.
- **Enheder** håndteres eksplicit (SI) — vigtigt for fysik/kemi.

## 6.9 Simuleringskomponenter

- Fælles **simulerings-runtime**: en widget-spec (parametre, initialtilstand, opdateringsregler/fysik) → interaktiv Canvas/WebGL-model.
- Genbrugelige "motorer": partikelmodel, simpel stiv-legeme/kraft (evt. let fysikmotor), kredsløb, reaktion/ligevægt, økosystem-dynamik, kort-lag.
- Simuleringer er **deterministiske og parametriserbare**, så de kan indgå i opgaver ("sæt vinklen så kuglen rammer målet") og auto-rettes.
- Kører **client-side** (ingen elevdata forlader browseren under leg); kun resultater/hændelser logges.

## 6.10 Fremdrifts-/mestringsopfølgning

- **Event-baseret:** hvert forsøg/hint/repetition er en hændelse → føder mastery-estimat pr. KC (Elo/BKT) + repetitionsplan (spaced repetition).
- Genberegning i baggrundsjob + hurtige inkrementelle opdateringer live.
- Aggregeres til elev-, hold- og skole-niveau (materialiserede views).

## 6.11 Lærerdashboard (teknisk)

- **Live:** WebSocket-kanal pr. hold; server pusher forsøgs-/status-events → lærerens overblik opdateres i realtid ("hvem sidder fast lige nu").
- **Aggregeret:** forberegnede holdstatistikker + Fælles Mål-dæknings-matrix; on-demand drill-down til enkeltforsøg.
- **Eksport:** CSV/PDF-rapporter via baggrundsjob.

## 6.12 Deployment-vej

- **Containere** (Docker) orkestreret enkelt i starten (managed platform: fx Scaleway/Hetzner/OVH i EU, eller AWS eu-north-1 Stockholm / eu-central-1 Frankfurt). Kubernetes først ved skala.
- **Miljøer:** dev → staging → prod, alt i **EU-region**.
- **CI/CD:** GitHub Actions → automatiske tests + migrationer + deploy.
- **Observability:** logging, metrics, tracing (EU-baseret/self-hosted, fx Grafana-stack); fejlmonitorering uden PII-lækage.
- **Backups:** krypterede, EU-region, testet restore; definerede slette-/opbevaringsregler.
- **Sikkerhed:** kryptering i transit (TLS) og hvile, secrets-håndtering, WAF/rate-limiting, mindst-privilegie-adgang, audit-logs, regelmæssig pen-test + DPIA.
- **Ingen tredjeparts-tracking/annonce-SDK'er** i elevfladen (bevidst fravalg — data-tryghed som produkt).

## 6.13 Anbefalet stak (resumé)

| Lag | Valg |
|-----|------|
| Frontend | Next.js, React, TypeScript, Tailwind, KaTeX, Canvas/WebGL, TanStack Query |
| Backend | Node.js + TypeScript (NestJS/Fastify), tRPC/REST, WebSocket, BullMQ |
| CAS | Python + SymPy (worker) |
| Data | PostgreSQL (JSONB), Redis, S3-kompatibel storage — alt i EU |
| Auth | Unilogin (elev) · MitID/lokal IdP (lærer) · egne konti · STIL roster-synk |
| Deploy | Docker, GitHub Actions CI/CD, EU-region, Grafana-observability |
