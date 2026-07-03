import type { FysikEmne } from "../model";

// 8. klasse — fysikdelen af fysik/kemi (Fælles Mål).
export const EMNER_8KL: FysikEmne[] = [
  {
    id: "8-fart-bevaegelse",
    titel: "Fart og bevægelse",
    ikon: "🏃",
    kort: "Beregn fart, strækning og tid — og aflæs bevægelsesgrafer.",
    niveau: "8kl",
    omraade: "mekanik",
    maal: [
      "Beregne fart, strækning og tid med v = s/t",
      "Omregne mellem km/t og m/s",
      "Aflæse en strækning-tid-graf",
      "Skelne mellem gennemsnitsfart og øjeblikkelig fart",
    ],
    teori: [
      {
        overskrift: "Fart",
        brod:
          "Fart fortæller, hvor langt du kommer pr. tid. Kører du 100 km på 2 timer, er din gennemsnitsfart 50 km/t — selvom speedometeret undervejs har vist både mere og mindre (den øjeblikkelige fart).\nI fysik måler vi helst fart i meter pr. sekund (m/s). Omregningen er fast: 1 m/s = 3,6 km/t.",
        formler: [
          {
            udtryk: "v = s / t",
            navn: "Fart",
            forklaring: "v: fart (m/s), s: strækning (m), t: tid (s)",
          },
          { udtryk: "s = v · t", navn: "Strækning" },
          { udtryk: "t = s / v", navn: "Tid" },
          { udtryk: "m/s → km/t: gang med 3,6", navn: "Omregning" },
        ],
        eksempel: {
          titel: "Cykelturen",
          tekst:
            "Du cykler 6000 m på 1200 s. Fart: v = 6000 m / 1200 s = 5 m/s. I km/t: 5 · 3,6 = 18 km/t.",
        },
      },
      {
        overskrift: "Bevægelsesgrafer",
        brod:
          "En strækning-tid-graf viser, hvor langt noget er kommet til hvert tidspunkt. Jo stejlere grafen er, jo højere fart. En vandret linje betyder stilstand. Fart kan aflæses som grafens hældning: fart = strækningsændring divideret med tidsændring.",
        punkter: [
          "Stejl graf = høj fart",
          "Vandret graf = stilstand",
          "Hældningen på en (s,t)-graf er farten",
        ],
      },
    ],
    opgaver: ["g8-fart", "g8-kmt-ms"],
  },

  {
    id: "8-kraft-tyngde",
    titel: "Kræfter og tyngdekraft",
    ikon: "🪂",
    kort: "Kraftbegrebet, newton og tyngdekraften Ft = m · g.",
    niveau: "8kl",
    omraade: "mekanik",
    maal: [
      "Beskrive hvad en kraft er, og hvad den kan gøre",
      "Måle kræfter i newton (N) med et dynamometer",
      "Beregne tyngdekraften på en genstand med Ft = m · g",
      "Skelne mellem masse (kg) og tyngdekraft (N)",
    ],
    teori: [
      {
        overskrift: "Hvad er en kraft?",
        brod:
          "En kraft er et skub eller et træk. Kræfter kan sætte ting i bevægelse, bremse dem, ændre deres retning eller ændre deres form. Kraft måles i newton (N) — opkaldt efter Isaac Newton — og kan måles med et dynamometer (en fjedervægt).",
        punkter: [
          "Kraft måles i newton (N)",
          "1 N svarer ca. til tyngdekraften på 100 g",
          "Eksempler: tyngdekraft, gnidningskraft (friktion), opdrift, muskelkraft",
        ],
      },
      {
        overskrift: "Tyngdekraften",
        brod:
          "Jorden trækker i alt med tyngdekraften. Kraftens størrelse afhænger af massen: tyngdekraften er massen gange tyngdeaccelerationen g, som på Jorden er cirka 9,82 N/kg.\nMasse og tyngdekraft er ikke det samme: massen (kg) er mængden af stof og er den samme overalt — tyngdekraften (N) afhænger af, hvor du er. På Månen vejer du kun en sjettedel af, hvad du vejer her.",
        formler: [
          {
            udtryk: "Ft = m · g",
            navn: "Tyngdekraft",
            forklaring: "Ft: tyngdekraft (N), m: masse (kg), g ≈ 9,82 N/kg på Jorden",
          },
        ],
        eksempel: {
          titel: "Skoletasken",
          tekst: "En taske på 5 kg: Ft = 5 kg · 9,82 N/kg ≈ 49 N.",
        },
      },
    ],
    opgaver: ["g8-tyngdekraft", "g8-masse-fra-tyngde", "g8-kraft-mcq"],
  },

  {
    id: "8-tryk-opdrift",
    titel: "Tryk og opdrift",
    ikon: "🌊",
    kort: "Tryk som kraft pr. areal, vandtryk og Arkimedes' lov.",
    niveau: "8kl",
    omraade: "mekanik",
    maal: [
      "Beregne tryk med p = F/A",
      "Forklare hvorfor trykket stiger med dybden i vand",
      "Beskrive opdrift og Arkimedes' lov",
      "Forklare hvorfor skibe af stål kan flyde",
    ],
    teori: [
      {
        overskrift: "Tryk",
        brod:
          "Tryk er kraft fordelt på et areal. Samme kraft på et lille areal giver stort tryk — derfor skærer en skarp kniv, og derfor synker du ikke i sneen med ski på. Tryk måles i pascal (Pa): 1 Pa = 1 N/m².",
        formler: [
          {
            udtryk: "p = F / A",
            navn: "Tryk",
            forklaring: "p: tryk (Pa), F: kraft (N), A: areal (m²)",
          },
        ],
        eksempel: {
          titel: "Skiene bærer dig",
          tekst:
            "En person på 60 kg (Ft ≈ 589 N) står på ski med samlet areal 0,3 m²: p = 589 N / 0,3 m² ≈ 1963 Pa. På støvler (0,03 m²) bliver trykket ti gange større.",
        },
      },
      {
        overskrift: "Vandtryk og opdrift",
        brod:
          "Under vand stiger trykket med dybden, fordi vandet ovenover trykker ned — cirka 1 atmosfære ekstra for hver 10 meter. Trykket er størst nederst på en nedsænket genstand, og derfor skubbes den opad: det er opdriften.\nArkimedes' lov: opdriften er lige så stor som tyngdekraften på det vand, genstanden fortrænger. Et stålskib flyder, fordi skroget er formet, så det fortrænger rigtig meget vand i forhold til sin vægt.",
        punkter: [
          "Trykket stiger ca. 1 atm pr. 10 m vanddybde",
          "Opdrift = tyngdekraften på det fortrængte vand",
          "Flyder: opdrift kan bære tyngdekraften. Synker: den kan ikke.",
        ],
      },
    ],
    opgaver: ["g8-tryk", "g8-opdrift-mcq"],
  },

  {
    id: "8-ohms-lov",
    titel: "Ohms lov og modstand",
    ikon: "🔌",
    kort: "Spænding, strømstyrke og resistans — U = R · I.",
    niveau: "8kl",
    omraade: "el",
    maal: [
      "Forklare begreberne spænding (V), strømstyrke (A) og resistans (Ω)",
      "Beregne med Ohms lov U = R · I",
      "Måle spænding og strømstyrke i et kredsløb",
      "Beregne den samlede resistans i en serieforbindelse",
    ],
    teori: [
      {
        overskrift: "Spænding, strøm og resistans",
        brod:
          "Tre størrelser beskriver et kredsløb: Spændingen U (volt) er batteriets 'tryk', der driver elektronerne rundt. Strømstyrken I (ampere) er, hvor mange elektroner der passerer pr. sekund. Resistansen R (ohm, Ω) er kredsløbets modstand mod strømmen.\nEn god huskeregel er en vandslange: spænding = vandtrykket, strømstyrke = hvor meget vand der løber, resistans = hvor snæver slangen er.",
        punkter: [
          "Spænding U måles i volt (V) — parallelt over komponenten",
          "Strømstyrke I måles i ampere (A) — i serie i kredsløbet",
          "Resistans R måles i ohm (Ω)",
        ],
      },
      {
        overskrift: "Ohms lov",
        brod:
          "Georg Ohm opdagede sammenhængen: spændingen over en modstand er resistansen gange strømstyrken. Kender du to af størrelserne, kan du altid beregne den tredje.\nI en serieforbindelse lægges resistanserne sammen: R = R1 + R2.",
        formler: [
          {
            udtryk: "U = R · I",
            navn: "Ohms lov",
            forklaring: "U: spænding (V), R: resistans (Ω), I: strømstyrke (A)",
          },
          { udtryk: "I = U / R", navn: "Strømstyrke" },
          { udtryk: "R = U / I", navn: "Resistans" },
          { udtryk: "R = R1 + R2", navn: "Serieforbindelse" },
        ],
        eksempel: {
          titel: "Pæren",
          tekst:
            "En pære med resistansen 20 Ω sidder på et 6 V-batteri: I = 6 V / 20 Ω = 0,3 A.",
        },
      },
    ],
    opgaver: ["g8-ohm", "g8-serie-resistans"],
  },

  {
    id: "8-el-energi",
    titel: "Elektrisk energi i hjemmet",
    ikon: "💡",
    kort: "Effekt, kilowatt-timer og hvad strømmen koster.",
    niveau: "8kl",
    omraade: "energi",
    maal: [
      "Beregne elektrisk effekt med P = U · I",
      "Beregne energiforbrug i kilowatt-timer (kWh)",
      "Beregne prisen for at bruge et apparat",
      "Forklare hvorfor der er sikringer i el-installationen",
    ],
    teori: [
      {
        overskrift: "Effekt",
        brod:
          "Effekt er, hvor meget energi et apparat omsætter pr. sekund, og måles i watt (W). Effekten kan beregnes som spænding gange strømstyrke. En elkedel på 2000 W bruger altså 2000 joule hvert sekund.",
        formler: [
          {
            udtryk: "P = U · I",
            navn: "Elektrisk effekt",
            forklaring: "P: effekt (W), U: spænding (V), I: strømstyrke (A)",
          },
        ],
        eksempel: {
          titel: "Elkedlen",
          tekst: "Elkedlen på 230 V trækker 8,7 A: P = 230 V · 8,7 A ≈ 2000 W = 2 kW.",
        },
      },
      {
        overskrift: "Kilowatt-timer og elprisen",
        brod:
          "På elregningen måles energi i kilowatt-timer: 1 kWh er den energi, et apparat på 1 kW bruger på 1 time. Energien beregnes som effekt (i kW) gange tid (i timer). Ganger man med elprisen (fx 2,50 kr. pr. kWh), får man, hvad det koster.\nSikringer beskytter installationen: trækker man for meget strøm i én gruppe, bliver ledningerne varme — og sikringen afbryder, før der går ild i noget.",
        formler: [
          {
            udtryk: "E = P · t",
            navn: "Elektrisk energi",
            forklaring: "E i kWh, når P er i kW og t i timer",
          },
          { udtryk: "pris = E · kWh-pris", navn: "Elprisen" },
        ],
        eksempel: {
          titel: "Gaming-pc'en",
          tekst:
            "En pc på 0,4 kW kører 5 timer: E = 0,4 kW · 5 t = 2 kWh. Ved 2,50 kr./kWh koster det 5,00 kr.",
        },
      },
    ],
    opgaver: ["g8-effekt", "g8-kwh", "g8-elpris"],
  },

  {
    id: "8-lyd-boelger",
    titel: "Lyd og bølger",
    ikon: "🎵",
    kort: "Frekvens, bølgelængde og bølgeformlen v = f · λ.",
    niveau: "8kl",
    omraade: "boelger",
    maal: [
      "Beskrive en bølge med frekvens, bølgelængde og amplitude",
      "Beregne med bølgeformlen v = f · λ",
      "Forklare sammenhængen mellem frekvens og tonehøjde",
      "Kende menneskets høreområde (ca. 20 Hz – 20.000 Hz)",
    ],
    teori: [
      {
        overskrift: "Bølgens sprog",
        brod:
          "En bølge beskrives med tre størrelser: Frekvensen f (hertz, Hz) er antal svingninger pr. sekund. Bølgelængden λ (lambda, meter) er afstanden fra bølgetop til bølgetop. Amplituden er svingningens størrelse.\nFor lyd gælder: høj frekvens = lys tone, lav frekvens = dyb tone. Stor amplitude = kraftig lyd. Mennesker kan høre fra ca. 20 Hz til 20.000 Hz — flagermus og hunde hører langt højere frekvenser.",
        punkter: [
          "Frekvens f: svingninger pr. sekund (Hz) → tonehøjde",
          "Bølgelængde λ: afstand mellem to bølgetoppe (m)",
          "Amplitude: svingningens størrelse → lydstyrke",
        ],
      },
      {
        overskrift: "Bølgeformlen",
        brod:
          "Bølgens fart er frekvens gange bølgelængde. For lyd i luft er farten ca. 343 m/s — så kender du frekvensen, kan du beregne bølgelængden, og omvendt. Svingningstiden (perioden) T er tiden for én svingning og er én divideret med frekvensen.",
        formler: [
          {
            udtryk: "v = f · λ",
            navn: "Bølgeformlen",
            forklaring: "v: bølgefart (m/s), f: frekvens (Hz), λ: bølgelængde (m)",
          },
          { udtryk: "T = 1 / f", navn: "Svingningstid" },
        ],
        eksempel: {
          titel: "Kammertonen",
          tekst:
            "Kammertonen a har frekvensen 440 Hz. Bølgelængde i luft: λ = 343 m/s / 440 Hz ≈ 0,78 m.",
        },
      },
    ],
    opgaver: ["g8-boelgefart", "g8-frekvens-periode"],
  },

  {
    id: "8-varme-vejr",
    titel: "Varmetransport og vejr",
    ikon: "🌦️",
    kort: "Varmeledning, varmestrømning og varmestråling — og fysikken bag vejret.",
    niveau: "8kl",
    omraade: "termo",
    maal: [
      "Beskrive de tre former for varmetransport",
      "Forklare hvordan isolering virker",
      "Forklare hvordan skyer og vind opstår",
      "Beskrive drivhuseffekten fysisk",
    ],
    teori: [
      {
        overskrift: "Tre måder varme flytter sig på",
        brod:
          "Varmeledning sker i faste stoffer: partiklerne skubber energien videre fra nabo til nabo — derfor bliver grydeskeen af metal hurtig varm. Varmestrømning (konvektion) sker i væsker og gasser: varm luft udvider sig, bliver lettere og stiger op. Varmestråling er infrarødt lys og kræver intet stof — sådan når solens varme os gennem det tomme rum.\nIsolering (uld, flamingo, hulmur) virker ved at fange stillestående luft — luft leder varme meget dårligt.",
        punkter: [
          "Ledning: i faste stoffer (metal leder godt)",
          "Strømning: varm luft/vand stiger op",
          "Stråling: infrarød stråling — virker gennem vakuum",
        ],
      },
      {
        overskrift: "Vejrets fysik",
        brod:
          "Solen opvarmer jordoverfladen ujævnt. Varm luft stiger til vejrs (konvektion), afkøles i højden, og vanddampen fortættes til små dråber — en sky. Vind er luft, der strømmer fra højtryk mod lavtryk.\nDrivhuseffekten: atmosfærens drivhusgasser (bl.a. CO₂ og vanddamp) lader solens synlige lys passere ind, men absorberer en del af den infrarøde varmestråling på vej ud. Uden drivhuseffekt ville Jorden være ca. 33 grader koldere — men øges gasserne, stiger temperaturen.",
        eksempel: {
          titel: "Termikken",
          tekst:
            "Svævefly og rovfugle bruger 'termik' — bobler af varm, opstigende luft over solopvarmede marker — til at vinde højde uden motor.",
        },
      },
    ],
    opgaver: ["g8-varmetransport-mcq", "g8-vejr-mcq"],
  },
];
