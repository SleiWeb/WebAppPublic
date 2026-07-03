import type { Opgave, TalOpgave, ValgOpgave } from "../model";

/** Tilfældigt heltal i [min, max] (begge inkl.). */
export function ri(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Tilfældigt element fra en liste. */
export function rv<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Afrund til et antal decimaler. */
export function afrund(x: number, dec: number): number {
  const f = Math.pow(10, dec);
  return Math.round(x * f) / f;
}

/** Dansk talformat: komma som decimaltegn. */
export function dk(x: number, dec?: number): string {
  const s = dec === undefined ? String(x) : x.toFixed(dec);
  return s.replace(".", ",");
}

export function talOpgave(o: {
  tekst: string;
  facit: number;
  enhed?: string;
  tolerancePct?: number;
  hint: string;
  loesning: string;
}): TalOpgave {
  return { svarType: "tal", ...o };
}

/** Multiple choice: det korrekte svar blandes ind mellem de forkerte. */
export function valgOpgave(o: {
  tekst: string;
  korrekt: string;
  forkerte: string[];
  hint: string;
  loesning: string;
}): ValgOpgave {
  const valg = [o.korrekt, ...o.forkerte];
  for (let i = valg.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [valg[i], valg[j]] = [valg[j], valg[i]];
  }
  return {
    svarType: "valg",
    tekst: o.tekst,
    valg,
    korrektValg: valg.indexOf(o.korrekt),
    hint: o.hint,
    loesning: o.loesning,
  };
}

export type { Opgave };
