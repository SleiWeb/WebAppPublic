# Prisma — Plan for en dansk markedsledende læringsplatform i matematik og naturfag

*Arbejdstitel: **Prisma**. Original dansk web‑platform inspireret af styrkerne fra Brilliant.org (konceptuel, visuel, interaktiv læring) og MatematikFessor (træning, opgaver, autoretning, lærer‑dashboard) — men et selvstændigt produkt, ikke en kopi af indhold, brand, interface eller lukkede systemer.*

**Målgruppe:** grundskolen ca. 5.–9. klasse + gymnasiet. **Fag:** Matematik, Fysik, Kemi, Biologi, Geografi.
**Forfatter‑kontekst:** dansk folkeskolelærer. **Status i repo:** der findes allerede en fungerende prototype (`MatematikAppV2`) med adaptiv opgavemotor, som denne plan bygger videre på (se §7 og §11).

> **Læsevejledning.** Dokumentet følger de 11 punkter fra opgaven. §1–§3 er analyse og koncept. §4–§6 er produktdesign. §7–§10 er teknisk specifikation. §11 er en konkret build‑roadmap. Kildehenvisninger står nederst.

---

## 1. Produktanalyse — Brilliant.org og MatematikFessor

Analysen bygger på offentligt tilgængelig information (produktsider, hjælpecentre, anmeldelser, Wikipedia, forhandler‑/portaltekster). Formålet er at forstå *mekanikken* i to stærke, men meget forskellige platforme — ikke at gengive deres indhold.

### 1.1 Sammenlignende overblik

| Dimension | **Brilliant.org** | **MatematikFessor** |
|---|---|---|
| **Kerneidé** | "Lær ved at gøre" — interaktive, visuelle mini‑forløb der føles som et spil | Danmarks mest brugte matematikportal — struktureret træning, video og opgavesæt til folkeskolen |
| **Brugergrupper** | Selvlærende unge/voksne, nysgerrige, forældre; K‑12‑lærere via *Brilliant for Educators* | Elever 0.–10. kl., lærere, skoler/kommuner; forældre sekundært |
| **Elevoplevelse** | Korte (~15 min) interaktive lektioner, "spring hvor du vil", daglige udfordringer, AI‑tutor (Koji) | Videoforklaring → opgavesæt → autoretning; øve i eget tempo; kort‑ og træningsforløb |
| **Lærer‑oplevelse** | Begrænset klasseværktøj; primært individuel bruger; gratis premium til lærere | Stærkt: bibliotek, tildel indhold, differentiér, evaluering/statistik i realtid pr. elev |
| **Lektionsdesign** | Problem‑først, visuelt, animeret; forklaring vokser ud af egen handling | Forklaring‑først (video/tekst) → afgrænset øvemængde pr. færdighed |
| **Opgavedesign** | Håndlavede interaktive spørgsmål med manipulerbare figurer | Store mængder items (>2 mio. beskrevet), varierede opgavetyper, ofte skabelon‑genereret |
| **Autoretning** | Ja, øjeblikkelig, indbygget i hver interaktion | Ja, øjeblikkelig; kerneværdi for lærerens arbejdsbyrde |
| **Feedback** | Trin‑for‑trin via tutor; forklaring efter forsøg | Facit + videoforklaring; læreren ser mønstre og griber ind |
| **Hints** | Progressive; AI‑tutor guider uden at give svaret | Hjælp/gennemgang knyttet til opgave/emne |
| **Gamification** | Streaks, daglige udfordringer, fremdriftsfølelse, "leg mere end puglearbejde" | Point/badges/konkurrenceelementer, niveauer; motiverer yngre elever |
| **Progression** | Kurser opdelt i lektioner; personlig sti | Færdighedskort pr. klassetrin/emne; status pr. elev |
| **Opgaveværktøjer** | Svage (individuelt produkt) | Stærke: søg, filtrér på emne/type/klassetrin, tildel til klasse/elev |
| **Dashboards** | Personligt fremdrifts‑view | Lærer‑dashboard med elevstatus, problemområder, realtidsstatistik |
| **Indholdsstruktur** | Fag → kursus → lektion → interaktion | Fag → klassetrin → emne → færdighed → opgavesæt/video |
| **Forretningsmodel** | B2C‑abonnement (~US$150–300/år), gratis begrænset lag, edu‑program | B2B‑skoleabonnement (Alinea/Clio), licens pr. elev/skole |
| **Sprog** | Engelsk | Dansk, tilpasset danske Fælles Mål |

