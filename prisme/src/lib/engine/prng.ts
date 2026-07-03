/**
 * Deterministisk PRNG til opgavegeneratoren (doc 06 §6.7):
 * (skabelon-id + seed) → samme instans, altid.
 */

/** xmur3-hash: streng → 32-bit seed */
export function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export type Rng = () => number;

/** mulberry32: hurtig, deterministisk PRNG med god fordeling */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFor(templateId: string, seed: number): Rng {
  return mulberry32(hashString(`${templateId}:${seed}`) || 1);
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pickOne<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Deterministisk Fisher-Yates */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Seed bindes til (elev, skabelon, forsøgsnummer) — reproducérbar retning
 * og snyd-resistens: naboer får ikke samme tal (doc 05 §5.5).
 */
export function seedFor(userId: string, templateId: string, attemptNo: number): number {
  return hashString(`${userId}|${templateId}|${attemptNo}`);
}
