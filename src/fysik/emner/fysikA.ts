import type { FysikEmne } from "../model";

// Fysik A (typisk 3.g) — jf. læreplanens kernestof.
export const EMNER_FYSIK_A: FysikEmne[] = [
  {
    id: "a-cirkel-gravitation",
    titel: "Cirkelbevægelse og gravitation",
    ikon: "🛰️",
    kort: "Centripetalkraft, Newtons tyngdelov, satellitbaner og Keplers love.",
    niveau: "fysikA",
    omraade: "mekanik",
    maal: [
      "Beregne centripetalacceleration og -kraft i jævn cirkelbevægelse",
      "Anvende Newtons gravitationslov",
      "Beregne banefart og omløbstid for satellitter",
      "Anvende Keplers 3. lov på planet- og månesystemer",
    ],
    teori: [
      {
        overskrift: "Jævn cirkelbevægelse",
        brod:
          "En genstand i jævn cirkelbevægelse har konstant fart men ændrer hele tiden retning — den accelererer mod centrum med a = v²/r. Der kræves derfor en resulterende kraft mod centrum, centripetalkraften F = m·v²/r. Det er ikke en ny kraftart, men rollen som en snorkraft, gnidning eller tyngdekraft spiller.\nSlipper kraften (snoren knækker), fortsætter genstanden ligeud ad tangenten — præcis som Newtons 1. lov kræver.",
        formler: [
          { udtryk: "a = v² / r", navn: "Centripetalacceleration", forklaring: "v: banefart (m/s), r: radius (m)" },
          { udtryk: "F = m · v² / r", navn: "Centripetalkraft" },
          { udtryk: "v = 2 · π · r / T", navn: "Banefart", forklaring: "T: omløbstid (s)" },
        ],
        eksempel: {
          titel: "Karrusellen",
          tekst: "Barn (30 kg) i karrusel, r = 4 m, v = 5 m/s: F = 30 · 25 / 4 ≈ 188 N ind mod centrum.",
        },
      },
      {
        overskrift: "Gravitation og satellitter",
        brod:
          "Newtons gravitationslov: to masser tiltrækker hinanden med F = G·M·m/r². Det er tyngdekraften, der leverer centripetalkraften i en satellitbane — sætter man de to udtryk lig hinanden, fås banefarten v = √(G·M/r).\nKeplers 3. lov følger direkte: T²/r³ er ens for alle satellitter om samme centrallegeme. ISS suser rundt på 93 min i 400 km højde; en geostationær satellit i 36.000 km højde bruger præcis ét døgn og 'hænger stille' over ækvator.",
        formler: [
          {
            udtryk: "F = G · M · m / r²",
            navn: "Newtons gravitationslov",
            forklaring: "G = 6,67 · 10⁻¹¹ N·m²/kg²",
          },
          { udtryk: "v = √(G · M / r)", navn: "Banefart i cirkelbane" },
          { udtryk: "T² / r³ = 4π² / (G·M)", navn: "Keplers 3. lov" },
        ],
        eksempel: {
          titel: "ISS' fart",
          tekst:
            "ISS: r = 6,77 · 10⁶ m, M_jord = 5,97 · 10²⁴ kg → v = √(6,67·10⁻¹¹ · 5,97·10²⁴ / 6,77·10⁶) ≈ 7,7 km/s.",
        },
      },
    ],
    opgaver: ["ga-centripetal", "ga-satellit"],
  },

  {
    id: "a-svingninger",
    titel: "Harmoniske svingninger",
    ikon: "🪀",
    kort: "Fjederpendul, snorpendul og resonans.",
    niveau: "fysikA",
    omraade: "mekanik",
    maal: [
      "Beskrive harmonisk svingning med amplitude, frekvens og svingningstid",
      "Anvende Hookes lov F = −k · x",
      "Beregne svingningstid for fjederpendul og snorpendul",
      "Forklare resonans og give eksempler",
    ],
    teori: [
      {
        overskrift: "Den harmoniske svingning",
        brod:
          "En harmonisk svingning opstår, når en genstand trækkes tilbage mod ligevægt af en kraft, der er proportional med udsvinget — som en fjeder, der følger Hookes lov F = −k·x. Bevægelsen er en sinuskurve i tiden.\nFor fjederpendulet er svingningstiden T = 2π·√(m/k): tung masse svinger langsomt, stiv fjeder hurtigt. Bemærk hvad der IKKE indgår: amplituden. Små og store svingninger tager samme tid.",
        formler: [
          { udtryk: "F = −k · x", navn: "Hookes lov", forklaring: "k: fjederkonstant (N/m), x: udsving (m)" },
          { udtryk: "T = 2π · √(m / k)", navn: "Fjederpendul" },
        ],
        eksempel: {
          titel: "Bilens affjedring",
          tekst: "Masse 0,5 kg på fjeder med k = 20 N/m: T = 2π·√(0,5/20) ≈ 1,0 s.",
        },
      },
      {
        overskrift: "Snorpendulet og resonans",
        brod:
          "Snorpendulets svingningstid afhænger kun af længden og tyngdeaccelerationen: T = 2π·√(L/g) — hverken massen eller (små) amplituder betyder noget. Det gjorde pendulet til urværkets hjerte i 300 år, og det kan bruges til at måle g.\nResonans: skubber man til et svingende system i takt med dets egenfrekvens, vokser amplituden voldsomt. Det er sådan, du sætter fart i en gynge — og derfor soldater ikke marcherer i takt over broer.",
        formler: [
          { udtryk: "T = 2π · √(L / g)", navn: "Snorpendul", forklaring: "L: snorlængde (m), g = 9,82 m/s²" },
          { udtryk: "f = 1 / T", navn: "Frekvens" },
        ],
        eksempel: {
          titel: "Foucaults pendul",
          tekst: "Et 25 m langt pendul: T = 2π·√(25/9,82) ≈ 10 s pr. svingning.",
        },
      },
    ],
    opgaver: ["ga-fjeder", "ga-pendul"],
  },

  {
    id: "a-impuls",
    titel: "Impuls og stød",
    ikon: "🎱",
    kort: "Impulsbevarelse, kraftstød og kollisioner.",
    niveau: "fysikA",
    omraade: "mekanik",
    maal: [
      "Beregne impuls p = m · v",
      "Anvende impulsbevarelsessætningen på stød",
      "Beregne middelkraft med kraftstødssætningen F · Δt = Δp",
      "Skelne mellem elastiske og uelastiske stød",
    ],
    teori: [
      {
        overskrift: "Impuls og impulsbevarelse",
        brod:
          "Impuls (bevægelsesmængde) er masse gange hastighed: p = m·v. I ethvert lukket system er den samlede impuls bevaret — det følger direkte af Newtons 3. lov og gælder ved alle stød, eksplosioner og raketopsendelser.\nVed et fuldstændig uelastisk stød hænger parterne sammen bagefter, og fælleshastigheden findes af m₁v₁ + m₂v₂ = (m₁+m₂)·v. Kinetisk energi er kun bevaret ved elastiske stød — impulsen er bevaret ved alle.",
        formler: [
          { udtryk: "p = m · v", navn: "Impuls", forklaring: "p: impuls (kg·m/s)" },
          { udtryk: "m₁v₁ + m₂v₂ = (m₁+m₂) · v", navn: "Uelastisk stød" },
        ],
        eksempel: {
          titel: "Togvognene kobles",
          tekst:
            "Vogn (2000 kg, 3 m/s) rammer holdende vogn (1000 kg): v = 2000·3 / 3000 = 2 m/s for de sammenkoblede vogne.",
        },
      },
      {
        overskrift: "Kraftstød",
        brod:
          "Kraftstødssætningen F·Δt = Δp forbinder kraft og tid med impulsændringen. Samme impulsændring kan leveres af en stor kraft i kort tid eller en lille kraft i lang tid.\nAl sikkerhedsteknologi bygger på det: airbags, kofangere, faldunderlag og cykelhjelme forlænger stødtiden Δt — og reducerer dermed kraften tilsvarende.",
        formler: [
          { udtryk: "F · Δt = Δp", navn: "Kraftstødssætningen", forklaring: "F: middelkraft (N), Δt: stødtid (s)" },
        ],
        eksempel: {
          titel: "Airbaggen",
          tekst:
            "Et hoved på 5 kg bremses fra 15 m/s. Mod rattet (Δt = 0,01 s): F = 7500 N. Mod airbag (Δt = 0,1 s): F = 750 N.",
        },
      },
    ],
    opgaver: ["ga-uelastisk", "ga-kraftstoed"],
  },

  {
    id: "a-elektriske-felter",
    titel: "Elektriske og magnetiske felter",
    ikon: "🧿",
    kort: "Coulombs lov, feltstyrke og Lorentzkraften på ladede partikler.",
    niveau: "fysikA",
    omraade: "el",
    maal: [
      "Anvende Coulombs lov på punktladninger",
      "Beregne elektrisk feltstyrke og kraft på ladning i felt",
      "Beregne Lorentzkraften F = q · v · B",
      "Beskrive cirkelbevægelsen af ladede partikler i magnetfelt",
    ],
    teori: [
      {
        overskrift: "Coulombs lov og elektriske felter",
        brod:
          "To punktladninger påvirker hinanden med kraften F = k·q₁·q₂/r² — samme matematiske form som gravitationsloven, men ufatteligt meget stærkere, og med både tiltrækning og frastødning.\nDet elektriske felt E angiver kraften pr. ladning: F = q·E. I et homogent felt (pladekondensator) er E = U/d, hvor U er spændingen og d pladeafstanden.",
        formler: [
          {
            udtryk: "F = k · q₁ · q₂ / r²",
            navn: "Coulombs lov",
            forklaring: "k = 8,99 · 10⁹ N·m²/C², q: ladning (C), r: afstand (m)",
          },
          { udtryk: "F = q · E", navn: "Kraft i elektrisk felt" },
          { udtryk: "E = U / d", navn: "Homogent felt i kondensator" },
        ],
        eksempel: {
          titel: "To små ladninger",
          tekst: "q₁ = q₂ = 1 µC i afstanden 0,1 m: F = 8,99·10⁹ · (10⁻⁶)² / 0,01 ≈ 0,9 N.",
        },
      },
      {
        overskrift: "Lorentzkraften",
        brod:
          "En ladning, der bevæger sig i et magnetfelt, mærker Lorentzkraften F = q·v·B (når v ⊥ B). Kraften står altid vinkelret på hastigheden — den ændrer kun retningen, aldrig farten — og tvinger derfor partiklen ind i en cirkelbane med radius r = m·v/(q·B).\nDet er princippet bag cyklotroner, massespektrometre og nordlys: solvindens partikler spiraler langs Jordens magnetfeltlinjer ned mod polerne.",
        formler: [
          { udtryk: "F = q · v · B", navn: "Lorentzkraften", forklaring: "B: magnetisk fluxtæthed (tesla, T)" },
          { udtryk: "r = m · v / (q · B)", navn: "Cirkelbane i magnetfelt" },
        ],
        eksempel: {
          titel: "Proton i felt",
          tekst:
            "Proton (1,67·10⁻²⁷ kg, 1,60·10⁻¹⁹ C) med v = 2·10⁶ m/s i B = 0,5 T: r = 1,67·10⁻²⁷ · 2·10⁶ / (1,60·10⁻¹⁹ · 0,5) ≈ 4,2 cm.",
        },
      },
    ],
    opgaver: ["ga-coulomb", "ga-lorentz", "ga-cirkel-bfelt"],
  },

  {
    id: "a-induktion",
    titel: "Induktion og elektromagnetisme",
    ikon: "🌀",
    kort: "Magnetisk flux, Faradays induktionslov og vekselstrøm.",
    niveau: "fysikA",
    omraade: "el",
    maal: [
      "Beregne magnetisk flux Φ = B · A",
      "Anvende Faradays induktionslov",
      "Forklare Lenz' lov og dens konsekvenser",
      "Beskrive generatorens og transformerens fysik kvantitativt",
    ],
    teori: [
      {
        overskrift: "Flux og Faradays lov",
        brod:
          "Den magnetiske flux Φ = B·A måler, hvor meget magnetfelt der 'strømmer igennem' en flade. Faradays lov: ændres fluxen gennem en spole, induceres en spænding proportional med ændringshastigheden og vindingstallet: ε = N·ΔΦ/Δt.\nLenz' lov giver retningen: den inducerede strøm modvirker altid den fluxændring, der skaber den. Derfor bremses en magnet, der falder gennem et kobberrør — og derfor virker induktionsbremser i tog og rutsjebaner.",
        formler: [
          { udtryk: "Φ = B · A", navn: "Magnetisk flux", forklaring: "Φ: flux (weber, Wb), B: fluxtæthed (T), A: areal (m²)" },
          {
            udtryk: "ε = N · ΔΦ / Δt",
            navn: "Faradays induktionslov",
            forklaring: "ε: induceret spænding (V), N: vindingstal",
          },
        ],
        eksempel: {
          titel: "Spolen i felt",
          tekst:
            "Fluxen gennem en spole med 500 vindinger ændres 0,02 Wb på 0,1 s: ε = 500 · 0,02/0,1 = 100 V.",
        },
      },
      {
        overskrift: "Vekselstrøm og elnettet",
        brod:
          "Roterer en spole i et magnetfelt, varierer fluxen sinusformet, og der induceres en vekselspænding — det er generatoren, som laver næsten al verdens elektricitet. Netspændingen i Danmark er 230 V (effektivværdi) med frekvensen 50 Hz.\nVekselstrømmens store fordel er transformeren: spænding kan nemt sættes op til transport (lavt tab, fordi P_tab = R·I²) og ned igen til forbrug.",
        punkter: [
          "Generator: rotation + induktion → vekselspænding",
          "Danmark: 230 V effektivværdi, 50 Hz",
          "Højspænding ved transport minimerer tabet R·I²",
        ],
      },
    ],
    opgaver: ["ga-flux", "ga-induceret", "g9-transformer"],
  },

  {
    id: "a-kvantefysik",
    titel: "Kvantefysik",
    ikon: "🎲",
    kort: "Fotoelektrisk effekt, de Broglie-bølger og kvantemekanikkens verden.",
    niveau: "fysikA",
    omraade: "moderne",
    maal: [
      "Forklare den fotoelektriske effekt med fotonmodellen",
      "Beregne fotoelektroners energi med E_kin = h·f − W",
      "Beregne de Broglie-bølgelængder for partikler",
      "Diskutere partikel-bølge-dualiteten og usikkerhedsrelationen",
    ],
    teori: [
      {
        overskrift: "Den fotoelektriske effekt",
        brod:
          "Lys kan slå elektroner ud af et metal — men kun hvis frekvensen er høj nok, uanset hvor kraftigt lyset er. Einstein forklarede det i 1905 (og fik Nobelprisen): lys består af fotoner med energi h·f. En elektron løsrives kun, hvis én foton bærer mindst løsrivelsesarbejdet W, og resten bliver kinetisk energi: E_kin = h·f − W.\nDermed var kvantefysikken født: lys er både bølge (interferens) og partikel (fotoner).",
        formler: [
          {
            udtryk: "E_kin = h · f − W",
            navn: "Fotoelektrisk ligning",
            forklaring: "W: løsrivelsesarbejde (metalafhængigt)",
          },
          { udtryk: "E [eV] = 1240 / λ [nm]", navn: "Fotonenergi" },
        ],
        eksempel: {
          titel: "UV på zink",
          tekst:
            "UV-lys (λ = 250 nm → E = 4,96 eV) på zink (W = 4,3 eV): E_kin = 4,96 − 4,3 ≈ 0,7 eV.",
        },
      },
      {
        overskrift: "Partikler er også bølger",
        brod:
          "de Broglie vendte dualiteten om: alt stof har en bølgelængde λ = h/p = h/(m·v). Elektroner kan interferere som bølger — det udnyttes i elektronmikroskoper, der ser detaljer langt under lysets bølgelængde.\nHeisenbergs usikkerhedsrelation sætter en principiel grænse: position og impuls kan ikke begge kendes præcist. Kvanteverdenen er grundlæggende statistisk — men dens fysik driver lasere, LED'er, solceller, MR-skannere og hele halvlederteknologien.",
        formler: [
          {
            udtryk: "λ = h / (m · v)",
            navn: "de Broglie-bølgelængde",
            forklaring: "h = 6,63 · 10⁻³⁴ J·s",
          },
        ],
        eksempel: {
          titel: "Elektronens bølgelængde",
          tekst:
            "Elektron (9,11·10⁻³¹ kg) med v = 2·10⁶ m/s: λ = 6,63·10⁻³⁴ / (9,11·10⁻³¹ · 2·10⁶) ≈ 0,36 nm — på størrelse med atomafstande i krystaller.",
        },
      },
    ],
    opgaver: ["ga-fotoelektrisk", "ga-debroglie"],
  },

  {
    id: "a-kerneenergi",
    titel: "Kerneenergi og E = mc²",
    ikon: "💥",
    kort: "Massedefekt, bindingsenergi, fission og fusion.",
    niveau: "fysikA",
    omraade: "atom",
    maal: [
      "Anvende Einsteins formel E = m · c²",
      "Beregne frigivet energi ud fra massedefekt",
      "Forklare bindingsenergikurven og hvorfor både fission og fusion frigiver energi",
      "Beskrive fysikken i et kernekraftværk og i Solen",
    ],
    teori: [
      {
        overskrift: "Massedefekt og E = mc²",
        brod:
          "En atomkerne vejer mindre end summen af sine protoner og neutroner — forskellen, massedefekten, er omdannet til bindingsenergi efter Einsteins berømte formel E = m·c². Fordi c² er enormt, rummer små masser kolossale energier: 1 gram masse svarer til 9·10¹³ J — energiforbruget i tusindvis af husstande i et år.\nPraktisk regnes i atomare enheder: 1 u omsat helt til energi giver 931,5 MeV.",
        formler: [
          { udtryk: "E = m · c²", navn: "Einsteins formel", forklaring: "c = 3,00 · 10⁸ m/s" },
          { udtryk: "E = Δm · 931,5 MeV/u", navn: "Massedefekt i atomare enheder", forklaring: "1 u = 1,66 · 10⁻²⁷ kg" },
        ],
        eksempel: {
          titel: "Deuterium + tritium",
          tekst:
            "Fusionen D + T → He + n har massedefekten 0,0189 u: E = 0,0189 · 931,5 ≈ 17,6 MeV pr. reaktion.",
        },
      },
      {
        overskrift: "Fission og fusion",
        brod:
          "Bindingsenergien pr. nukleon topper ved jern (Fe-56). Derfor frigives energi både når tunge kerner spaltes (fission — uran-235 i kernekraftværker, styret som kædereaktion med neutroner) og når lette kerner smelter sammen (fusion — brint til helium i Solen).\nFusion er den store teknologiske drøm: brændstof fra havvand, ingen langlivet affald. Anlæg som ITER og fusionsforsøg med laser arbejder på at gøre det til virkelighed.",
        punkter: [
          "Bindingsenergikurven topper ved jern",
          "Fission: tunge kerner spaltes (kernekraft i dag)",
          "Fusion: lette kerner forenes (Solen — og måske fremtiden)",
          "Kædereaktion styres med kontrolstænger og moderator",
        ],
      },
    ],
    opgaver: ["ga-massedefekt", "ga-mc2"],
  },

  {
    id: "a-relativitet",
    titel: "Speciel relativitetsteori",
    ikon: "🚀",
    kort: "Tidsforlængelse, længdeforkortning og lysfartens ukrænkelighed.",
    niveau: "fysikA",
    omraade: "moderne",
    maal: [
      "Redegøre for relativitetsteoriens to postulater",
      "Beregne gammafaktoren γ",
      "Beregne tidsforlængelse og længdeforkortning",
      "Forklare eksperimentelle beviser (myoner, GPS)",
    ],
    teori: [
      {
        overskrift: "Einsteins postulater og tidsforlængelse",
        brod:
          "Einstein byggede i 1905 hele den specielle relativitetsteori på to postulater: (1) Fysikkens love er ens i alle inertialsystemer. (2) Lysets fart i vakuum er den samme for alle iagttagere — uanset deres bevægelse.\nKonsekvensen er dramatisk: tiden går langsommere for den, der bevæger sig. Et ur i fart måles til at gå γ gange langsommere, hvor γ = 1/√(1−v²/c²). Ved hverdagsfarter er γ umærkeligt tæt på 1 — ved 87 % af lysfarten er γ = 2.",
        formler: [
          {
            udtryk: "γ = 1 / √(1 − v²/c²)",
            navn: "Gammafaktoren",
            forklaring: "v: fart, c: lysets fart",
          },
          { udtryk: "Δt = γ · Δt₀", navn: "Tidsforlængelse", forklaring: "Δt₀: egentiden (uret der er med)" },
          { udtryk: "L = L₀ / γ", navn: "Længdeforkortning" },
        ],
        eksempel: {
          titel: "Rumrejsen",
          tekst:
            "Ved v = 0,8c er γ = 1/√(1−0,64) = 1,67. En rejse, astronauten oplever som 3 år, tager 5 år set fra Jorden.",
        },
      },
      {
        overskrift: "Beviserne",
        brod:
          "Relativitet er hverdagsteknologi. Myoner dannet i 15 km højde når jordoverfladen, selvom deres levetid kun burde række til ca. 600 m — deres 'ur' går langsommere set fra os. GPS-satelliternes ure korrigeres for både speciel og generel relativitet; uden korrektionen ville positionsfejlen vokse med ca. 10 km pr. dag.\nOg E = mc² — energiens og massens ækvivalens — er selve grunden til, at Solen skinner.",
        punkter: [
          "Myoner: når jorden pga. tidsforlængelse",
          "GPS: fejlen ville vokse ~10 km/dag uden relativistisk korrektion",
          "Partikelacceleratorer regner relativistisk hver dag",
        ],
      },
    ],
    opgaver: ["ga-gamma", "ga-tidsforlaengelse"],
  },

  {
    id: "a-astrofysik",
    titel: "Astrofysik",
    ikon: "🌠",
    kort: "Stjernestråling, Wiens og Stefan-Boltzmanns love, HR-diagram og Hubbles lov.",
    niveau: "fysikA",
    omraade: "astro",
    maal: [
      "Anvende Wiens forskydningslov og Stefan-Boltzmanns lov",
      "Placere stjerner i HR-diagrammet og beskrive stjerneudvikling",
      "Anvende Hubbles lov på universets udvidelse",
      "Beregne afstande og luminositeter for stjerner",
    ],
    teori: [
      {
        overskrift: "Stjerners lys fortæller alt",
        brod:
          "En stjerne stråler tilnærmelsesvis som et sortlegeme. Wiens forskydningslov forbinder farven med overfladetemperaturen: λ_max = b/T — blålige stjerner er varme (>10.000 K), rødlige er kølige (~3000 K). Stefan-Boltzmanns lov giver den samlede udstrålede effekt: P = σ·A·T⁴.\nMed temperatur og luminositet kan stjernen placeres i Hertzsprung-Russell-diagrammet: hovedserien (brintfusion, hvor Solen ligger), røde kæmper og hvide dværge.",
        formler: [
          {
            udtryk: "λ_max = b / T",
            navn: "Wiens forskydningslov",
            forklaring: "b = 2,90 · 10⁻³ m·K, T i kelvin",
          },
          {
            udtryk: "P = σ · A · T⁴",
            navn: "Stefan-Boltzmanns lov",
            forklaring: "σ = 5,67 · 10⁻⁸ W/(m²·K⁴)",
          },
        ],
        eksempel: {
          titel: "Solens farve",
          tekst:
            "Solens overflade er 5778 K: λ_max = 2,90·10⁻³ / 5778 ≈ 502 nm — grønt lys, som blandet med resten af spektret opleves hvidgult.",
        },
      },
      {
        overskrift: "Det udvidende univers",
        brod:
          "Edwin Hubble opdagede i 1929, at galaksernes flugthastighed er proportional med deres afstand: v = H₀·d. Det er selve rummet, der udvider sig — og kører man filmen baglæns, samles alt i Big Bang for 13,8 mia. år siden.\nAfstandene måles med 'standardlys' som Cepheide-stjerner og type Ia-supernovaer. Supernovamålingerne viste i 1998, at udvidelsen accelererer — drevet af den mystiske mørke energi, som sammen med mørkt stof udgør 95 % af universet.",
        formler: [
          {
            udtryk: "v = H₀ · d",
            navn: "Hubbles lov",
            forklaring: "H₀ ≈ 70 km/s pr. Mpc (megaparsec)",
          },
        ],
        eksempel: {
          titel: "En fjern galakse",
          tekst: "En galakse 100 Mpc væk: v = 70 · 100 = 7000 km/s væk fra os.",
        },
      },
    ],
    opgaver: ["ga-wien", "ga-hubble"],
  },
];