### 1.2 Styrker og svagheder

**Brilliant — styrker:** klasseledende interaktivt/visuelt lektionsdesign; "lær ved at gøre" giver dyb forståelse; høj æstetik og motivation; AI‑tutor der stilladserer i stedet for at afsløre svar.
**Brilliant — svagheder:** engelsk; ikke bundet til dansk læreplan; svag klasse-/lærerstyring; dyrt B2C; ikke bygget til lærerens tildel‑og‑evaluér‑workflow; primært matematik/CS/science‑for‑voksne, ikke folkeskolens hverdag.

**MatematikFessor — styrker:** dyb dansk læreplansforankring; enormt opgavebibliotek; autoretning der reelt sparer lærertid; stærkt lærer‑dashboard og tildelingsværktøj; indarbejdet i dansk skolekultur og indkøb.
**MatematikFessor — svagheder:** overvejende "video → drill"‑pædagogik; opgaver kan opleves mekaniske; begrænset dybt‑interaktiv/simuleringsbaseret forståelse; kun matematik (ikke fysik/kemi/biologi/geografi); interface og motivation kan føles dateret for ældre elever.

### 1.3 Den strategiske åbning for Prisma

Ingen dansk platform kombinerer **Brilliants interaktive, visuelle forståelse** med **MatematikFessors autoretning + lærerstyring + læreplansforankring** — *på tværs af matematik og naturfagene, på dansk*. Det er hullet Prisma udfylder.

---

## 2. Dansk markedsanalyse

### 2.1 Relevans til Fælles Mål
Folkeskolens matematik er struktureret i fire **kompetenceområder** (matematiske kompetencer; tal & algebra; geometri & måling; statistik & sandsynlighed) med bindende **kompetencemål** og — pr. 1. jan. 2025 — **vejledende** færdigheds‑ og vidensområder/‑mål. Fysik/kemi, biologi og geografi har hver egne kompetenceområder. Prisma skal:
- tagge alt indhold med **Fælles Mål‑referencer** (kompetenceområde → kompetencemål → færdigheds/videns‑område) så lærere kan filtrere og dokumentere.
- gøre koblingen synlig i lærer‑UI ("dette forløb dækker geometri, 7.–9. kl.") — et stærkt salgs‑ og planlægningsargument.
- afspejle at de vejledende mål *ikke* er bindende: brug dem som filter/inspiration, ikke som tvangsstruktur.

### 2.2 Lærer‑workflow
Den danske lærer vil: (1) planlægge forløb, (2) tildele til klasse/hold/enkeltelev med frist, (3) lade platformen autorette, (4) se overblik over hvem der er i mål/i vanskeligheder, (5) gribe ind differentieret. Prisma optimerer hele denne kæde — det er MatematikFessors vindende mekanik, som Brilliant mangler.

### 2.3 Klasserumsbrug vs. lektiebrug
- **Klasserum:** projektor‑venlige simuleringer og "fælles undring"‑opgaver; korte moduler der passer i en lektion; live klassevisning.
- **Lektie/hjemme:** tildelte opgavesæt med frist; adaptiv træning; forældre‑venligt uden login‑friktion.
Samme indhold, to tilstande.

### 2.4 Differentiering, specialstøtte og repetition
- **Differentiering:** adaptiv sværhedsgrad pr. elev (IRT — findes allerede i prototypen); lærer kan sætte niveaubånd pr. elev.
- **Specialstøtte:** oplæsning (TTS), enklere sprog‑variant, flere hints, længere tid, dysleksivenlig typografi, reduceret kognitiv belastning.
- **Repetition:** spaced repetition af tidligere mestrede færdigheder (adaptive genbesøg — også kimen findes i prototypen).

### 2.5 Elevmotivation
Balancér Brilliant‑æstetik (skønhed, "aha", fremdrift) med sunde gamification‑elementer: streaks, mestrings‑badges, personlig fremdriftskort — men *undgå* pay‑to‑win og manipulerende mekanik (vigtigt i skolekontekst og over for forældre/Datatilsyn).

