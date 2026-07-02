# 04 — Forside og informationsarkitektur

## 4.1 Forsiden (offentlig + logget ind)

Forsiden har to tilstande:

**A) Offentlig (ikke logget ind)** — salg + fagvalg:
- Hero: kerneløfte + kort interaktiv demo-widget (fx en skyder der ændrer en graf) så besøgende *oplever* produktet med det samme.
- **Fem fagvalgs-kort** (se nedenfor).
- "For lærere" / "For skoler" / "For elever" indgange.
- Data-tryghed-badge (dansk/EU-hosting, Unilogin, DPA).
- Login (Unilogin for elever · MitID/lokal IdP for lærere).

**B) Logget ind** — går direkte til rolle-dashboard, men fagvalgs-kortene forbliver den centrale navigation ind i fagene.

### Fagvalgs-kort (kernekravet)

Fem store, farvekodede kort — ét system, fem farver af spektret:

```
┌───────────────────────────────────────────────────────────────────────┐
│   PRISME            [Matematik] [Fysik] [Kemi] [Biologi] [Geografi]  👤 │
├───────────────────────────────────────────────────────────────────────┤
│   Forstå det — så husk det.                                             │
│   Interaktiv naturvidenskab for 5.–9. klasse og gymnasiet.              │
│                                                                         │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│   │  🟦    │ │  🟪    │ │  🟩    │ │  🟧    │ │  🟨    │                │
│   │ Mate-  │ │ Fysik  │ │ Kemi   │ │ Biologi│ │ Geo-   │                │
│   │ matik  │ │        │ │        │ │        │ │ grafi  │                │
│   │ ▓▓▓░ 62%│ │ ▓░░░ 20%│ │ ▓▓░░ 41%│ │ ░░░░ 0% │ │ ▓░░░ 15%│           │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                │
│                                                                         │
│   [Fortsæt hvor du slap: Brøker → Fælles nævner]                        │
└───────────────────────────────────────────────────────────────────────┘
```

Hvert kort viser (når logget ind): fagfarve/ikon, **fremdrift/mestringsprocent**, og et "fortsæt"-punkt. Uden login viser kortene emneoverskrifter og en "prøv en lektion gratis"-knap.

## 4.2 Global navigation

```
Topbar:  Logo · Fag-switcher (5 fag) · Søg · [Rolleafhængigt] · Profil/roller

Elev-venstremenu:      Hjem · Mit fag · Fagkort · Opgaver · Repetition · Fremskridt
Lærer-venstremenu:     Hjem · Klasser · Bibliotek · Tildelinger · Overblik · Fælles Mål
Skoleadmin-venstremenu: Skoler · Brugere · Licenser · Rapporter · Data & privatliv
```

Rolle-switch øverst (en person kan være lærer i ét hold og elev/kursist et andet; en admin kan skygge en klasse).

## 4.3 Elev-dashboard

Formål: *ind i arbejdet på < 5 sekunder,* med tydelig mestringsfølelse.

```
┌─────────────────────────────────────────────────────────────┐
│  Hej Freja 👋      🔥 7 dages streak     ⭐ Mester i 12 emner  │
├─────────────────────────────────────────────────────────────┤
│  ▶ FORTSÆT: Fysik · Kræfter · Newtons 2. lov      [Fortsæt]   │
│                                                               │
│  📌 AFLEVERINGER (2)                                          │
│   • Matematik: Ligninger — frist fredag        ▓▓▓░ 70%      │
│   • Biologi: Cellen — frist onsdag             ░░░░  0%      │
│                                                               │
│  🔁 REPETITION I DAG (5 min)     [Start repetition]           │
│   Genopfrisk: Procent · Fotosyntese · Brøkregler              │
│                                                               │
│  🗺 DINE FAGKORT        🟦62% 🟪20% 🟩41% 🟧0% 🟨15%          │
└─────────────────────────────────────────────────────────────┘
```

Elementer: Fortsæt · Afleveringer m. frist · Dagens adaptive repetition · Fagkort/mestring · streak/mestringsbadges (afdæmpet).

## 4.4 Lærer-dashboard

Formål: *overblik + handling.* Åbner på "hvad kræver min opmærksomhed".

