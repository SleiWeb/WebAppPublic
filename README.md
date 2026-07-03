# Prisme

> **Forstå det — så husk det.** En dansk, web-baseret interaktiv
> læringsplatform for matematik, fysik, kemi, biologi og geografi —
> 5.–9. klasse og gymnasiet. Fælles Mål-forankret, Unilogin-klar og
> GDPR-sikker (EU-hosting).

## Indhold i repoet

| Mappe | Hvad |
|-------|------|
| [`prisme/`](prisme/) | **Platformen** — Next.js + TypeScript + PostgreSQL. Fase 1: matematik 7.–9. klasse med opgavemotor, auto-retning, interaktive widgets, elev- og lærer-dashboard. Se [`prisme/README.md`](prisme/README.md) for opsætning. |
| [`Prisme/`](Prisme/) | **Produkt- og forretningsplanen** (dokument 00–09): produktanalyse, markedsanalyse, koncept, IA, læringsdesign, teknisk arkitektur, datamodel, indholdsmodel, roadmap. Planen er specifikationen — koden følger den. |
| `src/` m.fl. i roden | Den oprindelige **Vite-prototype** ("MatematikAppV2"), bevaret som reference. Kør med `npm install && npm run dev` i roden. |

## Hurtig start (platformen)

```bash
cd prisme
docker compose up -d      # PostgreSQL 16
cp .env.example .env
npm install
npm run db:migrate && npm run db:seed
npm run dev               # → http://localhost:3000 · demo-login på /login
```

Demo-holdet **8.B Matematik** er seedet med 20 elever, to tildelinger og 14
dages simuleret aktivitet, så både elev- og lærer-fladen er levende fra
første klik.