### 2.6 Skolens indkøbsproces
Dansk skole‑EdTech købes typisk som **abonnement pr. elev/skole**, ofte via **kommunal rammeaftale** eller forlagsdistribution (Alinea/Gyldendal/Clio). Beslutning ligger hos skoleleder/fagteam/kommunal IT. Konsekvens: Prisma skal kunne (a) prøves gratis af enkeltlærere ("land‑and‑expand"), (b) leveres med databehandleraftale klar, (c) integrere Unilogin. Bottom‑up lærer‑adoption → top‑down skolelicens.

### 2.7 Konkurrenter i Danmark
- **MatematikFessor** (Alinea/Clio): markedsleder matematik; drill + lærerstyring.
- **Clio Online:** bredt fagportal‑univers (også naturfag), tekst/opgave‑tungt.
- **Gyldendal fagportaler** (Matematik 7‑10, Multi, naturfagsportaler): forlagsforankret grundsystem.
- **Alinea** (portaldistributør, ejer MatematikFessor‑distribution).
- **GeoGebra:** stærkt matematik‑/geometriværktøj, ikke et forløbs-/opgavesystem.
- **Kahoot / Quizlet:** quiz‑motivation, ikke dyb læring.
- **emat, MinLæring, Frog o.l.:** nichesystemer.
**Gab:** ingen dansk aktør leverer *Brilliant‑grade interaktiv naturfagsforståelse* + autoretning + lærer‑dashboard i ét, på tværs af de fem fag. Det er Prismas position.

### 2.8 Unilogin
**Ja — kritisk.** Unilogin (STIL) er den nationale login‑føderation for elever/lærere og porten til dansk skolesalg. Krav: (1) tilslutningsaftale + databehandleraftale via STIL, (2) OIDC/SAML‑integration, (3) rolle-/klasse‑data via institutions‑/gruppe‑oplysninger. Prisma skal understøtte Unilogin fra pilot og fremad (se §7). Sekundært e‑mail/adgangskode til lærere der vil teste privat.

### 2.9 Privatliv og elevdata
Skolerne er dataansvarlige; Prisma bliver **databehandler**. Krav: dansk/EU‑hosting, **databehandleraftale** klar til underskrift, dataminimering (kun pædagogisk nødvendige data), ingen tredjeparts‑ad‑tracking, klar sletning/retention, DPIA‑venlig dokumentation. Datatilsynet har haft skarpt fokus på skolers brug af cloud‑værktøjer og elevdata — "privacy by design/default" er både compliance og salgsargument. Konkret: pseudonymisér analytics, hold PII adskilt, hostet i EU (fx dansk/EU‑region).

---

## 3. Produktkoncept

**Arbejdstitel:** **Prisma** *(alternativer at tjekke for varemærke: **Undr**, **Kløgt**, **Opdag**)*.
**Metafor:** ét prisme → fem farvede stråler = fem fag. Understøtter direkte fagvalgs‑kortene på forsiden og en genkendelig visuel identitet.

**Kerneløfte (core promise):** *"Forstå det — ikke bare svar rigtigt."* Prisma lærer eleven at *forstå* matematik og naturfag gennem interaktiv, visuel udforskning, og giver læreren autoretning og overblik, så tid frigøres til den enkelte elev.

**Målbrugere:** elever 5.–9. kl. + gymnasiet; lærere i matematik/fysik/kemi/biologi/geografi; skoler/kommuner som købere.

**Elevfordele:** forstår frem for at pugge; interaktive simuleringer der gør abstrakt konkret; adaptivt tempo; hints der stilladserer; synlig fremdrift/mestring; motiverende men ikke manipulerende.

**Lærerfordele:** tildel forløb/opgaver på minutter; autoretning sparer rettetid; realtids‑overblik over klasse og enkeltelev; se *misforståelser* (ikke bare rigtige/forkerte); Fælles Mål‑dokumentation ud af boksen; differentiér uden ekstra arbejde.

**Skolefordele:** ét system til matematik **og** naturfag; Unilogin; databehandleraftale klar; dansk/EU‑hosting; forudsigelig licens; målbar effekt på tværs af fag.

**Hvad gør Prisma anderledes:**
- vs. **MatematikFessor/Clio/Gyldendal/Alinea:** dybt *interaktiv, visuel, simuleringsbaseret* forståelse (Brilliant‑arv) — ikke video→drill — og **naturfagene med**, ikke kun matematik.
- vs. **Brilliant:** dansk, Fælles Mål‑forankret, *lærerstyret* (tildel/autoretning/dashboard), skolelicens + Unilogin, folkeskole‑/gymnasie‑aldersvaret.
- vs. **GeoGebra/Kahoot:** komplet forløbs‑, opgave‑, autoretnings‑ og evalueringssystem, ikke et enkeltværktøj.

