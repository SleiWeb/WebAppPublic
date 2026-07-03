import type { FysikEmne, Niveau, NiveauId, Omraade, OmraadeId } from "./model";
import { EMNER_7KL } from "./emner/grundskole7";
import { EMNER_8KL } from "./emner/grundskole8";
import { EMNER_9KL } from "./emner/grundskole9";
import { EMNER_FYSIK_C } from "./emner/fysikC";
import { EMNER_FYSIK_B } from "./emner/fysikB";
import { EMNER_FYSIK_A } from "./emner/fysikA";

export const NIVEAUER: Niveau[] = [
  {
    id: "7kl",
    navn: "7. klasse",
    kort: "7. kl.",
    beskrivelse: "Fysikkens grundbegreber: måling, stof, el, magnetisme, lys, lyd og energi.",
  },
  {
    id: "8kl",
    navn: "8. klasse",
    kort: "8. kl.",
    beskrivelse: "Fart og kræfter, tryk og opdrift, Ohms lov, el i hjemmet, bølger og vejr.",
  },
  {
    id: "9kl",
    navn: "9. klasse",
    kort: "9. kl.",
    beskrivelse: "Radioaktivitet, energiforsyning, elektromagnetisme, universet og Newtons love — klar til naturfagsprøven.",
  },
  {
    id: "fysikC",
    navn: "Fysik C",
    kort: "1.g · C",
    beskrivelse: "Gymnasiets grundniveau: metode, energi, termofysik, el, bølger, atomer, kerner og astronomi.",
  },
  {
    id: "fysikB",
    navn: "Fysik B",
    kort: "2.g · B",
    beskrivelse: "Kinematik og dynamik, mekanisk energi, gasser, kredsløb, interferens og kvantitativ kernefysik.",
  },
  {
    id: "fysikA",
    navn: "Fysik A",
    kort: "3.g · A",
    beskrivelse: "Cirkelbevægelse og gravitation, svingninger, impuls, felter, induktion, kvantefysik, relativitet og astrofysik.",
  },
];

export const OMRAADER: Omraade[] = [
  { id: "metode", navn: "Fysikkens metode", farve: "#64748b" },
  { id: "mekanik", navn: "Kraft og bevægelse", farve: "#3b82f6" },
  { id: "energi", navn: "Energi", farve: "#10b981" },
  { id: "el", navn: "El og magnetisme", farve: "#f59e0b" },
  { id: "boelger", navn: "Bølger, lyd og lys", farve: "#8b5cf6" },
  { id: "termo", navn: "Termofysik", farve: "#ef4444" },
  { id: "atom", navn: "Atom- og kernefysik", farve: "#14b8a6" },
  { id: "astro", navn: "Astronomi", farve: "#6366f1" },
  { id: "moderne", navn: "Moderne fysik", farve: "#ec4899" },
];

export const FYSIK_EMNER: FysikEmne[] = [
  ...EMNER_7KL,
  ...EMNER_8KL,
  ...EMNER_9KL,
  ...EMNER_FYSIK_C,
  ...EMNER_FYSIK_B,
  ...EMNER_FYSIK_A,
];

export function emnerForNiveau(niveau: NiveauId): FysikEmne[] {
  return FYSIK_EMNER.filter((e) => e.niveau === niveau);
}

export function findEmne(id: string): FysikEmne | undefined {
  return FYSIK_EMNER.find((e) => e.id === id);
}

export function findNiveau(id: NiveauId): Niveau {
  return NIVEAUER.find((n) => n.id === id)!;
}

export function findOmraade(id: OmraadeId): Omraade {
  return OMRAADER.find((o) => o.id === id)!;
}

/** Næste/forrige emne inden for samme niveau (til navigation på emnesiden). */
export function naboEmner(id: string): { forrige?: FysikEmne; naeste?: FysikEmne } {
  const emne = findEmne(id);
  if (!emne) return {};
  const liste = emnerForNiveau(emne.niveau);
  const i = liste.findIndex((e) => e.id === id);
  return {
    forrige: i > 0 ? liste[i - 1] : undefined,
    naeste: i >= 0 && i < liste.length - 1 ? liste[i + 1] : undefined,
  };
}
