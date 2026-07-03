import type { FysikEmne } from "../model";

// 9. klasse — fysikdelen af fysik/kemi + forberedelse til den fælles naturfagsprøve.
export const EMNER_9KL: FysikEmne[] = [
  {
    id: "9-atomer-radioaktivitet",
    titel: "Atomer og radioaktivitet",
    ikon: "☢️",
    kort: "Atomets opbygning, alfa-, beta- og gammastråling og halveringstid.",
    niveau: "9kl",
    omraade: "atom",
    maal: [
      "Beskrive atomets opbygning med protoner, neutroner og elektroner",
      "Aflæse atomnummer og massetal og beregne antal neutroner",
      "Skelne mellem alfa-, beta- og gammastråling",
      "Regne med halveringstid",
    ],
    teori: [
      {
        overskrift: "Atomets opbygning",
        brod:
          "Et atom består af en lillebitte, tung kerne af protoner (positive) og neutroner (neutrale), omgivet af lette elektroner (negative). Atomnummeret Z er antallet af protoner og bestemmer, hvilket grundstof det er. Massetallet A er protoner plus neutroner.\nAtomer af samme grundstof med forskelligt antal neutroner kaldes isotoper — fx er C-12 og C-14 begge kulstof.",
        formler: [
          {
            udtryk: "antal neutroner = A − Z",
            navn: "Neutrontal",
            forklaring: "A: massetal, Z: atomnummer (protontal)",
          },
        ],
        eksempel: {
          titel: "C-14",
          tekst: "Kulstof-14 har Z = 6 og A = 14. Neutroner: 14 − 6 = 8.",
        },
      },
      {
        overskrift: "Radioaktiv stråling",
        brod:
          "Nogle atomkerner er ustabile og udsender stråling, når de henfalder. Alfastråling er heliumkerner — tung, farlig tæt på, men stoppes af papir og hud. Betastråling er hurtige elektroner — stoppes af få mm aluminium. Gammastråling er elektromagnetisk stråling — meget gennemtrængende og kræver bly eller beton.\nRadioaktivitet måles i becquerel (Bq): antal henfald pr. sekund.",
        punkter: [
          "Alfa (α): heliumkerne — stoppes af papir",
          "Beta (β): elektron — stoppes af aluminiumplade",
          "Gamma (γ): stråling — dæmpes af tykt bly/beton",
          "Baggrundsstråling findes overalt i naturen",
        ],
      },
      {
        overskrift: "Halveringstid",
        brod:
          "Halveringstiden er den tid, der går, før halvdelen af de radioaktive kerner er henfaldet. Efter én halveringstid er der halvdelen tilbage, efter to en fjerdedel, efter tre en ottendedel osv. Halveringstiden bruges bl.a. til kulstof-14-datering af arkæologiske fund (C-14 har halveringstid 5730 år).",
        formler: [
          {
            udtryk: "N = N₀ · (½)ⁿ",
            navn: "Henfald",
            forklaring: "N₀: startmængde, n: antal halveringstider",
          },
        ],
        eksempel: {
          titel: "Tre halveringer",
          tekst:
            "Et præparat har 800 mio. kerner og halveringstiden 5 min. Efter 15 min (3 halveringer): 800 → 400 → 200 → 100 mio. kerner.",
        },
      },
    ],
    opgaver: ["g9-neutroner", "g9-halveringstid", "g9-straaling-mcq"],
  },

  {
    id: "9-energiforsyning",
    titel: "Energiforsyning og bæredygtighed",
    ikon: "🌬️",
    kort: "Kraftværker, vedvarende energi og virkningsgrad.",
    niveau: "9kl",
    omraade: "energi",
    maal: [
      "Beskrive hvordan et kraftværk og en vindmølle producerer el",
      "Skelne mellem vedvarende og fossile energikilder",
      "Beregne virkningsgrad (nyttevirkning)",
      "Diskutere fordele og ulemper ved forskellige energikilder",
    ],
    teori: [
      {
        overskrift: "Fra energikilde til stikkontakt",
        brod:
          "Næsten al elproduktion bygger på samme princip: noget får en turbine til at rotere, og turbinen driver en generator, der laver bevægelsesenergi om til elektrisk energi (induktion).\nI et kulkraftværk koger man vand til damp, der driver turbinen. I en vindmølle drejer vinden vingerne direkte. I et vandkraftværk falder vand gennem turbinen. Solceller er undtagelsen — de laver lys direkte om til el uden bevægelige dele.",
        punkter: [
          "Fossile kilder: kul, olie, naturgas — udleder CO₂",
          "Vedvarende kilder: vind, sol, vand, biomasse, geotermi",
          "Danmark er verdensførende inden for vindenergi",
        ],
      },
      {
        overskrift: "Virkningsgrad",
        brod:
          "Ingen maskine udnytter al den tilførte energi — en del ender altid som spildvarme. Virkningsgraden (nyttevirkningen) er den nyttige energi divideret med den tilførte energi, ofte angivet i procent.\nEt kulkraftværk har en virkningsgrad omkring 40 %; en moderne vindmølle udnytter op til ca. 45 % af vindens energi; en elmotor kan nå over 90 %.",
        formler: [
          {
            udtryk: "η = E_nyttig / E_tilført · 100 %",
            navn: "Virkningsgrad",
            forklaring: "η (eta): virkningsgrad i procent",
          },
        ],
        eksempel: {
          titel: "Kraftværket",
          tekst:
            "Et kraftværk tilføres 1000 MJ kul-energi og leverer 400 MJ el: η = 400/1000 · 100 % = 40 %. Resten bliver til varme — som i Danmark ofte genbruges som fjernvarme.",
        },
      },
    ],
    opgaver: ["g9-virkningsgrad", "g9-vindmoelle", "g9-energikilde-mcq"],
  },

  {
    id: "9-elektromagnetisme",
    titel: "Elektromagnetisme",
    ikon: "⚙️",
    kort: "Induktion, generator, elmotor og transformer.",
    niveau: "9kl",
    omraade: "el",
    maal: [
      "Beskrive at strøm skaber magnetfelt, og at bevægelse i magnetfelt skaber strøm",
      "Forklare hvordan generator og elmotor virker",
      "Beregne spændinger med transformerformlen",
      "Forklare hvorfor el transporteres ved høj spænding",
    ],
    teori: [
      {
        overskrift: "Strøm og magnetisme hænger sammen",
        brod:
          "H.C. Ørsted opdagede i 1820, at elektrisk strøm skaber et magnetfelt omkring ledningen — den opdagelse gjorde ham verdensberømt. Det omvendte gælder også: bevæger man en magnet i forhold til en spole, induceres (skabes) der en spænding i spolen. Det kaldes elektromagnetisk induktion.\nGeneratoren bygger på induktion: en roterende magnet i en spole giver strøm. Elmotoren er det omvendte: strøm i et magnetfelt giver rotation.",
        punkter: [
          "Strøm i ledning → magnetfelt (Ørsted, 1820)",
          "Magnet i bevægelse ved spole → induceret spænding",
          "Generator: bevægelse → el. Motor: el → bevægelse.",
        ],
      },
      {
        overskrift: "Transformeren og elnettet",
        brod:
          "En transformer består af to spoler om samme jernkerne og kan ændre en vekselspænding op eller ned. Spændingerne forholder sig som vindingstallene.\nEl transporteres i højspændingsledninger ved op til 400.000 V, fordi høj spænding giver lille strømstyrke — og dermed lille varmetab i ledningerne. Ved forbrugeren transformeres spændingen ned til 230 V.",
        formler: [
          {
            udtryk: "U₂ / U₁ = N₂ / N₁",
            navn: "Transformerformlen",
            forklaring: "U: spænding, N: vindingstal (1: primær, 2: sekundær)",
          },
        ],
        eksempel: {
          titel: "Opladeren",
          tekst:
            "En transformer har 2300 vindinger på primærspolen (230 V) og 50 på sekundærspolen: U₂ = 230 V · 50/2300 = 5 V — perfekt til en USB-oplader.",
        },
      },
    ],
    opgaver: ["g9-transformer", "g9-induktion-mcq"],
  },

  {
    id: "9-universet",
    titel: "Jorden og universet",
    ikon: "🌌",
    kort: "Solsystemet, stjerners liv, galakser og Big Bang.",
    niveau: "9kl",
    omraade: "astro",
    maal: [
      "Beskrive solsystemets opbygning",
      "Forklare årstider, månefaser og formørkelser",
      "Beskrive en stjernes livscyklus",
      "Regne med lysår og forklare Big Bang-teorien i hovedtræk",
    ],
    teori: [
      {
        overskrift: "Solsystemet",
        brod:
          "Solen er en stjerne — en gigantisk kugle af glødende gas, hvor brint fusionerer til helium og frigiver enorme mængder energi. Omkring den kredser otte planeter: Merkur, Venus, Jorden, Mars (klippeplaneter) og Jupiter, Saturn, Uranus, Neptun (gaskæmper).\nÅrstiderne skyldes ikke afstanden til Solen, men at Jordens akse hælder ca. 23,4°: om sommeren rammer solstrålerne os stejlere og i flere timer.",
        punkter: [
          "Solen indeholder 99,8 % af solsystemets masse",
          "Årstider: aksehældning — ikke afstand",
          "Månen kredser om Jorden på ca. 27 dage → månefaser",
        ],
      },
      {
        overskrift: "Stjerner, galakser og lysår",
        brod:
          "Afstande i rummet måles i lysår: den strækning lyset tilbagelægger på ét år, knap 9,5 billioner km. Den nærmeste stjerne efter Solen ligger 4,2 lysår væk — ser du på den, ser du 4,2 år tilbage i tiden.\nStjerner fødes i gaståger, lyser i millioner til milliarder af år og dør: små stjerner som Solen ender som hvide dværge, meget store eksploderer som supernovaer og kan efterlade neutronstjerner eller sorte huller. Vores galakse, Mælkevejen, rummer over 100 milliarder stjerner.",
        formler: [
          {
            udtryk: "1 lysår ≈ 9,46 · 10¹² km",
            navn: "Lysår",
            forklaring: "Afstanden lys tilbagelægger på et år",
          },
        ],
      },
      {
        overskrift: "Big Bang",
        brod:
          "Universet begyndte for ca. 13,8 milliarder år siden i Big Bang og har udvidet sig lige siden. To stærke beviser: (1) Alle fjerne galakser bevæger sig væk fra os — jo fjernere, jo hurtigere (galaksernes lys er rødforskudt). (2) Den kosmiske baggrundsstråling — et svagt 'ekko' af varmen fra det unge univers — måles i alle retninger.",
        punkter: [
          "Universet er ca. 13,8 mia. år gammelt",
          "Rødforskydning: galakser fjerner sig fra hinanden",
          "Baggrundsstrålingen er 'efterglød' fra Big Bang",
        ],
      },
    ],
    opgaver: ["g9-lysaar", "g9-univers-mcq"],
  },

  {
    id: "9-newtons-love",
    titel: "Newtons love i praksis",
    ikon: "🚗",
    kort: "Inerti, kraft og acceleration — fysikken bag trafiksikkerhed.",
    niveau: "9kl",
    omraade: "mekanik",
    maal: [
      "Formulere Newtons tre love med egne ord",
      "Beregne kraft med F = m · a",
      "Forklare hvorfor sikkerhedssele og airbag redder liv",
      "Forklare aktion og reaktion med hverdagseksempler",
    ],
    teori: [
      {
        overskrift: "Newtons tre love",
        brod:
          "1. lov (inertiloven): En genstand fortsætter i hvile eller med konstant fart i lige linje, hvis ingen resulterende kraft virker på den. 2. lov: Kraft er masse gange acceleration — jo større kraft, jo hurtigere ændres bevægelsen. 3. lov: Kræfter kommer altid i par — trykker du på væggen, trykker væggen tilbage på dig, lige så hårdt, modsat rettet.",
        formler: [
          {
            udtryk: "F = m · a",
            navn: "Newtons 2. lov",
            forklaring: "F: kraft (N), m: masse (kg), a: acceleration (m/s²)",
          },
        ],
        eksempel: {
          titel: "Raketten",
          tekst:
            "En raket skubber udstødningsgas nedad (aktion) — gassen skubber raketten opad (reaktion). Derfor virker raketter også i det tomme rum.",
        },
      },
      {
        overskrift: "Fysikken redder liv i trafikken",
        brod:
          "Ved en bilulykke stopper bilen brat — men din krop vil ifølge inertiloven fortsætte fremad med bilens fart. Selen holder dig fast og fordeler kraften; airbaggen forlænger den tid, opbremsningen af dit hoved tager. Længere bremsetid betyder mindre kraft — det er hele idéen bag airbags, kofangere og cykelhjelme.",
        punkter: [
          "Inerti: kroppen 'vil' fortsætte fremad ved opbremsning",
          "Airbag/hjelm: længere opbremsningstid → mindre kraft",
          "Dobbelt fart → firedobbelt bremselængde",
        ],
      },
    ],
    opgaver: ["g9-newton2", "g9-inerti-mcq"],
  },

  {
    id: "9-naturfagsproeven",
    titel: "Mod naturfagsprøven: repetition",
    ikon: "🎯",
    kort: "Blandet træning i kernefærdighederne fra 7.–9. klasse.",
    niveau: "9kl",
    omraade: "metode",
    maal: [
      "Genopfriske fartberegning, Ohms lov og densitet",
      "Regne sikkert med virkningsgrad og halveringstid",
      "Vælge den rigtige formel til en given opgave",
      "Være beregningsklar til den fælles naturfagsprøve",
    ],
    teori: [
      {
        overskrift: "Sådan bruger du repetitionen",
        brod:
          "Til den fælles naturfagsprøve skal du kunne kombinere viden fra fysik/kemi, biologi og geografi — og de fysiske beregninger er ofte dem, der giver sikre point. Denne træning blander opgaver fra hele pensum: fart, densitet, Ohms lov, elforbrug, virkningsgrad og halveringstid.\nGod strategi pr. opgave: (1) Skriv de kendte størrelser op med enheder. (2) Vælg formlen, der forbinder dem. (3) Indsæt, beregn og tjek om svaret er realistisk.",
        punkter: [
          "Skriv altid enheder på — de afslører regnefejl",
          "Tjek om resultatets størrelse er realistisk",
          "Lær kerneformlerne udenad: v = s/t, ρ = m/V, U = R·I, P = U·I, E = P·t, η = nyttig/tilført",
        ],
      },
    ],
    opgaver: [
      "g8-fart",
      "g7-densitet",
      "g8-ohm",
      "g8-kwh",
      "g9-virkningsgrad",
      "g9-halveringstid",
    ],
  },
];