---

## 4. Forside og informationsarkitektur

### 4.1 Forside
- **Fagvalgs‑kort** (hero): fem kort — **Matematik, Fysik, Kemi, Biologi, Geografi** — hver med farve fra "prisme‑paletten", ikon, kort teaser og fremdriftsring (for indloggede). Klik → fagets kursusoversigt.
- Sekundært: "Fortsæt hvor du slap", dagens udfordring, log ind (Unilogin / e‑mail), rolle‑skifte (elev/lærer).
- Offentlig forside kommunikerer løftet + demo‑lektion uden login (land‑and‑expand).

### 4.2 Navigation (roller)
```
Forside (fagvalg)
├── Fag → Kursusoversigt → Modul → Lektion → [interaktion] → Øvesession
├── Elev‑dashboard:  Mine fag · Fremdrift/mestring · Tildelte opgaver · Streak/badges
├── Lærer‑dashboard:  Mine hold · Bibliotek · Tildel opgave · Klasseoverblik · Elevindsigt · Fælles Mål‑filter
└── Konto/roller/indstillinger (tilgængelighed, sprogvariant, TTS)
```

### 4.3 Elev‑dashboard
Fagkort med fremdrift; "næste anbefalede" (adaptivt); tildelte opgaver med frist og status; mestringskort pr. færdighed; streak/badges; senest øvet.

### 4.4 Lærer‑dashboard
Holdvælger; **klasseoverblik** (heatmap: elever × færdigheder, farvet efter mestring); **misforståelses‑panel** (hyppigste fejltyper i klassen); tildel‑knap (forløb/opgavesæt → hold/gruppe/elev + frist + niveaubånd); indsigt pr. elev (forsøg, hints brugt, tid, mestring); Fælles Mål‑dækning.

### 4.5 Kursusoversigt
Fag → moduler (fx "Brøker", "Kræfter", "Reaktioner") → lektioner. Viser læringsmål, Fælles Mål‑tags, estimeret tid, mestringsstatus, låst/åben (unlock‑logik findes i prototypen).

### 4.6 Fremdrifts‑ og opgaveoversigt
- **Fremdrift:** mestring pr. færdighed/modul/fag; adaptiv θ visualiseret som niveau; genbesøgs‑anbefalinger.
- **Opgaver:** liste over tildelte opgaver, frist, indsendt/rettet/score; for lærer: aggregeret status + drill‑down.

---

## 6. Læringsdesign (kernemodellen)

Én pædagogisk loop, genbrugt på tværs af alle fem fag:

1. **Kort forklaring** — 2–4 sætninger, ét billede/model. Ikke en video‑forelæsning; nok til at starte handling.
2. **Aktiv problemløsning først** — eleven manipulerer/svarer med det samme; forståelsen vokser ud af handlingen (Brilliant‑arv).
3. **Visuelle modeller** — brøkbjælker, tallinjer, kraftpile, partikelmodeller, grafer, kort.
4. **Interaktive widgets** — fagspecifikke interaktioner (§10), fx skub en slider og se grafen ændre sig.
5. **Genereret træning** — seed‑baseret item‑generering giver uendelig variation pr. færdighed (findes i prototypens engine).
6. **Gennemregnede eksempler (worked examples)** — trin‑for‑trin, kan foldes ud efter forsøg.
7. **Progressive hints** — niveau 1 (peg), 2 (metode), 3 (næsten‑svar) — stilladserer uden at afsløre; logges for lærerindsigt.
8. **Misforståelses‑diagnose** — svar‑validatorer genkender *specifikke fejltyper* (fx "har adderet nævnere") og giver målrettet feedback + fodrer lærer‑dashboardet.
9. **Mestringsniveauer** — pr. færdighed, opdateret **pr. forsøg** via IRT/Rasch θ (findes i prototypen), ikke kun pr. afsluttet opgave.
10. **Adaptiv repetition** — spaced genbesøg af faldende mestring; næste‑item‑niveau vælges ud fra θ.
11. **Lærerstyrede opgaver** — læreren kan overstyre adaptivitet: fastsætte forløb, niveaubånd, frist, og se alt aggregeret.

---

## 7. Teknisk arkitektur

