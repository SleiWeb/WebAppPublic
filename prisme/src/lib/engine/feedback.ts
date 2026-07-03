/**
 * Feedback-regler: betinget, målrettet feedback (doc 08 §8.4).
 * Første regel hvis betingelser alle matcher resultatet, vinder.
 */
import type { FeedbackRuleDef } from "../content/schema";
import type { ValidationResult } from "./types";

export function selectFeedback(
  rules: FeedbackRuleDef[],
  result: Pick<
    ValidationResult,
    "correct" | "closeness" | "misconceptionCode" | "missingUnit"
  >
): { feedbackMessage?: string; feedbackId?: string } {
  for (let i = 0; i < rules.length; i++) {
    const c = rules[i].condition;
    if (c.correct !== undefined && c.correct !== result.correct) continue;
    if (
      c.matchesMisconception !== undefined &&
      c.matchesMisconception !== result.misconceptionCode
    )
      continue;
    if (c.missingUnit !== undefined && c.missingUnit !== !!result.missingUnit)
      continue;
    if (c.closenessBelow !== undefined && !(result.closeness < c.closenessBelow))
      continue;
    if (c.closenessAbove !== undefined && !(result.closeness > c.closenessAbove))
      continue;
    // "closenessBelow"-regler skal ikke ramme korrekte svar
    if (c.correct === undefined && c.matchesMisconception === undefined && result.correct && c.closenessBelow !== undefined)
      continue;
    return { feedbackMessage: rules[i].message, feedbackId: String(i) };
  }
  return {};
}
