# 09 — Forretningsmodel, roadmap, økonomi og risici

## 9.1 Forretningsmodel

**Hybrid: product-led B2C-freemium som tragt + B2B/B2G-licenser som omsætning.**

| Spor | Hvem betaler | Model |
|------|--------------|-------|
| **Gratis for læreren** | Ingen | En lærer kan oprette hold, tildele og bruge kernen gratis (drivkraft for udbredelse) |
| **Skolelicens** | Skolen/PLC | Pr. elev/år eller fast skolepris; alle fem fag |
| **Kommunelicens** | Kommunen | Rammeaftale, mængderabat, central fakturering |
| **B2C Premium** | Forældre/elev | Abonnement til hjemmetræning (som Brilliant, men dansk + Fælles Mål) |
| **Gymnasium** | Skolen/institutionen | Institutionslicens |

**Prisstrategi (indikativ, skal valideres):** dansk skolelæremiddel prissættes typisk som lav-til-mellem trecifret kr./elev/år pr. fagportal. Prisme sælger *fem fag samlet* → attraktiv pakkepris vs. fem enkeltprodukter. B2C ~lav trecifret kr./md. Konkret prissætning kræver salgsinterviews med skoleledere/kommuner.

**Hvorfor "land via læreren":** Den danske indkøbsvej går ofte *nedefra* (faglærer → fagudvalg → PLC/leder → kommune). Gør det ubesværet for én lærer at få værdi gratis; bevisbyrden (tilfredshed, tidsbesparelse, fremgang) driver derefter skole-/kommunesalget.

## 9.2 Go-to-market

1. **Beachhead:** **matematik, 7.–9. klasse** (størst smerte, tydeligst værdi, konkurrerer direkte mod MatematikFessor på interaktivitet + samme lærerværktøjer).
2. **Distributionskanaler:** faglige lærernetværk (matematik-/naturfagsvejledere), Folkeskolen.dk, EMU/Materialeplatformen, konferencer (Danmarks Læringsfestival), LinkedIn, og forfatterens eget lærernetværk.
3. **Pilotprogram:** 3–5 skoler gratis i ét skoleår mod feedback + effektmåling + reference/citater.
4. **Bevis:** dokumentér tidsbesparelse (retning) og elevfremgang (mastery) → sælg til pilotens kommune → nabokommuner.
5. **Ekspansion:** naturfagene (fysik/kemi, biologi, geografi) + tværfaglige naturfagsprøve-forløb → gymnasiet → B2C-forældrespor.

## 9.3 Roadmap (faser)

| Fase | Tidsramme* | Indhold | Mål |
|------|-----------|---------|-----|
| **0 — Prototype** | Md. 0–2 | Klikbar forside + 1 lektion (læringssløjfen) i matematik; widget-runtime + numeric/expression-validator | Vis "aha"; test på 1 klasse |
| **1 — MVP** | Md. 2–6 | Matematik 7.–9.: ~4–6 moduler, opgavemotor, auto-retning, hints, elev-dashboard, **lærer-tildeling + live-overblik**, Unilogin-login | 3–5 pilotskoler i drift |
| **2 — Skoleklar** | Md. 6–12 | Fælles Mål-dækning, differentiering pr. elev, mastery + adaptiv repetition, MitID/lokal IdP, DPA + DPIA, admin/roster-synk | Første betalte skole-/kommuneaftaler |
| **3 — Naturfag** | Md. 12–20 | Fysik/kemi + biologi + geografi; simuleringsbibliotek; tværfaglige naturfagsprøve-forløb | Fem fag; "ét sted for naturfag" |
| **4 — Skala & gymnasium** | Md. 20–30+ | Gymnasieindhold, autor-UI for faglærere, evt. AI-tutor (sokratisk, data-trygt), B2C-spor, dybere analytics | Markedsleder-position i nichen |

*Vejledende for et lille, fokuseret team.

## 9.4 MVP-afgrænsning (hvad der IKKE er med i første version)

Med for at bevise kernen — *ude* for at nå i mål: alle fem fag på én gang, gymnasiet, AI-tutor, autor-UI, B2C-betaling, mobil-app (PWA rækker), avanceret analytics. Byg **dybde i ét fag før bredde**.

## 9.5 Indholdsproduktion (den reelle flaskehals)

Den største omkostning er ikke kode — det er **højkvalitets, Fælles Mål-forankret, interaktivt indhold**.