*Bygger videre på den eksisterende prototype (React 18 + Vite + TypeScript + react-router; deterministisk seed‑baseret opgavemotor; IRT‑adaptivitet; mastery‑pr‑forsøg; skillmap/unlock; localStorage). Prototypen er i dag single‑subject, client‑only, uden backend — planen tilføjer backend, roller, indhold på tværs af fag og lærerværktøjer.*

| Lag | Valg | Begrundelse |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite; komponentbibliotek for widgets; MathML/KaTeX til matematik | Genbruger eksisterende kodebase; hurtig, typesikker, interaktiv |
| **Backend** | Node/TypeScript (Fastify/NestJS) **eller** en BaaS til pilot; REST/tRPC API | Delt sprog med frontend; hurtig iteration |
| **Database** | PostgreSQL (relationelt kernedata) + evt. JSONB til indholdsblokke | Stærkt relationelt behov (roller/klasser/tildelinger) + fleksible indholdsblokke |
| **Auth** | **Unilogin (OIDC/SAML)** som primær; e‑mail/adgangskode sekundært; rollebaseret adgang | Krav for dansk skolesalg |
| **Indholdsformat** | Struktureret JSON/MDX "content blocks" + item‑blueprints (§9) | Genanvendeligt på tværs af fag; forfatter‑venligt |
| **Opgavemotor** | Deterministisk, seed‑baseret item‑generering pr. blueprint (findes) | Uendelig variation, reproducérbar, testbar |
| **Svartjek** | Validator pr. `response_kind` (int, number, mcq, order, equation, …) + misforståelses‑regler | Autoretning + diagnose i ét |
| **Simuleringer** | Canvas/SVG + let fysik/partikel‑logik; genbrugelige "sim"‑komponenter | Fysik/kemi/geografi‑interaktioner |
| **Progression** | θ pr. node + mestring; server‑persisteret (migreres fra localStorage) | Deling mellem enheder, lærerindsigt |
| **Lærer‑dashboard** | Aggregeringsforespørgsler + heatmap/indsigts‑UI | Kernediff. mod Brilliant |
| **Deployment** | EU/dansk region (privacy); CI/CD; staging + prod; observability | Datatilsyn/GDPR; drift |

**Sikkerhedsnote:** prototypen har facit klientside (fint til MVP). Til skolebrug flyttes autoritativ svar‑validering serverside, så items ikke kan "snydes" fra devtools, og attempts logges autoritativt.

---

## 8. Datamodel (skema‑skitse)

PostgreSQL. Forkortet; FK'er antydet. Fælles‑Mål‑tags og indholdsblokke kan ligge i JSONB.

```
users(id, unilogin_sub, email, display_name, created_at)
roles(id, name)                      -- student | teacher | admin
user_roles(user_id, role_id)
students(user_id PK/FK, grade, accessibility_prefs jsonb)
teachers(user_id PK/FK, school_id)
schools(id, name, municipality, dpa_signed_at)
classes(id, school_id, name, grade, year)
class_members(class_id, user_id, role_in_class)   -- elev/lærer på hold

subjects(id, key, name)              -- math, physics, chemistry, biology, geography
courses(id, subject_id, title, grade_band)
modules(id, course_id, title, order_index, faelles_maal jsonb)
lessons(id, module_id, title, order_index, content jsonb, learning_goals jsonb, faelles_maal jsonb)

exercise_templates(id, lesson_id, blueprint_id, response_kind, params jsonb, difficulty_level)
exercise_items(id, template_id, seed, rendered jsonb, correct_spec jsonb)   -- genereret/cachet
validators(id, template_id, kind, spec jsonb)      -- svartjek + tolerancer
hints(id, template_id, level, body jsonb)
misconceptions(id, template_id, pattern jsonb, label, feedback jsonb)

attempts(id, user_id, item_id, response jsonb, is_correct, misconception_id?, hints_used, time_ms, created_at)
feedback_events(id, attempt_id, type, body jsonb)   -- vist feedback/diagnose

progress(user_id, node_id, theta, mastery, last_seen_at, due_at)   -- adaptiv + repetition
mastery_estimates(user_id, skill_id, mastery, updated_at)

assignments(id, teacher_id, class_id, title, due_at, config jsonb)  -- niveaubånd, indhold
assignment_targets(assignment_id, user_id|group)                   -- hold/gruppe/elev
assignment_content(assignment_id, lesson_id|module_id|template_id)
assignment_progress(assignment_id, user_id, status, score, submitted_at)

teacher_analytics_views(...)   -- materialiserede aggregeringer for dashboard (heatmap/misforståelser)
```