```
┌──────────────────────────────────────────────────────────────────────┐
│  8.B · Matematik ▾            Uge 27      [+ Ny tildeling]             │
├──────────────────────────────────────────────────────────────────────┤
│  ⚠️ KRÆVER OPMÆRKSOMHED                                                │
│   • 6 elever sidder fast i "Ligninger med to ubekendte"               │
│   • Mikkel har ikke åbnet 2 afleveringer                              │
│   • Typisk fejl i klassen: fortegnsfejl ved flytning af led (42%)     │
│                                                                        │
│  📋 AKTIVE TILDELINGER                                                 │
│   Ligninger        frist fre   ▓▓▓▓▓▓▓░░░ 21/28 afleveret            │
│   Geometri-repetit. frist man  ▓▓▓░░░░░░░  9/28                       │
│                                                                        │
│  📊 HOLDETS MESTRING (Fælles Mål: Tal & Algebra)                      │
│   Ny ▓▓░░░░  Øvet ▓▓▓░░  Sikker ▓▓▓▓░  Mester ▓▓░                     │
│                                                                        │
│  [Klasseoversigt]  [Elevliste]  [Fælles Mål-dækning]  [Eksportér]     │
└──────────────────────────────────────────────────────────────────────┘
```

Drill-down: Klasse → elev → opgave → **det konkrete forsøg med elevens svar, hints brugt og diagnosticeret misforståelse.** Det er her lærerens tid spares og indsatsen målrettes.

## 4.5 Kursusoversigt (fagkort)

Et **fagkort** = en visuel læringssti for ét fag/klassetrin: moduler → lektioner, med mestringsstatus og låse-/anbefalingslogik.

```
FYSIK · 8. klasse
────────────────────────────────────────────────
[✓ Energi]───[✓ Bevægelse]───[● Kræfter]───[🔒 Tryk]───[🔒 Elektricitet]
                                  │
              ┌───────────────────┼───────────────────┐
          [✓ Hvad er kraft]  [● Newtons 2.]     [🔒 Gnidning]
             Mester            Øvet · fortsæt      Ikke startet
```

Statusfarver = mestringsniveau (§05). Låse er "bløde" anbefalinger (lærer kan låse op / eleven kan hoppe).

## 4.6 Fremskridtsoversigt

To visninger:
- **Elev:** mestring pr. emne/mål, streak-kalender, "det jeg er ved at glemme", personlige rekorder. Sprog: opmuntrende, vækst-orienteret.
- **Lærer/skole:** mestring pr. hold og pr. elev, **Fælles Mål-dækningsmatrix** (mål × elever), fremgang over tid, prøveparathed, eksport (CSV/PDF) til forældresamtale/kvalitetsrapport.

## 4.7 Afleveringsoversigt

**Lærerens tildelingsflow (mål: ≤ 3 klik):**

```
1) Vælg indhold   → fra bibliotek/fagkort (lektion, opgavesæt, forløb, repetition)
2) Vælg modtagere → hele hold / grupper / enkeltelever   + differentiering (niveau pr. elev)
3) Sæt rammer     → frist, i-timen/lektie, antal opgaver, mål for mestring → [Tildel]
```

**Elevens afleveringsoversigt:** liste med fag, titel, frist, status (ikke åbnet / i gang / afleveret / rettet), og direkte "fortsæt".

**Efter aflevering:** auto-rettet med det samme; eleven ser feedback/forklaring; læreren ser resultat i live-overblik. Lærer kan tilføje en kommentar eller "genåbne til øvelse".

## 4.8 Informationsarkitektur — samlet træ

```
Prisme
├── Offentlig site (marketing, priser, om data/privatliv, for lærere/skoler)
├── Auth (Unilogin · MitID · lokal IdP · egne konti)
└── App
    ├── Hjem (fagvalgs-kort + rolle-dashboard)
    ├── Fag ×5 (Matematik, Fysik, Kemi, Biologi, Geografi)
    │   └── Fagkort → Modul → Lektion → (Forklar · Udforsk · Prøv · Træn · Tjek)
    ├── Elev
    │   ├── Afleveringer
    │   ├── Repetition (adaptiv)
    │   └── Fremskridt / mestring
    ├── Lærer
    │   ├── Klasser (hold, elever, roller)
    │   ├── Bibliotek (søg/filtrér på fag, trin, Fælles Mål, type)
    │   ├── Tildelinger (opret, følg, ret, genbrug)
    │   ├── Overblik (live klasse, drill-down, fejlmønstre)
    │   └── Fælles Mål-dækning
    └── Admin (skole/kommune)
        ├── Brugere & klasser (SSO-synk fra STIL)
        ├── Licenser
        ├── Rapporter (aggregeret, anonymiseret)
        └── Data & privatliv (DPA, underdatabehandlere, logs)
```
