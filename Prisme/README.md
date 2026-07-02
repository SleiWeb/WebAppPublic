# Prisme — plan for en dansk digital lærings­platform i matematik og naturfag

> **Arbejdstitel:** *Prisme* (repo-kodenavn: `Prisma`).
> **Kort løfte:** Ét prisme, hele spektret af naturvidenskab — forstå det visuelt, øv det aktivt, og lad opgaverne rette sig selv.

Dette repository indeholder en komplet forretnings- og produktplan for en **markedsledende dansk, web-baseret læringsplatform** i **matematik, fysik, kemi, biologi og geografi**, målrettet **grundskolens 5.–9. klasse og gymnasiet**.

Produktet kombinerer:

- **Brilliant.org-stilens** korte, visuelle, interaktive begrebslæring ("learn by doing"), og
- **MatematikFessor-stilens** mængdetræning, opgavesæt, automatisk retning og lærerdashboard,

pakket ind i en **original**, dansk, Fælles Mål-forankret og GDPR-sikker helhed.

Planen er original. Den kopierer ikke indhold, branding, interface eller proprietære systemer fra hverken Brilliant, MatematikFessor, Clio, Gyldendal eller Alinea — den analyserer, hvordan stærke digitale læringsplatforme fungerer, og designer et selvstændigt dansk produkt.

---

## Sådan læses planen

| # | Dokument | Indhold |
|---|----------|---------|
| 00 | **README.md** (dette dokument) | Overblik, vision, index, resumé |
| 01 | [docs/01-produktanalyse.md](docs/01-produktanalyse.md) | Analyse af Brilliant.org og MatematikFessor |
| 02 | [docs/02-markedsanalyse.md](docs/02-markedsanalyse.md) | Det danske skolemarked, Fælles Mål, Unilogin, GDPR |
| 03 | [docs/03-produktkoncept.md](docs/03-produktkoncept.md) | Navn, løfte, målgrupper, differentiering |
| 04 | [docs/04-forside-og-ia.md](docs/04-forside-og-ia.md) | Forside, navigation, dashboards, informationsarkitektur |
| 05 | [docs/05-laeringsdesign.md](docs/05-laeringsdesign.md) | Den pædagogiske kernemodel |
| 06 | [docs/06-teknisk-arkitektur.md](docs/06-teknisk-arkitektur.md) | Frontend, backend, opgavemotor, retning, deployment |
| 07 | [docs/07-datamodel.md](docs/07-datamodel.md) | Databaseskema (SQL) |
| 08 | [docs/08-indholdsmodel.md](docs/08-indholdsmodel.md) | Genbrugelig indholdsstruktur på tværs af fag |
| 09 | [docs/09-forretning-roadmap-risici.md](docs/09-forretning-roadmap-risici.md) | Forretningsmodel, MVP, roadmap, økonomi, risici |

---

## Vision i én sætning

> **Danmarks pupils skal *forstå* naturvidenskab — ikke bare besvare opgaver — og deres lærere skal spare tid, ikke bruge mere.**

## De fem fag som ét spektrum

Metaforen bag navnet *Prisme*: et prisme spalter hvidt lys i et farvespektrum. Platformen spalter "naturvidenskab" i fem farvede fagområder, men rammen, motoren og pædagogikken er den samme:

| Fag | Farve (arbejdstema) | Ikon-idé |
|-----|--------------------|----------|
| 🟦 Matematik | Blå | Tal/graf |
| 🟪 Fysik | Indigo | Bølge/pendul |
| 🟩 Kemi | Grøn | Molekyle |
| 🟧 Biologi | Orange | Celle/blad |
| 🟨 Geografi | Gul | Klode/kort |

## Det store hul i markedet (kort)

- **Brilliant** er verdensklasse til *visuel, interaktiv forståelse* — men er engelsk, forbrugerbetalt, uden lærerdashboard, uden Fælles Mål, uden opgaveafleveringer.
- **MatematikFessor** er stærk til *mængdetræning, retning og lærerværktøjer* i dansk grundskole — men er primært matematik, og den interaktive, begrebsopbyggende "aha"-oplevelse er mindre udtalt.
- **Clio / Gyldendal / Alinea** leverer brede *fagportaler* med tekst, forløb og videoer — grundige, men ofte tunge, læse-tunge og mindre interaktivt "spillende".

**Prisme** sætter sig præcist i krydsfeltet: *Brilliants interaktivitet + MatematikFessors lærerværktøjer + fuld dansk Fælles Mål-forankring + naturfagene samlet ét sted + GDPR-tryghed.*

---

## Status

Dette er en **planlægningsleverance** — ikke kørende kode. Næste skridt (se dokument 09) er en klikbar forside-prototype og en snæver MVP i matematik for 7.–9. klasse.