- **Motor før mængde:** når widget-runtime + skabelon/validator-format står, kan faglærere producere opgaver som data (§08).
- **Forfatterhold:** faglærere pr. fag (deltid), didaktisk redaktør, kvalitets-review i CI (self-test af hver skabelon).
- **Prioritér:** de emner hvor (a) prøverne vægter, og (b) interaktivitet giver størst "aha" (funktioner/grafer, brøker, kræfter, reaktioner, økosystemer, klima).
- **Genbrug** af widget-typer på tværs af fag holder marginalomkostningen pr. nyt emne lav.

## 9.6 Team & kompetencer

Minimalt startteam: **1 fuldstack-udvikler**, **1 faglig/didaktisk stifter** (dig — læreren), **freelance faglærere** som forfattere, adgang til **DPO/jurist** for DPA/DPIA og **UX-designer** (deltid). Skalér forfattere pr. fag i takt med roadmap.

## 9.7 Nøgletal (KPI'er)

- **Læring:** mestringsfremgang pr. KC; andel der når "Sikker/Mester"; prøveparathed.
- **Lærer:** sparet retningstid; aktive tildelinger/uge; fastholdelse af lærere.
- **Produkt:** ugentligt aktive elever, sessionslængde, gennemførte lektioner, hint→løsning-rate.
- **Forretning:** pilot→betalt-konvertering, skoler/kommuner, ARPU, churn, CAC vs. LTV.
- **Data/tillid:** 0 databrud; DPA-dækning; audit-log-fuldstændighed.

## 9.8 Risici og modtræk

| Risiko | Alvor | Modtræk |
|--------|-------|---------|
| **Alinea/Egmont-dominans & bundling** | Høj | Fokusér på det de er svage til (interaktivitet, samlede naturfag, data-tryghed); vind lærernes hjerter nedefra; vær hurtig og moderne |
| **Indholdsproduktion er dyr/langsom** | Høj | Motor-før-mængde; data-drevet forfatterformat; smal beachhead; genbrug widgets |
| **Lang skole-/kommunesalgscyklus** | Middel | Product-led gratis-for-lærer; piloter med effektbevis; kommune-referencer |
| **GDPR/Chromebook-lignende krav** | Middel | EU-hosting, DPA/DPIA klar fra start, ingen børneprofilering — gør det til salgsargument |
| **Unilogin/STIL-integration er kompleks** | Middel | Prioritér SSO tidligt; brug STIL-broker; egne konti som fallback i pilot |
| **Auto-retning fejler på åbne svar** | Middel | Start med typede validatorer + CAS; hold fri-tekst minimal; AI-rubric først når data-trygt |
| **Solo-/lille team, bredt scope** | Middel | Streng MVP-afgrænsning; ét fag i dybden; køb DPO/UX som freelance |
| **Motivationsmekanik opfattes som "spil"** | Lav | Afdæmpet, mestringsbaseret; lærer-/forældrekontrol; ingen tvungen rangliste |

## 9.9 Hvorfor dette kan blive markedsledende

1. **Det tomme felt findes:** ingen dansk aktør leverer Brilliants interaktivitet *og* MatematikFessors lærerværktøjer *samlet for alle naturfag*.
2. **Timing:** konsolidering (Alinea) skaber innovationsvakuum og leverandør-utilfredshed; Chromebook-sagen har gjort data-tryghed til et aktivt købskriterium.
3. **Naturfagsprøven binder fagene sammen** — vores "fem fag, ét sted, tværfaglige forløb" matcher en reel prøve- og undervisningsvirkelighed.
4. **Insider-fordel:** stifteren er dansk lærer → autentisk indsigt i workflow, netværk til beachhead, troværdighed i salget.
5. **Teknisk løftestang:** én motor, content-as-data → hvert nyt fag/emne er billigere end for konkurrenter med tekst-tunge portaler.

## 9.10 Umiddelbare næste skridt

1. **Varemærke-/domænetjek** af navnet (Prisme/alternativ) — *før* branding.
2. **10 salgsinterviews** med matematik-/naturfagslærere + 3 skoleledere/kommunale indkøbere → validér smerte, workflow og pris.
3. **Byg fase 0-prototypen:** klikbar forside + én matematiklektion der demonstrerer hele læringssløjfen med ægte auto-retning.
4. **Test prototypen** i én klasse; mål "aha" og lærerens tildelingsflow.
5. **Rekrutter 1–2 pilotskoler** til fase 1.
6. **Afklar GDPR-setup** (EU-hosting-valg, DPA-udkast, DPIA-skabelon) tidligt.

---

*Dette dokument er en plan, ikke et løfte om tal. Alle prisantagelser og tidsrammer skal valideres med rigtige skoler, lærere og kommuner, før de bruges til budgettering.*
