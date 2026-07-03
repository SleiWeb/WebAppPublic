import type { OpgaveGenerator } from "../model";
import { ri, rv, afrund, dk, talOpgave, valgOpgave } from "./hjaelp";

// Opgavegeneratorer for 7.–9. klasse.
export const GENERATORER_GRUNDSKOLE: OpgaveGenerator[] = [
  // ---------- 7. klasse ----------
  {
    id: "g7-enhedsomregning",
    titel: "Enhedsomregning",
    lav: () => {
      const type = ri(1, 4);
      if (type === 1) {
        const km = ri(2, 90) / 10;
        return talOpgave({
          tekst: `Omregn ${dk(km, 1)} km til meter.`,
          enhed: "m",
          facit: km * 1000,
          hint: "1 km = 1000 m — gang med 1000.",
          loesning: `${dk(km, 1)} km · 1000 = ${dk(km * 1000)} m.`,
        });
      }
      if (type === 2) {
        const g = ri(1, 40) * 50;
        return talOpgave({
          tekst: `Omregn ${g} g til kilogram.`,
          enhed: "kg",
          facit: g / 1000,
          hint: "1 kg = 1000 g — dividér med 1000.",
          loesning: `${g} g : 1000 = ${dk(g / 1000)} kg.`,
        });
      }
      if (type === 3) {
        const cm = ri(15, 350);
        return talOpgave({
          tekst: `Omregn ${cm} cm til meter.`,
          enhed: "m",
          facit: cm / 100,
          hint: "1 m = 100 cm — dividér med 100.",
          loesning: `${cm} cm : 100 = ${dk(cm / 100)} m.`,
        });
      }
      const min = ri(2, 30);
      return talOpgave({
        tekst: `Omregn ${min} minutter til sekunder.`,
        enhed: "s",
        facit: min * 60,
        hint: "1 minut = 60 sekunder.",
        loesning: `${min} min · 60 = ${min * 60} s.`,
      });
    },
  },
  {
    id: "g7-metode-mcq",
    titel: "Fysikkens metode",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst:
              "Du vil undersøge, om temperaturen påvirker hvor hurtigt sukker opløses i vand. Hvad skal du gøre for at forsøget er 'fair'?",
            korrekt: "Kun ændre vandets temperatur og holde alt andet ens",
            forkerte: [
              "Bruge forskellige mængder sukker hver gang",
              "Ændre både temperatur og omrøring samtidig",
              "Kun lave forsøget én gang",
            ],
            hint: "I en fair test ændrer man kun én variabel ad gangen.",
            loesning:
              "En fair test ændrer kun én variabel (temperaturen) og holder alle andre (sukkermængde, vandmængde, omrøring) konstante.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad kaldes et kvalificeret gæt, som man tester med et forsøg?",
            korrekt: "En hypotese",
            forkerte: ["En konklusion", "En teori", "En måling"],
            hint: "Det kommer før forsøget.",
            loesning:
              "Rækkefølgen i den naturvidenskabelige metode: hypotese → forsøg → måling → konklusion.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor gentager fysikere deres målinger flere gange?",
            korrekt: "For at mindske tilfældige målefejl ved at tage gennemsnit",
            forkerte: [
              "Fordi instrumenterne skal varmes op",
              "For at resultatet bliver større",
              "Det er kun nødvendigt, hvis man måler forkert",
            ],
            hint: "Én måling kan ramme skævt — mange målinger rammer i gennemsnit rigtigt.",
            loesning:
              "Gentagne målinger + gennemsnit udjævner tilfældige udsving og giver et mere pålideligt resultat.",
          }),
      ])(),
  },
  {
    id: "g7-densitet",
    titel: "Densitet",
    lav: () => {
      const V = ri(2, 40) * 10;
      const rhoX10 = ri(3, 25); // densitet 0,3–2,5 g/cm³
      const m = afrund((rhoX10 / 10) * V, 0);
      const facit = afrund(m / V, 2);
      return talOpgave({
        tekst: `En klods vejer ${m} g og har rumfanget ${V} cm³. Beregn klodsens densitet.`,
        enhed: "g/cm³",
        facit,
        hint: "Densitet = masse divideret med rumfang: ρ = m/V.",
        loesning: `ρ = m/V = ${m} g / ${V} cm³ = ${dk(facit, 2)} g/cm³.`,
      });
    },
  },
  {
    id: "g7-flyder-mcq",
    titel: "Flyder eller synker?",
    lav: () => {
      const rho = rv([0.3, 0.6, 0.8, 0.92, 1.2, 2.7, 7.9, 11.3]);
      const flyder = rho < 1.0;
      return valgOpgave({
        tekst: `En genstand har densiteten ${dk(rho, rho < 1 ? 2 : 1)} g/cm³. Flyder eller synker den i vand (densitet 1,0 g/cm³)?`,
        korrekt: flyder ? "Den flyder" : "Den synker",
        forkerte: [flyder ? "Den synker" : "Den flyder", "Det afhænger af genstandens størrelse"],
        hint: "Sammenlign med vands densitet på 1,0 g/cm³. Størrelsen er ligegyldig — kun densiteten tæller.",
        loesning: `${dk(rho, 2)} g/cm³ er ${flyder ? "mindre" : "større"} end 1,0 g/cm³, så genstanden ${flyder ? "flyder" : "synker"}.`,
      });
    },
  },
  {
    id: "g7-tilstandsform-mcq",
    titel: "Faseovergange",
    lav: () => {
      const q = rv([
        { fra: "fast stof", til: "væske", navn: "Smeltning", forkerte: ["Fordampning", "Fortætning", "Størkning"] },
        { fra: "væske", til: "gas", navn: "Fordampning", forkerte: ["Smeltning", "Fortætning", "Størkning"] },
        { fra: "gas", til: "væske", navn: "Fortætning", forkerte: ["Fordampning", "Smeltning", "Størkning"] },
        { fra: "væske", til: "fast stof", navn: "Størkning", forkerte: ["Smeltning", "Fortætning", "Fordampning"] },
      ]);
      return valgOpgave({
        tekst: `Hvad kaldes overgangen fra ${q.fra} til ${q.til}?`,
        korrekt: q.navn,
        forkerte: q.forkerte,
        hint: "Tænk på is → vand → damp og den modsatte vej.",
        loesning: `Overgangen fra ${q.fra} til ${q.til} kaldes ${q.navn.toLowerCase()}.`,
      });
    },
  },
  {
    id: "g7-kelvin",
    titel: "Celsius og kelvin",
    lav: () => {
      if (ri(0, 1) === 0) {
        const t = rv([0, 20, 25, 37, 50, 100, -10, -40]);
        return talOpgave({
          tekst: `Omregn ${dk(t)} °C til kelvin.`,
          enhed: "K",
          facit: t + 273,
          hint: "Læg 273 til celsius-temperaturen.",
          loesning: `T = ${dk(t)} + 273 = ${t + 273} K.`,
        });
      }
      const T = rv([273, 293, 300, 310, 373, 250]);
      return talOpgave({
        tekst: `Omregn ${T} K til grader celsius.`,
        enhed: "°C",
        facit: T - 273,
        hint: "Træk 273 fra kelvin-temperaturen.",
        loesning: `t = ${T} − 273 = ${T - 273} °C.`,
      });
    },
  },
  {
    id: "g7-varme-mcq",
    titel: "Temperatur og varme",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvad sker der med et metalstykke, når det opvarmes?",
            korrekt: "Det udvider sig, fordi partiklerne vibrerer kraftigere",
            forkerte: [
              "Det trækker sig sammen, fordi partiklerne smelter",
              "Det ændrer sig ikke — kun væsker udvider sig",
              "Partiklerne bliver større",
            ],
            hint: "Tænk på broers udvidelsesfuger.",
            loesning:
              "Opvarmning får partiklerne til at vibrere kraftigere, så de skubber hinanden længere væk — stoffet udvider sig.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad er det absolutte nulpunkt?",
            korrekt: "−273 °C, hvor partiklerne (næsten) står stille",
            forkerte: [
              "0 °C, hvor vand fryser",
              "−100 °C, hvor al luft bliver flydende",
              "Temperaturen i rummet",
            ],
            hint: "Det er nulpunktet på kelvinskalaen.",
            loesning:
              "Ved −273 °C (0 K) er partiklernes bevægelse minimal — koldere kan det ikke blive.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor flyder is oven på vand?",
            korrekt: "Is har lavere densitet end vand, fordi vand udvider sig når det fryser",
            forkerte: [
              "Is er koldere end vand",
              "Is er hårdere end vand",
              "Vandet skubber isen op, fordi det er varmest i bunden",
            ],
            hint: "Hvad sker der med rumfanget, når vand fryser?",
            loesning:
              "Vand udvider sig ved frysning, så is fylder mere pr. kg — densiteten bliver lavere end vands, og isen flyder.",
          }),
      ])(),
  },
  {
    id: "g7-magnet-mcq",
    titel: "Magnetpoler",
    lav: () => {
      const par = rv([
        { a: "en nordpol", b: "en nordpol", res: "De frastøder hinanden" },
        { a: "en sydpol", b: "en sydpol", res: "De frastøder hinanden" },
        { a: "en nordpol", b: "en sydpol", res: "De tiltrækker hinanden" },
      ]);
      const forkerte =
        par.res === "De tiltrækker hinanden"
          ? ["De frastøder hinanden", "Der sker ingenting", "De mister deres magnetisme"]
          : ["De tiltrækker hinanden", "Der sker ingenting", "De mister deres magnetisme"];
      return valgOpgave({
        tekst: `Du holder ${par.a} mod ${par.b}. Hvad sker der?`,
        korrekt: par.res,
        forkerte,
        hint: "Ens poler frastøder, modsatte poler tiltrækker.",
        loesning: `${par.a === par.b ? "Ens" : "Modsatte"} poler ${par.res.toLowerCase().replace("de ", "")} hinanden: ${par.res.toLowerCase()}.`,
      });
    },
  },
  {
    id: "g7-elektromagnet-mcq",
    titel: "Elektromagneter",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvordan kan man gøre en elektromagnet stærkere?",
            korrekt: "Flere vindinger på spolen eller større strømstyrke",
            forkerte: ["Bruge tyndere ledning uden flere vindinger", "Fjerne jernkernen", "Slukke for strømmen"],
            hint: "Styrken afhænger af vindingstal, strømstyrke og jernkerne.",
            loesning:
              "Elektromagnetens styrke øges med flere vindinger, større strømstyrke og en jernkerne i spolen.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad er fordelen ved en elektromagnet frem for en almindelig magnet?",
            korrekt: "Den kan tændes og slukkes med strømmen",
            forkerte: ["Den virker uden energi", "Den har kun én pol", "Den er altid stærkere"],
            hint: "Tænk på kranen på skrotpladsen.",
            loesning:
              "En elektromagnet er kun magnetisk, når der løber strøm — den kan derfor tændes og slukkes.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvilke materialer tiltrækkes af en magnet?",
            korrekt: "Jern, nikkel og kobolt",
            forkerte: ["Alle metaller", "Kobber og aluminium", "Plast og glas"],
            hint: "De fleste metaller tiltrækkes faktisk ikke.",
            loesning: "Kun de magnetiske materialer jern, nikkel og kobolt tiltrækkes af magneter.",
          }),
      ])(),
  },
  {
    id: "g7-leder-mcq",
    titel: "Ledere og isolatorer",
    lav: () => {
      const led = ri(0, 1) === 0;
      const materiale = led ? rv(["kobber", "jern", "aluminium", "sølv"]) : rv(["plast", "gummi", "glas", "træ (tørt)"]);
      return valgOpgave({
        tekst: `Er ${materiale} en leder eller en isolator?`,
        korrekt: led ? "Leder" : "Isolator",
        forkerte: [led ? "Isolator" : "Leder", "Hverken eller"],
        hint: "Alle metaller leder strøm.",
        loesning: `${materiale.charAt(0).toUpperCase() + materiale.slice(1)} er en ${led ? "leder — metaller leder strøm" : "isolator — den leder ikke strøm"}.`,
      });
    },
  },
  {
    id: "g7-kredsloeb-mcq",
    titel: "Kredsløb",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "I en serieforbindelse med tre pærer springer den ene. Hvad sker der?",
            korrekt: "Alle tre pærer slukker",
            forkerte: ["De to andre lyser videre", "De to andre lyser kraftigere", "Kun den sprungne slukker"],
            hint: "I serie er der kun én vej for strømmen.",
            loesning:
              "I en serieforbindelse brydes hele kredsløbet, når én pære springer — så alle slukker.",
          }),
        () =>
          valgOpgave({
            tekst: "I en parallelforbindelse med tre pærer springer den ene. Hvad sker der?",
            korrekt: "De to andre lyser videre",
            forkerte: ["Alle tre slukker", "De to andre slukker efter lidt tid", "Batteriet kortsluttes"],
            hint: "I parallel har hver pære sin egen gren.",
            loesning:
              "Hver gren i en parallelforbindelse er sit eget lukkede kredsløb — de andre pærer påvirkes ikke.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad kræves der, for at der løber strøm i et kredsløb?",
            korrekt: "En spændingskilde og et lukket kredsløb",
            forkerte: ["Kun en pære", "Et åbent kredsløb", "En isolator mellem batteriets poler"],
            hint: "Strømmen skal kunne løbe hele vejen rundt.",
            loesning:
              "Strøm kræver en spændingskilde (fx et batteri) og en ubrudt, lukket vej rundt i kredsløbet.",
          }),
      ])(),
  },
  {
    id: "g7-lydfart",
    titel: "Lydens fart",
    lav: () => {
      if (ri(0, 1) === 0) {
        const t = ri(2, 9);
        const facit = 343 * t;
        return talOpgave({
          tekst: `Du ser et lyn og hører tordenen ${t} sekunder senere. Hvor langt væk slog lynet ned? (Lydens fart: 343 m/s)`,
          enhed: "m",
          facit,
          tolerancePct: 3,
          hint: "Afstand = fart · tid.",
          loesning: `s = v · t = 343 m/s · ${t} s = ${facit} m ≈ ${dk(afrund(facit / 1000, 1), 1)} km.`,
        });
      }
      const d = ri(3, 12) * 100;
      const facit = afrund((2 * d) / 343, 1);
      return talOpgave({
        tekst: `Du råber mod en klippevæg ${d} m væk. Hvor lang tid går der, før du hører ekkoet? (Lydens fart: 343 m/s)`,
        enhed: "s",
        facit,
        tolerancePct: 3,
        hint: "Lyden skal frem OG tilbage — den samlede vej er 2 gange afstanden.",
        loesning: `t = 2 · ${d} m / 343 m/s = ${dk(facit, 1)} s.`,
      });
    },
  },
  {
    id: "g7-lys-mcq",
    titel: "Lysets egenskaber",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvorfor ser du lynet, før du hører tordenen?",
            korrekt: "Lys bevæger sig langt hurtigere end lyd",
            forkerte: ["Tordenen opstår efter lynet", "Lyden skal gennem skyerne først", "Øjnene reagerer hurtigere end ørerne"],
            hint: "Sammenlign 300.000 km/s med 343 m/s.",
            loesning:
              "Lyset (300.000 km/s) når dig næsten øjeblikkeligt, mens lyden (343 m/s) bruger ca. 3 s pr. km.",
          }),
        () =>
          valgOpgave({
            tekst: "Lys rammer et spejl med en indfaldsvinkel på 30°. Hvad er udfaldsvinklen?",
            korrekt: "30°",
            forkerte: ["60°", "90°", "Det afhænger af spejlets størrelse"],
            hint: "Refleksionsloven: indfaldsvinkel = udfaldsvinkel.",
            loesning: "Ved refleksion er udfaldsvinklen altid lig indfaldsvinklen: 30°.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor kan lyd ikke bevæge sig i verdensrummet?",
            korrekt: "Lyd er svingninger i et stof — og rummet er (næsten) tomt",
            forkerte: ["Det er for koldt i rummet", "Lyden fryser til is", "Tyngdekraften mangler"],
            hint: "Hvad svinger, når lyden bevæger sig gennem luft?",
            loesning:
              "Lyd kræver et medium (luft, vand, metal) at svinge i. I vakuum er der intet stof — og derfor ingen lyd.",
          }),
      ])(),
  },
  {
    id: "g7-energiform-mcq",
    titel: "Energiformer",
    lav: () => {
      const q = rv([
        { ting: "en bold, der triller", form: "Bevægelsesenergi", forkerte: ["Kemisk energi", "Elektrisk energi", "Strålingsenergi"] },
        { ting: "vandet bag en dæmning", form: "Beliggenhedsenergi (potentiel energi)", forkerte: ["Bevægelsesenergi", "Elektrisk energi", "Kerneenergi"] },
        { ting: "et opladet batteri", form: "Kemisk energi", forkerte: ["Bevægelsesenergi", "Strålingsenergi", "Beliggenhedsenergi (potentiel energi)"] },
        { ting: "sollys", form: "Strålingsenergi", forkerte: ["Kemisk energi", "Beliggenhedsenergi (potentiel energi)", "Elektrisk energi"] },
        { ting: "din madpakke", form: "Kemisk energi", forkerte: ["Elektrisk energi", "Bevægelsesenergi", "Strålingsenergi"] },
      ]);
      return valgOpgave({
        tekst: `Hvilken energiform er der primært lagret i / tale om ved ${q.ting}?`,
        korrekt: q.form,
        forkerte: q.forkerte,
        hint: "Tænk på, hvad energien 'venter på' at blive brugt til.",
        loesning: `${q.ting.charAt(0).toUpperCase() + q.ting.slice(1)} repræsenterer ${q.form.toLowerCase()}.`,
      });
    },
  },
  {
    id: "g7-energikaede-mcq",
    titel: "Energikæder",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvilken energikæde beskriver en cykeldynamo, der får lygten til at lyse?",
            korrekt: "Bevægelsesenergi → elektrisk energi → lys og varme",
            forkerte: [
              "Elektrisk energi → bevægelsesenergi → lys",
              "Kemisk energi → lys → elektrisk energi",
              "Strålingsenergi → bevægelsesenergi → varme",
            ],
            hint: "Dynamoen drives af hjulets rotation.",
            loesning:
              "Hjulets bevægelse driver dynamoen (bevægelse → el), og pæren laver el om til lys og varme.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor 'forsvinder' der energi i hvert led af en energikæde?",
            korrekt: "En del af energien omdannes til varme, som er svær at udnytte",
            forkerte: [
              "Energien tilintetgøres",
              "Energien bliver til masse",
              "Der forsvinder ikke energi — alle led er 100 % effektive",
            ],
            hint: "Energibevarelsessætningen gælder altid — men ikke al energi er lige nyttig.",
            loesning:
              "Energien forsvinder aldrig (energibevarelse), men noget ender som spildvarme ved hvert led.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad siger energibevarelsessætningen?",
            korrekt: "Energi kan hverken opstå eller forsvinde — kun skifte form",
            forkerte: [
              "Energi kan skabes i et kraftværk",
              "Energi forsvinder, når man bruger den",
              "Kun elektrisk energi er bevaret",
            ],
            hint: "Det er en af fysikkens mest grundlæggende love.",
            loesning:
              "Den samlede energimængde er konstant — energi omdannes kun mellem former.",
          }),
      ])(),
  },

  // ---------- 8. klasse ----------
  {
    id: "g8-fart",
    titel: "Fart, strækning og tid",
    lav: () => {
      const type = ri(1, 3);
      const v = ri(2, 30);
      const t = ri(3, 60);
      const s = v * t;
      if (type === 1)
        return talOpgave({
          tekst: `En løber tilbagelægger ${s} m på ${t} s. Beregn gennemsnitsfarten.`,
          enhed: "m/s",
          facit: v,
          hint: "v = s / t.",
          loesning: `v = ${s} m / ${t} s = ${v} m/s.`,
        });
      if (type === 2)
        return talOpgave({
          tekst: `En knallert kører med ${v} m/s i ${t} s. Hvor langt når den?`,
          enhed: "m",
          facit: s,
          hint: "s = v · t.",
          loesning: `s = ${v} m/s · ${t} s = ${s} m.`,
        });
      return talOpgave({
        tekst: `En cyklist kører ${s} m med farten ${v} m/s. Hvor lang tid tager det?`,
        enhed: "s",
        facit: t,
        hint: "t = s / v.",
        loesning: `t = ${s} m / ${v} m/s = ${t} s.`,
      });
    },
  },
  {
    id: "g8-kmt-ms",
    titel: "km/t og m/s",
    lav: () => {
      if (ri(0, 1) === 0) {
        const ms = ri(2, 40);
        return talOpgave({
          tekst: `Omregn ${ms} m/s til km/t.`,
          enhed: "km/t",
          facit: afrund(ms * 3.6, 1),
          hint: "Gang med 3,6.",
          loesning: `${ms} m/s · 3,6 = ${dk(afrund(ms * 3.6, 1))} km/t.`,
        });
      }
      const kmt = rv([18, 36, 54, 72, 90, 108, 126]);
      return talOpgave({
        tekst: `Omregn ${kmt} km/t til m/s.`,
        enhed: "m/s",
        facit: afrund(kmt / 3.6, 1),
        hint: "Dividér med 3,6.",
        loesning: `${kmt} km/t : 3,6 = ${dk(afrund(kmt / 3.6, 1))} m/s.`,
      });
    },
  },
  {
    id: "g8-tyngdekraft",
    titel: "Tyngdekraft",
    lav: () => {
      const m = rv([0.5, 1, 2, 5, 8, 12, 25, 60, 80]);
      const facit = afrund(m * 9.82, 1);
      return talOpgave({
        tekst: `Beregn tyngdekraften på en genstand med massen ${dk(m)} kg. (g = 9,82 N/kg)`,
        enhed: "N",
        facit,
        tolerancePct: 3,
        hint: "Ft = m · g.",
        loesning: `Ft = ${dk(m)} kg · 9,82 N/kg = ${dk(facit, 1)} N.`,
      });
    },
  },
  {
    id: "g8-masse-fra-tyngde",
    titel: "Masse fra tyngdekraft",
    lav: () => {
      const m = ri(2, 50);
      const Ft = afrund(m * 9.82, 0);
      return talOpgave({
        tekst: `Tyngdekraften på en kasse måles til ${Ft} N. Hvad er kassens masse? (g = 9,82 N/kg)`,
        enhed: "kg",
        facit: afrund(Ft / 9.82, 1),
        tolerancePct: 3,
        hint: "m = Ft / g.",
        loesning: `m = ${Ft} N / 9,82 N/kg ≈ ${dk(afrund(Ft / 9.82, 1))} kg.`,
      });
    },
  },
  {
    id: "g8-kraft-mcq",
    titel: "Masse eller tyngdekraft?",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "En astronaut rejser fra Jorden til Månen. Hvad sker der med hendes masse og tyngdekraft?",
            korrekt: "Massen er uændret — tyngdekraften bliver mindre",
            forkerte: [
              "Både masse og tyngdekraft bliver mindre",
              "Massen bliver mindre — tyngdekraften er uændret",
              "Begge er uændrede",
            ],
            hint: "Masse er mængden af stof; tyngdekraft afhænger af himmellegemet.",
            loesning:
              "Massen (kg) er den samme overalt. Tyngdekraften (N) er ca. 6 gange mindre på Månen, fordi Månens g er mindre.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvilket instrument måler kræfter?",
            korrekt: "Et dynamometer",
            forkerte: ["Et voltmeter", "Et termometer", "Et barometer"],
            hint: "Det er en fjedervægt med skala i newton.",
            loesning: "Kræfter måles i newton med et dynamometer (fjedervægt).",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad kan en kraft IKKE gøre?",
            korrekt: "Skabe energi ud af ingenting",
            forkerte: ["Ændre en genstands fart", "Ændre en genstands retning", "Ændre en genstands form"],
            hint: "Kræfter kan påvirke bevægelse og form — men energibevarelsen gælder.",
            loesning:
              "Kræfter kan accelerere, bremse, dreje og deformere — men energi kan aldrig opstå af ingenting.",
          }),
      ])(),
  },
  {
    id: "g8-tryk",
    titel: "Tryk",
    lav: () => {
      const A = rv([0.5, 1, 2, 4, 5]);
      const p = ri(20, 400);
      const F = p * A;
      return talOpgave({
        tekst: `En kraft på ${dk(F)} N virker på et areal på ${dk(A)} m². Beregn trykket.`,
        enhed: "Pa",
        facit: p,
        hint: "p = F / A.",
        loesning: `p = ${dk(F)} N / ${dk(A)} m² = ${p} Pa.`,
      });
    },
  },
  {
    id: "g8-opdrift-mcq",
    titel: "Opdrift",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvad siger Arkimedes' lov om opdriften på en genstand i vand?",
            korrekt: "Opdriften er lig tyngdekraften på det fortrængte vand",
            forkerte: [
              "Opdriften er lig genstandens tyngdekraft",
              "Opdriften afhænger kun af dybden",
              "Opdriften er altid større end tyngdekraften",
            ],
            hint: "Nøgleordet er 'fortrængt' vand.",
            loesning:
              "Arkimedes: opdrift = tyngdekraften på den fortrængte væske. Flyder genstanden, bærer opdriften netop dens vægt.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor kan et skib af stål flyde, når en stålklump synker?",
            korrekt: "Skibets form fortrænger meget vand i forhold til dets vægt",
            forkerte: [
              "Stålet i skibe er lettere end almindeligt stål",
              "Skibet holdes oppe af motoren",
              "Saltvand bærer alt stål",
            ],
            hint: "Tænk på gennemsnitsdensiteten af skib + luften i skroget.",
            loesning:
              "Skroget rummer masser af luft, så skibets gennemsnitsdensitet er mindre end vands — det fortrænger vand nok til at opdriften bærer det.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvor meget stiger trykket cirka for hver 10 meter, du dykker ned i vand?",
            korrekt: "Cirka 1 atmosfære (100 kPa)",
            forkerte: ["Cirka 10 atmosfærer", "Det er konstant under overfladen", "Cirka 0,01 atmosfære"],
            hint: "Dykkerens tommelfingerregel.",
            loesning: "Vandtrykket vokser med ca. 1 atm (≈100 kPa) pr. 10 m dybde: p = ρ·g·h.",
          }),
      ])(),
  },
  {
    id: "g8-ohm",
    titel: "Ohms lov",
    lav: () => {
      const type = ri(1, 3);
      const R = rv([5, 10, 20, 25, 50, 100]);
      const I = rv([0.1, 0.2, 0.3, 0.5, 1, 2]);
      const U = afrund(R * I, 2);
      if (type === 1)
        return talOpgave({
          tekst: `En modstand på ${R} Ω gennemløbes af strømmen ${dk(I)} A. Beregn spændingen over modstanden.`,
          enhed: "V",
          facit: U,
          hint: "U = R · I.",
          loesning: `U = ${R} Ω · ${dk(I)} A = ${dk(U)} V.`,
        });
      if (type === 2)
        return talOpgave({
          tekst: `Spændingen over en modstand på ${R} Ω er ${dk(U)} V. Beregn strømstyrken.`,
          enhed: "A",
          facit: I,
          hint: "I = U / R.",
          loesning: `I = ${dk(U)} V / ${R} Ω = ${dk(I)} A.`,
        });
      return talOpgave({
        tekst: `Der løber ${dk(I)} A gennem en komponent, når spændingen er ${dk(U)} V. Beregn resistansen.`,
        enhed: "Ω",
        facit: R,
        hint: "R = U / I.",
        loesning: `R = ${dk(U)} V / ${dk(I)} A = ${R} Ω.`,
      });
    },
  },
  {
    id: "g8-serie-resistans",
    titel: "Serieforbindelse",
    lav: () => {
      const R1 = ri(2, 40) * 5;
      const R2 = ri(2, 40) * 5;
      return talOpgave({
        tekst: `To modstande på ${R1} Ω og ${R2} Ω sidder i serie. Beregn den samlede resistans.`,
        enhed: "Ω",
        facit: R1 + R2,
        hint: "I serie lægges resistanserne sammen.",
        loesning: `R = ${R1} Ω + ${R2} Ω = ${R1 + R2} Ω.`,
      });
    },
  },
  {
    id: "g8-effekt",
    titel: "Elektrisk effekt",
    lav: () => {
      const U = rv([6, 12, 24, 230]);
      const I = rv([0.5, 1, 2, 4, 8]);
      return talOpgave({
        tekst: `Et apparat er tilsluttet ${U} V og trækker ${dk(I)} A. Beregn effekten.`,
        enhed: "W",
        facit: U * I,
        hint: "P = U · I.",
        loesning: `P = ${U} V · ${dk(I)} A = ${U * I} W.`,
      });
    },
  },
  {
    id: "g8-kwh",
    titel: "Energiforbrug i kWh",
    lav: () => {
      const P = rv([0.1, 0.2, 0.5, 1, 1.5, 2]);
      const t = ri(2, 10);
      return talOpgave({
        tekst: `Et apparat på ${dk(P)} kW er tændt i ${t} timer. Hvor meget energi bruger det?`,
        enhed: "kWh",
        facit: afrund(P * t, 2),
        hint: "E = P · t (effekt i kW, tid i timer giver kWh).",
        loesning: `E = ${dk(P)} kW · ${t} t = ${dk(afrund(P * t, 2))} kWh.`,
      });
    },
  },
  {
    id: "g8-elpris",
    titel: "Elprisen",
    lav: () => {
      const P = rv([0.5, 1, 2]);
      const t = ri(2, 8);
      const pris = rv([2, 2.5, 3]);
      const facit = afrund(P * t * pris, 2);
      return talOpgave({
        tekst: `Et apparat på ${dk(P)} kW kører ${t} timer. Elprisen er ${dk(pris, 2)} kr. pr. kWh. Hvad koster det?`,
        enhed: "kr.",
        facit,
        hint: "Beregn først energien i kWh (E = P · t), og gang så med prisen.",
        loesning: `E = ${dk(P)} kW · ${t} t = ${dk(P * t)} kWh. Pris = ${dk(P * t)} kWh · ${dk(pris, 2)} kr./kWh = ${dk(facit, 2)} kr.`,
      });
    },
  },
  {
    id: "g8-boelgefart",
    titel: "Bølgeformlen",
    lav: () => {
      if (ri(0, 1) === 0) {
        const f = rv([50, 100, 200, 343, 440, 686, 1000]);
        const facit = afrund(343 / f, 2);
        return talOpgave({
          tekst: `En tone har frekvensen ${f} Hz. Beregn bølgelængden i luft. (Lydens fart: 343 m/s)`,
          enhed: "m",
          facit,
          tolerancePct: 3,
          hint: "λ = v / f.",
          loesning: `λ = 343 m/s / ${f} Hz ≈ ${dk(facit, 2)} m.`,
        });
      }
      const lam = rv([0.25, 0.5, 1, 2]);
      const facit = afrund(343 / lam, 0);
      return talOpgave({
        tekst: `En lydbølge i luft har bølgelængden ${dk(lam)} m. Beregn frekvensen. (Lydens fart: 343 m/s)`,
        enhed: "Hz",
        facit,
        tolerancePct: 3,
        hint: "f = v / λ.",
        loesning: `f = 343 m/s / ${dk(lam)} m ≈ ${facit} Hz.`,
      });
    },
  },
  {
    id: "g8-frekvens-periode",
    titel: "Frekvens og svingningstid",
    lav: () => {
      const f = rv([2, 4, 5, 10, 20, 25, 50]);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `En bølge har frekvensen ${f} Hz. Beregn svingningstiden T.`,
          enhed: "s",
          facit: afrund(1 / f, 3),
          hint: "T = 1 / f.",
          loesning: `T = 1 / ${f} Hz = ${dk(afrund(1 / f, 3))} s.`,
        });
      return talOpgave({
        tekst: `En bølge har svingningstiden ${dk(afrund(1 / f, 3))} s. Beregn frekvensen.`,
        enhed: "Hz",
        facit: f,
        hint: "f = 1 / T.",
        loesning: `f = 1 / ${dk(afrund(1 / f, 3))} s = ${f} Hz.`,
      });
    },
  },
  {
    id: "g8-varmetransport-mcq",
    titel: "Varmetransport",
    lav: () => {
      const q = rv([
        {
          tekst: "Grydeskeen af metal bliver hurtigt varm i den varme suppe. Hvilken varmetransport?",
          korrekt: "Varmeledning",
          forkerte: ["Varmestrømning (konvektion)", "Varmestråling", "Fordampning"],
          forklaring: "I det faste metal skubbes energien videre fra partikel til partikel — det er ledning.",
        },
        {
          tekst: "Den varme luft over en radiator stiger op mod loftet. Hvilken varmetransport?",
          korrekt: "Varmestrømning (konvektion)",
          forkerte: ["Varmeledning", "Varmestråling", "Isolering"],
          forklaring: "Varm luft udvider sig, bliver lettere og stiger — det er konvektion.",
        },
        {
          tekst: "Solens varme når Jorden gennem det tomme rum. Hvilken varmetransport?",
          korrekt: "Varmestråling",
          forkerte: ["Varmeledning", "Varmestrømning (konvektion)", "Lydbølger"],
          forklaring: "Kun stråling kan transportere varme gennem vakuum — ledning og strømning kræver stof.",
        },
        {
          tekst: "Hvorfor isolerer en uldtrøje så godt?",
          korrekt: "Den fanger stillestående luft, som leder varme dårligt",
          forkerte: ["Uld producerer selv varme", "Uld reflekterer al varmestråling", "Uld leder varmen væk fra kroppen"],
          forklaring: "Stillestående luft er en elendig varmeleder — det udnytter uld, dyner og hulmursisolering.",
        },
      ]);
      return valgOpgave({
        tekst: q.tekst,
        korrekt: q.korrekt,
        forkerte: q.forkerte,
        hint: "Ledning: faste stoffer. Strømning: væsker/gasser der bevæger sig. Stråling: virker gennem vakuum.",
        loesning: q.forklaring,
      });
    },
  },
  {
    id: "g8-vejr-mcq",
    titel: "Vejrets fysik",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvordan dannes en sky?",
            korrekt: "Varm, fugtig luft stiger op, afkøles, og vanddampen fortættes til dråber",
            forkerte: [
              "Kold luft synker og presser vandet op",
              "Regn fordamper opad og samler sig",
              "Vinden blæser havvand op i atmosfæren",
            ],
            hint: "Nøgleordene er konvektion og fortætning.",
            loesning:
              "Opstigende luft afkøles (ca. 1 °C pr. 100 m), og ved dugpunktet fortættes dampen til skydråber.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad er vind?",
            korrekt: "Luft der strømmer fra højtryk mod lavtryk",
            forkerte: [
              "Luft der strømmer fra lavtryk mod højtryk",
              "Jordens rotation der trækker i luften",
              "Skyer der skubber til luften",
            ],
            hint: "Luften udligner trykforskelle.",
            loesning: "Trykforskelle driver vinden: luften strømmer fra højtryk mod lavtryk.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad gør drivhusgasser som CO₂ i atmosfæren?",
            korrekt: "De absorberer infrarød varmestråling på vej ud fra Jorden",
            forkerte: [
              "De blokerer sollyset på vej ind",
              "De producerer selv varme",
              "De reflekterer al stråling tilbage til rummet",
            ],
            hint: "Solens synlige lys slipper ind — hvad sker der med varmestrålingen ud?",
            loesning:
              "Drivhusgasser lader synligt lys passere, men absorberer en del af Jordens infrarøde udstråling — derfor stiger temperaturen, når koncentrationen øges.",
          }),
      ])(),
  },

  // ---------- 9. klasse ----------
  {
    id: "g9-neutroner",
    titel: "Kernens byggesten",
    lav: () => {
      const iso = rv([
        { navn: "C-14 (kulstof)", Z: 6, A: 14 },
        { navn: "U-235 (uran)", Z: 92, A: 235 },
        { navn: "Ra-226 (radium)", Z: 88, A: 226 },
        { navn: "I-131 (iod)", Z: 53, A: 131 },
        { navn: "Co-60 (kobolt)", Z: 27, A: 60 },
        { navn: "Sr-90 (strontium)", Z: 38, A: 90 },
      ]);
      return talOpgave({
        tekst: `Isotopen ${iso.navn} har atomnummer ${iso.Z} og massetal ${iso.A}. Hvor mange neutroner er der i kernen?`,
        enhed: "neutroner",
        facit: iso.A - iso.Z,
        tolerancePct: 0,
        hint: "Antal neutroner = massetal − atomnummer.",
        loesning: `Neutroner = A − Z = ${iso.A} − ${iso.Z} = ${iso.A - iso.Z}.`,
      });
    },
  },
  {
    id: "g9-halveringstid",
    titel: "Halveringstid",
    lav: () => {
      const N0 = rv([800, 1600, 2000, 4000, 6400]);
      const n = ri(2, 4);
      const T = rv([2, 5, 6, 10, 30]);
      const facit = N0 / Math.pow(2, n);
      return talOpgave({
        tekst: `Et radioaktivt præparat indeholder ${N0} mio. kerner og har halveringstiden ${T} minutter. Hvor mange mio. kerner er der tilbage efter ${n * T} minutter?`,
        enhed: "mio. kerner",
        facit,
        hint: `${n * T} minutter er ${n} halveringstider — halvér ${n} gange.`,
        loesning: `${n * T} min / ${T} min = ${n} halveringstider. N = ${N0} · (½)^${n} = ${dk(facit)} mio. kerner.`,
      });
    },
  },
  {
    id: "g9-straaling-mcq",
    titel: "Strålingstyper",
    lav: () => {
      const q = rv([
        {
          tekst: "Hvilken strålingstype stoppes allerede af et stykke papir?",
          korrekt: "Alfastråling",
          forkerte: ["Betastråling", "Gammastråling", "Røntgenstråling"],
          forklaring: "Alfapartikler (heliumkerner) er tunge og bremses af papir eller huden.",
        },
        {
          tekst: "Hvilken strålingstype er hurtige elektroner?",
          korrekt: "Betastråling",
          forkerte: ["Alfastråling", "Gammastråling", "Neutronstråling"],
          forklaring: "Beta-minus-stråling er elektroner udsendt fra kernen, når en neutron omdannes til en proton.",
        },
        {
          tekst: "Hvilken strålingstype kræver tykt bly eller beton for at blive dæmpet?",
          korrekt: "Gammastråling",
          forkerte: ["Alfastråling", "Betastråling", "Ultraviolet stråling"],
          forklaring: "Gammastråling er meget gennemtrængende elektromagnetisk stråling.",
        },
        {
          tekst: "Hvad måler enheden becquerel (Bq)?",
          korrekt: "Antal henfald pr. sekund",
          forkerte: ["Strålingens energi", "Dosis pr. kilogram", "Halveringstiden"],
          forklaring: "1 Bq = 1 henfald pr. sekund — et mål for kildens aktivitet.",
        },
      ]);
      return valgOpgave({
        tekst: q.tekst,
        korrekt: q.korrekt,
        forkerte: q.forkerte,
        hint: "Alfa: papir. Beta: aluminium. Gamma: bly/beton.",
        loesning: q.forklaring,
      });
    },
  },
  {
    id: "g9-virkningsgrad",
    titel: "Virkningsgrad",
    lav: () => {
      const tilfoert = rv([200, 400, 500, 800, 1000]);
      const eta = rv([20, 25, 30, 40, 50, 60, 90]);
      const nyttig = (tilfoert * eta) / 100;
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `Et kraftværk tilføres ${tilfoert} MJ og leverer ${dk(nyttig)} MJ elektrisk energi. Beregn virkningsgraden i procent.`,
          enhed: "%",
          facit: eta,
          hint: "η = E_nyttig / E_tilført · 100 %.",
          loesning: `η = ${dk(nyttig)} / ${tilfoert} · 100 % = ${eta} %.`,
        });
      return talOpgave({
        tekst: `En motor har virkningsgraden ${eta} % og tilføres ${tilfoert} kJ. Hvor meget nyttig energi leverer den?`,
        enhed: "kJ",
        facit: nyttig,
        hint: "E_nyttig = η · E_tilført (η som decimaltal).",
        loesning: `E_nyttig = ${dk(eta / 100, 2)} · ${tilfoert} kJ = ${dk(nyttig)} kJ.`,
      });
    },
  },
  {
    id: "g9-vindmoelle",
    titel: "Vindmøllens produktion",
    lav: () => {
      const P = rv([2, 3, 4, 6, 8]);
      const t = rv([10, 24, 100]);
      return talOpgave({
        tekst: `En havvindmølle yder i gennemsnit ${P} MW. Hvor meget energi producerer den på ${t} timer?`,
        enhed: "MWh",
        facit: P * t,
        hint: "E = P · t (effekt i MW gange timer giver MWh).",
        loesning: `E = ${P} MW · ${t} t = ${P * t} MWh — nok til ca. ${Math.round((P * t) / 0.004 / 1000)} husstandes døgnforbrug.`,
      });
    },
  },
  {
    id: "g9-energikilde-mcq",
    titel: "Energikilder",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvilken af disse energikilder er IKKE vedvarende?",
            korrekt: "Naturgas",
            forkerte: ["Vindenergi", "Solenergi", "Vandkraft"],
            hint: "Vedvarende kilder slipper ikke op og udleder ikke fossilt CO₂.",
            loesning: "Naturgas er et fossilt brændstof dannet over millioner af år — det er ikke vedvarende.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad har et kulkraftværk, et atomkraftværk og et vandkraftværk til fælles?",
            korrekt: "En turbine driver en generator, der producerer el ved induktion",
            forkerte: [
              "De brænder alle et brændstof",
              "De laver alle lys direkte om til el",
              "De udleder alle CO₂",
            ],
            hint: "Tænk på det roterende led mellem energikilden og elektriciteten.",
            loesning:
              "Alle tre får en turbine til at rotere (med damp eller vand), og turbinen driver en generator.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor kan solceller ikke stå alene i det danske elsystem?",
            korrekt: "De producerer kun, når solen skinner — der er brug for lagring eller andre kilder",
            forkerte: [
              "De kan kun producere jævnstrøm om vinteren",
              "De holder kun i ét år",
              "De bruger mere energi, end de producerer",
            ],
            hint: "Tænk på nætter og vintermørke.",
            loesning:
              "Produktionen følger solen. Et robust elsystem kombinerer sol, vind, lagring og udlandsforbindelser.",
          }),
      ])(),
  },
  {
    id: "g9-transformer",
    titel: "Transformeren",
    lav: () => {
      const U1 = 230;
      const N1 = rv([1150, 2300, 4600]);
      const N2 = rv([50, 100, 150, 200, 300]);
      const facit = afrund((U1 * N2) / N1, 1);
      return talOpgave({
        tekst: `En transformer har ${N1} vindinger på primærspolen og ${N2} på sekundærspolen. Primærspændingen er ${U1} V. Beregn sekundærspændingen.`,
        enhed: "V",
        facit,
        tolerancePct: 3,
        hint: "U₂ = U₁ · N₂ / N₁.",
        loesning: `U₂ = ${U1} V · ${N2}/${N1} = ${dk(facit, 1)} V.`,
      });
    },
  },
  {
    id: "g9-induktion-mcq",
    titel: "Induktion",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvad opdagede H.C. Ørsted i 1820?",
            korrekt: "At elektrisk strøm skaber et magnetfelt",
            forkerte: [
              "At magneter skaber elektrisk strøm",
              "At lyn er elektricitet",
              "At Jorden har et magnetfelt",
            ],
            hint: "Kompasnålen slog ud ved siden af den strømførende ledning.",
            loesning:
              "Ørsted så en kompasnål slå ud nær en strømførende ledning — strøm skaber magnetfelt.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvornår induceres der en spænding i en spole?",
            korrekt: "Når magnetfeltet gennem spolen ændrer sig",
            forkerte: [
              "Når en magnet ligger stille inde i spolen",
              "Når spolen er lavet af plast",
              "Kun når spolen er tilsluttet et batteri",
            ],
            hint: "Nøgleordet er ÆNDRING.",
            loesning:
              "Induktion kræver ændring: en magnet i bevægelse, en roterende spole eller et varierende felt.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvorfor transporteres el over lange afstande ved meget høj spænding?",
            korrekt: "Høj spænding giver lille strømstyrke og dermed lille varmetab i ledningerne",
            forkerte: [
              "Høj spænding får strømmen til at løbe hurtigere",
              "Lav spænding er farligere",
              "Ledningerne kan ikke holde til stor spænding",
            ],
            hint: "Varmetabet afhænger af strømstyrken.",
            loesning:
              "Samme effekt kan leveres med høj U og lille I. Lille strømstyrke betyder lille varmetab i ledningerne.",
          }),
      ])(),
  },
  {
    id: "g9-lysaar",
    titel: "Lysår og afstande",
    lav: () => {
      if (ri(0, 1) === 0) {
        const ly = rv([4.2, 8.6, 25, 100, 640]);
        return talOpgave({
          tekst: `En stjerne ligger ${dk(ly)} lysår væk. Hvor mange år er dens lys om at nå os?`,
          enhed: "år",
          facit: ly,
          hint: "Definitionen af et lysår: den strækning lyset tilbagelægger på ét år.",
          loesning: `Lyset bruger præcis ${dk(ly)} år — du ser stjernen, som den så ud for ${dk(ly)} år siden.`,
        });
      }
      const min = rv([8.3, 4.3, 43]);
      const facit = afrund(min * 60 * 300000, 0);
      return talOpgave({
        tekst: `Lyset fra Solen er ${dk(min)} minutter om at nå en planet. Hvor langt væk er planeten? (Lysets fart: 300.000 km/s)`,
        enhed: "km",
        facit,
        tolerancePct: 3,
        hint: "Omregn minutter til sekunder og brug s = v · t.",
        loesning: `s = 300.000 km/s · ${dk(min)} · 60 s ≈ ${dk(facit)} km.`,
      });
    },
  },
  {
    id: "g9-univers-mcq",
    titel: "Universet",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvorfor har vi årstider på Jorden?",
            korrekt: "Jordens akse hælder ca. 23,4° i forhold til banen om Solen",
            forkerte: [
              "Jorden er tættest på Solen om sommeren",
              "Solen skinner kraftigere om sommeren",
              "Månen skygger for Solen om vinteren",
            ],
            hint: "Det handler om vinklen, sollyset rammer med — ikke afstanden.",
            loesning:
              "Aksehældningen gør, at solstrålerne rammer stejlere og i flere timer om sommeren. (Jorden er faktisk tættest på Solen i januar!)",
          }),
        () =>
          valgOpgave({
            tekst: "Hvilke to observationer er de vigtigste beviser for Big Bang?",
            korrekt: "Galaksernes rødforskydning og den kosmiske baggrundsstråling",
            forkerte: [
              "Månens faser og tidevandet",
              "Solpletter og nordlys",
              "Meteorer og kometer",
            ],
            hint: "Et 'ekko' af varme — og galakser på flugt.",
            loesning:
              "Fjerne galakser fjerner sig (rødforskydning), og baggrundsstrålingen er restvarmen fra det unge univers.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad sker der, når en meget stor stjerne dør?",
            korrekt: "Den eksploderer som supernova og kan efterlade en neutronstjerne eller et sort hul",
            forkerte: [
              "Den bliver stille og roligt til en planet",
              "Den deler sig i to mindre stjerner",
              "Den forsvinder sporløst",
            ],
            hint: "De tungeste stjerner får de voldsomste endeligt.",
            loesning:
              "Massive stjerner ender i en supernovaeksplosion; kernen kollapser til en neutronstjerne eller et sort hul.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvad er Solen?",
            korrekt: "En stjerne, hvor brint fusionerer til helium",
            forkerte: [
              "En planet af glødende lava",
              "En kæmpe brændende kulklump",
              "Et sort hul med lysende kant",
            ],
            hint: "Energikilden er kernereaktioner.",
            loesning:
              "Solen er en almindelig stjerne: fusion af brint til helium i kernen frigiver energien.",
          }),
      ])(),
  },
  {
    id: "g9-newton2",
    titel: "Newtons 2. lov",
    lav: () => {
      const m = rv([2, 5, 10, 20, 50, 80, 1000]);
      const a = rv([0.5, 1, 2, 3, 4, 5]);
      if (ri(0, 1) === 0)
        return talOpgave({
          tekst: `Hvilken resulterende kraft skal der til for at give en masse på ${dk(m)} kg accelerationen ${dk(a)} m/s²?`,
          enhed: "N",
          facit: afrund(m * a, 1),
          hint: "F = m · a.",
          loesning: `F = ${dk(m)} kg · ${dk(a)} m/s² = ${dk(afrund(m * a, 1))} N.`,
        });
      return talOpgave({
        tekst: `En resulterende kraft på ${dk(m * a)} N virker på en masse på ${dk(m)} kg. Beregn accelerationen.`,
        enhed: "m/s²",
        facit: a,
        hint: "a = F / m.",
        loesning: `a = ${dk(m * a)} N / ${dk(m)} kg = ${dk(a)} m/s².`,
      });
    },
  },
  {
    id: "g9-inerti-mcq",
    titel: "Inerti og trafiksikkerhed",
    lav: () =>
      rv([
        () =>
          valgOpgave({
            tekst: "Hvorfor kastes du fremad, når bilen bremser hårdt op?",
            korrekt: "Din krop fortsætter fremad pga. inertiloven (Newtons 1. lov)",
            forkerte: [
              "Bilen skubber dig fremad",
              "Tyngdekraften trækker dig fremad",
              "Luften i bilen presser dig frem",
            ],
            hint: "Ingen kraft = bevægelsen fortsætter uændret.",
            loesning:
              "Kroppen 'vil' fortsætte med bilens fart (inertiloven). Selen leverer kraften, der bremser dig sikkert.",
          }),
        () =>
          valgOpgave({
            tekst: "Hvordan redder en airbag liv rent fysisk?",
            korrekt: "Den forlænger opbremsningstiden, så kraften på hovedet bliver mindre",
            forkerte: [
              "Den gør hovedet lettere",
              "Den øger farten ved sammenstødet",
              "Den fjerner inertien",
            ],
            hint: "Samme fartændring — men over længere tid.",
            loesning:
              "Længere opbremsningstid giver mindre kraft (kraft = impulsændring/tid). Samme princip som cykelhjelm og kofanger.",
          }),
        () =>
          valgOpgave({
            tekst: "En bil fordobler farten fra 40 til 80 km/t. Hvad sker der cirka med bremselængden?",
            korrekt: "Den bliver 4 gange så lang",
            forkerte: ["Den fordobles", "Den er uændret", "Den bliver 8 gange så lang"],
            hint: "Bevægelsesenergien vokser med kvadratet på farten.",
            loesning:
              "E_kin = ½mv² — dobbelt fart giver 4 gange energien, som bremserne skal fjerne over 4 gange længden.",
          }),
        () =>
          valgOpgave({
            tekst: "Du skubber på en væg med 50 N. Hvad siger Newtons 3. lov?",
            korrekt: "Væggen skubber tilbage på dig med 50 N",
            forkerte: [
              "Væggen skubber tilbage med mindre end 50 N",
              "Væggen skubber kun tilbage, hvis den flytter sig",
              "Der virker ingen kraft fra væggen",
            ],
            hint: "Aktion og reaktion er altid lige store og modsat rettede.",
            loesning:
              "Kræfter optræder i par: din kraft på væggen modsvares af væggens lige så store kraft på dig.",
          }),
      ])(),
  },
];
