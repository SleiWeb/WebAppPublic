/**
 * Typede validatorer (doc 06 §6.8). Hver validator returnerer
 * { correct, closeness, misconceptionCode?, feedbackId? } — og et forkert
 * svar, der matcher en kendt distraktor, diagnosticeres med den tilhørende
 * misforståelses-kode, så feedbacken kan være målrettet i stedet for "forkert".
 */
import { expressionsEquivalent, math } from "./math";
import type {
  RenderedInstance,
  SubmittedAnswer,
  ValidationResult,
} from "./types";
import { selectFeedback } from "./feedback";

export function validateAnswer(
  instance: RenderedInstance,
  submitted: SubmittedAnswer
): ValidationResult {
  const base = rawValidate(instance, submitted);
  const feedback = selectFeedback(instance.feedbackRules, base);
  return { ...base, ...feedback };
}

function rawValidate(
  instance: RenderedInstance,
  submitted: SubmittedAnswer
): ValidationResult {
  const answer = instance.answer;
  switch (answer.validator) {
    case "numeric": {
      if (submitted.kind !== "numeric" && submitted.kind !== "expression")
        return { correct: false, closeness: 0 };
      const parsed = parseNumericInput(submitted.raw);
      if (parsed == null) return { correct: false, closeness: 0 };
      const { value, unit } = parsed;
      const missingUnit = answer.requireUnit && !unit;
      const unitMismatch =
        answer.unit && unit ? !unitsMatch(unit, answer.unit) : false;
      const tol = Math.max(answer.tolerance, 1e-9);
      const correct =
        Math.abs(value - answer.value) <= tol && !missingUnit && !unitMismatch;
      const closeness = closenessOf(value, answer.value);
      if (correct) return { correct, closeness: 1 };
      const misconceptionCode = matchNumericDistractor(instance, value, tol);
      return { correct, closeness, misconceptionCode, missingUnit };
    }

    case "expression": {
      if (submitted.kind !== "numeric" && submitted.kind !== "expression")
        return { correct: false, closeness: 0 };
      const raw = normalizeExpressionInput(submitted.raw);
      if (!raw) return { correct: false, closeness: 0 };
      const correct = expressionsEquivalent(raw, answer.value, answer.variables);
      if (correct) return { correct: true, closeness: 1 };
      // misforståelses-diagnose: matcher elevens udtryk en kendt distraktor?
      for (const d of instance.distractors) {
        const target = d.expr ?? (d.value != null ? String(d.value) : null);
        if (!target) continue;
        if (expressionsEquivalent(raw, target, answer.variables))
          return {
            correct: false,
            closeness: expressionCloseness(raw, answer.value, answer.variables),
            misconceptionCode: d.misconception,
          };
      }
      return {
        correct: false,
        closeness: expressionCloseness(raw, answer.value, answer.variables),
      };
    }

    case "mcq": {
      if (submitted.kind !== "mcq") return { correct: false, closeness: 0 };
      const chosen = answer.options.find((o) => o.id === submitted.optionId);
      if (!chosen) return { correct: false, closeness: 0 };
      return {
        correct: chosen.correct,
        closeness: chosen.correct ? 1 : 0,
        misconceptionCode: chosen.correct ? undefined : chosen.misconception,
      };
    }

    case "multi": {
      if (submitted.kind !== "multi") return { correct: false, closeness: 0 };
      const correctIds = new Set(
        answer.options.filter((o) => o.correct).map((o) => o.id)
      );
      const chosenIds = new Set(submitted.optionIds);
      const union = new Set([...correctIds, ...chosenIds]);
      const intersection = [...correctIds].filter((id) => chosenIds.has(id));
      const closeness = union.size === 0 ? 0 : intersection.length / union.size;
      const correct = closeness === 1;
      const firstWrong = answer.options.find(
        (o) => !o.correct && chosenIds.has(o.id) && o.misconception
      );
      return {
        correct,
        closeness,
        misconceptionCode: correct ? undefined : firstWrong?.misconception,
      };
    }

    case "point":
    case "graph": {
      if (submitted.kind !== "point") return { correct: false, closeness: 0 };
      const dist = Math.hypot(submitted.x - answer.x, submitted.y - answer.y);
      const correct = dist <= answer.tolerance;
      const closeness = Math.max(0, 1 - dist / (answer.tolerance * 4));
      return { correct, closeness: correct ? 1 : closeness };
    }
  }
}

/* ---------------------------------------------------------------- */

function matchNumericDistractor(
  instance: RenderedInstance,
  value: number,
  tolerance: number
): string | undefined {
  for (const d of instance.distractors) {
    if (d.value == null) continue;
    if (Math.abs(value - d.value) <= tolerance) return d.misconception;
  }
  return undefined;
}

function closenessOf(value: number, target: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, 1 - Math.abs(value - target) / Math.max(1, Math.abs(target)));
}

function expressionCloseness(
  expr: string,
  target: string,
  freeVars: string[]
): number {
  try {
    if (freeVars.length > 0) return 0; // strukturelt forkert udtryk
    const v = Number(math.evaluate(expr));
    const t = Number(math.evaluate(target));
    if (!Number.isFinite(v) || !Number.isFinite(t)) return 0;
    return closenessOf(v, t);
  } catch {
    return 0;
  }
}

/**
 * Parse elevens numeriske input: dansk decimalkomma ("3,5"), simple brøker
 * ("5/6") og en valgfri enhed bagefter ("3,5 m/s^2").
 */
export function parseNumericInput(
  raw: string
): { value: number; unit?: string } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const m = trimmed.match(
    /^(-?\d+(?:[.,]\d+)?(?:\s*\/\s*-?\d+(?:[.,]\d+)?)?)\s*(.*)$/
  );
  if (!m) return null;
  const numberPart = m[1].replace(/,/g, ".");
  const unitPart = m[2].trim() || undefined;
  try {
    const value = Number(math.evaluate(numberPart));
    if (!Number.isFinite(value)) return null;
    return { value, unit: unitPart };
  } catch {
    return null;
  }
}

function unitsMatch(a: string, b: string): boolean {
  const norm = (u: string) =>
    u.toLowerCase().replace(/\s+/g, "").replace(/\*\*/g, "^").replace(/²/g, "^2").replace(/³/g, "^3");
  return norm(a) === norm(b);
}

/** Dansk decimalkomma → punktum, uden at ødelægge fx "1,5x + 2". */
function normalizeExpressionInput(raw: string): string {
  return raw.trim().replace(/(\d),(\d)/g, "$1.$2");
}
