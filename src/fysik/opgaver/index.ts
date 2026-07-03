import type { Opgave, OpgaveGenerator } from "../model";
import { GENERATORER_GRUNDSKOLE } from "./grundskole";
import { GENERATORER_FYSIK_C } from "./gymnasiumC";
import { GENERATORER_FYSIK_BA } from "./gymnasiumBA";

const ALLE: OpgaveGenerator[] = [
  ...GENERATORER_GRUNDSKOLE,
  ...GENERATORER_FYSIK_C,
  ...GENERATORER_FYSIK_BA,
];

export const OPGAVE_GENERATORER: Record<string, OpgaveGenerator> = Object.fromEntries(
  ALLE.map((gen) => [gen.id, gen])
);

/** Lav en opgave fra en generator-id. Returnerer null hvis id'et ikke findes. */
export function lavOpgave(generatorId: string): Opgave | null {
  const gen = OPGAVE_GENERATORER[generatorId];
  return gen ? gen.lav() : null;
}
