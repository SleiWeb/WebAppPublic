# 05 — Læringsdesign (den pædagogiske kernemodel)

## 5.1 Læringssløjfen

Hver lektion følger en fast, genkendelig sløjfe — Brilliants "learn by doing" møder MatematikFessors mængdetræning og lærerstyring:

```
  FORKLAR → UDFORSK → PRØV → TRÆN → TJEK → (REPETÉR)
   kort      inter-    guidet  gene-   mest-   spaced
   tekst     aktiv     opgave  reret   rings-  repetition
             model             træning tjek    over tid
```

| Trin | Formål | Form | Inspiration |
|------|--------|------|-------------|
| **Forklar** | Kort begrebsintro | 1–3 sætninger + ét visuelt element. Aldrig en væg af tekst. | Brilliant |
| **Udforsk** | Byg intuition | Interaktiv widget: skyder, træk-punkt, simulering. Eleven *gør*, ser konsekvens. | Brilliant |
| **Prøv** | Anvend med stilladsering | Guidet opgave med worked example + hints. | Begge |
| **Træn** | Automatisér | Genererede parametriske opgaver, stigende sværhed. | MatematikFessor |
| **Tjek** | Bekræft mestring | Kort mastery-check der opdaterer mestringsniveau. | Begge |
| **Repetér** | Fasthold | Adaptiv spaced repetition på tværs af emner. | State of the art |

## 5.2 Korte forklaringer

- Maks. ~40 ord pr. skærm før en handling.
- Formalisme (formler/notation) kommer *efter* intuition, ikke før.
- Hvert nyt begreb har ét visuelt anker (figur/model/analogi).
- "Enkelt sprog"-mode kan skifte til kortere sætninger + ordforklaringer (differentiering/DSA).

## 5.3 Aktiv problemløsning

Hver skærm har **én** ting man kan gøre: klikke på en figur, trække et punkt, vælge, indtaste, sortere, justere en skyder. Passiv læsning minimeres. Ingen skærm er "næste"-knap alene.

## 5.4 Visuelle modeller & interaktive widgets

Genbrugelige, parametriske widget-typer der virker på tværs af fag:

| Widget | Bruges i | Eksempel |
|--------|----------|----------|
| **Tallinje / brøkstang** | Matematik | Se brøker som længder |
| **Graf-plotter (skyder → kurve)** | Matematik, Fysik | Ændr *a* i *y=ax+b* og se linjen dreje |
| **Geometri-lærred** | Matematik | Træk trekantens hjørner, vinkelsum vises |
| **Kraft-/bevægelsessimulering** | Fysik | Skub en klods, se F=ma, friktion |
| **Kredsløbsbygger** | Fysik | Træk komponenter, se strøm/spænding |
| **Partikel-/tilstandsmodel** | Kemi, Fysik | Varme → partikler bevæger sig hurtigere |
| **Molekyle-/reaktionsbygger** | Kemi | Afstem reaktion, tæl atomer |
| **pH-/koncentrations-slider** | Kemi | Fortynd → se pH ændre sig |
| **Fødekæde/økosystem-model** | Biologi | Fjern en art, se effekten |
| **Celle-/organdiagram (interaktivt)** | Biologi | Klik en organel, se funktion |
| **Kort-/klima-lag** | Geografi | Skift lag: nedbør, befolkning, plader |
| **Datasæt-udforsker** | Alle | Byg diagram af data, tolk |

Widgets deler ét **parameter- og hændelses-API** (§06/§08), så samme motor driver alle.

## 5.5 Genereret træning (parametriske opgaver)

- En **opgaveskabelon** definerer variable + begrænsninger + en løsningsregel.
- En **seed** giver deterministiske, men varierede instanser (samme elev+forsøg = samme tal; genforsøg = nye tal).
- Sværhedsgrad styres af parameter-intervaller (fx tocifrede vs. decimaltal).
- Sikrer: uendelig træning, ægte gentræning, snyd-resistens (naboer får ikke samme tal).

