// Datamodel for fysik-faget (7. klasse -> Fysik A / 3.g).
// Modellen er bevidst indholds-drevet: alt pensum ligger som data i src/fysik/emner/*,
// og opgaver genereres parametrisk via generatorer i src/fysik/opgaver/*.

export type NiveauId = "7kl" | "8kl" | "9kl" | "fysikC" | "fysikB" | "fysikA";

export type OmraadeId =
  | "metode"
  | "mekanik"
  | "energi"
  | "el"
  | "boelger"
  | "termo"
  | "atom"
  | "astro"
  | "moderne";

export type Niveau = {
  id: NiveauId;
  navn: string;
  kort: string;
  beskrivelse: string;
};

export type Omraade = {
  id: OmraadeId;
  navn: string;
  farve: string;
};

export type Formel = {
  udtryk: string;
  navn: string;
  forklaring?: string;
};

export type Eksempel = {
  titel: string;
  tekst: string;
};

export type TeoriAfsnit = {
  overskrift: string;
  brod: string;
  punkter?: string[];
  formler?: Formel[];
  eksempel?: Eksempel;
};

export type FysikEmne = {
  id: string;
  titel: string;
  ikon: string;
  kort: string;
  niveau: NiveauId;
  omraade: OmraadeId;
  maal: string[];
  teori: TeoriAfsnit[];
  /** Ids på opgavegeneratorer (se src/fysik/opgaver). */
  opgaver: string[];
};

// Opgavemodel: enten numerisk svar (auto-rettes med tolerance) eller multiple choice.
export type TalOpgave = {
  svarType: "tal";
  tekst: string;
  enhed?: string;
  facit: number;
  /** Relativ tolerance i procent (default 2 %). */
  tolerancePct?: number;
  hint: string;
  loesning: string;
};

export type ValgOpgave = {
  svarType: "valg";
  tekst: string;
  valg: string[];
  korrektValg: number;
  hint: string;
  loesning: string;
};

export type Opgave = TalOpgave | ValgOpgave;

export type OpgaveGenerator = {
  id: string;
  titel: string;
  lav: () => Opgave;
};
