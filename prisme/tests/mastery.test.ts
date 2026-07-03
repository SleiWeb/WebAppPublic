import { describe, expect, it } from "vitest";
import {
  levelFromEstimate,
  updateMastery,
  decayOnReviewFail,
  type MasteryState,
} from "@/lib/mastery/model";
import {
  INITIAL_REVIEW,
  qualityOf,
  updateReview,
} from "@/lib/review/sm2";

describe("mestringsmodel (BKT-agtig)", () => {
  it("starter som Ny og stiger mod Mester ved korrekte svar", () => {
    let state: MasteryState = { pKnown: 0.1, attempts: 0 };
    expect(levelFromEstimate(state)).toBe(0);
    for (let i = 0; i < 6; i++)
      state = updateMastery(state, { correct: true, hintsUsed: 0 });
    expect(state.pKnown).toBeGreaterThan(0.92);
    expect(levelFromEstimate(state)).toBe(3);
  });

  it("forkerte svar sænker estimatet", () => {
    const before: MasteryState = { pKnown: 0.8, attempts: 5 };
    const after = updateMastery(before, { correct: false, hintsUsed: 0 });
    expect(after.pKnown).toBeLessThan(before.pKnown);
  });

  it("korrekt svar med mange hints giver mindre evidens end uden hints", () => {
    const base: MasteryState = { pKnown: 0.5, attempts: 2 };
    const noHints = updateMastery(base, { correct: true, hintsUsed: 0 });
    const withHints = updateMastery(base, { correct: true, hintsUsed: 3 });
    expect(withHints.pKnown).toBeLessThan(noHints.pKnown);
  });

  it("fejl i repetition får estimatet til at falde", () => {
    const before: MasteryState = { pKnown: 0.95, attempts: 8 };
    expect(decayOnReviewFail(before).pKnown).toBeLessThan(0.95);
  });
});

describe("adaptiv repetition (SM-2)", () => {
  it("rigtige svar forlænger intervallet: 1 → 3 → ~8 dage", () => {
    let s = INITIAL_REVIEW;
    s = updateReview(s, qualityOf(true, 0));
    expect(s.intervalDays).toBe(1);
    s = updateReview(s, qualityOf(true, 0));
    expect(s.intervalDays).toBe(3);
    s = updateReview(s, qualityOf(true, 0));
    expect(s.intervalDays).toBeGreaterThanOrEqual(7);
  });

  it("forkert svar nulstiller intervallet og sænker ease", () => {
    let s = INITIAL_REVIEW;
    s = updateReview(s, 5);
    s = updateReview(s, 5);
    s = updateReview(s, 5);
    const failed = updateReview(s, qualityOf(false, 2));
    expect(failed.intervalDays).toBe(1);
    expect(failed.reps).toBe(0);
    expect(failed.ease).toBeLessThan(s.ease);
  });

  it("hints trækker kvaliteten ned, men korrekt er aldrig under q=3", () => {
    expect(qualityOf(true, 0)).toBe(5);
    expect(qualityOf(true, 2)).toBe(3);
    expect(qualityOf(true, 4)).toBe(3);
    expect(qualityOf(false, 0)).toBeLessThan(3);
  });
});
