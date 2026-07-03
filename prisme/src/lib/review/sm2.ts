/**
 * Adaptiv repetition (doc 05 §5.10): let SM-2-variant.
 * Rigtigt svar → længere interval; forkert → intervallet nulstilles.
 */

export type ReviewState = {
  intervalDays: number;
  ease: number;
  reps: number;
};

export const INITIAL_REVIEW: ReviewState = {
  intervalDays: 1,
  ease: 2.5,
  reps: 0,
};

/** Kvalitet 0..5 ud fra korrekthed og hints (SM-2's q-skala). */
export function qualityOf(correct: boolean, hintsUsed: number): number {
  if (!correct) return hintsUsed > 0 ? 1 : 2;
  return Math.max(3, 5 - hintsUsed);
}

export function updateReview(state: ReviewState, quality: number): ReviewState {
  if (quality < 3) {
    // glemt: start forfra, men behold (nedjusteret) ease
    return {
      intervalDays: 1,
      ease: Math.max(1.3, state.ease - 0.2),
      reps: 0,
    };
  }
  const ease = Math.max(
    1.3,
    state.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  const intervalDays =
    state.reps === 0 ? 1 : state.reps === 1 ? 3 : Math.round(state.intervalDays * ease);
  return { intervalDays, ease, reps: state.reps + 1 };
}

export function nextDueDate(state: ReviewState, from: Date = new Date()): Date {
  return new Date(from.getTime() + state.intervalDays * 24 * 60 * 60 * 1000);
}
