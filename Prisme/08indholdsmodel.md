# 08 — Indholdsmodel (genbrugelig på tværs af fag)

Målet: **én indholdsstruktur** der driver matematik, fysik, kemi, biologi og geografi — så nyt fag = nyt *indhold*, ikke ny *kode*. Alt indhold er versioneret JSON, valideret mod JSON Schema/Zod, og forfattet i et Git-repo/CMS.

## 8.1 Lektion (lesson) — topniveau

```jsonc
{
  "id": "phys-8-newton-2",
  "subject": "physics",
  "course": "physics-grundskole-8",
  "module": "krafter",
  "title": "Newtons 2. lov",
  "estMinutes": 15,
  "learningGoals": [
    "Jeg kan forklare sammenhængen mellem kraft, masse og acceleration",
    "Jeg kan bruge F = m·a til at beregne en af størrelserne"
  ],
  "curriculumLinks": [
    { "framework": "faelles_maal", "subject": "fysikkemi",
      "competenceArea": "modellering", "code": "Fy/ke-8-modeller",
      "binding": true },
    { "framework": "faelles_maal", "goalType": "faerdigheds_videns",
      "code": "kraft-og-bevaegelse", "binding": false }
  ],
  "knowledgeComponents": ["PHYS.NEWTON2.CONCEPT", "PHYS.NEWTON2.CALC"],
  "teacherNotes": "Elever forveksler ofte tung og svær at accelerere. Brug vogn-demoen.",
  "blocks": [ /* ordnede blokke — se §8.2 */ ]
}
```

## 8.2 Blokke (lesson_blocks) — den fælles byggeklods

En lektion er en ordnet liste af **blokke**. Samme blok-typer bruges i alle fag:

| `type` | Formål | Nøglefelter |
|--------|--------|-------------|
| `text` | Kort forklaring | `body` (markdown+LaTeX), `readingLevel` |
| `figure` | Statisk visuel | `src`/`svg`, `caption`, `alt` |
| `widget` | Interaktiv model | `widgetType`, `params`, `interactions` |
| `simulation` | Kørende simulering | `simType`, `initialState`, `controls`, `rules` |
| `workedExample` | Trin-for-trin | `steps[]`, `fade` |
| `exerciseRef` | Indlejret opgave | `templateId`, `count`, `difficultyRange` |
| `checkpoint` | Mastery-tjek | `templateIds[]`, `passRule` |

### Eksempel — text + widget + checkpoint

```jsonc
{
  "blocks": [
    { "type": "text",
      "body": "En **kraft** kan ændre en tings bevægelse. Prøv at skubbe vognen 👇",
      "readingLevel": "enkel" },

    { "type": "widget",
      "widgetType": "force-motion-1d",
      "params": { "mass": { "min": 1, "max": 10, "default": 2, "unit": "kg" },
                  "force": { "min": 0, "max": 20, "default": 6, "unit": "N" },
                  "friction": 0.0 },
      "interactions": ["dragForceSlider", "dragMassSlider"],
      "readout": ["acceleration"],
      "prompt": "Hold kraften fast. Hvad sker der med accelerationen, når massen bliver større?" },

    { "type": "workedExample",
      "steps": [
        "Vi kender kraften F = 6 N og massen m = 2 kg.",
        "Newtons 2. lov: F = m · a  ⟹  a = F / m.",
        "a = 6 N / 2 kg = 3 m/s²."
      ],
      "fade": true },

    { "type": "checkpoint",
      "templateIds": ["tmpl-newton2-solve-a"],
      "passRule": { "correctOf": 3, "need": 2 } }
  ]
}
```

## 8.3 Visuelle komponenter & simuleringer (widget-spec)

Widgets og simuleringer deler ét **spec-format**, som frontend-runtimen fortolker:

```jsonc
{
  "widgetType": "graph-plotter",       // registreret i widget-registret
  "params": {                          // navngivne, evt. bundet til genererede variable
    "a": { "min": -3, "max": 3, "default": 1, "step": 0.5, "bind": "var.a" },
    "b": { "min": -5, "max": 5, "default": 0 }
  },
  "render": { "expr": "a*x + b", "domain": [-5, 5] },
  "interactions": ["dragSlider:a", "dragSlider:b", "dragLine"],
  "readout": ["slope", "intercept"],
  "emits": ["a", "b"]                  // værdier der kan bruges i opgavevalidering
}
```

Registret af genbrugelige widget/sim-typer (uddrag): `number-line`, `fraction-bar`, `graph-plotter`, `geometry-canvas`, `force-motion-1d`, `circuit-builder`, `particle-model`, `reaction-balancer`, `ph-slider`, `food-web`, `cell-diagram`, `map-layers`, `data-explorer`. Nye typer registreres én gang i koden og genbruges af alle fag via JSON.

## 8.4 Opgaveskabelon (exercise_template)

Kernen i generet, auto-rettet træning. Genbrugsstrukturen er **variable → prompt → answer → hints → misconceptions → feedback**.