Nøglerelationer: `class_members` binder elever/lærere til hold; `assignments`→`assignment_targets` styrer tildeling; `attempts`+`progress`+`mastery_estimates` føder både adaptivitet og lærer‑dashboard; `misconceptions` gør fejl *diagnostiske*, ikke bare forkerte.

---

## 9. Indholdsmodel (genbrugelig på tværs af fag)

Én lektion = en ordnet liste af **content blocks** + tilknyttede **item‑blueprints**. Samme skema for matematik, fysik, kemi, biologi, geografi.

```jsonc
Lesson {
  title, learning_goals[], faelles_maal[],          // curriculum-links
  blocks: [
    { type: "text",        body },                   // kort forklaring
    { type: "figure",      model, caption },         // visuel model (brøkbjælke, kraftpil, partikel…)
    { type: "simulation",  sim_id, params },         // interaktiv sim
    { type: "worked_example", steps[] },
    { type: "exercise",    blueprint_ref }           // interaktiv opgave
  ],
  teacher_notes                                       // didaktiske noter, kun lærer
}

Blueprint {
  blueprint_id, subject, response_kind,
  variables: { rules for generated_variables (seed→tal/figurer) },
  stem_template,                                      // opgavetekst m. variabler
  answer_validator: { kind, tolerance, canonicalization },
  hints: [ {level, body} ],
  misconceptions: [ {pattern, label, feedback} ],     // common_misconceptions + feedback_rules
  faelles_maal[]
}
```

Denne struktur dækker eksplicit alle de ønskede felter: lektionstekst, læringsmål, curriculum‑links, forklarende sektioner, visuelle komponenter, simuleringer, genererede variabler, opgaveskabeloner, svar‑validatorer, hints, typiske misforståelser, feedback‑regler og lærer‑noter — og er identisk på tværs af fag, så forfatterværktøj og motor kan genbruges.

---

## 10. Interaktionstyper pr. fag

Alle deler den fælles motor (§7/§9); kun render‑ og validator‑delen er fagspecifik.

**Matematik:** tal‑input · ligningsinput · multiple choice · drag‑and‑drop ordning · brøkvisualisering · grafaflæsning/‑fortolkning · trin‑for‑trin‑løsning · talelinje · kvotient/rest (findes i prototypen) · kolonneregning (findes).

**Fysik:** formelberegning · enhedsomregning · simulations‑manipulation (slider→graf) · grafaflæsning · kraftdiagrammer (frilegemer) · kredsløbsdiagrammer · bølgevisualisering.

**Kemi:** molekyle-/partikelmodeller · reaktionsafstemning · pH‑skala · koncentrations‑/molberegning · klassifikationsopgaver · matche model↔forklaring.

**Biologi:** mærkning af diagrammer (celle, organ) · klassifikation/taksonomi · fødekæde‑/kredsløbs‑bygning · sekvensordning (fx celledeling) · data-/graf‑fortolkning.

**Geografi:** kort‑interaktion (placér/aflæs) · klima-/data‑grafer · klassifikation (landskabstyper) · matche fænomen↔årsag · simple simuleringer (vandkredsløb, plade­tektonik).

Fælles primitiver der går igen: **number/text‑input, MCQ, ordering, drag‑drop‑placering, slider‑sim, graf‑aflæsning, mærkning, matching, afstemning/balancering**. Ved at implementere disse ~10 primitiver dækkes alle fem fag — hjørnestenen i at kunne skalere bredt uden at genopfinde motoren pr. fag.

---

## 11. Build‑roadmap

*Bygger på den eksisterende matematik‑prototype. Hver fase har et konkret leverbart output.*

**Uge 0 — Research/specifikation (1 uge)**
Låse scope for MVP; vælge 1 matematik‑ + 1 naturfags‑modul til vertikal skive; specificere de ~10 interaktions‑primitiver (§10); Fælles Mål‑tagging‑skema; Unilogin‑ og databehandleraftale‑afklaring med STIL; teknisk beslutning backend + DB. *Output: kort PRD + skema (§8/§9) + wireframes for forside/dashboards.*

