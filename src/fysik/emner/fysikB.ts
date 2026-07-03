import type { FysikEmne } from "../model";

// Fysik B (typisk 2.g) — jf. læreplanens kernestof.
export const EMNER_FYSIK_B: FysikEmne[] = [
  {
    id: "b-kinematik",
    titel: "Kinematik: bevægelse med konstant acceleration",
    ikon: "📈",
    kort: "Bevægelsesligningerne, (t,v)-grafer og frit fald.",
    niveau: "fysikB",
    omraade: "mekanik",
    maal: [
      "Anvende bevægelsesligningerne for konstant acceleration",
      "Aflæse fart og strækning på (t,v)-grafer",
      "Beregne faldtid og slutfart for frit fald",
      "Skelne mellem middelfart og øjeblikkelig fart",
    ],
    teori: [
      {
        overskrift: "Bevægelsesligningerne",
        brod:
          "Ved konstant acceleration a vokser farten lineært, og strækningen kvadratisk med tiden. De to centrale ligninger er v = v₀ + a·t og s = v₀·t + ½·a·t². På en (t,v)-graf er accelerationen hældningen, og strækningen er arealet under grafen.",
        formler: [
          { udtryk: "v = v₀ + a · t", navn: "Fart", forklaring: "v₀: startfart (m/s), a: acceleration (m/s²)" },
          { udtryk: "s = v₀ · t + ½ · a · t²", navn: "Strækning" },
          { udtryk: "v² = v₀² + 2 · a · s", navn: "Tidsløs ligning" },
        ],
        eksempel: {
          titel: "Bilen accelererer",
          tekst:
            "En bil accelererer fra hvile med 3 m/s² i 8 s: v = 0 + 3 · 8 = 24 m/s, og s = ½ · 3 · 8² = 96 m.",
        },
      },
      {
        overskrift: "Frit fald",
        brod:
          "Ser man bort fra luftmodstand, falder alle genstande med samme acceleration, tyngdeaccelerationen g = 9,82 m/s². Galilei indså det først: en hammer og en fjer falder lige hurtigt — det blev demonstreret på Månen under Apollo 15.\nFor fald fra hvile gælder: faldhøjden h = ½·g·t² og slutfarten v = g·t = √(2·g·h).",
        formler: [
          { udtryk: "h = ½ · g · t²", navn: "Faldhøjde", forklaring: "g = 9,82 m/s²" },
          { udtryk: "v = √(2 · g · h)", navn: "Slutfart efter fald" },
        ],
        eksempel: {
          titel: "Fald fra 10-metervippen",
          tekst: "t = √(2h/g) = √(2 · 10 / 9,82) ≈ 1,4 s, og v = √(2 · 9,82 · 10) ≈ 14 m/s ≈ 50 km/t.",
        },
      },
    ],
    opgaver: ["gb-jaevn-acc", "gb-straekning-acc", "gb-fritfald"],
  },

  {
    id: "b-dynamik",
    titel: "Newtons love og kraftanalyse",
    ikon: "🧮",
    kort: "Resulterende kraft, gnidning og normalkraft — kraftanalyser der virker.",
    niveau: "fysikB",
    omraade: "mekanik",
    maal: [
      "Opstille kraftdiagrammer (frit legeme-diagram)",
      "Beregne den resulterende kraft og accelerationen",
      "Regne med gnidningskraft Fg = µ · Fn",
      "Anvende Newtons love kvantitativt på hverdagssituationer",
    ],
    teori: [
      {
        overskrift: "Kraftanalyse og resulterende kraft",
        brod:
          "Første skridt i enhver mekanikopgave er kraftanalysen: tegn genstanden og alle kræfter på den — tyngdekraft, normalkraft, træk, gnidning, luftmodstand. Den resulterende kraft er summen af alle kræfter (med fortegn), og Newtons 2. lov giver accelerationen: F_res = m · a.\nEr F_res = 0, er genstanden i hvile eller bevæger sig med konstant fart (1. lov).",
        formler: [
          { udtryk: "F_res = m · a", navn: "Newtons 2. lov" },
          { udtryk: "F_res = F_frem − F_mod", navn: "Resulterende kraft (1D)" },
        ],
        eksempel: {
          titel: "Kassen trækkes",
          tekst:
            "En kasse på 20 kg trækkes med 90 N, gnidningen er 50 N: F_res = 40 N, så a = 40/20 = 2 m/s².",
        },
      },
      {
        overskrift: "Gnidning og normalkraft",
        brod:
          "Normalkraften Fn er underlagets tryk vinkelret på fladen — på vandret underlag er Fn = m · g. Gnidningskraften er proportional med normalkraften: Fg = µ · Fn, hvor gnidningskoefficienten µ afhænger af materialerne (gummi mod tør asfalt: µ ≈ 0,7; stål mod is: µ ≈ 0,02).\nDet forklarer bremselængder: på våd eller isglat vej falder µ — og bremselængden vokser dramatisk.",
        formler: [
          { udtryk: "Fg = µ · Fn", navn: "Gnidningskraft", forklaring: "µ: gnidningskoefficient (uden enhed)" },
          { udtryk: "Fn = m · g", navn: "Normalkraft på vandret underlag" },
        ],
      },
    ],
    opgaver: ["gb-resulterende", "gb-gnidning", "g9-newton2"],
  },

  {
    id: "b-arbejde-energi",
    titel: "Arbejde og mekanisk energi",
    ikon: "🎢",
    kort: "Arbejde, kinetisk og potentiel energi — og energibevarelse i praksis.",
    niveau: "fysikB",
    omraade: "energi",
    maal: [
      "Beregne mekanisk arbejde W = F · s",
      "Beregne kinetisk og potentiel energi",
      "Anvende den mekaniske energibevarelsessætning",
      "Beregne effekt som arbejde pr. tid",
    ],
    teori: [
      {
        overskrift: "Arbejde og energi",
        brod:
          "I fysikken udfører en kraft et arbejde, når den flytter noget: W = F · s (kraft gange vej i kraftens retning), målt i joule. Arbejde er energioverførsel — løfter du en kasse, omsættes dit arbejde til potentiel energi.\nKinetisk energi (bevægelsesenergi): E_kin = ½·m·v². Bemærk kvadratet: dobbelt fart giver fire gange så meget energi — derfor er høj fart så farlig i trafikken.",
        formler: [
          { udtryk: "W = F · s", navn: "Arbejde", forklaring: "W: arbejde (J), F: kraft (N), s: vej (m)" },
          { udtryk: "E_kin = ½ · m · v²", navn: "Kinetisk energi" },
          { udtryk: "E_pot = m · g · h", navn: "Potentiel energi", forklaring: "h: højde over nulniveau (m)" },
        ],
        eksempel: {
          titel: "Cyklen i fart",
          tekst: "Cyklist på 80 kg med 5 m/s: E_kin = ½ · 80 · 5² = 1000 J.",
        },
      },
      {
        overskrift: "Mekanisk energibevarelse",
        brod:
          "Uden gnidning er den mekaniske energi (kinetisk + potentiel) bevaret: E_kin + E_pot = konstant. I en rutsjebane veksles der frem og tilbage: øverst mest potentiel, nederst mest kinetisk energi. Med gnidning 'forsvinder' mekanisk energi til varme — og energiregnskabet fortæller præcis hvor meget.\nDeraf følger den nyttige formel for fart efter et fald (eller ned ad en bakke uden gnidning): v = √(2·g·h).",
        formler: [
          { udtryk: "½·m·v² + m·g·h = konstant", navn: "Mekanisk energibevarelse" },
          { udtryk: "P = W / t", navn: "Effekt" },
        ],
        eksempel: {
          titel: "Rutsjebanen",
          tekst:
            "Et tog slippes fra 20 m: v = √(2 · 9,82 · 20) ≈ 19,8 m/s ≈ 71 km/t — uanset togets masse.",
        },
      },
    ],
    opgaver: ["gb-arbejde", "gb-ekin", "gb-epot", "gb-energibevarelse"],
  },

  {
    id: "b-tryk-gasser",
    titel: "Tryk og gasser",
    ikon: "🎈",
    kort: "Tryk i væsker, idealgasloven og gassers tilstandsændringer.",
    niveau: "fysikB",
    omraade: "termo",
    maal: [
      "Beregne tryk i væsker med p = ρ · g · h",
      "Anvende idealgasloven p · V = n · R · T",
      "Forklare sammenhænge mellem tryk, rumfang og temperatur",
      "Regne med absolut temperatur i kelvin",
    ],
    teori: [
      {
        overskrift: "Tryk i væsker",
        brod:
          "Trykket i en væske vokser lineært med dybden: p = ρ · g · h oven i atmosfæretrykket (ca. 101 kPa ved havoverfladen). I 10 m vanddybde er det ekstra tryk ρ·g·h = 1000 · 9,82 · 10 ≈ 98 kPa — altså cirka én ekstra atmosfære, præcis som dykkere lærer det.",
        formler: [
          { udtryk: "p = ρ · g · h", navn: "Væsketryk", forklaring: "ρ: densitet (kg/m³), h: dybde (m)" },
          { udtryk: "p₀ ≈ 101 kPa", navn: "Atmosfæretryk ved havoverfladen" },
        ],
      },
      {
        overskrift: "Idealgasloven",
        brod:
          "For en gas hænger tryk, rumfang og temperatur sammen i én elegant ligning: p·V = n·R·T, hvor n er stofmængden i mol og R gaskonstanten. Temperaturen skal altid være i kelvin!\nSpecialtilfælde: ved fast temperatur er p·V konstant (Boyle-Mariotte — klem en ballon, og trykket stiger); ved fast rumfang er p/T konstant (derfor stiger dæktrykket, når dækket bliver varmt).",
        formler: [
          {
            udtryk: "p · V = n · R · T",
            navn: "Idealgasloven",
            forklaring: "p: tryk (Pa), V: rumfang (m³), n: stofmængde (mol), R = 8,31 J/(mol·K), T: temperatur (K)",
          },
          { udtryk: "T = t + 273,15", navn: "Kelvin" },
        ],
        eksempel: {
          titel: "Luften i klasselokalet",
          tekst:
            "1 mol gas ved 101 kPa og 293 K: V = nRT/p = 1 · 8,31 · 293 / 101000 ≈ 0,024 m³ = 24 L.",
        },
      },
    ],
    opgaver: ["gb-vandtryk", "gb-idealgas", "g7-kelvin"],
  },

  {
    id: "b-el-kredsloeb2",
    titel: "Elektriske kredsløb II",
    ikon: "🔧",
    kort: "Resistivitet, indre resistans og energiomsætning i kredsløb.",
    niveau: "fysikB",
    omraade: "el",
    maal: [
      "Beregne en leders resistans ud fra resistivitet, længde og tværsnitsareal",
      "Forklare og regne med et batteris indre resistans",
      "Beregne effektafsættelse med P = U·I, P = R·I² og P = U²/R",
      "Analysere blandede kredsløb",
    ],
    teori: [
      {
        overskrift: "Resistivitet — ledningens egen modstand",
        brod:
          "En leders resistans afhænger af materialet og geometrien: R = ρ · L / A. Lang og tynd ledning giver stor resistans; kort og tyk giver lille. Kobbers resistivitet er kun 1,7 · 10⁻⁸ Ω·m — derfor er elledninger af kobber.\nEffektafsættelsen i en modstand kan skrives på tre måder: P = U·I = R·I² = U²/R. Formen R·I² viser, hvorfor varmetabet i en ledning vokser med kvadratet på strømmen.",
        formler: [
          {
            udtryk: "R = ρ · L / A",
            navn: "Resistans af leder",
            forklaring: "ρ: resistivitet (Ω·m), L: længde (m), A: tværsnitsareal (m²)",
          },
          { udtryk: "P = R · I² = U² / R", navn: "Effektafsættelse" },
        ],
        eksempel: {
          titel: "Kobberledningen",
          tekst:
            "10 m kobbertråd med tværsnit 1,0 mm² (= 1,0 · 10⁻⁶ m²): R = 1,7 · 10⁻⁸ · 10 / 10⁻⁶ = 0,17 Ω.",
        },
      },
      {
        overskrift: "Indre resistans",
        brod:
          "Et rigtigt batteri har en indre resistans Ri. Når der trækkes strøm, 'tabes' der spænding inde i batteriet, og polspændingen bliver lavere end den elektromotoriske kraft (emk) ε: U = ε − Ri · I.\nDet forklarer, hvorfor billygterne dæmpes, når startmotoren kører: den store startstrøm giver et stort indre spændingsfald.",
        formler: [
          {
            udtryk: "U = ε − Ri · I",
            navn: "Polspænding",
            forklaring: "ε: elektromotorisk kraft (V), Ri: indre resistans (Ω)",
          },
        ],
      },
    ],
    opgaver: ["gb-resistivitet", "gb-indre-resistans", "gc-parallel"],
  },

  {
    id: "b-boelgelaere",
    titel: "Bølgelære: interferens og gitre",
    ikon: "🎼",
    kort: "Gitterligningen, standende bølger og strengsvingninger.",
    niveau: "fysikB",
    omraade: "boelger",
    maal: [
      "Anvende gitterligningen n · λ = d · sin(θ)",
      "Bestemme lysets bølgelængde med et optisk gitter",
      "Beskrive standende bølger på en streng",
      "Beregne frekvenser af en strengs overtoner",
    ],
    teori: [
      {
        overskrift: "Gitterligningen",
        brod:
          "Sendes lys gennem et optisk gitter (tusindvis af ridser pr. mm), afbøjes det i bestemte retninger, hvor bølgerne interfererer konstruktivt: n · λ = d · sin(θ), hvor d er gitterkonstanten (afstanden mellem ridserne) og n ordenen.\nGitterforsøget er standardmetoden til at måle lysets bølgelængde — og princippet bag spektrometre fra skolelaboratoriet til rumteleskoper.",
        formler: [
          {
            udtryk: "n · λ = d · sin(θ)",
            navn: "Gitterligningen",
            forklaring: "n: orden (1, 2, ...), d: gitterkonstant (m), θ: afbøjningsvinkel",
          },
          { udtryk: "d = 1 / (ridser pr. meter)", navn: "Gitterkonstant" },
        ],
        eksempel: {
          titel: "Laser gennem gitter",
          tekst:
            "Et gitter med 600 ridser/mm (d = 1,67 µm) afbøjer 1. orden ved 22,3°: λ = d · sin(θ) = 1,67 µm · 0,379 ≈ 633 nm — en rød HeNe-laser.",
        },
      },
      {
        overskrift: "Standende bølger",
        brod:
          "På en guitarstreng løber bølger frem og tilbage og danner standende bølger med knuder (stille punkter) og buge. Kun bestemte bølgelængder passer: λn = 2L/n. Grundtonen (n = 1) har én bug; overtonerne har flere.\nFrekvensen følger af bølgeformlen: fn = n · v / (2L). Strammere streng → større bølgefart → højere tone. Sådan stemmer man en guitar.",
        formler: [
          { udtryk: "λn = 2 · L / n", navn: "Standende bølge på streng", forklaring: "L: strenglængde, n: 1, 2, 3, ..." },
          { udtryk: "fn = n · v / (2 · L)", navn: "Egenfrekvenser" },
        ],
      },
    ],
    opgaver: ["gb-gitter", "gb-standende"],
  },

  {
    id: "b-atom-kerne",
    titel: "Atom- og kernefysik B",
    ikon: "⚛️",
    kort: "Energiniveauer, fotonovergange og aktivitet — nu kvantitativt.",
    niveau: "fysikB",
    omraade: "atom",
    maal: [
      "Beregne fotonens energi og bølgelængde ved elektronovergange",
      "Anvende henfaldskonstanten og A = k · N",
      "Bestemme halveringstid ud fra måledata",
      "Forklare fission og fusion som energikilder",
    ],
    teori: [
      {
        overskrift: "Energiniveauer og fotonovergange",
        brod:
          "Atomets elektroner kan kun have bestemte energier. Ved et spring fra niveau E₂ ned til E₁ udsendes en foton med energien ΔE = E₂ − E₁, og bølgelængden fås af λ = 1240/ΔE (nm, når ΔE er i eV).\nOmvendt kan atomet kun absorbere fotoner, der præcis matcher et energispring — derfor er absorptionslinjerne i Solens spektrum mørke ved nøjagtig de bølgelængder, grundstofferne i solatmosfæren 'spiser'.",
        formler: [
          { udtryk: "ΔE = E₂ − E₁ = h · f", navn: "Fotonovergang" },
          { udtryk: "λ [nm] = 1240 / ΔE [eV]", navn: "Bølgelængde af foton" },
        ],
        eksempel: {
          titel: "Hydrogens røde linje",
          tekst:
            "Springet fra n=3 til n=2 i brint frigiver 1,89 eV: λ = 1240/1,89 ≈ 656 nm — den karakteristiske røde H-alfa-linje.",
        },
      },
      {
        overskrift: "Aktivitet og henfaldskonstant",
        brod:
          "Aktiviteten er proportional med antallet af radioaktive kerner: A = k · N, hvor henfaldskonstanten k = ln(2)/T½. Store k betyder hurtigt henfald og kort halveringstid.\nKernerne rummer enorme energier: fission (spaltning af tunge kerner som uran-235) driver kernekraftværker; fusion (sammensmeltning af lette kerner) driver Solen — og måske fremtidens kraftværker.",
        formler: [
          { udtryk: "A = k · N", navn: "Aktivitet", forklaring: "k: henfaldskonstant (1/s), N: antal kerner" },
          { udtryk: "k = ln(2) / T½", navn: "Henfaldskonstant" },
        ],
      },
    ],
    opgaver: ["gb-fotonovergang", "gb-aktivitet", "gc-henfald"],
  },
];
