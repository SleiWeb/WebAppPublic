import type { FysikEmne } from "../model";

// Fysik C (typisk 1.g, STX/HTX/HF) — jf. læreplanens kernestof.
export const EMNER_FYSIK_C: FysikEmne[] = [
  {
    id: "c-metode-enheder",
    titel: "Fysikkens metode og enheder",
    ikon: "🔬",
    kort: "SI-systemet, tierpotenser, præfikser og betydende cifre.",
    niveau: "fysikC",
    omraade: "metode",
    maal: [
      "Regne sikkert med SI-enheder og præfikser (n, µ, m, k, M, G)",
      "Skrive tal på videnskabelig notation (tierpotenser)",
      "Angive resultater med passende antal betydende cifre",
      "Skelne mellem systematiske og tilfældige måleusikkerheder",
    ],
    teori: [
      {
        overskrift: "Tierpotenser og præfikser",
        brod:
          "Fysik spænder fra atomkerner (10⁻¹⁵ m) til universet (10²⁶ m). Derfor skriver vi tal på videnskabelig notation, a · 10ⁿ, og bruger præfikser på enhederne. Du skal kunne veksle frit: 5 mA = 0,005 A, 3 GHz = 3 · 10⁹ Hz, 650 nm = 6,5 · 10⁻⁷ m.",
        formler: [
          { udtryk: "G = 10⁹, M = 10⁶, k = 10³", navn: "Store præfikser", forklaring: "giga, mega, kilo" },
          { udtryk: "m = 10⁻³, µ = 10⁻⁶, n = 10⁻⁹", navn: "Små præfikser", forklaring: "milli, mikro, nano" },
        ],
        eksempel: {
          titel: "Omregning",
          tekst: "0,45 kW = 450 W. 25 µs = 2,5 · 10⁻⁵ s. 780 nm = 7,8 · 10⁻⁷ m.",
        },
      },
      {
        overskrift: "Betydende cifre og usikkerhed",
        brod:
          "Et måleresultat er kun så præcist som målingen bag det. Antallet af betydende cifre viser præcisionen: 2,50 m (3 betydende cifre) lover mere end 2,5 m (2 betydende cifre). Regneregel: et resultat bør ikke angives med flere betydende cifre end den mest upræcise måling.\nTilfældige usikkerheder (aflæsningsspredning) mindskes ved at gentage og tage gennemsnit; systematiske fejl (fx et forkert kalibreret instrument) gør det ikke — de skal findes og rettes.",
        punkter: [
          "2,50 har 3 betydende cifre; 0,025 har 2",
          "Gentagne målinger + gennemsnit dæmper tilfældig usikkerhed",
          "Systematiske fejl flytter alle målinger samme vej",
        ],
      },
    ],
    opgaver: ["gc-praefiks", "gc-betydende-mcq"],
  },

  {
    id: "c-energi-effekt",
    titel: "Energi, effekt og nyttevirkning",
    ikon: "⚡",
    kort: "Energiformer, effekt som energi pr. tid og virkningsgrad.",
    niveau: "fysikC",
    omraade: "energi",
    maal: [
      "Regne med energi i joule og effekt i watt",
      "Bruge sammenhængen E = P · t begge veje",
      "Beregne nyttevirkning og energitab",
      "Analysere energiomsætninger i hverdag og samfund",
    ],
    teori: [
      {
        overskrift: "Energi og effekt",
        brod:
          "Energi måles i joule (J), og effekt er energiomsætning pr. tid, målt i watt (1 W = 1 J/s). En løber, der omsætter 350.000 J på 500 s, yder altså 700 W.\nEnergibevarelsessætningen er ufravigelig: energi kan ikke skabes eller tilintetgøres, kun omdannes. Men energiens kvalitet forringes — ordnet energi (elektrisk, mekanisk) ender til sidst som uordnet varme.",
        formler: [
          { udtryk: "P = E / t", navn: "Effekt", forklaring: "P: effekt (W), E: energi (J), t: tid (s)" },
          { udtryk: "E = P · t", navn: "Energi" },
          { udtryk: "1 kWh = 3,6 · 10⁶ J", navn: "Kilowatt-time" },
        ],
        eksempel: {
          titel: "Elkedlen",
          tekst: "En elkedel på 2000 W i 90 s: E = 2000 W · 90 s = 180.000 J = 180 kJ.",
        },
      },
      {
        overskrift: "Nyttevirkning",
        brod:
          "Nyttevirkningen (virkningsgraden) η angiver, hvor stor en del af den tilførte energi der bliver til det, vi ønsker. Den er altid mindre end 1 (100 %). Effektivitet er centralt i den grønne omstilling: en varmepumpe kan flytte 3–4 gange så meget varme, som den bruger el — fordi den flytter varme frem for at producere den.",
        formler: [
          {
            udtryk: "η = E_nyttig / E_tilført",
            navn: "Nyttevirkning",
            forklaring: "Som decimaltal; gang med 100 for procent",
          },
        ],
        eksempel: {
          titel: "Elpæren vs. LED",
          tekst:
            "En glødepære omsætter kun ca. 5 % af energien til lys (η = 0,05) — en LED-pære omkring 40 %. Resten bliver varme.",
        },
      },
    ],
    opgaver: ["gc-effekt", "gc-nyttevirkning"],
  },

  {
    id: "c-termofysik",
    titel: "Termofysik",
    ikon: "🔥",
    kort: "Specifik varmekapacitet, smeltevarme og fordampningsvarme.",
    niveau: "fysikC",
    omraade: "termo",
    maal: [
      "Beregne opvarmningsenergi med Q = m · c · ΔT",
      "Regne med specifik smeltevarme og fordampningsvarme",
      "Aflæse og forklare en opvarmningskurve",
      "Forklare hvorfor vand er en effektiv varmelagrer",
    ],
    teori: [
      {
        overskrift: "Opvarmning: Q = m · c · ΔT",
        brod:
          "Skal et stof gøres varmere, kræver det energi. Den specifikke varmekapacitet c angiver, hvor meget energi der skal til for at opvarme 1 kg af stoffet 1 grad. Vand har en usædvanlig høj varmekapacitet, c = 4,18 kJ/(kg·°C) — derfor er vand godt i radiatorer og fjernvarme, og derfor dæmper havet klimaets temperaturudsving.",
        formler: [
          {
            udtryk: "Q = m · c · ΔT",
            navn: "Opvarmningsenergi",
            forklaring: "Q: energi (J), m: masse (kg), c: specifik varmekapacitet (J/(kg·°C)), ΔT: temperaturændring (°C)",
          },
          { udtryk: "c_vand = 4180 J/(kg·°C)", navn: "Vands varmekapacitet" },
        ],
        eksempel: {
          titel: "En kop te",
          tekst:
            "0,3 kg vand opvarmes fra 20 °C til 100 °C: Q = 0,3 · 4180 · 80 ≈ 100.000 J ≈ 100 kJ.",
        },
      },
      {
        overskrift: "Faseovergange: smelte- og fordampningsvarme",
        brod:
          "Under en faseovergang stiger temperaturen ikke, selvom der tilføres energi — energien bruges på at bryde bindingerne mellem molekylerne. Den specifikke smeltevarme Lf for is er 334 kJ/kg; den specifikke fordampningsvarme Lv for vand er hele 2260 kJ/kg. Det er derfor, sved køler så effektivt: fordampningen trækker store mængder energi ud af huden.",
        formler: [
          { udtryk: "Q = m · Lf", navn: "Smeltevarme", forklaring: "Is: Lf = 334 kJ/kg" },
          { udtryk: "Q = m · Lv", navn: "Fordampningsvarme", forklaring: "Vand: Lv = 2260 kJ/kg" },
        ],
        eksempel: {
          titel: "Isterninger i sodavand",
          tekst:
            "At smelte 50 g is kræver Q = 0,050 kg · 334 kJ/kg ≈ 17 kJ — energi der tages fra sodavanden, som derfor afkøles.",
        },
      },
    ],
    opgaver: ["gc-varmekapacitet", "gc-smeltevarme", "gc-fordampning"],
  },

  {
    id: "c-el-laere",
    titel: "Elektriske kredsløb",
    ikon: "🔌",
    kort: "Strøm som ladningstransport, Ohms lov, effekt samt serie- og parallelkobling.",
    niveau: "fysikC",
    omraade: "el",
    maal: [
      "Beskrive strømstyrke som ladning pr. tid, I = q/t",
      "Anvende Ohms lov og beregne elektrisk effekt og energi",
      "Beregne erstatningsresistans ved serie- og parallelkobling",
      "Udføre og fortolke målinger med amperemeter og voltmeter",
    ],
    teori: [
      {
        overskrift: "Strøm, spænding og resistans",
        brod:
          "Strømstyrken I er den ladning, der passerer et tværsnit pr. sekund: I = q/t, målt i ampere (1 A = 1 C/s). Spændingen U (volt) er energien pr. ladning, og resistansen R (ohm) forbinder dem gennem Ohms lov.\nDen elektriske effekt er P = U · I, og energien over tiden t er E = U · I · t.",
        formler: [
          { udtryk: "I = q / t", navn: "Strømstyrke", forklaring: "q: ladning (C), t: tid (s)" },
          { udtryk: "U = R · I", navn: "Ohms lov" },
          { udtryk: "P = U · I", navn: "Elektrisk effekt" },
          { udtryk: "E = U · I · t", navn: "Elektrisk energi" },
        ],
        eksempel: {
          titel: "Ladning gennem pæren",
          tekst: "Der løber 0,5 A i 60 s: q = I · t = 0,5 A · 60 s = 30 C.",
        },
      },
      {
        overskrift: "Serie- og parallelkobling",
        brod:
          "I serie løber samme strøm gennem alle komponenter, og resistanserne lægges sammen: R = R1 + R2. I parallel ligger samme spænding over grenene, og den samlede resistans bliver mindre end den mindste gren: 1/R = 1/R1 + 1/R2.\nHuskeregel: To ens modstande i parallel giver halv resistans — strømmen har fået to veje at løbe ad.",
        formler: [
          { udtryk: "R = R1 + R2", navn: "Seriekobling" },
          { udtryk: "1/R = 1/R1 + 1/R2", navn: "Parallelkobling" },
        ],
        eksempel: {
          titel: "To ens i parallel",
          tekst: "To modstande på 100 Ω i parallel: 1/R = 1/100 + 1/100 = 2/100 → R = 50 Ω.",
        },
      },
    ],
    opgaver: ["gc-ladning", "gc-parallel", "gc-elenergi", "g8-ohm"],
  },

  {
    id: "c-boelger-lyd-lys",
    titel: "Bølger, lyd og lys",
    ikon: "🌈",
    kort: "Bølgeformlen, det elektromagnetiske spektrum og interferens.",
    niveau: "fysikC",
    omraade: "boelger",
    maal: [
      "Anvende bølgeformlen v = f · λ på lyd og lys",
      "Beskrive det elektromagnetiske spektrum fra radiobølger til gammastråling",
      "Forklare interferens som overlejring af bølger",
      "Kende synligt lys' bølgelængdeområde (ca. 400–700 nm)",
    ],
    teori: [
      {
        overskrift: "Bølger — fælles sprog for lyd og lys",
        brod:
          "Alle bølger adlyder bølgeformlen v = f · λ. Lyd er en mekanisk bølge (kræver et stof, fart ca. 343 m/s i luft). Lys er en elektromagnetisk bølge, der også udbreder sig i vakuum med c = 3,00 · 10⁸ m/s.\nSynligt lys udgør kun en smal stribe af det elektromagnetiske spektrum: fra violet (ca. 400 nm) til rødt (ca. 700 nm). Uden for ligger bl.a. ultraviolet, røntgen og gamma (kortere bølgelængde) samt infrarødt, mikrobølger og radiobølger (længere).",
        formler: [
          { udtryk: "v = f · λ", navn: "Bølgeformlen" },
          { udtryk: "c = 3,00 · 10⁸ m/s", navn: "Lysets fart i vakuum" },
        ],
        eksempel: {
          titel: "Radiokanalen",
          tekst: "DR P3 sender på ca. 96,8 MHz: λ = c/f = 3,00 · 10⁸ / 96,8 · 10⁶ ≈ 3,1 m.",
        },
      },
      {
        overskrift: "Interferens",
        brod:
          "Når to bølger mødes, lægges de sammen. Mødes bølgetop med bølgetop, forstærkes de (konstruktiv interferens); mødes top med dal, udslukkes de (destruktiv interferens). Interferens er det afgørende bevis for, at lys opfører sig som en bølge — det ses tydeligt, når laserlys sendes gennem et optisk gitter og danner et mønster af lyse pletter.",
        punkter: [
          "Top + top → forstærkning (konstruktiv)",
          "Top + dal → udslukning (destruktiv)",
          "Anvendes i støjreducerende høretelefoner",
        ],
      },
    ],
    opgaver: ["gc-lysboelge", "g8-boelgefart"],
  },

  {
    id: "c-atomfysik",
    titel: "Atomer, fotoner og spektre",
    ikon: "💫",
    kort: "Bohrs atommodel, fotonenergi E = h · f og linjespektre.",
    niveau: "fysikC",
    omraade: "atom",
    maal: [
      "Beskrive Bohrs atommodel med diskrete energiniveauer",
      "Beregne fotonenergi med E = h · f",
      "Forklare hvordan emissions- og absorptionsspektre opstår",
      "Bruge spektre til at identificere grundstoffer",
    ],
    teori: [
      {
        overskrift: "Fotoner — lysets energipakker",
        brod:
          "Lys udsendes og absorberes i små energipakker, fotoner. En fotons energi er bestemt af frekvensen: E = h · f, hvor h er Plancks konstant. Blåt lys har derfor mere energifyldte fotoner end rødt lys.\nEn praktisk formel: fotonenergien i elektronvolt er E = 1240 / λ, når bølgelængden λ måles i nanometer.",
        formler: [
          {
            udtryk: "E = h · f",
            navn: "Fotonenergi",
            forklaring: "h = 6,63 · 10⁻³⁴ J·s (Plancks konstant)",
          },
          { udtryk: "E [eV] = 1240 / λ [nm]", navn: "Praktisk fotonformel" },
          { udtryk: "1 eV = 1,60 · 10⁻¹⁹ J", navn: "Elektronvolt" },
        ],
        eksempel: {
          titel: "Grøn foton",
          tekst: "Grønt lys med λ = 550 nm: E = 1240/550 ≈ 2,25 eV.",
        },
      },
      {
        overskrift: "Bohrs atommodel og spektre",
        brod:
          "I Bohrs model kan elektronen kun befinde sig i bestemte baner med bestemte energier. Hopper elektronen fra et højt til et lavt niveau, udsendes en foton med præcis energidifferensen — derfor udsender hvert grundstof sit helt eget linjespektrum, et 'fingeraftryk' af lys.\nAstronomer bruger spektre til at afgøre, hvilke grundstoffer fjerne stjerner består af — uden nogensinde at komme i nærheden af dem.",
        punkter: [
          "Elektroner findes kun i diskrete energiniveauer",
          "Emissionsspektrum: lyse linjer fra glødende gas",
          "Absorptionsspektrum: mørke linjer i kontinuert lys",
          "Hvert grundstof har sit eget linjemønster",
        ],
      },
    ],
    opgaver: ["gc-foton", "gc-spektrum-mcq"],
  },

  {
    id: "c-kernefysik",
    titel: "Kernefysik og radioaktivitet",
    ikon: "☢️",
    kort: "Henfaldstyper, henfaldsloven, aktivitet og stråledosis.",
    niveau: "fysikC",
    omraade: "atom",
    maal: [
      "Opskrive og afstemme henfaldsskemaer for alfa- og betahenfald",
      "Anvende henfaldsloven med halveringstid",
      "Regne med aktivitet i becquerel",
      "Beregne stråledosis og vurdere strålingsrisiko",
    ],
    teori: [
      {
        overskrift: "Henfald og henfaldsloven",
        brod:
          "Ustabile kerner henfalder spontant. Ved alfahenfald udsendes en heliumkerne (A falder med 4, Z med 2); ved beta-minus-henfald omdannes en neutron til en proton og en elektron udsendes (Z stiger med 1). Gammastråling er ren energi fra en kerne i exciteret tilstand.\nAntallet af tilbageværende kerner følger henfaldsloven: efter hver halveringstid T½ er halvdelen tilbage. Aktiviteten (henfald pr. sekund, becquerel) halveres i samme takt.",
        formler: [
          {
            udtryk: "N(t) = N₀ · (½)^(t/T½)",
            navn: "Henfaldsloven",
            forklaring: "T½: halveringstid, N₀: antal kerner ved t = 0",
          },
          { udtryk: "A(t) = A₀ · (½)^(t/T½)", navn: "Aktivitet", forklaring: "A måles i becquerel (Bq)" },
        ],
        eksempel: {
          titel: "Teknetium på hospitalet",
          tekst:
            "Tc-99m (T½ = 6 timer) bruges til skanninger. Efter 24 timer (4 halveringstider) er aktiviteten (½)⁴ = 1/16 af startværdien.",
        },
      },
      {
        overskrift: "Dosis og strålebeskyttelse",
        brod:
          "Absorberet dosis er strålingsenergi pr. masse: D = E/m, målt i gray (1 Gy = 1 J/kg). Den ækvivalente dosis (sievert, Sv) vægter efter strålingstype — alfastråling er fx 20 gange farligere pr. joule end gammastråling, hvis kilden er inde i kroppen.\nEn dansker modtager i gennemsnit ca. 4 mSv om året, mest fra radon i undergrunden og medicinske undersøgelser. Beskyttelse: afstand, afskærmning og kort tid.",
        formler: [
          { udtryk: "D = E / m", navn: "Absorberet dosis", forklaring: "D: dosis (Gy), E: energi (J), m: masse (kg)" },
        ],
      },
    ],
    opgaver: ["gc-henfald", "gc-dosis", "g9-neutroner"],
  },

  {
    id: "c-astronomi",
    titel: "Astronomi og verdensbilleder",
    ikon: "🔭",
    kort: "Fra det geocentriske verdensbillede til Big Bang og exoplaneter.",
    niveau: "fysikC",
    omraade: "astro",
    maal: [
      "Redegøre for udviklingen fra geocentrisk til heliocentrisk verdensbillede",
      "Beskrive Tycho Brahes og Keplers bidrag til astronomien",
      "Regne med astronomiske afstande (AU og lysår)",
      "Forklare hovedtrækkene i universets udvikling siden Big Bang",
    ],
    teori: [
      {
        overskrift: "Verdensbilledets historie",
        brod:
          "I antikken satte Ptolemæus Jorden i centrum (det geocentriske verdensbillede). Kopernikus flyttede i 1543 Solen ind i centrum, danske Tycho Brahe leverede med sine præcise målinger fra Hven datagrundlaget, og Kepler viste, at planeterne følger ellipsebaner. Newton forklarede til sidst hvorfor — med tyngdeloven.\nHistorien er et skoleeksempel på fysikkens metode: bedre målinger tvinger teorierne til at ændre sig.",
        punkter: [
          "Ptolemæus: Jorden i centrum (geocentrisk)",
          "Kopernikus: Solen i centrum (heliocentrisk)",
          "Tycho Brahe: verdens bedste målinger før kikkerten",
          "Kepler: ellipsebaner. Newton: tyngdeloven forklarer det hele",
        ],
      },
      {
        overskrift: "Afstande og universets udvikling",
        brod:
          "Inden for solsystemet måles afstande i astronomiske enheder: 1 AU er afstanden Jorden–Solen, ca. 150 mio. km. Mellem stjernerne bruges lysår. Lysets endelige fart gør teleskoper til tidsmaskiner: ser vi en galakse 60 mio. lysår væk, ser vi den, som den så ud for 60 mio. år siden.\nUniverset er 13,8 mia. år gammelt. Siden 1995 har vi fundet tusindvis af exoplaneter — planeter om andre stjerner — og jagten på liv er i fuld gang.",
        formler: [
          { udtryk: "1 AU ≈ 1,50 · 10¹¹ m", navn: "Astronomisk enhed" },
          { udtryk: "1 lysår ≈ 9,46 · 10¹⁵ m", navn: "Lysår" },
        ],
        eksempel: {
          titel: "Solens lys er gammelt",
          tekst:
            "Lyset fra Solen er 500 s undervejs: t = s/v = 1,5 · 10¹¹ m / 3,0 · 10⁸ m/s = 500 s ≈ 8,3 min.",
        },
      },
    ],
    opgaver: ["g9-lysaar", "gc-astro-mcq"],
  },
];