```jsonc
{
  "id": "tmpl-newton2-solve-a",
  "subject": "physics",
  "title": "Beregn acceleration ud fra F og m",
  "difficulty": 2,
  "knowledgeComponents": ["PHYS.NEWTON2.CALC"],
  "curriculumLinks": [{ "framework": "faelles_maal", "code": "Fy/ke-8-modeller" }],

  "variables": {
    "m": { "type": "int", "min": 2, "max": 10, "unit": "kg" },
    "a": { "type": "int", "min": 2, "max": 6 },
    "F": { "expr": "m * a", "unit": "N" }        // afledt, sikrer pæne tal
  },

  "prompt": {
    "text": "En vogn med massen {{m}} kg påvirkes af kraften {{F}} N. Hvor stor er accelerationen?",
    "media": null
  },

  "answer": {
    "validator": "numeric",
    "value": "{{a}}",
    "unit": "m/s^2",
    "tolerance": 0.01,
    "requireUnit": true
  },

  "hints": [
    { "level": 1, "text": "Hvilken lov forbinder kraft, masse og acceleration?" },
    { "level": 2, "text": "Newtons 2. lov: F = m · a." },
    { "level": 3, "text": "Isolér a: a = F / m." },
    { "level": 4, "text": "a = {{F}} / {{m}} = {{a}} m/s²." }
  ],

  "distractors": [
    { "rule": "F * m", "misconception": "M-NEWTON-GANGER-I-STEDET-FOR-DIVIDERER" },
    { "rule": "m / a", "misconception": "M-NEWTON-BYTTER-OM" }
  ],

  "feedbackRules": [
    { "condition": { "matchesMisconception": "M-NEWTON-GANGER-I-STEDET-FOR-DIVIDERER" },
      "message": "Du gangede F og m. Men a = F / m — kraften deles ud på massen." },
    { "condition": { "missingUnit": true },
      "message": "Husk enheden: acceleration måles i m/s²." },
    { "condition": { "correct": true },
      "message": "Flot! Jo større masse ved samme kraft, jo mindre acceleration." }
  ],

  "solution": {
    "steps": ["F = m · a", "a = F / m", "a = {{F}} / {{m}} = {{a}} m/s²"]
  },

  "teacherNotes": "God som checkpoint efter widget-udforskningen."
}
```

### Feltforklaring (den genbrugelige kontrakt)

| Sektion | Rolle | Fælles på tværs af fag |
|---------|-------|------------------------|
| `variables` | Genererede tal/størrelser m. constraints & afledninger | ✅ samme generator |
| `prompt` | Opgavetekst m. pladsholdere (+ evt. figur/widget) | ✅ |
| `answer` | Validator-type + parametre (§06.8) | ✅ typede validatorer |
| `hints` | Progressiv hint-stige | ✅ |
| `distractors` | Mønstrede forkerte svar → misforståelse | ✅ |
| `misconceptions` | Navngivne fejltanker (delt katalog pr. fag) | ✅ |
| `feedbackRules` | Betinget, målrettet feedback | ✅ |
| `solution` | Worked example (fade-bar) | ✅ |
| `teacherNotes` | Didaktiske noter til læreren | ✅ |
| `curriculumLinks` | Fælles Mål-tagging | ✅ |
| `knowledgeComponents` | KC-tagging (mestring/repetition) | ✅ |

## 8.5 Answer-validators pr. fag (samme motor, forskellige parametre)

| Fag | Typiske validatorer | Eksempel |
|-----|---------------------|----------|
| Matematik | `numeric`, `expression`, `equation`, `point`, `graph`, `set` | Løs ligning; algebraisk ækvivalens |
| Fysik | `numeric` (m. enheder), `vector`, `graph` | F=ma; aflæs v-t-graf |
| Kemi | `chem-equation`, `numeric`, `mcq` | Afstem reaktion; beregn mol |
| Biologi | `mcq`, `multi`, `drag-label`, `ordering` | Placér organeller; ordn fødekæde |
| Geografi | `map-point`, `table`, `mcq`, `numeric` | Placér på kort; aflæs klimadata |

Alle bygger på det samme validator-interface (`{correct, closeness, misconceptionCode?, feedbackId?}`), så retning, feedback og mestring virker ens overalt.

## 8.6 Misforståelseskatalog (delt ressource)

Hvert fag har et voksende, versioneret katalog af **misforståelseskoder** med forklaringer, fx:

```jsonc
{
  "code": "M-BRØK-ADDERER-NÆVNERE",
  "subject": "math",
  "name": "Lægger nævnere sammen ved brøkaddition",
  "explanation": "Nævneren fortæller, hvor mange lige store dele helheden er delt i. Når du lægger brøker med samme nævner sammen, tæller du kun tællerne — nævneren er stadig den samme.",
  "linkedWidget": "fraction-bar",
  "remediationLesson": "math-6-fraction-add"
}
```

Koder deles på tværs af opgaver, så samme fejltanke altid udløser samme kvalitetsforklaring — og aggregeres til lærerens fejlmønster-overblik.

## 8.7 Forfatter-workflow & kvalitet

- **Autor-format:** JSON/MDX i Git-repo → PR-review (fagperson + didaktiker) → CI validerer skema + kører "self-test" (generér 100 instanser, tjek at facit/validator er konsistente) → publicér med `status: published`, `version`.
- **Senere:** web-baseret autor-UI oven på samme skema, så faglærere kan bidrage uden at kode.
- **Oversættelse/niveau:** felter kan have `readingLevel`-varianter (enkel/standard) og evt. senere flersprogethed.
- **Genbrug på tværs af trin:** samme skabelon kan optræde i flere kurser via `content_curriculum_links` og forskellige `difficultyRange`.

## 8.8 Hvorfor denne model vinder

- **Skalerbar indholdsproduktion:** faglærere kan skrive opgaver som strukturerede data, ikke kode.
- **Konsistent kvalitet:** hints, misforståelser og feedback er indbygget i *hver* opgave — ikke en eftertanke.
- **Auto-retning "for free":** validator-typen er en del af skabelonen.
- **Data-drevet pædagogik:** KC- og misforståelses-tags gør mestring, repetition og lærer-analytics mulige.
- **Ét fundament, fem fag:** den samme motor bærer matematik *og* naturfagene — præcis den bredde, hverken Brilliant eller MatematikFessor dækker samlet.
