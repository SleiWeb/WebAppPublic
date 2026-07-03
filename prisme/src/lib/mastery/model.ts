/**
 * Mestringsestimat pr. knowledge component (doc 05 §5.9).
 * BKT-agtig opdatering: enkel, forklarlig, og let at forfine senere.
 * Fire synlige niveauer: 0 Ny · 1 Øvet · 2 Sikker · 3 Mester.
 */

export type MasteryState = {
  pKnown: number; // 0..1
  attempts: number;
};

export const MASTERY_LEVELS = ["Ny", "Øvet", "Sikker", "Mester"] as const;
export type MasteryLevel = 0 | 1 | 2 | 3;

// BKT-parametre (konservative startværdier)
const P_LEARN = 0.25; // sandsynlighed for at lære af et forsøg
const P_GUESS = 0.2; // sandsynlighed for at gætte rigtigt uden at kunne det
const P_SLIP = 0.1; // sandsynlighed for at fejle selvom man kan det
const P_FORGET_ON_REVIEW_FAIL = 0.15;

/**
 * Opdatér estimatet efter et forsøg. Hints brugt reducerer den evidens,
 * et korrekt svar giver (hints "koster" ikke — men de tælles med, doc 05 §5.7).
 */
export function updateMastery(
  state: MasteryState,
  outcome: { correct: boolean; hintsUsed: number }
): MasteryState {
  const p = state.pKnown;
  let posterior: number;

  if (outcome.correct) {
    // jo flere hints, jo mere ligner et korrekt svar et "guidet" svar
    const guess = Math.min(0.85, P_GUESS + 0.15 * outcome.hintsUsed);
    const num = p * (1 - P_SLIP);
    posterior = num / (num + (1 - p) * guess);
  } else {
    const num = p * P_SLIP;
    posterior = num / (num + (1 - p) * (1 - P_GUESS));
  }

  // læring sker også af selve forsøget (med feedback)
  const learned = posterior + (1 - posterior) * P_LEARN * (outcome.correct ? 1 : 0.5);
  return {
    pKnown: clamp01(learned),
    attempts: state.attempts + 1,
  };
}

/** Ved fejl i repetition falder estimatet — viden er ved at glemmes. */
export function decayOnReviewFail(state: MasteryState): MasteryState {
  return { ...state, pKnown: clamp01(state.pKnown * (1 - P_FORGET_ON_REVIEW_FAIL) - 0.1) };
}

export function levelFromEstimate(state: MasteryState): MasteryLevel {
  if (state.attempts === 0) return 0;
  if (state.pKnown >= 0.92 && state.attempts >= 3) return 3; // Mester
  if (state.pKnown >= 0.7) return 2; // Sikker
  if (state.pKnown >= 0.35 || state.attempts >= 1) return 1; // Øvet
  return 0;
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