**Uge 1–2 — Prototype‑sprint (2 uger)**
Udvid eksisterende prototype: forside med **fem fagkort**; content‑block‑renderer; 3 nye interaktions‑primitiver (fx MCQ, slider‑sim, mærkning) ud over de eksisterende math‑typer; én komplet fysik‑lektion end‑to‑end (forklaring→sim→øvelse→autoretning). *Output: klikbar prototype på tværs af 2 fag.*

**Uge 3–8 — MVP‑sprint (6 uger)**
Backend + PostgreSQL (migrér progress fra localStorage); roller (elev/lærer); Unilogin‑login; lærer‑dashboard v1 (klasseoverblik + tildel opgave + frist); serverside svar‑validering; misforståelses‑diagnose v1; 1 fuldt matematik‑modul + 1 fysik‑modul med Fælles Mål‑tags; tilgængelighed (TTS, dysleksi‑typografi). *Output: MVP en enkelt klasse kan bruge.*

**Måned 3–4 — Pilot‑version (≈3 måneder)**
Kemi + geografi‑modul (2 fag mere → 4 i alt); adaptiv repetition serverside; lærer‑indsigt v2 (misforståelses‑panel, elev‑drilldown); assignments‑workflow komplet; databehandleraftale + EU‑hosting + DPIA‑dokumentation klar; onboarding‑flow for lærere. *Output: pilotklar platform, 4–5 fag i bredde (om end få moduler pr. fag).*

**Første klassetest**
Kør med forfatterens egen klasse + 1–2 kollega‑klasser; mål: brugbarhed, autoretnings‑kvalitet, motivationseffekt, lærertids‑besparelse. Indsamle kvalitativ + kvantitativ (attempts/mestring/tid) feedback. Iterér indhold og hints ud fra reelle misforståelses‑data.

**Hostet beta**
Offentlig, Unilogin‑indlogget beta for udvalgte skoler; gratis lærer‑lag (land‑and‑expand); telemetri/observability; support‑ og feedback‑loop; hærdet sikkerhed/privatliv. Prissætnings‑ og skolelicens‑model testes.

**Langsigtet platform‑roadmap**
Biologi i fuld bredde; gymnasie‑niveau i alle fag; forfatterværktøj så lærere/forlag selv laver indhold; AI‑tutor (dansk, stilladserende — ikke svar‑afslørende, privatlivs‑sikker); klasse‑live‑tilstand; forældre‑view; åbne standarder (QTI/xAPI) og Aula/LMS‑integration; kommunale rammeaftaler; effekt‑dokumentation/forskningssamarbejde; skalering til flere fag/klassetrin.

---

## Kilder

- MatematikFessor / Alinea: [matematikfessor.dk](https://www.matematikfessor.dk/), [teacher dashboard](https://www.matematikfessor.dk/dashboard-teacher), [Alinea produktside](https://www.alinea.dk/matematik/grundsystemer-og-portal/produkt/matematikfessor)
- Brilliant.org: [How it works / pricing (Help Center)](https://brilliant.org/help/pricing-and-plans/), [Brilliant for Educators](https://brilliant.org/help/pricing-and-plans/can-teachers-and-students-get-brilliant-for-free/), [Wikipedia](https://en.wikipedia.org/wiki/Brilliant_(website))
- Unilogin (STIL): [stil.dk/unilogin](https://stil.dk/administration-og-infrastruktur/unilogin/), [Uni-Login (Wikipedia)](https://da.wikipedia.org/wiki/Uni-Login)
- Fælles Mål (matematik): [uvm.dk – Om Fælles Mål](https://uvm.dk/grundskole/folkeskolen/fag-og-indhold/fag-emner-og-tvaergaaende-temaer/faelles-maal/), [Bekendtgørelse 2024/1715](https://www.retsinformation.dk/eli/lta/2024/1715), [Lex.dk – Fælles Mål](https://lex.dk/F%C3%A6lles_M%C3%A5l)
- Danske læremidler/konkurrenter: [Gyldendal fagportaler – matematik](https://matematik.gyldendal.dk/), [Folkeskolen – lærernes anbefalinger](https://folkeskolen.dk/517653/laererne-anbefaler-her-er-programmerne-som-loefter-vores-undervisning)
- Privatliv/elevdata: nordiske datatilsyns‑fund om skolers cloud‑værktøjer og manglende databehandleraftaler (bl.a. [datatilsynet – tilsyn med skolesektoren](https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2025/tilsyn-med-skolesektoren-i-kommunene/)); dansk kontekst: skoler er dataansvarlige, leverandør er databehandler (GDPR).
