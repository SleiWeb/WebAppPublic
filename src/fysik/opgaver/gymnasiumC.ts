import type { OpgaveGenerator } from "../model";
import { ri, rv, afrund, dk, talOpgave, valgOpgave } from "./hjaelp";

// Opgavegeneratorer for Fysik C.
export const GENERATORER_FYSIK_C: OpgaveGenerator[] = [
  {
    id: "gc-praefiks",
    titel: "Præfikser",
    lav: () => {
      const q = rv([
        { fra: () => `${ri(2, 900)} mA`, til: "A", faktor: 1e-3 },
        { fra: () => `${ri(2, 90) / 10} kV`, til: "V", faktor: 1e3 },
        { fra: () => `${ri(2, 500)} kJ`, til: "J", faktor: 1e3 },
        { fra: () => `${ri(2, 90)} MW`, til: "W", faktor: 1e6 },
        { fra: () => `${ri(2, 900)} µA`, til: "mA", faktor: 1e-3 },
        { fra: () => `${ri(100, 900)} nm`, til: "µm", faktor: 1e-3 },
      ]);
      const s = q.fra();
      const tal = parseFloat(s.replace(",", "."));
      const facit = tal * q.faktor;
      return talOpgave({
        tekst: `Omregn ${s.replace(".", ",")} til ${q.til}.`,
        enhed: q.til,
        facit,
        hint: "G = 10⁹, M = 10⁶, k = 10³, m = 10⁻³, µ = 10⁻⁶, n = 10⁻⁹.",
        loesning: `${s} = ${dk(tal)} · ${q.faktor >= 1 ? q.faktor : dk(q.faktor)} ${q.til} = ${dk(facit)} ${q.til}.`,
      });
    },
  },
  {
    id: "gc-betydende-mcq",
    titel: "Betydende cifre",
    lav: () => {
      const q = rv([
        { tal: "2,50", n: "3" },
        { tal: "0,025", n: "2" },
        { tal: "1,080", n: "4" },
        { tal: "300,0", n: "4" },
        { tal: "0,0072", n: "2" },
        { tal: "9,82", n: "3" },
      ]);
      const muligheder = ["1", "2", "3", "4", "5"].filter((x) => x !== q.n);
      return valgOpgave({
        tekst: `Hvor mange betydende cifre har tallet ${q.tal}?`,
        korrekt: q.n,
        forkerte: [muligheder[0], muligheder[1], muligheder[2]],
        hint: "Foranstillede nuller tæller ikke; efterstillede decimal-nuller tæller.",
        loesning: `${q.tal} har ${q.n} betydende cifre. Nuller foran første ciffer tæller ikke — nuller efter decimalerne tæller.`,
      });
    },
  },
  {
    id: "gc-effekt",
    titel: "Effekt og energi",
    lav: () => {
      const P = rv([40, 100, 700, 1200, 2000]);
      const t = rv([30, 60, 90, 120, 300]);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `Et apparat med effekten ${P} W er tændt i ${t} s. Hvor meget energi omsætter det?`,
          enhed: "J",
          facit: P * t,
          hint: "E = P · t.",
          loesning: `E = ${P} W · ${t} s = ${P * t} J.`,
        });
      return talOpgave({
        tekst: `Et apparat omsætter ${P * t} J på ${t} s. Beregn effekten.`,
        enhed: "W",
        facit: P,
        hint: "P = E / t.",
        loesning: `P = ${P * t} J / ${t} s = ${P} W.`,
      });
    },
  },
  {
    id: "gc-nyttevirkning",
    titel: "Nyttevirkning",
    lav: () => {
      const tilf = rv([500, 800, 1000, 2000, 5000]);
      const eta = rv([0.05, 0.25, 0.35, 0.4, 0.9]);
      const nyttig = afrund(tilf * eta, 0);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `En maskine tilføres ${tilf} J og leverer ${nyttig} J nyttig energi. Beregn nyttevirkningen som decimaltal.`,
          enhed: "",
          facit: eta,
          hint: "η = E_nyttig / E_tilført.",
          loesning: `η = ${nyttig} / ${tilf} = ${dk(eta, 2)} (dvs. ${dk(eta * 100)} %).`,
        });
      return talOpgave({
        tekst: `En motor med nyttevirkningen ${dk(eta, 2)} tilføres ${tilf} J. Hvor meget energi går tabt som varme?`,
        enhed: "J",
        facit: tilf - nyttig,
        hint: "Tab = E_tilført − η · E_tilført.",
        loesning: `Nyttig: ${dk(eta, 2)} · ${tilf} J = ${nyttig} J. Tab: ${tilf} − ${nyttig} = ${tilf - nyttig} J.`,
      });
    },
  },
  {
    id: "gc-varmekapacitet",
    titel: "Q = m · c · ΔT",
    lav: () => {
      const stof = rv([
        { navn: "vand", c: 4180 },
        { navn: "aluminium", c: 900 },
        { navn: "jern", c: 450 },
        { navn: "olie", c: 2000 },
      ]);
      const m = rv([0.2, 0.5, 1, 2]);
      const dT = ri(10, 80);
      const Q = afrund(m * stof.c * dT, 0);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `${dk(m)} kg ${stof.navn} (c = ${stof.c} J/(kg·°C)) opvarmes ${dT} °C. Hvor meget energi kræver det?`,
          enhed: "J",
          facit: Q,
          tolerancePct: 2,
          hint: "Q = m · c · ΔT.",
          loesning: `Q = ${dk(m)} · ${stof.c} · ${dT} = ${dk(Q)} J ≈ ${dk(afrund(Q / 1000, 1))} kJ.`,
        });
      return talOpgave({
        tekst: `Der tilføres ${dk(Q)} J til ${dk(m)} kg ${stof.navn} (c = ${stof.c} J/(kg·°C)). Hvor meget stiger temperaturen?`,
        enhed: "°C",
        facit: dT,
        tolerancePct: 2,
        hint: "ΔT = Q / (m · c).",
        loesning: `ΔT = ${dk(Q)} / (${dk(m)} · ${stof.c}) = ${dT} °C.`,
      });
    },
  },
  {
    id: "gc-smeltevarme",
    titel: "Smeltevarme",
    lav: () => {
      const m = rv([0.05, 0.1, 0.25, 0.5, 1, 2]);
      const facit = afrund(m * 334, 1);
      return talOpgave({
        tekst: `Hvor meget energi kræver det at smelte ${dk(m)} kg is ved 0 °C? (Specifik smeltevarme: 334 kJ/kg)`,
        enhed: "kJ",
        facit,
        tolerancePct: 2,
        hint: "Q = m · Lf.",
        loesning: `Q = ${dk(m)} kg · 334 kJ/kg = ${dk(facit, 1)} kJ.`,
      });
    },
  },
  {
    id: "gc-fordampning",
    titel: "Fordampningsvarme",
    lav: () => {
      const m = rv([0.05, 0.1, 0.2, 0.5, 1]);
      const facit = afrund(m * 2260, 0);
      return talOpgave({
        tekst: `Hvor meget energi kræver det at fordampe ${dk(m)} kg vand ved 100 °C? (Specifik fordampningsvarme: 2260 kJ/kg)`,
        enhed: "kJ",
        facit,
        tolerancePct: 2,
        hint: "Q = m · Lv.",
        loesning: `Q = ${dk(m)} kg · 2260 kJ/kg = ${dk(facit)} kJ. Bemærk: fordampning kræver ca. 7 gange mere energi end smeltning.`,
      });
    },
  },
  {
    id: "gc-ladning",
    titel: "Strøm og ladning",
    lav: () => {
      const I = rv([0.2, 0.5, 1, 1.5, 2, 4]);
      const t = rv([10, 30, 60, 120, 300]);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `Der løber en strøm på ${dk(I)} A i ${t} s. Hvor stor en ladning passerer?`,
          enhed: "C",
          facit: afrund(I * t, 1),
          hint: "q = I · t.",
          loesning: `q = ${dk(I)} A · ${t} s = ${dk(afrund(I * t, 1))} C.`,
        });
      return talOpgave({
        tekst: `En ladning på ${dk(afrund(I * t, 1))} C passerer på ${t} s. Beregn strømstyrken.`,
        enhed: "A",
        facit: I,
        hint: "I = q / t.",
        loesning: `I = ${dk(afrund(I * t, 1))} C / ${t} s = ${dk(I)} A.`,
      });
    },
  },
  {
    id: "gc-parallel",
    titel: "Parallelkobling",
    lav: () => {
      const par = rv([
        { R1: 100, R2: 100 },
        { R1: 60, R2: 30 },
        { R1: 40, R2: 40 },
        { R1: 20, R2: 60 },
        { R1: 200, R2: 200 },
        { R1: 12, R2: 24 },
      ]);
      const facit = afrund((par.R1 * par.R2) / (par.R1 + par.R2), 1);
      return talOpgave({
        tekst: `To modstande på ${par.R1} Ω og ${par.R2} Ω kobles parallelt. Beregn erstatningsresistansen.`,
        enhed: "Ω",
        facit,
        tolerancePct: 2,
        hint: "1/R = 1/R1 + 1/R2 — eller R = R1·R2/(R1+R2).",
        loesning: `R = ${par.R1}·${par.R2}/(${par.R1}+${par.R2}) = ${dk(facit, 1)} Ω. Bemærk: mindre end den mindste af de to.`,
      });
    },
  },
  {
    id: "gc-elenergi",
    titel: "Elektrisk energi",
    lav: () => {
      const U = rv([6, 12, 230]);
      const I = rv([0.5, 1, 2]);
      const t = rv([60, 120, 600]);
      return talOpgave({
        tekst: `En komponent ligger over ${U} V og gennemløbes af ${dk(I)} A i ${t} s. Hvor meget energi omsættes?`,
        enhed: "J",
        facit: U * I * t,
        hint: "E = U · I · t.",
        loesning: `E = ${U} V · ${dk(I)} A · ${t} s = ${U * I * t} J.`,
      });
    },
  },
  {
    id: "gc-lysboelge",
    titel: "Lysets bølgelængde og frekvens",
    lav: () => {
      if (ri(0, 1) === 0) {
        const fE14 = rv([4.3, 5.0, 6.0, 6.5, 7.5]); // ·10^14 Hz
        const facit = afrund((3e8 / (fE14 * 1e14)) * 1e9, 0);
        return talOpgave({
          tekst: `Lys har frekvensen ${dk(fE14)} · 10¹⁴ Hz. Beregn bølgelængden i nanometer. (c = 3,00 · 10⁸ m/s)`,
          enhed: "nm",
          facit,
          tolerancePct: 2,
          hint: "λ = c / f. Husk at omregne til nm (1 nm = 10⁻⁹ m).",
          loesning: `λ = 3,00·10⁸ / (${dk(fE14)}·10¹⁴) m ≈ ${facit}·10⁻⁹ m = ${facit} nm.`,
        });
      }
      const lam = rv([400, 500, 600, 633, 700]);
      const facit = afrund(3e8 / (lam * 1e-9) / 1e14, 2);
      return talOpgave({
        tekst: `Lys har bølgelængden ${lam} nm. Beregn frekvensen i enheden 10¹⁴ Hz. (c = 3,00 · 10⁸ m/s)`,
        enhed: "· 10¹⁴ Hz",
        facit,
        tolerancePct: 2,
        hint: "f = c / λ. Svar med tallet foran 10¹⁴.",
        loesning: `f = 3,00·10⁸ / ${lam}·10⁻⁹ ≈ ${dk(facit, 2)}·10¹⁴ Hz.`,
      });
    },
  },
  {
    id: "gc-foton",
    titel: "Fotonenergi",
    lav: () => {
      const lam = rv([310, 400, 496, 550, 620, 700]);
      const facit = afrund(1240 / lam, 2);
      return talOpgave({
        tekst: `Beregn energien af en foton med bølgelængden ${lam} nm. Angiv svaret i elektronvolt.`,
        enhed: "eV",
        facit,
        tolerancePct: 2,
        hint: "E [eV] = 1240 / λ [nm].",
        loesning: `E = 1240 / ${lam} ≈ ${dk(facit, 2)} eV.`,
      });
    },
  },
  {
    id: "gc-spektrum-mcq",
    titel: "Spektre og atommodel",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvorfor udsender hvert grundstof sit helt eget linjespektrum?",
            korrekt: "Elektronerne kan kun springe mellem grundstoffets bestemte energiniveauer",
            forkerte: [
              "Atomerne har forskellig temperatur",
              "Store atomer lyser rødt, små lyser blåt",
              "Elektronerne kan have alle mulige energier",
            ],
            hint: "Bohr: kun bestemte baner er tilladt.",
            loesning:
              "Hvert grundstof har sit eget sæt energiniveauer — og dermed sine egne fotonenergier og spektrallinjer.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvilken foton har størst energi?",
            korrekt: "En violet foton (400 nm)",
            forkerte: ["En rød foton (700 nm)", "En grøn foton (550 nm)", "De har alle samme energi"],
            hint: "E = h·f — høj frekvens (kort bølgelængde) betyder høj energi.",
            loesning:
              "Violet lys har kortest bølgelængde og højest frekvens, så E = h·f er størst: 1240/400 ≈ 3,1 eV.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvordan opstår de mørke linjer i Solens spektrum (Fraunhofer-linjerne)?",
            korrekt: "Gasser i solatmosfæren absorberer fotoner ved bestemte bølgelængder",
            forkerte: [
              "Solpletter blokerer for lyset",
              "Jordens atmosfære fjerner alt blåt lys",
              "Solen udsender ikke alle farver",
            ],
            hint: "Absorption — det omvendte af emission.",
            loesning:
              "Atomerne i solatmosfæren 'spiser' netop de fotoner, der matcher deres energispring — de bølgelængder mangler i spektret.",
          }),
        () =>
          valgOpgave({
            tekst: "Sortér efter stigende energi (og frekvens):",
            korrekt: "Radiobølger → synligt lys → røntgenstråling",
            forkerte: [
              "Røntgenstråling → synligt lys → radiobølger",
              "Synligt lys → radiobølger → røntgenstråling",
              "Radiobølger → røntgenstråling → synligt lys",
            ],
            hint: "Jo kortere bølgelængde, jo højere energi.",
            loesning:
              "Det elektromagnetiske spektrum efter stigende energi: radio → mikro → infrarød → synlig → UV → røntgen → gamma.",
          }),
      ])(),
  },
  {
    id: "gc-henfald",
    titel: "Henfaldsloven",
    lav: () => {
      const A0 = rv([1200, 2000, 4800, 8000]);
      const T = rv([6, 8, 12, 24]);
      const n = ri(1, 3);
      const facit = A0 / Math.pow(2, n);
      return talOpgave({
        tekst: `En kildes aktivitet er ${A0} Bq, og halveringstiden er ${T} timer. Beregn aktiviteten efter ${n * T} timer.`,
        enhed: "Bq",
        facit,
        hint: `Hvor mange halveringstider er ${n * T} timer?`,
        loesning: `${n * T} timer = ${n} halveringstider. A = ${A0} · (½)^${n} = ${dk(facit)} Bq.`,
      });
    },
  },
  {
    id: "gc-dosis",
    titel: "Stråledosis",
    lav: () => {
      const m = rv([0.5, 1, 2, 5, 70]);
      const EmJ = rv([2, 5, 10, 35, 140]);
      const facit = afrund(EmJ / 1000 / m, 4);
      return talOpgave({
        tekst: `Et væv med massen ${dk(m)} kg absorberer ${EmJ} mJ strålingsenergi. Beregn den absorberede dosis.`,
        enhed: "Gy",
        facit,
        tolerancePct: 2,
        hint: "D = E / m. Husk 1 mJ = 0,001 J.",
        loesning: `D = ${dk(EmJ / 1000, 3)} J / ${dk(m)} kg = ${dk(facit, 4)} Gy.`,
      });
    },
  },
  {
    id: "gc-astro-mcq",
    titel: "Verdensbilleder",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvad var Tycho Brahes vigtigste bidrag til astronomien?",
            korrekt: "Årtiers ekstremt præcise målinger af stjerner og planeter",
            forkerte: [
              "Han opfandt kikkerten",
              "Han beviste at Jorden er flad",
              "Han opdagede tyngdeloven",
            ],
            hint: "Han arbejdede på Hven — før kikkerten var opfundet.",
            loesning:
              "Tycho Brahes målinger var verdens bedste, og Kepler brugte dem til at udlede ellipsebanerne.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad viste Kepler om planeternes baner?",
            korrekt: "De er ellipser med Solen i det ene brændpunkt",
            forkerte: [
              "De er perfekte cirkler om Jorden",
              "De er spiraler ind mod Solen",
              "De er tilfældige",
            ],
            hint: "Farvel til de perfekte cirkler.",
            loesning:
              "Keplers 1. lov: planetbaner er ellipser med Solen i det ene brændpunkt.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad betyder det, at en galakses lys er rødforskudt?",
            korrekt: "Galaksen bevæger sig væk fra os, og bølgelængderne er strakt",
            forkerte: [
              "Galaksen består mest af røde stjerner",
              "Galaksen nærmer sig os",
              "Lyset er blevet ældre og har skiftet farve",
            ],
            hint: "Sammenlign med en ambulancesirene, der forsvinder bort.",
            loesning:
              "Udvidelsen strækker lysets bølgelængder mod rødt — jo fjernere galakse, jo større rødforskydning (Hubble).",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad er en exoplanet?",
            korrekt: "En planet i kredsløb om en anden stjerne end Solen",
            forkerte: [
              "En planet uden for Mælkevejen",
              "En planet der er stødt ud af sin bane",
              "En måne om en gasplanet",
            ],
            hint: "Exo = udenfor (vores solsystem).",
            loesning:
              "Exoplaneter kredser om andre stjerner. Der er fundet flere tusinde siden 1995 — bl.a. med transitmetoden.",
          }),
      ])(),
  },
];
