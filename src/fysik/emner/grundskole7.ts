import type { FysikEmne } from "../model";

// 7. klasse — fysikdelen af fysik/kemi (Fælles Mål).
export const EMNER_7KL: FysikEmne[] = [
  {
    id: "7-fysikkens-verden",
    titel: "Fysikkens verden og måling",
    ikon: "📏",
    kort: "SI-enheder, måling og hvordan fysikere undersøger verden.",
    niveau: "7kl",
    omraade: "metode",
    maal: [
      "Kende de vigtigste SI-enheder: meter, kilogram og sekund",
      "Omregne mellem enheder (fx km til m og g til kg)",
      "Beskrive hvordan man laver en fair fysisk undersøgelse",
      "Aflæse måleinstrumenter og angive resultater med enhed",
    ],
    teori: [
      {
        overskrift: "Hvad er fysik?",
        brod:
          "Fysik handler om at forstå naturens grundlæggende regler: hvorfor ting falder, hvordan lys og lyd bevæger sig, og hvad alting er lavet af. Fysikere arbejder med en fast metode: de undrer sig, opstiller en hypotese (et kvalificeret gæt), laver et forsøg, måler — og konkluderer.\nEt godt forsøg er 'fair': man ændrer kun én ting ad gangen og holder alt andet ens, så man ved hvad der forårsagede resultatet.",
        punkter: [
          "Hypotese → forsøg → måling → konklusion",
          "Ændr kun én variabel ad gangen",
          "Gentag målinger — én måling kan være en fejl",
        ],
      },
      {
        overskrift: "SI-enheder",
        brod:
          "For at alle i hele verden kan sammenligne målinger, bruger vi SI-systemet. De tre vigtigste grundenheder i grundskolen er meter (længde), kilogram (masse) og sekund (tid). Man sætter forstavelser foran enheden: kilo betyder 1000, milli betyder en tusindedel og centi en hundrededel.",
        formler: [
          { udtryk: "1 km = 1000 m", navn: "Kilo", forklaring: "kilo = tusind" },
          { udtryk: "1 m = 100 cm = 1000 mm", navn: "Centi og milli" },
          { udtryk: "1 kg = 1000 g", navn: "Masse" },
          { udtryk: "1 time = 60 min = 3600 s", navn: "Tid" },
        ],
        eksempel: {
          titel: "Omregning",
          tekst:
            "3,5 km i meter: 3,5 · 1000 m = 3500 m. Og 250 g i kilogram: 250 : 1000 = 0,25 kg.",
        },
      },
      {
        overskrift: "Måling og usikkerhed",
        brod:
          "Ingen måling er helt præcis. Aflæser du en lineal, kan du typisk kun aflæse til nærmeste millimeter. Derfor gentager fysikere målinger flere gange og bruger gennemsnittet. Husk altid at skrive enheden på dit resultat — '12' betyder ingenting, '12 cm' betyder noget.",
      },
    ],
    opgaver: ["g7-enhedsomregning", "g7-metode-mcq"],
  },

  {
    id: "7-stof-densitet",
    titel: "Stoffer, tilstandsformer og densitet",
    ikon: "🧊",
    kort: "Fast, flydende og gas — og hvorfor nogle ting flyder og andre synker.",
    niveau: "7kl",
    omraade: "termo",
    maal: [
      "Beskrive de tre tilstandsformer med partikelmodellen",
      "Kende navnene på faseovergangene (smeltning, fordampning osv.)",
      "Beregne densitet med formlen ρ = m/V",
      "Forudsige om en genstand flyder eller synker i vand",
    ],
    teori: [
      {
        overskrift: "Partikelmodellen og tilstandsformer",
        brod:
          "Alt stof består af små partikler (atomer og molekyler). I et fast stof sidder partiklerne tæt i et fast mønster og vibrerer kun. I en væske ligger de stadig tæt, men kan glide rundt mellem hinanden. I en gas flyver de frit rundt med stor fart og stor afstand.\nNår man varmer et stof op, bevæger partiklerne sig hurtigere — og stoffet kan skifte tilstandsform.",
        punkter: [
          "Fast → flydende: smeltning (is → vand ved 0 °C)",
          "Flydende → gas: fordampning/kogning (vand → damp ved 100 °C)",
          "Gas → flydende: fortætning (dug på et koldt glas)",
          "Flydende → fast: størkning (vand → is)",
        ],
      },
      {
        overskrift: "Densitet",
        brod:
          "Densitet (massefylde) fortæller, hvor meget masse der er pakket i et bestemt rumfang. Bly har høj densitet, flamingo har lav. Vand har densiteten 1,0 g/cm³ — det er nøglen til at forstå opdrift: genstande med lavere densitet end vand flyder, genstande med højere densitet synker.",
        formler: [
          {
            udtryk: "ρ = m / V",
            navn: "Densitet",
            forklaring: "ρ: densitet (g/cm³), m: masse (g), V: rumfang (cm³)",
          },
        ],
        eksempel: {
          titel: "Flyder klodsen?",
          tekst:
            "En klods vejer 120 g og fylder 200 cm³. Densitet: ρ = 120 g / 200 cm³ = 0,6 g/cm³. Det er mindre end vands 1,0 g/cm³ — så klodsen flyder.",
        },
      },
    ],
    opgaver: ["g7-densitet", "g7-flyder-mcq", "g7-tilstandsform-mcq"],
  },

  {
    id: "7-temperatur-varme",
    titel: "Temperatur og varme",
    ikon: "🌡️",
    kort: "Celsius og kelvin, varmeudvidelse og forskellen på varme og temperatur.",
    niveau: "7kl",
    omraade: "termo",
    maal: [
      "Forklare forskellen på temperatur og varme",
      "Omregne mellem grader celsius og kelvin",
      "Forklare hvorfor stoffer udvider sig, når de opvarmes",
      "Kende vands smeltepunkt og kogepunkt",
    ],
    teori: [
      {
        overskrift: "Temperatur er partikelbevægelse",
        brod:
          "Temperatur er et mål for, hvor hurtigt stoffets partikler bevæger sig. Varme er derimod energi, der flytter sig fra noget varmt til noget koldt. Ved −273,15 °C står partiklerne (næsten) helt stille — det kaldes det absolutte nulpunkt, og det er nulpunktet på kelvinskalaen.",
        formler: [
          { udtryk: "T = t + 273", navn: "Celsius → kelvin", forklaring: "T i kelvin, t i °C (afrundet)" },
          { udtryk: "t = T − 273", navn: "Kelvin → celsius" },
        ],
        eksempel: {
          titel: "Stuetemperatur i kelvin",
          tekst: "20 °C = 20 + 273 K = 293 K. Og vands kogepunkt: 100 °C = 373 K.",
        },
      },
      {
        overskrift: "Varmeudvidelse",
        brod:
          "Når et stof opvarmes, vibrerer partiklerne kraftigere og skubber hinanden lidt længere væk — stoffet udvider sig. Derfor har broer udvidelsesfuger, og derfor stiger væsken i et gammeldags termometer. Vand er en vigtig undtagelse: det udvider sig, når det fryser til is, og derfor flyder is oven på vand.",
        punkter: [
          "Fast stof, væske og gas udvider sig alle ved opvarmning",
          "Gas udvider sig mest, fast stof mindst",
          "Is fylder mere end vand — derfor flyder isbjerge",
        ],
      },
    ],
    opgaver: ["g7-kelvin", "g7-varme-mcq"],
  },

  {
    id: "7-magnetisme",
    titel: "Magnetisme",
    ikon: "🧲",
    kort: "Nord- og sydpoler, magnetfelter og Jordens kompas.",
    niveau: "7kl",
    omraade: "el",
    maal: [
      "Beskrive hvordan magnetpoler tiltrækker og frastøder hinanden",
      "Tegne og beskrive magnetfeltet omkring en stangmagnet",
      "Forklare hvordan et kompas virker",
      "Beskrive hvad en elektromagnet er",
    ],
    teori: [
      {
        overskrift: "Poler og kræfter",
        brod:
          "Enhver magnet har en nordpol og en sydpol — de kan ikke skilles ad: deler du en magnet, får du to nye magneter med hver deres to poler. Reglen er enkel: modsatte poler tiltrækker hinanden, ens poler frastøder hinanden. Magnetkraften virker uden berøring, gennem luft, vand og de fleste materialer.",
        punkter: [
          "Nord–syd: tiltrækning",
          "Nord–nord og syd–syd: frastødning",
          "Kun jern, nikkel og kobolt tiltrækkes af magneter",
        ],
      },
      {
        overskrift: "Magnetfelt og kompas",
        brod:
          "Rummet omkring en magnet, hvor magnetkraften virker, kaldes magnetfeltet. Man tegner det med feltlinjer, der går fra nordpol til sydpol. Jorden er selv en kæmpe magnet — dens magnetfelt får kompasnålen (en lille magnet) til at pege mod nord.\nEn elektromagnet er en spole af ledning omkring en jernkerne: når der løber strøm, bliver den magnetisk — og den kan tændes og slukkes.",
        eksempel: {
          titel: "Skrotpladsens kran",
          tekst:
            "Kranen på en skrotplads bruger en elektromagnet: tænd strømmen for at løfte bilen, sluk for at slippe den igen.",
        },
      },
    ],
    opgaver: ["g7-magnet-mcq", "g7-elektromagnet-mcq"],
  },

  {
    id: "7-el-kredsloeb",
    titel: "Det elektriske kredsløb",
    ikon: "🔋",
    kort: "Strømkredse, ledere og isolatorer, serie- og parallelforbindelser.",
    niveau: "7kl",
    omraade: "el",
    maal: [
      "Bygge og tegne et lukket kredsløb med batteri, ledning og pære",
      "Skelne mellem ledere og isolatorer",
      "Kende forskellen på serie- og parallelforbindelse",
      "Bruge kredsløbssymboler for batteri, pære og kontakt",
    ],
    teori: [
      {
        overskrift: "Et lukket kredsløb",
        brod:
          "Elektrisk strøm er elektroner, der bevæger sig gennem en leder. Strømmen løber kun, hvis kredsløbet er lukket — dvs. der er en ubrudt vej fra batteriets ene pol gennem pæren og tilbage til den anden pol. En kontakt virker ved at bryde eller lukke denne vej.\nMaterialer, der leder strøm, kaldes ledere (alle metaller, fx kobber). Materialer, der ikke leder, kaldes isolatorer (plast, gummi, glas, træ).",
        punkter: [
          "Strøm kræver et lukket kredsløb",
          "Ledere: kobber, jern, aluminium, sølv",
          "Isolatorer: plast, gummi, glas, porcelæn",
        ],
      },
      {
        overskrift: "Serie og parallel",
        brod:
          "I en serieforbindelse sidder pærerne på samme 'vej' efter hinanden: går én pære i stykker, slukker alle. I en parallelforbindelse har hver pære sin egen gren: går én i stykker, lyser resten videre. Derfor er stikkontakterne i dit hjem parallelforbundne.",
        eksempel: {
          titel: "Lyskæden",
          tekst:
            "En gammeldags lyskæde er serieforbundet — én sprunget pære slukker hele kæden. Moderne lyskæder er parallelforbundne, så resten lyser videre.",
        },
      },
    ],
    opgaver: ["g7-leder-mcq", "g7-kredsloeb-mcq"],
  },

  {
    id: "7-lyd-lys",
    titel: "Lys og lyd",
    ikon: "🔦",
    kort: "Lysets fart, skygger og refleksion — og lyd som svingninger i luften.",
    niveau: "7kl",
    omraade: "boelger",
    maal: [
      "Beskrive at lys bevæger sig i rette linjer og forklare skygger",
      "Beskrive refleksion i et spejl",
      "Forklare at lyd er svingninger, der kræver et stof at bevæge sig i",
      "Beregne afstande med lydens fart (ca. 343 m/s)",
    ],
    teori: [
      {
        overskrift: "Lys bevæger sig i rette linjer",
        brod:
          "Lys udbreder sig i rette linjer med den ufattelige fart 300.000 km/s. Fordi lyset går lige ud, opstår der skygge bag en genstand, der blokerer det. Rammer lys et spejl, kastes det tilbage (refleksion) — og indfaldsvinklen er altid lig udfaldsvinklen.",
        punkter: [
          "Lysets fart: ca. 300.000 km/s (intet er hurtigere)",
          "Skygge = området hvor lyset er blokeret",
          "Refleksion: indfaldsvinkel = udfaldsvinkel",
        ],
      },
      {
        overskrift: "Lyd er svingninger",
        brod:
          "Lyd opstår, når noget vibrerer — en guitarstreng, dine stemmebånd, en højttalermembran. Vibrationerne skubber til luftens molekyler og breder sig som en bølge. Derfor kan lyd ikke bevæge sig i vakuum: i rummet er der helt stille.\nLyden bevæger sig cirka 343 m/s i luft — omkring en million gange langsommere end lys. Derfor ser du lynet, før du hører tordenen.",
        formler: [
          {
            udtryk: "afstand = fart · tid",
            navn: "Lydens vej",
            forklaring: "Lydens fart i luft: ca. 343 m/s",
          },
        ],
        eksempel: {
          titel: "Hvor langt væk er tordenvejret?",
          tekst:
            "Du tæller 3 sekunder fra lyn til torden. Afstand = 343 m/s · 3 s ≈ 1000 m. Tommelfingerregel: 3 sekunder pr. kilometer.",
        },
      },
    ],
    opgaver: ["g7-lydfart", "g7-lys-mcq"],
  },

  {
    id: "7-energi-intro",
    titel: "Energiformer og energikæder",
    ikon: "⚡",
    kort: "Energi kan ikke opstå eller forsvinde — kun skifte form.",
    niveau: "7kl",
    omraade: "energi",
    maal: [
      "Kende de vigtigste energiformer og give eksempler på dem",
      "Beskrive energiomdannelser med energikæder",
      "Formulere energibevarelsessætningen med egne ord",
      "Forklare at der ved enhver omdannelse 'tabes' energi som varme",
    ],
    teori: [
      {
        overskrift: "Energiformer",
        brod:
          "Energi er evnen til at udføre arbejde — og den findes i mange former: bevægelsesenergi (kinetisk energi), beliggenhedsenergi (potentiel energi), kemisk energi (mad, benzin, batterier), elektrisk energi, varmeenergi (termisk energi), lysenergi (strålingsenergi) og kerneenergi.",
        punkter: [
          "Bevægelsesenergi: en bold i fart",
          "Beliggenhedsenergi: vandet bag en dæmning",
          "Kemisk energi: mad, benzin, batteri",
          "Elektrisk energi: strømmen i ledningen",
          "Termisk energi: varme",
          "Strålingsenergi: sollys",
        ],
      },
      {
        overskrift: "Energikæder og energibevarelse",
        brod:
          "Energi kan aldrig opstå af ingenting eller forsvinde — den kan kun omdannes fra én form til en anden. Det kaldes energibevarelsessætningen og er en af fysikkens vigtigste love.\nEn energikæde viser omdannelserne trin for trin. Ved hvert trin ender en del af energien som varme til omgivelserne — den er ikke væk, men den er svær at bruge til noget.",
        eksempel: {
          titel: "Energikæde for en cykellygte",
          tekst:
            "Kemisk energi (din mad) → bevægelsesenergi (benene og hjulet) → elektrisk energi (dynamoen) → lys og varme (pæren).",
        },
      },
    ],
    opgaver: ["g7-energiform-mcq", "g7-energikaede-mcq"],
  },
];