## 5.6 Worked examples (gennemregnede eksempler)

- Trin-for-trin-løsning man kan folde ud linje for linje.
- "Fade"-princippet: fra fuldt løst eksempel → delvist udfyldt → helt selv.
- Tilgængelig som hint-endestation, aldrig som det første eleven ser.

## 5.7 Hints — en stige, ikke et svar

Progressiv hint-stige pr. opgave (inspireret af Brilliant/intelligent tutoring):

```
Hint 1: Retningsgivende spørgsmål   ("Hvad skal være ens på begge sider?")
Hint 2: Relevant begreb/regel       ("Husk: gør det samme på begge sider.")
Hint 3: Næste konkrete skridt        ("Træk 3 fra på begge sider.")
Hint 4: Worked example / delløsning  (vis trinnet udført)
```

- Hints koster ikke "straf", men **logges** (bruges i mestringsestimat og lærerens overblik).
- En valgfri **AI-tutor** (senere fase) kan stille sokratiske spørgsmål ud fra elevens konkrete forkerte svar — men altid uden at aflevere facit, og med lærer-/skolekontrol og fuld data-tryghed.

## 5.8 Misforståelses-diagnose

Kernen i "feedback der lærer noget":
- Hver **distraktor** (forkert svarmulighed) og hvert typisk **fejlmønster** tagges med en **misforståelses-kode** (fx `M-BRØK-ADDERER-NÆVNERE`).
- Når eleven svarer forkert på en genkendt måde, gives **målrettet feedback** ("Du lagde nævnerne sammen — men nævneren fortæller, hvor mange dele helheden er delt i…") + link til den relevante mini-forklaring/widget.
- Fejlmønstre **aggregeres på holdet**, så læreren ser "42 % laver fortegnsfejl her" og kan tage det på klassen.

## 5.9 Mestringsniveauer

Fire synlige niveauer pr. emne/mål (knowledge component):

```
  Ny  →  Øvet  →  Sikker  →  Mester
  (0)     (1)      (2)        (3)
```

- Estimeres pr. **knowledge component (KC)** ud fra korrekthed, hints brugt, tid og seneste præstation.
- Model: **Elo-/BKT-agtig** opdatering (Bayesian Knowledge Tracing eller Elo pr. KC) — enkelt at starte med, kan forfines.
- Driver fagkortets farver, "fortsæt"-anbefalinger og hvornår noget er "godt nok" til at hvile.

## 5.10 Adaptiv repetition

- Hver mestret KC får et **repetitionsinterval** (spaced repetition, SM-2-/half-life-agtig).
- "Dagens repetition" samler det, eleven er ved at glemme, på tværs af fag i en kort daglig session.
- Forkert ved repetition → intervallet nulstilles/kortes; rigtigt → forlænges.
- Læreren kan tvinge repetition af et emne før en prøve.

## 5.11 Lærerstyret tildeling

Al automatik er **underlagt læreren**:
- Læreren kan tildele lektion/opgavesæt/forløb/repetition til hold/gruppe/elev.
- Læreren sætter differentieringsniveau pr. elev, frist, mål for mestring, og om det er i-timen eller lektie.
- Læreren kan låse/åbne dele af fagkortet, se alt, og gribe ind.
- Standardindstillinger er "elev-venlige" (ingen tidsstress, gode hints), men læreren kan skrue.

## 5.12 Pædagogisk forankring (kort)

Modellen trækker på veletablerede principper: **aktiv læring** & *desirable difficulties*, **retrieval practice** & **spaced repetition** (Ebbinghaus/Bjork), **worked-example-effekten** & **cognitive load theory** (Sweller), **formativ feedback** (Hattie/Black & Wiliam), **mastery learning** (Bloom) og **intelligent tutoring / misconception-diagnose**. Alt oversat til dansk Fælles Mål-kontekst.
